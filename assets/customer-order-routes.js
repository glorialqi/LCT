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
  const orderProductsHost = document.getElementById('orderProductsHost');
  const orderProductPicker = document.getElementById('orderProductPicker');
  const orderProductPickerBody = document.getElementById('orderProductPickerBody');
  const orderProductPickerClose = document.getElementById('orderProductPickerClose');
  const orderProductPickerCancel = document.getElementById('orderProductPickerCancel');
  const orderProductPickerConfirm = document.getElementById('orderProductPickerConfirm');
  const serviceProductEditor = document.getElementById('serviceProductEditor');
  const serviceProductEditorName = document.getElementById('serviceProductEditorName');
  const serviceProductEditorLimit = document.getElementById('serviceProductEditorLimit');
  const serviceProductEditorStandardQty = document.getElementById('serviceProductEditorStandardQty');
  const serviceProductEditorStandardUnit = document.getElementById('serviceProductEditorStandardUnit');
  const serviceProductEditorPieceQty = document.getElementById('serviceProductEditorPieceQty');
  const serviceProductEditorPieceUnit = document.getElementById('serviceProductEditorPieceUnit');
  const serviceProductEditorGrossQty = document.getElementById('serviceProductEditorGrossQty');
  const serviceProductEditorGrossUnit = document.getElementById('serviceProductEditorGrossUnit');
  const serviceProductEditorValidation = document.getElementById('serviceProductEditorValidation');
  const serviceProductEditorClose = document.getElementById('serviceProductEditorClose');
  const serviceProductEditorCancel = document.getElementById('serviceProductEditorCancel');
  const serviceProductEditorSave = document.getElementById('serviceProductEditorSave');
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
  let orderProductPickerContext = null;
  let serviceProductEditorContext = null;
  let feeRouteMenuContext = null;
  let flowZoomPercent = 200;
  let activeRouteAnchorIndex = 0;
  const specifiedModeSelect = document.getElementById('orderSpecifiedTransportMode');
  const routePageParams = new URLSearchParams(window.location.search);
  const existingOrderContext = routePageParams.get('mode') !== 'create' && (document.documentElement.classList.contains('detail-mode') || routePageParams.get('maintenance') === '1');
  const hierarchyMode = document.documentElement.dataset.orderRouteLayout === 'goods-arrangements';
  const goodsSummaryExpandable = document.body.classList.contains('customer-workbench');

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
    '山东省/日照市/岚山港区',
    '福建省/漳州市/招商局漳州开发区',
    '福建省/厦门市/海沧港区',
    '天津市/滨海新区/天津港区'
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
    window.orderRouteHasWaterPiece = hierarchyMode
      ? state.routes.some((route) => (route.items || []).some((product) => (product.arrangements || []).some((arrangement) => arrangement.type === '水运' && arrangement.shipmentCategory === '件杂')))
      : state.routes.some((route) => route.type === '水运' && route.shipmentCategory === '件杂');
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
  const portOptions = ['青岛港', '上海港', '宁波舟山港', '天津港', '深圳港', '胡志明港', '海防港', '新加坡港', '鹿特丹港', '洛杉矶港', '舟山鼠浪湖', '武汉青山码头', '漳州港', '厦门港'];
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
    '武汉青山码头': '中国 / 湖北省 / 武汉市',
    '漳州港': '中国 / 福建省 / 漳州市',
    '厦门港': '中国 / 福建省 / 厦门市'
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
      specialNotes: '水运干线运输，需全程跟踪到港及提货节点。', mailRecipients: [{ name: '叶李滨', email: 'yeli@example.com' }],
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

  function pendingReviewCoverageRoutes() {
    const makeCoverageItem = (id, spec) => normalizeItem({
      id,
      tradeContractNo: spec.contractNo,
      tradeContractType: spec.contractType || '销售合同',
      name: spec.name,
      description: spec.description,
      standardQty: spec.quantity,
      standardUnit: spec.unit,
      pieceCount: spec.pieceCount ?? spec.quantity,
      pieceCountUnit: spec.pieceCountUnit || spec.unit,
      grossWeight: spec.weight,
      grossWeightUnit: '吨',
      volume: spec.volume,
      volumeUnit: 'm³',
      pieceWeight: spec.pieceWeight ?? 0.5,
      pieceWeightUnit: '吨',
      specDimensions: spec.dimensions || '1200 × 1000 × 1100 mm',
      overRate: spec.overRate ?? 3,
      underRate: spec.underRate ?? 1,
      goodsValueUnitPrice: spec.unitPrice ?? 12000,
      goodsValueAmount: spec.amount ?? (spec.quantity * (spec.unitPrice ?? 12000)),
      goodsValueCurrency: 'CNY',
      packageQuantity: spec.packageQuantity ?? spec.quantity,
      packageUnit: spec.packageUnit || spec.unit,
      englishName: spec.englishName || '',
      count: spec.quantity,
      unit: spec.unit,
      weight: spec.weight,
      vol: spec.volume,
      billedQty: spec.weight,
      billedUnit: '吨'
    });

    const makeCoverageRoute = (spec) => {
      const route = makeRoute(spec.type);
      Object.assign(route, spec.route || {});
      route.id = spec.id;
      route.collapsed = false;
      route.type = spec.type;
      route.shipmentCategory = spec.category;
      if (route.originPort) {
        route.origin = route.originPort;
        route.originRegion = (spec.route && spec.route.originRegion) || portRegions[route.originPort] || route.originRegion || '';
      }
      if (route.destinationPort) {
        route.destination = route.destinationPort;
        route.destinationRegion = (spec.route && spec.route.destinationRegion) || portRegions[route.destinationPort] || route.destinationRegion || '';
      }
      route.items = [makeCoverageItem(spec.id + '-ITEM', spec.item)];
      return route;
    };

    return [
      makeCoverageRoute({
        id: 'COV-R1', type: '汽运', category: '散货',
        route: {
          originType: '工厂', destinationType: '仓库',
          originRegion: '中国 / 上海市', destinationRegion: '中国 / 广东省 / 广州市',
          consignee: '广州广汽埃安新能源一号工厂',
          origin: '上海市/嘉定区/陆渡镇物流园区', originDetail: '上海市嘉定区丰茂路888号1号库', originContact: '李发货', originContactPhone: '13900001111',
          destination: '广东省/广州市/黄埔区保税区', destinationDetail: '广州市黄埔区开创大道999号3号门', destinationContact: '王收货', destinationContactPhone: '13722223333',
          expectDispatch: '2026-09-22 09:00', latestArrival: '2026-09-24 18:00',
          specialNotes: '需要车厢净高不低于2.8米，配备尾板。'
        },
        item: { name: '新能源汽车动力电池模组', description: '危险品 UN3480', quantity: 20, unit: '托', weight: 17, volume: 22, contractNo: 'HT-2026-001', englishName: 'EV Battery Module', pieceWeight: 0.85, dimensions: '1200 × 1000 × 1100 mm', unitPrice: 12000, packageQuantity: 20, packageUnit: '托' }
      }),
      makeCoverageRoute({
        id: 'COV-R2', type: '汽运', category: '集装箱',
        route: {
          originType: '仓库', destinationType: '工厂',
          originRegion: '中国 / 江苏省 / 苏州市', destinationRegion: '中国 / 四川省 / 成都市',
          consignee: '成都国际铁路港储能中心',
          origin: '江苏省/苏州市/工业园区海关监管库', originDetail: '苏州市工业园区胜浦路123号', originContact: '陈调度', originContactPhone: '13588889999',
          destination: '四川省/成都市/青白江铁路港', destinationDetail: '成都市青白江区货运大道2号库', destinationContact: '赵仓管', destinationContactPhone: '13611112222',
          expectDispatch: '2026-09-23 08:00', latestArrival: '2026-09-28 12:00',
          specialNotes: '集装箱运输，需提供到场提柜时间。'
        },
        item: { name: '精密电子元器件 A3', description: '防潮防震', quantity: 100, unit: '箱', weight: 5, volume: 12, contractNo: 'HT-2026-002', englishName: 'Precision Electronic Components A3', pieceWeight: 0.05, dimensions: '600 × 400 × 300 mm', unitPrice: 680, packageQuantity: 100, packageUnit: '箱' }
      }),
      makeCoverageRoute({
        id: 'COV-R3', type: '水运', category: '散货',
        route: {
          shippingType: '国内航运', originPort: '青岛港', destinationPort: '宁波舟山港',
          originTerminal: '青岛前湾集装箱码头', destinationTerminal: '宁波舟山港北仑第三集装箱码头',
          latestShipmentDate: '2026-11-30', dischargeTerms: 'FIO', directSailing: '是',
          vesselCertificate: '船级社证书', vesselAge: '不超过15年', commissionRate: 1.2,
          specialNotes: '散货装船前完成水尺计重。'
        },
        item: { name: '进口铁矿石', description: '散装矿石', quantity: 1200, unit: '吨', weight: 1200, volume: 520, contractNo: 'HT-2026-003', englishName: 'Iron Ore', pieceWeight: 1, dimensions: '散装', unitPrice: 820, packageQuantity: 1, packageUnit: '票' }
      }),
      makeCoverageRoute({
        id: 'COV-R4', type: '水运', category: '件杂',
        route: {
          shippingType: '国际航运', originPort: '上海港', destinationPort: '胡志明港',
          originTerminal: '上海洋山四期自动化码头', destinationTerminal: '胡志明吉莱港',
          originContact: '陈调度', originContactPhone: '13588889999', destinationContact: '赵仓管', destinationContactPhone: '13611112222',
          latestShipmentDate: '2026-12-05', dischargeTerms: 'FIO', isCqd: '否', directSailing: '是', containsLashing: '是',
          vesselCertificate: '船级社证书', vesselAge: '不超过15年', commissionRate: 2, bookingManager: '王经理',
          laycanStart: '2026-12-01', laycanEnd: '2026-12-03', mailRecipients: [{ name: '叶李滨', email: 'yeli@example.com' }, { name: '陈一一', email: 'chenyiyi@example.com' }],
          specialNotes: '水运干线运输，需全程跟踪到港及提货节点。',
          parties: {
            shipperName: '上海国际物流有限公司', consigneeName: 'Vietnam Energy Co., Ltd.', notifyName: 'Vietnam Energy Co., Ltd.',
            shipperInfo: '上海市浦东新区港城路88号，陈调度 13588889999', consigneeInfo: 'Ho Chi Minh City Port Zone, 赵仓管 +84 13611112222', notifyInfo: '同收货人'
          }
        },
        item: { name: '智能储能柜整机', description: '重型装备', quantity: 4, unit: '台', weight: 14, volume: 32.8, contractNo: 'HT-2026-004', englishName: 'Energy Storage Cabinet', pieceWeight: 3.5, dimensions: '2400 × 1200 × 2200 mm', unitPrice: 85000, packageQuantity: 4, packageUnit: '台' }
      }),
      makeCoverageRoute({
        id: 'COV-R5', type: '水运', category: '集装箱',
        route: {
          shippingType: '国际航运', originPort: '宁波舟山港', destinationPort: '鹿特丹港',
          packingMethod: '整箱运输(FCL)', bookingMethod: '船公司箱(COC)', solicitationMethod: '我司揽货',
          agent: '中远海运', agentCode: 'COSCO', agentSalesperson: '林海',
          receivingPlace: '上海市/嘉定区/陆渡镇物流园区', receivingRegion: '中国 / 上海市', receivingDetail: '上海市嘉定区丰茂路888号1号库',
          originServiceTerms: 'CY/CY', originTerminal: '宁波舟山港北仑第三集装箱码头',
          destinationServiceTerms: 'CY/CY', destinationTerminal: '鹿特丹Euromax码头',
          deliveryPlace: '德国/汉堡', deliveryRegion: '德国 / 汉堡', deliveryDetail: 'Hamburg Warehouse, Germany',
          specialNotes: '重箱不叠放，箱门朝车尾。',
          containers: [
            { type: '40HQ', quantity: 2, containerNo: 'TCLU9988776', remark: '重箱不叠放' },
            { type: '20GP', quantity: 1, containerNo: 'CSNU1122334', remark: '箱门朝车尾' }
          ]
        },
        item: { name: '光伏单晶硅片包套', description: '恒温恒湿要求', quantity: 50, unit: '箱', weight: 10, volume: 22.5, contractNo: 'HT-2026-005', englishName: 'Monocrystalline Silicon Wafer', pieceWeight: 0.2, dimensions: '1800 × 1200 × 1000 mm', unitPrice: 3200, packageQuantity: 50, packageUnit: '箱' }
      }),
      makeCoverageRoute({
        id: 'COV-R6', type: '铁运', category: '散货',
        route: {
          originType: '工厂', destinationType: '仓库', originRegion: '中国 / 上海市', destinationRegion: '中国 / 广东省 / 广州市',
          consignee: '广州广汽埃安新能源一号工厂', origin: '上海市/嘉定区/陆渡镇物流园区', originDetail: '上海市嘉定区丰茂路888号1号库', originContact: '李发货', originContactPhone: '13900001111',
          destination: '广东省/广州市/黄埔区保税区', destinationDetail: '广州市黄埔区开创大道999号3号门', destinationContact: '王收货', destinationContactPhone: '13722223333',
          expectDispatch: '2026-12-06 08:00', latestArrival: '2026-12-09 18:00', specialNotes: '铁路散货运输，需防雨篷布覆盖。'
        },
        item: { name: '冷轧钢卷', description: '防潮防锈', quantity: 80, unit: '吨', weight: 80, volume: 36, contractNo: 'HT-2026-006', englishName: 'Cold Rolled Steel Coil', pieceWeight: 2.5, dimensions: '1500 × 1250 × 1100 mm', unitPrice: 4600, packageQuantity: 32, packageUnit: '托' }
      }),
      makeCoverageRoute({
        id: 'COV-R7', type: '铁运', category: '集装箱',
        route: {
          originType: '仓库', destinationType: '工厂', originRegion: '中国 / 江苏省 / 苏州市', destinationRegion: '中国 / 四川省 / 成都市',
          consignee: '四川时代新能源科技有限公司', origin: '江苏省/苏州市/工业园区海关监管库', originDetail: '苏州市工业园区胜浦路123号', originContact: '陈调度', originContactPhone: '13588889999',
          destination: '四川省/成都市/青白江铁路港', destinationDetail: '成都市青白江区货运大道2号库', destinationContact: '赵仓管', destinationContactPhone: '13611112222',
          expectDispatch: '2026-12-07 08:00', latestArrival: '2026-12-12 18:00', specialNotes: '铁路集装箱运输，需提供箱号清单。'
        },
        item: { name: '高端工业润滑油', description: '防倾倒', quantity: 40, unit: '桶', weight: 8, volume: 18, contractNo: 'HT-2026-007', englishName: 'High-end Industrial Lubricant', pieceWeight: 0.2, dimensions: '600 × 600 × 900 mm', unitPrice: 950, packageQuantity: 40, packageUnit: '桶' }
      }),
      makeCoverageRoute({
        id: 'COV-R8', type: '航空', category: '散货',
        route: {
          originPort: '上海浦东国际机场', destinationPort: '洛杉矶国际机场', originRegion: '中国 / 上海市', destinationRegion: '美国 / 加利福尼亚州 / 洛杉矶市',
          airInternalOrderNo: 'AIR-SH-20261125-01', airlineMasterNo: '999-12345678', splitMode: '主分', customerOrderNo: 'CUS-AIR-001',
          solicitationMethod: '我司揽货', supplier: '华贸物流', agent: '华贸航空', agentCode: 'HMA', agentSalesperson: '周航',
          airRoute: '上海—洛杉矶', etd: '2026-11-28', eta: '2026-11-29', operationRequirements: ['出分单', '报关'],
          specialNotes: '精密电子元器件，需防静电包装。'
        },
        item: { name: '精密电子元器件 A3', description: '航空急件', quantity: 100, unit: '箱', weight: 5, volume: 12, contractNo: 'HT-2026-008', englishName: 'Precision Electronic Components A3', pieceWeight: 0.05, dimensions: '600 × 400 × 300 mm', unitPrice: 680, packageQuantity: 100, packageUnit: '箱' }
      }),
      makeCoverageRoute({
        id: 'COV-R9', type: '航空', category: '集装箱',
        route: {
          originPort: '上海浦东国际机场', destinationPort: '法兰克福机场', originRegion: '中国 / 上海市', destinationRegion: '德国 / 黑森州 / 法兰克福市',
          airInternalOrderNo: 'AIR-SH-20261125-02', airlineMasterNo: '020-87654321', splitMode: '主单', customerOrderNo: 'CUS-AIR-002',
          solicitationMethod: '客户指定', supplier: '嘉里大通', agent: '嘉里大通', agentCode: 'KER', agentSalesperson: '王倩',
          airRoute: '上海—法兰克福', etd: '2026-11-30', eta: '2026-12-01', operationRequirements: ['包板', '接货', '送货'],
          specialNotes: '航空集装箱运输，需提供集装器编号。'
        },
        item: { name: '高端工业润滑油', description: '航空集装货物', quantity: 40, unit: '桶', weight: 8, volume: 18, contractNo: 'HT-2026-009', englishName: 'High-end Industrial Lubricant', pieceWeight: 0.2, dimensions: '600 × 600 × 900 mm', unitPrice: 950, packageQuantity: 40, packageUnit: '桶' }
      })
    ];
  }

  let hierarchySequence = 0;
  function makeHierarchyArrangement(config) {
    hierarchySequence += 1;
    const arrangement = makeRoute(config.type || '汽运');
    arrangement.id = 'ARR' + Date.now() + hierarchySequence;
    arrangement.items = [];
    arrangement.collapsed = config.collapsed ?? true;
    arrangement.type = config.type || '汽运';
    arrangement.shipmentCategory = config.shipmentCategory || categoriesForType(arrangement.type)[0];
    arrangement.origin = config.origin || '';
    arrangement.destination = config.destination || '';
    arrangement.originType = config.originType || '工厂';
    arrangement.destinationType = config.destinationType || '港口';
    arrangement.originRegion = config.originRegion || locationRegions[arrangement.origin] || portRegions[config.originPort] || '';
    arrangement.destinationRegion = config.destinationRegion || locationRegions[arrangement.destination] || portRegions[config.destinationPort] || '';
    arrangement.originPort = config.originPort || '';
    arrangement.destinationPort = config.destinationPort || '';
    arrangement.originTerminal = config.originTerminal || '';
    arrangement.destinationTerminal = config.destinationTerminal || '';
    arrangement.originContact = config.originContact || '';
    arrangement.originContactPhone = config.originContactPhone || '';
    arrangement.destinationContact = config.destinationContact || '';
    arrangement.destinationContactPhone = config.destinationContactPhone || '';
    arrangement.latestShipmentDate = config.latestShipmentDate || '';
    arrangement.dischargeTerms = config.dischargeTerms || '';
    arrangement.directSailing = config.directSailing || '';
    arrangement.vesselCertificate = config.vesselCertificate || '';
    arrangement.vesselAge = config.vesselAge || '';
    arrangement.commissionRate = config.commissionRate ?? 0;
    arrangement.bookingManager = config.bookingManager || '';
    arrangement.laycanStart = config.laycanStart || '';
    arrangement.laycanEnd = config.laycanEnd || '';
    arrangement.packingMethod = config.packingMethod || '整箱运输(FCL)';
    arrangement.bookingMethod = config.bookingMethod || '船公司箱(COC)';
    arrangement.solicitationMethod = config.solicitationMethod || '我司揽货';
    arrangement.agent = config.agent || '';
    arrangement.agentCode = config.agentCode || '';
    arrangement.agentSalesperson = config.agentSalesperson || '';
    arrangement.deliveryPlace = config.deliveryPlace || config.destination || '';
    arrangement.deliveryRegion = config.deliveryRegion || arrangement.destinationRegion;
    arrangement.deliveryDetail = config.deliveryDetail || '';
    arrangement.hierarchyQuantity = config.quantity ?? 0;
    arrangement.hierarchyUnit = config.unit || '吨';
    arrangement.productId = config.productId || '';
    arrangement.upstreamIds = Array.isArray(config.upstreamIds) ? config.upstreamIds.slice() : [];
    arrangement.containers = (config.containers || []).map((container, index) => ({ id: 'CT' + Date.now() + hierarchySequence + index, type: container.type || '', quantity: container.quantity ?? 0, containerNo: container.containerNo || '', remark: container.remark || '' }));
    return arrangement;
  }

  function makeHierarchyProduct(config) {
    return normalizeItem({
      id: config.id,
      name: config.name,
      description: config.description || '',
      tradeContractNo: config.tradeContractNo || '',
      tradeContractType: config.tradeContractType || '销售合同',
      standardQty: config.quantity,
      standardUnit: config.unit || '吨',
      count: config.quantity,
      unit: config.unit || '吨',
      pieceCount: config.pieceCount ?? config.quantity,
      pieceCountUnit: config.pieceCountUnit || config.unit || '吨',
      grossWeight: config.grossWeight ?? config.quantity,
      grossWeightUnit: config.grossWeightUnit || '吨',
      volume: config.volume ?? 0,
      volumeUnit: config.volumeUnit || 'm³',
      pieceWeight: config.pieceWeight ?? 0,
      pieceWeightUnit: '吨',
      specDimensions: config.specDimensions || '',
      overRate: config.overRate ?? 0,
      underRate: config.underRate ?? 0,
      goodsValueUnitPrice: config.goodsValueUnitPrice ?? 0,
      goodsValueAmount: config.goodsValueAmount ?? 0,
      goodsValueCurrency: config.goodsValueCurrency || 'CNY',
      englishName: config.englishName || '',
      collapsed: config.collapsed ?? false,
      arrangements: config.arrangements || []
    });
  }

  function hierarchySampleRoutes() {
    const steelRoad1 = makeHierarchyArrangement({ type: '汽运', shipmentCategory: '散货', origin: '福建省/漳州市/招商局漳州开发区', destination: '福建省/厦门市/海沧港区', originType: '工厂', destinationType: '港口', originContact: '陈国强', originContactPhone: '13860001231', destinationContact: '厦门港收货组', destinationContactPhone: '0592-6688123', quantity: 80, unit: '吨', productId: 'P-STEEL-01', collapsed: false });
    const steelRoad2 = makeHierarchyArrangement({ type: '汽运', shipmentCategory: '散货', origin: '福建省/漳州市/招商局漳州开发区', destination: '福建省/厦门市/海沧港区', originType: '工厂', destinationType: '港口', originContact: '陈国强', originContactPhone: '13860001231', destinationContact: '厦门港收货组', destinationContactPhone: '0592-6688123', quantity: 20, unit: '吨', productId: 'P-STEEL-01', collapsed: true });
    const steelSea = makeHierarchyArrangement({ type: '水运', shipmentCategory: '集装箱', origin: '福建省/厦门市/海沧港区', destination: '天津市/滨海新区/天津港区', originPort: '厦门港', destinationPort: '天津港', originType: '港口', destinationType: '港口', originContact: '厦门港操作部', originContactPhone: '0592-6688001', destinationContact: '天津港操作部', destinationContactPhone: '022-25700001', quantity: 100, unit: '吨', productId: 'P-STEEL-01', upstreamIds: [steelRoad1.id, steelRoad2.id], packingMethod: '整箱运输(FCL)', bookingMethod: '船公司箱(COC)', solicitationMethod: '我司揽货', agent: '中远海运', agentCode: 'COSCO', agentSalesperson: '林海', deliveryPlace: '天津市/滨海新区/天津港区', latestShipmentDate: '2026-11-28', dischargeTerms: 'CY/CY', directSailing: '是', vesselCertificate: '船级社证书', vesselAge: '不超过15年', commissionRate: 1.5, bookingManager: '赵磊', laycanStart: '2026-11-25', laycanEnd: '2026-11-27', containers: [{ type: '40HQ', quantity: 4, containerNo: '', remark: '钢卷加固' }] });
    const cornRoad1 = makeHierarchyArrangement({ type: '汽运', shipmentCategory: '散货', origin: '福建省/漳州市/招商局漳州开发区', destination: '福建省/厦门市/海沧港区', originType: '工厂', destinationType: '港口', originContact: '黄志明', originContactPhone: '13960002345', destinationContact: '厦门港收货组', destinationContactPhone: '0592-6688123', quantity: 60, unit: '吨', productId: 'P-CORN-01', collapsed: true });
    const cornRoad2 = makeHierarchyArrangement({ type: '汽运', shipmentCategory: '散货', origin: '福建省/漳州市/招商局漳州开发区', destination: '福建省/厦门市/海沧港区', originType: '工厂', destinationType: '港口', originContact: '黄志明', originContactPhone: '13960002345', destinationContact: '厦门港收货组', destinationContactPhone: '0592-6688123', quantity: 20, unit: '吨', productId: 'P-CORN-01', collapsed: true });
    const cornSea = makeHierarchyArrangement({ type: '水运', shipmentCategory: '集装箱', origin: '福建省/厦门市/海沧港区', destination: '天津市/滨海新区/天津港区', originPort: '厦门港', destinationPort: '天津港', originType: '港口', destinationType: '港口', originContact: '厦门港操作部', originContactPhone: '0592-6688001', destinationContact: '天津港操作部', destinationContactPhone: '022-25700001', quantity: 80, unit: '吨', productId: 'P-CORN-01', upstreamIds: [cornRoad1.id, cornRoad2.id], packingMethod: '整箱运输(FCL)', bookingMethod: '船公司箱(COC)', solicitationMethod: '我司揽货', agent: '中远海运', agentCode: 'COSCO', agentSalesperson: '林海', deliveryPlace: '天津市/滨海新区/天津港区', latestShipmentDate: '2026-11-28', dischargeTerms: 'CY/CY', directSailing: '是', vesselCertificate: '船级社证书', vesselAge: '不超过15年', commissionRate: 1, bookingManager: '赵磊', laycanStart: '2026-11-25', laycanEnd: '2026-11-27', containers: [{ type: '40HQ', quantity: 3, containerNo: '', remark: '粮食专用箱' }] });
    return [{
      id: 'R-HIER-1', collapsed: false, type: '汽运', shipmentCategory: '散货',
      origin: '福建省/漳州市/招商局漳州开发区', destination: '天津市/滨海新区/天津港区',
      originType: '工厂', destinationType: '港口', originRegion: '中国 / 福建省 / 漳州市', destinationRegion: '中国 / 天津市 / 滨海新区',
      items: [
        makeHierarchyProduct({ id: 'P-STEEL-01', name: '钢卷', description: '冷轧钢卷，防潮防撞', tradeContractNo: 'HT-SC-20261123-01', tradeContractType: '销售合同', quantity: 100, unit: '吨', pieceCount: 100, pieceCountUnit: '件', grossWeight: 0.1, grossWeightUnit: '吨', volume: 0.02, volumeUnit: 'm³', pieceWeight: 0.001, specDimensions: '1.2m × 1.0m', goodsValueUnitPrice: 4200, goodsValueAmount: 420000, englishName: 'Steel Coil', arrangements: [steelRoad1, steelRoad2, steelSea] }),
        makeHierarchyProduct({ id: 'P-CORN-01', name: '玉米', description: '散装粮食，防潮运输', tradeContractNo: 'HT-SC-20261123-02', tradeContractType: '销售合同', quantity: 80, unit: '吨', pieceCount: 80, pieceCountUnit: '件', grossWeight: 0.1, grossWeightUnit: '吨', volume: 0.01, volumeUnit: 'm³', pieceWeight: 0.001, specDimensions: '', goodsValueUnitPrice: 2800, goodsValueAmount: 224000, englishName: 'Corn', arrangements: [cornRoad1, cornRoad2, cornSea] })
      ]
    }];
  }

  const logisticsDemandProductReferences = existingOrderContext ? {
    'R1:101': { qty: 15, demandNo: 'FLR202611160017' },
    'R1:102': { qty: 30, demandNo: 'FLR202611160017' },
    'R2:201': { qty: 2, demandNo: 'FLR202611160018' }
  } : {};

  function normalizeMailRecipient(recipient) {
    if (!recipient) return null;
    if (typeof recipient === 'string') return { name: '', email: recipient.trim() };
    if (typeof recipient === 'object') return { name: String(recipient.name || '').trim(), email: String(recipient.email || '').trim() };
    return null;
  }

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
      heightDescription: item.heightDescription || '',
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

  function ensureHierarchyState(nextState) {
    if (!hierarchyMode) return nextState;
    nextState.routes = (nextState.routes || []).map((route) => {
      const products = (route.items || []).map((product) => {
        const normalizedProduct = { ...product, collapsed: product.collapsed ?? false };
        if (!Array.isArray(normalizedProduct.arrangements)) {
          normalizedProduct.arrangements = [makeHierarchyArrangement({
            type: route.type || '汽运', shipmentCategory: route.shipmentCategory, origin: route.origin, destination: route.destination,
            originType: route.originType, destinationType: route.destinationType, originPort: route.originPort, destinationPort: route.destinationPort,
            originContact: route.originContact, originContactPhone: route.originContactPhone, destinationContact: route.destinationContact,
            destinationContactPhone: route.destinationContactPhone, quantity: product.standardQty ?? product.count, unit: product.standardUnit ?? product.unit,
            productId: product.id, containers: route.containers || [], collapsed: false
          })];
        }
        normalizedProduct.arrangements = normalizedProduct.arrangements.map((arrangement) => ({
          ...arrangement,
          items: [],
          productId: normalizedProduct.id,
          collapsed: arrangement.collapsed ?? true,
          upstreamIds: Array.isArray(arrangement.upstreamIds) ? arrangement.upstreamIds : [],
          containers: (arrangement.containers || []).map((container, index) => ({ ...container, id: container.id || 'CT' + Date.now() + index }))
        }));
        return normalizedProduct;
      });
      return { ...route, collapsed: route.collapsed ?? false, items: products };
    });
    return nextState;
  }

  function orderProductKey(item) {
    return [item.name || '', item.tradeContractNo || '', item.description || ''].join('::').toLowerCase();
  }

  function ensureOrderProducts(nextState) {
    const routes = Array.isArray(nextState.routes) ? nextState.routes : [];
    const products = [];
    const seen = new Set();
    const appendProduct = (item, sourceId) => {
      if (!item || item.linkedRouteId || item.linkedItemId) return;
      const key = orderProductKey(item);
      if (seen.has(key)) return;
      const normalized = normalizeItem(item);
      const sampleContracts = { '新能源汽车动力电池模组': 'HT-2026-001', '精密电子元器件 A3': 'HT-2026-002', '智能储能柜整机': 'HT-2026-003' };
      if (!normalized.tradeContractNo && sampleContracts[normalized.name]) normalized.tradeContractNo = sampleContracts[normalized.name];
      normalized.sourceProductId = sourceId || item.sourceProductId || item.id || 'P' + (products.length + 1);
      seen.add(key);
      products.push(normalized);
    };
    (Array.isArray(nextState.orderProducts) ? nextState.orderProducts : []).forEach((item) => appendProduct(item, item.sourceProductId || item.id));
    routes.forEach((route) => (route.items || []).forEach((item) => appendProduct(item, item.sourceProductId || item.id)));
    nextState.orderProducts = products;
    routes.forEach((route) => {
      (route.items || []).forEach((item) => {
        if (item.linkedRouteId || item.sourceProductId) return;
        const match = products.find((product) => product.id === item.id || orderProductKey(product) === orderProductKey(item));
        if (match) item.sourceProductId = match.sourceProductId;
      });
    });
    return nextState;
  }

  function normalizeState(nextState) {
    nextState.routes = (nextState.routes || []).map((route) => ({ ...route, items: (route.items || []).map(normalizeItem) }));
    nextState.estimatedReceivables = Array.isArray(nextState.estimatedReceivables) ? nextState.estimatedReceivables : [];
    nextState.estimatedPayables = Array.isArray(nextState.estimatedPayables) ? nextState.estimatedPayables : [];
    nextState = ensureOrderProducts(nextState);
    return ensureHierarchyState(nextState);
  }

  let state = normalizeState(loadState());
  function loadState() {
    const scenario = new URLSearchParams(window.location.search).get('scenario');
    if (scenario === 'single-transport') {
      return { viewMode: 'card', activeTab: 0, routes: defaultRoutes().slice(0, 1), estimatedReceivables: [], estimatedPayables: [] };
    }
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
              mailRecipients: (Array.isArray(route.mailRecipients) ? route.mailRecipients : []).map(normalizeMailRecipient).filter((recipient) => recipient && (recipient.name || recipient.email)),
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
    return { viewMode: 'card', activeTab: 0, routes: hierarchyMode ? hierarchySampleRoutes() : defaultRoutes(), estimatedReceivables: [], estimatedPayables: [] };
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
    if (summary.externalRefQty > 0) reasons.push('其他服务要求引用 ' + summary.externalRefQty);
    return '商品「' + (item.name || item.description || '未命名商品') + '」对应数量 ' + quantity + '，不能小于被引用数量 ' + summary.minimumQty + '（' + reasons.join('；') + '）。';
  }

  function deletionBlockMessage(item, summary) {
    if (summary.demandRefQty <= 0 && summary.externalRefQty <= 0) return '';
    const reasons = [];
    if (summary.demandRefQty > 0) reasons.push('物流需求单' + (summary.demandNos.length ? ' ' + summary.demandNos.join('、') + ' ' : '') + '引用 ' + summary.demandRefQty);
    if (summary.externalRefQty > 0) reasons.push('其他服务要求引用 ' + summary.externalRefQty);
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
      const message = '服务要求关联商品导致任务循环联动，请删除相关关联商品后重试';
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
    return sourceRoute && sourceItemIndex >= 0 ? '服务要求 #' + (sourceRouteIndex + 1) : '原商品已删除';
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

  function routePlaceRegion(route, side) {
    const isOrigin = side === 'origin';
    const place = isOrigin ? route.origin : route.destination;
    const port = isOrigin ? route.originPort : route.destinationPort;
    return (isOrigin ? route.originRegion : route.destinationRegion) || locationRegions[place] || portRegions[port] || '';
  }

  function routeTitleMarkup(route) {
    const originRegion = routePlaceRegion(route, 'origin');
    const destinationRegion = routePlaceRegion(route, 'destination');
    const routeDescriptor = hasSpecifiedTransportMode() && route.type
      ? '<span class="order-route-descriptor">(' + escapeHtml(route.type) + (route.shipmentCategory ? ' · ' + escapeHtml(route.shipmentCategory) : '') + ')</span>'
      : '';
    return '<span class="order-route-place">' + escapeHtml(route.origin || '未指定起运地') +
      (originRegion ? '<em>（' + escapeHtml(originRegion) + '）</em>' : '') + '</span>' +
      '<span class="order-route-arrow">→</span>' +
      '<span class="order-route-place">' + escapeHtml(route.destination || '未指定目的地') +
      (destinationRegion ? '<em>（' + escapeHtml(destinationRegion) + '）</em>' : '') + '</span>' +
      routeDescriptor;
  }

  function routeCardMarkup(route, index) {
    const isMultimodal = hasSpecifiedTransportMode() && route.type === '多式联运';
    const routeId = escapeHtml(route.id);
    const singleRouteMode = state.routes.length === 1;
    const collapsed = !singleRouteMode && route.collapsed;
    const hideSingleCardHead = singleRouteMode && !orderRouteReadonly();
    const cardHead = hideSingleCardHead ? '' : '<div class="order-route-card-head"><div class="order-route-card-title"><span class="order-route-index">服务要求 #' + (index + 1) + '</span><span class="order-route-route-copy" data-route-route-copy="' + routeId + '">' + routeTitleMarkup(route) + '</span></div>' +
      '<div class="order-route-card-controls">' +
      '<button class="order-route-icon-btn" type="button" data-route-action="duplicate" data-route-id="' + routeId + '" title="复制服务要求" aria-label="复制服务要求">⧉</button>' +
      '<button class="order-route-icon-btn" type="button" data-route-action="toggle" data-route-id="' + routeId + '" title="' + (route.collapsed ? '展开服务要求' : '折叠服务要求') + '" aria-label="' + (route.collapsed ? '展开服务要求' : '折叠服务要求') + '">' + (route.collapsed ? '⌄' : '⌃') + '</button>' +
      '<button class="order-route-icon-btn danger" type="button" data-route-action="remove" data-route-id="' + routeId + '" title="删除服务要求" aria-label="删除服务要求">×</button></div></div>';
    return '<article class="order-route-card ' + (isMultimodal ? 'multimodal ' : '') + (singleRouteMode ? 'single-route-card' : '') + '" id="order-route-card-' + routeId + '" data-route-card="' + routeId + '">' +
      cardHead +
      (collapsed ? '' : routeBodyMarkup(route)) +
    '</article>';
  }

  function simplifiedRouteBodyMarkup(route) {
    const routeId = escapeHtml(route.id);
    const routeIndex = routeDisplayIndex(route);
    return '<div class="order-route-card-body">' +
      itemsMarkup(route) +
      '<div class="order-route-block order-route-transport-requirements"><div class="order-route-block-head"><div class="order-route-block-title">运输要求</div></div><div class="order-route-grid">' +
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
    const routeIndex = routeDisplayIndex(route);
    const portSelect = (fieldName, selected) => '<select class="control" data-route-field="' + fieldName + '" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + fieldName + '"><option value="">请选择</option>' + selectOptions(portOptions, selected) + '</select>';
    return '<div class="order-route-card-body">' +
      itemsMarkup(route) +
      '<div class="order-route-block order-route-transport-requirements"><div class="order-route-block-head"><div class="order-route-block-title">运输要求</div></div><div class="order-route-grid">' +
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
    const routeIndex = routeDisplayIndex(route);
    const portSelect = (fieldName, selected) => '<select class="control" data-route-field="' + fieldName + '" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + fieldName + '"><option value="">请选择</option>' + selectOptions(portOptions, selected) + '</select>';
    return '<div class="order-route-card-body">' +
      itemsMarkup(route) +
      '<div class="order-route-block order-route-transport-requirements"><div class="order-route-block-head"><div class="order-route-block-title">运输要求</div></div><div class="order-route-grid">' +
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
    const routeIndex = routeDisplayIndex(route);
    const airportSelect = (fieldName, selected) => '<select class="control" data-route-field="' + fieldName + '" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + fieldName + '"><option value="">请选择</option>' + selectOptions(airportOptions, selected) + '</select>';
    const operationChecks = airOperationOptions.map((option) => '<label class="demand-check-option"><input type="checkbox" data-route-operation="' + escapeHtml(option) + '" data-route-id="' + routeId + '"' + ((route.operationRequirements || []).includes(option) ? ' checked' : '') + '>' + escapeHtml(option) + '</label>').join('');
    return '<div class="order-route-card-body">' +
      itemsMarkup(route) +
      '<div class="order-route-block order-route-transport-requirements"><div class="order-route-block-head"><div class="order-route-block-title">运输要求</div></div><div class="order-route-grid">' +
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
    const routeIndex = routeDisplayIndex(route);
    const portSelect = (fieldName, selected) => '<select class="control" data-route-field="' + fieldName + '" data-route-id="' + routeId + '" aria-label="线路' + routeIndex + fieldName + '"><option value="">请选择</option>' + selectOptions(portOptions, selected) + '</select>';
    const mailRecipients = (route.mailRecipients || []).map(normalizeMailRecipient).filter((recipient) => recipient && (recipient.name || recipient.email));
    const mailChips = mailRecipients.map((recipient, index) => '<span class="demand-email-recipient-chip"><span class="demand-email-recipient-chip-copy"><strong>' + escapeHtml(recipient.name || '未填写姓名') + '</strong><span>&lt;' + escapeHtml(recipient.email || '未填写邮箱') + '&gt;</span></span><button type="button" data-route-action="remove-route-mail" data-route-id="' + routeId + '" data-mail-index="' + index + '" aria-label="删除邮件接收人邮箱">×</button></span>').join('');
    return '<div class="order-route-card-body">' +
      itemsMarkup(route) +
      '<div class="order-route-block order-route-transport-requirements"><div class="order-route-block-head"><div class="order-route-block-title">运输要求</div></div><div class="order-route-grid">' +
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
        field('邮件接收人+邮箱', '<div class="demand-email-recipient-box route-mail-recipient-box" data-route-mail-box><div class="demand-email-recipient-chips">' + mailChips + '</div><button class="demand-email-recipient-trigger" type="button" data-route-action="toggle-route-mail" data-route-id="' + routeId + '" aria-expanded="false">＋ 添加</button><div class="demand-email-recipient-popover route-mail-recipient-popover" data-route-mail-popover hidden><div class="demand-email-recipient-popover-fields"><input type="text" data-route-mail-name placeholder="姓名" aria-label="邮件接收人姓名"><input type="email" data-route-mail-email placeholder="邮箱" aria-label="邮件接收人邮箱"></div><div class="route-mail-error" data-route-mail-error></div><div class="demand-email-recipient-popover-actions"><button class="btn" type="button" data-route-action="cancel-route-mail" data-route-id="' + routeId + '">取消</button><button class="btn primary" type="button" data-route-action="confirm-route-mail" data-route-id="' + routeId + '">确定</button></div></div></div>', 'row-start') +
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
    const routeIndex = routeDisplayIndex(route);
    const isMultimodal = route.type === '多式联运';
    return '<div class="order-route-card-body">' +
      itemsMarkup(route) +
      '<div class="order-route-block order-route-transport-requirements"><div class="order-route-block-head"><div class="order-route-block-title">运输要求</div></div><div class="order-route-grid">' +
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

  // 只读态：摘要行固定展示关键数量；点击“查看全部商品字段”后横向展开完整字段
  function readonlyItemsMarkup(route) {
    const items = route.items || [];
    if (!items.length) return '<div class="ro-goods-empty">暂无商品</div>';
    const cards = items.map((rowItem, itemIndex) => {
      const linked = Boolean(rowItem.linkedRouteId && rowItem.linkedItemId);
      const sourceItem = resolveLinkedItem(rowItem);
      const item = linked && sourceItem
        ? { ...sourceItem, standardQty: rowItem.linkedQty ?? sourceItem.standardQty, count: rowItem.linkedQty ?? sourceItem.count }
        : (sourceItem || rowItem);
      const quantity = (value, suffix) => (value === '' || value === null || value === undefined ? '—' : number(value) + (suffix ? ' ' + suffix : ''));
      const text = (value) => (value === '' || value === null || value === undefined ? '—' : String(value));
      const summaryFields = [
        ['标准数量', quantity(item.standardQty, item.standardUnit)],
        ['件数', quantity(item.pieceCount, item.pieceCountUnit)],
        ['毛重', quantity(item.grossWeight, item.grossWeightUnit)],
        ['体积', quantity(item.volume, item.volumeUnit)]
      ];
      const detailFields = [
        ['英文名', text(item.englishName)],
        ['单件重量', item.pieceWeight !== '' && item.pieceWeight !== null && item.pieceWeight !== undefined ? number(item.pieceWeight) + ' ' + (item.pieceWeightUnit || '') : '—'],
        ['规格尺寸', text(item.specDimensions)],
        ['溢装率', item.overRate !== '' && item.overRate !== null && item.overRate !== undefined ? item.overRate + '%' : '—'],
        ['短装率', item.underRate !== '' && item.underRate !== null && item.underRate !== undefined ? item.underRate + '%' : '—'],
        ['货值单价', item.goodsValueUnitPrice !== '' && item.goodsValueUnitPrice !== null && item.goodsValueUnitPrice !== undefined ? number(item.goodsValueUnitPrice) : '—'],
        ['货值金额', item.goodsValueAmount !== '' && item.goodsValueAmount !== null && item.goodsValueAmount !== undefined ? number(item.goodsValueAmount) + ' ' + (item.goodsValueCurrency || '') : '—'],
        ['货值币种', text(item.goodsValueCurrency)],
        ['合同号', text(item.tradeContractNo)],
        ['合同类型', text(item.tradeContractType)]
      ];
      const fieldMarkup = (fields, extra) => fields.map(([label, value]) => '<div class="ro-goods-field' + (extra ? ' ro-goods-field-extra' : '') + '" data-goods-extra="' + (extra ? 'true' : 'false') + '" title="' + escapeHtml(label + '：' + value) + '"><span>' + escapeHtml(label) + '</span><b>' + escapeHtml(value) + '</b></div>').join('');
      const itemTitle = (item.name || '未命名商品') + (item.description ? ' · ' + item.description : '');
      if (!goodsSummaryExpandable) {
        const legacyFieldMarkup = summaryFields.concat(detailFields).map(([label, value]) => '<div class="ro-goods-field" title="' + escapeHtml(label + '：' + value) + '"><span>' + escapeHtml(label) + '</span><b>' + escapeHtml(value) + '</b></div>').join('');
        return '<article class="ro-goods">' +
          '<div class="ro-goods-main" title="' + escapeHtml(itemTitle) + '"><div class="ro-goods-title"><span class="ro-goods-name">' + escapeHtml(item.name || '未命名商品') + '</span>' + (item.description ? '<span class="ro-goods-desc">' + escapeHtml(item.description) + '</span>' : '') + '</div></div>' +
          '<div class="ro-goods-fields" tabindex="0" aria-label="' + escapeHtml((item.name || '商品') + '全部字段') + '">' + legacyFieldMarkup + '</div>' +
        '</article>';
      }
      const contractText = item.tradeContractNo
        ? '合同 ' + item.tradeContractNo + (item.tradeContractType ? '（' + item.tradeContractType + '）' : '')
        : '贸易合同未填写';
      const panelId = 'ro-goods-fields-' + String(route.id) + '-' + String(item.id || itemIndex);
      return '<article class="ro-goods" data-goods-row>' +
        '<div class="ro-goods-main" title="' + escapeHtml(itemTitle) + '"><div class="ro-goods-title"><div class="ro-goods-name-line"><span class="ro-goods-name">' + escapeHtml(item.name || '未命名商品') + '</span>' + (item.description ? '<span class="ro-goods-desc">' + escapeHtml(item.description) + '</span>' : '') + '</div><span class="ro-goods-contract" title="' + escapeHtml(contractText) + '">' + escapeHtml(contractText) + '</span></div></div>' +
        '<div class="ro-goods-fields" id="' + escapeHtml(panelId) + '" tabindex="0" aria-label="' + escapeHtml((item.name || '商品') + '商品字段') + '">' + fieldMarkup(summaryFields, false) + fieldMarkup(detailFields, true) + '</div>' +
        '<button class="ro-goods-toggle" type="button" data-goods-toggle aria-expanded="false" aria-controls="' + escapeHtml(panelId) + '" title="展开全部商品字段"><span class="ro-goods-toggle-label">查看全部商品字段</span><span class="ro-goods-toggle-chevron" aria-hidden="true"></span></button>' +
      '</article>';
    }).join('');
    return '<div class="ro-goods-list">' + cards + '</div>';
  }

  function orderProductFieldValue(item, key) {
    const value = item[key];
    return value === '' || value === null || value === undefined ? '' : value;
  }

  function orderProductFieldMarkup(item, key, label, type, readonly) {
    const value = escapeHtml(orderProductFieldValue(item, key));
    return '<input class="control" type="' + (type || 'text') + '" min="0" step="0.01" data-order-product-field="' + key + '" data-product-id="' + escapeHtml(item.sourceProductId || item.id) + '" value="' + value + '" aria-label="' + escapeHtml(label) + '"' + (readonly ? ' readonly' : '') + '>';
  }

  function orderProductSelectMarkup(item, key, label, options, readonly, required) {
    return '<select class="control" data-order-product-field="' + key + '" data-product-id="' + escapeHtml(item.sourceProductId || item.id) + '" aria-label="' + escapeHtml(label) + '"' + (readonly ? ' disabled' : '') + (required ? ' required' : '') + '>' + selectOptions(options, item[key]) + '</select>';
  }

  function orderProductServiceRefs(productId) {
    const refs = [];
    state.routes.forEach((route, index) => {
      if ((route.items || []).some((item) => orderProductId(item) === productId || orderProductKey(item) === orderProductKey(findOrderProduct(productId) || {}))) {
        refs.push('运输服务要求' + (index + 1));
      }
    });
    document.querySelectorAll('[data-service-requirement-card]').forEach((card, index) => {
      try {
        const ids = JSON.parse(card.dataset.serviceProductIds || '[]');
        if (ids.includes(productId)) refs.push((card.dataset.serviceRequirementType || '附加') + '服务要求' + (index + 1));
      } catch (error) { /* ignore stale selection data */ }
    });
    return refs.length ? refs.join('、') : '—';
  }

  function orderProductsTableMarkup() {
    const readonly = orderRouteReadonly();
    const editable = !readonly && orderItemsCopyEnabled();
    const field = (item, key, label, type) => orderProductFieldMarkup(item, key, label, type, readonly);
    const select = (item, key, label, options, required) => orderProductSelectMarkup(item, key, label, options, readonly, required);
    const rows = state.orderProducts.map((item) => {
      const productId = item.sourceProductId || item.id;
      return '<tr data-order-product-row="' + escapeHtml(productId) + '">' +
        '<td>' + select(item, 'name', '商品分类', commodityCatalog.map((entry) => entry.name)) + '</td>' +
        '<td>' + field(item, 'description', '商品描述') + '</td>' +
        '<td class="num">' + field(item, 'pieceCount', '件数', 'number') + '</td>' +
        '<td>' + select(item, 'pieceCountUnit', '件数单位', unitOptions) + '</td>' +
        '<td class="num">' + field(item, 'grossWeight', '毛重', 'number') + '</td>' +
        '<td>' + select(item, 'grossWeightUnit', '毛重单位', ['kg', '吨']) + '</td>' +
        '<td class="num">' + field(item, 'volume', '体积', 'number') + '</td>' +
        '<td>' + select(item, 'volumeUnit', '体积单位', ['m³', 'CBM']) + '</td>' +
        '<td class="num">' + field(item, 'standardQty', '标准数量', 'number') + '</td>' +
        '<td>' + select(item, 'standardUnit', '标准单位', ['吨', '千克', '立方米', '件', '箱', '托', '桶', '台'], true) + '</td>' +
        '<td>' + field(item, 'pieceWeight', '单件重量描述') + '</td>' +
        '<td>' + field(item, 'specDimensions', '规格尺寸') + '</td>' +
        '<td>' + field(item, 'heightDescription', '层高描述') + '</td>' +
        '<td class="num">' + field(item, 'overRate', '溢装率', 'number') + '</td>' +
        '<td class="num">' + field(item, 'underRate', '短装率', 'number') + '</td>' +
        '<td class="num">' + field(item, 'goodsValueUnitPrice', '货值单价', 'number') + '</td>' +
        '<td class="num">' + field(item, 'goodsValueAmount', '货值金额', 'number') + '</td>' +
        '<td>' + select(item, 'goodsValueCurrency', '货值币种', ['CNY', 'USD', 'EUR']) + '</td>' +
        '<td>' + field(item, 'englishName', '商品英文名') + '</td>' +
        '<td>' + field(item, 'tradeContractNo', '贸易合同号') + '</td>' +
        '<td>' + select(item, 'tradeContractType', '贸易合同类型', ['销售合同', '采购合同', '框架合同']) + '</td>' +
        '<td><div class="order-product-row-actions">' + (editable ? '<button class="order-route-row-action" type="button" data-order-product-action="duplicate" data-product-id="' + escapeHtml(productId) + '">复制</button>' : '') + (editable ? '<button class="order-route-icon-btn danger" type="button" data-order-product-action="remove" data-product-id="' + escapeHtml(productId) + '" aria-label="删除商品">×</button>' : '') + '</div></td>' +
      '</tr>';
    }).join('');
    return '<div class="order-product-table-wrap">' +
      '<div class="order-route-items-wrap"><table class="order-route-items order-product-table' + (readonly ? ' is-readonly' : '') + '" aria-label="客户订单商品明细" aria-readonly="' + readonly + '"><thead><tr><th>商品分类 *</th><th>商品描述</th><th class="num">件数</th><th>件数单位</th><th class="num">毛重</th><th>毛重单位</th><th class="num">体积</th><th>体积单位</th><th class="num">标准数量 *</th><th>标准单位 *</th><th>单件重量描述</th><th>规格尺寸</th><th>层高描述</th><th class="num">溢装率（%）</th><th class="num">短装率（%）</th><th class="num">货值单价</th><th class="num">货值金额</th><th>货值币种</th><th>商品英文名</th><th>贸易合同号</th><th>贸易合同类型</th><th>操作</th></tr></thead><tbody>' + (rows || '<tr class="order-product-empty"><td colspan="22">暂无商品，请先添加客户订单商品。</td></tr>') + '</tbody></table></div></div>';
  }

  function renderOrderProductsSection() {
    if (!orderProductsHost) return;
    orderProductsHost.innerHTML = orderProductsTableMarkup();
    const addButton = document.querySelector('[data-order-product-action="add"]');
    if (addButton) addButton.hidden = orderRouteReadonly();
  }

  function productHoverText(product, selected) {
    const qty = (value, unit) => number(value) + (unit ? ' ' + unit : '');
    return [
      '商品分类：' + (product.name || '—'),
      '商品描述：' + (product.description || '—'),
      '标准数量：' + qty(selected.standardQty, selected.standardUnit),
      '件数：' + qty(selected.pieceCount, selected.pieceCountUnit),
      '体积：' + qty(selected.volume, selected.volumeUnit),
      '毛重：' + qty(selected.grossWeight, selected.grossWeightUnit),
      '贸易合同号：' + (product.tradeContractNo || '—'),
      '贸易合同类型：' + (product.tradeContractType || '—')
    ].join('\n');
  }

  function serviceInlineInputMarkup(options) {
    const { value, max, field, routeId, itemId, productId, editable } = options;
    return '<input class="control" type="number" min="0" step="0.01" value="' + escapeHtml(number(value)) + '" max="' + escapeHtml(number(max)) + '" data-service-inline-field="' + field + '" data-editor-target="route" data-route-id="' + escapeHtml(routeId) + '" data-item-id="' + escapeHtml(itemId) + '" data-product-id="' + escapeHtml(productId) + '" data-service-inline-max="' + escapeHtml(number(max)) + '" aria-label="' + escapeHtml(field) + '"' + (editable ? '' : ' readonly') + '>';
  }

  function itemsMarkup(route) {
    const editable = !orderRouteReadonly();
    const routeId = escapeHtml(route.id);
    const rows = (route.items || []).map((item) => {
      const product = state.orderProducts.find((entry) => (entry.sourceProductId || entry.id) === (item.sourceProductId || item.id)) || item;
      const productId = product.sourceProductId || product.id;
      const selection = {
        standardQty: item.standardQty ?? product.standardQty,
        standardUnit: item.standardUnit || product.standardUnit || product.unit,
        pieceCount: item.pieceCount ?? product.pieceCount,
        pieceCountUnit: item.pieceCountUnit || product.pieceCountUnit || product.unit,
        volume: item.volume ?? product.volume,
        volumeUnit: item.volumeUnit || product.volumeUnit || 'm³',
        grossWeight: item.grossWeight ?? product.grossWeight,
        grossWeightUnit: item.grossWeightUnit || product.grossWeightUnit || '吨'
      };
      const hoverText = productHoverText(product, selection);
      return '<tr class="service-product-list-row" data-service-product-row="' + escapeHtml(productId) + '">' +
        '<td><select class="control" disabled aria-label="商品分类">' + selectOptions(commodityCatalog.map((entry) => entry.name), product.name) + '</select></td>' +
        '<td><input class="control" value="' + escapeHtml(product.description || '') + '" readonly aria-label="商品描述"></td>' +
        '<td>' + serviceInlineInputMarkup({ value: selection.pieceCount, max: product.pieceCount ?? product.count, field: 'pieceCount', routeId: route.id, itemId: item.id, productId, editable }) + '</td>' +
        '<td><select class="control" disabled aria-label="件数单位">' + selectOptions(unitOptions, selection.pieceCountUnit) + '</select></td>' +
        '<td>' + serviceInlineInputMarkup({ value: selection.grossWeight, max: product.grossWeight ?? product.weight, field: 'grossWeight', routeId: route.id, itemId: item.id, productId, editable }) + '</td>' +
        '<td><select class="control" disabled aria-label="毛重单位">' + selectOptions(['kg', '吨'], selection.grossWeightUnit) + '</select></td>' +
        '<td>' + serviceInlineInputMarkup({ value: selection.volume, max: product.volume, field: 'volume', routeId: route.id, itemId: item.id, productId, editable }) + '</td>' +
        '<td><select class="control" disabled aria-label="体积单位">' + selectOptions(['m³', 'CBM'], selection.volumeUnit) + '</select></td>' +
        '<td>' + serviceInlineInputMarkup({ value: selection.standardQty, max: product.standardQty ?? product.count, field: 'standardQty', routeId: route.id, itemId: item.id, productId, editable }) + '</td>' +
        '<td><select class="control" disabled aria-label="标准单位">' + selectOptions(['吨', '千克', '立方米', '件', '箱', '托', '桶', '台'], selection.standardUnit) + '</select></td>' +
        '<td><input class="control" value="' + escapeHtml(product.pieceWeight || '') + '" readonly aria-label="单件重量描述"></td>' +
        '<td><input class="control" value="' + escapeHtml(product.specDimensions || '') + '" readonly aria-label="规格尺寸"></td>' +
        '<td><input class="control" value="' + escapeHtml(product.heightDescription || '') + '" readonly aria-label="层高描述"></td>' +
        '<td><input class="control" value="' + escapeHtml(number(product.overRate)) + '" readonly aria-label="溢装率"></td>' +
        '<td><input class="control" value="' + escapeHtml(number(product.underRate)) + '" readonly aria-label="短装率"></td>' +
        '<td><input class="control" value="' + escapeHtml(number(product.goodsValueUnitPrice)) + '" readonly aria-label="货值单价"></td>' +
        '<td><input class="control" value="' + escapeHtml(number(product.goodsValueAmount)) + '" readonly aria-label="货值金额"></td>' +
        '<td><select class="control" disabled aria-label="货值币种">' + selectOptions(['CNY', 'USD', 'EUR'], product.goodsValueCurrency) + '</select></td>' +
        '<td><input class="control" value="' + escapeHtml(product.englishName || '') + '" readonly aria-label="商品英文名"></td>' +
        '<td><input class="control" value="' + escapeHtml(product.tradeContractNo || '') + '" readonly aria-label="贸易合同号"></td>' +
        '<td><select class="control" disabled aria-label="贸易合同类型">' + selectOptions(['销售合同', '采购合同', '框架合同'], product.tradeContractType) + '</select></td>' +
        '<td>' + (editable ? '<button class="service-product-chip-remove" type="button" data-route-action="remove-item" data-route-id="' + routeId + '" data-item-id="' + escapeHtml(item.id) + '" aria-label="移除商品">×</button>' : '') + '</td>' +
      '</tr>';
    }).join('');
    return '<div class="order-route-block order-service-products-block" data-service-products data-route-id="' + routeId + '">' +
      '<div class="order-route-block-head"><div class="order-route-block-title">关联订单商品 <span>(' + (route.items || []).length + ')</span></div>' +
      (editable ? '<div class="order-route-block-actions"><button class="detail-btn outline-primary service-product-select-btn" type="button" data-order-product-picker data-picker-target="route" data-route-id="' + routeId + '">选择商品</button></div>' : '') + '</div>' +
      '<div class="order-route-items-wrap service-product-list-wrap"><table class="order-route-items order-product-table service-product-table-inline"><thead><tr><th>商品分类 *</th><th>商品描述</th><th>件数</th><th>件数单位</th><th>毛重</th><th>毛重单位</th><th>体积</th><th>体积单位</th><th>标准数量 *</th><th>标准单位 *</th><th>单件重量描述</th><th>规格尺寸</th><th>层高描述</th><th>溢装率（%）</th><th>短装率（%）</th><th>货值单价</th><th>货值金额</th><th>货值币种</th><th>商品英文名</th><th>贸易合同号</th><th>贸易合同类型</th><th>操作</th></tr></thead><tbody>' + (rows || '<tr><td colspan="22" class="service-product-empty">未选择商品</td></tr>') + '</tbody></table></div>' +
    '</div>';
  }

  function partiesMarkup(route) {
    const routeId = escapeHtml(route.id);
    const routeIndex = routeDisplayIndex(route);
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
    const routeIndex = routeDisplayIndex(route);
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
    return '服务要求 #' + (index + 1) + typeCopy;
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
    return routeOptions + '<div class="order-fee-route-hint">每条费用只能选择一条服务要求，新增费用默认选择服务要求 #1</div>';
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
      '<td>' + feeRoutePickerMarkup(direction, fee) + '</td>' +
      '<td><select class="control" data-fee-field="invoiceType"' + attrs + ' aria-label="发票类型">' + selectOptions(invoiceTypeOptions, fee.invoiceType) + '</select></td>' +
      '<td><select class="control" data-fee-field="actualProcurement"' + attrs + ' required aria-label="是否实际采购">' + selectOptions(['是', '否'], fee.actualProcurement) + '</select></td>' +
      '<td><button class="order-route-icon-btn danger" type="button" data-fee-action="remove" data-fee-direction="' + direction + '" data-fee-id="' + id + '" aria-label="删除费用">×</button></td></tr>';
  }

  function feeCardMarkup(direction) {
    const fees = feeState(direction);
    const label = feeDirectionLabel(direction);
    const otherLabel = direction === 'receivable' ? '应付' : '应收';
    return '<section class="order-business-fee-card" data-fee-card="' + direction + '"><div class="order-business-fee-head"><div class="order-business-fee-title">业务预估' + label + '费用</div><div class="order-business-fee-actions"><button class="detail-btn outline-primary" type="button" data-fee-action="copy" data-fee-direction="' + direction + '">拷贝到' + otherLabel + '</button><button class="detail-btn primary" type="button" data-fee-action="add" data-fee-direction="' + direction + '">添加费用</button></div></div>' +
      '<div class="order-business-fee-table-wrap"><table class="order-business-fee-table" aria-label="业务预估' + label + '费用"><thead><tr><th><input type="checkbox" data-fee-select-all="' + direction + '" aria-label="全选' + label + '费用"></th><th>费用科目 *</th><th>结算对象 *</th><th>税率(%) *</th><th>PP/CC</th><th>计费单价(含税) *</th><th>计费币种 *</th><th>计费数量 *</th><th>计量单位 *</th><th>柜型</th><th>原币金额(含税)</th><th>汇率 *</th><th>本位币金额(含税)</th><th>备注</th><th>服务要求</th><th>发票类型</th><th>是否实际采购 *</th><th>操作</th></tr></thead><tbody>' +
      (fees.length ? fees.map((fee, index) => feeRowMarkup(direction, fee, index)).join('') : '<tr><td colspan="18" class="order-business-fee-empty">暂无数据</td></tr>') + '</tbody></table></div></section>';
  }

  function businessEstimatesMarkup() {
    return feeCardMarkup('receivable') + feeCardMarkup('payable');
  }


  function hierarchyArrangementNo(product, arrangement, route) {
    const ownerRoute = route || state.routes.find((entry) => (entry.items || []).includes(product));
    const routeArrangements = ownerRoute
      ? (ownerRoute.items || []).flatMap((entry) => entry.arrangements || [])
      : (product.arrangements || []);
    const index = routeArrangements.findIndex((entry) => entry.id === arrangement.id) + 1;
    return escapeHtml(arrangement.type || '物流') + (index > 0 ? index : '');
  }

  function hierarchyProductQuantity(product) {
    return number(product.standardQty ?? product.count).toFixed(2).replace(/\.00$/, '') + (product.standardUnit || product.unit || '');
  }

  function hierarchyArrangementDownstream(product, arrangement) {
    return (product.arrangements || []).filter((entry) => (entry.upstreamIds || []).includes(arrangement.id));
  }

  function hierarchyRelationsMarkup(product, arrangement) {
    const upstreamOptions = (product.arrangements || []).filter((entry) => entry.id !== arrangement.id).map((entry) =>
      '<label class="hierarchy-relation-option"><input type="checkbox" data-arrangement-upstream data-product-id="' + escapeHtml(product.id) + '" data-arrangement-id="' + escapeHtml(arrangement.id) + '" value="' + escapeHtml(entry.id) + '"' + ((arrangement.upstreamIds || []).includes(entry.id) ? ' checked' : '') + '><span>' + hierarchyArrangementNo(product, entry) + ' · ' + escapeHtml(entry.origin || '未指定') + ' → ' + escapeHtml(entry.destination || '未指定') + ' · ' + escapeHtml(entry.hierarchyQuantity) + escapeHtml(entry.hierarchyUnit || product.standardUnit || '') + '</span></label>'
    ).join('');
    const downstream = hierarchyArrangementDownstream(product, arrangement);
    return '<div class="hierarchy-arrangement-relations"><div class="hierarchy-relation-head"><strong>上下游关联</strong><span>同一商品下自动关联运输段</span></div><div class="hierarchy-relation-grid"><div><div class="hierarchy-relation-label">上游物流安排</div><div class="hierarchy-relation-options">' + (upstreamOptions || '<span class="demand-muted">无其他物流安排</span>') + '</div></div><div><div class="hierarchy-relation-label">下游物流安排</div><div class="hierarchy-relation-chips">' + (downstream.length ? downstream.map((entry) => '<span class="hierarchy-relation-chip">' + hierarchyArrangementNo(product, entry) + ' · ' + escapeHtml(entry.hierarchyQuantity) + escapeHtml(entry.hierarchyUnit || '') + '</span>').join('') : '<span class="demand-muted">暂无下游安排</span>') + '</div></div><div class="hierarchy-relation-quantity"><label>本段运输数量</label><input class="control" type="number" min="0" step="0.01" data-arrangement-quantity data-route-id="' + escapeHtml(arrangement.id) + '" value="' + escapeHtml(arrangement.hierarchyQuantity) + '" aria-label="本段运输数量"><span>' + escapeHtml(arrangement.hierarchyUnit || product.standardUnit || '') + '</span></div></div></div>';
  }

  function hierarchyArrangementCardMarkup(route, product, arrangement, productIndex, arrangementIndex) {
    arrangement.__displayIndex = arrangementIndex + 1;
    const collapsed = Boolean(arrangement.collapsed);
    const typeCopy = arrangement.type ? escapeHtml(arrangement.type) + (arrangement.type === '航空' ? '' : ' · ' + escapeHtml(arrangement.shipmentCategory || '')) : '待配置运输方式';
    const downstream = hierarchyArrangementDownstream(product, arrangement);
    return '<section class="hierarchy-arrangement-card" data-arrangement-card="' + escapeHtml(arrangement.id) + '">' +
      '<div class="hierarchy-arrangement-head"><div class="hierarchy-arrangement-title"><span class="hierarchy-arrangement-no">' + hierarchyArrangementNo(product, arrangement) + '</span><strong>' + typeCopy + '</strong><span>' + escapeHtml(arrangement.origin || '未指定起点') + ' → ' + escapeHtml(arrangement.destination || '未指定终点') + '</span><span class="hierarchy-arrangement-qty">' + escapeHtml(arrangement.hierarchyQuantity) + ' ' + escapeHtml(arrangement.hierarchyUnit || product.standardUnit || '') + '</span>' + (downstream.length ? '<span class="hierarchy-arrangement-downstream">下游：' + downstream.map((entry) => hierarchyArrangementNo(product, entry)).join('、') + '</span>' : '') + '</div><div class="hierarchy-arrangement-actions"><button class="detail-btn outline-primary" type="button" data-route-action="toggle-arrangement" data-route-id="' + escapeHtml(route.id) + '" data-product-id="' + escapeHtml(product.id) + '" data-arrangement-id="' + escapeHtml(arrangement.id) + '">' + (collapsed ? '展开' : '收起') + '</button><button class="order-route-icon-btn danger" type="button" data-route-action="remove-arrangement" data-route-id="' + escapeHtml(route.id) + '" data-product-id="' + escapeHtml(product.id) + '" data-arrangement-id="' + escapeHtml(arrangement.id) + '" aria-label="删除物流安排">×</button></div></div>' +
      (collapsed ? '' : '<div class="hierarchy-arrangement-body">' + hierarchyRelationsMarkup(product, arrangement) + routeBodyMarkup(arrangement) + '</div>') +
    '</section>';
  }

  function hierarchyProductCardMarkup(route, product, productIndex) {
    const collapsed = Boolean(product.collapsed);
    const arrangements = product.arrangements || [];
    return '<section class="hierarchy-product-card" data-product-card="' + escapeHtml(product.id) + '">' +
      '<div class="hierarchy-product-head"><div class="hierarchy-product-title"><span class="hierarchy-product-index">商品 #' + (productIndex + 1) + '</span><strong>' + escapeHtml(product.name || '未命名商品') + '</strong><span class="hierarchy-product-qty">' + hierarchyProductQuantity(product) + '</span><span class="hierarchy-product-count">' + arrangements.length + ' 条物流安排</span></div><div class="hierarchy-product-actions"><button class="detail-btn outline-primary" type="button" data-route-action="add-arrangement" data-route-id="' + escapeHtml(route.id) + '" data-product-id="' + escapeHtml(product.id) + '">+ 添加物流安排</button><button class="detail-btn" type="button" data-route-action="toggle-product" data-route-id="' + escapeHtml(route.id) + '" data-product-id="' + escapeHtml(product.id) + '">' + (collapsed ? '展开商品' : '收起商品') + '</button><button class="order-route-icon-btn danger" type="button" data-route-action="remove-product" data-route-id="' + escapeHtml(route.id) + '" data-product-id="' + escapeHtml(product.id) + '" aria-label="删除商品">×</button></div></div>' +
      (collapsed ? '' : '<div class="hierarchy-product-body"><div class="hierarchy-product-fields">' + itemsMarkup({ ...route, items: [product] }) + '</div><div class="hierarchy-arrangements">' + (arrangements.length ? arrangements.map((arrangement, index) => hierarchyArrangementCardMarkup(route, product, arrangement, productIndex, index)).join('') : '<div class="hierarchy-empty">该商品暂无物流安排，请点击「添加物流安排」。</div>') + '</div></div>') +
    '</section>';
  }

  function hierarchyRouteInfoMarkup(route) {
    const routeId = escapeHtml(route.id);
    return '<div class="hierarchy-route-info"><div class="hierarchy-route-info-head"><strong>线路信息</strong><span>线路定义整体起点和终点，具体运输方式及分段由商品物流安排维护</span></div><div class="order-route-grid hierarchy-route-grid">' +
      field('起运地类型', '<select class="control" data-route-field="originType" data-route-id="' + routeId + '">' + selectOptions(locationTypes, route.originType) + '</select>') +
      field('起运地<span class="required">*</span>', '<select class="control" data-route-field="origin" data-route-id="' + routeId + '">' + selectOptions(locationOptions, route.origin) + '</select>') +
      field('起运地国别/省市', '<input class="control" data-route-field="originRegion" data-route-id="' + routeId + '" value="' + escapeHtml(route.originRegion || locationRegions[route.origin] || '') + '" readonly>') +
      field('目的地类型', '<select class="control" data-route-field="destinationType" data-route-id="' + routeId + '">' + selectOptions(locationTypes, route.destinationType) + '</select>') +
      field('目的地<span class="required">*</span>', '<select class="control" data-route-field="destination" data-route-id="' + routeId + '">' + selectOptions(locationOptions, route.destination) + '</select>') +
      field('目的地国别/省市', '<input class="control" data-route-field="destinationRegion" data-route-id="' + routeId + '" value="' + escapeHtml(route.destinationRegion || locationRegions[route.destination] || '') + '" readonly>') +
    '</div></div>';
  }

  function hierarchyRouteCardMarkup(route, index) {
    const collapsed = Boolean(route.collapsed);
    const products = route.items || [];
    const arrangementCount = products.reduce((sum, product) => sum + (product.arrangements || []).length, 0);
    return '<article class="order-route-card hierarchy-route-card" data-route-card="' + escapeHtml(route.id) + '">' +
      '<div class="order-route-card-head hierarchy-route-head"><div class="order-route-card-title"><span class="order-route-index">服务要求 #' + (index + 1) + '</span><span class="order-route-route-copy">' + escapeHtml(route.origin || '未指定起运地') + ' → ' + escapeHtml(route.destination || '未指定目的地') + '</span><span class="hierarchy-route-summary">' + products.length + ' 种商品 · ' + arrangementCount + ' 条物流安排</span></div><div class="order-route-card-controls"><button class="detail-btn outline-primary" type="button" data-route-action="add-product" data-route-id="' + escapeHtml(route.id) + '">+ 添加商品</button><button class="detail-btn" type="button" data-route-action="generate-delegation" data-route-id="' + escapeHtml(route.id) + '">按线路生成物流委托</button><button class="order-route-icon-btn" type="button" data-route-action="toggle" data-route-id="' + escapeHtml(route.id) + '" aria-label="' + (collapsed ? '展开线路' : '收起线路') + '">' + (collapsed ? '⌄' : '⌃') + '</button><button class="order-route-icon-btn danger" type="button" data-route-action="remove" data-route-id="' + escapeHtml(route.id) + '" aria-label="删除线路">×</button></div></div>' +
      (collapsed ? '' : '<div class="order-route-card-body hierarchy-route-body">' + hierarchyRouteInfoMarkup(route) + '<div class="hierarchy-products">' + products.map((product, productIndex) => hierarchyProductCardMarkup(route, product, productIndex)).join('') + '</div></div>') +
    '</article>';
  }

  function renderHierarchy() {
    renderOrderProductsSection();
    countLabel.textContent = state.routes.length + ' 条线路';
    if (modeCopy) modeCopy.textContent = '三级物流安排：线路定义整体起止地，商品定义货量，物流安排定义具体运输段、方式和运输要求。';
    section.classList.add('hierarchy-mode');
    section.classList.remove('single-route-mode');
    const flowButton = document.getElementById('orderRouteFlowBtn');
    if (flowButton) flowButton.hidden = true;
    cardsHost.innerHTML = state.routes.map((route, index) => hierarchyRouteCardMarkup(route, index)).join('');
    renderRouteAnchorTabs();
    estimateHost.innerHTML = businessEstimatesMarkup();
    syncHidden(false);
    syncRouteBackedWaterRequirement();
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
    anchorTabsHost.innerHTML = state.routes.map((route, index) => { const routeType = hierarchyMode ? '' : (hasSpecifiedTransportMode() ? (route.type || '综合运输') + (orderRouteReadonly() && route.shipmentCategory ? ' · ' + route.shipmentCategory : '') : '综合运输'); return '<button class="order-route-anchor-tab ' + (index === activeRouteAnchorIndex ? 'active' : '') + '" type="button" role="tab" aria-selected="' + (index === activeRouteAnchorIndex) + '" aria-controls="order-route-card-' + escapeHtml(route.id) + '" data-route-anchor="' + index + '">服务要求' + (index + 1) + (routeType ? ' ' + escapeHtml(routeType) : '') + '</button>'; }).join('');
  }

  function syncRouteHeaderActions() {
    const status = document.getElementById('orderStatusField')?.textContent.trim() || '';
    const feedbackUnavailable = status === '创建' || status === '驳回';
    const flowButton = document.getElementById('orderRouteFlowBtn');
    if (flowButton) flowButton.hidden = hierarchyMode || !hasSpecifiedTransportMode() || state.routes.length === 1;
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
    renderOrderProductsSection();
    if (hierarchyMode) { renderHierarchy(); return; }
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
    if (addRouteButton) addRouteButton.textContent = '+ 添加服务要求';
    syncRouteHeaderActions();
    cardsHost.innerHTML = state.routes.length ? state.routes.map((route) => routeCardMarkup(route, state.routes.indexOf(route))).join('') : '<div class="order-route-empty">暂无运输服务要求，请添加服务要求。</div>';
    syncRouteHeaderActions();
    renderRouteAnchorTabs();
    applyRouteReadonlyState();
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

  const orderEditableStatuses = ['创建', '驳回'];
  function currentOrderStatus() {
    return document.getElementById('orderStatusField')?.textContent.trim() || '';
  }
  // 待审核使用紧凑只读态；待履约、已完结保持现有线路卡片
  // 非创建/驳回状态一律只读（待审核、待履约、履约中、已完结、已取消）
  function orderRouteReadonly() {
    const status = currentOrderStatus();
    return Boolean(status) && status !== '创建' && status !== '驳回';
  }

  const readonlyControlProps = ['border', 'background', 'box-shadow', 'height', 'padding', 'color', 'font-size', 'border-radius', 'appearance', 'background-image', 'line-height', 'resize'];
  function applyReadonlyControlStyle(el) {
    const isTextarea = el.tagName === 'TEXTAREA';
    const props = {
      border: '1px solid #e2e7ef', background: '#f4f6f8', 'box-shadow': 'none',
      height: isTextarea ? '58px' : '32px', padding: isTextarea ? '7px 9px' : '0 9px',
      color: '#64748b', 'font-size': '12px', 'font-weight': '400', 'border-radius': '5px', 'line-height': '1.5',
      resize: isTextarea ? 'vertical' : 'none'
    };
    if (el.tagName === 'SELECT') { props.appearance = 'auto'; props['background-image'] = 'none'; }
    Object.keys(props).forEach((key) => el.style.setProperty(key, props[key], 'important'));
  }
  function clearReadonlyControlStyle(el) {
    readonlyControlProps.forEach((key) => el.style.removeProperty(key));
  }

  // 只读态隐藏与卡片头重复的结构字段（运输类型/装运类别/起运地/目的地/港口/国别省市），其余字段空值显示「—」
  const readonlySuppressedRouteFields = new Set([]);


  function routeReadonlyFieldValue(fieldEl) {
    const recipientBox = fieldEl.querySelector('.demand-email-recipient-box');
    if (recipientBox) {
      const names = Array.from(recipientBox.querySelectorAll('.demand-email-recipient-chip-copy strong'))
        .map((node) => node.textContent.trim())
        .filter(Boolean);
      return names.length ? names.join('、') : '—';
    }

    const dateRange = fieldEl.querySelector('.order-date-range');
    if (dateRange) {
      const values = Array.from(dateRange.querySelectorAll('input'))
        .map((input) => input.value.trim())
        .filter(Boolean);
      return values.length ? values.join(' ～ ') : '—';
    }

    const checkGroup = fieldEl.querySelector('.demand-check-group');
    if (checkGroup) {
      const checked = Array.from(checkGroup.querySelectorAll('input[type="checkbox"]:checked'))
        .map((input) => input.closest('label')?.textContent.trim() || input.value)
        .filter(Boolean);
      return checked.length ? checked.join('、') : '—';
    }

    const control = fieldEl.querySelector('input, select, textarea');
    if (!control) return '—';
    if (control.type === 'checkbox') return control.checked ? '是' : '否';
    const value = String(control.value || '').trim();
    if (!value) return '—';
    return control.dataset.routeField === 'commissionRate' ? value + '%' : value;
  }

  function clearRouteReadonlyField(fieldEl) {
    fieldEl.style.display = '';
    fieldEl.style.removeProperty('order');
    fieldEl.style.removeProperty('grid-column-start');
    fieldEl.classList.remove('route-readonly-field', 'readonly-row-start');
    fieldEl.querySelectorAll(':scope > .route-readonly-value').forEach((node) => node.remove());
  }

  const readonlyRouteLayouts = {
    '汽运|散货': {
      order: ['consignee', 'expectDispatch', 'latestArrival', 'originContact', 'originContactPhone', 'originDetail', 'destinationContact', 'destinationContactPhone', 'destinationDetail', 'specialNotes'],
      rowStarts: ['originContact', 'destinationContact', 'specialNotes']
    },
    '汽运|集装箱': {
      order: ['consignee', 'expectDispatch', 'latestArrival', 'originContact', 'originContactPhone', 'originDetail', 'destinationContact', 'destinationContactPhone', 'destinationDetail', 'specialNotes'],
      rowStarts: ['originContact', 'destinationContact', 'specialNotes']
    },
    '水运|散货': {
      order: ['shippingType', 'latestShipmentDate', 'dischargeTerms', 'directSailing', 'originTerminal', 'vesselCertificate', 'vesselAge', 'commissionRate', 'destinationTerminal', 'specialNotes'],
      rowStarts: []
    },
    '水运|件杂': {
      order: ['shippingType', 'latestShipmentDate', 'dischargeTerms', 'directSailing', 'originContact', 'originContactPhone', 'originTerminal', 'destinationContact', 'destinationContactPhone', 'destinationTerminal', 'isCqd', 'containsLashing', 'vesselCertificate', 'vesselAge', 'commissionRate', 'bookingManager', 'laycanStart', 'mailRecipients', 'specialNotes'],
      rowStarts: ['originContact', 'destinationContact', 'isCqd']
    },
    '水运|集装箱': {
      order: ['shippingType', 'packingMethod', 'bookingMethod', 'solicitationMethod', 'agent', 'agentCode', 'agentSalesperson', 'receivingPlace', 'receivingRegion', 'receivingDetail', 'originServiceTerms', 'originTerminal', 'destinationServiceTerms', 'destinationTerminal', 'deliveryPlace', 'deliveryRegion', 'deliveryDetail', 'specialNotes'],
      rowStarts: ['receivingPlace', 'originServiceTerms', 'destinationServiceTerms', 'deliveryPlace']
    }
  };

  function readonlyRouteFieldKey(fieldEl) {
    const routeControl = fieldEl.querySelector('[data-route-field]');
    if (routeControl) return routeControl.dataset.routeField || '';
    const partyControl = fieldEl.querySelector('[data-party-field]');
    if (partyControl) return partyControl.dataset.partyField || '';
    if (fieldEl.querySelector('[data-route-action="toggle-route-mail"]')) return 'mailRecipients';
    return '';
  }

  function applyReadonlyRouteLayout() {
    section.querySelectorAll('[data-route-card]').forEach((card) => {
      const route = state.routes.find((entry) => entry.id === card.dataset.routeCard);
      if (!route) return;
      const layout = readonlyRouteLayouts[route.type + '|' + route.shipmentCategory];
      if (!layout) return;
      const grid = card.querySelector('.order-route-transport-requirements > .order-route-grid');
      if (!grid) return;
      const fields = new Map();
      Array.from(grid.children).forEach((fieldEl) => {
        const key = readonlyRouteFieldKey(fieldEl);
        if (key) fields.set(key, fieldEl);
      });
      layout.order.forEach((key, index) => {
        const fieldEl = fields.get(key);
        if (fieldEl) fieldEl.style.order = String(index + 1);
      });
      layout.rowStarts.forEach((key) => {
        const fieldEl = fields.get(key);
        if (fieldEl) {
          fieldEl.classList.add('readonly-row-start');
          fieldEl.style.setProperty('grid-column-start', '1', 'important');
        }
      });
      card.querySelectorAll('.order-route-parties .order-route-field').forEach((fieldEl) => {
        const key = readonlyRouteFieldKey(fieldEl);
        if (key === 'shipperInfo') {
          fieldEl.classList.add('readonly-row-start');
          fieldEl.style.setProperty('grid-column-start', '1', 'important');
        }
      });
    });
  }

  function applyRouteReadonlyState() {
    if (!section) return;
    const readonly = orderRouteReadonly();
    section.dataset.routeReadonly = readonly ? 'true' : 'false';
    section.querySelectorAll('.route-readonly-chip').forEach((chip) => chip.remove());

    if (!readonly) {
      section.querySelectorAll('.order-route-field').forEach(clearRouteReadonlyField);
      section.querySelectorAll('input, textarea').forEach((el) => {
        if (el.closest('.service-product-table-inline')) return;
        el.readOnly = false;
        clearReadonlyControlStyle(el);
      });
      section.querySelectorAll('select').forEach((el) => {
        if (el.closest('.service-product-table-inline')) return;
        el.disabled = false;
        delete el.dataset.empty;
        clearReadonlyControlStyle(el);
      });
      section.querySelectorAll('[data-ro-label]').forEach((node) => { node.textContent = node.dataset.roLabel; delete node.dataset.roLabel; });
      return;
    }

    section.querySelectorAll('.order-route-field').forEach((fieldEl) => {
      clearRouteReadonlyField(fieldEl);
      const control = fieldEl.querySelector('[data-route-field], input, select, textarea');
      const fieldName = control?.dataset.routeField || '';
      if (readonlySuppressedRouteFields.has(fieldName)) fieldEl.style.display = 'none';
    });

    section.querySelectorAll('.order-route-items thead th, .order-route-containers-table thead th, .order-business-fee-table thead th').forEach((th) => {
      if (!th.dataset.roLabel) th.dataset.roLabel = th.textContent;
      th.textContent = th.dataset.roLabel.replace(/\s*\*\s*$/, '');
    });
    section.querySelectorAll('input, textarea').forEach((el) => {
      if (el.type === 'checkbox') return;
      el.readOnly = true;
      applyReadonlyControlStyle(el);
    });
    section.querySelectorAll('select').forEach((el) => {
      el.disabled = true;
      if (!el.value) el.dataset.empty = 'true'; else delete el.dataset.empty;
      applyReadonlyControlStyle(el);
    });
  }

  function orderItemsCopyEnabled() {
    const status = currentOrderStatus();
    // 首屏状态可能尚未写入，按可编辑处理
    return status === '' || orderEditableStatuses.includes(status);
  }

  function notify(kind, message) {
    if (window.UIState && pageScope) window.UIState.showFormAlert(pageScope, kind, message);
  }

  function findRoute(id) {
    for (const route of state.routes) {
      if (route.id === id) return route;
      for (const product of (route.items || [])) {
        const arrangement = (product.arrangements || []).find((entry) => entry.id === id);
        if (arrangement) return arrangement;
      }
    }
    return null;
  }

  function routeDisplayIndex(route) {
    if (route && route.__displayIndex) return route.__displayIndex;
    const index = state.routes.indexOf(route);
    return index >= 0 ? index + 1 : 1;
  }

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
      if (target.dataset.routeField === 'origin') route.originRegion = locationRegions[route.origin] || route.originRegion;
      if (target.dataset.routeField === 'destination') route.destinationRegion = locationRegions[route.destination] || route.destinationRegion;
      if (target.dataset.routeField === 'originPort') { route.origin = route.originPort; route.originRegion = portRegions[route.originPort] || ''; }
      if (target.dataset.routeField === 'destinationPort') { route.destination = route.destinationPort; route.destinationRegion = portRegions[route.destinationPort] || ''; }
      if (['origin', 'destination', 'originPort', 'destinationPort'].includes(target.dataset.routeField)) {
        const copy = section.querySelector('[data-route-route-copy="' + route.id + '"]');
        if (copy) copy.innerHTML = routeTitleMarkup(route);
      }
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

  function orderProductId(item) {
    return item?.sourceProductId || item?.id || '';
  }

  function findOrderProduct(productId) {
    return state.orderProducts.find((item) => orderProductId(item) === productId);
  }

  function syncOrderProductToRoutes(product) {
    const productId = orderProductId(product);
    const productKey = orderProductKey(product);
    state.routes.forEach((route) => {
      (route.items || []).forEach((item) => {
        if (item.linkedRouteId || item.linkedItemId) return;
        if (orderProductId(item) === productId || orderProductKey(item) === productKey) {
          Object.assign(item, {
            name: product.name,
            description: product.description,
            standardUnit: product.standardUnit,
            pieceCountUnit: product.pieceCountUnit,
            grossWeightUnit: product.grossWeightUnit,
            volumeUnit: product.volumeUnit,
            tradeContractNo: product.tradeContractNo,
            tradeContractType: product.tradeContractType,
            sourceProductId: productId
          });
        }
      });
    });
  }

  function updateOrderProductField(control) {
    const product = findOrderProduct(control.dataset.productId);
    if (!product) return;
    const field = control.dataset.orderProductField;
    if (!field) return;
    product[field] = control.value;
    if (field === 'standardQty') product.count = control.value;
    if (field === 'grossWeight') product.weight = control.value;
    if (field === 'volume') product.vol = control.value;
    syncOrderProductToRoutes(product);
    document.querySelectorAll('[data-service-requirement-card]').forEach((card) => window.refreshServiceRequirementProducts?.(card));
  }

  function handleOrderProductAction(button) {
    if (orderRouteReadonly()) return;
    const action = button.dataset.orderProductAction;
    if (action === 'add') {
      const source = commodityCatalog[0];
      const now = Date.now();
      const product = normalizeItem({
        id: 'P' + now,
        sourceProductId: 'P' + now,
        name: source?.name || '新商品',
        description: source?.desc || '',
        standardQty: 1,
        standardUnit: source?.unit || '件',
        pieceCount: 1,
        pieceCountUnit: source?.unit || '件',
        grossWeight: 0,
        grossWeightUnit: '吨',
        volume: 0,
        volumeUnit: 'm³',
        tradeContractNo: '',
        tradeContractType: '销售合同',
        goodsValueUnitPrice: 0,
        goodsValueAmount: 0,
        goodsValueCurrency: 'CNY'
      });
      state.orderProducts.push(product);
      render();
      notify('success', '已新增 1 项订单商品，可继续维护数量及合同信息。');
      return;
    }
    const product = findOrderProduct(button.dataset.productId);
    if (!product) return;
    if (action === 'duplicate') {
      const copy = normalizeItem(JSON.parse(JSON.stringify(product)));
      copy.id = 'P' + Date.now() + Math.floor(Math.random() * 1000);
      copy.sourceProductId = copy.id;
      copy.name = product.name + '（副本）';
      state.orderProducts.push(copy);
      render();
      notify('success', '已复制订单商品。');
      return;
    }
    if (action === 'remove') {
      state.orderProducts = state.orderProducts.filter((item) => orderProductId(item) !== orderProductId(product));
      state.routes.forEach((route) => {
        route.items = (route.items || []).filter((item) => item.linkedRouteId || item.linkedItemId || orderProductId(item) !== orderProductId(product));
      });
      render();
      notify('success', '订单商品已删除，相关服务要求中的商品选择已同步移除。');
    }
  }

  function orderProductPickerMarkup(selectedIds) {
    const rows = state.orderProducts.map((product) => {
      const productId = orderProductId(product);
      const checked = selectedIds.includes(productId);
      return '<tr class="order-product-picker-row' + (checked ? ' selected' : '') + '" data-product-picker-row="' + escapeHtml(productId) + '">' +
        '<td class="order-product-picker-check"><input type="checkbox" data-product-picker-item="' + escapeHtml(productId) + '" aria-label="选择' + escapeHtml(product.name || '商品') + '"' + (checked ? ' checked' : '') + '></td>' +
        '<td><strong>' + escapeHtml(product.name || '未命名商品') + '</strong></td>' +
        '<td><span class="order-product-picker-readonly-text">' + escapeHtml(product.description || '—') + '</span></td>' +
        '<td class="num">' + escapeHtml(number(product.pieceCount ?? product.count)) + '</td>' +
        '<td>' + escapeHtml(product.pieceCountUnit || '—') + '</td>' +
        '<td class="num">' + escapeHtml(number(product.grossWeight ?? product.weight)) + '</td>' +
        '<td>' + escapeHtml(product.grossWeightUnit || '—') + '</td>' +
        '<td class="num">' + escapeHtml(number(product.volume)) + '</td>' +
        '<td>' + escapeHtml(product.volumeUnit || '—') + '</td>' +
        '<td class="num">' + escapeHtml(number(product.standardQty ?? product.count)) + '</td>' +
        '<td>' + escapeHtml(product.standardUnit || '—') + '</td>' +
        '<td><span class="order-product-picker-readonly-text">' + escapeHtml(product.pieceWeight || '—') + '</span></td>' +
        '<td>' + escapeHtml(product.specDimensions || '—') + '</td>' +
        '<td><span class="order-product-picker-readonly-text">' + escapeHtml(product.heightDescription || '—') + '</span></td>' +
        '<td class="num">' + escapeHtml(number(product.overRate)) + '%</td>' +
        '<td class="num">' + escapeHtml(number(product.underRate)) + '%</td>' +
        '<td class="num">' + escapeHtml(number(product.goodsValueUnitPrice)) + '</td>' +
        '<td class="num">' + escapeHtml(number(product.goodsValueAmount)) + '</td>' +
        '<td>' + escapeHtml(product.goodsValueCurrency || '—') + '</td>' +
        '<td>' + escapeHtml(product.englishName || '—') + '</td>' +
        '<td>' + escapeHtml(product.tradeContractNo || '—') + '</td>' +
        '<td>' + escapeHtml(product.tradeContractType || '—') + '</td>' +
      '</tr>';
    }).join('');
    return '<div class="order-product-picker-table-wrap"><table class="order-product-picker-table order-product-picker-table-full"><thead><tr><th></th><th>商品分类</th><th>商品描述</th><th>件数</th><th>件数单位</th><th>毛重</th><th>毛重单位</th><th>体积</th><th>体积单位</th><th>标准数量</th><th>标准单位</th><th>单件重量描述</th><th>规格尺寸</th><th>层高描述</th><th>溢装率（%）</th><th>短装率（%）</th><th>货值单价</th><th>货值金额</th><th>货值币种</th><th>商品英文名</th><th>贸易合同号</th><th>贸易合同类型</th></tr></thead><tbody>' + (rows || '<tr><td colspan="22" class="order-product-picker-empty">订单商品明细为空，请先在商品明细模块添加商品。</td></tr>') + '</tbody></table></div>';
  }

  function selectedProductIdsForContext(context) {
    if (!context) return [];
    if (context.target === 'route') {
      const route = findRoute(context.routeId);
      return (route?.items || []).map((item) => orderProductId(item) || state.orderProducts.find((product) => orderProductKey(product) === orderProductKey(item))?.sourceProductId).filter(Boolean);
    }
    if (context.card) {
      try { return JSON.parse(context.card.dataset.serviceProductIds || '[]'); } catch (error) { return []; }
    }
    return [];
  }

  function updateOrderProductPickerSummary() {
    if (!orderProductPickerBody) return;
    const checked = Array.from(orderProductPickerBody.querySelectorAll('input[data-product-picker-item]:checked'));
    const summary = document.getElementById('orderProductPickerSummary');
    if (summary) summary.textContent = '已选 ' + checked.length + ' 项';
    orderProductPickerBody.querySelectorAll('[data-product-picker-row]').forEach((row) => {
      row.classList.toggle('selected', Boolean(row.querySelector('input[data-product-picker-item]')?.checked));
    });
  }

  function openOrderProductPicker(trigger) {
    if (!orderProductPicker || !orderProductPickerBody || !state.orderProducts.length) return;
    const target = trigger.dataset.pickerTarget;
    const card = trigger.closest('[data-service-requirement-card]');
    orderProductPickerContext = { target, routeId: trigger.dataset.routeId || '', card };
    orderProductPickerBody.innerHTML = orderProductPickerMarkup(selectedProductIdsForContext(orderProductPickerContext));
    updateOrderProductPickerSummary();
    orderProductPicker.hidden = false;
    window.requestAnimationFrame(() => orderProductPicker.querySelector('.order-route-preview-dialog')?.focus());
  }

  function closeOrderProductPicker() {
    if (orderProductPicker) orderProductPicker.hidden = true;
    orderProductPickerContext = null;
  }

  function defaultSelectionFromProduct(product) {
    return {
      standardQty: number(product.standardQty ?? product.count),
      standardUnit: product.standardUnit || product.unit || '',
      pieceCount: number(product.pieceCount ?? product.count),
      pieceCountUnit: product.pieceCountUnit || product.unit || '',
      volume: number(product.volume ?? product.vol),
      volumeUnit: product.volumeUnit || 'm³',
      grossWeight: number(product.grossWeight ?? product.weight),
      grossWeightUnit: product.grossWeightUnit || '吨'
    };
  }

  function confirmOrderProductPicker() {
    if (!orderProductPickerBody || !orderProductPickerContext) return;
    const checked = Array.from(orderProductPickerBody.querySelectorAll('input[data-product-picker-item]:checked'));
    if (!checked.length) { notify('error', '请至少选择 1 项订单商品。'); return; }
    const ids = checked.map((box) => box.dataset.productPickerItem);
    if (orderProductPickerContext.target === 'route') {
      const route = findRoute(orderProductPickerContext.routeId);
      if (!route) { closeOrderProductPicker(); return; }
      const existing = new Map((route.items || []).map((item) => [orderProductId(item), item]));
      route.items = ids.map((id, index) => {
        if (existing.has(id)) return existing.get(id);
        const product = findOrderProduct(id);
        return normalizeItem({ ...product, id: 'IT' + Date.now() + index, sourceProductId: id, arrangedQty: 0, ...defaultSelectionFromProduct(product) });
      });
      render();
      notify('success', '已为当前服务要求选择 ' + ids.length + ' 项订单商品，请继续编辑本次数量。');
    } else if (orderProductPickerContext.card) {
      const card = orderProductPickerContext.card;
      let existingSelections = {};
      try { existingSelections = JSON.parse(card.dataset.serviceProductSelections || '{}'); } catch (error) { existingSelections = {}; }
      const selections = {};
      const quantities = {};
      ids.forEach((id) => {
        const product = findOrderProduct(id);
        selections[id] = existingSelections[id] || defaultSelectionFromProduct(product);
        quantities[id] = selections[id].standardQty;
      });
      card.dataset.serviceProductIds = JSON.stringify(ids);
      card.dataset.serviceProductSelections = JSON.stringify(selections);
      card.dataset.serviceProductQuantities = JSON.stringify(quantities);
      window.refreshServiceRequirementProducts?.(card);
      notify('success', '已关联 ' + ids.length + ' 项订单商品，请继续编辑本次数量。');
    }
    closeOrderProductPicker();
  }

  function positionServiceProductEditor(trigger) {
    if (!serviceProductEditor || !trigger) return;
    const rect = trigger.getBoundingClientRect();
    const width = 390;
    const height = Math.min(serviceProductEditor.offsetHeight || 260, 320);
    const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
    const below = rect.bottom + 8;
    const top = below + height > window.innerHeight - 12 ? Math.max(12, rect.top - height - 8) : below;
    serviceProductEditor.style.left = left + 'px';
    serviceProductEditor.style.top = top + 'px';
  }

  function openServiceProductEditor(trigger) {
    if (!serviceProductEditor) return;
    const target = trigger.dataset.editorTarget;
    let product = null;
    let selection = null;
    let route = null;
    let item = null;
    let card = null;
    if (target === 'route') {
      route = findRoute(trigger.dataset.routeId);
      item = (route?.items || []).find((entry) => entry.id === trigger.dataset.itemId);
      product = findOrderProduct(trigger.dataset.productId);
      if (!route || !item || !product) return;
      selection = {
        standardQty: number(item.standardQty), standardUnit: item.standardUnit || product.standardUnit,
        pieceCount: number(item.pieceCount), pieceCountUnit: item.pieceCountUnit || product.pieceCountUnit,
        volume: number(item.volume), volumeUnit: item.volumeUnit || product.volumeUnit,
        grossWeight: number(item.grossWeight), grossWeightUnit: item.grossWeightUnit || product.grossWeightUnit
      };
    } else {
      card = trigger.closest('[data-service-requirement-card]');
      product = findOrderProduct(trigger.dataset.productId);
      if (!card || !product) return;
      let selections = {};
      try { selections = JSON.parse(card.dataset.serviceProductSelections || '{}'); } catch (error) { selections = {}; }
      selection = { ...defaultSelectionFromProduct(product), ...(selections[trigger.dataset.productId] || {}) };
    }
    serviceProductEditorContext = { target, route, item, card, product, productId: trigger.dataset.productId };
    serviceProductEditorName.textContent = product.name || '未命名商品';
    serviceProductEditorLimit.textContent = '订单数量：' + number(product.standardQty ?? product.count) + ' ' + (product.standardUnit || product.unit || '');
    serviceProductEditorStandardQty.max = number(product.standardQty ?? product.count);
    serviceProductEditorPieceQty.max = number(product.pieceCount ?? product.count);
    serviceProductEditorGrossQty.max = number(product.grossWeight ?? product.weight);
    serviceProductEditorStandardQty.value = selection.standardQty;
    serviceProductEditorStandardUnit.value = selection.standardUnit || product.standardUnit || product.unit || '';
    serviceProductEditorPieceQty.value = selection.pieceCount;
    serviceProductEditorPieceUnit.value = selection.pieceCountUnit || product.pieceCountUnit || product.unit || '';
    serviceProductEditorGrossQty.value = selection.grossWeight;
    serviceProductEditorGrossUnit.value = selection.grossWeightUnit || product.grossWeightUnit || '吨';
    serviceProductEditorValidation.textContent = '';
    serviceProductEditor.hidden = false;
    positionServiceProductEditor(trigger);
  }

  function closeServiceProductEditor() {
    if (serviceProductEditor) serviceProductEditor.hidden = true;
    serviceProductEditorContext = null;
  }

  function saveServiceProductEditor() {
    if (!serviceProductEditorContext) return;
    const product = serviceProductEditorContext.product;
    const selection = {
      standardQty: number(serviceProductEditorStandardQty.value),
      standardUnit: serviceProductEditorStandardUnit.value,
      pieceCount: number(serviceProductEditorPieceQty.value),
      pieceCountUnit: serviceProductEditorPieceUnit.value,
      volume: number(serviceProductEditorContext.item?.volume ?? serviceProductEditorContext.product?.volume),
      volumeUnit: serviceProductEditorContext.item?.volumeUnit || serviceProductEditorContext.product?.volumeUnit || 'm³',
      grossWeight: number(serviceProductEditorGrossQty.value),
      grossWeightUnit: serviceProductEditorGrossUnit.value
    };
    const standardMax = number(product.standardQty ?? product.count);
    const pieceMax = number(product.pieceCount ?? product.count);
    const grossMax = number(product.grossWeight ?? product.weight);
    if (!selection.standardQty || selection.standardQty > standardMax) {
      serviceProductEditorValidation.textContent = '本次标准数量需大于 0 且不能超过 ' + standardMax + ' ' + (product.standardUnit || '');
      return;
    }
    if (selection.pieceCount > pieceMax) { serviceProductEditorValidation.textContent = '本次件数不能超过 ' + pieceMax + ' ' + (product.pieceCountUnit || ''); return; }
    if (selection.grossWeight > grossMax) { serviceProductEditorValidation.textContent = '本次毛重不能超过 ' + grossMax + ' ' + (product.grossWeightUnit || ''); return; }
    if (serviceProductEditorContext.target === 'route') {
      Object.assign(serviceProductEditorContext.item, selection, { count: selection.standardQty });
      render();
    } else if (serviceProductEditorContext.card) {
      const card = serviceProductEditorContext.card;
      let selections = {};
      try { selections = JSON.parse(card.dataset.serviceProductSelections || '{}'); } catch (error) { selections = {}; }
      selections[serviceProductEditorContext.productId] = selection;
      const quantities = {};
      Object.keys(selections).forEach((id) => { quantities[id] = selections[id].standardQty; });
      card.dataset.serviceProductSelections = JSON.stringify(selections);
      card.dataset.serviceProductQuantities = JSON.stringify(quantities);
      window.refreshServiceRequirementProducts?.(card);
    }
    closeServiceProductEditor();
  }

  function updateServiceProductInlineField(control) {
    const field = control.dataset.serviceInlineField;
    const max = number(control.dataset.serviceInlineMax);
    const value = number(control.value);
    const invalid = field === 'standardQty' ? (!value || value > max) : (value < 0 || value > max);
    control.classList.toggle('is-invalid', invalid);
    control.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    if (invalid) return;
    const target = control.dataset.editorTarget;
    const productId = control.dataset.productId;
    if (target === 'route') {
      const route = findRoute(control.dataset.routeId);
      const item = (route?.items || []).find((entry) => entry.id === control.dataset.itemId);
      if (!item) return;
      item[field] = value;
      if (field === 'standardQty') item.count = value;
      if (field === 'volume') item.vol = value;
      if (field === 'grossWeight') item.weight = value;
      item.sourceProductId = productId;
      syncHidden(false);
    } else if (target === 'service') {
      const card = control.closest('[data-service-requirement-card]');
      if (!card) return;
      let selections = {};
      try { selections = JSON.parse(card.dataset.serviceProductSelections || '{}'); } catch (error) { selections = {}; }
      const product = findOrderProduct(productId);
      selections[productId] = { ...defaultSelectionFromProduct(product), ...(selections[productId] || {}) };
      selections[productId][field] = value;
      const quantities = {};
      Object.keys(selections).forEach((id) => { quantities[id] = selections[id].standardQty; });
      card.dataset.serviceProductSelections = JSON.stringify(selections);
      card.dataset.serviceProductQuantities = JSON.stringify(quantities);
    }
  }

  function handleAction(button) {
    const action = button.dataset.routeAction;
    const route = findRoute(button.dataset.routeId);
    if (action === 'add-route') {
      if (state.routes.length === 1) state.routes[0].collapsed = false;
      const newRoute = makeRoute(button.dataset.routeType || '汽运');
      newRoute.collapsed = false;
      state.routes.push(newRoute);
      if (hierarchyMode) ensureHierarchyState(state);
      state.activeTab = state.routes.length - 1;
      activeRouteAnchorIndex = state.activeTab;
      render();
      notify('success', '已添加新的运输服务要求。');
      return;
    }
    if (hierarchyMode && action === 'add-product') {
      route.items.push(makeHierarchyProduct({ id: 'P' + Date.now(), name: '新商品', quantity: 1, unit: '吨', arrangements: [] }));
      route.collapsed = false;
      render();
      notify('success', '已添加商品，请继续添加物流安排。');
      return;
    }
    if (hierarchyMode && action === 'add-arrangement') {
      const product = (route.items || []).find((item) => item.id === button.dataset.productId);
      if (!product) return;
      product.arrangements = product.arrangements || [];
      product.arrangements.push(makeHierarchyArrangement({
        type: route.type || '汽运', shipmentCategory: route.shipmentCategory, origin: route.origin, destination: route.destination,
        originType: route.originType, destinationType: route.destinationType, originContact: route.originContact, originContactPhone: route.originContactPhone,
        destinationContact: route.destinationContact, destinationContactPhone: route.destinationContactPhone, quantity: product.standardQty ?? 1,
        unit: product.standardUnit || product.unit || '吨', productId: product.id, collapsed: false
      }));
      product.collapsed = false;
      route.collapsed = false;
      render();
      notify('success', '已添加物流安排，系统已自动编号。');
      return;
    }
    if (hierarchyMode && action === 'toggle-product') {
      const product = (route.items || []).find((item) => item.id === button.dataset.productId);
      if (product) { product.collapsed = !product.collapsed; render(); }
      return;
    }
    if (hierarchyMode && action === 'remove-product') {
      const product = (route.items || []).find((item) => item.id === button.dataset.productId);
      if (!product) return;
      if ((product.arrangements || []).length) { notify('error', '该商品下仍有物流安排，请先删除物流安排后再删除商品。'); return; }
      route.items = route.items.filter((item) => item.id !== product.id);
      render();
      notify('success', '商品已删除。');
      return;
    }
    if (hierarchyMode && action === 'toggle-arrangement') {
      const product = (route.items || []).find((item) => item.id === button.dataset.productId);
      const arrangement = (product?.arrangements || []).find((item) => item.id === button.dataset.arrangementId);
      if (arrangement) { arrangement.collapsed = !arrangement.collapsed; render(); }
      return;
    }
    if (hierarchyMode && action === 'remove-arrangement') {
      const product = (route.items || []).find((item) => item.id === button.dataset.productId);
      if (!product) return;
      product.arrangements = (product.arrangements || []).filter((item) => item.id !== button.dataset.arrangementId);
      product.arrangements.forEach((item) => { item.upstreamIds = (item.upstreamIds || []).filter((id) => id !== button.dataset.arrangementId); });
      render();
      notify('success', '物流安排已删除。');
      return;
    }
    if (hierarchyMode && action === 'generate-delegation') {
      notify('success', '已按线路 #' + (state.routes.indexOf(route) + 1) + ' 整体生成物流委托，包含该线路全部商品及物流安排。');
      return;
    }
    if (action === 'preview') { openPreview(); return; }
    if (action === 'view-flow') { openFlowDrawer(); return; }
    if (action === 'feedback') { document.getElementById('feedbackTab')?.click(); return; }
    if (action === 'duplicate-item') {
      const source = route.items.find((item) => item.id === button.dataset.itemId);
      if (!source) return;
      if (!orderItemsCopyEnabled()) { notify('error', '仅创建或驳回状态可以复制商品。'); return; }
      const copy = JSON.parse(JSON.stringify(source));
      copy.id = 'IT' + Date.now() + Math.floor(Math.random() * 1000);
      delete copy.linkedRouteId;
      delete copy.linkedItemId;
      delete copy.linkedQty;
      delete copy.demandMissing;
      delete copy.demandNo;
      delete copy.delegationNo;
      copy.arrangedQty = 0;
      const index = route.items.indexOf(source);
      route.items.splice(index + 1, 0, normalizeItem(copy));
      render();
      notify('success', '已复制商品「' + (source.name || '未命名商品') + '」。');
      return;
    }
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
    if (action === 'toggle-route-mail') {
      const box = button.closest('[data-route-mail-box]');
      const popover = box?.querySelector('[data-route-mail-popover]');
      if (!popover) return;
      popover.hidden = !popover.hidden;
      button.setAttribute('aria-expanded', String(!popover.hidden));
      const error = popover.querySelector('[data-route-mail-error]');
      if (error) error.textContent = '';
      popover.querySelectorAll('[data-route-mail-name], [data-route-mail-email]').forEach((input) => input.classList.remove('is-invalid'));
      if (!popover.hidden) popover.querySelector('[data-route-mail-name]')?.focus();
      return;
    }
    if (action === 'cancel-route-mail') {
      const box = button.closest('[data-route-mail-box]');
      const popover = box?.querySelector('[data-route-mail-popover]');
      if (popover) {
        popover.hidden = true;
        box.querySelector('[data-route-action="toggle-route-mail"]')?.setAttribute('aria-expanded', 'false');
      }
      return;
    }
    if (action === 'confirm-route-mail') {
      const box = button.closest('[data-route-mail-box]');
      const popover = box?.querySelector('[data-route-mail-popover]');
      const nameInput = popover?.querySelector('[data-route-mail-name]');
      const emailInput = popover?.querySelector('[data-route-mail-email]');
      const name = nameInput?.value.trim() || '';
      const email = emailInput?.value.trim() || '';
      const errorNode = popover?.querySelector('[data-route-mail-error]');
      const showError = (message, input) => {
        if (errorNode) errorNode.textContent = message;
        [nameInput, emailInput].forEach((field) => field?.classList.remove('is-invalid'));
        input?.classList.add('is-invalid');
        input?.focus();
      };
      if (!name || !email) { showError('请填写邮件接收人姓名和邮箱。', !name ? nameInput : emailInput); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('请输入正确的邮箱地址。', emailInput); return; }
      route.mailRecipients = (route.mailRecipients || []).map(normalizeMailRecipient).filter(Boolean);
      if (route.mailRecipients.some((recipient) => recipient.email.toLowerCase() === email.toLowerCase())) { showError('该邮箱已添加，请勿重复添加。', emailInput); return; }
      route.mailRecipients.push({ name, email });
      render();
      return;
    }
    if (action === 'remove-route-mail') {
      route.mailRecipients = (route.mailRecipients || []).map(normalizeMailRecipient).filter(Boolean);
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
      notify('success', '已复制当前运输服务要求。');
      return;
    }
    if (action === 'toggle') {
      activeRouteAnchorIndex = state.routes.indexOf(route);
      route.collapsed = !route.collapsed;
      render();
      return;
    }
    if (action === 'remove') {
      const blockingItem = (route.items || []).find((item) => {
        if (item.linkedRouteId) return false;
        const summary = referenceSummary(route, item);
        return summary.demandRefQty > 0 || summary.externalRefQty > 0;
      });
      if (blockingItem) {
        const summary = referenceSummary(route, blockingItem);
        const message = deletionBlockMessage(blockingItem, summary).replace('不允许删除商品行。', '不允许删除该运输服务要求。');
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
      notify('success', '运输服务要求已删除。');
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
    if (!state.routes.length) return '<div class="order-flow-empty">暂无运输服务要求</div>';
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
    const groupBlocks = groups.map(({ sourceRoute, routeIndex }) => {
      const items = (sourceRoute.items || []).map((sourceRow, itemIndex) => ({ sourceRow, itemIndex })).sort((a, b) => a.itemIndex - b.itemIndex);
      if (!items.length) return '';
      const headText = '【线路' + (routeIndex + 1) + '】' + (sourceRoute.origin || '未指定起运地') + ' — ' + (sourceRoute.destination || '未指定目的地') + '（' + (sourceRoute.type || '未指定方式') + (sourceRoute.shipmentCategory ? ' · ' + sourceRoute.shipmentCategory : '') + '）';
      const rows = items.map(({ sourceRow }) => {
        const sourceItem = resolveLinkedItem(sourceRow) || sourceRow;
        const total = number(sourceItem.standardQty ?? sourceItem.count);
        const arranged = number(sourceRow.arrangedQty);
        const linked = existingLinks.has(sourceRoute.id + '::' + sourceRow.id);
        const originRouteIndex = sourceRow.linkedRouteId ? state.routes.findIndex((entry) => entry.id === sourceRow.linkedRouteId) : -1;
        return '<tr class="order-link-item-row' + (linked ? ' is-linked' : '') + '" data-link-row>' +
          '<td class="order-link-check"><input type="checkbox" data-link-source-route="' + escapeHtml(sourceRoute.id) + '" data-link-source-item="' + escapeHtml(sourceRow.id) + '" data-link-qty="' + total + '" data-link-unit="' + escapeHtml(sourceItem.standardUnit || sourceItem.unit || '') + '" data-link-piece="' + number(sourceItem.pieceCount) + '" aria-label="选择商品"' + (linked ? ' disabled' : '') + '></td>' +
          cell(sourceItem.name) +
          cell(sourceItem.description) +
          cell((sourceItem.tradeContractNo || '—') + (sourceItem.tradeContractType ? '（' + sourceItem.tradeContractType + '）' : '')) +
          cell((total - arranged) + ' / ' + total) +
          cell(sourceItem.standardUnit || sourceItem.unit) +
          cell(number(sourceItem.pieceCount) + ' ' + (sourceItem.pieceCountUnit || '')) +
          cell(number(sourceItem.grossWeight) + ' ' + (sourceItem.grossWeightUnit || '')) +
          cell(number(sourceItem.volume) + ' ' + (sourceItem.volumeUnit || '')) +
          '<td>' + (originRouteIndex >= 0 ? '线路' + (originRouteIndex + 1) : '—') + '</td>' +
        '</tr>';
      }).join('');
      return '<tbody class="order-link-group" data-link-group>' +
        '<tr class="order-link-group-row"><td colspan="10"><button class="order-link-group-toggle" type="button" aria-expanded="true"><span class="order-link-caret">▾</span><span class="order-link-group-title">' + escapeHtml(headText) + '</span><span class="order-link-group-count">' + items.length + ' 项</span></button></td></tr>' +
        rows + '</tbody>';
    }).join('');

    const headers = ['', '商品分类', '商品描述', '贸易合同号（类型）', '剩余/总计标准数量', '标准单位', '件数', '毛重', '体积', '关联线路'];
    const content = groupBlocks
      ? '<div class="order-link-picker"><div class="order-link-summary" id="orderLinkSummary">已选 0 条，合计标准数量 0</div><div class="order-link-table-wrap"><table class="order-link-table"><thead><tr>' + headers.map((text) => '<th>' + text + '</th>').join('') + '</tr></thead>' + groupBlocks + '</table></div></div>'
      : '<div class="order-route-empty">暂无可关联的其他线路商品。</div>';
    linkPickerBody.innerHTML = content;
    updateLinkedPickerSummary();
    linkPicker.hidden = false;
    linkPicker.querySelector('.order-route-preview-dialog').focus();
  }

  function updateLinkedPickerSummary() {
    const summary = document.getElementById('orderLinkSummary');
    if (!summary) return;
    const checked = Array.from(linkPickerBody.querySelectorAll('input[data-link-source-item]:checked'));
    const totalQty = checked.reduce((sum, box) => sum + number(box.dataset.linkQty), 0);
    const totalPiece = checked.reduce((sum, box) => sum + number(box.dataset.linkPiece), 0);
    const units = Array.from(new Set(checked.map((box) => box.dataset.linkUnit).filter(Boolean)));
    summary.textContent = '已选 ' + checked.length + ' 条，合计标准数量 ' + totalQty + (units.length === 1 ? ' ' + units[0] : '');
    linkPickerBody.querySelectorAll('[data-link-row]').forEach((row) => {
      const box = row.querySelector('input[data-link-source-item]');
      row.classList.toggle('selected', Boolean(box && box.checked));
    });
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

  const routeStatusField = document.getElementById('orderStatusField');
  if (routeStatusField) {
    let lastRouteStatus = routeStatusField.textContent.trim();
    new MutationObserver(() => {
      const nextStatus = routeStatusField.textContent.trim();
      if (nextStatus === lastRouteStatus) return;
      lastRouteStatus = nextStatus;
      render();
    }).observe(routeStatusField, { childList: true, characterData: true, subtree: true });
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
    const serviceProductEditTrigger = event.target.closest('[data-service-product-edit]');
    if (serviceProductEditTrigger) { event.stopPropagation(); openServiceProductEditor(serviceProductEditTrigger); return; }
    const productPickerTrigger = event.target.closest('[data-order-product-picker]');
    if (productPickerTrigger) { openOrderProductPicker(productPickerTrigger); return; }
    const orderProductAction = event.target.closest('[data-order-product-action]');
    if (orderProductAction) { handleOrderProductAction(orderProductAction); return; }
    const goodsToggle = event.target.closest('[data-goods-toggle]');
    if (goodsToggle) {
      const row = goodsToggle.closest('[data-goods-row]');
      if (row) {
        const expanded = !row.classList.contains('is-expanded');
        row.classList.toggle('is-expanded', expanded);
        goodsToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        goodsToggle.setAttribute('title', expanded ? '收起商品字段' : '展开全部商品字段');
        const label = goodsToggle.querySelector('.ro-goods-toggle-label');
        if (label) label.textContent = expanded ? '收起商品字段' : '查看全部商品字段';
      }
      return;
    }
    const feeRouteToggle = event.target.closest('[data-fee-route-toggle]');
    if (feeRouteToggle) { openFeeRouteMenu(feeRouteToggle); return; }
    const feeButton = event.target.closest('[data-fee-action]');
    if (feeButton) { handleFeeAction(feeButton); return; }
    const button = event.target.closest('[data-route-action]');
    if (button) handleAction(button);
  });
  pageScope.addEventListener('input', (event) => {
    if (event.target.matches('[data-route-mail-name], [data-route-mail-email]')) {
      const popover = event.target.closest('[data-route-mail-popover]');
      const error = popover?.querySelector('[data-route-mail-error]');
      if (error) error.textContent = '';
      event.target.classList.remove('is-invalid');
      return;
    }
    if (event.target.matches('[data-service-inline-field]')) { updateServiceProductInlineField(event.target); return; }
    if (event.target.matches('[data-order-product-field]')) { updateOrderProductField(event.target); return; }
    if (hierarchyMode && event.target.matches('[data-arrangement-quantity]')) {
      const arrangement = findRoute(event.target.dataset.routeId);
      if (arrangement) arrangement.hierarchyQuantity = Math.max(0, number(event.target.value));
      return;
    }
    if (event.target.matches('[data-route-field], [data-route-operation], [data-leg-field], [data-item-field], [data-fee-field], [data-container-field], [data-party-field]')) {
      updateControl(event.target);
      if (hierarchyMode && (event.target.dataset.arrangementQuantity !== undefined || event.target.dataset.itemField === 'standardQty')) return;
      refreshDerived();
    }
  });
  pageScope.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || !event.target.matches('[data-route-mail-name], [data-route-mail-email]')) return;
    event.preventDefault();
    event.target.closest('[data-route-mail-box]')?.querySelector('[data-route-action="confirm-route-mail"]')?.click();
  });
  pageScope.addEventListener('change', (event) => {
    if (event.target.matches('[data-service-inline-field]')) {
      const max = number(event.target.dataset.serviceInlineMax);
      const value = number(event.target.value);
      const field = event.target.dataset.serviceInlineField;
      if ((field === 'standardQty' ? (!value || value > max) : value > max)) event.target.value = max;
      updateServiceProductInlineField(event.target);
      return;
    }
    if (event.target.matches('[data-order-product-field]')) { updateOrderProductField(event.target); render(); return; }
    if (hierarchyMode && event.target.matches('[data-arrangement-upstream]')) {
      const topRoute = state.routes.find((route) => (route.items || []).some((product) => product.id === event.target.dataset.productId));
      const product = topRoute?.items.find((item) => item.id === event.target.dataset.productId);
      const arrangement = (product?.arrangements || []).find((item) => item.id === event.target.dataset.arrangementId);
      if (!arrangement) return;
      const selected = new Set(arrangement.upstreamIds || []);
      if (event.target.checked) selected.add(event.target.value); else selected.delete(event.target.value);
      arrangement.upstreamIds = Array.from(selected);
      render();
      return;
    }
    if (hierarchyMode && event.target.matches('[data-arrangement-quantity]')) {
      render();
      return;
    }
    if (event.target.matches('[data-fee-select-all]')) {
      estimateHost.querySelectorAll('[data-fee-select][data-fee-direction="' + event.target.dataset.feeSelectAll + '"]').forEach((checkbox) => { checkbox.checked = event.target.checked; });
      return;
    }
    if (!event.target.matches('[data-route-field], [data-route-operation], [data-leg-field], [data-item-field], [data-fee-field], [data-container-field], [data-party-field]')) return;
    updateControl(event.target);
    if (['type', 'shipmentCategory', 'origin', 'destination', 'originPort', 'destinationPort', 'agent', 'deliveryPlace'].includes(event.target.dataset.routeField) || event.target.dataset.itemField === 'name' || (hierarchyMode && event.target.dataset.itemField === 'standardQty')) render();
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
  orderProductPickerClose?.addEventListener('click', closeOrderProductPicker);
  orderProductPickerCancel?.addEventListener('click', closeOrderProductPicker);
  orderProductPickerConfirm?.addEventListener('click', confirmOrderProductPicker);
  orderProductPicker?.addEventListener('click', (event) => { if (event.target === orderProductPicker) closeOrderProductPicker(); });
  orderProductPickerBody?.addEventListener('change', (event) => { if (event.target.matches('[data-product-picker-item]')) updateOrderProductPickerSummary(); });
  serviceProductEditorClose?.addEventListener('click', closeServiceProductEditor);
  serviceProductEditorCancel?.addEventListener('click', closeServiceProductEditor);
  serviceProductEditorSave?.addEventListener('click', saveServiceProductEditor);
  document.addEventListener('click', (event) => {
    if (!serviceProductEditor || serviceProductEditor.hidden) return;
    if (serviceProductEditor.contains(event.target) || event.target.closest('[data-service-product-edit]')) return;
    closeServiceProductEditor();
  });
  window.addEventListener('resize', closeServiceProductEditor);
  linkPickerBody.addEventListener('change', (event) => {
    if (event.target.matches('input[data-link-source-item]')) updateLinkedPickerSummary();
  });
  linkPickerBody.addEventListener('click', (event) => {
    const toggle = event.target.closest('.order-link-group-toggle, [data-link-group-toggle]');
    if (!toggle) return;
    const group = toggle.closest('[data-link-group]');
    if (!group) return;
    const collapsed = group.classList.toggle('collapsed');
    toggle.setAttribute('aria-expanded', String(!collapsed));
    const caret = toggle.querySelector('.order-link-caret');
    if (caret) caret.textContent = collapsed ? '▸' : '▾';
  });
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
    notify('success', '已按 ' + state.routes.length + ' 条运输服务要求生成物流需求，等待承运商调度。');
    closePreview();
  });
  specifiedModeSelect?.addEventListener('change', () => {
    if (typeof window.syncOrderTransportVisibility === 'function') window.syncOrderTransportVisibility();
    render();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (serviceProductEditor && !serviceProductEditor.hidden) closeServiceProductEditor();
    else if (orderProductPicker && !orderProductPicker.hidden) closeOrderProductPicker();
    else if (feeRouteMenu && !feeRouteMenu.hidden) closeFeeRouteMenu();
    else if (!flowDrawer.hidden) closeFlowDrawer();
    else if (!linkPicker.hidden) closeLinkedItemPicker();
    else if (!preview.hidden) closePreview();
  });

  const orderStatusField = document.getElementById('orderStatusField');
  if (orderStatusField) {
    new MutationObserver(syncRouteHeaderActions).observe(orderStatusField, { childList: true, characterData: true, subtree: true });
  }

  window.OrderRoutesValidation = {
    getOrderProducts: () => state.orderProducts,
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
  const singleTransportScenario = new URLSearchParams(window.location.search).get('scenario') === 'single-transport';
  if (orderRouteReadonly() && !singleTransportScenario) {
    state.routes = pendingReviewCoverageRoutes();
    activeRouteAnchorIndex = 0;
  }
  render();
})();
