/* Customer-facing fulfillment feedback for a liner breakbulk order. */
(function () {
  'use strict';

  const page = window.OrderDetailPage;
  if (!page || !page.record) return;

  const record = page.record;
  const orderNo = page.no;
  const root = document.documentElement;
  const params = new URLSearchParams(window.location.search);
  const nodeOrder = ['booking', 'vessel', 'loading', 'acceptance', 'settlement', 'archive'];
  const stateTone = {
    complete: { label: '已完成', className: 'is-complete' },
    active: { label: '进行中', className: 'is-active' },
    pending: { label: '未开始', className: '' },
    warning: { label: '待确认', className: 'is-warning' },
    error: { label: '异常', className: 'is-error' }
  };

  const demoFeedback = {
    version: 'V1.2',
    releaseState: '待反馈',
    updatedAt: '2026-11-12 16:22',
    steps: [
      {
        key: 'booking', title: '订舱确认', status: 'complete', time: '10-28 14:20',
        sections: [
          { title: '订舱信息', fields: [
            ['订舱单号', 'CFL-ZC2026LX0930'], ['订舱货代', 'LYNUX SHIPPING LIMITED'],
            ['分类', 'LX'], ['订舱状态', '已订舱'],
            ['订舱经理', '王静玲'], ['操作员', '陈倚榕'],
            ['订舱数量', '300.00 台'], ['未订舱数量', '0'],
            ['CQD', '是'], ['LAYCAN', '2026-10-25 ~ 11-11'], ['是否含绑', '是']
          ] }
        ],
        docs: [['订舱确认书.pdf', '2026-10-28']]
      },
      {
        key: 'vessel', title: '宣船及航次确认', status: 'complete', time: '10-29 10:10',
        sections: [
          { title: '船舶及航次信息', fields: [
            ['船名', 'ORCHID LUNDU'], ['航次', 'V.2604E'],
            ['IMO', '1027328'], ['MMSI', '352005206'],
            ['建造日期', '2018-06-15'], ['吃水', '9.8 m'],
            ['LAYCAN', '2026-10-25 ~ 11-11'], ['宣船情况', '已宣船'],
            ['宣船备注', '请与业务确认是否加保'], ['航线', '东南亚'],
            ['运费条款', 'FILO']
          ] }
        ],
        docs: [['宣船确认.pdf', '2026-10-29']]
      },
      {
        key: 'loading', title: '到港/靠泊/装船/离港', status: 'active', time: '11-01 14:30',
        sections: [
          { title: '起运港信息', fields: [
            ['状态', '进行中'], ['港区', '天津新兴建材码头'],
            ['地面货代', '工厂'], ['装港代理', 'TIANJIN(JC) AGENT'],
            ['ETA', '2026-11-03 08:00'], ['ATA', '待回填', true],
            ['ETB', '2026-11-03 14:00'], ['ATB', '待回填', true],
            ['ETD', '2026-11-04 18:00'], ['ATD', '待回填', true],
            ['装船完成时间', '待回填', true]
          ], table: {
            title: '商品明细列表',
            columns: ['商品名称', '装船标准数量', '标准单位', '提单号', '舱位', '客户订单号'],
            rows: [
              ['重卡卡车', '180.00', '台', 'LYX-QD-2604E-01', '1舱', orderNo],
              ['重卡卡车', '120.00', '台', 'LYX-QD-2604E-02', '2舱', orderNo]
            ]
          } },
          { title: '目的港信息', fields: [
            ['卸港', '东非蒙巴萨港'], ['卸港代理', 'Mombasa Shipping Agency'],
            ['ETA', '2026-11-21 09:00'], ['ATA', '待回填', true],
            ['ETB', '2026-11-21 15:00'], ['ATB', '待回填', true],
            ['ETD', '2026-11-23 18:00'], ['ATD', '待回填', true],
            ['水尺数', '待回填', true], ['卸船完成时间', '待回填', true]
          ], table: {
            title: '商品明细列表',
            columns: ['商品名称', '卸船标准数量', '标准单位', '客户订单号'],
            rows: [['重卡卡车', '300.00', '台', orderNo]]
          } }
        ],
        docs: [['靠泊计划.pdf', '2026-11-01'], ['装船作业计划.pdf', '2026-11-01']]
      },
      {
        key: 'acceptance', title: '验收', status: 'pending', time: '待装港完成',
        sections: [
          { title: '验收信息', fields: [
            ['验收状态', '待申请'], ['验收申请备注', '待到港/靠泊/装船/离港完成后提交'],
            ['验收申请提交时间', '待补充', true], ['验收申请提交人', '待补充', true],
            ['验收处理时间', '待补充', true], ['验收处理说明', '待补充', true]
          ], table: {
            title: '验收商品清单',
            columns: ['贸易合同号', '商品中文名', '已反馈数量', '待验收数量', '标准单位', '目的地'],
            rows: [
              ['HT2026-0821', '重卡卡车', '180.00', '180.00', '台', '东非蒙巴萨港'],
              ['HT2026-0821', '重卡卡车', '120.00', '120.00', '台', '东非蒙巴萨港']
            ]
          } }
        ],
        docs: []
      },      {
        key: 'settlement', title: '费用结算', status: 'pending', time: '待装船后核算',
        sections: [
          { title: '运费', fields: [
            ['运费单价', 'USD 27.00 / 计费吨'], ['计费依据', '按提单计费吨'],
            ['预估运费总价', '待核算', true], ['其他费用', '待业务确认', true]
          ] },
          { title: '结算与发票', fields: [
            ['币种', 'USD'], ['账期', '装船后 30 天'],
            ['发票号', '待开票', true], ['付款状态', '未开始']
          ] },
          { title: '风险条款', fields: [
            ['延滞费', 'USD 25,000.00 / 天'], ['责任方', '按合同约定'],
            ['CQD', '是'], ['复核状态', '待财务复核', true]
          ] }
        ],
        docs: []
      },
      {
        key: 'archive', title: '单证归档', status: 'pending', time: '待交付完成',
        sections: [
          { title: '单证清单', fields: [
            ['订舱确认书', '已归档'], ['提单', '待签发'],
            ['舱单', '待归档'], ['SOF / POD', '待归档']
          ] },
          { title: '归档信息', fields: [
            ['归档状态', '部分完成'], ['归档时间', '待回填', true],
            ['版本', 'V1.2'], ['归档人', '刘婷']
          ] }
        ],
        docs: [['订舱确认书.pdf', '已归档'], ['宣船确认.pdf', '已归档']]
      }
    ],
    records: [
      ['2026-11-01 14:30', '到港/靠泊/装船/离港信息已更新', '补充起运港、目的港和商品明细，等待船东回填实际时间。', '庄巧玲 · V1.2'],
      ['2026-10-31 17:10', '代理及港口信息已补齐', '补充装港代理、卸港代理及联系方式。', '陈倚榕 · V1.1'],
      ['2026-10-29 10:20', '船名航次确认', '船东确认 ORCHID LUNDU / V.2604E，客户已查看。', '庄巧玲 · V1.0']
    ]
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function updateStepFieldInSection(steps, stepKey, sectionIndex, label, value) {
    const step = steps.find((item) => item.key === stepKey);
    const section = step && step.sections && step.sections[sectionIndex];
    if (!section) return;
    const field = section.fields.find((item) => item[0] === label);
    if (field) { field[1] = value; field[2] = false; }
  }

  const routeMainSteps = demoFeedback.steps;
  const routeFeederSteps = clone(demoFeedback.steps);
  updateStepFieldInSection(routeFeederSteps, 'booking', 0, '订舱单号', 'BK-TJ-SH-20261026');
  updateStepFieldInSection(routeFeederSteps, 'booking', 0, '订舱货代', '中远海运集运');
  updateStepFieldInSection(routeFeederSteps, 'booking', 0, '订舱状态', '已订舱');
  updateStepFieldInSection(routeFeederSteps, 'booking', 0, '订舱数量', '300.00 台');
  updateStepFieldInSection(routeFeederSteps, 'vessel', 0, '船名', 'XIN MING ZHOU 88');
  updateStepFieldInSection(routeFeederSteps, 'vessel', 0, '航次', 'V.1203S');
  updateStepFieldInSection(routeFeederSteps, 'vessel', 0, 'IMO', '9876543');
  updateStepFieldInSection(routeFeederSteps, 'vessel', 0, 'MMSI', '413000000');
  updateStepFieldInSection(routeFeederSteps, 'vessel', 0, 'LAYCAN', '2026-10-26 ~ 10-28');
  updateStepFieldInSection(routeFeederSteps, 'vessel', 0, '宣船情况', '已宣船');
  updateStepFieldInSection(routeFeederSteps, 'vessel', 0, '宣船备注', '支线船已确认');
  updateStepFieldInSection(routeFeederSteps, 'vessel', 0, '航线', '中国沿海支线');
  updateStepFieldInSection(routeFeederSteps, 'loading', 0, '状态', '已完成');
  updateStepFieldInSection(routeFeederSteps, 'loading', 0, '港区', '天津港');
  updateStepFieldInSection(routeFeederSteps, 'loading', 0, '地面货代', '天津港物流');
  updateStepFieldInSection(routeFeederSteps, 'loading', 0, '装港代理', '天津外代');
  updateStepFieldInSection(routeFeederSteps, 'loading', 0, 'ETA', '2026-10-28 08:00');
  updateStepFieldInSection(routeFeederSteps, 'loading', 0, 'ATA', '2026-10-28 07:40');
  updateStepFieldInSection(routeFeederSteps, 'loading', 0, 'ETB', '2026-10-28 10:00');
  updateStepFieldInSection(routeFeederSteps, 'loading', 0, 'ATB', '2026-10-28 09:50');
  updateStepFieldInSection(routeFeederSteps, 'loading', 0, 'ETD', '2026-10-28 18:00');
  updateStepFieldInSection(routeFeederSteps, 'loading', 0, 'ATD', '2026-10-28 17:45');
  updateStepFieldInSection(routeFeederSteps, 'loading', 0, '装船完成时间', '2026-10-28 16:30');
  updateStepFieldInSection(routeFeederSteps, 'loading', 1, '卸港', '上海港');
  updateStepFieldInSection(routeFeederSteps, 'loading', 1, '卸港代理', '上海外代');
  updateStepFieldInSection(routeFeederSteps, 'loading', 1, 'ETA', '2026-11-01 09:00');
  updateStepFieldInSection(routeFeederSteps, 'loading', 1, 'ATA', '2026-11-01 08:50');
  updateStepFieldInSection(routeFeederSteps, 'loading', 1, 'ETB', '2026-11-01 11:00');
  updateStepFieldInSection(routeFeederSteps, 'loading', 1, 'ATB', '2026-11-01 10:45');
  updateStepFieldInSection(routeFeederSteps, 'loading', 1, 'ETD', '2026-11-01 18:00');
  updateStepFieldInSection(routeFeederSteps, 'loading', 1, 'ATD', '2026-11-01 17:30');
  updateStepFieldInSection(routeFeederSteps, 'loading', 1, '水尺数', '9.2 m');
  updateStepFieldInSection(routeFeederSteps, 'loading', 1, '卸船完成时间', '2026-11-01 14:20');
  updateStepFieldInSection(routeFeederSteps, 'acceptance', 0, '验收状态', '已通过');
  updateStepFieldInSection(routeFeederSteps, 'acceptance', 0, '验收申请提交时间', '2026-11-01 15:00');
  updateStepFieldInSection(routeFeederSteps, 'acceptance', 0, '验收申请提交人', '庄巧玲');
  updateStepFieldInSection(routeFeederSteps, 'acceptance', 0, '验收处理时间', '2026-11-01 16:20');
  updateStepFieldInSection(routeFeederSteps, 'acceptance', 0, '验收处理说明', '支线运费及港口作业已完成验收');
  const feederLoading = routeFeederSteps.find((step) => step.key === 'loading');
  if (feederLoading) {
    feederLoading.sections[0].table.rows = [
      ['重卡卡车', '180.00', '台', 'ZD-TJ-SH-01', '1舱', orderNo],
      ['重卡卡车', '120.00', '台', 'ZD-TJ-SH-02', '2舱', orderNo]
    ];
    feederLoading.sections[1].table.rows = [['重卡卡车', '300.00', '台', orderNo]];
  }
  const feederAcceptance = routeFeederSteps.find((step) => step.key === 'acceptance');
  if (feederAcceptance) {
    feederAcceptance.sections[0].table.title = '验收商品清单';
    feederAcceptance.sections[0].table.columns = ['贸易合同号', '商品中文名', '已反馈数量', '待验收数量', '标准单位', '目的地'];
    feederAcceptance.sections[0].table.rows = [
      ['HT2026-0821', '重卡卡车', '180.00', '180.00', '台', '上海港'],
      ['HT2026-0821', '重卡卡车', '120.00', '120.00', '台', '上海港']
    ];
  }
  const feederTimes = { booking: '10-26 09:10', vessel: '10-26 15:30', loading: '10-28 18:10', acceptance: '11-01 16:20', settlement: '11-03 10:00', archive: '11-03 11:20' };
  routeFeederSteps.forEach((step) => { step.status = 'complete'; step.time = feederTimes[step.key] || step.time; });

  demoFeedback.routes = [
    { id: 'route-main', name: '天津新兴建材码头 → 东非蒙巴萨港', origin: '天津新兴建材码头', destination: '东非蒙巴萨港', transportType: '水运', shipmentCategory: '件杂货', mode: '水运 · 件杂货', status: 'active', statusText: '进行中', activeNode: 'loading', steps: routeMainSteps, source: null },
    { id: 'route-feeder', name: '天津港 → 上海港', origin: '天津港', destination: '上海港', transportType: '水运', shipmentCategory: '件杂货', mode: '水运 · 件杂货', status: 'complete', statusText: '已完成', activeNode: 'archive', steps: routeFeederSteps, source: null }
  ];
  demoFeedback.currentRouteId = 'route-main';

  const supplierFeedbackOptions = [
    {
      id: 'SF001', entrustNo: 'FLMT202610130007（V1.0）', taskNo: 'T15', taskName: '水运集装箱任务',
      routeId: 'route-main', routeName: '天津新兴建材码头 → 东非蒙巴萨港',
      supplier: '中联铁运集团有限公司', feedbackTime: '2026-11-01 14:20', status: '执行中', statusTone: 'active',
      summary: '已确认 11-03 到港及 11-03 14:00 靠泊计划，装船完成时间待回填。',
      details: [['船名 / 航次', 'ORCHID LUNDU / V.2604E'], ['装港', '天津新兴建材码头'], ['卸港', '东非蒙巴萨港'], ['预计离港', '2026-11-04 18:00']],
      fields: {
        booking: { '订舱单号': 'CFL-ZC2026LX0930', '订舱货代': 'LYNUX SHIPPING LIMITED', '订舱状态': '已订舱', '订舱数量': '300.00 台', 'CQD': '是', 'LAYCAN': '2026-10-25 ~ 11-11', '是否含绑': '是' },
        vessel: { '船名': 'ORCHID LUNDU', '航次': 'V.2604E', 'IMO': '1027328', 'MMSI': '352005206', 'LAYCAN': '2026-10-25 ~ 11-11', '宣船情况': '已宣船' },
        loadingOrigin: { '状态': '进行中', '港区': '天津新兴建材码头', '地面货代': '天津港物流', '装港代理': 'TIANJIN(JC) AGENT', 'ETA': '2026-11-03 08:00', 'ATA': '2026-11-03 07:40', 'ETB': '2026-11-03 14:00', 'ATB': '2026-11-03 13:30', 'ETD': '2026-11-04 18:00', 'ATD': '待回填', '装船完成时间': '待回填' },
        loadingDestination: { '卸港': '东非蒙巴萨港', '卸港代理': 'Mombasa Shipping Agency', 'ETA': '2026-11-21 09:00', 'ATA': '待回填', 'ETB': '2026-11-21 15:00', 'ATB': '待回填', 'ETD': '2026-11-23 18:00', 'ATD': '待回填', '水尺数': '待回填', '卸船完成时间': '待回填' }
      }
    },
    {
      id: 'SF002', entrustNo: 'FLMT202610130008（V1.0）', taskNo: 'T16', taskName: '水运支线任务',
      routeId: 'route-feeder', routeName: '天津港 → 上海港',
      supplier: '厦门明通和供应链有限公司', feedbackTime: '2026-10-28 18:20', status: '已完成', statusTone: 'complete',
      summary: '支线船已离港，实际 ATD 2026-10-28 17:45，预计 11-01 到达上海港。',
      details: [['船名 / 航次', 'XIN MING ZHOU 88 / V.1203S'], ['装港', '天津港'], ['卸港', '上海港'], ['实际离港', '2026-10-28 17:45']],
      fields: {
        booking: { '订舱单号': 'BK-TJ-SH-20261026', '订舱货代': '中远海运集运', '订舱状态': '已订舱', '订舱数量': '300.00 台', 'CQD': '是', 'LAYCAN': '2026-10-26 ~ 10-28', '是否含绑': '是' },
        vessel: { '船名': 'XIN MING ZHOU 88', '航次': 'V.1203S', 'IMO': '9876543', 'MMSI': '413000000', 'LAYCAN': '2026-10-26 ~ 10-28', '宣船情况': '已宣船' },
        loadingOrigin: { '状态': '已完成', '港区': '天津港', '地面货代': '天津港物流', '装港代理': '天津外代', 'ETA': '2026-10-28 08:00', 'ATA': '2026-10-28 07:40', 'ETB': '2026-10-28 10:00', 'ATB': '2026-10-28 09:50', 'ETD': '2026-10-28 18:00', 'ATD': '2026-10-28 17:45', '装船完成时间': '2026-10-28 16:30' },
        loadingDestination: { '卸港': '上海港', '卸港代理': '上海外代', 'ETA': '2026-11-01 09:00', 'ATA': '2026-11-01 08:50', 'ETB': '2026-11-01 11:00', 'ATB': '2026-11-01 10:45', 'ETD': '2026-11-01 18:00', 'ATD': '2026-11-01 17:30', '水尺数': '9.2 m', '卸船完成时间': '2026-11-01 14:20' }
      }
    },
    {
      id: 'SF003', entrustNo: 'FLMT202610130009（V1.0）', taskNo: 'T17', taskName: '水运多经停任务',
      routeId: 'route-main', routeName: '天津新兴建材码头 → 东非蒙巴萨港',
      supplier: '中联铁运集团有限公司', feedbackTime: '2026-11-02 09:10', status: '待确认', statusTone: 'warning',
      summary: '已回填 ATA/ATB，实际装船数量 300 台，正在等待离港信息。',
      details: [['装港', '天津新兴建材码头'], ['实际到港', '2026-11-03 07:40'], ['实际靠泊', '2026-11-03 13:30'], ['实际离港', '待回填']],
      fields: {
        loadingOrigin: { 'ATA': '2026-11-03 07:40', 'ATB': '2026-11-03 13:30', 'ATD': '待回填' }
      }
    }
  ];
  supplierFeedbackOptions[0].originProducts = [
    ['重卡卡车', '180.00', '台', 'LYX-QD-2604E-01', '1舱', orderNo],
    ['重卡卡车', '120.00', '台', 'LYX-QD-2604E-02', '2舱', orderNo]
  ];
  supplierFeedbackOptions[0].destinationProducts = [['重卡卡车', '300.00', '台', orderNo]];
  supplierFeedbackOptions[1].originProducts = [
    ['重卡卡车', '180.00', '台', 'ZD-TJ-SH-01', '1舱', orderNo],
    ['重卡卡车', '120.00', '台', 'ZD-TJ-SH-02', '2舱', orderNo]
  ];
  supplierFeedbackOptions[1].destinationProducts = [['重卡卡车', '300.00', '台', orderNo]];
  supplierFeedbackOptions[2].originProducts = [
    ['重卡卡车', '180.00', '台', 'LYX-QD-2604E-01', '1舱', orderNo],
    ['重卡卡车', '120.00', '台', 'LYX-QD-2604E-02', '2舱', orderNo]
  ];
  supplierFeedbackOptions[2].destinationProducts = [['重卡卡车', '300.00', '台', orderNo]];
  supplierFeedbackOptions[0].acceptanceProducts = [
    ['HT2026-0821', '重卡卡车', '180.00', '180.00', '台', '东非蒙巴萨港'],
    ['HT2026-0821', '重卡卡车', '120.00', '120.00', '台', '东非蒙巴萨港']
  ];
  supplierFeedbackOptions[1].acceptanceProducts = [
    ['HT2026-0821', '重卡卡车', '180.00', '180.00', '台', '上海港'],
    ['HT2026-0821', '重卡卡车', '120.00', '120.00', '台', '上海港']
  ];
  supplierFeedbackOptions[2].acceptanceProducts = [
    ['HT2026-0821', '重卡卡车', '180.00', '180.00', '台', '东非蒙巴萨港'],
    ['HT2026-0821', '重卡卡车', '120.00', '120.00', '台', '东非蒙巴萨港']
  ];  function fallbackFeedback() {
    const completed = record.status === '已完成';
    const running = ['履约中', '已安排'].includes(record.status);
    const activeIndex = completed ? 6 : running ? 2 : 0;
    const titles = {
      booking: '订舱确认', vessel: '宣船及航次确认', loading: '到港/靠泊/装船/离港',
      acceptance: '验收', settlement: '费用结算', archive: '单证归档'
    };
    const steps = nodeOrder.map((key, index) => {
      const status = index < activeIndex ? 'complete' : index === activeIndex ? 'active' : 'pending';
      const base = { key, title: titles[key], status, time: status === 'complete' ? '已完成' : status === 'active' ? '待更新' : '未开始', docs: [] };
      if (key === 'booking') {
        base.sections = [{ title: '订舱信息', fields: [
          ['订舱单号', '待补充'], ['订舱货代', '待补充'], ['分类', '待补充'],
          ['订舱状态', running || completed ? '已订舱' : '待确认'], ['订舱经理', record.sales || '待补充'],
          ['操作员', record.sales || '待补充'], ['订舱数量', record.total || '待补充'],
          ['未订舱数量', '待补充'], ['CQD', '待补充'], ['LAYCAN', '待补充'], ['是否含绑', '待补充']
        ] }];
      } else if (key === 'vessel') {
        base.sections = [{ title: '船舶及航次信息', fields: [
          ['船名', '待补充'], ['航次', '待补充'], ['IMO', '待补充'], ['MMSI', '待补充'],
          ['建造日期', '待补充'], ['吃水', '待补充'], ['LAYCAN', '待补充'],
          ['宣船情况', '待确认'], ['宣船备注', '待补充'], ['航线', '待补充'], ['运费条款', '待补充']
        ] }];
      } else if (key === 'loading') {
        base.sections = [
          { title: '起运港信息', fields: [
            ['状态', status === 'active' ? '进行中' : '待开始'], ['港区', record.origin || '待补充'],
            ['地面货代', '待补充'], ['装港代理', '待补充'], ['ETA', '待补充'], ['ATA', '待补充'],
            ['ETB', '待补充'], ['ATB', '待补充'], ['ETD', '待补充'], ['ATD', '待补充'], ['装船完成时间', '待补充']
          ], table: { title: '商品明细列表', columns: ['商品名称', '装船标准数量', '标准单位', '提单号', '舱位', '客户订单号'], rows: [[record.goods || '待补充', record.total || '--', '--', '--', '--', orderNo]] } },
          { title: '目的港信息', fields: [
            ['卸港', record.destination || '待补充'], ['卸港代理', '待补充'], ['ETA', '待补充'], ['ATA', '待补充'],
            ['ETB', '待补充'], ['ATB', '待补充'], ['ETD', '待补充'], ['ATD', '待补充'],
            ['水尺数', '待补充'], ['卸船完成时间', '待补充']
          ], table: { title: '商品明细列表', columns: ['商品名称', '卸船标准数量', '标准单位', '客户订单号'], rows: [[record.goods || '待补充', record.total || '--', '--', orderNo]] } }
        ];
      } else if (key === 'acceptance') {
        base.sections = [{ title: '验收信息', fields: [
          ['验收状态', '待申请'], ['验收申请备注', '待补充'], ['验收申请提交时间', '待补充'],
          ['验收申请提交人', '待补充'], ['验收处理时间', '待补充'], ['验收处理说明', '待补充']
        ], table: { title: '验收商品清单', columns: ['贸易合同号', '商品中文名', '已反馈数量', '待验收数量', '标准单位', '目的地'], rows: [['HT2026-0821', record.goods || '待补充', record.total || '--', record.total || '--', '--', record.destination || '待补充']] } }];      } else if (key === 'settlement') {
        base.sections = [{ title: '费用信息', fields: [['费用状态', '待核算'], ['发票状态', '待开票'], ['付款状态', '未开始']] }];
      } else {
        base.sections = [{ title: '归档信息', fields: [['归档状态', '待归档'], ['归档时间', '待补充']] }];
      }
      return base;
    });
    const activeNode = (steps.find((step) => step.status === 'active') || steps[0]).key;
    const route = {
      id: 'route-main',
      name: `${record.origin || '待补充'} → ${record.destination || '待补充'}`,
      origin: record.origin || '待补充',
      destination: record.destination || '待补充',
      transportType: record.transportType || '水运',
      shipmentCategory: record.loadType || '件杂货',
      mode: `${record.transportType || '水运'} · ${record.loadType || '件杂货'}`,
      status: completed ? 'complete' : 'active',
      statusText: completed ? '已完成' : '进行中',
      activeNode,
      steps,
      source: null
    };
    return {
      version: 'V1.0', releaseState: completed ? '已反馈客户' : '待反馈', updatedAt: '2026-11-01 14:30',
      routes: [route], currentRouteId: route.id, steps, records: []
    };
  }

  const feedback = orderNo === 'CO-20260904-BREAKBULK' ? clone(demoFeedback) : fallbackFeedback();
  let stepMap = {};
  let activeKey = '';

  function routeById(routeId) {
    return (feedback.routes || []).find((route) => route.id === routeId) || null;
  }

  function activateRoute(routeId, nodeKey) {
    const route = routeById(routeId) || (feedback.routes && feedback.routes[0]);
    if (!route) return null;
    feedback.currentRouteId = route.id;
    feedback.steps = route.steps;
    stepMap = Object.fromEntries(route.steps.map((step) => [step.key, step]));
    const desired = nodeKey && stepMap[nodeKey] ? nodeKey : route.activeNode;
    activeKey = desired && stepMap[desired]
      ? desired
      : (route.steps.find((step) => step.status === 'active') || route.steps[0]).key;
    route.activeNode = activeKey;
    return route;
  }

  activateRoute(params.get('route') || feedback.currentRouteId, params.get('node'));

  const tabs = Array.from(document.querySelectorAll('[data-detail-tab]'));
  const orderView = document.getElementById('orderInfoView');
  const costProfitView = document.getElementById('costProfitView');
  const feedbackView = document.getElementById('feedbackView');
  const orderActions = document.getElementById('editActions');
  const routeTabs = document.getElementById('feedbackRouteTabs');
  const selectSupplierFeedbackBtn = document.getElementById('selectSupplierFeedbackBtn');
  const supplierFeedbackBackdrop = document.getElementById('supplierFeedbackBackdrop');
  const supplierFeedbackTableWrap = document.getElementById('supplierFeedbackTableWrap');
  const supplierFeedbackPreview = document.getElementById('supplierFeedbackPreview');
  const supplierFeedbackConfirm = document.getElementById('supplierFeedbackConfirm');
  const attachmentBackdrop = document.getElementById('feedbackAttachmentBackdrop');
  const attachmentType = document.getElementById('feedbackAttachmentType');
  const attachmentFile = document.getElementById('feedbackAttachmentFile');
  const attachmentFileList = document.getElementById('feedbackAttachmentFileList');
  const attachmentNode = document.getElementById('feedbackAttachmentNode');
  const attachmentConfirm = document.getElementById('feedbackAttachmentConfirm');
  const rail = document.getElementById('feedbackRail');
  const nodeTooltip = document.getElementById('feedbackNodeTooltip');
  const detailBody = document.getElementById('feedbackDetailBody');
  const detailTitle = document.getElementById('feedbackDetailTitle');
  const detailState = document.getElementById('feedbackDetailState');
  const detailTime = document.getElementById('feedbackDetailTime');
  const recordsList = document.getElementById('feedbackRecordsList');
  const releaseState = document.getElementById('feedbackReleaseState');
  const versionLabel = document.getElementById('feedbackVersion');
  const updatedLabel = document.getElementById('feedbackUpdatedAt');
  const previewBackdrop = document.getElementById('feedbackPreviewBackdrop');
  const previewBody = document.getElementById('feedbackPreviewBody');
  const previewTitle = document.getElementById('feedbackPreviewTitle');
  const previewSubtitle = document.getElementById('feedbackPreviewSubtitle');
  const previewPrimary = document.getElementById('feedbackPreviewPrimary');
  const editBackdrop = document.getElementById('feedbackEditBackdrop');
  const editBody = document.getElementById('feedbackEditBody');
  const recordsBackdrop = document.getElementById('feedbackRecordsBackdrop');
  const startAcceptanceBtn = document.getElementById('startAcceptanceBtn');
  const declareVesselBtn = document.getElementById('declareVesselBtn');
  const cancelDeclarationBtn = document.getElementById('cancelDeclarationBtn');
  const acceptanceBackdrop = document.getElementById('feedbackAcceptanceBackdrop');
  const acceptanceBody = document.getElementById('feedbackAcceptanceBody');
  const editableNodeKeys = ['booking', 'vessel', 'loading'];
  const toast = document.getElementById('toast');
  let toastTimer = 0;
  let previewReturnFocus = null;
  let editReturnFocus = null;
  let recordsReturnFocus = null;
  let acceptanceReturnFocus = null;
  let supplierFeedbackReturnFocus = null;
  let selectedSupplierFeedbackId = '';
  let attachmentReturnFocus = null;

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function tone(status) {
    return stateTone[status] || stateTone.pending;
  }

  function fieldHtml(field) {
    const label = Array.isArray(field) ? field[0] : field.label;
    const value = Array.isArray(field) ? field[1] : field.value;
    const missing = Array.isArray(field) ? field[2] : field.missing;
    return `<div class="feedback-field"><dt>${escapeHtml(label)}</dt><dd class="${missing ? 'is-missing' : ''}">${missing ? `<span class="feedback-missing">${escapeHtml(value || '待补充')}</span>` : escapeHtml(value || '--')}</dd></div>`;
  }

  function tableHtml(table) {
    if (!table) return '';
    const rows = table.rows && table.rows.length
      ? table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell == null ? '--' : cell)}</td>`).join('')}</tr>`).join('')
      : `<tr><td colspan="${table.columns.length}" class="feedback-table-empty">暂无商品明细</td></tr>`;
    return `<details class="feedback-table-section feedback-table-details"><summary class="feedback-subsection-head feedback-table-summary"><span class="feedback-subsection-title">${escapeHtml(table.title)}</span><span class="feedback-state">${table.rows ? table.rows.length : 0} 行</span></summary><div class="feedback-table-wrap"><table class="feedback-detail-table"><thead><tr>${table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div></details>`;
  }

  function renderRouteList() {
    if (!routeTabs) return;
    routeTabs.innerHTML = feedback.routes.map((route, index) => {
      const nameParts = String(route.name || '').split('→').map((item) => item.trim());
      const origin = route.origin || nameParts[0] || '待补充';
      const destination = route.destination || nameParts[1] || '待补充';
      const transportType = route.transportType || String(route.mode || '').split('·')[0].trim() || '水运';
      const shipmentCategory = route.shipmentCategory || String(route.mode || '').split('·')[1]?.trim() || '件杂货';
      return `<button type="button" class="feedback-route-tab ${route.id === feedback.currentRouteId ? 'active' : ''}" data-feedback-route="${escapeHtml(route.id)}" role="tab" aria-selected="${route.id === feedback.currentRouteId}">
        <span class="feedback-route-tab-icon"><svg aria-hidden="true"><use href="#p-ship"/></svg></span>
        <span class="feedback-route-tab-mode">${escapeHtml(transportType)} · ${escapeHtml(shipmentCategory)}</span>
        <strong class="feedback-route-tab-route"><span>${escapeHtml(origin)}</span><span class="feedback-route-tab-arrow">→</span><span>${escapeHtml(destination)}</span></strong>
      </button>`;
    }).join('');
  }
  function showNodeTooltip(button) {
    if (!nodeTooltip || !button) return;
    nodeTooltip.textContent = button.dataset.feedbackTooltip || '';
    if (!nodeTooltip.textContent) return;
    nodeTooltip.hidden = false;
    const trigger = button.getBoundingClientRect();
    const tooltip = nodeTooltip.getBoundingClientRect();
    let left = trigger.left + trigger.width / 2 - tooltip.width / 2;
    let top = trigger.top - tooltip.height - 8;
    if (top < 8) top = trigger.bottom + 8;
    left = Math.max(8, Math.min(left, window.innerWidth - tooltip.width - 8));
    nodeTooltip.style.left = left + 'px';
    nodeTooltip.style.top = top + 'px';
  }

  function hideNodeTooltip() {
    if (nodeTooltip) nodeTooltip.hidden = true;
  }
  function renderRail() {
    rail.style.setProperty('--feedback-node-count', feedback.steps.length);
    rail.innerHTML = feedback.steps.map((step, index) => {
      const timeLabel = step.status === 'complete' ? '完成时间' : step.status === 'pending' ? '计划完成时间' : '当前更新时间';
      const tooltip = `${timeLabel}：${step.time}`;
      return `<button type="button" class="feedback-node ${step.status === 'complete' ? 'is-complete' : ''} ${step.status === 'active' ? 'is-active' : ''} ${step.status === 'warning' ? 'is-warning' : ''} ${step.status === 'error' ? 'is-error' : ''} ${step.key === activeKey ? 'is-selected' : ''}" data-feedback-node="${escapeHtml(step.key)}" data-feedback-tooltip="${escapeHtml(tooltip)}" role="tab" aria-selected="${step.key === activeKey}">
        <span class="feedback-node-dot">${step.status === 'complete' ? '<svg aria-hidden="true"><use href="#p-check"/></svg>' : index + 1}</span>
        <span class="feedback-node-label">${escapeHtml(step.title)}</span>
      </button>`;
    }).join('');
  }

  function renderDetail() {
    const step = stepMap[activeKey] || feedback.steps[0];
    const state = tone(step.status);
    detailTitle.textContent = step.title;
    detailState.textContent = state.label;
    detailState.className = 'feedback-state ' + state.className;
    detailTime.textContent = (step.status === 'pending' ? '计划 ' : '更新于 ') + step.time;
    let html = (step.sections || []).map((section) => `<section class="feedback-field-group"><h3 class="feedback-field-group-title">${escapeHtml(section.title)}</h3><dl class="feedback-field-grid">${section.fields.map(fieldHtml).join('')}</dl>${tableHtml(section.table)}</section>`).join('');
    if (step.docs && step.docs.length) {
      html += `<div class="feedback-subsection"><div class="feedback-subsection-head"><span class="feedback-subsection-title">附件与凭证</span></div><div class="feedback-doc-list">${step.docs.map((doc) => `<button type="button" class="feedback-doc" data-feedback-doc="${escapeHtml(doc[0])}"><svg aria-hidden="true"><use href="#p-doc"/></svg>${escapeHtml(doc[0])}<span class="feedback-node-meta">${escapeHtml(doc[1])}</span></button>`).join('')}</div></div>`;
    }
    detailBody.innerHTML = html;
  }

  function renderMeta() {
    releaseState.textContent = feedback.releaseState;
    releaseState.classList.toggle('is-pending', feedback.releaseState !== '已反馈客户');
    versionLabel.textContent = feedback.version;
    updatedLabel.textContent = '最后更新 ' + feedback.updatedAt;
  }

  function renderRecords() {
    if (!feedback.records.length) {
      recordsList.innerHTML = '<li><span class="feedback-record-time">暂无记录</span><span class="feedback-record-main"><strong>尚未产生客户反馈记录</strong><span>完成节点更新后，反馈记录会在这里形成可追溯的版本。</span></span><span class="feedback-record-owner">--</span></li>';
      return;
    }
    recordsList.innerHTML = feedback.records.map((row) => `<li><span class="feedback-record-time">${escapeHtml(row[0])}</span><span class="feedback-record-main"><strong>${escapeHtml(row[1])}</strong><span>${escapeHtml(row[2])}</span></span><span class="feedback-record-owner">${escapeHtml(row[3])}</span></li>`).join('');
  }

  function currentTimestamp() {
    const now = new Date();
    return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-') + ' ' + [String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0')].join(':');
  }

  function renderEditForm() {
    editBody.innerHTML = editableNodeKeys.map((key) => {
      const step = stepMap[key];
      const sections = step.sections.map((section, sectionIndex) => {
        const fields = section.fields.map((field, fieldIndex) => {
          const label = field[0];
          const value = field[1] == null ? '' : String(field[1]);
          const control = (label.includes('备注') || label.includes('说明'))
            ? `<textarea data-edit-kind="field" data-node-key="${key}" data-section-index="${sectionIndex}" data-field-index="${fieldIndex}" aria-label="${escapeHtml(label)}">${escapeHtml(value)}</textarea>`
            : `<input data-edit-kind="field" data-node-key="${key}" data-section-index="${sectionIndex}" data-field-index="${fieldIndex}" autocomplete="off" value="${escapeHtml(value)}" aria-label="${escapeHtml(label)}">`;
          return `<label class="feedback-edit-field"><span>${escapeHtml(label)}</span>${control}</label>`;
        }).join('');
        const table = section.table ? `<div class="feedback-edit-table-wrap"><table class="feedback-edit-table"><thead><tr>${section.table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')}</tr></thead><tbody>${(section.table.rows || []).map((row, rowIndex) => `<tr>${row.map((cell, colIndex) => `<td><input data-edit-kind="table" data-node-key="${key}" data-section-index="${sectionIndex}" data-row-index="${rowIndex}" data-col-index="${colIndex}" autocomplete="off" value="${escapeHtml(cell == null ? '' : cell)}" aria-label="${escapeHtml(section.table.columns[colIndex] || '商品明细')}"></td>`).join('')}</tr>`).join('')}</tbody></table></div>` : '';
        return `<div class="feedback-edit-section"><h4 class="feedback-edit-section-title">${escapeHtml(section.title)}</h4><div class="feedback-edit-grid">${fields}</div>${table}</div>`;
      }).join('');
      return `<section class="feedback-edit-step"><h3 class="feedback-edit-step-title">${escapeHtml(step.title)}</h3>${sections}</section>`;
    }).join('');
  }

  function openEdit() {
    if (!editBackdrop) return;
    editReturnFocus = document.activeElement;
    renderEditForm();
    editBackdrop.hidden = false;
    editBody.querySelector('input, textarea')?.focus();
  }

  function closeEdit() {
    if (!editBackdrop || editBackdrop.hidden) return;
    editBackdrop.hidden = true;
    if (editReturnFocus && typeof editReturnFocus.focus === 'function') editReturnFocus.focus();
  }

  function saveEdit() {
    editBody.querySelectorAll('[data-edit-kind="field"]').forEach((control) => {
      const step = stepMap[control.dataset.nodeKey];
      const section = step && step.sections[Number(control.dataset.sectionIndex)];
      const field = section && section.fields[Number(control.dataset.fieldIndex)];
      if (!field) return;
      const value = control.value.trim();
      field[1] = value || '待补充';
      field[2] = !value || value === '待补充' || value === '待回填';
    });
    editBody.querySelectorAll('[data-edit-kind="table"]').forEach((control) => {
      const step = stepMap[control.dataset.nodeKey];
      const section = step && step.sections[Number(control.dataset.sectionIndex)];
      const table = section && section.table;
      if (!table || !table.rows[Number(control.dataset.rowIndex)]) return;
      table.rows[Number(control.dataset.rowIndex)][Number(control.dataset.colIndex)] = control.value.trim() || '--';
    });
    const stamp = currentTimestamp();
    const shortStamp = stamp.slice(5);
    editableNodeKeys.forEach((key) => { if (stepMap[key]) stepMap[key].time = shortStamp; });
    feedback.updatedAt = stamp;
    feedback.releaseState = '待反馈';
    feedback.records.unshift([stamp, '履约信息已修改', '订舱确认、宣船及航次确认、到港/靠泊/装船/离港信息已同步更新。', (record.sales || '当前操作员') + ' · ' + feedback.version]);
    closeEdit();
    renderAll();
    showToast('履约信息已保存，当前版本标记为待反馈。');
  }

  function openRecords() {
    if (!recordsBackdrop) return;
    recordsReturnFocus = document.activeElement;
    renderRecords();
    recordsBackdrop.hidden = false;
    document.getElementById('feedbackRecordsClose')?.focus();
  }

  function closeRecords() {
    if (!recordsBackdrop || recordsBackdrop.hidden) return;
    recordsBackdrop.hidden = true;
    if (recordsReturnFocus && typeof recordsReturnFocus.focus === 'function') recordsReturnFocus.focus();
  }

  function trapDialogFocus(event, backdrop, close) {
    if (!backdrop || backdrop.hidden) return false;
    if (event.key === 'Escape') { close(); return true; }
    if (event.key !== 'Tab') return false;
    const focusable = Array.from(backdrop.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((node) => node.offsetParent !== null);
    if (!focusable.length) return true;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    return true;
  }
  function getStepFieldValue(stepKey, label) {
    const step = stepMap[stepKey];
    if (!step) return '';
    for (const section of step.sections || []) {
      for (const field of section.fields || []) {
        if (field[0] === label) return field[1] || '';
      }
    }
    return '';
  }

  function setStepFieldValue(stepKey, label, value) {
    const step = stepMap[stepKey];
    if (!step) return;
    (step.sections || []).forEach((section) => {
      (section.fields || []).forEach((field) => {
        if (field[0] === label) { field[1] = value; field[2] = false; }
      });
    });
  }

  function syncDeclarationActions() {
    const declared = getStepFieldValue('vessel', '宣船情况') === '已宣船';
    if (declareVesselBtn) { declareVesselBtn.hidden = false; declareVesselBtn.disabled = declared; }
    if (cancelDeclarationBtn) cancelDeclarationBtn.hidden = !declared;
  }

  function updateDeclaration(declared) {
    const stamp = currentTimestamp();
    const shortStamp = stamp.slice(5);
    setStepFieldValue('vessel', '宣船情况', declared ? '已宣船' : '未宣船');
    const vessel = stepMap.vessel;
    if (vessel) {
      vessel.status = declared ? 'complete' : 'warning';
      vessel.time = shortStamp;
    }
    feedback.updatedAt = stamp;
    feedback.releaseState = '待反馈';
    feedback.records.unshift([
      stamp,
      declared ? '宣船已完成' : '已取消宣船',
      declared ? '船舶宣船信息已更新为“已宣船”。' : '船舶宣船信息已更新为“未宣船”。',
      (record.sales || '当前操作员') + ' · ' + feedback.version
    ]);
    renderAll();
    showToast(declared ? '宣船已完成。' : '已取消宣船。');
  }
  function acceptanceTable() {
    const step = stepMap.acceptance;
    const section = step && step.sections.find((item) => item.table);
    return section ? section.table : null;
  }

  function renderAcceptanceModal() {
    const table = acceptanceTable();
    if (!table) {
      acceptanceBody.innerHTML = '<p class="feedback-table-empty">暂无商品明细</p>';
      return;
    }
    acceptanceBody.innerHTML = `<div class="feedback-table-section"><div class="feedback-subsection-head"><span class="feedback-subsection-title">${escapeHtml(table.title || '验收商品清单')}</span><span class="feedback-state">${(table.rows || []).length} 行</span></div><div class="feedback-table-wrap"><table class="feedback-detail-table"><thead><tr>${table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')}</tr></thead><tbody>${(table.rows || []).map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell == null ? '--' : cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  }

  function openAcceptance() {
    if (!acceptanceBackdrop) return;
    acceptanceReturnFocus = document.activeElement;
    renderAcceptanceModal();
    acceptanceBackdrop.hidden = false;
    document.getElementById('feedbackAcceptanceClose')?.focus();
  }

  function closeAcceptance() {
    if (!acceptanceBackdrop || acceptanceBackdrop.hidden) return;
    acceptanceBackdrop.hidden = true;
    if (acceptanceReturnFocus && typeof acceptanceReturnFocus.focus === 'function') acceptanceReturnFocus.focus();
  }

  function updateAcceptanceField(label, value) {
    const step = stepMap.acceptance;
    if (!step) return;
    step.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field[0] === label) { field[1] = value; field[2] = false; }
      });
    });
  }

  function submitAcceptance() {
    const step = stepMap.acceptance;
    if (!step) return;
    const stamp = currentTimestamp();
    const shortStamp = stamp.slice(5);
    updateAcceptanceField('验收状态', '待处理');
    updateAcceptanceField('验收申请提交时间', stamp);
    updateAcceptanceField('验收申请提交人', record.sales || '当前操作员');
    step.status = 'active';
    step.time = shortStamp;
    if (stepMap.loading) { stepMap.loading.status = 'complete'; stepMap.loading.time = shortStamp; }
    feedback.updatedAt = stamp;
    feedback.releaseState = '待反馈';
    feedback.records.unshift([stamp, '验收申请已发起', '验收申请已提交，等待验收处理。', (record.sales || '当前操作员') + ' · ' + feedback.version]);
    closeAcceptance();
    renderAll();
    showToast('验收申请已发起。');
  }
  function supplierOptionById(id) {
    return supplierFeedbackOptions.find((item) => item.id === id) || null;
  }

  function renderSupplierFeedbackPreview() {
    const option = supplierOptionById(selectedSupplierFeedbackId);
    if (!supplierFeedbackPreview) return;
    if (!option) {
      supplierFeedbackPreview.innerHTML = '<div class="supplier-feedback-preview-empty">请选择一条物流委托单任务反馈。</div>';
      return;
    }
    supplierFeedbackPreview.innerHTML = `<div class="supplier-feedback-preview-head"><strong>${escapeHtml(option.taskName)}</strong><span>${escapeHtml(option.entrustNo)}</span><span>${escapeHtml(option.supplier)}</span><span>${escapeHtml(option.feedbackTime)}</span></div><div class="supplier-feedback-preview-grid">${option.details.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</div><div class="supplier-feedback-summary">${escapeHtml(option.summary)}</div>`;
  }

  function renderSupplierFeedbackTable() {
    if (!supplierFeedbackTableWrap) return;
    supplierFeedbackTableWrap.innerHTML = `<table class="supplier-feedback-table"><thead><tr><th>选择</th><th>物流委托单</th><th>任务</th><th>线路</th><th>供应商</th><th>反馈时间</th><th>反馈摘要</th><th>状态</th></tr></thead><tbody>${supplierFeedbackOptions.map((option) => `<tr class="${option.id === selectedSupplierFeedbackId ? 'is-selected' : ''}" data-supplier-feedback-id="${escapeHtml(option.id)}"><td><input type="radio" name="supplierFeedback" value="${escapeHtml(option.id)}" ${option.id === selectedSupplierFeedbackId ? 'checked' : ''} aria-label="选择 ${escapeHtml(option.entrustNo)}"></td><td>${escapeHtml(option.entrustNo)}</td><td>${escapeHtml(option.taskNo)} · ${escapeHtml(option.taskName)}</td><td>${escapeHtml(option.routeName)}</td><td>${escapeHtml(option.supplier)}</td><td>${escapeHtml(option.feedbackTime)}</td><td><span class="supplier-feedback-summary">${escapeHtml(option.summary)}</span></td><td><span class="feedback-state ${option.statusTone === 'complete' ? 'is-complete' : option.statusTone === 'warning' ? 'is-warning' : 'is-active'}">${escapeHtml(option.status)}</span></td></tr>`).join('')}</tbody></table>`;
    if (supplierFeedbackConfirm) supplierFeedbackConfirm.disabled = !selectedSupplierFeedbackId;
    renderSupplierFeedbackPreview();
  }

  function selectSupplierFeedback(id) {
    if (!supplierOptionById(id)) return;
    selectedSupplierFeedbackId = id;
    renderSupplierFeedbackTable();
  }

  function openSupplierFeedback() {
    if (!supplierFeedbackBackdrop) return;
    supplierFeedbackReturnFocus = document.activeElement;
    selectedSupplierFeedbackId = '';
    renderSupplierFeedbackTable();
    supplierFeedbackBackdrop.hidden = false;
    document.getElementById('supplierFeedbackClose')?.focus();
  }

  function closeSupplierFeedback() {
    if (!supplierFeedbackBackdrop || supplierFeedbackBackdrop.hidden) return;
    supplierFeedbackBackdrop.hidden = true;
    if (supplierFeedbackReturnFocus && typeof supplierFeedbackReturnFocus.focus === 'function') supplierFeedbackReturnFocus.focus();
  }

  function setSectionFieldValue(stepKey, sectionIndex, label, value) {
    const step = stepMap[stepKey];
    const section = step && step.sections && step.sections[sectionIndex];
    if (!section) return;
    const field = section.fields.find((item) => item[0] === label);
    if (field) { field[1] = value; field[2] = false; }
  }

  function applySupplierFeedback() {
    const option = supplierOptionById(selectedSupplierFeedbackId);
    if (!option) return;
    const targetRoute = routeById(option.routeId);
    if (targetRoute) {
      activateRoute(option.routeId, 'loading');
      targetRoute.name = option.routeName || targetRoute.name;
      targetRoute.status = option.statusTone === 'complete' ? 'complete' : option.statusTone === 'warning' ? 'warning' : 'active';
      targetRoute.statusText = option.statusTone === 'complete' ? '已完成' : option.statusTone === 'warning' ? '待确认' : '进行中';
      targetRoute.source = { entrustNo: option.entrustNo, taskNo: option.taskNo, supplier: option.supplier, feedbackTime: option.feedbackTime };
    }
    Object.entries(option.fields || {}).forEach(([key, fields]) => {
      if (key === 'loadingOrigin') {
        Object.entries(fields).forEach(([label, value]) => setSectionFieldValue('loading', 0, label, value));
      } else if (key === 'loadingDestination') {
        Object.entries(fields).forEach(([label, value]) => setSectionFieldValue('loading', 1, label, value));
      } else {
        Object.entries(fields).forEach(([label, value]) => setStepFieldValue(key, label, value));
      }
    });
    const loadingStep = stepMap.loading;
    if (loadingStep) {
      loadingStep.status = option.statusTone === 'complete' ? 'complete' : option.statusTone === 'warning' ? 'warning' : 'active';
      loadingStep.time = currentTimestamp().slice(5);
      if (option.originProducts && loadingStep.sections[0] && loadingStep.sections[0].table) loadingStep.sections[0].table.rows = clone(option.originProducts);
      if (option.destinationProducts && loadingStep.sections[1] && loadingStep.sections[1].table) loadingStep.sections[1].table.rows = clone(option.destinationProducts);
    }
    const acceptanceStep = stepMap.acceptance;
    if (option.acceptanceProducts && acceptanceStep && acceptanceStep.sections[0] && acceptanceStep.sections[0].table) {
      acceptanceStep.sections[0].table.title = '验收商品清单';
      acceptanceStep.sections[0].table.columns = ['贸易合同号', '商品中文名', '已反馈数量', '待验收数量', '标准单位', '目的地'];
      acceptanceStep.sections[0].table.rows = clone(option.acceptanceProducts);
    }
    const stamp = currentTimestamp();
    feedback.updatedAt = stamp;
    feedback.releaseState = '待反馈';
    feedback.records.unshift([stamp, '已带出下游供应商反馈', `${option.entrustNo} · ${option.taskNo} ${option.taskName} · ${option.supplier}`, (record.sales || '当前操作员') + ' · ' + feedback.version]);
    closeSupplierFeedback();
    renderAll();
    showToast('下游供应商反馈已带出到履约反馈。');
  }
  function selectedAttachmentFiles() {
    return attachmentFile ? Array.from(attachmentFile.files || []) : [];
  }

  function renderAttachmentFiles() {
    if (!attachmentFileList) return;
    const files = selectedAttachmentFiles();
    const type = attachmentType ? attachmentType.value : '';
    if (!files.length) {
      attachmentFileList.innerHTML = '<span>尚未选择附件</span>';
    } else {
      attachmentFileList.innerHTML = files.map((file) => `<span class="feedback-attachment-file-item">${escapeHtml(file.name)}<span>${escapeHtml(type || '待选择类型')}</span></span>`).join('');
    }
    if (attachmentConfirm) attachmentConfirm.disabled = !(type && files.length);
  }

  function openAttachment() {
    if (!attachmentBackdrop) return;
    attachmentReturnFocus = document.activeElement;
    const step = stepMap[activeKey];
    if (attachmentNode) attachmentNode.textContent = step ? step.title : '--';
    if (attachmentType) attachmentType.value = '';
    if (attachmentFile) attachmentFile.value = '';
    renderAttachmentFiles();
    attachmentBackdrop.hidden = false;
    attachmentType?.focus();
  }

  function closeAttachment() {
    if (!attachmentBackdrop || attachmentBackdrop.hidden) return;
    attachmentBackdrop.hidden = true;
    if (attachmentReturnFocus && typeof attachmentReturnFocus.focus === 'function') attachmentReturnFocus.focus();
  }

  function submitAttachment() {
    const files = selectedAttachmentFiles();
    const type = attachmentType ? attachmentType.value : '';
    const step = stepMap[activeKey];
    if (!step || !type || !files.length) return;
    step.docs = step.docs || [];
    files.forEach((file) => step.docs.push([file.name, type]));
    const stamp = currentTimestamp();
    feedback.updatedAt = stamp;
    feedback.releaseState = '待反馈';
    feedback.records.unshift([stamp, '附件已上传', `${step.title}：${files.map((file) => file.name).join('、')}（${type}）`, (record.sales || '当前操作员') + ' · ' + feedback.version]);
    closeAttachment();
    renderAll();
    showToast(`已上传 ${files.length} 个附件到“${step.title}”。`);
  }
  function renderAll() {
    renderRouteList();
    renderRail();
    renderDetail();
    renderMeta();
    renderRecords();
    syncDeclarationActions();
  }

  function setView(view) {
    const isFeedback = view === 'feedback';
    const isCostProfit = view === 'cost';
    tabs.forEach((tab) => {
      const selected = tab.dataset.detailTab === view;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    if (orderView) orderView.hidden = isFeedback || isCostProfit;
    if (costProfitView) costProfitView.hidden = !isCostProfit;
    if (feedbackView) feedbackView.hidden = !isFeedback;
    if (orderActions) orderActions.hidden = isFeedback || isCostProfit;
    root.classList.toggle('feedback-active', isFeedback);
    root.classList.toggle('cost-active', isCostProfit);
    const nextParams = new URLSearchParams(window.location.search);
    if (isFeedback) nextParams.set('view', 'feedback');
    else if (isCostProfit) nextParams.set('view', 'cost');
    else nextParams.delete('view');
    if (isFeedback) nextParams.set('route', feedback.currentRouteId); else nextParams.delete('route');
    if (isFeedback) nextParams.set('node', activeKey); else nextParams.delete('node');
    history.replaceState(null, '', window.location.pathname + '?' + nextParams.toString() + window.location.hash);
    if (isFeedback) renderAll();
  }

  function previewMarkup() {
    const step = stepMap[activeKey] || feedback.steps[0];
    const sections = step.sections.map((section) => `<section class="feedback-preview-section"><h3>${escapeHtml(section.title)}</h3><dl>${section.fields.map((field) => `<dt>${escapeHtml(field[0])}</dt><dd>${escapeHtml(field[1] || '--')}</dd>`).join('')}</dl>${section.table ? `<div class="feedback-preview-table"><table><thead><tr>${section.table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')}</tr></thead><tbody>${(section.table.rows || []).map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell == null ? '--' : cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}</section>`).join('');
    const docs = step.docs && step.docs.length
      ? `<section class="feedback-preview-section"><h3>附件</h3><div class="feedback-doc-list">${step.docs.map((doc) => `<span class="feedback-doc"><svg aria-hidden="true"><use href="#p-doc"/></svg>${escapeHtml(doc[0])}<span class="feedback-node-meta">${escapeHtml(doc[1])}</span></span>`).join('')}</div></section>`
      : '';
    return sections + docs;
  }

  function openPreview() {
    if (!previewBackdrop) return;
    previewReturnFocus = document.activeElement;
    previewTitle.textContent = '客户版履约反馈';
    const currentRoute = routeById(feedback.currentRouteId);
    previewSubtitle.textContent = `${orderNo}${currentRoute ? ' · ' + currentRoute.name : ''} · ${feedback.version} · ${feedback.updatedAt}`;
    previewBody.innerHTML = previewMarkup();
    previewBackdrop.hidden = false;
    document.getElementById('feedbackPreviewClose')?.focus();
  }

  function closePreview() {
    if (!previewBackdrop || previewBackdrop.hidden) return;
    previewBackdrop.hidden = true;
    if (previewReturnFocus && typeof previewReturnFocus.focus === 'function') previewReturnFocus.focus();
  }

  function sendFeedback() {
    if (!window.confirm('确认将当前客户可见版本反馈给客户？')) return;
    feedback.releaseState = '已反馈客户';
    const now = new Date();
    const stamp = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-') + ' ' + [String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0')].join(':');
    feedback.updatedAt = stamp;
    feedback.records.unshift([stamp, '客户版履约反馈已发送', '当前客户可见版本已生成并发送，等待客户查看。', (record.sales || '当前操作员') + ' · ' + feedback.version]);
    closePreview();
    renderAll();
    showToast('客户履约反馈已发送，已生成最新反馈记录。');
  }

  function downloadConfirmation() {
    const step = stepMap[activeKey] || feedback.steps[0];
    const nodeRows = step.sections.map((section) => `<h2>${escapeHtml(section.title)}</h2><table>${section.fields.map((field) => `<tr><th>${escapeHtml(field[0])}</th><td>${escapeHtml(field[1] || '--')}</td></tr>`).join('')}</table>${section.table ? `<table><thead><tr>${section.table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')}</tr></thead><tbody>${(section.table.rows || []).map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell == null ? '--' : cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>` : ''}`).join('');
    const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>客户履约反馈 ${escapeHtml(orderNo)}</title><style>body{font-family:"Microsoft YaHei",sans-serif;color:#23344d;margin:32px}h1{font-size:20px}h2{font-size:14px;margin-top:24px}table{border-collapse:collapse;width:100%;margin-top:8px}th,td{border:1px solid #dce3ed;padding:8px;text-align:left;font-size:12px}th{background:#f8fafc;color:#5b6778}p{font-size:12px;color:#5b6778}</style><h1>客户履约反馈</h1><p>订单号：${escapeHtml(orderNo)}　版本：${escapeHtml(feedback.version)}　更新时间：${escapeHtml(feedback.updatedAt)}</p>${nodeRows}<p>该文件由 4PL 控制塔原型生成，仅用于客户沟通演示。</p></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `客户履约反馈_${orderNo}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('客户版履约反馈已生成下载。');
  }



  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setView(tab.dataset.detailTab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const currentIndex = tabs.indexOf(tab);
      const nextIndex = event.key === 'ArrowRight' ? (currentIndex + 1) % tabs.length : (currentIndex - 1 + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      setView(tabs[nextIndex].dataset.detailTab);
    });
  });

  if (routeTabs) {
    routeTabs.addEventListener('click', (event) => {
      const button = event.target.closest('[data-feedback-route]');
      if (!button) return;
      activateRoute(button.dataset.feedbackRoute);
      renderAll();
      const nextParams = new URLSearchParams(window.location.search);
      nextParams.set('view', 'feedback');
      nextParams.set('route', feedback.currentRouteId);
      nextParams.set('node', activeKey);
      history.replaceState(null, '', window.location.pathname + '?' + nextParams.toString() + window.location.hash);
    });
  }
  rail.addEventListener('pointerover', (event) => {
    const button = event.target.closest('[data-feedback-node]');
    if (!button || (event.relatedTarget && button.contains(event.relatedTarget))) return;
    showNodeTooltip(button);
  });
  rail.addEventListener('pointerout', (event) => {
    const button = event.target.closest('[data-feedback-node]');
    if (!button || (event.relatedTarget && button.contains(event.relatedTarget))) return;
    hideNodeTooltip();
  });
  rail.addEventListener('focusin', (event) => {
    const button = event.target.closest('[data-feedback-node]');
    if (button) showNodeTooltip(button);
  });
  rail.addEventListener('focusout', (event) => {
    const button = event.target.closest('[data-feedback-node]');
    if (button && !(event.relatedTarget && button.contains(event.relatedTarget))) hideNodeTooltip();
  });
  window.addEventListener('scroll', hideNodeTooltip, true);
  window.addEventListener('resize', hideNodeTooltip);
  rail.addEventListener('click', (event) => {
    const button = event.target.closest('[data-feedback-node]');
    if (!button) return;
    activeKey = button.dataset.feedbackNode;
    hideNodeTooltip();
    const currentRoute = routeById(feedback.currentRouteId);
    if (currentRoute) currentRoute.activeNode = activeKey;
    renderAll();
    const nextParams = new URLSearchParams(window.location.search);
    nextParams.set('view', 'feedback');
    nextParams.set('route', feedback.currentRouteId);
    nextParams.set('node', activeKey);
    history.replaceState(null, '', window.location.pathname + '?' + nextParams.toString() + window.location.hash);
  });

  detailBody.addEventListener('click', (event) => {
    const button = event.target.closest('[data-feedback-doc]');
    if (button) showToast('原型模拟打开附件：' + button.dataset.feedbackDoc);
  });

  document.getElementById('selectSupplierFeedbackBtn')?.addEventListener('click', openSupplierFeedback);
  document.getElementById('supplierFeedbackClose')?.addEventListener('click', closeSupplierFeedback);
  document.getElementById('supplierFeedbackCancel')?.addEventListener('click', closeSupplierFeedback);
  supplierFeedbackConfirm?.addEventListener('click', applySupplierFeedback);
  supplierFeedbackTableWrap?.addEventListener('click', (event) => {
    const row = event.target.closest('[data-supplier-feedback-id]');
    if (row) selectSupplierFeedback(row.dataset.supplierFeedbackId);
  });
  supplierFeedbackBackdrop?.addEventListener('click', (event) => { if (event.target === supplierFeedbackBackdrop) closeSupplierFeedback(); });
  document.getElementById('editFeedbackBtn')?.addEventListener('click', openEdit);
  document.getElementById('feedbackEditClose')?.addEventListener('click', closeEdit);
  document.getElementById('feedbackEditCancel')?.addEventListener('click', closeEdit);
  document.getElementById('feedbackEditSave')?.addEventListener('click', saveEdit);
  editBackdrop?.addEventListener('click', (event) => { if (event.target === editBackdrop) closeEdit(); });
  document.getElementById('viewFeedbackRecordsBtn')?.addEventListener('click', openRecords);
  document.getElementById('feedbackRecordsClose')?.addEventListener('click', closeRecords);
  document.getElementById('feedbackRecordsDone')?.addEventListener('click', closeRecords);
  recordsBackdrop?.addEventListener('click', (event) => { if (event.target === recordsBackdrop) closeRecords(); });
  startAcceptanceBtn?.addEventListener('click', openAcceptance);
  document.getElementById('feedbackAcceptanceClose')?.addEventListener('click', closeAcceptance);
  document.getElementById('feedbackAcceptanceCancel')?.addEventListener('click', closeAcceptance);
  document.getElementById('feedbackAcceptanceSubmit')?.addEventListener('click', submitAcceptance);
  acceptanceBackdrop?.addEventListener('click', (event) => { if (event.target === acceptanceBackdrop) closeAcceptance(); });
  document.getElementById('uploadAttachmentBtn')?.addEventListener('click', openAttachment);
  document.getElementById('feedbackAttachmentClose')?.addEventListener('click', closeAttachment);
  document.getElementById('feedbackAttachmentCancel')?.addEventListener('click', closeAttachment);
  attachmentConfirm?.addEventListener('click', submitAttachment);
  attachmentType?.addEventListener('change', renderAttachmentFiles);
  attachmentFile?.addEventListener('change', renderAttachmentFiles);
  attachmentBackdrop?.addEventListener('click', (event) => { if (event.target === attachmentBackdrop) closeAttachment(); });
  document.getElementById('previewFeedbackBtn')?.addEventListener('click', openPreview);
  declareVesselBtn?.addEventListener('click', () => updateDeclaration(true));
  cancelDeclarationBtn?.addEventListener('click', () => updateDeclaration(false));
  document.getElementById('feedbackCustomerBtn')?.addEventListener('click', openPreview);
  previewPrimary?.addEventListener('click', sendFeedback);
  document.getElementById('feedbackPreviewClose')?.addEventListener('click', closePreview);
  document.getElementById('feedbackPreviewCancel')?.addEventListener('click', closePreview);
  previewBackdrop?.addEventListener('click', (event) => { if (event.target === previewBackdrop) closePreview(); });
  document.addEventListener('keydown', (event) => {
    if (trapDialogFocus(event, editBackdrop, closeEdit)) return;
    if (trapDialogFocus(event, recordsBackdrop, closeRecords)) return;
    if (trapDialogFocus(event, acceptanceBackdrop, closeAcceptance)) return;
    if (trapDialogFocus(event, supplierFeedbackBackdrop, closeSupplierFeedback)) return;
    if (trapDialogFocus(event, attachmentBackdrop, closeAttachment)) return;
    trapDialogFocus(event, previewBackdrop, closePreview);
  });

  renderAll();
  const initialView = ['order', 'cost', 'feedback'].includes(params.get('view')) ? params.get('view') : 'order';
  setView(initialView);

  /* 订单已完结 / 已取消时，履约反馈整体只读 */
  const applyFeedbackReadOnly = () => {
    const status = document.getElementById('orderStatusField')?.textContent.trim() || '';
    const readOnly = ['已完结', '已取消'].includes(status);
    const view = document.getElementById('feedbackView');
    if (!view) return;
    view.classList.toggle('feedback-readonly', readOnly);
    ['editFeedbackBtn', 'feedbackCustomerBtn', 'declareVesselBtn', 'cancelDeclarationBtn', 'startAcceptanceBtn', 'selectSupplierFeedbackBtn', 'uploadAttachmentBtn']
      .forEach((id) => {
        const button = document.getElementById(id);
        if (!button) return;
        button.disabled = readOnly;
        button.title = readOnly ? '订单已完结或已取消，履约反馈只读' : '';
      });
  };
  applyFeedbackReadOnly();
  const feedbackStatusField = document.getElementById('orderStatusField');
  if (feedbackStatusField) {
    new MutationObserver(applyFeedbackReadOnly).observe(feedbackStatusField, { childList: true, characterData: true, subtree: true });
  }
})();
