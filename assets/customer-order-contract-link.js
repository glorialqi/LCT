/* 合同信息字段组合联动：独立于订单数据水合，新建页与详情页均生效。
   规则：
   1. 系统自动生成 + 无需签署   → 基础信息（无签约日期、无附件）
   2. 系统自动生成 + 线下签约   → 基础信息 + 签约日期
   3. 系统自动生成 + E建签签约  → 基础信息 + 我司签约公司/印章/授权人/盖章关键字
   4. 手动上传   + 无需签署     → 基础信息 + 合同正本附件上传
   5. 手动上传   + 线下签约     → 基础信息 + 正本回收 + 合同正本附件上传
   6. 手动上传   + E建签签约    → 基础信息 + 合同正本附件上传 + 我司签约公司/印章/授权人/盖章关键字
   是否创建合同=否 → 只保留「是否创建合同」字段 */
(function () {
  'use strict';

  const section = document.getElementById('contractSection');
  if (!section) return;

  const SIGN_METHOD_LABEL = { elb: 'E建签签约', offline: '线下签约', no_sign: '无需签署' };
  const setting = (key) => section.querySelector('[data-contract-setting="' + key + '"]');
  const settingValue = (key, fallback) => {
    const node = setting(key);
    return node && node.value ? node.value : fallback;
  };
  const whenNodes = Array.from(section.querySelectorAll('[data-contract-when]'));
  const contractRef = () => (window.OrderDetailPage && window.OrderDetailPage.contract) || null;

  const initValue = (key, value) => {
    const node = setting(key);
    if (node && value) node.value = value;
  };

  const initialContract = contractRef() || {};
  const initialMethodKey = Object.keys(SIGN_METHOD_LABEL).find((key) => SIGN_METHOD_LABEL[key] === initialContract.signMethod) || 'no_sign';
  initValue('createContract', initialContract.createContract || 'y');
  initValue('signMethod', initialMethodKey);
  initValue('bodyType', initialContract.bodyType || 'system_auto_generate');

  function readContractState() {
    return {
      create: settingValue('createContract', 'y'),
      body: settingValue('bodyType', 'system_auto_generate'),
      method: settingValue('signMethod', 'no_sign'),
      reclaim: settingValue('reclaim', 'n'),
      jurisdiction: settingValue('jurisdiction', '法院')
    };
  }

  const CONTRACT_RULES = {
    create: (s) => s.create === 'y',
    court: (s) => s.create === 'y' && (s.jurisdiction === '法院' || s.jurisdiction === '商事仲裁'),
    signDateTop: (s) => s.create === 'y' && s.body === 'system_auto_generate' && s.method === 'offline',
    reclaim: (s) => s.create === 'y' && s.body === 'manual_upload' && s.method === 'offline',
    upload: (s) => s.create === 'y' && s.body === 'manual_upload',
    elb: (s) => s.create === 'y' && s.method === 'elb'
  };

  function applyContractRules() {
    const state = readContractState();
    whenNodes.forEach((node) => {
      const rule = CONTRACT_RULES[node.dataset.contractWhen];
      if (rule) node.hidden = !rule(state);
    });
    const contract = contractRef();
    if (contract) {
      contract.signMethod = SIGN_METHOD_LABEL[state.method];
      contract.bodyType = state.body;
    }
  }

  section.addEventListener('change', (event) => {
    if (!event.target.closest('[data-contract-setting]')) return;
    applyContractRules();
    // 签约方式变化会影响签署类按钮（发起签署/撤销签署/正本回收）
    if (event.target.matches('[data-contract-setting="signMethod"]')) window.syncOrderDocumentActions?.();
  });

  applyContractRules();
  window.syncContractFieldRules = applyContractRules;
})();
