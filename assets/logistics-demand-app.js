const PROTOTYPE_VIEW = document.body.dataset.view === 'detail' ? 'detail' : 'list';
const prototypeParams = new URLSearchParams(window.location.search);
const MULTI_ROUTE_VIEW = document.documentElement.dataset.prototypeMode === 'multiroute' || prototypeParams.get('mode') === 'multiroute';
const BILL_FEE_VIEW = document.documentElement.dataset.prototypeMode === 'bill-fee' || prototypeParams.get('mode') === 'bill-fee';
const LOGISTICS_SOURCE_MODE = prototypeParams.get('source') || document.documentElement.dataset.prototypeSource || (MULTI_ROUTE_VIEW ? 'customer-order-multiroute' : 'customer-order-single-route');
const VERSION_MAINTENANCE_VIEW = prototypeParams.get('maintenance') === '1';
const HIDE_ROUTE_SERVICE_MODULES = LOGISTICS_SOURCE_MODE === 'direct-entrust';
const EMPTY_MULTI_ROUTE_SERVICE = LOGISTICS_SOURCE_MODE === 'customer-order-multiroute';
const initialDetailMode = document.documentElement.dataset.prototypeState === 'create' || prototypeParams.get('mode') === 'create' ? 'create' : 'exec';
const requestedDemandVersion=Number(prototypeParams.get('version'));
const currentDemandVersion=Number.isFinite(requestedDemandVersion)&&requestedDemandVersion>0?requestedDemandVersion:(initialDetailMode==='create'?0:4);
const initialDetailSection = ['demand','fees','arrangement','bills'].includes(prototypeParams.get('section')) ? prototypeParams.get('section') : 'overview';
const initialDemandAnchor = ['basic','service','estimate','attachments'].includes(prototypeParams.get('anchor')) ? prototypeParams.get('anchor') : 'basic';
const PROTOTYPE_LIST_FILE = 'logistics-demand-list-prototype.html';
const PROTOTYPE_DETAIL_FILE = 'logistics-demand-detail-prototype.html';
const MULTI_ROUTE_LIST_FILE = 'logistics-demand-multiroute-list-prototype.html';
const MULTI_ROUTE_DETAIL_FILE = 'logistics-demand-multiroute-detail-prototype.html';
const MULTI_ROUTE_CREATE_FILE = 'logistics-demand-multiroute-create-prototype.html';
function prototypeDetailFile(mode='exec'){return MULTI_ROUTE_VIEW ? (mode==='create' ? MULTI_ROUTE_CREATE_FILE : MULTI_ROUTE_DETAIL_FILE) : PROTOTYPE_DETAIL_FILE;}
function prototypeListFile(){return MULTI_ROUTE_VIEW?MULTI_ROUTE_LIST_FILE:PROTOTYPE_LIST_FILE;}
function prototypeUrl(file, params = {}) {
  const url = new URL(file, window.location.href);
  if (window.self !== window.top || prototypeParams.get('embed') === '1') url.searchParams.set('embed', '1');
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value); });
  return url.href;
}
const state = {
  page: PROTOTYPE_VIEW === 'detail' ? initialDetailMode : 'list',
  activeRowId: prototypeParams.get('no') || (document.documentElement.dataset.prototypeState === 'create' || prototypeParams.get('mode') === 'create' ? 'FLR202610160032' : 'FLR202610200038'),
  detailSection: initialDetailSection,
  demandAnchor: initialDemandAnchor,
  docFilter: '提单登记单',
  docSection: 'bill',
  paySide: 'recv',
  paymentFilter: 'all',
  activeDocId: '',
  docReturnPage: 'exec',
  filterExpanded: false,
  queryCollapsed: false,
  statusTab: 'all',
  selectedRows: new Set(),
  createCollapsed: new Set(),
  execCollapsed: new Set(),
  execFeeTab: 'exec',
  execBillNos: [],
  dropdownOpen: false
};

const statusTabs = [
  ['all','全部',712],['create','创建',209],['review','待审核',50],['rejected','驳回',3],
  ['arrange','待安排',55],['running','执行中',377],['completed','已完结',8],['void','作废',10]
];

const listRows = [
  {no:'LD202610270018', biz:'内贸2026-10-27', status:'执行中', cat:'running', statusClass:'status-blue', counts:[2,2,0,0], customer:'山东港口国际贸易集团有限公司', order:'FCO202610270004', recv:'16,000.00', pay:'15,000.00', profit:'1,000.00', type:'水运件杂', dept:'物流运营部'},
  {no:'LD202610270019', biz:'内贸2026-10-27', status:'执行中', cat:'running', statusClass:'status-blue', counts:[1,1,0,0], customer:'山东港口国际贸易集团有限公司', order:'FCO202610270004', recv:'3,000.00', pay:'5,500.00', profit:'-2,500.00', type:'水运件杂', dept:'物流运营部'},
  {no:'LD202610270020', biz:'内贸2026-10-27', status:'待安排', cat:'arrange', statusClass:'status-amber', counts:[1,0,0,0], customer:'山东港口国际贸易集团有限公司', order:'FCO202610270004', recv:'3,000.00', pay:'0.00', profit:'3,000.00', type:'水运件杂', dept:'物流运营部'},
  {no:'FLR202610160032', biz:'内贸2026-10-16', status:'创建', cat:'create', statusClass:'status-create', counts:[0,0,0,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202610200037', recv:'—', pay:'—', profit:'—', type:'水运集装箱', dept:'数字化中心'},
  {no:'FLR202610210013', biz:'内贸2026-10-21', status:'创建', cat:'create', statusClass:'status-create', counts:[0,0,0,0], customer:'三一重工股份有限公司', order:'FCO202610210013', recv:'—', pay:'—', profit:'—', type:'水运散货', dept:'海运部'},
  {no:'FLR202610210012', biz:'内贸2026-10-21', status:'创建', cat:'create', statusClass:'status-create', counts:[0,0,0,0], customer:'中国石油天然气股份有限公司', order:'FCO202610210012', recv:'—', pay:'—', profit:'—', type:'水运集装箱', dept:'数字化中心'},
  {no:'FLR202610210011', biz:'内贸2026-10-21', status:'创建', cat:'create', statusClass:'status-create', counts:[0,0,0,0], customer:'浙江吉利控股集团有限公司', order:'FCO202610210011', recv:'—', pay:'—', profit:'—', type:'汽运', dept:'运输管理部'},
  {no:'FLR202610210010', biz:'内贸2026-10-21', status:'执行中', cat:'running', statusClass:'status-blue', counts:[1,1,0,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202610210010', recv:'10', pay:'10', profit:'0', type:'水运集装箱', dept:'数字化中心'},
  {no:'FLR202610210009', biz:'内贸2026-10-21', status:'执行中', cat:'running', statusClass:'status-blue', counts:[1,1,0,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202610210009', recv:'10', pay:'10', profit:'0', type:'水运集装箱', dept:'数字化中心'},
  {no:'FLR202610210008', biz:'内贸2026-10-21', status:'执行中', cat:'running', statusClass:'status-blue', counts:[1,1,0,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202610210008', recv:'10', pay:'10', profit:'0', type:'水运集装箱', dept:'数字化中心'},
  {no:'FLR202610210007', biz:'内贸2026-10-21', status:'执行中', cat:'running', statusClass:'status-blue', counts:[1,1,0,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202610210007', recv:'10', pay:'10', profit:'0', type:'水运集装箱', dept:'数字化中心'},
  {no:'FLR202610210001', biz:'内贸2026-10-21', status:'待审核', cat:'review', statusClass:'status-amber', counts:[0,0,0,0], customer:'中联铁运集团有限公司', order:'FCO202610210001', recv:'1', pay:'1', profit:'0', type:'水运集装箱', dept:'数字化中心', disableStart:true},
  {no:'FLR202610200041', biz:'内贸2026-10-20', status:'执行中', cat:'running', statusClass:'status-blue', counts:[0,1,0,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202610200041', recv:'10', pay:'10', profit:'0', type:'水运集装箱', dept:'数字化中心'},
  {no:'FLR202610200040', biz:'内贸2026-10-20', status:'执行中', cat:'running', statusClass:'status-blue', counts:[0,1,0,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202610200040', recv:'10', pay:'10', profit:'0', type:'水运集装箱', dept:'数字化中心'},
  {no:'FLR202610200039', biz:'内贸2026-10-20', status:'执行中', cat:'running', statusClass:'status-blue', counts:[0,1,0,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202610200039', recv:'10', pay:'10', profit:'0', type:'水运集装箱', dept:'数字化中心'},
  {no:'FLR202610200038', biz:'内贸2026-10-20', status:'执行中', cat:'running', statusClass:'status-blue', counts:[0,1,0,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202610200037', recv:'10', pay:'10', profit:'0', type:'水运集装箱', dept:'数字化中心'},
  {no:'FLR202610200037', biz:'内贸2026-10-20', status:'执行中', cat:'running', statusClass:'status-blue', counts:[0,1,0,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202610200036', recv:'10', pay:'10', profit:'0', type:'水运集装箱', dept:'数字化中心'},
  {no:'FLR202610200036', biz:'内贸2026-10-20', status:'执行中', cat:'running', statusClass:'status-blue', counts:[0,1,0,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202610200035', recv:'10', pay:'10', profit:'0', type:'水运集装箱', dept:'数字化中心'},
  {no:'FLR202611170004', biz:'内贸2026-11-17', status:'待安排', cat:'arrange', statusClass:'status-amber', counts:[1,0,0,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202611170004', recv:'3,000.00', pay:'0.00', profit:'3,000.00', type:'水运集装箱', dept:'物流运营部'},
  {no:'FLR202611170001', biz:'内贸2026-11-17', status:'驳回', cat:'rejected', statusClass:'status-amber', counts:[0,0,1,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202611170001', recv:'—', pay:'—', profit:'—', type:'水运集装箱', dept:'数字化中心'},
  {no:'FLR202611170002', biz:'内贸2026-11-17', status:'已完结', cat:'completed', statusClass:'status-create', counts:[1,1,0,1], customer:'中联铁运集团有限公司', order:'FCO202611170002', recv:'18,000.00', pay:'15,000.00', profit:'3,000.00', type:'多式联运', dept:'物流运营部'},
  {no:'FLR202611170003', biz:'内贸2026-11-17', status:'作废', cat:'void', statusClass:'status-create', counts:[0,0,0,0], customer:'三一重工股份有限公司', order:'FCO202611170003', recv:'—', pay:'—', profit:'—', type:'水运散货', dept:'海运部'},
  {no:'FLR202610200035', biz:'内贸2026-10-20', status:'执行中', cat:'running', statusClass:'status-blue', counts:[0,1,0,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202610200034', recv:'10', pay:'10', profit:'0', type:'水运集装箱', dept:'数字化中心'}
];

function getActiveDemandRecord(){return listRows.find(row=>row.no===state.activeRowId)||listRows.find(row=>row.no==='FLR202610200038')||listRows[0]||{};}

function getActiveDemandRecord(){
  return listRows.find((row) => row.no === state.activeRowId)
    || listRows.find((row) => row.no === 'FLR202610200038')
    || listRows[0]
    || {};
}

const icons = {
  supplier:'<path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2 19a6 6 0 0 1 12 0M14 14a5 5 0 0 1 8 4"/>',
  order:'<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M9 5V3h6v2M3 10h18"/>',
  track:'<path d="M12 21s7-5.6 7-12a7 7 0 1 0-14 0c0 6.4 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
  customer:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  money:'<circle cx="12" cy="12" r="9"/><path d="M9 8h6M8 12h8M8 16h8M12 8v8"/>',
  data:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  flow:'<rect x="3" y="4" width="6" height="5" rx="1"/><rect x="15" y="15" width="6" height="5" rx="1"/><path d="M9 6.5h4a3 3 0 0 1 3 3v6M12 12l4 4 4-4"/>',
  rules:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
  config:'<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5L9 6.1a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7 7 0 0 0 0 2L3 14.5l2 3.4 2.4-1a7 7 0 0 0 1.7 1l.5 3.1h5l.5-3.1a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5a7 7 0 0 0 .1-1Z"/>',
  theme:'<path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h3a6 6 0 0 0 0-10h-3Z"/><circle cx="7.5" cy="10" r=".8"/><circle cx="10" cy="7" r=".8"/><circle cx="14" cy="7" r=".8"/>',
  lowcode:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
  workbench:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  file:'<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  ship:'<path d="m3 15 9 5 9-5-3-1-6-2-6 2-3 1Z"/><path d="M6 13V8h12v5M12 8V3M10 3h4"/>'
};
function icon(name, cls=''){return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[name]||icons.file}</svg>`}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(message){const host=document.getElementById('toastHost');const node=document.createElement('div');node.className='toast';node.textContent=message;host.appendChild(node);setTimeout(()=>node.remove(),2200)}

function renderTopTabs(){
  const tabs=[
    {id:'home',label:'首页'},{id:'list',label:'物流需求列表',closable:true},
    {id:'create',label:`需求详情【${state.activeRowId||'FLR202610160032'}】`,closable:true},
    {id:'exec',label:`需求详情【${state.activeRowId||'FLR202610200038'}】`,closable:true}
  ];
  document.getElementById('topTabs').innerHTML=tabs.map(t=>`<button class="top-tab ${state.page===t.id?'active':''}" data-go="${t.id==='home'?'list':t.id}"><span>${t.label}</span>${t.closable?'<span class="tab-close">×</span>':''}</button>`).join('');
}

function menuItem(iconName,text,group='',expanded=false){
  return `<div class="menu-item ${expanded?'menu-group expanded':''}" ${group?`data-menu="${group}"`:`data-go="list"`}>
    <span class="ico">${icon(iconName)}</span><span class="text">${text}</span><span class="arrow">⌄</span>
  </div>`;
}
function subItem(text,active,go=''){
  return `<div class="subitem ${active?'active':''}" ${go?`data-go="${go}"`:'data-toast="已模拟切换菜单"'}><span class="ico">${icon('file')}</span><span>${text}</span></div>`;
}
function renderSidebar(){
  document.getElementById('sidebar').innerHTML=`
    <div class="opt-brand"><div class="opt-brand-mark">${icon('order')}</div><div class="opt-brand-copy"><strong>物流控制塔</strong><span>Logistics Workbench</span></div></div>
    ${menuItem('order','物流订单管理')}
    <div class="submenu">
      <div style="height:30px;padding:5px 10px 3px 27px;color:#94a3b8;font-size:11px">物流需求工作台</div>
      ${subItem('物流需求列表',state.page==='list','list')}
      ${subItem('需求详情 · 创建',state.page==='create','create')}
      ${subItem('需求详情 · 执行',state.page==='exec'||state.page==='document','exec')}
      ${subItem('物流委托列表',false)}
    </div>
    ${menuItem('ship','运输工作台')}
    <div class="submenu">${subItem('运输委托列表',false)}</div>
    ${menuItem('data','物流资源池')}
    <div class="submenu">${subItem('运输资源池',false)}${subItem('仓储资源池',false)}</div>
    ${menuItem('config','OMS配置管理')}
    <div class="submenu">${subItem('委托配置',false)}${subItem('任务模板配置',false)}</div>

    <button class="btn outline-primary opt-side-bottom" data-toast="已模拟外部动作">外部动作</button>
  `;
}
function filterInput(label,placeholder='请输入',value=''){return `<label class="filter-field"><span class="filter-label">${label}</span><input class="filter-control" placeholder="${placeholder}" value="${esc(value)}"></label>`}
function filterSelect(label,options,placeholder='请选择'){return `<label class="filter-field"><span class="filter-label">${label}</span><select class="filter-control"><option value="">${placeholder}</option>${options.map(o=>`<option>${esc(o)}</option>`).join('')}</select></label>`}

function renderList(){
  const rows=listRows.filter(r=>state.statusTab==='all'||r.cat===state.statusTab);
  const selectedCount=state.selectedRows.size;
  const extraFilters=state.filterExpanded?`
    ${filterSelect('运输类型',['汽运','水运'])}
    ${filterSelect('装运类别',['散货','集装箱','件杂货'])}
    ${filterInput('贸易合同号')}
    ${filterInput('业务员')}
    ${filterInput('核算组织')}
    ${filterInput('公司')}
    ${filterInput('作业组织')}
    ${filterInput('作业组织人员')}
    ${filterInput('船东')}
    ${filterInput('航线')}
    ${filterInput('起运港')}
    ${filterInput('中转港')}
    ${filterInput('目的港')}
    ${filterInput('船名')}
    ${filterInput('航次')}
    ${filterInput('起运港ETD','选择日期')}
    ${filterInput('目的港ETA','选择日期')}
    ${filterInput('业务日期','选择日期')}
    ${filterInput('创建日期','选择日期')}
    ${filterSelect('业务类型',['出口','进口','转口','内贸','境外内贸'])}
  `:'';
  return `<div class="scroll-area list-scroll">

    <section class="query-card ct-query-card ${state.filterExpanded?'expanded':''} ${state.queryCollapsed?'query-collapsed':''}">
      <div class="query-head ct-query-head">
        <button class="query-title query-toggle ct-query-title" type="button" data-query-toggle aria-expanded="${state.queryCollapsed?'false':'true'}"><span class="caret">▼</span><span>查询条件</span></button>
        <div class="query-actions ct-query-actions">
          <button class="btn soft-primary" data-filter-toggle>查看更多</button>
          <button class="btn soft-primary" data-toast="已重置查询条件">重置</button>
          <button class="btn primary" data-toast="已执行查询">查询</button>
        </div>
      </div>
      <div class="query-body ct-query-body">
        <div class="filter-grid">
          ${filterInput('物流需求号')}
          ${filterInput('客户订单编号')}
          ${filterInput('MBL#')}
          ${filterInput('HBL#')}
          ${filterSelect('客户',[])}
          ${filterSelect('代理',[])}
          ${extraFilters}
        </div>
        <div class="filter-more-row"><button class="filter-more" data-filter-toggle aria-label="展开更多条件"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="transition:.16s;transform:${state.filterExpanded?'rotate(180deg)':'none'}"><path d="m6 9 6 6 6-6"/></svg></button></div>
      </div>
    </section>
    <section class="table-card">
      <div class="status-tabs">
        ${statusTabs.map(([id,label,count])=>`<button class="status-tab ${state.statusTab===id?'active':''}" data-status-tab="${id}">${label}(${count})</button>`).join('')}${MULTI_ROUTE_VIEW?'<span class="list-mode-hint">多线路 · 双击行进入详情</span>':''} 
        <div class="status-spacer"></div>
        <div class="bulk-actions">
          <button class="btn danger" ${selectedCount?'':'disabled'}>删除</button>
          <button class="btn primary ${selectedCount?'':'is-disabled'}" ${selectedCount?'':'disabled'}>审批进度</button>
          <button class="btn primary ${selectedCount?'':'is-disabled'}" ${selectedCount?'':'disabled'}>修改OP</button>
          <button class="btn outline-primary" ${selectedCount?'':'disabled'}>完结</button>
          <button class="btn outline-primary" ${selectedCount?'':'disabled'}>取消完结</button>
        </div>
      </div>
      <div class="grid-wrap">
        <table class="data-grid">
          <colgroup><col style="width:52px"><col style="width:170px"><col style="width:140px"><col style="width:140px"><col style="width:180px"><col style="width:143px"><col style="width:130px"><col style="width:130px"><col style="width:180px"><col style="width:150px"><col style="width:125px"></colgroup>
          <thead><tr>
            <th class="check-col"><input type="checkbox" aria-label="全选"></th>
            <th>物流需求单号</th><th>委托状态</th><th>状态</th><th>客户信息</th>
            <th>业务预估应收（元）</th><th>业务预估应付（元）</th><th>业务预估利润（元）</th>
            <th>运输/装运类别</th><th>部门</th><th class="action-col">操作</th>
          </tr></thead>
          <tbody>${rows.length?rows.map(r=>`
            <tr data-row-id="${r.no}">
              <td class="check-col"><input type="checkbox" class="row-check" data-row-check="${r.no}" ${state.selectedRows.has(r.no)?'checked':''}></td>
              <td class="no-cell"><strong>${r.no}</strong><span>${r.biz}</span></td>
              <td><div class="count-grid"><span class="c-orange">创建 <b>${r.counts[0]}</b></span><span class="c-blue">执行 <b>${r.counts[1]}</b></span><span class="c-red">异常 <b>${r.counts[2]}</b></span><span class="c-muted">完结 <b>${r.counts[3]}</b></span></div></td>
              <td><span class="${r.statusClass}">${r.status}</span></td>
              <td class="customer-cell" title="${esc(r.customer)}（${r.order}）">${esc(r.customer)}（${r.order}）</td>
              <td>${r.recv}</td><td>${r.pay}</td><td>${r.profit}</td><td>${r.type}</td><td>${r.dept}</td>
              <td class="action-col"><div class="action-stack">${r.cat==='create'?`<button class="btn link" data-row-open="${r.no}" data-row-mode="create">继续编辑</button>`:`<button class="btn link" data-open-logistics-arrangement="${r.no}" ${r.disableStart?'disabled':''}>发起物流需求</button>`}<button class="btn link" data-row-open="${r.no}" data-row-mode="${r.cat==='create'?'create':'exec'}">${r.cat==='create'?'查看需求':'查看物流安排'}</button></div></td>
            </tr>`).join(''):`<tr><td colspan="11" class="empty-cell">暂无数据</td></tr>`}</tbody>
        </table>
      </div>
      <div class="pager">
        <span>共 712 条</span><div class="pages"><button class="page-btn">‹</button><button class="page-btn active">1</button><button class="page-btn">2</button><button class="page-btn">3</button><button class="page-btn">4</button><button class="page-btn">…</button><button class="page-btn">24</button><button class="page-btn">›</button></div>
        <select><option>30条/页</option><option>50条/页</option></select><span>前往</span><input value="1"><span>页</span>
      </div>
    </section>
  </div>`;
}

const logisticsArrangementState={record:null,routes:[],consignments:[],sequence:0,dragRouteId:''};
const logisticsArrangementTaskTypes=['汽运','水运','铁运','航空'];
const logisticsArrangementLoadTypes=['散货','件杂','集装箱'];
const arrangementOptions=(items,selected)=>items.map(item=>`<option value="${esc(item)}" ${item===selected?'selected':''}>${esc(item)}</option>`).join('');
const assignedLogisticsRouteIds=()=>new Set(logisticsArrangementState.consignments.flatMap(item=>item.tasks.map(task=>task.routeId)).filter(Boolean));
function logisticsArrangementTaskMarkup(consignment,task){const route=logisticsArrangementState.routes.find(item=>item.id===task.routeId);const routeLabel=route?`${route.label} · ${route.origin} → ${route.destination}`:'未关联线路';return `<div class="arrangement-task-card" data-arr-task="${task.id}" data-arr-commission="${consignment.id}"><div class="arrangement-task-field"><label>关联线路</label><div class="arrangement-task-route-value" title="${esc(routeLabel)}">${esc(routeLabel)}</div></div><div class="arrangement-task-field"><label>首段运输任务类型</label><select data-arr-task-field="taskType">${arrangementOptions(logisticsArrangementTaskTypes,task.taskType)}</select></div><div class="arrangement-task-field"><label>装运类别</label><select data-arr-task-field="loadType">${arrangementOptions(logisticsArrangementLoadTypes,task.loadType)}</select></div><button class="arrangement-task-delete" type="button" data-delete-arr-task="${task.id}" data-arr-commission="${consignment.id}" aria-label="删除任务">×</button></div>`;}
function logisticsArrangementConsignmentMarkup(consignment){return `<article class="arrangement-consignment" data-arr-consignment-card="${consignment.id}" data-arr-drop="${consignment.id}"><div class="arrangement-consignment-head"><div class="arrangement-consignment-title">委托 ${logisticsArrangementState.consignments.indexOf(consignment)+1}</div><div class="arrangement-consignment-actions"><button class="arrangement-mini-btn" type="button" data-add-arr-task="${consignment.id}">＋ 新增任务</button><button class="arrangement-icon-btn" type="button" data-delete-arr-consignment="${consignment.id}" aria-label="删除委托">×</button></div></div><div class="arrangement-form-grid"><div class="arrangement-field"><label>物流委托名称<span class="required">*</span></label><input data-arr-consignment-field="name" data-arr-commission="${consignment.id}" value="${esc(consignment.name)}" placeholder="请输入物流委托名称"></div><div class="arrangement-field"><label>委托方法人公司<span class="required">*</span></label><input data-arr-consignment-field="legalCompany" data-arr-commission="${consignment.id}" value="${esc(consignment.legalCompany)}"></div><div class="arrangement-field"><label>运输委托类型<span class="required">*</span></label><select data-arr-consignment-field="type" data-arr-commission="${consignment.id}"><option>我司委托-已准入供应商</option><option>供应商直委托</option></select></div><div class="arrangement-field"><label>物流供应商<span class="required">*</span></label><select data-arr-consignment-field="supplier" data-arr-commission="${consignment.id}"><option>中联铁运集团有限公司</option><option>青岛远洋物流有限公司</option><option>待分配承运商</option></select></div><div class="arrangement-field"><label>供应商商户</label><select data-arr-consignment-field="supplierMerchant" data-arr-commission="${consignment.id}"><option value="">请选择</option><option>默认商户</option></select></div></div><div class="arrangement-tasks"><div class="arrangement-task-head"><div class="arrangement-task-title">任务信息（${consignment.tasks.length}）</div></div><div class="arrangement-task-list">${consignment.tasks.length?consignment.tasks.map(task=>logisticsArrangementTaskMarkup(consignment,task)).join(''):'<div class="arrangement-task-empty">暂无任务</div>'}</div><div class="arrangement-dropzone">将上方线路拖到此委托内，即可生成任务</div></div></article>`;}
function renderLogisticsArrangementDialog(overlay){const routePool=overlay.querySelector('[data-arr-route-pool]');const consignmentList=overlay.querySelector('[data-arr-consignment-list]');const confirm=overlay.querySelector('[data-arr-confirm]');const assigned=assignedLogisticsRouteIds();routePool.innerHTML=logisticsArrangementState.routes.map(route=>{const isAssigned=assigned.has(route.id);return `<article class="arrangement-route-card ${isAssigned?'is-assigned':''}" draggable="${!isAssigned}" data-arr-route="${route.id}"><div class="arrangement-route-card-head"><span>${esc(route.label)}</span><span>${isAssigned?'已分配':'可分配'}</span></div><div class="arrangement-route-card-path">${esc(route.origin)} → ${esc(route.destination)}</div><div class="arrangement-route-card-mode">${esc(route.type)} · ${esc(route.loadType)}</div><div class="arrangement-route-drag-hint">${isAssigned?'已分配到任务':'按住卡片拖到下方委托'}</div></article>`;}).join('');consignmentList.innerHTML=logisticsArrangementState.consignments.length?logisticsArrangementState.consignments.map(logisticsArrangementConsignmentMarkup).join(''):'<div class="arrangement-empty-consignment">暂无物流委托，请点击“新增委托”。</div>';confirm.disabled=!logisticsArrangementState.consignments.some(item=>item.tasks.length);}
function addLogisticsArrangementTask(overlay,consignmentId,routeId){const consignment=logisticsArrangementState.consignments.find(item=>item.id===consignmentId);if(!consignment)return;if(routeId&&assignedLogisticsRouteIds().has(routeId)){toast('该线路已分配任务');return;}const route=logisticsArrangementState.routes.find(item=>item.id===routeId);consignment.tasks.push({id:'T'+(++logisticsArrangementState.sequence),routeId:routeId||'',taskType:route?.type||'汽运',loadType:route?.loadType||'散货'});renderLogisticsArrangementDialog(overlay);}
function openLogisticsArrangementDialog(no){const record=listRows.find(item=>item.no===no);if(!record)return;document.querySelectorAll('.arrangement-backdrop').forEach(node=>node.remove());const type=record.type.includes('铁')?'铁运':record.type.includes('汽')?'汽运':'水运';const loadType=record.type.includes('散')?'散货':record.type.includes('件')?'件杂':'集装箱';const primary={id:'R1',label:'线路 #1',origin:record.type.includes('水运')?'青岛港':'起运地',destination:record.type.includes('水运')?'厦门港':'目的地',type,loadType};const second={id:'R2',label:'线路 #2',origin:type==='水运'?'苏州/工业园区海关监管库':'中转仓',destination:type==='水运'?'成都/青白江铁路港':'目的仓',type,loadType};logisticsArrangementState.record=record;logisticsArrangementState.routes=[primary,second];logisticsArrangementState.sequence=2;logisticsArrangementState.consignments=[{id:'C1',name:'未命名物流委托',legalCompany:'厦门建发供应链物流科技有限公司',type:'我司委托-已准入供应商',supplier:'中联铁运集团有限公司',supplierMerchant:'',tasks:[{id:'T1',routeId:'R1',taskType:type,loadType}]}];const organizationFields=[['业务员','苏丽蓉'],['业务员部门',record.dept||'数字化中心'],['业务员经营单位','供应链物流科技'],['业务员核算组',record.dept||'数字化中心'],['业务员公司','厦门建发供应链物流科技有限公司'],['作业组织',record.dept||'数字化中心'],['作业组织人员','苏丽蓉']];const organizationHtml=organizationFields.map(([label,value])=>`<div class="arrangement-field"><label>${label}<span class="required">*</span></label><input value="${esc(value)}"></div>`).join('');const overlay=document.createElement('div');overlay.className='arrangement-backdrop';overlay.innerHTML=`<section class="arrangement-dialog" role="dialog" aria-modal="true" aria-labelledby="arrangementDialogTitle"><header class="arrangement-head"><h2 class="arrangement-title" id="arrangementDialogTitle">发起物流需求</h2><button class="arrangement-close" type="button" data-arr-close aria-label="关闭发起物流需求">×</button></header><div class="arrangement-body"><section class="arrangement-section"><div class="arrangement-section-head"><div class="arrangement-section-title">组织信息</div></div><div class="arrangement-form-grid">${organizationHtml}</div></section><section class="arrangement-section"><div class="arrangement-section-head"><div class="arrangement-section-title">可分配线路</div><div class="arrangement-section-note">按住线路卡片，拖拽到下方任一物流委托即可生成任务</div></div><div class="arrangement-route-pool" data-arr-route-pool></div></section><section class="arrangement-section"><div class="arrangement-section-head"><div class="arrangement-section-title">物流委托与任务</div><button class="arrangement-add-consignment" type="button" data-arr-add-consignment>＋ 新增委托</button></div><div data-arr-consignment-list></div></section></div><footer class="arrangement-foot"><button class="btn" type="button" data-arr-close>取消</button><button class="btn primary" type="button" data-arr-confirm>确认创建</button></footer></section>`;document.body.appendChild(overlay);renderLogisticsArrangementDialog(overlay);
const close=()=>overlay.remove();overlay.addEventListener('click',event=>{if(event.target===overlay||event.target.closest('[data-arr-close]')){close();return;}if(event.target.closest('[data-arr-add-consignment]')){logisticsArrangementState.consignments.push({id:'C'+(++logisticsArrangementState.sequence),name:'未命名物流委托',legalCompany:'厦门建发供应链物流科技有限公司',type:'我司委托-已准入供应商',supplier:'中联铁运集团有限公司',supplierMerchant:'',tasks:[]});renderLogisticsArrangementDialog(overlay);return;}const addTask=event.target.closest('[data-add-arr-task]');if(addTask){addLogisticsArrangementTask(overlay,addTask.dataset.addArrTask,'');return;}const deleteTask=event.target.closest('[data-delete-arr-task]');if(deleteTask){const consignment=logisticsArrangementState.consignments.find(item=>item.id===deleteTask.dataset.arrCommission);if(consignment)consignment.tasks=consignment.tasks.filter(task=>task.id!==deleteTask.dataset.deleteArrTask);renderLogisticsArrangementDialog(overlay);return;}const deleteConsignment=event.target.closest('[data-delete-arr-consignment]');if(deleteConsignment){logisticsArrangementState.consignments=logisticsArrangementState.consignments.filter(item=>item.id!==deleteConsignment.dataset.deleteArrConsignment);renderLogisticsArrangementDialog(overlay);return;}if(event.target.closest('[data-arr-confirm]')){const consignmentCount=logisticsArrangementState.consignments.length;const taskCount=logisticsArrangementState.consignments.reduce((sum,item)=>sum+item.tasks.length,0);close();toast(`物流需求已创建：${consignmentCount} 个委托、${taskCount} 个任务`);}});overlay.addEventListener('input',event=>{const field=event.target.dataset.arrConsignmentField;if(field){const item=logisticsArrangementState.consignments.find(c=>c.id===event.target.dataset.arrCommission);if(item)item[field]=event.target.value;}});overlay.addEventListener('change',event=>{const field=event.target.dataset.arrConsignmentField;if(field){const item=logisticsArrangementState.consignments.find(c=>c.id===event.target.dataset.arrCommission);if(item)item[field]=event.target.value;return;}const taskField=event.target.dataset.arrTaskField;if(taskField){const card=event.target.closest('[data-arr-task]');const item=logisticsArrangementState.consignments.find(c=>c.id===card?.dataset.arrCommission);const task=item?.tasks.find(t=>t.id===card?.dataset.arrTask);if(task)task[taskField]=event.target.value;}});overlay.addEventListener('dragstart',event=>{const card=event.target.closest('[data-arr-route]');if(!card||card.classList.contains('is-assigned')){event.preventDefault();return;}logisticsArrangementState.dragRouteId=card.dataset.arrRoute;card.classList.add('dragging');event.dataTransfer?.setData('text/plain',logisticsArrangementState.dragRouteId);});overlay.addEventListener('dragend',event=>{event.target.closest('[data-arr-route]')?.classList.remove('dragging');logisticsArrangementState.dragRouteId='';});overlay.addEventListener('dragover',event=>{const zone=event.target.closest('[data-arr-drop]');if(!zone)return;event.preventDefault();zone.classList.add('is-dragover');});overlay.addEventListener('dragleave',event=>{event.target.closest('[data-arr-drop]')?.classList.remove('is-dragover');});overlay.addEventListener('drop',event=>{const zone=event.target.closest('[data-arr-drop]');if(!zone)return;event.preventDefault();zone.classList.remove('is-dragover');const routeId=event.dataTransfer?.getData('text/plain')||logisticsArrangementState.dragRouteId;if(routeId)addLogisticsArrangementTask(overlay,zone.dataset.arrDrop,routeId);});}
document.addEventListener('click',event=>{const trigger=event.target.closest('[data-open-logistics-arrangement]');if(trigger){event.preventDefault();openLogisticsArrangementDialog(trigger.dataset.openLogisticsArrangement);}});
const opts = {
  businessType:['出口','进口','转口','内贸','境外内贸'],
  org:['投资管理中心','远东航线部1','投资管理中心1','项目管理部','项目运营部1','阳谷供应链','卓跃达1','卓跃达','海运部','国运公司','数字化中心'],
  people:['魏勇','徐芷萌','林美燕','黄瑞钰'],
  transport:['汽运','水运','铁路'],
  shipping:['内贸水运','国际航运','多式联运'],
  loadType:['散货','集装箱','件杂货'],
  opMode:['LOCAL','NVOCC'],
  billType:['船东直单','C&D直单','代理直单','无'],
  yesNo:['是','否'],
  packing:['FCL','拼箱运输（LCL）'],
  boxMode:['货主自有箱（SOC）','船公司箱（COC）'],
  cargoMode:['自揽货','指定货','纯操作货'],
  freightTerms:['CY','CFS','DR','RAMP'],
  shipAgent:['广西桂酸酸农业科技有限公司','昂歌信息信息有限公司4f3dd','四通信息有限公司77fe2','凌云网络有限公司f908d','厦门志捷国际物流有限公司','成都甜甜企业管理集团有限公司','广东法人邦物业管理有限公司','厦门优创思特供应链管理有限公司','飞海科技网络有限公司a227d','昂歌信息网络有限公司d3afe'],
  shipOwner:['美国总统轮船（中国）有限公司','澳州国家航运','天敬海运','法国达飞轮船有限公司','正利航业股份有限公司','中远海运集装箱运输有限公司','南美轮船（中国）船务有限公司','阿联酋航运','长荣海运','福建省轮船总公司','汉堡南美','赫伯罗特航运公司','兴亚海运株式会社','韩国现代商船株式会社','神原汽船(中国）船务有限公司','高丽海运株式会社','地中海航运（香港）有限公司上海办事处','马士基(中国)航运有限公司','海陆航运','美森轮船有限公司','华荣海运集团股份有限公司','海洋网联船务','太平船务(中国)有限公司','宏海箱运船务有限公司','长锦商船（中国）','南非航运','海丰国际控股有限公司','德翔海运有限公司','万海航运股份有限公司','阳明海运股份有限公司','以星综合航运(中国)有限公司','东方海外货柜航运有限公司','川崎汽船（中国）有限公司','日本邮船（中国）有限公司','商船三井','中海集装箱运输有限公司','阿拉伯联合国家轮船公司','韩进海运','海口南青集装箱班轮有限公司','吉舟船务有限公司','太仓港集装箱海运有限公司','韩国东暎海运株式会社','远东轮船香港有限公司','华锦航运','中联航运','立高航运有限公司','达通航运','森罗商船(上海)有限公司','MCC运输新加坡有限公司','锦江航运','港业航运','福州马尾轮船有限公司','鹭丰船务有限公司','运达航运','上海民生轮船有限公司','上海鹏华船务有限公司','亚海航运','南星海运株式会社','厦门协通船务代理有限公司','泉州安通物流有限公司','维萨航运','俄运集团有限公司','瑞洋海运株式会社','泛洲海运株式会社','凌远航运有限公司'],
  routes:['东南亚','印巴线','日韩线','中南美','美加线','红海波湾线','中东','地中海','欧洲','澳新','非洲','内贸','中亚'],
  agents:['菊风公司传媒有限公司b590c','中联铁运集团有限公司','青岛绿洲园花生食品有限公司'],
  ports:['富纳富提','香港','法马古斯塔','上海港','宁波港','厦门港','漳州','泉州','天津'],
  terms:['水运港到港','港到港','门到门','港到门','门到港']
};
function field(label,value='',o={}){
  const extra=o.name?(o.routeId?` data-route-field="${o.name}" data-route-id="${o.routeId}"`:` data-field="${o.name}"`):'';
  const ro=o.readonly?'readonly':'';
  const sel=o.options?`<select class="form-control" ${o.readonly?'disabled':''}${extra}>${(value===''||o.options.indexOf(value)<0)?`<option value="" selected>${o.placeholder||'请选择'}</option>`:''}${o.options.map(v=>`<option ${v===value?'selected':''}>${esc(v)}</option>`).join('')}</select>`:
    o.textarea?`<textarea class="form-control" placeholder="${o.placeholder||'请输入'}" ${ro}${extra}>${esc(value)}</textarea>`:
    `<input class="form-control" type="${o.type||'text'}" value="${esc(value)}" placeholder="${o.placeholder||(o.type==='date'?'选择日期':'请输入')}" ${ro}${extra}>`;
  return `<label class="field ${o.span||''}"><span class="field-label">${label}${o.required?'<span class="req">*</span>':''}</span>${sel}</label>`;
}
function checkField(label,checked,readonly=false){
  return `<div class="field"><span class="field-label">${label}<span class="req">*</span></span><label class="check-line ${readonly?'disabled':''}"><input type="checkbox" ${checked?'checked':''} ${readonly?'disabled':''}><span>运输</span></label></div>`;
}
function cubeCard(title,body,o={}){
  return `<section class="cube-card ${o.className||''}"><div class="cube-head"><button class="collapse-btn" data-collapse aria-label="收起"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button><div class="title">${title}</div>${o.actions?`<div class="head-actions">${o.actions}</div>`:''}</div><div class="cube-body">${body}</div></section>`;
}
function subCard(title,body,o={}){
  return `<section class="sub-card"><div class="sub-head"><div class="title">${o.noCaret?'':`<button class="collapse-btn" data-collapse aria-label="收起"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button>`}${title}</div>${o.actions?`<div class="head-actions">${o.actions}</div>`:''}</div><div class="sub-body">${body}</div></section>`;
}
function customerCard(isExec){
  const d=isExec?{order:'FCO202610200037',customerNo:'KH202610200037',company:'青岛绿洲园花生食品有限公司',principalOrg:'青岛绿洲园花生食品有限公司',settlementHeader:'青岛绿洲园花生食品有限公司',date:'2026-10-20',contact:'清清',email:'qingqing@greenharbor.com',sales:'黄瑞钰',agent:'菊风公司传媒有限公司b590c',remark:'自动化订单备注',goods:{no:'FCO202610200037',customer:'青岛绿洲园花生食品有限公司',name:'玉米',category:'农副产品',unit1:'吨',unit2:'立方米',unit3:'吨'}}:{order:'FCO202610160032',customerNo:'KH202610160032',company:'成都柠檬时光科技有限公司',principalOrg:'成都柠檬时光科技有限公司',settlementHeader:'成都柠檬时光科技有限公司',date:'2026-10-16',contact:'11',email:'contact@example.com',sales:'林美燕',agent:'菊风公司传媒有限公司b590c',remark:'自动化订单备注',goods:{no:'FCO202610160032',customer:'成都柠檬时光科技有限公司',name:'玉米',category:'农副产品',unit1:'吨',unit2:'立方米',unit3:'吨'}};
  return `<section class="cube-card"><div class="cube-head"><button class="collapse-btn" data-collapse aria-label="收起"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button><div class="title">客户及商品明细</div></div><div class="cube-body"><div class="customer-layout">
    <div class="related-panel"><div class="related-head"><span>查看关联客户订单 <b>（1）</b></span></div><div class="order-summary"><div class="order-top"><span class="order-no">${d.order} （外部客户）</span><span class="tags">${['运输','内贸',isExec?'水运':createForm.transportType,isExec?'集装箱':createForm.loadType].filter(Boolean).map((t,i)=>`<span class="tag ${i<2?'blue':'cyan'}">${esc(t)}</span>`).join('')}</span></div><div class="company">${d.company}</div><div class="summary-lines"><div class="line"><b>委托方组织：</b><span></span></div><div class="line"><b>结算抬头：</b><span>${d.company}</span></div><div class="line"><b>业务日期：</b><span>${d.date}</span></div><div class="line"><b>联系人：</b><span>${d.contact}</span></div><div class="line"><b>联系邮箱：</b><span>${d.email}</span></div><div class="line"><b>业务员：</b><span>${d.sales}</span></div><div class="line"><b>代理：</b><span>${d.agent}</span></div><div class="line"><b>备注：</b><span>${d.remark}</span></div></div></div></div>
    <div class="goods-panel"><div class="goods-head"><span>商品明细列表</span>${isExec?'':'<button class="btn outline-primary mini" data-toast="已模拟打开商品选择弹窗">选择</button>'}</div><div class="table-scroll"><table class="mini-table" style="min-width:1500px"><thead><tr><th style="width:150px">客户订单编号</th><th style="width:180px">客户</th><th style="width:130px">商品中文名</th><th style="width:140px">商品描述</th><th style="width:105px">件数/单位</th><th style="width:105px">毛重/单位</th><th style="width:105px">体积/单位</th><th style="width:125px">标准数量/单位</th><th style="width:100px">单件重量</th><th style="width:120px">单件重量单位</th><th style="width:120px">规格尺寸</th><th style="width:100px">溢装率（%）</th><th style="width:100px">短装率（%）</th><th style="width:130px">货物单价（元）</th><th style="width:140px">货物总价（万元）</th><th style="width:180px">贸易合同号（类型）</th><th style="width:150px">商品英文名</th><th style="width:80px">操作</th></tr></thead><tbody><tr><td>${d.goods.no}</td><td>${d.goods.customer}</td><td>${d.goods.category||d.goods.name}</td><td></td><td></td><td>${d.goods.unit1}</td><td>${d.goods.unit2}</td><td>${d.goods.unit3}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><div class="goods-route-summary" title="线路1 ${isExec?singleOrderRouteData.origin:createForm.portFrom||'—'} → ${isExec?singleOrderRouteData.destination:createForm.portTo||'—'} ${isExec?singleOrderRouteData.transportType:createForm.transportType||'—'} ${isExec?singleOrderRouteData.loadType:createForm.loadType||'—'}"><strong>线路1</strong><span>${isExec?singleOrderRouteData.origin:createForm.portFrom||'—'} → ${isExec?singleOrderRouteData.destination:createForm.portTo||'—'}</span></div></td><td><span class="goods-cell-value">—</span></td><td><span class="goods-cell-value">${isExec?'HT202610200037':'HT202610160032'}</span></td><td>${isExec?'':'<button class="btn link" style="color:var(--danger)">删除</button>'}</td></tr></tbody></table></div></div>
  </div></div></section>`;
}
function baseCard(isExec){
  const v=isExec?{sales:'黄瑞钰',dept:BILL_FEE_VIEW?'国运':'数字化中心',account:'数字化中心',company:'厦门建发生生物流有限公司',biz:'内贸',date:'2026-10-20',org:'数字化中心',person:'',unit:'供应链物流科技',no:state.activeRowId||'FLR202610200038',remark:'自动化订单备注'}:{sales:'林美燕',dept:'海运部',account:'海运部',company:'厦门建发供应链物流科技有限公司',biz:'内贸',date:'2026-10-16',org:'海运部',person:'',unit:'供应链物流科技',no:state.activeRowId||'FLR202610160032',remark:'自动化订单备注'};
  const body=`<div class="grid-6">
    ${field('业务员',v.sales,{required:true,readonly:true,options:[v.sales]})}
    ${field('部门',v.dept,{required:true,readonly:true,options:[v.dept]})}
    ${field('核算组织',v.account,{required:true,readonly:true,options:[v.account]})}
    ${field('公司',v.company,{required:true,readonly:true,options:[v.company]})}
    ${field('备注',v.remark,{textarea:true,span:'base-remark-field',readonly:isExec})}
    ${field('业务类型',v.biz,{required:true,options:opts.businessType,readonly:isExec})}
    ${field('业务日期',v.date,{required:true,type:'date',readonly:isExec})}
    ${checkField('服务范围',true,isExec)}
    ${field('作业组织',v.org,{options:opts.org,readonly:isExec,span:'base-org-field'})}
    ${field('作业组织人员',v.person,{options:opts.people,readonly:isExec,span:'base-person-field'})}
    ${field('经营单位',v.unit,{readonly:true,span:'base-unit-field'})}
    ${field('物流需求单号',v.no,{readonly:true,span:'base-no-field'})}
  </div>`;
  return cubeCard('基础信息',body,{className:'base-card'});
}
function transportFields(isExec,route=null,forceEmpty=false){
  const labels=[['运输类型','select',opts.transport,true],['航运类型','select',opts.shipping,true],['装运类别','select',opts.loadType,true],['操作模式','select',opts.opMode,false],['提单种类','select',opts.billType,false],['是否直航','select',opts.yesNo,false],['装箱方式','select',opts.packing,false],['订箱方式','select',opts.boxMode,false],['揽货方式','select',opts.cargoMode,false],['代理','select',opts.agents,false],['代理代号','select',['CCT202610150013'],false],['代理业务员','input',null,false],['收货地','input',null,false],['收货地（国别）省市区','input',null,false],['收货地详细地址','input',null,false],['起运港','select',opts.ports,true],['起运港（国别）省市区','input',null,false],['起运港服务条款','select',opts.freightTerms,true],['起运码头','input',null,false],['目的港','select',opts.ports,true],['目的港（国别）省市区','input',null,false],['目的港服务条款','select',opts.freightTerms,true],['目的码头','input',null,false],['卸货港','select',opts.ports,false],['卸货港（国别）省市区','input',null,false],['卸货地','input',null,false],['卸货地（国别）省市区','input',null,false],['卸货地详细地址','input',null,false],['交货地','input',null,false],['交货地（国别）省市区','input',null,false],['交货地详细地址','input',null,false],['其他特殊要求','textarea',null,false]];
  const blank=Array(labels.length).fill('');
  const base=forceEmpty?blank:(isExec?['水运','内贸水运','集装箱','','','','FCL','船公司箱（COC）','','','','','','','','富纳富提','大洋洲/图瓦卢','CY','','法马古斯塔','欧洲/塞浦路斯','CY','','','','','','','','','','']:['水运','国际航运','集装箱','','','','FCL','船公司箱（COC）','自揽货','菊风公司传媒有限公司b590c','CCT202610150013','','','','','富纳富提','大洋洲/图瓦卢','DR','','香港','亚洲/中国','DR','','','','','','','','','','']);
  const v=[...base];
  if(!forceEmpty&&isExec&&route){if(route.transportType)v[0]=route.transportType==='公路'?'汽运':route.transportType;if(route.shippingType)v[1]=route.shippingType;if(route.loadType)v[2]=route.loadType;if(route.packing)v[6]=route.packing;if(route.origin)v[15]=route.origin;if(route.originRegion)v[16]=route.originRegion;if(route.originTerm)v[17]=route.originTerm;if(route.destination)v[19]=route.destination;if(route.destinationRegion)v[20]=route.destinationRegion;if(route.destinationTerm)v[21]=route.destinationTerm;if(route.delivery)v[28]=route.delivery;if(route.note)v[31]=route.note;}
  return `<div class="grid-6">${labels.map((x,i)=>{const [label,type,options,required]=x;let val=v[i]||'';if(label==='代理'&&isExec)val=val||'';if(label==='代理代号'&&isExec)val=val||'';return field(label,val,{required,readonly:isExec,options:type==='select'?(val&&options&&options.indexOf(val)<0?[val,...options]:options):null,textarea:type==='textarea'});}).join('')}</div>`;
}
function transportCard(isExec,route=null,forceEmpty=false){return cubeCard('运输要求',transportFields(isExec,route,forceEmpty));}
function voyageFields(isExec,route=null,forceEmpty=false){
  const labels=['起运港ETD','目的港ETA','船东合约号','MBL#','HBL#','订舱单号','船代','货代','船东','船名/呼号/MMSI/IMO','MMSI','船名','航次','航线','靠泊码头','柜期到期日'];
  const values=Array(labels.length).fill('');
  if(!forceEmpty&&isExec&&route){values[0]=route.etd||'';values[1]=route.eta||'';values[3]=route.mbl||'';values[4]=route.hbl||'';values[8]=route.carrier||'';values[11]=route.vessel||'';values[12]=route.voyage||'';values[13]=route.routeName||'';values[14]=route.berth||'';}
  return `<div class="grid-6">${labels.map((label,index)=>{const value=values[index]||'';if(label==='船代'||label==='货代')return field(label,value,{options:opts.shipAgent,readonly:isExec});if(label==='船东')return field(label,value,{options:opts.shipOwner,readonly:isExec});if(label==='航线')return field(label,value,{options:opts.routes,readonly:isExec});if(label.indexOf('ETD')>=0||label.indexOf('ETA')>=0||label==='柜期到期日')return field(label,value,{type:'date',readonly:isExec});return field(label,value,{readonly:isExec,placeholder:label==='船名/呼号/MMSI/IMO'?'请输入内容':'请输入'});}).join('')}</div>`;
}
function voyageCard(isExec,route=null,forceEmpty=false){return cubeCard('航程要求',voyageFields(isExec,route,forceEmpty));}
function containerCard(isExec,route=null){
  const rows=isExec?(route?.containers||[]).map(row=>row.slice(0,5)) : [['20RF','1','XXYU1122334','','']];
  const body=`<div class="table-scroll"><table class="mini-table" style="min-width:1050px"><thead><tr><th style="width:150px">箱型</th><th style="width:150px">数量</th><th style="width:190px">箱号</th><th style="width:260px">集装箱备注</th><th style="width:220px">客户</th><th style="width:80px">操作</th></tr></thead><tbody>${rows.length?rows.map(r=>`<tr>${r.map((v,i)=>`<td><input class="mini-input" value="${esc(v)}" ${i===1?'disabled':''}></td>`).join('')}<td>${isExec?'':'<button class="btn link" style="color:var(--danger)">删除</button>'}</td></tr>`).join(''):`<tr><td colspan="6" class="empty-cell">暂无数据</td></tr>`}</tbody></table></div>`;
  return cubeCard('集装箱列表',body,{actions:isExec?'':'<button class="btn outline-primary mini" data-toast="已模拟新增集装箱">添加</button>'});
}
function sendReceiveCard(isExec){
  const vals=isExec?['','','','','','']:['四边形9607','四边形9607','四边形9604','阿萨法大是大非大幅度发打发打发打发打发','阿萨法大是大非大幅度发打发打发打发打发','阿萨法大是大非大幅度发打发打发打发打发'];
  const labels=['发货人','收货人','通知人','发货人信息','收货人信息','通知人信息'];
  const body=`<div class="grid-3">${labels.map((label,i)=>field(label,vals[i],{readonly:isExec,textarea:i>2,placeholder:i<3?`请输入${label}名称`:`请输入${label.replace('信息','')}地址,联系电话信息`})).join('')}</div>`;
  return cubeCard('收发通信息',body);
}
const multiRouteData=[
  {id:'demand-route-1',index:1,mode:'水运',typeClass:'sea',status:'执行中',tone:'success',origin:'漳州',originRegion:'亚洲/中国',destination:'天津',destinationRegion:'亚洲/中国',etd:'2026-11-20',eta:'2026-11-27',cargo:'花生食品',volume:'10 吨',carrier:'中远海运',transportType:'水运',shippingType:'国内水运',loadType:'集装箱',packing:'FCL',originTerm:'CY',destinationTerm:'CY',delivery:'天津港堆场',vessel:'中远和谐',voyage:'2611S',routeName:'漳州-厦门-天津',mbl:'—',hbl:'HBL202611180001',segmentIds:['segment-1','segment-3'],containers:[['20GP','1','CRXU2026111','CN2026111','花生食品','漳州→厦门首段']]},
  {id:'demand-route-2',index:2,mode:'水运',typeClass:'sea',status:'执行中',tone:'success',origin:'泉州',originRegion:'亚洲/中国',destination:'天津',destinationRegion:'亚洲/中国',etd:'2026-11-20',eta:'2026-11-27',cargo:'玉米',volume:'12 吨',carrier:'中远海运',transportType:'水运',shippingType:'国内水运',loadType:'集装箱',packing:'FCL',originTerm:'CY',destinationTerm:'CY',delivery:'天津港堆场',vessel:'中远和谐',voyage:'2611S',routeName:'泉州-厦门-天津',mbl:'—',hbl:'HBL202611180002',segmentIds:['segment-2','segment-3'],containers:[['20GP','1','CRXU2026112','CN2026112','玉米','泉州→厦门首段']]},
  {id:'demand-route-3',index:3,mode:'水运',typeClass:'sea',status:'执行中',tone:'success',origin:'厦门',originRegion:'亚洲/中国',destination:'天津',destinationRegion:'亚洲/中国',etd:'2026-11-23',eta:'2026-11-27',cargo:'热轧卷板',volume:'18 吨',carrier:'中远海运',transportType:'水运',shippingType:'国内水运',loadType:'集装箱',packing:'FCL',originTerm:'CY',destinationTerm:'CY',delivery:'天津港堆场',vessel:'中远和谐',voyage:'2611S',routeName:'厦门-天津干线',mbl:'—',hbl:'HBL202611180003',segmentIds:['segment-3'],containers:[['40HQ','1','CRXU2026113','CN2026113','热轧卷板','厦门→天津干线']]}
];
const singleOrderRouteData={...multiRouteData[0],id:'single-route',index:1};
function findMultiRouteSegment(id){return multiRouteSegments.find(segment=>segment.id===id);}
const multiRouteExpandedIds=new Set(['demand-route-1']);
const routeGoodsMap={
  'demand-route-1':{orderNo:'FCO202611180001',customer:'青岛绿洲园花生食品有限公司',goodsName:'花生食品',description:'脱皮花生',packages:'400 袋',grossWeight:'10 吨',volume:'16 m³',standardQty:'10 吨',standardQtyValue:10,standardUnit:'吨',demandReferencedQty:10,otherRouteReferencedQty:0,sales:'苏丽蓉'},
  'demand-route-2':{orderNo:'FCO202611180002',customer:'山东港口国际贸易集团有限公司',goodsName:'玉米',description:'进口玉米',packages:'480 袋',grossWeight:'12 吨',volume:'18 m³',standardQty:'12 吨',standardQtyValue:12,standardUnit:'吨',demandReferencedQty:12,otherRouteReferencedQty:0,sales:'苏丽蓉'},
  'demand-route-3':{orderNo:'FCO202611180003',customer:'厦门象屿股份有限公司',goodsName:'热轧卷板',description:'热轧钢卷',packages:'18 卷',grossWeight:'18 吨',volume:'22 m³',standardQty:'18 吨',standardQtyValue:18,standardUnit:'吨',demandReferencedQty:18,otherRouteReferencedQty:0,sales:'苏丽蓉'}
};
let multiRouteServiceView=(EMPTY_MULTI_ROUTE_SERVICE||HIDE_ROUTE_SERVICE_MODULES)?'routes':'segments';
const multiRouteSegments=[
  {id:'segment-1',seq:1,kind:'首段',origin:'漳州',destination:'厦门',mode:'水运',loadType:'集装箱',sourceRouteIds:['demand-route-1'],quantity:'10 吨',productSummary:'花生食品 · 10 吨',serviceStatus:'待完善',etd:'2026-11-20',eta:'2026-11-21',terms:'CY-CY',direct:'否',container:'20GP × 1',remark:'漳州工厂提货后运至厦门港，衔接厦门→天津干线。'},
  {id:'segment-2',seq:2,kind:'首段',origin:'泉州',destination:'厦门',mode:'水运',loadType:'集装箱',sourceRouteIds:['demand-route-2'],quantity:'12 吨',productSummary:'玉米 · 12 吨',serviceStatus:'待完善',etd:'2026-11-20',eta:'2026-11-21',terms:'CY-CY',direct:'否',container:'20GP × 1',remark:'泉州工厂提货后运至厦门港，与客户订单1在厦门汇合。'},
  {id:'segment-3',seq:3,kind:'干线',origin:'厦门',destination:'天津',mode:'水运',loadType:'集装箱',sourceRouteIds:['demand-route-1','demand-route-2','demand-route-3'],quantity:'40 吨',productSummary:'3 条来源 · 40 吨',serviceStatus:'已完善',etd:'2026-11-23',eta:'2026-11-27',terms:'CY-CY',direct:'否',container:'20GP × 2 / 40HQ × 1',remark:'三条客户线路共用厦门→天津干线，按来源订单分别记录商品与数量。'}
];
function demandRouteInfo(label,value){return `<div class="demand-route-field"><span>${label}</span><strong title="${esc(value||'—')}">${esc(value||'—')}</strong></div>`;}
function demandRouteModule(title,body,className=''){return `<section class="demand-route-module ${className}"><div class="demand-route-module-head">${title}</div><div class="demand-route-module-body">${body}</div></section>`;}
const goodsServiceRequirementMap={
  'demand-route-1':[
    {no:'FW202611180001',serviceType:'运输',origin:'漳州',destination:'厦门',transportType:'水运',loadType:'集装箱',detail:'ETD 2026-11-20；ETA 2026-11-21；服务条款 CY-CY；是否直航：否'},
    {no:'FW202611180004',serviceType:'报关',detail:'报关服务；厦门报关行；报关资料已接收'},
    {no:'FW202611180007',serviceType:'仓储',detail:'仓储服务；厦门仓；预计入库 2026-11-21'}
  ],
  'demand-route-2':[
    {no:'FW202611180002',serviceType:'运输',origin:'泉州',destination:'厦门',transportType:'水运',loadType:'集装箱',detail:'ETD 2026-11-20；ETA 2026-11-21；服务条款 CY-CY；是否直航：否'},
    {no:'FW202611180005',serviceType:'报关',detail:'报关服务；厦门报关行；随附客户报关资料'},
    {no:'FW202611180008',serviceType:'仓储',detail:'仓储服务；厦门仓；与线路1货物合并入库'}
  ],
  'demand-route-3':[
    {no:'FW202611180003',serviceType:'运输',origin:'厦门',destination:'天津',transportType:'水运',loadType:'集装箱',detail:'ETD 2026-11-23；ETA 2026-11-27；服务条款 CY-CY；是否直航：否'},
    {no:'FW202611180006',serviceType:'报关',detail:'报关服务；天津报关行；干线到港后办理'},
    {no:'FW202611180009',serviceType:'仓储',detail:'仓储服务；天津仓；到港后暂存'}
  ]
};
function goodsServiceRequirementsFor(route){
  const key=route&&route.id;
  if(goodsServiceRequirementMap[key])return goodsServiceRequirementMap[key];
  return [{no:'FW202611180001',serviceType:'运输',origin:route?.origin||'—',destination:route?.destination||'—',transportType:route?.transportType||route?.mode||'水运',loadType:route?.loadType||'集装箱',detail:route?.detail||`ETD ${route?.etd||'—'}；ETA ${route?.eta||'—'}；服务条款 ${route?.originTerm||'—'}-${route?.destinationTerm||'—'}`}];
}
function goodsServiceRequirementDisplay(item){
  if(item.serviceType==='运输')return `${item.no} ${item.origin} → ${item.destination}（${item.transportType} ${item.loadType}）`;
  return `${item.no} ${item.serviceType}`;
}
function goodsServiceRequirementTooltip(items){
  return `客户订单服务要求 → 运输要求信息：${items.map(item=>item.serviceType==='运输'?`${item.no} 运输要求：${item.origin} → ${item.destination}（${item.transportType} ${item.loadType}）；${item.detail}`:`${item.no} ${item.serviceType}：${item.detail}`).join('；')}`;
}
function goodsServiceRequirementCell(route){
  const items=goodsServiceRequirementsFor(route);
  return `<div class="goods-service-requirement" title="${esc(goodsServiceRequirementTooltip(items))}">${items.map(item=>`<span title="${esc(goodsServiceRequirementTooltip([item]))}">${esc(goodsServiceRequirementDisplay(item))}</span>`).join('')}</div>`;
}
function demandRouteCustomerGoods(route,isExec){
  const goods=routeGoodsMap[route.id]||routeGoodsMap['demand-route-1'];
  const d={order:goods.orderNo,customer:goods.customer,customerNo:'KH202610200037',principalOrg:goods.customer,settlementHeader:goods.customer,date:'2026-10-20',contact:'清清',email:'qingqing@greenharbor.com',sales:goods.sales,agent:'菊风公司传媒有限公司b590c',remark:'自动化订单备注'};
  const tags=['运输','内贸',route.transportType,route.loadType].filter(Boolean).map(tag=>`<span class="order-tag">${esc(tag)}</span>`).join('');
  const meta=(label,value)=>`<div class="related-meta"><span class="related-meta-label">${label}</span><span class="related-meta-value" title="${esc(value||'')}">${value||'—'}</span></div>`;
  return demandRouteModule('客户及商品明细',`<div class="customer-goods-layout"><section class="related-orders-panel"><div class="related-orders-head">查看关联客户订单 <b>（1）</b></div><div class="related-order-card"><div class="related-order-top"><span class="related-order-no">${d.order}</span><span class="external-client">（外部客户）</span><div class="related-order-tags">${tags}</div><button type="button" class="related-order-open" data-customer-order-open="${d.order}" title="在新页签打开客户订单详情" aria-label="在新页签打开客户订单详情"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3h7v7M10 14 21 3M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"/></svg></button></div><div class="related-company-row"><div class="related-company">${d.customer}</div><div class="related-meta"><span class="related-meta-label">委托方组织：</span><span class="related-meta-value" title="${esc(d.principalOrg)}">${d.principalOrg||'—'}</span></div></div><div class="related-meta-grid">${meta('客户单号：',d.customerNo)}${meta('结算抬头：',d.settlementHeader)}${meta('业务日期：',d.date)}${meta('联系人：',d.contact)}${meta('联系人邮箱：',d.email)}${meta('业务员：',d.sales)}${meta('代理：',d.agent)}${meta('备注：',d.remark)}</div></div></section><section class="goods-panel"><div class="goods-panel-head"><span>商品明细列表</span>${isExec?'':'<button type="button" class="btn outline-primary mini" data-product-select="${route.id}">选择商品</button>'}</div><div class="goods-table-scroll"><table class="mini-table customer-goods-table demand-route-goods-table"><thead><tr><th>客户订单编号</th><th>客户</th><th>商品分类</th><th>商品描述</th><th>件数/单位</th><th>毛重/单位</th><th>体积/单位</th><th>标准数量/单位</th><th>服务要求</th><th>贸易合同号（类型）</th><th>操作</th></tr></thead><tbody>${goods.deleted?'<tr><td colspan="11" class="demand-route-goods-empty">暂无商品</td></tr>':`<tr class="selected-goods-row"><td>${goods.orderNo}</td><td>${goods.customer}</td><td>${goods.category||goods.goodsName}</td><td>${goods.description}</td><td><span class="goods-cell-value">${goods.packages}</span></td><td><span class="goods-cell-value">${goods.grossWeight}</span></td><td><span class="goods-cell-value">${goods.volume}</span></td><td>${isExec?`<span class="goods-cell-value">${goods.standardQty}</span>`:`<div class="demand-route-qty-editor"><input type="number" min="0" step="0.01" value="${goods.standardQtyValue}" data-demand-product-qty="${route.id}"><span>${goods.standardUnit}</span></div>`}</td><td>${goodsServiceRequirementCell(route)}</td><td><span class="goods-cell-value">HT202610200037</span></td><td>${isExec?'<button type="button" class="btn link" data-doc-open="FCO202610200037">查看</button>':`<button type="button" class="btn link danger-text" data-demand-product-remove="${route.id}">删除</button>`}</td></tr>`}</tbody></table></div></section></div>`,'demand-route-customer-goods');
}
function demandRouteCard(route,index,isExec){
  const expanded=multiRouteExpandedIds.has(route.id);const form=isExec?null:getMultiRouteForm(route.id);const status=isExec?route.status:'待完善';const tone=isExec?route.tone:'warning';
  const forceEmpty=EMPTY_MULTI_ROUTE_SERVICE;
  const transportContent=isExec?transportFields(true,route,forceEmpty):`<div class="grid-6">${editableTransportFields(form,(label,key,options)=>routeCf(route.id,label,key,options),forceEmpty)}</div>`;
  const showVoyage=isExec||forceEmpty||form.transportType==='水运';const voyageContent=isExec?voyageFields(true,route,forceEmpty):`<div class="grid-6">${editableVoyageFields(form,(label,key,options)=>routeCf(route.id,label,key,options))}</div>`;
  const containerRows=forceEmpty?'':route.containers.map(row=>`<tr>${row.map((value,cellIndex)=>`<td>${cellIndex===0?`<span class="demand-route-container-type">${esc(value)}</span>`:esc(value)}</td>`).join('')}</tr>`).join('');
  const routeServiceContent=HIDE_ROUTE_SERVICE_MODULES?'':`<div class="demand-route-module-grid">${demandRouteModule('运输要求',transportContent,'demand-route-transport')}${showVoyage?demandRouteModule('航程要求',voyageContent,'demand-route-voyage'):''}</div>${demandRouteModule('集装箱/载具明细',`<div class="demand-route-table-wrap"><table class="mini-table demand-route-container-table"><thead><tr><th>箱型/载具</th><th>数量</th><th>箱号/车次</th><th>封号</th><th>货物</th><th>备注</th></tr></thead><tbody>${containerRows||'<tr><td colspan="6" class="demand-route-goods-empty">暂无集装箱/载具数据</td></tr>'}</tbody></table></div>`)}`;
  const headerEtd=(forceEmpty||HIDE_ROUTE_SERVICE_MODULES)?'—':(isExec?route.etd:(form.etd||'待填写'));const headerEta=(forceEmpty||HIDE_ROUTE_SERVICE_MODULES)?'—':(isExec?route.eta:(form.eta||'待填写'));
  return `<article class="demand-route-card ${expanded?'':'is-collapsed'}" id="${route.id}" data-demand-route-card><header class="demand-route-card-head"><div class="demand-route-card-title"><span class="demand-route-index">线路${route.index}</span><strong>${route.origin} → ${route.destination}</strong><span class="demand-route-type ${route.typeClass}">${route.mode}</span><span class="doc-status ${tone}">${status}</span></div><div class="demand-route-card-metrics"><span>ETD <b>${headerEtd}</b></span><span>ETA <b>${headerEta}</b></span><span>货量 <b>${route.volume}</b></span>${isExec?' ':`<button type="button" class="demand-route-remove" data-demand-route-remove="${route.id}">删除线路</button>`}<button type="button" class="demand-route-toggle" data-demand-route-toggle aria-expanded="${expanded}"><span>${expanded?'收起':'展开'}</span><i>⌄</i></button></div></header><div class="demand-route-card-body">${demandRouteCustomerGoods(route,isExec)}${routeServiceContent}</div></article>`;
}
function multiRouteSegmentSources(segment){return segment.sourceRouteIds.map(routeId=>{const route=multiRouteData.find(item=>item.id===routeId);const goods=routeGoodsMap[routeId];return {routeId,route,goods};}).filter(item=>item.route&&item.goods);}
function renderRouteSegmentNetwork(){
  return `<section class="route-network-card"><div class="route-network-head"><div><strong>客户线路与运输段关系</strong><span>同一运输段可关联多个客户订单线路，蓝色节点为汇合节点</span></div><span class="route-network-legend"><i class="customer"></i>客户线路<i class="segment"></i>运输段</span></div><div class="route-network-list">${multiRouteData.map(route=>{const segments=(route.segmentIds||[]).map(findMultiRouteSegment).filter(Boolean);const nodes=segments.length?[segments[0].origin,...segments.map(segment=>segment.destination)]:[route.origin,route.destination];const goods=routeGoodsMap[route.id];return `<div class="route-network-row"><div class="route-network-order"><span>客户订单${route.index}</span><strong>${esc(goods.orderNo)}</strong><small>${esc(goods.goodsName)} · ${esc(goods.standardQty)}</small></div><div class="route-network-path">${nodes.map((node,index)=>{const isHub=node==='厦门';const connector=index<nodes.length-1?`<span class="route-network-connector"><small>${esc(segments[index]?.kind||'运输')} ${esc(segments[index]?.id.replace('segment-','SEG-')||'')}</small><i></i></span>`:'';return `<span class="route-network-node ${isHub?'is-hub':''} ${index===0?'is-start':''} ${index===nodes.length-1?'is-end':''}">${esc(node)}</span>${connector}`;}).join('')}</div><div class="route-network-segments">${segments.map(segment=>`<button type="button" class="route-network-segment-tag ${segment.kind==='干线'?'is-main':''}" data-route-segment-open="${segment.id}">${esc(segment.kind)} · ${esc(segment.origin)}→${esc(segment.destination)}</button>`).join('')}</div></div>`;}).join('')}</div></section>`;
}
function renderRouteSegmentTable(isExec){
  return `<section class="route-segment-workbench"><div class="route-segment-workbench-head"><div><div class="route-segment-workbench-title">物流运输段 <b>${multiRouteSegments.length}</b></div><span>按运输段维护服务要求，共享干线只录入一次</span></div><div class="route-segment-workbench-actions"><span class="route-balance-chip">数量校验 已平衡</span><button type="button" class="btn primary mini" data-generate-route-segments>生成运输段</button></div></div><div class="route-segment-table-wrap"><table class="route-segment-table"><colgroup><col style="width:44px"><col style="width:76px"><col style="width:84px"><col style="width:84px"><col style="width:72px"><col style="width:84px"><col style="width:142px"><col style="width:132px"><col style="width:70px"><col style="width:132px"><col style="width:70px"><col style="width:92px"></colgroup><thead><tr><th>序号</th><th>段类型</th><th>起运地</th><th>目的地</th><th>运输方式</th><th>关联需求</th><th>商品 / 数量</th><th>服务要求</th><th>状态</th><th>计划时间</th><th>共享</th><th>操作</th></tr></thead><tbody>${multiRouteSegments.map(segment=>{const sources=multiRouteSegmentSources(segment);return `<tr data-route-segment-row="${segment.id}"><td><span class="route-segment-seq">${String(segment.seq).padStart(2,'0')}</span></td><td><span class="route-segment-kind ${segment.kind==='干线'?'is-main':'is-first'}">${esc(segment.kind)}</span></td><td><strong class="route-segment-place">${esc(segment.origin)}</strong></td><td><strong class="route-segment-place">${esc(segment.destination)}</strong></td><td><span class="route-segment-mode">${esc(segment.mode)}</span></td><td><button type="button" class="route-source-summary" data-route-segment-open="${segment.id}"><span>${sources.length} 条来源</span><small>${sources.map(source=>source.route.index).map(index=>`订单${index}`).join('、')}</small></button></td><td><div class="route-segment-product"><strong>${esc(segment.productSummary)}</strong><span>${esc(segment.loadType)} · ${esc(segment.container)}</span></div></td><td><div class="route-segment-service"><strong>${esc(segment.terms)}</strong><span>${esc(segment.mode)} · ${esc(segment.loadType)}</span></div></td><td><span class="route-segment-status ${segment.serviceStatus==='已完善'?'is-complete':'is-pending'}">${esc(segment.serviceStatus)}</span></td><td><div class="route-segment-time"><strong>${esc(segment.etd)}</strong><span>至 ${esc(segment.eta)}</span></div></td><td>${segment.sourceRouteIds.length>1?'<span class="route-shared-badge">共享干线</span>':'<span class="route-shared-empty">—</span>'}</td><td><button type="button" class="btn outline-primary mini" data-route-segment-open="${segment.id}">${segment.serviceStatus==='已完善'?'查看/编辑':'去完善'}</button></td></tr>`;}).join('')}</tbody></table></div><div class="route-segment-rule"><span class="route-segment-rule-icon">i</span><span><strong>合并规则：</strong>起运地、目的地、运输方式、装运类别和服务时间兼容时，允许多条客户线路共用同一运输段；船期、箱型或服务条款不一致时，系统提示拆分为独立运输段。</span></div></section>`;
}
function renderRouteSegmentPlanning(isExec){
  const totalSources=multiRouteSegments.reduce((sum,segment)=>sum+segment.sourceRouteIds.length,0);
  const totalQuantity=multiRouteData.reduce((sum,route)=>sum+Number(routeGoodsMap[route.id]?.standardQtyValue||0),0);
  const sharedCount=multiRouteSegments.filter(segment=>segment.sourceRouteIds.length>1).length;
  return `<div class="route-planning-panel"><div class="route-planning-summary"><article><span>客户订单线路</span><strong>${multiRouteData.length}</strong><small>来自 ${new Set(multiRouteData.map(route=>routeGoodsMap[route.id]?.orderNo).filter(Boolean)).size} 个客户订单</small></article><article><span>物流运输段</span><strong>${multiRouteSegments.length}</strong><small>首段 ${multiRouteSegments.filter(segment=>segment.kind==='首段').length} · 干线 ${multiRouteSegments.filter(segment=>segment.kind==='干线').length}</small></article><article><span>共享运输段</span><strong>${sharedCount}</strong><small>${sharedCount?'厦门→天津干线已合并':'暂无合并运输段'}</small></article><article class="route-planning-balance"><span>已分配数量</span><strong>${totalQuantity} 吨</strong><small>${totalSources} 条运输段关联 · ${isExec?'数量校验已平衡':'明细已带入，可继续编辑'}</small></article></div>${renderRouteSegmentNetwork()}${renderRouteSegmentTable(isExec)}</div>`;
}
function renderMultiRouteRoutesPanel(isExec){const activeId=multiRouteData.find(route=>multiRouteExpandedIds.has(route.id))?.id||multiRouteData[0].id;const panelHidden=(multiRouteServiceView==='routes'||HIDE_ROUTE_SERVICE_MODULES)?'':'hidden';return `<div class="multi-route-routes-panel" data-multi-route-panel="routes" ${panelHidden}><div class="demand-route-toolbar"><div class="demand-route-anchor-tabs" role="tablist" aria-label="多线路快速定位">${multiRouteData.map(route=>`<button type="button" class="demand-route-anchor-tab ${route.id===activeId?'active':''}" data-demand-route-anchor="${route.id}"><i class="${route.typeClass}"></i><span>线路${route.index}</span><small>${route.origin} → ${route.destination}</small></button>`).join('')}</div><div class="demand-route-total"><span>客户线路</span><strong>${multiRouteData.length}</strong>${HIDE_ROUTE_SERVICE_MODULES?'':'<span>集装箱</span><strong>3</strong>'}<button type="button" class="btn outline-primary mini" data-demand-route-all>全部展开</button></div></div><div class="demand-route-list">${multiRouteData.map((route,index)=>demandRouteCard(route,index,isExec)).join('')}</div></div>`;}
function renderMultiRouteServicePanel(isExec){const title=HIDE_ROUTE_SERVICE_MODULES?'客户订单线路与商品':'多线路服务要求';const subtitle=HIDE_ROUTE_SERVICE_MODULES?`${multiRouteData.length} 条客户线路`: `${multiRouteData.length} 条客户线路 · ${multiRouteSegments.length} 个运输段`;const sourceHint=HIDE_ROUTE_SERVICE_MODULES?'该物流需求由客户订单直接生成委托，运输要求、航程要求和集装箱列表请在物流委托中维护': (EMPTY_MULTI_ROUTE_SERVICE?'运输要求、航程要求和集装箱列表由客户订单多线路生成，当前显示为空，请后续补充':'客户线路用于追溯，服务要求按物流运输段维护');const viewSwitch=HIDE_ROUTE_SERVICE_MODULES?'':`<div class="multi-route-view-switch" role="tablist" aria-label="多线路服务要求视图"><button type="button" class="multi-route-view-btn ${multiRouteServiceView==='segments'?'active':''}" data-multi-route-view="segments" role="tab" aria-selected="${multiRouteServiceView==='segments'}">按运输段</button><button type="button" class="multi-route-view-btn ${multiRouteServiceView==='routes'?'active':''}" data-multi-route-view="routes" role="tab" aria-selected="${multiRouteServiceView==='routes'}">按客户线路</button></div>`;const segmentsPanel=HIDE_ROUTE_SERVICE_MODULES?'':`<div class="multi-route-segments-panel" data-multi-route-panel="segments" ${multiRouteServiceView==='segments'?'':'hidden'}>${renderRouteSegmentPlanning(isExec)}</div>`;return `<section class="cube-card demand-route-hub ${HIDE_ROUTE_SERVICE_MODULES?'is-direct-entrust':''}"><div class="cube-head demand-route-hub-head"><div class="demand-route-hub-title"><span>${title}</span><b>${subtitle}</b></div><div class="demand-route-hub-actions"><span>${sourceHint}</span>${viewSwitch}</div></div><div class="demand-route-hub-body">${segmentsPanel}${renderMultiRouteRoutesPanel(isExec)}</div></section>`;}
function syncDemandRouteToggle(card){const collapsed=card.classList.contains('is-collapsed');const button=card.querySelector('[data-demand-route-toggle]');if(!button)return;button.setAttribute('aria-expanded',String(!collapsed));button.querySelector('span').textContent=collapsed?'展开':'收起';}
document.addEventListener('click',event=>{const anchor=event.target.closest('[data-demand-route-anchor]');if(anchor){const card=document.getElementById(anchor.dataset.demandRouteAnchor);if(!card)return;multiRouteExpandedIds.add(card.id);card.classList.remove('is-collapsed');syncDemandRouteToggle(card);anchor.closest('.demand-route-anchor-tabs')?.querySelectorAll('[data-demand-route-anchor]').forEach(button=>button.classList.toggle('active',button===anchor));card.scrollIntoView({behavior:'smooth',block:'start'});return;}const toggle=event.target.closest('[data-demand-route-toggle]');if(toggle){const card=toggle.closest('[data-demand-route-card]');card.classList.toggle('is-collapsed');if(card.classList.contains('is-collapsed'))multiRouteExpandedIds.delete(card.id);else multiRouteExpandedIds.add(card.id);syncDemandRouteToggle(card);return;}const all=event.target.closest('[data-demand-route-all]');if(all){const hub=all.closest('.demand-route-hub');const cards=[...hub.querySelectorAll('[data-demand-route-card]')];const shouldExpand=cards.some(card=>card.classList.contains('is-collapsed'));cards.forEach(card=>{card.classList.toggle('is-collapsed',!shouldExpand);if(shouldExpand)multiRouteExpandedIds.add(card.id);else multiRouteExpandedIds.delete(card.id);syncDemandRouteToggle(card);});all.textContent=shouldExpand?'全部收起':'全部展开';}});
function routeSegmentOptions(items,selected){return items.map(item=>`<option ${item===selected?'selected':''}>${esc(item)}</option>`).join('');}
function openRouteSegmentDrawer(segmentId){
  const segment=findMultiRouteSegment(segmentId);if(!segment)return;
  document.querySelectorAll('.route-segment-drawer-backdrop').forEach(node=>node.remove());
  const sources=multiRouteSegmentSources(segment);
  const sourceRows=sources.map(({route,goods})=>`<tr><td><span class="route-source-order">${esc(goods.orderNo)}</span><small>客户订单${route.index}</small></td><td>${esc(goods.customer)}</td><td><span class="route-source-path">${esc(route.origin)} → ${esc(route.destination)}</span></td><td>${esc(goods.goodsName)}</td><td><strong>${esc(goods.standardQty)}</strong></td></tr>`).join('');
  const overlay=document.createElement('div');overlay.className='route-segment-drawer-backdrop';
  overlay.innerHTML=`<aside class="route-segment-drawer" role="dialog" aria-modal="true" aria-labelledby="routeSegmentDrawerTitle"><header class="route-segment-drawer-head"><div><div class="route-segment-drawer-kicker">运输段服务要求</div><h2 id="routeSegmentDrawerTitle">${esc(segment.kind)} · ${esc(segment.origin)} → ${esc(segment.destination)}</h2><p>服务要求归属于当前运输段，共享段修改后将同步影响所关联的客户订单线路。</p></div><button type="button" class="route-segment-drawer-close" data-segment-drawer-close aria-label="关闭">×</button></header><div class="route-segment-drawer-body"><section class="route-segment-summary"><div><span>运输方式</span><strong>${esc(segment.mode)} · ${esc(segment.loadType)}</strong></div><div><span>关联客户线路</span><strong>${sources.length} 条</strong></div><div><span>商品数量</span><strong>${esc(segment.quantity)}</strong></div><div><span>共享情况</span><strong>${sources.length>1?'共享干线':'独立运输段'}</strong></div></section><section class="route-segment-drawer-section"><div class="route-segment-drawer-section-head"><h3>来源需求</h3><span>共享运输段不会复制客户线路，只记录关联与数量分配</span></div><div class="route-source-table-wrap"><table class="route-source-table"><thead><tr><th>客户订单</th><th>客户</th><th>客户要求线路</th><th>商品</th><th>分配数量</th></tr></thead><tbody>${sourceRows}</tbody></table></div></section><section class="route-segment-drawer-section"><div class="route-segment-drawer-section-head"><h3>服务要求</h3><span>录入后将用于创建对应物流安排任务</span></div><div class="route-segment-form-grid"><label><span>段类型</span><select data-segment-field="kind">${routeSegmentOptions(['首段','中间段','干线','末段'],segment.kind)}</select></label><label><span>运输方式</span><select data-segment-field="mode">${routeSegmentOptions(['水运','铁运','汽运','航空'],segment.mode)}</select></label><label><span>起运地</span><input data-segment-field="origin" value="${esc(segment.origin)}"></label><label><span>目的地</span><input data-segment-field="destination" value="${esc(segment.destination)}"></label><label><span>装运类别</span><select data-segment-field="loadType">${routeSegmentOptions(['集装箱','散货','件杂','整车'],segment.loadType)}</select></label><label><span>服务条款</span><input data-segment-field="terms" value="${esc(segment.terms)}"></label><label><span>计划发运时间</span><input type="date" data-segment-field="etd" value="${esc(segment.etd)}"></label><label><span>计划到达时间</span><input type="date" data-segment-field="eta" value="${esc(segment.eta)}"></label><label><span>是否直航</span><select data-segment-field="direct">${routeSegmentOptions(['是','否'],segment.direct)}</select></label><label><span>集装箱 / 载具</span><input data-segment-field="container" value="${esc(segment.container)}"></label><label class="span-2"><span>运输段备注</span><textarea data-segment-field="remark" rows="3">${esc(segment.remark)}</textarea></label></div></section></div><footer class="route-segment-drawer-foot"><span>保存后将更新运输段状态和服务要求</span><div><button type="button" class="btn" data-segment-drawer-close>取消</button><button type="button" class="btn primary" data-segment-drawer-save="${segment.id}">保存服务要求</button></div></footer></aside>`;
  document.body.appendChild(overlay);document.body.classList.add('route-segment-drawer-open');
  const close=()=>{overlay.remove();document.body.classList.remove('route-segment-drawer-open');};
  overlay.addEventListener('click',event=>{
    if(event.target===overlay||event.target.closest('[data-segment-drawer-close]')){close();return;}
    const save=event.target.closest('[data-segment-drawer-save]');
    if(save){overlay.querySelectorAll('[data-segment-field]').forEach(field=>{segment[field.dataset.segmentField]=field.value;});segment.serviceStatus='已完善';close();rerenderDetailPreservingScroll();toast('运输段服务要求已保存');}
  });
}
function openRouteSegmentGenerateDialog(){
  document.querySelectorAll('.route-segment-generate-overlay').forEach(node=>node.remove());
  const overlay=document.createElement('div');overlay.className='route-segment-generate-overlay';
  overlay.innerHTML=`<section class="route-segment-generate-modal" role="dialog" aria-modal="true" aria-labelledby="routeSegmentGenerateTitle"><header><div><h3 id="routeSegmentGenerateTitle">生成物流运输段</h3><p>选择客户订单线路和生成策略，系统将识别可合并的相同运输段。</p></div><button type="button" data-segment-generate-close aria-label="关闭">×</button></header><div class="route-segment-generate-body"><section class="route-generate-source"><div class="route-generate-section-head"><strong>选择客户线路</strong><span>已选 <b data-generate-selected-count>${multiRouteData.length}</b> 条</span></div>${multiRouteData.map(route=>{const goods=routeGoodsMap[route.id];return `<label class="route-generate-source-row"><input type="checkbox" data-generate-route="${route.id}" checked><span class="route-generate-route-index">线路${route.index}</span><span class="route-generate-route-main"><strong>${esc(goods.orderNo)}</strong><small>${esc(route.origin)} → ${esc(route.destination)}</small></span><span class="route-generate-route-goods">${esc(goods.goodsName)} · ${esc(goods.standardQty)}</span></label>`;}).join('')}</section><section class="route-generate-strategy"><div class="route-generate-section-head"><strong>生成策略</strong></div><label class="route-strategy-card"><input type="radio" name="routeGenerateStrategy" value="merge" checked><span class="route-strategy-radio"></span><span><strong>合并相同运输段</strong><small>推荐。厦门→天津识别为共享干线，关联客户订单1、2、3。</small></span><em>预计 3 段</em></label><label class="route-strategy-card"><input type="radio" name="routeGenerateStrategy" value="separate"><span class="route-strategy-radio"></span><span><strong>按客户线路分别生成</strong><small>每条客户线路独立生成运输段，适合船期、箱型或服务条款不一致的情况。</small></span><em>预计 6 段</em></label></section><div class="route-generate-preview"><span>生成预览</span><strong>首段 2 个 · 干线 1 个 · 共享干线 1 个</strong><small>生成后仍可在运输段列表中拆分、调整关联需求和维护服务要求。</small></div></div><footer><button type="button" class="btn" data-segment-generate-close>取消</button><button type="button" class="btn primary" data-segment-generate-confirm>确认生成运输段</button></footer></section>`;
  document.body.appendChild(overlay);
  const syncCount=()=>{const count=overlay.querySelectorAll('[data-generate-route]:checked').length;overlay.querySelector('[data-generate-selected-count]').textContent=count;};
  overlay.addEventListener('change',event=>{if(event.target.matches('[data-generate-route]'))syncCount();});
  overlay.addEventListener('click',event=>{
    if(event.target===overlay||event.target.closest('[data-segment-generate-close]')){overlay.remove();return;}
    if(event.target.closest('[data-segment-generate-confirm]')){const count=overlay.querySelectorAll('[data-generate-route]:checked').length;if(!count){toast('请至少选择一条客户订单线路');return;}const merge=overlay.querySelector('input[name="routeGenerateStrategy"]:checked')?.value==='merge';overlay.remove();toast(merge?'已生成 3 个运输段，其中厦门→天津为共享干线':'已按客户线路生成独立运输段');}
  });
}
document.addEventListener('click',event=>{
  const viewButton=event.target.closest('[data-multi-route-view]');
  if(viewButton){const hub=viewButton.closest('.demand-route-hub');multiRouteServiceView=viewButton.dataset.multiRouteView;hub.querySelectorAll('[data-multi-route-view]').forEach(button=>{const active=button===viewButton;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));});hub.querySelectorAll('[data-multi-route-panel]').forEach(panel=>{panel.hidden=panel.dataset.multiRoutePanel!==multiRouteServiceView;});return;}
  const segmentOpen=event.target.closest('[data-route-segment-open]');
  if(segmentOpen){openRouteSegmentDrawer(segmentOpen.dataset.routeSegmentOpen);return;}
  if(event.target.closest('[data-generate-route-segments]')){openRouteSegmentGenerateDialog();}
});
function demandProductValidationMessages(){
  const messages=[];
  multiRouteData.forEach(route=>{
    const goods=routeGoodsMap[route.id];
    if(!goods||goods.deleted)return;
    const qty=Number(goods.standardQtyValue||0);
    const demandRef=Number(goods.demandReferencedQty||0);
    const otherRef=Number(goods.otherRouteReferencedQty||0);
    if(demandRef>0&&qty<demandRef)messages.push(`线路${route.index}商品“${goods.goodsName}”当前数量 ${qty}${goods.standardUnit}，小于物流需求单已引用数量 ${demandRef}${goods.standardUnit}。`);
    if(otherRef>0&&qty<otherRef)messages.push(`线路${route.index}商品“${goods.goodsName}”当前数量 ${qty}${goods.standardUnit}，小于其他线路引用总数量 ${otherRef}${goods.standardUnit}。`);
  });
  return messages;
}
function demandDeleteValidationMessages(routeId){
  const messages=[];const route=multiRouteData.find(item=>item.id===routeId);const goods=routeGoodsMap[routeId];if(!route||!goods||goods.deleted)return messages;
  if(Number(goods.demandReferencedQty||0)>0)messages.push(`商品“${goods.goodsName}”已被物流需求单引用，商品行和所属线路不允许删除。`);
  if(Number(goods.otherRouteReferencedQty||0)>0)messages.push(`商品“${goods.goodsName}”已被其他线路引用，商品行和所属线路不允许删除。`);
  return messages;
}
function showDemandValidationDialog(messages){
  document.querySelectorAll('.demand-validation-overlay').forEach(node=>node.remove());
  const overlay=document.createElement('div');overlay.className='demand-validation-overlay';
  overlay.innerHTML=`<section class="demand-validation-modal" role="dialog" aria-modal="true" aria-labelledby="demandValidationTitle"><header><h3 id="demandValidationTitle">操作校验未通过</h3><button type="button" data-demand-validation-close aria-label="关闭">×</button></header><div class="demand-validation-body"><p>当前数据存在以下引用限制：</p><ul>${messages.map(message=>`<li>${esc(message)}</li>`).join('')}</ul></div><footer><button type="button" class="btn primary" data-demand-validation-close>知道了</button></footer></section>`;
  document.body.appendChild(overlay);overlay.addEventListener('click',event=>{if(event.target===overlay||event.target.closest('[data-demand-validation-close]'))overlay.remove();});
}
document.addEventListener('click',event=>{
  const customerOrderOpen=event.target.closest('[data-customer-order-open]');
  if(customerOrderOpen){const url=new URL('customer-order-detail-prototype.html',window.location.href);url.searchParams.set('no',customerOrderOpen.dataset.customerOrderOpen);window.open(url.href,'_blank','noopener');return;}
  const versionButton=event.target.closest('[data-version-maintain]');
  if(versionButton){const nextVersion=currentDemandVersion+1;const params={no:state.activeRowId,mode:'create',version:nextVersion,source:LOGISTICS_SOURCE_MODE};if(HIDE_ROUTE_SERVICE_MODULES)params.maintenance='1';window.location.href=prototypeUrl(prototypeDetailFile('create'),params);return;}
  const routeButton=event.target.closest('[data-demand-route-remove]');
  if(routeButton){const routeId=routeButton.dataset.demandRouteRemove;const messages=demandDeleteValidationMessages(routeId);if(messages.length)showDemandValidationDialog(messages);else toast('线路已删除');return;}
  const productButton=event.target.closest('[data-demand-product-remove]');
  if(productButton){const routeId=productButton.dataset.demandProductRemove;const messages=demandDeleteValidationMessages(routeId);if(messages.length)showDemandValidationDialog(messages);else{routeGoodsMap[routeId].deleted=true;render();toast('商品已删除');}return;}
  const submitButton=event.target.closest('[data-demand-submit]');
  if(submitButton){const messages=MULTI_ROUTE_VIEW&&state.page==='create'?demandProductValidationMessages():[];if(messages.length)showDemandValidationDialog(messages);else toast('校验通过，已提交审批');}
});
document.addEventListener('input',event=>{const input=event.target.closest('[data-demand-product-qty]');if(!input||!MULTI_ROUTE_VIEW||state.page!=='create')return;const goods=routeGoodsMap[input.dataset.demandProductQty];if(!goods)return;goods.standardQtyValue=Number(input.value||0);goods.standardQty=`${goods.standardQtyValue} ${goods.standardUnit}`;});
const productPickerOrders=[
  {order:'FCO202611160011',status:'待安排',customer:'青岛绿洲园花生食品有限公司',summary:'包含 1 种商品',total:'10',arranged:'0吨',unarranged:'10',origin:'上官栗子四果汤(文...',destination:'古石雕大观园',business:'内贸',scope:'运输',expanded:true,products:[{name:'玉米',total:'10',arranged:'0',unarranged:'10',unit:'吨'}]},
  {order:'FCO202611050015',status:'待安排',customer:'青岛绿洲园花生食品有限公司',summary:'玉米',total:'1',arranged:'0千克',unarranged:'1',origin:'',destination:'',business:'内贸',scope:'运输',products:[{name:'玉米',total:'1',arranged:'0',unarranged:'1',unit:'千克'}]},
  {order:'FCO202610290013',status:'待安排',customer:'青岛绿洲园花生食品有限公司',summary:'玉米',total:'10',arranged:'0吨',unarranged:'10',origin:'上官栗子四果汤(文...',destination:'古石雕大观园',business:'内贸',scope:'运输',products:[{name:'玉米',total:'10',arranged:'0',unarranged:'10',unit:'吨'}]},
  {order:'FCO202610290011',status:'待安排',customer:'青岛绿洲园花生食品有限公司',summary:'玉米',total:'10',arranged:'0吨',unarranged:'10',origin:'上官栗子四果汤(文...',destination:'古石雕大观园',business:'内贸',scope:'运输',products:[{name:'玉米',total:'10',arranged:'0',unarranged:'10',unit:'吨'}]},
  {order:'FCO202610270030',status:'待安排',customer:'成都柠檬时光科技有限公司',summary:'玉米',total:'10',arranged:'0吨',unarranged:'10',origin:'上官栗子四果汤(文...',destination:'古石雕大观园',business:'内贸',scope:'运输',products:[{name:'玉米',total:'10',arranged:'0',unarranged:'10',unit:'吨'}]},
  {order:'FCO202610220017',status:'待安排',customer:'青岛绿洲园花生食品有限公司',summary:'玉米',total:'10',arranged:'10',unarranged:'0吨',origin:'上官栗子四果汤(文...',destination:'古石雕大观园',business:'内贸',scope:'运输',products:[{name:'玉米',total:'10',arranged:'10',unarranged:'0',unit:'吨'}]},
  {order:'FCO202610150005',status:'待安排',customer:'中联铁运集团有限公司',summary:'玉米',total:'1',arranged:'1',unarranged:'0吨',origin:'上官栗子四果汤(文...',destination:'古石雕大观园',business:'内贸',scope:'运输',products:[{name:'玉米',total:'1',arranged:'1',unarranged:'0',unit:'吨'}]}
];
const demandExtraGoods=new Map();
function demandGoodsKey(){return state.activeRowId||'single';}
function demandExtraGoodsList(){return demandExtraGoods.get(demandGoodsKey())||[];}
function pushDemandGoods(rows){const key=demandGoodsKey();const list=demandExtraGoods.get(key)||[];rows.forEach(row=>{if(!list.some(item=>item.key===row.key))list.push(row);});demandExtraGoods.set(key,list);}
function removeDemandGoods(key){const list=demandExtraGoods.get(demandGoodsKey())||[];demandExtraGoods.set(demandGoodsKey(),list.filter(item=>item.key!==key));}
function openProductPicker(routeId){
  document.querySelectorAll('.pd-picker-overlay').forEach(node=>node.remove());
  const rows=productPickerOrders.flatMap(order=>order.products.map((product,index)=>({
    key:`${order.order}:${index}`,
    order:order.order,
    status:order.status||'待安排',
    customer:order.customer,
    goods:product.name,
    total:product.total,
    totalUnit:product.unit||'吨',
    arranged:(order.arranged||'0').replace(/[^0-9.]/g,'')||'0',
    arrangedUnit:product.unit||'吨',
    unarranged:(product.unarranged||'0').replace(/[^0-9.]/g,'')||'0',
    unarrangedUnit:product.unit||'吨',
    origin:order.origin||'厦门',
    destination:order.destination||'长滩',
    business:order.business||'内贸',
    scope:order.scope||'运输',
    transport:'水运',
    loadType:'集装箱',
    sales:'魏勇',
    company:'厦门建发供应链物流科技有限公司',
    dept:'海运部',
    creator:'苏丽蓉',
    createAt:'2026-11-10 11:43:16',
    modifier:'苏丽蓉',
    modifyAt:'2026-11-10 11:43:56',
    pieces:'50',
    gross:product.total,
    volume:'20'
  })));
  const selected=new Set();
  const overlay=document.createElement('div');
  overlay.className='pd-picker-overlay';
  const columns=[
    ['order','客户订单编号'],['status','状态'],['customer','客户'],['goods','商品名称'],['total','总数量'],
    ['arranged','已安排数量'],['unarranged','未安排数量'],['origin','起运地'],['destination','目的地'],
    ['business','业务类型'],['scope','服务范围'],['transport','运输类型'],['loadType','装运方式'],
    ['sales','业务员'],['company','公司'],['dept','部门'],['creator','创建人'],['createAt','创建时间'],
    ['modifier','修改人'],['modifyAt','修改时间']
  ];
  overlay.innerHTML=`<section class="pd-picker-modal" role="dialog" aria-modal="true" aria-labelledby="pdPickerTitle">
    <header class="pd-picker-head"><h2 id="pdPickerTitle">选择商品</h2><button type="button" class="pd-picker-close" data-pd-close aria-label="关闭">&times;</button></header>
    <div class="pd-picker-body">
      <section class="pd-picker-query" data-pd-query-card>
        <div class="pd-picker-query-head"><button type="button" class="pd-picker-query-toggle" data-pd-query-toggle aria-expanded="true"><span class="pd-caret">▾</span>查询条件</button><div class="pd-picker-query-actions"><button type="button" class="btn outline-primary mini" data-pd-reset>重置</button><button type="button" class="btn primary mini" data-pd-search>查询</button></div></div>
        <div class="pd-picker-query-body" data-pd-query-body>
          <label class="pd-field"><span>客户订单编号</span><input type="text" data-pd-filter="order" placeholder="请输入"></label>
          <label class="pd-field"><span>客户</span><select data-pd-filter="customer"><option value="">请选择</option></select></label>
          <label class="pd-field"><span>商品名称</span><input type="text" data-pd-filter="goods" placeholder="请输入"></label>
          <label class="pd-field"><span>业务类型</span><select data-pd-filter="business"><option value="">请选择</option></select></label>
          <label class="pd-field"><span>运输方式</span><select data-pd-filter="transport"><option value="">请选择</option><option>水运</option><option>空运</option><option>汽运</option></select></label>
        </div>
      </section>
      <div class="pd-picker-tablebar"><span class="pd-picker-count" data-pd-count></span><button type="button" class="btn link" data-pd-columns>列</button></div>
      <div class="pd-picker-tablewrap">
        <table class="pd-picker-table">
          <thead><tr><th class="pd-check"><input type="checkbox" data-pd-all aria-label="全选"></th>${columns.map(([key,label])=>`<th>${label}</th>`).join('')}</tr></thead>
          <tbody data-pd-body></tbody>
        </table>
      </div>
      <div class="pd-picker-pager"><span>共 <b data-pd-total>0</b> 条</span><button type="button" class="pd-page is-active">1</button><span class="pd-page-size">20条/页</span></div>
    </div>
    <footer class="pd-picker-foot">
      <div class="pd-picker-stats"><span>已选订单数<b data-pd-stat-orders>0</b></span><span>已选商品项<b data-pd-stat-items>0</b></span><span>标准数量合计:<b data-pd-stat-qty>0.00</b></span><span>件毛体合计:<b data-pd-stat-measure>0.00/0.00/0.00</b></span></div>
      <div class="pd-picker-actions"><button type="button" class="btn outline-primary" data-pd-close>取消</button><button type="button" class="btn primary" data-pd-confirm>确认</button></div>
    </footer>
  </section>`;
  document.body.appendChild(overlay);
  document.body.classList.add('pd-picker-open');

  const body=overlay.querySelector('[data-pd-body]');
  const countEl=overlay.querySelector('[data-pd-count]');
  const totalEl=overlay.querySelector('[data-pd-total]');
  const statOrders=overlay.querySelector('[data-pd-stat-orders]');
  const statItems=overlay.querySelector('[data-pd-stat-items]');
  const statQty=overlay.querySelector('[data-pd-stat-qty]');
  const statMeasure=overlay.querySelector('[data-pd-stat-measure]');
  const customerSelect=overlay.querySelector('[data-pd-filter="customer"]');
  const businessSelect=overlay.querySelector('[data-pd-filter="business"]');
  [...new Set(rows.map(r=>r.customer))].forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;customerSelect.appendChild(o);});
  [...new Set(rows.map(r=>r.business))].forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;businessSelect.appendChild(o);});

  let visible=rows.slice();
  const renderRows=()=>{
    body.innerHTML=visible.map(row=>`<tr data-pd-row="${row.key}"><td class="pd-check"><input type="checkbox" data-pd-row-check="${row.key}" ${selected.has(row.key)?'checked':''} aria-label="选择${esc(row.goods)}"></td>${columns.map(([key])=>{
      const value=row[key]||'—';
      if(key==='status')return `<td><span class="pd-status">${esc(value)}</span></td>`;
      return `<td title="${esc(String(value))}">${esc(String(value))}</td>`;
    }).join('')}</tr>`).join('')||`<tr><td class="pd-empty" colspan="${columns.length+1}">暂无数据</td></tr>`;
    countEl.textContent=visible.length===rows.length?'':`筛选结果 ${visible.length} 条`;
    totalEl.textContent=visible.length;
    syncStats();
  };
  const syncStats=()=>{
    const picked=rows.filter(r=>selected.has(r.key));
    const qty=picked.reduce((sum,r)=>sum+(parseFloat(r.total)||0),0);
    const pieces=picked.reduce((sum,r)=>sum+(parseFloat(r.pieces)||0),0);
    const gross=picked.reduce((sum,r)=>sum+(parseFloat(r.gross)||0),0);
    const volume=picked.reduce((sum,r)=>sum+(parseFloat(r.volume)||0),0);
    statOrders.textContent=new Set(picked.map(r=>r.order)).size;
    statItems.textContent=picked.length;
    statQty.textContent=qty.toFixed(2);
    statMeasure.textContent=`${pieces.toFixed(2)}/${gross.toFixed(2)}/${volume.toFixed(2)}`;
    const all=overlay.querySelector('[data-pd-all]');
    if(all){all.checked=visible.length>0&&visible.every(r=>selected.has(r.key));all.indeterminate=!all.checked&&visible.some(r=>selected.has(r.key));}
  };
  const close=()=>{overlay.remove();document.body.classList.remove('pd-picker-open');};

  overlay.addEventListener('click',event=>{
    if(event.target===overlay||event.target.closest('[data-pd-close]')){close();return;}
    const toggle=event.target.closest('[data-pd-query-toggle]');
    if(toggle){const card=overlay.querySelector('[data-pd-query-card]');card.classList.toggle('is-collapsed');toggle.setAttribute('aria-expanded',String(!card.classList.contains('is-collapsed')));return;}
    if(event.target.closest('[data-pd-reset]')){overlay.querySelectorAll('[data-pd-filter]').forEach(input=>{input.value='';});visible=rows.slice();renderRows();return;}
    if(event.target.closest('[data-pd-search]')){visible=rows.filter(row=>[...overlay.querySelectorAll('[data-pd-filter]')].every(input=>{const value=input.value.trim();return !value||String(row[input.dataset.pdFilter]||'').includes(value);}));renderRows();return;}
    if(event.target.closest('[data-pd-columns]')){toast('已模拟打开列设置');return;}
    if(event.target.closest('[data-pd-confirm]')){
      if(!selected.size){toast('请选择商品');return;}
      const picked=rows.filter(r=>selected.has(r.key)).map(row=>({
        key:row.key,order:row.order,customer:row.customer,category:'农副产品',desc:'—',
        pieces:row.pieces,gross:row.gross,volume:row.volume,standard:row.total,
        lineNo:'1',route:`${row.origin} → ${row.destination}`,loadType:row.loadType
      }));
      pushDemandGoods(picked);
      toast(`已添加 ${picked.length} 个商品行`);
      close();
      if(typeof render==='function')render();
      return;
    }
  });
  overlay.addEventListener('change',event=>{
    const check=event.target.closest('[data-pd-row-check]');
    if(check){if(check.checked)selected.add(check.dataset.pdRowCheck);else selected.delete(check.dataset.pdRowCheck);syncStats();return;}
    if(event.target.closest('[data-pd-all]')){
      const on=event.target.checked;
      visible.forEach(row=>{if(on)selected.add(row.key);else selected.delete(row.key);});
      body.querySelectorAll('[data-pd-row-check]').forEach(input=>{input.checked=on;});
      syncStats();
    }
  });
  renderRows();
}
document.addEventListener('click',event=>{
  const remove=event.target.closest('[data-demand-goods-remove]');
  if(remove){removeDemandGoods(remove.dataset.demandGoodsRemove);if(typeof render==='function')render();return;}
});
document.addEventListener('click',event=>{const button=event.target.closest('[data-product-select]');if(button){event.preventDefault();openProductPicker(button.dataset.productSelect);}});
function feeTable(rows,isExec=false){
  const headers=['','费用科目 *','客户订单编号 *','客户','结算对象','税率(%) *','PP/CC','计费单价（含税） *','计费币种 *','计费数量 *','计量单位 *','原币金额（含税）','柜型 *','汇率 *','本位币金额（元）','费用备注','发票类型','是否实报实销 *','操作'];
  return `<div class="table-scroll"><table class="mini-table fee-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(r=>`<tr><td class="checkbox-cell"><input type="checkbox"></td>${r.map(v=>`<td><input class="mini-input" value="${esc(v)}" ${isExec?'disabled':''}></td>`).join('')}<td><button class="btn link">复制</button> <button class="btn link" style="color:var(--danger)">删除</button></td></tr>`).join(''):`<tr><td colspan="19" class="empty-cell">暂无数据</td></tr>`}</tbody></table></div>`;
}
function feeCard(isExec,kind){
  const isRecv=kind==='recv';
  const rows=isRecv?[['操作费','FCO202610160032','成都柠檬时光科技有限公司','成都柠檬时光科技有限公司','6.00','到收','100.00','人民币','100.00','柜','10000.00','20RF','1.00','10000.00','','','否'],['运费','FCO202610160032','青岛绿洲园花生食品有限公司','青岛绿洲园花生食品有限公司','9.00','到付','80.00','人民币','100.00','吨','','','1.00','9000.00','','','否']]:[['运费','FCO202610160032','青岛绿洲园花生食品有限公司','青岛绿洲园花生食品有限公司','9.00','预付','80.00','人民币','100.00','吨','','','1.00','8000.00','','','否'],['运费','FCO202610160032','青岛绿洲园花生食品有限公司','青岛绿洲园花生食品有限公司','9.00','预付','70.00','人民币','100.00','吨','','','1.00','7000.00','','','否']];
  const title=isRecv?'业务预估应收':'业务预估应付';
  const actions=isExec?'':`<button class="btn outline-primary mini" data-toast="已模拟新增费用项">添加</button><button class="btn outline-primary mini" disabled>${isRecv?'拷贝到业务预估应付':'拷贝到业务预估应收'}</button><button class="btn outline-primary mini" data-toast="已模拟拷贝其他业务费用">${isRecv?'拷贝其他业务预估应收':'拷贝其他业务预估应付'}</button><button class="btn outline-primary mini" data-toast="已模拟带入集装箱费用">带入集装箱</button>`;
  return cubeCard(title,feeTable(rows,isExec),{actions,className:'TaskCargoFormList'});
}
const executionFeeBillingMap={
  'recv:海运费':{unitPrice:120,quantity:100,unit:'柜',commissionRate:2},
  'recv:港杂费':{unitPrice:80,quantity:50,unit:'吨',commissionRate:1.5},
  'recv:报关费':{unitPrice:3000,quantity:1,unit:'票',commissionRate:1},
  'recv:垫付费用':{unitPrice:1500,quantity:2,unit:'票',commissionRate:1},
  'pay:海运费':{unitPrice:100,quantity:100,unit:'柜',commissionRate:2},
  'pay:港杂费':{unitPrice:100,quantity:50,unit:'吨',commissionRate:1.5},
  'pay:代理费':{unitPrice:5500,quantity:1,unit:'票',commissionRate:1.2}
};
function executionFeeBilling(kind,row){return executionFeeBillingMap[`${kind}:${row.fee}`]||{unitPrice:ledgerNum(row.amount),quantity:1,unit:'票',commissionRate:0};}
function executionFeeOrderNo(){const record=typeof getActiveDemandRecord==='function'?getActiveDemandRecord():null;return record&&record.order?record.order:'FCO202610200037';}
function executionFeeDocTotal(list){return (list||[]).reduce((sum,item)=>sum+ledgerNum(item.amount),0);}
function executionFeeDocSummary(list,empty,currency){if(!list||!list.length)return{title:empty};const statuses=[...new Set(list.map(item=>item.status).filter(Boolean))].join('、');return{title:`${statuses||'已处理'} · ${currency} ${ledgerAmount(executionFeeDocTotal(list))}`};}
function executionFeeRows(kind){
  const rows=feeLedger.filter(row=>row.side===kind);
  if(!BILL_FEE_VIEW)return rows;
  const selected=(Array.isArray(state.execBillNos)?state.execBillNos:[]).filter(Boolean);
  return selected.length?rows.filter(row=>selected.includes(row.billNo)):rows;
}
function renderExecutionBillFilter(){
  const recvCount=executionFeeRows('recv').length;
  const payCount=executionFeeRows('pay').length;
  const selected=Array.isArray(state.execBillNos)?state.execBillNos:[];
  const billOptions=[...new Map(feeLedger.filter(row=>row.billNo).map(row=>[row.billNo,row.billType||'提单号'])).entries()];
  const selectedTags=selected.length?`<div class="exec-bill-selected-tags">${selected.map(billNo=>`<button type="button" class="exec-bill-selected-tag" data-exec-bill-remove="${esc(billNo)}" title="移除 ${esc(billNo)}"><span>${esc(billNo)}</span><i>×</i></button>`).join('')}</div>`:'';
  return `<div class="detail-finance-bill-filter"><span class="exec-bill-department-tag">国运</span><div class="exec-bill-multiselect" data-exec-bill-multiselect><button type="button" class="exec-bill-multiselect-trigger" data-exec-bill-trigger aria-expanded="false"><span>提单号</span><b>${selected.length?`已选 ${selected.length} 项`:'全部提单号'}</b><i>⌄</i></button><div class="exec-bill-multiselect-panel" data-exec-bill-panel hidden><div class="exec-bill-search-wrap"><input type="text" data-exec-bill-search-input placeholder="搜索船东提单号或货代提单号"></div><div class="exec-bill-option-list">${billOptions.map(([billNo,billType])=>`<label class="exec-bill-option" data-exec-bill-option-row data-search="${esc(`${billType} ${billNo}`.toLowerCase())}"><input type="checkbox" data-exec-bill-option value="${esc(billNo)}" ${selected.includes(billNo)?'checked':''}><span><b>${esc(billNo)}</b><small>${esc(billType)}</small></span></label>`).join('')}</div><div class="exec-bill-multiselect-foot"><span data-exec-bill-selected-count>已选 ${selected.length} 项</span><button type="button" class="btn link" data-exec-bill-clear>清空</button><button type="button" class="btn primary" data-exec-bill-apply>确定</button></div></div></div>${selectedTags}<div class="exec-bill-inline-count">应收 <b>${recvCount}</b> 条 · 应付 <b>${payCount}</b> 条</div></div>`;
}
function executionFinanceWorkspace(isExec){
  return `<div class="exec-finance-stack">${executionFeeCard(isExec,'recv')}${executionFeeCard(isExec,'pay')}</div>`;
}
function executionFeeCard(isExec,kind){
  const isRecv=kind==='recv';
  const title=isRecv?'执行侧预估应收':'执行侧预估应付';
  const rows=isExec?executionFeeRows(kind):[];
  const action=isExec?`<button class="btn outline-primary mini" data-maintain-exec-fee="${kind}">维护${isRecv?'执行侧预估应收':'执行侧应付'}</button>`:'';
  const orderNo=executionFeeOrderNo();
  const body=rows.map((row,index)=>{
    const ledgerIndex=feeLedger.indexOf(row);
    const billing=executionFeeBilling(kind,row);
    const exchangeRate=Number(row.exchangeRate||baseCurrencyRates[row.currency]||1);
    const originalAmount=ledgerNum(row.amount);
    const localAmount=originalAmount*exchangeRate;
    const parsedCommissionRate=billing.commissionRate===''||billing.commissionRate==null?null:Number(billing.commissionRate);
    const parsedCommissionAmount=billing.commissionAmount===''||billing.commissionAmount==null?null:Number(billing.commissionAmount);
    const commissionRate=Number.isFinite(parsedCommissionRate)?parsedCommissionRate:0;
    const commissionAmount=Number.isFinite(parsedCommissionAmount)?parsedCommissionAmount:localAmount*commissionRate/100;
    const hasCommission=(Number.isFinite(parsedCommissionRate)&&parsedCommissionRate!==0)||(Number.isFinite(parsedCommissionAmount)&&parsedCommissionAmount!==0);
    const commissionText=hasCommission?`${Number.isFinite(parsedCommissionRate)?`${commissionRate.toFixed(1)}%`:'-'} / ${ledgerAmount(commissionAmount)}`:'—';
    const invoice=executionFeeDocSummary(row.invoices,'未开票',row.currency);
    const payment=executionFeeDocSummary(row.payments,isRecv?'未收款':'未付款',row.currency);
    return `<tr class="exec-finance-summary-row" data-exec-fee-detail="${kind}:${ledgerIndex}" tabindex="0" aria-label="查看${esc(row.fee)}完整费用明细">
      <td><strong class="exec-finance-fee-name" title="${esc(row.fee)}">${esc(row.fee)}</strong></td>
      ${BILL_FEE_VIEW?`<td><span class="exec-bill-no-cell" title="${esc(row.billType||'提单号')} · ${esc(row.billNo||'—')}">${esc(row.billNo||'—')}</span></td>`:''}
      <td><span class="exec-finance-summary-text" title="${esc(row.party)}">${esc(row.party)}</span></td>
      <td><span class="exec-finance-summary-text">${row.taxRate?`${esc(row.taxRate)}%`:'—'}</span></td>
      <td><span class="exec-finance-summary-text">${esc(row.ppcc||'—')}</span></td>
      <td><span class="exec-finance-summary-text">${ledgerAmount(billing.unitPrice)}</span></td>
      <td><span class="exec-finance-currency-chip">${esc(row.currency)}</span></td>
      <td><span class="exec-finance-summary-text">${esc(billing.quantity)}</span></td>
      <td><span class="exec-finance-summary-text">${esc(billing.unit)}</span></td>
      <td><span class="exec-finance-summary-text">${esc(row.containerType||'—')}</span></td>
      <td><span class="exec-finance-summary-text">${ledgerAmount(originalAmount)}</span></td>
      <td><span class="exec-finance-summary-text">${exchangeRate.toFixed(4)}</span></td>
      <td><span class="exec-finance-summary-text">${ledgerAmount(localAmount)}</span></td>
      <td><span class="exec-finance-summary-text" title="${esc(row.remark||'—')}">${esc(row.remark||'—')}</span></td>
      <td><span class="exec-finance-summary-text" title="${esc(row.customer||row.party)}">${esc(row.customer||row.party)}</span></td>
      <td><span class="exec-finance-summary-text">${esc(row.orderNo||orderNo)}</span></td>
      <td><button class="doc-number-link" data-doc-open="${row.statementNo}">${row.statementNo}</button></td>
      <td><span class="exec-finance-summary-text">${commissionText}</span></td>
      <td><span class="exec-finance-summary-text" title="${esc(invoice.title)}">${esc(invoice.title)}</span></td>
      <td><span class="exec-finance-summary-text" title="${esc(payment.title)}">${esc(payment.title)}</span></td>
    </tr>`;
  }).join('');
  return `<section class="exec-finance-section" data-finance-side="${kind}">
    <div class="exec-finance-head">
      <h3 class="exec-finance-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M7 9h.01M17 15h.01"/></svg><span>${title}</span><span class="exec-finance-direction ${isRecv?'recv':'pay'}">${isRecv?'应收':'应付'}</span></h3>
      <div class="exec-finance-head-meta">${action}</div>
    </div>
    <div class="exec-finance-body">
      <div class="exec-finance-table-wrap">
        <table class="exec-finance-table" aria-label="${title}">
          <colgroup><col style="width:100px">${BILL_FEE_VIEW?'<col style="width:160px">':''}<col style="width:180px"><col style="width:58px"><col style="width:64px"><col style="width:96px"><col style="width:82px"><col style="width:74px"><col style="width:64px"><col style="width:64px"><col style="width:110px"><col style="width:72px"><col style="width:110px"><col style="width:150px"><col style="width:180px"><col style="width:150px"><col style="width:150px"><col style="width:150px"><col style="width:150px"><col style="width:150px"></colgroup>
          <thead><tr><th>费用科目</th>${BILL_FEE_VIEW?'<th>提单号</th>':''}<th>结算对象</th><th>税率（%）</th><th>PP/CC</th><th>计费单价</th><th>计费币种</th><th>计费数量</th><th>计量单位</th><th>柜型</th><th>原币金额</th><th>汇率</th><th>本位币金额</th><th>备注</th><th>客户</th><th>客户订单编号</th><th>对账单号</th><th>佣金比例/佣金金额</th><th>开票状态</th><th>收付款状态</th></tr></thead>
          <tbody>${body||`<tr><td colspan="${BILL_FEE_VIEW?20:19}" class="exec-finance-empty-row">暂无执行侧预估${isRecv?'应收':'应付'}数据</td></tr>`}</tbody>
        </table>
      </div>
    </div>
  </section>`;
}
function executionFeeDrawerDocRows(list,empty,currency){
  if(!list||!list.length)return `<div class="exec-fee-doc-empty">${empty}</div>`;
  return `<div class="exec-fee-doc-list">${list.map(item=>`<div class="exec-fee-doc-line"><button class="doc-number-link" data-doc-open="${item.id}">${item.id}</button><span class="doc-mini-status ${item.tone}">${item.status}</span><strong>${esc(currency)} ${item.amount}</strong></div>`).join('')}</div>`;
}
function openExecutionFeeDrawer(kind,index){
  const isRecv=kind==='recv';
  const row=feeLedger?feeLedger[Number(index)]:null;
  if(!row||row.side!==kind)return;
  if(!row)return;
  const billing=executionFeeBilling(kind,row);
  const exchangeRate=Number(row.exchangeRate||baseCurrencyRates[row.currency]||1);
  const originalAmount=ledgerNum(row.amount);
  const localAmount=originalAmount*exchangeRate;
  const parsedCommissionRate=billing.commissionRate===''||billing.commissionRate==null?null:Number(billing.commissionRate);
  const parsedCommissionAmount=billing.commissionAmount===''||billing.commissionAmount==null?null:Number(billing.commissionAmount);
  const commissionRate=Number.isFinite(parsedCommissionRate)?parsedCommissionRate:0;
  const commissionAmount=Number.isFinite(parsedCommissionAmount)?parsedCommissionAmount:localAmount*commissionRate/100;
  const hasCommission=(Number.isFinite(parsedCommissionRate)&&parsedCommissionRate!==0)||(Number.isFinite(parsedCommissionAmount)&&parsedCommissionAmount!==0);
  const detailField=(label,value)=>`<div class="exec-fee-detail-field"><span>${label}</span><strong>${value}</strong></div>`;
  const overlay=document.createElement('div');overlay.className='doc-drawer-overlay exec-fee-drawer-overlay';
  overlay.innerHTML=`<aside class="doc-drawer exec-fee-drawer" role="dialog" aria-modal="true" aria-labelledby="execFeeDrawerTitle">
    <div class="doc-drawer-head"><div><h3 id="execFeeDrawerTitle">执行侧预估${isRecv?'应收':'应付'}明细</h3><span>${esc(row.fee)} · ${esc(row.party)}</span></div><button type="button" class="btn link" data-exec-fee-drawer-close aria-label="关闭" style="font-size:18px">×</button></div>
    <div class="doc-drawer-body">
      <div class="exec-fee-detail-hero"><div><span class="exec-finance-direction ${isRecv?'recv':'pay'}">${isRecv?'应收':'应付'}</span><strong>${esc(row.fee)}</strong><small>${esc(row.party)}</small></div><b>${esc(row.currency)} ${ledgerAmount(originalAmount)}</b></div>
      <section class="exec-fee-detail-section"><h4>基本信息</h4><div class="exec-fee-detail-grid">
        ${detailField('结算对象',esc(row.party))}${BILL_FEE_VIEW?detailField('提单号',esc(`${row.billType||''}${row.billType&&row.billNo?' · ':''}${row.billNo||'—'}`)):''}${detailField('客户',esc(row.customer||row.party))}${detailField('客户订单编号',esc(row.orderNo||executionFeeOrderNo()))}${detailField('费用科目',esc(row.fee))}${detailField('税率（%）',row.taxRate?`${esc(row.taxRate)}%`:'—')}${detailField('PP/CC',esc(row.ppcc||'—'))}${detailField('计费币种',esc(row.currency))}
        ${detailField('计费单价',ledgerAmount(billing.unitPrice))}${detailField('计费数量',esc(billing.quantity))}${detailField('计量单位',esc(billing.unit))}${detailField('柜型',esc(row.containerType||'—'))}${detailField('汇率',exchangeRate.toFixed(4))}${detailField('备注',esc(row.remark||'—'))}
      </div></section>
      <section class="exec-fee-detail-section"><h4>金额信息</h4><div class="exec-fee-detail-grid">
        ${detailField('原币金额',`${esc(row.currency)} ${ledgerAmount(originalAmount)}`)}${detailField('本位币金额',`CNY ${ledgerAmount(localAmount)}`)}${detailField('已开票',`${esc(row.currency)} ${ledgerAmount(row.invoiced)}`)}${detailField(isRecv?'已收款':'已付款',`${esc(row.currency)} ${ledgerAmount(row.settled)}`)}${detailField(isRecv?'未收款':'未付款',`${esc(row.currency)} ${ledgerAmount(row.outstanding)}`)}
      </div></section>
      <section class="exec-fee-detail-section"><h4>对账信息</h4><div class="exec-fee-detail-grid">
        ${detailField('对账单号',`<button class="doc-number-link" data-doc-open="${row.statementNo}">${row.statementNo}</button>`)}${detailField('对账状态',`<span class="doc-mini-status ${row.statementTone}">${row.statementStatus}</span>`)}${detailField('对账类型',esc(row.statementType))}${detailField('对账完成日期',row.completedAt)}${detailField('对账名称',esc(row.statementName))}${hasCommission?detailField('佣金比例 / 金额',`${Number.isFinite(parsedCommissionRate)?`${commissionRate.toFixed(1)}%`:'-'} / ${ledgerAmount(commissionAmount)}`):''}
      </div></section>
      <section class="exec-fee-detail-section"><h4>开票信息</h4>${executionFeeDrawerDocRows(row.invoices,'暂无开票记录',row.currency)}</section>
      <section class="exec-fee-detail-section"><h4>收付款信息</h4>${executionFeeDrawerDocRows(row.payments,isRecv?'暂无收款记录':'暂无付款记录',row.currency)}</section>
    </div>
    <div class="doc-drawer-foot"><button type="button" class="btn" data-exec-fee-drawer-close>关闭</button></div>
  </aside>`;
  document.body.appendChild(overlay);document.body.classList.add('drawer-open');
  overlay.addEventListener('click',event=>{if(event.target===overlay||event.target.closest('[data-exec-fee-drawer-close]'))closeExecutionFeeDrawer();});
}
function closeExecutionFeeDrawer(){document.querySelectorAll('.exec-fee-drawer-overlay').forEach(node=>node.remove());if(!document.querySelector('.doc-drawer-overlay'))document.body.classList.remove('drawer-open');}
document.addEventListener('click',event=>{
  const financeTab=event.target.closest('[data-exec-finance-tab]');
  if(financeTab){const root=financeTab.closest('.exec-finance-workspace');const side=financeTab.dataset.execFinanceTab;root.querySelectorAll('[data-exec-finance-tab]').forEach(tab=>{const active=tab.dataset.execFinanceTab===side;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',active?'true':'false');});root.querySelectorAll('[data-exec-finance-pane]').forEach(pane=>pane.classList.toggle('active',pane.dataset.execFinancePane===side));return;}
  const detailAction=event.target.closest('[data-exec-fee-detail-action]');
  if(detailAction){const [kind,index]=detailAction.dataset.execFeeDetailAction.split(':');openExecutionFeeDrawer(kind,index);return;}
  const summaryRow=event.target.closest('[data-exec-fee-detail]');
  if(summaryRow&&!event.target.closest('button,a,input,select')){const [kind,index]=summaryRow.dataset.execFeeDetail.split(':');openExecutionFeeDrawer(kind,index);}
});
document.addEventListener('keydown',event=>{if(event.key!=='Enter'&&event.key!==' ')return;const summaryRow=event.target.closest('[data-exec-fee-detail].exec-finance-summary-row');if(!summaryRow)return;event.preventDefault();const [kind,index]=summaryRow.dataset.execFeeDetail.split(':');openExecutionFeeDrawer(kind,index);});
function maintainFeeSeed(kind){
  const isRecv=kind==='recv';
  return [{billNo:'COSU6439271850',billType:'船东提单号',feeItem:'代理港杂费',party:isRecv?'青岛绿洲园花生食品有限公司':'中联铁运集团有限公司',taxRate:'9.00',ppcc:'',unitPrice:'1.00',currency:'人民币',quantity:'10.00',unit:'吨',containerType:'',originalAmount:'10',exchangeRate:'1.00',localAmount:'10',remark:'',reconcileStatus:'未对账',reconcileQty:'',reconcileAmount:'',reconciledQty:'',reconciledAmount:'',reconcileQtyTotal:'',reconcileAmountTotal:'',orderNo:'FCO202611030021',customer:'青岛绿洲园花生食品有限公司',invoiceType:'',reimbursable:'是',sourceType:'手动创建',sourceNo:''}];
}
function maintainFeeRowHtml(row,index,showBillNo=false){
  const input=(field,type='text',extra='')=>`<input class="maintain-fee-input" data-maintain-field="${field}" data-row-index="${index}" type="${type}" value="${esc(row[field]||'')}" ${extra}>`;
  const billCell=showBillNo?`<td><select class="maintain-fee-input" data-maintain-field="billNo" data-row-index="${index}"><option value="COSU6439271850" ${row.billNo==='COSU6439271850'?'selected':''}>船东提单号 · COSU6439271850</option><option value="HBL202611160001" ${row.billNo==='HBL202611160001'?'selected':''}>货代提单号 · HBL202611160001</option></select></td>`:'';
  return `<tr data-maintain-row="${index}">
    ${billCell}<td>${input('feeItem')}</td><td>${input('party')}</td><td>${input('taxRate','number','step="0.01"')}</td>
    <td><select class="maintain-fee-input" data-maintain-field="ppcc" data-row-index="${index}"><option value="">请选择</option><option ${row.ppcc==='预付'?'selected':''}>预付</option><option ${row.ppcc==='到付'?'selected':''}>到付</option></select></td>
    <td>${input('unitPrice','number','step="0.01"')}</td><td>${input('currency')}</td><td>${input('quantity','number','step="0.01"')}</td><td>${input('unit')}</td><td>${input('containerType')}</td>
    <td>${input('originalAmount','number','step="0.01"')}</td><td>${input('exchangeRate','number','step="0.0001"')}</td><td>${input('localAmount','number','step="0.01"')}</td><td>${input('remark')}</td>
    <td class="maintain-fee-readonly">${esc(row.reconcileStatus)}</td><td class="maintain-fee-readonly">${esc(row.reconcileQty)}</td><td class="maintain-fee-readonly">${esc(row.reconcileAmount)}</td><td class="maintain-fee-readonly">${esc(row.reconciledQty)}</td><td class="maintain-fee-readonly">${esc(row.reconciledAmount)}</td><td class="maintain-fee-readonly">${esc(row.reconcileQtyTotal)}</td><td class="maintain-fee-readonly">${esc(row.reconcileAmountTotal)}</td>
    <td>${input('orderNo')}</td><td>${input('customer','text','readonly aria-readonly="true"')}</td>
    <td><select class="maintain-fee-input" data-maintain-field="invoiceType" data-row-index="${index}"><option value="">请选择</option><option>增值税专用发票</option><option>增值税普通发票</option></select></td>
    <td><select class="maintain-fee-input" data-maintain-field="reimbursable" data-row-index="${index}"><option ${row.reimbursable==='是'?'selected':''}>是</option><option ${row.reimbursable==='否'?'selected':''}>否</option></select></td>
    <td>${input('sourceType','text','readonly aria-readonly="true"')}</td><td>${input('sourceNo')}</td>
    <td class="maintain-fee-actions"><button class="btn link" type="button" data-maintain-copy-row="${index}">复制</button><button class="btn link danger-text" type="button" data-maintain-delete-row="${index}">删除</button></td>
  </tr>`;
}
function openBusinessFeeSelect(kind,onCopy){
  document.querySelectorAll('.exec-fee-select-overlay').forEach(node=>node.remove());
  const isRecv=kind==='recv';
  const rows=maintainFeeSeed(kind).map(row=>({...row,sourceType:'业务预估'}));
  const billHeader=BILL_FEE_VIEW?'<th class="bill-no-column">提单号</th>':'';
  const rowHtml=rows.map((row,index)=>`<tr data-business-fee-row="${index}"><td class="checkbox-cell"><input type="checkbox" data-business-fee-index="${index}" aria-label="选择业务预估费用行"></td><td>${esc(row.feeItem)}</td>${BILL_FEE_VIEW?`<td class="bill-no-cell">${esc(row.billNo||'—')}</td>`:''}<td>${esc(row.party)}</td><td>${esc(row.taxRate)}</td><td>${esc(row.ppcc||'')}</td><td>${esc(row.unitPrice)}</td><td>${esc(row.currency)}</td><td>${esc(row.quantity)}</td><td>${esc(row.unit)}</td><td>${esc(row.containerType)}</td><td>${esc(row.originalAmount)}</td><td>${esc(row.exchangeRate)}</td><td>${esc(row.localAmount)}</td><td>${esc(row.remark)}</td><td>${esc(row.orderNo)}</td><td>${esc(row.customer)}</td><td>${esc(row.invoiceType)}</td><td>${esc(row.reimbursable)}</td><td>${esc(row.sourceType)}</td><td>${esc(row.sourceNo)}</td></tr>`).join('');
  const overlay=document.createElement('div');overlay.className='exec-fee-select-overlay business-fee-select-overlay';
  overlay.innerHTML=`<section class="exec-fee-select-modal" role="dialog" aria-modal="true" aria-labelledby="businessFeeSelectTitle"><header class="exec-fee-select-head"><h2 id="businessFeeSelectTitle">选择业务预估${isRecv?'应收':'应付'}费用</h2><button class="bill-task-close" type="button" data-business-fee-close aria-label="关闭">×</button></header><div class="exec-fee-select-table-wrap"><table class="exec-fee-select-table"><thead><tr><th class="checkbox-cell"><input type="checkbox" data-business-fee-all aria-label="全选"></th><th>费用科目</th>${billHeader}<th>结算对象</th><th>税率(%)</th><th>PP/CC</th><th>计费单价（含税）</th><th>计费币种</th><th>计费数量</th><th>计量单位</th><th>柜型</th><th>原币金额（含税）</th><th>汇率</th><th>本位币金额（元）</th><th>费用备注</th><th>客户订单编号</th><th>客户</th><th>发票类型</th><th>是否实报实销</th><th>来源类型</th><th>来源单号</th></tr></thead><tbody>${rowHtml}</tbody></table></div><footer class="exec-fee-select-foot"><button class="btn" type="button" data-business-fee-close>取消</button><button class="btn primary" type="button" data-business-fee-copy disabled>复制选中费用</button></footer></section>`;
  document.body.appendChild(overlay);
  const selected=()=>[...overlay.querySelectorAll('[data-business-fee-index]:checked')].map(input=>rows[Number(input.dataset.businessFeeIndex)]);
  const sync=()=>{const count=selected().length;const button=overlay.querySelector('[data-business-fee-copy]');button.disabled=!count;button.textContent=count?`复制选中费用（${count}）`:'复制选中费用';};
  const close=()=>overlay.remove();
  overlay.addEventListener('click',event=>{if(event.target===overlay||event.target.closest('[data-business-fee-close]')){close();return;}if(event.target.closest('[data-business-fee-copy]')){const copied=selected();onCopy(copied);close();toast(`已复制 ${copied.length} 条业务预估${isRecv?'应收':'应付'}费用`);}});
  overlay.addEventListener('change',event=>{if(event.target.matches('[data-business-fee-all]')){overlay.querySelectorAll('[data-business-fee-index]').forEach(input=>input.checked=event.target.checked);}if(event.target.matches('[data-business-fee-index],[data-business-fee-all]'))sync();});
}
function openExecutionFeeSelect(sourceKind,onCopy){
  document.querySelectorAll('.exec-fee-select-overlay').forEach(node=>node.remove());
  const isRecv=sourceKind==='recv';
  const rows=maintainFeeSeed(sourceKind);
  const billHeader=BILL_FEE_VIEW?'<th class="bill-no-column">提单号</th>':'';
  const rowHtml=rows.map((row,index)=>`<tr data-select-fee-row="${index}"><td class="checkbox-cell"><input type="checkbox" data-select-fee-index="${index}" aria-label="选择费用行"></td><td>${esc(row.feeItem)}</td>${BILL_FEE_VIEW?`<td class="bill-no-cell">${esc(row.billNo||'—')}</td>`:''}<td>${esc(row.party)}</td><td>${esc(row.taxRate)}</td><td>${esc(row.ppcc||'')}</td><td>${esc(row.unitPrice)}</td><td>${esc(row.currency)}</td><td>${esc(row.quantity)}</td><td>${esc(row.unit)}</td><td>${esc(row.containerType)}</td><td>${esc(row.originalAmount)}</td><td>${esc(row.exchangeRate)}</td><td>${esc(row.localAmount)}</td><td>${esc(row.remark)}</td><td>${esc(row.orderNo)}</td><td>${esc(row.customer)}</td><td>${esc(row.invoiceType)}</td><td>${esc(row.reimbursable)}</td><td>${esc(row.sourceType)}</td><td>${esc(row.sourceNo)}</td></tr>`).join('');
  const overlay=document.createElement('div');overlay.className='exec-fee-select-overlay';
  overlay.innerHTML=`<section class="exec-fee-select-modal" role="dialog" aria-modal="true" aria-labelledby="execFeeSelectTitle"><header class="exec-fee-select-head"><h2 id="execFeeSelectTitle">选择执行侧预估${isRecv?'应收':'应付'}</h2><button class="bill-task-close" type="button" data-select-fee-close aria-label="关闭">×</button></header><div class="exec-fee-select-table-wrap"><table class="exec-fee-select-table"><thead><tr><th class="checkbox-cell"><input type="checkbox" data-select-fee-all aria-label="全选"></th><th>费用科目</th>${billHeader}<th>结算对象</th><th>税率(%)</th><th>PP/CC</th><th>计费单价（含税）</th><th>计费币种</th><th>计费数量</th><th>计量单位</th><th>柜型</th><th>原币金额（含税）</th><th>汇率</th><th>本位币金额（元）</th><th>费用备注</th><th>客户订单编号</th><th>客户</th><th>发票类型</th><th>是否实报实销</th><th>来源类型</th><th>来源单号</th></tr></thead><tbody>${rowHtml}</tbody></table></div><footer class="exec-fee-select-foot"><button class="btn" type="button" data-select-fee-close>取消</button><button class="btn primary" type="button" data-select-fee-copy disabled>复制选中费用</button></footer></section>`;
  document.body.appendChild(overlay);
  const selected=()=>[...overlay.querySelectorAll('[data-select-fee-index]:checked')].map(input=>rows[Number(input.dataset.selectFeeIndex)]);
  const sync=()=>{const count=selected().length;const button=overlay.querySelector('[data-select-fee-copy]');button.disabled=!count;button.textContent=count?`复制选中费用（${count}）`:'复制选中费用';};
  const close=()=>overlay.remove();
  overlay.addEventListener('click',event=>{if(event.target===overlay||event.target.closest('[data-select-fee-close]')){close();return;}if(event.target.closest('[data-select-fee-copy]')){const copied=selected();onCopy(copied);close();toast(`已复制 ${copied.length} 条执行侧预估${isRecv?'应收':'应付'}费用`);}});
  overlay.addEventListener('change',event=>{if(event.target.matches('[data-select-fee-all]')){overlay.querySelectorAll('[data-select-fee-index]').forEach(input=>input.checked=event.target.checked);}if(event.target.matches('[data-select-fee-index],[data-select-fee-all]'))sync();});
}
function otherDemandFeeSeed(kind){
  return [{feeItem:'代理港杂费',orderNo:'FCO202611020018',customer:'青岛绿洲园花生食品有限公司',party:kind==='recv'?'青岛绿洲园花生食品有限公司':'中联铁运集团有限公司',taxRate:'9.00',ppcc:'',unitPrice:'1.00',currency:'人民币',quantity:'10.00',unit:'吨',containerType:'',originalAmount:'10',exchangeRate:'1.00',localAmount:'10',ownerBlNo:'COSU6439271850',forwarderBlNo:'HBL202611020001',demandNo:'FLR202611020018',invoiceType:'',reimbursable:'是',remark:'其他需求执行侧预估费用'}];
}
function openOtherDemandFeeSelect(kind,onCopy){
  document.querySelectorAll('.other-demand-fee-overlay').forEach(node=>node.remove());
  const isRecv=kind==='recv';const rows=otherDemandFeeSeed(kind);
  const queryFields=isRecv?[['demandNo','物流需求单号','请输入'],['party','结算对象','请选择'],['orderNo','关联客户订单号','请输入'],['customer','关联客户','请选择'],['ownerBlNo','船东提单号','请输入'],['forwarderBlNo','货代提单号','请输入'],['sales','业务员','请选择'],['dept','部门','请选择'],['account','核算组','请选择']]:[['demandNo','物流需求单号','请输入'],['orderNo','关联客户订单号','请输入'],['customer','关联客户','请选择'],['party','结算对象','请选择'],['ownerBlNo','船东提单号','请输入'],['forwarderBlNo','货代提单号','请输入'],['sales','业务员','请选择'],['dept','部门','请选择'],['account','核算组','请选择']];
  const queryHtml=queryFields.map(([id,label,placeholder])=>`<label class="other-demand-fee-field"><span>${label}</span><input id="otherFee_${id}" placeholder="${placeholder}"></label>`).join('');
  const listHeaders=isRecv?['费用科目','结算对象','税率（%）','PP/CC','计费单价（含税）','计费币种','计费数量','计量单位','柜型','原币金额（含税）','汇率','本位币金额（元）','关联客户订单号','关联客户','船东提单号','货代提单号','物流需求单号','发票类型','是否实报实销','费用备注']:['费用科目','关联客户订单号','关联客户','结算对象','税率（%）','PP/CC','计费单价（含税）','计费币种','计费数量','计量单位','柜型','原币金额（含税）','汇率','本位币金额（元）','船东提单号','货代提单号','物流需求单号','发票类型','是否实报实销','费用备注'];
  if(BILL_FEE_VIEW)listHeaders.splice(1,0,'提单号');
  const rowHtml=rows.map((row,index)=>{const detailCells=isRecv?[row.party,row.taxRate,row.ppcc,row.unitPrice,row.currency,row.quantity,row.unit,row.containerType,row.originalAmount,row.exchangeRate,row.localAmount,row.orderNo,row.customer,row.ownerBlNo,row.forwarderBlNo,row.demandNo,row.invoiceType,row.reimbursable,row.remark]:[row.orderNo,row.customer,row.party,row.taxRate,row.ppcc,row.unitPrice,row.currency,row.quantity,row.unit,row.containerType,row.originalAmount,row.exchangeRate,row.localAmount,row.ownerBlNo,row.forwarderBlNo,row.demandNo,row.invoiceType,row.reimbursable,row.remark];return `<tr data-other-demand-fee-row="${index}" data-search="${esc([row.demandNo,row.orderNo,row.customer,row.party,row.ownerBlNo,row.forwarderBlNo,row.sales||'',row.dept||'',row.account||''].join(' '))}"><td class="checkbox-cell"><input type="checkbox" data-other-demand-fee-index="${index}" aria-label="选择费用行"></td><td>${esc(row.feeItem)}</td>${BILL_FEE_VIEW?`<td class="bill-no-cell">${esc(row.billNo||row.ownerBlNo||row.forwarderBlNo||'—')}</td>`:''}${detailCells.map(value=>`<td>${esc(value??'')}</td>`).join('')}</tr>`;}).join('');
  const overlay=document.createElement('div');overlay.className='exec-fee-select-overlay other-demand-fee-overlay';
  overlay.innerHTML=`<section class="exec-fee-select-modal other-demand-fee-modal" role="dialog" aria-modal="true" aria-labelledby="otherDemandFeeTitle"><header class="exec-fee-select-head"><h2 id="otherDemandFeeTitle">选择其他需求执行侧预估${isRecv?'应收':'应付'}</h2><button class="bill-task-close" type="button" data-other-demand-fee-close aria-label="关闭">×</button></header><div class="other-demand-fee-query"><div class="other-demand-fee-query-head"><span>查询条件</span><div><button class="btn bill-task-reset" type="button" data-other-demand-reset>重置</button><button class="btn primary" type="button" data-other-demand-search>查询</button></div></div><div class="other-demand-fee-query-grid">${queryHtml}</div></div><div class="other-demand-fee-table-wrap"><table class="exec-fee-select-table other-demand-fee-table"><thead><tr><th class="checkbox-cell"><input type="checkbox" data-other-demand-all aria-label="全选"></th>${listHeaders.map(header=>`<th>${header}</th>`).join('')}</tr></thead><tbody>${rowHtml}</tbody></table></div><footer class="exec-fee-select-foot"><button class="btn" type="button" data-other-demand-fee-close>取消</button><button class="btn primary" type="button" data-other-demand-copy disabled>复制选中费用</button></footer></section>`;
  document.body.appendChild(overlay);
  const selected=()=>[...overlay.querySelectorAll('[data-other-demand-fee-index]:checked')].map(input=>rows[Number(input.dataset.otherDemandFeeIndex)]);
  const sync=()=>{const count=selected().length;const button=overlay.querySelector('[data-other-demand-copy]');button.disabled=!count;button.textContent=count?`复制选中费用（${count}）`:'复制选中费用';};
  const close=()=>overlay.remove();
  overlay.addEventListener('click',event=>{if(event.target===overlay||event.target.closest('[data-other-demand-fee-close]')){close();return;}if(event.target.closest('[data-other-demand-reset]')){overlay.querySelectorAll('.other-demand-fee-field input').forEach(input=>input.value='');overlay.querySelectorAll('[data-other-demand-fee-row]').forEach(row=>row.style.display='');sync();return;}if(event.target.closest('[data-other-demand-search]')){const values=[...overlay.querySelectorAll('.other-demand-fee-field input')].map(input=>input.value.trim()).filter(Boolean);overlay.querySelectorAll('[data-other-demand-fee-row]').forEach(row=>{row.style.display=values.every(value=>row.dataset.search.includes(value))?'':'none';});sync();return;}if(event.target.closest('[data-other-demand-copy]')){const copied=selected();onCopy(copied);close();toast(`已拷贝 ${copied.length} 条其他需求执行侧预估${isRecv?'应收':'应付'}费用`);}});
  overlay.addEventListener('change',event=>{if(event.target.matches('[data-other-demand-all]'))overlay.querySelectorAll('[data-other-demand-fee-index]').forEach(input=>input.checked=event.target.checked);if(event.target.matches('[data-other-demand-fee-index],[data-other-demand-all]'))sync();});
}
function openMaintainFeeModal(kind){
  document.querySelectorAll('.maintain-fee-overlay,.exec-fee-select-overlay').forEach(node=>node.remove());
  const isRecv=kind==='recv';
  const title=isRecv?'维护执行侧应收':'维护执行侧应付';
  const rows=maintainFeeSeed(kind);
  const billHeader=BILL_FEE_VIEW?'<th>提单号 *</th>':'';
  const overlay=document.createElement('div');overlay.className='maintain-fee-overlay';
  overlay.innerHTML=`<section class="maintain-fee-modal" role="dialog" aria-modal="true" aria-labelledby="maintainFeeTitle"><header class="maintain-fee-head"><h2 id="maintainFeeTitle">${title}</h2><button class="bill-task-close" type="button" data-maintain-close aria-label="关闭">×</button></header><div class="maintain-fee-toolbar"><button class="btn outline-primary" type="button" data-maintain-copy-business>从业务预估${isRecv?'应收':'应付'}复制</button><button class="btn outline-primary" type="button" data-maintain-copy-exec>从执行侧预估${isRecv?'应付':'应收'}复制</button><button class="btn outline-primary" type="button" data-maintain-copy-other>拷贝其他需求执行侧预估${isRecv?'应收':'应付'}</button><button class="btn primary" type="button" data-maintain-add>新增费用</button></div><div class="maintain-fee-table-wrap"><table class="maintain-fee-table"><thead><tr>${billHeader}<th>费用科目 *</th><th>结算对象 *</th><th>税率(%) *</th><th>PP/CC</th><th>计费单价（含税） *</th><th>计费币种 *</th><th>计费数量 *</th><th>计量单位 *</th><th>柜型</th><th>原币金额（含税）</th><th>汇率</th><th>本位币金额（元）</th><th>费用备注</th><th>对账状态</th><th>对账中数量</th><th>对账中金额</th><th>已对账数量</th><th>已对账金额</th><th>对账数量合计</th><th>对账金额合计</th><th>关联客户订单号</th><th>关联客户</th><th>发票类型</th><th>是否实报实销 *</th><th>来源类型</th><th>来源单号</th><th>操作</th></tr></thead><tbody data-maintain-body></tbody></table></div><footer class="maintain-fee-foot"><button class="btn" type="button" data-maintain-close>取消</button><button class="btn primary" type="button" data-maintain-save>保存</button></footer></section>`;
  document.body.classList.add('maintain-fee-modal-open');document.body.appendChild(overlay);
  const body=overlay.querySelector('[data-maintain-body]');
  const renderRows=()=>{body.innerHTML=rows.length?rows.map((row,index)=>maintainFeeRowHtml(row,index,BILL_FEE_VIEW)).join(''):`<tr><td colspan="${BILL_FEE_VIEW?28:27}" class="maintain-fee-empty">暂无费用，请点击“新增费用”</td></tr>`;};
  const close=()=>{overlay.remove();document.querySelectorAll('.exec-fee-select-overlay').forEach(node=>node.remove());document.body.classList.remove('maintain-fee-modal-open');};
  renderRows();
  overlay.addEventListener('click',event=>{if(event.target===overlay||event.target.closest('[data-maintain-close]')){close();return;}if(event.target.closest('[data-maintain-add]')){rows.push({billNo:BILL_FEE_VIEW?'COSU6439271850':'',billType:BILL_FEE_VIEW?'船东提单号':'',feeItem:'',party:'',taxRate:'',ppcc:'',unitPrice:'',currency:'人民币',quantity:'',unit:'',containerType:'',originalAmount:'',exchangeRate:'1.00',localAmount:'',remark:'',reconcileStatus:'未对账',reconcileQty:'',reconcileAmount:'',reconciledQty:'',reconciledAmount:'',reconcileQtyTotal:'',reconcileAmountTotal:'',orderNo:'FCO202611030021',customer:'青岛绿洲园花生食品有限公司',invoiceType:'',reimbursable:'是',sourceType:'手动创建',sourceNo:''});renderRows();return;}if(event.target.closest('[data-maintain-copy-business]')){if(BILL_FEE_VIEW){openBusinessFeeSelect(kind,copied=>{rows.push(...copied.map(item=>({...item,sourceType:'业务预估复制'})));renderRows();});}else{toast(`已模拟从业务预估${isRecv?'应收':'应付'}复制费用`);}return;}if(event.target.closest('[data-maintain-copy-exec]')){openExecutionFeeSelect(isRecv?'pay':'recv',copied=>{rows.push(...copied.map(item=>({...item,party:item.party,customer:item.customer})));renderRows();});return;}if(event.target.closest('[data-maintain-copy-other]')){openOtherDemandFeeSelect(kind,copied=>{rows.push(...copied.map(item=>{const copiedBillNo=item.billNo||item.ownerBlNo||item.forwarderBlNo||'';return{...item,reconcileStatus:'未对账',sourceType:'其他需求复制',billNo:copiedBillNo,billType:item.billType||(copiedBillNo==='COSU6439271850'?'船东提单号':'货代提单号')};}));renderRows();});return;}const copyButton=event.target.closest('[data-maintain-copy-row]');if(copyButton){const index=Number(copyButton.dataset.maintainCopyRow);rows.splice(index+1,0,{...rows[index]});renderRows();return;}const deleteButton=event.target.closest('[data-maintain-delete-row]');if(deleteButton){rows.splice(Number(deleteButton.dataset.maintainDeleteRow),1);renderRows();return;}if(event.target.closest('[data-maintain-save]')){if(BILL_FEE_VIEW){const billNo=overlay.querySelector('[data-maintain-field="billNo"]')?.value;const target=feeLedger.find(row=>row.side===kind);if(target&&billNo){target.billNo=billNo;target.billType=billNo==='COSU6439271850'?'船东提单号':'货代提单号';}}close();if(BILL_FEE_VIEW)rerenderDetailPreservingScroll();toast(BILL_FEE_VIEW?'执行侧预估费用已保存，提单号已更新':'执行侧预估费用已保存');}});
  overlay.addEventListener('input',event=>{const input=event.target.closest('[data-maintain-field]');if(!input)return;const row=rows[Number(input.dataset.rowIndex)];if(!row)return;row[input.dataset.maintainField]=input.value;if(input.dataset.maintainField==='originalAmount'||input.dataset.maintainField==='exchangeRate'){row.localAmount=(Number(row.originalAmount||0)*Number(row.exchangeRate||0)).toFixed(2);const local=overlay.querySelector(`[data-maintain-field="localAmount"][data-row-index="${input.dataset.rowIndex}"]`);if(local)local.value=row.localAmount;}});
}
document.addEventListener('change',event=>{const option=event.target.closest('[data-exec-bill-option]');if(!option)return;const root=option.closest('[data-exec-bill-multiselect]');const count=root?.querySelectorAll('[data-exec-bill-option]:checked').length||0;const label=root?.querySelector('[data-exec-bill-selected-count]');if(label)label.textContent=`已选 ${count} 项`;});
document.addEventListener('click',event=>{const trigger=event.target.closest('[data-exec-bill-trigger]');if(trigger){const root=trigger.closest('[data-exec-bill-multiselect]');const panel=root?.querySelector('[data-exec-bill-panel]');if(panel){const open=panel.hidden;panel.hidden=!open;trigger.setAttribute('aria-expanded',String(open));if(open)root.querySelector('[data-exec-bill-search-input]')?.focus();}return;}const apply=event.target.closest('[data-exec-bill-apply]');if(apply){const root=apply.closest('[data-exec-bill-multiselect]');state.execBillNos=[...root.querySelectorAll('[data-exec-bill-option]:checked')].map(input=>input.value);rerenderDetailPreservingScroll();return;}const clear=event.target.closest('[data-exec-bill-clear]');if(clear){state.execBillNos=[];rerenderDetailPreservingScroll();return;}const remove=event.target.closest('[data-exec-bill-remove]');if(remove){const billNo=remove.dataset.execBillRemove;state.execBillNos=(state.execBillNos||[]).filter(item=>item!==billNo);rerenderDetailPreservingScroll();return;}if(!event.target.closest('[data-exec-bill-multiselect]'))document.querySelectorAll('[data-exec-bill-panel]').forEach(panel=>{panel.hidden=true;panel.closest('[data-exec-bill-multiselect]')?.querySelector('[data-exec-bill-trigger]')?.setAttribute('aria-expanded','false');});});
document.addEventListener('input',event=>{const input=event.target.closest('[data-exec-bill-search-input]');if(!input)return;const root=input.closest('[data-exec-bill-multiselect]');const query=input.value.trim().toLowerCase();root.querySelectorAll('[data-exec-bill-option-row]').forEach(row=>{row.hidden=query&&!row.dataset.search.includes(query);});});
document.addEventListener('keydown',event=>{if(event.key==='Enter'&&event.target.matches('[data-exec-bill-search-input]')){event.preventDefault();const root=event.target.closest('[data-exec-bill-multiselect]');state.execBillNos=[...root.querySelectorAll('[data-exec-bill-option]:checked')].map(input=>input.value);rerenderDetailPreservingScroll();}});
document.addEventListener('click',event=>{const button=event.target.closest('[data-maintain-exec-fee]');if(button)openMaintainFeeModal(button.dataset.maintainExecFee);});
function profitCard(isExec){
  const row=isExec?['人民币','10.00','10.00','0.00']:['人民币','19,000.00','15,000.00','4,000.00'];
  const body=`<div class="table-scroll"><table class="mini-table business-profit-table" style="min-width:720px"><thead><tr><th>币种</th><th>业务预估应收</th><th>业务预估应付</th><th>业务预估利润</th></tr></thead><tbody><tr>${row.map(v=>`<td>${v}</td>`).join('')}</tr><tr>${['折合本币(CNY)',...row.slice(1)].map(v=>`<td>${v}</td>`).join('')}</tr></tbody></table></div>`;
  return cubeCard('业务预估利润统计',body);
}
function financeProfitCard(isExec){
  const feeRows=isExec?feeLedger:[];
  const rates=baseCurrencyRates;
  const stage=(recv,pay)=>({recv,pay,profit:recv-pay});
  const zero=stage(0,0);
  const businessByCurrency={CNY:stage(19000,15000)};
  const currencies=[...new Set([...Object.keys(businessByCurrency),...feeRows.map(row=>row.currency||'CNY')])];
  const sumBy=(currency,side,key)=>feeRows.filter(row=>(row.currency||'CNY')===currency&&row.side===side).reduce((sum,row)=>sum+ledgerNum(row[key]),0);
  const baseSumBy=(side,key)=>feeRows.filter(row=>row.side===side).reduce((sum,row)=>sum+ledgerNum(row[key])*Number(row.exchangeRate||rates[row.currency||'CNY']||1),0);
  const numberCell=value=>`<td class="finance-profit-number">${ledgerAmount(value)}</td>`;
  const profitCell=value=>`<td class="finance-profit-number ${value<0?'is-negative':''}">${ledgerAmount(value)}</td>`;
  const stageCells=data=>`${numberCell(data.recv)}${numberCell(data.pay)}${profitCell(data.profit)}`;
  const rows=currencies.map(currency=>{
    const business=businessByCurrency[currency]||zero;
    const execution=stage(sumBy(currency,'recv','amount'),sumBy(currency,'pay','amount'));
    return `<tr><td class="finance-profit-currency">${currency}</td>${stageCells(business)}${stageCells(execution)}</tr>`;
  }).join('');
  const baseBusiness=Object.values(businessByCurrency).reduce((sum,item)=>({recv:sum.recv+item.recv,pay:sum.pay+item.pay}),{recv:0,pay:0});
  const baseExecution=stage(baseSumBy('recv','amount'),baseSumBy('pay','amount'));
  const baseTotal=stage(baseBusiness.recv,baseBusiness.pay);
  const baseRow=`<tr class="finance-profit-base-row"><td class="finance-profit-currency">折合本币(CNY)</td>${stageCells(baseTotal)}${stageCells(baseExecution)}</tr>`;
  return cubeCard('利润统计',`<div class="table-scroll"><table class="mini-table finance-profit-table finance-profit-matrix-table"><thead><tr><th>币种</th><th>业务预估应收</th><th>业务预估应付</th><th>业务预估利润</th><th>执行侧预估应收</th><th>执行侧预估应付</th><th>执行利润</th></tr></thead><tbody>${rows}${baseRow}</tbody></table></div>`);
}
function attachmentCard(isExec){
  const body=isExec?'':`<div class="upload-box"><div>拖拽文件至此处或点击上传</div><div style="margin-top:4px">(仅支持doc/docx/pdf/png/jpg/xlsx格式文件，文件大小不超过20M)</div></div>`;
  return cubeCard('审批附件',body);
}
function systemCard(isExec){
  const record=getActiveDemandRecord();
  const version=String(currentDemandVersion);
  const status=isExec?(record.status||'执行中'):'创建';
  const v=isExec?['苏丽蓉','2026-10-20 19:51:03','菜菜菜','2026-10-20 19:51:36',version,status]:['苏丽蓉','2026-10-16 16:52:48','苏丽蓉','2026-10-16 16:52:48',version,status];
  const labels=['创建人','创建时间','修改人','修改时间','版本号','状态'];
  return cubeCard('系统信息',`<div class="grid-6">${labels.map((l,i)=>field(l,v[i],{readonly:true})).join('')}</div>`);
}
function detailActions(isExec){
  if(!isExec)return `<button class="btn outline-primary" data-go="list">返回</button><button class="btn outline-primary" data-toast="已模拟打印">打印</button><button class="btn primary" disabled>修改OP</button><button class="btn danger" data-toast="已模拟删除确认">删除</button><button class="btn primary" data-toast="已模拟打开审批进度">审批进度</button><button class="btn outline-primary" data-toast="已模拟提交审批">提交审批</button><button class="btn outline-primary" data-collapse-all>收起</button>`;
  return `<button class="btn outline-primary" data-go="list">返回</button><button class="btn outline-primary" data-toast="已模拟打印">打印</button><button class="btn primary" data-toast="已模拟进入修改OP">修改OP</button><button class="btn outline-primary" data-toast="已模拟完结需求">完结</button><div class="dropdown-wrap"><button class="btn outline-primary" data-dropdown>发起对账 <span style="font-size:10px">⌄</span></button><div class="dropdown-menu"><button data-toast="已模拟发起客户对账">客户对账</button><button data-toast="已模拟发起供应商对账">供应商对账</button><button data-toast="已模拟打开对账记录">对账记录</button></div></div><button class="btn primary" data-toast="已模拟打开审批进度">审批进度</button><button class="btn outline-primary" data-collapse-all>收起</button>`;
}
function execFeeSection(){
  const isExecTab=state.execFeeTab==='exec';
  const blockTitle=isExecTab?'执行侧预估应收':'业务预估应收';
  const secondTitle=isExecTab?'执行侧预估应付':'业务预估应付';
  return `<section class="cube-card"><div class="section-tabbar"><div class="exec-fee-tabs"><button class="exec-fee-tab ${isExecTab?'active':''}" data-exec-fee-tab="exec">执行侧预估费用</button><button class="exec-fee-tab ${!isExecTab?'active':''}" data-exec-fee-tab="business">业务预估费用</button></div></div>
    <div class="exec-fee-block"><div class="exec-fee-title"><span>${blockTitle}</span>${isExecTab?'<button class="btn outline-primary mini" data-toast="已模拟维护执行侧预估应收">维护执行侧预估应收</button>':''}</div>${feeTable(isExecTab?[]:[['操作费','FCO202610160032','成都柠檬时光科技有限公司','成都柠檬时光科技有限公司','6.00','到收','100.00','人民币','100.00','柜','10000.00','20RF','1.00','10000.00','','','否']],isExecTab)}</div>
    <div class="exec-fee-block"><div class="exec-fee-title"><span>${secondTitle}</span>${isExecTab?'<button class="btn outline-primary mini" data-toast="已模拟维护执行侧应付">维护执行侧应付</button>':''}</div>${feeTable(isExecTab?[]:[['运费','FCO202610160032','青岛绿洲园花生食品有限公司','青岛绿洲园花生食品有限公司','9.00','预付','80.00','人民币','100.00','吨','','','1.00','8000.00','','','否']],isExecTab)}</div>
  </section>`;
}
function arrangementReferenceActions(isExec){
  const primary=isExec?'完结需求':'提交审批';
  return `<button class="btn outline-primary" data-toast="已模拟${primary}">${primary}</button><button class="btn danger" data-toast="已模拟删除确认">删除</button><button class="btn outline-primary" data-go="list">返回</button>`;
}function renderLegacyDetail(page){
  const isExec=page==='exec';
  const no=state.activeRowId||(isExec?'FLR202610200038':'FLR202610160032');
  const mainCards=isExec?`${baseCard(true)}${customerCard(true)}${transportCard(true)}${voyageCard(true)}${containerCard(true)}${execFeeSection()}${profitCard(true)}${attachmentCard(true)}${systemCard(true)}`: `${baseCard(false)}${customerCard(false)}${transportCard(false)}${voyageCard(false)}${containerCard(false)}${feeCard(false,'recv')}${feeCard(false,'pay')}${profitCard(false)}${attachmentCard(false)}${systemCard(false)}`;
  return `<div class="detail-scroll ${state.detailView==='arrangement'&&!isExec?'empty-arrangement-scroll':''}"><div class="detail-page ${isExec?'exec-mode':'create-mode'}">
    <section class="cube-card"><div class="detail-titlebar"><div class="detail-title"><span class="caret">▼</span><span>物流需求单详情（${no}）</span><span class="expand-icon">⛶</span></div><div class="detail-actions">${detailActions(isExec)}</div></div></section>
    <div id="detailCards">${mainCards}</div>
    ${isExec?renderExecutionLower():''}
  </div></div>`;
}
function commodityTable(){
  const headers=['客户订单编号','客户','唛头','商品中文名 *','商品描述','件数','件数单位','毛重','毛重单位','体积','体积单位','标准数量 *','标准单位 *','合同单价（元）','包装数量','包装单位','货物单价（元）','货物价值（万元）','贸易合同号（类型）','业务项目号','商品英文名'];
  return `<div class="inline-table-wrap"><table class="mini-table commodity-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody><tr><td>FCO202610200037</td><td>青岛绿洲园花生食品有限公司</td><td></td><td></td><td></td><td></td><td></td><td></td><td>吨</td><td></td><td>立方米</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div><div class="totals-bar"><span>共计 <b>1 条</b></span><span>合计标准数量 <b>1 吨</b></span><span>合计包装数量 <b>以实际数量为准</b></span></div>`;
}
function taskFeeTable(){
  const headers=['费用科目 *','税率(%) *','PP/CC','计费单价（含税） *','计费币种 *','计费数量 *','计量单位 *','原币金额（含税）','柜型','汇率 *','本位币金额（元）','费用备注','发票类型','是否实报实销 *'];
  return `<div class="inline-table-wrap"><table class="mini-table" style="min-width:1280px"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody><tr>${['运费','9.00','到付','1.00','人民币','1.00','吨','1.00','','1.00','1.00','','','否'].map(v=>`<td><input class="mini-input" value="${v}" disabled></td>`).join('')}</tr></tbody></table></div>`;
}
function taskContainerTable(){
  return `<div class="inline-table-wrap"><table class="mini-table" style="min-width:840px"><thead><tr><th>箱型 *</th><th>数量 *</th><th>箱号</th><th>备注</th></tr></thead><tbody><tr><td><input class="mini-input" value="20GP" disabled></td><td><input class="mini-input" value="1" disabled></td><td><input class="mini-input" value="" disabled></td><td><input class="mini-input" value="" disabled></td></tr></tbody></table></div>`;
}
function taskAttachmentTable(){
  return `<div class="inline-table-wrap"><table class="mini-table" style="min-width:700px"><thead><tr><th>文件名称</th><th>文件大小</th><th>上传时间</th><th>操作</th></tr></thead><tbody><tr><td colspan="4" class="empty-cell">暂无数据</td></tr></tbody></table></div>`;
}
function renderTaskDetails(){
  const taskBase=[['任务编号','FLST202610200038'],['任务模版','基础水运集装箱模板'],['任务类型','水运'],['装运类别','集装箱'],['跟踪方式','按箱跟踪'],['保险状态','未预保'],['反馈确认状态',''],['申请反馈确认时间',''],['确认反馈通过时间','']];
  const water=[['水运运输类型',''],['航运类型','内贸水运'],['航线',''],['装箱方式','FCL'],['订箱方式','船公司箱（COC）'],['免箱天数',''],['Scac Code',''],['船东公司',''],['Last Free Day',''],['Empty Return','2026-10-20'],['订舱经理','黄瑞钰']];
  const start=[['起运港','富纳富提'],['国别地区','大洋洲/图瓦卢'],['联系人',''],['联系方式',''],['起运码头',''],['最迟装船日',''],['预计发运时间','2026-10-20 19:51:42'],['发货方名称',''],['提货时间','']];
  const dest=[['目的港','法马古斯塔'],['国别地区','欧洲/塞浦路斯'],['联系人',''],['联系方式',''],['目的码头',''],['货物交接方式',''],['最晚送达时间','2026-10-20 19:51:45'],['收货单位','自动化收货单位'],['卸货时间','']];
  const relay=[['下段运输方式',''],['载具名称（船名）',''],['预计转运时间',''],['接货联系人（联系方式）','']];
  const req=[['是否控货',''],['起运港服务条款','CY'],['目的港服务条款','CY'],['运输条款','水运港到港']];
  const insurance=[['是否免保险','是'],['免保险原因','钢厂代办'],['投保方式','线下投保'],['保险公司','中国人民财产保险股份有限公司宁波市分公司'],['是否免赔','否'],['是否变更投保目的港','否']];
  const payment=[['运费支付方式','托运方支付'],['是否由我司支付运费','是'],['付款方式','我司自结'],['开票抬头','厦门建发生生物流有限公司'],['开票要求','一票制（9点）']];
  const ship=[['MMSI（船东号）',''],['船名',''],['中文船名',''],['建造日期',''],['呼号',''],['船长',''],['船宽',''],['左舷距',''],['尾距','']];
  const f=(arr,req=false)=>arr.map(([l,v])=>field(l,v,{readonly:true,required:req})).join('');
  return `<div class="task-shell">
    <div class="task-titlebar"><div class="task-title"><span style="width:7px;height:7px;background:var(--primary);border-radius:50%;display:inline-block"></span><span>富纳富提 - 法马古斯塔</span><span class="tag blue">水运-集装箱</span></div><div class="task-actions"><button class="btn primary mini" data-toast="已模拟打开任务跟踪">任务跟踪</button><button class="btn outline-primary mini" data-toast="已模拟打开提单信息">提单信息</button></div></div>
    <div class="task-section"><h4>任务基础信息</h4><div class="grid-5">${f(taskBase)}</div></div>
    <div class="task-section"><h4>水运任务信息</h4><div class="grid-6">${f(water)}</div></div>
    <div class="task-section"><h4>线路详情</h4><div class="grid-5">${f(start)}</div><div class="section-mini-title">商品清单</div>${commodityTable()}<div class="section-mini-title">目的港</div><div class="grid-5">${f(dest)}</div><div class="relay-band">运输接力信息</div><div class="grid-4">${f(relay)}</div><div class="section-mini-title">接力商品列表</div>${commodityTable()}</div>
    <div class="task-section"><h4>任务要求</h4><div class="grid-5">${f(req)}${field('备注','',{textarea:true,readonly:true})}</div></div>
    <div class="task-section"><h4>保险信息</h4><div class="grid-6">${f(insurance)}</div></div>
    <div class="task-section"><div class="exec-fee-title"><span>费用明细信息</span><span style="font-size:12px;font-weight:400;color:#686f80">共1条　汇总原币金额：人民币 1　汇总本币金额：人民币1</span></div><div class="grid-5" style="margin-bottom:12px">${f(payment)}</div>${taskFeeTable()}</div>
    <div class="task-section"><h4>集装箱信息</h4>${taskContainerTable()}</div>
    <div class="task-section"><h4>收发通信息</h4><div class="grid-3">${f([['发货人',''],['收货人',''],['通知人',''],['发货人信息',''],['收货人信息',''],['通知人信息','']])}</div></div>
    <div class="task-section"><h4>船舶信息</h4><div class="grid-6">${f(ship)}</div></div>
    <div class="task-section"><h4>附件信息</h4>${taskAttachmentTable()}</div>
  </div>`;
}
function renderExecutionLower(){
  const org=[['业务员','黄瑞钰'],['业务员部门','数字化中心'],['业务员经营单位','供应链物流科技'],['业务员核算组','数字化中心'],['业务员公司','厦门建发生生物流有限公司'],['作业组织','数字化中心'],['作业组织人员','']];
  const base=[['物流委托编号（版本号）','FLMT202610200038（V1.0）'],['物流委托名称','ui自动化物流安排510309'],['物流委托状态','执行中'],['委托方法人公司','厦门建发生生物流有限公司'],['物流委托类型','我司委托'],['物流供应商','中联铁运集团有限公司'],['供应商商户','中联铁运集团有限公司'],['反馈方式','自反馈'],['业务类型','内贸'],['审批参考附件（仅供N8审批用，不会下发给供应商）',''],['报审说明','']];
  const sys=[['创建人','苏丽蓉'],['创建时间','2026-10-20 19:51:35'],['修改人','菜菜菜'],['修改时间','2026-10-20 19:53:25']];
  const f=arr=>arr.map(([l,v])=>field(l,v,{readonly:true})).join('');
  return `<div class="lower-layout">
    <aside class="tree-card"><div class="tree-root"><div class="tree-item">${icon('file')} <span>ui自动化物流安排510309</span></div><div class="tree-child">${icon('ship')}<span>富纳富提 - 法马古斯塔</span></div></div><div class="tree-footer"><div class="tree-add">＋ 发起物流安排</div><div class="tree-legend">异常提示图例<div class="legend-row"><span><i class="legend-dot" style="background:#f2a22a"></i>任务待确认</span><span><i class="legend-dot" style="background:#e33b3b"></i>审批驳回</span><span><i class="legend-dot" style="background:#f5c95d"></i>下发失败</span></div></div></div></aside>
    <section class="entrust-card"><div class="entrust-head"><div class="entrust-title">运输委托</div><div class="entrust-actions"><button class="btn outline-primary mini" data-toast="已模拟预览合同">预览合同</button><button class="btn outline-primary mini" data-toast="已模拟打开附件">附件</button><button class="btn outline-primary mini" data-toast="已模拟打开历史版本">历史版本</button><button class="btn outline-primary mini" data-toast="已模拟打开合同与审批进度">合同与审批进度</button><button class="btn danger-solid mini" data-toast="已模拟作废物流委托">作废</button><button class="btn primary mini" data-toast="已模拟进入版本维护">版本维护</button><button class="btn outline-primary mini" data-collapse-all>收起</button></div></div><div class="entrust-body">
      ${subCard('委托组织信息',`<div class="grid-5">${f(org)}</div>`)}
      ${subCard('委托基础信息',`<div class="grid-5">${f(base)}</div>`)}
      ${subCard('系统信息',`<div class="grid-4">${f(sys)}</div>`)}
      ${subCard('运输任务明细 <span style="font-size:12px;font-weight:400;color:#686f80">共1 条</span>',renderTaskDetails(),{noCaret:true})}
    </div></section>
  </div>`;
}

const createForm = {
  transportType:'水运',shippingType:'国际航运',loadType:'集装箱',opMode:'',billType:'',direct:'',
  packing:'FCL',boxMode:'船公司箱（COC）',cargoMode:'自揽货',agent:'菊风公司传媒有限公司b590c',agentCode:'CCT202610150013',agentSales:'',
  receiver:'',portFrom:'富纳富提',portFromRegion:'大洋洲/图瓦卢',fromTerms:'DR',fromTerminal:'',
  portTo:'香港',portToRegion:'亚洲/中国',toTerms:'DR',toTerminal:'',
  dischargePort:'',dischargePortRegion:'',dischargePlace:'',dischargePlaceRegion:'',dischargeAddress:'',
  deliveryPlace:'',deliveryPlaceRegion:'',deliveryAddress:'',otherSpecial:'',
  latestShipment:'',dischargeTerms:'',shipCert:'',shipAge:'',commission:'',emailReceiver:'',
  roadReceiver:'',roadOrigin:'',roadOriginRegion:'',roadOriginContact:'',roadOriginPhone:'',roadOriginAddress:'',
  roadDestination:'',roadDestinationRegion:'',roadDestinationContact:'',roadDestinationPhone:'',roadDestinationAddress:'',
  expectedDate:'',latestDate:'',
  etd:'',eta:'',contractNo:'',mbl:'',hbl:'',bookingNo:'',shipAgent:'',forwarder:'',shipOwner:'',
  vesselKeyword:'',mmsi:'',vesselName:'',voyageNo:'',route:'',berth:'',containerExpiry:''
};
if(LOGISTICS_SOURCE_MODE==='customer-order-single-route'){Object.assign(createForm,{transportType:'水运',shippingType:singleOrderRouteData.shippingType==='国际航运'?'国际航运':'内贸水运',loadType:singleOrderRouteData.loadType||'集装箱',packing:singleOrderRouteData.packing||'FCL',portFrom:singleOrderRouteData.origin,portFromRegion:singleOrderRouteData.originRegion||'',fromTerms:singleOrderRouteData.originTerm||'',portTo:singleOrderRouteData.destination,portToRegion:singleOrderRouteData.destinationRegion||'',toTerms:singleOrderRouteData.destinationTerm||'',etd:singleOrderRouteData.etd,eta:singleOrderRouteData.eta,contractNo:singleOrderRouteData.contractNo||'',mbl:singleOrderRouteData.mbl||'',hbl:singleOrderRouteData.hbl||'',shipOwner:singleOrderRouteData.carrier||'',vesselKeyword:singleOrderRouteData.vessel||'',vesselName:singleOrderRouteData.vessel||'',voyageNo:singleOrderRouteData.voyage||'',route:singleOrderRouteData.routeName||''});}
function cf(label,key,o={}){return field(label,createForm[key]||'',Object.assign({name:key},o));}
const multiRouteForms={};
function multiRouteInitialForm(routeId){const form={...createForm};Object.keys(form).forEach(key=>{form[key]='';});if(!EMPTY_MULTI_ROUTE_SERVICE){if(routeId==='demand-route-1')Object.assign(form,{transportType:'水运',shippingType:'国内水运',loadType:'集装箱',packing:'FCL',boxMode:'船公司箱（COC）',cargoMode:'自揽货',portFrom:'漳州',portFromRegion:'亚洲/中国',fromTerms:'CY',portTo:'天津',portToRegion:'亚洲/中国',toTerms:'CY',etd:'2026-11-20',eta:'2026-11-27'});if(routeId==='demand-route-2')Object.assign(form,{transportType:'水运',shippingType:'国内水运',loadType:'集装箱',packing:'FCL',portFrom:'泉州',portFromRegion:'亚洲/中国',fromTerms:'CY',portTo:'天津',portToRegion:'亚洲/中国',toTerms:'CY',etd:'2026-11-20',eta:'2026-11-27'});if(routeId==='demand-route-3')Object.assign(form,{transportType:'水运',shippingType:'国内水运',loadType:'集装箱',packing:'FCL',portFrom:'厦门',portFromRegion:'亚洲/中国',fromTerms:'CY',portTo:'天津',portToRegion:'亚洲/中国',toTerms:'CY',etd:'2026-11-23',eta:'2026-11-27'});}return form;}
function getMultiRouteForm(routeId){if(!multiRouteForms[routeId])multiRouteForms[routeId]=multiRouteInitialForm(routeId);return multiRouteForms[routeId];}
function routeCf(routeId,label,key,o={}){const form=getMultiRouteForm(routeId);return field(label,form[key]||'',Object.assign({},o,{name:key,routeId}));}
function captureMultiRouteForm(routeId){const form=getMultiRouteForm(routeId);document.querySelectorAll(`[data-route-id="${routeId}"][data-route-field]`).forEach(el=>{form[el.dataset.routeField]=el.value;});}
function clearMultiRouteDependentFields(form,keep=[]){const keepSet=new Set(['transportType','shippingType','loadType',...keep]);Object.keys(form).forEach(key=>{if(!keepSet.has(key))form[key]='';});}
document.addEventListener('change',event=>{const el=event.target.closest('[data-route-field]');if(!el||!MULTI_ROUTE_VIEW||state.page!=='create')return;const routeId=el.dataset.routeId;const form=getMultiRouteForm(routeId);captureMultiRouteForm(routeId);const key=el.dataset.routeField;const value=el.value;if(key==='transportType'){form.transportType=value;form.shippingType='';form.loadType='';clearMultiRouteDependentFields(form,['transportType','shippingType','loadType']);rerenderDetailPreservingScroll();return;}if(key==='loadType'){form.loadType=value;form.shippingType=form.transportType==='水运'?'内贸水运':'';clearMultiRouteDependentFields(form,['transportType','shippingType','loadType']);rerenderDetailPreservingScroll();return;}if(key==='shippingType'){form.shippingType=value;if(value!=='国际航运')form.boxMode='';rerenderDetailPreservingScroll();return;}if(['portFrom','portTo','dischargePort'].includes(key)){form[key]=value;const regionKey=key+'Region';const region=portRegions[value]||'';form[regionKey]=region;if(key==='portFrom')form.fromTerms='';if(key==='portTo')form.toTerms='';const regionEl=el.closest('[data-demand-route-card]')?.querySelector(`[data-route-field="${regionKey}"]`);if(regionEl)regionEl.value=region;return;}if(key==='roadOrigin'||key==='roadDestination'){const regionKey=key+'Region';const region=portRegions[value]||'';form[key]=value;form[regionKey]=region;const regionEl=el.closest('[data-demand-route-card]')?.querySelector(`[data-route-field="${regionKey}"]`);if(regionEl)regionEl.value=region;return;}if(key==='agent'){const code=value.indexOf('菊风公司传媒')>=0?'CCT202610150013':'';form.agent=value;form.agentCode=code;const codeEl=el.closest('[data-demand-route-card]')?.querySelector('[data-route-field="agentCode"]');if(codeEl)codeEl.value=code;return;}if(key==='vesselKeyword'){form.vesselKeyword=value;let mmsi='',name='';if(value.indexOf('中远')>=0){mmsi='412345678';name='中远海运之星';}else if(value.indexOf('海丰')>=0){mmsi='477123456';name='海丰上海';}if(mmsi){form.mmsi=mmsi;form.vesselName=name;const card=el.closest('[data-demand-route-card]');const mmsiEl=card?.querySelector('[data-route-field="mmsi"]');const nameEl=card?.querySelector('[data-route-field="vesselName"]');if(mmsiEl)mmsiEl.value=mmsi;if(nameEl)nameEl.value=name;}return;}form[key]=value;});
document.addEventListener('input',event=>{const el=event.target.closest('[data-route-field]');if(!el||!MULTI_ROUTE_VIEW||state.page!=='create')return;getMultiRouteForm(el.dataset.routeId)[el.dataset.routeField]=el.value;});

function editableTransportFields(form,cf,forceContainer=false){
  const isRoad=form.transportType==='汽运';const loadType=forceContainer?'集装箱':form.loadType;
  const common=`${cf('运输类型','transportType',{required:true,options:opts.transport})}
    ${isRoad?'':cf('航运类型','shippingType',{required:true,options:opts.shipping})}
    ${cf('装运类别','loadType',{required:true,options:isRoad?['散货','集装箱']:opts.loadType})}
    ${isRoad?'':cf('操作模式','opMode',{options:opts.opMode})}
    ${isRoad?'':cf('提单种类','billType',{options:opts.billType})}
    ${isRoad?'':cf('是否直航','direct',{options:opts.yesNo})}`;
  if(isRoad)return `${common}${cf('收货单位','roadReceiver',{placeholder:'请选择'})}${cf('起运地','roadOrigin',{placeholder:'请选择'})}${cf('起运地（国别）省市区','roadOriginRegion',{readonly:true})}${cf('起运地联系人','roadOriginContact')}${cf('起运地联系方式','roadOriginPhone')}${cf('起运地详细地址','roadOriginAddress',{readonly:true})}${cf('目的地','roadDestination',{placeholder:'请选择'})}${cf('目的地（国别）省市区','roadDestinationRegion',{readonly:true})}${cf('目的地联系人','roadDestinationContact')}${cf('目的地联系方式','roadDestinationPhone')}${cf('目的地详细地址','roadDestinationAddress',{readonly:true})}${cf('期望发运日期','expectedDate',{type:'date'})}${cf('最晚送达日期','latestDate',{type:'date'})}${cf('其他特殊要求','otherSpecial',{textarea:true,span:'span-2'})}`;
  if(loadType==='集装箱')return `${common}${cf('装箱方式','packing',{options:opts.packing})}${form.shippingType==='国际航运'?cf('订箱方式','boxMode',{options:opts.boxMode}):''}${cf('揽货方式','cargoMode',{options:opts.cargoMode})}${cf('代理','agent',{options:opts.agents})}${cf('代理代号','agentCode',{options:[form.agentCode||'CCT202610150013']})}${cf('代理业务员','agentSales')}${cf('收货地','receiver',{placeholder:'请选择'})}${cf('收货地（国别）省市区','receiverRegion',{readonly:true})}${cf('收货地详细地址','receiverAddress',{readonly:true})}${cf('起运港','portFrom',{required:true,options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门','漳州','泉州','天津']})}${cf('起运港（国别）省市区','portFromRegion',{readonly:true})}${cf('起运港服务条款','fromTerms',{required:true,options:opts.freightTerms})}${cf('起运码头','fromTerminal')}${cf('目的港','portTo',{required:true,options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门','漳州','泉州','天津']})}${cf('目的港（国别）省市区','portToRegion',{readonly:true})}${cf('目的港服务条款','toTerms',{required:true,options:opts.freightTerms})}${cf('目的码头','toTerminal')}${cf('卸货港','dischargePort',{options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门','漳州','泉州','天津']})}${cf('卸货港（国别）省市区','dischargePortRegion',{readonly:true})}${cf('卸货地','dischargePlace',{placeholder:'请选择'})}${cf('卸货地（国别）省市区','dischargePlaceRegion',{readonly:true})}${cf('卸货地详细地址','dischargeAddress',{readonly:true})}${cf('交货地','deliveryPlace',{placeholder:'请选择'})}${cf('交货地（国别）省市区','deliveryPlaceRegion',{readonly:true})}${cf('交货地详细地址','deliveryAddress',{readonly:true})}${cf('其他特殊要求','otherSpecial',{textarea:true,span:'span-2'})}`;
  if(loadType==='散货')return `${common}${cf('起运港','portFrom',{required:true,options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门','漳州','泉州','天津']})}${cf('起运港（国别）省市区','portFromRegion',{readonly:true})}${cf('起运码头','fromTerminal')}${cf('目的港','portTo',{required:true,options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门','漳州','泉州','天津']})}${cf('目的港（国别）省市区','portToRegion',{readonly:true})}${cf('目的码头','toTerminal')}${cf('卸货港','dischargePort',{options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门','漳州','泉州','天津']})}${cf('卸货港（国别）省市区','dischargePortRegion',{readonly:true})}${cf('最迟装运期','latestShipment',{type:'date'})}${cf('卸货条款','dischargeTerms',{options:['LO','FO','LO POR','CY','FIO','FLT']})}${cf('船证要求','shipCert')}${cf('船龄要求','shipAge')}${cf('佣金比例(%)','commission')}${cf('其他特殊要求','otherSpecial',{textarea:true,span:'span-2'})}`;
  if(loadType==='件杂货')return `${common}${cf('起运港','portFrom',{required:true,options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门','漳州','泉州','天津']})}${cf('起运港（国别）省市区','portFromRegion',{readonly:true})}${cf('起运港联系人','portFromContact')}${cf('起运港联系方式','portFromPhone')}${cf('起运码头','fromTerminal')}${cf('目的港','portTo',{required:true,options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门','漳州','泉州','天津']})}${cf('目的港（国别）省市区','portToRegion',{readonly:true})}${cf('目的港联系人','portToContact')}${cf('目的港联系方式','portToPhone')}${cf('目的码头','toTerminal')}${cf('卸货港','dischargePort',{options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门','漳州','泉州','天津']})}${cf('卸货港（国别）省市区','dischargePortRegion',{readonly:true})}${cf('最迟装运期','latestShipment',{type:'date'})}${cf('卸货条款','dischargeTerms',{options:['LO','FO','LO POR','CY','FIO','FLT']})}${cf('船证要求','shipCert')}${cf('船龄要求','shipAge')}${cf('佣金比例(%)','commission')}${cf('邮件接收人','emailReceiver')}${cf('其他特殊要求','otherSpecial',{textarea:true,span:'span-2'})}`;
  return `${common}${cf('其他特殊要求','otherSpecial',{textarea:true,span:'span-2'})}`;
}
function editableTransportCard(){return cubeCard('运输要求',`<div class="grid-6">${editableTransportFields(createForm,cf)}</div>`);}
function editableVoyageFields(form,cf){return `${cf('起运港ETD','etd',{type:'date'})}${cf('目的港ETA','eta',{type:'date'})}${cf('船东合约号','contractNo')}${cf('MBL#','mbl')}${cf('HBL#','hbl')}${cf('订舱单号','bookingNo')}${cf('船代','shipAgent',{options:opts.shipAgent})}${cf('货代','forwarder',{options:opts.shipAgent})}${cf('船东','shipOwner',{options:opts.shipOwner})}${cf('船名/呼号/MMSI/IMO','vesselKeyword',{placeholder:'请输入内容'})}${cf('MMSI','mmsi')}${cf('船名','vesselName')}${cf('航次','voyageNo')}${cf('航线','route',{options:opts.routes})}${cf('靠泊码头','berth')}${cf('柜期到期日','containerExpiry',{type:'date'})}`;}
function editableVoyageCard(){return cubeCard('航程要求',`<div class="grid-6">${editableVoyageFields(createForm,cf)}</div>`);}
function arrangementReferenceActions(isExec){
  const primary=isExec?'完结需求':'提交审批';
  return `<button class="btn outline-primary" data-toast="已模拟${primary}">${primary}</button><button class="btn danger" data-toast="已模拟删除确认">删除</button><button class="btn outline-primary" data-go="list">返回</button>`;
}function renderLegacyDetail(page){
  const isExec=page==='exec';
  const no=state.activeRowId||(isExec?'FLR202610200038':'FLR202610160032');
  let mainCards;
  if(isExec){
    mainCards=`${baseCard(true)}${customerCard(true)}${transportCard(true)}${voyageCard(true)}${containerCard(true)}${execFeeSection()}${profitCard(true)}${attachmentCard(true)}${systemCard(true)}`;
  }else{
    const isWater=createForm.transportType==='水运';
    const showContainer=isWater&&createForm.loadType==='集装箱';
    mainCards=`${baseCard(false)}${customerCard(false)}${editableTransportCard()}${isWater?editableVoyageCard():''}${showContainer?containerCard(false):''}${feeCard(false,'recv')}${feeCard(false,'pay')}${profitCard(false)}${attachmentCard(false)}${systemCard(false)}`;
  }
  return `<div class="detail-scroll ${state.detailView==='arrangement'&&!isExec?'empty-arrangement-scroll':''}"><div class="detail-page ${isExec?'exec-mode':'create-mode'}">
    <section class="cube-card"><div class="detail-titlebar"><div class="detail-title"><span class="caret">▼</span><span>物流需求单详情（${no}）</span><span class="expand-icon">⛶</span></div><div class="detail-actions">${detailActions(isExec)}</div></div></section>
    <div id="detailCards">${mainCards}</div>
    ${isExec?renderExecutionLower():''}
  </div></div>`;
}
const portRegions={'富纳富提':'大洋洲/图瓦卢','香港':'亚洲/中国','法马古斯塔':'欧洲/塞浦路斯','上海':'亚洲/中国','宁波':'亚洲/中国','厦门':'亚洲/中国','漳州':'亚洲/中国','泉州':'亚洲/中国','天津':'亚洲/中国'};
function captureCreateForm(){document.querySelectorAll('[data-field]').forEach(el=>{createForm[el.dataset.field]=el.value})}
function resetDependentFields(keep){const keepSet=new Set(['transportType','shippingType','loadType','opMode','billType','direct',...keep]);Object.keys(createForm).forEach(k=>{if(!keepSet.has(k))createForm[k]=''})}
function rerenderDetailPreservingScroll(){const scroller=document.querySelector('.detail-scroll');const top=scroller?scroller.scrollTop:0;render();const next=document.querySelector('.detail-scroll');if(next)next.scrollTop=top}
document.addEventListener('change',e=>{
  const el=e.target.closest('[data-field]');if(!el||state.page!=='create')return;
  captureCreateForm();const key=el.dataset.field;const val=el.value;
  if(key==='transportType'){
    createForm.transportType=val;createForm.shippingType='';createForm.loadType='';
    ['opMode','billType','direct','packing','boxMode','cargoMode','agent','agentCode','agentSales','receiver','portFrom','portFromRegion','fromTerms','fromTerminal','portTo','portToRegion','toTerms','toTerminal','dischargePort','dischargePortRegion','dischargePlace','dischargePlaceRegion','dischargeAddress','deliveryPlace','deliveryPlaceRegion','deliveryAddress','otherSpecial','latestShipment','dischargeTerms','shipCert','shipAge','commission','emailReceiver','roadReceiver','roadOrigin','roadOriginRegion','roadOriginContact','roadOriginPhone','roadOriginAddress','roadDestination','roadDestinationRegion','roadDestinationContact','roadDestinationPhone','roadDestinationAddress','expectedDate','latestDate','etd','eta','contractNo','mbl','hbl','bookingNo','shipAgent','forwarder','shipOwner','vesselKeyword','mmsi','vesselName','voyageNo','route','berth','containerExpiry'].forEach(k=>createForm[k]='');
    rerenderDetailPreservingScroll();return;
  }
  if(key==='loadType'){
    createForm.loadType=val;createForm.shippingType=createForm.transportType==='水运'?'内贸水运':'';
    resetDependentFields(['transportType','shippingType','loadType']);rerenderDetailPreservingScroll();return;
  }
  if(key==='shippingType'){
    createForm.shippingType=val;if(val!=='国际航运')createForm.boxMode='';rerenderDetailPreservingScroll();return;
  }
  if(['portFrom','portTo','dischargePort'].includes(key)){
    createForm[key]=val;const regionKey=key+'Region';const region=portRegions[val]||'';createForm[regionKey]=region;
    if(key==='portFrom')createForm.fromTerms='';if(key==='portTo')createForm.toTerms='';
    const regionEl=document.querySelector('[data-field="'+regionKey+'"]');if(regionEl)regionEl.value=region;
    return;
  }
  if(key==='roadOrigin'||key==='roadDestination'){
    const regionKey=key+'Region';const region=portRegions[val]||'';createForm[key]=val;createForm[regionKey]=region;
    const regionEl=document.querySelector('[data-field="'+regionKey+'"]');if(regionEl)regionEl.value=region;
    return;
  }
  if(key==='agent'){
    createForm.agent=val;const code=val.indexOf('菊风公司传媒')>=0?'CCT202610150013':'';createForm.agentCode=code;
    const codeEl=document.querySelector('[data-field="agentCode"]');if(codeEl)codeEl.value=code;
    return;
  }
  if(key==='vesselKeyword'){
    createForm.vesselKeyword=val;let mmsi='',name='';
    if(val.indexOf('中远')>=0){mmsi='412345678';name='中远海运之星'}else if(val.indexOf('海丰')>=0){mmsi='477123456';name='海丰上海'}
    if(mmsi){createForm.mmsi=mmsi;createForm.vesselName=name;const me=document.querySelector('[data-field="mmsi"]');const ne=document.querySelector('[data-field="vesselName"]');if(me)me.value=mmsi;if(ne)ne.value=name;}
    return;
  }
  createForm[key]=val;
});
document.addEventListener('input',e=>{const el=e.target.closest('[data-field]');if(el&&state.page==='create')createForm[el.dataset.field]=el.value});
function optimizedDetailActions(isExec, status){
  if(state.detailView==='arrangement')return `<button class="btn primary" data-toast="已模拟完结需求">完结需求</button><button class="btn danger" data-toast="已模拟删除确认">删除</button><button class="btn outline-primary" data-go="list">返回</button>`;
  const actionStatus=status||(isExec?'执行中':'创建');
  const back=`<button class="btn outline-primary" data-go="list">返回</button>`;
  const print=`<button class="btn outline-primary" data-toast="已模拟打印">打印</button>`;
  const modifyDisabled=`<button class="btn primary" disabled>修改OP</button>`;
  const modify=`<button class="btn primary" data-toast="已模拟进入修改OP">修改OP</button>`;
  const approval=`<button class="btn primary" data-toast="已模拟打开审批进度">审批进度</button>`;
  const submit=`<button class="btn outline-primary" data-demand-submit>提交审批</button>`;
  const versionMaintain=`<button class="btn outline-primary" data-version-maintain>版本维护</button>`;
  const reconcile=`<div class="dropdown-wrap"><button class="btn outline-primary" data-dropdown>发起对账 <span style="font-size:10px">⌄</span></button><div class="dropdown-menu"><button data-toast="已模拟发起客户对账">发起客户对账</button><button data-toast="已模拟发起供应商对账">发起供应商对账</button><button data-toast="已模拟发起代理对账">发起代理对账</button></div></div>`;
  const complete=`<button class="btn outline-primary" data-toast="已模拟完结需求">完结</button>`;
  const cancelComplete=`<button class="btn outline-primary" data-toast="已模拟取消完结">取消完结</button>`;
  const voidButton=`<button class="btn danger-solid" data-toast="已模拟作废">作废</button>`;
  if(actionStatus==='待审核')return back+print+modifyDisabled+approval+`<button class="btn danger" data-toast="已模拟撤销审批">撤销审批</button>`;
  if(actionStatus==='驳回'||actionStatus==='审批驳回')return back+print+modifyDisabled+approval+submit;
  if(actionStatus==='待安排')return back+print+modify+versionMaintain+complete+reconcile+voidButton+approval;
  if(actionStatus==='执行中')return back+print+modify+versionMaintain+complete+reconcile+approval;
  if(actionStatus==='已完结')return back+print+modifyDisabled+versionMaintain+cancelComplete+reconcile+approval;
  if(actionStatus==='作废')return back+modifyDisabled+approval;
  return back+print+modifyDisabled+`<button class="btn danger" data-toast="已模拟删除确认">删除</button>`+approval+submit;
}
function arrangementReferenceActions(isExec){
  const primary=isExec?'完结需求':'提交审批';
  return `<button class="btn outline-primary" data-toast="已模拟${primary}">${primary}</button><button class="btn danger" data-toast="已模拟删除确认">删除</button><button class="btn outline-primary" data-go="list">返回</button>`;
}function renderLegacyDetail(page){
  const isExec=page==='exec';
  const no=state.activeRowId||(isExec?'FLR202610200038':'FLR202610160032');
  let infoCards;
  if(isExec){
    infoCards=`${baseCard(true)}${customerCard(true)}${transportCard(true)}${voyageCard(true)}${containerCard(true)}${execFeeSection()}${profitCard(true)}${attachmentCard(true)}${systemCard(true)}`;
  }else{
    const isWater=createForm.transportType==='水运';
    const showContainer=isWater&&createForm.loadType==='集装箱';
    infoCards=`${baseCard(false)}${customerCard(false)}${editableTransportCard()}${isWater?editableVoyageCard():''}${showContainer?containerCard(false):''}${feeCard(false,'recv')}${feeCard(false,'pay')}${profitCard(false)}${attachmentCard(false)}${systemCard(false)}`;
  }
  const documents=renderDocumentsView(isExec);
  const billList=renderBillList(isExec);
  const arrangement=isExec?renderExecutionLower():`<div class="arrangement-empty-shell"><span class="empty-message">暂无物流安排，请先新增物流委托。</span><button class="btn primary" data-toast="已模拟新增物流委托"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>新增物流委托</button></div>`;
  return `<div class="detail-scroll ${state.detailView==='arrangement'&&!isExec?'empty-arrangement-scroll':''}"><div class="detail-page ${isExec?'exec-mode':'create-mode'}">
    <section class="cube-card"><div class="detail-titlebar">
      <div class="detail-title">${state.detailView==='arrangement'?'':'<span style="width:8px;height:8px;border-radius:2px;background:#2563eb;display:inline-block"></span>'}<span>物流需求详情（${no}）</span><span class="expand-icon">⛶</span></div>
      <span class="detail-status ${isExec?'running':'draft'}">${isExec?'执行中':'创建'}</span>
      <div class="detail-view-switch"><button class="detail-view-tab ${state.detailView==='info'?'active':''}" data-detail-view="info">需求与服务要求</button><button class="detail-view-tab ${state.detailView==='arrangement'?'active':''}" data-detail-view="arrangement">物流安排 <span class="count">(${isExec?1:0})</span></button><button class="detail-view-tab ${state.detailView==='documents'?'active':''}" data-detail-view="documents">实际收付</button></div>
      <div class="detail-actions">${state.detailView==='arrangement'?arrangementReferenceActions(isExec):optimizedDetailActions(isExec)}</div>
    </div></section>
    <div class="detail-view-panel ${state.detailView==='info'?'active':''}" data-view-panel="info">${infoCards}</div>
    <div class="detail-view-panel ${state.detailView==='arrangement'?'active':''}" data-view-panel="arrangement">${arrangement}</div>
    <div class="detail-view-panel ${state.detailView==='documents'?'active':''}" data-view-panel="documents">${documents}</div>
  </div></div>`;
}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-detail-view]');
  if(t){state.detailView=t.dataset.detailView;render();return;}
  const go=e.target.closest('[data-go]');
  if(go&&(go.dataset.go==='list'||go.dataset.go==='create'||go.dataset.go==='exec')){state.detailView='info';state.detailSection='overview';}
});
function renderReferenceTask(){
  const taskBase=[['任务编号','FLST202610200038',true],['任务模版','基础水运集装箱模板',true],['任务类型','水运',true],['装运类别','集装箱',true],['跟踪方式','按箱跟踪',true],['保险状态','未预保'],['反馈确认状态',''],['申请反馈确认时间',''],['确认反馈通过时间','']];
  const water=[['水运运输类型',''],['航运类型','内贸水运',true],['航线',''],['装箱方式','FCL'],['订箱方式','船公司箱（COC）'],['免箱天数',''],['Scac Code',''],['船东公司',''],['Last Free Day',''],['Empty Return','2026-10-20'],['订舱经理','黄瑞钰']];
  const start=[['起运港','富纳富提',true],['国别地区','大洋洲/图瓦卢',true],['联系人',''],['联系方式',''],['起运码头',''],['最迟装船日',''],['预计发运时间','2026-10-20 19:51:42'],['发货方名称',''],['提货时间','']];
  const dest=[['目的港','法马古斯塔',true],['国别地区','欧洲/塞浦路斯',true],['联系人',''],['联系方式',''],['目的码头',''],['货物交接方式',''],['最晚送达时间','2026-10-20 19:51:45'],['收货单位','自动化收货单位'],['卸货时间','']];
  const relay=[['下段运输方式',''],['载具名称（船名）',''],['预计转运时间',''],['接货联系人（联系方式）','']];
  const req=[['是否控货',''],['起运港服务条款','CY'],['目的港服务条款','CY'],['运输条款','水运港到港']];
  const insurance=[['是否免保险','是'],['免保险原因','钢厂代办'],['投保方式','线下投保'],['保险公司','中国人民财产保险股份有限公司宁波市分公司'],['是否免赔','否'],['是否变更投保目的港','否']];
  const payment=[['运费支付方式','托运方支付'],['是否由我司支付运费','是'],['付款方式','我司自结'],['开票抬头','厦门建发生生物流有限公司'],['开票要求','一票制（9点）']];
  const ship=[['MMSI（船东号）',''],['船名',''],['中文船名',''],['建造日期',''],['呼号',''],['船长',''],['船宽',''],['左舷距',''],['尾距','']];
  const f=arr=>arr.map(([l,v,r])=>field(l,v,{readonly:false,required:!!r})).join('');
  const tabs=[['line','线路信息'],['transport','水运任务信息'],['requirements','任务要求'],['insurance','保险信息'],['fees','费用信息'],['send','收发通信息'],['vessel','船舶信息'],['letters','介绍信/提货通知书'],['attachments','附件信息']];
  return `<article class="ref-task-card">
    <div class="ref-task-head"><span class="task-index">任务 1</span>${icon('ship')}<span class="task-name">华东物流运营中心 / 上海调度组 → 客户收货仓</span><span class="tag blue">集装箱</span><span class="tag" style="background:#fffbeb;color:#b45309">待确认</span><div class="ref-task-tools"><button class="btn outline-primary mini" data-toast="已模拟引用表单">引用表单</button><button class="btn outline-primary mini" data-toast="已模拟复制任务">复制任务</button><button class="btn danger mini" data-toast="已模拟删除任务">删除任务</button></div></div>
    <div class="ref-task-meta"><span>任务编号 <b>FLST202610200038</b></span><span>任务模版 <b>基础水运集装箱模板</b></span><span>关联资源 <b style="color:#2563eb">RS202609140001</b> · 下游方案</span><button class="btn link">解除关联</button></div>
    <div class="ref-task-tabs">${tabs.map(([k,l],i)=>`<button class="ref-task-tab ${i===0?'active':''}" data-ref-task-tab="${k}">${l}</button>`).join('')}</div>
    <div class="ref-task-panes">
      <div class="ref-task-pane active" data-ref-task-pane="line"><div class="grid-5">${f(start)}</div><h5>商品清单</h5>${commodityTable()}<h5>目的港</h5><div class="grid-5">${f(dest)}</div><div class="relay-band">运输接力信息</div><div class="grid-4">${f(relay)}</div><h5>接力商品列表</h5>${commodityTable()}</div>
      <div class="ref-task-pane" data-ref-task-pane="transport"><div class="grid-6">${f(water)}</div><h5>集装箱信息</h5>${taskContainerTable()}</div>
      <div class="ref-task-pane" data-ref-task-pane="requirements"><div class="grid-5">${f(req)}${field('备注','',{textarea:true})}</div></div>
      <div class="ref-task-pane" data-ref-task-pane="insurance"><div class="grid-6">${f(insurance)}</div></div>
      <div class="ref-task-pane" data-ref-task-pane="fees"><div class="grid-5">${f(payment)}</div><h5>费用明细</h5>${taskFeeTable()}</div>
      <div class="ref-task-pane" data-ref-task-pane="send"><div class="grid-3">${f([['发货人',''],['收货人',''],['通知人',''],['发货人信息',''],['收货人信息',''],['通知人信息','']])}</div></div>
      <div class="ref-task-pane" data-ref-task-pane="vessel"><div class="grid-6">${f(ship)}</div></div>
      <div class="ref-task-pane" data-ref-task-pane="letters"><div class="ref-file-toolbar"><button class="btn outline-primary mini" data-toast="已模拟上传附件">上传附件</button><button class="btn outline-primary mini" data-toast="已模拟生成介绍信">生成介绍信/提货通知书</button></div>${taskAttachmentTable()}</div>
      <div class="ref-task-pane" data-ref-task-pane="attachments"><div class="upload-box" style="margin-bottom:12px">拖拽或点击上传　doc/pdf/png/jpg/xlsx · ≤20MB</div>${taskAttachmentTable()}</div>
    </div>
    <div class="ref-task-footer"><button class="btn outline-primary mini" data-open-logistics-task>＋ 新增任务</button></div>
  </article>`;
}
function renderExecutionLower(){
  const base=[['物流委托名称','ui自动化物流安排510309',true],['委托方法人公司','厦门建发生生物流有限公司',true],['物流委托类型','我司委托',true],['物流供应商','中联铁运集团有限公司',true],['供应商商户','中联铁运集团有限公司',true],['反馈方式','自反馈',true],['来源单据类型','采购/移仓'],['来源单据号',''],['作业组织','数字化中心',true],['作业组织人员',''],['委托备注','北港到厂水运入库，靠泊窗口需提前与港口调度确认。'],['报审说明','']];
  const fields=base.map(([l,v,r],i)=>field(l,v,{readonly:false,required:!!r,textarea:l==='委托备注'||l==='报审说明',span:i===0?'span-2':(l==='委托备注'||l==='报审说明')?'span-3':''})).join('');
  return `<div class="execution-ref-layout">
    <aside class="execution-tree-card"><div class="execution-tree-head"><span>执行结构</span><button class="btn link" data-toast="已模拟收起执行结构">«</button></div><div class="execution-tree-list"><button class="exec-delegation-node">${icon('order')}<span>ui自动化物流安排510309</span><span class="exec-delegation-status">执行中</span></button><button class="exec-task-node active">${icon('ship')}<span>华东物流运营中心 / 上海调度组 → 客户收货仓</span></button></div><button class="exec-add-delegation" type="button" data-launch-logistics-arrangement data-demand-no="${esc(state.activeRowId||'FLR202610200038')}" data-demand-type="水运集装箱" data-demand-dept="数字化中心" data-demand-sales="苏丽蓉" data-demand-company="厦门建发生生物流有限公司">＋ 发起物流安排</button></aside>
    <section class="delegation-ref-card">
      <div class="delegation-ref-head"><span class="tag" style="background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe">执行中</span><h3>ui自动化物流安排510309</h3><span class="delegation-code">FLMT202610200038 · V1.0</span><div class="delegation-ref-actions"><button class="btn outline-primary mini" data-toast="已模拟打开合同信息">合同信息</button><button class="btn outline-primary mini" data-toast="已模拟打开审批进度">审批进度</button><button class="btn outline-primary mini" data-toast="已模拟打开附件">附件</button><button class="btn outline-primary mini" data-toast="已模拟打开历史版本">历史版本</button><button class="btn primary mini" data-toast="已模拟提交审批">提交审批</button><button class="btn outline-primary mini" data-toast="已模拟复制委托">复制</button><button class="btn danger mini" data-toast="已模拟删除委托">删除</button></div></div>
      <div class="delegation-ref-meta"><span>来源 <b>控制塔</b></span><span>业务员 <b>黄瑞钰</b></span><span>部门 <b>数字化中心</b></span><span>经营单位 <b>供应链物流科技</b></span><span>核算组织 <b>数字化中心</b></span><span>公司 <b>厦门建发生生物流有限公司</b></span><span>创建 <b>苏丽蓉 · 2026-10-20 19:51:35</b></span><span>修改 <b>菜菜菜 · 2026-10-20 19:53:25</b></span></div>
      <div class="delegation-ref-body"><section class="ref-subcard"><div class="ref-subhead">委托基础信息 <span>⌄</span></div><div class="grid-6">${fields}</div></section><div class="ref-task-list-title">任务列表 <span>1</span></div>${renderReferenceTask()}</div>
    </section>
  </div>`;
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-ref-task-tab]');if(t){const card=t.closest('.ref-task-card');card.querySelectorAll('[data-ref-task-tab]').forEach(x=>x.classList.toggle('active',x===t));card.querySelectorAll('[data-ref-task-pane]').forEach(p=>p.classList.toggle('active',p.dataset.refTaskPane===t.dataset.refTaskTab));}});
function customerOverviewCard(isExec){
  const d=isExec?{order:'FCO202610200037',company:'青岛绿洲园花生食品有限公司',date:'2026-10-20',contact:'清清',email:'',sales:'黄瑞钰',agent:'',remark:'自动化订单备注'}:{order:'FCO202610160032',company:'成都柠檬时光科技有限公司',date:'2026-10-16',contact:'11',email:'',sales:'林美燕',agent:'菊风公司传媒有限公司b590c',remark:'自动化订单备注'};
  const tags=['运输','内贸',isExec?'水运':createForm.transportType,isExec?'集装箱':createForm.loadType].filter(Boolean).map((t,i)=>`<span class="tag ${i<2?'blue':'cyan'}">${esc(t)}</span>`).join('');
  const item=(l,v)=>`<div class="customer-summary-item"><span>${l}</span><b>${v||'—'}</b></div>`;
  return cubeCard('客户信息',`<div class="customer-summary-head"><div class="customer-order-line"><span class="order-no">${d.order}</span><span style="font-size:11px;color:#94a3b8">（外部客户）</span><div class="customer-order-tags">${tags}</div></div><div class="customer-company">${d.company}</div></div><div class="customer-summary-grid">${item('委托方组织','')}${item('结算抬头',d.company)}${item('业务日期',d.date)}${item('联系人',d.contact)}${item('联系邮箱',d.email)}${item('业务员',d.sales)}${item('代理',d.agent)}${item('备注',d.remark)}</div>`,{actions:'<button class="btn outline-primary mini" data-toast="已模拟查看关联客户订单">查看关联客户订单</button>'});
}
function goodsDetailCard(isExec){
  const g=isExec?{no:'FCO202610200037',customer:'青岛绿洲园花生食品有限公司',name:'玉米',u1:'吨',u2:'立方米',u3:'吨'}:{no:'FCO202610160032',customer:'成都柠檬时光科技有限公司',name:'玉米',u1:'吨',u2:'立方米',u3:'吨'};
  const body=`<div class="goods-summary-bar"><span>共 <b>1</b> 条商品</span><span>标准数量 <b>1 ${g.u3}</b></span><span>毛重 <b>—</b></span><span>体积 <b>—</b></span><span>货值 <b>—</b></span></div><div class="table-scroll goods-table-scroll"><table class="mini-table" style="min-width:1500px"><thead><tr><th style="width:150px">客户订单编号</th><th style="width:180px">客户</th><th style="width:130px">商品中文名</th><th style="width:140px">商品描述</th><th style="width:105px">件数/单位</th><th style="width:105px">毛重/单位</th><th style="width:105px">体积/单位</th><th style="width:125px">标准数量/单位</th><th style="width:100px">单件重量</th><th style="width:120px">单件重量单位</th><th style="width:120px">规格尺寸</th><th style="width:100px">溢装率（%）</th><th style="width:100px">短装率（%）</th><th style="width:130px">货物单价（元）</th><th style="width:140px">货物总价（万元）</th><th style="width:180px">贸易合同号（类型）</th><th style="width:150px">商品英文名</th><th style="width:80px">操作</th></tr></thead><tbody><tr><td>${g.no}</td><td>${g.customer}</td><td>${g.name}</td><td></td><td></td><td>${g.u1}</td><td>${g.u2}</td><td>${g.u3}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><span class="goods-cell-value">线路1 / 1</span></td><td><span class="goods-cell-value">—</span></td><td><span class="goods-cell-value">${isExec?'HT202610200037':'HT202610160032'}</span></td><td>${isExec?'':'<button class="btn link" style="color:var(--danger)">删除</button>'}</td></tr></tbody></table></div>`;
  return cubeCard('商品明细列表',body,{actions:isExec?'':'<button class="btn outline-primary mini" data-toast="已模拟打开商品选择弹窗">选择商品</button>'});
}
function renderLegacyDetail(page){
  const isExec=page==='exec';
  const no=state.activeRowId||(isExec?'FLR202610200038':'FLR202610160032');
  const isWater=isExec||createForm.transportType==='水运';
  const showContainer=isExec||(isWater&&createForm.loadType==='集装箱');
  const overview=`${baseCard(isExec)}${customerCard(isExec)}`;
  const transport=isExec?`${transportCard(true)}${voyageCard(true)}${containerCard(true)}`:`${editableTransportCard()}${isWater?editableVoyageCard():''}${showContainer?containerCard(false):''}`;
  const fees=isExec?`${execFeeSection()}${profitCard(true)}`:`${feeCard(false,'recv')}${feeCard(false,'pay')}${profitCard(false)}`;
  const records=`${attachmentCard(isExec)}${systemCard(isExec)}`;
  const sections=[['overview','基础信息'],['transport','运输要求'],['fees','费用与利润'],['records','附件与记录']];
  const active=state.detailSection||'overview';
  const panels={overview,transport,fees,records};
  const tabs=sections.map(([id,label])=>`<button class="detail-section-tab ${active===id?'active':''}" data-detail-section="${id}">${label}</button>`).join('');
  const infoView=`<div class="detail-section-tabs">${tabs}</div>${sections.map(([id])=>`<div class="detail-section-panel ${active===id?'active':''}" data-section-panel="${id}">${panels[id]}</div>`).join('')}`;
  const documents=renderDocumentsView(isExec);
  const billList=renderBillList(isExec);
  const arrangement=isExec?renderExecutionLower():`<div class="arrangement-empty-shell"><span class="empty-message">暂无物流安排，请先新增物流委托。</span><button class="btn primary" data-toast="已模拟新增物流委托"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>新增物流委托</button></div>`;
  return `<div class="detail-scroll ${state.detailView==='arrangement'&&!isExec?'empty-arrangement-scroll':''}"><div class="detail-page ${isExec?'exec-mode':'create-mode'}">
    <section class="cube-card"><div class="detail-titlebar">
      <div class="detail-title">${state.detailView==='arrangement'?'':'<span style="width:8px;height:8px;border-radius:2px;background:#2563eb;display:inline-block"></span>'}<span>物流需求详情（${no}）</span><span class="expand-icon">⛶</span></div>
      <span class="detail-status ${isExec?'running':'draft'}">${isExec?'执行中':'创建'}</span>
      <div class="detail-view-switch"><button class="detail-view-tab ${state.detailView==='info'?'active':''}" data-detail-view="info">需求与服务要求</button><button class="detail-view-tab ${state.detailView==='arrangement'?'active':''}" data-detail-view="arrangement">物流安排 <span class="count">(${isExec?1:0})</span></button><button class="detail-view-tab ${state.detailView==='documents'?'active':''}" data-detail-view="documents">实际收付</button></div>
      <div class="detail-actions">${state.detailView==='arrangement'?arrangementReferenceActions(isExec):optimizedDetailActions(isExec, displayStatus)}</div>
    </div></section>
    <div class="detail-view-panel ${state.detailView==='info'?'active':''}" data-view-panel="info">${infoView}</div>
    <div class="detail-view-panel ${state.detailView==='arrangement'?'active':''}" data-view-panel="arrangement">${arrangement}</div>
    <div class="detail-view-panel ${state.detailView==='documents'?'active':''}" data-view-panel="documents">${documents}</div>
  </div></div>`;
}
document.addEventListener('click',e=>{const anchor=e.target.closest('[data-demand-anchor]');if(anchor){state.demandAnchor=anchor.dataset.demandAnchor;document.querySelectorAll('[data-demand-anchor]').forEach(btn=>btn.classList.toggle('active',btn===anchor));const target=document.getElementById('demand-'+anchor.dataset.demandAnchor);if(target)target.scrollIntoView({behavior:'smooth',block:'start'});return;}const t=e.target.closest('[data-detail-section]');if(t){state.detailSection=t.dataset.detailSection;if(t.dataset.detailSection==='demand'&&!state.demandAnchor)state.demandAnchor='basic';render();}});
const downstreamDocs=[
  {id:'BL202610200001',type:'提单登记单',group:'exec',status:'已签发',tone:'success',party:'中联铁运集团有限公司',related:'FLMT202610200038',amount:'—',currency:'—',ownerBlNo:'COSU6439271850',forwarderBlNo:'HBL202610200001',masterAwbNo:'—',ourHouseNo:'SZX202610200001',updated:'2026-10-20 20:12'},
  {id:'JS202610200012',type:'代理结算单',group:'settle',status:'待确认',tone:'warning',party:'中联铁运集团有限公司',related:'FLMT202610200038',amount:'15,000.00',currency:'CNY',ownerBlNo:'—',forwarderBlNo:'—',masterAwbNo:'—',ourHouseNo:'—',updated:'2026-10-21 09:36'},
  {id:'DZ202610200031',type:'客户对账单',group:'settle',status:'已对账',tone:'success',party:'青岛绿洲园花生食品有限公司',related:'FCO202610200037',amount:'19,000.00',currency:'CNY',ownerBlNo:'—',forwarderBlNo:'—',masterAwbNo:'—',ourHouseNo:'—',updated:'2026-10-21 10:18'},
  {id:'DZ202610200022',type:'供应商对账单',group:'settle',status:'待确认',tone:'warning',party:'中联铁运集团有限公司',related:'FLMT202610200038',amount:'15,000.00',currency:'CNY',ownerBlNo:'—',forwarderBlNo:'—',masterAwbNo:'—',ourHouseNo:'—',updated:'2026-10-21 10:02'},
  {id:'DZ202610200023',type:'代理对账单',group:'settle',status:'待确认',tone:'warning',party:'中联铁运集团有限公司',related:'FLMT202610200038',amount:'8,500.00',currency:'CNY',ownerBlNo:'—',forwarderBlNo:'—',masterAwbNo:'—',ourHouseNo:'—',updated:'2026-10-21 10:42'},
  {id:'CB202610200016',type:'成本发票登记单',group:'tax',status:'已登记',tone:'success',party:'中联铁运集团有限公司',related:'FLMT202610200038',amount:'12,000.00',currency:'CNY',ownerBlNo:'—',forwarderBlNo:'—',masterAwbNo:'—',ourHouseNo:'—',updated:'2026-10-21 11:12'},
  {id:'SR202610200018',type:'收入发票登记单',group:'tax',status:'已开票',tone:'success',party:'青岛绿洲园花生食品有限公司',related:'FCO202610200037',amount:'19,000.00',currency:'CNY',ownerBlNo:'—',forwarderBlNo:'—',masterAwbNo:'—',ourHouseNo:'—',updated:'2026-10-21 11:20'},
  {id:'FK202610200009',type:'付款申请单',group:'funds',status:'待审批',tone:'warning',party:'中联铁运集团有限公司',related:'FLMT202610200038',amount:'15,000.00',currency:'CNY',ownerBlNo:'—',forwarderBlNo:'—',masterAwbNo:'—',ourHouseNo:'—',updated:'2026-10-21 11:30'},
  {id:'SK202610200007',type:'收款认领单',group:'funds',status:'待认领',tone:'info',party:'青岛绿洲园花生食品有限公司',related:'FCO202610200037',amount:'19,000.00',currency:'CNY',ownerBlNo:'—',forwarderBlNo:'—',masterAwbNo:'—',ourHouseNo:'—',updated:'2026-10-21 12:08'}
];
const docGroups=[['exec','业务执行','提单及运输执行单据'],['settle','结算与对账','代理结算、客户、供应商及代理对账'],['tax','票税','成本及收入发票登记与税务信息'],['funds','资金','付款申请与收款认领']];
function docTypeButton(type){return `<button class="btn outline-primary mini" data-doc-open="${type}">${type}</button>`}
function docQuickStrip(types){return `<div class="related-doc-bar"><span class="related-doc-label">下游单据</span>${types.map(docTypeButton).join('')}<button class="btn link" data-detail-view="documents">查看全部</button></div>`}
function renderDocumentsView(isExec){
  const docs=isExec?downstreamDocs:[];
  const active=state.docFilter||'all';
  const filtered=active==='all'?docs:docs.filter(d=>d.group===active);
  const groups=docGroups.map(([id,label,desc])=>{const list=docs.filter(d=>d.group===id);return `<button class="doc-summary-card ${active===id?'active':''}" data-doc-filter="${id}"><span class="doc-summary-icon">${icon(id==='exec'?'ship':id==='settle'?'money':id==='tax'?'file':'workbench')}</span><span class="doc-summary-copy"><b>${label}</b><small>${desc}</small></span><span class="doc-summary-count">${list.length}</span></button>`}).join('');
  const chain=['需求','服务要求','物流委托','任务','提单','结算','对账','发票','收付款'];
  const currentIndex=isExec?5:0;
  const chainHtml=chain.map((name,i)=>`${i?`<span class="doc-chain-arrow">›</span>`:''}<button class="doc-chain-node ${i<currentIndex?'done':i===currentIndex?'current':''}" ${i===5?'data-detail-view="documents"':''}>${name}</button>`).join('');
  const filters=[['all','全部',docs.length],...docGroups.map(([id,l])=>[id,l,docs.filter(d=>d.group===id).length])];
  const rows=filtered.length?filtered.map(d=>`<tr><td><span class="doc-type-cell">${icon(d.group==='exec'?'ship':d.group==='settle'?'money':d.group==='tax'?'file':'workbench')}${d.type}</span></td><td><span class="doc-no">${d.id}</span></td><td><span class="doc-status ${d.tone}">${d.status}</span></td><td>${d.party}</td><td>${d.related}</td><td class="doc-amount">${d.amount==='—'?'—':`<b>${d.currency}</b> ${d.amount}`}</td><td>${d.updated}</td><td><button class="btn link" data-doc-open="${d.id}">查看</button><button class="btn link" data-toast="已模拟进入${d.type}">进入单据</button></td></tr>`).join(''):`<tr><td colspan="8" class="doc-empty">暂无可关联单据</td></tr>`;
  return `<div class="doc-center">
    <div class="doc-chain-card"><div class="doc-chain-title">业务单据链路</div><div class="doc-chain">${chainHtml}</div></div>
    <div class="doc-summary-grid">${groups}</div>
    <section class="cube-card doc-list-card"><div class="doc-list-head"><div class="doc-list-title">单据列表 <span>${docs.length}</span></div><div class="doc-filter-tabs">${filters.map(([id,l,n])=>`<button class="doc-filter ${active===id?'active':''}" data-doc-filter="${id}">${l} <b>${n}</b></button>`).join('')}</div><div class="dropdown-wrap"><button class="btn primary" data-dropdown>＋ 新建单据 <span style="font-size:10px">⌄</span></button><div class="dropdown-menu"><button data-doc-open="新建提单登记单">提单登记单</button><button data-doc-open="新建代理结算单">代理结算单</button><button data-doc-open="新建客户对账单">客户对账单</button><button data-doc-open="新建供应商对账单">供应商对账单</button><button data-doc-open="新建代理对账单">代理对账单</button><button data-doc-open="新建成本发票登记单">成本发票登记单</button><button data-doc-open="新建收入发票登记单">收入发票登记单</button><button data-doc-open="新建付款申请单">付款申请单</button><button data-doc-open="新建收款认领单">收款认领单</button></div></div></div><div class="table-scroll"><table class="mini-table doc-table"><thead><tr><th>单据类型</th><th>单据编号</th><th>状态</th><th>客户 / 供应商</th><th>关联单据</th><th>金额</th><th>更新时间</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div></section>
  </div>`;
}
function openDocDrawer(key){
  document.querySelectorAll('.dropdown-menu.open').forEach(m=>m.classList.remove('open'));
  const doc=allDocRecords().find(d=>d.id===key)||allDocRecords().find(d=>d.type===key);
  const type=doc?doc.type:key.replace(/^新建/,'');
  const title=doc?`${doc.type} ${doc.id}`:type;
  const overlay=document.createElement('div');overlay.className='doc-drawer-overlay';
  overlay.innerHTML=`<aside class="doc-drawer"><div class="doc-drawer-head"><div><h3>${title}</h3><span>${doc?'关联单据摘要':'尚未创建，录入后可进入完整单据'}</span></div><button class="btn link" data-doc-close style="font-size:18px">×</button></div><div class="doc-drawer-body"><div class="doc-drawer-status"><span class="doc-status ${doc?doc.tone:'muted'}">${doc?doc.status:'未创建'}</span></div><div class="doc-detail-grid"><div><span>关联需求</span><b>FLR202610200038</b></div><div><span>业务对象</span><b>${doc?doc.party:'待选择'}</b></div><div><span>关联单据</span><b>${doc?doc.related:'—'}</b></div><div><span>金额</span><b>${doc?`${doc.currency} ${doc.amount}`:'—'}</b></div><div><span>更新时间</span><b>${doc?doc.updated:'—'}</b></div><div><span>制单人</span><b>苏丽蓉</b></div></div><div class="doc-drawer-note">${doc?'该单据已与当前需求建立关联，可在单据中心继续处理。':'请确认业务对象及金额后创建单据，创建后将自动回写至当前需求。'}</div></div><div class="doc-drawer-foot"><button class="btn" data-doc-close>关闭</button><button class="btn primary" data-toast="已模拟进入${type}">进入${type}</button></div></aside>`;
  document.body.appendChild(overlay);document.body.classList.add('drawer-open');
  overlay.addEventListener('click',e=>{if(e.target===overlay||e.target.closest('[data-doc-close]'))closeDocDrawer()});
}
function closeDocDrawer(){document.querySelectorAll('.doc-drawer-overlay').forEach(e=>e.remove());document.body.classList.remove('drawer-open')}
document.addEventListener('click',e=>{
  const open=e.target.closest('[data-doc-open]');if(open){openDocDrawer(open.dataset.docOpen);return}
  const filter=e.target.closest('[data-doc-filter]');if(filter){state.docFilter=filter.dataset.docFilter;render();return}
});
const docModuleMeta={
  '提单登记单':{desc:'运输执行与提单登记信息',icon:'ship',newLabel:'新建提单登记单'},
  '代理结算单':{desc:'代理费用结算与确认',icon:'money',newLabel:'新建代理结算单'},
  '客户对账单':{desc:'客户应收对账与差异处理',icon:'customer',newLabel:'新建客户对账单'},
  '供应商对账单':{desc:'供应商应付对账与差异处理',icon:'supplier',newLabel:'新建供应商对账单'},
  '代理对账单':{desc:'代理费用对账与差异处理',icon:'money',newLabel:'新建代理对账单'},
  '成本发票登记单':{desc:'成本进项发票登记与查验',icon:'file',newLabel:'新建成本发票登记单'},
  '收入发票登记单':{desc:'收入销项发票开具与登记',icon:'file',newLabel:'新建收入发票登记单'},
  '付款申请单':{desc:'供应商付款申请与审批',icon:'money',newLabel:'新建付款申请单'},
  '收款认领单':{desc:'客户回款认领与核销',icon:'money',newLabel:'新建收款认领单'}
};
function renderDocumentsView(isExec){
  const docs=isExec?downstreamDocs:[];
  return `<div class="doc-modules-grid">${Object.keys(docModuleMeta).map(type=>{
    const meta=docModuleMeta[type];const list=docs.filter(d=>d.type===type);
    const content=list.length?list.map(d=>`<button class="doc-module-row" data-doc-open="${d.id}"><span class="doc-row-main"><b>${d.id}</b><small>关联 ${d.related}</small></span><span class="doc-status ${d.tone}">${d.status}</span><span class="doc-row-party">${d.party}</span><span class="doc-row-amount">${d.amount==='—'?'—':`${d.currency} ${d.amount}`}</span><span class="doc-row-arrow">›</span></button>`).join(''):`<div class="doc-module-empty"><span>暂无可关联单据</span><button class="btn link" data-doc-open="${meta.newLabel}">立即创建</button></div>`;
    return `<section class="doc-module"><div class="doc-module-head"><span class="doc-module-icon">${icon(meta.icon)}</span><div class="doc-module-copy"><b>${type}</b><small>${meta.desc}</small></div><span class="doc-module-count">${list.length}</span><button class="btn outline-primary mini" data-doc-open="${meta.newLabel}">＋ 新建</button></div><div class="doc-module-body">${content}</div></section>`;
  }).join('')}</div>`;
}
function openDocDrawer(key){
  document.querySelectorAll('.dropdown-menu.open').forEach(m=>m.classList.remove('open'));
  const doc=allDocRecords().find(d=>d.id===key)||allDocRecords().find(d=>d.type===key);
  const type=doc?doc.type:String(key||'').replace(/^新建/,'');
  if(state.page!=='document')state.docReturnPage=state.page;
  state.activeDocId=doc?doc.id:`new:${type}`;state.page='document';render();
}
function renderDocumentPage(){
  const raw=String(state.activeDocId||'');
  const doc=allDocRecords().find(d=>d.id===raw);
  const type=doc?doc.type:raw.replace(/^new:/,'');
  const v=doc||{id:'待生成',type,status:'未创建',tone:'muted',party:'待选择',related:'—',amount:'—',currency:'—',updated:'—'};
  const actions=`<button class="btn outline-primary" data-doc-back>返回实际收付</button><button class="btn outline-primary" data-toast="已模拟打印">打印</button><div class="dropdown-wrap"><button class="btn primary" data-dropdown>进入单据处理 <span style="font-size:10px">⌄</span></button><div class="dropdown-menu"><button data-toast="已模拟提交">提交</button><button data-toast="已模拟审核">审核</button><button data-toast="已模拟导出">导出</button></div></div>`;
  const steps=['创建','审核','业务处理','完成'];const current=v.status==='未创建'?0:['待确认','待审批','待认领'].includes(v.status)?2:3;
  return `<div class="detail-scroll"><div class="detail-page document-detail-page">
    <div class="doc-breadcrumb"><button class="btn link" data-doc-back>实际收付</button><span>/</span><span>${type||'单据详情'}</span></div>
    <section class="cube-card"><div class="doc-detail-titlebar"><div class="doc-detail-title"><span class="doc-detail-kind">${v.type}</span><h1>${v.id}</h1><span class="doc-status ${v.tone}">${v.status}</span></div><div class="detail-actions">${actions}</div></div></section>
    <div class="doc-detail-summary"><div><span>客户 / 供应商</span><b>${v.party}</b></div><div><span>关联单据</span><b>${v.related}</b></div><div><span>单据金额</span><b>${v.amount==='—'?'—':`${v.currency} ${v.amount}`}</b></div><div><span>更新时间</span><b>${v.updated}</b></div></div>
    <div class="doc-detail-columns"><section class="cube-card"><div class="cube-head"><div class="title">单据基础信息</div></div><div class="cube-body"><div class="grid-4">${field('单据类型',v.type,{readonly:true})}${field('单据编号',v.id,{readonly:true})}${field('单据状态',v.status,{readonly:true})}${field('客户 / 供应商',v.party,{readonly:true})}${field('关联需求','FLR202610200038',{readonly:true})}${field('关联客户订单','FCO202610200037',{readonly:true})}${field('关联物流委托','FLMT202610200038',{readonly:true})}${field('制单人','苏丽蓉',{readonly:true})}</div></div></section><section class="cube-card"><div class="cube-head"><div class="title">金额与结算信息</div></div><div class="cube-body"><div class="grid-4">${field('币种',v.currency,{readonly:true})}${field('含税金额',v.amount,{readonly:true})}${field('税额','—',{readonly:true})}${field('已结算金额','10,000.00',{readonly:true})}${field('未结算金额',v.amount==='—'?'—':'5,000.00',{readonly:true})}${field('对账期间','2026-10',{readonly:true})}${field('发票类型','增值税专用发票',{readonly:true})}${field('结算方式','月结',{readonly:true})}</div></div></section></div>
    <section class="cube-card"><div class="cube-head"><div class="title">流程进度</div></div><div class="cube-body"><div class="doc-timeline">${steps.map((s,i)=>`<div class="doc-timeline-item ${i<current?'done':i===current?'current':''}"><span class="doc-timeline-dot"></span><b>${s}</b><small>${i<current?'已完成':i===current?v.status:'待处理'}</small></div>`).join('')}</div></div></section>
    <section class="cube-card"><div class="cube-head"><div class="title">附件与操作记录</div></div><div class="cube-body"><div class="upload-box" style="margin-bottom:12px">拖拽文件至此处或点击上传</div><div class="table-scroll"><table class="mini-table" style="min-width:720px"><thead><tr><th>操作时间</th><th>操作人</th><th>操作内容</th><th>备注</th></tr></thead><tbody><tr><td>${v.updated}</td><td>苏丽蓉</td><td>查看单据</td><td>从需求详情进入</td></tr></tbody></table></div></div></section>
  </div></div>`;
}
document.addEventListener('click',e=>{if(e.target.closest('[data-doc-back]')){state.page=state.docReturnPage||'exec';state.detailView='documents';render();}});
function renderDocumentsView(isExec){
  const docs=isExec?downstreamDocs:[];
  const types=Object.keys(docModuleMeta);
  const selected=types.includes(state.docFilter)?state.docFilter:types[0];
  const shown=docs.filter(d=>d.type===selected);
  const pending=shown.filter(d=>['待确认','待审批','待认领'].includes(d.status)).length;
  const nav=types.map(t=>`<button class="doc-type-tab ${selected===t?'active':''}" data-doc-type="${t}">${t}<span>${docs.filter(d=>d.type===t).length}</span></button>`).join('');
  const showType=false;
  const rows=shown.length?shown.map(d=>`<tr><td><button class="doc-number-link" data-doc-open="${d.id}">${d.id}</button></td>${showType?`<td><span class="doc-type-cell">${icon(d.group==='exec'?'ship':d.group==='settle'?'money':d.group==='tax'?'file':'workbench')}${d.type}</span></td>`:''}<td><span class="doc-status ${d.tone}">${d.status}</span></td><td>${d.party}</td><td>${d.related}</td><td>${d.amount==='—'?'—':`${d.currency} ${d.amount}`}</td><td>${d.updated}</td><td><button class="btn link" data-doc-open="${d.id}">查看详情</button></td></tr>`).join(''):`<tr><td colspan="${showType?8:7}" class="doc-empty">暂无单据，可点击右上角“新建单据”发起</td></tr>`;
  return `<div class="doc-center doc-center-nav">
    <div class="doc-type-nav-row"><div class="doc-type-nav">${nav}</div><div class="dropdown-wrap"><button class="btn primary" data-dropdown>＋ 新建单据 <span style="font-size:10px">⌄</span></button><div class="dropdown-menu"><button data-doc-open="新建提单登记单">提单登记单</button><button data-doc-open="新建代理结算单">代理结算单</button><button data-doc-open="新建客户对账单">客户对账单</button><button data-doc-open="新建供应商对账单">供应商对账单</button><button data-doc-open="新建代理对账单">代理对账单</button><button data-doc-open="新建成本发票登记单">成本发票登记单</button><button data-doc-open="新建收入发票登记单">收入发票登记单</button><button data-doc-open="新建付款申请单">付款申请单</button><button data-doc-open="新建收款认领单">收款认领单</button></div></div></div>
    <section class="cube-card doc-list-card"><div class="doc-list-head"><div class="doc-heading-block"><div class="doc-list-title">${selected}<span>${shown.length}</span></div><div class="doc-list-sub">${pending?`${pending} 条待处理`:'暂无待处理事项'} · 按更新时间倒序</div></div><div class="doc-list-filters"><input class="doc-search" placeholder="搜索单据编号、客户或供应商"><select class="doc-status-filter"><option>全部状态</option><option>待确认</option><option>待审批</option><option>已对账</option><option>已完成</option></select></div></div><div class="doc-fixed-table"><table class="mini-table doc-table"><thead><tr><th>单据编号</th>${showType?'<th>单据类型</th>':''}<th>状态</th><th>客户 / 供应商</th><th>关联单据</th><th>金额</th><th>更新时间</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div><div class="doc-pagination"><span>共 ${shown.length} 条</span><button class="page-btn active">1</button><span class="doc-page-size">每页 20 条</span></div></section>
  </div>`;
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-doc-type]');if(t){state.docFilter=t.dataset.docType;render();}});
function customerCard(isExec){
  const d=isExec?{order:'FCO202610200037',company:'青岛绿洲园花生食品有限公司',date:'2026-10-20',contact:'清清',email:'',sales:'黄瑞钰',agent:'',remark:'自动化订单备注',goods:{no:'FCO202610200037',customer:'青岛绿洲园花生食品有限公司',name:'玉米',category:'农副产品',unit1:'吨',unit2:'立方米',unit3:'吨'}}:{order:'FCO202610160032',company:'成都柠檬时光科技有限公司',date:'2026-10-16',contact:'11',email:'',sales:'林美燕',agent:'菊风公司传媒有限公司b590c',remark:'自动化订单备注',goods:{no:'FCO202610160032',customer:'成都柠檬时光科技有限公司',name:'玉米',category:'农副产品',unit1:'吨',unit2:'立方米',unit3:'吨'}};
  const transport=isExec?'水运 集装箱':`${createForm.transportType||'运输'} ${createForm.loadType||''}`.trim();
  const tags=['运输','内贸',transport].filter(Boolean).map(t=>`<span class="order-tag">${esc(t)}</span>`).join('');
  const meta=(l,v)=>`<div class="related-meta"><span class="related-meta-label">${l}</span><span class="related-meta-value" title="${esc(v||'')}">${v||'—'}</span></div>`;
  return `<section class="cube-card customer-goods-card"><div class="cube-head"><button class="collapse-btn" data-collapse aria-label="收起"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button><div class="title">客户及商品明细</div></div><div class="cube-body"><div class="customer-goods-layout">
    <section class="related-orders-panel"><div class="related-orders-head">查看关联客户订单 <b>（1）</b></div><div class="related-order-card"><div class="related-order-top"><span class="related-order-no">${d.order}</span><span class="external-client">（外部客户）</span><div class="related-order-tags">${tags}</div><button type="button" class="related-order-open" data-customer-order-open="${d.order}" title="在新页签打开客户订单详情" aria-label="在新页签打开客户订单详情"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3h7v7M10 14 21 3M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"/></svg></button></div><div class="related-company-row"><div class="related-company">${d.company}</div><div class="related-meta"><span class="related-meta-label">委托方组织：</span><span class="related-meta-value" title="${esc(d.principalOrg)}">${d.principalOrg||'—'}</span></div></div><div class="related-meta-grid">${meta('客户单号：',d.customerNo)}${meta('结算抬头：',d.settlementHeader)}${meta('业务日期：',d.date)}${meta('联系人：',d.contact)}${meta('联系人邮箱：',d.email)}${meta('业务员：',d.sales)}${meta('代理：',d.agent)}${meta('备注：',d.remark)}</div></div></section>
    <section class="goods-panel"><div class="goods-panel-head"><span>商品明细列表</span>${isExec?'':'<button type="button" class="btn outline-primary mini" data-product-select="single">选择</button>'}</div><div class="goods-table-scroll"><table class="mini-table customer-goods-table"><thead><tr><th style="width:170px">客户订单编号</th><th style="width:180px">客户</th><th style="width:150px">商品分类</th><th style="width:150px">商品描述</th><th style="width:120px">件数/单位</th><th style="width:120px">毛重/单位</th><th style="width:130px">体积/单位</th><th style="width:130px">标准数量/单位</th><th style="width:110px">单件重量</th><th style="width:120px">规格尺寸</th><th style="width:120px">货物单价（元）</th><th style="width:260px">服务要求</th><th style="width:180px">贸易合同号（类型）</th><th style="width:80px">操作</th></tr></thead><tbody><tr class="selected-goods-row"><td>${d.goods.no}</td><td>${d.goods.customer}</td><td>${d.goods.category||d.goods.name}</td><td>—</td><td><span class="goods-cell-value">—</span></td><td><span class="goods-cell-value">—</span><span class="goods-unit">${d.goods.unit1}</span></td><td><span class="goods-cell-value">—</span><span class="goods-unit">${d.goods.unit2}</span></td><td><span class="goods-cell-value">—</span><span class="goods-unit">${d.goods.unit3}</span></td><td><span class="goods-cell-value">—</span></td><td><span class="goods-cell-value">—</span></td><td><span class="goods-cell-value">—</span></td><td>${goodsServiceRequirementCell(singleOrderRouteData)}</td><td><span class="goods-cell-value">${isExec?'HT202610200037':'HT202610160032'}</span></td><td>${isExec?'':'<button class="btn link" style="color:var(--danger)">删除</button>'}</td></tr>${demandExtraGoodsList().map(g=>`<tr><td>${g.order}</td><td>${g.customer}</td><td>${g.category}</td><td>${g.desc}</td><td><span class="goods-cell-value">${g.pieces}</span></td><td><span class="goods-cell-value">${g.gross}</span><span class="goods-unit">吨</span></td><td><span class="goods-cell-value">${g.volume}</span><span class="goods-unit">立方米</span></td><td><span class="goods-cell-value">${g.standard}</span><span class="goods-unit">吨</span></td><td><span class="goods-cell-value">—</span></td><td><span class="goods-cell-value">—</span></td><td><span class="goods-cell-value">—</span></td><td>${goodsServiceRequirementCell({id:'single-route',origin:'漳州',destination:'天津',transportType:'水运',loadType:g.loadType,detail:`额外商品关联线路：${g.route}`})}</td><td><span class="goods-cell-value">—</span></td><td><button class="btn link" style="color:var(--danger)" data-demand-goods-remove="${g.key}">删除</button></td></tr>`).join('')}</tbody></table></div></section>
  </div></div></section>`;
}
const docNames={
  '提单登记单':'水运集装箱提单登记单',
  '代理结算单':'代理费用结算单',
  '客户对账单':'客户应收对账单',
  '供应商对账单':'供应商应付对账单',
  '代理对账单':'代理费用对账单',
  '成本发票登记单':'成本进项发票登记单',
  '收入发票登记单':'收入销项发票登记单',
  '付款申请单':'供应商付款申请单',
  '收款认领单':'客户回款认领单'
};
const linkedDocs = [
  { id: 'SR202610200019', type: '收入发票登记单', group: 'tax', status: '已开票', tone: 'success', party: '青岛绿洲园花生食品有限公司', related: 'FCO202610200037', amount: '1,000.00', currency: 'CNY', updated: '2026-10-21 11:26' },
  { id: 'SK202610200008', type: '收款认领单', group: 'funds', status: '已收款', tone: 'success', party: '青岛绿洲园花生食品有限公司', related: 'FCO202610200037', amount: '1,000.00', currency: 'CNY', updated: '2026-10-21 12:18' },
  { id: 'SK202610200009', type: '收款认领单', group: 'funds', status: '待收款', tone: 'warning', party: '中联铁运集团有限公司', related: 'FLMT202610200038', amount: '3,000.00', currency: 'CNY', updated: '2026-10-21 12:26' },
  { id: 'FK202610200010', type: '付款申请单', group: 'funds', status: '已付款', tone: 'success', party: '中联铁运集团有限公司', related: 'FLMT202610200038', amount: '4,000.00', currency: 'CNY', updated: '2026-10-21 11:42' },
  { id: 'FK202610200011', type: '付款申请单', group: 'funds', status: '待审批', tone: 'warning', party: '中联铁运集团有限公司', related: 'FLMT202610200038', amount: '8,500.00', currency: 'CNY', updated: '2026-10-21 12:05' }
];

const baseCurrencyRates={CNY:1,USD:7.2,EUR:7.8};
const feeLedger = [
  { side: 'recv', statementNo: 'DZ202610200031', statementName: '青岛绿洲园花生食品有限公司 2026-10 应收对账单', statementType: '客户对账单', party: '青岛绿洲园花生食品有限公司', completedAt: '2026-10-21', fee: '海运费', taxRate: '9.00', ppcc: '到收', containerType: '20RF', remark: '客户指定船期', customer: '青岛绿洲园花生食品有限公司', orderNo: 'FCO202610200037', billType: '船东提单号', billNo: 'COSU6439271850', currency: 'CNY', amount: '12,000.00', invoiced: '12,000.00', invoices: [{ id: 'SR202610200018', status: '已开票', amount: '12,000.00', tone: 'success' }], settled: '12,000.00', outstanding: '0.00', payments: [{ id: 'SK202610200007', status: '已收款', amount: '12,000.00', tone: 'success' }], statementStatus: '已对账', statementTone: 'success', settlementStatus: '已收付', tone: 'success' },
  { side: 'recv', statementNo: 'DZ202610200031', statementName: '青岛绿洲园花生食品有限公司 2026-10 应收对账单', statementType: '客户对账单', party: '青岛绿洲园花生食品有限公司', completedAt: '2026-10-21', fee: '港杂费', taxRate: '6.00', ppcc: '到收', containerType: '20RF', remark: '含港建费', customer: '青岛绿洲园花生食品有限公司', orderNo: 'FCO202610200037', billType: '货代提单号', billNo: 'HBL202611160001', currency: 'CNY', amount: '4,000.00', invoiced: '4,000.00', invoices: [{ id: 'SR202610200018', status: '已开票', amount: '3,000.00', tone: 'success' }, { id: 'SR202610200019', status: '已开票', amount: '1,000.00', tone: 'success' }], settled: '4,000.00', outstanding: '0.00', payments: [{ id: 'SK202610200007', status: '已收款', amount: '3,000.00', tone: 'success' }, { id: 'SK202610200008', status: '已收款', amount: '1,000.00', tone: 'success' }], statementStatus: '已对账', statementTone: 'success', settlementStatus: '已收付', tone: 'success' },
  { side: 'recv', statementNo: 'DZ202610200031', statementName: '青岛绿洲园花生食品有限公司 2026-10 应收对账单', statementType: '客户对账单', party: '青岛绿洲园花生食品有限公司', completedAt: '2026-10-21', fee: '报关费', taxRate: '6.00', ppcc: '到收', containerType: '—', remark: '出口报关', customer: '青岛绿洲园花生食品有限公司', orderNo: 'FCO202610200037', billType: '货代提单号', billNo: 'HBL202611160001', currency: 'CNY', amount: '3,000.00', invoiced: '0.00', invoices: [], settled: '1,500.00', outstanding: '1,500.00', payments: [{ id: 'SK202610200008', status: '部分收款', amount: '1,500.00', tone: 'warning' }], statementStatus: '已对账', statementTone: 'success', settlementStatus: '部分收付', tone: 'warning' },
  { side: 'pay', statementNo: 'DZ202610200022', statementName: '中联铁运集团有限公司 2026-10 应付对账单', statementType: '供应商对账单', party: '中联铁运集团有限公司', completedAt: '2026-10-20', fee: '海运费', taxRate: '9.00', ppcc: '预付', containerType: '20RF', remark: '供应商月结', customer: '青岛绿洲园花生食品有限公司', orderNo: 'FCO202610200037', billType: '船东提单号', billNo: 'COSU6439271850', currency: 'CNY', amount: '10,000.00', invoiced: '10,000.00', invoices: [{ id: 'CB202610200016', status: '已登记', amount: '10,000.00', tone: 'success' }], settled: '10,000.00', outstanding: '0.00', payments: [{ id: 'FK202610200009', status: '已付款', amount: '6,000.00', tone: 'success' }, { id: 'FK202610200010', status: '已付款', amount: '4,000.00', tone: 'success' }], statementStatus: '待确认', statementTone: 'warning', settlementStatus: '已付款', tone: 'success', sourceDoc: 'JS202610200012' },
  { side: 'pay', statementNo: 'DZ202610200022', statementName: '中联铁运集团有限公司 2026-10 应付对账单', statementType: '供应商对账单', party: '中联铁运集团有限公司', completedAt: '2026-10-20', fee: '港杂费', taxRate: '6.00', ppcc: '预付', containerType: '20RF', remark: '含码头操作费', customer: '青岛绿洲园花生食品有限公司', orderNo: 'FCO202610200037', billType: '货代提单号', billNo: 'HBL202611160001', currency: 'CNY', amount: '5,000.00', invoiced: '5,000.00', invoices: [{ id: 'CB202610200016', status: '已登记', amount: '5,000.00', tone: 'success' }], settled: '2,000.00', outstanding: '3,000.00', payments: [{ id: 'FK202610200009', status: '部分付款', amount: '2,000.00', tone: 'warning' }], statementStatus: '待确认', statementTone: 'warning', settlementStatus: '部分付款', tone: 'warning', sourceDoc: 'JS202610200012' },
  { side: 'pay', statementNo: 'DZ202610200023', statementName: '中联铁运集团有限公司 2026-10 代理对账单', statementType: '代理对账单', party: '中联铁运集团有限公司', completedAt: '2026-10-21', fee: '代理费', taxRate: '6.00', ppcc: '预付', containerType: '—', remark: '代理服务费', customer: '青岛绿洲园花生食品有限公司', orderNo: 'FCO202610200037', billType: '货代提单号', billNo: 'HBL202611160001', currency: 'CNY', amount: '5,500.00', invoiced: '5,500.00', invoices: [{ id: 'CB202610200016', status: '已登记', amount: '5,500.00', tone: 'success' }], settled: '0.00', outstanding: '5,500.00', payments: [{ id: 'FK202610200011', status: '待审批', amount: '0.00', tone: 'warning' }], statementStatus: '待确认', statementTone: 'warning', settlementStatus: '待付款', tone: 'warning', sourceDoc: 'JS202610200012' },
  { side: 'recv', statementNo: 'DZ202610200023', statementName: '中联铁运集团有限公司 2026-10 代理对账单', statementType: '代理对账单', party: '中联铁运集团有限公司', completedAt: '2026-10-21', fee: '垫付费用', customer: '青岛绿洲园花生食品有限公司', orderNo: 'FCO202610200037', billType: '货代提单号', billNo: 'HBL202611160001', currency: 'CNY', amount: '3,000.00', invoiced: '0.00', invoices: [], settled: '0.00', outstanding: '3,000.00', payments: [{ id: 'SK202610200009', status: '待收款', amount: '0.00', tone: 'warning' }], statementStatus: '待确认', statementTone: 'warning', settlementStatus: '待收款', tone: 'warning', sourceDoc: 'JS202610200012' }
];

function allDocRecords() {
  return downstreamDocs.concat(linkedDocs);
}

function ledgerNum(value) {
  return Number(String(value || '0').replace(/,/g, '')) || 0;
}

function ledgerAmount(value) {
  return ledgerNum(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderDocLinkStack(list) {
  if (!list || !list.length) return '<span class="doc-empty-value">—</span>';
  return `<div class="doc-link-stack">${list.map(doc => `<div class="doc-link-line"><button class="doc-number-link" data-doc-open="${doc.id}">${doc.id}</button><span class="doc-mini-status ${doc.tone}">${doc.status}</span><span class="doc-link-amount">${doc.amount}</span></div>`).join('')}</div>`;
}

function renderBillList(isExec) {
  const docs = isExec ? downstreamDocs.filter(d => d.type === '提单登记单') : [];
  const rows = docs.map(d => `<tr data-doc-type="${d.type}"><td>${d.type}</td><td><button class="doc-number-link" data-doc-open="${d.id}">${d.id}</button></td><td>${d.ownerBlNo || '—'}</td><td>${d.forwarderBlNo || '—'}</td><td>${d.masterAwbNo || '—'}</td><td>${d.ourHouseNo || '—'}</td><td><span class="doc-status ${d.tone}">${d.status}</span></td><td>苏丽蓉</td><td>2026-10-20 09:30</td><td>菜菜菜</td><td>${d.updated}</td><td><button class="btn link" data-doc-open="${d.id}">查看详情</button></td></tr>`).join('');
  return `<section class="cube-card doc-all-card"><div class="doc-query-bar"><span class="doc-query-title">提单列表</span><span class="doc-query-hint">仅展示提单登记单</span><div class="bill-list-actions"><span class="doc-result-count">共 ${docs.length} 条</span><button class="btn primary bill-list-add" data-bill-add>＋ 新增</button></div></div><div class="doc-all-table-wrap"><table class="mini-table doc-all-table"><thead><tr><th>单据类型</th><th>单据编号</th><th>船东提单号</th><th>货代提单号</th><th>航司主单号</th><th>我司分单号</th><th>状态</th><th>创建人</th><th>创建时间</th><th>修改人</th><th>修改时间</th><th>操作</th></tr></thead><tbody>${rows || '<tr><td colspan="12" class="doc-empty">暂无提单登记单</td></tr>'}</tbody></table></div></section>`;
}

function openBillTaskModal() {
  document.querySelectorAll('.bill-task-overlay').forEach(node => node.remove());
  const taskRows = [
    {sales:'洪小莲',mbl:'',hbl:'',name:'LQ1030测试',status:'创建',task:'FLST202610300001',confirm:'',load:'集装箱',origin:'厦门',dest:'Porthmadog',originTerm:'CFS',destTerm:'CFS',order:'FOR202610300001',customer:'福建测试客户有限公司'},
    {sales:'吴小童',demand:'FLR202610210002',mbl:'',hbl:'',name:'LQ全流程测试-2',status:'创建',task:'FLST202610210006',confirm:'',load:'集装箱',origin:'厦门',dest:'长滩',originTerm:'DR',destTerm:'DR',order:'FOR202610210002',customer:'厦门远洋贸易有限公司'},
    {sales:'魏勇',demand:'FLR202610130007',mbl:'',hbl:'',name:'LQ111',status:'创建',task:'FLST202610130013',confirm:'',load:'集装箱',origin:'富纳富提',dest:'法马古斯塔',originTerm:'DR',destTerm:'DR',order:'FOR202610130007',customer:'上海海联供应链有限公司'},
    {sales:'魏勇',demand:'FLR202609200003',mbl:'',hbl:'',name:'LQ测试优化',status:'创建',task:'FLST202609200005',confirm:'',load:'集装箱',origin:'富纳富提',dest:'法马古斯塔',originTerm:'DR',destTerm:'DR',order:'FOR202609200003',customer:'宁波远海物流有限公司'},
    {sales:'陈伟伟',demand:'FLR202609140001',mbl:'',hbl:'',name:'LQ111',status:'创建',task:'FLST202609160002',confirm:'',load:'集装箱',origin:'',dest:'',originTerm:'',destTerm:'',order:'FOR202609140001',customer:'青岛海程国际物流有限公司'},
    {sales:'陈伟伟',demand:'FLR202609140001',mbl:'',hbl:'',name:'LQ111',status:'创建',task:'FLST202609160001',confirm:'',load:'集装箱',origin:'',dest:'',originTerm:'',destTerm:'',order:'FOR202609140001',customer:'青岛海程国际物流有限公司'},
    {sales:'林美燕',demand:'FLR202609090001',mbl:'',hbl:'',name:'LQ',status:'创建',task:'FLST202609090005',confirm:'',load:'集装箱',origin:'富纳富提',dest:'法马古斯塔',originTerm:'DR',destTerm:'DR',order:'FOR202609090001',customer:'广州联盛进出口有限公司'},
    {sales:'黄瑞钰',demand:'FLR202609030006',mbl:'',hbl:'',name:'LQ出口测试',status:'创建',task:'FLST202609030012',confirm:'',load:'集装箱',origin:'厦门',dest:'汉堡',originTerm:'CY',destTerm:'CY',order:'FOR202609030006',customer:'厦门建发供应链有限公司'}
  ];
  const rowHtml = taskRows.map((row, index) => `<tr data-bill-task-row data-name="${esc(row.name)}" data-demand="${esc(row.demand)}"><td class="checkbox-cell"><input type="checkbox" data-bill-row="${index}" aria-label="选择${esc(row.task)}"></td><td>${esc(row.name)}</td><td>${esc(row.status)}</td><td>${esc(row.task)}</td><td>${esc(row.confirm||'')}</td><td>${esc(row.load)}</td><td>${esc(row.origin||'')}</td><td>${esc(row.dest||'')}</td><td>${esc(row.originTerm||'')}</td><td>${esc(row.destTerm||'')}</td><td>${esc(row.order||'')}</td><td>${esc(row.customer||'')}</td></tr>`).join('');
  const overlay = document.createElement('div');
  overlay.className = 'bill-task-overlay';
  overlay.innerHTML = `<section class="bill-task-modal" role="dialog" aria-modal="true" aria-labelledby="billTaskTitle">
    <header class="bill-task-head"><h2 id="billTaskTitle">新增提单（水运任务提单）</h2><button class="bill-task-close" type="button" aria-label="关闭" data-bill-modal-close>×</button></header>
    <div class="bill-task-body">
      <section class="bill-task-query" data-bill-query-panel>
        <div class="bill-task-query-head">
          <button class="bill-task-query-toggle" type="button" data-bill-query-toggle><span class="bill-task-query-arrow">▾</span><span>查询条件</span></button>
          <div class="bill-task-token" data-bill-query-token><span>运输委托名称：LQ</span><button type="button" aria-label="移除运输委托名称筛选" data-bill-token-clear>×</button></div>
          <div class="bill-task-query-actions"><button class="btn bill-task-reset" type="button" data-bill-reset>重置</button><button class="btn primary" type="button" data-bill-search>查询</button></div>
        </div>
        <div class="bill-task-query-fields">
          <label class="bill-task-field"><span>运输委托名称</span><input id="billQueryName" value="LQ" placeholder="请输入"></label>
          <label class="bill-task-field"><span>业务员</span><select id="billQuerySales"><option value="">请选择</option><option>洪小莲</option><option>吴小童</option><option>魏勇</option><option>陈伟伟</option><option>林美燕</option><option>黄瑞钰</option></select></label>
          <label class="bill-task-field"><span>客户</span><select id="billQueryCustomer"><option value="">请选择</option><option>福建测试客户有限公司</option><option>厦门远洋贸易有限公司</option><option>上海海联供应链有限公司</option><option>宁波远海物流有限公司</option><option>青岛海程国际物流有限公司</option><option>广州联盛进出口有限公司</option></select></label>
        </div>
      </section>
      <div class="bill-task-table-wrap">
        <table class="bill-task-table"><thead><tr><th class="checkbox-cell"><input type="checkbox" data-bill-select-all aria-label="全选"></th><th>运输委托名称</th><th>委托状态</th><th>任务编号</th><th>任务确认状态</th><th>装运类别</th><th>起运港</th><th>目的港</th><th>起运港服务条款</th><th>目的港服务条款</th><th>客户订单编号</th><th>客户</th></tr></thead><tbody>${rowHtml}</tbody></table>
      </div>
      <aside class="bill-task-side-panel" data-bill-selection-panel hidden>
        <div class="bill-task-side-tip"><span class="bill-task-side-info">i</span><span>新增前需选择单据类型</span></div>
        <label class="bill-task-side-field"><span>单据类型<em>*</em></span><select id="billTaskDocType"><option value="">请选择</option><option>水运任务提单</option><option>海运提单</option><option>空运提单</option></select></label>
        <label class="bill-task-side-field"><span>客户</span><input id="billTaskCustomer" readonly></label>
      </aside>
    </div>
    <footer class="bill-task-footer"><div class="bill-task-pagination"><span data-bill-total>共 39 条</span><button type="button" disabled>‹</button><button type="button" class="active" data-bill-page="1">1</button><button type="button" data-bill-page="2">2</button><button type="button" data-bill-page="3">3</button><button type="button" data-bill-page="4">4</button><button type="button">›</button><span>10条/页</span><span>前往</span><input value="1" aria-label="前往页码"><span>页</span></div><div class="bill-task-modal-actions"><button class="btn" type="button" data-bill-modal-close>取消</button><button class="btn primary" type="button" data-bill-confirm>确认</button></div></footer>
  </section>`;
  document.body.classList.add('bill-modal-open');
  document.body.appendChild(overlay);
  const allRows = [...overlay.querySelectorAll('[data-bill-task-row]')];
  const visibleRows = () => allRows.filter(row => row.style.display !== 'none');
  const selectedRows = () => [...overlay.querySelectorAll('[data-bill-row]:checked')];
  const syncSelection = () => {
    const selectedInputs = selectedRows();
    const selectedRow = selectedInputs[0]?.closest('[data-bill-task-row]') || null;
    const confirmButton = overlay.querySelector('[data-bill-confirm]');
    const panel = overlay.querySelector('[data-bill-selection-panel]');
    const customerInput = overlay.querySelector('#billTaskCustomer');
    const body = overlay.querySelector('.bill-task-body');
    confirmButton.textContent = selectedInputs.length ? `确认（${selectedInputs.length}）` : '确认';
    panel.hidden = selectedInputs.length === 0;
    body.classList.toggle('has-selection', selectedInputs.length > 0);
    overlay.querySelectorAll('[data-bill-task-row]').forEach(row => row.classList.toggle('is-selected', row === selectedRow));
    customerInput.value = selectedRow ? selectedRow.lastElementChild.textContent.trim() : '';
    if (!selectedInputs.length) overlay.querySelector('#billTaskDocType').value = '';
  };
  const applyFilter = () => {
    const name = overlay.querySelector('#billQueryName').value.trim();
    const sales = overlay.querySelector('#billQuerySales').value;
    const customer = overlay.querySelector('#billQueryCustomer').value;
    let count = 0;
    allRows.forEach(row => {
      const text = row.innerText;
      const show = (!name || text.includes(name))  && (!sales || text.includes(sales)) && (!customer || text.includes(customer));
      row.style.display = show ? '' : 'none';
      if (show) count += 1;
    });
    overlay.querySelector('[data-bill-total]').textContent = `共 ${count} 条`;
    const token = overlay.querySelector('[data-bill-query-token]');
    token.hidden = !name;
    token.innerHTML = name ? `<span>运输委托名称：${esc(name)}</span><button type="button" aria-label="移除运输委托名称筛选" data-bill-token-clear>×</button>` : '';
    overlay.querySelector('[data-bill-select-all]').checked = false;
    overlay.querySelectorAll('[data-bill-row]').forEach(input => { input.checked = false; });
    syncSelection();
  };
  overlay.addEventListener('click', event => {
    if (event.target === overlay || event.target.closest('[data-bill-modal-close]')) { overlay.remove(); document.body.classList.remove('bill-modal-open'); return; }
    if (event.target.closest('[data-bill-query-toggle]')) { overlay.querySelector('[data-bill-query-panel]').classList.toggle('is-collapsed'); return; }
    if (event.target.closest('[data-bill-token-clear]')) { overlay.querySelector('#billQueryName').value = ''; applyFilter(); return; }
    if (event.target.closest('[data-bill-reset]')) { overlay.querySelectorAll('.bill-task-query-fields input:not([readonly])').forEach(input => input.value = ''); overlay.querySelectorAll('.bill-task-query-fields select').forEach(select => select.value = ''); const token = overlay.querySelector('[data-bill-query-token]'); token.innerHTML = ''; token.hidden = true; allRows.forEach(row => row.style.display = ''); overlay.querySelector('[data-bill-total]').textContent = '共 39 条'; syncSelection(); return; }
    if (event.target.closest('[data-bill-search]')) { applyFilter(); toast('已按条件查询运输任务'); return; }
    if (event.target.closest('[data-bill-confirm]')) { const selected = selectedRows(); if (!selected.length) { toast('请选择需要生成提单的运输任务'); return; } if (!overlay.querySelector('#billTaskDocType').value) { toast('请选择单据类型'); return; } overlay.remove(); toast(`已新增 ${selected.length} 条提单`); return; }
    const pageButton = event.target.closest('[data-bill-page]');
    if (pageButton) { overlay.querySelectorAll('[data-bill-page]').forEach(button => button.classList.toggle('active', button === pageButton)); return; }
  });
  overlay.addEventListener('change', event => {
    if (event.target.matches('[data-bill-select-all]')) { visibleRows().forEach(row => { const checkbox = row.querySelector('[data-bill-row]'); if (checkbox) checkbox.checked = event.target.checked; }); syncSelection(); return; }
    if (event.target.matches('[data-bill-row]')) syncSelection();
  });
}
document.addEventListener('click', event => { if (event.target.closest('[data-bill-add]')) { event.preventDefault(); openBillTaskModal(); } });

function renderPaymentLedger(isExec) {
  const filter = state.paymentFilter || 'all';
  const allRows = isExec ? feeLedger : [];
  const rows = filter === 'all' ? allRows : allRows.filter(row => row.side === filter);
  const statementCount = new Set(rows.map(row => row.statementNo)).size;
  const statsFor = side => {
    const sideRows = allRows.filter(row => row.side === side);
    return {
      total: sideRows.reduce((sum, row) => sum + ledgerNum(row.amount), 0),
      invoiced: sideRows.reduce((sum, row) => sum + ledgerNum(row.invoiced), 0),
      settled: sideRows.reduce((sum, row) => sum + ledgerNum(row.settled), 0),
      outstanding: sideRows.reduce((sum, row) => sum + ledgerNum(row.outstanding), 0)
    };
  };
  const recvStats = statsFor('recv');
  const payStats = statsFor('pay');
  const showRecv = filter === 'all' || filter === 'recv';
  const showPay = filter === 'all' || filter === 'pay';
  const statGroup = (label, kind, stats) => `<div class="doc-ledger-stat-group"><div class="doc-ledger-stat-label ${kind}">${label}</div><div class="doc-ledger-metric"><span>对账金额</span><b>${ledgerAmount(stats.total)}</b></div><div class="doc-ledger-metric"><span>已开票金额</span><b>${ledgerAmount(stats.invoiced)}</b></div><div class="doc-ledger-metric"><span>已收/已付金额</span><b>${ledgerAmount(stats.settled)}</b></div><div class="doc-ledger-metric"><span>未收/未付金额</span><b>${ledgerAmount(stats.outstanding)}</b></div></div>`;
  const filterBar = `<div class="doc-query-bar"><span class="doc-query-title">查询条件</span><label class="doc-query-field"><span>收付方向</span><select id="paymentTypeFilter" class="doc-status-filter"><option value="all" ${filter === 'all' ? 'selected' : ''}>全部方向</option><option value="recv" ${filter === 'recv' ? 'selected' : ''}>应收</option><option value="pay" ${filter === 'pay' ? 'selected' : ''}>应付</option></select></label><span class="doc-result-count">共 ${rows.length} 条</span></div>`;
  const body = rows.map(row => `<tr data-pay-type="${row.side}">
    <td><div class="doc-statement-line"><button class="doc-number-link" data-doc-open="${row.statementNo}">${row.statementNo}</button><span class="doc-mini-status ${row.statementTone}">${row.statementStatus}</span></div><span class="doc-statement-name">${row.statementName}</span>${row.sourceDoc ? `<span class="doc-cell-sub">关联结算 <button class="doc-number-link" data-doc-open="${row.sourceDoc}">${row.sourceDoc}</button></span>` : ''}</td>
    <td><span class="doc-mini-status ${row.side === 'recv' ? 'info' : 'warning'}">${row.side === 'recv' ? '应收' : '应付'}</span></td>
    <td>${row.statementType}</td>
    <td>${row.party}</td><td>${row.completedAt}</td><td>${row.fee}</td><td>${row.currency}</td>
    <td class="doc-ledger-number">${row.amount}</td><td class="doc-ledger-number">${row.invoiced}</td>
    <td>${renderDocLinkStack(row.invoices)}</td><td class="doc-ledger-number">${row.settled}</td><td class="doc-ledger-number ${ledgerNum(row.outstanding) ? 'is-outstanding' : ''}">${row.outstanding}</td>
    <td>${renderDocLinkStack(row.payments)}</td>
    <td><button class="btn link" data-doc-open="${row.statementNo}">查看对账单</button></td>
  </tr>`).join('');
  return `${filterBar}<div class="doc-ledger-stats ${showRecv && showPay ? '' : 'is-single'}">${showRecv ? statGroup('应收统计', 'recv', recvStats) : ''}${showPay ? statGroup('应付统计', 'pay', payStats) : ''}</div><div class="doc-ledger-meta">${statementCount} 张对账单 · ${rows.length} 条费用行 · 金额单位：CNY</div><div class="doc-all-table-wrap"><table class="mini-table doc-ledger-table"><colgroup><col style="width:180px"><col style="width:82px"><col style="width:104px"><col style="width:185px"><col style="width:110px"><col style="width:90px"><col style="width:64px"><col style="width:105px"><col style="width:105px"><col style="width:230px"><col style="width:115px"><col style="width:115px"><col style="width:230px"><col style="width:100px"></colgroup><thead><tr><th>对账单号</th><th>收付方向</th><th>对账单类型</th><th>结算对象</th><th>对账完成日期</th><th>费目</th><th>币种</th><th>费用金额</th><th>已开票金额</th><th>发票登记</th><th>已收/已付金额</th><th>未收/未付金额</th><th>收款认领 / 付款申请</th><th>操作</th></tr></thead><tbody>${body || '<tr><td colspan="14" class="doc-empty">暂无收付明细</td></tr>'}</tbody></table></div>`;
}

function renderDocumentsView(isExec) {
  return `<section class="cube-card doc-all-card doc-hub-card">${renderPaymentLedger(isExec).replace('<span class="doc-query-title">查询条件</span>','<span class="doc-query-title">实际收付</span>')}</section>`;
}

document.addEventListener('change', e => {
  if (e.target.id === 'paymentTypeFilter') { state.paymentFilter = e.target.value; render(); }
});

function renderDetail(page){
  const isExec=page==='exec';
  const no=state.activeRowId||(isExec?'FLR202610200038':'FLR202610160032');
  const activeRecord=listRows.find(item=>item.no===state.activeRowId)||{status:isExec?'执行中':'创建'};
  const isVersionDraft=!isExec&&Boolean(prototypeParams.get('version'));
  const displayStatus=isVersionDraft?'创建':(activeRecord.status||(isExec?'执行中':'创建'));
  const displayStatusClass=['待审核','驳回','待安排'].includes(displayStatus)?'status-pending':displayStatus==='执行中'?'running':displayStatus==='已完结'?'status-success':displayStatus==='作废'?'status-muted':'draft';
  const isWater=isExec||createForm.transportType==='水运';
  const showContainer=isExec||(isWater&&createForm.loadType==='集装箱');
  const overview=`${baseCard(isExec)}${customerCard(isExec)}`;
  const basicPanel=MULTI_ROUTE_VIEW?baseCard(isExec):overview;
  const singleRoute=!MULTI_ROUTE_VIEW&&LOGISTICS_SOURCE_MODE==='customer-order-single-route'?singleOrderRouteData:null;
  const transportPanel=isExec?`${transportCard(true,singleRoute)}${voyageCard(true,singleRoute)}${containerCard(true,singleRoute)}`:`${editableTransportCard()}${isWater?editableVoyageCard():''}${showContainer?containerCard(false):''}`;
  const servicePanel=HIDE_ROUTE_SERVICE_MODULES?(MULTI_ROUTE_VIEW?renderMultiRouteServicePanel(isExec):''):(MULTI_ROUTE_VIEW?renderMultiRouteServicePanel(isExec):transportPanel);
  const estimatePanel=`${feeCard(isExec,'recv')}${feeCard(isExec,'pay')}${profitCard(isExec)}`;
  const demandAnchors=['basic','service','estimate','attachments'];
  const activeDemandAnchor=demandAnchors.includes(state.demandAnchor)?state.demandAnchor:'basic';
  const records=`${attachmentCard(isExec)}${systemCard(isExec)}`;
  const demand=`<section class="demand-anchor-section" id="demand-basic">${basicPanel}</section><section class="demand-anchor-section" id="demand-service">${servicePanel}</section><section class="demand-anchor-section" id="demand-estimate">${estimatePanel}</section><section class="demand-anchor-section" id="demand-attachments">${records}</section>`;
  const fees=`${executionFinanceWorkspace(isExec)}${financeProfitCard(isExec)}`;
  const billList=renderBillList(isExec);
  const arrangement=isExec?renderExecutionLower():`<div class="arrangement-empty-shell"><span class="empty-message">暂无物流安排，请先新增物流委托。</span><button class="btn primary" data-toast="已模拟新增物流委托"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>新增物流委托</button></div>`;
  const sections=['demand','fees','arrangement','bills'];
  const activeSection=sections.includes(state.detailSection)?state.detailSection:'demand';
  const nav=[['demand','需求详情'],['fees','费用与利润'],['arrangement','物流安排'],['bills','提单列表']];
  const demandSubNav=[['basic','基础信息与商品'],['service','服务要求'],['estimate','业务预估费用'],['attachments','审批附件']];
  const subTabs=activeSection==='demand'?`<span class="detail-subtabs-divider"></span><div class="detail-demand-subtabs">${demandSubNav.map(([id,label])=>`<button class="detail-demand-subtab ${activeDemandAnchor===id?'active':''}" data-demand-anchor="${id}">${label}</button>`).join('')}</div>`:'';
  const financeBillFilter=activeSection==='fees'&&BILL_FEE_VIEW?renderExecutionBillFilter():'';
  const panels={demand,fees,arrangement,bills:billList};
  return `<div class="detail-scroll"><div class="detail-page ${isExec?'exec-mode':'create-mode'}">
    <section class="cube-card"><div class="detail-titlebar"><div class="detail-title"><span style="width:8px;height:8px;border-radius:2px;background:#2563eb;display:inline-block"></span><span>物流需求详情（${no}）</span>${MULTI_ROUTE_VIEW?'<span class="detail-variant-badge">多线路</span>':BILL_FEE_VIEW?'<span class="detail-variant-badge bill-fee">提单费用</span>':''}<span class="detail-status ${displayStatusClass}">${displayStatus}</span><span class="expand-icon">⛶</span></div><div class="detail-actions">${optimizedDetailActions(isExec, displayStatus)}</div></div></section>
    <div class="detail-section-tabs">${nav.map(([id,l])=>`<button class="detail-section-tab ${activeSection===id?'active':''}" data-detail-section="${id}">${l}</button>`).join('')}${subTabs}${financeBillFilter}</div><div class="detail-section-panel active" id="section-${activeSection}">${panels[activeSection]||panels.demand}</div>
  </div></div>`;
}
document.addEventListener('change',e=>{if(e.target.id==='docTypeFilter'){const val=e.target.value;const card=e.target.closest('.doc-all-card');const rows=[...card.querySelectorAll('tbody tr[data-doc-type]')];let count=0;rows.forEach(r=>{const show=val==='all'||r.dataset.docType===val;r.style.display=show?'':'none';if(show)count++;});const label=card.querySelector('#docResultCount');if(label)label.textContent=`共 ${count} 条`;}});
function render(){
  renderTopTabs();
  renderSidebar();
  const main=document.getElementById('main');
  main.innerHTML=state.page==='list'?renderList():state.page==='document'?renderDocumentPage():renderDetail(state.page);
  main.querySelectorAll('.detail-view-switch').forEach(el=>el.remove());
  const detailScroll=main.querySelector('.detail-scroll');
  const demandAnchors=[...main.querySelectorAll('.demand-anchor-section')];
  const demandAnchorButtons=[...main.querySelectorAll('[data-demand-anchor]')];
  if(detailScroll&&demandAnchors.length&&demandAnchorButtons.length){
    let anchorTicking=false;
    const syncDemandAnchor=()=>{
      anchorTicking=false;
      const threshold=detailScroll.getBoundingClientRect().top+80;
      const atBottom=detailScroll.scrollTop+detailScroll.clientHeight>=detailScroll.scrollHeight-2;
      let current='basic';
      if(atBottom){current=demandAnchors[demandAnchors.length-1].id.replace('demand-','');}
      else{demandAnchors.forEach(section=>{if(section.getBoundingClientRect().top<=threshold)current=section.id.replace('demand-','');});}
      state.demandAnchor=current;
      demandAnchorButtons.forEach(button=>{const active=button.dataset.demandAnchor===current;button.classList.toggle('active',active);button.setAttribute('aria-current',active?'true':'false');});
    };
    detailScroll.addEventListener('scroll',()=>{if(!anchorTicking){anchorTicking=true;requestAnimationFrame(syncDemandAnchor);}},{passive:true});
    requestAnimationFrame(syncDemandAnchor);
  }
  state.dropdownOpen=false;
}
document.addEventListener('click',e=>{
  const rowOpen=e.target.closest('[data-row-open]');
  if(rowOpen){e.preventDefault();const id=rowOpen.dataset.rowOpen;const mode=rowOpen.dataset.rowMode==='create'?'create':'exec';if(PROTOTYPE_VIEW==='list'){window.location.href=prototypeUrl(prototypeDetailFile(mode),{no:id,mode,source:LOGISTICS_SOURCE_MODE});return;}state.activeRowId=id;state.page=mode;state.detailView='info';state.detailSection='overview';state.selectedRows.clear();render();return;}
  const go=e.target.closest('[data-go]');
  if(go){e.preventDefault();const target=go.dataset.go;if(PROTOTYPE_VIEW==='detail'&&target==='list'){window.location.href=prototypeUrl(prototypeListFile());return;}if(PROTOTYPE_VIEW==='detail'&&(target==='create'||target==='exec')){window.location.href=prototypeUrl(prototypeDetailFile(target),{mode:target,no:target==='create'?'FLR202610160032':state.activeRowId,source:LOGISTICS_SOURCE_MODE});return;}state.page=target;state.selectedRows.clear();render();return;}
  if(e.target.closest('[data-query-toggle]')){state.queryCollapsed=!state.queryCollapsed;render();return;}
  if(e.target.closest('[data-filter-toggle]')){state.filterExpanded=!state.filterExpanded;render();return;}
  const status=e.target.closest('[data-status-tab]');
  if(status){state.statusTab=status.dataset.statusTab;state.selectedRows.clear();render();return;}
  const feeTab=e.target.closest('[data-exec-fee-tab]');
  if(feeTab){state.execFeeTab=feeTab.dataset.execFeeTab;render();return;}
  const collapse=e.target.closest('[data-collapse]');
  if(collapse){const card=collapse.closest('.cube-card,.sub-card');if(card)card.classList.toggle('is-collapsed');return;}
  const collapseAll=e.target.closest('[data-collapse-all]');
  if(collapseAll){const scope=collapseAll.closest('.detail-page');const cards=[...(scope?.querySelectorAll('.cube-card,.sub-card')||[])];const shouldCollapse=cards.some(c=>!c.classList.contains('is-collapsed'));cards.forEach(c=>c.classList.toggle('is-collapsed',shouldCollapse));return;}
  const dd=e.target.closest('[data-dropdown]');
  if(dd){const menu=dd.parentElement.querySelector('.dropdown-menu');const open=!menu.classList.contains('open');document.querySelectorAll('.dropdown-menu.open').forEach(m=>m.classList.remove('open'));menu.classList.toggle('open',open);return;}
  if(!e.target.closest('.dropdown-wrap'))document.querySelectorAll('.dropdown-menu.open').forEach(m=>m.classList.remove('open'));
  const tip=e.target.closest('[data-toast]');
  if(tip){toast(tip.dataset.toast);return;}
});
document.addEventListener('change',e=>{
  if(e.target.matches('[data-row-check]')){
    const id=e.target.dataset.rowCheck;
    if(e.target.checked)state.selectedRows.add(id);else state.selectedRows.delete(id);
    render();
  }
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')document.querySelectorAll('.dropdown-menu.open').forEach(m=>m.classList.remove('open'));
});
window.addEventListener('message',event=>{
  const data=event.data;
  if(!data||data.type!=='ct-navigate')return;
  if(data.view==='list'){
    state.page='list';
    state.detailView='info';
    state.detailSection='overview';
    state.selectedRows.clear();
    render();
  }
});

document.addEventListener('dblclick',event=>{
  if(PROTOTYPE_VIEW!=='list')return;
  const row=event.target.closest('tr[data-row-id]');
  if(!row||event.target.closest('button,input,a,select,textarea,label'))return;
  const record=listRows.find(item=>item.no===row.dataset.rowId);
  const mode=record&&record.cat==='create'?'create':'exec';
  window.location.href=prototypeUrl(prototypeDetailFile(mode),{no:row.dataset.rowId,mode});
},true);
render();


