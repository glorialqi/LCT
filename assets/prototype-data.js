/* Shared prototype fixtures and lightweight cross-page state helpers.
   The pages remain static; this file only keeps demo records consistent. */
(function () {
  'use strict';

  const STORAGE = {
    selectedOrder: 'ct:selectedCustomerOrder',
    listState: 'ct:customerOrderListState',
    draftPrefix: 'ct:customerOrderDraft:'
  };

  const customerOrders = {
    'FCO202610270004': {
      no: 'FCO202610270004', status: '待履约', orderConfirmationStatus: '待确认', orderGoodsQuantity: 1.2, generatedLogisticsDemandQuantity: 0, customer: '山东港口国际贸易集团有限公司',
      goods: '进口纸浆', total: '1.20 万吨', origin: '青岛港', destination: '日照港',
      businessType: '进口', serviceScope: ['运输', '报关清关'], transportType: '水运', loadType: '散货',
      sales: '梁露', company: '厦门建发物流有限公司', department: '物流运营部',
      consignments: ['2103654897215401984'], businessDate: '2026-10-23',
      projectNo: 'PRJ-2026-1023-04', tradeTerm: 'CIF', contact: '梁露', phone: '0592-259-2236',
      email: 'lianglu@endlogistics.com', remark: '合同待发起签署，签署完成后再安排物流。',
      profit: {
        estimatedRevenue: '¥4,150,000', estimatedCost: '¥3,150,000',
        estimatedGross: '¥1,000,000', margin: '24.10%'
      },
      contract: {
        no: 'CON2026103000247', version: 'V1.0', status: '待签约', signMethod: '线下签约',
        signMode: '物流平台公司签约', platformCompany: '厦门建发供应链物流科技有限公司',
        principalName: '梁露', principalPhone: '0592-259-2236',
        principalAddress: '中国厦门市环岛东路1699号建发国际大厦27楼', principalEmail: 'lianglu@endlogistics.com',
        counterpartyName: '王保君', counterpartyPhone: '15064886112',
        counterpartyAddress: '亚洲/中国/山东省/青岛市/黄岛区 山东省青岛市黄岛区', counterpartyEmail: 'Richlay@zg-express.com'
      }
    },
    'FCO202610270003': {
      no: 'FCO202610270003', status: '待履约', orderConfirmationStatus: '已确认', orderGoodsQuantity: 2.5, generatedLogisticsDemandQuantity: 2.5, customer: '青岛港国际股份有限公司',
      goods: '铁矿石', total: '2.50 万吨', origin: '青岛港', destination: '日照港',
      businessType: '内贸', serviceScope: ['运输'], transportType: '水运', loadType: '散货',
      sales: '苏丽蓉', company: '厦门建发物流有限公司', department: '物流运营部',
      consignments: ['2103652106571845520'], businessDate: '2026-10-22',
      projectNo: 'PRJ-2026-1022-03', tradeTerm: 'FOB', contact: '王保君', phone: '15064886112',
      email: 'Richlay@zg-express.com', remark: '合同签署中，预计 2 个工作日内完成正本回收。',
      profit: {
        estimatedRevenue: '¥6,800,000', estimatedCost: '¥5,360,000',
        estimatedGross: '¥1,440,000', margin: '21.18%'
      },
      contract: {
        no: 'CON2026103000248', version: 'V1.1', status: '签约中', signMethod: 'E建签签约',
        signMode: '物流平台公司签约', platformCompany: '厦门建发供应链物流科技有限公司',
        principalName: '苏丽蓉', principalPhone: '0592-259-2236',
        principalAddress: '中国厦门市环岛东路1699号建发国际大厦27楼', principalEmail: 'sulirong@endlogistics.com',
        counterpartyName: '王保君', counterpartyPhone: '15064886112',
        counterpartyAddress: '亚洲/中国/山东省/青岛市/黄岛区 山东省青岛市黄岛区', counterpartyEmail: 'Richlay@zg-express.com'
      }
    },
    'FCO202610270010': {
      no: 'FCO202610270010', status: '履约中', orderGoodsQuantity: 10, generatedLogisticsDemandQuantity: 10, customer: '青岛绿洲园花生食品有限公司',
      goods: '玉米', total: '10 吨', origin: '厦门港', destination: '上官栗子四果汤(文化宫店)',
      businessType: '出口', serviceScope: ['运输'], transportType: '水运', loadType: '散货',
      sales: '苏丽蓉', company: '厦门建发物流有限公司', department: '物流运营部',
      consignments: ['2102957467694845952'], businessDate: '2026-10-27',
      projectNo: '', tradeTerm: 'FOB', contact: '', phone: '', email: '', remark: ''
    },
    'FCO202610270009': {
      no: 'FCO202610270009', status: '履约中', orderGoodsQuantity: 10, generatedLogisticsDemandQuantity: 5, customer: '青岛绿洲园花生食品有限公司',
      goods: '玉米', total: '10 吨', origin: '厦门港', destination: '上官栗子四果汤(文化宫店)',
      businessType: '出口', serviceScope: ['运输'], transportType: '水运', loadType: '散货',
      sales: '苏丽蓉', company: '厦门建发物流有限公司', department: '物流运营部',
      consignments: ['2102960421436968960'], businessDate: '2026-10-27',
      projectNo: '', tradeTerm: 'FOB', contact: '', phone: '', email: '', remark: ''
    },
    'FCO202610270008': {
      no: 'FCO202610270008', status: '待履约', orderConfirmationStatus: '已确认', orderGoodsQuantity: 300, generatedLogisticsDemandQuantity: 0, customer: '中国重汽集团',
      goods: '重卡卡车', total: '300 台', origin: '青岛港', destination: '上海港',
      businessType: '出口', serviceScope: ['运输'], transportType: '水运', loadType: '件杂货',
      sales: '庄巧玲', company: '厦门建发物流有限公司', department: '件杂部',
      consignments: ['2102960975970095104', '2102960975970095105'], businessDate: '2026-10-26',
      projectNo: '', tradeTerm: 'FOB', contact: '', phone: '', email: '', remark: ''
    },
    'FCO202611250001': {
      no: 'FCO202611250001', status: '待履约', orderConfirmationStatus: '已确认', orderGoodsQuantity: 1.2, generatedLogisticsDemandQuantity: 0, customer: '青岛绿洲园花生食品有限公司',
      goods: '进口纸浆', total: '1.20 万吨', origin: '--', destination: '--',
      businessType: '进口', serviceScope: ['报关清关'], transportType: '', loadType: '',
      sales: '苏丽蓉', company: '厦门建发物流有限公司', department: '物流运营部',
      consignments: ['210611250001'], businessDate: '2026-11-25',
      projectNo: '', tradeTerm: 'CIF', contact: '', phone: '', email: '', remark: ''
    },
    'FCO202611250002': {
      no: 'FCO202611250002', status: '待履约', orderConfirmationStatus: '已确认', orderGoodsQuantity: 300, generatedLogisticsDemandQuantity: 0, customer: '中国重汽集团',
      goods: '重卡卡车', total: '300 台', origin: '--', destination: '--',
      businessType: '出口', serviceScope: ['仓储'], transportType: '', loadType: '',
      sales: '庄巧玲', company: '厦门建发亚投新能源物流有限公司', department: '件杂部',
      consignments: ['210611250002'], businessDate: '2026-11-25',
      projectNo: '', tradeTerm: 'FOB', contact: '', phone: '', email: '', remark: ''
    },
    'FCO202610270007': {
      no: 'FCO202610270007', status: '创建', customer: '中国宝武钢铁集团有限公司',
      goods: 'PB粉矿', total: '8.50 万吨', origin: 'Port Hedland', destination: '舟山鼠浪湖',
      businessType: '进口', serviceScope: ['报关清关'], transportType: '水运', loadType: '散货',
      sales: '刘婷', company: '厦门建发物流有限公司', department: '单证客服部',
      consignments: ['2104489744589164545'], businessDate: '2026-10-26',
      projectNo: '', tradeTerm: 'CIF', contact: '', phone: '', email: '', remark: '', contract: { status: '' }
    },
    'FCO202610270006': {
      no: 'FCO202610270006', status: '待审核', customer: '浙江吉利控股集团',
      goods: '新能源整车', total: '450 台', origin: '宁波梅山港', destination: '比利时安特卫普',
      businessType: '出口', serviceScope: ['运输'], transportType: '水运', loadType: '集装箱',
      sales: '苏丽蓉', company: '厦门建发物流有限公司', department: '物流运营部',
      consignments: ['CT-2026-1027-01'], businessDate: '2026-10-25',
      projectNo: '', tradeTerm: 'CIF', contact: '', phone: '', email: '', remark: ''
    },
    'FCO202610270005': {
      no: 'FCO202610270005', status: '驳回', customer: '厦门象屿股份有限公司',
      goods: '钢材', total: '1.20 万吨', origin: '厦门港', destination: '胡志明港',
      businessType: '出口', serviceScope: ['运输'], transportType: '水运', loadType: '散货',
      sales: '庄巧玲', company: '厦门建发物流有限公司', department: '件杂部',
      consignments: [], businessDate: '2026-10-24',
      projectNo: '', tradeTerm: 'FOB', contact: '', phone: '', email: '', remark: '', contract: { status: '' }
    },
    'CO-20260901-BULK': {
      no: 'CO-20260901-BULK', status: '履约中', customer: '中国宝武钢铁集团有限公司',
      goods: 'PB粉矿', total: '8.50 万吨', origin: 'Port Hedland', destination: '武汉青山码头',
      businessType: '进口', serviceScope: ['运输', '报关清关', '仓储'], transportType: '水运', loadType: '散货',
      sales: '庄巧玲', company: '厦门建发亚投新能源物流有限公司', department: '件杂部',
      consignments: [], businessDate: '2026-09-01',
      projectNo: '', tradeTerm: 'CIF', contact: '', phone: '', email: '', remark: 'Port Hedland → 舟山鼠浪湖 → 武汉青山码头'
    },
    'CO-20260903-DOMESTIC': {
      no: 'CO-20260903-DOMESTIC', status: '已完结', customer: '中国石油天然气股份有限公司',
      goods: '环氧丙烷', total: '2.80 万吨', origin: '南京化学工业园', destination: '武汉青山石化码头',
      businessType: '内贸', serviceScope: ['运输'], transportType: '水运', loadType: '散货',
      sales: '王静铭', company: '厦门建发亚投新能源物流有限公司', department: '调度组',
      consignments: [], businessDate: '2026-09-03',
      projectNo: '', tradeTerm: 'FOB', contact: '', phone: '', email: '', remark: ''
    },
    'CO-20260904-BREAKBULK': {
      no: 'CO-20260904-BREAKBULK', status: '履约中', customer: '中国重汽集团',
      goods: '重卡卡车', total: '300 台', origin: '青岛港件杂货码头', destination: '东非蒙巴萨港',
      businessType: '出口', serviceScope: ['运输'], transportType: '水运', loadType: '件杂货',
      sales: '庄巧玲', company: '厦门建发亚投新能源物流有限公司', department: '件杂部',
      orderConfirmationStatus: '已确认', orderGoodsQuantity: 300, generatedLogisticsDemandQuantity: 120,
      consignments: [], businessDate: '2026-09-10',
      projectNo: '', tradeTerm: 'FOB', contact: '', phone: '', email: '', remark: ''
    },
    'CO-20260905-PENDING': {
      no: 'CO-20260905-PENDING', status: '待履约', customer: '浙江吉利控股集团有限公司',
      goods: '新能源纯电乘用车', total: '450 台', origin: '宁波梅山港', destination: '比利时安特卫普',
      businessType: '出口', serviceScope: ['运输'], transportType: '水运', loadType: '集装箱',
      sales: '', company: '厦门建发亚投新能源物流有限公司', department: '',
      consignments: [], businessDate: '2026-09-05',
      projectNo: '', tradeTerm: 'CIF', contact: '', phone: '', email: '', remark: ''
    },
    'CO-20260902-CONTAINER': {
      no: 'CO-20260902-CONTAINER', status: '履约中', customer: '三一重工股份有限公司',
      goods: '履带式挖掘机', total: '500 TEU', origin: '长沙/株洲', destination: '汉堡港/鹿特丹',
      businessType: '出口', serviceScope: ['运输', '报关清关'], transportType: '水运', loadType: '集装箱',
      sales: '', company: '厦门建发亚投新能源物流有限公司', department: '',
      consignments: [], businessDate: '2026-09-02',
      projectNo: '', tradeTerm: 'CIF', contact: '', phone: '', email: '', remark: ''
    }
  };

  function readJson(storage, key) {
    try {
      const raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_error) {
      return null;
    }
  }

  function writeJson(storage, key, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_error) {
      return false;
    }
  }

  function rememberSelectedOrder(record) {
    if (!record || !record.no) return false;
    const baseRecord = customerOrders[record.no] || {};
    return writeJson(sessionStorage, STORAGE.selectedOrder, { ...baseRecord, ...record, savedAt: Date.now() });
  }

  function readSelectedOrder(no) {
    const record = readJson(sessionStorage, STORAGE.selectedOrder);
    if (!record || (no && record.no !== no)) return null;
    return record;
  }

  function resolveCustomerOrder(no) {
    if (!no) return null;
    return readSelectedOrder(no) || customerOrders[no] || null;
  }

  function readListState() {
    const state = readJson(sessionStorage, STORAGE.listState);
    if (!state || !state.savedAt || Date.now() - state.savedAt > 30 * 60 * 1000) return null;
    return state;
  }

  function saveListState(state) {
    return writeJson(sessionStorage, STORAGE.listState, { ...state, savedAt: Date.now() });
  }

  function draftKey(no) {
    return STORAGE.draftPrefix + no;
  }

  function readDraft(no) {
    return no ? readJson(sessionStorage, draftKey(no)) : null;
  }

  function saveDraft(no, value) {
    if (!no) return false;
    return writeJson(sessionStorage, draftKey(no), { ...value, savedAt: Date.now() });
  }

  function clearDraft(no) {
    if (!no) return;
    try { sessionStorage.removeItem(draftKey(no)); } catch (_error) {}
  }

  window.PrototypeData = {
    STORAGE,
    customerOrders,
    rememberSelectedOrder,
    readSelectedOrder,
    resolveCustomerOrder,
    readListState,
    saveListState,
    readDraft,
    saveDraft,
    clearDraft
  };
})();
