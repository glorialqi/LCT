(function () {
  'use strict';

  const ui = window.DemandUI;
  const params = new URLSearchParams(window.location.search);
  const versionMaintenanceMode = params.get('mode') === 'version-maintenance';
  const demandNo = params.get('no') || 'XQ202610280031';
  const creatorNames = ['鲤鱼旗', '陈一一', '丁阳', '赵五'];
  const demandLastDigit = Number(demandNo.slice(-1));
  const demandCreator = Number.isInteger(demandLastDigit) && demandLastDigit > 0
    ? creatorNames[(demandLastDigit - 1) % creatorNames.length]
    : creatorNames[Array.from(demandNo).reduce((sum, char) => sum + char.charCodeAt(0), 0) % creatorNames.length];
  const allowedStatuses = ['created', 'pending', 'received', 'rejected', 'completed'];
  const requestedStatus = allowedStatuses.includes(params.get('status'))
    ? params.get('status')
    : allowedStatuses.includes(document.body.dataset.demandStatus)
      ? document.body.dataset.demandStatus
      : 'received';
  const $ = (id) => document.getElementById(id);

  const statusLabels = {
    created: '创建',
    pending: '待接收',
    received: '执行中',
    rejected: '已拒绝',
    completed: '已完成'
  };
  const statusTones = {
    created: 'created',
    pending: 'pending',
    received: 'running',
    rejected: 'rejected',
    completed: 'done'
  };
  const versionStatus = {
    created: { label: '创建', tone: 'created' },
    pending: { label: '待接收', tone: 'pending' },
    received: { label: '已接收', tone: 'done' },
    rejected: { label: '已拒绝', tone: 'rejected' }
  };

  function esc(value) {
    return ui.escapeHtml(value);
  }

  function amountText(value) {
    return Number(value || 0).toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function money(value, currency) {
    return (currency || 'CNY') + ' ' + amountText(value);
  }

  function percentage(value, total) {
    if (!Number(total)) return '--';
    return (Number(value || 0) / Number(total) * 100).toFixed(2) + '%';
  }

  function nowText() {
    const d = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function readonlyField(label, value, options) {
    const config = options || {};
    const classes = ['demand-field'];
    if (config.span) classes.push('span-' + config.span);
    const valueClasses = ['demand-readonly-value'];
    if (config.multiline) valueClasses.push('is-multiline');
    if (config.strong) valueClasses.push('is-strong');
    return '<div class="' + classes.join(' ') + '">' +
      '<div class="demand-field-label">' + esc(label) + '</div>' +
      '<div class="' + valueClasses.join(' ') + '"' + (config.title ? ' title="' + esc(config.title) + '"' : '') + '>' +
      (value == null || value === '' ? '--' : value) +
      '</div></div>';
  }

  function emptyRow(colspan, message, action) {
    return '<tr><td colspan="' + colspan + '"><div class="demand-empty-inline">' +
      esc(message || '暂无数据') +
      (action ? ' <button class="btn link" type="button" data-empty-action="' + esc(action.id) + '">' + esc(action.label) + '</button>' : '') +
      '</div></td></tr>';
  }

  function attachmentButton(item, extraClass) {
    return '<button class="demand-attachment ' + esc(extraClass || '') + '" type="button" data-attachment="' + esc(item.name) + '">' +
      '<svg aria-hidden="true"><use href="#p-doc"/></svg>' +
      '<span><strong title="' + esc(item.name) + '">' + esc(item.name) + '</strong><small>' +
      esc(item.type || '文件') + ' · ' + esc(item.size || '--') + '</small></span></button>';
  }

  function feeLine(config) {
    const quantity = Number(config.quantity || 0);
    const unitPrice = Number(config.unitPrice || 0);
    const originalAmount = Number(config.originalAmount ?? config.amount ?? quantity * unitPrice);
    const exchangeRate = Number(config.exchangeRate ?? config.fx ?? 1);
    const localAmount = Number(config.localAmount ?? originalAmount * exchangeRate);
    return Object.assign({}, config, { quantity, unitPrice, amount: originalAmount, originalAmount, exchangeRate, localAmount });
  }

  function makeFeeRows(customer, supplier) {
    return {
      receivable: [
        feeLine({ id: 'AR-01', item: '海运费', party: customer, taxRate: 9, ppcc: 'CC', unitPrice: 6000, currency: 'CNY', quantity: 10, unit: '箱', containerType: '40HQ', fx: 1, remark: 'FCL 整箱', invoiceType: '增值税专用发票', reimbursable: '否' }),
        feeLine({ id: 'AR-02', item: '代理港杂费', party: customer, taxRate: 6, ppcc: 'CC', unitPrice: 320, currency: 'CNY', quantity: 10, unit: '票', containerType: '--', fx: 1, remark: '按票计费', invoiceType: '增值税专用发票', reimbursable: '否' })
      ],
      payable: [
        feeLine({ id: 'AP-01', item: '海运费', party: supplier, taxRate: 9, ppcc: 'CC', unitPrice: 4600, currency: 'CNY', quantity: 10, unit: '箱', containerType: '40HQ', fx: 1, remark: '船公司采购价', invoiceType: '增值税专用发票', reimbursable: '否' }),
        feeLine({ id: 'AP-02', item: '代理港杂费', party: supplier, taxRate: 6, ppcc: 'CC', unitPrice: 220, currency: 'CNY', quantity: 10, unit: '票', containerType: '--', fx: 1, remark: '落地费用', invoiceType: '增值税专用发票', reimbursable: '否' })
      ]
    };
  }

  function makeOrder(config) {
    const fees = makeFeeRows(config.customer, config.supplier);
    return {
      id: config.id,
      status: config.status,
      statusTone: config.tone,
      lineId: config.lineId,
      qty: config.qty,
      version: config.version,
      consignmentNo: config.consignmentNo,
      contractNo: config.contract ? config.contract.no : null,
      createdAt: config.createdAt,
      amount: fees.receivable.reduce((sum, line) => sum + line.amount, 0),
      transportDate: config.transportDate,
      remark: config.remark,
      organization: {
        salesperson: '黄瑞钰',
        department: '数字化中心',
        accountingGroup: '数字化中心',
        company: '厦门建发生生物流有限公司',
        operatingUnit: '供应链物流科技'
      },
      basic: {
        status: config.status,
        customer: config.customer,
        settlementHeader: config.customer,
        contact: '清清',
        phone: '15766665555',
        email: 'contact@example.com',
        businessType: '出口',
        businessDate: '2026-10-29',
        projectNo: '20250303001',
        tradeTerms: 'CIF',
        serviceScope: '运输、报关',
        remark: config.remark
      },
      transport: {
        mode: 'water',
        type: '水运',
        shippingType: '国际航运',
        cargoCategory: '集装箱',
        packingMethod: '整箱运输（FCL）',
        bookingMode: '船公司箱（COC）',
        solicitationMode: '自揽货',
        agent: '厦门外代',
        agentCode: 'AG-XM-02',
        agentSalesperson: '林海',
        receivingPlace: '青岛绿洲园一号仓',
        receivingRegion: '亚洲/中国/山东省/青岛市',
        receivingAddress: '青岛市黄岛区疏港路 88 号',
        originPort: '青岛港',
        originRegion: '亚洲/中国/山东省/青岛市',
        originTerms: 'CY',
        originTerminal: '前湾港区',
        destinationPort: '胡志明港',
        destinationRegion: '亚洲/越南/胡志明市',
        destinationTerms: 'CY',
        destinationTerminal: 'Cat Lai',
        deliveryPlace: '胡志明市客户仓',
        deliveryRegion: '亚洲/越南/胡志明市',
        deliveryAddress: 'Thu Duc District, Ho Chi Minh City',
        specialRequirements: config.remark
      },
      products: [{
        name: config.productName || '脱皮花生仁',
        description: '食品级出口包装，托盘承载',
        pieces: 2400,
        pieceUnit: '袋',
        grossWeight: config.qty,
        grossUnit: '吨',
        volume: Number(config.qty || 0) * 1.8,
        volumeUnit: '立方米',
        quantity: config.qty,
        unit: '吨',
        price: 11400,
        total: Number(config.qty || 0) * 11400,
        currency: 'CNY',
        tradeContractNo: 'FGQXE260721CD-2',
        tradeContractType: '销售合同',
        englishName: 'Blanched Peanut Kernels'
      }],
      containers: [
        { type: '40HQ', qty: 6, no: 'TCLU1234567', remark: '食品级集装箱' },
        { type: '40HQ', qty: 4, no: 'TCLU7654321', remark: '温控要求 25℃以下' }
      ],
      parties: {
        shipper: '青岛绿洲园花生食品有限公司',
        shipperInfo: '山东省青岛市黄岛区疏港路 88 号；联系人：清清；电话：15766665555',
        consignee: 'ZEENNI STEEL CO., LTD.',
        consigneeInfo: 'Thu Duc District, Ho Chi Minh City；联系人：Tran Minh；电话：+84 28 1234 5678',
        notifier: '厦门建发生生物流有限公司',
        notifierInfo: '福建省厦门市思明区仙岳路 155 号；联系人：苏丽蓉；电话：13800000000'
      },
      businessReceivable: fees.receivable,
      businessPayable: fees.payable,
      attachments: [
        { name: '订舱确认单.pdf', type: 'PDF', size: '820 KB' },
        { name: '装箱照片.zip', type: 'ZIP', size: '4.8 MB' }
      ],
      system: {
        createdBy: '苏丽蓉',
        createdAt: '2026-10-29 08:54:36',
        updatedBy: '菜菜菜',
        updatedAt: '2026-10-29 08:54:37'
      },
      contract: config.contract,
      logisticsDemands: config.logisticsDemands || [],
      feedbacks: config.feedbacks || []
    };
  }

  const bookingFeedback = {
    id: 'FB20261030001',
    type: '订舱信息',
    taskNo: 'FLST202609040056',
    status: '已提交',
    statusTone: 'running',
    submitter: '苏丽蓉',
    submittedAt: '2026-10-29 13:20',
    summary: '订舱单已提交，等待船东确认放舱',
    fields: [
      ['订舱单号', 'DCD202609140023'], ['订舱协议号', 'BK-2026-1001'],
      ['合同抬头', '建发钢铁国际贸易有限公司'], ['委托方经营单位', '昌富利（厦门）'],
      ['委托方核算组', '钢材一部'], ['委托方业务员', '李杰'], ['委托方单证员', '郭诗煌'],
      ['客户', 'ZEENNI STEEL'], ['工厂', 'HUI CHUANG HK GR'], ['邮件接收人', '郭诗煌、李杰、葛美燕'],
      ['贸易类型', '转口'], ['结算方式', '电汇'], ['收证情况', '否'], ['开证情况', '--'],
      ['是否控单业务', '否'], ['预付收款情况', '4.42%'], ['贷前收款比例', '4.429%'],
      ['是否我司派船', '是'], ['销售合同号', 'FGQXE260721CD-2'], ['采购合同号', 'HC26CD018'],
      ['销售价格条款', 'CIF'], ['采购价格条款', 'FOB'], ['对内交货期', '2026-08-31'],
      ['合同数量', '835.00 吨'], ['品名', '彩涂钢卷'], ['装配类型', '30件杂货'],
      ['增减幅度', '-10,10'], ['最迟装运期', '2026-09-30'], ['修改后最迟装运期', '2026-10-08'],
      ['船龄要求', '25 年'], ['船证要求', '暂无'], ['卸货条款', 'FO'], ['是否直航', '否'],
      ['实际起运港', 'TIANJIN'], ['装港码头', '无特殊要求'], ['实际目的港', 'TARTOUS'],
      ['卸港码头', '无特殊要求'], ['卷重', '0-8'], ['长度（型材）', '0'],
      ['其他特殊需求', '船舶提单可接受 2 次修改'], ['订舱货代', '中远海运物流'],
      ['地面货代', '天津港物流'], ['装港代理', '天津外代'], ['卸港代理', 'Tartous Agency'],
      ['分类', '钢材'], ['询价方式', '邮件询价'], ['订舱经理', '陈经理'], ['订舱操作员', '王操作'],
      ['受托方经营单位', '厦门建发物流有限公司'], ['受托方核算组', '航运一部'],
      ['订舱状态', '未订舱'], ['状态', '已提交'], ['订舱数量', '835.00 吨'],
      ['未订舱数量', '835 吨'], ['出仓数量', '0'], ['装船数量', '0'],
      ['港区', '天津港北疆港区'], ['航线名称', '地中海'], ['laycan', '2026-09-25 至 2026-09-30'],
      ['修改后 LAYCAN', '2026-10-01 至 2026-10-08'], ['装率', '--'], ['卸率', '--'],
      ['层高', '--'], ['是否含绑', '是'], ['附加条款', '无'], ['备注', '等待船东确认'],
      ['船名', 'MSC ANNA'], ['船只 IMO', 'IMO 9876543'], ['MMSI', '413705390'],
      ['宣船情况', '已宣船'], ['宣船信息', '船名与航次已确认'], ['动态跟踪', '已接入'],
      ['订单跟踪记录', '已提交订舱'], ['船舶动态更新时间', '2026-10-29 13:10'],
      ['到装港时间', '2026-09-27 08:00'], ['离装港时间', '--'], ['靠泊时间', '--'],
      ['等泊时间（天）', '--'], ['预计超期/超期时间（天）', '--'],
      ['ETA', '2026-10-18 12:00'], ['ETB', '2026-10-18 08:00'],
      ['ETD', '2026-10-18 20:00'], ['ATA', '--'], ['ATB', '--'], ['是否离港', '否'],
      ['运费', '79.00'], ['运费条款', 'FOB'], ['运费总价', 'CNY 65,965.00'],
      ['净运费', 'CNY 60,000.00'], ['运费账期', '30 天'], ['其他费用', '--'],
      ['滞期费', '--'], ['佣金比例', '1.00%'], ['佣金金额', 'CNY 659.65'],
      ['运费发票', '--'], ['是否 COD', '否'], ['运费测算单价', '79.00'],
      ['港杂预估单价', '--']
    ]
  };

  const billFeedback = {
    id: 'FB20261030002',
    type: '提单信息',
    taskNo: 'FLST202609040056',
    status: '已提交',
    statusTone: 'done',
    submitter: '苏丽蓉',
    submittedAt: '2026-10-29 15:10',
    summary: '主提单已登记，附件已上传',
    fields: [
      ['提单号', 'COSU6349281720'], ['船东（船公司名称）', '中远海运集装箱运输有限公司'],
      ['附件', '主提单.pdf'], ['登记人', '苏丽蓉'], ['登记时间', '2026-10-29 15:10']
    ]
  };

  const containerFeedback = {
    id: 'FB20261030003',
    type: '集装箱跟踪',
    taskNo: 'FLST202609040056',
    status: '执行中',
    statusTone: 'pending',
    submitter: '王操作',
    submittedAt: '2026-10-29 16:22',
    summary: '首批 6 个集装箱已装柜，等待进港',
    fields: [
      ['任务运输号', 'FLST202609040056'], ['任务状态', '执行中'],
      ['任务商品', '脱皮花生仁 60 吨'], ['箱型', '40HQ'],
      ['箱号', 'TCLU1234567 / TCLU7654321'], ['铅封号', 'SEAL0001 / SEAL0002'],
      ['船东', '中远海运'], ['船名/航次', 'MSC ANNA / V.102E'],
      ['当前节点', '已装柜'], ['作业时间', '2026-10-29 16:20'],
      ['装箱总件数', '2400 袋'], ['装箱总毛重', '60 吨'],
      ['装箱总体积', '108 立方米'], ['装箱总标准数量', '60 吨']
    ]
  };

  const orderTemplate = [
    makeOrder({
      id: 'FCO202610280021',
      status: '已安排',
      tone: 'done',
      lineId: 'L1',
      qty: 60,
      version: 'V2',
      consignmentNo: '2102957467694845952',
      createdAt: '2026-10-28 10:02',
      transportDate: '2026-11-03',
      remark: '客户要求装运前提供装柜照片。',
      customer: '青岛绿洲园花生食品有限公司',
      supplier: '中远海运集装箱运输有限公司',
      contract: {
        no: 'HT2026-0821',
        version: 'V2',
        status: '已生效',
        signingMethod: '电子签约',
        attachments: [
          { name: 'HT2026-0821_签署版.pdf', type: 'PDF', size: '1.2 MB' },
          { name: '合同附件_费率表.xlsx', type: 'XLSX', size: '56 KB' }
        ]
      },
      logisticsDemands: [
        {
          no: 'LD202610300021', status: '执行中', tone: 'running',
          serviceScope: '运输、报关', transportType: '水运', origin: '青岛港', destination: '胡志明港',
          qty: '60 吨', planDate: '2026-11-03',
          delegations: [
            { no: 'FLMT202610300018', name: '青岛—胡志明海运委托', version: 'V1', status: '执行中', tone: 'running', supplier: '中远海运集装箱运输有限公司', taskCount: 3, taskTypes: ['汽运', '水运', '汽运'] },
            { no: 'FLMT202610300022', name: '青岛港报关委托', version: 'V1', status: '待接单', tone: 'pending', supplier: '青岛港国际物流有限公司', taskCount: 1, taskTypes: ['报关'] }
          ]
        },
        {
          no: 'LD202610300024', status: '待安排', tone: 'pending',
          serviceScope: '仓储', transportType: '水运', origin: '青岛绿洲园一号仓', destination: '青岛港',
          qty: '10 吨', planDate: '2026-11-05',
          delegations: []
        }
      ],
      feedbacks: [bookingFeedback, billFeedback, containerFeedback]
    }),
    makeOrder({
      id: 'FCO202610280036',
      status: '待安排',
      tone: 'pending',
      lineId: 'L1',
      qty: 50,
      version: 'V3',
      consignmentNo: '2102957467694845988',
      createdAt: '2026-10-28 14:20',
      transportDate: '2026-11-05',
      remark: '等待客户确认船期。',
      customer: '青岛绿洲园花生食品有限公司',
      supplier: '东方海外物流（中国）有限公司',
      contract: {
        no: 'HT2026-0903',
        version: 'V1',
        status: '待生效',
        signingMethod: '线下签署',
        attachments: [{ name: 'HT2026-0903_待签版.pdf', type: 'PDF', size: '980 KB' }]
      },
      logisticsDemands: [{
        no: 'LD202610300027', status: '待安排', tone: 'pending',
        serviceScope: '运输、报关', transportType: '水运', origin: '青岛港', destination: '胡志明港',
        qty: '50 吨', planDate: '2026-11-05',
        delegations: [
          { no: 'FLMT202610300023', name: '东方海外订舱委托', version: 'V1', status: '待接单', tone: 'pending', supplier: '东方海外物流（中国）有限公司', taskCount: 2, taskTypes: ['水运', '报关'] }
        ]
      }],
      feedbacks: [Object.assign({}, billFeedback, {
        id: 'FB20261030004',
        taskNo: 'FLST202609050103',
        submittedAt: '2026-10-29 17:10',
        summary: '提单草稿已登记'
      })]
    }),
    makeOrder({
      id: 'FCO202610280041',
      status: '已安排',
      tone: 'done',
      lineId: 'L2',
      qty: 16,
      version: 'V3',
      consignmentNo: '2102957467694846126',
      createdAt: '2026-10-28 15:08',
      transportDate: '2026-11-06',
      remark: '钢桶回收由客户负责。',
      customer: '青岛绿洲园花生食品有限公司',
      supplier: '青岛港国际物流有限公司',
      contract: null,
      feedbacks: []
    })
  ];

  const demand = {
    no: demandNo,
    customer: '青岛绿洲园花生食品有限公司',
    customerType: '外部客户',
    demandScene: '采购/移仓',
    contactName: '王晓琳',
    contactPhone: '138 5320 7618',
    ourCompany: '厦门建发物流有限公司',
    contactEmail: 'wangxl@example.com',
    contactEmailRecipients: [
      { name: '王晓琳', email: 'wangxl@example.com' },
      { name: '苏丽蓉', email: 'sulirong@example.com' }
    ],
    businessDate: '2026-10-28',
    serviceScopes: ['运输', '仓储', '报关'],
    serviceItems: ['水运'],
    shippingCategories: ['件杂'],
    tradeTerms: 'FOB',
    origin: '青岛港',
    destination: '胡志明港',
    pickupDate: '2026-11-03',
    deliveryDate: '2026-11-18',
    serviceRequirement: '全程温控不高于 25℃，使用食品级托盘；报关资料需在装运前 2 个工作日提交审核。',
    transportRequirement: {
      originPort: '青岛港',
      originRegion: '中国 / 山东省 / 青岛市',
      originContact: '张伟',
      originContactPhone: '+86 532 8888 1024',
      originTerminal: '青岛前湾集装箱码头',
      destinationPort: '胡志明港',
      destinationRegion: '越南 / 胡志明市',
      destinationContact: 'Tran Minh',
      destinationContactPhone: '+84 28 1234 5678',
      destinationTerminal: '胡志明吉莱港',
      latestShipmentDate: '2026-11-10',
      dischargeTerms: 'FO',
      directSailing: '是',
      vesselCertificateRequirement: '船级社证书、ISM/ISPS 证书有效',
      vesselAgeRequirement: '25 年以内',
      commissionRate: 2.5
    },
    receiveOrg: {
      salesperson: '苏丽蓉',
      department: '供应链物流综合部',
      businessUnit: '供应链物流科技',
      accountingGroup: '供应链物流综合核算组',
      salesmanCompany: '厦门建发物流有限公司',
    },
    contract: {
      signingMethod: 'E建签签约',
      bodyType: '系统自动生成',
      autoOriginalRecovery: '--',
      tradeMode: '跨境',
      tradeTerms: 'FOB'
    },
    insurance: {
      exempt: '否',
      policyholder: '委托方（我司）',
      method: '控制塔自动投保',
      company: '中国太平洋财产保险股份有限公司',
      deductible: '否',
      mainRisk: '一切险',
      additionalRisk: '战争险',
      changeDestination: '否'
    },
    source: {
      type: '原始需求',
      system: '股份控制塔',
      no: 'LSR202610280018',
      receiver: '苏丽蓉',
      receivedAt: '2026-10-28 09:32',
      rejector: '李四',
      rejectedAt: '2026-10-27 16:08',
      rejectionReason: '客户联系人信息不完整',
      attachments: [
        { name: '服务要求.pdf', type: 'PDF', size: '1.4 MB' },
        { name: '装柜要求.docx', type: 'DOCX', size: '280 KB' },
        { name: '报关资料清单.xlsx', type: 'XLSX', size: '74 KB' }
      ]
    },
    status: 'received',
    currentVersion: 'V3',
    system: {
      createdBy: demandCreator,
      createdAt: '2026-10-27 14:52:08',
      updatedBy: '菜菜菜',
      updatedAt: '2026-10-29 08:54:37'
    },
    lines: [
      { id: 'L1', no: 1, tradeContractNo: 'HT2026-0821', tradeContractType: '销售合同', name: '脱皮花生仁', nameEn: 'Blanched Peanut Kernels', description: '食品级出口包装，托盘承载', spec: '650 × 450 × 180 mm', specDimensions: '650 × 450 × 180 mm', unit: '吨', required: 100, pieceWeight: 25, pieceWeightUnit: 'kg', overRate: 3, underRate: 2, goodsValueUnitPrice: 6200, goodsValueAmount: 620000, goodsValueCurrency: 'CNY', packageQuantity: 4000, packageUnit: '袋' },
      { id: 'L2', no: 2, tradeContractNo: 'HT2026-0903', tradeContractType: '销售合同', name: '一级压榨花生油', nameEn: 'First-grade Pressed Peanut Oil', description: '200L 食品级钢桶，托盘承载', spec: '桶装 200L', specDimensions: '桶装 200L', unit: '吨', required: 24, pieceWeight: 180, pieceWeightUnit: 'kg', overRate: 1, underRate: 1, goodsValueUnitPrice: 11800, goodsValueAmount: 283200, goodsValueCurrency: 'CNY', packageQuantity: 134, packageUnit: '桶' }
    ],
    versions: [
      { version: 'V1', type: '首次提交', changeNo: '--', status: 'rejected', submittedAt: '2026-10-27 15:10', handledBy: '李四', effectiveAt: '--', reason: '客户联系人信息不完整', snapshot: { quantities: { L1: 100, L2: 24 }, pickupDate: '2026-11-03' } },
      { version: 'V2', type: '重新提交', changeNo: '--', status: 'received', submittedAt: '2026-10-28 09:20', handledBy: '苏丽蓉', effectiveAt: '2026-10-28 09:32', reason: '补齐联系人信息后重新提交', snapshot: { quantities: { L1: 100, L2: 24 }, pickupDate: '2026-11-03' } },
      { version: 'V3', type: '需求修改', changeNo: 'M20261028001', status: 'received', submittedAt: '2026-10-28 13:06', handledBy: '苏丽蓉', effectiveAt: '2026-10-28 13:18', reason: '调整计划提货日期与包装要求', snapshot: { quantities: { L1: 100, L2: 24 }, pickupDate: '2026-11-03' } }
    ],
    booking: {
      salesContractNo: 'FGQXE260721CD-2',
      purchaseContractNo: 'HC26CD018',
      contractHeader: '建发钢铁国际贸易有限公司',
      customer: 'ZEENNI STEEL',
      factory: 'HUI CHUANG HK GR',
      tradeType: '转口',
      salesPriceTerm: 'CIF',
      purchasePriceTerm: 'FOB',
      externalDeliveryDate: '2026-11-18',
      directSailing: '是',
      latestShipmentDate: '2026-11-10',
      dischargeTerms: 'FO',
      freightEstimate: '650',
      portChargeEstimate: '120',
      vesselAgeRequirement: '25 年以内',
      vesselTypeRequirement: '集装箱船',
      coilWeight: '0-8',
      length: '0',
      clientDocumentOfficer: '苏丽蓉'
    },
    quote: {
      version: 'Q4',
      lines: [
        { id: 'Q1', feeItem: '海运费', direction: '应收', taxRate: 9, quotePrice: 620, currency: 'CNY', quantity: 100, unit: '吨', quoteAmount: 62000, exchangeRate: 1, localAmount: 62000, source: '客户要求价', remark: '含燃油附加费' },
        { id: 'Q2', feeItem: '港杂费', direction: '应收', taxRate: 6, quotePrice: 3200, currency: 'CNY', quantity: 10, unit: '箱', quoteAmount: 32000, exchangeRate: 1, localAmount: 32000, source: '内部报价', remark: '含码头操作费' },
        { id: 'Q3', feeItem: '报关代理费', direction: '应收', taxRate: 6, quotePrice: 1800, currency: 'CNY', quantity: 2, unit: '票', quoteAmount: 3600, exchangeRate: 1, localAmount: 3600, source: '历史价', remark: '按票计费' },
        { id: 'Q4', feeItem: '海运费', direction: '应付', taxRate: 9, quotePrice: 470, currency: 'CNY', quantity: 100, unit: '吨', quoteAmount: 47000, exchangeRate: 1, localAmount: 47000, source: '供应商报价', remark: '船公司采购价' },
        { id: 'Q5', feeItem: '港杂费', direction: '应付', taxRate: 6, quotePrice: 2350, currency: 'CNY', quantity: 10, unit: '箱', quoteAmount: 23500, exchangeRate: 1, localAmount: 23500, source: '供应商报价', remark: '码头操作成本' },
        { id: 'Q6', feeItem: '报关代理费', direction: '应付', taxRate: 6, quotePrice: 1200, currency: 'CNY', quantity: 2, unit: '票', quoteAmount: 2400, exchangeRate: 1, localAmount: 2400, source: '供应商报价', remark: '按票计费' }
      ]
    },    orders: orderTemplate,
    executionFees: [
      { id: 'EF202610300001', orderId: 'FCO202610280021', logisticsDemandNo: 'LD202610300021', direction: '应收', feeItem: '海运费', party: '青岛绿洲园花生食品有限公司', unitPrice: 620, quantity: 60, unit: '吨', currency: 'CNY', originalAmount: 37200, exchangeRate: 1, localAmount: 37200, commissionRate: 2.5, commissionAmount: 930, status: '已确认' },
      { id: 'EF202610300002', orderId: 'FCO202610280021', logisticsDemandNo: 'LD202610300021', direction: '应付', feeItem: '海运费', party: '中远海运集装箱运输有限公司', unitPrice: 470, quantity: 60, unit: '吨', currency: 'CNY', originalAmount: 28200, exchangeRate: 1, localAmount: 28200, commissionRate: 2, commissionAmount: 564, status: '已确认' },
      { id: 'EF202610300003', orderId: 'FCO202610280036', logisticsDemandNo: 'LD202610300027', direction: '应收', feeItem: '港杂费', party: '青岛绿洲园花生食品有限公司', unitPrice: 3200, quantity: 10, unit: '箱', currency: 'CNY', originalAmount: 32000, exchangeRate: 1, localAmount: 32000, commissionRate: 1.5, commissionAmount: 480, status: '待确认' },
      { id: 'EF202610300004', orderId: 'FCO202610280036', logisticsDemandNo: 'LD202610300027', direction: '应付', feeItem: '港杂费', party: '东方海外物流（中国）有限公司', unitPrice: 2350, quantity: 10, unit: '箱', currency: 'CNY', originalAmount: 23500, exchangeRate: 1, localAmount: 23500, commissionRate: 1.2, commissionAmount: 282, status: '待确认' }
    ],
    reconciliations: [
      { no: 'DZ202610300001', sourceFeeId: 'EF202610300001', orderId: 'FCO202610280021', party: '青岛绿洲园花生食品有限公司', period: '2026-10', completedAt: '2026-10-30', amount: 37200, difference: 0, currency: 'CNY', status: '已对账', tone: 'done' },
      { no: 'DZ202610300002', sourceFeeId: 'EF202610300002', orderId: 'FCO202610280021', party: '中远海运集装箱运输有限公司', period: '2026-10', completedAt: '2026-10-31', amount: 28000, difference: -200, currency: 'CNY', status: '有差异', tone: 'exception' }
    ],
    invoices: [
      { no: 'FP202610300001', invoiceNo: '044001900111', sourceReconciliationNo: 'DZ202610300001', orderId: 'FCO202610280021', date: '2026-10-30', amount: 37200, tax: 3072.66, currency: 'CNY', status: '已开票', tone: 'done' },
      { no: 'FP202610300002', invoiceNo: '--', sourceReconciliationNo: 'DZ202610300002', orderId: 'FCO202610280021', date: '--', amount: 28000, tax: 2311.93, currency: 'CNY', status: '待开票', tone: 'pending' }
    ],
    payments: [
      { no: 'SL202610300001', direction: '收款', party: '青岛绿洲园花生食品有限公司', invoiceNo: '044001900111', reconciliationNo: 'DZ202610300001', amount: 20000, currency: 'CNY', method: '电汇', planDate: '2026-11-05', actualDate: '2026-10-30', status: '部分收款', tone: 'pending' },
      { no: 'FK202610300001', direction: '付款', party: '中远海运集装箱运输有限公司', invoiceNo: '--', reconciliationNo: 'DZ202610300002', amount: 28000, currency: 'CNY', method: '电汇', planDate: '2026-11-10', actualDate: '--', status: '待付款', tone: 'pending' }
    ],
    timeline: [
      { time: '2026-10-27 15:10', title: '首次提交', text: '来源服务要求 V1 推送至 4PL，生成客户需求单。' },
      { time: '2026-10-27 16:08', title: 'V1 已拒绝', text: '李四拒绝：客户联系人信息不完整。' },
      { time: '2026-10-28 09:20', title: 'V2 重新提交', text: '同一客户需求单号下生成新版本，原 V1 保持已拒绝。' },
      { time: '2026-10-28 09:32', title: 'V2 已接收', text: '苏丽蓉接收 V2，版本即时生效。' },
      { time: '2026-10-28 13:18', title: 'V3 已接收', text: '修改单 M20261028001 接收后生成当前有效版本 V3。' },
      { time: '2026-10-29 13:20', title: '新增订单反馈', text: '任务跟踪新增订舱信息反馈，等待船东确认。' }
    ]
  };

  const dialog = $('actionDialog');
  let financeLoadingDone = false;
  let orderTableLoadingDone = false;

  function applyStatusVariant() {
    const versionsTemplate = JSON.parse(JSON.stringify(demand.versions));
    const ordersTemplate = JSON.parse(JSON.stringify(demand.orders));
    const firstVersion = versionsTemplate[0];
    const firstSnapshot = JSON.parse(JSON.stringify(firstVersion.snapshot));

    if (requestedStatus === 'created') {
      demand.status = 'created';
      demand.currentVersion = 'V1';
      demand.receiveOrg = {};
      demand.ourCompany = '';
      demand.source = {
        type: '手工创建',
        system: '4PL控制塔',
        no: '--',
        version: 'V1',
        receiver: '--',
        receivedAt: '--',
        rejector: '--',
        rejectedAt: '--',
        rejectionReason: '--',
        attachments: []
      };
      demand.orders = [];
      demand.executionFees = [];
      demand.reconciliations = [];
      demand.invoices = [];
      demand.payments = [];
      demand.versions = [{
        version: 'V1',
        type: '创建',
        changeNo: '--',
        status: 'created',
        submittedAt: '2026-10-27 14:52',
        handledBy: '--',
        effectiveAt: '--',
        reason: '客户需求已创建，等待提交',
        snapshot: firstSnapshot
      }];
      demand.timeline = [{ time: '2026-10-27 14:52', title: '需求已创建', text: '手工创建客户需求，尚未提交。' }];
    } else if (requestedStatus === 'pending') {
      demand.status = 'pending';
      demand.currentVersion = 'V1';
      demand.orders = [];
      demand.executionFees = [];
      demand.reconciliations = [];
      demand.invoices = [];
      demand.payments = [];
      demand.versions = [{
        version: 'V1',
        type: '首次提交',
        changeNo: '--',
        status: 'pending',
        submittedAt: '2026-10-28 09:20',
        handledBy: '--',
        effectiveAt: '--',
        reason: '来源服务要求首次提交',
        snapshot: firstSnapshot
      }];
      demand.timeline = [
        { time: '2026-10-27 14:52', title: '需求已创建', text: '客户需求单由服务要求生成。' },
        { time: '2026-10-28 09:20', title: 'V1 已提交', text: '客户需求进入待接收状态。' }
      ];
    } else if (requestedStatus === 'received') {
      demand.status = 'received';
      demand.currentVersion = 'V3';
      demand.versions = versionsTemplate.filter((version) => version.status !== 'pending');
      demand.timeline = demand.timeline.filter((item) => item.title !== 'V4 待接收');
    } else if (requestedStatus === 'rejected') {
      demand.status = 'rejected';
      demand.currentVersion = 'V1';
      demand.orders = [];
      demand.executionFees = [];
      demand.reconciliations = [];
      demand.invoices = [];
      demand.payments = [];
      demand.versions = [{
        version: 'V1',
        type: '首次提交',
        changeNo: '--',
        status: 'rejected',
        submittedAt: '2026-10-27 15:10',
        handledBy: '李四',
        effectiveAt: '--',
        reason: '客户联系人信息不完整',
        snapshot: firstSnapshot
      }];
      demand.timeline = [
        { time: '2026-10-27 14:52', title: '需求已创建', text: '客户需求单由服务要求生成。' },
        { time: '2026-10-27 15:10', title: 'V1 已提交', text: '客户需求进入待接收状态。' },
        { time: '2026-10-27 16:08', title: 'V1 已拒绝', text: '李四拒绝：客户联系人信息不完整。' }
      ];
    } else if (requestedStatus === 'completed') {
      demand.status = 'completed';
      demand.currentVersion = 'V4';
      demand.orders = ordersTemplate;
      const v4 = versionsTemplate.find((version) => version.version === 'V4');
      v4.status = 'received';
      v4.handledBy = '苏丽蓉';
      v4.effectiveAt = '2026-10-29 10:05';
      demand.pickupDate = v4.snapshot.pickupDate;
      demand.lines.forEach((line) => {
        line.required = Number(v4.snapshot.quantities[line.id] || line.required);
      });
      demand.versions = versionsTemplate;
      demand.timeline = demand.timeline.filter((item) => item.title !== 'V4 待接收');
      demand.timeline.push({ time: '2026-10-29 10:05', title: 'V4 已接收', text: '苏丽蓉接收 V4，版本即时生效。' });
      demand.timeline.push({ time: '2026-10-30 16:20', title: '客户需求已完成', text: '客户需求已人工完成，后续版本和订单只读。' });
    } else if (requestedStatus === 'voided') {
      demand.status = 'voided';
      demand.currentVersion = firstVersion.version;
      demand.orders = [];
      demand.executionFees = [];
      demand.reconciliations = [];
      demand.invoices = [];
      demand.payments = [];
      demand.versions = [{
        version: firstVersion.version,
        type: firstVersion.type,
        changeNo: firstVersion.changeNo,
        status: firstVersion.status,
        submittedAt: firstVersion.submittedAt,
        handledBy: firstVersion.handledBy,
        effectiveAt: firstVersion.effectiveAt,
        reason: firstVersion.reason,
        snapshot: firstSnapshot
      }];
      demand.timeline = [
        { time: '2026-10-27 14:52', title: '需求已创建', text: '客户需求单由服务要求生成。' },
        { time: '2026-10-27 16:08', title: 'V1 已拒绝', text: '李四拒绝：客户联系人信息不完整。' },
        { time: '2026-10-29 15:20', title: '客户需求已关闭', text: '苏丽蓉关闭客户需求：客户取消本次服务要求。' }
      ];
    }
  }

  applyStatusVariant();

  if (versionMaintenanceMode) {
    try {
      const storedDraft = sessionStorage.getItem('customer-demand-version-maintenance-draft');
      if (storedDraft) Object.assign(demand, JSON.parse(storedDraft));
      demand.status = 'created';
    } catch (error) {
      console.warn('Unable to restore version maintenance draft', error);
    }
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
    return demand.orders
      .filter((order) => order.lineId === lineId && order.status !== '已取消')
      .reduce((sum, order) => sum + Number(order.qty || 0), 0);
  }

  function lineMetrics() {
    return demand.lines.map((line) => {
      const arranged = arrangedFor(line.id);
      return Object.assign({}, line, {
        arranged,
        remaining: Math.max(line.required - arranged, 0),
        over: Math.max(arranged - line.required, 0)
      });
    });
  }

  function progressText() {
    if (demand.orders.length === 0) return '未生成';
    const metrics = lineMetrics();
    const overLines = metrics.filter((line) => line.over > 0).length;
    const complete = metrics.every((line) => line.arranged >= line.required);
    return (complete ? '已全部生成' : '部分生成') + (overLines ? ' · ' + overLines + ' 行超额' : '');
  }

  function lineStatus(metric) {
    if (metric.arranged === 0) return { label: '未安排', tone: 'closed' };
    if (metric.over > 0) return { label: '超额安排', tone: 'exception' };
    if (metric.arranged >= metric.required) return { label: '已全部安排', tone: 'done' };
    return { label: '部分安排', tone: 'pending' };
  }

  function tagMarkup(values) {
    const items = (values || []).filter(Boolean);
    return items.length
      ? '<span class="demand-tag-list">' + items.map((item) => '<span class="demand-tag">' + esc(item) + '</span>').join('') + '</span>'
      : '--';
  }

  function statusTag(label, tone) {
    return '<span class="status ' + esc(tone || 'closed') + '">' + esc(label) + '</span>';
  }

  function setText(id, value) {
    const node = $(id);
    if (node) node.textContent = value == null || value === '' ? '--' : value;
  }

  function renderSource() {
    const source = demand.source;
    setText('sourceSystemValue', source.system);
    setText('sourceTypeValue', source.type);
    setText('sourceNumberValue', source.no);
    setText('headerSourceSystemValue', source.system);
    setText('headerSourceTypeValue', source.type);
    setText('headerSourceNoValue', source.no);
    setText('overviewStatus', statusLabels[demand.status]);
    const isRejected = demand.status === 'rejected';
    const handler = isRejected ? source.rejector : source.receiver;
    const handledAt = isRejected ? source.rejectedAt : source.receivedAt;
    setText('sourceHandlerLabel', isRejected ? '拒绝人' : '接收人');
    setText('sourceHandledAtLabel', isRejected ? '拒绝时间' : '接收时间');
    setText('overviewHandledBy', handler || '--');
    setText('overviewHandledAt', handledAt || '--');
    const rejectionText = isRejected
      ? (source.rejectedAt || '--') + ' 被拒绝：' + (source.rejectionReason || '未填写拒绝原因')
      : '暂无拒绝记录';
    setText('rejectionRecord', rejectionText);
    if ($('rejectionRecord')) $('rejectionRecord').title = rejectionText;
    $('sourceAttachmentList').innerHTML = (source.attachments || []).length
      ? source.attachments.map((item) => attachmentButton(item, 'is-compact')).join('')
      : '<span class="demand-muted">暂无附件</span>';
  }

  function bookingExtensionContent(booking) {
    const value = (item) => item == null || item === '' ? '--' : String(item);
    return [
      '销售合同号：' + value(booking.salesContractNo),
      '采购合同号：' + value(booking.purchaseContractNo),
      '合同抬头：' + value(booking.contractHeader),
      '客户：' + value(booking.customer),
      '贸易供应商：' + value(booking.factory),
      '销售价格条款：' + value(booking.salesPriceTerm),
      '采购价格条款：' + value(booking.purchasePriceTerm),
      '对外交货期：' + value(booking.externalDeliveryDate),
      '卷重：' + value(booking.coilWeight),
      '长度：' + value(booking.length),
      '运费测算单价：¥' + value(booking.freightEstimate) + '/吨',
      '港杂预估单价：¥' + value(booking.portChargeEstimate) + '/吨'
    ].join('\n');
  }

  function renderSystemInfo() {
    const system = demand.system || {};
    const version = currentVersion();
    setText('systemCreatedBy', system.createdBy);
    setText('systemCreatedAt', system.createdAt);
    setText('systemUpdatedBy', system.updatedBy);
    setText('systemUpdatedAt', system.updatedAt);
    setText('systemVersion', demand.currentVersion);
    setText('systemEffectiveAt', version && version.effectiveAt);
  }

  function renderDemandInfoValues() {
    setText('staticCustomerValue', demand.customer);
    const receivedOrg = demand.status === 'pending' ? {} : (demand.receiveOrg || {});
    setText('staticOurCompanyValue', demand.status === 'pending' ? '' : demand.ourCompany);
    setText('receiveOrgSalespersonValue', receivedOrg.salesperson);
    setText('receiveOrgDepartmentValue', receivedOrg.department);
    setText('receiveOrgBusinessUnitValue', receivedOrg.businessUnit);
    setText('receiveOrgAccountingGroupValue', receivedOrg.accountingGroup);
    setText('receiveOrgCompanyValue', receivedOrg.salesmanCompany);
    setText('receiveOrgHint', demand.status === 'pending' ? '接收时录入' : '已由接收人录入');
    const contract = demand.contract || {};
    setText('staticSigningMethodValue', contract.signingMethod);
    setText('staticContractBodyTypeValue', contract.bodyType);
    setText('staticAutoOriginalRecoveryValue', contract.autoOriginalRecovery);
    setText('staticTradeModeValue', contract.tradeMode);
    setText('staticTradeTermsValue', contract.tradeTerms);
    const insurance = demand.insurance || {};
    setText('staticInsuranceExemptValue', insurance.exempt);
    setText('staticPolicyholderValue', insurance.policyholder);
    setText('staticInsuranceMethodValue', insurance.method);
    setText('staticInsuranceCompanyValue', insurance.company);
    setText('staticDeductibleValue', insurance.deductible);
    setText('staticMainRiskValue', insurance.mainRisk);
    setText('staticAdditionalRiskValue', insurance.additionalRisk);
    setText('staticChangeDestinationInsuranceValue', insurance.changeDestination);
    setText('staticCustomerTypeValue', demand.customerType);
    setText('staticContactValue', demand.contactName);
    setText('staticPhoneValue', demand.contactPhone);
    const contactRecipients = Array.isArray(demand.contactEmailRecipients) && demand.contactEmailRecipients.length
      ? demand.contactEmailRecipients
      : (demand.contactEmail ? [{ name: demand.contactName, email: demand.contactEmail }] : []);
    $('staticEmailValue').innerHTML = contactEmailRecipientsMarkup(contactRecipients);
    setText('staticDemandSceneValue', demand.demandScene);
    setText('staticBusinessDateValue', demand.businessDate);
    setText('serviceRequirementValue', demand.serviceRequirement);
    $('staticServiceScopeValue').innerHTML = tagMarkup(demand.serviceScopes);

    const hasTransport = (demand.serviceScopes || []).includes('运输');
    const hasWaterTransport = hasTransport && (demand.serviceItems || []).includes('水运');
    if ($('staticServiceItemsValue')) $('staticServiceItemsValue').innerHTML = hasTransport ? tagMarkup(demand.serviceItems) : '--';
    if ($('staticShippingCategoriesValue')) $('staticShippingCategoriesValue').innerHTML = hasTransport ? tagMarkup(demand.shippingCategories) : '--';

    const transport = demand.transportRequirement || {};
    setText('staticOriginPortValue', transport.originPort);
    setText('staticOriginRegionValue', transport.originRegion);
    setText('staticOriginContactValue', transport.originContact);
    setText('staticOriginContactPhoneValue', transport.originContactPhone);
    setText('staticOriginTerminalValue', transport.originTerminal);
    setText('staticDestinationPortValue', transport.destinationPort);
    setText('staticDestinationRegionValue', transport.destinationRegion);
    setText('staticDestinationContactValue', transport.destinationContact);
    setText('staticDestinationContactPhoneValue', transport.destinationContactPhone);
    setText('staticDestinationTerminalValue', transport.destinationTerminal);
    setText('staticLatestShipmentValue', transport.latestShipmentDate);
    setText('staticDischargeTermsValue', transport.dischargeTerms);
    setText('staticDirectSailingValue', transport.directSailing);
    setText('staticVesselCertificateValue', transport.vesselCertificateRequirement);
    setText('staticTransportVesselAgeValue', transport.vesselAgeRequirement);
    setText('staticCommissionRateValue', transport.commissionRate == null ? '--' : transport.commissionRate + '%');
    const showWaterBulk = hasWaterTransport && (demand.shippingCategories || []).includes('件杂');
    if ($('staticBookingExtensionSection')) $('staticBookingExtensionSection').hidden = false;
    if ($('staticWaterTransportFields')) $('staticWaterTransportFields').hidden = !showWaterBulk;

    const booking = demand.booking || {};
    if ($('bookingExtensionTextDisplay')) $('bookingExtensionTextDisplay').value = booking.text || bookingExtensionContent(booking);
  }
  function renderOverviewLines() {
    $('overviewLineBody').innerHTML = demand.lines.length
      ? demand.lines.map((line) =>
        '<tr><td>' + line.no + '</td>' +
        '<td><span class="truncate-cell" title="' + esc(line.tradeContractNo) + '">' + esc(line.tradeContractNo) + '</span></td>' +
        '<td>' + esc(line.tradeContractType) + '</td><td><strong>' + esc(line.name) + '</strong></td>' +
        '<td><span class="truncate-cell" title="' + esc(line.description) + '">' + esc(line.description) + '</span></td>' +
        '<td class="num">' + line.required + '</td><td>' + esc(line.unit) + '</td>' +
        '<td class="num">' + line.pieceWeight + '</td><td>' + esc(line.pieceWeightUnit) + '</td>' +
        '<td><span class="truncate-cell" title="' + esc(line.specDimensions || line.spec) + '">' + esc(line.specDimensions || line.spec) + '</span></td>' +
        '<td class="num">' + line.overRate + '%</td><td class="num">' + line.underRate + '%</td>' +
        '<td class="num">' + (line.goodsValueUnitPrice == null ? '--' : amountText(line.goodsValueUnitPrice)) + '</td>' +
        '<td class="num">' + (line.goodsValueAmount == null ? '--' : amountText(line.goodsValueAmount)) + '</td>' +
        '<td>' + esc(line.goodsValueCurrency || '--') + '</td>' +
        '<td class="num">' + (line.packageQuantity == null ? '--' : line.packageQuantity) + '</td>' +
        '<td>' + esc(line.packageUnit || '--') + '</td>' +
        '<td><span class="truncate-cell" title="' + esc(line.nameEn || '') + '">' + esc(line.nameEn || '--') + '</span></td></tr>'
      ).join('')
      : emptyRow(18, '暂无需求商品');
  }

  function renderProgress() {
    const metrics = lineMetrics();
    const overLines = metrics.filter((line) => line.over > 0).length;

    $('progressLineBody').innerHTML = metrics.map((line) => {
      const lineState = lineStatus(line);
      return '<tr><td>' + line.no + '</td><td><strong>' + esc(line.name) + '</strong></td><td>' + esc(line.unit) + '</td>' +
        '<td class="num">' + line.required + '</td><td class="num">' + line.arranged + '</td>' +
        '<td class="num">' + line.remaining + '</td><td class="num ' + (line.over ? 'demand-danger' : '') + '">' + line.over + '</td>' +
        '<td>' + statusTag(lineState.label, lineState.tone) + '</td></tr>';
    }).join('');
    setText('headerProgress', progressText());
    $('headerProgress').className = overLines ? 'demand-danger' : '';
  }

  function renderHeader() {
    setText('headerDemandNo', demand.no);
    setText('headerCustomerValue', demand.customer);
    setText('headerSourceSystemValue', demand.source.system);
    setText('headerSourceTypeValue', demand.source.type);
    setText('headerSourceNoValue', demand.source.no);
    setText('overviewStatus', statusLabels[demand.status]);
    $('headerStatusBadge').textContent = statusLabels[demand.status];
    $('headerStatusBadge').className = 'status ' + statusTones[demand.status];
    document.title = '客户需求单详情 · ' + statusLabels[demand.status];

    const state = demand.status;
    ['saveCreatedBtn', 'submitCreatedBtn', 'deleteCreatedBtn', 'rejectPendingBtn', 'receivePendingBtn', 'startCustomerOrderBtn', 'modifyBtn', 'historyBtn', 'moreActionWrap', 'moreBtn'].forEach((id) => {
      if ($(id)) $(id).hidden = true;
    });
    if ($('moreMenu')) $('moreMenu').hidden = true;
    if ($('moreBtn')) $('moreBtn').setAttribute('aria-expanded', 'false');

    if (state === 'created') {
      if ($('saveCreatedBtn')) $('saveCreatedBtn').hidden = false;
      if ($('submitCreatedBtn')) $('submitCreatedBtn').hidden = false;
      if ($('deleteCreatedBtn')) $('deleteCreatedBtn').hidden = false;
    } else if (state === 'pending') {
      if ($('rejectPendingBtn')) $('rejectPendingBtn').hidden = false;
      if ($('receivePendingBtn')) $('receivePendingBtn').hidden = false;
    } else if (state === 'received') {
      if ($('startCustomerOrderBtn')) $('startCustomerOrderBtn').hidden = false;
      if ($('modifyBtn')) $('modifyBtn').hidden = false;
      if ($('moreActionWrap')) $('moreActionWrap').hidden = false;
      if ($('moreBtn')) $('moreBtn').hidden = false;
      if ($('completeDemandBtn')) {
        $('completeDemandBtn').hidden = false;
        $('completeDemandBtn').disabled = false;
        $('completeDemandBtn').title = '';
      }
    }

    if (state !== 'created' && demand.versions.length > 1 && $('historyBtn')) {
      $('historyBtn').hidden = false;
      $('historyBtn').disabled = false;
      $('historyBtn').title = '查看历史版本';
    }
  }
  function orderContractAttachmentsMarkup(order) {
    const attachments = order.contract && Array.isArray(order.contract.attachments) ? order.contract.attachments : [];
    if (!attachments.length) return '<span class="demand-empty-cell">无附件</span>';
    return '<div class="demand-contract-files">' + attachments.map((item) =>
      '<button class="demand-contract-file" type="button" data-attachment="' + esc(item.name) + '" title="查看合同附件 ' + esc(item.name) + '">' +
      '<svg aria-hidden="true"><use href="#p-doc"/></svg>' +
      '<span><strong>' + esc(item.name) + '</strong><small>' + esc(item.type) + ' · ' + esc(item.size) + '</small></span>' +
      '</button>'
    ).join('') + '</div>';
  }

  function orderPrimaryMarkup(order) {
    const contract = order.contract;
    const contractMarkup = contract
      ? '<div class="demand-order-contract-title"><span class="demand-order-sub-label">客户合同</span><strong class="demand-cell-link">' + esc(contract.no) + '</strong></div>' +
        '<div class="demand-order-contract-meta"><span class="demand-version-chip">' + esc(contract.version) + '</span>' +
        statusTag(contract.status, contract.status === '已生效' ? 'done' : 'pending') + '</div>'
      : '<div class="demand-order-contract-title"><span class="demand-order-sub-label">客户合同</span><span class="demand-empty-cell">未关联客户合同</span></div>';
    return '<div class="demand-order-identity">' +
      '<div class="demand-order-identity-title"><strong class="demand-cell-link">' + esc(order.id) + '</strong>' + statusTag(order.status, order.statusTone) + '</div>' +
      '<div class="demand-order-contract">' + contractMarkup + '</div></div>';
  }

  function orderProductsMarkup(order) {
    const line = demand.lines.find((item) => item.id === order.lineId);
    const products = Array.isArray(order.products) && order.products.length
      ? order.products
      : [{ name: line ? line.name : '--', quantity: order.qty, unit: line ? line.unit : '吨' }];
    return '<div class="demand-order-products">' + products.map((product) =>
      '<div class="demand-order-product-row"><span class="demand-line-chip">需求行 ' + esc(line ? line.no : '--') + '</span>' +
      '<strong class="demand-order-product-name">' + esc(product.name || '--') + '</strong>' +
      '<span class="demand-order-product-qty">' + esc(product.quantity ?? order.qty) + ' ' + esc(product.unit || (line ? line.unit : '吨')) + '</span></div>'
    ).join('') + '</div>';
  }

  function demandTagListMarkup(items) {
    return (Array.isArray(items) ? items : []).filter(Boolean)
      .map((item) => '<span class="demand-tag">' + esc(item) + '</span>').join('');
  }

  function logisticsStats(order) {
    const demands = Array.isArray(order.logisticsDemands) ? order.logisticsDemands : [];
    const delegations = demands.reduce((items, demandItem) =>
      items.concat(Array.isArray(demandItem.delegations) ? demandItem.delegations : []), []);
    return { demands, delegations };
  }

  function logisticsStatusSummaryMarkup(items) {
    const groups = new Map();
    items.forEach((item) => {
      const label = item.status || '未知状态';
      if (!groups.has(label)) groups.set(label, { label, tone: item.tone || 'pending', count: 0 });
      groups.get(label).count += 1;
    });
    return Array.from(groups.values())
      .map((group) => statusTag(group.label + ' ' + group.count, group.tone)).join('');
  }

  function logisticsSummaryMarkup(order) {
    const stats = logisticsStats(order);
    if (!stats.demands.length) return '<span class="demand-empty-cell">尚未生成物流需求</span>';
    return '<div class="demand-logistics-groups">' + stats.demands.map((demandItem) => {
      const delegations = Array.isArray(demandItem.delegations) ? demandItem.delegations : [];
      const children = delegations.length
        ? delegations.map((delegation) =>
          '<div class="demand-logistics-delegation-line">' +
          '<span class="demand-logistics-level-label">物流委托</span>' +
          '<strong class="demand-logistics-pair-name" title="' + esc(delegation.name || delegation.no) + '">' + esc(delegation.name || delegation.no) + '</strong>' +
          statusTag(delegation.status, delegation.tone) + '</div>').join('')
        : '<div class="demand-logistics-delegation-line is-empty"><span class="demand-logistics-level-label">物流委托</span>' +
          '<span class="demand-logistics-pair-empty">尚未生成物流委托</span></div>';
      return '<div class="demand-logistics-group">' +
        '<div class="demand-logistics-demand-line"><span class="demand-logistics-level-label">物流需求</span>' +
        '<strong class="demand-logistics-pair-id" title="' + esc(demandItem.no) + '">' + esc(demandItem.no) + '</strong>' +
        '<span class="demand-status-subtle is-' + esc(demandItem.tone || 'pending') + '">' + esc(demandItem.status) + '</span></div>' +
        '<div class="demand-logistics-children">' + children + '</div></div>';
    }).join('') + '</div>';
  }
  function openLogisticsDrawer(order) {
    const snapshot = {
      orderNo: order.id,
      orderStatus: order.status,
      orderStatusTone: order.statusTone,
      customer: order.basic.customer,
      customerContact: order.basic.contact,
      demandNo: demand.no,
      products: (order.products || []).map((product) => product.name),
      qty: order.qty,
      loadType: (demand.shippingCategories && demand.shippingCategories[0]) || order.transport.cargoCategory || '件杂货',
      pickupDate: demand.pickupDate,
      createdAt: order.createdAt,
      logisticsDemands: order.logisticsDemands || []
    };
    try {
      sessionStorage.setItem('customerOrderPanoramaSnapshot', JSON.stringify(snapshot));
    } catch (error) {
      // The tracking page still provides a valid empty/default panorama if storage is unavailable.
    }
    const drawer = $('logisticsDrawer');
    drawer.innerHTML = '<iframe id="logisticsPanoramaFrame" class="demand-panorama-frame" ' +
      'src="customer-order-tracking.html?embed=1&panorama=1&no=' + encodeURIComponent(order.id) + '" ' +
      'title="查看供应商委托 · ' + esc(order.id) + '"></iframe>';
    ui.openDialog(drawer);
  }
  function openContractDialog(order) {
    const contract = order.contract;
    if (!contract) {
      ui.showToast('该客户订单尚未关联客户合同', 'error');
      return;
    }
    const body = '<div class="demand-readonly-grid demand-contract-dialog-grid">' +
      readonlyField('客户订单', order.id, { strong: true }) +
      readonlyField('合同编号', contract.no, { strong: true }) +
      readonlyField('合同版本', contract.version) +
      readonlyField('合同状态', contract.status) +
      readonlyField('签约方式', contract.signingMethod) +
      '</div><div class="demand-detail-subtitle">合同附件</div>' +
      orderContractAttachmentsMarkup(order);
    openActionDialog({
      title: '客户合同 · ' + contract.no,
      body,
      confirmText: '关闭',
      showCancel: false
    });
  }

  function storeFeedbackSnapshot(order) {
    const snapshot = {
      orderNo: order.id,
      status: order.status,
      statusTone: order.statusTone,
      customer: order.basic.customer,
      demandNo: demand.no,
      demandStatus: demand.status,
      contractNo: order.contract ? order.contract.no : '--',
      feedbacks: order.feedbacks || []
    };
    try {
      sessionStorage.setItem('customerOrderFeedbackSnapshot', JSON.stringify(snapshot));
    } catch (error) {
      // Navigation still works with the page's built-in fallback data.
    }
  }

  function renderOrderList() {
    $('orderCountLabel').textContent = demand.orders.length + ' 单';
    if (!demand.orders.length) {
      $('orderListBody').innerHTML = emptyRow(4, '尚未生成客户订单。需求接收后可通过“发起客户订单”继续安排。');
      return;
    }
    const embeddedParam = ui.embedded ? '&embed=1' : '';
    $('orderListBody').innerHTML = demand.orders.map((order) => {
      const feedbackHref = 'customer-order-feedback-prototype.html?tab=feedback&no=' + encodeURIComponent(order.id) +
        '&from=' + encodeURIComponent('customer-demand-detail-v3-prototype.html?no=' + encodeURIComponent(demand.no) + '&status=' + encodeURIComponent(demand.status) + embeddedParam) + embeddedParam;
      return '<tr data-order-id="' + esc(order.id) + '">' +
        '<td>' + orderPrimaryMarkup(order) + '</td>' +
        '<td>' + orderProductsMarkup(order) + '</td>' +
        '<td class="demand-order-chain-cell">' + logisticsSummaryMarkup(order) + '</td>' +
        '<td class="action-cell"><div class="demand-order-actions">' +
        '<button class="btn link" type="button" data-view-contract="' + esc(order.id) + '"' + (order.contract ? '' : ' disabled title="未关联客户合同"') + '>查看合同</button>' +
        '<a class="btn link" href="' + feedbackHref + '" data-order-feedback="' + esc(order.id) + '">查看履约情况</a>' +
        '<button class="btn link" type="button" data-view-logistics="' + esc(order.id) + '"' + (logisticsStats(order).demands.length ? '' : ' disabled title="尚未生成物流需求"') + '>查看供应商委托</button>' +
        '</div></td></tr>';
    }).join('');
  }
  function businessFeeRows() {
    return demand.orders.reduce((rows, order) => {
      const contractNo = order.contractNo || (order.contract ? order.contract.no : '--');
      order.businessReceivable.forEach((line) => rows.push({ order, contractNo, direction: '应收', line }));
      order.businessPayable.forEach((line) => rows.push({ order, contractNo, direction: '应付', line }));
      return rows;
    }, []);
  }

  function settlementReferences(line) {
    const reconciliations = demand.reconciliations.filter((item) => item.sourceFeeId === line.id);
    const reconciliationNos = new Set(reconciliations.map((item) => item.no));
    const invoices = demand.invoices.filter((item) => reconciliationNos.has(item.sourceReconciliationNo));
    const invoiceNos = new Set(invoices.map((item) => item.invoiceNo).filter((item) => item && item !== '--'));
    const payments = demand.payments.filter((item) =>
      reconciliationNos.has(item.reconciliationNo) || invoiceNos.has(item.invoiceNo));
    return { reconciliations, invoices, payments };
  }

  function financeReferenceMarkup(title, status, tone, meta) {
    return '<div class="demand-finance-ref"><div class="demand-finance-ref-title"><strong>' + esc(title) + '</strong>' +
      statusTag(status, tone) + '</div><div class="demand-finance-ref-meta">' + esc(meta) + '</div></div>';
  }

  function reconciliationInfoMarkup(references) {
    if (!references.reconciliations.length) return '<span class="demand-finance-empty">未对账</span>';
    return '<div class="demand-finance-ref-list">' + references.reconciliations.map((item) =>
      financeReferenceMarkup(item.no, item.status, item.tone, (item.completedAt || '--') + ' · ' + money(item.amount, item.currency))).join('') + '</div>';
  }

  function invoiceInfoMarkup(references) {
    if (!references.invoices.length) return '<span class="demand-finance-empty">未开票</span>';
    return '<div class="demand-finance-ref-list">' + references.invoices.map((item) =>
      financeReferenceMarkup(item.no + ' · ' + item.invoiceNo, item.status, item.tone, item.date + ' · ' + money(item.amount, item.currency))).join('') + '</div>';
  }

  function paymentInfoMarkup(references) {
    if (!references.payments.length) return '<span class="demand-finance-empty">未收付款</span>';
    return '<div class="demand-finance-ref-list">' + references.payments.map((item) =>
      financeReferenceMarkup(item.no, item.status, item.tone, item.direction + ' · ' + money(item.amount, item.currency) + ' · ' + item.planDate)).join('') + '</div>';
  }
  function renderFinance() {
    const currencyLabel = (currency) => ({ CNY: '人民币', USD: '美元', EUR: '欧元', JPY: '日元' }[currency] || currency || '--');
    const taxRateFor = (line) => Number(line.taxRate ?? (line.feeItem === '海运费' ? 9 : 6));
    const containerFor = (line) => line.containerType || (line.unit === '箱' ? '20RF' : '--');
    const rowMarkup = (line) => {
      const references = settlementReferences(line);
      const reconciliationNo = references.reconciliations.map((item) => item.no).join('、') || '--';
      const invoiceStatus = references.invoices[0]?.status || '未开票';
      const paymentStatus = references.payments[0]?.status || (line.direction === '应收' ? '未收款' : '未付款');
      const exchangeRate = Number(line.exchangeRate ?? 1);
      return '<tr>' +
        '<td><strong>' + esc(line.feeItem) + '</strong></td>' +
        '<td>' + esc(line.party) + '</td>' +
        '<td class="num">' + taxRateFor(line) + '</td>' +
        '<td>' + esc(line.ppcc || 'SW') + '</td>' +
        '<td class="num">' + amountText(line.unitPrice) + '</td>' +
        '<td>' + esc(line.currency) + '</td>' +
        '<td class="num">' + line.quantity + '</td>' +
        '<td>' + esc(line.unit) + '</td>' +
        '<td>' + esc(containerFor(line)) + '</td>' +
        '<td class="num">' + amountText(line.originalAmount ?? line.localAmount) + '</td>' +
        '<td class="num">' + exchangeRate.toFixed(4) + '</td>' +
        '<td class="num">' + amountText(line.localAmount) + '</td>' +
        '<td><span class="finance-reference-ellipsis" title="' + esc(line.remark || '--') + '">' + esc(line.remark || '--') + '</span></td>' +
        '<td>' + esc(demand.customer) + '</td>' +
        '<td><span class="cell-link">' + esc(line.orderId) + '</span></td>' +
        '<td><span class="cell-link">' + esc(reconciliationNo) + '</span></td>' +
        '<td class="num">' + amountText(line.localAmount) + '</td>' +
        '<td><span class="finance-reference-status">' + esc(invoiceStatus) + '</span></td>' +
        '<td><span class="finance-reference-status">' + esc(paymentStatus) + '</span></td>' +
        '<td><button class="btn link finance-reference-link" type="button" data-finance-action="settlement" data-line-id="' + esc(line.id) + '">查看对账</button></td>' +
        '</tr>';
    };

    const receivableRows = demand.executionFees.filter((line) => line.direction === '应收');
    const payableRows = demand.executionFees.filter((line) => line.direction === '应付');
    $('executionReceivableBody').innerHTML = receivableRows.length
      ? receivableRows.map(rowMarkup).join('')
      : emptyRow(20, '暂无执行预估应收');
    $('executionPayableBody').innerHTML = payableRows.length
      ? payableRows.map(rowMarkup).join('')
      : emptyRow(20, '暂无执行预估应付');

    const currencies = Array.from(new Set(demand.executionFees.map((line) => line.currency || 'CNY')));
    const nativeRows = currencies.map((currency) => {
      const lines = demand.executionFees.filter((line) => (line.currency || 'CNY') === currency);
      const receivable = lines.filter((line) => line.direction === '应收').reduce((sum, line) => sum + Number(line.originalAmount ?? line.localAmount), 0);
      const payable = lines.filter((line) => line.direction === '应付').reduce((sum, line) => sum + Number(line.originalAmount ?? line.localAmount), 0);
      return '<tr><td>' + esc(currencyLabel(currency)) + '</td><td class="num">' + amountText(receivable) + '</td><td class="num">' + amountText(payable) + '</td><td class="num">' + amountText(receivable - payable) + '</td></tr>';
    }).join('');
    const localReceivable = receivableRows.reduce((sum, line) => sum + Number(line.localAmount), 0);
    const localPayable = payableRows.reduce((sum, line) => sum + Number(line.localAmount), 0);
    $('profitSummaryBody').innerHTML = (nativeRows || '') +
      '<tr class="is-converted"><td>折合本位币(CNY)</td><td class="num">' + amountText(localReceivable) + '</td><td class="num">' + amountText(localPayable) + '</td><td class="num">' + amountText(localReceivable - localPayable) + '</td></tr>';
  }

  function renderVersions() {
    const body = $('versionTableBody');
    if (!body) return;
    const versions = demand.versions.slice().sort((a, b) => Number(b.version.slice(1)) - Number(a.version.slice(1)));
    body.innerHTML = versions.map((version) => {
      const isCurrent = version.version === demand.currentVersion && version.status === 'received';
      const isCurrentDraft = version.version === demand.currentVersion && version.status === 'created';
      const meta = versionStatus[version.status];
      const displayMeta = version.status === 'received' && !isCurrent
        ? { label: '历史版本', tone: 'closed' }
        : meta;
      let marker = '';
      if (isCurrent) marker = '<span class="demand-version-current">' + (demand.status === 'completed' ? '最终版本' : '当前有效') + '</span>';
      if (isCurrentDraft) marker = '<span class="demand-version-current">当前版本</span>';
      return '<tr><td><span class="version-chip">' + esc(version.version) + '</span>' + marker + '</td>' +
        '<td>' + esc(version.type) + '</td><td>' + esc(version.changeNo) + '</td>' +
        '<td>' + statusTag(displayMeta.label, displayMeta.tone) + '</td><td>' + esc(version.submittedAt) + '</td>' +
        '<td>' + esc(version.handledBy) + '</td><td>' + esc(version.effectiveAt) + '</td></tr>';
    }).join('');
  }

  function renderTimeline() {
    const list = $('timelineList');
    if (!list) return;
    list.innerHTML = demand.timeline.map((item) =>
      '<li class="demand-timeline-item"><div class="demand-timeline-time">' + esc(item.time) + '</div>' +
      '<span class="demand-timeline-dot" aria-hidden="true"></span>' +
      '<div class="demand-timeline-copy"><strong>' + esc(item.title) + '</strong><p>' + esc(item.text) + '</p></div></li>'
    ).join('');
  }

  function renderAll() {
    renderHeader();
    renderSource();
    renderDemandInfoValues();
    renderSystemInfo();
    renderOverviewLines();
    renderProgress();
    renderOrderList();
    renderFinance();
    renderVersions();
    renderTimeline();
    syncCreateSections();
  }

  function setActiveButton(buttons, activeButton) {
    buttons.forEach((button) => {
      const active = button === activeButton;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
  }

  function activateTab(tabName) {
    const map = { overview: 'overviewPanel', orders: 'ordersPanel', finance: 'financePanel' };
    const buttons = [$('overviewTab'), $('ordersTab'), $('financeTab')];
    const active = $((tabName || 'overview') + 'Tab') || $('overviewTab');
    setActiveButton(buttons, active);
    Object.entries(map).forEach(([key, panel]) => { $(panel).hidden = key !== tabName; });
    if (tabName === 'orders' && !orderTableLoadingDone && demand.orders.length) {
      orderTableLoadingDone = true;
      UIState.setTableState($('orderTableHost'), {
        state: 'loading',
        preserveHeader: true,
        title: '正在加载客户订单…',
        message: '订单主数据与合同信息正在同步。',
        rows: 4
      });
      window.setTimeout(() => {
        UIState.clearTableState($('orderTableHost'));
        renderOrderList();
      }, 320);
    }
    if (tabName === 'finance' && !financeLoadingDone) {
      financeLoadingDone = true;
      const hosts = [$('executionReceivableTableHost'), $('executionPayableTableHost')].filter(Boolean);
      hosts.forEach((host) => {
        UIState.setTableState(host, {
          state: 'loading',
          preserveHeader: true,
          title: '正在加载执行预估费用…',
          message: '正在汇总应收、应付与结算单据。',
          rows: 2
        });
      });
      window.setTimeout(() => {
        hosts.forEach((host) => UIState.clearTableState(host));
        renderFinance();
      }, 360);
    }
  }


  function syncCreateSections() {
    const isCreated = demand.status === 'created';
    $('createDemandForm').hidden = !isCreated;
    $('staticDemandInfoSection').hidden = isCreated;
    if ($('receiveOrgSection')) $('receiveOrgSection').hidden = isCreated;
    if ($('staticProductDetailSection')) $('staticProductDetailSection').hidden = isCreated;
    if ($('staticQuoteSection')) $('staticQuoteSection').hidden = isCreated;
    if (isCreated) {
      if ($('staticBookingExtensionSection')) $('staticBookingExtensionSection').hidden = true;
    }
    if ($('demandSourceSection')) $('demandSourceSection').hidden = false;
    if (isCreated) renderCreateFormValues();
  }

  function normalizedContactEmailRecipients() {
    if (Array.isArray(demand.contactEmailRecipients) && demand.contactEmailRecipients.length) return demand.contactEmailRecipients;
    return demand.contactEmail ? [{ name: demand.contactName, email: demand.contactEmail }] : [];
  }

  function contactEmailRecipientsMarkup(recipients) {
    if (!recipients.length) return '<span class="demand-muted">--</span>';
    return recipients.map((recipient) => '<span class="demand-email-recipient-item"><strong>' + esc(recipient.name || '--') +
      '</strong><span>&lt;' + esc(recipient.email || '--') + '&gt;</span></span>').join('');
  }

  function emailRecipientChipMarkup(recipient, index) {
    return '<span class="demand-email-recipient-chip" data-email-recipient-chip>' +
      '<span class="demand-email-recipient-chip-copy"><strong>' + esc(recipient.name || '未填写姓名') + '</strong><span>&lt;' + esc(recipient.email || '未填写邮箱') + '&gt;</span></span>' +
      '<button type="button" data-remove-email-recipient data-email-recipient-index="' + index + '" aria-label="删除邮件接收人">×</button></span>';
  }

  function renderContactEmailRecipients(recipients) {
    const list = $('createEmailRecipientList');
    if (!list) return;
    list.innerHTML = (recipients || []).map(emailRecipientChipMarkup).join('');
    if ($('emailRecipientDraftName')) $('emailRecipientDraftName').value = '';
    if ($('emailRecipientDraftEmail')) $('emailRecipientDraftEmail').value = '';
  }

  function readContactEmailRecipients() {
    return normalizedContactEmailRecipients().filter((recipient) => recipient.name || recipient.email);
  }

  function applyCreateOrgState() {
    const locked = versionMaintenanceMode;
    ['createSalesperson', 'createSalesDepartment', 'createBusinessUnit', 'createAccountingGroup', 'createSalesmanCompany'].forEach((id) => {
      const control = $(id);
      if (!control) return;
      control.disabled = locked;
      control.setAttribute('aria-readonly', String(locked));
    });
    const hint = $('createOrgHint');
    if (hint) hint.textContent = locked ? '版本维护：继承当前有效版本，不可编辑' : '新增时选填';
  }

  function renderCreateFormValues() {
    const form = $('createDemandForm');
    if (!form) return;
    const values = {
      createCustomer: demand.customer,
      createCustomerType: demand.customerType,
      createContact: demand.contactName,
      createPhone: demand.contactPhone,
      createDemandScene: demand.demandScene,
      createBusinessDate: demand.businessDate,
      createTradeTerms: demand.tradeTerms,
      createServiceRequirement: demand.serviceRequirement
    };
    Object.entries(values).forEach(([id, value]) => { if ($(id)) $(id).value = value || ''; });
    const org = demand.receiveOrg || {};
    const orgValues = {
      createSalesperson: org.salesperson,
      createSalesDepartment: org.department,
      createBusinessUnit: org.businessUnit,
      createAccountingGroup: org.accountingGroup,
      createSalesmanCompany: org.salesmanCompany
    };
    Object.entries(orgValues).forEach(([id, value]) => { if ($(id)) $(id).value = value || ''; });
    applyCreateOrgState();
    renderContactEmailRecipients(normalizedContactEmailRecipients());
    setCheckboxValues('serviceScopes', demand.serviceScopes);
    setCheckboxValues('serviceItems', demand.serviceItems);
    setCheckboxValues('shippingCategories', demand.shippingCategories);
    const booking = demand.booking || {};
    $('createBookingExtensionText').value = demand.source.type === '手工创建'
      ? (booking.text || '')
      : (booking.text || bookingExtensionContent(booking));
    const transport = demand.transportRequirement || {};
    const transportValues = {
      createOriginPort: transport.originPort,
      createOriginRegion: transport.originRegion,
      createOriginContact: transport.originContact,
      createOriginContactPhone: transport.originContactPhone,
      createOriginTerminal: transport.originTerminal,
      createDestinationPort: transport.destinationPort,
      createDestinationRegion: transport.destinationRegion,
      createDestinationContact: transport.destinationContact,
      createDestinationContactPhone: transport.destinationContactPhone,
      createDestinationTerminal: transport.destinationTerminal,
      createLatestShipmentDate: transport.latestShipmentDate,
      createDischargeTerms: transport.dischargeTerms,
      createDirectSailing: transport.directSailing || '是',
      createVesselCertificateRequirement: transport.vesselCertificateRequirement,
      createTransportVesselAgeRequirement: transport.vesselAgeRequirement,
      createCommissionRate: transport.commissionRate
    };
    Object.entries(transportValues).forEach(([id, value]) => { if ($(id)) $(id).value = value ?? ''; });
    updatePortRegions();
    renderCreateProductRows();
    renderCreateQuoteRows();
    updateBookingSectionVisibility();
    updateTransportTypeVisibility();
  }

  function setCheckboxValues(name, values) {
    const set = new Set(values || []);
    document.querySelectorAll('input[name="' + name + '"]').forEach((checkbox) => {
      checkbox.checked = set.has(checkbox.value);
    });
  }

  const productEnglishNames = {
    '脱皮花生仁': 'Blanched Peanut Kernels',
    '一级压榨花生油': 'First-grade Pressed Peanut Oil',
    '花生粕': 'Peanut Meal',
    '食用植物油': 'Edible Vegetable Oil'
  };

  function syncProductRowDerived(row) {
    if (!row) return;
    const name = row.querySelector('.product-name')?.value.trim() || '';
    const englishInput = row.querySelector('.product-name-en');
    if (englishInput) englishInput.value = productEnglishNames[name] || '';
    const qtyInput = row.querySelector('.product-qty');
    const priceInput = row.querySelector('.goods-value-price');
    const amountInput = row.querySelector('.goods-value-amount');
    if (!qtyInput || !priceInput || !amountInput) return;
    amountInput.value = qtyInput.value !== '' && priceInput.value !== ''
      ? (Number(qtyInput.value || 0) * Number(priceInput.value || 0)).toFixed(2)
      : '';
  }

  function productRowMarkup(line, index) {
    const units = ['吨', '千克', '立方米', '件'];
    const weightUnits = ['kg', '吨'];
    const contractTypes = ['销售合同', '采购合同', '框架合同'];
    return '<tr data-product-row data-line-id="' + esc(line.id || ('L' + Date.now() + index)) + '">' +
      '<td><input class="product-trade" value="' + esc(line.tradeContractNo || '') + '" placeholder="请输入合同号" aria-label="贸易合同号"></td>' +
      '<td><select class="product-contract-type" aria-label="贸易合同类型"><option value="">请选择</option>' + contractTypes.map((type) => '<option' + (line.tradeContractType === type ? ' selected' : '') + '>' + type + '</option>').join('') + '</select></td>' +
      '<td><input class="product-name" list="productNameOptions" autocomplete="off" value="' + esc(line.name || '') + '" placeholder="搜索或选择商品" aria-label="商品中文名"></td>' +
      '<td><div class="demand-product-description-cell"><span class="product-description-text" title="' + esc(line.description || '') + '">' + esc(line.description || '--') + '</span>' +
      '<button class="product-description-edit" type="button" data-edit-product-description aria-label="编辑商品描述" title="编辑商品描述"><svg aria-hidden="true"><use href="#p-edit"/></svg></button></div></td>' +
      '<td><input class="product-qty" type="number" min="0" step="0.01" value="' + (line.required || '') + '" placeholder="请输入" aria-label="标准数量"></td>' +
      '<td><select class="product-unit" aria-label="标准单位">' + units.map((unit) => '<option' + (line.unit === unit ? ' selected' : '') + '>' + unit + '</option>').join('') + '</select></td>' +
      '<td><input class="product-piece-weight" type="number" min="0" step="0.01" value="' + (line.pieceWeight || '') + '" placeholder="请输入" aria-label="单件重量"></td>' +
      '<td><select class="product-weight-unit" aria-label="单件重量单位">' + weightUnits.map((unit) => '<option' + (line.pieceWeightUnit === unit ? ' selected' : '') + '>' + unit + '</option>').join('') + '</select></td>' +
      '<td><input class="product-spec" value="' + esc(line.specDimensions || line.spec || '') + '" placeholder="长 × 宽 × 高" aria-label="规格尺寸"></td>' +
      '<td><input class="product-over-rate" type="number" min="0" step="0.01" value="' + (line.overRate ?? '') + '" placeholder="%" aria-label="溢装率"></td>' +
      '<td><input class="product-under-rate" type="number" min="0" step="0.01" value="' + (line.underRate ?? '') + '" placeholder="%" aria-label="短装率"></td>' +
      '<td><input class="goods-value-price" type="number" min="0" step="0.01" value="' + (line.goodsValueUnitPrice ?? '') + '" placeholder="请输入" aria-label="货值单价"></td>' +
      '<td><input class="goods-value-amount" type="number" min="0" step="0.01" value="' + (line.goodsValueAmount ?? '') + '" aria-label="货值金额" readonly></td>' +
      '<td><input class="goods-value-currency" list="goodsValueCurrencyOptions" autocomplete="off" value="' + esc(line.goodsValueCurrency || '') + '" placeholder="搜索或选择币种" aria-label="货值币种"></td>' +
      '<td><input class="package-quantity" type="number" min="0" step="0.01" value="' + (line.packageQuantity ?? '') + '" placeholder="请输入" aria-label="包装数量"></td>' +
      '<td><input class="package-unit" list="packageUnitOptions" autocomplete="off" value="' + esc(line.packageUnit || '') + '" placeholder="搜索或选择单位" aria-label="包装单位"></td>' +
      '<td><input class="product-name-en" value="' + esc(line.nameEn || productEnglishNames[line.name] || '') + '" aria-label="商品英文名" readonly></td>' +
      '<td><button class="btn link demand-danger" type="button" data-remove-product>删除</button></td></tr>';
  }
  function openProductDescriptionEditor(lineId) {
    const line = demand.lines.find((item) => item.id === lineId);
    if (!line) return;
    const description = line.description || '';
    openActionDialog({
      title: '编辑商品描述',
      dialogClass: 'demand-product-description-dialog',
      body: '<div class="demand-product-description-editor"><label for="productDescriptionEditor">商品描述</label>' +
        '<div class="demand-product-description-editor-field"><textarea id="productDescriptionEditor" maxlength="250" placeholder="请输入商品描述">' + esc(description) + '</textarea>' +
        '<span class="demand-product-description-counter" id="productDescriptionCounter">' + Array.from(description).length + '/250</span></div></div>',
      confirmText: '确认',
      onMount: ({ form }) => {
        const textarea = form.querySelector('#productDescriptionEditor');
        const counter = form.querySelector('#productDescriptionCounter');
        const updateCounter = () => { counter.textContent = Array.from(textarea.value).length + '/250'; };
        textarea.addEventListener('input', updateCounter);
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      },
      onSubmit: () => {
        const textarea = $('actionDialog').querySelector('#productDescriptionEditor');
        const value = textarea ? textarea.value.trim() : '';
        readCreateForm();
        const target = demand.lines.find((item) => item.id === lineId);
        if (target) target.description = value;
        renderCreateProductRows();
      }
    });
  }

  function renderCreateProductRows() {
    $('createProductBody').innerHTML = demand.lines.map(productRowMarkup).join('');
  }

  function quoteRowMarkup(line, index) {
    const currencies = ['CNY', 'USD', 'EUR'];
    return '<tr data-quote-row data-quote-id="' + esc(line.id || ('Q' + Date.now() + index)) + '">' +
      '<td><input class="quote-item" list="feeItemOptions" autocomplete="off" value="' + esc(line.feeItem || '') + '" placeholder="搜索或选择费用科目" aria-label="费用科目"></td>' +
      '<td><input class="quote-tax-rate" type="number" min="0" step="0.01" value="' + (line.taxRate ?? '') + '" aria-label="税率"></td>' +
      '<td><input class="quote-price" type="number" min="0" step="0.01" value="' + (line.quotePrice || '') + '" aria-label="报价单价（含税）"></td>' +
      '<td><select class="quote-currency" aria-label="币种">' + currencies.map((currency) => '<option' + (line.currency === currency ? ' selected' : '') + '>' + currency + '</option>').join('') + '</select></td>' +
      '<td><input class="quote-qty" type="number" min="0" step="0.01" value="' + (line.quantity || '') + '" aria-label="预计数量"></td>' +
      '<td><input class="quote-unit" value="' + esc(line.unit || '') + '" aria-label="单位"></td>' +
      '<td><input class="quote-amount" type="number" min="0" step="0.01" value="' + (line.quoteAmount || '') + '" aria-label="报价金额" readonly></td>' +
      '<td><input class="quote-exchange" type="number" min="0" step="0.0001" value="' + (line.exchangeRate ?? 1) + '" aria-label="汇率"></td>' +
      '<td><input class="quote-local-amount" type="number" min="0" step="0.01" value="' + (line.localAmount || '') + '" aria-label="本位币金额" readonly></td>' +
      '<td><button class="demand-quote-remove" type="button" data-remove-quote aria-label="删除报价行" title="删除"><svg aria-hidden="true"><use href="#p-trash"/></svg></button></td></tr>';
  }

  function renderCreateQuoteRows() {
    if (!$('createReceivableQuoteBody') || !$('createPayableQuoteBody')) return;
    if (!$('quoteReceivableBody') || !$('quotePayableBody')) return;
    const receivable = demand.quote.lines.filter((line) => line.direction === '应收');
    const payable = demand.quote.lines.filter((line) => line.direction === '应付');
    $('createReceivableQuoteBody').innerHTML = receivable.length
      ? receivable.map((line, index) => quoteRowMarkup(line, index)).join('')
      : emptyRow(10, '暂无预估应收');
    $('createPayableQuoteBody').innerHTML = payable.length
      ? payable.map((line, index) => quoteRowMarkup(line, index + receivable.length)).join('')
      : emptyRow(10, '暂无预估应付');
  }

  function updateMultiSelectSummary(name) {
    const widget = document.querySelector('[data-multi-select-name="' + name + '"]');
    if (!widget) return;
    const valueNode = widget.querySelector('[data-multi-select-value]');
    const values = Array.from(widget.querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value);
    valueNode.textContent = values.length ? values.join('、') : (valueNode.dataset.placeholder || '请选择');
    widget.classList.toggle('has-value', values.length > 0);
  }

  function updateBookingSectionVisibility() {
    const transportScope = document.querySelector('input[name="serviceScopes"][value="运输"]')?.checked;
    const waterTransport = transportScope && Boolean(document.querySelector('input[name="serviceItems"][value="水运"]')?.checked);
    const pieceCargo = transportScope && Boolean(document.querySelector('input[name="shippingCategories"][value="件杂"]')?.checked);
    const showWaterBulk = waterTransport && pieceCargo;
    if ($('createWaterTransportFields')) $('createWaterTransportFields').hidden = !showWaterBulk;
  }

  function updatePortRegions() {
    const regions = {
      '青岛港': '中国 / 山东省 / 青岛市',
      '上海港': '中国 / 上海市',
      '宁波舟山港': '中国 / 浙江省 / 宁波市',
      '天津港': '中国 / 天津市',
      '深圳港': '中国 / 广东省 / 深圳市',
      '胡志明港': '越南 / 胡志明市',
      '海防港': '越南 / 海防市',
      '新加坡港': '新加坡',
      '鹿特丹港': '荷兰 / 南荷兰省 / 鹿特丹市',
      '洛杉矶港': '美国 / 加利福尼亚州 / 洛杉矶市'
    };
    $('createOriginRegion').value = regions[$('createOriginPort').value] || '';
    $('createDestinationRegion').value = regions[$('createDestinationPort').value] || '';
  }

  function updateTransportTypeVisibility() {
    const transportScope = document.querySelector('input[name="serviceScopes"][value="运输"]')?.checked;
    if (!transportScope) {
      document.querySelectorAll('input[name="serviceItems"], input[name="shippingCategories"]').forEach((input) => { input.checked = false; });
      updateBookingSectionVisibility();
    }
    const waterTransport = transportScope && Boolean(document.querySelector('input[name="serviceItems"][value="水运"]')?.checked);
    ['createTransportTypeField', 'createShippingCategoryField'].forEach((id) => {
      if ($(id)) $(id).hidden = !transportScope;
    });
    const pieceCargo = transportScope && Boolean(document.querySelector('input[name="shippingCategories"][value="件杂"]')?.checked);
    const showWaterBulk = waterTransport && pieceCargo;
    $('createWaterTransportFields').hidden = !showWaterBulk;
    ['createOriginPort', 'createDestinationPort'].forEach((id) => {
      if ($(id)) $(id).required = showWaterBulk;
    });
    updateMultiSelectSummary('serviceItems');
    updateMultiSelectSummary('shippingCategories');
    updateBookingSectionVisibility();
  }

  function readCreateForm() {
    const form = $('createDemandForm');
    if (!form) return false;
    demand.customer = form.elements.customer.value.trim();
    demand.receiveOrg = {
      salesperson: form.elements.salesperson.value.trim(),
      department: form.elements.salesDepartment.value.trim(),
      businessUnit: form.elements.businessUnit.value.trim(),
      accountingGroup: form.elements.accountingGroup.value.trim(),
      salesmanCompany: form.elements.salesmanCompany.value.trim()
    };
    demand.customerType = form.elements.customerType.value;
    demand.contactName = form.elements.contact.value.trim();
    demand.contactPhone = form.elements.phone.value.trim();
    demand.contactEmailRecipients = readContactEmailRecipients();
    demand.contactEmail = demand.contactEmailRecipients[0]?.email || '';
    demand.demandScene = form.elements.demandScene.value;
    demand.businessDate = form.elements.businessDate.value;
    demand.serviceScopes = Array.from(form.querySelectorAll('input[name="serviceScopes"]:checked')).map((input) => input.value);
    demand.serviceItems = Array.from(form.querySelectorAll('input[name="serviceItems"]:checked')).map((input) => input.value);
    demand.shippingCategories = Array.from(form.querySelectorAll('input[name="shippingCategories"]:checked')).map((input) => input.value);
    demand.tradeTerms = form.elements.tradeTerms.value;
    demand.serviceRequirement = form.elements.serviceRequirement.value.trim();

    demand.transportRequirement = {
      originPort: form.elements.originPort.value.trim(),
      originRegion: form.elements.originRegion.value.trim(),
      originContact: form.elements.originContact.value.trim(),
      originContactPhone: form.elements.originContactPhone.value.trim(),
      originTerminal: form.elements.originTerminal.value.trim(),
      destinationPort: form.elements.destinationPort.value.trim(),
      destinationRegion: form.elements.destinationRegion.value.trim(),
      destinationContact: form.elements.destinationContact.value.trim(),
      destinationContactPhone: form.elements.destinationContactPhone.value.trim(),
      destinationTerminal: form.elements.destinationTerminal.value.trim(),
      latestShipmentDate: form.elements.latestShipmentDate.value,
      dischargeTerms: form.elements.dischargeTerms.value.trim(),
      directSailing: form.elements.directSailing.value,
      vesselCertificateRequirement: form.elements.vesselCertificateRequirement.value.trim(),
      vesselAgeRequirement: form.elements.transportVesselAgeRequirement.value.trim(),
      commissionRate: Number(form.elements.commissionRate.value || 0)
    };
    demand.origin = demand.transportRequirement.originPort || demand.origin;
    demand.destination = demand.transportRequirement.destinationPort || demand.destination;

    demand.lines = Array.from(document.querySelectorAll('#createProductBody [data-product-row]')).map((row, index) => {
      const lineId = row.dataset.lineId;
      const existing = demand.lines.find((line) => line.id === lineId) || {};
      const specDimensions = row.querySelector('.product-spec').value.trim();
      return Object.assign({}, existing, {
        id: lineId,
        no: index + 1,
        tradeContractNo: row.querySelector('.product-trade').value.trim(),
        tradeContractType: row.querySelector('.product-contract-type').value,
        name: row.querySelector('.product-name').value.trim(),
        description: existing.description || '',
        required: Number(row.querySelector('.product-qty').value || 0),
        unit: row.querySelector('.product-unit').value,
        pieceWeight: Number(row.querySelector('.product-piece-weight').value || 0),
        pieceWeightUnit: row.querySelector('.product-weight-unit').value,
        specDimensions,
        spec: specDimensions,
        goodsValueUnitPrice: Number(row.querySelector('.goods-value-price').value || 0),
        goodsValueAmount: Number(row.querySelector('.goods-value-amount').value || 0),
        goodsValueCurrency: row.querySelector('.goods-value-currency').value.trim(),
        packageQuantity: Number(row.querySelector('.package-quantity').value || 0),
        packageUnit: row.querySelector('.package-unit').value.trim(),
        nameEn: row.querySelector('.product-name-en').value.trim()
      });
    });

    demand.booking = Object.assign({}, demand.booking, {
      text: form.elements.bookingExtensionText.value.trim()
    });

    const version = currentVersion();
    if (version) {
      version.snapshot.pickupDate = demand.pickupDate || version.snapshot.pickupDate;
      version.snapshot.quantities = Object.fromEntries(demand.lines.map((line) => [line.id, line.required]));
    }
    renderDemandInfoValues();
    renderOverviewLines();
    updateBookingSectionVisibility();
    updateTransportTypeVisibility();
    return true;
  }
  function validateGroup(name, message) {
    const controls = Array.from(document.querySelectorAll('input[name="' + name + '"], select[name="' + name + '"]'));
    const first = controls[0];
    const valid = controls.some((control) => control.type === 'checkbox' ? control.checked : Boolean(control.value));
    if (!valid && first) UIState.setFieldState(first, 'invalid', message);
    return valid;
  }

  function validateCreateGroups(form) {
    const serviceScopeValid = validateGroup('serviceScopes', '请选择至少一项服务范围');
    const transportRequired = form.querySelector('input[name="serviceScopes"][value="运输"]')?.checked;
    const transportValid = !transportRequired || validateGroup('serviceItems', '请选择至少一项运输类型');
    const shippingValid = !transportRequired || validateGroup('shippingCategories', '请选择至少一项装运类别');
    if (!serviceScopeValid || !transportValid || !shippingValid) {
      const first = form.querySelector('.is-invalid input, .is-invalid select');
      if (first) first.focus();
      return false;
    }

    const productRows = Array.from(document.querySelectorAll('#createProductBody [data-product-row]'));
    const invalidProduct = productRows.find((row) =>
      !row.querySelector('.product-name').value.trim() ||
      !row.querySelector('.product-qty').value ||
      Number(row.querySelector('.product-qty').value) <= 0
    );
    if (!productRows.length || invalidProduct) {
      UIState.showFormAlert(form, 'error', '请至少填写一条完整的商品信息，商品名称和标准数量不能为空。');
      const target = invalidProduct?.querySelector('.product-name') || $('addCreateProductBtn');
      if (target && target.focus) target.focus();
      return false;
    }

    return true;
  }

  let dirtyState = null;

  function saveCreateDraft(validateRequired, silent) {
    const form = $('createDemandForm');
    if (!form) return false;
    UIState.clearFormAlert(form);
    if (validateRequired) {
      const result = UIState.validateRequired(form);
      if (!result.valid || !validateCreateGroups(form)) {
        ui.showToast('请先完善必填字段', 'error');
        return false;
      }
    }
    readCreateForm();
    demand.system.updatedBy = '苏丽蓉';
    demand.system.updatedAt = nowText();
    renderHeader();
    renderSystemInfo();
    if (!silent) {
      if (dirtyState) dirtyState.markClean();
      ui.showToast('客户需求已保存，当前仍为创建状态', 'success');
    }
    return true;
  }

  function submitCreatedDemand(kind) {
    if (demand.status !== 'created') return;
    if (!saveCreateDraft(true, true)) return;
    const version = currentVersion();
    version.status = 'pending';
    version.handledBy = '--';
    version.effectiveAt = '--';
    demand.status = 'pending';
    demand.timeline.push({
      time: nowText(),
      title: version.version + ' 已提交',
      text: kind === 'submit' ? '客户需求已提交，进入待接收状态。' : '客户需求已提交，准备生成' + (kind === 'delegation' ? '物流委托' : '物流需求') + '。'
    });
    if (dirtyState) dirtyState.markClean();
    renderAll();
    if (kind === 'logistics' || kind === 'delegation') {
      window.setTimeout(() => openSplitArrangementModal(kind), 80);
    } else {
      ui.showToast('提交成功，等待接收', 'success');
    }
  }

  function openActionDialog(options) {
    dialog.className = 'demand-dialog' + (options.dialogClass ? ' ' + options.dialogClass : '');
    const cancelButton = options.showCancel === false ? '' :
      '<button class="btn" type="button" data-dialog-close>' + esc(options.cancelText || '取消') + '</button>';
    const footer = options.hideFooter ? '' :
      '<div class="demand-dialog-footer">' + cancelButton + '<button class="btn ' + (options.confirmClass || 'primary') + '" type="submit" id="dialogSubmitBtn">' + esc(options.confirmText || '确认') + '</button></div>';
    dialog.innerHTML = '<form id="dialogForm" novalidate>' +
      '<div class="demand-dialog-head"><h2 id="actionDialogTitle">' + esc(options.title) + '</h2><button class="demand-dialog-close" type="button" data-dialog-close aria-label="关闭"><svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>' +
      '<div class="demand-dialog-body">' + (options.body || '') + '</div>' + footer + '</form>';
    const form = $('dialogForm');
    const submitBtn = $('dialogSubmitBtn');
    dialog.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', () => ui.closeDialog(dialog)));
    if (!options.hideFooter) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (options.onSubmit && await options.onSubmit({ form, submitBtn }) === false) return;
        ui.closeDialog(dialog);
      });
    }
    ui.openDialog(dialog);
    if (options.onMount) options.onMount({ form, submitBtn });
  }

  function receiveDemand() {
    if (demand.status !== 'pending') {
      ui.showToast('当前客户需求不是待接收状态', 'error');
      return;
    }
    const org = demand.receiveOrg || {};
    const option = (value, label) => '<option value="' + esc(value) + '"' + (value === label ? ' selected' : '') + '>' + esc(value) + '</option>';
    openActionDialog({
      title: '接收客户需求',
      body: '<p class="demand-dialog-copy">请录入 4PL 侧组织和承接主体。来源系统直连数据在接收后只读，不允许手工修改。</p>' +
        '<div class="demand-dialog-grid">' +
        '<div class="demand-dialog-field field"><label for="receiveSalesperson">业务员<span class="required">*</span></label><select id="receiveSalesperson" name="salesperson" required>' + option('苏丽蓉') + option('陈一一') + option('丁阳') + '</select><div class="ui-field-message"></div></div>' +
        '<div class="demand-dialog-field field"><label for="receiveDepartment">业务员部门<span class="required">*</span></label><select id="receiveDepartment" name="department" required>' + option('供应链物流综合部') + option('物流运营部') + '</select><div class="ui-field-message"></div></div>' +
        '<div class="demand-dialog-field field"><label for="receiveBusinessUnit">经营单位</label><input id="receiveBusinessUnit" name="businessUnit" value="' + esc(org.businessUnit || '供应链物流科技') + '" readonly></div>' +
        '<div class="demand-dialog-field field"><label for="receiveAccountingGroup">核算组<span class="required">*</span></label><select id="receiveAccountingGroup" name="accountingGroup" required>' + option('供应链物流综合核算组') + option('物流运营核算组') + '</select><div class="ui-field-message"></div></div>' +
        '<div class="demand-dialog-field field"><label for="receiveSalesmanCompany">业务员公司<span class="required">*</span></label><select id="receiveSalesmanCompany" name="salesmanCompany" required>' + option('厦门建发物流有限公司') + option('建发物流（上海）有限公司') + '</select><div class="ui-field-message"></div></div>' +
        '<div class="demand-dialog-field field"><label for="receiveOurCompany">我方公司<span class="required">*</span></label><select id="receiveOurCompany" name="ourCompany" required>' + option(demand.ourCompany || '厦门建发物流有限公司') + option('建发物流（上海）有限公司') + '</select><div class="ui-field-message"></div></div>' +
                '</div>',
      confirmText: '确认接收',
      onSubmit: async ({ form, submitBtn }) => {
        const requiredNames = ['salesperson', 'department', 'accountingGroup', 'salesmanCompany', 'ourCompany'];
        let valid = true;
        requiredNames.forEach((name) => {
          const field = form.elements[name];
          if (!field.value.trim()) {
            UIState.setFieldState(field, 'invalid', '请填写必填项');
            valid = false;
          }
        });
        if (!valid) return false;
        UIState.setButtonLoading(submitBtn, true, '接收中');
        await ui.delay(320);
        demand.receiveOrg = {
          salesperson: form.elements.salesperson.value,
          department: form.elements.department.value,
          businessUnit: form.elements.businessUnit.value,
          accountingGroup: form.elements.accountingGroup.value,
          salesmanCompany: form.elements.salesmanCompany.value
        };
        demand.ourCompany = form.elements.ourCompany.value;
        demand.status = 'received';
        demand.source.receiver = '苏丽蓉';
        demand.source.receivedAt = nowText();
        demand.timeline.push({ time: nowText(), title: '客户需求已接收', text: '苏丽蓉接收客户需求，并录入 4PL 组织信息；来源直连数据已锁定为只读。' });
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        ui.showToast('客户需求已接收，来源数据已锁定为只读', 'success');
      }
    });
  }

  function rejectDemand() {
    if (demand.status !== 'pending') {
      ui.showToast('当前客户需求不是待接收状态', 'error');
      return;
    }
    openActionDialog({
      title: '拒绝客户需求',
      body: '<p class="demand-dialog-copy">拒绝后客户需求进入已拒绝状态，不生成客户订单。</p>' +
        '<div class="demand-dialog-grid"><div class="demand-dialog-field field span-2"><label for="rejectDemandReason">拒绝原因<span class="required">*</span></label><textarea id="rejectDemandReason" name="reason" required placeholder="请填写拒绝原因"></textarea><div class="ui-field-message"></div></div></div>',
      confirmText: '确认拒绝',
      confirmClass: 'danger',
      onSubmit: async ({ form, submitBtn }) => {
        const field = form.elements.reason;
        if (!field.value.trim()) {
          UIState.setFieldState(field, 'invalid', '请填写拒绝原因');
          field.focus();
          return false;
        }
        UIState.setButtonLoading(submitBtn, true, '提交中');
        await ui.delay(300);
        demand.status = 'rejected';
        demand.source.rejector = '苏丽蓉';
        demand.source.rejectedAt = nowText();
        demand.source.rejectionReason = field.value.trim();
        demand.timeline.push({ time: nowText(), title: '客户需求已拒绝', text: '苏丽蓉拒绝客户需求：' + demand.source.rejectionReason });
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        ui.showToast('客户需求已拒绝', 'success');
      }
    });
  }

  function receiveVersion(versionNo) {
    const version = demand.versions.find((item) => item.version === versionNo);
    if (demand.status === 'completed' || demand.status === 'voided') return ui.showToast('当前需求已结束，不能接收新版本', 'error');
    if (!version || version.status !== 'pending') return ui.showToast('该版本已处理，不能重复接收', 'error');
    openActionDialog({
      title: '接收此版本',
      body: '<p class="demand-dialog-copy">接收 <strong>' + esc(version.version) + '</strong> 后立即成为当前有效版本。已生成客户订单保留原来源版本，不会自动修改。</p><div class="demand-dialog-note">同一提交版本只能接收一次。</div>',
      confirmText: '接收并生效',
      onSubmit: async ({ submitBtn }) => {
        UIState.setButtonLoading(submitBtn, true, '接收中');
        await ui.delay(350);
        demand.versions.forEach((item) => { item.isCurrent = false; });
        version.status = 'received';
        version.handledBy = '苏丽蓉';
        version.effectiveAt = nowText();
        version.isCurrent = true;
        demand.currentVersion = version.version;
        demand.status = 'received';
        demand.pickupDate = version.snapshot.pickupDate;
        demand.lines.forEach((line) => { line.required = Number(version.snapshot.quantities[line.id] || line.required); });
        demand.timeline.push({ time: version.effectiveAt, title: version.version + ' 已接收', text: '苏丽蓉接收版本 ' + version.version + '，版本即时生效。' });
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        ui.showToast(version.version + ' 已接收并生效', 'success');
      }
    });
  }

  function rejectVersion(versionNo) {
    const version = demand.versions.find((item) => item.version === versionNo);
    if (demand.status === 'completed' || demand.status === 'voided') return ui.showToast('当前需求已结束，不能拒绝版本', 'error');
    if (!version || version.status !== 'pending') return ui.showToast('该版本已处理，不能重复拒绝', 'error');
    const returnsToDraft = version.type === '版本维护' && effectiveVersions().length > 0;
    const copy = returnsToDraft
      ? '拒绝后，该新版本回到创建状态，可修改后重新提交；原有效版本历史仍保留。'
      : '拒绝后需求进入创建状态，可修改后重新提交。';
    openActionDialog({
      title: '拒绝此版本',
      body: '<p class="demand-dialog-copy">' + copy + '</p>' +
        '<div class="demand-dialog-grid"><div class="demand-dialog-field field span-2"><label for="rejectReason">拒绝原因<span class="required">*</span></label><textarea id="rejectReason" name="reason" required placeholder="请填写拒绝原因"></textarea><div class="ui-field-message"></div></div></div>',
      confirmText: '确认拒绝',
      confirmClass: 'danger',
      onSubmit: async ({ form, submitBtn }) => {
        const field = form.elements.reason;
        if (!field.value.trim()) {
          UIState.setFieldState(field, 'invalid', '请填写拒绝原因');
          field.focus();
          return false;
        }
        UIState.setButtonLoading(submitBtn, true, '拒绝中');
        await ui.delay(300);
        version.status = returnsToDraft ? 'created' : 'rejected';
        version.handledBy = '苏丽蓉';
        version.rejectionReason = field.value.trim();
        version.effectiveAt = '--';
        if (returnsToDraft) {
          demand.status = 'created';
          demand.currentVersion = version.version;
          demand.pickupDate = version.snapshot.pickupDate;
          demand.lines.forEach((line) => { line.required = Number(version.snapshot.quantities[line.id] || line.required); });
          demand.timeline.push({ time: nowText(), title: version.version + ' 已拒绝', text: '苏丽蓉拒绝：' + version.rejectionReason + '；新版本回到创建状态。' });
        } else {
          demand.status = effectiveVersions().length ? 'received' : 'created';
          demand.timeline.push({ time: nowText(), title: version.version + ' 已拒绝', text: '苏丽蓉拒绝：' + version.rejectionReason });
        }
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        ui.showToast(returnsToDraft ? '版本已拒绝，已回到创建状态' : '版本已拒绝', 'success');
      }
    });
  }

  function resubmitVersion(versionNo) {
    const version = demand.versions.find((item) => item.version === versionNo);
    if (!version || version.status !== 'rejected' || demand.status === 'completed' || demand.status === 'voided') return;
    const nextNumber = Math.max(...demand.versions.map((item) => Number(item.version.slice(1)))) + 1;
    const nextVersion = 'V' + nextNumber;
    openActionDialog({
      title: '版本维护',
      body: '<p class="demand-dialog-copy">客户需求单号保持不变。原 ' + esc(version.version) + ' 保持已拒绝，本次生成 <strong>' + nextVersion + '</strong> 并重新进入待接收。</p>',
      confirmText: '生成 ' + nextVersion,
      onSubmit: async ({ submitBtn }) => {
        UIState.setButtonLoading(submitBtn, true, '提交中');
        await ui.delay(300);
        const copy = JSON.parse(JSON.stringify(version.snapshot));
        demand.versions.push({ version: nextVersion, type: '版本维护', changeNo: 'M20261030' + String(nextNumber).padStart(3, '0'), status: 'pending', submittedAt: nowText(), handledBy: '--', effectiveAt: '--', reason: '基于已拒绝版本 ' + version.version + ' 进行版本维护', snapshot: copy });
        if (!effectiveVersions().length) {
          demand.currentVersion = nextVersion;
          demand.status = 'pending';
        }
        demand.timeline.push({ time: nowText(), title: nextVersion + ' 版本维护', text: '基于 ' + version.version + ' 生成待接收版本。' });
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        openHistory();
        ui.showToast('已生成待接收版本 ' + nextVersion, 'success');
      }
    });
  }

  function openModification() {
    if (demand.status !== 'received') return ui.showToast(statusLabels[demand.status] + '状态不能进行版本维护', 'error');
    if (pendingVersion()) return ui.showToast('已有待接收版本，请先处理', 'error');
    const lineOptions = demand.lines.map((line) => '<option value="' + esc(line.id) + '">需求行 ' + line.no + ' · ' + esc(line.name) + '</option>').join('');
    openActionDialog({
      title: '版本维护',
      body: '<p class="demand-dialog-copy">基于当前有效版本生成新版本。提交后进入待接收状态，接收后新版本生效；拒绝后新版本回到创建状态，可修改后重新提交。</p>' +
        '<div class="demand-dialog-grid">' +
        '<div class="demand-dialog-field field"><label for="modifyLine">需求行<span class="required">*</span></label><select id="modifyLine" name="line">' + lineOptions + '</select><div class="ui-field-message"></div></div>' +
        '<div class="demand-dialog-field field"><label for="modifyQty">变更后数量<span class="required">*</span></label><input id="modifyQty" name="qty" type="number" min="0" step="0.01" required><div class="ui-field-message"></div></div>' +
        '<div class="demand-dialog-field field span-2"><label for="modifyPickupDate">计划提货日期</label><input id="modifyPickupDate" name="pickupDate" type="date" value="' + esc(demand.pickupDate) + '"><div class="ui-field-message"></div></div>' +
        '<div class="demand-dialog-field field span-2"><label for="modifyReason">版本维护原因<span class="required">*</span></label><textarea id="modifyReason" name="reason" required placeholder="请说明本次版本维护原因"></textarea><div class="ui-field-message"></div></div>' +
        '</div>',
      confirmText: '提交并等待接收',
      confirmClass: 'outline-primary',
      onMount: ({ form }) => {
        const syncQty = () => {
          const line = demand.lines.find((item) => item.id === form.elements.line.value);
          form.elements.qty.value = line ? line.required : '';
        };
        syncQty();
        form.elements.line.addEventListener('change', syncQty);
      },
      onSubmit: async ({ form, submitBtn }) => {
        const reason = form.elements.reason;
        const qty = Number(form.elements.qty.value);
        if (!reason.value.trim()) {
          UIState.setFieldState(reason, 'invalid', '请填写版本维护原因');
          reason.focus();
          return false;
        }
        if (!form.elements.qty.value.trim() || !Number.isFinite(qty) || qty < 0) {
          UIState.setFieldState(form.elements.qty, 'invalid', '请输入大于等于 0 的数量');
          form.elements.qty.focus();
          return false;
        }
        UIState.setButtonLoading(submitBtn, true, '提交中');
        await ui.delay(320);
        const nextNumber = Math.max(...demand.versions.map((item) => Number(item.version.slice(1)))) + 1;
        const nextVersion = 'V' + nextNumber;
        const snapshot = JSON.parse(JSON.stringify(currentVersion().snapshot));
        snapshot.quantities[form.elements.line.value] = qty;
        snapshot.pickupDate = form.elements.pickupDate.value || snapshot.pickupDate;
        demand.versions.push({ version: nextVersion, type: '版本维护', changeNo: 'M20261030' + String(nextNumber).padStart(3, '0'), status: 'pending', submittedAt: nowText(), handledBy: '--', effectiveAt: '--', reason: reason.value.trim(), snapshot });
        demand.currentVersion = nextVersion;
        demand.status = 'pending';
        demand.timeline.push({ time: nowText(), title: nextVersion + ' 待接收', text: '客户需求版本维护已提交，等待接收或拒绝：' + reason.value.trim() });
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        ui.showToast(nextVersion + ' 已提交，等待接收', 'success');
      }
    });
  }

  function completeDemand() {
    if (demand.status !== 'received') return ui.showToast('仅执行中状态可以完成客户需求', 'error');
    openActionDialog({
      title: '完成客户需求',
      body: '<p class="demand-dialog-copy">完成后不能继续生成客户订单，客户需求信息只读；历史客户订单、合同、费用和反馈不受影响。</p>' +
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
        await ui.delay(280);
        demand.status = 'completed';
        demand.timeline.push({ time: nowText(), title: '客户需求已完成', text: '苏丽蓉完成客户需求：' + reason.value.trim() });
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        ui.showToast('客户需求已完成', 'success');
      }
    });
  }

  function hasDownstreamDocuments() {
    return demand.orders.length > 0 ||
      demand.executionFees.length > 0 ||
      demand.reconciliations.length > 0 ||
      demand.invoices.length > 0 ||
      demand.payments.length > 0;
  }

  function openHistory() {
    const body = '<p class="demand-dialog-copy">查看提交版本和流转记录。</p>' +
      '<section class="demand-history-section"><div class="demand-history-toolbar"><h3>提交版本与修改单</h3><button class="btn" id="historyExportBtn" type="button">导出变更记录</button></div>' +
      '<div class="demand-data-table-wrap"><table class="demand-data-table demand-version-table" aria-label="客户需求提交版本"><thead><tr><th>版本</th><th>提交类型</th><th>修改单号</th><th>状态</th><th>提交时间</th><th>接收/拒绝人</th><th>生效时间</th></tr></thead><tbody id="versionTableBody"></tbody></table></div></section>' +
      '<section class="demand-history-section"><div class="demand-history-toolbar"><h3>流转记录</h3></div><ol class="demand-timeline" id="timelineList"></ol></section>';
    openActionDialog({
      title: '历史版本',
      body,
      hideFooter: true,
      dialogClass: 'demand-history-dialog',
      onMount: ({ form }) => {
        renderVersions();
        renderTimeline();
        form.querySelector('#historyExportBtn')?.addEventListener('click', exportVersions);
      }
    });
  }

  function deleteDraftDemand() {
    if (demand.status !== 'created') return;
    openActionDialog({
      title: '删除客户需求',
      body: '<p class="demand-dialog-copy">删除后当前创建状态需求及未提交内容将不可恢复。已提交或已产生关联单据的需求不能删除。</p><div class="demand-dialog-note is-error">该操作不可撤销。</div>',
      confirmText: '确认删除',
      confirmClass: 'danger',
      onSubmit: async ({ submitBtn }) => {
        UIState.setButtonLoading(submitBtn, true, '删除中');
        await ui.delay(260);
        UIState.setButtonLoading(submitBtn, false);
        window.location.href = 'customer-demand-list-prototype.html' + (ui.embedded ? '?embed=1' : '');
      }
    });
  }

  function voidDemand() {
    if (demand.status !== 'received' && demand.status !== 'rejected') return;
    if (demand.status === 'received' && hasDownstreamDocuments()) {
      ui.showToast('存在关联下游单据，不能作废；请使用完结', 'error');
      return;
    }
    openActionDialog({
      title: '关闭客户需求',
      body: '<p class="demand-dialog-copy">作废是不可恢复的终态。历史版本仍可查看，但需求不能继续接收、维护版本或发起客户订单。</p>' +
        '<div class="demand-dialog-grid"><div class="demand-dialog-field field span-2"><label for="voidReason">作废原因<span class="required">*</span></label><textarea id="voidReason" name="reason" required placeholder="请填写作废原因"></textarea><div class="ui-field-message"></div></div></div>',
      confirmText: '确认作废',
      confirmClass: 'danger',
      onSubmit: async ({ form, submitBtn }) => {
        const reason = form.elements.reason;
        if (!reason.value.trim()) {
          UIState.setFieldState(reason, 'invalid', '请填写作废原因');
          reason.focus();
          return false;
        }
        UIState.setButtonLoading(submitBtn, true, '作废中');
        await ui.delay(300);
        demand.status = 'voided';
        demand.timeline.push({ time: nowText(), title: '客户需求已关闭', text: '苏丽蓉关闭客户需求：' + reason.value.trim() });
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        activateTab('overview');
        ui.showToast('客户需求已关闭', 'success');
      }
    });
  }

  function cancelCompletion() {
    if (demand.status !== 'completed') return;
    openActionDialog({
      title: '取消完结',
      body: '<p class="demand-dialog-copy">取消完结后需求恢复为执行中，版本和下游单据保持不变。请填写取消原因。</p>' +
        '<div class="demand-dialog-grid"><div class="demand-dialog-field field span-2"><label for="cancelCompleteReason">取消完结原因<span class="required">*</span></label><textarea id="cancelCompleteReason" name="reason" required placeholder="请填写取消完结原因"></textarea><div class="ui-field-message"></div></div></div>',
      confirmText: '确认取消完结',
      onSubmit: async ({ form, submitBtn }) => {
        const reason = form.elements.reason;
        if (!reason.value.trim()) {
          UIState.setFieldState(reason, 'invalid', '请填写取消完结原因');
          reason.focus();
          return false;
        }
        UIState.setButtonLoading(submitBtn, true, '处理中');
        await ui.delay(280);
        demand.status = 'received';
        demand.timeline.push({ time: nowText(), title: '取消完结', text: '苏丽蓉取消完结：' + reason.value.trim() });
        UIState.setButtonLoading(submitBtn, false);
        renderAll();
        ui.showToast('已取消完结，需求恢复为执行中', 'success');
      }
    });
  }

  function maintainVersion() {
    if (demand.status !== 'received') {
      ui.showToast(statusLabels[demand.status] + '状态不能进行版本维护', 'error');
      return;
    }
    if (pendingVersion()) {
      ui.showToast('已有待接收版本，请先处理', 'error');
      return;
    }
    const sourceVersion = currentVersion();
    const snapshot = sourceVersion
      ? JSON.parse(JSON.stringify(sourceVersion.snapshot))
      : { quantities: Object.fromEntries(demand.lines.map((line) => [line.id, line.required])), pickupDate: demand.pickupDate };
    const draft = JSON.parse(JSON.stringify(demand));
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    const day = '' + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate());
    const nextNo = 'XQ' + day + String(Math.floor(Math.random() * 9000) + 1000);
    draft.no = nextNo;
    draft.status = 'created';
    draft.parentDemandNo = demand.no;
    draft.versionMaintenanceSourceVersion = demand.currentVersion;
    draft.orders = [];
    draft.executionFees = [];
    draft.reconciliations = [];
    draft.invoices = [];
    draft.payments = [];
    draft.currentVersion = 'V1';
    draft.versions = [{
      version: 'V1',
      type: '版本维护',
      changeNo: '--',
      status: 'created',
      submittedAt: nowText(),
      handledBy: '--',
      effectiveAt: '--',
      reason: '基于当前有效版本发起版本维护',
      snapshot
    }];
    draft.timeline = [{ time: nowText(), title: '版本维护单已创建', text: '基于客户需求 ' + demand.no + ' 当前有效版本生成版本维护创建状态单。' }];
    sessionStorage.setItem('customer-demand-version-maintenance-draft', JSON.stringify(draft));
    const query = new URLSearchParams({ status: 'created', mode: 'version-maintenance', no: nextNo, from: 'customer-demand-detail-v3-prototype.html' });
    if (ui.embedded) query.set('embed', '1');
    window.location.href = 'customer-demand-detail-v3-prototype.html?' + query.toString();
  }

  function delegationSetupMarkup() {
    const orgFields = [
      ['delegationSalesperson', '业务员', '郑宇含'],
      ['delegationSalesDepartment', '业务员部门', '供应链物流综合'],
      ['delegationBusinessUnit', '业务员经营单位', '供应链物流科技'],
      ['delegationAccountingGroup', '业务员核算组', '供应链物流综合'],
      ['delegationCompany', '业务员公司', '厦门建发生物流有限公司'],
      ['delegationOperationOrganization', '作业组织', '数字化中心'],
      ['delegationOperationPerson', '作业组织人员', '黄瑞钰']
    ];
    const orgMarkup = orgFields.map(([id, label, value]) =>
      '<div class="demand-dialog-field"><label for="' + id + '">' + label + '<span class="required">*</span></label>' +
      '<input id="' + id + '" name="' + id + '" value="' + esc(value) + '" readonly></div>').join('');
    return '<section class="demand-delegation-section" aria-labelledby="delegationOrganizationTitle">' +
      '<h3 class="demand-delegation-section-title" id="delegationOrganizationTitle">组织信息</h3>' +
      '<div class="demand-delegation-grid">' + orgMarkup + '</div></section>' +
      '<section class="demand-delegation-section" aria-labelledby="delegationBaseTitle">' +
      '<h3 class="demand-delegation-section-title" id="delegationBaseTitle">委托基础信息</h3>' +
      '<div class="demand-delegation-grid">' +
      '<div class="demand-dialog-field"><label for="delegationName">物流委托名称<span class="required">*</span></label><input id="delegationName" name="delegationName" placeholder="未命名物流委托" autofocus><div class="ui-field-message"></div></div>' +
      '<div class="demand-dialog-field"><label for="delegatingCompany">委托方法人公司<span class="required">*</span></label><input id="delegatingCompany" name="delegatingCompany" value="厦门建发生物流有限公司"><div class="ui-field-message"></div></div>' +
      '<div class="demand-dialog-field"><label for="delegationType">运输委托类型<span class="required">*</span></label><select id="delegationType" name="delegationType"><option>我司委托-已准入供应商</option><option>客户指定供应商</option><option>临时供应商</option></select><div class="ui-field-message"></div></div>' +
      '<div class="demand-dialog-field"><label for="logisticsSupplier">物流供应商</label><input id="logisticsSupplier" name="logisticsSupplier" value="中联铁运集团有限公司"><div class="ui-field-message"></div></div>' +
      '<div class="demand-dialog-field"><label for="supplierMerchant">供应商商户</label><input id="supplierMerchant" name="supplierMerchant" value="中联铁运集团有限公司"><div class="ui-field-message"></div></div>' +
      '</div></section>' +
      '<section class="demand-delegation-section" aria-labelledby="delegationTaskTitle">' +
      '<div class="demand-delegation-section-heading"><h3 class="demand-delegation-section-title" id="delegationTaskTitle">任务信息</h3><span class="demand-muted">选择后将为你自动创建首个运输任务</span></div>' +
      '<div class="demand-delegation-grid demand-delegation-task-grid">' +
      '<div class="demand-dialog-field"><label for="firstTaskTransportType">首段运输任务类型<span class="required">*</span></label><select id="firstTaskTransportType" name="firstTaskTransportType"><option>水运</option><option>汽运</option><option>铁运</option><option>空运</option></select><div class="ui-field-message"></div></div>' +
      '<div class="demand-dialog-field"><label for="delegationShippingCategory">装运类别<span class="required">*</span></label><select id="delegationShippingCategory" name="delegationShippingCategory"><option>件杂货</option><option>散货</option><option>集装箱</option></select><div class="ui-field-message"></div></div>' +
      '</div></section>';
  }
  function openSplitArrangementModal(kind) {
    const isDelegation = kind === 'delegation';
    const targetName = isDelegation ? '物流委托' : '物流需求';
    const setupMarkup = isDelegation ? delegationSetupMarkup() : '';
    const body = '<p class="demand-dialog-copy">请按商品拆分本次' + targetName + '安排数量，可点击“拆分”继续拆分同一商品。</p>' +
      setupMarkup +
      '<div class="demand-form-subhead"><span>商品拆分</span><span class="demand-muted">按商品设置本次安排数量</span></div>' +
      '<div class="demand-data-table-wrap"><table class="demand-compare-table" id="arrangementTable"><thead><tr><th>商品/服务</th><th>规格</th><th>需求数量</th><th>本次安排数量</th><th>操作</th></tr></thead><tbody>' +
      demand.lines.map((line) =>
        '<tr data-line-id="' + esc(line.id) + '"><td>' + esc(line.name) + '</td><td>' + esc(line.spec) + '</td>' +
        '<td>' + line.required + ' ' + esc(line.unit) + '</td>' +
        '<td><input class="arrangement-qty" type="number" min="0" step="0.01" value="' + line.required + '" aria-label="' + esc(line.name) + '安排数量"></td>' +
        '<td><button class="btn link" type="button" data-split-line>拆分</button><button class="btn link demand-danger" type="button" data-remove-line hidden>移除</button></td></tr>'
      ).join('') +
      '</tbody></table></div><div class="demand-dialog-note" id="arrangementSummary">按当前数量生成 1 条' + targetName + '。</div>' +
      '<div class="demand-dialog-grid demand-dialog-grid--spaced"><div class="demand-dialog-field field span-2"><label for="arrangementNote">安排说明</label><textarea id="arrangementNote" name="note" placeholder="请输入商品拆分或安排说明"></textarea><div class="ui-field-message"></div></div></div>';

    openActionDialog({
      title: '拆分商品并生成' + targetName,
      body,
      confirmText: '确认生成' + targetName,
      dialogClass: isDelegation ? 'demand-delegation-dialog' : '',
      onMount: ({ form }) => {
        if (isDelegation) form.addEventListener('input', (event) => UIState.clearFieldState(event.target));
        const table = $('arrangementTable');
        const summary = $('arrangementSummary');
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
        if (isDelegation) {
          const requiredFields = [
            ['delegationName', '请填写物流委托名称'],
            ['delegatingCompany', '请填写委托方法人公司'],
            ['delegationType', '请选择运输委托类型'],
            ['firstTaskTransportType', '请选择首段运输任务类型'],
            ['delegationShippingCategory', '请选择装运类别']
          ];
          for (const [name, message] of requiredFields) {
            const field = form.elements[name];
            if (!field || !String(field.value || '').trim()) {
              UIState.setFieldState(field, 'invalid', message);
              field.focus();
              return false;
            }
          }
        }
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
        const delegationName = isDelegation ? form.elements.delegationName.value.trim() : '';
        const firstTaskTransportType = isDelegation ? form.elements.firstTaskTransportType.value : '';
        const delegationShippingCategory = isDelegation ? form.elements.delegationShippingCategory.value : '';
        demand.timeline.push({
          time: nowText(),
          title: '已生成' + targetName,
          text: '商品拆分完成，生成' + targetName + ' ' + generatedNo + '。' +
            (isDelegation ? '委托名称：' + delegationName + '；首段任务：' + firstTaskTransportType + ' · ' + delegationShippingCategory + '。' : '')
        });
        renderTimeline();
        UIState.setButtonLoading(submitBtn, false);
        ui.showToast(targetName + ' ' + generatedNo + ' 已生成', 'success');
      }
    });
  }

  function openCreateOrder() {
    if (demand.status !== 'received' || !currentVersion()) {
      ui.showToast('当前需求没有可用的有效版本，不能发起客户订单', 'error');
      return;
    }
    const query = new URLSearchParams({
      mode: 'create',
      from: 'customer-demand-detail-v3-prototype.html',
      demandNo: demand.no
    });
    if (ui.embedded) query.set('embed', '1');
    window.location.href = 'customer-order-detail-prototype.html?' + query.toString();
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
      ['我方公司', demand.ourCompany],
      ['来源系统', demand.source.system],
      ['来源类型', demand.source.type],
      ['来源单号', demand.source.no],
      ['需求状态', statusLabels[demand.status]],
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

  function handleMoreMenu() {
    const menu = $('moreMenu');
    menu.hidden = !menu.hidden;
    $('moreBtn').setAttribute('aria-expanded', String(!menu.hidden));
  }

  function handlePrimaryAction() {
    if (demand.status === 'created') return submitCreatedDemand('submit');
    if (demand.status === 'pending') {
      const pending = pendingVersion();
      if (pending) receiveVersion(pending.version);
      return;
    }
    if (demand.status === 'received') return openCreateOrder();
    if (demand.status === 'rejected') {
      const rejected = demand.versions.filter((version) => version.status === 'rejected').slice(-1)[0];
      if (rejected) resubmitVersion(rejected.version);
    }
  }

  function handleSecondaryAction() {
    if (demand.status === 'pending') {
      const pending = pendingVersion();
      if (pending) rejectVersion(pending.version);
      return;
    }
    if (demand.status === 'received') {
      if (pendingVersion()) {
        openHistory();
        ui.showToast('请先处理待接收版本 ' + pendingVersion().version, 'error');
      } else {
        openModification();
      }
    }
  }

  function bindTabs() {
    const buttons = [$('overviewTab'), $('ordersTab'), $('financeTab')];
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activateTab(button.id.replace('Tab', '')));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = buttons.length - 1;
        buttons[nextIndex].focus();
        activateTab(buttons[nextIndex].id.replace('Tab', ''));
      });
    });


  }

  function bindEvents() {
    bindTabs();
    if ($('saveCreatedBtn')) $('saveCreatedBtn').addEventListener('click', () => saveCreateDraft(false, false));
    if ($('submitCreatedBtn')) $('submitCreatedBtn').addEventListener('click', () => submitCreatedDemand('submit'));
    if ($('deleteCreatedBtn')) $('deleteCreatedBtn').addEventListener('click', deleteDraftDemand);
    if ($('receivePendingBtn')) $('receivePendingBtn').addEventListener('click', () => {
      const pending = pendingVersion();
      if (pending && pending.type === '版本维护') receiveVersion(pending.version);
      else receiveDemand();
    });
    if ($('rejectPendingBtn')) $('rejectPendingBtn').addEventListener('click', () => {
      const pending = pendingVersion();
      if (pending && pending.type === '版本维护') rejectVersion(pending.version);
      else rejectDemand();
    });
    if ($('startCustomerOrderBtn')) $('startCustomerOrderBtn').addEventListener('click', openCreateOrder);
    if ($('modifyBtn')) $('modifyBtn').addEventListener('click', maintainVersion);
    if ($('historyBtn')) $('historyBtn').addEventListener('click', openHistory);
    if ($('completeDemandBtn')) $('completeDemandBtn').addEventListener('click', completeDemand);
    if ($('exportDemandBtn')) $('exportDemandBtn').addEventListener('click', exportDemand);
    if ($('moreBtn')) $('moreBtn').addEventListener('click', (event) => {
      event.stopPropagation();
      handleMoreMenu();
    });
    if ($('moreMenu')) $('moreMenu').addEventListener('click', () => {
      $('moreMenu').hidden = true;
      $('moreBtn').setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('click', (event) => {
      if ($('moreMenu')) $('moreMenu').hidden = true;
      if ($('moreBtn')) $('moreBtn').setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if ($('moreMenu')) $('moreMenu').hidden = true;
        if ($('moreBtn')) $('moreBtn').setAttribute('aria-expanded', 'false');
      }
    });

    $('createDemandForm').addEventListener('input', (event) => {
      const control = event.target;
      if (control.getAttribute('aria-invalid') === 'true' && (control.type === 'checkbox' || control.value.trim())) {
        UIState.clearFieldState(control);
      }
      if (control.matches('.quote-price, .quote-qty, .quote-exchange')) {
        const row = control.closest('[data-quote-row]');
        const price = Number(row.querySelector('.quote-price').value || 0);
        const quantity = Number(row.querySelector('.quote-qty').value || 0);
        const exchangeRate = Number(row.querySelector('.quote-exchange').value || 1);
        const quoteAmount = price * quantity;
        row.querySelector('.quote-amount').value = quoteAmount.toFixed(2);
        row.querySelector('.quote-local-amount').value = (quoteAmount * exchangeRate).toFixed(2);
      }
    });
    $('createDemandForm').addEventListener('change', (event) => {
      if (['serviceScopes', 'serviceItems', 'shippingCategories'].includes(event.target.name)) updateTransportTypeVisibility();
      if (['originPort', 'destinationPort'].includes(event.target.name)) updatePortRegions();
      if (['serviceScopes', 'serviceItems', 'shippingCategories'].includes(event.target.name)) {
        const field = event.target.closest('.field');
        if (field) field.classList.remove('is-invalid');
      }
    });
    $('createDemandForm').addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !['TEXTAREA', 'BUTTON'].includes(event.target.tagName)) {
        event.preventDefault();
        submitCreatedDemand('submit');
      }
    });

    if ($('addEmailRecipientBtn')) {
      const setEmailPopoverOpen = (open) => {
        $('emailRecipientPopover').hidden = !open;
        $('addEmailRecipientBtn').setAttribute('aria-expanded', String(open));
        if (open) $('emailRecipientDraftName').focus();
      };
      $('addEmailRecipientBtn').addEventListener('click', () => {
        setEmailPopoverOpen($('emailRecipientPopover').hidden);
      });
      $('confirmEmailRecipientBtn').addEventListener('click', () => {
        const name = $('emailRecipientDraftName').value.trim();
        const email = $('emailRecipientDraftEmail').value.trim();
        if (!name || !email) {
          ui.showToast('请填写邮件接收人姓名和邮箱', 'error');
          (!name ? $('emailRecipientDraftName') : $('emailRecipientDraftEmail')).focus();
          return;
        }
        const recipients = normalizedContactEmailRecipients().slice();
        if (recipients.some((recipient) => recipient.email.toLowerCase() === email.toLowerCase())) {
          ui.showToast('该邮箱已添加', 'error');
          $('emailRecipientDraftEmail').focus();
          return;
        }
        recipients.push({ name, email });
        demand.contactEmailRecipients = recipients;
        demand.contactEmail = recipients[0]?.email || '';
        renderContactEmailRecipients(recipients);
        setEmailPopoverOpen(false);
        $('addEmailRecipientBtn').focus();
      });
      $('cancelEmailRecipientBtn').addEventListener('click', () => {
        $('emailRecipientDraftName').value = '';
        $('emailRecipientDraftEmail').value = '';
        setEmailPopoverOpen(false);
        $('addEmailRecipientBtn').focus();
      });
      document.addEventListener('click', (event) => {
        if (!event.target.closest('#contactEmailRecipientsField') && !$('emailRecipientPopover').hidden) setEmailPopoverOpen(false);
      });
    }
    if ($('createEmailRecipientList')) {
      $('createEmailRecipientList').addEventListener('click', (event) => {
        const remove = event.target.closest('[data-remove-email-recipient]');
        if (!remove) return;
        const index = Number(remove.dataset.emailRecipientIndex);
        const recipients = normalizedContactEmailRecipients().slice();
        recipients.splice(index, 1);
        demand.contactEmailRecipients = recipients;
        demand.contactEmail = recipients[0]?.email || '';
        renderContactEmailRecipients(recipients);
      });
    }

    $('addCreateProductBtn').addEventListener('click', () => {
      readCreateForm();
      demand.lines.push({ id: 'L' + Date.now(), no: demand.lines.length + 1, tradeContractNo: '', tradeContractType: '', name: '', nameEn: '', description: '', specDimensions: '', spec: '', unit: '吨', required: 0, pieceWeight: 0, pieceWeightUnit: 'kg', overRate: 0, underRate: 0, goodsValueUnitPrice: 0, goodsValueAmount: 0, goodsValueCurrency: 'CNY', packageQuantity: 0, packageUnit: '件' });
      renderCreateProductRows();
      const last = $('createProductBody').lastElementChild;
      if (last) last.querySelector('.product-name').focus();
    });
    $('createProductBody').addEventListener('click', (event) => {
      const editDescription = event.target.closest('[data-edit-product-description]');
      if (editDescription) {
        openProductDescriptionEditor(editDescription.closest('[data-product-row]').dataset.lineId);
        return;
      }
      const remove = event.target.closest('[data-remove-product]');
      if (!remove) return;
      if (document.querySelectorAll('#createProductBody [data-product-row]').length <= 1) return ui.showToast('至少保留一条商品信息', 'error');
      readCreateForm();
      const row = remove.closest('[data-product-row]');
      demand.lines = demand.lines.filter((line) => line.id !== row.dataset.lineId).map((line, index) => Object.assign({}, line, { no: index + 1 }));
      renderCreateProductRows();
    });
    const syncProductDerivedFields = (event) => {
      const row = event.target.closest('[data-product-row]');
      if (!row) return;
      if (event.target.matches('.product-name, .product-qty, .goods-value-price')) syncProductRowDerived(row);
    };
    $('createProductBody').addEventListener('input', syncProductDerivedFields);
    $('createProductBody').addEventListener('change', syncProductDerivedFields);
    const addQuoteLine = (direction, bodyId) => {
      readCreateForm();
      demand.quote.lines.push({ id: 'Q' + Date.now(), feeItem: '', direction, taxRate: 6, quotePrice: 0, currency: 'CNY', quantity: 1, unit: '票', quoteAmount: 0, exchangeRate: 1, localAmount: 0, source: '人工录入', remark: '--' });
      renderCreateQuoteRows();
      const last = $(bodyId).lastElementChild;
      if (last) last.querySelector('.quote-item')?.focus();
    };
    if ($('addReceivableQuoteBtn')) $('addReceivableQuoteBtn').addEventListener('click', () => addQuoteLine('应收', 'createReceivableQuoteBody'));
    if ($('addPayableQuoteBtn')) $('addPayableQuoteBtn').addEventListener('click', () => addQuoteLine('应付', 'createPayableQuoteBody'));
    [$('createReceivableQuoteBody'), $('createPayableQuoteBody')].filter(Boolean).forEach((body) => {
      body.addEventListener('click', (event) => {
        const remove = event.target.closest('[data-remove-quote]');
        if (!remove) return;
        readCreateForm();
        const row = remove.closest('[data-quote-row]');
        demand.quote.lines = demand.quote.lines.filter((line) => line.id !== row.dataset.quoteId);
        renderCreateQuoteRows();
      });
    });


    $('orderListBody').addEventListener('click', (event) => {
      const feedbackLink = event.target.closest('[data-order-feedback]');
      if (feedbackLink) {
        const order = demand.orders.find((item) => item.id === feedbackLink.dataset.orderFeedback);
        if (order) storeFeedbackSnapshot(order);
        return;
      }
      const contractButton = event.target.closest('[data-view-contract]');
      if (contractButton) {
        const order = demand.orders.find((item) => item.id === contractButton.dataset.viewContract);
        if (order) openContractDialog(order);
        return;
      }
      const logisticsButton = event.target.closest('[data-view-logistics]');
      if (!logisticsButton) return;
      const order = demand.orders.find((item) => item.id === logisticsButton.dataset.viewLogistics);
      if (order) openLogisticsDrawer(order);
    });
    ['financeFeeDirection', 'financeFeeOrder'].forEach((id) => {
      if ($(id)) $(id).addEventListener('change', renderFinance);
    });
   document.addEventListener('click', (event) => {
      const attachment = event.target.closest('[data-attachment]');
      if (attachment) ui.showToast('已在原型中模拟打开附件：' + attachment.dataset.attachment, 'success');
      const related = event.target.closest('[data-related-doc]');
      if (related) ui.showToast('已在原型中模拟查看：' + related.dataset.relatedDoc, 'success');
      const emptyAction = event.target.closest('[data-empty-action]');
      if (emptyAction) {
        if (emptyAction.dataset.emptyAction === 'create-order') openCreateOrder();
      }
      const financeAction = event.target.closest('[data-finance-action]');
      if (financeAction) {
        ui.showToast('已在原型中模拟打开对账记录：' + financeAction.dataset.lineId, 'success');
      }
    });

    $('topRefreshBtn').addEventListener('click', () => window.location.reload());
    $('topExternalBtn').addEventListener('click', () => {
      const standalone = window.location.href.replace(/[?&]embed=1/, '');
      window.open(ui.embedded ? standalone : window.location.href, '_blank', 'noopener');
    });
    $('backToListBtn').addEventListener('click', () => {
      if (params.get('from') && window.history.length > 1) {
        window.history.back();
        return;
      }
      window.location.href = 'customer-demand-list-prototype.html' + (ui.embedded ? '?embed=1' : '');
    });
  }

  function init() {
    if (demand.status === 'created') {
      const form = $('createDemandForm');
      dirtyState = UIState.watchDirty(form, $('demandDirtyIndicator'));
    }
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'close-demand-panorama') {
        ui.closeDialog($('logisticsDrawer'));
      }
    });
    bindEvents();
    renderAll();
    activateTab('overview');
    setTimeout(() => ui.notifyParent('customer-demand-detail', 'detail'), 0);
  }

  init();
})();
