(function () {
  'use strict';

  const ui = window.DemandUI;
  const params = new URLSearchParams(window.location.search);
  const demandNo = params.get('no') || 'XQ202610280031';
  const allowedDemandStatuses = ['created', 'pending', 'received', 'rejected', 'completed'];
  const statusFromDom = document.body.dataset.demandStatus;
  const statusFromQuery = params.get('status');
  const requestedStatus = allowedDemandStatuses.includes(statusFromDom)
    ? statusFromDom
    : allowedDemandStatuses.includes(statusFromQuery)
      ? statusFromQuery
      : 'received';
  const demand = {
    no: demandNo,
    customer: '青岛绿洲园花生食品有限公司',
    serviceRequirement: '全程温控不高于 25℃，使用食品级托盘；报关资料需在装运前 2 个工作日提交审核。',
    customerRemark: '优先安排直航船期；如发生换船，请同步客户物流委托号。',
    contactName: '王晓琳',
    contactPhone: '138 5320 7618',
    contactEmail: 'wangxl@example.com',
    businessType: '出口',
    serviceScopeText: '运输、仓储、报关清关',
    serviceItems: ['水运'],
    shippingCategories: ['集装箱'],
    extensionScenes: ['订舱'],
    transportType: '水运',
    tradeTerms: 'FOB',
    origin: '青岛港',
    destination: '胡志明港',
    pickupDate: '2026-11-03',
    deliveryDate: '2026-11-18',
    booking: {
      salesContractNo: 'XS2026-1028',
      purchaseContractNo: 'CG2026-1028',
      contractHeader: '青岛绿洲园花生食品有限公司',
      factory: '青岛花生加工一厂',
      tradeType: '出口',
      salesPriceTerm: 'FOB 青岛',
      purchasePriceTerm: '送到价',
      externalDeliveryDate: '2026-11-18',
      findCarrier: '否',
      directSailing: '是',
      latestShipmentDate: '2026-11-10',
      dischargeTerms: '班轮条款',
      freightEstimate: '320',
      portChargeEstimate: '180',
      vesselAgeRequirement: '不超过 15 年',
      vesselTypeRequirement: '集装箱船',
      coilWeight: '--',
      length: '--',
      clientDocumentOfficer: '王晓琳'
    },
    serviceReq: 'SR202610280018',
    status: 'received',
    currentVersion: 'V3',
    lines: [
      { id: 'L1', no: 1, tradeContractNo: 'HT2026-0821（销售合同）', name: '脱皮花生仁', spec: '25kg/袋', unit: '吨', required: 100, packageQty: 4000, packageUnit: '袋', overRate: 3, underRate: 2, packaging: '食品级编织袋', note: '出口包装，托盘承载', price: 11400 },
      { id: 'L2', no: 2, tradeContractNo: 'HT2026-0903（销售合同）', name: '一级压榨花生油', spec: '200L/桶', unit: '吨', required: 24, packageQty: 120, packageUnit: '桶', overRate: 1, underRate: 1, packaging: '食品级钢桶', note: '需提供批次检测报告', price: 12800 }
    ],
    versions: [
      { version: 'V1', type: '首次提交', changeNo: '--', status: 'rejected', submittedAt: '2026-10-27 15:10', handledBy: '李四', effectiveAt: '--', reason: '客户联系人信息不完整', snapshot: { quantities: { L1: 100, L2: 24 }, pickupDate: '2026-11-03' } },
      { version: 'V2', type: '重新提交', changeNo: '--', status: 'received', submittedAt: '2026-10-28 09:20', handledBy: '苏丽蓉', effectiveAt: '2026-10-28 09:32', reason: '补齐联系人信息后重新提交', snapshot: { quantities: { L1: 100, L2: 24 }, pickupDate: '2026-11-03' } },
      { version: 'V3', type: '需求修改', changeNo: 'M20261028001', status: 'received', submittedAt: '2026-10-28 13:06', handledBy: '苏丽蓉', effectiveAt: '2026-10-28 13:18', reason: '调整计划提货日期与包装要求', snapshot: { quantities: { L1: 100, L2: 24 }, pickupDate: '2026-11-03' } },
      { version: 'V4', type: '需求修改', changeNo: 'M20261029001', status: 'pending', submittedAt: '2026-10-29 09:42', handledBy: '--', effectiveAt: '--', reason: '客户增加脱皮花生仁需求数量，并同步调整提货日期', snapshot: { quantities: { L1: 120, L2: 24 }, pickupDate: '2026-11-05' } }
    ],
    orders: [
      { id: 'FCO202610280021', status: '已安排', statusTone: 'done', lineId: 'L1', qty: 60, version: 'V2', consignmentNo: '2102957467694845952', contractNo: 'HT2026-0821', createdAt: '2026-10-28 10:02', amount: 684000, transportDate: '2026-11-03', remark: '客户要求装运前提供装柜照片。', items: [{ no: 1, name: '脱皮花生仁', spec: '25kg/袋', qty: 60, unit: '吨', price: 11400 }], contract: { no: 'HT2026-0821', name: '2026年度花生及制品出口物流服务合同', state: '已生效', signedAt: '2026-01-08', validFrom: '2026-01-01', validTo: '2026-12-31', amount: 8600000, currency: 'CNY', payment: '月结 30 天', items: [{ no: 1, name: '脱皮花生仁', spec: '25kg/袋', contractQty: 500, unit: '吨', usedQty: 60, price: 11400, amount: 684000 }] } },
      { id: 'FCO202610280036', status: '待安排', statusTone: 'pending', lineId: 'L1', qty: 50, version: 'V3', consignmentNo: '2102957467694845988', contractNo: 'HT2026-0903', createdAt: '2026-10-28 14:20', amount: 570000, transportDate: '2026-11-05', remark: '等待客户确认船期。', items: [{ no: 1, name: '脱皮花生仁', spec: '25kg/袋', qty: 50, unit: '吨', price: 11400 }], contract: { no: 'HT2026-0903', name: '花生制品出口运输补充协议', state: '已生效', signedAt: '2026-09-03', validFrom: '2026-09-03', validTo: '2026-12-31', amount: 3200000, currency: 'CNY', payment: '月结 30 天', items: [{ no: 1, name: '脱皮花生仁', spec: '25kg/袋', contractQty: 260, unit: '吨', usedQty: 50, price: 11400, amount: 570000 }] } },
      { id: 'FCO202610280041', status: '已安排', statusTone: 'done', lineId: 'L2', qty: 16, version: 'V3', consignmentNo: '2102957467694846126', contractNo: 'HT2026-0911', createdAt: '2026-10-28 15:08', amount: 204800, transportDate: '2026-11-06', remark: '钢桶回收由客户负责。', items: [{ no: 1, name: '一级压榨花生油', spec: '200L/桶', qty: 16, unit: '吨', price: 12800 }], contract: { no: 'HT2026-0911', name: '花生油出口物流服务合同', state: '已生效', signedAt: '2026-09-11', validFrom: '2026-09-11', validTo: '2026-12-31', amount: 1850000, currency: 'CNY', payment: '月结 30 天', items: [{ no: 1, name: '一级压榨花生油', spec: '200L/桶', contractQty: 120, unit: '吨', usedQty: 16, price: 12800, amount: 204800 }] } }
    ],
    selectedOrderId: 'FCO202610280021',
    timeline: [
      { time: '2026-10-27 15:10', title: '首次提交', text: '来源服务要求 V1 推送至 4PL，生成客户需求单。' },
      { time: '2026-10-27 16:08', title: 'V1 已驳回', text: '李四驳回：客户联系人信息不完整。' },
      { time: '2026-10-28 09:20', title: 'V2 重新提交', text: '同一客户需求单号下生成新版本，原 V1 保持已驳回。' },
      { time: '2026-10-28 09:32', title: 'V2 已接收', text: '苏丽蓉接收 V2，版本即时生效。' },
      { time: '2026-10-28 13:18', title: 'V3 已接收', text: '修改单 M20261028001 接收后生成当前有效版本 V3。' },
      { time: '2026-10-29 09:42', title: 'V4 待接收', text: '新修改单已提交，当前仍按 V3 执行。' }
    ]
  };

  const $ = (id) => document.getElementById(id);
  const statusLabels = { created: '创建', pending: '待接收', received: '已接收', rejected: '已驳回', completed: '已完成' };
  const statusTones = { created: 'created', pending: 'pending', received: 'running', rejected: 'rejected', completed: 'done' };
  const versionStatus = {
    created: { label: '创建', tone: 'created' },
    pending: { label: '待接收', tone: 'pending' },
    received: { label: '已接收', tone: 'done' },
    rejected: { label: '已驳回', tone: 'rejected' }
  };

  function applyStatusVariant() {
    const versionsTemplate = JSON.parse(JSON.stringify(demand.versions));
    const ordersTemplate = JSON.parse(JSON.stringify(demand.orders));
    const firstVersion = versionsTemplate[0];
    const firstSnapshot = JSON.parse(JSON.stringify(firstVersion.snapshot));

    if (requestedStatus === 'created') {
      demand.status = 'created';
      demand.currentVersion = 'V1';
      demand.serviceReq = '--';
      demand.upstreamDemand = '--';
      demand.pickupDate = firstSnapshot.pickupDate;
      demand.orders = [];
      demand.selectedOrderId = null;
      demand.versions = [{
        version: 'V1', type: '创建', changeNo: '--', status: 'created',
        submittedAt: '2026-10-27 14:52', handledBy: '--', effectiveAt: '--',
        reason: '客户需求已创建，等待提交', snapshot: firstSnapshot
      }];
      demand.timeline = [
        { time: '2026-10-27 14:52', title: '需求已创建', text: '客户需求单由服务要求生成，当前为创建状态，尚未提交。' }
      ];
    } else if (requestedStatus === 'pending') {
      demand.status = 'pending';
      demand.currentVersion = 'V1';
      demand.pickupDate = firstSnapshot.pickupDate;
      demand.orders = [];
      demand.selectedOrderId = null;
      demand.versions = [{
        version: 'V1', type: '首次提交', changeNo: '--', status: 'pending',
        submittedAt: '2026-10-28 09:20', handledBy: '--', effectiveAt: '--',
        reason: '来源服务要求首次提交', snapshot: firstSnapshot
      }];
      demand.timeline = [
        { time: '2026-10-27 14:52', title: '需求已创建', text: '客户需求单由服务要求生成。' },
        { time: '2026-10-28 09:20', title: 'V1 已提交', text: '客户需求进入待接收状态。' }
      ];
    } else if (requestedStatus === 'rejected') {
      demand.status = 'rejected';
      demand.currentVersion = 'V1';
      demand.pickupDate = firstSnapshot.pickupDate;
      demand.orders = [];
      demand.selectedOrderId = null;
      demand.versions = [{
        version: 'V1', type: '首次提交', changeNo: '--', status: 'rejected',
        submittedAt: '2026-10-27 15:10', handledBy: '李四', effectiveAt: '--',
        reason: '客户联系人信息不完整', snapshot: firstSnapshot
      }];
      demand.timeline = [
        { time: '2026-10-27 14:52', title: '需求已创建', text: '客户需求单由服务要求生成。' },
        { time: '2026-10-27 15:10', title: 'V1 已提交', text: '客户需求进入待接收状态。' },
        { time: '2026-10-27 16:08', title: 'V1 已驳回', text: '李四驳回：客户联系人信息不完整。' }
      ];
    } else if (requestedStatus === 'completed') {
      demand.status = 'completed';
      demand.currentVersion = 'V4';
      demand.orders = ordersTemplate;
      demand.selectedOrderId = ordersTemplate[0] ? ordersTemplate[0].id : null;
      const v4 = versionsTemplate.find((version) => version.version === 'V4');
      demand.pickupDate = v4.snapshot.pickupDate;
      v4.status = 'received';
      v4.handledBy = '苏丽蓉';
      v4.effectiveAt = '2026-10-29 10:05';
      demand.lines.forEach((line) => { line.required = Number(v4.snapshot.quantities[line.id] || line.required); });
      demand.versions = versionsTemplate;
      demand.timeline = demand.timeline.filter((item) => item.title !== 'V4 待接收');
      demand.timeline.push({ time: '2026-10-29 10:05', title: 'V4 已接收', text: '苏丽蓉接收 V4，版本即时生效。' });
      demand.timeline.push({ time: '2026-10-30 16:20', title: '客户需求已完成', text: '客户需求已人工完成，后续版本和订单只读。' });
    }
  }

  applyStatusVariant();
  const dialog = $('actionDialog');
  let selectedOrderId = demand.selectedOrderId;

  function nowText() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function currency(value) {
    return 'CNY ' + Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function currentVersion() {
    return demand.versions.find((version) => version.version === demand.currentVersion) || null;
  }

  function effectiveVersions() {
    return demand.versions.filter((version) => version.status === 'received');
  }

  function latestReceivedVersion() {
    const versions = effectiveVersions();
    return versions.length ? versions[versions.length - 1].version : '--';
  }

  function pendingVersion() {
    return demand.versions.find((version) => version.status === 'pending') || null;
  }

  function arrangedFor(lineId) {
    return demand.orders.filter((order) => order.lineId === lineId && order.status !== '已取消').reduce((sum, order) => sum + Number(order.qty || 0), 0);
  }

  function lineMetrics() {
    return demand.lines.map((line) => {
      const arranged = arrangedFor(line.id);
      return { ...line, arranged, remaining: Math.max(line.required - arranged, 0), over: Math.max(arranged - line.required, 0) };
    });
  }

  function progressText() {
    const metrics = lineMetrics();
    if (demand.status === 'rejected' || demand.orders.length === 0) return '未生成';
    const overLines = metrics.filter((line) => line.over > 0).length;
    const complete = metrics.every((line) => line.arranged >= line.required);
    const base = complete ? '已全部生成' : '部分生成';
    return overLines ? base + ' · ' + overLines + ' 行超额' : base;
  }

  function lineStatus(metric) {
    if (metric.arranged === 0) return { label: '未安排', tone: 'closed' };
    if (metric.over > 0) return { label: '超额安排', tone: 'exception' };
    if (metric.arranged >= metric.required) return { label: '已全部安排', tone: 'done' };
    return { label: '部分安排', tone: 'pending' };
  }

  function renderOverviewLines() {
    $('overviewLineBody').innerHTML = demand.lines.map((line) =>
      '<tr><td>' + line.no + '</td><td>' + ui.escapeHtml(line.tradeContractNo || '--') + '</td><td><strong>' + ui.escapeHtml(line.name || '--') + '</strong></td><td class="num">' + (line.required || '--') + '</td><td>' + ui.escapeHtml(line.unit || '--') + '</td><td class="num">' + (line.packageQty || '--') + '</td><td>' + ui.escapeHtml(line.packageUnit || '--') + '</td><td class="num">' + (line.overRate ?? '--') + '%</td><td class="num">' + (line.underRate ?? '--') + '%</td></tr>'
    ).join('');
  }

  function tagMarkup(values) {
    const items = (values || []).filter(Boolean);
    return items.length ? '<span class="demand-tag-list">' + items.map((item) => '<span class="demand-tag">' + ui.escapeHtml(item) + '</span>').join('') + '</span>' : '--';
  }

  function renderDemandInfoValues() {
    $('staticCustomerValue').textContent = demand.customer || '--';
    $('staticContactValue').textContent = demand.contactName || '--';
    $('staticPhoneValue').textContent = demand.contactPhone || '--';
    $('staticEmailValue').textContent = demand.contactEmail || '--';
    $('staticBizTypeValue').textContent = demand.businessType || '--';
    $('staticServiceItemsValue').innerHTML = tagMarkup(demand.serviceItems);
    $('staticShippingCategoriesValue').innerHTML = tagMarkup(demand.shippingCategories);
    $('staticExtensionScenesValue').innerHTML = tagMarkup(demand.extensionScenes);
    $('staticTransportTypeValue').textContent = demand.transportType || '--';
    $('staticTradeTermsValue').textContent = demand.tradeTerms || '--';
    $('staticOriginValue').textContent = demand.origin || '--';
    $('staticDestinationValue').textContent = demand.destination || '--';
    $('pickupDate').textContent = demand.pickupDate || '--';
    $('deliveryDate').textContent = demand.deliveryDate || '--';
    $('serviceRequirementValue').textContent = demand.serviceRequirement || '--';
    $('customerRemarkValue').textContent = demand.customerRemark || '--';
    const scopes = (demand.serviceScopeText || '').split(/[、,，]/).map((item) => item.trim()).filter(Boolean);
    $('staticServiceScopeValue').innerHTML = scopes.length
      ? '<span class="demand-tag-list">' + scopes.map((scope) => '<span class="demand-tag">' + ui.escapeHtml(scope) + '</span>').join('') + '</span>'
      : '--';

    const booking = demand.booking || {};
    const bookingValues = {
      bookingSalesContract: booking.salesContractNo,
      bookingPurchaseContract: booking.purchaseContractNo,
      bookingContractHeader: booking.contractHeader,
      bookingCustomer: demand.customer,
      bookingFactory: booking.factory,
      bookingTradeType: booking.tradeType,
      bookingSalesPriceTerm: booking.salesPriceTerm,
      bookingPurchasePriceTerm: booking.purchasePriceTerm,
      bookingExternalDeliveryDate: booking.externalDeliveryDate,
      bookingFindCarrier: booking.findCarrier,
      bookingDirectSailing: booking.directSailing,
      bookingLatestShipmentDate: booking.latestShipmentDate,
      bookingDischargeTerms: booking.dischargeTerms,
      bookingFreightEstimate: booking.freightEstimate,
      bookingPortChargeEstimate: booking.portChargeEstimate,
      bookingVesselAgeRequirement: booking.vesselAgeRequirement,
      bookingVesselTypeRequirement: booking.vesselTypeRequirement,
      bookingCoilWeight: booking.coilWeight,
      bookingLength: booking.length,
      bookingClientDocumentOfficer: booking.clientDocumentOfficer
    };
    Object.entries(bookingValues).forEach(([id, value]) => { $(id).textContent = value || '--'; });
    $('bookingExtensionDisplaySection').hidden = !(demand.extensionScenes || []).includes('订舱');
  }

  function setCheckboxValues(name, values) {
    const set = new Set(values || []);
    document.querySelectorAll('input[name="' + name + '"]').forEach((checkbox) => { checkbox.checked = set.has(checkbox.value); });
  }

  function productRowMarkup(line, index) {
    const units = ['吨', '千克', '立方米', '件'];
    const packageUnits = ['袋', '桶', '箱', '托盘'];
    return '<tr data-product-row data-line-id="' + ui.escapeHtml(line.id || ('L' + Date.now() + index)) + '">' +
      '<td><select class="product-trade"><option value="">请选择</option><option' + (line.tradeContractNo && line.tradeContractNo.indexOf('HT2026-0821') === 0 ? ' selected' : '') + '>HT2026-0821（销售合同）</option><option' + (line.tradeContractNo && line.tradeContractNo.indexOf('HT2026-0903') === 0 ? ' selected' : '') + '>HT2026-0903（销售合同）</option></select></td>' +
      '<td><input class="product-name" value="' + ui.escapeHtml(line.name || '') + '" placeholder="请输入"></td>' +
      '<td><input class="product-qty" type="number" min="0" step="0.01" value="' + (line.required || '') + '" placeholder="请输入"></td>' +
      '<td><select class="product-unit">' + units.map((unit) => '<option' + (line.unit === unit ? ' selected' : '') + '>' + unit + '</option>').join('') + '</select></td>' +
      '<td><input class="product-package-qty" type="number" min="0" step="0.01" value="' + (line.packageQty || '') + '" placeholder="请输入"></td>' +
      '<td><select class="product-package-unit">' + packageUnits.map((unit) => '<option' + (line.packageUnit === unit ? ' selected' : '') + '>' + unit + '</option>').join('') + '</select></td>' +
      '<td><input class="product-over-rate" type="number" min="0" step="0.01" value="' + (line.overRate ?? '') + '" placeholder="%"></td>' +
      '<td><input class="product-under-rate" type="number" min="0" step="0.01" value="' + (line.underRate ?? '') + '" placeholder="%"></td>' +
      '<td><button class="btn link demand-danger" type="button" data-remove-product>删除</button></td>' +
    '</tr>';
  }

  function renderCreateProductRows() {
    $('createProductBody').innerHTML = demand.lines.map((line, index) => productRowMarkup(line, index)).join('');
  }

  function updateBookingSectionVisibility() {
    const checked = document.querySelector('input[name="extensionScenes"][value="订舱"]')?.checked;
    $('createBookingExtensionSection').hidden = !checked;
  }

  function renderCreateFormValues() {
    const values = {
      createCustomer: demand.customer,
      createContact: demand.contactName,
      createPhone: demand.contactPhone,
      createEmail: demand.contactEmail,
      createBizType: demand.businessType,
      createServiceScope: demand.serviceScopeText,
      createTransportType: demand.transportType,
      createTradeTerms: demand.tradeTerms,
      createOrigin: demand.origin,
      createDestination: demand.destination,
      createPickupDate: demand.pickupDate,
      createDeliveryDate: demand.deliveryDate,
      createServiceRequirement: demand.serviceRequirement,
      createCustomerRemark: demand.customerRemark
    };
    Object.entries(values).forEach(([id, value]) => {
      const control = $(id);
      if (control) control.value = value || '';
    });
    setCheckboxValues('serviceItems', demand.serviceItems);
    setCheckboxValues('shippingCategories', demand.shippingCategories);
    setCheckboxValues('extensionScenes', demand.extensionScenes);
    const booking = demand.booking || {};
    const bookingValues = {
      createSalesContractNo: booking.salesContractNo,
      createPurchaseContractNo: booking.purchaseContractNo,
      createContractHeader: booking.contractHeader,
      createBookingCustomer: demand.customer,
      createFactory: booking.factory,
      createBookingTradeType: booking.tradeType,
      createSalesPriceTerm: booking.salesPriceTerm,
      createPurchasePriceTerm: booking.purchasePriceTerm,
      createExternalDeliveryDate: booking.externalDeliveryDate,
      createFindCarrier: booking.findCarrier || '否',
      createDirectSailing: booking.directSailing || '是',
      createLatestShipmentDate: booking.latestShipmentDate,
      createDischargeTerms: booking.dischargeTerms,
      createFreightEstimate: booking.freightEstimate,
      createPortChargeEstimate: booking.portChargeEstimate,
      createVesselAgeRequirement: booking.vesselAgeRequirement,
      createVesselTypeRequirement: booking.vesselTypeRequirement,
      createCoilWeight: booking.coilWeight,
      createLength: booking.length,
      createClientDocumentOfficer: booking.clientDocumentOfficer
    };
    Object.entries(bookingValues).forEach(([id, value]) => {
      const control = $(id);
      if (control) control.value = value || '';
    });
    renderCreateProductRows();
    updateBookingSectionVisibility();
  }

  function syncCreateSections() {
    const isCreated = demand.status === 'created';
    $('createDemandFormSection').hidden = !isCreated;
    $('demandSourceSection').hidden = isCreated || demand.serviceReq === '--';
    $('staticDemandInfoSection').hidden = isCreated;
    if (isCreated) renderCreateFormValues();
    else renderDemandInfoValues();
  }

  function renderProgress() {
    const metrics = lineMetrics();
    const overLines = metrics.filter((line) => line.over > 0).length;
    const remainingLines = metrics.filter((line) => line.remaining > 0).length;
    $('progressSummary').innerHTML =
      '<div class="demand-progress-item"><span>需求行</span><strong>' + metrics.length + ' 行</strong></div>' +
      '<div class="demand-progress-item"><span>关联客户订单</span><strong>' + demand.orders.length + ' 单</strong></div>' +
      '<div class="demand-progress-item"><span>待继续安排</span><strong>' + remainingLines + ' 行</strong></div>' +
      '<div class="demand-progress-item ' + (overLines ? 'is-warning' : '') + '"><span>超额行</span><strong>' + overLines + ' 行</strong></div>';
    $('progressLineBody').innerHTML = metrics.map((line) => {
      const state = lineStatus(line);
      return '<tr><td>' + line.no + '</td><td><strong>' + ui.escapeHtml(line.name) + '</strong></td><td>' + line.unit + '</td><td class="num">' + line.required + '</td><td class="num">' + line.arranged + '</td><td class="num">' + line.remaining + '</td><td class="num ' + (line.over ? 'demand-danger' : '') + '">' + line.over + '</td><td>' + ui.statusTag(state.label, state.tone) + '</td></tr>';
    }).join('');
    $('headerProgress').textContent = progressText();
    $('headerProgress').className = overLines ? 'demand-danger' : '';
  }

  function renderHeader() {
    $('headerDemandNo').textContent = demand.no;
    $('headerCustomerValue').textContent = demand.customer || '--';
    $('headerServiceReqValue').textContent = demand.status === 'created' ? '--' : demand.serviceReq;
    $('sourceDemandNo').textContent = demand.no;
    $('selectedSourceDemand').textContent = demand.no;
    $('serviceRequirementValue').textContent = demand.serviceRequirement;
    $('customerRemarkValue').textContent = demand.customerRemark;

    const pending = pendingVersion();
    const current = currentVersion();
    const effective = latestReceivedVersion();
    let versionLabel = '当前有效 ' + demand.currentVersion;
    if (demand.status === 'created') versionLabel = '当前版本 ' + demand.currentVersion;
    if (demand.status === 'pending') versionLabel = '待接收版本 ' + demand.currentVersion;
    if (demand.status === 'rejected') versionLabel = '无有效版本';
    if (demand.status === 'completed') versionLabel = '最终版本 ' + demand.currentVersion;

    $('headerCurrentVersion').textContent = versionLabel;
    $('overviewCurrentVersion').textContent = demand.status === 'rejected' ? '--' : demand.currentVersion;
    $('lastReceivedVersion').textContent = effective;
    const versionLabelMap = {
      created: '当前版本', pending: '待接收版本', received: '当前有效版本', rejected: '有效版本', completed: '最终版本'
    };
    $('overviewVersionLabel').textContent = versionLabelMap[demand.status];
    const latestEffective = effectiveVersions().slice(-1)[0] || null;
    const rejectedVersion = demand.versions.filter((version) => version.status === 'rejected').slice(-1)[0] || null;
    const rejectedEvent = demand.timeline.filter((item) => item.title.indexOf('已驳回') >= 0).slice(-1)[0] || null;
    let handledBy = '--';
    let handledAt = '--';
    if (demand.status === 'received' || demand.status === 'completed') {
      handledBy = latestEffective ? latestEffective.handledBy : '--';
      handledAt = latestEffective ? latestEffective.effectiveAt : '--';
    } else if (demand.status === 'rejected') {
      handledBy = rejectedVersion ? rejectedVersion.handledBy : '--';
      handledAt = rejectedEvent ? rejectedEvent.time : '--';
    }
    $('overviewHandledBy').textContent = handledBy;
    $('overviewHandledAt').textContent = handledAt;
    $('rejectionRecord').textContent = rejectedVersion
      ? rejectedVersion.version + ' 于 ' + (rejectedEvent ? rejectedEvent.time : '--') + ' 被驳回：' + rejectedVersion.reason
      : '暂无驳回记录';
    $('headerStatusBadge').textContent = statusLabels[demand.status];
    $('headerStatusBadge').className = 'status ' + statusTones[demand.status];
    $('overviewStatus').textContent = statusLabels[demand.status];
    document.title = '客户需求单详情 · ' + statusLabels[demand.status];

    const banner = $('pendingVersionBanner');
    const bannerText = banner.querySelector('span');
    banner.classList.remove('is-info', 'is-error', 'is-success');
    banner.hidden = false;
    if (demand.status === 'created') {
      banner.classList.add('is-info');
      bannerText.innerHTML = '<strong>手工创建，无来源需求。</strong>需求尚未提交，提交后将进入待接收状态。';
    } else if (demand.status === 'pending') {
      bannerText.innerHTML = '<strong>需求待接收。</strong>接收后当前版本立即生效；驳回后原版本永久只读，如需再次提交将生成新版本。';
    } else if (demand.status === 'rejected') {
      banner.classList.add('is-error');
      bannerText.innerHTML = '<strong>需求已驳回。</strong>' + ui.escapeHtml(current ? current.reason : '') + '。原版本不能再次接收，可重新提交为新版本。';
    } else if (demand.status === 'completed') {
      banner.classList.add('is-success');
      bannerText.innerHTML = '<strong>客户需求已完成。</strong>当前版本、客户订单和合同均为只读，不再接收新版本。';
    } else if (pending) {
      bannerText.innerHTML = '<strong>' + pending.version + ' 待接收。</strong>接收后立即成为当前有效版本；也可驳回并保留 ' + demand.currentVersion + ' 继续执行。';
    } else {
      banner.hidden = true;
    }

    const secondaryBtn = $('modifyBtn');
    const primaryBtn = $('createOrderBtn');
    const createdButtons = [$('saveCreatedBtn'), $('submitCreatedBtn'), $('submitLogisticsBtn'), $('submitDelegationBtn')];
    const isCreated = demand.status === 'created';
    createdButtons.forEach((button) => { button.hidden = !isCreated; button.disabled = false; });
    secondaryBtn.hidden = isCreated;
    primaryBtn.hidden = isCreated;
    secondaryBtn.className = 'btn outline-primary';
    primaryBtn.className = 'btn primary';
    secondaryBtn.disabled = false;
    primaryBtn.disabled = false;

    if (demand.status === 'pending') {
      secondaryBtn.textContent = '驳回需求';
      secondaryBtn.className = 'btn danger';
      primaryBtn.textContent = '接收需求';
    } else if (demand.status === 'received') {
      secondaryBtn.textContent = pending ? '处理待接收版本' : '发起修改单';
      primaryBtn.textContent = '创建客户订单';
    } else if (demand.status === 'rejected') {
      secondaryBtn.hidden = true;
      primaryBtn.textContent = '重新提交';
    } else if (demand.status === 'completed') {
      secondaryBtn.hidden = true;
      primaryBtn.hidden = true;
    }
    const canCreateOrder = demand.status === 'received' && Boolean(current);
    $('createOrderInlineBtn').hidden = demand.status !== 'received';
    $('createOrderInlineBtn').disabled = !canCreateOrder;
    $('modifyFromChangesBtn').hidden = demand.status !== 'received';
    $('modifyFromChangesBtn').disabled = demand.status !== 'received' || Boolean(pending);
    $('modifyFromChangesBtn').title = pending ? '请先处理待接收版本' : '';

    const completeBtn = $('completeDemandBtn');
    completeBtn.hidden = demand.status !== 'received';
    completeBtn.disabled = Boolean(pending);
    completeBtn.title = pending ? '请先接收或驳回待处理版本' : '';
  }
  function selectedOrder() {
    return demand.orders.find((order) => order.id === selectedOrderId) || demand.orders[0] || null;
  }

  function renderOrders() {
    $('orderCountLabel').textContent = demand.orders.length + ' 单';
    if (demand.orders.length === 0) {
      const emptyOrderText = demand.status === 'received'
        ? '尚未生成客户订单。点击“创建客户订单”从当前有效版本开始安排。'
        : '尚未生成客户订单。需求接收后才能从有效版本创建订单。';
      $('orderListBody').innerHTML = '<tr><td colspan="9"><div class="demand-empty-inline">' + emptyOrderText + '</div></td></tr>';
    } else {
      $('orderListBody').innerHTML = demand.orders.map((order) => {
        const line = demand.lines.find((item) => item.id === order.lineId) || { no: '--' };
        return '<tr data-order-id="' + ui.escapeHtml(order.id) + '" class="' + (order.id === selectedOrderId ? 'is-selected' : '') + '">' +
          '<td><span class="cell-link">' + ui.escapeHtml(order.id) + '</span></td>' +
          '<td>' + ui.statusTag(order.status, order.statusTone) + '</td>' +
          '<td>需求行 ' + line.no + '</td>' +
          '<td>' + ui.escapeHtml(order.version) + '</td>' +
          '<td>' + ui.escapeHtml(order.consignmentNo || '--') + '</td>' +
          '<td>' + ui.escapeHtml(order.contractNo || '--') + '</td>' +
          '<td class="num">' + order.qty + ' 吨</td>' +
          '<td>' + ui.escapeHtml(order.createdAt) + '</td>' +
          '<td class="action-cell"><button class="btn link" type="button" data-select-order="' + ui.escapeHtml(order.id) + '">查看信息</button></td>' +
        '</tr>';
      }).join('');
    }

    const order = selectedOrder();
    if (!order) {
      $('selectedOrderCaption').textContent = '暂无订单';
      $('selectedOrderSummary').innerHTML = '<span class="demand-muted">暂无客户订单信息</span>';
      ['selectedSourceVersion', 'selectedConsignmentNo', 'selectedContractNo', 'selectedOrderNo', 'selectedOrderStatus', 'selectedOrderAmount', 'selectedTransportDate', 'selectedOrderRemark'].forEach((id) => { $(id).textContent = '--'; });
      $('openOrderDetailBtn').hidden = true;
      $('selectedOrderItemsBody').innerHTML = '<tr><td colspan="7"><div class="demand-empty-inline">暂无订单货物明细</div></td></tr>';
      renderContract(null);
      return;
    }

    selectedOrderId = order.id;
    const line = demand.lines.find((item) => item.id === order.lineId) || {};
    $('selectedOrderCaption').textContent = order.id;
    $('selectedOrderSummary').innerHTML = '<strong>' + ui.escapeHtml(order.id) + '</strong>' + ui.statusTag(order.status, order.statusTone) + '<span class="demand-muted">需求行 ' + (line.no || '--') + ' · ' + ui.escapeHtml(line.name || '--') + ' · ' + order.qty + ' 吨</span>';
    $('selectedSourceVersion').textContent = order.version;
    $('selectedConsignmentNo').textContent = order.consignmentNo || '--';
    $('selectedContractNo').textContent = order.contractNo || '--';
    $('selectedOrderNo').textContent = order.id;
    $('selectedOrderStatus').textContent = order.status;
    $('selectedOrderAmount').textContent = currency(order.amount);
    $('selectedTransportDate').textContent = order.transportDate || '--';
    $('selectedOrderRemark').textContent = order.remark || '--';
    $('openOrderDetailBtn').hidden = false;
    $('openOrderDetailBtn').href = 'customer-order-detail-prototype.html?no=' + encodeURIComponent(order.id) + '&from=customer-demand-detail-prototype.html';
    $('selectedOrderItemsBody').innerHTML = (order.items || []).map((item) =>
      '<tr><td>' + item.no + '</td><td>' + ui.escapeHtml(item.name) + '</td><td>' + ui.escapeHtml(item.spec) + '</td><td class="num">' + item.qty + '</td><td>' + item.unit + '</td><td class="num">' + currency(item.price) + '</td><td class="num">' + currency(item.qty * item.price) + '</td></tr>'
    ).join('') || '<tr><td colspan="7"><div class="demand-empty-inline">暂无订单货物明细</div></td></tr>';
    renderContract(order.contract);
  }

  function renderContract(contract) {
    const content = $('contractContent');
    const empty = $('contractEmptyState');
    const statusTag = $('contractStatusTag');
    if (!contract) {
      content.hidden = true;
      empty.hidden = false;
      statusTag.hidden = true;
      return;
    }
    content.hidden = false;
    empty.hidden = true;
    statusTag.hidden = false;
    statusTag.textContent = contract.state;
    statusTag.className = 'status ' + (contract.state === '已生效' ? 'done' : 'pending');
    $('contractNoValue').textContent = contract.no;
    $('contractNameValue').textContent = contract.name;
    $('contractStateValue').textContent = contract.state;
    $('contractAmountValue').textContent = currency(contract.amount);
    $('contractItemsBody').innerHTML = contract.items.map((item) =>
      '<tr><td>' + item.no + '</td><td>' + ui.escapeHtml(item.name) + '</td><td>' + ui.escapeHtml(item.spec) + '</td><td class="num">' + item.contractQty + '</td><td>' + item.unit + '</td><td class="num">' + item.usedQty + '</td><td class="num">' + currency(item.price) + '</td><td class="num">' + currency(item.amount) + '</td></tr>'
    ).join('');
  }

  function renderVersions() {
    const versions = [...demand.versions].sort((a, b) => Number(b.version.slice(1)) - Number(a.version.slice(1)));
    $('versionTableBody').innerHTML = versions.map((version) => {
      const isCurrent = version.version === demand.currentVersion && version.status === 'received';
      const isCurrentDraft = version.version === demand.currentVersion && version.status === 'created';
      const meta = versionStatus[version.status];
      let marker = '';
      if (isCurrent) marker = '<span class="demand-version-current">' + (demand.status === 'completed' ? '最终版本' : '当前有效') + '</span>';
      if (isCurrentDraft) marker = '<span class="demand-version-current">当前版本</span>';
      let actions = '<button class="btn link" type="button" data-version-action="compare" data-version="' + version.version + '">版本差异</button>';
      if (version.status === 'pending' && demand.status !== 'completed') {
        actions += '<button class="btn link" type="button" data-version-action="receive" data-version="' + version.version + '">接收此版本</button>';
        actions += '<button class="btn link demand-danger" type="button" data-version-action="reject" data-version="' + version.version + '">驳回此版本</button>';
      } else if (version.status === 'rejected' && demand.status !== 'completed') {
        actions += '<button class="btn link" type="button" data-version-action="resubmit" data-version="' + version.version + '">重新提交</button>';
      }
      return '<tr><td><span class="version-chip">' + version.version + '</span>' + marker + '</td>' +
        '<td>' + ui.escapeHtml(version.type) + '</td>' +
        '<td>' + ui.escapeHtml(version.changeNo) + '</td>' +
        '<td>' + ui.statusTag(meta.label, meta.tone) + '</td>' +
        '<td>' + ui.escapeHtml(version.submittedAt) + '</td>' +
        '<td>' + ui.escapeHtml(version.handledBy) + '</td>' +
        '<td>' + ui.escapeHtml(version.effectiveAt) + '</td>' +
        '<td class="action-cell">' + actions + '</td></tr>';
    }).join('');
  }

  function renderTimeline() {
    $('timelineList').innerHTML = demand.timeline.map((item) =>
      '<li class="demand-timeline-item"><div class="demand-timeline-time">' + ui.escapeHtml(item.time) + '</div><span class="demand-timeline-dot" aria-hidden="true"></span><div class="demand-timeline-copy"><strong>' + ui.escapeHtml(item.title) + '</strong><p>' + ui.escapeHtml(item.text) + '</p></div></li>'
    ).join('');
  }

  function renderAll() {
    renderHeader();
    syncCreateSections();
    renderOverviewLines();
    renderProgress();
    renderOrders();
    renderVersions();
    renderTimeline();
  }

  function activateTab(tabName) {
    const map = { overview: 'overviewPanel', orders: 'ordersPanel', changes: 'changesPanel' };
    const tabButtons = [$('overviewTab'), $('ordersTab'), $('changesTab')];
    tabButtons.forEach((button) => {
      const key = button.id.replace('Tab', '');
      const active = key === tabName;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      $(map[key]).hidden = !active;
    });
    if (tabName === 'orders') renderOrders();
    if (tabName === 'changes') renderVersions();
  }

  function openActionDialog(options) {
    dialog.innerHTML = '<form id="dialogForm" novalidate>' +
      '<div class="demand-dialog-head"><h2 id="actionDialogTitle">' + ui.escapeHtml(options.title) + '</h2><button class="demand-dialog-close" type="button" data-dialog-close aria-label="关闭"><svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>' +
      '<div class="demand-dialog-body">' + (options.body || '') + '</div>' +
      '<div class="demand-dialog-footer"><button class="btn" type="button" data-dialog-close>' + ui.escapeHtml(options.cancelText || '取消') + '</button><button class="btn ' + (options.confirmClass || 'primary') + '" type="submit" id="dialogSubmitBtn">' + ui.escapeHtml(options.confirmText || '确认') + '</button></div>' +
      '</form>';
    const form = $('dialogForm');
    const submitBtn = $('dialogSubmitBtn');
    dialog.querySelectorAll('[data-dialog-close]').forEach((button) => {
      button.addEventListener('click', () => ui.closeDialog(dialog));
    });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (options.onSubmit && await options.onSubmit({ form, submitBtn }) === false) return;
      ui.closeDialog(dialog);
    });
    ui.openDialog(dialog);
    if (options.onMount) options.onMount({ form, submitBtn });
  }
  function previousEffective(versionNo) {
    const currentIndex = demand.versions.findIndex((item) => item.version === versionNo);
    for (let i = currentIndex - 1; i >= 0; i -= 1) {
      if (demand.versions[i].status === 'received') return demand.versions[i];
    }
    return null;
  }

  function compareVersion(versionNo) {
    const version = demand.versions.find((item) => item.version === versionNo);
    if (!version) return;
    const previous = previousEffective(versionNo);
    const rows = demand.lines.map((line) => {
      const before = previous ? previous.snapshot.quantities[line.id] : '--';
      const after = version.snapshot.quantities[line.id];
      return '<tr><th>需求行 ' + line.no + '：' + ui.escapeHtml(line.name) + '</th><td>' + before + ' ' + line.unit + '</td><td>' + after + ' ' + line.unit + '</td></tr>';
    }).join('');
    const previousDate = previous ? previous.snapshot.pickupDate : '--';
    const reason = version.reason ? '<div class="demand-dialog-note"><strong>变更说明：</strong>' + ui.escapeHtml(version.reason) + '</div>' : '';
    openActionDialog({
      title: version.version + ' 版本差异',
      body: '<p class="demand-dialog-copy">仅展示本版本相对前一有效版本的主要变化。提交版本号保持不变，接收只生效一次。</p><div class="demand-data-table-wrap"><table class="demand-compare-table"><thead><tr><th>字段</th><th>变更前</th><th>变更后</th></tr></thead><tbody>' +
        rows + '<tr><th>计划提货日期</th><td>' + ui.escapeHtml(previousDate) + '</td><td>' + ui.escapeHtml(version.snapshot.pickupDate) + '</td></tr></tbody></table></div>' + reason,
      confirmText: '关闭',
      cancelText: '返回',
      onSubmit: () => true
    });
  }

  function receiveVersion(versionNo) {
    const version = demand.versions.find((item) => item.version === versionNo);
    if (demand.status === 'completed') {
      ui.showToast('客户需求已完成，不能接收新版本', 'error');
      return;
    }
    if (!version || version.status !== 'pending') {
      ui.showToast('该版本已处理，不能重复接收', 'error');
      return;
    }
    openActionDialog({
      title: '接收此版本',
      body: '<p class="demand-dialog-copy">接收 <strong>' + version.version + '</strong> 后立即成为当前有效版本，不进入审批或待生效状态。已生成客户订单不会随版本变化自动修改。</p><div class="demand-dialog-note">同一提交版本只能接收一次。操作将写入接收人、接收时间和流转记录。</div>',
      confirmText: '接收并生效',
      onSubmit: async ({ submitBtn }) => {
        if (window.UIState) UIState.setButtonLoading(submitBtn, true, '接收中');
        await ui.delay(380);
        demand.versions.forEach((item) => { item.isCurrent = false; });
        version.status = 'received';
        version.handledBy = '苏丽蓉';
        version.effectiveAt = nowText();
        version.isCurrent = true;
        demand.currentVersion = version.version;
        demand.status = 'received';
        demand.pickupDate = version.snapshot.pickupDate;
        demand.lines.forEach((line) => { line.required = Number(version.snapshot.quantities[line.id] || line.required); });
        $('pickupDate').textContent = version.snapshot.pickupDate;
        demand.timeline.push({ time: version.effectiveAt, title: version.version + ' 已接收', text: '苏丽蓉接收版本 ' + version.version + '，版本即时生效。' });
        if (window.UIState) UIState.setButtonLoading(submitBtn, false);
        renderAll();
        ui.showToast(version.version + ' 已接收并生效', 'success');
      }
    });
  }

  function rejectVersion(versionNo) {
    const version = demand.versions.find((item) => item.version === versionNo);
    if (demand.status === 'completed') {
      ui.showToast('客户需求已完成，不能驳回版本', 'error');
      return;
    }
    if (!version || version.status !== 'pending') {
      ui.showToast('该版本已处理，不能重复驳回', 'error');
      return;
    }
    openActionDialog({
      title: '驳回此版本',
      body: '<p class="demand-dialog-copy">驳回后，如已有当前有效版本则继续执行；如尚无有效版本，需求将进入已驳回状态。原驳回版本只读，如需再次提交，将生成新的版本。</p>' +
        '<div class="demand-dialog-grid"><div class="demand-dialog-field field span-2"><label for="rejectReason">驳回原因<span class="required">*</span></label><textarea id="rejectReason" name="reason" required placeholder="请填写驳回原因"></textarea><div class="ui-field-message"></div></div></div>',
      confirmText: '确认驳回',
      confirmClass: 'danger',
      onSubmit: async ({ form, submitBtn }) => {
        const field = form.elements.reason;
        if (!field.value.trim()) {
          UIState.setFieldState(field, 'invalid', '请填写驳回原因');
          field.focus();
          return false;
        }
        UIState.setButtonLoading(submitBtn, true, '驳回中');
        await ui.delay(320);
        version.status = 'rejected';
        version.handledBy = '苏丽蓉';
        version.effectiveAt = '--';
        version.reason = field.value.trim();
        demand.status = effectiveVersions().length ? 'received' : 'rejected';
        demand.timeline.push({ time: nowText(), title: version.version + ' 已驳回', text: '苏丽蓉驳回：' + version.reason });
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        ui.showToast(effectiveVersions().length ? version.version + ' 已驳回，当前仍按 ' + demand.currentVersion + ' 执行' : version.version + ' 已驳回，需求暂无有效版本', 'success');
      }
    });
  }

  function resubmitVersion(versionNo) {
    const version = demand.versions.find((item) => item.version === versionNo);
    if (demand.status === 'completed') {
      ui.showToast('客户需求已完成，不能重新提交', 'error');
      return;
    }
    if (!version || version.status !== 'rejected') return;
    const nextNumber = Math.max(...demand.versions.map((item) => Number(item.version.slice(1)))) + 1;
    const nextVersion = 'V' + nextNumber;
    openActionDialog({
      title: '重新提交为新版本',
      body: '<p class="demand-dialog-copy">客户需求单号保持不变。原 ' + version.version + ' 继续保持已驳回，本次将在同一需求单号下生成 <strong>' + nextVersion + '</strong>，用于新的接收判断。</p><div class="demand-dialog-note">新版本生成一次接收动作；原版本不能重新接收。</div>',
      confirmText: '生成 ' + nextVersion,
      onSubmit: async ({ submitBtn }) => {
        UIState.setButtonLoading(submitBtn, true, '提交中');
        await ui.delay(300);
        const copy = JSON.parse(JSON.stringify(version.snapshot));
        demand.versions.push({ version: nextVersion, type: '重新提交', changeNo: '--', status: 'pending', submittedAt: nowText(), handledBy: '--', effectiveAt: '--', reason: '重新提交已驳回版本 ' + version.version, snapshot: copy });
        if (!effectiveVersions().length) {
          demand.currentVersion = nextVersion;
          demand.status = 'pending';
        }
        demand.timeline.push({ time: nowText(), title: nextVersion + ' 重新提交', text: '基于 ' + version.version + ' 重新提交，同客户需求单号下生成新版本。' });
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        activateTab('changes');
        ui.showToast('已生成待接收版本 ' + nextVersion, 'success');
      }
    });
  }
  function latestRejectedVersion() {
    const rejected = demand.versions.filter((version) => version.status === 'rejected');
    return rejected.length ? rejected[rejected.length - 1] : null;
  }

  function readCreateForm() {
    const form = $('createDemandForm');
    if (!form) return false;
    demand.customer = form.elements.customer.value.trim();
    demand.contactName = form.elements.contact.value.trim();
    demand.contactPhone = form.elements.phone.value.trim();
    demand.contactEmail = form.elements.email.value.trim();
    demand.businessType = form.elements.bizType.value;
    demand.serviceScopeText = form.elements.serviceScope.value.trim();
    demand.transportType = form.elements.transportType.value;
    demand.tradeTerms = form.elements.tradeTerms.value;
    demand.origin = form.elements.origin.value.trim();
    demand.destination = form.elements.destination.value.trim();
    demand.pickupDate = form.elements.pickupDate.value;
    demand.deliveryDate = form.elements.deliveryDate.value;
    demand.serviceRequirement = form.elements.serviceRequirement.value.trim();
    demand.customerRemark = form.elements.customerRemark.value.trim();
    demand.serviceItems = Array.from(form.querySelectorAll('input[name="serviceItems"]:checked')).map((input) => input.value);
    demand.shippingCategories = Array.from(form.querySelectorAll('input[name="shippingCategories"]:checked')).map((input) => input.value);
    demand.extensionScenes = Array.from(form.querySelectorAll('input[name="extensionScenes"]:checked')).map((input) => input.value);

    const rows = Array.from(document.querySelectorAll('#createProductBody [data-product-row]'));
    demand.lines = rows.map((row, index) => {
      const lineId = row.dataset.lineId;
      const existing = demand.lines.find((line) => line.id === lineId) || {};
      const tradeContractNo = row.querySelector('.product-trade').value;
      const name = row.querySelector('.product-name').value.trim();
      const required = Number(row.querySelector('.product-qty').value || 0);
      const unit = row.querySelector('.product-unit').value;
      const packageQty = Number(row.querySelector('.product-package-qty').value || 0);
      const packageUnit = row.querySelector('.product-package-unit').value;
      const overRate = Number(row.querySelector('.product-over-rate').value || 0);
      const underRate = Number(row.querySelector('.product-under-rate').value || 0);
      return {
        ...existing,
        id: lineId,
        no: index + 1,
        tradeContractNo,
        name,
        required,
        unit,
        packageQty,
        packageUnit,
        overRate,
        underRate,
        packaging: packageQty ? packageQty + ' ' + packageUnit : '--',
        spec: existing.spec || '--',
        note: existing.note || '--',
        price: existing.price || 0
      };
    });

    demand.booking = {
      salesContractNo: form.elements.salesContractNo.value.trim(),
      purchaseContractNo: form.elements.purchaseContractNo.value.trim(),
      contractHeader: form.elements.contractHeader.value.trim(),
      customer: form.elements.bookingCustomer.value.trim() || demand.customer,
      factory: form.elements.factory.value.trim(),
      tradeType: form.elements.bookingTradeType.value.trim(),
      salesPriceTerm: form.elements.salesPriceTerm.value.trim(),
      purchasePriceTerm: form.elements.purchasePriceTerm.value.trim(),
      externalDeliveryDate: form.elements.externalDeliveryDate.value,
      findCarrier: form.elements.findCarrier.value,
      directSailing: form.elements.directSailing.value,
      latestShipmentDate: form.elements.latestShipmentDate.value,
      dischargeTerms: form.elements.dischargeTerms.value.trim(),
      freightEstimate: form.elements.freightEstimate.value.trim(),
      portChargeEstimate: form.elements.portChargeEstimate.value.trim(),
      vesselAgeRequirement: form.elements.vesselAgeRequirement.value.trim(),
      vesselTypeRequirement: form.elements.vesselTypeRequirement.value.trim(),
      coilWeight: form.elements.coilWeight.value.trim() || '--',
      length: document.getElementById('createLength').value.trim() || '--',
      clientDocumentOfficer: form.elements.clientDocumentOfficer.value.trim()
    };

    const version = currentVersion();
    if (version) version.snapshot.pickupDate = demand.pickupDate || version.snapshot.pickupDate;
    renderDemandInfoValues();
    updateBookingSectionVisibility();
    return true;
  }

  function validateCreateGroups(form) {
    const serviceInput = form.querySelector('input[name="serviceItems"]');
    const serviceChecked = form.querySelectorAll('input[name="serviceItems"]:checked').length > 0;
    const shippingInput = form.querySelector('input[name="shippingCategories"]');
    const shippingChecked = form.querySelectorAll('input[name="shippingCategories"]:checked').length > 0;
    if (!serviceChecked) UIState.setFieldState(serviceInput, 'invalid', '请选择至少一项服务项');
    if (!shippingChecked) UIState.setFieldState(shippingInput, 'invalid', '请选择至少一项装运类别');
    if (!serviceChecked || !shippingChecked) {
      (serviceChecked ? shippingInput : serviceInput).focus();
      return false;
    }

    const rows = Array.from(document.querySelectorAll('#createProductBody [data-product-row]'));
    const invalidRow = rows.find((row) => !row.querySelector('.product-name').value.trim() || !row.querySelector('.product-qty').value || Number(row.querySelector('.product-qty').value) <= 0);
    if (!rows.length || invalidRow) {
      UIState.showFormAlert(form, 'error', '请至少填写一条完整的商品信息，商品名称和标准数量不能为空。');
      return false;
    }

    const bookingChecked = form.querySelector('input[name="extensionScenes"][value="订舱"]')?.checked;
    if (bookingChecked && !form.elements.latestShipmentDate.value) {
      UIState.showFormAlert(form, 'error', '订舱场景下，最迟装运期不能为空。');
      form.elements.latestShipmentDate.focus();
      return false;
    }
    return true;
  }

  function saveCreateDraft(validateRequired, silent) {
    const form = $('createDemandForm');
    if (!form) return false;
    if (validateRequired) {
      UIState.clearFormAlert(form);
      const result = UIState.validateRequired(form);
      if (!result.valid || !validateCreateGroups(form)) {
        ui.showToast('请先完善必填字段', 'error');
        return false;
      }
    }
    readCreateForm();
    renderHeader();
    if (!silent) ui.showToast('客户需求已保存，当前仍为创建状态', 'success');
    return true;
  }

  function openSplitArrangementModal(kind) {
    const isDelegation = kind === 'delegation';
    const targetName = isDelegation ? '物流委托' : '物流需求';
    const body = '<p class="demand-dialog-copy">提交成功。请按商品拆分本次' + targetName + '安排数量，可点击“拆分”继续拆分同一商品。</p>' +
      '<div class="demand-data-table-wrap"><table class="demand-compare-table" id="arrangementTable"><thead><tr><th>商品/服务</th><th>规格</th><th>需求数量</th><th>本次安排数量</th><th>操作</th></tr></thead><tbody>' +
      demand.lines.map((line) => '<tr data-line-id="' + line.id + '"><td>' + ui.escapeHtml(line.name) + '</td><td>' + ui.escapeHtml(line.spec) + '</td><td>' + line.required + ' ' + line.unit + '</td><td><input class="arrangement-qty" type="number" min="0" step="0.01" value="' + line.required + '" aria-label="' + ui.escapeHtml(line.name) + '安排数量"></td><td><button class="btn link" type="button" data-split-line>拆分</button><button class="btn link demand-danger" type="button" data-remove-line hidden>移除</button></td></tr>').join('') +
      '</tbody></table></div><div class="demand-dialog-note" id="arrangementSummary">按当前数量生成 1 条' + targetName + '。</div>' +
      '<div class="demand-dialog-grid" style="margin-top:12px"><div class="demand-dialog-field field span-2"><label for="arrangementNote">安排说明</label><textarea id="arrangementNote" name="note" placeholder="请输入商品拆分或安排说明"></textarea><div class="ui-field-message"></div></div></div>';

    openActionDialog({
      title: '拆分商品并生成' + targetName,
      body,
      confirmText: '确认生成' + targetName,
      onMount: ({ form }) => {
        const table = document.getElementById('arrangementTable');
        const summary = document.getElementById('arrangementSummary');
        const updateSummary = () => {
          const rows = Array.from(table.querySelectorAll('tbody tr'));
          const byLine = {};
          rows.forEach((row) => {
            const lineId = row.dataset.lineId;
            const qty = Number(row.querySelector('.arrangement-qty').value || 0);
            byLine[lineId] = (byLine[lineId] || 0) + qty;
          });
          const overLines = demand.lines.filter((line) => (byLine[line.id] || 0) > line.required);
          summary.className = 'demand-dialog-note' + (overLines.length ? ' is-warning' : '');
          summary.textContent = overLines.length
            ? '有 ' + overLines.length + ' 个商品的安排数量超过需求数量，请调整后再提交。'
            : '本次将生成 ' + rows.filter((row) => Number(row.querySelector('.arrangement-qty').value || 0) > 0).length + ' 条' + targetName + '。';
        };
        table.addEventListener('click', (event) => {
          const splitBtn = event.target.closest('[data-split-line]');
          const removeBtn = event.target.closest('[data-remove-line]');
          if (splitBtn) {
            const row = splitBtn.closest('tr');
            const input = row.querySelector('.arrangement-qty');
            const current = Number(input.value || 0);
            if (current <= 1) {
              UIState.showFormAlert(form, 'warning', '当前安排数量不足 1，无法继续拆分。');
              return;
            }
            const first = Math.round((current / 2) * 100) / 100;
            input.value = first;
            const clone = row.cloneNode(true);
            clone.querySelector('.arrangement-qty').value = Math.round((current - first) * 100) / 100;
            clone.querySelector('[data-remove-line]').hidden = false;
            row.after(clone);
            updateSummary();
            clone.querySelector('.arrangement-qty').focus();
          }
          if (removeBtn) {
            removeBtn.closest('tr').remove();
            updateSummary();
          }
        });
        table.addEventListener('input', updateSummary);
        updateSummary();
      },
      onSubmit: async ({ form, submitBtn }) => {
        const rows = Array.from(form.querySelectorAll('#arrangementTable tbody tr'));
        const totals = {};
        rows.forEach((row) => {
          const qty = Number(row.querySelector('.arrangement-qty').value || 0);
          totals[row.dataset.lineId] = (totals[row.dataset.lineId] || 0) + qty;
        });
        const hasArrangement = Object.values(totals).some((qty) => qty > 0);
        if (!hasArrangement) {
          UIState.showFormAlert(form, 'error', '请至少填写一条商品的安排数量。');
          return false;
        }
        const overLine = demand.lines.find((line) => (totals[line.id] || 0) > line.required);
        if (overLine) {
          UIState.showFormAlert(form, 'error', overLine.name + '的安排数量超过需求数量，请调整后再提交。');
          return false;
        }
        UIState.setButtonLoading(submitBtn, true, '生成中');
        await ui.delay(420);
        const generatedNo = (isDelegation ? 'WT20261030' : 'LD20261030') + String(Date.now()).slice(-6);
        demand.timeline.push({ time: nowText(), title: '已生成' + targetName, text: '商品拆分完成，生成' + targetName + ' ' + generatedNo + '。' });
        renderAll();
        UIState.setButtonLoading(submitBtn, false);
        ui.showToast(targetName + ' ' + generatedNo + ' 已生成', 'success');
      }
    });
  }

  function submitCreatedDemand(kind) {
    if (demand.status !== 'created') return;
    if (!saveCreateDraft(true, true)) return;
    const version = currentVersion();
    version.status = 'pending';
    version.handledBy = '--';
    version.effectiveAt = '--';
    demand.status = 'pending';
    demand.timeline.push({ time: nowText(), title: version.version + ' 已提交', text: kind === 'submit' ? '客户需求已提交，进入待接收状态。' : '客户需求已提交，准备生成' + (kind === 'delegation' ? '物流委托' : '物流需求') + '。' });
    renderAll();
    if (kind === 'logistics' || kind === 'delegation') {
      window.setTimeout(() => openSplitArrangementModal(kind), 60);
    } else {
      ui.showToast('提交成功，等待接收', 'success');
    }
  }

  function openEditDemand() {
    if (demand.status !== 'created') {
      ui.showToast('仅创建状态可以编辑需求', 'error');
      return;
    }
    openActionDialog({
      title: '编辑客户需求',
      body: '<div class="demand-dialog-grid">' +
        '<div class="demand-dialog-field field span-2"><label for="editServiceRequirement">服务要求<span class="required">*</span></label><textarea id="editServiceRequirement" name="serviceRequirement" required>' + ui.escapeHtml(demand.serviceRequirement) + '</textarea><div class="ui-field-message"></div></div>' +
        '<div class="demand-dialog-field field span-2"><label for="editCustomerRemark">客户备注</label><textarea id="editCustomerRemark" name="customerRemark">' + ui.escapeHtml(demand.customerRemark) + '</textarea><div class="ui-field-message"></div></div>' +
        '</div>',
      confirmText: '保存修改',
      onSubmit: async ({ form, submitBtn }) => {
        const service = form.elements.serviceRequirement;
        if (!service.value.trim()) {
          UIState.setFieldState(service, 'invalid', '请填写服务要求');
          service.focus();
          return false;
        }
        UIState.setButtonLoading(submitBtn, true, '保存中');
        await ui.delay(260);
        demand.serviceRequirement = service.value.trim();
        demand.customerRemark = form.elements.customerRemark.value.trim() || '--';
        demand.timeline.push({ time: nowText(), title: '需求信息已编辑', text: '创建状态下的服务要求和客户备注已更新。' });
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        ui.showToast('需求信息已保存', 'success');
      }
    });
  }

  function openModification() {
    if (demand.status !== 'received') {
      ui.showToast(statusLabels[demand.status] + '状态不能发起修改单', 'error');
      return;
    }
    if (pendingVersion()) {
      activateTab('changes');
      ui.showToast('已有待接收版本，请先接收或驳回', 'error');
      return;
    }
    const lineOptions = demand.lines.map((line) => '<option value="' + line.id + '">需求行 ' + line.no + ' · ' + ui.escapeHtml(line.name) + '</option>').join('');
    openActionDialog({
      title: '发起客户需求修改单',
      body: '<p class="demand-dialog-copy">修改单不进入审批。提交后生成待接收版本，接收即立即生效；驳回则维持当前有效版本。</p>' +
        '<div class="demand-dialog-grid">' +
        '<div class="demand-dialog-field field"><label for="modifyLine">需求行<span class="required">*</span></label><select id="modifyLine" name="line">' + lineOptions + '</select><div class="ui-field-message"></div></div>' +
        '<div class="demand-dialog-field field"><label for="modifyQty">变更后数量<span class="required">*</span></label><input id="modifyQty" name="qty" type="number" min="0" step="0.01" required><div class="ui-field-message"></div></div>' +
        '<div class="demand-dialog-field field span-2"><label for="modifyPickupDate">计划提货日期</label><input id="modifyPickupDate" name="pickupDate" type="date" value="' + $('pickupDate').textContent + '"><div class="ui-field-message"></div></div>' +
        '<div class="demand-dialog-field field span-2"><label for="modifyReason">变更原因<span class="required">*</span></label><textarea id="modifyReason" name="reason" required placeholder="请说明本次修改原因"></textarea><div class="ui-field-message"></div></div>' +
        '</div>',
      confirmText: '提交修改单',
      confirmClass: 'outline-primary',
      onMount: ({ form }) => {
        const lineSelect = form.elements.line;
        const qtyInput = form.elements.qty;
        const syncQty = () => {
          const line = demand.lines.find((item) => item.id === lineSelect.value);
          qtyInput.value = line ? line.required : '';
        };
        syncQty();
        lineSelect.addEventListener('change', syncQty);
      },
      onSubmit: async ({ form, submitBtn }) => {
        const reason = form.elements.reason;
        const qty = Number(form.elements.qty.value);
        if (!reason.value.trim()) {
          UIState.setFieldState(reason, 'invalid', '请填写变更原因');
          reason.focus();
          return false;
        }
        if (!form.elements.qty.value.trim() || !Number.isFinite(qty) || qty < 0) {
          UIState.setFieldState(form.elements.qty, 'invalid', '请输入大于等于 0 的数量');
          form.elements.qty.focus();
          return false;
        }
        UIState.setButtonLoading(submitBtn, true, '提交中');
        await ui.delay(340);
        const nextNumber = Math.max(...demand.versions.map((item) => Number(item.version.slice(1)))) + 1;
        const nextVersion = 'V' + nextNumber;
        const snapshot = JSON.parse(JSON.stringify(currentVersion().snapshot));
        snapshot.quantities[form.elements.line.value] = qty;
        snapshot.pickupDate = form.elements.pickupDate.value || snapshot.pickupDate;
        demand.versions.push({ version: nextVersion, type: '需求修改', changeNo: 'M20261030' + String(nextNumber).padStart(3, '0'), status: 'pending', submittedAt: nowText(), handledBy: '--', effectiveAt: '--', reason: reason.value.trim(), snapshot });
        demand.timeline.push({ time: nowText(), title: nextVersion + ' 待接收', text: '客户需求修改单已提交：' + reason.value.trim() });
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        activateTab('changes');
        ui.showToast('修改单已提交，生成待接收版本 ' + nextVersion, 'success');
      }
    });
  }

  function openCreateOrder() {
    if (demand.status !== 'received' || !currentVersion()) {
      ui.showToast('当前需求没有可用的有效版本，不能创建客户订单', 'error');
      return;
    }
    const lineOptions = demand.lines.map((line) => '<option value="' + line.id + '">需求行 ' + line.no + ' · ' + ui.escapeHtml(line.name) + '（可安排 ' + Math.max(line.required - arrangedFor(line.id), 0) + ' ' + line.unit + '）</option>').join('');
    openActionDialog({
      title: '创建客户订单',
      body: '<p class="demand-dialog-copy">从当前有效版本 <strong>' + demand.currentVersion + '</strong> 带入需求信息。客户订单累计数量允许超过需求，超出时仅提示，不阻断保存。</p>' +
        '<div class="demand-dialog-grid">' +
        '<div class="demand-dialog-field field span-2"><label for="orderLine">关联需求行<span class="required">*</span></label><select id="orderLine" name="line">' + lineOptions + '</select><div class="ui-field-message"></div></div>' +
        '<div class="demand-dialog-field field"><label for="orderQty">本次安排数量<span class="required">*</span></label><input id="orderQty" name="qty" type="number" min="0.01" step="0.01" required><div class="ui-field-message"></div></div>' +
        '<div class="demand-dialog-field field"><label for="orderConsignment">客户物流委托号</label><input id="orderConsignment" name="consignment" type="text" placeholder="可稍后在订单详情补充"><div class="ui-field-message"></div></div>' +
        '<div class="demand-dialog-field field span-2"><label for="orderRemark">订单备注</label><textarea id="orderRemark" name="remark" placeholder="请输入创建订单时需同步的说明"></textarea><div class="ui-field-message"></div></div>' +
        '</div><div class="demand-dialog-note" id="orderAllocationNote"></div>',
      confirmText: '创建订单',
      onMount: ({ form }) => {
        const lineSelect = form.elements.line;
        const qtyInput = form.elements.qty;
        const note = $('orderAllocationNote');
        const sync = () => {
          const line = demand.lines.find((item) => item.id === lineSelect.value);
          if (!line) return;
          const arranged = arrangedFor(line.id);
          const remaining = Math.max(line.required - arranged, 0);
          const requested = Number(qtyInput.value || 0);
          const after = arranged + requested;
          const over = Math.max(after - line.required, 0);
          if (!qtyInput.value) qtyInput.value = remaining || 1;
          note.classList.toggle('is-warning', over > 0);
          note.innerHTML = '<strong>需求 ' + line.required + ' ' + line.unit + '</strong> · 已安排 ' + arranged + ' ' + line.unit + ' · 剩余 ' + Math.max(line.required - arranged, 0) + ' ' + line.unit + (over > 0 ? ' · 本次创建后将超出 ' + over + ' ' + line.unit : '');
        };
        lineSelect.addEventListener('change', () => { qtyInput.value = ''; sync(); });
        qtyInput.addEventListener('input', sync);
        sync();
      },
      onSubmit: async ({ form, submitBtn }) => {
        const line = demand.lines.find((item) => item.id === form.elements.line.value);
        const qty = Number(form.elements.qty.value);
        if (!line || !Number.isFinite(qty) || qty <= 0) {
          UIState.setFieldState(form.elements.qty, 'invalid', '请输入大于 0 的安排数量');
          form.elements.qty.focus();
          return false;
        }
        UIState.setButtonLoading(submitBtn, true, '创建中');
        await ui.delay(420);
        const maxSequence = demand.orders.reduce((max, order) => Math.max(max, Number(order.id.slice(-4)) || 0), 0) + 1;
        const orderNo = 'FCO20261028' + String(maxSequence).padStart(4, '0');
        const amount = qty * line.price;
        demand.orders.push({
          id: orderNo,
          status: '待安排',
          statusTone: 'pending',
          lineId: line.id,
          qty,
          version: demand.currentVersion,
          consignmentNo: form.elements.consignment.value.trim() || '--',
          contractNo: null,
          createdAt: nowText(),
          amount,
          transportDate: currentVersion().snapshot.pickupDate,
          remark: form.elements.remark.value.trim() || '--',
          items: [{ no: 1, name: line.name, spec: line.spec, qty, unit: line.unit, price: line.price }],
          contract: null
        });
        selectedOrderId = orderNo;
        demand.timeline.push({ time: nowText(), title: '创建客户订单', text: '基于需求行 ' + line.no + ' 创建客户订单 ' + orderNo + '，安排数量 ' + qty + ' ' + line.unit + '。' });
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        activateTab('orders');
        const over = arrangedFor(line.id) - line.required;
        ui.showToast(over > 0 ? '订单已创建；累计安排已超出需求 ' + over + ' ' + line.unit : '客户订单 ' + orderNo + ' 已创建', 'success');
      }
    });
  }
  function completeDemand() {
    if (demand.status === 'completed') {
      ui.showToast('客户需求已完成', 'error');
      return;
    }
    if (demand.status !== 'received') {
      ui.showToast('仅已接收状态可以完成客户需求', 'error');
      return;
    }
    const pending = pendingVersion();
    if (pending) {
      openActionDialog({
        title: '暂不能完成',
        body: '<p class="demand-dialog-copy">当前存在待接收版本 <strong>' + pending.version + '</strong>。请先接收或驳回该版本，再完成客户需求。</p><div class="demand-dialog-note">完成前不允许遗留待接收版本。</div>',
        confirmText: '前往处理',
        cancelText: '暂不完成',
        onSubmit: () => {
          activateTab('changes');
          return true;
        }
      });
      return;
    }
    openActionDialog({
      title: '完成客户需求',
      body: '<p class="demand-dialog-copy">完成后将不能继续接收版本或创建客户订单，历史客户订单与合同不受影响。</p>' +
        '<div class="demand-dialog-grid"><div class="demand-dialog-field field span-2"><label for="completeReason">完成原因<span class="required">*</span></label><textarea id="completeReason" name="reason" required placeholder="请填写完成原因"></textarea><div class="ui-field-message"></div></div></div>',
      confirmText: '确认完成',
      onSubmit: async ({ form, submitBtn }) => {
        const reason = form.elements.reason;
        if (!reason.value.trim()) {
          UIState.setFieldState(reason, 'invalid', '请填写完成原因');
          reason.focus();
          return false;
        }
        UIState.setButtonLoading(submitBtn, true, '处理中');
        await ui.delay(300);
        demand.status = 'completed';
        demand.timeline.push({ time: nowText(), title: '客户需求已完成', text: '苏丽蓉完成客户需求：' + reason.value.trim() });
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        ui.showToast('客户需求已完成', 'success');
      }
    });
  }

  function downloadFile(name, content, type) {
    const blob = new Blob(['\ufeff' + content], { type: type || 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function exportDemand() {
    const rows = [
      ['客户需求单号', demand.no],
      ['客户', demand.customer],
      ['来源服务要求号', demand.serviceReq],
      ['需求状态', statusLabels[demand.status]],
      ['当前版本', demand.currentVersion],
      ['订单生成进度', progressText()],
      ['关联客户订单数', demand.orders.length]
    ];
    downloadFile('客户需求单_' + demand.no + '.csv', rows.map((row) => row.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\r\n'));
    ui.showToast('客户需求信息已导出', 'success');
  }

  function exportVersions() {
    const headers = ['版本', '提交类型', '修改单号', '状态', '提交时间', '处理人', '生效时间', '变更原因'];
    const rows = demand.versions.map((version) => [version.version, version.type, version.changeNo, versionStatus[version.status].label, version.submittedAt, version.handledBy, version.effectiveAt, version.reason]);
    downloadFile('客户需求版本_' + demand.no + '.csv', [headers, ...rows].map((row) => row.map((cell) => '"' + String(cell || '').replace(/"/g, '""') + '"').join(',')).join('\r\n'));
    ui.showToast('变更记录已导出', 'success');
  }

  [$('overviewTab'), $('ordersTab'), $('changesTab')].forEach((button, index, buttons) => {
    button.addEventListener('click', () => activateTab(button.id.replace('Tab', '')));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = buttons.length - 1;
      const next = buttons[nextIndex];
      activateTab(next.id.replace('Tab', ''));
      next.focus();
    });
  });

  const createDemandForm = $('createDemandForm');
  createDemandForm.addEventListener('input', (event) => {
    const control = event.target;
    if (control.getAttribute('aria-invalid') === 'true' && control.value.trim()) UIState.clearFieldState(control);
  });
  createDemandForm.addEventListener('focusout', (event) => {
    const control = event.target;
    if (!control.matches('input, select, textarea') || !control.required) return;
    if (!control.value.trim()) UIState.setFieldState(control, 'invalid', (control.tagName === 'SELECT' ? '请选择' : '请填写') + (control.getAttribute('aria-label') || control.previousElementSibling?.textContent?.replace('*', '').trim() || '此项'));
    else UIState.clearFieldState(control);
  });

  createDemandForm.addEventListener('change', (event) => {
    const control = event.target;
    if (control.name === 'extensionScenes') updateBookingSectionVisibility();
    if (control.name === 'serviceItems' || control.name === 'shippingCategories') {
      const first = createDemandForm.querySelector('input[name="' + control.name + '"]');
      if (first) UIState.clearFieldState(first);
    }
  });
  $('addCreateProductBtn').addEventListener('click', () => {
    readCreateForm();
    demand.lines.push({ id: 'L' + Date.now(), no: demand.lines.length + 1, tradeContractNo: '', name: '', spec: '--', unit: '吨', required: 0, packageQty: 0, packageUnit: '袋', overRate: 0, underRate: 0, packaging: '--', note: '--', price: 0 });
    renderCreateProductRows();
    const lastRow = $('createProductBody').lastElementChild;
    if (lastRow) lastRow.querySelector('.product-name').focus();
  });
  $('createProductBody').addEventListener('click', (event) => {
    const removeBtn = event.target.closest('[data-remove-product]');
    if (!removeBtn) return;
    const row = removeBtn.closest('[data-product-row]');
    if (document.querySelectorAll('#createProductBody [data-product-row]').length <= 1) {
      ui.showToast('至少保留一条商品信息', 'error');
      return;
    }
    readCreateForm();
    demand.lines = demand.lines.filter((line) => line.id !== row.dataset.lineId).map((line, index) => ({ ...line, no: index + 1 }));
    renderCreateProductRows();
  });

  function handleSecondaryAction() {
    if (demand.status === 'created') {
      openEditDemand();
      return;
    }
    if (demand.status === 'pending') {
      const pending = pendingVersion();
      if (pending) rejectVersion(pending.version);
      return;
    }
    if (demand.status === 'received') {
      if (pendingVersion()) {
        activateTab('changes');
        ui.showToast('请先处理待接收版本 ' + pendingVersion().version, 'error');
      } else {
        openModification();
      }
    }
  }

  function handlePrimaryAction() {
    if (demand.status === 'created') {
      submitCreatedDemand('submit');
      return;
    }
    if (demand.status === 'pending') {
      const pending = pendingVersion();
      if (pending) receiveVersion(pending.version);
      return;
    }
    if (demand.status === 'received') {
      openCreateOrder();
      return;
    }
    if (demand.status === 'rejected') {
      const rejected = latestRejectedVersion();
      if (rejected) resubmitVersion(rejected.version);
    }
  }

  $('saveCreatedBtn').addEventListener('click', () => saveCreateDraft(false, false));
  $('submitCreatedBtn').addEventListener('click', () => submitCreatedDemand('submit'));
  $('submitLogisticsBtn').addEventListener('click', () => submitCreatedDemand('logistics'));
  $('submitDelegationBtn').addEventListener('click', () => submitCreatedDemand('delegation'));
  $('modifyBtn').addEventListener('click', handleSecondaryAction);
  $('modifyFromChangesBtn').addEventListener('click', openModification);
  $('createOrderBtn').addEventListener('click', handlePrimaryAction);
  $('createOrderInlineBtn').addEventListener('click', openCreateOrder);
  $('completeDemandBtn').addEventListener('click', completeDemand);
  $('exportDemandBtn').addEventListener('click', exportDemand);
  $('exportVersionsBtn').addEventListener('click', exportVersions);
  $('compareVersionMenuBtn').addEventListener('click', () => compareVersion(demand.currentVersion));

  $('orderListBody').addEventListener('click', (event) => {
    const button = event.target.closest('[data-select-order]');
    const row = event.target.closest('[data-order-id]');
    const orderId = button ? button.dataset.selectOrder : row ? row.dataset.orderId : null;
    if (!orderId) return;
    selectedOrderId = orderId;
    renderOrders();
  });

  $('versionTableBody').addEventListener('click', (event) => {
    const button = event.target.closest('[data-version-action]');
    if (!button) return;
    const versionNo = button.dataset.version;
    if (button.dataset.versionAction === 'compare') compareVersion(versionNo);
    if (button.dataset.versionAction === 'receive') receiveVersion(versionNo);
    if (button.dataset.versionAction === 'reject') rejectVersion(versionNo);
    if (button.dataset.versionAction === 'resubmit') resubmitVersion(versionNo);
  });

  $('moreBtn').addEventListener('click', (event) => {
    event.stopPropagation();
    const menu = $('moreMenu');
    menu.hidden = !menu.hidden;
    $('moreBtn').setAttribute('aria-expanded', String(!menu.hidden));
  });
  $('moreMenu').addEventListener('click', () => {
    $('moreMenu').hidden = true;
    $('moreBtn').setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.demand-menu-wrap')) {
      $('moreMenu').hidden = true;
      $('moreBtn').setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      $('moreMenu').hidden = true;
      $('moreBtn').setAttribute('aria-expanded', 'false');
    }
  });

  $('topRefreshBtn').addEventListener('click', () => window.location.reload());
  $('topExternalBtn').addEventListener('click', () => {
    const standalone = window.location.href.replace(/[?&]embed=1/, '');
    if (ui.embedded) window.open(standalone, '_blank', 'noopener');
    else window.open(window.location.href, '_blank', 'noopener');
  });
  $('backToListBtn').addEventListener('click', () => {
    if (params.get('from') && window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = 'customer-demand-list-prototype.html' + (ui.embedded ? '?embed=1' : '');
  });

  renderAll();
  activateTab('overview');
  window.addEventListener('load', () => ui.notifyParent('customer-demand-detail', 'detail'));
})();



















































