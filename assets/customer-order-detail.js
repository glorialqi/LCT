/* Hydrate the customer-order detail page from the record selected in the list
   or tracking page. Keeps the prototype static while making cross-page values
   and refresh recovery deterministic. */
(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const orderNo = params.get('no');
  const data = window.PrototypeData;
  if (!orderNo || !data) return;

  const sourceRecord = data.resolveCustomerOrder(orderNo);
  if (!sourceRecord) return;
  const statusOverride = params.get('status');
  const record = { ...sourceRecord, status: statusOverride || sourceRecord.status };

  const scope = document.getElementById('orderDetailForm');
  if (!scope) return;
  const dirtyIndicator = document.getElementById('detailDirtyIndicator');
  const chips = document.getElementById('consignmentChips');
  const chipCount = document.getElementById('consignmentCount');
  const consignmentInput = document.getElementById('customerOrderNoInput');
  let draftSaveTimer = null;

  const controls = () => Array.from(scope.querySelectorAll('input, select, textarea'));
  const controlByLabel = (label) => controls().find((control) => control.getAttribute('aria-label') === label);

  function setControl(label, value) {
    if (value === undefined || value === null) return;
    const control = controlByLabel(label);
    if (!control) return;
    if (control.tagName === 'SELECT') {
      const option = Array.from(control.options).find((item) => item.value === String(value) || item.textContent.trim() === String(value));
      if (option) control.value = option.value;
    } else {
      control.value = String(value);
    }
  }

  function setTitle(title) {
    const titleNode = document.querySelector('.page-title');
    if (titleNode) {
      const textNode = Array.from(titleNode.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
      if (textNode) textNode.nodeValue = title + ' ';
      else titleNode.insertBefore(document.createTextNode(title + ' '), titleNode.firstChild);
    }
    const breadcrumb = document.querySelector('.breadcrumb strong');
    if (breadcrumb) breadcrumb.textContent = title;
    const srTitle = document.querySelector('h1.sr-only');
    if (srTitle) srTitle.textContent = title;
    document.title = title + ' - OMS原型';
  }

  function normalizeScope(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    return String(value || '').split(/[、,，\s]+/).map((item) => item.trim()).filter(Boolean);
  }

  function renderConsignments(values) {
    const list = Array.isArray(values) ? values.filter(Boolean) : [];
    if (consignmentInput) {
      consignmentInput.value = list[0] || '';
      return;
    }
    if (!chips) return;
    chips.innerHTML = list.map((value) => `
      <span class="consignment-chip" data-value="${String(value).replace(/[&<>"']/g, '')}">
        <span title="${String(value)}">${String(value)}</span>
        <button class="chip-remove" type="button" aria-label="删除客户单号 ${String(value)}">×</button>
      </span>`).join('');
    if (chipCount) chipCount.textContent = list.length + ' 个';
  }

  function renderServiceScope(values) {
    const host = document.querySelector('.multi-control[aria-label="服务范围"]');
    if (!host) return;
    const addButton = host.querySelector('.multi-add');
    host.querySelectorAll('.mini-tag').forEach((node) => node.remove());
    normalizeScope(values).forEach((value) => {
      const tag = document.createElement('span');
      tag.className = 'mini-tag';
      tag.textContent = value;
      host.insertBefore(tag, addButton);
    });
    if (addButton) addButton.dataset.toast = '已选服务范围：' + normalizeScope(values).join('、');
  }

  function fallbackContract() {
    const digits = record.no.replace(/\D/g, '').slice(-10);
    return {
      no: '—',
      version: '—',
      status: '未生成',
      signMethod: 'E建签签约',
      templateType: '我司范本',
      esignUrl: '',
      principalName: record.contact || record.sales || '—',
      principalPhone: record.phone || '—',
      principalAddress: '中国厦门市环岛东路1699号建发国际大厦27楼',
      principalEmail: record.email || '—',
      counterpartyName: record.contact || '—',
      counterpartyPhone: record.phone || '—',
      counterpartyAddress: record.address || '—',
      counterpartyEmail: record.email || '—'
    };
  }

  function normalizeContractStatusForOrder(orderStatus, value) {
    const contractStatuses = ['未生成', '创建', '待审', '待签约', '签约中', '已生效'];
    const normalized = contractStatuses.includes(value) ? value : '';
    return normalized || '未生成';
  }

  const contract = { ...fallbackContract(), ...(record.contract || {}) };
  contract.status = normalizeContractStatusForOrder(record.status, contract.status);
  contract.originalAttached = contract.status === '已生效';
  const profit = {
    estimatedRevenue: '¥--',
    estimatedCost: '¥--',
    estimatedGross: '¥--',
    margin: '--',
    ...(record.profit || {})
  };

  function renderProfit() {
    document.querySelectorAll('[data-profit-field]').forEach((node) => {
      const key = node.dataset.profitField;
      if (key === 'marginText') node.textContent = profit.margin || '--';
      else node.textContent = profit[key] || '¥--';
    });
    const meter = document.querySelector('.profit-meter-track span');
    if (meter) meter.style.width = /^\d+(\.\d+)?%$/.test(profit.margin) ? profit.margin : '0%';
  }

  function setContractStatus(value) {
    contract.status = value;
    contract.originalAttached = value === '已生效';
    document.querySelectorAll('[data-contract-field="status"], [data-contract-preview="status"]').forEach((node) => {
      if ('value' in node) node.value = value;
      else node.textContent = value;
    });
    syncStatusActions();
  }

  function renderContract() {
    document.querySelectorAll('[data-contract-field]').forEach((field) => {
      const rawValue = contract[field.dataset.contractField];
      const value = field.dataset.contractField === 'status' && rawValue === '' ? '' : (rawValue || '—');
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.value = value;
      else field.textContent = value;
      field.title = value;
    });
    document.querySelectorAll('[data-contract-preview]').forEach((node) => {
      const key = node.dataset.contractPreview;
      if (key === 'no') node.textContent = `${contract.no || '—'} · ${contract.version || '—'}`;
      else if (key === 'status' && contract.status === '') node.textContent = '';
      else node.textContent = contract[key] || '—';
    });
  }

  function deriveArrangementStatus() {
    if (!['待履约', '履约中', '已完结'].includes(record.status) || record.orderConfirmationStatus !== '已确认') return '';
    const totalQuantity = Number(record.orderGoodsQuantity);
    const generatedQuantity = Number(record.generatedLogisticsDemandQuantity);
    if (!Number.isFinite(totalQuantity) || totalQuantity <= 0 || !Number.isFinite(generatedQuantity)) return '';
    if (generatedQuantity <= 0) return '待安排';
    if (generatedQuantity < totalQuantity) return '部分安排';
    return '已安排';
  }

  function syncArrangementStatus() {
    const value = deriveArrangementStatus();
    record.arrangementStatus = value;
    const field = document.querySelector('[data-order-arrangement-status-field]');
    if (field) {
      field.textContent = value;
      field.dataset.status = value;
    }
  }

  const readonlyOriginalState = new WeakMap();

  function applyOrderReadonlyMode(status) {
    const orderInfo = document.getElementById('orderInfoView');
    if (!orderInfo) return;
    const readonly = Boolean(status) && !['创建', '驳回'].includes(status);
    document.body.dataset.orderReadonly = readonly ? 'true' : 'false';
    orderInfo.querySelectorAll('input, select, textarea').forEach((control) => {
      if (control.type === 'hidden') return;
      if (!readonlyOriginalState.has(control)) {
        readonlyOriginalState.set(control, { readOnly: control.readOnly, disabled: control.disabled });
      }
      const original = readonlyOriginalState.get(control);
      if (readonly) {
        control.readOnly = true;
        if (control.tagName === 'SELECT' || ['checkbox', 'radio', 'file'].includes(control.type)) control.disabled = true;
        control.setAttribute('aria-readonly', 'true');
      } else {
        control.readOnly = original.readOnly;
        control.disabled = original.disabled;
        control.removeAttribute('aria-readonly');
      }
    });
  }

  function syncStatusActions() {
    syncArrangementStatus();
    const status = record.status || '';
    const pill = document.querySelector('[data-order-status-pill]');
    if (pill) {
      pill.textContent = status || '—';
      pill.dataset.status = status;
    }
    document.body.dataset.orderStatus = status;
    document.body.dataset.contractStatus = contract.status || '';
    applyOrderReadonlyMode(status);
    const orderInfoReadonlyHost = document.getElementById('orderInfoView');
  if (orderInfoReadonlyHost) {
    new MutationObserver(() => applyOrderReadonlyMode(document.getElementById('orderStatusField')?.textContent.trim() || record.status || ''))
      .observe(orderInfoReadonlyHost, { childList: true, subtree: true });
  }
  const contractOverview = document.getElementById('orderContractOverviewStatus');
    if (contractOverview) {
      contractOverview.textContent = contract.status || '未生成';
      contractOverview.dataset.status = contract.status || '未生成';
    }
    window.syncOrderDocumentActions?.();
  }

  function setOrderStatus(nextStatus) {
    record.status = nextStatus;
    syncStatusActions();
  }

  function setConfirmationStatus(nextStatus) {
    const normalized = ['', '待确认', '已确认'].includes(nextStatus) ? nextStatus : '';
    record.orderConfirmationStatus = normalized;
    const field = document.querySelector('[data-order-confirmation-status-field]');
    if (field) {
      field.textContent = normalized;
      field.dataset.status = normalized;
    }
    syncStatusActions();
  }

  function submitOrderForConfirmation() {
    setOrderStatus('待履约');
    setConfirmationStatus('待确认');
  }

  function confirmCustomerOrder() {
    const orderStatus = record.status;
    if (!['待履约', '履约中'].includes(orderStatus)) {
      notify('error', '当前客户订单状态不允许确认，请刷新页面');
      return;
    }
    if (!['', '待确认'].includes(record.orderConfirmationStatus || '')) {
      notify('error', '当前客户订单确认状态不允许确认，请刷新页面');
      return;
    }
    const referenceCheck = window.OrderRoutes?.validateSubmitReferences?.();
    if (referenceCheck && referenceCheck.valid === false) {
      notify('error', referenceCheck.message || '商品引用校验未通过，请先处理下游单据。');
      return;
    }
    setConfirmationStatus('已确认');
    const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    const confirmUser = controlByLabel('确认人');
    const confirmTime = controlByLabel('确认时间');
    const operator = document.body.dataset.currentUser || '李琪';
    if (confirmUser) confirmUser.value = operator;
    if (confirmTime) confirmTime.value = now;
    notify('success', '客户订单已确认。');
  }

  function completeCustomerOrder() {
    if (record.status === '已完结') return;
    if (!['待履约', '履约中'].includes(record.status)) {
      notify('error', '当前客户订单状态不允许完结，请刷新页面');
      return;
    }
    if (record.orderConfirmationStatus !== '已确认') {
      notify('error', '请确认订单后再完结');
      return;
    }
    record.statusBeforeCompletion = record.status;
    setOrderStatus('已完结');
    notify('success', '客户订单已完结；CRM 合同状态不受影响。');
  }

  function cancelOrderCompletion() {
    setOrderStatus(record.statusBeforeCompletion || '履约中');
    delete record.statusBeforeCompletion;
    notify('success', '已取消完结，客户订单恢复为履约状态。');
  }

  function notify(kind, message) {
    if (window.UIState) window.UIState.showFormAlert(scope, kind, message);
  }

  function guardEditPermission() {
    if (window.PrototypeAccess && !window.PrototypeAccess.can('customerOrders.edit')) {
      notify('error', '当前角色没有执行合同状态操作的权限。');
      return false;
    }
    return true;
  }

  let contractDialogReturnFocus = null;
  function openContractDialog() {
    const dialog = document.getElementById('contractDialog');
    if (!dialog) return;
    contractDialogReturnFocus = document.activeElement;
    renderContract();
    dialog.hidden = false;
    document.body.classList.add('contract-modal-open');
    window.setTimeout(() => document.getElementById('contractDialogClose')?.focus(), 0);
  }

  function closeContractDialog() {
    const dialog = document.getElementById('contractDialog');
    if (!dialog || dialog.hidden) return;
    dialog.hidden = true;
    document.body.classList.remove('contract-modal-open');
    if (contractDialogReturnFocus && typeof contractDialogReturnFocus.focus === 'function') contractDialogReturnFocus.focus();
  }

  let generateContractDialogReturnFocus = null;

  function setGenerateSelectValue(id, value) {
    const node = document.getElementById(id);
    if (!node) return;
    const normalized = String(value || '');
    if (Array.from(node.options || []).some((option) => option.value === normalized)) node.value = normalized;
  }

  function applyGenerateContractRules() {
    const dialog = document.getElementById('generateContractDialog');
    if (!dialog) return;
    const create = document.getElementById('generateContractCreateFlag')?.value || 'y';
    const bodyType = document.getElementById('generateContractBodyTypeInput')?.value || 'system_auto_generate';
    const signMethod = document.getElementById('generateContractSignMethodInput')?.value || 'elb';
    const reclaim = document.getElementById('generateContractReclaimInput')?.value || 'y';
    const templateType = document.getElementById('generateContractTemplateType')?.value || 'our_template';
    const dependent = document.getElementById('generateContractDependent');
    if (dependent) dependent.hidden = create !== 'y';
    const rules = {
      create: create === 'y',
      offline: create === 'y' && signMethod === 'offline',
      bodyUpload: create === 'y' && bodyType === 'manual_upload' && !(signMethod === 'offline' && reclaim === 'y'),
      offlineReclaim: create === 'y' && bodyType === 'manual_upload' && signMethod === 'offline' && reclaim === 'y',
      elb: create === 'y' && signMethod === 'elb',
      otherTemplate: create === 'y' && signMethod === 'elb' && templateType === 'other_template'
    };
    dialog.querySelectorAll('[data-generate-when]').forEach((node) => {
      const rule = rules[node.dataset.generateWhen];
      if (rule !== undefined) node.hidden = !rule;
    });
    const hint = document.getElementById('generateContractHint');
    if (hint) hint.textContent = create === 'y'
      ? '以上信息由客户订单合同信息区自动带出，可返回订单修改后重新生成。'
      : '选择“否”时不生成 CRM 合同，关闭弹窗后可继续保留当前客户订单状态。';
  }

  function syncGenerateContractPreview() {
    const selectedText = (id) => {
      const node = document.getElementById(id);
      return node?.selectedOptions?.[0]?.textContent?.trim() || node?.value || '—';
    };
    const setText = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value || '—'; };
    const setValue = (id, value) => { const node = document.getElementById(id); if (node) node.value = value || ''; };
    setGenerateSelectValue('generateContractCreateFlag', document.getElementById('contractCreateFlag')?.value || 'y');
    setGenerateSelectValue('generateContractBodyTypeInput', document.getElementById('contractBodyType')?.value || 'system_auto_generate');
    setGenerateSelectValue('generateContractSignMethodInput', document.getElementById('contractSignMethod')?.value || 'elb');
    setGenerateSelectValue('generateContractReclaimInput', document.getElementById('contractReclaim')?.value || 'y');
    setGenerateSelectValue('generateContractTemplateType', document.getElementById('contractTemplateType')?.value || 'our_template');
    setValue('generateContractEsignUrl', document.getElementById('contractEsignUrl')?.value || '');
    setText('generateContractOrderNo', record.no || '—');
    setText('generateContractPrincipalName', document.getElementById('principalName')?.value || '—');
    setText('generateContractCounterpartyName', document.getElementById('counterpartyName')?.value || '—');
    setValue('generateOurCompany', document.getElementById('contractOurCompany')?.value || '—');
    setValue('generateOurSeal', selectedText('contractSupplierSealName'));
    setValue('generateOurSigner', selectedText('contractOurSigner'));
    setValue('generateCustomerCompany', record.customer || '—');
    applyGenerateContractRules();
  }

  function openGenerateContractDialog() {
    const dialog = document.getElementById('generateContractDialog');
    if (!dialog) return;
    generateContractDialogReturnFocus = document.activeElement;
    syncGenerateContractPreview();
    dialog.hidden = false;
    document.body.classList.add('contract-modal-open');
    window.setTimeout(() => document.getElementById('generateContractDialogClose')?.focus(), 0);
  }

  function closeGenerateContractDialog() {
    const dialog = document.getElementById('generateContractDialog');
    if (!dialog || dialog.hidden) return;
    dialog.hidden = true;
    document.body.classList.remove('contract-modal-open');
    if (generateContractDialogReturnFocus && typeof generateContractDialogReturnFocus.focus === 'function') generateContractDialogReturnFocus.focus();
  }

  function generateCrmContract() {
    if (!guardEditPermission()) return;
    const createFlag = document.getElementById('generateContractCreateFlag')?.value || 'y';
    if (createFlag === 'n') {
      closeGenerateContractDialog();
      notify('info', '已选择不生成 CRM 合同，客户订单状态保持不变。');
      return;
    }
    const bodyType = document.getElementById('generateContractBodyTypeInput')?.value || 'system_auto_generate';
    const signMethodValue = document.getElementById('generateContractSignMethodInput')?.value || 'elb';
    const reclaim = document.getElementById('generateContractReclaimInput')?.value || 'y';
    const templateType = document.getElementById('generateContractTemplateType')?.value || 'our_template';
    const esignUrl = document.getElementById('generateContractEsignUrl')?.value?.trim() || '';
    if (signMethodValue === 'elb' && templateType === 'other_template' && !esignUrl) {
      notify('error', '范本类型为非我司范本时，请填写 E建签地址');
      return;
    }
    if (bodyType === 'manual_upload' && signMethodValue === 'offline' && reclaim === 'y') {
      const signDate = document.getElementById('generateContractSignDate')?.value;
      if (!signDate) {
        notify('error', '请填写签约日期');
        return;
      }
    }
    const digits = String(record.no || '').replace(/\D/g, '') || Date.now().toString();
    contract.no = 'CRM-' + digits;
    contract.version = 'V1.0';
    contract.bodyType = bodyType;
    contract.signMethod = ({ elb: 'E建签签约', offline: '线下签约' })[signMethodValue] || 'E建签签约';
    contract.templateType = templateType === 'other_template' ? '非我司范本' : '我司范本';
    contract.esignUrl = esignUrl;
    contract.status = '待审';
    contract.originalAttached = false;
    renderContract();
    syncStatusActions();
    closeGenerateContractDialog();
    const esignMessage = signMethodValue === 'elb'
      ? (templateType === 'our_template' ? '审批通过后将自动发起 E建签。' : '已关联非我司 E建签地址。')
      : '请继续完成线下签约。';
    notify('success', 'CRM 合同已生成，状态已更新为“待审”。' + esignMessage);
  }

  function applyRecord() {
    setTitle('客户订单详情');
    document.body.dataset.orderNo = record.no;
    document.body.dataset.viewMode = 'detail';
    setControl('客户订单编号', record.no);
    setControl('业务员', record.sales);
    setControl('部门', record.department);
    setControl('公司', record.company);
    setControl('客户', record.customer);
    setControl('客户结算抬头', record.customer);
    setControl('客户联系人', record.contact);
    setControl('客户联系人电话', record.phone);
    setControl('客户联系人邮箱', record.email);
    setControl('业务类型', record.businessType);
    setControl('业务日期', record.businessDate);
    setControl('关联物流项目', record.projectNo);
    setControl('贸易条款', record.tradeTerm);
    setControl('运输类型', record.transportType);
    setControl('车辆箱型要求', record.loadType);
    setControl('计划运输日期', record.businessDate);
    setControl('订单备注', record.remark);

    const statusField = Array.from(scope.querySelectorAll('.field')).find((field) => {
      const label = field.querySelector('.field-label');
      return label && label.textContent.trim().startsWith('订单状态');
    });
    if (statusField) {
      const pill = statusField.querySelector('[data-order-status-field]');
      if (pill) {
        pill.textContent = record.status || '—';
        pill.dataset.status = record.status || '';
        pill.dataset.orderStatusPill = '';
      }
    }
    const confirmationField = document.querySelector('[data-order-confirmation-status-field]');
    if (confirmationField) {
      const explicitConfirmation = record.orderConfirmationStatus ?? record.confirmationStatus;
      const inferredConfirmation = ['履约中', '已完结'].includes(record.status) ? '已确认' : '';
      const confirmationStatus = statusOverride
        ? (record.status === '待履约' ? '待确认' : inferredConfirmation)
        : (explicitConfirmation !== undefined && explicitConfirmation !== null ? explicitConfirmation : inferredConfirmation);
      record.orderConfirmationStatus = confirmationStatus;
      confirmationField.textContent = confirmationStatus;
      confirmationField.dataset.status = confirmationStatus;
    }
    const overviewNumber = document.getElementById('orderOverviewNumber');
    if (overviewNumber) {
      overviewNumber.textContent = record.no ? '(' + record.no + ')' : '';
      overviewNumber.hidden = !record.no;
    }
    const overviewCustomer = document.getElementById('orderOverviewCustomer');
    if (overviewCustomer) overviewCustomer.textContent = record.customer || '—';
    renderConsignments(record.consignments);
    renderServiceScope(record.serviceScope);
    renderProfit();
    const versionControl = controlByLabel('版本号');
    if (versionControl) {
      let latestVersion = '1.0';
      try {
        const rows = JSON.parse(sessionStorage.getItem('ct:customerOrderVersionHistory:' + record.no) || '[]');
        if (Array.isArray(rows) && rows.length) latestVersion = String(rows[rows.length - 1].version || '1.0');
      } catch (error) { /* ignore */ }
      versionControl.value = latestVersion.replace(/^V/i, '');
    }
    const sourceTypeControl = controlByLabel('来源类型');
    if (sourceTypeControl && record.sourceType) {
      const recordSource = record.sourceType === '外部系统'
        ? '外系统接入'
        : (['手动创建', '客户需求单', '外系统接入'].includes(record.sourceType) ? record.sourceType : '手动创建');
      sourceTypeControl.value = recordSource;
    }
    renderContract();
    syncStatusActions();
  }

  function draftPayload() {
    const fields = {};
    controls().forEach((control) => {
      const label = control.getAttribute('aria-label');
      if (label) fields[label] = control.value;
    });
    const consignments = consignmentInput
      ? (consignmentInput.value.trim() ? [consignmentInput.value.trim()] : [])
      : (chips ? Array.from(chips.querySelectorAll('.consignment-chip')).map((chip) => chip.dataset.value) : []);
    const selectedValues = (name) => Array.from(document.querySelectorAll('input[name="' + name + '"]:checked')).map((input) => input.value);
    const emailRecipients = Array.from(document.querySelectorAll('#orderEmailRecipientList [data-order-email-recipient]')).map((chip) => ({
      name: chip.dataset.recipientName || '',
      email: chip.dataset.recipientEmail || ''
    }));
    return {
      orderNo,
      fields,
      consignments,
      serviceScope: selectedValues('orderServiceScope'),
      transportType: selectedValues('orderTransportType'),
      shippingCategory: selectedValues('orderShippingCategory'),
      emailRecipients
    };
  }

  function saveDraftSoon() {
    clearTimeout(draftSaveTimer);
    draftSaveTimer = window.setTimeout(() => data.saveDraft(orderNo, draftPayload()), 60);
  }

  function applyDraft(draft) {
    if (!draft) return false;
    window.__restoredOrderDraft = draft;
    Object.entries(draft.fields || {}).forEach(([label, value]) => { if (label === '版本号') return; setControl(label, value); });
    if (Array.isArray(draft.consignments)) renderConsignments(draft.consignments);
    if (Array.isArray(draft.serviceScope)) renderServiceScope(draft.serviceScope);
    return true;
  }

  applyRecord();
  const restoredDraft = applyDraft(data.readDraft(orderNo));
  const viewContractBtn = document.getElementById('viewContractBtn');
  const initiateSignBtn = document.getElementById('initiateSignBtn');
  const cancelOrderBtn = document.getElementById('cancelOrderBtn');
  const withdrawSignBtn = document.getElementById('withdrawSignBtn');
  const reclaimOriginalBtn = document.getElementById('reclaimOriginalBtn');
  const withdrawReclaimBtn = document.getElementById('withdrawReclaimBtn');
  const generateCrmContractBtn = document.getElementById('generateCrmContractBtn');
  const contractDialog = document.getElementById('contractDialog');
  const generateContractDialog = document.getElementById('generateContractDialog');

  viewContractBtn?.addEventListener('click', () => {
    const orderStatus = record.status;
    if (['创建', '驳回'].includes(orderStatus)) {
      const win = window.open('', '_blank');
      if (!win) {
        notify('error', '浏览器拦截了新标签页，请允许弹窗后重试。');
        return;
      }
      const body = '<h2 style="font-family:sans-serif">合同预览（帆软模板）</h2>' +
        '<p style="font-family:sans-serif;color:#555">客户订单：' + (record.no || '') + '<br>签约方式：' + (contract.signMethod || '—') + '<br>我方：' + (contract.principalName || '—') + '<br>客户：' + (contract.counterpartyName || '—') + '</p>';
      win.document.write(body);
      win.document.close();
      return;
    }
    if (contract.originalAttached) {
      const win = window.open('', '_blank');
      if (!win) {
        notify('error', '浏览器拦截了新标签页，请允许弹窗后重试。');
        return;
      }
      win.document.write('<h2 style="font-family:sans-serif">合同正本</h2><p style="font-family:sans-serif;color:#555">' + (record.no || '') + ' 合同正本附件预览</p>');
      win.document.close();
      return;
    }
    if (contract.status === '未生成') {
      notify('error', '请先点击【生成CRM合同】创建 CRM 合同');
      return;
    }
    notify('error', '无合同附件');
  });
  document.getElementById('contractDialogClose')?.addEventListener('click', closeContractDialog);
  document.getElementById('contractDialogDone')?.addEventListener('click', closeContractDialog);
  generateCrmContractBtn?.addEventListener('click', openGenerateContractDialog);
  document.getElementById('generateContractDialogClose')?.addEventListener('click', closeGenerateContractDialog);
  document.getElementById('generateContractDialogCancel')?.addEventListener('click', closeGenerateContractDialog);
  document.getElementById('generateContractDialogConfirm')?.addEventListener('click', generateCrmContract);
  ['generateContractCreateFlag', 'generateContractBodyTypeInput', 'generateContractSignMethodInput', 'generateContractReclaimInput', 'generateContractTemplateType'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', applyGenerateContractRules);
  });
  generateContractDialog?.addEventListener('click', (event) => {
    if (event.target === generateContractDialog) closeGenerateContractDialog();
  });
  contractDialog?.addEventListener('click', (event) => {
    if (event.target === contractDialog) closeContractDialog();
  });
  contractDialog?.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(contractDialog.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { closeContractDialog(); closeGenerateContractDialog(); }
  });

  initiateSignBtn?.addEventListener('click', () => {
    if (!guardEditPermission()) return;
    setContractStatus('签约中');
    notify('success', '已发起签署，合同状态已更新为“签约中”。');
  });
  cancelOrderBtn?.addEventListener('click', () => {
    if (!['待履约', '履约中'].includes(record.status)) {
      notify('error', '当前客户订单状态不允许取消');
      return;
    }
    if (!window.confirm('取消后客户订单将进入已取消状态，CRM 合同状态不受影响，确定取消吗？')) return;
    setOrderStatus('已取消');
    notify('success', '客户订单已取消。');
  });
  withdrawSignBtn?.addEventListener('click', () => {
    if (!guardEditPermission()) return;
    if (!window.confirm('撤销签署后合同将回到“待签约”状态，确定撤销吗？')) return;
    setContractStatus('待签约');
    notify('success', '已撤销签署，合同状态已回到“待签约”。');
  });
  reclaimOriginalBtn?.addEventListener('click', () => {
    if (!guardEditPermission()) return;
    if (!window.confirm('确认已完成正本回收？合同状态将变更为“已生效”。')) return;
    setContractStatus('已生效');
    notify('success', '已完成正本回收，合同状态已更新为“已生效”。');
  });
  withdrawReclaimBtn?.addEventListener('click', () => {
    if (!guardEditPermission()) return;
    if (!window.confirm('确认撤回正本回收？合同状态将回到“签约中”。')) return;
    contract.originalAttached = false;
    setContractStatus('签约中');
    notify('success', '已撤回正本回收，合同状态已回到“签约中”。');
  });

  /* 合同信息模块：按《合同签约确认单》字段清单做组合联动
     1. 系统自动生成 + E建签签约 → 基础信息 + 我司签约设置
     2. 系统自动生成 + 线下签约 → 基础信息 + 签约日期
     3. 手动上传 + 线下签约 → 基础信息 + 正本回收 + 签约日期 + 合同正本附件上传
     4. 手动上传 + E建签签约 → 基础信息 + 合同正本附件上传 + 我司签约设置
     是否生成CRM合同=否 → 只保留「是否生成CRM合同」字段 */
  window.OrderDetailPage = {
    no: orderNo,
    record,
    contract,
    draftKey: data.STORAGE.draftPrefix + orderNo,
    isDirty: () => Boolean(dirtyIndicator && !dirtyIndicator.hidden),
    openContractDialog,
    closeContractDialog,
    setStatus: setOrderStatus,
    setContractStatus,
    renderContract,
    openGenerateContractDialog,
    closeGenerateContractDialog,
    setConfirmationStatus,
    submitOrder: submitOrderForConfirmation,
    confirmOrder: confirmCustomerOrder,
    completeOrder: completeCustomerOrder,
    cancelComplete: cancelOrderCompletion
  };

  scope.addEventListener('input', saveDraftSoon);
  scope.addEventListener('change', saveDraftSoon);
  scope.addEventListener('click', saveDraftSoon);
  scope.addEventListener('keyup', saveDraftSoon);

  if (dirtyIndicator) {
    new MutationObserver(() => {
      if (dirtyIndicator.hidden) data.clearDraft(orderNo);
    }).observe(dirtyIndicator, { attributes: true, attributeFilter: ['hidden'] });
  }

  const backButton = document.getElementById('backToListBtn');
  if (backButton) {
    backButton.addEventListener('click', (event) => {
      if (!dirtyIndicator || dirtyIndicator.hidden) return;
      if (!window.confirm('当前订单有未保存修改，确定离开吗？')) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  }

  window.addEventListener('beforeunload', (event) => {
    if (!dirtyIndicator || dirtyIndicator.hidden) return;
    event.preventDefault();
    event.returnValue = '';
  });

  if (restoredDraft) {
    scope.dataset.dirty = 'true';
    if (dirtyIndicator) dirtyIndicator.hidden = false;
    window.setTimeout(() => scope.dispatchEvent(new Event('input', { bubbles: true })), 0);
  }
})();
