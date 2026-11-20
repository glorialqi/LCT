/* Static role simulation and DOM permission gate.
   Default "operator" preserves the existing prototype behavior. */
(function () {
  'use strict';

  const ROLE_KEY = 'ct:prototypeRole';
  const VALID_ROLES = ['operator', 'auditor', 'viewer', 'expired', 'admin'];
  const ROLE_META = {
    admin: { label: '系统管理员', notice: '' },
    operator: { label: '业务运营', notice: '' },
    auditor: { label: '审核角色', notice: '审核角色仅可查看业务数据，不能编辑、提交或发起业务操作。' },
    viewer: { label: '只读访客', notice: '当前角色仅可查看业务数据，新增、编辑、提交和发起操作均已禁用。' },
    expired: { label: '登录已失效', notice: '登录状态已失效，当前页面以只读方式展示。请重新登录后继续操作。' }
  };
  const PERMISSIONS = {
    admin: ['*'],
    operator: [
      'customerOrders.view', 'customerOrders.create', 'customerOrders.edit', 'customerOrders.submit',
      'logistics.view', 'logistics.create', 'logistics.edit', 'logistics.execute',
      'trade.view', 'trade.pull', 'trade.generate'
    ],
    auditor: [
      'customerOrders.view', 'customerOrders.approve',
      'logistics.view', 'trade.view', 'trade.approve'
    ],
    viewer: ['customerOrders.view', 'logistics.view', 'trade.view'],
    expired: []
  };

  function resolveRole() {
    const queryRole = new URLSearchParams(window.location.search).get('role');
    if (VALID_ROLES.includes(queryRole)) {
      try { sessionStorage.setItem(ROLE_KEY, queryRole); } catch (_error) {}
      return queryRole;
    }
    try {
      const saved = sessionStorage.getItem(ROLE_KEY);
      if (VALID_ROLES.includes(saved)) return saved;
    } catch (_error) {}
    return 'operator';
  }

  const role = resolveRole();
  const permissions = PERMISSIONS[role] || [];
  const can = (permission) => permissions.includes('*') || permissions.includes(permission);
  const roleMeta = ROLE_META[role] || ROLE_META.viewer;

  function deniedMessage(action) {
    if (role === 'expired') return '登录状态已失效，请重新登录后操作。';
    return roleMeta.label + '无“' + action + '”权限。';
  }

  function deny(action) {
    const message = deniedMessage(action);
    if (typeof window.showToast === 'function') {
      window.showToast(message, 'danger');
      return false;
    }
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      window.clearTimeout(window.__prototypeAccessToastTimer);
      window.__prototypeAccessToastTimer = window.setTimeout(() => toast.classList.remove('show'), 1800);
    }
    return false;
  }

  function disableControl(control, permission, actionLabel) {
    if (!control || control.dataset.accessDenied === 'true') return;
    control.dataset.accessDenied = 'true';
    control.dataset.accessPermission = permission;
    control.disabled = true;
    control.setAttribute('aria-disabled', 'true');
    control.title = deniedMessage(actionLabel);
  }

  function disableText(patterns, permission, actionLabel) {
    const matcher = new RegExp(patterns.join('|'));
    document.querySelectorAll('button, a[role="button"]').forEach((control) => {
      const text = (control.innerText || control.textContent || '').replace(/\s+/g, ' ').trim();
      if (text && matcher.test(text)) disableControl(control, permission, actionLabel);
    });
  }

  function setReadOnlyForm() {
    const scope = document.getElementById('orderDetailForm');
    if (!scope) return;
    scope.querySelectorAll('input, select, textarea').forEach((control) => {
      if (control.type === 'checkbox' || control.type === 'radio') {
        control.disabled = true;
      } else if (control.tagName === 'SELECT') {
        control.disabled = true;
      } else {
        control.readOnly = true;
      }
      control.setAttribute('aria-readonly', 'true');
      const field = control.closest('.field, .ui-field');
      if (field) field.classList.add('is-readonly');
    });
  }

  function applyCustomerOrderList() {
    if (!can('customerOrders.create')) disableText(['新增订单'], 'customerOrders.create', '新增订单');
    if (!can('customerOrders.edit')) {
      disableText(['合并/拆分订单', '取消订单', '复制订单', '完结订单', '取消完结', '查看物流安排'], 'customerOrders.edit', '编辑客户订单');
    }
  }

  function applyCustomerOrderDetail() {
    if (!can('customerOrders.edit')) {
      setReadOnlyForm();
      ['saveDraftBtn'].forEach((id) => disableControl(document.getElementById(id), 'customerOrders.edit', '保存订单'));
      ['submitOrderBtn', 'submitFlowBtn'].forEach((id) => disableControl(document.getElementById(id), 'customerOrders.submit', '提交订单'));
    }
  }

  function applyLogisticsList() {
    if (!can('logistics.create')) {
      disableText(['新增需求', '创建需求', '发起物流安排', '继续编辑'], 'logistics.create', '创建物流需求');
    }
  }

  function applyLogisticsDetail() {
    if (!can('logistics.edit')) {
      disableText(['修改OP', '维护执行侧应收', '维护执行侧应付', '新建单据'], 'logistics.edit', '编辑物流需求');
    }
    if (!can('logistics.execute')) {
      disableText(['完结', '发起对账', '审批进度', '生成物流需求'], 'logistics.execute', '执行物流需求');
    }
  }

  function applyTradeContract() {
    if (!can('trade.pull')) {
      disableText(['手动拉入', '人工分配', '删除', '完结', '取消完结', '确认拉入工作台'], 'trade.pull', '维护贸易合同待办');
    }
    if (!can('trade.generate')) {
      disableText(['生成物流需求'], 'trade.generate', '生成物流需求');
      disableControl(document.getElementById('confirmDemandButton'), 'trade.generate', '生成物流需求');
    }
  }

  function applyPageRules() {
    document.documentElement.dataset.prototypeRole = role;
    document.body.dataset.prototypeRole = role;
    const file = window.location.pathname.split('/').pop();
    if (file === 'customer-order-list-prototype.html') applyCustomerOrderList();
    if (file === 'customer-order-detail-prototype.html') applyCustomerOrderDetail();
    if (file === 'logistics-demand-list-prototype.html') applyLogisticsList();
    if (file === 'logistics-demand-detail-prototype.html') applyLogisticsDetail();
    if (file === 'trade-contract-todo.html') applyTradeContract();
    ensureNotice();
  }

  function ensureNotice() {
    if (!roleMeta.notice) return;
    let notice = document.getElementById('prototypeAccessNotice');
    if (!notice) {
      notice = document.createElement('div');
      notice.id = 'prototypeAccessNotice';
      notice.className = 'prototype-access-notice';
      notice.setAttribute('role', 'status');
      notice.dataset.accessRole = role;
      const target = document.querySelector('.detail-scroll, #main, .ct-main, main, .main') || document.body;
      target.prepend(notice);
    }
    const noticeText = roleMeta.label + '：' + roleMeta.notice;
    if (notice.textContent !== noticeText) notice.textContent = noticeText;
  }

  function injectStyles() {
    if (document.getElementById('prototypeAccessStyles')) return;
    const style = document.createElement('style');
    style.id = 'prototypeAccessStyles';
    style.textContent = `
      .prototype-access-notice { margin:0 0 10px; padding:9px 12px; border:1px solid #fde68a; border-radius:6px; background:#fffbeb; color:#92400e; font-size:12px; line-height:1.55; }
      [data-access-denied="true"] { opacity:.52; cursor:not-allowed !important; }
      .is-readonly :is(input,select,textarea) { background:#f8fafc !important; color:#64748b !important; }
    `;
    document.head.appendChild(style);
  }

  function scheduleApply() {
    window.clearTimeout(window.__prototypeAccessTimer);
    window.__prototypeAccessTimer = window.setTimeout(() => {
      try { applyPageRules(); } catch (error) { console.warn('Prototype access apply failed', error); }
    }, 20);
  }

  const FAILURE_PREFIX = 'ct:failNext:';

  function failNext(action, mode = 'timeout') {
    try { sessionStorage.setItem(FAILURE_PREFIX + action, mode); return true; } catch (_error) { return false; }
  }

  function consumeFailure(action) {
    const key = FAILURE_PREFIX + action;
    try {
      const mode = sessionStorage.getItem(key);
      if (mode) sessionStorage.removeItem(key);
      return mode || '';
    } catch (_error) {
      return '';
    }
  }

  function setRole(nextRole, reload = true) {
    if (!VALID_ROLES.includes(nextRole)) return false;
    try { sessionStorage.setItem(ROLE_KEY, nextRole); } catch (_error) {}
    const url = new URL(window.location.href);
    url.searchParams.set('role', nextRole);
    if (reload) window.location.href = url.href;
    return true;
  }

  window.PrototypeRuntime = { failNext, consumeFailure };
  window.PrototypeAccess = { role, can, deny, apply: applyPageRules, setRole, permissions, label: roleMeta.label };
  injectStyles();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleApply);
  else scheduleApply();
  window.addEventListener('pageshow', scheduleApply);
  new MutationObserver(scheduleApply).observe(document.documentElement, { childList: true, subtree: true });
})();



