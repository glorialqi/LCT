
    // --- Mock Initial Data Store with Project Numbers (业务项目号) ---
    const state = {
      currentTab: 'non_dest',
      selectedRowIds: new Set(),
      manualExpandedIds: new Set(),
      manualSelectedIds: new Set(),
      visibleWorkbenchRowKeys: [],
      riskOverview: '',
      submissionOverview: '',
      completionOverview: '',

      // Control Tower Pull-In Pool
      controlTowerPool: [
        {
          id: 'CT-2026-088', type: 'non_dest', projectNo: 'PRJ-2026-004', projectNos: ['PRJ-2026-004', 'PRJ-2026-005'],
          salesNo: 'SC20260301-09', purchaseNo: 'PO20260215-02', customer: '通用汽车（中国）投资有限公司', isInternalCustomer: '是', supplier: '苏州精工橡塑有限公司',
          salesman: '李明（汽车业务部）', operatingUnit: '建发汽车', companyTitle: '厦门建发股份有限公司', department: '汽车业务部', accountingGroup: '汽车零部件核算组',
          shipmentDeadline: '2026-04-15', settlementMethod: '即期信用证', receiptStatus: '已收证', controlledOrder: '否', prepaymentRatio: '30%',
          freightUnitPrice: '¥390/吨', salesTerms: 'CIF 汉堡', dispatchedByUs: '否', portMiscUnitPrice: '¥55/吨',
          tradeType: '一般贸易', status: '未提交',
          goodsLines: [
            { projectNo: 'PRJ-2026-004', name: '汽车用橡胶密封件', contractQty: 720, unit: '吨' },
            { projectNo: 'PRJ-2026-005', name: '耐高温橡胶密封圈', contractQty: 480, unit: '吨' }
          ]
        },
        {
          id: 'CT-2026-092', type: 'non_dest', projectNo: 'PRJ-2026-006', projectNos: ['PRJ-2026-006'],
          salesNo: 'SC20260302-12', purchaseNo: 'PO20260220-05', customer: '博世供应链服务有限公司', isInternalCustomer: '否', supplier: '无锡精密轴承制造厂',
          salesman: '王芳（装备业务部）', operatingUnit: '建发装备', companyTitle: '厦门建发股份有限公司', department: '装备业务部', accountingGroup: '机械设备核算组',
          shipmentDeadline: '2026-04-22', settlementMethod: '电汇', receiptStatus: '待收证', controlledOrder: '是', prepaymentRatio: '40%',
          freightUnitPrice: '¥520/吨', salesTerms: 'CFR 鹿特丹', dispatchedByUs: '是', portMiscUnitPrice: '¥78/吨',
          tradeType: '一般贸易', status: '未提交',
          goodsLines: [
            { projectNo: 'PRJ-2026-006', name: '工业精密轴承 6205', contractQty: 850, unit: '吨' }
          ]
        },
      ],

      // Active Workbench Row Items
      items: [
        {
          id: 'WB-1001',
          projectNo: 'PRJ-2026-001', // 业务项目号 1
          type: 'non_dest',
          salesNo: 'SC20260201-01',
          salesDate: '2026-02-01',
          purchaseNo: 'PO20260110-88',
          customer: '远东进出口有限公司',
          supplier: '山东石化集团',
          salesman: '张伟 (国际二部)',
          status: '部分分配',
          riskFlag: '超期未订舱',
          riskFlags: ['贸易合同号变更', '超期未订舱'],
          previousContractNo: 'SGN00001',
          pullType: 'AUTO',
          allocatableQty: 5000,
          allocatedQty: 3200,
          proposedQty: 1800,
          expanded: true,
          projectNos: ['PRJ-2026-001', 'PRJ-2026-010'],
          goodsLines: [
            { projectNo: 'PRJ-2026-001', goodscode:"G-01",name: '高密度聚乙烯 HDPE-5000S', autoAllocated: 2800, manualIn: 300, manualOut: 100, allocatable: 3000, allocated: 2000, proposed: 1000, unit: '吨' },
            { projectNo: 'PRJ-2026-010', goodscode:"G-02",name: '线性低密度聚乙烯 LLDPE-7042', autoAllocated: 1800, manualIn: 200, manualOut: 0, allocatable: 2000, allocated: 1200, proposed: 800, unit: '吨' }
          ],
          logisticsDemands: [
            { demandNo: 'LR-20260220-001', status: '处理中', scope: '海运门到门', goodsName: 'HDPE-5000S', goodsDescription: '高密度聚乙烯 HDPE-5000S（2000 吨）', qty: 2000, weight: '2000.00', volume: '3500.00', salesman: '张伟', department: '国际业务二部', operationOrg: '建发物流华东作业中心', operationOrgPerson: '周凯', createdAt: '2026-02-20 10:32', latestShipmentDate: '2026-03-15' },
            { demandNo: 'LR-20260221-006', status: '已接单', scope: '海运订舱 / 港到港', goodsName: 'LLDPE-7042', goodsDescription: '线性低密度聚乙烯 LLDPE-7042（1200 吨）', qty: 1200, weight: '1200.00', volume: '2100.00', salesman: '张伟', department: '国际业务二部', operationOrg: '建发物流华东作业中心', operationOrgPerson: '周凯', createdAt: '2026-02-21 09:18', latestShipmentDate: '2026-03-31', goodsDetails: [{ name: '线性低密度聚乙烯 LLDPE-7042', qty: 1200, unit: '吨' }] }
          ]
        },
        {
          id: 'WB-1002',
          projectNo: 'PRJ-2026-001', // 同属 业务项目号 1
          type: 'non_dest',
          salesNo: 'SC20260201-02',
          salesDate: '2026-02-05',
          purchaseNo: 'PO20260110-89',
          customer: '中亚能源设备公司',
          supplier: '山东石化集团',
          salesman: '张伟 (国际二部)',
          status: '待安排',
          riskFlag: '临期预警',
          pullType: 'AUTO',
          allocatableQty: 2500,
          allocatedQty: 0,
          proposedQty: 2500,
          expanded: false,
          goodsLines: [
            { goodscode:"G-01",name: '高密度聚乙烯 HDPE-5000S', allocatable: 1500, allocated: 0, proposed: 1500, unit: '吨' },
            { goodscode:"G-02",name: '线性低密度聚乙烯 LLDPE-7042', allocatable: 1000, allocated: 0, proposed: 1000, unit: '吨' }
          ],
          logisticsDemands: []
        },
        {
          id: 'WB-1003',
          projectNo: 'PRJ-2026-002', // 业务项目号 2
          type: 'non_dest',
          salesNo: 'SC20260218-09',
          salesDate: '2026-02-18',
          purchaseNo: 'PO20260120-03',
          customer: '巴斯夫(中国)化学',
          supplier: '浙江巨化集团',
          salesman: '刘洋 (化工部)',
          status: '已安排',
          riskFlag: '已有关联服务要求',
          pullType: 'AUTO',
          allocatableQty: 800,
          allocatedQty: 800,
          proposedQty: 0,
          expanded: false,
          goodsLines: [
            { name: '工业制冷剂 R134a', allocatable: 800, allocated: 800, proposed: 0, unit: '吨' }
          ],
          logisticsDemands: [
            { demandNo: 'LR-20260222-089', status: '已接单', scope: '陆运+报关', goodsName: '工业制冷剂 R134a', goodsDescription: '工业制冷剂 R134a（800 吨）', qty: 800, weight: '1600.00', volume: '1200.00', salesman: '刘洋', department: '化工业务部', operationOrg: '建发物流华南作业中心', operationOrgPerson: '高原' }
          ]
        },
        {
          id: 'WB-1004',
          projectNo: 'PRJ-2026-001',
          type: 'non_dest',
          salesNo: 'SC20260203-07',
          salesDate: '2026-02-09',
          purchaseNo: 'PO20260110-88',
          customer: '华东化工贸易有限公司',
          supplier: '山东石化集团',
          salesman: '赵宁 (国际二部)',
          status: '待安排',
          riskFlag: '正常',
          pullType: 'AUTO',
          allocatableQty: 900,
          allocatedQty: 0,
          proposedQty: 900,
          expanded: false,
          goodsLines: [
            { goodscode:"G-01",name: '高密度聚乙烯 HDPE-5000S', allocatable: 900, allocated: 0, proposed: 900, unit: '吨' }
          ],
          logisticsDemands: []
        },
        {
          id: 'WB-1005',
          projectNo: 'PRJ-2026-010',
          type: 'non_dest',
          salesNo: 'SC20260206-11',
          salesDate: '2026-02-11',
          purchaseNo: 'PO20260110-88',
          customer: '亚太塑化贸易有限公司',
          supplier: '山东石化集团',
          salesman: '赵宁 (国际二部)',
          status: '待安排',
          riskFlag: '正常',
          pullType: 'AUTO',
          allocatableQty: 600,
          allocatedQty: 0,
          proposedQty: 600,
          expanded: false,
          goodsLines: [
            { projectNo: 'PRJ-2026-010', goodscode:"G-02", name: '线性低密度聚乙烯 LLDPE-7042', allocatable: 600, allocated: 0, proposed: 600, unit: '吨' }
          ],
          logisticsDemands: []
        },
        {
          id: 'WB-2001',
          projectNo: 'PRJ-2026-003',
          type: 'dest',
          salesNo: 'SC20260225-D1',
          salesDate: '2026-02-25',
          purchaseNo: 'PO20260201-D8',
          customer: '鹿特丹仓储物流',
          supplier: '海外直营一厂',
          salesman: '陈晨 (海外部)',
          status: '待安排',
          riskFlag: '正常',
          pullType: 'AUTO',
          allocatableQty: 450,
          allocatedQty: 0,
          proposedQty: 450,
          expanded: false,
          goodsLines: [
            { name: '目的港库存-特种合金钢材', allocatable: 450, allocated: 0, proposed: 450, unit: '托' }
          ],
          logisticsDemands: []
        }
      ]
    };

    const MAIN_TABLE_COLSPAN = 42;

    function getMainTableColspan() {
      return state.currentTab === 'dest' ? MAIN_TABLE_COLSPAN - 5 : MAIN_TABLE_COLSPAN;
    }

    const itemProfiles = {
      'WB-1001': {
        contractStatus: '执行中',
        purchaseContractStatus: '执行中',
        isInternalCustomer: '是',
        operatingUnit: '建发能源', companyTitle: '厦门建发股份有限公司', department: '国际业务二部', accountingGroup: '化工核算组',
        shipmentDeadline: '2026-03-18', internalDeliveryDate: '2026-03-08', settlementMethod: '即期信用证', receiptStatus: '已收证', controlledOrder: '否',
        prepaymentRatio: '30%', freightUnitPrice: '¥480/吨', purchaseTerms: 'FOB 青岛', salesTerms: 'CIF 鹿特丹', dispatchedByUs: '否', portMiscUnitPrice: '¥65/吨',
        tradeType: '一般贸易', effectiveDate: '2026-02-01', contractQty: 6200
      },
      'WB-1002': {
        contractStatus: '执行中',
        purchaseContractStatus: '执行中',
        isInternalCustomer: '否',
        operatingUnit: '建发能源', companyTitle: '厦门建发股份有限公司', department: '国际业务二部', accountingGroup: '化工核算组',
        shipmentDeadline: '2026-03-25', internalDeliveryDate: '2026-03-12', settlementMethod: '电汇', receiptStatus: '待收证', controlledOrder: '否',
        prepaymentRatio: '20%', freightUnitPrice: '¥475/吨', purchaseTerms: 'FOB 青岛', salesTerms: 'CIF 汉堡', dispatchedByUs: '否', portMiscUnitPrice: '¥62/吨',
        tradeType: '一般贸易', effectiveDate: '2026-02-05', contractQty: 3000
      },
      'WB-1003': {
        contractStatus: '已完结',
        purchaseContractStatus: '已完结',
        isInternalCustomer: '是',
        operatingUnit: '建发化工', companyTitle: '厦门建发股份有限公司', department: '化工业务部', accountingGroup: '制冷剂核算组',
        shipmentDeadline: '2026-03-10', internalDeliveryDate: '2026-03-01', settlementMethod: '即期信用证', receiptStatus: '已收证', controlledOrder: '是',
        prepaymentRatio: '50%', freightUnitPrice: '¥820/吨', purchaseTerms: 'CFR 宁波', salesTerms: 'CIF 鹿特丹', dispatchedByUs: '是', portMiscUnitPrice: '¥110/吨',
        tradeType: '转口贸易', effectiveDate: '2026-02-18', contractQty: 800
      },
      'WB-1004': {
        contractStatus: '执行中',
        purchaseContractStatus: '执行中',
        isInternalCustomer: '否',
        operatingUnit: '建发能源', companyTitle: '厦门建发股份有限公司', department: '国际业务二部', accountingGroup: '化工核算组',
        shipmentDeadline: '2026-03-28', internalDeliveryDate: '2026-03-16', settlementMethod: '电汇', receiptStatus: '已收证', controlledOrder: '否',
        prepaymentRatio: '25%', freightUnitPrice: '¥470/吨', purchaseTerms: 'FOB 青岛', salesTerms: 'CIF 安特卫普', dispatchedByUs: '否', portMiscUnitPrice: '¥60/吨',
        tradeType: '一般贸易', effectiveDate: '2026-02-09', contractQty: 1200
      },
      'WB-2001': {
        contractStatus: '执行中',
        purchaseContractStatus: '执行中',
        isInternalCustomer: '是',
        operatingUnit: '建发海外', companyTitle: '厦门建发股份有限公司', department: '海外业务部', accountingGroup: '钢材核算组',
        shipmentDeadline: '2026-04-12', internalDeliveryDate: '2026-03-28', settlementMethod: '远期信用证', receiptStatus: '待收证', controlledOrder: '否',
        prepaymentRatio: '15%', freightUnitPrice: '¥1200/托', purchaseTerms: 'CIF 鹿特丹', salesTerms: '境外库存', dispatchedByUs: '是', portMiscUnitPrice: '¥180/托',
        tradeType: '目的港库存', effectiveDate: '2026-02-25', contractQty: 450
      }
    };

    function initializeItemDefaults(item) {
      const profile = itemProfiles[item.id] || {};
      Object.keys(profile).forEach(key => {
        if (item[key] === undefined) item[key] = profile[key];
      });
      item.goodsLines = (item.goodsLines || []).map((line, index) => ({
        ...line,
        projectNo: line.projectNo || item.projectNo,
        contractQty: line.contractQty ?? Math.round((item.contractQty || line.allocatable || 0) * ((line.allocatable || 0) / Math.max(item.allocatableQty || line.allocatable || 1, 1))),
        proposed: line.proposed ?? Math.max(0, (line.allocatable || 0) - (line.allocated || 0))
      }));
      if (!item.contractQty) item.contractQty = item.goodsLines.reduce((sum, line) => sum + (line.contractQty || line.allocatable || 0), 0);
      if (!item.goodsLines.length) item.contractQty = item.contractQty || 0;
      item.logisticsDemands = item.logisticsDemands || [];
      return item;
    }

    state.items.forEach(initializeItemDefaults);

    function escapeHtml(value) {
      return String(value ?? '-').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    }

    function getMainContractNo(item) {
      return item.type === 'dest' ? (item.purchaseNo || '-') : (item.salesNo || '-');
    }

    function getTradeContractType(item) {
      return item.type === 'dest' ? '采购合同' : '销售合同';
    }

    function getAssociatedContractNo(item) {
      return item.type === 'dest' ? '-' : (item.purchaseNo || '-');
    }

    function getAssociatedContractType(item) {
      return item.type === 'dest' ? '无' : '采购合同';
    }

    function getProjectDisplay(item) {
      const projectNos = item.projectNos || (item.goodsLines || []).map(line => line.projectNo || item.projectNo).filter(Boolean);
      return [...new Set(projectNos.length ? projectNos : [item.projectNo])].join(',');
    }

    function getGoodsSummary(item) {
      const names = [...new Set((item.goodsLines || []).map(line => line.name).filter(Boolean))];
      return names.length > 1 ? `${names[0]} 等多个` : (names[0] || '-');
    }

    function getContractQty(item) {
      return Number(item.contractQty ?? (item.goodsLines || []).reduce((sum, line) => sum + (line.contractQty ?? line.allocatable ?? 0), 0));
    }

    function getAllocatableQty(item) {
      return Number(item.allocatableQty ?? (item.goodsLines || []).reduce((sum, line) => sum + (line.allocatable || 0), 0));
    }

    function getAllocatedQty(item) {
      return Number(item.allocatedQty ?? (item.goodsLines || []).reduce((sum, line) => sum + (line.allocated || 0), 0));
    }

    function getPendingQty(item) {
      return getAllocatableQty(item) - getAllocatedQty(item);
    }

    function getUnsubmittedQty(item) {
      return getContractQty(item) - getAllocatedQty(item);
    }

    function getDisplayStatus(item) {
      const pending = getPendingQty(item);
      if (pending <= 0) return '已提交';
      return '未提交';
    }

    function getContractStatusLabel(item) {
      const allowed = ['执行中', '已完结', '已作废'];
      return allowed.includes(item.contractStatus) ? item.contractStatus : '执行中';
    }

    function getContractStatusClass(item) {
      const status = getContractStatusLabel(item);
      if (status === '已完结') return 'ct-status closed';
      if (status === '已作废') return 'ct-status voided';
      return 'ct-status pending';
    }

    function getPurchaseContractStatusLabel(item) {
      return item.purchaseContractStatus || '执行中';
    }

    function getPurchaseContractStatusClass(item) {
      const status = getPurchaseContractStatusLabel(item);
      if (status === '已完结') return 'ct-status closed';
      if (status === '已作废') return 'ct-status voided';
      return 'ct-status pending';
    }

    function getPriceTerms(item) {
      return item.priceTerms || item.purchaseTerms || item.salesTerms || '-';
    }

    function getControlledMode(item) {
      return item.controlledMode || (item.type === 'dest' ? '目的港库存业务' : '非目的港库存业务');
    }

    function getInternalCustomerValue(item) {
      return item.isInternalCustomer || '是';
    }

    function getAutoAllocatedQty(item) {
      return Number(item.autoAllocatedQty ?? (item.goodsLines || []).reduce((sum, line) => sum + Number(line.autoAllocated ?? line.allocatable ?? 0), 0));
    }

    function getEffectiveManualInQty(item) {
      return Number(item.manualInQty ?? (item.goodsLines || []).reduce((sum, line) => sum + Number(line.manualIn ?? 0), 0));
    }

    function getEffectiveManualOutQty(item) {
      return Number(item.manualOutQty ?? (item.goodsLines || []).reduce((sum, line) => sum + Number(line.manualOut ?? 0), 0));
    }

    function getSourceTypeLabel(item) {
      return item.pullType === 'MANUAL' ? '手动拉入' : '自动进入';
    }

    // 完结状态：合同已关闭或全部数量已安排视为已提交，否则未提交
    function getClosedStatus(item) {
      const contract = getContractQty(item);
      const allocated = getAllocatedQty(item);
      if (contract > 0 && allocated >= contract) return '已完结';
      return '未完结';
    }

    // ===== 商品明细行维度状态（列表按商品明细行展示与操作） =====
    function getRowPendingQty(row) {
      const goods = row.goods || {};
      return Number(goods.allocatable || 0) - Number(goods.allocated || 0);
    }

    function getRowDisplayStatus(row) {
      return getRowPendingQty(row) <= 0 ? '已提交' : '未提交';
    }

    function getRowClosedStatus(row) {
      const goods = row.goods || {};
      if (typeof goods.closed === 'boolean') return goods.closed ? '已完结' : '未完结';
      const contractQty = Number(goods.contractQty ?? goods.allocatable ?? 0);
      const allocatedQty = Number(goods.allocated || 0);
      if (contractQty > 0 && allocatedQty >= contractQty) return '已完结';
      return '未完结';
    }

    function getRowLabel(row) {
      const goodsName = row.goods?.name || '-';
      return `${getMainContractNo(row.item)} / ${goodsName}`;
    }

    // 按剩余商品明细行回写合同汇总数量
    function syncItemQtyFromLines(item) {
      const lines = item.goodsLines || [];
      const sum = key => lines.reduce((total, line) => total + Number(line[key] || 0), 0);
      item.contractQty = lines.reduce((total, line) => total + Number(line.contractQty ?? line.allocatable ?? 0), 0);
      item.allocatableQty = sum('allocatable');
      item.allocatedQty = sum('allocated');
      item.autoAllocatedQty = sum('autoAllocated');
      item.manualInQty = sum('manualIn');
      item.manualOutQty = sum('manualOut');
      item.projectNos = [...new Set(lines.map(line => line.projectNo || item.projectNo).filter(Boolean))];
    }

    // 合同下全部商品明细行都已完结时才把合同标记为已关闭（供行内“生成服务要求”等合同级校验使用）
    function syncItemClosedState(item) {
      const rows = getWorkbenchGoodsRows(item);
      const allClosed = rows.length > 0 && rows.every(row => row.goods?.closed === true);
      if (allClosed) {
        item.status = '已关闭';
      } else if (item.status === '已关闭') {
        item.status = getDisplayStatus(item);
      }
    }

    function hasNoAvailable(item) {
      return getPendingQty(item) <= 0;
    }

    function formatQty(value, unit = '') {
      const number = Number(value || 0).toLocaleString();
      return unit ? `${number} ${unit}` : number;
    }

    function getRiskTitles(item) {
      const titles = [];
      if (getPendingQty(item) < 0) titles.push('待订舱数量为负');
      const flags = Array.isArray(item.riskFlags) && item.riskFlags.length
        ? item.riskFlags
        : [item.riskFlag];
      flags.forEach(flag => {
        if (flag && flag !== '正常' && !titles.includes(flag)) titles.push(flag);
      });
      return titles;
    }

    function getRiskItems(item) {
      return getRiskTitles(item).map(title => getRiskDefinition(item, title) || {
        title,
        description: item.riskDescription || '当前合同存在风险，请及时关注。'
      });
    }

    function getRiskLabel(item) {
      return getRiskTitles(item)[0] || '正常';
    }

    function getRiskCount(item) {
      return getRiskTitles(item).length;
    }

    function getRiskLevel(item) {
      return getRiskCount(item) ? 'risk' : 'normal';
    }

    function getRiskDefinition(item, riskTitle) {
      const risk = riskTitle || getRiskLabel(item);
      const pendingQty = getPendingQty(item);
      const unit = item.goodsLines?.[0]?.unit || '吨';
      const definitions = {
        '待订舱数量为负': {
          title: '待订舱数量为负',
          description: `当前待订舱数量为 ${formatQty(pendingQty, unit)}，请核对合同数量。`,
          trigger: `待订舱数量 = ${formatQty(pendingQty, unit)}`,
          impact: '当前可订舱数量不足，继续安排可能导致数量超配。',
          suggestion: '请核对采购合同可用数量、已订舱数量及人工分配记录，修正数量后再继续处理。'
        },
        '已有关联服务要求': {
          title: '已有关联服务要求',
          description: '当前合同已存在未作废的关联服务要求。',
          trigger: '存在状态不为“作废”的关联服务要求。',
          impact: '该合同不允许重复生成服务要求，避免重复订舱。',
          suggestion: '请先查看并处理已有服务要求；如需重新生成，请先手动删除或作废原服务要求。'
        },
        '贸易合同号变更': {
          title: '贸易合同号变更',
          description: `原贸易合同号：${item.previousContractNo || '-'}，现贸易合同号：${getMainContractNo(item)}`,
          trigger: `原贸易合同号：${item.previousContractNo || '-'}，现贸易合同号：${getMainContractNo(item)}`,
          impact: '合同编号发生变更，请确认关联单据与后续操作使用最新合同号。',
          suggestion: '请核对合同变更信息，并同步更新相关业务单据。'
        },
        '超期未订舱': {
          title: '超期未订舱',
          description: `最迟装运日期 ${item.shipmentDeadline || '-'} 已到期，仍存在待订舱数量。`,
          trigger: `最迟装运日期 ${item.shipmentDeadline || '-'} 已到期，仍存在待订舱数量。`,
          impact: '可能影响客户交付和合同履约时效。',
          suggestion: '请尽快确认订舱安排；如日期已调整，请同步更新控制塔合同数据。'
        },
        '临期预警': {
          title: '临期预警',
          description: `最迟装运日期 ${item.shipmentDeadline || '-'} 临近，请优先安排订舱。`,
          trigger: `最迟装运日期 ${item.shipmentDeadline || '-'} 临近，当前仍存在待订舱数量。`,
          impact: '可安排窗口较短，可能产生订舱时效风险。',
          suggestion: '建议优先完成订舱安排，并关注物流资源和单证准备情况。'
        }
      };
      return definitions[risk] || null;
    }

    function isItemInRiskOverview(item) {
      if (!state.riskOverview) return true;
      return getRiskLevel(item) === 'risk';
    }

    function getManualPoolProjectDisplay(item) {
      const projects = item.projectNos || (item.goodsLines || []).map(goods => goods.projectNo || item.projectNo).filter(Boolean);
      return [...new Set(projects.length ? projects : [item.projectNo])].join(',');
    }

    function getManualPoolGoodsSummary(item) {
      const names = [...new Set((item.goodsLines || []).map(goods => goods.name).filter(Boolean))];
      return names.length > 1 ? `${names[0]} 等多个` : (names[0] || '-');
    }

    function getManualPoolContractQty(item) {
      return Number(item.contractQty ?? (item.goodsLines || []).reduce((sum, goods) => sum + Number(goods.contractQty || 0), 0));
    }

    function getManualPoolStatusClass(item) {
      const status = getDisplayStatus(item);
      if (status === '已提交') return 'ct-status done';
      return 'ct-status pending';
    }

    // --- Workbench Main Table Rendering & Operations ---

    // Render Table Rows based on Tab & Filter Criteria
    function getWorkbenchGoodsRows(item) {
      const goodsLines = Array.isArray(item.goodsLines) && item.goodsLines.length
        ? item.goodsLines
        : [{
          projectNo: item.projectNo,
          name: item.goodsName || '-',
          contractQty: item.contractQty || 0,
          allocatable: item.allocatableQty || 0,
          allocated: item.allocatedQty || 0,
          autoAllocated: item.autoAllocatedQty || 0,
          manualIn: item.manualInQty || 0,
          manualOut: item.manualOutQty || 0,
          unit: item.goodsLines?.[0]?.unit || '吨'
        }];
      return goodsLines.map((goods, goodsIndex) => ({
        key: `${item.id}::${goodsIndex}`,
        item,
        goods,
        goodsIndex
      }));
    }

    function getWorkbenchRowKey(itemId, goodsIndex) {
      return `${itemId}::${goodsIndex}`;
    }

    function getSelectedWorkbenchRows() {
      return Array.from(state.selectedRowIds).map(key => {
        const separatorIndex = key.lastIndexOf('::');
        const itemId = separatorIndex >= 0 ? key.slice(0, separatorIndex) : key;
        const goodsIndex = separatorIndex >= 0 ? Number(key.slice(separatorIndex + 2)) : 0;
        const item = state.items.find(candidate => candidate.id === itemId);
        if (!item) return null;
        const goods = item.goodsLines?.[goodsIndex] || item.goodsLines?.[0];
        return { key, item, goods, goodsIndex: Number.isFinite(goodsIndex) ? goodsIndex : 0 };
      }).filter(Boolean);
    }

    function getSelectedWorkbenchItems() {
      return [...new Map(getSelectedWorkbenchRows().map(row => [row.item.id, row.item])).values()];
    }

    function renderWorkbenchTable() {
      const tbody = document.getElementById('workbenchTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      const prjVal = (document.getElementById('filter-projectNo')?.value || '').trim().toLowerCase();
      const salesVal = (document.getElementById('filter-salesNo')?.value || '').trim().toLowerCase();
      const purchaseVal = (document.getElementById('filter-purchaseNo')?.value || '').trim().toLowerCase();
      const custVal = (document.getElementById('filter-customer')?.value || '').trim().toLowerCase();
      const statusVal = document.getElementById('filter-status')?.value || '';
      const salesManVal = (document.getElementById('filter-salesman')?.value || '').trim().toLowerCase();
      const departmentVal = (document.getElementById('filter-department')?.value || '').trim().toLowerCase();
      const goodsVal = (document.getElementById('filter-goods')?.value || '').trim().toLowerCase();
      const supplierVal = (document.getElementById('filter-supplier')?.value || '').trim().toLowerCase();
      const shipmentFrom = document.getElementById('filter-shipmentDateFrom')?.value || '';
      const shipmentTo = document.getElementById('filter-shipmentDateTo')?.value || '';
      const availabilityVal = document.getElementById('filter-availability')?.value || '';
      const completionVal = document.getElementById('filter-completion')?.value || '';
      const riskVal = document.getElementById('filter-risk')?.value || '';
      const internalCustomerVal = document.getElementById('filter-internalCustomer')?.value || '';

      const filteredItems = state.items.filter(item => {
        if (item.type !== state.currentTab) return false;
        if (!isItemInRiskOverview(item)) return false;

        const salesNo = (item.salesNo || '').toLowerCase();
        const purchaseNo = (item.purchaseNo || '').toLowerCase();
        const customer = (item.customer || '').toLowerCase();
        const supplier = (item.supplier || '').toLowerCase();
        const salesman = (item.salesman || '').toLowerCase();
        const department = (item.department || '').toLowerCase();

        if (salesVal && !salesNo.includes(salesVal)) return false;
        if (purchaseVal && !purchaseNo.includes(purchaseVal)) return false;
        if (custVal && !customer.includes(custVal)) return false;
        if (salesManVal && !salesman.includes(salesManVal)) return false;
        if (departmentVal && !department.includes(departmentVal)) return false;
        if (supplierVal && !supplier.includes(supplierVal)) return false;
        if (shipmentFrom && (item.shipmentDeadline || '') < shipmentFrom) return false;
        if (shipmentTo && (item.shipmentDeadline || '') > shipmentTo) return false;
        if (riskVal) {
          const matchedRisk = getRiskTitles(item).some(title =>
            title === riskVal || (riskVal === '贸易合同变更' && title === '贸易合同号变更')
          );
          if (!matchedRisk) return false;
        }
        if (internalCustomerVal && getInternalCustomerValue(item) !== internalCustomerVal) return false;
        return true;
      });

      const filteredRows = filteredItems.flatMap(getWorkbenchGoodsRows).filter(row => {
        const { item, goods } = row;
        const projectNo = String(goods.projectNo || item.projectNo || '').toLowerCase();
        const goodsName = String(goods.name || '').toLowerCase();
        const goodsCode = String(goods.goodscode || goods.code || '').toLowerCase();
        const rowPendingQty = getRowPendingQty(row);
        if (prjVal && !projectNo.includes(prjVal)) return false;
        if (goodsVal && !goodsName.includes(goodsVal) && !goodsCode.includes(goodsVal)) return false;
        if (statusVal && getRowDisplayStatus(row) !== statusVal) return false;
        if (state.submissionOverview && getRowDisplayStatus(row) !== state.submissionOverview) return false;
        if (completionVal && getRowClosedStatus(row) !== completionVal) return false;
        if (state.completionOverview && getRowClosedStatus(row) !== state.completionOverview) return false;
        if (availabilityVal === 'none' && rowPendingQty > 0) return false;
        if (availabilityVal === 'available' && rowPendingQty <= 0) return false;
        return true;
      });

      state.visibleWorkbenchRowKeys = filteredRows.map(row => row.key);
      const filteredUniqueItems = [...new Map(filteredRows.map(row => [row.item.id, row.item])).values()];
      updateWorkbenchStats(filteredUniqueItems, filteredRows.length);

      if (filteredRows.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="${getMainTableColspan()}" style="padding:0;border-bottom:0">
              <div class="ui-state-block is-table-inline" data-state="empty" data-density="compact">
                <div class="ui-state-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg></div>
                <div class="ui-state-title">暂无符合条件的商品明细</div>
                <p class="ui-state-message">调整筛选条件，或清空筛选后重新查询。</p>
                <div class="ui-state-actions"><button type="button" class="secondary" onclick="resetFilters()">清空筛选</button></div>
              </div>
            </td>
          </tr>
        `;
        const masterCheckbox = document.getElementById('selectAllCheckbox');
        if (masterCheckbox) masterCheckbox.checked = false;
        return;
      }

      filteredRows.forEach(row => {
        const { item, goods } = row;
        const rowKey = row.key;
        const isSelected = state.selectedRowIds.has(rowKey);
        const status = getRowDisplayStatus(row);
        const risk = getRiskLabel(item);
        const riskItems = getRiskItems(item);
        const riskCount = riskItems.length;
        const riskSummary = riskCount > 1 ? `${riskItems[0].title} +${riskCount - 1}` : (riskItems[0]?.title || '正常');
        const unit = goods.unit || item.goodsLines?.[0]?.unit || '';
        const projectNo = goods.projectNo || item.projectNo || '-';
        const contractQty = Number(goods.contractQty ?? goods.allocatable ?? 0);
        const allocatableQty = Number(goods.allocatable || 0);
        const allocatedQty = Number(goods.allocated || 0);
        const pendingQty = allocatableQty - allocatedQty;
        const autoAllocatedQty = Number(goods.autoAllocated ?? allocatableQty);
        const manualInQty = Number(goods.manualIn || 0);
        const manualOutQty = Number(goods.manualOut || 0);
        const closedStatus = getRowClosedStatus(row);
        const riskBadgeClass = riskCount ? 'ct-risk danger' : 'ct-risk';
        const riskLevel = getRiskLevel(item);
        let statusBadgeClass = 'ct-status pending';
        if (status === '已提交') statusBadgeClass = 'ct-status done';
        const closedBadgeClass = closedStatus === '已完结' ? 'ct-status closed' : 'ct-status pending';
        const tr = document.createElement('tr');
        tr.dataset.itemId = item.id;
        tr.dataset.goodsIndex = String(row.goodsIndex);
        tr.dataset.rowKey = rowKey;
        tr.className = `${isSelected ? 'selected-row ' : ''}${riskLevel === 'risk' ? 'risk-row' : ''}`;

        tr.innerHTML = `
          <td class="ct-freeze-left ct-freeze-select" style="text-align:center">
            <input type="checkbox" ${isSelected ? 'checked' : ''} aria-label="选择商品 ${escapeHtml(goods.name || row.key)}" onchange="toggleRowSelect('${rowKey}', this.checked)" />
          </td>
          <td class="ct-freeze-left ct-freeze-contract ct-key-cell" title="${escapeHtml(getMainContractNo(item))}">
            <span class="ct-contract-cell">
              <span class="ct-contract-no">${escapeHtml(getMainContractNo(item))}</span>
              ${riskCount ? `<button type="button" class="ct-risk-marker" data-risk-item-id="${item.id}" aria-expanded="false" aria-describedby="riskPopover" aria-label="查看风险提醒${riskCount > 1 ? `（${riskCount}项）` : ''}" onmouseenter="scheduleRiskPopover(this)" onmouseleave="scheduleRiskPopoverClose()" onfocus="showRiskPopover(this)" onblur="scheduleRiskPopoverClose()" onclick="toggleRiskPopover(this, event)"><i data-lucide="shield-alert"></i></button>` : ''}
            </span>
          </td>
          <td class="ct-contract-status-col"><span class="${getContractStatusClass(item)}">${escapeHtml(getContractStatusLabel(item))}</span></td>
          <td><span class="${statusBadgeClass}">${status}</span></td>
          <td class="ct-key-cell" title="${escapeHtml(projectNo)}">${escapeHtml(projectNo)}</td>
          <td class="ct-long-cell" title="${escapeHtml(goods.name || '-')}">${escapeHtml(goods.name || '-')}</td>
          <td class="ct-number">${formatQty(contractQty)}</td>
          <td class="ct-number" style="font-weight:600">${formatQty(allocatableQty)}</td>
          <td class="ct-number">${formatQty(allocatedQty)}</td>
          <td class="ct-number">
            ${formatQty(pendingQty)}
            ${pendingQty <= 0 ? '<span class="ct-no-available">无可订舱</span>' : ''}
          </td>
          <td>${escapeHtml(unit || '-')}</td>
          <td class="dest-column-hidden ct-muted-cell" title="${escapeHtml(getAssociatedContractNo(item))}">${escapeHtml(getAssociatedContractNo(item))}</td>
          <td class="dest-column-hidden"><span class="${getPurchaseContractStatusClass(item)}">${escapeHtml(getPurchaseContractStatusLabel(item))}</span></td>
          <td class="ct-number">${formatQty(autoAllocatedQty)}</td>
          <td class="ct-number">${manualInQty - manualOutQty > 0 ? '+' : ''}${formatQty(manualInQty - manualOutQty)}</td>
          <td>${escapeHtml(item.operatingUnit)}</td>
          <td class="ct-long-cell" title="${escapeHtml(item.companyTitle)}">${escapeHtml(item.companyTitle)}</td>
          <td>${escapeHtml(item.department)}</td>
          <td>${escapeHtml(item.accountingGroup)}</td>
          <td>${escapeHtml(item.salesman)}</td>
          <td>厦门港</td>
          <td>大连港</td>
          <td>${escapeHtml(item.shipmentDeadline)}</td>
          <td class="dest-column-hidden ct-long-cell" title="${escapeHtml(item.customer)}">${escapeHtml(item.customer)}</td>
          <td>${escapeHtml(getInternalCustomerValue(item))}</td>
          <td class="ct-long-cell" title="${escapeHtml(item.supplier)}">${escapeHtml(item.supplier)}</td>
          <td>${escapeHtml(item.internalDeliveryDate)}</td>
          <td>${escapeHtml(item.settlementMethod)}</td>
          <td>${escapeHtml(item.controlledOrder)}</td>
          <td class="dest-column-hidden">${escapeHtml(item.prepaymentRatio)}</td>
          <td class="ct-number">${escapeHtml(item.freightUnitPrice)}</td>
          <td>${escapeHtml(getPriceTerms(item))}</td>
          <td>${escapeHtml(getControlledMode(item))}</td>
          <td>${escapeHtml(item.dispatchedByUs)}</td>
          <td class="ct-number">${escapeHtml(item.portMiscUnitPrice)}</td>
          <td>${escapeHtml(item.tradeType)}</td>
          <td><span class="${closedBadgeClass}">${closedStatus}</span></td>
          <td>${escapeHtml(getTradeContractType(item))}</td>
          <td class="dest-column-hidden">${escapeHtml(getAssociatedContractType(item))}</td>
          <td>${escapeHtml(item.effectiveDate)}</td>
          <td>${escapeHtml(getSourceTypeLabel(item))}</td>
          <td class="ct-freeze-right ct-freeze-action" style="text-align:center">
            <div class="ct-action-stack">
              <button onclick="generateLogisticsDemand('${item.id}')" class="ct-row-action" title="生成服务要求">生成服务要求</button>
              <button onclick="openLogisticsDemandModal('${item.id}')" class="ct-row-action" title="查看服务要求">查看服务要求(${item.logisticsDemands.length})</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });

      const masterCheckbox = document.getElementById('selectAllCheckbox');
      if (masterCheckbox) {
        masterCheckbox.checked = filteredRows.length > 0 && filteredRows.every(row => state.selectedRowIds.has(row.key));
      }
      if (window.lucide) lucide.createIcons();
    }

    // Switch Top Business Tab
    function switchTab(tab) {
      state.currentTab = tab;
      state.selectedRowIds.clear();
      document.getElementById('selectedCount').textContent = '0';
      document.body.classList.toggle('dest-tab', tab === 'dest');

      const tabNonDest = document.getElementById('tab-non_dest');
      const tabDest = document.getElementById('tab-dest');

      if (tab === 'non_dest') {
        tabNonDest.className = 'ct-business-tab active';
        tabDest.className = 'ct-business-tab';
      } else {
        tabDest.className = 'ct-business-tab active';
        tabNonDest.className = 'ct-business-tab';
      }

      renderWorkbenchTable();
    }

    // Single Row Selection Toggle
    function toggleRowSelect(id, checked) {
      if (checked) {
        state.selectedRowIds.add(id);
      } else {
        state.selectedRowIds.delete(id);
      }
      document.getElementById('selectedCount').textContent = state.selectedRowIds.size;
      renderWorkbenchTable();
    }

    // Select All Rows in Active View
    function toggleSelectAll(masterCb) {
      const visibleKeys = state.visibleWorkbenchRowKeys || [];
      if (masterCb.checked) {
        visibleKeys.forEach(key => state.selectedRowIds.add(key));
      } else {
        visibleKeys.forEach(key => state.selectedRowIds.delete(key));
      }
      document.getElementById('selectedCount').textContent = state.selectedRowIds.size;
      renderWorkbenchTable();
    }

    function getCurrentFilteredItems() {
      return [...new Map((state.selectedRowIds || []).map(key => {
        const itemId = String(key).split('::')[0];
        return [itemId, state.items.find(item => item.id === itemId)];
      }).filter(([, item]) => Boolean(item))).values()];
    }

    function clearSelectedManualAllocations() {
      if (state.selectedRowIds.size === 0) {
        showToast('请先选择需要清空人工分配的待办记录', 'warning');
        return;
      }
      const selectedRows = getSelectedWorkbenchRows();
      const affected = selectedRows.filter(row =>
        Number(row.goods?.manualIn || 0) > 0 || Number(row.goods?.manualOut || 0) > 0
      );
      if (!affected.length) {
        showToast('所选记录暂无人工分配数据', 'info');
        return;
      }
      if (!window.confirm('确认重算？重算后将清空所有人工分配数据。')) return;

      affected.forEach(row => {
        const line = row.goods;
        const currentAllocatable = Number(line.allocatable || 0);
        const currentManualIn = Number(line.manualIn || 0);
        const currentManualOut = Number(line.manualOut || 0);
        const autoAllocated = Number(
          line.autoAllocated
          ?? Math.max(0, currentAllocatable - currentManualIn + currentManualOut)
        );
        line.autoAllocated = autoAllocated;
        line.manualIn = 0;
        line.manualOut = 0;
        line.allocatable = autoAllocated;
      });
      [...new Map(affected.map(row => [row.item.id, row.item])).values()].forEach(item => {
        item.autoAllocatedQty = (item.goodsLines || []).reduce((sum, line) => sum + Number(line.autoAllocated || 0), 0);
        item.manualInQty = 0;
        item.manualOutQty = 0;
        item.allocatableQty = item.autoAllocatedQty;
        item.proposedQty = Math.max(0, getPendingQty(item));
        item.status = getDisplayStatus(item);
      });

      renderWorkbenchTable();
      showToast(`已清空 ${affected.length} 条商品明细的人工分配数据`, 'success');
    }

    // 批量删除：仅删除所选商品明细行；合同下所有行都删完时才移除该待办
    function batchDeleteRows() {
      if (state.selectedRowIds.size === 0) {
        showToast('请先选择需要删除的商品明细行', 'warning');
        return;
      }
      const selectedRows = getSelectedWorkbenchRows();
      if (selectedRows.some(row => row.item.logisticsDemands.some(demand => demand.status !== '作废'))) {
        showToast('整批拦截：所选商品明细行存在未作废服务要求，不能删除', 'danger');
        return;
      }

      const grouped = new Map();
      selectedRows.forEach(row => {
        if (!grouped.has(row.item.id)) grouped.set(row.item.id, { item: row.item, indexes: new Set() });
        grouped.get(row.item.id).indexes.add(row.goodsIndex);
      });

      grouped.forEach(({ item, indexes }) => {
        const allLines = item.goodsLines || [];
        item.goodsLines = allLines.filter((line, index) => !indexes.has(index));

        if (item.goodsLines.length === 0) {
          item.deleted = true;
          if (!state.controlTowerPool.some(candidate => candidate.projectNo === item.projectNo && candidate.salesNo === item.salesNo && candidate.purchaseNo === item.purchaseNo)) {
            state.controlTowerPool.push({
              id: `CT-REOPEN-${item.id}`,
              type: item.type,
              projectNo: item.projectNo,
              projectNos: item.projectNos || allLines.map(goods => goods.projectNo || item.projectNo),
              salesNo: item.salesNo,
              purchaseNo: item.purchaseNo,
              customer: item.customer,
              supplier: item.supplier,
              salesman: item.salesman,
              operatingUnit: item.operatingUnit,
              companyTitle: item.companyTitle,
              department: item.department,
              accountingGroup: item.accountingGroup,
              shipmentDeadline: item.shipmentDeadline,
              settlementMethod: item.settlementMethod,
              receiptStatus: item.receiptStatus,
              controlledOrder: item.controlledOrder,
              prepaymentRatio: item.prepaymentRatio,
              freightUnitPrice: item.freightUnitPrice,
              purchaseTerms: item.purchaseTerms,
              salesTerms: item.salesTerms,
              dispatchedByUs: item.dispatchedByUs,
              portMiscUnitPrice: item.portMiscUnitPrice,
              tradeType: item.tradeType,
              status: getDisplayStatus(item),
              goodsLines: allLines.map(goods => ({
                code: goods.code,
                projectNo: goods.projectNo || item.projectNo,
                name: goods.name,
                contractQty: goods.contractQty ?? goods.allocatable ?? 0,
                unit: goods.unit || '吨'
              }))
            });
          }
        } else {
          syncItemQtyFromLines(item);
        }
      });

      state.items = state.items.filter(item => !item.deleted);
      state.selectedRowIds.clear();
      document.getElementById('selectedCount').textContent = '0';
      renderWorkbenchTable();
      showToast(`已删除 ${selectedRows.length} 条商品明细`, 'success');
    }

    // 批量完结：仅完结所选商品明细行
    function batchCloseRows() {
      if (state.selectedRowIds.size === 0) {
        showToast('请先选择需要完结的商品明细行', 'warning');
        return;
      }
      const selectedRows = getSelectedWorkbenchRows();
      if (selectedRows.some(row => row.item.logisticsDemands.some(demand => demand.status !== '作废'))) {
        showToast('整批拦截：所选商品明细行存在未作废服务要求，不能完结', 'danger');
        return;
      }
      selectedRows.forEach(row => {
        if (row.goods) row.goods.closed = true;
        syncItemClosedState(row.item);
      });
      renderWorkbenchTable();
      showToast(`已完结 ${selectedRows.length} 条商品明细`, 'success');
    }

    // 批量取消完结：仅取消所选商品明细行
    function batchResumeRows() {
      if (state.selectedRowIds.size === 0) {
        showToast('请先选择需要取消完结的商品明细行', 'warning');
        return;
      }
      const selectedRows = getSelectedWorkbenchRows();
      if (selectedRows.some(row => getRowClosedStatus(row) !== '已完结')) {
        showToast('整批拦截：只有已完结的商品明细行可以取消完结', 'danger');
        return;
      }
      selectedRows.forEach(row => {
        if (row.goods) row.goods.closed = false;
        syncItemClosedState(row.item);
      });
      renderWorkbenchTable();
      showToast(`已取消完结 ${selectedRows.length} 条商品明细`, 'success');
    }

    // Filter Form Handlers
    function handleSearch(e) {
      if (e) e.preventDefault();
      renderWorkbenchTable();
      showToast('已根据查询条件刷新数据', 'info');
    }

    function resetFilters() {
      document.getElementById('filterForm').reset();
      state.riskOverview = '';
      state.submissionOverview = '';
      state.completionOverview = '';
      renderWorkbenchTable();
      showToast('已重置筛选条件', 'info');
    }

    function toggleExtendedFilters() {
      const ext = document.getElementById('extendedFilters');
      const btn = document.getElementById('toggleFilterBtn');
      if (ext.classList.contains('hidden')) {
        ext.classList.remove('hidden');
        btn.innerHTML = `<span>收起</span><i data-lucide="chevron-up" class="w-3.5 h-3.5"></i>`;
      } else {
        ext.classList.add('hidden');
        btn.innerHTML = `<span>查看更多</span><i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>`;
      }
      if (window.lucide) lucide.createIcons();
    }

    // Update Top Badges & Counters（统计口径：商品明细行）
    function updateWorkbenchStats(filteredItems, totalRows = filteredItems.length) {
      const rowsOfTab = tab => state.items
        .filter(i => i.type === tab)
        .flatMap(getWorkbenchGoodsRows);

      const nonDestRows = rowsOfTab('non_dest');
      const destRows = rowsOfTab('dest');

      document.getElementById('badge-non_dest').textContent = nonDestRows.length;
      document.getElementById('badge-dest').textContent = destRows.length;

      const currentTabRows = rowsOfTab(state.currentTab);
      const pendingCount = currentTabRows.filter(row => getRowDisplayStatus(row) === '未提交').length;
      const partialCount = currentTabRows.filter(row => getRowDisplayStatus(row) === '已提交').length;
      const completedCount = currentTabRows.filter(row => getRowClosedStatus(row) === '已完结').length;
      const riskCount = currentTabRows.filter(row => getRiskLevel(row.item) !== 'normal').length;
      document.getElementById('stat-pending').textContent = pendingCount;
      document.getElementById('stat-partial').textContent = partialCount;
      document.getElementById('stat-completed').textContent = completedCount;
      document.getElementById('stat-risk').textContent = riskCount;
      document.getElementById('totalRecords').textContent = totalRows;

      const riskOverviewButton = document.getElementById('riskOverview-all');
      if (riskOverviewButton) riskOverviewButton.classList.toggle('active', state.riskOverview === 'all');
      const pendingButton = document.getElementById('submissionOverview-pending');
      if (pendingButton) pendingButton.classList.toggle('active', state.submissionOverview === '未提交');
      const submittedButton = document.getElementById('submissionOverview-submitted');
      if (submittedButton) submittedButton.classList.toggle('active', state.submissionOverview === '已提交');
      const completedButton = document.getElementById('completionOverview-completed');
      if (completedButton) completedButton.classList.toggle('active', state.completionOverview === '已完结');
    }

    function applyRiskOverview() {
      const isActive = state.riskOverview === 'all';
      state.riskOverview = isActive ? '' : 'all';
      state.submissionOverview = '';
      state.completionOverview = '';
      renderWorkbenchTable();
      showToast(state.riskOverview ? '已筛选风险记录' : '已取消风险筛选', 'info');
    }

    function applySubmissionOverview(status) {
      const isActive = state.submissionOverview === status;
      state.submissionOverview = isActive ? '' : status;
      state.completionOverview = '';
      state.riskOverview = '';
      renderWorkbenchTable();
      showToast(state.submissionOverview ? `已筛选${status}数据` : '已取消提交状态筛选', 'info');
    }

    function applyCompletionOverview(status) {
      const isActive = state.completionOverview === status;
      state.completionOverview = isActive ? '' : status;
      state.submissionOverview = '';
      state.riskOverview = '';
      renderWorkbenchTable();
      showToast(state.completionOverview ? `已筛选${status}数据` : '已取消完结状态筛选', 'info');
    }

    // Global Active State for Allocation Modal
    let activeAllocContext = {
      projectNo: '',
      sources: [],
      targets: [],
      allCandidates: [],
      selectedCandidateIds: new Set(),
      expandedCandidateIds: new Set(),
      selectedMatchComboKeys: new Set(),
      matchCombos: [],
      chipsExpanded: false
    };

    let activeDemandContext = {
      item: null,
      lines: []
    };

    let activeLogisticsContext = {
      itemId: '',
      item: null,
      demands: [],
      taskMap: new Map(),
      commissionMap: new Map(),
      serviceRequirementMap: new Map()
    };

    let activeCommissionContext = null;
    let riskPopoverTrigger = null;
    let riskPopoverPinned = false;
    let riskPopoverShowTimer = null;
    let riskPopoverHideTimer = null;

    function cloneAllocationItem(item) {
      const clone = JSON.parse(JSON.stringify(item));
      clone.goodsLines = (clone.goodsLines || []).map((line, index) => ({ ...line, __lineIndex: line.__lineIndex ?? index, proposed: 0 }));
      return clone;
    }

    function getAllocationProjectNos(items) {
      const projects = [];
      items.forEach(item => {
        (item.goodsLines || []).forEach(line => {
          const projectNo = getGoodsProject(line, item);
          if (projectNo && !projects.includes(projectNo)) projects.push(projectNo);
        });
      });
      return projects;
    }

    function getGoodsCode(line) {
      return line.code || line.goodscode || '';
    }

    function getGoodsProject(line, item) {
      return line.projectNo || line.businessProjectNo || item.projectNo;
    }

    function getTargetById(targetId) {
      return activeAllocContext.targets.find(target => target.id === targetId);
    }

    function prepareAllocationCandidates(items) {
      return items.map(cloneAllocationItem);
    }

    function isSameAllocationGoods(source, sourceGoods, target, targetGoods) {
      return getGoodsCode(sourceGoods) === getGoodsCode(targetGoods) &&
        getGoodsProject(sourceGoods, source) === getGoodsProject(targetGoods, target);
    }

    // Group key for matching source/target goods: business project + goodsCode
    function getGoodsGroupKey(goods, item) {
      return `${getGoodsProject(goods, item)}::${getGoodsCode(goods)}::${item.purchaseNo || ''}`;
    }

    function getAllocationMatchComboKey(goods, item) {
      const goodsKey = getGoodsCode(goods) || goods.name || '';
      return `${getGoodsProject(goods, item)}::${goodsKey}::${item.purchaseNo || ''}`;
    }

    function buildAllocationMatchCombos(sources) {
      const map = new Map();
      sources.forEach(source => {
        (source.goodsLines || []).forEach(goods => {
          const key = getAllocationMatchComboKey(goods, source);
          if (!key || map.has(key)) return;
          map.set(key, {
            key,
            projectNo: getGoodsProject(goods, source),
            goodsCode: getGoodsCode(goods),
            goodsName: goods.name || '-',
            purchaseNo: source.purchaseNo || '-'
          });
        });
      });
      return Array.from(map.values());
    }

    function getCandidateMatchedCombos(candidate) {
      const selectedKeys = activeAllocContext.selectedMatchComboKeys;
      const matchCombos = activeAllocContext.matchCombos || [];
      const selectedCombos = matchCombos.filter(combo => selectedKeys.has(combo.key));
      if (selectedCombos.length === 0) return [];
      return selectedCombos.filter(combo => {
        if ((candidate.purchaseNo || '') !== combo.purchaseNo) return false;
        return (candidate.goodsLines || []).some(goods => {
          if (getGoodsProject(goods, candidate) !== combo.projectNo) return false;
          const goodsCode = getGoodsCode(goods);
          const goodsName = goods.name || '';
          return (combo.goodsCode && goodsCode && combo.goodsCode === goodsCode) || goodsName === combo.goodsName;
        });
      });
    }

    // Current pending allocatable quantity on a goods line (source side)
    function getSourceGoodsPending(goods) {
      return Math.max(0, (Number(goods.allocatable) || 0) - (Number(goods.allocated) || 0));
    }

    // Inline input handlers — update proposed qty directly, no re-render (keeps focus)
    function handleSourceQtyInput(srcIdx, goodsIdx, value) {
      const goods = activeAllocContext.sources[srcIdx]?.goodsLines?.[goodsIdx];
      if (!goods) return;
      goods.proposed = Math.max(0, Number(value) || 0);
      // Live-update this input's over-limit styling without a full re-render
      const input = document.querySelector(`input.alloc-qty-input[data-role="source-qty"][data-src-idx="${srcIdx}"][data-goods-idx="${goodsIdx}"]`);
      if (input) {
        const over = goods.proposed > getSourceGoodsPending(goods);
        input.classList.toggle('is-invalid', over);
        const caption = input.parentElement?.querySelector('.alloc-qty-caption');
        if (caption) caption.classList.toggle('is-over', over);
      }
      updateAllocSummary();
      calculateAllocBalance();
    }

    function handleTargetQtyInput(targetId, goodsIdx, value) {
      const target = getTargetById(targetId);
      const goods = target?.goodsLines?.[goodsIdx];
      if (!goods) return;
      goods.proposed = Math.max(0, Number(value) || 0);
      calculateAllocBalance();
    }

    // Refresh the summary panel numbers — KPI 已下线，保留空函数避免破坏调用方
    function updateAllocSummary() {
      // 顶部 KPI 行已删除，无需更新；商品徽章流由 calculateAllocBalance 负责
    }

    // Open Allocation from Single Row Button
    function openSingleAllocationModal(id) {
      const item = state.items.find(candidate => candidate.id === id);
      const firstRowKey = item ? getWorkbenchGoodsRows(item)[0]?.key : '';
      state.selectedRowIds.clear();
      if (firstRowKey) state.selectedRowIds.add(firstRowKey);
      openFlatAllocationModal();
    }

    // ===== 人工分配（平铺：所选商品明细行逐行录入调入/调出） =====
    let flatAllocContext = { rows: [], unit: '', projectNo: '', goodsName: '', purchaseNo: '' };

    function getFlatAllocGroupKey(row) {
      const goods = row.goods || {};
      const projectNo = goods.projectNo || row.item.projectNo || '';
      const goodsName = goods.name || '';
      const unit = goods.unit || '';
      const purchaseDetail = `${row.item.purchaseNo || ''}|${goods.code || goods.name || ''}`;
      return [projectNo, goodsName, unit, purchaseDetail].join('::');
    }

    function openFlatAllocationModal() {
      if (state.selectedRowIds.size === 0) {
        showToast('请先勾选需要分配的商品明细行！', 'warning');
        return;
      }
      const rows = getSelectedWorkbenchRows();
      if (rows.some(row => row.item.type !== 'non_dest')) {
        showToast('目的港库存业务不支持人工分配，请仅选择非目的港库存业务。', 'danger');
        return;
      }
      if (rows.some(row => getRowClosedStatus(row) === '已完结')) {
        showToast('已完结的商品明细行必须先点击“取消完结”后才能人工分配。', 'danger');
        return;
      }
      const keys = new Set(rows.map(getFlatAllocGroupKey));
      if (keys.size > 1) {
        showToast('请选择业务项目号、商品中文名、商品标准单位、采购合同商品明细均相同的商品明细行。', 'danger');
        return;
      }

      const first = rows[0];
      flatAllocContext = {
        rows: rows.map(row => ({
          key: row.key,
          item: row.item,
          goods: row.goods,
          dir: '1',
          qty: 0
        })),
        unit: first.goods?.unit || '',
        projectNo: first.goods?.projectNo || first.item.projectNo || '',
        goodsName: first.goods?.name || '',
        purchaseNo: first.item.purchaseNo || ''
      };

      document.getElementById('flatAllocProjectNo').textContent = flatAllocContext.projectNo || '-';
      document.getElementById('flatAllocGoodsName').textContent = flatAllocContext.goodsName || '-';
      document.getElementById('flatAllocUnit').textContent = flatAllocContext.unit || '-';
      document.getElementById('flatAllocPurchaseNo').textContent = flatAllocContext.purchaseNo || '-';
      document.getElementById('flatAllocRowCount').textContent = String(flatAllocContext.rows.length);

      renderFlatAllocTable();
      openModal('allocationFlatModal');
    }

    function getFlatAllocSignedQty(row) {
      const qty = Math.abs(Number(row.qty || 0));
      return row.dir === '-1' ? -qty : qty;
    }

    function getFlatAllocAfterQty(row) {
      const goods = row.goods || {};
      const pendingQty = Number(goods.allocatable || 0) - Number(goods.allocated || 0);
      return pendingQty + getFlatAllocSignedQty(row);
    }

    function renderFlatAllocTable() {
      const tbody = document.getElementById('flatAllocTableBody');
      tbody.innerHTML = '';

      flatAllocContext.rows.forEach((row, index) => {
        const goods = row.goods || {};
        const unit = goods.unit || '';
        const contractQty = Number(goods.contractQty ?? goods.allocatable ?? 0);
        const allocatedQty = Number(goods.allocated || 0);
        const pendingQty = Number(goods.allocatable || 0) - allocatedQty;
        const afterQty = pendingQty + getFlatAllocSignedQty(row);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="p-2 text-slate-400">${index + 1}</td>
          <td class="p-2 font-mono font-bold text-brand-600">${escapeHtml(getMainContractNo(row.item))}</td>
          <td class="p-2 font-mono">${escapeHtml(goods.projectNo || row.item.projectNo || '-')}</td>
          <td class="p-2">${escapeHtml(goods.name || '-')}</td>
          <td class="p-2">${escapeHtml(unit || '-')}</td>
          <td class="p-2 text-right font-mono">${formatQty(contractQty)}</td>
          <td class="p-2 text-right font-mono">${formatQty(allocatedQty)}</td>
          <td class="p-2 text-right font-mono font-bold">${formatQty(pendingQty)}</td>
          <td class="p-2">
            <select class="alloc-flat-dir" data-key="${row.key}" onchange="onFlatAllocDirChange(this)">
              <option value="1" ${row.dir !== '-1' ? 'selected' : ''}>调入</option>
              <option value="-1" ${row.dir === '-1' ? 'selected' : ''}>调出</option>
            </select>
          </td>
          <td class="p-2 text-right">
            <input type="number" min="0" step="1" inputmode="numeric" class="alloc-flat-input" data-key="${row.key}" value="${row.qty ? row.qty : ''}" placeholder="0" oninput="onFlatAllocInput(this)">
          </td>
          <td class="p-2 text-right font-mono" id="flat-after-${row.key}">${formatQty(afterQty)}</td>
        `;
        tbody.appendChild(tr);
      });

      if (window.lucide) lucide.createIcons();
      recalcFlatAlloc();
    }

    function onFlatAllocDirChange(select) {
      const row = flatAllocContext.rows.find(candidate => candidate.key === select.dataset.key);
      if (!row) return;
      row.dir = select.value === '-1' ? '-1' : '1';
      updateFlatAllocRow(row);
      recalcFlatAlloc();
    }

    function onFlatAllocInput(input) {
      const key = input.dataset.key;
      const row = flatAllocContext.rows.find(candidate => candidate.key === key);
      if (!row) return;

      const value = Math.max(0, Number(input.value || 0));
      row.qty = Number.isFinite(value) ? value : 0;

      updateFlatAllocRow(row);
      recalcFlatAlloc();
    }

    function updateFlatAllocRow(row) {
      const cell = document.getElementById(`flat-after-${row.key}`);
      if (!cell) return;
      const afterQty = getFlatAllocAfterQty(row);
      cell.textContent = formatQty(afterQty);
      const isOver = row.dir === '-1' && Number(row.qty || 0) > 0 && afterQty <= 0;
      cell.classList.toggle('text-rose-600', isOver);
      cell.classList.toggle('font-bold', isOver);
    }

    function evaluateFlatAlloc() {
      let inTotal = 0;
      let outTotal = 0;
      flatAllocContext.rows.forEach(row => {
        const qty = Number(row.qty || 0);
        if (!qty) return;
        if (row.dir === '-1') outTotal += qty;
        else inTotal += qty;
      });
      const netTotal = inTotal - outTotal;
      const overRows = flatAllocContext.rows.filter(row => {
        if (row.dir !== '-1' || Number(row.qty || 0) <= 0) return false;
        return getFlatAllocAfterQty(row) <= 0;
      });
      const balanced = Math.abs(netTotal) < 1e-6;
      return { inTotal, outTotal, netTotal, overRows, balanced };
    }

    function recalcFlatAlloc() {
      const { inTotal, outTotal, netTotal, overRows, balanced } = evaluateFlatAlloc();
      const unit = flatAllocContext.unit || '';
      document.getElementById('flatAllocInTotal').textContent = formatQty(inTotal, unit);
      document.getElementById('flatAllocOutTotal').textContent = formatQty(outTotal, unit);

      const status = document.getElementById('flatAllocStatus');
      const confirmBtn = document.getElementById('flatAllocConfirmBtn');
      let valid = false;
      let message = '';
      let tone = 'bg-amber-100 text-amber-800';

      if (!inTotal && !outTotal) {
        message = '请选择分配方向并录入本次分配数量';
      } else if (overRows.length) {
        message = `调出后待订舱数量需 >0（请检查 ${getMainContractNo(overRows[0].item)}）`;
        tone = 'bg-rose-100 text-rose-700';
      } else if (!balanced) {
        message = `调入与调出不一致，差额 ${formatQty(netTotal, unit)}`;
        tone = 'bg-rose-100 text-rose-700';
      } else {
        valid = true;
        message = '校验通过，可确认分配';
        tone = 'bg-emerald-100 text-emerald-700';
      }

      status.className = `font-bold px-2.5 py-1 rounded ${tone}`;
      status.textContent = message;
      if (confirmBtn) confirmBtn.disabled = !valid;
      return valid;
    }

    function confirmFlatAllocation() {
      if (!recalcFlatAlloc()) return;

      let affected = 0;
      flatAllocContext.rows.forEach(row => {
        if (!row.qty) return;
        const goods = row.goods;
        if (!goods) return;
        const autoAllocated = Number(goods.autoAllocated ?? goods.allocatable ?? 0);
        const qty = Number(row.qty || 0);
        if (row.dir === '-1') goods.manualOut = Number(goods.manualOut || 0) + qty;
        else goods.manualIn = Number(goods.manualIn || 0) + qty;
        goods.allocatable = autoAllocated + goods.manualIn - goods.manualOut;
        goods.hasAllocation = true;
        affected += 1;
      });

      const touchedItems = [...new Map(flatAllocContext.rows.map(row => [row.item.id, row.item])).values()];
      touchedItems.forEach(item => {
        syncItemQtyFromLines(item);
        item.proposedQty = Math.max(0, getPendingQty(item));
        if (item.status !== '已关闭') item.status = getDisplayStatus(item);
      });

      state.selectedRowIds.clear();
      document.getElementById('selectedCount').textContent = '0';
      closeModal('allocationFlatModal');
      renderWorkbenchTable();
      showToast(`已完成 ${affected} 条商品明细的人工分配`, 'success');
    }

    // Main Entry for Allocation Modal with Validation & Equal Project Check
    function openBatchAllocationModal() {
      if (state.selectedRowIds.size === 0) {
        showToast('请先勾选需要分配的源合同！', 'warning');
        return;
      }

      const selectedItems = getSelectedWorkbenchItems();

      if (selectedItems.some(item => item.type !== 'non_dest')) {
        showToast('目的港库存业务不支持人工分配，请仅选择非目的港库存业务。', 'danger');
        return;
      }

      if (getSelectedWorkbenchRows().some(row => getRowClosedStatus(row) === '已完结')) {
        showToast('已完结的商品明细行必须先点击“取消完结”后才能人工分配。', 'danger');
        return;
      }

      const allocationProjects = getAllocationProjectNos(selectedItems);
      if (!allocationProjects.length) {
        showToast('所选源合同没有可分配的业务项目商品明细。', 'warning');
        return;
      }

      const selectedSourceIds = new Set(selectedItems.map(item => item.id));
      const allocationSources = prepareAllocationCandidates(selectedItems);
      const candidateContracts = state.items
        .filter(item => item.type === 'non_dest' && !selectedSourceIds.has(item.id));
      const matchCombos = buildAllocationMatchCombos(allocationSources);

      activeAllocContext = {
        projectNo: allocationProjects.join(','),
        sources: allocationSources,
        targets: [],
        allCandidates: prepareAllocationCandidates(candidateContracts),
        selectedCandidateIds: new Set(),
        expandedCandidateIds: new Set(),
        selectedMatchComboKeys: new Set(matchCombos.map(combo => combo.key)),
        matchCombos,
        chipsExpanded: false
      };

      document.getElementById('allocProjectNoBadge').textContent = allocationProjects.join(',');
      renderAllocSourceSection();
      renderAllocTargetSection();
      updateAllocSummary();
      calculateAllocBalance();
      openModal('allocationModal');
    }

    // Render Source Contracts Section with inline 调出 quantity inputs
    function renderAllocSourceSection() {
      const container = document.getElementById('allocSourceListContainer');
      container.innerHTML = '';

      document.getElementById('sourceContractsCount').textContent = `已选 ${activeAllocContext.sources.length} 个源合同`;

      activeAllocContext.sources.forEach((src, srcIdx) => {
        const card = document.createElement('div');
        card.className = 'alloc-contract-card alloc-source-card bg-white border border-slate-200 rounded-lg p-3 space-y-2 shadow-2xs';

        const contractHeaderHtml = `
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-2 rounded text-[11px] border border-slate-200">
            <div><span class="text-slate-400">销售合同号:</span> <strong class="text-slate-800 font-mono">${escapeHtml(src.salesNo)}</strong></div>
            <div><span class="text-slate-400">客户:</span> <span class="text-slate-800 font-medium">${escapeHtml(src.customer)}</span></div>
            <div><span class="text-slate-400">业务员:</span> <span class="text-slate-800">${escapeHtml(src.salesman)}</span></div>
            <div><span class="text-slate-400">采购合同号:</span> <span class="text-slate-700 font-mono">${escapeHtml(src.purchaseNo)}</span></div>
            <div class="col-span-2 sm:col-span-2"><span class="text-slate-400">贸易供应商:</span> <span class="text-slate-700">${escapeHtml(src.supplier)}</span></div>
          </div>
        `;

        const goodsRowsHtml = src.goodsLines.map((g, gIdx) => {
          const currentPending = Math.max(0, (g.allocatable || 0) - (g.allocated || 0));
          const proposed = Number(g.proposed || 0);
          const isOver = proposed > currentPending;
          return `
            <tr class="alloc-goods-row alloc-source-row border-b border-slate-100 text-xs">
              <td class="p-2 font-mono font-bold text-brand-600 alloc-project-col">${escapeHtml(getGoodsProject(g, src))}</td>
              <td class="p-2 font-medium">
                <div class="font-bold">${escapeHtml(g.name)}</div>
              </td>
              <td class="p-2 text-right font-mono text-slate-700">${formatQty(g.contractQty ?? g.allocatable, g.unit)}</td>
              <td class="p-2 text-right font-mono text-slate-700">${formatQty(g.allocatable, g.unit)}</td>
              <td class="p-2 text-right font-mono text-slate-500">${formatQty(g.allocated, g.unit)}</td>
              <td class="p-2 text-right font-mono font-bold text-amber-600">${formatQty(currentPending, g.unit)}</td>
              <td class="p-2 text-right">
                <input type="number" min="0" step="1" inputmode="numeric"
                  class="alloc-qty-input ${isOver ? 'is-invalid' : ''}"
                  data-role="source-qty" data-src-idx="${srcIdx}" data-goods-idx="${gIdx}"
                  value="${proposed ? proposed : ''}"
                  placeholder="0"
                  oninput="handleSourceQtyInput(${srcIdx}, ${gIdx}, this.value)"
                  ${currentPending <= 0 ? 'disabled' : ''} />
                <!--<div class="alloc-qty-caption ${isOver ? 'is-over' : ''}">上限 ${formatQty(currentPending, g.unit)}</div>-->
				<!--<div class="alloc-qty-caption ${isOver ? 'is-over' : ''}">上限 ${formatQty(currentPending, g.unit)}${g.unit || ''}</div>-->

              </td>
            </tr>
          `;
        }).join('');

        card.innerHTML = `
          ${contractHeaderHtml}
          <div class="overflow-x-auto">
            <table class="w-full text-left text-[11px]">
              <thead class="bg-slate-100/80 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th class="p-1.5 alloc-project-col">业务项目号</th>
                  <th class="p-1.5">商品名称</th>
                  <th class="p-1.5 text-right">合同商品数量</th>
                  <th class="p-1.5 text-right">可订舱数量</th>
                  <th class="p-1.5 text-right">已订舱数量</th>
                  <th class="p-1.5 text-right">当前待订舱数量</th>
                  <th class="p-1.5 text-right">本次调出数量</th>
                </tr>
              </thead>
              <tbody>${goodsRowsHtml}</tbody>
            </table>
          </div>
        `;
        container.appendChild(card);
      });

      if (window.lucide) lucide.createIcons();
    }

    // Render Target Contracts Section with inline 调入 quantity inputs
    function renderAllocTargetSection() {
      const container = document.getElementById('allocTargetListContainer');
      container.innerHTML = '';
      document.getElementById('targetContractsCount').textContent = `已加入 ${activeAllocContext.targets.length} 个目标合同`;

      if (activeAllocContext.targets.length === 0) {
        container.innerHTML = `
          <div class="p-8 text-center text-slate-400">
            <i data-lucide="plus-circle" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
            暂未加入目标合同，请点击上方“新增目标合同”添加！
          </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
      }

      activeAllocContext.targets.forEach((tgt, tgtIdx) => {
        const card = document.createElement('div');
        card.className = 'alloc-contract-card alloc-target-card bg-white border border-emerald-200 rounded-lg p-3 space-y-2 shadow-2xs relative';

        const contractHeaderHtml = `
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-emerald-50/60 p-2 rounded text-[11px] border border-emerald-100">
            <div><span class="text-slate-400">销售合同号:</span> <strong class="text-slate-800 font-mono">${escapeHtml(tgt.salesNo)}</strong></div>
            <div><span class="text-slate-400">客户:</span> <span class="text-slate-800 font-medium">${escapeHtml(tgt.customer)}</span></div>
            <div><span class="text-slate-400">业务员:</span> <span class="text-slate-800">${escapeHtml(tgt.salesman)}</span></div>
            <div><span class="text-slate-400">采购合同号:</span> <span class="text-slate-700 font-mono">${escapeHtml(tgt.purchaseNo)}</span></div>
            <div><span class="text-slate-400">贸易供应商:</span> <span class="text-slate-700">${escapeHtml(tgt.supplier)}</span></div>
            <div class="text-right">
              <button type="button" onclick="removeTargetContract(${tgtIdx})" class="text-red-600 hover:text-red-700 font-medium text-[11px] flex items-center justify-end gap-0.5 ml-auto">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> 移除目标
              </button>
            </div>
          </div>
        `;

        const goodsRowsHtml = tgt.goodsLines.map((g, gIdx) => {
          const proposed = Number(g.proposed || 0);
          return `
            <tr class="alloc-goods-row alloc-target-row border-b border-slate-100 text-xs">
              <td class="p-2 font-mono font-bold text-brand-600 alloc-project-col">${escapeHtml(getGoodsProject(g, tgt))}</td>
              <td class="p-2 font-medium text-slate-800">
                <div class="font-bold">${escapeHtml(g.name)}</div>
              </td>
              <td class="p-2 text-right font-mono text-slate-700">${formatQty(g.contractQty ?? g.allocatable, g.unit)}</td>
              <td class="p-2 text-right font-mono text-slate-700">${formatQty(g.allocatable, g.unit)}</td>
              <td class="p-2 text-right font-mono text-slate-500">${formatQty(g.allocated, g.unit)}</td>
              <td class="p-2 text-right font-mono font-bold text-amber-600">${formatQty(Math.max(0, (g.allocatable || 0) - (g.allocated || 0)), g.unit)}</td>
              <td class="p-2 text-right">
                <input type="number" min="0" step="1" inputmode="numeric"
                  class="alloc-qty-input target"
                  data-role="target-qty" data-tgt-id="${escapeHtml(tgt.id)}" data-goods-idx="${gIdx}"
                  value="${proposed ? proposed : ''}"
                  placeholder="0"
                  oninput="handleTargetQtyInput('${escapeHtml(tgt.id)}', ${gIdx}, this.value)" />
                <!--<div class="alloc-qty-caption">调入数量</div>-->
              </td>
            </tr>
          `;
        }).join('');

        card.innerHTML = `
          ${contractHeaderHtml}
          <div class="overflow-x-auto">
            <table class="w-full text-left text-[11px]">
              <thead class="bg-emerald-50/40 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th class="p-1.5 alloc-project-col">业务项目号</th>
                  <th class="p-1.5">商品名称</th>
                  <th class="p-1.5 text-right">合同商品数量</th>
                  <th class="p-1.5 text-right">可订舱数量</th>
                  <th class="p-1.5 text-right">已订舱数量</th>
                  <th class="p-1.5 text-right">当前待订舱数量</th>
                  <th class="p-1.5 text-right">本次调入数量</th>
                </tr>
              </thead>
              <tbody>${goodsRowsHtml}</tbody>
            </table>
          </div>
        `;
        container.appendChild(card);
      });

      if (window.lucide) lucide.createIcons();
    }

    // Modal to filter and add Target Contracts
    function openAddTargetModal() {
      activeAllocContext.selectedCandidateIds.clear();
      activeAllocContext.expandedCandidateIds.clear();
      activeAllocContext.selectedMatchComboKeys = new Set((activeAllocContext.matchCombos || []).map(combo => combo.key));
      ['candidateSalesNoFilter', 'candidateCustomerFilter', 'candidateSupplierFilter', 'candidateSalesmanFilter'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
      });
      renderCandidateFilterOptions();
      renderCandidateMatchCombos();
      renderCandidateTargetList();
      closeCandidateComboPopover();
      openModal('addTargetModal');
    }

    function setCandidateComboPopoverOpen(open) {
      const popover = document.getElementById('candidateComboPopover');
      const toggle = document.getElementById('candidateComboToggle');
      if (!popover) return;
      popover.classList.toggle('hidden', !open);
      if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function toggleCandidateComboPopover(event) {
      if (event) event.stopPropagation();
      const popover = document.getElementById('candidateComboPopover');
      setCandidateComboPopoverOpen(popover?.classList.contains('hidden'));
    }

    function closeCandidateComboPopover() {
      setCandidateComboPopoverOpen(false);
    }

    function getCandidateFilterValue(id) {
      return (document.getElementById(id)?.value || '').trim().toLowerCase();
    }

    function populateCandidateDatalist(id, values) {
      const datalist = document.getElementById(id);
      if (!datalist) return;
      datalist.innerHTML = [...new Set(values.filter(Boolean))]
        .sort((a, b) => String(a).localeCompare(String(b), 'zh-Hans-CN'))
        .map(value => `<option value="${escapeHtml(value)}"></option>`)
        .join('');
    }

    function renderCandidateFilterOptions() {
      const candidates = activeAllocContext.allCandidates || [];
      populateCandidateDatalist('candidateSalesNoOptions', candidates.map(candidate => candidate.salesNo));
      populateCandidateDatalist('candidateCustomerOptions', candidates.map(candidate => candidate.customer));
      populateCandidateDatalist('candidateSupplierOptions', candidates.map(candidate => candidate.supplier));
      populateCandidateDatalist('candidateSalesmanOptions', candidates.map(candidate => candidate.salesman));
    }

    function renderCandidateMatchCombos() {
      const container = document.getElementById('candidateMatchComboList');
      const summary = document.getElementById('candidateMatchComboSummary');
      if (!container) return;
      const combos = activeAllocContext.matchCombos || [];
      container.innerHTML = '';
      if (!combos.length) {
        container.innerHTML = '<span class="text-slate-400">当前源合同暂无可匹配的商品-采购合同组合</span>';
      } else {
        combos.forEach(combo => {
          const label = document.createElement('label');
          label.className = 'candidate-match-combo';
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.checked = activeAllocContext.selectedMatchComboKeys.has(combo.key);
          input.addEventListener('change', () => toggleCandidateMatchCombo(combo.key, input.checked));
          const projectSpan = document.createElement('span');
          projectSpan.className = 'combo-project';
          projectSpan.textContent = combo.projectNo || '-';
          const goodsSpan = document.createElement('span');
          goodsSpan.className = 'combo-name';
          goodsSpan.title = combo.goodsName;
          goodsSpan.textContent = combo.goodsName;
          const purchaseSpan = document.createElement('span');
          purchaseSpan.className = 'combo-purchase';
          purchaseSpan.textContent = combo.purchaseNo;
          label.append(input, projectSpan, goodsSpan, purchaseSpan);
          container.appendChild(label);
        });
      }
      if (summary) {
        const selectedCount = activeAllocContext.selectedMatchComboKeys.size;
        summary.textContent = combos.length === 0
          ? '无匹配组合'
          : (selectedCount === combos.length ? `全部 ${combos.length} 组` : (selectedCount === 0 ? '未选择' : `${selectedCount}/${combos.length} 组`));
      }
    }

    function toggleCandidateMatchCombo(comboKey, checked) {
      if (checked) activeAllocContext.selectedMatchComboKeys.add(comboKey);
      else activeAllocContext.selectedMatchComboKeys.delete(comboKey);
      activeAllocContext.selectedCandidateIds.clear();
      renderCandidateMatchCombos();
      renderCandidateTargetList();
    }

    function selectAllCandidateMatchCombos() {
      activeAllocContext.selectedMatchComboKeys = new Set((activeAllocContext.matchCombos || []).map(combo => combo.key));
      activeAllocContext.selectedCandidateIds.clear();
      renderCandidateMatchCombos();
      renderCandidateTargetList();
    }

    function clearCandidateMatchCombos() {
      activeAllocContext.selectedMatchComboKeys.clear();
      activeAllocContext.selectedCandidateIds.clear();
      renderCandidateMatchCombos();
      renderCandidateTargetList();
    }

    function resetCandidateTargetFilters() {
      ['candidateSalesNoFilter', 'candidateCustomerFilter', 'candidateSupplierFilter', 'candidateSalesmanFilter'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
      });
      selectAllCandidateMatchCombos();
    }

    function renderCandidateMatchBadges(matchedCombos) {
      const visible = matchedCombos.slice(0, 2).map(combo => (
        `<span class="candidate-match-badge" title="${escapeHtml(combo.projectNo || '-')} - ${escapeHtml(combo.goodsName)} - ${escapeHtml(combo.purchaseNo)}">${escapeHtml(combo.projectNo || '-')} / ${escapeHtml(combo.goodsName)} / ${escapeHtml(combo.purchaseNo)}</span>`
      )).join('');
      const more = matchedCombos.length > 2 ? `<span class="candidate-match-more">等 ${matchedCombos.length} 组</span>` : '';
      return visible + more;
    }

    function renderCandidateTargetList() {
      const tbody = document.getElementById('candidateTargetTableBody');
      tbody.innerHTML = '';
      const salesNoFilter = getCandidateFilterValue('candidateSalesNoFilter');
      const customerFilter = getCandidateFilterValue('candidateCustomerFilter');
      const supplierFilter = getCandidateFilterValue('candidateSupplierFilter');
      const salesmanFilter = getCandidateFilterValue('candidateSalesmanFilter');
      const currentTargetIds = new Set(activeAllocContext.targets.map(target => target.id));
      const filteredCandidates = activeAllocContext.allCandidates.map(candidate => ({
        candidate,
        matchedCombos: getCandidateMatchedCombos(candidate)
      })).filter(({ candidate, matchedCombos }) => {
        if (currentTargetIds.has(candidate.id)) return false;
        if (!matchedCombos.length) return false;
        if (salesNoFilter && !String(candidate.salesNo || '').toLowerCase().includes(salesNoFilter)) return false;
        if (customerFilter && !String(candidate.customer || '').toLowerCase().includes(customerFilter)) return false;
        if (supplierFilter && !String(candidate.supplier || '').toLowerCase().includes(supplierFilter)) return false;
        if (salesmanFilter && !String(candidate.salesman || '').toLowerCase().includes(salesmanFilter)) return false;
        return true;
      });
      const visibleCandidateIds = new Set(filteredCandidates.map(({ candidate }) => candidate.id));
      activeAllocContext.selectedCandidateIds = new Set(
        Array.from(activeAllocContext.selectedCandidateIds).filter(id => visibleCandidateIds.has(id))
      );

      document.getElementById('candidateCountSummary').textContent = `可选合同数: ${filteredCandidates.length}；已选 ${activeAllocContext.selectedCandidateIds.size} 条`;
      if (filteredCandidates.length === 0) {
        tbody.innerHTML = '<tr><td colspan="36" class="p-6 text-center text-slate-400">没有可追加的目标合同（可能已全选或匹配无果）</td></tr>';
        return;
      }

      filteredCandidates.forEach(({ candidate, matchedCombos }) => {
        const isChecked = activeAllocContext.selectedCandidateIds.has(candidate.id);
        const isExpanded = activeAllocContext.expandedCandidateIds.has(candidate.id);
        const contractQty = getContractQty(candidate);
        const allocatableQty = getAllocatableQty(candidate);
        const allocatedQty = getAllocatedQty(candidate);
        const pendingQty = getPendingQty(candidate);
        const unit = candidate.goodsLines?.[0]?.unit || '';
        const candidateRisk = getRiskLabel(candidate);
        const candidateRiskClass = candidateRisk === '正常'
          ? 'ct-risk'
          : 'ct-risk danger';
        const loadingPort = candidate.loadingPort || candidate.loadPort || '厦门港';
        const unloadingPort = candidate.unloadingPort || candidate.dischargePort || '大连港';
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 text-xs';
        tr.dataset.candidateId = candidate.id;
        tr.innerHTML = `
          <td class="candidate-control"><input type="checkbox" ${isChecked ? 'checked' : ''} aria-label="选择候选合同 ${escapeHtml(getMainContractNo(candidate))}" onchange="toggleCandidateSelect('${candidate.id}', this.checked)" class="rounded text-emerald-600 focus:ring-emerald-500" /></td>
          <td class="candidate-control candidate-expand" onclick="toggleCandidateExpand('${candidate.id}')"><i data-lucide="${isExpanded ? 'chevron-down' : 'chevron-right'}" class="w-4 h-4"></i></td>
          <td class="font-mono font-bold text-brand-600">${escapeHtml(getMainContractNo(candidate))}</td>
          <td class="font-mono font-bold text-brand-600">${escapeHtml(getProjectDisplay(candidate))}</td>
          <td class="candidate-long-cell" title="${escapeHtml(getGoodsSummary(candidate))}">${escapeHtml(getGoodsSummary(candidate))}</td>
          <td class="candidate-number">${formatQty(contractQty, unit)}</td>
          <td class="candidate-number">${formatQty(allocatableQty, unit)}</td>
          <td class="candidate-number">${formatQty(allocatedQty, unit)}</td>
          <td class="candidate-number">${formatQty(pendingQty, unit)}</td>
          <td class="font-mono text-slate-600">${escapeHtml(getAssociatedContractNo(candidate))}</td>
          <td>${escapeHtml(candidate.operatingUnit)}</td>
          <td class="candidate-long-cell" title="${escapeHtml(candidate.companyTitle)}">${escapeHtml(candidate.companyTitle)}</td>
          <td>${escapeHtml(candidate.department)}</td>
          <td>${escapeHtml(candidate.accountingGroup)}</td>
          <td>${escapeHtml(candidate.salesman)}</td>
          <td>${escapeHtml(loadingPort)}</td>
          <td>${escapeHtml(unloadingPort)}</td>
          <td>${escapeHtml(candidate.shipmentDeadline)}</td>
          <td class="candidate-long-cell" title="${escapeHtml(candidate.customer)}">${escapeHtml(candidate.customer)}</td>
          <td class="candidate-long-cell" title="${escapeHtml(candidate.supplier)}">${escapeHtml(candidate.supplier)}</td>
          <td>${escapeHtml(candidate.internalDeliveryDate)}</td>
          <td>${escapeHtml(candidate.settlementMethod)}</td>
          <td>${escapeHtml(candidate.controlledOrder)}</td>
          <td>${escapeHtml(candidate.prepaymentRatio)}</td>
          <td class="candidate-number">${escapeHtml(candidate.freightUnitPrice)}</td>
          <td>${escapeHtml(candidate.purchaseTerms)}</td>
          <td>${escapeHtml(candidate.salesTerms)}</td>
          <td>${escapeHtml(candidate.dispatchedByUs)}</td>
          <td class="candidate-number">${escapeHtml(candidate.portMiscUnitPrice)}</td>
          <td>${escapeHtml(candidate.tradeType)}</td>
          <td>
            <button type="button" class="${candidateRiskClass} ${candidateRisk !== '正常' ? 'ct-risk-label-button' : ''}"
              ${candidateRisk !== '正常' ? `onclick="openRiskDetail('${candidate.id}')" title="查看风险详情"` : ''}>
              ${escapeHtml(candidateRisk)}
            </button>
          </td>
          <td>${escapeHtml(getTradeContractType(candidate))}</td>
          <td>${escapeHtml(getAssociatedContractType(candidate))}</td>
          <td><span class="${getCandidateStatusClass(candidate)}">${escapeHtml(getDisplayStatus(candidate))}</span></td>
          <td><div class="candidate-match-badges">${renderCandidateMatchBadges(matchedCombos)}</div></td>
          <td class="candidate-control"><button type="button" onclick="quickAddSingleTarget('${candidate.id}')" class="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 text-[10px] font-medium">添加</button></td>
        `;
        tbody.appendChild(tr);

        if (isExpanded && candidate.goodsLines?.length) {
          const subTr = document.createElement('tr');
          const subRows = candidate.goodsLines.map(goods => `
            <tr>
              <td class="font-mono font-bold text-brand-600">${escapeHtml(goods.projectNo || candidate.projectNo)}</td>
              <td>${escapeHtml(goods.name)}</td>
              <td class="candidate-number">${formatQty(goods.contractQty ?? goods.allocatable, goods.unit)}</td>
              <td class="candidate-number">${formatQty(goods.allocatable, goods.unit)}</td>
              <td class="candidate-number">${formatQty(goods.allocated, goods.unit)}</td>
              <td class="candidate-number">${formatQty((goods.allocatable || 0) - (goods.allocated || 0), goods.unit)}</td>
            </tr>
          `).join('');
          subTr.innerHTML = `
            <td colspan="36" class="candidate-detail-cell">
              <div class="candidate-subtable-wrap">
                <div class="candidate-subtable-title"><i data-lucide="layers" class="w-3.5 h-3.5 text-brand-500"></i>商品明细</div>
                <table class="candidate-subtable">
                  <thead>
                    <tr>
                      <th>业务项目号</th>
                      <th>商品名称</th>
                      <th class="candidate-number">合同商品数量</th>
                      <th class="candidate-number">可订舱数量</th>
                      <th class="candidate-number">已订舱数量</th>
                      <th class="candidate-number">待订舱数量</th>
                    </tr>
                  </thead>
                  <tbody>${subRows}</tbody>
                </table>
              </div>
            </td>
          `;
          tbody.appendChild(subTr);
        }
      });

      if (window.lucide) lucide.createIcons();
    }

    function getCandidateStatusClass(candidate) {
      const status = getDisplayStatus(candidate);
      if (status === '已提交') return 'ct-status done';
      return 'ct-status pending';
    }

    function toggleCandidateExpand(candidateId) {
      if (activeAllocContext.expandedCandidateIds.has(candidateId)) activeAllocContext.expandedCandidateIds.delete(candidateId);
      else activeAllocContext.expandedCandidateIds.add(candidateId);
      renderCandidateTargetList();
    }

    function toggleCandidateSelectAll(masterCb) {
      const checks = Array.from(document.querySelectorAll('#candidateTargetTableBody > tr[data-candidate-id] input[type="checkbox"]'));
      checks.forEach(cb => {
        cb.checked = masterCb.checked;
        const id = cb.closest('tr')?.dataset.candidateId;
        if (id) {
          if (masterCb.checked) activeAllocContext.selectedCandidateIds.add(id);
          else activeAllocContext.selectedCandidateIds.delete(id);
        }
      });
      document.getElementById('candidateCountSummary').textContent = `可选合同数: ${document.querySelectorAll('#candidateTargetTableBody > tr[data-candidate-id]').length}；已选 ${activeAllocContext.selectedCandidateIds.size} 条`;
    }

    function toggleCandidateSelect(candidateId, checked) {
      if (checked) activeAllocContext.selectedCandidateIds.add(candidateId);
      else activeAllocContext.selectedCandidateIds.delete(candidateId);
    }

    function addTargetsByIds(candidateIds) {
      let count = 0;
      candidateIds.forEach(candidateId => {
        const candidate = activeAllocContext.allCandidates.find(item => item.id === candidateId);
        if (candidate && !activeAllocContext.targets.some(target => target.id === candidateId)) {
          activeAllocContext.targets.push(cloneAllocationItem(candidate));
          count++;
        }
      });
      renderAllocTargetSection();
      updateAllocSummary();
      calculateAllocBalance();
      return count;
    }

    function quickAddSingleTarget(candidateId) {
      const count = addTargetsByIds([candidateId]);
      closeModal('addTargetModal');
      if (count) showToast('已新增目标合同，可在右侧商品行直接填写调入数量。', 'success');
    }

    function addSelectedCandidatesToTargets() {
      if (activeAllocContext.selectedCandidateIds.size === 0) {
        showToast('请选择需要添加的目标合同', 'warning');
        return;
      }
      const count = addTargetsByIds(Array.from(activeAllocContext.selectedCandidateIds));
      closeModal('addTargetModal');
      showToast(`成功新增 ${count} 个目标合同！`, 'success');
    }

    function removeTargetContract(tgtIdx) {
      const removed = activeAllocContext.targets.splice(tgtIdx, 1);
      renderAllocTargetSection();
      updateAllocSummary();
      calculateAllocBalance();
      if (removed.length > 0) showToast(`已移除目标合同: ${removed[0].salesNo}`, 'info');
    }

    // Build goods groups keyed by business project + goodsCode, summing source 调出 and target 调入
    function buildGoodsBalanceGroups() {
      const groups = {};
      activeAllocContext.sources.forEach(source => {
        source.goodsLines.forEach(goods => {
          const key = getGoodsGroupKey(goods, source);
          if (!groups[key]) groups[key] = { code: getGoodsCode(goods), name: goods.name, unit: goods.unit || '', out: 0, in: 0, sourceOver: false, sourcePending: 0 };
          const proposed = Number(goods.proposed) || 0;
          groups[key].out += proposed;
          groups[key].sourcePending += getSourceGoodsPending(goods);
          if (proposed > getSourceGoodsPending(goods)) groups[key].sourceOver = true;
        });
      });
      activeAllocContext.targets.forEach(target => {
        target.goodsLines.forEach(goods => {
          const key = getGoodsGroupKey(goods, target);
          if (!groups[key]) groups[key] = { code: getGoodsCode(goods), name: goods.name, unit: goods.unit || '', out: 0, in: 0, sourceOver: false, sourcePending: 0 };
          groups[key].in += Number(goods.proposed) || 0;
        });
      });
      return groups;
    }

    function getAllocGlobalBalanceState() {
      const invalidGroups = [];
      let totalOut = 0;
      let totalIn = 0;
      const groups = buildGoodsBalanceGroups();
      Object.values(groups).forEach(group => {
        totalOut += group.out;
        totalIn += group.in;
        const unbalanced = Math.abs(group.out - group.in) > 0.001 && (group.out > 0 || group.in > 0);
        if (group.sourceOver || unbalanced) invalidGroups.push(group);
      });
      const hasInput = totalOut > 0 || totalIn > 0;
      return {
        hasInput,
        invalidGroups,
        canSave: hasInput && invalidGroups.length === 0
      };
    }

    // Real-Time Total Balance Conservation Validator
    function calculateAllocBalance() {
      const groups = buildGoodsBalanceGroups();
      const groupList = Object.values(groups);
      const sourceTotalOut = groupList.reduce((s, g) => s + g.out, 0);
      const targetTotalIn = groupList.reduce((s, g) => s + g.in, 0);

      document.getElementById('allocSourceTotalOut').textContent = sourceTotalOut.toLocaleString();
      document.getElementById('allocTargetTotalIn').textContent = targetTotalIn.toLocaleString();

      const hasInput = sourceTotalOut > 0 || targetTotalIn > 0;
      const anyOver = groupList.some(g => g.sourceOver);
      const unbalanced = groupList.filter(g => Math.abs(g.out - g.in) > 0.001 && (g.out > 0 || g.in > 0));
      const allBalanced = hasInput && unbalanced.length === 0 && !anyOver;
      const globalState = getAllocGlobalBalanceState();

      const statusBadge = document.getElementById('allocBalanceStatus');
      const saveBtn = document.getElementById('saveAllocBtn');
      if (allBalanced) {
        statusBadge.className = 'flex items-center gap-1.5 font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-600 border border-emerald-500/30';
        statusBadge.innerHTML = '<i data-lucide="check-circle-2" class="w-4 h-4"></i> 调出 / 调入总数量一致';
      } else if (!hasInput) {
        statusBadge.className = 'flex items-center gap-1.5 font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200';
        statusBadge.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4"></i> 请在商品行录入调出 / 调入数量';
      } else {
        const reason = anyOver ? '调出数量超过可分配上限' : '调出/调入总数量不一致';
        statusBadge.className = 'flex items-center gap-1.5 font-bold px-2.5 py-1 rounded bg-red-500/15 text-red-600 border border-red-500/30';
        statusBadge.innerHTML = `<i data-lucide="x-circle" class="w-4 h-4"></i> ${reason}`;
      }
      saveBtn.disabled = !globalState.canSave;

      // Per-goods chips inside summary panel: 商品 / 调出 / 调入 / 剩余 / 状态
      // 默认折叠，超过 2 个商品时显示【展开/收起】按钮
      const strip = document.getElementById('allocGoodsBalanceList');
      const toggleBtn = document.getElementById('allocGoodsChipsToggle');
      if (strip) {
        if (!groupList.length) {
          strip.innerHTML = '';
          if (toggleBtn) toggleBtn.style.display = 'none';
        } else {
          const activeList = groupList.filter(g => g.out > 0 || g.in > 0);
          if (!activeList.length) {
            strip.innerHTML = '<div class="alloc-goods-chips-empty">暂无商品录入调出 / 调入数量</div>';
            if (toggleBtn) toggleBtn.style.display = 'none';
          } else {
            const chips = activeList.map(g => {
              const diff = g.out - g.in;
              const ok = Math.abs(diff) < 0.001 && !g.sourceOver;
              const remain = Math.max(0, (g.sourcePending || 0) - g.out);
              const remainText = remain > 0 ? `余${remain.toLocaleString()}` : '余0';
              const statusText = g.sourceOver ? '超限' : (ok ? '✓' : (diff > 0 ? `待调入数量：${Math.abs(diff).toLocaleString()}` : `待调入数量：-${Math.abs(diff).toLocaleString()}`));
              const statusClass = (g.sourceOver || !ok) ? 'bad' : 'ok';
              return `<span class="alloc-goods-chip ${(g.sourceOver || !ok) ? 'bad' : ''}" title="${escapeHtml(g.code || '')} ${escapeHtml(g.name || '')}">
                <span class="name">${escapeHtml(g.name || '')}</span>
                <span class="out">${g.out.toLocaleString()}</span>
                <span class="arr">→</span>
                <span class="in">${g.in.toLocaleString()}</span>
                <!--<span class="remain">${remainText}</span>-->
                <span class="status ${statusClass}">${statusText}</span>
              </span>`;
            }).join('');
            strip.innerHTML = chips;
            // 超过 2 个才需要展开/收起按钮
            if (toggleBtn) {
              const needToggle = activeList.length > 2;
              toggleBtn.style.display = needToggle ? '' : 'none';
              if (needToggle) {
                toggleBtn.textContent = activeAllocContext.chipsExpanded ? '收起' : `展开（${activeList.length}）`;
              }
            }
            // 折叠状态：默认只显示前 2 个
            strip.classList.toggle('collapsed', !activeAllocContext.chipsExpanded && activeList.length > 2);
          }
        }
      }
      if (window.lucide) lucide.createIcons();
    }

    // Toggle chips expand / collapse in summary panel
    function toggleGoodsChipsExpand() {
      if (!activeAllocContext) return;
      activeAllocContext.chipsExpanded = !activeAllocContext.chipsExpanded;
      calculateAllocBalance();
    }

    // Commit Allocation Results to Main Workbench State
    function saveAllocation() {
      const groups = buildGoodsBalanceGroups();
      const groupList = Object.values(groups);
      const sourceTotalOut = groupList.reduce((s, g) => s + g.out, 0);
      const anyOver = groupList.some(g => g.sourceOver);
      const unbalanced = groupList.filter(g => Math.abs(g.out - g.in) > 0.001 && (g.out > 0 || g.in > 0));
      if (!sourceTotalOut || unbalanced.length || anyOver) {
        const firstBad = [...unbalanced, ...groupList.filter(g => g.sourceOver)][0];
        const suffix = firstBad ? `异常组合：${firstBad.name || firstBad.code || ''}` : '请至少录入一组调出 / 调入数量。';
        showToast(`请确保每个业务项目号 + 商品 + 采购合同组合的调出与调入数量一致，且调出不超过可分配上限。${suffix}`, 'warning');
        return;
      }

      // 调出：扣减源合同可订舱数量（按商品行索引对应真实合同数据）
      activeAllocContext.sources.forEach(source => {
        const item = state.items.find(candidate => candidate.id === source.id);
        source.goodsLines.forEach(goods => {
          const qty = Number(goods.proposed) || 0;
          if (!qty) return;
          const line = item?.goodsLines?.[goods.__lineIndex];
          if (line) line.allocatable = Math.max(0, (line.allocatable || 0) - qty);
        });
      });
      // 调入：增加目标合同可订舱数量
      activeAllocContext.targets.forEach(target => {
        const item = state.items.find(candidate => candidate.id === target.id);
        target.goodsLines.forEach(goods => {
          const qty = Number(goods.proposed) || 0;
          if (!qty) return;
          const line = item?.goodsLines?.[goods.__lineIndex];
          if (line) line.allocatable = (line.allocatable || 0) + qty;
        });
      });

      const touchedIds = new Set();
      [...activeAllocContext.sources, ...activeAllocContext.targets].forEach(snapshot => touchedIds.add(snapshot.id));
      touchedIds.forEach(itemId => {
        const item = state.items.find(candidate => candidate.id === itemId);
        if (!item) return;
        item.allocatableQty = item.goodsLines.reduce((sum, goods) => sum + (goods.allocatable || 0), 0);
        item.proposedQty = Math.max(0, getPendingQty(item));
        if (item.status !== '已关闭') item.status = getDisplayStatus(item);
      });

      showToast('人工分配成功，已按业务项目号 + 商品 + 采购合同组合完成调出 / 调入数量划转。', 'success');
      closeModal('allocationModal');
      renderWorkbenchTable();
    }

    // --- Logistics Demand Actions ---

    function generateLogisticsDemand(id) {
      if (window.PrototypeAccess && !window.PrototypeAccess.can('trade.generate')) {
        window.PrototypeAccess.deny('生成服务要求');
        return;
      }
      if (!navigator.onLine) {
        showToast('网络连接已断开，暂时无法生成服务要求。', 'danger');
        return;
      }
      const item = state.items.find(i => i.id === id);
      if (!item) return;

      if (item.status === '已关闭') {
        showToast('已关闭记录必须先取消完结后才能生成服务要求。', 'warning');
        return;
      }


      const pendingQty = getPendingQty(item);
      if (pendingQty <= 0) {
        showToast('当前合同待订舱数量不足，无法生成服务要求', 'warning');
        return;
      }

      activeDemandContext = {
        item,
        lines: (item.goodsLines || []).map((line, index) => ({
          ...JSON.parse(JSON.stringify(line)),
          __lineIndex: index,
          demandQty: getSourceGoodsPending(line),
          overloadRate: line.overloadRate ?? 0,
          shortageRate: line.shortageRate ?? 0
        }))
      };

      resetDemandContractInfo();
      renderDemandSourceMeta();
      renderDemandRisk();
      renderDemandRouteFields();
      renderDemandOrganizationFields();
      renderDemandGoodsTable();
      renderDemandContractInfo();
      updateDemandSummary();
      openModal('generateDemandModal');
      if (window.lucide) lucide.createIcons();
    }

    const DEMAND_SEARCH_OPTIONS = {
      demandOriginPort: ['厦门港', '天津港', '上海港', '宁波港', '青岛港', '深圳港', '大连港'],
      demandLoadingTerminal: ['海沧码头', '东渡码头', '天津港码头', '宁波北仑码头', '青岛前湾码头', '上海洋山码头'],
      demandDestinationPort: ['大连港', '鹿特丹港', '安特卫普港', '汉堡港', '洛杉矶港', '新加坡港', '上海港'],
      demandDischargeTerminal: ['指定卸港码头', '鹿特丹ECT码头', '安特卫普码头', '大连港码头', '汉堡港码头', '洛杉矶港码头'],
      demandDocumentOfficer: ['张伟', '刘洋', '李明', '王芳', '赵宁', '陈晨', '周凯', '高原', '郑诗煌']
    };

    const DEMAND_EMAIL_RECEIVER_OPTIONS = [
      { name: '物流单证组', email: 'shipping@cnd.com.cn' },
      { name: '郑诗煌', email: 'zhengshihuang@cnd.com.cn' },
      { name: '李杰', email: 'lijie@cnd.com.cn' },
      { name: '高美燕', email: 'gaomeiyan@cnd.com.cn' },
      { name: '张伟', email: 'zhangwei@cnd.com.cn' },
      { name: '刘洋', email: 'liuyang@cnd.com.cn' },
      { name: '财务共享中心', email: 'finance@cnd.com.cn' }
    ];
    function getDemandSearchOptions(input) {
      const current = String(input?.dataset.previousValue || '').trim();
      return [...new Set([current, ...(DEMAND_SEARCH_OPTIONS[input?.id] || [])].filter(Boolean))];
    }

    function renderDemandSearchOptions(input, query = '') {
      const wrapper = input?.closest('.demand-search-select');
      const list = wrapper?.querySelector('.demand-search-options');
      if (!wrapper || !list) return;
      const keyword = String(query || '').trim().toLowerCase();
      const options = getDemandSearchOptions(input).filter(value => !keyword || value.toLowerCase().includes(keyword));
      list.innerHTML = options.length
        ? options.map((value, index) => `<button type="button" class="demand-search-option ${index === 0 ? 'active' : ''}" data-value="${escapeHtml(value)}" onmousedown="selectDemandSearchOption(event, this)">${escapeHtml(value)}</button>`).join('')
        : '<div class="demand-search-empty">无匹配选项</div>';
    }

    function closeDemandSearchSelect(input, restoreInvalid = true) {
      const wrapper = input?.closest('.demand-search-select');
      if (!wrapper) return;
      if (restoreInvalid) {
        const value = String(input.value || '').trim();
        if (value && !getDemandSearchOptions(input).includes(value)) input.value = input.dataset.previousValue || '';
      }
      wrapper.classList.remove('open');
      input.setAttribute('aria-expanded', 'false');
    }

    function openDemandSearchSelect(input) {
      document.querySelectorAll('#generateDemandModal .demand-search-select.open').forEach(wrapper => {
        const otherInput = wrapper.querySelector('input');
        if (otherInput && otherInput !== input) closeDemandSearchSelect(otherInput);
      });
      const wrapper = input.closest('.demand-search-select');
      if (!wrapper) return;
      input.dataset.previousValue = input.value || '';
      wrapper.classList.add('open');
      input.setAttribute('aria-expanded', 'true');
      renderDemandSearchOptions(input, '');
    }

    function filterDemandSearchSelect(input) {
      const wrapper = input.closest('.demand-search-select');
      if (!wrapper?.classList.contains('open')) openDemandSearchSelect(input);
      renderDemandSearchOptions(input, '');
    }

    function handleDemandSearchBlur(input) {
      window.setTimeout(() => {
        const wrapper = input.closest('.demand-search-select');
        if (!wrapper?.contains(document.activeElement)) closeDemandSearchSelect(input);
      }, 80);
    }

    function selectDemandSearchOption(event, option) {
      event.preventDefault();
      const wrapper = option.closest('.demand-search-select');
      const input = wrapper?.querySelector('input');
      if (!input) return;
      input.value = option.dataset.value || '';
      input.dataset.previousValue = input.value;
      clearDemandFieldError(input);
      closeDemandSearchSelect(input, false);
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.blur();
    }

    function handleDemandSearchKeydown(event, input) {
      if (event.key === 'Escape') {
        closeDemandSearchSelect(input);
        return;
      }
      if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) return;
      event.preventDefault();
      const wrapper = input.closest('.demand-search-select');
      if (!wrapper) return;
      if (!wrapper.classList.contains('open')) openDemandSearchSelect(input);
      const options = [...wrapper.querySelectorAll('.demand-search-option')];
      if (!options.length) return;
      const activeIndex = Math.max(0, options.findIndex(option => option.classList.contains('active')));
      let nextIndex = activeIndex;
      if (event.key === 'ArrowDown') nextIndex = (activeIndex + 1) % options.length;
      if (event.key === 'ArrowUp') nextIndex = (activeIndex - 1 + options.length) % options.length;
      options.forEach(option => option.classList.remove('active'));
      options[nextIndex].classList.add('active');
      if (event.key === 'Enter') {
        const active = options[nextIndex];
        input.value = active.dataset.value || '';
        input.dataset.previousValue = input.value;
        clearDemandFieldError(input);
        closeDemandSearchSelect(input, false);
      }
    }
    const DEMAND_SUPPLIER_MERCHANTS = {
      '安捷通物流有限公司': '安捷通物流主体商户',
      '中远海运物流供应链有限公司': '中远海运物流主体商户',
      '马士基物流（中国）有限公司': '马士基物流主体商户',
      '建发物流（厦门）有限公司': '建发物流主体商户'
    };

    function getDemandSalesmanName(item) {
      return String(item?.salesman || '').split(/[（(]/)[0].trim().split(/\s+/)[0] || '';
    }

    function normalizeDemandEmailList(value) {
      return [...new Set(String(value || '').split(/[;；,，]+/).map(item => item.trim()).filter(Boolean))];
    }

    function getDemandSelectedEmails() {
      return normalizeDemandEmailList(document.getElementById('demandEmailReceivers')?.value);
    }

    function getDemandReceiverMeta(email) {
      return DEMAND_EMAIL_RECEIVER_OPTIONS.find(option => option.email.toLowerCase() === String(email || '').toLowerCase())
        || { name: email, email };
    }

    function renderDemandEmailReceiverTags() {
      const tags = document.getElementById('demandEmailReceiverTags');
      if (!tags) return;
      tags.innerHTML = getDemandSelectedEmails().map(email => {
        const receiver = getDemandReceiverMeta(email);
        return `<span class="demand-multi-tag" title="${escapeHtml(receiver.name)} ${escapeHtml(receiver.email)}">
          ${escapeHtml(receiver.name)} ${escapeHtml(receiver.email)}
          <button type="button" data-email="${escapeHtml(receiver.email)}" onclick="removeDemandEmailReceiver(event, this.dataset.email)" aria-label="移除 ${escapeHtml(receiver.name)}">×</button>
        </span>`;
      }).join('');
    }

    function renderDemandEmailReceiverOptions(query = '') {
      const list = document.getElementById('demandEmailReceiverOptions');
      if (!list) return;
      const keyword = String(query || '').trim().toLowerCase();
      const selected = new Set(getDemandSelectedEmails().map(email => email.toLowerCase()));
      const options = DEMAND_EMAIL_RECEIVER_OPTIONS.filter(option => {
        if (selected.has(option.email.toLowerCase())) return false;
        return !keyword || option.name.toLowerCase().includes(keyword) || option.email.toLowerCase().includes(keyword);
      });
      list.innerHTML = options.length
        ? options.map((option, index) => `<button type="button" class="demand-search-option demand-multi-option ${index === 0 ? 'active' : ''}" data-email="${escapeHtml(option.email)}" onmousedown="selectDemandEmailReceiver(event, this.dataset.email)">
            <span class="receiver-name">${escapeHtml(option.name)}</span>
            <span class="receiver-email">${escapeHtml(option.email)}</span>
          </button>`).join('')
        : '<div class="demand-search-empty">无匹配接收人</div>';
    }

    function openDemandEmailReceiverSelect() {
      document.querySelectorAll('#generateDemandModal .demand-search-select.open').forEach(wrapper => {
        const input = wrapper.querySelector('input');
        if (input) closeDemandSearchSelect(input);
      });
      const wrapper = document.querySelector('#generateDemandModal [data-demand-multi-select]');
      const search = document.getElementById('demandEmailReceiverSearch');
      if (!wrapper || !search) return;
      wrapper.classList.add('open');
      search.focus();
      renderDemandEmailReceiverOptions('');
    }

    function filterDemandEmailReceiverOptions(value) {
      const wrapper = document.querySelector('#generateDemandModal [data-demand-multi-select]');
      if (!wrapper?.classList.contains('open')) openDemandEmailReceiverSelect();
      renderDemandEmailReceiverOptions(value);
    }

    function handleDemandEmailReceiverBlur() {
      window.setTimeout(() => {
        const wrapper = document.querySelector('#generateDemandModal [data-demand-multi-select]');
        if (!wrapper?.contains(document.activeElement)) {
          wrapper?.classList.remove('open');
          const search = document.getElementById('demandEmailReceiverSearch');
          if (search) search.value = '';
        }
      }, 100);
    }

    function selectDemandEmailReceiver(event, email) {
      event.preventDefault();
      const hidden = document.getElementById('demandEmailReceivers');
      const search = document.getElementById('demandEmailReceiverSearch');
      const selected = normalizeDemandEmailList(hidden?.value);
      if (hidden && !selected.some(item => item.toLowerCase() === String(email).toLowerCase())) {
        hidden.value = [...selected, email].join(';');
      }
      renderDemandEmailReceiverTags();
      if (search) {
        search.value = '';
        search.focus();
      }
      renderDemandEmailReceiverOptions('');
    }

    function removeDemandEmailReceiver(event, email) {
      event.preventDefault();
      event.stopPropagation();
      const hidden = document.getElementById('demandEmailReceivers');
      if (!hidden) return;
      hidden.value = getDemandSelectedEmails().filter(item => item.toLowerCase() !== String(email).toLowerCase()).join(';');
      renderDemandEmailReceiverTags();
      const search = document.getElementById('demandEmailReceiverSearch');
      renderDemandEmailReceiverOptions(search?.value || '');
    }

    function handleDemandEmailReceiverKeydown(event) {
      const wrapper = document.querySelector('#generateDemandModal [data-demand-multi-select]');
      if (event.key === 'Escape') {
        wrapper?.classList.remove('open');
        return;
      }
      if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) return;
      event.preventDefault();
      if (!wrapper?.classList.contains('open')) openDemandEmailReceiverSelect();
      const options = [...document.querySelectorAll('#demandEmailReceiverOptions .demand-multi-option')];
      if (!options.length) return;
      const activeIndex = Math.max(0, options.findIndex(option => option.classList.contains('active')));
      let nextIndex = activeIndex;
      if (event.key === 'ArrowDown') nextIndex = (activeIndex + 1) % options.length;
      if (event.key === 'ArrowUp') nextIndex = (activeIndex - 1 + options.length) % options.length;
      options.forEach(option => option.classList.remove('active'));
      options[nextIndex].classList.add('active');
      if (event.key === 'Enter') selectDemandEmailReceiver(event, options[nextIndex].dataset.email);
    }

    function setDemandEmailReceiverValue(value) {
      const hidden = document.getElementById('demandEmailReceivers');
      if (hidden) hidden.value = normalizeDemandEmailList(value).join(';');
      renderDemandEmailReceiverTags();
    }
    function populateDemandSelect(id, options, selectedValue) {
      const field = document.getElementById(id);
      if (!field) return;
      const values = [...new Set([selectedValue, ...options].map(value => String(value || '').trim()).filter(Boolean))];
      field.innerHTML = '<option value="">请选择</option>' + values
        .map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
        .join('');
      field.value = selectedValue && values.includes(selectedValue) ? selectedValue : '';
      field.classList.remove('demand-input-invalid');
    }

    function renderDemandOrganizationFields() {
      const item = activeDemandContext.item;
      if (!item) return;
      const logisticsSupplier = item.logisticsSupplier || '安捷通物流有限公司';
      const supplierMerchant = item.supplierMerchant || DEMAND_SUPPLIER_MERCHANTS[logisticsSupplier] || '';
      populateDemandSelect('demandLogisticsSupplier', Object.keys(DEMAND_SUPPLIER_MERCHANTS), logisticsSupplier);
      populateDemandSelect('demandSupplierMerchant', Object.values(DEMAND_SUPPLIER_MERCHANTS), supplierMerchant);
    }
    function handleDemandLogisticsSupplierChange(field) {
      clearDemandFieldError(field);
      const merchantField = document.getElementById('demandSupplierMerchant');
      const suggestedMerchant = DEMAND_SUPPLIER_MERCHANTS[field?.value];
      if (merchantField && suggestedMerchant) {
        merchantField.value = suggestedMerchant;
        clearDemandFieldError(merchantField);
      }
    }
    function getDemandRouteDefaults(item) {
      const salesmanName = String(item.salesman || '').split(/[（(]/)[0].trim().split(/\s+/)[0] || '';
      return {
        assemblyType: item.assemblyType || '件杂',
        dischargeTerms: item.dischargeTerms || "LO",
        coilWeight: item.coilWeight || '',
        profileLength: item.profileLength || '',
        certificateRequirement: item.certificateRequirement || '需要船证',
        vesselAge: item.vesselAge || '不超过20年',
        originPort: item.originPort || '厦门港',
        loadingTerminal: item.loadingTerminal || '海沧码头',
        destinationPort: item.destinationPort || (item.type === 'dest' ? '鹿特丹港' : '大连港'),
        dischargeTerminal: item.dischargeTerminal || '指定卸港码头',
        directNavigation: item.directNavigation || '否',
        latestShipmentDate: item.shipmentDeadline || '',
        documentOfficer: item.documentOfficer || salesmanName,
        emailReceivers: item.emailReceivers || 'shipping@cnd.com.cn',
        remarks: item.remarks || ''
      };
    }

    function setDemandFieldValue(id, value) {
      if (id === 'demandEmailReceivers') {
        setDemandEmailReceiverValue(value);
        return;
      }
      const field = document.getElementById(id);
      if (field) field.value = value ?? '';
    }
    function renderDemandSourceMeta() {
      const item = activeDemandContext.item;
      if (!item) return;

      const unit = item.goodsLines?.[0]?.unit || '吨';
      const isPurchaseContract = state.currentTab === 'dest' || item.type === 'dest';
      const mainContractNo = getMainContractNo(item);
      const associatedContractNo = getAssociatedContractNo(item);
      const contractSourceFields = isPurchaseContract
        ? `<div class="generate-demand-source-item"><span>采购合同号</span><strong title="${escapeHtml(mainContractNo)}">${escapeHtml(mainContractNo)}</strong></div>`
        : `<div class="generate-demand-source-item"><span>销售合同号</span><strong title="${escapeHtml(mainContractNo)}">${escapeHtml(mainContractNo)}</strong></div>
           <div class="generate-demand-source-item"><span>采购合同号</span><strong title="${escapeHtml(associatedContractNo)}">${escapeHtml(associatedContractNo)}</strong></div>`;
      document.getElementById('demandSourceMeta').innerHTML = `
        ${contractSourceFields}
        <div class="generate-demand-source-item"><span>业务项目号</span><strong title="${escapeHtml(getProjectDisplay(item))}">${escapeHtml(getProjectDisplay(item))}</strong></div>
        <div class="generate-demand-source-item"><span>贸易供应商</span><strong title="${escapeHtml(item.supplier)}">${escapeHtml(item.supplier)}</strong></div>
        <div class="generate-demand-source-item"><span>当前待订舱</span><strong>${formatQty(Math.max(0, getPendingQty(item)), unit)}</strong></div>
      `;
    }
    function renderDemandRisk() {
      const item = activeDemandContext.item;
      const riskBar = document.getElementById('demandRiskBar');
      const riskTitle = document.getElementById('demandRiskTitle');
      const riskText = document.getElementById('demandRiskText');
      const riskBadge = document.getElementById('demandRiskBadge');
      if (!riskBar || !riskBadge || !riskTitle || !riskText) return;
      const risk = getRiskLabel(item);
      const definition = getRiskDefinition(item);
      if (risk === '正常') {
        riskBar.style.display = 'none';
        return;
      }
      const label = risk;
      const detail = [definition?.trigger, definition?.impact].filter(Boolean).join('；')
        || '当前记录存在风险，请确认后继续生成。';
      riskBar.style.display = 'inline-flex';
      riskBar.className = 'generate-demand-risk-wrap danger';
      riskBadge.textContent = label;
      riskBadge.setAttribute('aria-label', `${label}，悬浮查看详情`);
      riskTitle.textContent = label;
      riskText.textContent = detail;
    }
    function renderDemandRouteFields() {
      const defaults = getDemandRouteDefaults(activeDemandContext.item);
      setDemandFieldValue('demandAssemblyType', defaults.assemblyType);
      setDemandFieldValue('demandDischargeTerms', defaults.dischargeTerms);
      setDemandFieldValue('demandCoilWeight', defaults.coilWeight);
      setDemandFieldValue('demandProfileLength', defaults.profileLength);
      setDemandFieldValue('demandCertificateRequirement', defaults.certificateRequirement);
      setDemandFieldValue('demandVesselAge', defaults.vesselAge);
      setDemandFieldValue('demandOriginPort', defaults.originPort);
      setDemandFieldValue('demandLoadingTerminal', defaults.loadingTerminal);
      setDemandFieldValue('demandDestinationPort', defaults.destinationPort);
      setDemandFieldValue('demandDischargeTerminal', defaults.dischargeTerminal);
      setDemandFieldValue('demandDirectNavigation', defaults.directNavigation);
      setDemandFieldValue('demandLatestShipmentDate', defaults.latestShipmentDate);
      setDemandFieldValue('demandDocumentOfficer', defaults.documentOfficer);
      setDemandFieldValue('demandEmailReceivers', defaults.emailReceivers);
      setDemandFieldValue('demandRemarks', defaults.remarks);
      document.querySelectorAll('#generateDemandModal [data-demand-required="true"]').forEach(field => field.classList.remove('demand-input-invalid'));
    }

    function getDemandContractFieldValue(item, key, fallback = '-') {
      const value = item?.[key];
      return value === undefined || value === null || value === '' ? fallback : value;
    }

    function renderDemandContractInfo() {
      const item = activeDemandContext.item;
      if (!item) return;
      const fields = [
        ['服务要求单号', getDemandContractFieldValue(item, 'demandNo', '提交后自动生成')],
        ['委托方经营单位', getDemandContractFieldValue(item, 'operatingUnit')],
        ['委托方核算组', getDemandContractFieldValue(item, 'accountingGroup')],
        ['委托方部门', getDemandContractFieldValue(item, 'department')],
        ['委托方业务员', getDemandContractFieldValue(item, 'salesman')],
        ['合同抬头', getDemandContractFieldValue(item, 'companyTitle')],
        ['客户', getDemandContractFieldValue(item, 'customer')],
        ['结算方式', getDemandContractFieldValue(item, 'settlementMethod')],
        ['是否控单业务', getDemandContractFieldValue(item, 'controlledOrder')],
        ['货前收款比例', getDemandContractFieldValue(item, 'prepaymentRatio')],
        ['预付收款情况', getDemandContractFieldValue(item, 'prepaymentStatus')],
        ['销售价格条款', getDemandContractFieldValue(item, 'salesTerms')],
        ['采购价格条款', getDemandContractFieldValue(item, 'purchaseTerms')],
        ['对内交货期', getDemandContractFieldValue(item, 'internalDeliveryDate')],
        ['最迟装运日期', getDemandContractFieldValue(item, 'shipmentDeadline')],
        ['贸易类型', getDemandContractFieldValue(item, 'tradeType')],
        ['运费测算单价', getDemandContractFieldValue(item, 'freightUnitPrice')],
        ['是否我司派船', getDemandContractFieldValue(item, 'dispatchedByUs')],
        ['港杂预估单价', getDemandContractFieldValue(item, 'portMiscUnitPrice')]      ];
      document.getElementById('demandContractGrid').innerHTML = fields.map(([label, value]) => `
        <div class="generate-demand-readonly-field">
          <span>${escapeHtml(label)}</span>
          <strong title="${escapeHtml(value)}">${escapeHtml(value)}</strong>
        </div>
      `).join('');
    }

    function resetDemandContractInfo() {
      const grid = document.getElementById('demandContractGrid');
      const toggle = document.getElementById('demandContractToggle');
      if (grid) grid.classList.remove('hidden');
      if (toggle) toggle.classList.add('expanded');
    }

    function toggleDemandContractInfo() {
      const grid = document.getElementById('demandContractGrid');
      const toggle = document.getElementById('demandContractToggle');
      if (!grid || !toggle) return;
      const willExpand = grid.classList.contains('hidden');
      grid.classList.toggle('hidden', !willExpand);
      toggle.classList.toggle('expanded', willExpand);
    }

    function renderDemandGoodsTable() {
      const body = document.getElementById('demandGoodsBody');
      if (!body) return;
      if (!activeDemandContext.lines.length) {
        body.innerHTML = `
          <tr>
            <td colspan="9" class="demand-goods-empty">
              <i data-lucide="package-x"></i>
              暂无可生成服务要求的商品明细
            </td>
          </tr>
        `;
        if (window.lucide) lucide.createIcons();
        return;
      }

      const item = activeDemandContext.item;
      const contractLabel = `${getMainContractNo(item)}（${getTradeContractType(item)}）`;
      body.innerHTML = activeDemandContext.lines.map((line, index) => {
        const pending = getSourceGoodsPending(line);
        const demandQty = Number(line.demandQty || 0);
        const isInvalid = demandQty <= 0 || demandQty > pending;
        return `
          <tr>
            <td class="demand-project-cell">${escapeHtml(getGoodsProject(line, item))}</td>
            <td>${escapeHtml(contractLabel)}</td>
            <td class="demand-goods-name" title="${escapeHtml(line.name)}">${escapeHtml(line.name)}</td>
            <td class="demand-number">
              <input type="number" min="0" step="0.01" value="${demandQty || ''}" placeholder="请输入"
                class="${isInvalid ? 'demand-input-invalid' : ''}"
                data-demand-qty-index="${index}"
                oninput="handleDemandQtyInput(${index}, this.value)"
                aria-label="订舱标准数量" />
            </td>
            <td class="demand-number demand-readonly-qty" title="待订舱数量">${formatQty(Math.max(0, pending))}</td>
            <td>${escapeHtml(line.unit || '-')}</td>
            <td class="demand-number">
              <input type="number" min="0" step="0.01" value="${Number(line.overloadRate || 0)}"
                oninput="handleDemandRateInput(${index}, 'overloadRate', this.value)"
                aria-label="溢装率" />
            </td>
            <td class="demand-number">
              <input type="number" min="0" step="0.01" value="${Number(line.shortageRate || 0)}"
                oninput="handleDemandRateInput(${index}, 'shortageRate', this.value)"
                aria-label="短装率" />
            </td>
            <td style="text-align:center">
              <button type="button" class="demand-remove-line" onclick="removeDemandLine(${index})" title="移除商品行">
                <i data-lucide="trash-2"></i>移除
              </button>
            </td>
          </tr>
        `;
      }).join('');
      if (window.lucide) lucide.createIcons();
    }

    function handleDemandQtyInput(index, value) {
      const line = activeDemandContext.lines[index];
      if (!line) return;
      line.demandQty = Math.max(0, Number(value) || 0);
      const input = document.querySelector(`input[data-demand-qty-index="${index}"]`);
      const pending = getSourceGoodsPending(line);
      if (input) input.classList.toggle('demand-input-invalid', line.demandQty <= 0 || line.demandQty > pending);
      updateDemandSummary();
    }

    function handleDemandRateInput(index, key, value) {
      const line = activeDemandContext.lines[index];
      if (!line) return;
      line[key] = Math.max(0, Number(value) || 0);
    }

    function removeDemandLine(index) {
      if (activeDemandContext.lines.length <= 1) {
        showToast('至少保留一条商品明细。', 'warning');
        return;
      }
      activeDemandContext.lines.splice(index, 1);
      renderDemandGoodsTable();
      updateDemandSummary();
    }

    function updateDemandSummary() {
      const item = activeDemandContext.item;
      if (!item) return;
      const unit = item.goodsLines?.[0]?.unit || '吨';
      const total = activeDemandContext.lines.reduce((sum, line) => sum + (Number(line.demandQty) || 0), 0);
      const remaining = Math.max(0, getPendingQty(item) - total);
      document.getElementById('demandGoodsLineCount').textContent = activeDemandContext.lines.length;
      document.getElementById('demandTotalQty').textContent = formatQty(total);
      document.getElementById('demandRemainingQty').textContent = formatQty(remaining);
      document.getElementById('demandTotalUnit').textContent = unit;
      document.getElementById('demandRemainingUnit').textContent = unit;
    }

    function clearDemandFieldError(field) {
      if (field) field.classList.remove('demand-input-invalid');
    }

    function validateDemandForm() {
      const requiredFields = Array.from(document.querySelectorAll('#generateDemandModal [data-demand-required="true"]'));
      const missingField = requiredFields.find(field => !String(field.value || '').trim());
      if (missingField) {
        requiredFields.forEach(field => field.classList.toggle('demand-input-invalid', !String(field.value || '').trim()));
        showToast(`请先填写必填字段：${missingField.closest('.generate-demand-field')?.querySelector('label')?.textContent?.replace('*', '') || '路线与船期信息'}`, 'warning');
        missingField.focus();
        return false;
      }

      if (!activeDemandContext.lines.length) {
        showToast('请至少保留一条商品明细。', 'warning');
        return false;
      }

      const invalidLine = activeDemandContext.lines.find(line => {
        const qty = Number(line.demandQty) || 0;
        return qty <= 0 || qty > getSourceGoodsPending(line);
      });
      if (invalidLine) {
        renderDemandGoodsTable();
        showToast('商品明细的订舱标准数量必须大于0，且不能超过当前待订舱数量。', 'warning');
        return false;
      }
      return true;
    }

    function getDemandRoutePayload() {
      const ids = [
        'demandAssemblyType', 'demandDischargeTerms', 'demandCoilWeight', 'demandProfileLength',
        'demandCertificateRequirement', 'demandVesselAge', 'demandOriginPort', 'demandLoadingTerminal',
        'demandDestinationPort', 'demandDischargeTerminal', 'demandDirectNavigation', 'demandLatestShipmentDate',
        'demandDocumentOfficer', 'demandEmailReceivers', 'demandRemarks'
      ];
      return ids.reduce((payload, id) => {
        const field = document.getElementById(id);
        payload[id.replace(/^demand/, '').replace(/^[A-Z]/, letter => letter.toLowerCase())] = field?.value || '';
        return payload;
      }, {});
    }

    function getDemandOrganizationPayload() {
      const value = id => document.getElementById(id)?.value || '';
      const item = activeDemandContext.item || {};
      return {
        salesman: getDemandSalesmanName(item),
        department: item.department || '',
        operatingUnit: item.operatingUnit || '',
        accountingGroup: item.accountingGroup || '',
        salesmanCompany: item.companyTitle || '',
        logisticsSupplier: value('demandLogisticsSupplier'),
        supplierMerchant: value('demandSupplierMerchant')
      };
    }
    function confirmGenerateLogisticsDemand() {
      if (window.PrototypeAccess && !window.PrototypeAccess.can('trade.generate')) {
        window.PrototypeAccess.deny('生成服务要求');
        return;
      }
      const injectedFailure = window.PrototypeRuntime && window.PrototypeRuntime.consumeFailure('logisticsGenerate');
      if (injectedFailure === 'timeout') {
        showToast('生成服务要求请求超时，当前填写内容已保留，请重试。', 'danger');
        return;
      }
      if (!navigator.onLine) {
        showToast('网络连接已断开，服务要求尚未生成，请恢复网络后重试。', 'danger');
        return;
      }
      const item = activeDemandContext.item;
      if (!item) return;
      if (!validateDemandForm()) return;
      if (item.status === '已关闭') {
        showToast('已关闭记录必须先取消完结后才能生成服务要求。', 'warning');
        return;
      }
      if (getPendingQty(item) <= 0) {
        showToast('当前合同待订舱数量不足，无法生成服务要求', 'warning');
        closeModal('generateDemandModal');
        return;
      }

      if (getRiskLevel(item) === 'risk') {
        const risk = getRiskLabel(item);
        if (!window.confirm(`当前记录存在“${risk}”，是否确认继续生成服务要求？`)) return;
      }

      const totalQty = activeDemandContext.lines.reduce((sum, line) => sum + (Number(line.demandQty) || 0), 0);
      const unit = item.goodsLines?.[0]?.unit || '吨';
      const newDemandNo = 'LR-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900);
      const routePayload = getDemandRoutePayload();
      const organizationPayload = getDemandOrganizationPayload();
      const demandLines = activeDemandContext.lines.map(line => ({
        projectNo: getGoodsProject(line, item),
        tradeContractNo: getMainContractNo(item),
        tradeContractType: getTradeContractType(item),
        goodsName: line.name,
        standardQty: Number(line.demandQty) || 0,
        unit: line.unit || unit,
        overloadRate: Number(line.overloadRate) || 0,
        shortageRate: Number(line.shortageRate) || 0
      }));

      item.logisticsDemands.push({
        demandNo: newDemandNo,
        status: '已提单',
        scope: '全流程物流订舱',
        goodsName: demandLines.length > 1 ? `${demandLines[0].goodsName} 等多个` : demandLines[0].goodsName,
        goodsDescription: demandLines.map(line => `${line.goodsName}（${formatQty(line.standardQty, line.unit)}）`).join('；'),
        qty: totalQty,
        weight: (totalQty * 1.5).toFixed(2),
        volume: (totalQty * 2.2).toFixed(2),
        salesman: organizationPayload.salesman || getDemandSalesmanName(item),
        department: organizationPayload.department || item.department,
        operationOrg: organizationPayload.operatingUnit || item.operatingUnit,
        operationOrgPerson: organizationPayload.salesman || getDemandSalesmanName(item),
        salesmanCompany: organizationPayload.salesmanCompany,
        accountingGroup: organizationPayload.accountingGroup,
        logisticsSupplier: organizationPayload.logisticsSupplier,
        supplierMerchant: organizationPayload.supplierMerchant,
        organizationInfo: organizationPayload,
        routeInfo: routePayload,
        goodsDetails: demandLines,
        contractInfo: {
          salesNo: item.salesNo,
          purchaseNo: item.purchaseNo,
          customer: item.customer,
          supplier: item.supplier
        }
      });

      activeDemandContext.lines.forEach(draftLine => {
        const sourceLine = item.goodsLines?.[draftLine.__lineIndex];
        if (!sourceLine) return;
        const qty = Number(draftLine.demandQty) || 0;
        sourceLine.allocated = (sourceLine.allocated || 0) + qty;
        sourceLine.proposed = Math.max(0, getSourceGoodsPending(sourceLine));
      });
      item.allocatedQty = item.goodsLines.reduce((sum, goods) => sum + (goods.allocated || 0), 0);
      item.proposedQty = Math.max(0, getPendingQty(item));
      item.status = getDisplayStatus(item);

      closeModal('generateDemandModal');
      showToast(`成功为主表 [${getMainContractNo(item)}] 生成服务要求：${newDemandNo}`, 'success');
      renderWorkbenchTable();
    }

    function handleGenerateDemandBackdrop(event) {
      if (event.target.id === 'generateDemandModal') closeModal('generateDemandModal');
    }

    function batchGenerateLogisticsDemand() {
      if (state.selectedRowIds.size === 0) {
        showToast('请至少选择一条待办合同记录！', 'warning');
        return;
      }

      let count = 0;
      getSelectedWorkbenchItems().forEach(item => {
        const id = item.id;
        if (item && getDisplayStatus(item) !== '已关闭' && getPendingQty(item) > 0) {
          generateLogisticsDemand(id);
          count++;
        }
      });

      if (count > 0) showToast(`批量处理完成！已为 ${count} 条合同生成服务要求`, 'success');
      else showToast('选中的合同不满足生成条件（待订舱数量不足或已关闭）', 'warning');
    }

    function openLogisticsDemandModal(id) {
      const item = state.items.find(i => i.id === id);
      if (!item) return;

      activeLogisticsContext = {
        itemId: id,
        item,
        demands: item.logisticsDemands || [],
        taskMap: new Map(),
        commissionMap: new Map(),
        serviceRequirementMap: new Map()
      };

      const isPurchaseContract = state.currentTab === 'dest' || item.type === 'dest';
      const projectDisplay = getProjectDisplay(item) || '-';
      const mainContractNo = getMainContractNo(item) || '-';
      const associatedContractNo = getAssociatedContractNo(item) || '-';
      const qtyUnit = item.goodsLines?.[0]?.unit || "吨";
      const allocatedQty = formatQty(getAllocatedQty(item), qtyUnit);
      const pendingQty = formatQty(getPendingQty(item), qtyUnit);
      const visibleDemands = (item.logisticsDemands || []).filter(demand => demand.status !== '作废');
      const serviceRequirements = visibleDemands.flatMap((demand, index) => getLogisticsDemandViewModel(demand, item, index).serviceRequirements);
      const arrangedTotal = serviceRequirements.reduce((sum, requirement) => sum + getServiceRequirementQuantityMetrics(requirement).arranged, 0);
      const arrangedQty = formatQty(arrangedTotal, qtyUnit);
      const contractFields = document.getElementById('logisticsModalContractFields');
      const purchaseContractField = document.getElementById('logisticsModalPurchaseContractField');
      document.getElementById('logisticsModalPrimaryContractLabel').textContent = isPurchaseContract ? '采购合同号' : '销售合同号';
      document.getElementById('logisticsModalContractNo').textContent = mainContractNo;
      document.getElementById('logisticsModalContractNo').title = mainContractNo;
      document.getElementById('logisticsModalProjectNo').textContent = projectDisplay;
      document.getElementById('logisticsModalProjectNo').title = projectDisplay;
      document.getElementById('logisticsModalAssociatedContractNo').textContent = associatedContractNo;
      document.getElementById('logisticsModalAssociatedContractNo').title = associatedContractNo;
      document.getElementById("logisticsModalAllocatedQty").textContent = allocatedQty;
      document.getElementById("logisticsModalAllocatedQty").title = allocatedQty;
      document.getElementById("logisticsModalArrangedQty").textContent = arrangedQty;
      document.getElementById("logisticsModalArrangedQty").title = arrangedQty;
      document.getElementById("logisticsModalPendingQty").textContent = pendingQty;
      if (purchaseContractField) purchaseContractField.style.display = isPurchaseContract ? 'none' : '';
      if (contractFields) {
        contractFields.style.gridTemplateColumns = isPurchaseContract
          ? 'minmax(140px, 1.3fr) minmax(120px, 1fr) minmax(100px, .8fr) minmax(100px, .8fr) minmax(100px, .8fr)'
          : '';
      }
      refreshLogisticsDrawer();
      openModal('logisticsModal');
      if (window.lucide) lucide.createIcons();
    }

    function refreshLogisticsDrawer() {
      const item = activeLogisticsContext.item;
      if (!item) return;


      const visibleDemands = (activeLogisticsContext.demands || [])
        .filter(demand => demand.status !== '作废');
      const viewModels = visibleDemands.map((demand, index) => getLogisticsDemandViewModel(demand, item, index));
      const serviceRequirements = viewModels.flatMap(model => model.serviceRequirements);
      const commissions = serviceRequirements.flatMap(requirement => requirement.commissions || []);
      const tasks = commissions.flatMap(commission => (commission.tasks || []).map(task => ({
        ...task,
        commission,
        requirement: commission.requirement
      })));

      activeLogisticsContext.serviceRequirementMap = new Map();
      serviceRequirements.forEach(requirement => {
        activeLogisticsContext.serviceRequirementMap.set(requirement.dispatchNo, requirement);
      });

      activeLogisticsContext.commissionMap = new Map();
      commissions.forEach(commission => {
        const key = getLogisticsCommissionKey(commission);
        commission.__key = key;
        activeLogisticsContext.commissionMap.set(key, commission);
      });

      activeLogisticsContext.taskMap = new Map();
      tasks.forEach((task, index) => {
        const key = `${task.requirement.dispatchNo}|${task.commission.commissionNo}|${task.taskNo || index + 1}`;
        task.__key = key;
        activeLogisticsContext.taskMap.set(key, task);
      });

      document.getElementById('logisticsCount').textContent = serviceRequirements.length;
      document.getElementById('logisticsServiceCount').textContent = commissions.length;


      const demandList = document.getElementById('logisticsDemandList');
      if (!serviceRequirements.length) {
        const emptyText = activeLogisticsContext.demands.length
          ? '当前合同暂无有效服务要求记录。'
          : '当前贸易合同尚未生成服务要求记录。';
        demandList.innerHTML = `<div class="logistics-no-data">${emptyText}</div>`;
      } else {
        demandList.innerHTML = serviceRequirements.map(renderLogisticsServiceNode).join('');
      }

      if (window.lucide) lucide.createIcons();
    }
    function getLogisticsDemandGoodsLines(demand, item) {
      const sourceLines = demand.goodsDetails?.length
        ? demand.goodsDetails
        : (item.goodsLines || []).map(line => ({
          name: line.name,
          qty: line.demandQty ?? line.standardQty ?? line.contractQty ?? line.allocatable ?? 0,
          unit: line.unit || '吨'
        }));
      return sourceLines.filter(line => line.name).map(line => ({
        name: line.name,
        qty: Number(line.qty ?? line.standardQty ?? line.demandQty ?? 0),
        unit: line.unit || '吨'
      }));
    }

    function aggregateLogisticsGoods(viewModels) {
      const totals = new Map();
      viewModels.forEach(model => {
        const lines = model.serviceRequirements.flatMap(requirement => requirement.goodsLines || []);
        lines.forEach(line => {
          const key = `${line.name}|${line.unit}`;
          const current = totals.get(key) || { name: line.name, unit: line.unit, qty: 0 };
          current.qty += Number(line.qty) || 0;
          totals.set(key, current);
        });
      });
      return [...totals.values()];
    }

    function getDemoTask(overrides = {}) {
      return {
        taskNo: 'TR-待生成',
        taskName: '待生成运输任务',
        bookingStatus: '未订舱',
        arrangedQty: 0,
        bookingQty: 0,
        unbookedQty: 0,
        shippedQty: 0,
        declarationStatus: '未宣舱',
        vesselName: '待安排',
        imo: '待安排',
        mmsi: '待安排',
        routeName: '待安排',
        laycan: '待安排',
        revisedLaycan: '待安排',
        eta: '待安排',
        etd: '待安排',
        ata: '待安排',
        etb: '待安排',
        atb: '待安排',
        berthTime: '待安排',
        loadPortTime: '待安排',
        departLoadPortTime: '待安排',
        revisedDeadline: '待安排',
        dynamicUpdatedAt: '待安排',
        latestTracking: '尚未产生运输动态',
        latestTrackingTime: '待安排',
        currentNode: '待处理',
        currentOperationTime: '待安排',
        vessels: [],
        bookingAgreementNo: '待填写',
        bookingForwarder: '待安排',
        category: '海运订舱',
        bookingManager: '待分派',
        bookingOperator: '待分派',
        inquiryMethod: '待确认',
        principalOperatingUnit: '厦门建发物流有限公司',
        principalAccountingGroup: '物流核算组',
        outboundQty: 0,
        loadRate: '—',
        dischargeRate: '—',
        height: '—',
        freight: 0,
        freightTerms: '待确认',
        freightPaymentTerm: '月结',
        totalFreight: 0,
        netFreight: 0,
        otherFees: 0,
        demurrageFee: 0,
        freightInvoice: '未开票',
        commissionRate: '—',
        commissionAmount: 0,
        isCqd: '否',
        isLashingIncluded: '否',
        loadingPortAgent: '待安排',
        dischargePortAgent: '待安排',
        portArea: '待安排',
        groundForwarder: '待安排',
        isDeparted: '否',
        waitingDays: 0,
        overdueDays: 0,
        additionalTerms: '无',
        remark: '无',
        declarationInfo: '待宣舱',
        documentStatus: '未提交',
        trackings: [],
        ...overrides
      };
    }

    function getLogisticsDemandViewModel(demand, item, demandIndex) {
      const goodsLines = getLogisticsDemandGoodsLines(demand, item);
      const defaultSupplier = demand.logisticsSupplier || item.supplier || '待分派物流供应商';
      const defaultOrg = demand.operationOrg || '建发物流作业中心';
      const defaultPerson = demand.operationOrgPerson || '待分派';
      let serviceRequirements;

      if (demand.demandNo === 'LR-20260220-001') {
        serviceRequirements = [
          {
            demandNo: demand.demandNo,
            dispatchNo: 'SR-20260220-001',
            dispatchStatus: '已分派',
            operationOrg: '建发物流华东作业中心',
            operationOrgPerson: '周凯',
            serviceItem: '海运订舱',
            extensionScene: '出口海运 / 整柜',
            goodsLines: [{ name: '高密度聚乙烯 HDPE-5000S', qty: 1200, unit: '吨' }],
            supplier: '中远海运物流供应链有限公司',
            dispatchTime: '2026-02-20 10:32',
            commissions: [
              {
                commissionNo: 'LC-20260220-001',
                commissionContractNo: 'FLMT202602200001',
                versionNo: 'V1.0',
                commissionName: 'HDPE 3月船期海运委托',
                status: '执行中',
                principalCompany: '厦门建发物流有限公司',
                supplier: '中远海运物流供应链有限公司',
                tasks: [
                  getDemoTask({
                    taskNo: 'TR-20260220-001-01',
                    taskName: '青岛港至鹿特丹港 / 3月船期',
                    bookingStatus: '已订舱',
                    arrangedQty: 700,
                    bookingQty: 600,
                    unbookedQty: 100,
                    shippedQty: 420,
                    declarationStatus: '已宣舱',
                    vesselName: 'COSCO SHIPPING TAURUS',
                    imo: '9781234',
                    mmsi: '477123400',
                    routeName: '青岛港 → 鹿特丹港',
                    laycan: '2026-03-10 ~ 03-15',
                    revisedLaycan: '2026-03-11 ~ 03-16',
                    eta: '2026-04-20',
                    etd: '2026-03-12',
                    ata: '待安排',
                    etb: '待安排',
                    atb: '待安排',
                    berthTime: '待安排',
                    loadPortTime: '2026-03-11 09:30',
                    departLoadPortTime: '待安排',
                    revisedDeadline: '2026-03-20',
                    dynamicUpdatedAt: '2026-03-11 16:42',
                    latestTracking: '船舶已进港，等待靠泊',
                    latestTrackingTime: '2026-03-11 16:42',
                    currentNode: '等待靠泊',
                    currentOperationTime: '2026-03-11 16:42',
                    vessels: [
                      {
                        name: 'COSCO SHIPPING TAURUS',
                        voyageNo: '086W',
                        mmsi: '477123400',
                        qty: 400,
                        unit: '吨',
                        routeName: '青岛港 → 鹿特丹港',
                        laycan: '2026-03-10 ~ 03-15',
                        etd: '2026-03-12',
                        eta: '2026-04-20',
                        atd: '2026-03-12 18:20',
                        ata: '2026-04-19 07:45',
                        currentNode: '等待靠泊',
                        currentOperationTime: '2026-03-11 16:42',
                        latestTracking: '船舶已进港，等待靠泊'
                      },
                      {
                        name: 'EVER GLORY',
                        voyageNo: '112E',
                        mmsi: '636092123',
                        qty: 300,
                        unit: '吨',
                        routeName: '青岛港 → 安特卫普港',
                        laycan: '2026-03-12 ~ 03-17',
                        etd: '2026-03-14',
                        eta: '2026-04-22',
                        atd: '2026-03-14 09:10',
                        ata: '2026-04-21 10:20',
                        currentNode: '已开航',
                        currentOperationTime: '2026-03-14 08:30',
                        latestTracking: '船舶已离港，航行中'
                      }
                    ],
                    trackings: [
                      { time: '2026-03-11 16:42', title: '船舶已进港', content: '已抵达青岛港锚地，等待码头靠泊。' },
                      { time: '2026-03-10 08:20', title: '船期确认', content: '船公司确认本航次计划，预计 2026-03-12 离港。' },
                      { time: '2026-03-06 14:05', title: '完成订舱', content: '已完成 700 吨订舱，等待宣舱。' }
                    ]
                  }),
                  getDemoTask({
                    taskNo: 'TR-20260220-001-02',
                    taskName: '青岛港至鹿特丹港 / 4月船期',
                    bookingStatus: '部分订舱',
                    arrangedQty: 400,
                    bookingQty: 400,
                    unbookedQty: 0,
                    shippedQty: 0,
                    declarationStatus: '未宣舱',
                    vesselName: '待安排',
                    routeName: '青岛港 → 鹿特丹港',
                    laycan: '待安排',
                    etd: '待安排',
                    latestTracking: '待物流供应商反馈船期',
                    latestTrackingTime: '待安排',
                    currentNode: '等待供应商反馈船期',
                    currentOperationTime: '待安排',
                    trackings: []
                  })
                ]
              }
            ]
          },
          {
            demandNo: demand.demandNo,
            dispatchNo: 'SR-20260220-002',
            dispatchStatus: '部分分派',
            operationOrg: '建发物流华东作业中心',
            operationOrgPerson: '周凯',
            serviceItem: '海运订舱',
            extensionScene: '出口海运 / 拼箱',
            goodsLines: [{ name: '线性低密度聚乙烯 LLDPE-7042', qty: 800, unit: '吨' }],
            supplier: '马士基物流（中国）有限公司',
            dispatchTime: '2026-02-21 09:18',
            commissions: [
              {
                commissionNo: 'LC-20260221-003',
                commissionContractNo: 'FLMT202602210003',
                versionNo: 'V1.0',
                commissionName: 'LLDPE 拼箱海运委托',
                status: '待接单',
                principalCompany: '厦门建发物流有限公司',
                supplier: '马士基物流（中国）有限公司',
                tasks: [
                  getDemoTask({
                    taskNo: 'TR-20260221-003-01',
                    taskName: '宁波港至安特卫普港',
                    bookingStatus: '部分订舱',
                    arrangedQty: 800,
                    bookingQty: 600,
                    unbookedQty: 200,
                    routeName: '宁波港 → 安特卫普港',
                    latestTracking: '委托已下发，等待供应商接单',
                    latestTrackingTime: '2026-02-21 09:20',
                    currentNode: '等待供应商接单',
                    currentOperationTime: '2026-02-21 09:20',
                    trackings: [
                      { time: '2026-02-21 09:20', title: '委托已下发', content: '已向物流供应商发送运输安排指令。' }
                    ]
                  })
                ]
              }
            ]
          }
        ];
      } else {
        const dispatchNo = `SR-${String(demand.demandNo || `DEMO-${demandIndex}`).replace(/[^A-Za-z0-9]/g, '').slice(-12)}-01`;
        const commissionNo = `LC-${String(demand.demandNo || `DEMO-${demandIndex}`).replace(/[^A-Za-z0-9]/g, '').slice(-12)}-01`;
        const commissionContractNo = `FLMT${String(demand.demandNo || `DEMO-${demandIndex}`).replace(/[^A-Za-z0-9]/g, '').slice(-12)}-01`;
        serviceRequirements = [{
          demandNo: demand.demandNo,
          dispatchNo,
          dispatchStatus: demand.status === '作废' ? '已作废' : '已分派',
          operationOrg: defaultOrg,
          operationOrgPerson: defaultPerson,
          serviceItem: demand.scope || '海运订舱',
          extensionScene: demand.status === '作废' ? '历史记录' : '海运执行',
          goodsLines: goodsLines.length ? goodsLines : [{ name: demand.goodsName || '-', qty: demand.qty || 0, unit: '吨' }],
          supplier: defaultSupplier,
          dispatchTime: demand.createdAt || '2026-02-22 14:00',
          commissions: demand.status === '作废' ? [] : [{
            commissionNo,
            commissionContractNo,
            versionNo: 'V1.0',
            commissionName: `${demand.goodsName || '贸易合同'} 物流委托`,
            status: demand.status === '已完成' ? '已完成' : '执行中',
            principalCompany: '厦门建发物流有限公司',
            supplier: defaultSupplier,
            tasks: [getDemoTask({
              taskNo: `${commissionNo}-T01`,
              taskName: `${demand.goodsName || '商品'}运输任务`,
              bookingStatus: demand.status === '已完成' ? '已订舱' : '未订舱',
              arrangedQty: Number(demand.qty) || 0,
              bookingQty: Number(demand.qty) || 0,
              unbookedQty: demand.status === '已完成' ? 0 : Number(demand.qty) || 0,
              shippedQty: 0,
              routeName: demand.routeInfo?.originPort && demand.routeInfo?.destinationPort
                ? `${demand.routeInfo.originPort} → ${demand.routeInfo.destinationPort}`
                : '待安排',
              latestTracking: demand.status === '已完成' ? '运输任务已完成' : '等待物流供应商反馈船期',
              latestTrackingTime: demand.status === '已完成' ? '2026-02-24 17:30' : '待安排',
              currentNode: demand.status === '已完成' ? '运输完成' : '等待供应商反馈船期',
              currentOperationTime: demand.status === '已完成' ? '2026-02-24 17:30' : '待安排'
            })]
          }]
        }];
      }

      serviceRequirements.forEach(requirement => {
        requirement.latestShipmentDate = requirement.latestShipmentDate || demand.routeInfo?.latestShipmentDate || demand.latestShipmentDate || item.shipmentDeadline || '-';
        (requirement.commissions || []).forEach(commission => {
          commission.requirement = requirement;
        });
      });

      return { demand, goodsLines, serviceRequirements };
    }

    function renderLogisticsDemandSummaryCard(model, index = 0) {
      const demand = model.demand || {};
      const requirements = model.serviceRequirements || [];
      const commissions = requirements.flatMap(requirement => requirement.commissions || []);
      const statusClass = getLogisticsDemandStatusClass(demand.status);
      const scope = demand.scope || requirements[0]?.serviceItem || '-';

      const expanded = index === 0;
      const chainId = `logisticsDemandChain${index + 1}`;
      return `
        <article class="logistics-demand-item ${expanded ? 'is-expanded' : ''}" data-demand-no="${escapeHtml(demand.demandNo || '')}">
          <div class="logistics-demand-item-head">
            <div class="logistics-demand-inline">
              <span class="logistics-demand-no">${escapeHtml(demand.demandNo || '-')}</span>
              <span class="logistics-demand-status ${statusClass}">${escapeHtml(demand.status || '待处理')}</span>
              <span class="logistics-demand-inline-divider"></span>
              <span class="logistics-demand-inline-scope">${escapeHtml(scope)}</span>
            </div>
            <div class="logistics-demand-head-actions">
              <button type="button" class="logistics-demand-toggle" aria-expanded="${expanded}" aria-controls="${chainId}" onclick="toggleLogisticsDemandCard(this)">
                <span data-demand-toggle-label>${expanded ? '收起' : '展开'}</span>
                <i data-lucide="chevron-down"></i>
              </button>
            </div>
          </div>
          <div id="${chainId}" class="logistics-demand-body">
            ${requirements.length
              ? `<div class="logistics-chain-list">${requirements.map(renderLogisticsServiceNode).join('')}</div>`
              : '<div class="logistics-chain-empty">当前服务要求暂无关联明细</div>'}
          </div>
        </article>
      `;
    }

    function toggleLogisticsDemandCard(button) {
      const card = button.closest('.logistics-demand-item');
      if (!card) return;
      const expanded = card.classList.toggle('is-expanded');
      button.setAttribute('aria-expanded', String(expanded));
      const label = button.querySelector('[data-demand-toggle-label]');
      if (label) label.textContent = expanded ? '收起' : '展开';

      if (expanded) {
        document.querySelectorAll('#logisticsDemandList .logistics-demand-item.is-expanded').forEach(otherCard => {
          if (otherCard === card) return;
          otherCard.classList.remove('is-expanded');
          const otherButton = otherCard.querySelector('.logistics-demand-toggle');
          if (!otherButton) return;
          otherButton.setAttribute('aria-expanded', 'false');
          const otherLabel = otherButton.querySelector('[data-demand-toggle-label]');
          if (otherLabel) otherLabel.textContent = '展开';
        });
      }
    }

    function getServiceRequirementQuantityMetrics(requirement) {
      const commissions = requirement.commissions || [];
      const tasks = commissions.flatMap(commission => commission.tasks || []);
      const issued = Number(
        requirement.issuedBookingQty
        ?? (requirement.goodsLines || []).reduce((sum, line) => sum + Number(line.qty || 0), 0)
      );
      const arranged = Number(
        requirement.arrangedQty
        ?? tasks.reduce((sum, task) => sum + Number(task.arrangedQty ?? task.bookingQty ?? 0), 0)
      );
      const confirmed = Number(
        requirement.confirmedBookingQty
        ?? tasks.reduce((sum, task) => sum + Number(task.bookingQty || 0), 0)
      );
      const unbooked = Number(
        requirement.issuedUnbookedQty
        ?? Math.max(0, issued - confirmed)
      );
      return {
        issued,
        arranged,
        unbooked,
        confirmed,
        unit: requirement.goodsLines?.[0]?.unit || tasks[0]?.qtyUnit || '吨'
      };
    }

    function renderLogisticsServiceNode(requirement) {
      const statusClass = getLogisticsDemandStatusClass(requirement.dispatchStatus);
      const commissions = requirement.commissions || [];
      const serviceKey = requirement.dispatchNo || '';
      const quantityMetrics = getServiceRequirementQuantityMetrics(requirement);
      return `
        <article class="logistics-service-node" data-service-requirement-no="${escapeHtml(requirement.dispatchNo || '')}">
          <div class="logistics-service-header">
            <div class="logistics-service-inline">
            <span class="logistics-node-label">服务要求</span>
            <span class="logistics-node-code">${escapeHtml(requirement.dispatchNo)}</span>
            <span class="logistics-service-status ${statusClass}">${escapeHtml(requirement.dispatchStatus)}</span>
            <button type="button" class="logistics-service-view" data-service-key="${escapeHtml(serviceKey)}" onclick="openLogisticsServiceDetail(this.dataset.serviceKey)">详情 <i data-lucide="chevron-right"></i></button>
            <span class="logistics-service-inline-divider"></span>
            <span class="logistics-service-inline-field">服务 <strong>${escapeHtml(requirement.serviceItem)}</strong></span>
            <span class="logistics-service-inline-field">场景 <strong>${escapeHtml(requirement.extensionScene)}</strong></span>
            <span class="logistics-service-inline-divider"></span>
            <span class="logistics-service-inline-field">最迟装运日期 <strong>${escapeHtml(requirement.latestShipmentDate || '-')}</strong></span>
            </div>
            <button type="button" class="logistics-service-toggle" aria-expanded="true" onclick="toggleLogisticsServiceNode(this)">
              <span data-service-toggle-label>收起</span><i data-lucide="chevron-down"></i>
            </button>
          </div>
          <div class="logistics-service-body">
          <div class="logistics-service-secondary">
            <span class="logistics-service-info-label">作业信息</span>
            <span class="logistics-service-inline-field logistics-service-inline-org">组织/人员 <strong title="${escapeHtml(`${requirement.operationOrg || '-'} / ${requirement.operationOrgPerson || '-'}`)}">${escapeHtml(`${requirement.operationOrg || '-'} / ${requirement.operationOrgPerson || '-'}`)}</strong></span>
            <span class="logistics-service-inline-divider"></span>
            <span class="logistics-service-inline-field logistics-service-inline-supplier">供应商 <strong title="${escapeHtml(requirement.supplier)}">${escapeHtml(requirement.supplier)}</strong></span>
            <span class="logistics-service-inline-divider"></span>
            <span class="logistics-service-quantity-item"><span>已下发订舱数量</span><strong>${escapeHtml(formatQty(quantityMetrics.issued, quantityMetrics.unit))}</strong></span>
            <span class="logistics-service-quantity-item"><span>已安排数量</span><strong>${escapeHtml(formatQty(quantityMetrics.arranged, quantityMetrics.unit))}</strong></span>
            <span class="logistics-service-quantity-item"><span>已下发未订舱数量</span><strong>${escapeHtml(formatQty(quantityMetrics.unbooked, quantityMetrics.unit))}</strong></span>
            <span class="logistics-service-quantity-item"><span>已确认订舱数量</span><strong>${escapeHtml(formatQty(quantityMetrics.confirmed, quantityMetrics.unit))}</strong></span>
          </div>
          <div class="logistics-chain-children">
            ${commissions.length
              ? commissions.map(commission => renderLogisticsCommissionNode(commission, requirement)).join('')
              : '<div class="logistics-chain-empty">当前服务要求暂无物流委托</div>'}
          </div>
          </div>
        </article>
      `;
    }

    function toggleLogisticsServiceNode(button) {
      const node = button.closest('.logistics-service-node');
      if (!node) return;
      const collapsed = node.classList.toggle('is-collapsed');
      button.setAttribute('aria-expanded', String(!collapsed));
      const label = button.querySelector('[data-service-toggle-label]');
      if (label) label.textContent = collapsed ? '展开' : '收起';
    }

    function getLogisticsCommissionKey(commission) {
      return `${commission.requirement?.dispatchNo || ''}|${commission.commissionNo || ''}`;
    }

    function renderLogisticsCommissionNode(commission, requirement) {
      const statusClass = getLogisticsDemandStatusClass(commission.status);
      const commissionKey = getLogisticsCommissionKey(commission);
      const tasks = (commission.tasks || []).map((task, index) => ({
        ...task,
        commission,
        requirement,
        __key: `${requirement.dispatchNo}|${commission.commissionNo}|${task.taskNo || index + 1}`
      }));
      return `
        <article class="logistics-commission-node">
          <div class="logistics-commission-head">
            <div class="logistics-commission-title">
              <span class="logistics-node-label commission">物流委托</span>
              <span class="logistics-commission-status ${statusClass}">${escapeHtml(commission.status)}</span>
              <strong class="logistics-commission-name">${escapeHtml(commission.commissionName || "-")}</strong>
              <button type="button" class="logistics-commission-view" data-commission-key="${escapeHtml(commissionKey)}" onclick="openLogisticsCommissionDetail(this.dataset.commissionKey)">详情 <i data-lucide="chevron-right"></i></button>
              <span class="logistics-commission-contract">${escapeHtml(commission.commissionContractNo || commission.commissionNo || "-")} (${escapeHtml(commission.versionNo || "V1.0")})</span>
              <span class="logistics-commission-inline-divider"></span>
              <span class="logistics-commission-inline-field">物流供应商 <strong>${escapeHtml(commission.supplier)}</strong></span>
            </div>
          </div>
          <div class="logistics-task-list">
            ${tasks.length
              ? tasks.map(renderLogisticsTaskNode).join('')
              : '<div class="logistics-chain-empty">当前物流委托暂无运输任务</div>'}
          </div>
        </article>
      `;
    }

    function getTaskVesselRows(task) {
      const sourceVessels = Array.isArray(task.vessels) && task.vessels.length
        ? task.vessels
        : [{ name: task.vesselName || '待安排' }];
      return sourceVessels.map(vessel => {
        const routeName = vessel.routeName || task.routeName || '待安排';
        const routePorts = String(routeName).split(/\s*(?:→|->|至)\s*/);
        return {
          name: vessel.name || task.vesselName || '待安排',
          voyageNo: vessel.voyageNo || '',
          mmsi: vessel.mmsi || task.mmsi || '待安排',
          qty: vessel.qty ?? null,
          unit: vessel.unit || task.qtyUnit || '吨',
          routeName,
          originPort: vessel.originPort || task.originPort || routePorts[0] || '待安排',
          destinationPort: vessel.destinationPort || task.destinationPort || routePorts[1] || '待安排',
          laycan: vessel.laycan || task.laycan || '待安排',
          etd: vessel.etd || task.etd || '待安排',
          eta: vessel.eta || task.eta || '待安排',
          atd: vessel.atd || task.atd || task.departLoadPortTime || '待安排',
          ata: vessel.ata || task.ata || '待安排',
          currentNode: vessel.currentNode || task.currentNode || task.latestTracking || '待处理',
          currentOperationTime: vessel.currentOperationTime || task.currentOperationTime || task.latestTrackingTime || '待安排',
          latestTracking: vessel.latestTracking || task.latestTracking || '尚未产生运输动态'
        };
      });
    }

    function formatVesselDate(value) {
      if (value === undefined || value === null || value === '') return '待安排';
      const text = String(value).trim();
      const matched = text.match(/^\d{4}-\d{2}-\d{2}/);
      return matched ? matched[0] : text;
    }

    function renderLogisticsTaskNode(task) {
      const bookingClass = task.bookingStatus === '已订舱' ? '' : 'pending';
      const declarationClass = task.declarationStatus === '已宣舱' ? 'logistics-booking-status' : 'logistics-booking-status pending';
      const taskKey = escapeHtml(task.__key);
      const vessels = getTaskVesselRows(task);
      return `
        <article class="logistics-task-node">
          <div class="logistics-task-summary">
            <div class="logistics-task-identity">
              <div class="logistics-task-code">${escapeHtml(task.taskNo)}</div>
              <div class="logistics-task-status-line">
                <span class="logistics-booking-status ${bookingClass}">${escapeHtml(task.bookingStatus)}</span>
                <span class="${declarationClass}">${escapeHtml(task.declarationStatus)}</span>
              </div>
            </div>
            <span class="logistics-task-summary-divider"></span>
            <div class="logistics-task-qty-inline">
              <span><small>已安排数量</small><strong>${escapeHtml(formatQty(task.arrangedQty ?? task.bookingQty, task.qtyUnit || '吨'))}</strong></span>
              <span><small>已确认订舱数量</small><strong>${escapeHtml(formatQty(task.bookingQty, task.qtyUnit || '吨'))}</strong></span>
              <span><small>已装船数量</small><strong>${escapeHtml(formatQty(task.shippedQty, task.qtyUnit || '吨'))}</strong></span>
            </div>
            <span class="logistics-task-summary-divider"></span>
            <div class="logistics-task-summary-laycan"><span>LAYCAN</span><strong>${escapeHtml(task.laycan || '待安排')}</strong></div>
            <div class="logistics-task-summary-meta">
              <span>承运船舶</span><strong>${vessels.length} 艘</strong>
            </div>
          </div>
          <div class="logistics-task-vessel-list">
            ${vessels.map((vessel, index) => {
              const meta = [
                vessel.mmsi ? 'MMSI ' + vessel.mmsi : 'MMSI 待安排',
                vessel.voyageNo ? '航次 ' + vessel.voyageNo : '航次 待安排'
              ].filter(Boolean).join(' · ');
              return `<div class="logistics-vessel-row ${index >= 3 ? 'is-vessel-hidden' : ''}" ${index >= 3 ? 'data-extra-vessel="true"' : ''}>
                <div class="logistics-vessel-identity">
                  <span class="logistics-task-vessel-index">${index + 1}</span>
                  <div class="logistics-vessel-copy">
                    <strong title="${escapeHtml(vessel.name)}">${escapeHtml(vessel.name)}</strong>
                    <span>${escapeHtml(meta || '待安排')}</span>
                  </div>
                </div>
                <div class="logistics-vessel-detail">
                  <div class="logistics-vessel-route-grid">
                    <div class="logistics-vessel-port">
                      <div class="logistics-vessel-port-name" title="${escapeHtml(vessel.originPort)}">${escapeHtml(vessel.originPort)}</div>
                      <div class="logistics-vessel-port-time"><span>ETD</span><strong>${escapeHtml(formatVesselDate(vessel.etd))}</strong></div>
                      <div class="logistics-vessel-port-time"><span>ATD</span><strong>${escapeHtml(formatVesselDate(vessel.atd))}</strong></div>
                    </div>
                    <div class="logistics-vessel-route-arrow"><i data-lucide="arrow-right"></i></div>
                    <div class="logistics-vessel-port">
                      <div class="logistics-vessel-port-name" title="${escapeHtml(vessel.destinationPort)}">${escapeHtml(vessel.destinationPort)}</div>
                      <div class="logistics-vessel-port-time"><span>ETA</span><strong>${escapeHtml(formatVesselDate(vessel.eta))}</strong></div>
                      <div class="logistics-vessel-port-time"><span>ATA</span><strong>${escapeHtml(formatVesselDate(vessel.ata))}</strong></div>
                    </div>
                  </div>
                </div>
                <div class="logistics-vessel-status">
                  <div class="logistics-vessel-current"><i></i><span>${escapeHtml(vessel.currentNode)}</span></div>
                  <div class="logistics-vessel-status-time">最新反馈时间 ${escapeHtml(vessel.currentOperationTime)}</div>
                </div>
                <div class="logistics-vessel-action">
                  <button type="button" class="logistics-task-action" data-task-key="${taskKey}" data-vessel-index="${index}" onclick="openLogisticsTrackingPage(this.dataset.taskKey, Number(this.dataset.vesselIndex))"><i data-lucide="history"></i>跟踪</button>
                </div>
              </div>`;
            }).join('')}
          </div>
          ${vessels.length > 3 ? `<div class="logistics-vessel-more">
            <button type="button" aria-expanded="false" data-vessel-total="${vessels.length}" onclick="toggleTaskVesselRows(this)">
              <span data-vessel-toggle-label>查看全部 ${vessels.length} 艘</span><i data-lucide="chevron-down"></i>
            </button>
          </div>` : ''}
        </article>
      `;
    }

    function toggleTaskVesselRows(button) {
      const taskNode = button.closest('.logistics-task-node');
      if (!taskNode) return;
      const expanded = button.getAttribute('aria-expanded') === 'true';
      taskNode.querySelectorAll('[data-extra-vessel="true"]').forEach(row => {
        row.classList.toggle('is-vessel-hidden', expanded);
      });
      button.setAttribute('aria-expanded', String(!expanded));
      const label = button.querySelector('[data-vessel-toggle-label]');
      if (label) label.textContent = expanded ? `查看全部 ${button.dataset.vesselTotal} 艘` : '收起船舶';
    }
    function renderServiceRequirementCard(requirement) {
      const statusClass = getLogisticsDemandStatusClass(requirement.dispatchStatus);
      const goodsHtml = (requirement.goodsLines || []).map(line =>
        `<span>${escapeHtml(line.name)} ${escapeHtml(formatQty(line.qty, line.unit))}</span>`
      ).join('');
      return `
        <article class="logistics-service-card">
          <div class="logistics-service-card-top">
            <div class="logistics-service-card-title">
              <div class="logistics-service-no">${escapeHtml(requirement.demandNo)}</div>
              <div class="logistics-service-card-subtitle">${escapeHtml(requirement.dispatchNo)} · ${escapeHtml(requirement.serviceItem)}</div>
            </div>
            <span class="logistics-service-status ${statusClass}">${escapeHtml(requirement.dispatchStatus)}</span>
          </div>
          <div class="logistics-service-grid">
            <div class="logistics-service-field"><span>作业组织</span><strong title="${escapeHtml(requirement.operationOrg)}">${escapeHtml(requirement.operationOrg)}</strong></div>
            <div class="logistics-service-field"><span>作业组织人员</span><strong>${escapeHtml(requirement.operationOrgPerson)}</strong></div>
            <div class="logistics-service-field"><span>扩展场景</span><strong>${escapeHtml(requirement.extensionScene)}</strong></div>
            <div class="logistics-service-field"><span>物流供应商</span><strong title="${escapeHtml(requirement.supplier)}">${escapeHtml(requirement.supplier)}</strong></div>
            <div class="logistics-service-field wide"><span>商品信息 / 服务要求汇总数量</span><div class="logistics-service-goods">${goodsHtml || '<span>-</span>'}</div></div>
            <div class="logistics-service-field"><span>分派时间</span><strong>${escapeHtml(requirement.dispatchTime)}</strong></div>
            <div class="logistics-service-field"><span>关联物流委托</span><strong>${(requirement.commissions || []).length} 张</strong></div>
          </div>
        </article>
      `;
    }

    function renderCompactServiceRequirement(requirement) {
      const statusClass = getLogisticsDemandStatusClass(requirement.dispatchStatus);
      const goodsHtml = (requirement.goodsLines || []).map(line =>
        `<span>${escapeHtml(line.name)} ${escapeHtml(formatQty(line.qty, line.unit))}</span>`
      ).join('');
      return `
        <article class="logistics-service-compact">
          <div class="logistics-service-compact-head">
            <div class="logistics-service-compact-primary">
              <span class="logistics-service-no">${escapeHtml(requirement.demandNo)}</span>
              <span class="logistics-service-compact-divider">/</span>
              <strong>${escapeHtml(requirement.dispatchNo)}</strong>
              <span class="logistics-service-compact-item">${escapeHtml(requirement.serviceItem)}</span>
              <span class="logistics-service-status ${statusClass}">${escapeHtml(requirement.dispatchStatus)}</span>
            </div>
            <span class="logistics-service-compact-count">关联物流委托 ${(requirement.commissions || []).length} 张</span>
          </div>
          <div class="logistics-service-compact-fields">
            <div><span>作业组织</span><strong title="${escapeHtml(requirement.operationOrg)}">${escapeHtml(requirement.operationOrg)}</strong></div>
            <div><span>作业组织人员</span><strong>${escapeHtml(requirement.operationOrgPerson)}</strong></div>
            <div><span>扩展场景</span><strong>${escapeHtml(requirement.extensionScene)}</strong></div>
            <div><span>物流供应商</span><strong title="${escapeHtml(requirement.supplier)}">${escapeHtml(requirement.supplier)}</strong></div>
            <div class="logistics-service-compact-goods"><span>商品 / 汇总数量</span><div class="logistics-service-goods">${goodsHtml || '<span>-</span>'}</div></div>
            <div><span>分派时间</span><strong>${escapeHtml(requirement.dispatchTime)}</strong></div>
          </div>
        </article>
      `;
    }

    function renderLogisticsCommissionGroup(group) {
      const commission = group.commission;
      const requirement = group.requirement;
      const statusClass = getLogisticsDemandStatusClass(commission.status);
      return `
        <tr class="logistics-commission-group-row">
          <td colspan="8">
            <div class="logistics-commission-group">
              <div class="logistics-commission-group-main">
                <strong>${escapeHtml(commission.commissionName || "-")}</strong>
                <span class="logistics-commission-status ${statusClass}">${escapeHtml(commission.status)}</span>
              </div>
              <div class="logistics-commission-group-meta">
                <span>服务要求 ${escapeHtml(requirement.dispatchNo)}</span>
                <span>物流供应商 ${escapeHtml(commission.supplier)}</span>
                <span>物流委托合同号 ${escapeHtml(commission.commissionContractNo || commission.commissionNo || "-")}</span>
                <span>版本号 ${escapeHtml(commission.versionNo || "V1.0")}</span>
                <span>${group.tasks.length} 条运输任务</span>
              </div>
            </div>
          </td>
        </tr>
        ${group.tasks.map(renderLogisticsTaskRow).join('')}
      `;
    }

    function renderLogisticsTaskRow(task) {
      const commission = task.commission;
      const bookingClass = task.bookingStatus === '已订舱' ? '' : 'pending';
      const declarationClass = task.declarationStatus === '已宣舱' ? 'logistics-booking-status' : 'logistics-booking-status pending';
      const taskKey = escapeHtml(task.__key);
      return `
        <tr class="logistics-task-row">
          <td class="task-commission-cell">
            <div class="task-key-cell">${escapeHtml(task.taskNo)}</div>
            <div class="task-name">${escapeHtml(task.taskName)}</div>
          </td>
          <td><span class="logistics-booking-status ${bookingClass}">${escapeHtml(task.bookingStatus)}</span></td>
          <td class="task-quantity-cell">
            <div><span>订舱</span><strong>${escapeHtml(formatQty(task.bookingQty, task.qtyUnit || '吨'))}</strong></div>
            <div><span>未订</span><strong>${escapeHtml(formatQty(task.unbookedQty, task.qtyUnit || '吨'))}</strong></div>
            <div><span>装船</span><strong>${escapeHtml(formatQty(task.shippedQty, task.qtyUnit || '吨'))}</strong></div>
          </td>
          <td><span class="${declarationClass}">${escapeHtml(task.declarationStatus)}</span></td>
          <td class="task-commission-cell">
            <strong>${escapeHtml(task.vesselName)}</strong>
            <div class="task-subtle">${escapeHtml(task.routeName)}</div>
          </td>
          <td class="task-commission-cell">
            <div><span class="task-schedule-label">ETD</span> ${escapeHtml(task.etd)}</div>
            <div><span class="task-schedule-label">ETA</span> ${escapeHtml(task.eta)}</div>
            <div class="task-subtle">Laycan ${escapeHtml(task.laycan)}</div>
          </td>
          <td class="logistics-track-cell">
            <div class="logistics-track-latest">${escapeHtml(task.latestTracking)}</div>
            <div class="logistics-track-time">${escapeHtml(task.latestTrackingTime)} · 动态 ${escapeHtml(task.dynamicUpdatedAt)}</div>
          </td>
          <td class="logistics-task-actions-cell">

            <button type="button" class="logistics-task-action" data-task-key="${taskKey}" onclick="openLogisticsTrackingPage(this.dataset.taskKey)"><i data-lucide="history"></i>跟踪</button>
          </td>
        </tr>
      `;
    }

    function openLogisticsTrackingPage(taskKey, vesselIndex = 0) {
      const task = activeLogisticsContext.taskMap.get(taskKey);
      if (!task) return;
      const vessels = getTaskVesselRows(task);
      const vessel = vessels[vesselIndex] || vessels[0] || {};
      const payload = {
        taskNo: task.taskNo || '',
        taskName: task.taskName || '',
        bookingStatus: task.bookingStatus || '',
        declarationStatus: task.declarationStatus || '',
        bookingQty: task.bookingQty || 0,
        unbookedQty: task.unbookedQty || 0,
        shippedQty: task.shippedQty || 0,
        vesselName: vessel.name || task.vesselName || '',
        routeName: vessel.routeName || task.routeName || '',
        etd: vessel.etd || task.etd || '',
        laycan: vessel.laycan || task.laycan || '',
        latestTracking: vessel.latestTracking || task.latestTracking || '',
        latestTrackingTime: vessel.currentOperationTime || task.latestTrackingTime || '',
        dynamicUpdatedAt: vessel.currentOperationTime || task.dynamicUpdatedAt || '',
        supplier: task.commission?.supplier || '',
        trackings: task.trackings || []
      };
      const url = new URL('logistics-demand-tracking.html', window.location.href);
      url.searchParams.set('data', JSON.stringify(payload));
      window.open(url.href, '_blank', 'noopener');
    }
    function openTrackingTimeline(taskKey) {
      const task = activeLogisticsContext.taskMap.get(taskKey);
      if (!task) return;
      document.getElementById('trackingModalSubtitle').textContent = `${task.taskNo} · ${task.taskName}`;
      const timeline = document.getElementById('trackingTimeline');
      const entries = task.trackings?.length ? task.trackings : [{
        time: task.latestTrackingTime || '待安排',
        title: '暂无跟踪记录',
        content: task.latestTracking || '尚未产生运输动态'
      }];
      timeline.innerHTML = `<div class="tracking-timeline">${entries.map(entry => `
        <div class="tracking-entry">
          <strong>${escapeHtml(entry.title)}</strong>
          <span>${escapeHtml(entry.time)}</span>
          <p>${escapeHtml(entry.content)}</p>
        </div>
      `).join('')}</div>`;
      openModal('trackingModal');
      if (window.lucide) lucide.createIcons();
    }

    function openTransportTaskDetail(taskKey) {
      const task = activeLogisticsContext.taskMap.get(taskKey);
      if (!task) return;
      const vesselNames = getTaskVesselRows(task).map(vessel => vessel.name).filter(Boolean).join('、');
      document.getElementById('taskDetailModalSubtitle').textContent = `${task.taskNo} · ${task.taskName}`;
      const fields = [
        ['订舱协议号', task.bookingAgreementNo],
        ['运费', formatQty(task.freight)],
        ['船只 IMO', task.imo],
        ['装港代理', task.loadingPortAgent],
        ['离装港时间', task.departLoadPortTime],
        ['动态跟踪', task.latestTracking],
        ['受托方核算组', task.principalAccountingGroup],
        ['订舱数量', formatQty(task.bookingQty, task.qtyUnit || '吨')],
        ['宣舱情况', task.declarationStatus],
        ['是否 CQD', task.isCqd],
        ['附加条款', task.additionalTerms],
        ['净运费', formatQty(task.netFreight)],
        ['ATA', task.ata],
        ['船舶动态更新时间', task.dynamicUpdatedAt],
        ['修改后最迟装运期', task.revisedDeadline],
        ['订舱货代', task.bookingForwarder],
        ['运费条款', task.freightTerms],
        ['港区', task.portArea],
        ['卸港代理', task.dischargePortAgent],
        ['是否离港', task.isDeparted],
        ['线路', task.routeName],
        ['订舱经理', task.bookingManager],
        ['未订舱数量', formatQty(task.unbookedQty, task.qtyUnit || '吨')],
        ['备注', task.remark],
        ['装率', task.loadRate],
        ['运费账期', task.freightPaymentTerm],
        ['其他费用', formatQty(task.otherFees)],
        ['ETB', task.etb],
        ['等泊时间（天）', task.waitingDays],
        ['询价方式', task.inquiryMethod],
        ['分类', task.category],
        ['订舱状态', task.bookingStatus],
        ['地面货代', task.groundForwarder],
        ['到装港时间', task.loadPortTime],
        ['靠泊时间', task.berthTime],
        ['订舱操作员', task.bookingOperator],
        ['出仓数量', formatQty(task.outboundQty, task.qtyUnit || '吨')],
        ['运费总价', formatQty(task.totalFreight)],
        ['层高', task.height],
        ['卸率', task.dischargeRate],
        ['佣金比例', task.commissionRate],
        ['MMSI', task.mmsi],
        ['ATB', task.atb],
        ['预计超期/超期时间（天）', task.overdueDays],
        ['Laycan', task.laycan],
        ['船名', vesselNames || task.vesselName],
        ['宣舱信息', task.declarationInfo || task.declarationStatus],
        ['订单跟踪记录', `${(task.trackings || []).length} 条`],
        ['运费发票', task.freightInvoice],
        ['受托方经营单位', task.principalOperatingUnit],
        ['装船数量', formatQty(task.shippedQty, task.qtyUnit || '吨')],
        ['状态', task.documentStatus || task.bookingStatus],
        ['延滞费', formatQty(task.demurrageFee)],
        ['是否含绑', task.isLashingIncluded],
        ['佣金金额', formatQty(task.commissionAmount)],
        ['ETA', task.eta],
        ['ETD', task.etd],
        ['修改后 LAYCAN', task.revisedLaycan],
        ['所属物流委托', task.commission.commissionName],
        ['物流供应商', task.commission.supplier]      ];
      document.getElementById('taskDetailContent').innerHTML = `
        <div class="task-detail-grid">
          ${fields.map(([label, value]) => `<div class="task-detail-field ${label === '最新订单跟踪' ? 'wide' : ''}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || '待安排')}</strong></div>`).join('')}
        </div>
      `;
      openModal('taskDetailModal');
      if (window.lucide) lucide.createIcons();
    }

    function handleTrackingBackdrop(event) {
      if (event.target.id === 'trackingModal') closeModal('trackingModal');
    }

    function handleTaskDetailBackdrop(event) {
      if (event.target.id === 'taskDetailModal') closeModal('taskDetailModal');
    }

    function getLogisticsDemandStatusClass(status) {
      if (['已完成', '已接单'].includes(status)) return 'done';
      if (['处理中', '待处理'].includes(status)) return 'processing';
      return '';
    }

    function formatLogisticsMetric(value, unit) {
      if (value === undefined || value === null || value === '') return '-';
      const numericValue = Number(value);
      const displayValue = Number.isFinite(numericValue) ? numericValue.toLocaleString() : escapeHtml(value);
      return `${displayValue} ${unit}`;
    }

    function openLogisticsServiceDetail(serviceKey) {
      const requirement = activeLogisticsContext.serviceRequirementMap?.get(serviceKey);
      if (!requirement) {
        showToast("未找到服务要求信息", "warning");
        return;
      }
      const goodsText = (requirement.goodsLines || [])
        .map(line => line.name + " " + formatQty(line.qty, line.unit))
        .join("；") || "-";
      document.getElementById("serviceRequirementDetailSubtitle").textContent = requirement.dispatchNo + " · " + (requirement.serviceItem || "-");
      const fields = [
        ["服务要求编号", requirement.dispatchNo || "-"],
        ["服务要求状态", requirement.dispatchStatus || "-"],
        ["服务项目", requirement.serviceItem || "-"],
        ["扩展场景", requirement.extensionScene || "-"],
        ["物流供应商", requirement.supplier || "-"],
        ["作业组织", requirement.operationOrg || "-"],
        ["作业组织人员", requirement.operationOrgPerson || "-"],
        ["最迟装运日期", requirement.latestShipmentDate || "-"],
        ["分派时间", requirement.dispatchTime || "-"],
        ["商品信息", goodsText],
        ["关联物流委托", String((requirement.commissions || []).length) + " 张"]
      ];
      document.getElementById("serviceRequirementDetailContent").innerHTML = "<div class=\"task-detail-grid\">" + fields.map(([label, value]) => "<div class=\"task-detail-field\"><span>" + escapeHtml(label) + "</span><strong>" + escapeHtml(value || "待安排") + "</strong></div>").join("") + "</div>";
      openModal("serviceRequirementDetailModal");
      if (window.lucide) lucide.createIcons();
    }

    function closeServiceRequirementDetail() {
      closeModal("serviceRequirementDetailModal");
    }

    function handleServiceRequirementDetailBackdrop(event) {
      if (event.target.id === "serviceRequirementDetailModal") closeServiceRequirementDetail();
    }

    function openLogisticsCommissionDetail(commissionKey) {
      const commission = activeLogisticsContext.commissionMap?.get(commissionKey);
      if (!commission) {
        showToast("未找到物流委托信息", "warning");
        return;
      }
      const requirement = commission.requirement || {};
      const serviceNo = requirement.dispatchNo || "-";
      const contractNo = commission.commissionContractNo || commission.commissionNo || "-";
      const versionNo = commission.versionNo || "V1.0";
      activeCommissionContext = { commission, requirement };
      document.getElementById("commissionDetailSubtitle").textContent = contractNo + " · " + versionNo;
      document.getElementById("commissionDetailServiceNo").textContent = serviceNo;
      document.getElementById("commissionDetailServiceNo").title = serviceNo;
      const fields = [
        ["服务要求编号", serviceNo],
        ["物流委托名称", commission.commissionName || "-"],
        ["物流委托合同号", contractNo],
        ["版本号", versionNo],
        ["物流委托状态", commission.status || "-"],
        ["物流供应商", commission.supplier || "-"],
        ["运输任务数量", String((commission.tasks || []).length) + " 个"]
      ];
      document.getElementById("commissionDetailContent").innerHTML = "<div class=\"task-detail-grid\">" + fields.map(([label, value]) => "<div class=\"task-detail-field\"><span>" + escapeHtml(label) + "</span><strong>" + escapeHtml(value || "待安排") + "</strong></div>").join("") + "</div>";
      openModal("commissionDetailModal");
      if (window.lucide) lucide.createIcons();
    }

    function closeCommissionDetail() {
      closeModal("commissionDetailModal");
    }

    function handleCommissionDetailBackdrop(event) {
      if (event.target.id === "commissionDetailModal") closeCommissionDetail();
    }

    function jumpToCommissionService() {
      jumpFromCommissionDetail();
    }

    function jumpFromCommissionDetail() {
      const context = activeCommissionContext;
      if (!context) return;
      const serviceNo = context.requirement.dispatchNo || "";
      closeCommissionDetail();
      const targetElement = [...document.querySelectorAll("#logisticsDemandList [data-service-requirement-no]")]
        .find(node => node.dataset.serviceRequirementNo === serviceNo);
      if (!targetElement) {
        showToast("未找到对应服务要求", "warning");
        return;
      }
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        targetElement.classList.remove("logistics-navigation-target");
        void targetElement.offsetWidth;
        targetElement.classList.add("logistics-navigation-target");
        setTimeout(() => targetElement.classList.remove("logistics-navigation-target"), 1800);
      }, 80);
    }

    function openLogisticsDemandDetail(demandNo) {
      showToast("正在跳转服务要求详情页 [" + demandNo + "]...", "info");
    }

    function handleLogisticsDrawerBackdrop(event) {
      if (event.target.id === "logisticsModal") closeModal("logisticsModal");
    }

    function findRiskItemById(itemId) {
      return state.items.find(item => item.id === itemId)
        || state.controlTowerPool.find(item => item.id === itemId)
        || null;
    }

    function renderRiskPopoverContent(item) {
      const risks = getRiskItems(item);
      if (!risks.length) return '';
      return `
        <div class="ct-risk-popover-head">
          <strong>风险提醒</strong>
          <span class="ct-risk-popover-count">${risks.length} 项</span>
        </div>
        <div class="ct-risk-popover-list">
          ${risks.map((risk, index) => `
            <div class="ct-risk-popover-item">
              <div class="ct-risk-popover-item-title"><span>${index + 1}</span>${escapeHtml(risk.title)}</div>
              <div class="ct-risk-popover-item-desc">${escapeHtml(risk.description || risk.trigger || '当前合同存在风险，请及时关注。')}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    function positionRiskPopover(trigger) {
      const popover = document.getElementById('riskPopover');
      if (!popover || popover.hidden || !trigger) return;
      const rect = trigger.getBoundingClientRect();
      const popRect = popover.getBoundingClientRect();
      const edge = 8;
      const left = Math.min(Math.max(edge, rect.left), window.innerWidth - popRect.width - edge);
      let top = rect.bottom + 8;
      if (top + popRect.height > window.innerHeight - edge) {
        top = Math.max(edge, rect.top - popRect.height - 8);
      }
      popover.style.left = `${left}px`;
      popover.style.top = `${top}px`;
    }

    function showRiskPopover(trigger, pinned = false) {
      const item = findRiskItemById(trigger?.dataset.riskItemId);
      const popover = document.getElementById('riskPopover');
      if (!item || !popover) return;
      clearTimeout(riskPopoverShowTimer);
      clearTimeout(riskPopoverHideTimer);
      if (riskPopoverTrigger && riskPopoverTrigger !== trigger) {
        riskPopoverTrigger.setAttribute('aria-expanded', 'false');
      }
      riskPopoverTrigger = trigger;
      riskPopoverPinned = Boolean(pinned);
      popover.innerHTML = renderRiskPopoverContent(item);
      popover.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      positionRiskPopover(trigger);
      if (window.lucide) lucide.createIcons();
    }

    function scheduleRiskPopover(trigger) {
      clearTimeout(riskPopoverHideTimer);
      clearTimeout(riskPopoverShowTimer);
      riskPopoverShowTimer = setTimeout(() => showRiskPopover(trigger), 120);
    }

    function hideRiskPopover(force = false) {
      if (riskPopoverPinned && !force) return;
      clearTimeout(riskPopoverShowTimer);
      clearTimeout(riskPopoverHideTimer);
      const popover = document.getElementById('riskPopover');
      if (popover) popover.hidden = true;
      if (riskPopoverTrigger) riskPopoverTrigger.setAttribute('aria-expanded', 'false');
      riskPopoverTrigger = null;
      riskPopoverPinned = false;
    }

    function scheduleRiskPopoverClose() {
      if (riskPopoverPinned) return;
      clearTimeout(riskPopoverShowTimer);
      clearTimeout(riskPopoverHideTimer);
      riskPopoverHideTimer = setTimeout(() => hideRiskPopover(true), 120);
    }

    function toggleRiskPopover(trigger, event) {
      event.preventDefault();
      event.stopPropagation();
      const popover = document.getElementById('riskPopover');
      const sameOpen = popover && !popover.hidden && riskPopoverTrigger === trigger;
      if (sameOpen && riskPopoverPinned) {
        hideRiskPopover(true);
        return;
      }
      showRiskPopover(trigger, true);
    }

    function initRiskPopoverInteractions() {
      const popover = document.getElementById('riskPopover');
      if (!popover) return;
      popover.addEventListener('mouseenter', () => {
        clearTimeout(riskPopoverHideTimer);
        clearTimeout(riskPopoverShowTimer);
      });
      popover.addEventListener('mouseleave', scheduleRiskPopoverClose);
      document.addEventListener('click', event => {
        if (popover.hidden) return;
        if (popover.contains(event.target) || event.target.closest('[data-risk-item-id]')) return;
        hideRiskPopover(true);
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !popover.hidden) hideRiskPopover(true);
      });
      window.addEventListener('resize', () => positionRiskPopover(riskPopoverTrigger));
      const tableScroll = document.querySelector('.ct-table-scroll');
      if (tableScroll) tableScroll.addEventListener('scroll', () => positionRiskPopover(riskPopoverTrigger), true);
    }

    function openRiskDetail(itemId) {
      const item = state.items.find(candidate => candidate.id === itemId);
      if (!item) return;
      const risk = getRiskDefinition(item);
      if (!risk) {
        showToast('该合同当前没有风险详情。', 'info');
        return;
      }

      document.getElementById('riskDetailContractNo').textContent = getMainContractNo(item);
      document.getElementById('riskDetailDrawerSubtitle').textContent = `${getTradeContractType(item)} · ${getProjectDisplay(item)}`;
      const level = document.getElementById('riskDetailLevel');
      const icon = document.getElementById('riskDrawerIcon');
      level.textContent = '风险';
      level.className = 'risk-level-badge';
      icon.className = 'logistics-drawer-title-icon risk-title-icon';
      icon.innerHTML = '<i data-lucide="shield-alert"></i>';

      document.getElementById('riskDetailContent').innerHTML = `
        <article class="risk-detail-card">
          <div class="risk-detail-card-head">
            <div class="risk-detail-card-title"><i data-lucide="shield-alert"></i>${escapeHtml(risk.title)}</div>
            <span class="ct-risk danger">风险</span>
          </div>
          <div class="risk-detail-card-body">
            <div class="risk-detail-field"><span>触发原因</span><strong class="risk-trigger-value">${escapeHtml(risk.trigger)}</strong></div>
            <div class="risk-detail-field"><span>影响说明</span><strong>${escapeHtml(risk.impact)}</strong></div>
            <div class="risk-action-hint"><strong>建议处理：</strong>${escapeHtml(risk.suggestion)}</div>
          </div>
        </article>
      `;
      openModal('riskDetailModal');
      if (window.lucide) lucide.createIcons();
    }

    function handleRiskDetailBackdrop(event) {
      if (event.target.id === 'riskDetailModal') closeModal('riskDetailModal');
    }

      document.addEventListener('keydown', event => {
      const drawer = document.getElementById('logisticsModal');
      if (event.key === 'Escape' && drawer && !drawer.classList.contains('hidden')) closeModal('logisticsModal');
      const trackingModal = document.getElementById('trackingModal');
      if (event.key === 'Escape' && trackingModal && !trackingModal.classList.contains('hidden')) closeModal('trackingModal');
      const taskDetailModal = document.getElementById('taskDetailModal');
      if (event.key === 'Escape' && taskDetailModal && !taskDetailModal.classList.contains('hidden')) closeModal('taskDetailModal');
      const commissionDetailModal = document.getElementById("commissionDetailModal");
      if (event.key === "Escape" && commissionDetailModal && !commissionDetailModal.classList.contains("hidden")) closeCommissionDetail();
      const serviceRequirementDetailModal = document.getElementById("serviceRequirementDetailModal");
      if (event.key === "Escape" && serviceRequirementDetailModal && !serviceRequirementDetailModal.classList.contains("hidden")) closeServiceRequirementDetail();
      const riskDrawer = document.getElementById('riskDetailModal');
      if (event.key === 'Escape' && riskDrawer && !riskDrawer.classList.contains('hidden')) closeModal('riskDetailModal');
      const generateDemandModal = document.getElementById('generateDemandModal');
      if (event.key === 'Escape' && generateDemandModal && !generateDemandModal.classList.contains('hidden')) closeModal('generateDemandModal');
      if (event.key === 'Escape') closeCandidateComboPopover();
    });

    document.addEventListener('click', event => {
      const picker = document.querySelector('.candidate-combo-picker');
      const modal = document.getElementById('addTargetModal');
      if (!picker || !modal || modal.classList.contains('hidden')) return;
      if (!picker.contains(event.target)) closeCandidateComboPopover();
    });

    // --- Modal 1: Manual Pull In ---
    function openManualModal() {
      state.manualExpandedIds.clear();
      state.manualSelectedIds.clear();
      resetManualFilters(false);
      renderManualFilterOptions();
      renderManualTable();
      openModal('manualModal');
    }

    function getManualPoolProjects(ct) {
      const projects = ct.projectNos || (ct.goodsLines || [])
        .map(goods => goods.projectNo || ct.projectNo)
        .filter(Boolean);
      return [...new Set(projects.length ? projects : [ct.projectNo].filter(Boolean))];
    }

    function getManualPoolRows(ct) {
      const lines = Array.isArray(ct.goodsLines) && ct.goodsLines.length
        ? ct.goodsLines
        : [{ projectNo: ct.projectNo, name: ct.goodsName || '-', contractQty: ct.contractQty || 0, unit: '吨' }];
      return lines.map((goods, goodsIndex) => ({
        key: `${ct.id}::${goodsIndex}`,
        ct,
        goods,
        goodsIndex
      }));
    }

    function populateManualDatalist(id, values) {
      const datalist = document.getElementById(id);
      if (!datalist) return;
      datalist.innerHTML = [...new Set(values.filter(Boolean))]
        .sort((a, b) => String(a).localeCompare(String(b), 'zh-Hans-CN'))
        .map(value => `<option value="${escapeHtml(value)}"></option>`)
        .join('');
    }

    function renderManualFilterOptions() {
      const pool = state.controlTowerPool || [];
      populateManualDatalist('manualProjectNoOptions', pool.flatMap(getManualPoolProjects));
      populateManualDatalist('manualTradeNoOptions', pool.map(ct => (ct.type === 'dest' ? ct.purchaseNo : ct.salesNo)));
      populateManualDatalist('manualCompanyOptions', pool.map(ct => ct.companyTitle));
      populateManualDatalist('manualSalesmanOptions', pool.map(ct => ct.salesman));
    }

    function renderManualTable() {
      const tbody = document.getElementById('manualListTable');
      tbody.innerHTML = '';

      const projectNoFilter = (document.getElementById('manualProjectNoFilter')?.value || '').trim().toLowerCase();
      const tradeNoFilter = (document.getElementById('manualTradeNoFilter')?.value || '').trim().toLowerCase();
      const controlledOrderFilter = (document.getElementById('manualControlledOrderFilter')?.value || '').trim();
      const companyFilter = (document.getElementById('manualCompanyFilter')?.value || '').trim().toLowerCase();
      const salesmanFilter = (document.getElementById('manualSalesmanFilter')?.value || '').trim().toLowerCase();
      const internalCustomerFilter = document.getElementById('manualInternalCustomerFilter')?.value || '是';
      const filteredPool = state.controlTowerPool.filter(ct => {
        const projectText = getManualPoolProjects(ct).join(',');
        if (projectNoFilter && !projectText.toLowerCase().includes(projectNoFilter)) return false;
        if (tradeNoFilter) {
          // 贸易合同号：销售待办取销售合同号，采购待办取采购合同号
          const tradeNo = String(ct.type === 'dest' ? (ct.purchaseNo || '') : (ct.salesNo || '')).toLowerCase();
          if (!tradeNo.includes(tradeNoFilter)) return false;
        }
        if (controlledOrderFilter && String(ct.controlledOrder || '') !== controlledOrderFilter) return false;
        if (companyFilter && !String(ct.companyTitle || '').toLowerCase().includes(companyFilter)) return false;
        if (salesmanFilter && !String(ct.salesman || '').toLowerCase().includes(salesmanFilter)) return false;
        if (internalCustomerFilter && String(ct.isInternalCustomer || '是') !== internalCustomerFilter) return false;
        return true;
      });

      if (filteredPool.length === 0) {
        tbody.innerHTML = '<tr><td colspan="27" class="p-6 text-center text-slate-400">没有匹配的控制塔商品明细</td></tr>';
        updateManualSelectedCount();
        return;
      }

      filteredPool.forEach(ct => {
        const typeLabel = ct.type === 'dest' ? '采购合同' : '销售合同';
        getManualPoolRows(ct).forEach(row => {
          const { goods } = row;
          const isChecked = state.manualSelectedIds.has(row.key);
          const projectNo = goods.projectNo || ct.projectNo || '-';
          const goodsName = goods.name || '-';
          const goodsQty = Number(goods.contractQty || 0);
          const unit = goods.unit || '';
          const tr = document.createElement('tr');
          tr.className = 'hover:bg-slate-50';
          tr.innerHTML = `
            <td class="manual-control"><input type="checkbox" value="${row.key}" class="manual-cb rounded text-brand-500" aria-label="选择商品 ${escapeHtml(goodsName)}" ${isChecked ? 'checked' : ''} onchange="toggleManualSelect('${row.key}', this.checked)"></td>
            <td class="font-mono font-bold text-brand-600">${escapeHtml(ct.salesNo)}</td>
            <td>${escapeHtml(typeLabel)}</td>
            <td class="font-mono text-brand-600" title="${escapeHtml(projectNo)}">${escapeHtml(projectNo)}</td>
            <td class="manual-long-cell" title="${escapeHtml(goodsName)}">${escapeHtml(goodsName)}</td>
            <td class="manual-number">${formatQty(goodsQty, unit)}</td>
            <td>${escapeHtml(ct.operatingUnit)}</td>
            <td class="manual-long-cell" title="${escapeHtml(ct.companyTitle)}">${escapeHtml(ct.companyTitle)}</td>
            <td>${escapeHtml(ct.department)}</td>
            <td>${escapeHtml(ct.accountingGroup)}</td>
            <td>${escapeHtml(ct.salesman)}</td>
            <td>${escapeHtml(ct.loadingPort || '厦门港')}</td>
            <td>${escapeHtml(ct.unloadingPort || '大连港')}</td>
            <td>${escapeHtml(ct.shipmentDeadline)}</td>
            <td class="manual-long-cell" title="${escapeHtml(ct.customer)}">${escapeHtml(ct.customer)}</td>
            <td>${escapeHtml(ct.isInternalCustomer || '是')}</td>
            <td class="manual-long-cell" title="${escapeHtml(ct.supplier)}">${escapeHtml(ct.supplier)}</td>
            <td>${escapeHtml(ct.internalDeliveryDate || '-')}</td>
            <td>${escapeHtml(ct.settlementMethod)}</td>
            <td>${escapeHtml(ct.controlledOrder)}</td>
            <td>${escapeHtml(ct.prepaymentRatio || '-')}</td>
            <td class="manual-number">${escapeHtml(ct.freightUnitPrice || '-')}</td>
            <td>${escapeHtml(getPriceTerms(ct))}</td>
            <td>${escapeHtml(getControlledMode(ct))}</td>
            <td>${escapeHtml(ct.dispatchedByUs || '-')}</td>
            <td class="manual-number">${escapeHtml(ct.portMiscUnitPrice || '-')}</td>
            <td>${escapeHtml(ct.tradeType)}</td>
          `;
          tbody.appendChild(tr);
        });
      });
      updateManualSelectedCount();
      if (window.lucide) lucide.createIcons();
    }

    function toggleManualSelectAll(masterCb) {
      document.querySelectorAll('.manual-cb').forEach(cb => {
        cb.checked = masterCb.checked;
        if (masterCb.checked) state.manualSelectedIds.add(cb.value);
        else state.manualSelectedIds.delete(cb.value);
      });
      updateManualSelectedCount();
    }

    function toggleManualSelect(contractId, checked) {
      if (checked) state.manualSelectedIds.add(contractId);
      else state.manualSelectedIds.delete(contractId);
      updateManualSelectedCount();
    }

    function updateManualSelectedCount() {
      document.getElementById('manualSelectedCount').textContent = state.manualSelectedIds.size;
      const visibleCheckboxes = Array.from(document.querySelectorAll('.manual-cb'));
      const masterCheckbox = document.getElementById('manualSelectAll');
      if (masterCheckbox) masterCheckbox.checked = visibleCheckboxes.length > 0 && visibleCheckboxes.every(cb => cb.checked);
    }

    function filterManualList() {
      renderManualFilterOptions();
      renderManualTable();
      showToast('已筛选满足订舱条件的控制塔合同', 'info');
    }

    function resetManualFilters(showMessage = true) {
      [
        'manualProjectNoFilter',
        'manualTradeNoFilter',
        'manualCompanyFilter',
        'manualSalesmanFilter'
      ].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
      });
      const controlledOrder = document.getElementById('manualControlledOrderFilter');
      if (controlledOrder) controlledOrder.value = '';
      const internalCustomer = document.getElementById('manualInternalCustomerFilter');
      if (internalCustomer) internalCustomer.value = '是';
      if (showMessage && document.getElementById('manualModal') && !document.getElementById('manualModal').classList.contains('hidden')) {
        renderManualTable();
        showToast('已重置手动拉入查询条件', 'info');
      }
    }

    function confirmManualPullIn() {
      if (window.PrototypeAccess && !window.PrototypeAccess.can('trade.pull')) {
        window.PrototypeAccess.deny('手动拉入');
        return;
      }
      const injectedFailure = window.PrototypeRuntime && window.PrototypeRuntime.consumeFailure('tradePull');
      if (injectedFailure === 'timeout') {
        showToast('手动拉入请求超时，合同仍在当前列表，请重试。', 'danger');
        return;
      }
      if (!navigator.onLine) {
        showToast('网络连接已断开，合同尚未拉入，请恢复网络后重试。', 'danger');
        return;
      }
      const selectedKeys = Array.from(state.manualSelectedIds);
      if (selectedKeys.length === 0) {
        showToast('请选择需要拉入的控制塔商品明细', 'warning');
        return;
      }

      const grouped = new Map();
      selectedKeys.forEach(key => {
        const sep = key.lastIndexOf('::');
        const ctId = sep >= 0 ? key.slice(0, sep) : key;
        const goodsIndex = sep >= 0 ? Number(key.slice(sep + 2)) : 0;
        if (!grouped.has(ctId)) grouped.set(ctId, new Set());
        grouped.get(ctId).add(goodsIndex);
      });

      grouped.forEach((indexes, ctId) => {
        const ctItem = state.controlTowerPool.find(c => c.id === ctId);
        if (!ctItem) return;
        const allLines = ctItem.goodsLines || [];
        const pickedLines = allLines.filter((goods, index) => indexes.has(index));
        if (pickedLines.length === 0) return;

        const goodsLines = pickedLines.map(goods => ({
          code: goods.code,
          projectNo: goods.projectNo || ctItem.projectNo,
          name: goods.name,
          contractQty: Number(goods.contractQty || 0),
          allocatable: Number(goods.contractQty || 0),
          allocated: 0,
          proposed: Number(goods.contractQty || 0),
          unit: goods.unit || '吨'
        }));
        const contractQty = goodsLines.reduce((total, goods) => total + Number(goods.contractQty || 0), 0);
        const newItem = {
          id: 'WB-' + Math.floor(1000 + Math.random()*9000),
          projectNo: goodsLines[0]?.projectNo || ctItem.projectNo,
          projectNos: [...new Set(goodsLines.map(goods => goods.projectNo).filter(Boolean))],
          type: ctItem.type || state.currentTab,
          salesNo: ctItem.salesNo,
          salesDate: new Date().toISOString().slice(0,10),
          purchaseNo: ctItem.purchaseNo,
          customer: ctItem.customer,
          supplier: ctItem.supplier,
          salesman: ctItem.salesman,
          status: ctItem.status || '待安排',
          riskFlag: '正常',
          pullType: 'MANUAL',
          contractQty,
          allocatableQty: contractQty,
          allocatedQty: 0,
          proposedQty: contractQty,
          expanded: false,
          goodsLines,
          logisticsDemands: []
        };
        initializeItemDefaults(newItem);
        newItem.operatingUnit = ctItem.operatingUnit;
        newItem.companyTitle = ctItem.companyTitle;
        newItem.department = ctItem.department;
        newItem.accountingGroup = ctItem.accountingGroup;
        newItem.shipmentDeadline = ctItem.shipmentDeadline;
        newItem.internalDeliveryDate = ctItem.internalDeliveryDate || '-';
        newItem.settlementMethod = ctItem.settlementMethod;
        newItem.receiptStatus = ctItem.receiptStatus;
        newItem.controlledOrder = ctItem.controlledOrder;
        newItem.prepaymentRatio = ctItem.prepaymentRatio;
        newItem.freightUnitPrice = ctItem.freightUnitPrice;
        newItem.purchaseTerms = ctItem.purchaseTerms || '-';
        newItem.salesTerms = ctItem.salesTerms;
        newItem.dispatchedByUs = ctItem.dispatchedByUs;
        newItem.portMiscUnitPrice = ctItem.portMiscUnitPrice;
        newItem.tradeType = ctItem.tradeType;
        newItem.effectiveDate = new Date().toISOString().slice(0, 10);
        state.items.unshift(newItem);

        // 未全选时仅从控制塔池中移除已拉入的商品明细行
        if (indexes.size >= allLines.length) {
          state.controlTowerPool = state.controlTowerPool.filter(c => c.id !== ctId);
        } else {
          ctItem.goodsLines = allLines.filter((goods, index) => !indexes.has(index));
          ctItem.projectNos = [...new Set(ctItem.goodsLines.map(goods => goods.projectNo || ctItem.projectNo).filter(Boolean))];
        }
      });

      state.manualSelectedIds.clear();
      showToast(`成功手动拉入 ${selectedKeys.length} 条商品明细至待办工作台`, 'success');
      closeModal('manualModal');
      renderWorkbenchTable();
    }

    // --- Modal Helpers ---
    function openModal(modalId) {
      document.getElementById(modalId).classList.remove('hidden');
    }

    function closeModal(modalId) {
      document.getElementById(modalId).classList.add('hidden');
    }

    function showToast(message, type = 'info') {
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div');

      let icon = 'info';
      let bgColor = 'bg-slate-800 text-white';
      if (type === 'success') { icon = 'check-circle-2'; bgColor = 'bg-emerald-600 text-white shadow-lg'; }
      if (type === 'warning') { icon = 'alert-triangle'; bgColor = 'bg-amber-500 text-white shadow-lg'; }
      if (type === 'danger') { icon = 'x-circle'; bgColor = 'bg-red-600 text-white shadow-lg'; }

      toast.className = `pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium shadow-md transition transform translate-y-2 ${bgColor}`;
      toast.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4 shrink-0"></i> <span>${message}</span>`;

      container.appendChild(toast);
      if (window.lucide) lucide.createIcons();

      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-0');
        setTimeout(() => toast.remove(), 300);
      }, 3200);
    }

    // Initialize Page
    window.onload = function() {
      if (window.lucide) lucide.createIcons();
      document.body.classList.toggle('dest-tab', state.currentTab === 'dest');
      initRiskPopoverInteractions();
      renderWorkbenchTable();
    };
  