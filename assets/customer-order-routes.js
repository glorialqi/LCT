/* Customer order multi-route and multi-modal prototype interactions. */
(function () {
  'use strict';

  const section = document.getElementById('orderRoutesSection');
  if (!section) return;

  const cardsHost = document.getElementById('orderRouteCards');
  const anchorTabsHost = document.getElementById('orderRouteAnchorTabs');
  const estimateHost = document.getElementById('orderBusinessEstimates');
  const feeRouteMenu = document.getElementById('orderFeeRouteMenu');
  const countLabel = document.getElementById('orderRouteCountLabel');
  const modeCopy = document.getElementById('orderRouteModeCopy');
  const hiddenData = document.getElementById('orderRoutesData');
  const preview = document.getElementById('orderRoutePreview');
  const previewBody = document.getElementById('orderRoutePreviewBody');
  const previewClose = document.getElementById('orderRoutePreviewClose');
  const previewCancel = document.getElementById('orderRoutePreviewCancel');
  const previewConfirm = document.getElementById('orderRoutePreviewConfirm');
  const linkPicker = document.getElementById('orderLinkedItemPicker');
  const linkPickerBody = document.getElementById('orderLinkedItemPickerBody');
  const linkPickerClose = document.getElementById('orderLinkedItemPickerClose');
  const linkPickerCancel = document.getElementById('orderLinkedItemPickerCancel');
  const linkPickerConfirm = document.getElementById('orderLinkedItemPickerConfirm');
  const flowDrawer = document.getElementById('orderRouteFlowDrawer');
  const flowCards = document.getElementById('orderRouteFlowCards');
  const flowCanvas = document.getElementById('orderRouteFlowCanvas');
  const flowCanvasInner = document.getElementById('orderRouteFlowCanvasInner');
  const flowZoomLabel = document.getElementById('orderRouteFlowZoom');
  const flowZoomOut = document.getElementById('orderRouteFlowZoomOut');
  const flowZoomIn = document.getElementById('orderRouteFlowZoomIn');
  const flowFit = document.getElementById('orderRouteFlowFit');
  const flowFullscreen = document.getElementById('orderRouteFlowFullscreen');
  const flowClose = document.getElementById('orderRouteFlowClose');
  const pageScope = document.getElementById('orderDetailForm');
  let linkPickerRouteId = null;
  let feeRouteMenuContext = null;
  let flowZoomPercent = 200;
  let activeRouteAnchorIndex = 0;
  const specifiedModeSelect = document.getElementById('orderSpecifiedTransportMode');
  const existingOrderContext = document.documentElement.classList.contains('detail-mode') || new URLSearchParams(window.location.search).get('maintenance') === '1';

  const typeOptions = ['汽运', '铁运', '水运', '航空'];
  const categoryOptionsByType = {
    '汽运': ['散货', '集装箱'],
    '水运': ['散货', '件杂', '集装箱'],
    '铁运': ['散货', '集装箱'],
    '航空': ['散货', '集装箱']
  };
  const categoriesForType = (type) => categoryOptionsByType[type] || categoryOptionsByType['汽运'];
  const unitOptions = ['箱', '托', '桶', '台', '件'];
  const billedUnitOptions = ['吨', '立方米', '箱', '托'];
  const modeOptions = ['汽运（短驳集港）', '铁运（干线班列）', '水运（干线）', '航空（干线）', '汽运（末端配送）', '多式联运中转'];
  const locationOptions = [
    '上海市/嘉定区/陆渡镇物流园区',
    '江苏省/苏州市/工业园区海关监管库',
    '广东省/深圳市/盐田港物流中心',
    '广东省/广州市/黄埔区保税区',
    '浙江省/宁波市/北仑港区',
    '湖北省/武汉市/东西湖枢纽',
    '四川省/成都市/青白江铁路港',
    '山东省/青岛市/前湾港区',
    '山东省/日照市/岚山港区'
  ];
  const commodityCatalog = [
    { id: 'C01', name: '精密电子元器件 A3', desc: '防潮防震包装', unit: '箱', weight: 0.05, vol: 0.12, billedUnit: '吨' },
    { id: 'C02', name: '新能源汽车动力电池模组', desc: '危险品 UN3480 级', unit: '托', weight: 0.85, vol: 1.10, billedUnit: '吨' },
    { id: 'C03', name: '光伏单晶硅片包套', desc: '恒温恒湿要求', unit: '箱', weight: 0.20, vol: 0.45, billedUnit: '吨' },
    { id: 'C04', name: '高端工业润滑油', desc: '桶装防漏', unit: '桶', weight: 0.18, vol: 0.22, billedUnit: '吨' },
    { id: 'C05', name: '智能储能柜整机', desc: '重型设备超宽', unit: '台', weight: 3.50, vol: 8.20, billedUnit: '吨' }
  ];

  const escapeHtml = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const number = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : (fallback || 0);
  const hasSpecifiedTransportMode = () => specifiedModeSelect?.value !== '否';
  const syncRouteBackedWaterRequirement = () => {
    window.orderRouteHasWaterPiece = state.routes.some((route) => route.type === '水运' && route.shipmentCategory === '件杂');
    window.orderRouteNeedsSupplementalTransport = false;
    if (typeof window.syncOrderTransportVisibility === 'function') window.syncOrderTransportVisibility();
  };
  const locationRegions = {
    '上海市/嘉定区/陆渡镇物流园区': '中国 / 上海市',
    '江苏省/苏州市/工业园区海关监管库': '中国 / 江苏省 / 苏州市',
    '广东省/深圳市/盐田港物流中心': '中国 / 广东省 / 深圳市',
    '广东省/广州市/黄埔区保税区': '中国 / 广东省 / 广州市',
    '浙江省/宁波市/北仑港区': '中国 / 浙江省 / 宁波市',
    '湖北省/武汉市/东西湖枢纽': '中国 / 湖北省 / 武汉市',
    '四川省/成都市/青白江铁路港': '中国 / 四川省 / 成都市',
    '山东省/青岛市/前湾港区': '中国 / 山东省 / 青岛市',
    '山东省/日照市/岚山港区': '中国 / 山东省 / 日照市'
  };
  const locationTypes = ['工厂', '仓库', '港口', '堆场', '门点'];
  const regionForPlace = (value) => portRegions[value] || locationRegions[value] || '';
  const portOptions = ['青岛港', '上海港', '宁波舟山港', '天津港', '深圳港', '胡志明港', '海防港', '新加坡港', '鹿特丹港', '洛杉矶港', '舟山鼠浪湖', '武汉青山码头'];
  const packingMethodOptions = ['整箱运输(FCL)', '拼箱运输(LCL)'];
  const bookingMethodOptions = ['船公司箱(COC)', '货主箱(SOC)'];
  const solicitationMethodOptions = ['我司揽货', '客户指定', '代理揽货'];
  const agentOptions = ['中远海运', '马士基', '达飞轮船', '长荣海运', '东方海外'];
  const agentCodes = { '中远海运': 'COSCO', '马士基': 'MAEU', '达飞轮船': 'CMDU', '长荣海运': 'EMCU', '东方海外': 'OOLU', '华贸航空': 'HMA', '中外运空运': 'SIN', '嘉里大通': 'KER', 'DHL': 'DHL', 'FedEx': 'FDX' };
  const serviceTermOptions = ['CY/CY', 'CY/FO', 'CY/HOOK', 'CY/LO', 'FI/FI', 'FILO'];
  const terminalOptions = ['青岛前湾集装箱码头', '上海洋山四期自动化码头', '宁波舟山港北仑第三集装箱码头', '胡志明吉莱港', '新加坡巴西班让码头', '鹿特丹Euromax码头', '洛杉矶APM码头'];
  const splitModeOptions = ['主单', '分单', '主分'];
  const airSupplierOptions = ['华贸物流', '嘉里大通', '中外运空运', 'DHL', 'FedEx', '顺丰航空'];
  const airAgentOptions = ['华贸航空', '中外运空运', '嘉里大通', 'DHL', 'FedEx'];
  const airRouteOptions = ['上海—洛杉矶', '上海—法兰克福', '北京—纽约', '深圳—新加坡', '广州—阿姆斯特丹'];
  const airportOptions = ['上海浦东国际机场', '上海虹桥国际机场', '北京首都国际机场', '北京大兴国际机场', '深圳宝安国际机场', '广州白云国际机场', '香港国际机场', '洛杉矶国际机场', '法兰克福机场', '纽约肯尼迪机场', '新加坡樟宜机场', '阿姆斯特丹史基浦机场'];
  const airOperationOptions = ['出分单', '包板', '外排', '接货', '送货', '报关'];
  const portRegions = {
    '青岛港': '中国 / 山东省 / 青岛市', '上海港': '中国 / 上海市', '宁波舟山港': '中国 / 浙江省 / 宁波市',
    '天津港': '中国 / 天津市', '深圳港': '中国 / 广东省 / 深圳市', '胡志明港': '越南 / 胡志明市',
    '海防港': '越南 / 海防市', '新加坡港': '新加坡', '鹿特丹港': '荷兰 / 南荷兰省 / 鹿特丹市',
    '洛杉矶港': '美国 / 加利福尼亚州 / 洛杉矶市', '舟山鼠浪湖': '中国 / 浙江省 / 舟山市',
    '武汉青山码头': '中国 / 湖北省 / 武汉市'
  };

  const makeRoute = (type) => {
    return {
      id: 'R' + Date.now() + Math.floor(Math.random() * 100),
      collapsed: true,
      type,
      shipmentCategory: categoriesForType(type)[0],
      shippingType: '国际航运',
      airInternalOrderNo: '',
      airlineMasterNo: '',
      splitMode: '',
      customerOrderNo: '',
      supplier: '',
      airRoute: '',
      etd: '',
      eta: '',
      operationRequirements: [],
      mailRecipients: [],
      packingMethod: '整箱运输(FCL)',
      bookingMethod: '船公司箱(COC)',
      solicitationMethod: '',
      agent: '',
      agentCode: '',
      agentSalesperson: '',
      receivingPlace: '',
      receivingRegion: '',
      receivingDetail: '',
      originServiceTerms: '',
      destinationServiceTerms: '',
      deliveryPlace: '',
      deliveryRegion: '',
      deliveryDetail: '',
      originPort: '',
      originTerminal: '',
      destinationPort: '',
      destinationTerminal: '',
      latestShipmentDate: '',
      dischargeTerms: '',
      isCqd: '',
      directSailing: '',
      containsLashing: '',
      vesselCertificate: '',
      vesselAge: '',
      commissionRate: 0,
      bookingManager: '',
      laycanStart: '',
      laycanEnd: '',
      originType: '工厂',
      originRegion: '中国 / 上海市',
      destinationType: '仓库',
      destinationRegion: '中国 / 广东省 / 广州市',
      consignee: '',
      origin: locationOptions[0],
      originDetail: '',
      originContact: '',
      originContactPhone: '',
      destination: locationOptions[3],
      destinationDetail: '',
      destinationContact: '',
      destinationContactPhone: '',
      expectDispatch: '',
      latestArrival: '',
      specialNotes: '',
      legs: [],
      containers: [],
      parties: {},
      items: [normalizeItem({
        id: 'IT' + Date.now(),
        tradeContractNo: '',
        tradeContractType: '销售合同',
        name: '光伏单晶硅片包套',
        description: '恒温恒湿要求',
        desc: '恒温恒湿要求',
        standardQty: 50,
        pieceCount: 50,
        pieceCountUnit: '箱',
        grossWeight: 10,
        grossWeightUnit: '吨',
        volume: 22.5,
        volumeUnit: 'm³',
        standardUnit: '箱',
        pieceWeight: 0.2,
        pieceWeightUnit: 'kg',
        specDimensions: '',
        overRate: 0,
        underRate: 0,
        goodsValueUnitPrice: 0,
        goodsValueAmount: 0,
        goodsValueCurrency: 'CNY',
        packageQuantity: 50,
        packageUnit: '箱',
        englishName: '',
        count: 50,
        unit: '箱',
        weight: 10,
        vol: 22.5,
        billedQty: 10,
        billedUnit: '吨'
      })]
    };
  };

  const defaultRoutes = () => {
    const routes = [
    {
      id: 'R1', collapsed: true, type: '汽运', shipmentCategory: '散货',
      originType: '工厂', originRegion: '中国 / 上海市', destinationType: '仓库', destinationRegion: '中国 / 广东省 / 广州市',
      consignee: '广州广汽埃安新能源一号工厂',
      origin: '上海市/嘉定区/陆渡镇物流园区', originDetail: '上海市嘉定区丰茂路888号1号库', originContact: '李发货', originContactPhone: '13900001111',
      destination: '广东省/广州市/黄埔区保税区', destinationDetail: '广州市黄埔区开创大道999号3号门', destinationContact: '王收货', destinationContactPhone: '13722223333',
      expectDispatch: '2026-09-22 09:00', latestArrival: '2026-09-24 18:00',
      specialNotes: '需要车厢净高不低于2.8米，配备尾板。', legs: [],
      items: [
        { id: '101', name: '新能源汽车动力电池模组', desc: '危险品 UN3480', count: 20, unit: '托', weight: 17, vol: 22, billedQty: 17, billedUnit: '吨', logisticsDemandRefQty: existingOrderContext ? 12 : 0, logisticsDemandNos: existingOrderContext ? ['LD202610270018'] : [] },
        { id: '102', name: '精密电子元器件 A3', desc: '防潮防震', count: 100, unit: '箱', weight: 5, vol: 12, billedQty: 12, billedUnit: '立方米' }
      ]
    },
    {
      id: 'R2', collapsed: true, type: '水运', shipmentCategory: '件杂',
      originType: '仓库', originRegion: '中国 / 江苏省 / 苏州市', destinationType: '仓库', destinationRegion: '中国 / 四川省 / 成都市',
      consignee: '成都国际铁路港储能中心',
      origin: '江苏省/苏州市/工业园区海关监管库', originDetail: '苏州市工业园区胜浦路123号', originContact: '陈调度', originContactPhone: '13588889999',
      destination: '四川省/成都市/青白江铁路港', destinationDetail: '成都市青白江区货运大道2号库', destinationContact: '赵仓管', destinationContactPhone: '13611112222',
      expectDispatch: '2026-09-23 08:00', latestArrival: '2026-09-28 12:00',
      specialNotes: '水运干线运输，需全程跟踪到港及提货节点。', mailRecipients: ['叶李滨'],
      legs: [],
      parties: {
        shipperName: '成都国际铁路港储能中心',
        consigneeName: '四川时代新能源科技有限公司',
        notifyName: '四川时代新能源科技有限公司',
        shipperInfo: '成都市青白江区货运大道2号库，陈调度 13588889999',
        consigneeInfo: '宜宾市临港经济技术开发区港城大道1号，赵仓管 13611112222',
        notifyInfo: '同收货人'
      },
      containers: [
        { id: 'CT1', type: '40HQ', quantity: 2, containerNo: 'TCLU9988776', remark: '箱门朝车尾，重箱不叠放' },
        { id: 'CT2', type: '20GP', quantity: 1, containerNo: '', remark: '' }
      ],
      items: [
        { id: '201', name: '智能储能柜整机', desc: '重型装备', count: 4, unit: '台', weight: 14, vol: 32.8, billedQty: 14, billedUnit: '吨' }
      ]
    }
    ];
    return existingOrderContext ? routes : routes.slice(0, 1);
  };

  const logisticsDemandProductReferences = {
    'R1:101': { qty: 15, demandNo: 'FLR202611160017' },
    'R1:102': { qty: 30, demandNo: 'FLR202611160017' },
    'R2:201': { qty: 2, demandNo: 'FLR202611160018' }
  };

  function normalizeItem(item) {
    return {
      ...item,
      tradeContractNo: item.tradeContractNo || '',
      tradeContractType: item.tradeContractType || '销售合同',
      name: item.name || '',
      description: item.description || item.desc || '',
      standardQty: item.standardQty ?? item.count ?? 0,
      arrangedQty: item.arrangedQty ?? 0,
      pieceCount: item.pieceCount ?? item.count ?? 0,
      pieceCountUnit: item.pieceCountUnit || item.unit || '件',
      grossWeight: item.grossWeight ?? item.weight ?? 0,
      grossWeightUnit: item.grossWeightUnit || '吨',
      volume: item.volume ?? item.vol ?? 0,
      volumeUnit: item.volumeUnit || 'm³',
      standardUnit: item.standardUnit || item.unit || '件',
      pieceWeight: item.pieceWeight ?? 0,
      pieceWeightUnit: item.pieceWeightUnit || 'kg',
      specDimensions: item.specDimensions || '',
      overRate: item.overRate ?? 0,
      underRate: item.underRate ?? 0,
      goodsValueUnitPrice: item.goodsValueUnitPrice ?? 0,
      goodsValueAmount: item.goodsValueAmount ?? 0,
      goodsValueCurrency: item.goodsValueCurrency || 'CNY',
      packageQuantity: item.packageQuantity ?? 0,
      packageUnit: item.packageUnit || '托盘',
      englishName: item.englishName || '',
      count: item.count ?? item.standardQty ?? 0,
      weight: item.weight ?? 0,
      vol: item.vol ?? 0
    };
  }

  function normalizeState(nextState) {
    nextState.routes = (nextState.routes || []).map((route) => ({ ...route, items: (route.items || []).map(normalizeItem) }));
    nextState.estimatedReceivables = Array.isArray(nextState.estimatedReceivables) ? nextState.estimatedReceivables : [];
    nextState.estimatedPayables = Array.isArray(nextState.estimatedPayables) ? nextState.estimatedPayables : [];
    return nextState;
  }

  let state = normalizeState(loadState());
  function loadState() {
    const candidates = [window.__restoredOrderDraft && window.__restoredOrderDraft.fields && window.__restoredOrderDraft.fields['运输线路数据'], hiddenData && hiddenData.value];
    for (const value of candidates) {
      if (!value) continue;
      try {
        const parsed = JSON.parse(value);
        if (parsed && Array.isArray(parsed.routes) && parsed.routes.length) {
          const normalizedRoutes = parsed.routes.map((route) => {
            const normalizedType = route.type === '多式联运' ? '水运' : route.type;
            return {
              ...route,
              collapsed: route.collapsed ?? true,
              type: normalizedType,
              shipmentCategory: categoriesForType(normalizedType).includes(route.shipmentCategory) ? route.shipmentCategory : categoriesForType(normalizedType)[0],
              shippingType: route.shippingType || '国际航运',
              airInternalOrderNo: route.airInternalOrderNo || '',
              airlineMasterNo: route.airlineMasterNo || '',
              splitMode: route.splitMode || '',
              customerOrderNo: route.customerOrderNo || '',
              supplier: route.supplier || '',
              airRoute: route.airRoute || '',
              etd: route.etd || '',
              eta: route.eta || '',
              operationRequirements: Array.isArray(route.operationRequirements) ? route.operationRequirements : [],
              mailRecipients: Array.isArray(route.mailRecipients) ? route.mailRecipients : [],
              packingMethod: route.packingMethod || '整箱运输(FCL)',
              bookingMethod: route.bookingMethod || '船公司箱(COC)',
              solicitationMethod: route.solicitationMethod || '',
              agent: route.agent || '',
              agentCode: route.agentCode || agentCodes[route.agent] || '',
              agentSalesperson: route.agentSalesperson || '',
              receivingPlace: route.receivingPlace || '',
              receivingRegion: route.receivingRegion || '',
              receivingDetail: route.receivingDetail || '',
              originServiceTerms: route.originServiceTerms || '',
              destinationServiceTerms: route.destinationServiceTerms || '',
              deliveryPlace: route.deliveryPlace || '',
              deliveryRegion: route.deliveryRegion || '',
              deliveryDetail: route.deliveryDetail || '',
              originType: route.originType || '工厂',
              originPort: route.originPort || (portOptions.includes(route.origin) ? route.origin : ''),
              originRegion: route.originRegion || portRegions[route.originPort] || locationRegions[route.origin] || '',
              originTerminal: route.originTerminal || '',
              originContactPhone: route.originContactPhone || '',
              destinationType: route.destinationType || '仓库',
              destinationPort: route.destinationPort || (portOptions.includes(route.destination) ? route.destination : ''),
              destinationRegion: route.destinationRegion || portRegions[route.destinationPort] || locationRegions[route.destination] || '',
              destinationTerminal: route.destinationTerminal || '',
              latestShipmentDate: route.latestShipmentDate || '',
              dischargeTerms: route.dischargeTerms || '',
              isCqd: route.isCqd || '',
              directSailing: route.directSailing || '',
              containsLashing: route.containsLashing || '',
              vesselCertificate: route.vesselCertificate || '',
              vesselAge: route.vesselAge || '',
              commissionRate: route.commissionRate ?? 0,
              bookingManager: route.bookingManager || '',
              laycanStart: route.laycanStart || '',
              laycanEnd: route.laycanEnd || '',
              destinationContactPhone: route.destinationContactPhone || '',
              legs: route.type === '多式联运' ? [] : (route.legs || [])
            };
          });
          return { viewMode: 'card', activeTab: 0, routes: normalizedRoutes, estimatedReceivables: Array.isArray(parsed.estimatedReceivables) ? parsed.estimatedReceivables : [], estimatedPayables: Array.isArray(parsed.estimatedPayables) ? parsed.estimatedPayables : [] };
        }
      } catch (error) {
        // Ignore stale draft payloads and keep deterministic defaults.
      }
    }
    return { viewMode: 'card', activeTab: 0, routes: defaultRoutes(), estimatedReceivables: [], estimatedPayables: [] };
  }

  function resolveLinkedItem(item) {
    if (!item || !item.linkedRouteId || !item.linkedItemId) return item;
    const sourceRoute = state.routes.find((route) => route.id === item.linkedRouteId);
    return sourceRoute?.items.find((sourceItem) => sourceItem.id === item.linkedItemId) || null;
  }

  function linkedReferenceQuantity(reference, sourceItem) {
    return reference && reference.linkedQty != null
      ? Math.max(0, number(reference.linkedQty))
      : Math.max(0, number(sourceItem?.standardQty ?? sourceItem?.count));
  }

  function referenceSummary(route, item) {
    const configuredReference = logisticsDemandProductReferences[route.id + ':' + item.id];
    const demandRefQty = Math.max(0, number(item.logisticsDemandRefQty), number(item.demandReferencedQty), number(configuredReference?.qty));
    const demandNos = Array.isArray(item.logisticsDemandNos)
      ? item.logisticsDemandNos.filter(Boolean)
      : [item.logisticsDemandNo || configuredReference?.demandNo].filter(Boolean);
    const externalRouteRefs = [];
    state.routes.forEach((otherRoute) => {
      if (otherRoute.id === route.id) return;
      (otherRoute.items || []).forEach((reference) => {
        if (reference.linkedRouteId !== route.id || reference.linkedItemId !== item.id) return;
        const sourceItem = resolveLinkedItem(reference) || item;
        externalRouteRefs.push({ route: otherRoute, quantity: linkedReferenceQuantity(reference, sourceItem) });
      });
    });
    const externalRefQty = externalRouteRefs.reduce((sum, entry) => sum + entry.quantity, 0);
    return {
      demandRefQty,
      demandNos,
      externalRefQty,
      externalRouteRefs,
      minimumQty: Math.max(demandRefQty, externalRefQty)
    };
  }

  function itemQuantity(item) {
    return Math.max(0, number(item.standardQty ?? item.count));
  }

  function referenceValidationMessage(item, summary) {
    const quantity = itemQuantity(item);
    if (quantity >= summary.minimumQty) return '';
    const reasons = [];
    if (summary.demandRefQty > 0) {
      reasons.push('物流需求单' + (summary.demandNos.length ? ' ' + summary.demandNos.join('、') + ' ' : '') + '引用 ' + summary.demandRefQty);
    }
    if (summary.externalRefQty > 0) reasons.push('其他线路引用 ' + summary.externalRefQty);
    return '商品「' + (item.name || item.description || '未命名商品') + '」对应数量 ' + quantity + '，不能小于被引用数量 ' + summary.minimumQty + '（' + reasons.join('；') + '）。';
  }

  function deletionBlockMessage(item, summary) {
    if (summary.demandRefQty <= 0 && summary.externalRefQty <= 0) return '';
    const reasons = [];
    if (summary.demandRefQty > 0) reasons.push('物流需求单' + (summary.demandNos.length ? ' ' + summary.demandNos.join('、') + ' ' : '') + '引用 ' + summary.demandRefQty);
    if (summary.externalRefQty > 0) reasons.push('其他线路引用 ' + summary.externalRefQty);
    return '商品「' + (item.name || item.description || '未命名商品') + '」已被' + reasons.join('、') + '，不允许删除商品行。';
  }

  function findQuantityControl(route, item) {
    return Array.from(pageScope.querySelectorAll('[data-item-field="standardQty"]')).find((control) =>
      control.dataset.routeId === route.id && control.dataset.itemId === item.id
    ) || null;
  }

  function validateReferencedItemQuantities(options = {}) {
    const showError = options.showError !== false;
    let firstInvalid = null;
    state.routes.some((route) => (route.items || []).some((item) => {
      if (item.linkedRouteId) return false;
      const summary = referenceSummary(route, item);
      const message = referenceValidationMessage(item, summary);
      if (!message) return false;
      firstInvalid = { route, item, summary, message, control: findQuantityControl(route, item) };
      return true;
    }));
    if (firstInvalid) {
      window.__lastOrderReferenceError = firstInvalid.message;
      if (showError) {
        notify('error', firstInvalid.message);
        if (window.UIState && firstInvalid.control) window.UIState.setFieldState(firstInvalid.control, 'invalid', firstInvalid.message);
        firstInvalid.control?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return { valid: false, ...firstInvalid };
    }
    window.__lastOrderReferenceError = '';
    return { valid: true };
  } 

  function detectLinkCycle() {
    const keyOf = (routeId, itemId) => routeId + '::' + itemId;
    const lookup = new Map();
    state.routes.forEach((route) => (route.items || []).forEach((item) => lookup.set(keyOf(route.id, item.id), item)));
    for (const [startKey, startItem] of lookup.entries()) {
      const seen = new Set([startKey]);
      let current = startItem;
      while (current && current.linkedRouteId && current.linkedItemId) {
        const nextKey = keyOf(current.linkedRouteId, current.linkedItemId);
        if (seen.has(nextKey)) return true;
        seen.add(nextKey);
        current = lookup.get(nextKey);
      }
    }
    return false;
  }

  function validateSubmitReferences() {
    if (detectLinkCycle()) {
      const message = '线路关联商品导致任务循环联动，请删除相关关联商品后重试';
      window.__lastOrderReferenceError = message;
      notify('error', message);
      return { valid: false, message };
    }
    const quantityCheck = validateReferencedItemQuantities();
    if (!quantityCheck.valid) return quantityCheck;
    for (const route of state.routes) {
      for (const item of route.items || []) {
        const effective = resolveLinkedItem(item) || item;
        const standardQty = number(effective.standardQty ?? effective.count);
        const arrangedQty = number(item.arrangedQty || 0);
        if (arrangedQty > standardQty) {
          const message = '客户订单商品' + (route.origin || '') + ' ' + (effective.name || '') + '超量安排，请检查下游单据';
          window.__lastOrderReferenceError = message;
          notify('error', message);
          return { valid: false, message };
        }
        if (item.demandMissing) {
          const message = '客户订单中的部分商品已被删除，但仍被物流需求单引用，请检查下游单据。';
          window.__lastOrderReferenceError = message;
          notify('error', message);
          return { valid: false, message };
        }
      }
    }
    window.__lastOrderReferenceError = '';
    return { valid: true };
  }

  function linkedItemReference(item) {
    if (!item || !item.linkedRouteId || !item.linkedItemId) return '--';
    const sourceRouteIndex = state.routes.findIndex((route) => route.id === item.linkedRouteId);
    const sourceRoute = state.routes[sourceRouteIndex];
    const sourceItemIndex = sourceRoute ? sourceRoute.items.findIndex((sourceItem) => sourceItem.id === item.linkedItemId) : -1;
    return sourceRoute && sourceItemIndex >= 0 ? '线路 #' + (sourceRouteIndex + 1) + ' / 商品行 ' + (sourceItemIndex + 1) : '原商品已删除';
  }

  function routeTotals(route) {
    return (route.items || []).reduce((result, item) => {
      const effective = resolveLinkedItem(item) || item;
      result.count += number(effective.count);
      result.weight += number(effective.weight);
      result.volume += number(effective.vol);
      return result;
    }, { count: 0, weight: 0, volume: 0 });
  }



  function selectOptions(options, selected) {
    const values = Array.from(new Set([].concat(options, selected ? [selected] : [])));
    return values.map((value) => '<option value="' + escapeHtml(value) + '"' + (String(value) === String(selected) ? ' selected' : '') + '>' + escapeHtml(value) + '</option>').join('');
  }

  function field(label, control, spanClass) {
    return '<div class="order-route-field ' + (spanClass || '') + '"><label>' + label + '</label>' + control + '</div>';
  }

  function routeCardMarkup(route, index) {
    const isMultimodal = hasSpecifiedTransportMode() && route.type === '多式联运';
    const routeId = escapeHtml(route.id);
    const singleRouteMode = state.routes.length === 1;
    const collapsed = !singleRouteMode && route.collapsed;
    const routeDescriptor = hasSpecifiedTransportMode() ? '<span>(' + escapeHtml(route.type) + (route.type === '航空' ? '' : ' · ' + escapeHtml(route.shipmentCategory)) + ')</span>' : '';
    const cardHead = singleRouteMode ? '' : '<div class="order-route-card-head"><div class="order-route-card-title"><span class="order-route-index">线路 #' + (index + 1) + '</span><span class="order-route-route-copy" data-route-route-copy="' + routeId + '">' + escapeHtml(route.origin || '未指定起运地') + ' → ' + escapeHtml(route.destination || '未指定目的地') + routeDescriptor + '</span></div>' +
      '<div class="order-route-card-controls">' +
      '<button class="order-route-icon-btn" type="button" data-route-action="duplicate" data-route-id="' + routeId + '" title="复制线路" aria-label="复制线路">⧉</button>' +
      '<button class="order-route-icon-btn" type="button" data-route-action="toggle" data-route-id="' + routeId + '" title="' + (route.collapsed ? '展开线路' : '折叠线路') + '" aria-label="' + (route.collapsed ? '展开线路' : '折叠线路') + '">' + (route.collapsed ? '⌄' : '⌃') + '</button>' +
      '<button class="order-route-icon-btn danger" type="button" data-route-action="remove" data-route-id="' + routeId + '" title="删除线路" aria-label="删除线路">×</button></div></div>';
    return '<article class="order-route-card ' + (isMultimodal ? 'multimodal ' : '') + (singleRouteMode ? 'single-route-card' : '') + '" id="order-route-card-' + routeId + '" data-route-card="' + routeId + '">' +
      cardHead +
      (collapsed ? '' : routeBodyMarkup(route)) +
    '</article>';
  }

  function simplifiedRouteBodyMarkup(route) {
    const routeId = escapeHtml(route.id);
    const routeIndex = state.routes.indexOf(route) + 1;
    return '<div class="order-route-card-body">' +
      itemsMarkup(route) +
      '<div class="order-route-block"><div class="order-route-block-head"><div class="order-route-block-title">运输要求</div></div><div class="order-route-grid">' +
        field('起运地类型', '<select class="control" data-route-field="originType" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '起运地类型">' + selectOptions(locationTypes, route.originType) + '</select>') +
        field('起运地<span class="required">*</span>', '<select class="control" data-route-field="origin" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '起运地">' + selectOptions(locationOptions, route.origin) + '</select>') +
        field('起运地国别地区', '<input class="control" data-route-field="originRegion" data-route-id="' + routeId + '" value="' + escapeHtml(route.originRegion || locationRegions[route.origin] || '') + '" readonly aria-label="线路' + routeIndex + '起运地国别地区">') +
        field('目的地类型', '<select class="control" data-route-field="destinationType" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '目的地类型">' + selectOptions(locationTypes, route.destinationType) + '</select>') +
        field('目的地<span class="required">*</span>', '<select class="control" data-route-field="destination" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '目的地">' + selectOptions(locationOptions, route.destination) + '</select>') +
        field('目的地国别地区', '<input class="control" data-route-field="destinationRegion" data-route-id="' + routeId + '" value="' + escapeHtml(route.destinationRegion || locationRegions[route.destination] || '') + '" readonly aria-label="线路' + routeIndex + '目的地国别地区">') +
      '</div></div>' +
    '</div>';
  }

  function waterBulkBodyMarkup(route) {
    const routeId = escapeHtml(route.id);
    const routeIndex = state.routes.indexOf(route) + 1;
    const portSelect = (fieldName, selected) => '<select class="control" data-route-field="' + fieldName + '" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + fieldName + '"><option value="">请选择</option>' + selectOptions(portOptions, selected) + '</select>';
    return '<div class="order-route-card-body">' +
      itemsMarkup(route) +
      '<div class="order-route-block"><div class="order-route-block-head"><div class="order-route-block-title">运输要求</div></div><div class="order-route-grid">' +
        field('运输类型<span class="required">*</span>', '<select class="control" data-route-field="type" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '运输类型">' + selectOptions(typeOptions, route.type) + '</select>') +
        field('航运类型<span class="required">*</span>', '<select class="control" data-route-field="shippingType" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '航运类型">' + selectOptions(['国际航运', '国内航运'], route.shippingType) + '</select>') +
        field('装运类别<span class="required">*</span>', '<select class="control" data-route-field="shipmentCategory" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '装运类别">' + selectOptions(categoriesForType(route.type), route.shipmentCategory) + '</select>') +
        field('起运港<span class="required">*</span>', portSelect('originPort', route.originPort), 'row-start') +
        field('起运港国别/省市', '<input class="control" data-route-field="originRegion" data-route-id="' + routeId + '" value="' + escapeHtml(portRegions[route.originPort] || '') + '" readonly aria-label="线路' + routeIndex + '起运港国别省市">') +
        field('起运港码头', '<input class="control" data-route-field="originTerminal" data-route-id="' + routeId + '" value="' + escapeHtml(route.originTerminal) + '" placeholder="请选择" aria-label="线路' + routeIndex + '起运港码头">') +
        field('目的港<span class="required">*</span>', portSelect('destinationPort', route.destinationPort), 'row-start') +
        field('目的港国别/省市', '<input class="control" data-route-field="destinationRegion" data-route-id="' + routeId + '" value="' + escapeHtml(portRegions[route.destinationPort] || '') + '" readonly aria-label="线路' + routeIndex + '目的港国别省市">') +
        field('目的港码头', '<input class="control" data-route-field="destinationTerminal" data-route-id="' + routeId + '" value="' + escapeHtml(route.destinationTerminal) + '" placeholder="请选择" aria-label="线路' + routeIndex + '目的港码头">') +
        field('最迟装运期', '<input class="control" type="date" data-route-field="latestShipmentDate" data-route-id="' + routeId + '" value="' + escapeHtml(route.latestShipmentDate) + '" aria-label="线路' + routeIndex + '最迟装运期">', 'row-start') +
        field('卸货条款', '<select class="control" data-route-field="dischargeTerms" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '卸货条款"><option value="">请选择</option>' + selectOptions(['FO', 'FI', 'FIO', 'LINER TERMS'], route.dischargeTerms) + '</select>') +
        field('是否直航', '<select class="control" data-route-field="directSailing" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '是否直航"><option value="">请选择</option>' + selectOptions(['是', '否'], route.directSailing) + '</select>') +
        field('船证要求', '<input class="control" data-route-field="vesselCertificate" data-route-id="' + routeId + '" value="' + escapeHtml(route.vesselCertificate) + '" placeholder="请输入" aria-label="线路' + routeIndex + '船证要求">') +
        field('船龄要求', '<input class="control" data-route-field="vesselAge" data-route-id="' + routeId + '" value="' + escapeHtml(route.vesselAge) + '" placeholder="请输入" aria-label="线路' + routeIndex + '船龄要求">') +
        field('佣金比例(%)', '<input class="control" type="number" min="0" step="0.01" data-route-field="commissionRate" data-route-id="' + routeId + '" value="' + escapeHtml(route.commissionRate) + '" placeholder="请输入" aria-label="线路' + routeIndex + '佣金比例">') +
        field('其他特殊要求', '<textarea class="control" data-route-field="specialNotes" data-route-id="' + routeId + '" placeholder="请输入" aria-label="线路' + routeIndex + '其他特殊要求">' + escapeHtml(route.specialNotes) + '</textarea>') +
      '</div></div>' +
    '</div>';
  }

  function waterContainerBodyMarkup(route) {
    const routeId = escapeHtml(route.id);
    const routeIndex = state.routes.indexOf(route) + 1;
    const portSelect = (fieldName, selected) => '<select class="control" data-route-field="' + fieldName + '" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + fieldName + '"><option value="">请选择</option>' + selectOptions(portOptions, selected) + '</select>';
    return '<div class="order-route-card-body">' +
      itemsMarkup(route) +
      '<div class="order-route-block"><div class="order-route-block-head"><div class="order-route-block-title">运输要求</div></div><div class="order-route-grid">' +
        field('运输类型<span class="required">*</span>', '<select class="control" data-route-field="type" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '运输类型">' + selectOptions(typeOptions, route.type) + '</select>') +
        field('航运类型<span class="required">*</span>', '<select class="control" data-route-field="shippingType" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '航运类型"><option value="">请选择</option>' + selectOptions(['国际航运', '国内航运'], route.shippingType) + '</select>') +
        field('装运类别<span class="required">*</span>', '<select class="control" data-route-field="shipmentCategory" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '装运类别">' + selectOptions(categoriesForType(route.type), route.shipmentCategory) + '</select>') +
        field('装箱方式<span class="required">*</span>', '<select class="control" data-route-field="packingMethod" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '装箱方式">' + selectOptions(packingMethodOptions, route.packingMethod) + '</select>') +
        field('订舱方式<span class="required">*</span>', '<select class="control" data-route-field="bookingMethod" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '订舱方式">' + selectOptions(bookingMethodOptions, route.bookingMethod) + '</select>') +
        field('揽货方式', '<select class="control" data-route-field="solicitationMethod" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '揽货方式"><option value="">请选择</option>' + selectOptions(solicitationMethodOptions, route.solicitationMethod) + '</select>') +
        field('代理', '<select class="control" data-route-field="agent" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '代理"><option value="">请选择</option>' + selectOptions(agentOptions, route.agent) + '</select>') +
        field('代理代号', '<input class="control" data-route-field="agentCode" data-route-id="' + routeId + '" value="' + escapeHtml(route.agentCode) + '" readonly placeholder="请选择代理">') +
        field('代理业务员', '<input class="control" data-route-field="agentSalesperson" data-route-id="' + routeId + '" value="' + escapeHtml(route.agentSalesperson) + '" placeholder="请输入" aria-label="线路' + routeIndex + '代理业务员">') +
        field('收货地', '<input class="control" data-route-field="receivingPlace" data-route-id="' + routeId + '" value="' + escapeHtml(route.receivingPlace) + '" placeholder="请输入" aria-label="线路' + routeIndex + '收货地">', 'row-start') +
        field('收货地国别/省市', '<input class="control" data-route-field="receivingRegion" data-route-id="' + routeId + '" value="' + escapeHtml(route.receivingRegion) + '" readonly>') +
        field('收货地详细地址', '<input class="control" data-route-field="receivingDetail" data-route-id="' + routeId + '" value="' + escapeHtml(route.receivingDetail) + '" readonly>') +
        field('起运港<span class="required">*</span>', portSelect('originPort', route.originPort), 'row-start') +
        field('起运港国别/省市', '<input class="control" data-route-field="originRegion" data-route-id="' + routeId + '" value="' + escapeHtml(portRegions[route.originPort] || '') + '" readonly>') +
        field('起运港服务条款<span class="required">*</span>', '<select class="control" data-route-field="originServiceTerms" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '起运港服务条款"><option value="">请选择</option>' + selectOptions(serviceTermOptions, route.originServiceTerms) + '</select>') +
        field('起运港码头', '<select class="control" data-route-field="originTerminal" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '起运港码头"><option value="">请选择</option>' + selectOptions(terminalOptions, route.originTerminal) + '</select>') +
        field('目的港<span class="required">*</span>', portSelect('destinationPort', route.destinationPort), 'row-start') +
        field('目的港国别/省市', '<input class="control" data-route-field="destinationRegion" data-route-id="' + routeId + '" value="' + escapeHtml(portRegions[route.destinationPort] || '') + '" readonly>') +
        field('目的港服务条款<span class="required">*</span>', '<select class="control" data-route-field="destinationServiceTerms" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '目的港服务条款"><option value="">请选择</option>' + selectOptions(serviceTermOptions, route.destinationServiceTerms) + '</select>') +
        field('目的港码头', '<select class="control" data-route-field="destinationTerminal" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '目的港码头"><option value="">请选择</option>' + selectOptions(terminalOptions, route.destinationTerminal) + '</select>') +
        field('交货地', '<select class="control" data-route-field="deliveryPlace" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '交货地"><option value="">请选择</option>' + selectOptions(locationOptions, route.deliveryPlace) + '</select>', 'row-start') +
        field('交货地国别/省市', '<input class="control" data-route-field="deliveryRegion" data-route-id="' + routeId + '" value="' + escapeHtml(route.deliveryRegion) + '" readonly>') +
        field('交货地详细地址', '<input class="control" data-route-field="deliveryDetail" data-route-id="' + routeId + '" value="' + escapeHtml(route.deliveryDetail) + '" readonly>') +
        field('其他特殊要求', '<textarea class="control" data-route-field="specialNotes" data-route-id="' + routeId + '" placeholder="请输入" aria-label="线路' + routeIndex + '其他特殊要求">' + escapeHtml(route.specialNotes) + '</textarea>', 'row-start') +
      '</div></div>' +
      containersMarkup(route) +
    '</div>';
  }

  function airBodyMarkup(route) {
    const routeId = escapeHtml(route.id);
    const routeIndex = state.routes.indexOf(route) + 1;
    const airportSelect = (fieldName, selected) => '<select class="control" data-route-field="' + fieldName + '" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + fieldName + '"><option value="">请选择</option>' + selectOptions(airportOptions, selected) + '</select>';
    const operationChecks = airOperationOptions.map((option) => '<label class="demand-check-option"><input type="checkbox" data-route-operation="' + escapeHtml(option) + '" data-route-id="' + routeId + '"' + ((route.operationRequirements || []).includes(option) ? ' checked' : '') + '>' + escapeHtml(option) + '</label>').join('');
    return '<div class="order-route-card-body">' +
      itemsMarkup(route) +
      '<div class="order-route-block"><div class="order-route-block-head"><div class="order-route-block-title">运输要求</div></div><div class="order-route-grid">' +
        field('运输类型<span class="required">*</span>', '<select class="control" data-route-field="type" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '运输类型">' + selectOptions(typeOptions, route.type) + '</select>') +
        field('我司分单号<span class="required">*</span>', '<input class="control" data-route-field="airInternalOrderNo" data-route-id="' + routeId + '" value="' + escapeHtml(route.airInternalOrderNo) + '" placeholder="请输入" aria-label="线路' + routeIndex + '我司分单号">') +
        field('航司主单号<span class="required">*</span>', '<input class="control" data-route-field="airlineMasterNo" data-route-id="' + routeId + '" value="' + escapeHtml(route.airlineMasterNo) + '" placeholder="请输入" aria-label="线路' + routeIndex + '航司主单号">') +
        field('主分模式<span class="required">*</span>', '<select class="control" data-route-field="splitMode" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '主分模式"><option value="">请选择</option>' + selectOptions(splitModeOptions, route.splitMode) + '</select>') +
        field('客户分单号', '<input class="control" data-route-field="customerOrderNo" data-route-id="' + routeId + '" value="' + escapeHtml(route.customerOrderNo) + '" placeholder="请输入" aria-label="线路' + routeIndex + '客户分单号">') +
        field('揽货方式<span class="required">*</span>', '<select class="control" data-route-field="solicitationMethod" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '揽货方式"><option value="">请选择</option>' + selectOptions(solicitationMethodOptions, route.solicitationMethod) + '</select>') +
        field('供应商<span class="required">*</span>', '<select class="control" data-route-field="supplier" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '供应商"><option value="">请选择</option>' + selectOptions(airSupplierOptions, route.supplier) + '</select>') +
        field('代理', '<select class="control" data-route-field="agent" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '代理"><option value="">请选择</option>' + selectOptions(airAgentOptions, route.agent) + '</select>') +
        field('代理代号', '<input class="control" data-route-field="agentCode" data-route-id="' + routeId + '" value="' + escapeHtml(route.agentCode) + '" readonly placeholder="请选择代理">') +
        field('代理业务员', '<input class="control" data-route-field="agentSalesperson" data-route-id="' + routeId + '" value="' + escapeHtml(route.agentSalesperson) + '" placeholder="请输入" aria-label="线路' + routeIndex + '代理业务员">') +
        field('航线', '<select class="control" data-route-field="airRoute" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '航线"><option value="">请选择</option>' + selectOptions(airRouteOptions, route.airRoute) + '</select>') +
        field('起运港<span class="required">*</span>', airportSelect('originPort', route.originPort)) +
        field('目的港<span class="required">*</span>', airportSelect('destinationPort', route.destinationPort)) +
        field('ETD', '<input class="control" type="date" data-route-field="etd" data-route-id="' + routeId + '" value="' + escapeHtml(route.etd) + '" aria-label="线路' + routeIndex + 'ETD">') +
        field('ETA', '<input class="control" type="date" data-route-field="eta" data-route-id="' + routeId + '" value="' + escapeHtml(route.eta) + '" aria-label="线路' + routeIndex + 'ETA">') +
        field('操作要求', '<div class="demand-check-group">' + operationChecks + '</div>', 'span-6') +
      '</div></div>' +
    '</div>';
  }

  function waterBreakbulkBodyMarkup(route) {
    const routeId = escapeHtml(route.id);
    const routeIndex = state.routes.indexOf(route) + 1;
    const portSelect = (fieldName, selected) => '<select class="control" data-route-field="' + fieldName + '" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + fieldName + '"><option value="">请选择</option>' + selectOptions(portOptions, selected) + '</select>';
    const mailChips = (route.mailRecipients || []).map((name, index) => '<span class="demand-email-recipient-chip"><span class="demand-email-recipient-chip-copy"><strong>' + escapeHtml(name) + '</strong></span><button type="button" data-route-action="remove-route-mail" data-route-id="' + routeId + '" data-mail-index="' + index + '" aria-label="删除邮件接收人">×</button></span>').join('');
    return '<div class="order-route-card-body">' +
      itemsMarkup(route) +
      '<div class="order-route-block"><div class="order-route-block-head"><div class="order-route-block-title">运输要求</div></div><div class="order-route-grid">' +
        field('运输类型<span class="required">*</span>', '<select class="control" data-route-field="type" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '运输类型">' + selectOptions(typeOptions, route.type) + '</select>') +
        field('航运类型<span class="required">*</span>', '<select class="control" data-route-field="shippingType" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '航运类型"><option value="">请选择</option>' + selectOptions(['国际航运', '国内航运'], route.shippingType) + '</select>') +
        field('装运类别<span class="required">*</span>', '<select class="control" data-route-field="shipmentCategory" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '装运类别">' + selectOptions(categoriesForType(route.type), route.shipmentCategory) + '</select>') +
        field('起运港<span class="required">*</span>', portSelect('originPort', route.originPort), 'row-start') +
        field('起运港国别/省市', '<input class="control" data-route-field="originRegion" data-route-id="' + routeId + '" value="' + escapeHtml(portRegions[route.originPort] || '') + '" readonly>') +
        field('起运港联系人<span class="required">*</span>', '<input class="control" data-route-field="originContact" data-route-id="' + routeId + '" value="' + escapeHtml(route.originContact) + '" placeholder="请选择" aria-label="线路' + routeIndex + '起运港联系人">') +
        field('起运港联系方式', '<input class="control" data-route-field="originContactPhone" data-route-id="' + routeId + '" value="' + escapeHtml(route.originContactPhone) + '" placeholder="请选择" aria-label="线路' + routeIndex + '起运港联系方式">') +
        field('起运港码头', '<select class="control" data-route-field="originTerminal" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '起运港码头"><option value="">请选择</option>' + selectOptions(terminalOptions, route.originTerminal) + '</select>') +
        field('目的港<span class="required">*</span>', portSelect('destinationPort', route.destinationPort), 'row-start') +
        field('目的港国别/省市', '<input class="control" data-route-field="destinationRegion" data-route-id="' + routeId + '" value="' + escapeHtml(portRegions[route.destinationPort] || '') + '" readonly>') +
        field('目的港联系人<span class="required">*</span>', '<input class="control" data-route-field="destinationContact" data-route-id="' + routeId + '" value="' + escapeHtml(route.destinationContact) + '" placeholder="请选择" aria-label="线路' + routeIndex + '目的港联系人">') +
        field('目的港联系方式', '<input class="control" data-route-field="destinationContactPhone" data-route-id="' + routeId + '" value="' + escapeHtml(route.destinationContactPhone) + '" placeholder="请选择" aria-label="线路' + routeIndex + '目的港联系方式">') +
        field('目的港码头', '<select class="control" data-route-field="destinationTerminal" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '目的港码头"><option value="">请选择</option>' + selectOptions(terminalOptions, route.destinationTerminal) + '</select>') +
        field('最迟装运期', '<input class="control" type="date" data-route-field="latestShipmentDate" data-route-id="' + routeId + '" value="' + escapeHtml(route.latestShipmentDate) + '" aria-label="线路' + routeIndex + '最迟装运期">', 'row-start') +
        field('卸货条款', '<select class="control" data-route-field="dischargeTerms" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '卸货条款"><option value="">请选择</option>' + selectOptions(['FO', 'FI', 'FIO', 'LINER TERMS'], route.dischargeTerms) + '</select>') +
        field('是否CQD', '<select class="control" data-route-field="isCqd" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '是否CQD"><option value="">请选择</option>' + selectOptions(['是', '否'], route.isCqd) + '</select>') +
        field('是否直航', '<select class="control" data-route-field="directSailing" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '是否直航"><option value="">请选择</option>' + selectOptions(['是', '否'], route.directSailing) + '</select>') +
        field('是否含绑', '<select class="control" data-route-field="containsLashing" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '是否含绑"><option value="">请选择</option>' + selectOptions(['是', '否'], route.containsLashing) + '</select>') +
        field('船证要求', '<input class="control" data-route-field="vesselCertificate" data-route-id="' + routeId + '" value="' + escapeHtml(route.vesselCertificate) + '" placeholder="请输入" aria-label="线路' + routeIndex + '船证要求">') +
        field('船龄要求', '<input class="control" data-route-field="vesselAge" data-route-id="' + routeId + '" value="' + escapeHtml(route.vesselAge) + '" placeholder="请输入" aria-label="线路' + routeIndex + '船龄要求">') +
        field('佣金比例(%)', '<input class="control" type="number" min="0" step="0.01" data-route-field="commissionRate" data-route-id="' + routeId + '" value="' + escapeHtml(route.commissionRate) + '" placeholder="请输入" aria-label="线路' + routeIndex + '佣金比例">') +
        field('订舱经理', '<input class="control" data-route-field="bookingManager" data-route-id="' + routeId + '" value="' + escapeHtml(route.bookingManager) + '" placeholder="请输入" aria-label="线路' + routeIndex + '订舱经理">') +
        field('LAYCAN', '<div class="order-date-range"><input class="control" type="date" data-route-field="laycanStart" data-route-id="' + routeId + '" value="' + escapeHtml(route.laycanStart) + '" aria-label="线路' + routeIndex + 'LAYCAN开始日期"><span class="order-date-range-separator">至</span><input class="control" type="date" data-route-field="laycanEnd" data-route-id="' + routeId + '" value="' + escapeHtml(route.laycanEnd) + '" aria-label="线路' + routeIndex + 'LAYCAN结束日期"></div>', 'span-2') +
        field('邮件接收人', '<div class="demand-email-recipient-box"><div class="demand-email-recipient-chips">' + mailChips + '</div><button class="demand-email-recipient-trigger" type="button" data-route-action="add-route-mail" data-route-id="' + routeId + '">＋ 添加</button></div>', 'row-start') +
        field('其他特殊要求', '<textarea class="control" data-route-field="specialNotes" data-route-id="' + routeId + '" placeholder="请输入" aria-label="线路' + routeIndex + '其他特殊要求">' + escapeHtml(route.specialNotes) + '</textarea>') +
      '</div></div>' +
      partiesMarkup(route) +
    '</div>';
  }

  function routeBodyMarkup(route) {
    if (!hasSpecifiedTransportMode()) return simplifiedRouteBodyMarkup(route);
    if (route.type === '水运' && route.shipmentCategory === '件杂') return waterBreakbulkBodyMarkup(route);
    if (route.type === '水运' && route.shipmentCategory === '散货') return waterBulkBodyMarkup(route);
    if (route.type === '水运' && route.shipmentCategory === '集装箱') return waterContainerBodyMarkup(route);
    if (route.type === '航空') return airBodyMarkup(route);
    const routeId = escapeHtml(route.id);
    const routeIndex = state.routes.indexOf(route) + 1;
    const isMultimodal = route.type === '多式联运';
    return '<div class="order-route-card-body">' +
      itemsMarkup(route) +
      '<div class="order-route-block"><div class="order-route-block-head"><div class="order-route-block-title">运输要求</div></div><div class="order-route-grid">' +
        field('运输类型<span class="required">*</span>', '<select class="control" data-route-field="type" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '运输类型">' + selectOptions(typeOptions, route.type) + '</select>') +
        field('装运类别<span class="required">*</span>', '<select class="control" data-route-field="shipmentCategory" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '装运类别">' + selectOptions(categoriesForType(route.type), route.shipmentCategory) + '</select>') +
        field('收货单位', '<input class="control" data-route-field="consignee" data-route-id="' + routeId + '" value="' + escapeHtml(route.consignee) + '" placeholder="请输入" aria-label="线路' + routeIndex + '收货单位">') +
        field('期望发货时间', '<input class="control" data-route-field="expectDispatch" data-route-id="' + routeId + '" value="' + escapeHtml(route.expectDispatch) + '" placeholder="请选择期望发货时间" aria-label="线路' + routeIndex + '期望发货时间">') +
        field('最晚送达时间', '<input class="control" data-route-field="latestArrival" data-route-id="' + routeId + '" value="' + escapeHtml(route.latestArrival) + '" placeholder="请选择最晚送达时间" aria-label="线路' + routeIndex + '最晚送达时间">') +
        field('起运地<span class="required">*</span>', '<select class="control" data-route-field="origin" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '起运地">' + selectOptions(locationOptions, route.origin) + '</select>', 'row-start') +
        field('起运地国别/省市', '<input class="control" data-route-field="originRegion" data-route-id="' + routeId + '" value="' + escapeHtml(route.originRegion || locationRegions[route.origin] || '') + '" readonly aria-label="线路' + routeIndex + '起运地国别省市">') +
        field('起运地联系人<span class="required">*</span>', '<input class="control" data-route-field="originContact" data-route-id="' + routeId + '" value="' + escapeHtml(route.originContact) + '" placeholder="请输入" aria-label="线路' + routeIndex + '起运地联系人">') +
        field('起运地联系方式', '<input class="control" data-route-field="originContactPhone" data-route-id="' + routeId + '" value="' + escapeHtml(route.originContactPhone) + '" placeholder="请输入" aria-label="线路' + routeIndex + '起运地联系方式">') +
        field('起运地详细地址', '<input class="control" data-route-field="originDetail" data-route-id="' + routeId + '" value="' + escapeHtml(route.originDetail) + '" placeholder="请输入" aria-label="线路' + routeIndex + '起运地详细地址">') +
        field('目的地<span class="required">*</span>', '<select class="control" data-route-field="destination" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + '目的地">' + selectOptions(locationOptions, route.destination) + '</select>', 'row-start') +
        field('目的地国别/省市', '<input class="control" data-route-field="destinationRegion" data-route-id="' + routeId + '" value="' + escapeHtml(route.destinationRegion || locationRegions[route.destination] || '') + '" readonly aria-label="线路' + routeIndex + '目的地国别省市">') +
        field('目的地联系人<span class="required">*</span>', '<input class="control" data-route-field="destinationContact" data-route-id="' + routeId + '" value="' + escapeHtml(route.destinationContact) + '" placeholder="请输入" aria-label="线路' + routeIndex + '目的地联系人">') +
        field('目的地联系方式', '<input class="control" data-route-field="destinationContactPhone" data-route-id="' + routeId + '" value="' + escapeHtml(route.destinationContactPhone) + '" placeholder="请输入" aria-label="线路' + routeIndex + '目的地联系方式">') +
        field('目的地详细地址', '<input class="control" data-route-field="destinationDetail" data-route-id="' + routeId + '" value="' + escapeHtml(route.destinationDetail) + '" placeholder="请输入" aria-label="线路' + routeIndex + '目的地详细地址">') +
        field('其他特殊要求', '<textarea class="control" data-route-field="specialNotes" data-route-id="' + routeId + '" placeholder="请输入" aria-label="线路' + routeIndex + '其他特殊要求">' + escapeHtml(route.specialNotes) + '</textarea>', 'row-start') +
      '</div></div>' +
      (isMultimodal ? multimodalMarkup(route) : '') +
    '</div>';
  }

  function multimodalMarkup(route) {
    const routeId = escapeHtml(route.id);
    return '<div class="order-route-block"><div class="order-route-block-head"><div class="order-route-block-title">多式联运阶段链</div><button class="detail-btn outline-primary" type="button" data-route-action="add-leg" data-route-id="' + routeId + '">+ 插入联运段</button></div>' +
      '<div class="order-route-legs">' + route.legs.map((leg, legIndex) =>
        '<div class="order-route-leg"><div class="order-route-leg-head"><span>阶段 ' + (legIndex + 1) + '</span>' + (route.legs.length > 1 ? '<button class="order-route-icon-btn danger" type="button" data-route-action="remove-leg" data-route-id="' + routeId + '" data-leg-index="' + legIndex + '" aria-label="删除联运段">×</button>' : '') + '</div>' +
          '<div class="order-route-leg-grid">' +
            field('运输方式', '<select class="control" data-leg-field="mode" data-route-id="' + routeId + '" data-leg-index="' + legIndex + '" aria-label="阶段' + (legIndex + 1) + '运输方式">' + selectOptions(modeOptions, leg.mode) + '</select>') +
            field('承运商方式', '<input class="control" data-leg-field="provider" data-route-id="' + routeId + '" data-leg-index="' + legIndex + '" value="' + escapeHtml(leg.provider) + '" aria-label="阶段' + (legIndex + 1) + '承运商方式">') +
            field('始发节点', '<input class="control" data-leg-field="startNode" data-route-id="' + routeId + '" data-leg-index="' + legIndex + '" value="' + escapeHtml(leg.startNode) + '" aria-label="阶段' + (legIndex + 1) + '始发节点">') +
            field('到达节点', '<input class="control" data-leg-field="endNode" data-route-id="' + routeId + '" data-leg-index="' + legIndex + '" value="' + escapeHtml(leg.endNode) + '" aria-label="阶段' + (legIndex + 1) + '到达节点">') +
            field('运输时效', '<input class="control" data-leg-field="transitDays" data-route-id="' + routeId + '" data-leg-index="' + legIndex + '" value="' + escapeHtml(leg.transitDays) + '" aria-label="阶段' + (legIndex + 1) + '运输时效">') +
          '</div></div>'
      ).join('') + '</div></div>';
  }

  function itemsMarkup(route) {
    const routeId = escapeHtml(route.id);
    const contractTypes = ['销售合同', '采购合同', '框架合同'];
    const standardUnits = ['吨', '千克', '立方米', '件'];
    const countUnits = ['箱', '托', '桶', '台', '件'];
    const weightUnits = ['kg', '吨'];
    const volumeUnits = ['m³', 'CBM'];
    const currencies = ['CNY', 'USD', 'EUR'];
    const rows = route.items.map((rowItem, itemIndex) => {
      const linked = Boolean(rowItem.linkedRouteId && rowItem.linkedItemId);
      const sourceItem = resolveLinkedItem(rowItem);
      const item = linked && sourceItem
        ? { ...sourceItem, standardQty: rowItem.linkedQty ?? sourceItem.standardQty, count: rowItem.linkedQty ?? sourceItem.count }
        : (sourceItem || rowItem);
      const lockedFields = ['name', 'tradeContractNo', 'tradeContractType', 'standardUnit', 'pieceCountUnit', 'grossWeightUnit', 'volumeUnit'];
      const lock = (field) => (linked && lockedFields.includes(field)) ? ' disabled' : '';
      return '<tr><td>' + (itemIndex + 1) + '</td>' +
        '<td><select class="control" data-item-field="name" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" aria-label="商品分类"' + lock('name') + '>' + selectOptions(commodityCatalog.map((entry) => entry.name), item.name) + '</select></td>' +
        '<td><input class="control" data-item-field="description" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" value="' + escapeHtml(item.description) + '" placeholder="请输入商品描述" aria-label="商品描述"' + lock('description') + '></td>' +
        '<td><input class="control" type="number" min="0" step="0.01" data-item-field="standardQty" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" value="' + escapeHtml(item.standardQty) + '" aria-label="标准数量"' + lock('standardQty') + '></td>' +
        '<td><input class="control" type="number" min="0" step="1" data-item-field="pieceCount" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" value="' + escapeHtml(item.pieceCount) + '" aria-label="件数"' + lock('pieceCount') + '></td>' +
        '<td><select class="control" data-item-field="pieceCountUnit" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" aria-label="件数单位"' + lock('pieceCountUnit') + '>' + selectOptions(countUnits, item.pieceCountUnit) + '</select></td>' +
        '<td><input class="control" type="number" min="0" step="0.01" data-item-field="grossWeight" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" value="' + escapeHtml(item.grossWeight) + '" aria-label="毛重"' + lock('grossWeight') + '></td>' +
        '<td><select class="control" data-item-field="grossWeightUnit" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" aria-label="毛重单位"' + lock('grossWeightUnit') + '>' + selectOptions(weightUnits, item.grossWeightUnit) + '</select></td>' +
        '<td><input class="control" type="number" min="0" step="0.01" data-item-field="volume" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" value="' + escapeHtml(item.volume) + '" aria-label="体积"' + lock('volume') + '></td>' +
        '<td><select class="control" data-item-field="volumeUnit" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" aria-label="体积单位"' + lock('volumeUnit') + '>' + selectOptions(volumeUnits, item.volumeUnit) + '</select></td>' +
        '<td><select class="control" data-item-field="standardUnit" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" aria-label="标准单位"' + lock('standardUnit') + '>' + selectOptions(standardUnits, item.standardUnit) + '</select></td>' +
        '<td><input class="control" type="number" min="0" step="0.01" data-item-field="pieceWeight" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" value="' + escapeHtml(item.pieceWeight) + '" aria-label="单件重量"' + lock('pieceWeight') + '></td>' +
        '<td><select class="control" data-item-field="pieceWeightUnit" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" aria-label="单件重量单位"' + lock('pieceWeightUnit') + '>' + selectOptions(weightUnits, item.pieceWeightUnit) + '</select></td>' +
        '<td><input class="control" data-item-field="specDimensions" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" value="' + escapeHtml(item.specDimensions) + '" placeholder="长 × 宽 × 高" aria-label="规格尺寸"' + lock('specDimensions') + '></td>' +
        '<td><input class="control" type="number" min="0" step="0.01" data-item-field="overRate" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" value="' + escapeHtml(item.overRate) + '" placeholder="%" aria-label="溢装率"' + lock('overRate') + '></td>' +
        '<td><input class="control" type="number" min="0" step="0.01" data-item-field="underRate" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" value="' + escapeHtml(item.underRate) + '" placeholder="%" aria-label="短装率"' + lock('underRate') + '></td>' +
        '<td><input class="control" type="number" min="0" step="0.01" data-item-field="goodsValueUnitPrice" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" value="' + escapeHtml(item.goodsValueUnitPrice) + '" aria-label="货值单价"' + lock('goodsValueUnitPrice') + '></td>' +
        '<td><input class="control" type="number" data-item-field="goodsValueAmount" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" value="' + escapeHtml(item.goodsValueAmount) + '" readonly aria-label="货值金额"' + lock('goodsValueAmount') + '></td>' +
        '<td><select class="control" data-item-field="goodsValueCurrency" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" aria-label="货值币种"' + lock('goodsValueCurrency') + '>' + selectOptions(currencies, item.goodsValueCurrency) + '</select></td>' +
        '<td><span class="order-route-source-ref">' + escapeHtml(linkedItemReference(rowItem)) + '</span></td>' +
        '<td><input class="control" data-item-field="englishName" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" value="' + escapeHtml(item.englishName) + '" placeholder="请输入商品英文名" aria-label="商品英文名"' + lock('englishName') + '></td>' +
        '<td><input class="control" data-item-field="tradeContractNo" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" value="' + escapeHtml(item.tradeContractNo) + '" placeholder="请输入合同号" aria-label="贸易合同号"' + lock('tradeContractNo') + '></td>' +
        '<td><select class="control" data-item-field="tradeContractType" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" aria-label="贸易合同类型"' + lock('tradeContractType') + '>' + selectOptions(contractTypes, item.tradeContractType) + '</select></td>' +
        '<td><button class="order-route-icon-btn danger" type="button" data-route-action="remove-item" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(rowItem.id) + '" aria-label="删除商品">×</button></td></tr>';
    }).join('');
    return '<div class="order-route-block"><div class="order-route-block-head"><div class="order-route-block-title">线路商品清单 <span>(' + route.items.length + ' 项)</span></div><div class="order-route-block-actions"><button class="detail-btn" type="button" data-route-action="link-items" data-route-id="' + routeId + '">关联其他线路商品</button><button class="detail-btn outline-primary" type="button" data-route-action="add-item" data-route-id="' + routeId + '">+ 添加商品</button></div></div>' +
      '<div class="order-route-items-wrap"><table class="order-route-items" aria-label="线路商品清单"><thead><tr><th>行号</th><th>商品分类 *</th><th>商品描述</th><th>标准数量 *</th><th>件数</th><th>件数单位</th><th>毛重</th><th>毛重单位</th><th>体积</th><th>体积单位</th><th>标准单位</th><th>单件重量</th><th>单件重量单位</th><th>规格尺寸</th><th>溢装率（%）</th><th>短装率（%）</th><th>货值单价</th><th>货值金额</th><th>货值币种</th><th>关联线路/商品行号</th><th>商品英文名</th><th>贸易合同号</th><th>贸易合同类型</th><th>操作</th></tr></thead><tbody>' +
      rows + '</tbody></table></div></div>';
  }

  function partiesMarkup(route) {
    const routeId = escapeHtml(route.id);
    const routeIndex = state.routes.indexOf(route) + 1;
    const parties = route.parties || {};
    const textField = (key, label, placeholder) => '<input class="control" data-party-field="' + key + '" data-route-id="' + routeId + '" value="' + escapeHtml(parties[key] || '') + '" placeholder="' + placeholder + '" aria-label="线路' + routeIndex + label + '">';
    const memoField = (key, label, placeholder) => '<textarea class="control textarea" data-party-field="' + key + '" data-route-id="' + routeId + '" placeholder="' + placeholder + '" aria-label="线路' + routeIndex + label + '">' + escapeHtml(parties[key] || '') + '</textarea>';
    return '<div class="order-route-block order-route-parties"><div class="order-route-block-head"><div class="order-route-block-title">收发通信息</div></div>' +
      '<div class="order-route-parties-grid"><div class="order-route-grid">' +
        field('发货人', textField('shipperName', '发货人', '请输入发货人名称'), 'span-2') +
        field('收货人', textField('consigneeName', '收货人', '请输入收货人名称'), 'span-2') +
        field('通知人', textField('notifyName', '通知人', '请输入通知人名称'), 'span-2') +
        field('发货人信息', memoField('shipperInfo', '发货人信息', '请输入发货人地址,联系电话信息'), 'span-2') +
        field('收货人信息', memoField('consigneeInfo', '收货人信息', '请输入收货人地址,联系电话信息'), 'span-2') +
        field('通知人信息', memoField('notifyInfo', '通知人信息', '请输入通知人地址,联系电话信息'), 'span-2') +
      '</div></div></div>';
  }

  function containersMarkup(route) {
    const routeId = escapeHtml(route.id);
    const routeIndex = state.routes.indexOf(route) + 1;
    const containers = route.containers || [];
    const boxTypes = containerBoxTypeOptions;
    const rows = containers.map((container, containerIndex) =>
      '<tr>' +
        '<td>' + (containerIndex + 1) + '</td>' +
        '<td><select class="control" data-container-field="type" data-route-id="' + routeId + '" data-container-id="' + escapeHtml(container.id) + '" aria-label="线路' + routeIndex + '集装箱' + (containerIndex + 1) + '箱型"><option value="">请选择</option>' + selectOptions(boxTypes, container.type) + '</select></td>' +
        '<td><input class="control" type="number" min="0" step="1" data-container-field="quantity" data-route-id="' + routeId + '" data-container-id="' + escapeHtml(container.id) + '" value="' + escapeHtml(container.quantity) + '" aria-label="线路' + routeIndex + '集装箱' + (containerIndex + 1) + '数量"></td>' +
        '<td><input class="control" data-container-field="containerNo" data-route-id="' + routeId + '" data-container-id="' + escapeHtml(container.id) + '" value="' + escapeHtml(container.containerNo) + '" placeholder="请输入箱号" aria-label="线路' + routeIndex + '集装箱' + (containerIndex + 1) + '箱号"></td>' +
        '<td><input class="control" data-container-field="remark" data-route-id="' + routeId + '" data-container-id="' + escapeHtml(container.id) + '" value="' + escapeHtml(container.remark) + '" placeholder="请输入" aria-label="线路' + routeIndex + '集装箱' + (containerIndex + 1) + '备注"></td>' +
        '<td><button class="order-route-icon-btn danger" type="button" data-route-action="remove-container" data-route-id="' + routeId + '" data-container-id="' + escapeHtml(container.id) + '" aria-label="删除集装箱">×</button></td>' +
      '</tr>'
    ).join('');
    const emptyRow = containers.length ? '' : '<tr class="order-route-containers-empty"><td colspan="6">暂无集装箱，点击「+ 添加集装箱」录入。</td></tr>';
    return '<div class="order-route-block order-route-containers"><div class="order-route-block-head"><div class="order-route-block-title">集装箱信息 <span>(' + containers.length + ' 个)</span></div><div class="order-route-block-actions"><button class="detail-btn outline-primary" type="button" data-route-action="add-container" data-route-id="' + routeId + '">+ 添加集装箱</button></div></div>' +
      '<div class="order-route-items-wrap"><table class="order-route-containers-table" aria-label="线路集装箱信息"><thead><tr><th>序号</th><th>箱型 *</th><th>数量 *</th><th>箱号</th><th>备注</th><th>操作</th></tr></thead><tbody>' + rows + emptyRow + '</tbody></table></div></div>';
  }

  const feeItemOptions = ['海运费', '港杂费', '报关代理费', '仓储费', '运输费', '其他费用'];
  const feeCurrencyOptions = ['CNY', 'USD', 'EUR'];
  const feeUnitOptions = ['吨', '箱', '托', '票', '次', '立方米'];
  const containerTypeOptions = ['', '20GP', '40GP', '40HQ', '45HQ', '散货', '件杂'];
  const containerBoxTypeOptions = ['20GP', '40GP', '40HQ', '45HQ', '40OT', '20RF', '40RF'];
  const invoiceTypeOptions = ['', '增值税专用发票', '增值税普通发票', '形式发票', '无'];
  const serviceHasTransport = () => Array.from(document.querySelectorAll('input[name="orderServiceScope"]:checked')).some((checkbox) => checkbox.value === '运输');
  const feeState = (direction) => direction === 'receivable' ? state.estimatedReceivables : state.estimatedPayables;
  const feeDirectionLabel = (direction) => direction === 'receivable' ? '应收' : '应付';

  function feeRouteOptionText(route, index) {
    const typeCopy = hasSpecifiedTransportMode() && route.type ? ' · ' + route.type : '';
    return '线路 #' + (index + 1) + typeCopy;
  }

  function selectedFeeRouteIds(fee) {
    const raw = Array.isArray(fee.routeIds) ? fee.routeIds : [];
    const selectedId = raw.find((id) => state.routes.some((route) => route.id === id));
    if (selectedId) return [selectedId];
    return state.routes[0] ? [state.routes[0].id] : [];
  }

  function feeRouteSummary(fee) {
    const ids = selectedFeeRouteIds(fee);
    if (!ids.length) return '暂无线路';
    return state.routes
      .map((route, index) => ({ route, index }))
      .filter(({ route }) => ids.includes(route.id))
      .map(({ route, index }) => feeRouteOptionText(route, index))
      .join('');
  }

  function feeRoutePickerMarkup(direction, fee) {
    if (!serviceHasTransport()) {
      return '<div class="order-fee-route-picker"><button class="order-fee-route-trigger" type="button" disabled title="服务范围不含运输，线路不可选"><span data-fee-route-summary>—</span></button></div>';
    }
    const summary = feeRouteSummary(fee);
    return '<div class="order-fee-route-picker"><button class="order-fee-route-trigger" type="button" data-fee-route-toggle data-fee-direction="' + direction + '" data-fee-id="' + escapeHtml(fee.id) + '" aria-haspopup="dialog" aria-expanded="false" title="' + escapeHtml(summary) + '"><span data-fee-route-summary>' + escapeHtml(summary) + '</span><span class="order-fee-route-chevron" aria-hidden="true">⌄</span></button></div>';
  }

  function feeRouteMenuMarkup(fee) {
    const selectedIds = new Set(selectedFeeRouteIds(fee));
    const routeOptions = state.routes.length
      ? state.routes.map((route, index) => '<label class="order-fee-route-option"><input type="radio" name="fee-route-' + escapeHtml(fee.id) + '" data-fee-route-option value="' + escapeHtml(route.id) + '"' + (selectedIds.has(route.id) ? ' checked' : '') + '><span><strong>' + escapeHtml(feeRouteOptionText(route, index)) + '</strong><small>' + escapeHtml((route.origin || '未指定起运地') + ' → ' + (route.destination || '未指定目的地')) + '</small></span></label>').join('')
      : '<div class="order-fee-route-empty">暂无可选线路</div>';
    return routeOptions + '<div class="order-fee-route-hint">每条费用只能选择一条线路，新增费用默认选择线路 #1</div>';
  }

  function syncFeeRoutesByServiceScope() {
    if (serviceHasTransport()) {
      [state.estimatedReceivables, state.estimatedPayables].forEach((list) => {
        (list || []).forEach((fee) => {
          const valid = (fee.routeIds || []).some((id) => state.routes.some((route) => route.id === id));
          if (!valid) fee.routeIds = state.routes[0] ? [state.routes[0].id] : [];
        });
      });
      return;
    }
    [state.estimatedReceivables, state.estimatedPayables].forEach((list) => {
      (list || []).forEach((fee) => { fee.routeIds = []; });
    });
  }

  function makeFee(direction) {
    return {
      id: 'FEE' + direction + Date.now() + Math.floor(Math.random() * 100),
      routeIds: state.routes[0] ? [state.routes[0].id] : [], feeItem: '', settlementObject: '', taxRate: 0, ppcc: 'PP', unitPrice: 0, currency: 'CNY',
      quantity: 1, unit: '吨', originalAmount: 0, containerType: '', exchangeRate: 1, localAmount: 0,
      remark: '', invoiceType: '', actualProcurement: '否'
    };
  }

  function feeRowMarkup(direction, fee, index) {
    const id = escapeHtml(fee.id);
    const attrs = ' data-fee-direction="' + direction + '" data-fee-id="' + id + '"';
    return '<tr><td><input type="checkbox" data-fee-select' + attrs + ' aria-label="选择第' + (index + 1) + '行费用"></td>' +
      '<td>' + feeRoutePickerMarkup(direction, fee) + '</td>' +
      '<td><select class="control" data-fee-field="feeItem"' + attrs + ' required aria-label="费用科目">' + selectOptions(feeItemOptions, fee.feeItem) + '</select></td>' +
      '<td><input class="control" data-fee-field="settlementObject"' + attrs + ' value="' + escapeHtml(fee.settlementObject) + '" placeholder="请输入结算对象" required aria-label="结算对象"></td>' +
      '<td><input class="control" type="number" min="0" step="0.01" data-fee-field="taxRate"' + attrs + ' value="' + escapeHtml(fee.taxRate) + '" required aria-label="税率"></td>' +
      '<td><select class="control" data-fee-field="ppcc"' + attrs + ' aria-label="PP或CC">' + selectOptions(['PP', 'CC'], fee.ppcc) + '</select></td>' +
      '<td><input class="control" type="number" min="0" step="0.01" data-fee-field="unitPrice"' + attrs + ' value="' + escapeHtml(fee.unitPrice) + '" required aria-label="计费单价含税"></td>' +
      '<td><select class="control" data-fee-field="currency"' + attrs + ' required aria-label="计费币种">' + selectOptions(feeCurrencyOptions, fee.currency) + '</select></td>' +
      '<td><input class="control" type="number" min="0" step="0.01" data-fee-field="quantity"' + attrs + ' value="' + escapeHtml(fee.quantity) + '" required aria-label="计费数量"></td>' +
      '<td><select class="control" data-fee-field="unit"' + attrs + ' required aria-label="计量单位">' + selectOptions(feeUnitOptions, fee.unit) + '</select></td>' +
      '<td><select class="control" data-fee-field="containerType"' + attrs + ' aria-label="柜型">' + selectOptions(containerTypeOptions, fee.containerType) + '</select></td>' +
      '<td><input class="control" type="number" data-fee-field="originalAmount"' + attrs + ' value="' + number(fee.originalAmount).toFixed(2) + '" readonly aria-label="原币金额含税"></td>' +
      '<td><input class="control" type="number" min="0" step="0.0001" data-fee-field="exchangeRate"' + attrs + ' value="' + escapeHtml(fee.exchangeRate) + '" required aria-label="汇率"></td>' +
      '<td><input class="control" type="number" data-fee-field="localAmount"' + attrs + ' value="' + number(fee.localAmount).toFixed(2) + '" readonly aria-label="本位币金额含税"></td>' +
      '<td><input class="control" data-fee-field="remark"' + attrs + ' value="' + escapeHtml(fee.remark) + '" placeholder="请输入备注" aria-label="备注"></td>' +
      '<td><select class="control" data-fee-field="invoiceType"' + attrs + ' aria-label="发票类型">' + selectOptions(invoiceTypeOptions, fee.invoiceType) + '</select></td>' +
      '<td><select class="control" data-fee-field="actualProcurement"' + attrs + ' required aria-label="是否实际采购">' + selectOptions(['是', '否'], fee.actualProcurement) + '</select></td>' +
      '<td><button class="order-route-icon-btn danger" type="button" data-fee-action="remove" data-fee-direction="' + direction + '" data-fee-id="' + id + '" aria-label="删除费用">×</button></td></tr>';
  }

  function feeCardMarkup(direction) {
    const fees = feeState(direction);
    const label = feeDirectionLabel(direction);
    const otherLabel = direction === 'receivable' ? '应付' : '应收';
    return '<section class="order-business-fee-card" data-fee-card="' + direction + '"><div class="order-business-fee-head"><div class="order-business-fee-title">业务预估' + label + '费用</div><div class="order-business-fee-actions"><button class="detail-btn outline-primary" type="button" data-fee-action="copy" data-fee-direction="' + direction + '">拷贝到' + otherLabel + '</button><button class="detail-btn primary" type="button" data-fee-action="add" data-fee-direction="' + direction + '">添加费用</button></div></div>' +
      '<div class="order-business-fee-table-wrap"><table class="order-business-fee-table" aria-label="业务预估' + label + '费用"><thead><tr><th><input type="checkbox" data-fee-select-all="' + direction + '" aria-label="全选' + label + '费用"></th><th>线路</th><th>费用科目 *</th><th>结算对象 *</th><th>税率(%) *</th><th>PP/CC</th><th>计费单价(含税) *</th><th>计费币种 *</th><th>计费数量 *</th><th>计量单位 *</th><th>柜型</th><th>原币金额(含税)</th><th>汇率 *</th><th>本位币金额(含税)</th><th>备注</th><th>发票类型</th><th>是否实际采购 *</th><th>操作</th></tr></thead><tbody>' +
      (fees.length ? fees.map((fee, index) => feeRowMarkup(direction, fee, index)).join('') : '<tr><td colspan="18" class="order-business-fee-empty">暂无数据</td></tr>') + '</tbody></table></div></section>';
  }

  function businessEstimatesMarkup() {
    return feeCardMarkup('receivable') + feeCardMarkup('payable');
  }


  function renderRouteAnchorTabs() {
    if (!anchorTabsHost) return;
    if (state.routes.length <= 1) {
      anchorTabsHost.innerHTML = '';
      anchorTabsHost.hidden = true;
      return;
    }
    anchorTabsHost.hidden = false;
    activeRouteAnchorIndex = Math.max(0, Math.min(activeRouteAnchorIndex, state.routes.length - 1));
    anchorTabsHost.innerHTML = state.routes.map((route, index) => { const routeType = hasSpecifiedTransportMode() ? (route.type || '综合运输') : '综合运输'; return '<button class="order-route-anchor-tab ' + (index === activeRouteAnchorIndex ? 'active' : '') + '" type="button" role="tab" aria-selected="' + (index === activeRouteAnchorIndex) + '" aria-controls="order-route-card-' + escapeHtml(route.id) + '" data-route-anchor="' + index + '">线路' + (index + 1) + ' ' + escapeHtml(routeType) + '</button>'; }).join('');
  }

  function syncRouteHeaderActions() {
    const status = document.getElementById('orderStatusField')?.textContent.trim() || '';
    const feedbackUnavailable = status === '创建' || status === '驳回';
    const flowButton = document.getElementById('orderRouteFlowBtn');
    if (flowButton) flowButton.hidden = !hasSpecifiedTransportMode() || state.routes.length === 1;
    const feedbackButton = document.getElementById('orderRouteFeedbackBtn');
    if (feedbackButton) feedbackButton.hidden = !hasSpecifiedTransportMode() || feedbackUnavailable;
    const editable = status === '创建' || status === '驳回';
    const addRouteButton = section.querySelector('[data-route-action="add-route"]');
    if (addRouteButton) addRouteButton.hidden = !editable;
    section.querySelectorAll('[data-route-action="duplicate"], [data-route-action="remove"]').forEach((button) => { button.hidden = !editable; });
    section.querySelectorAll('[data-route-action="link-items"]').forEach((button) => { button.hidden = !editable || state.routes.length <= 1; });
  }

  function render() {
    closeFeeRouteMenu();
    const singleRouteMode = state.routes.length === 1;
    section.classList.toggle('single-route-mode', singleRouteMode);
    anchorTabsHost.hidden = state.routes.length <= 1;
    countLabel.textContent = state.routes.length + ' 条线路';
    if (modeCopy) modeCopy.textContent = singleRouteMode
      ? (hasSpecifiedTransportMode() ? '单线路：配置运输方式、起止节点、时间要求及关联商品。' : '单线路：未指定运输方式，仅配置起运地、目的地及关联商品。')
      : (hasSpecifiedTransportMode()
        ? '一单多线路：每条线路独立配置运输方式、起止节点、时间要求及关联商品。'
        : '一单多线路：未指定运输方式，仅配置起运地、目的地及关联商品。');
    const addRouteButton = section.querySelector('[data-route-action="add-route"]');
    if (addRouteButton) addRouteButton.textContent = '+ 添加线路';
    syncRouteHeaderActions();
    cardsHost.innerHTML = state.routes.length ? state.routes.map((route) => routeCardMarkup(route, state.routes.indexOf(route))).join('') : '<div class="order-route-empty">暂无运输线路，请添加线路。</div>';
    syncRouteHeaderActions();
    renderRouteAnchorTabs();
    syncFeeRoutesByServiceScope();
    estimateHost.innerHTML = businessEstimatesMarkup();
    syncHidden(false);
    syncRouteBackedWaterRequirement();
  }

  function refreshDerived() {
    section.querySelectorAll('[data-route-tab-weight]').forEach((node) => {
      const route = state.routes.find((item) => item.id === node.dataset.routeTabWeight);
      if (route) node.textContent = routeTotals(route).weight.toFixed(2);
    });
    syncHidden(true);
    syncRouteBackedWaterRequirement();
  }

  function syncHidden(notify) {
    hiddenData.value = JSON.stringify(state);
    if (notify) hiddenData.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function notify(kind, message) {
    if (window.UIState && pageScope) window.UIState.showFormAlert(pageScope, kind, message);
  }

  function findRoute(id) { return state.routes.find((route) => route.id === id); }

  function updateControl(target) {
    if (target.dataset.partyField) {
      const partyRoute = findRoute(target.dataset.routeId);
      if (!partyRoute) return;
      partyRoute.parties = partyRoute.parties || {};
      partyRoute.parties[target.dataset.partyField] = target.value;
      return;
    }
    if (target.dataset.containerField) {
      const targetRoute = findRoute(target.dataset.routeId);
      const container = (targetRoute?.containers || []).find((entry) => entry.id === target.dataset.containerId);
      if (!container) return;
      const field = target.dataset.containerField;
      container[field] = field === 'quantity' ? Math.max(0, number(target.value)) : target.value;
      return;
    }
    if (target.dataset.feeField) {
      const fees = feeState(target.dataset.feeDirection);
      const fee = fees.find((entry) => entry.id === target.dataset.feeId);
      if (!fee) return;
      const field = target.dataset.feeField;
      const numericFields = ['taxRate', 'unitPrice', 'quantity', 'exchangeRate', 'originalAmount', 'localAmount'];
      fee[field] = numericFields.includes(field) ? number(target.value) : target.value;
      if (field === 'unitPrice' || field === 'quantity' || field === 'exchangeRate') {
        fee.originalAmount = number((number(fee.unitPrice) * number(fee.quantity)).toFixed(2));
        fee.localAmount = number((fee.originalAmount * number(fee.exchangeRate)).toFixed(2));
        const originalInput = document.querySelector('[data-fee-direction="' + target.dataset.feeDirection + '"][data-fee-id="' + target.dataset.feeId + '"][data-fee-field="originalAmount"]');
        const localInput = document.querySelector('[data-fee-direction="' + target.dataset.feeDirection + '"][data-fee-id="' + target.dataset.feeId + '"][data-fee-field="localAmount"]');
        if (originalInput) originalInput.value = fee.originalAmount.toFixed(2);
        if (localInput) localInput.value = fee.localAmount.toFixed(2);
      }
      return;
    }
    const route = findRoute(target.dataset.routeId);
    if (!route) return;
    if (target.dataset.routeOperation) {
      const requirements = new Set(route.operationRequirements || []);
      if (target.checked) requirements.add(target.dataset.routeOperation);
      else requirements.delete(target.dataset.routeOperation);
      route.operationRequirements = Array.from(requirements);
      return;
    }
    if (target.dataset.routeField) {
      route[target.dataset.routeField] = target.value;
      if (target.dataset.routeField === 'type') {
        const allowedCategories = categoriesForType(route.type);
        if (!allowedCategories.includes(route.shipmentCategory)) route.shipmentCategory = allowedCategories[0];
      }
      if (target.dataset.routeField === 'origin' || target.dataset.routeField === 'destination') {
        const copy = section.querySelector('[data-route-route-copy="' + route.id + '"]');
        if (copy) copy.innerHTML = escapeHtml(route.origin) + ' → ' + escapeHtml(route.destination) + (hasSpecifiedTransportMode() ? '<span>(' + escapeHtml(route.type) + ' · ' + escapeHtml(route.shipmentCategory) + ')</span>' : '');
        if (target.dataset.routeField === 'origin') route.originRegion = locationRegions[route.origin] || route.originRegion;
        if (target.dataset.routeField === 'destination') route.destinationRegion = locationRegions[route.destination] || route.destinationRegion;
      }
      if (target.dataset.routeField === 'originPort') { route.origin = route.originPort; route.originRegion = portRegions[route.originPort] || ''; }
      if (target.dataset.routeField === 'destinationPort') { route.destination = route.destinationPort; route.destinationRegion = portRegions[route.destinationPort] || ''; }
      if (target.dataset.routeField === 'agent') route.agentCode = agentCodes[route.agent] || '';
      if (target.dataset.routeField === 'receivingPlace') { route.receivingRegion = regionForPlace(route.receivingPlace); const regionInput = section.querySelector('[data-route-field="receivingRegion"][data-route-id="' + route.id + '"]'); if (regionInput) regionInput.value = route.receivingRegion; }
      if (target.dataset.routeField === 'deliveryPlace') route.deliveryRegion = regionForPlace(route.deliveryPlace);
    } else if (target.dataset.legField) {
      const leg = route.legs[Number(target.dataset.legIndex)];
      if (leg) leg[target.dataset.legField] = target.value;
    } else if (target.dataset.itemField) {
      const item = route.items.find((entry) => entry.id === target.dataset.itemId);
      if (!item) return;
      const field = target.dataset.itemField;
      const numericFields = ['count', 'weight', 'vol', 'billedQty', 'standardQty', 'pieceCount', 'grossWeight', 'volume', 'pieceWeight', 'overRate', 'underRate', 'goodsValueUnitPrice', 'goodsValueAmount', 'packageQuantity'];
      if ((field === 'standardQty' || field === 'count') && !item.linkedRouteId) {
        const summary = referenceSummary(route, item);
        const proposedQty = number(target.value);
        const proposedItem = { ...item, standardQty: proposedQty, count: proposedQty };
        const message = referenceValidationMessage(proposedItem, summary);
        if (message) {
          window.__lastOrderReferenceError = message;
          notify('error', message);
          if (window.UIState) window.UIState.setFieldState(target, 'invalid', message);
          target.value = itemQuantity(item);
          return;
        }
      }
      item[field] = numericFields.includes(field) ? number(target.value) : target.value;
      if (field === 'standardQty') item.count = number(target.value);
      if (field === 'pieceCount') item.count = number(target.value);
      if (field === 'pieceCountUnit') item.unit = target.value;
      if (field === 'grossWeight') item.weight = number(target.value);
      if (field === 'volume') item.vol = number(target.value);
      if (field === 'standardUnit') item.unit = target.value;
      if (field === 'goodsValueUnitPrice' || field === 'standardQty') {
        item.goodsValueAmount = number((number(item.goodsValueUnitPrice) * number(item.standardQty)).toFixed(2));
        const amountInput = Array.from(section.querySelectorAll('[data-item-field="goodsValueAmount"]')).find((control) => control.dataset.routeId === route.id && control.dataset.itemId === item.id);
        if (amountInput) amountInput.value = item.goodsValueAmount;
      }
      if (field === 'name') {
        const catalog = commodityCatalog.find((entry) => entry.name === target.value);
        if (catalog) {
          item.description = catalog.desc;
          item.standardUnit = catalog.unit;
          item.pieceCountUnit = catalog.unit;
          item.grossWeight = number((catalog.weight * number(item.count)).toFixed(2));
          item.grossWeightUnit = '吨';
          item.volume = number((catalog.vol * number(item.count)).toFixed(2));
          item.volumeUnit = 'm³';
          item.packageUnit = catalog.unit;
          item.pieceWeight = catalog.weight;
          item.pieceWeightUnit = '吨';
          item.count = number(item.standardQty);
          item.unit = catalog.unit;
          item.weight = number((catalog.weight * number(item.count)).toFixed(2));
          item.vol = number((catalog.vol * number(item.count)).toFixed(2));
        }
      }
    }
  }

  function handleFeeAction(button) {
    const action = button.dataset.feeAction;
    const direction = button.dataset.feeDirection;
    const fees = feeState(direction);
    if (action === 'add') {
      fees.push(makeFee(direction));
      render();
      return;
    }
    if (action === 'remove') {
      const index = fees.findIndex((fee) => fee.id === button.dataset.feeId);
      if (index >= 0) fees.splice(index, 1);
      render();
      return;
    }
    if (action === 'copy') {
      const selected = new Set(Array.from(estimateHost.querySelectorAll('[data-fee-select][data-fee-direction="' + direction + '"]:checked')).map((checkbox) => checkbox.dataset.feeId));
      const source = selected.size ? fees.filter((fee) => selected.has(fee.id)) : fees.slice();
      if (!source.length) { notify('error', '暂无可拷贝的' + feeDirectionLabel(direction) + '费用。'); return; }
      const target = feeState(direction === 'receivable' ? 'payable' : 'receivable');
      source.forEach((fee, index) => target.push({ ...fee, id: 'FEEcopy' + Date.now() + index }));
      render();
      notify('success', '已拷贝 ' + source.length + ' 条费用。');
    }
  }

  function closeFeeRouteMenu() {
    if (!feeRouteMenu || feeRouteMenu.hidden) return;
    feeRouteMenu.hidden = true;
    feeRouteMenuContext = null;
    estimateHost.querySelectorAll('[data-fee-route-toggle][aria-expanded="true"]').forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
  }

  function positionFeeRouteMenu(trigger) {
    const rect = trigger.getBoundingClientRect();
    const menuWidth = 280;
    const menuHeight = Math.min(feeRouteMenu.scrollHeight, 330);
    const left = Math.max(12, Math.min(rect.left, window.innerWidth - menuWidth - 12));
    const below = rect.bottom + 6;
    const top = below + menuHeight > window.innerHeight - 12 ? Math.max(12, rect.top - menuHeight - 6) : below;
    feeRouteMenu.style.left = left + 'px';
    feeRouteMenu.style.top = top + 'px';
  }

  function openFeeRouteMenu(trigger) {
    const direction = trigger.dataset.feeDirection;
    const fee = feeState(direction).find((entry) => entry.id === trigger.dataset.feeId);
    if (!fee) return;
    if (feeRouteMenuContext?.id === fee.id && feeRouteMenuContext?.direction === direction && !feeRouteMenu.hidden) {
      closeFeeRouteMenu();
      return;
    }
    closeFeeRouteMenu();
    feeRouteMenuContext = { direction, id: fee.id };
    feeRouteMenu.innerHTML = feeRouteMenuMarkup(fee);
    feeRouteMenu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    positionFeeRouteMenu(trigger);
  }

  function updateFeeRouteTrigger(direction, fee) {
    const trigger = Array.from(estimateHost.querySelectorAll('[data-fee-route-toggle]')).find((node) => node.dataset.feeDirection === direction && node.dataset.feeId === fee.id);
    if (!trigger) return;
    const summary = feeRouteSummary(fee);
    const summaryNode = trigger.querySelector('[data-fee-route-summary]');
    if (summaryNode) summaryNode.textContent = summary;
    trigger.title = summary;
  }

  function updateFeeRouteSelection(target) {
    if (!feeRouteMenuContext || !target.checked) return;
    const fee = feeState(feeRouteMenuContext.direction).find((entry) => entry.id === feeRouteMenuContext.id);
    if (!fee) { closeFeeRouteMenu(); return; }
    fee.routeIds = [target.value];
    updateFeeRouteTrigger(feeRouteMenuContext.direction, fee);
    closeFeeRouteMenu();
  }

  function handleAction(button) {
    const action = button.dataset.routeAction;
    const route = findRoute(button.dataset.routeId);
    if (action === 'add-route') {
      if (state.routes.length === 1) state.routes[0].collapsed = false;
      const newRoute = makeRoute(button.dataset.routeType || '汽运');
      newRoute.collapsed = false;
      state.routes.push(newRoute);
      state.activeTab = state.routes.length - 1;
      activeRouteAnchorIndex = state.activeTab;
      render();
      notify('success', '已添加新的运输线路。');
      return;
    }
    if (action === 'preview') { openPreview(); return; }
    if (action === 'view-flow') { openFlowDrawer(); return; }
    if (action === 'feedback') { document.getElementById('feedbackTab')?.click(); return; }
    if (!route) return;
    if (action === 'add-container') {
      route.containers = route.containers || [];
      route.containers.push({ id: 'CT' + Date.now(), type: '40GP', quantity: 1, containerNo: '', remark: '' });
      render();
      notify('success', '已添加 1 个集装箱。');
      return;
    }
    if (action === 'remove-container') {
      route.containers = (route.containers || []).filter((container) => container.id !== button.dataset.containerId);
      render();
      return;
    }
    if (action === 'add-route-mail') {
      const name = window.prompt('请输入邮件接收人姓名');
      if (name && name.trim() && !(route.mailRecipients || []).includes(name.trim())) {
        route.mailRecipients = route.mailRecipients || [];
        route.mailRecipients.push(name.trim());
        render();
      }
      return;
    }
    if (action === 'remove-route-mail') {
      route.mailRecipients = route.mailRecipients || [];
      route.mailRecipients.splice(Number(button.dataset.mailIndex), 1);
      render();
      return;
    }
    if (action === 'duplicate') {
      const index = state.routes.indexOf(route);
      const duplicate = JSON.parse(JSON.stringify(route));
      duplicate.id = 'R' + Date.now();
      duplicate.collapsed = false;
      duplicate.items = duplicate.items
        .filter((item) => !item.linkedRouteId)
        .map((item, itemIndex) => ({ ...item, id: 'IT' + Date.now() + itemIndex }));
      duplicate.containers = (duplicate.containers || []).map((container, containerIndex) => ({ ...container, id: 'CT' + Date.now() + containerIndex }));
      state.routes.splice(index + 1, 0, duplicate);
      state.activeTab = index + 1;
      activeRouteAnchorIndex = state.activeTab;
      render();
      notify('success', '已复制当前运输线路。');
      return;
    }
    if (action === 'toggle') {
      activeRouteAnchorIndex = state.routes.indexOf(route);
      route.collapsed = !route.collapsed;
      render();
      return;
    }
    if (action === 'remove') {
      if (state.routes.length <= 1) { notify('error', '订单至少需要保留 1 条运输线路。'); return; }
      const blockingItem = (route.items || []).find((item) => {
        if (item.linkedRouteId) return false;
        const summary = referenceSummary(route, item);
        return summary.demandRefQty > 0 || summary.externalRefQty > 0;
      });
      if (blockingItem) {
        const summary = referenceSummary(route, blockingItem);
        const message = deletionBlockMessage(blockingItem, summary).replace('不允许删除商品行。', '不允许删除该运输线路。');
        window.__lastOrderReferenceError = message;
        notify('error', message);
        return;
      }
      state.routes.forEach((targetRoute) => {
        targetRoute.items = targetRoute.items.filter((item) => item.linkedRouteId !== route.id);
      });
      state.routes = state.routes.filter((entry) => entry.id !== route.id);
      activeRouteAnchorIndex = Math.min(activeRouteAnchorIndex, Math.max(0, state.routes.length - 1));
      render();
      notify('success', '运输线路已删除。');
      return;
    }
    if (action === 'add-leg') {
      route.legs.push({ mode: '汽运（末端配送）', provider: '待调度系统指派', startNode: '上一阶段终点', endNode: '下一目的地', transitDays: '1天' });
      render();
      return;
    }
    if (action === 'remove-leg') {
      if (route.legs.length <= 1) return;
      route.legs.splice(Number(button.dataset.legIndex), 1);
      render();
      return;
    }
    if (action === 'link-items') {
      openLinkedItemPicker(route);
      return;
    }
    if (action === 'add-item') {
      route.items.push(normalizeItem({ id: 'IT' + Date.now(), tradeContractNo: '', tradeContractType: '销售合同', name: '智能储能柜整机', description: '新加货品明细', standardQty: 10, pieceCount: 10, pieceCountUnit: '箱', grossWeight: 1, grossWeightUnit: '吨', volume: 2, volumeUnit: 'm³', standardUnit: '箱', pieceWeight: 0, pieceWeightUnit: 'kg', specDimensions: '', overRate: 0, underRate: 0, goodsValueUnitPrice: 0, goodsValueAmount: 0, goodsValueCurrency: 'CNY', packageQuantity: 10, packageUnit: '箱', englishName: '', count: 10, unit: '箱', weight: 1, vol: 2, billedQty: 1, billedUnit: '吨' }));
      render();
      return;
    }
    if (action === 'remove-item') {
      const removedItem = route.items.find((item) => item.id === button.dataset.itemId);
      if (!removedItem) return;
      if (!removedItem.linkedRouteId) {
        const summary = referenceSummary(route, removedItem);
        const message = deletionBlockMessage(removedItem, summary);
        if (message) {
          window.__lastOrderReferenceError = message;
          notify('error', message);
          return;
        }
      }
      if (route.items.length <= 1) { notify('error', '每条线路至少需要保留 1 项商品。'); return; }
      route.items = route.items.filter((item) => item.id !== button.dataset.itemId);
      if (removedItem) {
        state.routes.forEach((targetRoute) => {
          targetRoute.items = targetRoute.items.filter((item) => !(item.linkedRouteId === route.id && item.linkedItemId === removedItem.id));
        });
      }
      render();
      return;
    }
  }

  function openPreview() {
    previewBody.innerHTML = state.routes.map((route, index) => {
      const totals = routeTotals(route);
      const routeTitle = 'LR-' + String(index + 1).padStart(3, '0') + ' · 线路 #' + (index + 1) + (hasSpecifiedTransportMode() ? ' (' + escapeHtml(route.type) + ')' : '');
      return '<article class="order-route-preview-item"><div class="order-route-preview-item-head"><div class="order-route-preview-item-title">' + routeTitle + '</div><span class="status-pill">待派发承运商</span></div>' +
        '<div class="order-route-preview-grid"><div><strong>路线：</strong>' + escapeHtml(route.origin) + ' → ' + escapeHtml(route.destination) + '</div>' + (hasSpecifiedTransportMode() && route.type !== '航空' ? '<div><strong>装运类别：</strong>' + escapeHtml(route.shipmentCategory) + '</div>' : '') + '<div><strong>货品批次：</strong>' + route.items.map((rowItem) => { const item = resolveLinkedItem(rowItem) || rowItem; return escapeHtml(item.name) + '（' + escapeHtml(item.standardQty) + escapeHtml(item.standardUnit) + '）'; }).join('、') + '</div><div><strong>计费毛重：</strong>' + totals.weight.toFixed(2) + ' 吨 / ' + totals.volume.toFixed(2) + ' m³</div></div>' +
        (hasSpecifiedTransportMode() && route.type === '多式联运' ? '<div class="order-route-preview-note">包含 ' + route.legs.length + ' 个联运段：' + route.legs.map((leg) => escapeHtml(leg.mode)).join(' → ') + '</div>' : '') +
      '</article>';
    }).join('');
    preview.hidden = false;
    preview.querySelector('.order-route-preview-dialog').focus();
  }

  function closePreview() { preview.hidden = true; }

  function flowModeIconMarkup(type) {
    const icons = {
      '汽运': '<path d="M3.5 6.5h10v10h-10zM13.5 10h3l3 3v3.5h-6z"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/>',
      '水运': '<path d="M4 12h16l-2.4 5H6.4zM7 12V7h10v5M12 7V3"/><path d="M3 20c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1"/>',
      '铁运': '<rect x="6" y="3" width="12" height="14" rx="3"/><path d="M8 7h8M8 11h8M9 17l-2 4M15 17l2 4"/>',
      '航空': '<path d="M3 13l18-8-7 16-3-6z"/><path d="M11 15l10-10"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (icons[type] || icons['汽运']) + '</svg>';
  }

  function flowQuantityText(route) {
    const items = route.items.map((rowItem) => resolveLinkedItem(rowItem) || rowItem);
    const total = items.reduce((sum, item) => sum + number(item.standardQty), 0);
    const unit = items[0]?.standardUnit || '吨';
    const quantity = Number.isInteger(total) ? String(total) : total.toFixed(2).replace(/.?0+$/, '');
    return quantity + ' ' + unit;
  }

  function flowCardsMarkup() {
    if (!state.routes.length) return '<div class="order-flow-empty">暂无运输线路</div>';
    return state.routes.map((route, index) => {
      const type = hasSpecifiedTransportMode() ? (route.type || '汽运') : '综合运输';
      const category = hasSpecifiedTransportMode() && route.type !== '航空' ? (route.shipmentCategory || '') : '';
      const title = type + (category ? ' · ' + category : '');
      const delegationNo = 'WT' + String(index + 1).padStart(3, '0');
      return '<article class="order-flow-card" data-flow-route-card="' + escapeHtml(route.id) + '">' +
        '<div class="order-flow-card-head"><div class="order-flow-card-title"><span class="order-flow-mode-icon">' + flowModeIconMarkup(type) + '</span><span>' + escapeHtml(title) + '</span></div><span class="order-flow-card-status">执行中</span></div>' +
        '<div class="order-flow-card-meta"><span>' + delegationNo + ' · ' + escapeHtml(type) + '</span><span>' + escapeHtml(flowQuantityText(route)) + '</span></div>' +
        '<div class="order-flow-card-routes"><div class="order-flow-route-line"><i class="order-flow-route-dot"></i><span class="order-flow-route-copy" title="' + escapeHtml(route.origin || '起运地') + '">' + escapeHtml(route.origin || '起运地') + '</span></div><div class="order-flow-route-line"><i class="order-flow-route-dot destination"></i><span class="order-flow-route-copy" title="' + escapeHtml(route.destination || '目的地') + '">' + escapeHtml(route.destination || '目的地') + '</span></div></div>' +
      '</article>';
    }).join('');
  }

  function applyFlowZoom() {
    if (flowZoomLabel) flowZoomLabel.textContent = flowZoomPercent + '%';
    if (flowCanvasInner) flowCanvasInner.style.transform = 'scale(' + (flowZoomPercent / 200) + ')';
  }

  function centerFlowCanvas() {
    if (!flowCanvas) return;
    flowCanvas.scrollLeft = Math.max(0, (flowCanvas.scrollWidth - flowCanvas.clientWidth) / 2);
    flowCanvas.scrollTop = Math.max(0, (flowCanvas.scrollHeight - flowCanvas.clientHeight) / 2);
  }

  function openFlowDrawer() {
    if (flowCards) flowCards.innerHTML = flowCardsMarkup();
    flowZoomPercent = 200;
    applyFlowZoom();
    flowDrawer.hidden = false;
    window.requestAnimationFrame(() => { centerFlowCanvas(); flowClose.focus(); });
  }

  function closeFlowDrawer() {
    flowDrawer.hidden = true;
    if (document.fullscreenElement) document.exitFullscreen?.();
  }

  function openLinkedItemPicker(route) {
    linkPickerRouteId = route.id;
    const existingLinks = new Set(route.items.filter((item) => item.linkedRouteId && item.linkedItemId).map((item) => item.linkedRouteId + '::' + item.linkedItemId));
    const groups = state.routes
      .map((sourceRoute, routeIndex) => ({ sourceRoute, routeIndex }))
      .filter(({ sourceRoute }) => sourceRoute.id !== route.id)
      .sort((a, b) => a.routeIndex - b.routeIndex);

    const cell = (value) => '<td>' + escapeHtml(value == null || value === '' ? '—' : value) + '</td>';
    const bodyRows = groups.map(({ sourceRoute, routeIndex }) => {
      const headText = '线路 #' + (routeIndex + 1) + ' · ' + (sourceRoute.origin || '未指定起运地') + ' → ' + (sourceRoute.destination || '未指定目的地') +
        ' · ' + (sourceRoute.type || '') + (sourceRoute.shipmentCategory ? ' · ' + sourceRoute.shipmentCategory : '');
      const headRow = '<tr class="order-route-link-group-row"><td colspan="24">' + escapeHtml(headText) + '</td></tr>';
      const itemRows = (sourceRoute.items || [])
        .map((sourceRow, itemIndex) => ({ sourceRow, itemIndex }))
        .sort((a, b) => a.itemIndex - b.itemIndex)
        .map(({ sourceRow, itemIndex }) => {
          const sourceItem = resolveLinkedItem(sourceRow) || sourceRow;
          const disabled = existingLinks.has(sourceRoute.id + '::' + sourceRow.id) ? ' disabled' : '';
          return '<tr>' +
            '<td><input type="checkbox" data-link-source-route="' + escapeHtml(sourceRoute.id) + '" data-link-source-item="' + escapeHtml(sourceRow.id) + '" aria-label="选择线路' + (routeIndex + 1) + '商品行' + (itemIndex + 1) + '"' + disabled + '></td>' +
            cell(itemIndex + 1) +
            cell(sourceItem.name) +
            cell(sourceItem.description) +
            cell(sourceItem.pieceCount) +
            cell(sourceItem.pieceCountUnit) +
            cell(sourceItem.grossWeight) +
            cell(sourceItem.grossWeightUnit) +
            cell(sourceItem.volume) +
            cell(sourceItem.volumeUnit) +
            cell(sourceItem.standardQty) +
            cell(sourceItem.standardUnit) +
            cell(sourceItem.pieceWeight) +
            cell(sourceItem.pieceWeightUnit) +
            cell(sourceItem.specDimensions) +
            cell(sourceItem.overRate) +
            cell(sourceItem.underRate) +
            cell(sourceItem.goodsValueUnitPrice) +
            cell(sourceItem.goodsValueAmount) +
            cell(sourceItem.goodsValueCurrency) +
            cell(linkedItemReference(sourceRow)) +
            cell(sourceItem.englishName) +
            cell(sourceItem.tradeContractNo) +
            cell(sourceItem.tradeContractType) +
            '</tr>';
        }).join('');
      return itemRows ? headRow + itemRows : '';
    }).join('');

    const headers = ['', '行号', '商品分类', '商品描述', '件数', '件数单位', '毛重', '毛重单位', '体积', '体积单位', '标准数量', '标准单位', '单件重量', '单件重量单位', '规格尺寸', '溢装率（%）', '短装率（%）', '货值单价', '货值金额', '货值币种', '关联线路/商品行号', '商品英文名', '贸易合同号', '贸易合同类型'];
    const content = bodyRows
      ? '<div style="overflow:auto;max-height:52vh"><table class="order-route-link-table" style="border-collapse:collapse;font-size:12px;white-space:nowrap"><thead><tr>' + headers.map((text) => '<th style="position:sticky;top:0;background:#f7f9fc;padding:6px 8px;border-bottom:1px solid #e5ebf3;text-align:left">' + text + '</th>').join('') + '</tr></thead><tbody>' + bodyRows + '</tbody></table></div>'
      : '<div class="order-route-empty">暂无可关联的其他线路商品。</div>';
    linkPickerBody.innerHTML = content;
    linkPicker.hidden = false;
    linkPicker.querySelector('.order-route-preview-dialog').focus();
  }

  function closeLinkedItemPicker() {
    linkPicker.hidden = true;
    linkPickerRouteId = null;
  }

  function confirmLinkedItems() {
    const targetRoute = findRoute(linkPickerRouteId);
    if (!targetRoute) { closeLinkedItemPicker(); return; }
    const checked = Array.from(linkPickerBody.querySelectorAll('input[type="checkbox"]:checked'));
    if (!checked.length) {
      notify('error', '请先勾选商品！');
      return;
    }
    checked.forEach((checkbox, index) => {
      const sourceRoute = findRoute(checkbox.dataset.linkSourceRoute);
      const sourceItem = sourceRoute?.items.find((item) => item.id === checkbox.dataset.linkSourceItem);
      targetRoute.items.push({ id: 'LINK' + Date.now() + index, linkedRouteId: checkbox.dataset.linkSourceRoute, linkedItemId: checkbox.dataset.linkSourceItem, linkedQty: Math.max(0, number(sourceItem?.standardQty ?? sourceItem?.count)) });
    });
    render();
    closeLinkedItemPicker();
    if (checked.length) notify('success', '已关联 ' + checked.length + ' 项其他线路商品。');
  }

  anchorTabsHost?.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-route-anchor]');
    if (!tab) return;
    const index = Number(tab.dataset.routeAnchor);
    const route = state.routes[index];
    if (!route) return;
    activeRouteAnchorIndex = index;
    route.collapsed = false;
    render();
    window.requestAnimationFrame(() => {
      const card = cardsHost.querySelector('[data-route-card="' + route.id + '"]');
      card?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  document.addEventListener('click', (event) => {
    const submitButton = event.target.closest('#submitOrderBtn, #submitFillLogisticsBtn, #submitAutoTaskBtn');
    if (!submitButton) return;
    const validation = validateReferencedItemQuantities();
    if (!validation.valid) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  pageScope.addEventListener('click', (event) => {
    const feeRouteToggle = event.target.closest('[data-fee-route-toggle]');
    if (feeRouteToggle) { openFeeRouteMenu(feeRouteToggle); return; }
    const feeButton = event.target.closest('[data-fee-action]');
    if (feeButton) { handleFeeAction(feeButton); return; }
    const button = event.target.closest('[data-route-action]');
    if (button) handleAction(button);
  });
  pageScope.addEventListener('input', (event) => {
    if (event.target.matches('[data-route-field], [data-route-operation], [data-leg-field], [data-item-field], [data-fee-field], [data-container-field], [data-party-field]')) {
      updateControl(event.target);
      refreshDerived();
    }
  });
  pageScope.addEventListener('change', (event) => {
    if (event.target.matches('[data-fee-select-all]')) {
      estimateHost.querySelectorAll('[data-fee-select][data-fee-direction="' + event.target.dataset.feeSelectAll + '"]').forEach((checkbox) => { checkbox.checked = event.target.checked; });
      return;
    }
    if (!event.target.matches('[data-route-field], [data-route-operation], [data-leg-field], [data-item-field], [data-fee-field], [data-container-field], [data-party-field]')) return;
    updateControl(event.target);
    if (['type', 'shipmentCategory', 'origin', 'destination', 'originPort', 'destinationPort', 'agent', 'deliveryPlace'].includes(event.target.dataset.routeField) || event.target.dataset.itemField === 'name') render();
    else refreshDerived();
  });
  feeRouteMenu?.addEventListener('change', (event) => {
    if (event.target.matches('[data-fee-route-option]')) updateFeeRouteSelection(event.target);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-fee-route-toggle], #orderFeeRouteMenu')) closeFeeRouteMenu();
  });
  window.addEventListener('scroll', (event) => {
    if (!feeRouteMenu?.contains(event.target)) closeFeeRouteMenu();
  }, true);
  window.addEventListener('resize', closeFeeRouteMenu);
  linkPickerClose.addEventListener('click', closeLinkedItemPicker);
  linkPickerCancel.addEventListener('click', closeLinkedItemPicker);
  linkPicker.addEventListener('click', (event) => { if (event.target === linkPicker) closeLinkedItemPicker(); });
  linkPickerConfirm.addEventListener('click', confirmLinkedItems);
  flowClose.addEventListener('click', closeFlowDrawer);
  flowZoomOut.addEventListener('click', () => {
    flowZoomPercent = Math.max(100, flowZoomPercent - 25);
    applyFlowZoom();
    centerFlowCanvas();
  });
  flowZoomIn.addEventListener('click', () => {
    flowZoomPercent = Math.min(300, flowZoomPercent + 25);
    applyFlowZoom();
    centerFlowCanvas();
  });
  flowFit.addEventListener('click', () => {
    flowZoomPercent = 200;
    applyFlowZoom();
    centerFlowCanvas();
  });
  flowFullscreen.addEventListener('click', () => {
    const drawer = flowDrawer.querySelector('.order-flow-drawer');
    if (!document.fullscreenElement) drawer?.requestFullscreen?.();
    else document.exitFullscreen?.();
  });
  flowDrawer.addEventListener('click', (event) => { if (event.target === flowDrawer) closeFlowDrawer(); });
  window.addEventListener('message', (event) => { if (event.data?.type === 'close-demand-panorama') closeFlowDrawer(); });
  previewClose.addEventListener('click', closePreview);
  previewCancel.addEventListener('click', closePreview);
  preview.addEventListener('click', (event) => { if (event.target === preview) closePreview(); });
  previewConfirm.addEventListener('click', () => {
    notify('success', '已按 ' + state.routes.length + ' 条运输线路生成物流需求，等待承运商调度。');
    closePreview();
  });
  specifiedModeSelect?.addEventListener('change', () => {
    if (typeof window.syncOrderTransportVisibility === 'function') window.syncOrderTransportVisibility();
    render();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (feeRouteMenu && !feeRouteMenu.hidden) closeFeeRouteMenu();
    else if (!flowDrawer.hidden) closeFlowDrawer();
    else if (!linkPicker.hidden) closeLinkedItemPicker();
    else if (!preview.hidden) closePreview();
  });

  const orderStatusField = document.getElementById('orderStatusField');
  if (orderStatusField) {
    new MutationObserver(syncRouteHeaderActions).observe(orderStatusField, { childList: true, characterData: true, subtree: true });
  }

  window.OrderRoutesValidation = {
    validateReferences: () => validateReferencedItemQuantities(),
    validateSubmitReferences: () => validateSubmitReferences(),
    getLastError: () => window.__lastOrderReferenceError || '',
    getReferenceSummary: (routeId, itemId) => {
      const route = findRoute(routeId);
      const item = route?.items.find((entry) => entry.id === itemId);
      return route && item ? referenceSummary(route, item) : null;
    }
  };

  window.OrderRoutes = window.OrderRoutesValidation;
  const serviceScopeInputs = Array.from(document.querySelectorAll('input[name="orderServiceScope"]'));
  serviceScopeInputs.forEach((input) => input.addEventListener('change', () => render()));
  render();
})();
