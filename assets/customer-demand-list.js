(function () {
  'use strict';

  const ui = window.DemandUI;
  const state = {
    status: 'all',
    page: 1,
    pageSize: 20,
    selected: new Set(),
    rows: []
  };

  const customers = [
    '青岛绿洲园花生食品有限公司',
    '厦门象屿股份有限公司',
    '上海远洋供应链有限公司',
    '广州南沙国际物流有限公司',
    '宁波中远海运集装箱运输有限公司',
    '苏州工业园区华贸有限公司',
    '深圳市前海联合物流有限公司',
    '天津港保税区供应链有限公司'
  ];
  const contacts = ['王晓琳', '张启明', '陈思远', '林嘉怡', '周明轩', '赵宁'];
  const productNames = ['脱皮花生仁', '一级压榨花生油', '花生粕'];
  const productQuantities = [100, 24, 30];
  const businessTypes = ['出口', '进口', '内贸'];
  const serviceScopes = ['运输、仓储', '运输、报关清关', '仓储、报关清关', '运输、仓储、报关清关'];
  const transportTypes = ['水运', '汽运', '铁运'];
  const sourceSystems = ['股份控制塔'];
  const sourceTypes = ['原始需求'];
  const ourCompanies = ['厦门建发物流有限公司', '建发物流（上海）有限公司'];
  const statusPattern = [
    'pending', 'received', 'rejected', 'received', 'completed',
    'received', 'pending', 'received', 'pending', 'rejected', 'received',
    'completed', 'received', 'pending', 'received', 'completed',
    'pending', 'received', 'received', 'pending', 'received',
    'rejected', 'completed', 'pending'
  ];
  const progressPattern = ['partial', 'none', 'complete', 'none', 'over', 'complete', 'partial', 'none', 'over', 'partial', 'none', 'complete'];
  const statusMeta = {
    pending: { label: '待接收', tone: 'pending' },
    received: { label: '执行中', tone: 'running' },
    rejected: { label: '已拒绝', tone: 'rejected' },
    completed: { label: '已完成', tone: 'done' }
  };
  const progressMeta = {
    none: { label: '未生成', tone: 'closed' },
    partial: { label: '部分生成', tone: 'pending' },
    complete: { label: '已全部生成', tone: 'done' },
    over: { label: '已全部生成 · 超额', tone: 'exception' }
  };

  function makeRows() {
    return Array.from({ length: 24 }, (_, index) => {
      const status = statusPattern[index];
      let progress = status === 'received' || status === 'completed'
        ? progressPattern[index % progressPattern.length]
        : 'none';
      if (progress === 'none' && (status === 'received' || status === 'completed')) progress = 'partial';
      const customer = customers[index % customers.length];
      const versionNumber = status === 'completed' ? 2 : 1;
      const day = String(28 - (index % 6)).padStart(2, '0');
      const hour = String(9 + (index % 8)).padStart(2, '0');
      const minute = String((index * 7) % 60).padStart(2, '0');
      const statusChanged = status === 'received' || status === 'completed';
      const demandNo = 'XQ20261028' + String(31 + index).padStart(4, '0');
      const lineCount = 1 + (index % 3);
      const lineItems = Array.from({ length: lineCount }, (_, lineIndex) => ({
        id: demandNo + '-L' + (lineIndex + 1),
        name: productNames[lineIndex % productNames.length],
        qty: productQuantities[lineIndex % productQuantities.length],
        unit: '吨'
      }));
      return {
        demandNo,
        status,
        progress,
        version: 'V' + versionNumber,
        hasPendingVersion: false,
        customer,
        ourCompany: ourCompanies[index % ourCompanies.length],
        contact: contacts[index % contacts.length],
        sourceSystem: sourceSystems[index % sourceSystems.length],
        sourceType: sourceTypes[index % sourceTypes.length],
        sourceNo: 'LSR20261028' + String(18 + index).padStart(4, '0'),
        upstreamDemand: 'LD20261027' + String(92 + index).padStart(4, '0'),
        bizType: businessTypes[index % businessTypes.length],
        serviceScope: serviceScopes[index % serviceScopes.length],
        transportType: transportTypes[index % transportTypes.length],
        lineCount,
        lineItems,
        overLines: progress === 'over' ? 1 : 0,
        orderCount: progress === 'none' ? 0 : 1 + (index % 4),
        receivedAt: statusChanged ? '2026-10-' + day + ' ' + hour + ':' + minute : '--',
        updatedAt: status === 'completed' ? '2026-10-' + day + ' 17:' + minute : '2026-10-' + day + ' ' + hour + ':' + minute,
        createdDate: '2026-10-' + day
      };
    });
  }

  const body = document.getElementById('demandTableBody');
  const tableScroll = document.getElementById('demandTableHost');
  const queryBody = document.getElementById('queryBody');
  const queryForm = document.getElementById('demandQueryForm');
  const pageSizeSelect = document.getElementById('pageSizeSelect');
  const pagerPages = document.getElementById('pagerPages');
  const pagerSummary = document.getElementById('pagerSummary');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const relationDialog = document.getElementById('relationDialog');
  const resetQueryBtn = document.getElementById('resetQueryBtn');
  const submitQueryBtn = document.getElementById('submitQueryBtn');
  const moreQueryBtn = document.getElementById('moreQueryBtn');
  const queryToggle = document.getElementById('queryToggle');
  const createdFrom = document.getElementById('queryCreatedFrom');
  const createdTo = document.getElementById('queryCreatedTo');
  const topRefreshBtn = document.getElementById('topRefreshBtn');

  state.rows = makeRows();

  function statusClassForProgress(progress) {
    return progressMeta[progress] ? progressMeta[progress].tone : 'closed';
  }

  function getFilters() {
    return {
      demandNo: document.getElementById('queryDemandNo').value.trim().toLowerCase(),
      customer: document.getElementById('queryCustomer').value,
      sourceSystem: document.getElementById('querySourceSystem').value,
      sourceType: document.getElementById('querySourceType').value,
      sourceNo: document.getElementById('querySourceNo').value.trim().toLowerCase(),
      progress: document.getElementById('queryProgress').value,
      contact: document.getElementById('queryContact').value.trim().toLowerCase(),
      bizType: document.getElementById('queryBizType').value,
      serviceScope: document.getElementById('queryServiceScope').value,
      transportType: document.getElementById('queryTransportType').value,
      createdFrom: createdFrom.value,
      createdTo: createdTo.value
    };
  }

  function filteredRows() {
    const filters = getFilters();
    return state.rows.filter((row) => {
      if (state.status !== 'all' && row.status !== state.status) return false;
      if (filters.demandNo && !row.demandNo.toLowerCase().includes(filters.demandNo)) return false;
      if (filters.customer && row.customer !== filters.customer) return false;
      if (filters.sourceSystem && row.sourceSystem !== filters.sourceSystem) return false;
      if (filters.sourceType && row.sourceType !== filters.sourceType) return false;
      if (filters.sourceNo && !row.sourceNo.toLowerCase().includes(filters.sourceNo)) return false;
      if (filters.progress && row.progress !== filters.progress) return false;
      if (filters.contact && !row.contact.toLowerCase().includes(filters.contact)) return false;
      if (filters.bizType && row.bizType !== filters.bizType) return false;
      if (filters.serviceScope && !row.serviceScope.includes(filters.serviceScope)) return false;
      if (filters.transportType && row.transportType !== filters.transportType) return false;
      if (filters.createdFrom && row.createdDate < filters.createdFrom) return false;
      if (filters.createdTo && row.createdDate > filters.createdTo) return false;
      return true;
    });
  }

  function detailUrl(demandNo, status) {
    const params = new URLSearchParams({ no: demandNo, from: 'customer-demand-list-prototype.html', status });
    if (ui.embedded) params.set('embed', '1');
    return 'customer-demand-detail-v3-prototype.html?' + params.toString();
  }

  function renderStatusTabs() {
    document.querySelectorAll('.status-tab[data-status]').forEach((button) => {
      const key = button.dataset.status;
      const count = key === 'all' ? state.rows.length : state.rows.filter((row) => row.status === key).length;
      const label = key === 'all' ? '全部' : statusMeta[key].label;
      button.innerHTML = label + '(' + count + ')';
      button.classList.toggle('active', key === state.status);
      button.setAttribute('aria-selected', String(key === state.status));
    });
  }

  function updateSelectionUI() {
    document.querySelectorAll('[data-demand-no]').forEach((row) => {
      row.classList.toggle('is-selected', state.selected.has(row.dataset.demandNo));
    });
  }

  function renderRows() {
    const rows = filteredRows();
    const pageCount = Math.max(1, Math.ceil(rows.length / state.pageSize));
    if (state.page > pageCount) state.page = pageCount;
    const start = (state.page - 1) * state.pageSize;
    const pageRows = rows.slice(start, start + state.pageSize);

    body.innerHTML = pageRows.map((row) => {
      const status = statusMeta[row.status];
      const progress = progressMeta[row.progress];
      return '<tr data-demand-no="' + ui.escapeHtml(row.demandNo) + '" data-status="' + row.status + '" tabindex="0">' +
        '<td class="sticky-no"><a class="cell-link" href="' + detailUrl(row.demandNo, row.status) + '">' + ui.escapeHtml(row.demandNo) + '</a></td>' +
        '<td>' + ui.statusTag(status.label, status.tone) + '</td>' +
        '<td>' + ui.statusTag(progress.label, progress.tone) + '</td>' +
        '<td><span class="truncate-cell" title="' + ui.escapeHtml(row.customer) + '">' + ui.escapeHtml(row.customer) + '</span></td>' +
        '<td><span class="truncate-cell" title="' + ui.escapeHtml(row.ourCompany) + '">' + ui.escapeHtml(row.ourCompany) + '</span></td>' +
        '<td class="nowrap">' + ui.escapeHtml(row.sourceSystem) + '</td>' +
        '<td class="nowrap">' + ui.escapeHtml(row.sourceType) + '</td>' +
        '<td class="nowrap"><span class="cell-link">' + ui.escapeHtml(row.sourceNo) + '</span></td>' +
        '<td class="num">' + row.lineCount + '</td>' +
        '<td class="num">' + row.orderCount + '</td>' +
        '<td class="nowrap">' + ui.escapeHtml(row.contact) + '</td>' +
        '<td class="nowrap">' + ui.escapeHtml(row.receivedAt) + '</td>' +
        '<td class="nowrap">' + ui.escapeHtml(row.updatedAt) + '</td>' +
        '<td class="sticky-action"><a class="btn link" href="' + detailUrl(row.demandNo, row.status) + '">查看</a></td>' +
      '</tr>';
    }).join('');

    pagerSummary.textContent = rows.length === 0
      ? '共 0 条'
      : '共 ' + rows.length + ' 条 · 当前 ' + (start + 1) + '-' + Math.min(start + state.pageSize, rows.length) + ' 条';

    pagerPages.innerHTML = Array.from({ length: pageCount }, (_, index) => {
      const page = index + 1;
      return '<button type="button" class="' + (page === state.page ? 'active' : '') + '" data-page="' + page + '" aria-label="第 ' + page + ' 页" aria-current="' + (page === state.page ? 'page' : 'false') + '">' + page + '</button>';
    }).join('');

    prevPageBtn.disabled = state.page <= 1;
    nextPageBtn.disabled = state.page >= pageCount;
    pageSizeSelect.value = String(state.pageSize);

    updateSelectionUI();

    if (rows.length === 0) {
      if (window.UIState) {
        UIState.setTableState(tableScroll, {
          state: 'empty',
          preserveHeader: true,
          title: '未找到匹配的客户需求',
          message: '请调整查询条件，或重置后查看全部客户需求。',
          actionLabel: '重置查询',
          onAction: resetQuery
        });
      }
    } else if (window.UIState && tableScroll.getAttribute('aria-busy') !== 'true') {
      UIState.clearTableState(tableScroll);
    }

    renderStatusTabs();
  }

  function validateDateRange() {
    if (!createdFrom.value || !createdTo.value || createdFrom.value <= createdTo.value) {
      if (createdTo.getAttribute('aria-invalid') === 'true') UIState.clearFieldState(createdTo);
      return true;
    }
    UIState.setFieldState(createdTo, 'invalid', '结束日期不能早于开始日期');
    createdTo.focus();
    return false;
  }

  async function runQuery() {
    if (!validateDateRange()) return;
    if (!window.UIState) {
      renderRows();
      return;
    }
    UIState.setButtonLoading(submitQueryBtn, true, '查询中');
    UIState.setTableState(tableScroll, {
      state: 'loading',
      preserveHeader: true,
      title: '正在查询客户需求…',
      message: '正在应用筛选条件，请稍候。',
      rows: 6
    });
    await ui.delay(320);
    state.page = 1;
    UIState.clearTableState(tableScroll);
    renderRows();
    UIState.setButtonLoading(submitQueryBtn, false);
    ui.showToast('查询完成');
  }

  function resetQuery() {
    queryForm.reset();
    state.status = 'all';
    state.page = 1;
    state.selected.clear();
    if (window.UIState) {
      queryForm.querySelectorAll('input, select').forEach((control) => UIState.clearFieldState(control));
      UIState.clearTableState(tableScroll);
    }
    renderRows();
    ui.showToast('查询条件已重置');
  }

  function setExtendedVisible(visible) {
    queryBody.querySelectorAll('.extended-filter').forEach((field) => {
      field.hidden = !visible;
    });
    moreQueryBtn.textContent = visible ? '收起' : '查看更多';
    moreQueryBtn.setAttribute('aria-expanded', String(visible));
  }

  function nextDemandNo() {
    const max = state.rows.reduce((value, row) => Math.max(value, Number(row.demandNo.slice(-4)) || 0), 0);
    return 'XQ20261028' + String(max + 1).padStart(4, '0');
  }

  function nowStamp() {
    const date = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes());
  }

  function selectedRows() {
    return state.rows.filter((row) => state.selected.has(row.demandNo));
  }

  function openRelationInfo(title, message) {
    relationDialog.innerHTML = '<form id="relationForm" novalidate><div class="demand-dialog-head"><h2 id="relationDialogTitle">' + ui.escapeHtml(title) + '</h2><button class="demand-dialog-close" type="button" data-relation-close aria-label="关闭"><svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><div class="demand-dialog-body"><p class="demand-dialog-copy">' + ui.escapeHtml(message) + '</p></div><div class="demand-dialog-footer"><button class="btn primary" type="submit">知道了</button></div></form>';
    relationDialog.querySelector('[data-relation-close]').addEventListener('click', () => ui.closeDialog(relationDialog));
    relationDialog.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      ui.closeDialog(relationDialog);
    });
    ui.openDialog(relationDialog);
  }

  function openRelationForm(options) {
    relationDialog.innerHTML = '<form id="relationForm" novalidate>' +
      '<div class="demand-dialog-head"><h2 id="relationDialogTitle">' + ui.escapeHtml(options.title) + '</h2><button class="demand-dialog-close" type="button" data-relation-close aria-label="关闭"><svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>' +
      '<div class="demand-dialog-body">' + options.body + '</div>' +
      '<div class="demand-dialog-footer"><button class="btn" type="button" data-relation-close>取消</button><button class="btn ' + (options.confirmClass || 'primary') + '" type="submit" id="relationSubmitBtn">' + ui.escapeHtml(options.confirmText) + '</button></div>' +
      '</form>';
    const form = document.getElementById('relationForm');
    const submitBtn = document.getElementById('relationSubmitBtn');
    relationDialog.querySelectorAll('[data-relation-close]').forEach((button) => {
      button.addEventListener('click', () => ui.closeDialog(relationDialog));
    });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (options.onSubmit && await options.onSubmit({ form, submitBtn }) === false) return;
      ui.closeDialog(relationDialog);
    });
    ui.openDialog(relationDialog);
  }

  function openMergeDialog(rows) {
    const customerNames = [...new Set(rows.map((row) => row.customer))];
    if (customerNames.length > 1) {
      openRelationInfo('暂不能合并', '所选客户需求属于不同客户。请选择同一客户的需求后再合并。');
      return;
    }
    if (rows.some((row) => !['created', 'pending', 'rejected'].includes(row.status))) {
      openRelationInfo('暂不能合并', '已接收或已完成的需求已经进入履约链路，不能直接合并。请只选择创建、待接收或已驳回状态的需求。');
      return;
    }
    const body = '<p class="demand-dialog-copy">将所选 ' + rows.length + ' 条客户需求合并为一条创建状态需求。原需求单号将不再在列表中展示。</p>' +
      '<div class="demand-data-table-wrap"><table class="demand-compare-table"><thead><tr><th>客户需求单号</th><th>当前状态</th><th>需求行数</th></tr></thead><tbody>' +
      rows.map((row) => '<tr><td>' + ui.escapeHtml(row.demandNo) + '</td><td>' + statusMeta[row.status].label + '</td><td>' + row.lineCount + '</td></tr>').join('') +
      '</tbody></table></div><div class="demand-dialog-grid" style="margin-top:12px"><div class="demand-dialog-field field span-2"><label for="mergeReason">合并原因<span class="required">*</span></label><textarea id="mergeReason" name="reason" required placeholder="请填写合并原因"></textarea><div class="ui-field-message"></div></div></div>';
    openRelationForm({
      title: '合并客户需求',
      body,
      confirmText: '确认合并',
      onSubmit: async ({ form, submitBtn }) => {
        const reason = form.elements.reason;
        if (!reason.value.trim()) {
          UIState.setFieldState(reason, 'invalid', '请填写合并原因');
          reason.focus();
          return false;
        }
        UIState.setButtonLoading(submitBtn, true, '合并中');
        await ui.delay(320);
        const first = rows[0];
        const lineItems = rows.flatMap((row) => row.lineItems || []);
        const newRow = {
          demandNo: nextDemandNo(), status: 'created', progress: 'none', version: 'V1', hasPendingVersion: false,
          customer: first.customer, contact: first.contact, serviceReq: '--', upstreamDemand: '--',
          bizType: first.bizType, serviceScope: first.serviceScope, transportType: first.transportType, sourceSystem: '手工创建',
          lineCount: lineItems.length, lineItems, overLines: 0, orderCount: 0, receivedAt: '--', updatedAt: nowStamp(), createdDate: nowStamp().slice(0, 10)
        };
        const selectedNos = new Set(rows.map((row) => row.demandNo));
        state.rows = state.rows.filter((row) => !selectedNos.has(row.demandNo));
        state.rows.unshift(newRow);
        state.selected.clear();
        state.page = 1;
        renderRows();
        ui.showToast('已合并为 ' + newRow.demandNo, 'success');
      }
    });
  }

  function openSplitDialog(row) {
    if (!['created', 'pending', 'rejected'].includes(row.status)) {
      openRelationInfo('暂不能拆分', '已接收或已完成的需求已经进入履约链路，不能直接拆分。请只选择创建、待接收或已驳回状态的需求。');
      return;
    }
    const lines = row.lineItems || [];
    if (lines.length < 2) {
      openRelationInfo('暂不能拆分', '当前客户需求仅有一条商品行，无法继续拆分。');
      return;
    }
    const body = '<p class="demand-dialog-copy">选择需要拆出的商品行。拆分后将生成一条新的创建状态需求，原需求保留其余商品行。</p>' +
      '<div class="demand-data-table-wrap"><table class="demand-compare-table"><thead><tr><th>选择</th><th>商品名称</th><th>需求数量</th><th>拆出后归属</th></tr></thead><tbody>' +
      lines.map((line, index) => '<tr><td><input type="checkbox" class="split-line-check" data-index="' + index + '" aria-label="拆分 ' + ui.escapeHtml(line.name) + '"></td><td>' + ui.escapeHtml(line.name) + '</td><td>' + line.qty + ' ' + line.unit + '</td><td>新客户需求</td></tr>').join('') +
      '</tbody></table></div><div class="demand-dialog-grid" style="margin-top:12px"><div class="demand-dialog-field field span-2"><label for="splitReason">拆分原因<span class="required">*</span></label><textarea id="splitReason" name="reason" required placeholder="请填写拆分原因"></textarea><div class="ui-field-message"></div></div></div><div class="demand-dialog-note" id="splitError" hidden></div>';
    openRelationForm({
      title: '拆分客户需求',
      body,
      confirmText: '确认拆分',
      onSubmit: async ({ form, submitBtn }) => {
        const reason = form.elements.reason;
        const checks = Array.from(form.querySelectorAll('.split-line-check')).filter((checkbox) => checkbox.checked);
        const error = document.getElementById('splitError');
        if (!reason.value.trim()) {
          UIState.setFieldState(reason, 'invalid', '请填写拆分原因');
          reason.focus();
          return false;
        }
        if (checks.length === 0 || checks.length === lines.length) {
          error.hidden = false;
          error.className = 'demand-dialog-note is-error';
          error.textContent = checks.length === 0 ? '请至少选择一条需要拆出的商品行。' : '至少保留一条商品行在原需求中，不能全部拆出。';
          return false;
        }
        UIState.setButtonLoading(submitBtn, true, '拆分中');
        await ui.delay(320);
        const selectedIndexes = new Set(checks.map((checkbox) => Number(checkbox.dataset.index)));
        const splitItems = lines.filter((line, index) => selectedIndexes.has(index));
        const remainItems = lines.filter((line, index) => !selectedIndexes.has(index));
        const newRow = {
          ...row,
          demandNo: nextDemandNo(), status: 'created', progress: 'none', version: 'V1', hasPendingVersion: false,
          serviceReq: '--', upstreamDemand: '--', sourceSystem: '手工创建',
          lineCount: splitItems.length, lineItems: splitItems, overLines: 0, orderCount: 0, receivedAt: '--', updatedAt: nowStamp(), createdDate: nowStamp().slice(0, 10)
        };
        row.lineItems = remainItems;
        row.lineCount = remainItems.length;
        row.updatedAt = nowStamp();
        state.rows.unshift(newRow);
        state.selected.clear();
        state.page = 1;
        renderRows();
        ui.showToast('已拆分为 ' + newRow.demandNo, 'success');
      }
    });
  }

  function openRelationAction() {
    const rows = selectedRows();
    if (rows.length === 0) return;
    if (rows.length === 1) openSplitDialog(rows[0]);
    else openMergeDialog(rows);
  }

  moreQueryBtn.addEventListener('click', () => {
    setExtendedVisible(moreQueryBtn.getAttribute('aria-expanded') !== 'true');
  });
  queryToggle.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      queryToggle.click();
    }
  });
  submitQueryBtn.addEventListener('click', runQuery);
  resetQueryBtn.addEventListener('click', resetQuery);
  queryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    runQuery();
  });
  queryForm.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
      event.preventDefault();
      runQuery();
    }
  });
  queryForm.addEventListener('input', (event) => {
    if (event.target === createdTo && createdTo.getAttribute('aria-invalid') === 'true' && window.UIState) {
      UIState.clearFieldState(createdTo);
    }
  });

  document.querySelectorAll('.status-tab[data-status]').forEach((button) => {
    button.addEventListener('click', () => {
      state.status = button.dataset.status;
      state.page = 1;
      state.selected.clear();
      renderRows();
    });
  });

  pagerPages.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-page]');
    if (!button) return;
    state.page = Number(button.dataset.page);
    renderRows();
  });
  prevPageBtn.addEventListener('click', () => {
    if (state.page <= 1) return;
    state.page -= 1;
    renderRows();
  });
  nextPageBtn.addEventListener('click', () => {
    const count = Math.ceil(filteredRows().length / state.pageSize);
    if (state.page >= count) return;
    state.page += 1;
    renderRows();
  });
  pageSizeSelect.addEventListener('change', () => {
    state.pageSize = Number(pageSizeSelect.value);
    state.page = 1;
    state.selected.clear();
    renderRows();
  });
  const addDemandBtn = document.getElementById('addDemandBtn');
  if (addDemandBtn) {
    addDemandBtn.addEventListener('click', () => {
      const params = new URLSearchParams({ from: 'customer-demand-list-prototype.html', mode: 'new', status: 'created' });
      if (ui.embedded) params.set('embed', '1');
      window.location.href = 'customer-demand-detail-v3-prototype.html?' + params.toString();
    });
  }

  body.addEventListener('dblclick', (event) => {
    if (event.target.closest('a, button, input, label')) return;
    const row = event.target.closest('tr[data-demand-no]');
    if (row) window.location.href = detailUrl(row.dataset.demandNo, row.dataset.status);
  });
  body.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || event.target.closest('a, button, input')) return;
    const row = event.target.closest('tr[data-demand-no]');
    if (row) window.location.href = detailUrl(row.dataset.demandNo, row.dataset.status);
  });

  topRefreshBtn.addEventListener('click', runQuery);
  document.getElementById('topExternalLink').addEventListener('click', (event) => {
    if (!ui.embedded) return;
    event.preventDefault();
    window.open(window.location.href.replace(/[?&]embed=1/, ''), '_blank', 'noopener');
  });

  window.addEventListener('offline', () => {
    if (window.UIState) {
      UIState.setTableState(tableScroll, {
        state: 'offline',
        preserveHeader: true,
        title: '网络连接已断开',
        message: '列表暂时无法刷新，恢复网络后可重新查询。',
        actionLabel: '重新查询',
        onAction: runQuery
      });
    }
  });
  window.addEventListener('online', () => {
    ui.showToast('网络已恢复', 'success');
    renderRows();
  });

  setExtendedVisible(false);
  renderRows();
  ui.notifyParent('customer-demand-list', 'list');
})();
