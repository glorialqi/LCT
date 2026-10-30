

const PROTOTYPE_VIEW = document.body.dataset.view === 'detail' ? 'detail' : 'list';
const prototypeParams = new URLSearchParams(window.location.search);
const initialDetailMode = prototypeParams.get('mode') === 'create' ? 'create' : 'exec';
const PROTOTYPE_LIST_FILE = 'logistics-demand-list-prototype.html';
const PROTOTYPE_DETAIL_FILE = 'logistics-demand-detail-prototype.html';

function prototypeUrl(file, params = {}) {
  const url = new URL(file, window.location.href);
  if (window.self !== window.top || prototypeParams.get('embed') === '1') {
    url.searchParams.set('embed', '1');
  }
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });
  return url.href;
}

const state = {
  page: PROTOTYPE_VIEW === 'detail' ? initialDetailMode : 'list',
  activeRowId: prototypeParams.get('no') || 'FLR202610200038',
  detailView: 'info',
  detailSection: 'overview',
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
  dropdownOpen: false
};

const statusTabs = [
  ['all','全部',712],['create','创建',209],['review','待审核',50],['rejected','驳回',3],
  ['arrange','待安排',55],['running','执行中',377],['completed','已完结',8],['void','作废',10]
];

const listRows = [
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
  {no:'FLR202610200035', biz:'内贸2026-10-20', status:'执行中', cat:'running', statusClass:'status-blue', counts:[0,1,0,0], customer:'青岛绿洲园花生食品有限公司', order:'FCO202610200034', recv:'10', pay:'10', profit:'0', type:'水运集装箱', dept:'数字化中心'}
];

function getActiveDemandRecord() {
  return listRows.find((row) => row.no === state.activeRowId)
    || listRows.find((row) => row.no === 'FLR202610200038')
    || listRows[0]
    || {};
}

function demandBusinessDate(record) {
  const match = String(record && record.biz || '').match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : '';
}

function demandBusinessType(record) {
  const biz = String(record && record.biz || '');
  return biz.includes('内贸') ? '内贸' : biz;
}

function demandLoadType(record) {
  const type = String(record && record.type || '');
  if (type.includes('集装箱')) return '集装箱';
  if (type.includes('散货')) return '散货';
  return type;
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
      <div style="height:30px;padding:5px 10px 3px 27px;color:var(--muted);font-size:11px">物流需求工作台</div>
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
function filterInput(label,placeholder='请输入',value=''){const id='filter-'+label.replace(/[^\w\u4e00-\u9fa5]+/g,'-');return `<label class="filter-field" for="${id}"><span class="filter-label">${label}</span><input id="${id}" name="${id}" autocomplete="off" class="filter-control" placeholder="${placeholder}" value="${esc(value)}"></label>`}
function filterSelect(label,options,placeholder='请选择'){const id='filter-'+label.replace(/[^\w\u4e00-\u9fa5]+/g,'-');return `<label class="filter-field" for="${id}"><span class="filter-label">${label}</span><select id="${id}" name="${id}" class="filter-control"><option value="">${placeholder}</option>${options.map(o=>`<option>${esc(o)}</option>`).join('')}</select></label>`}

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
          ${filterInput('客户订单号')}
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
        ${statusTabs.map(([id,label,count])=>`<button class="status-tab ${state.statusTab===id?'active':''}" data-status-tab="${id}">${label}(${count})</button>`).join('')}
        <div class="status-spacer"></div>
        <div class="bulk-actions logistics-bulk-actions">
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
            <th class="check-col"><input type="checkbox" id="logisticsSelectAll" name="selectAll" aria-label="全选当前物流需求"></th>
            <th>物流需求单号</th><th>委托状态</th><th>状态</th><th>客户信息</th>
            <th>业务预估应收（元）</th><th>业务预估应付（元）</th><th>业务预估利润（元）</th>
            <th>运输/装运类别</th><th>部门</th><th class="action-col">操作</th>
          </tr></thead>
          <tbody>${rows.length?rows.map(r=>`
            <tr data-row-id="${r.no}" data-row-mode="${r.cat==='create'?'create':'exec'}">
              <td class="check-col"><input type="checkbox" class="row-check" name="row-${r.no}" aria-label="选择物流需求 ${r.no}" data-row-check="${r.no}" ${state.selectedRows.has(r.no)?'checked':''}></td>
              <td class="no-cell"><strong>${r.no}</strong><span>${r.biz}</span></td>
              <td><div class="count-grid"><span class="c-orange">创建 <b>${r.counts[0]}</b></span><span class="c-blue">执行 <b>${r.counts[1]}</b></span><span class="c-red">异常 <b>${r.counts[2]}</b></span><span class="c-muted">完结 <b>${r.counts[3]}</b></span></div></td>
              <td><span class="${r.statusClass}">${r.status}</span></td>
              <td class="customer-cell" title="${esc(r.customer)}（${r.order}）">${esc(r.customer)}（${r.order}）</td>
              <td>${r.recv}</td><td>${r.pay}</td><td>${r.profit}</td><td>${r.type}</td><td>${r.dept}</td>
              <td class="action-col"><div class="action-stack"><button class="btn link" data-row-open="${r.no}" data-row-mode="${r.cat==='create'?'create':'exec'}" ${r.disableStart&&r.cat!=='create'?'disabled':''}>${r.cat==='create'?'继续编辑':'发起物流安排'}</button><button class="btn link" data-row-open="${r.no}" data-row-mode="${r.cat==='create'?'create':'exec'}">${r.cat==='create'?'查看需求':'查看物流安排'}</button></div></td>
            </tr>`).join(''):`<tr><td colspan="11" style="padding:0;border-bottom:0"><div class="ui-state-block is-table-inline" data-state="empty" data-density="compact"><div class="ui-state-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg></div><div class="ui-state-title">暂无物流需求</div><p class="ui-state-message">调整查询条件或状态筛选后重试。</p></div></td></tr>`}</tbody>
        </table>
      </div>
      <div class="pager">
        <span>共 712 条</span><div class="pages"><button class="page-btn">‹</button><button class="page-btn active">1</button><button class="page-btn">2</button><button class="page-btn">3</button><button class="page-btn">4</button><button class="page-btn">…</button><button class="page-btn">24</button><button class="page-btn">›</button></div>
        <select aria-label="每页条数" name="pageSize"><option>30条/页</option><option>50条/页</option></select><span>前往</span><input aria-label="前往页码" name="pageNumber" inputmode="numeric" value="1"><span>页</span>
      </div>
    </section>
  </div>`;
}

const opts = {
  businessType:['出口','进口','转口','内贸','境外内贸'],
  org:['投资管理中心','远东航线部1','投资管理中心1','项目管理部','项目运营部1','阳谷供应链','卓跃达1','卓跃达','海运部','国运公司','数字化中心'],
  people:['魏勇','徐芷萌','林美燕','黄瑞钰'],
  transport:['汽运','水运'],
  shipping:['内贸水运','国际航运'],
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
  ports:['富纳富提','香港','法马古斯塔','上海港','宁波港','厦门港'],
  terms:['水运港到港','港到港','门到门','港到门','门到港']
};
function field(label,value='',o={}){
  const extra=o.name?` data-field="${o.name}"`:'';
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
  const selected = getActiveDemandRecord();
  const showSelected = isExec || Boolean(prototypeParams.get('no'));
  const selectedGoods = selected.type && selected.type.includes('集装箱') ? '集装箱货物' : selected.type && selected.type.includes('散货') ? '散货货物' : '—';
  const d=showSelected?{order:selected.order||'—',company:selected.customer||'—',date:demandBusinessDate(selected),contact:'',email:'',sales:'苏丽蓉',agent:'',remark:selected.biz||'',businessType:demandBusinessType(selected),transportType:selected.type||'',loadType:demandLoadType(selected),goods:{no:selected.order||'—',customer:selected.customer||'—',name:selectedGoods,unit1:'—',unit2:'—',unit3:'—'}}:{order:'FCO202610160032',company:'成都柠檬时光科技有限公司',date:'2026-10-16',contact:'11',email:'',sales:'林美燕',agent:'菊风公司传媒有限公司b590c',remark:'自动化订单备注',businessType:'内贸',transportType:createForm.transportType,loadType:createForm.loadType,goods:{no:'FCO202610160032',customer:'成都柠檬时光科技有限公司',name:'玉米',unit1:'吨',unit2:'立方米',unit3:'吨'}};
  return `<section class="cube-card"><div class="cube-head"><button class="collapse-btn" data-collapse aria-label="收起"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button><div class="title">客户及商品明细</div></div><div class="cube-body"><div class="customer-layout">
    <div class="related-panel"><div class="related-head"><span>查看关联客户订单 <b>（1）</b></span></div><div class="order-summary"><div class="order-top"><span class="order-no">${d.order} （外部客户）</span><span class="tags">${['运输','内贸',isExec?'水运':createForm.transportType,isExec?'集装箱':createForm.loadType].filter(Boolean).map((t,i)=>`<span class="tag ${i<2?'blue':'cyan'}">${esc(t)}</span>`).join('')}</span></div><div class="company">${d.company}</div><div class="summary-lines"><div class="line"><b>委托方组织：</b><span></span></div><div class="line"><b>结算抬头：</b><span>${d.company}</span></div><div class="line"><b>业务日期：</b><span>${d.date}</span></div><div class="line"><b>联系人：</b><span>${d.contact}</span></div><div class="line"><b>联系邮箱：</b><span>${d.email}</span></div><div class="line"><b>业务员：</b><span>${d.sales}</span></div><div class="line"><b>代理：</b><span>${d.agent}</span></div><div class="line"><b>备注：</b><span>${d.remark}</span></div></div></div></div>
    <div class="goods-panel"><div class="goods-head"><span>商品明细列表</span>${isExec?'':'<button class="btn outline-primary mini" data-toast="已模拟打开商品选择弹窗">选择</button>'}</div><div class="table-scroll"><table class="mini-table" style="min-width:1500px"><thead><tr><th style="width:150px">客户订单号</th><th style="width:180px">客户</th><th style="width:130px">商品中文名</th><th style="width:140px">商品描述</th><th style="width:105px">件数/单位</th><th style="width:105px">毛重/单位</th><th style="width:105px">体积/单位</th><th style="width:125px">标准数量/单位</th><th style="width:100px">单件重量</th><th style="width:120px">单件重量单位</th><th style="width:120px">规格尺寸</th><th style="width:100px">溢装率（%）</th><th style="width:100px">短装率（%）</th><th style="width:130px">货物单价（元）</th><th style="width:140px">货物总价（万元）</th><th style="width:180px">贸易合同号（类型）</th><th style="width:150px">商品英文名</th><th style="width:80px">操作</th></tr></thead><tbody><tr><td>${d.goods.no}</td><td>${d.goods.customer}</td><td>${d.goods.name}</td><td></td><td></td><td>${d.goods.unit1}</td><td>${d.goods.unit2}</td><td>${d.goods.unit3}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>${isExec?'':'<button class="btn link" style="color:var(--danger)">删除</button>'}</td></tr></tbody></table></div></div>
  </div></div></section>`;
}
function baseCard(isExec){
  const selected = getActiveDemandRecord();
  const showSelected = isExec || Boolean(prototypeParams.get('no'));
  const v=showSelected?{sales:'苏丽蓉',dept:selected.dept||'—',account:selected.dept||'—',company:'厦门建发生生物流有限公司',biz:demandBusinessType(selected),date:demandBusinessDate(selected),org:selected.dept||'—',person:'',unit:'供应链物流科技',no:selected.no||state.activeRowId||'—',remark:selected.biz||''}:{sales:'林美燕',dept:'海运部',account:'海运部',company:'厦门建发供应链物流科技有限公司',biz:'内贸',date:'2026-10-16',org:'海运部',person:'',unit:'供应链物流科技',no:state.activeRowId||'FLR202610160032',remark:'自动化订单备注'};
  const body=`<div class="grid-6">
    ${field('业务员',v.sales,{required:true,readonly:true,options:[v.sales]})}
    ${field('部门',v.dept,{required:true,readonly:true,options:[v.dept]})}
    ${field('核算组织',v.account,{required:true,readonly:true,options:[v.account]})}
    ${field('公司',v.company,{required:true,readonly:true,options:[v.company]})}
    ${field('备注',v.remark,{textarea:true,span:'span-2',readonly:isExec})}
    ${field('业务类型',v.biz,{required:true,options:opts.businessType,readonly:isExec})}
    ${field('业务日期',v.date,{required:true,type:'date',readonly:isExec})}
    ${checkField('服务范围',true,isExec)}
    ${field('作业组织',v.org,{options:opts.org,readonly:isExec})}
    ${field('作业组织人员',v.person,{options:opts.people,readonly:isExec})}
    ${field('经营单位',v.unit,{readonly:true})}
    ${field('物流需求单号',v.no,{readonly:true})}
  </div>`;
  return cubeCard('基础信息',body,{className:'base-card'});
}
function transportCard(isExec){
  const v=isExec?['水运','内贸水运','集装箱','','','','FCL','船公司箱（COC）','','','','','','','','富纳富提','大洋洲/图瓦卢','CY','','法马古斯塔','欧洲/塞浦路斯','CY','','','','','','','','','']:['水运','国际航运','集装箱','','','','FCL','船公司箱（COC）','自揽货','菊风公司传媒有限公司b590c','CCT202610150013','','','','','富纳富提','大洋洲/图瓦卢','DR','','香港','亚洲/中国','DR','','','','','','','','',''];
  const labels=[['运输类型','select',opts.transport,true],['航运类型','select',opts.shipping,true],['装运类别','select',opts.loadType,true],['操作模式','select',opts.opMode,false],['提单种类','select',opts.billType,false],['是否直航','select',opts.yesNo,false],['装箱方式','select',opts.packing,false],['订箱方式','select',opts.boxMode,false],['揽货方式','select',opts.cargoMode,false],['代理','select',opts.agents,false],['代理代号','select',['CCT202610150013'],false],['代理业务员','input',null,false],['收货地','input',null,false],['收货地（国别）省市区','input',null,false],['收货地详细地址','input',null,false],['起运港','select',opts.ports,true],['起运港（国别）省市区','input',null,false],['起运港服务条款','select',opts.freightTerms,true],['起运码头','input',null,false],['目的港','select',opts.ports,true],['目的港（国别）省市区','input',null,false],['目的港服务条款','select',opts.freightTerms,true],['目的码头','input',null,false],['卸货港','select',opts.ports,false],['卸货港（国别）省市区','input',null,false],['卸货地','input',null,false],['卸货地（国别）省市区','input',null,false],['卸货地详细地址','input',null,false],['交货地','input',null,false],['交货地（国别）省市区','input',null,false],['交货地详细地址','input',null,false],['其他特殊要求','textarea',null,false]];
  const body=`<div class="grid-6">${labels.map((x,i)=>{const [label,type,options,required]=x;let val=v[i]||'';if(label==='代理'&&isExec)val='';if(label==='代理代号'&&isExec)val='';return field(label,val,{required,readonly:isExec,options:type==='select'?(val&&options&&options.indexOf(val)<0?[val,...options]:options):null,textarea:type==='textarea'});}).join('')}</div>`;
  return cubeCard('运输要求',body);
}
function voyageCard(isExec){
  const labels=['起运港ETD','目的港ETA','船东合约号','MBL#','HBL#','订舱单号','船代','货代','船东','船名/呼号/MMSI/IMO','MMSI','船名','航次','航线','靠泊码头','柜期到期日'];
  const body=`<div class="grid-6">${labels.map(label=>{if(label==='船代'||label==='货代')return field(label,'',{options:opts.shipAgent,readonly:isExec});if(label==='船东')return field(label,'',{options:opts.shipOwner,readonly:isExec});if(label==='航线')return field(label,'',{options:opts.routes,readonly:isExec});if(label.indexOf('ETD')>=0||label.indexOf('ETA')>=0||label==='柜期到期日')return field(label,'',{type:'date',readonly:isExec});return field(label,'',{readonly:isExec,placeholder:label==='船名/呼号/MMSI/IMO'?'请输入内容':'请输入'});}).join('')}</div>`;
  return cubeCard('航程要求',body);
}
function containerCard(isExec){
  const rows=isExec?[]:[['20RF','1','XXYU1122334','','']];
  const body=`<div class="table-scroll"><table class="mini-table" style="min-width:1050px"><thead><tr><th style="width:150px">箱型</th><th style="width:150px">数量</th><th style="width:190px">箱号</th><th style="width:260px">集装箱备注</th><th style="width:220px">客户</th><th style="width:80px">操作</th></tr></thead><tbody>${rows.length?rows.map(r=>`<tr>${r.map((v,i)=>`<td><input class="mini-input" value="${esc(v)}" ${i===1?'disabled':''}></td>`).join('')}<td>${isExec?'':'<button class="btn link" style="color:var(--danger)">删除</button>'}</td></tr>`).join(''):`<tr><td colspan="6" class="empty-cell">暂无数据</td></tr>`}</tbody></table></div>`;
  return cubeCard('集装箱列表',body,{actions:isExec?'':'<button class="btn outline-primary mini" data-toast="已模拟新增集装箱">添加</button>'});
}
function sendReceiveCard(isExec){
  const vals=isExec?['','','','','','']:['四边形9607','四边形9607','四边形9604','阿萨法大是大非大幅度发打发打发打发打发','阿萨法大是大非大幅度发打发打发打发打发','阿萨法大是大非大幅度发打发打发打发打发'];
  const labels=['发货人','收货人','通知人','发货人信息','收货人信息','通知人信息'];
  const body=`<div class="grid-3">${labels.map((label,i)=>field(label,vals[i],{readonly:isExec,textarea:i>2,placeholder:i<3?`请输入${label}名称`:`请输入${label.replace('信息','')}地址,联系电话信息`})).join('')}</div>`;
  return cubeCard('收发通信息',body);
}
function feeTable(rows,isExec=false){
  const headers=['','费用科目 *','客户订单号 *','客户','结算对象','税率(%) *','PP/CC','计费单价（含税） *','计费币种 *','计费数量 *','计量单位 *','原币金额（含税）','柜型 *','汇率 *','本位币金额（元）','费用备注','发票类型','是否实报实销 *','操作'];
  return `<div class="table-scroll"><table class="mini-table fee-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(r=>`<tr><td class="checkbox-cell"><input type="checkbox" aria-label="选择费用行"></td>${r.map(v=>`<td><input class="mini-input" value="${esc(v)}" ${isExec?'disabled':''}></td>`).join('')}<td><button class="btn link">复制</button> <button class="btn link" style="color:var(--danger)">删除</button></td></tr>`).join(''):`<tr><td colspan="19" class="empty-cell">暂无数据</td></tr>`}</tbody></table></div>`;
}
function feeCard(isExec,kind){
  const isRecv=kind==='recv';
  const rows=isExec?[]:isRecv?[['操作费','FCO202610160032','成都柠檬时光科技有限公司','成都柠檬时光科技有限公司','6.00','到收','100.00','人民币','100.00','柜','10000.00','20RF','1.00','10000.00','','','否'],['运费','FCO202610160032','青岛绿洲园花生食品有限公司','青岛绿洲园花生食品有限公司','9.00','到付','80.00','人民币','100.00','吨','','','1.00','9000.00','','','否']]:[['运费','FCO202610160032','青岛绿洲园花生食品有限公司','青岛绿洲园花生食品有限公司','9.00','预付','80.00','人民币','100.00','吨','','','1.00','8000.00','','','否'],['运费','FCO202610160032','青岛绿洲园花生食品有限公司','青岛绿洲园花生食品有限公司','9.00','预付','70.00','人民币','100.00','吨','','','1.00','7000.00','','','否']];
  const title=isRecv?'业务预估应收':'业务预估应付';
  const actions=isExec?'':`<button class="btn outline-primary mini" data-toast="已模拟新增费用项">添加</button><button class="btn outline-primary mini" disabled>${isRecv?'拷贝到业务预估应付':'拷贝到业务预估应收'}</button><button class="btn outline-primary mini" data-toast="已模拟拷贝其他业务费用">${isRecv?'拷贝其他业务预估应收':'拷贝其他业务预估应付'}</button><button class="btn outline-primary mini" data-toast="已模拟带入集装箱费用">带入集装箱</button>`;
  return cubeCard(title,feeTable(rows,isExec),{actions,className:'TaskCargoFormList'});
}
function profitCard(isExec){
  const row=isExec?['人民币','10.00','10.00','0.00','0.00','0.00','0.00']:['人民币','19,000.00','15,000.00','4,000.00','0.00','0.00','0.00'];
  const body=`<div class="table-scroll"><table class="mini-table" style="min-width:1050px"><thead><tr><th>币种</th><th>业务预估应收</th><th>业务预估应付</th><th>业务预估利润</th><th>执行侧预估应收</th><th>执行侧预估应付</th><th>执行利润</th></tr></thead><tbody><tr>${row.map(v=>`<td>${v}</td>`).join('')}</tr><tr>${['折合本币(CNY)',...row.slice(1)].map(v=>`<td>${v}</td>`).join('')}</tr></tbody></table></div>`;
  return cubeCard('利润统计',body);
}
function attachmentCard(isExec){
  const body=isExec?'':`<div class="upload-box"><div>拖拽文件至此处或点击上传</div><div style="margin-top:4px">(仅支持doc/docx/pdf/png/jpg/xlsx格式文件，文件大小不超过20M)</div></div>`;
  return cubeCard('审批参考附件',body);
}
function systemCard(isExec){
  const v=isExec?['苏丽蓉','2026-10-20 19:51:03','菜菜菜','2026-10-20 19:51:36','4','执行中']:['苏丽蓉','2026-10-16 16:52:48','苏丽蓉','2026-10-16 16:52:48','0','创建'];
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
    <div class="exec-fee-block"><div class="exec-fee-title"><span>${blockTitle}</span>${isExecTab?'<button class="btn outline-primary mini" data-toast="已模拟维护执行侧应收">维护执行侧应收</button>':''}</div>${feeTable(isExecTab?[]:[['操作费','FCO202610160032','成都柠檬时光科技有限公司','成都柠檬时光科技有限公司','6.00','到收','100.00','人民币','100.00','柜','10000.00','20RF','1.00','10000.00','','','否']],isExecTab)}</div>
    <div class="exec-fee-block"><div class="exec-fee-title"><span>${secondTitle}</span>${isExecTab?'<button class="btn outline-primary mini" data-toast="已模拟维护执行侧应付">维护执行侧应付</button>':''}</div>${feeTable(isExecTab?[]:[['运费','FCO202610160032','青岛绿洲园花生食品有限公司','青岛绿洲园花生食品有限公司','9.00','预付','80.00','人民币','100.00','吨','','','1.00','8000.00','','','否']],isExecTab)}</div>
  </section>`;
}
function arrangementReferenceActions(isExec){
  const primary=isExec?'完结需求':'提交审批';
  return `<button class="btn outline-primary" data-toast="已模拟${primary}">${primary}</button><button class="btn danger" data-toast="已模拟删除确认">删除</button><button class="btn outline-primary" data-go="list">返回</button>`;
}function renderDetail(page){
  const isExec=page==='exec';
  const no=state.activeRowId||(isExec?'FLR202610200038':'FLR202610160032');
  const activeRecord=getActiveDemandRecord();
  const displayStatus=activeRecord.status||(isExec?'执行中':'创建');
  const mainCards=isExec?`${baseCard(true)}${customerCard(true)}${transportCard(true)}${voyageCard(true)}${containerCard(true)}${sendReceiveCard(true)}${execFeeSection()}${profitCard(true)}${attachmentCard(true)}${systemCard(true)}`: `${baseCard(false)}${customerCard(false)}${transportCard(false)}${voyageCard(false)}${containerCard(false)}${sendReceiveCard(false)}${feeCard(false,'recv')}${feeCard(false,'pay')}${profitCard(false)}${attachmentCard(false)}${systemCard(false)}`;
  return `<div class="detail-scroll ${state.detailView==='arrangement'&&!isExec?'empty-arrangement-scroll':''}"><div class="detail-page ${isExec?'exec-mode':'create-mode'}">
    <section class="cube-card"><div class="detail-titlebar"><div class="detail-title"><span class="caret">▼</span><span>物流需求单详情（${no}）</span><span class="expand-icon">⛶</span></div><div class="detail-actions">${detailActions(isExec)}</div></div></section>
    <div id="detailCards">${mainCards}</div>
    ${isExec?renderExecutionLower():''}
  </div></div>`;
}
function commodityTable(){
  const headers=['客户订单号','客户','唛头','商品中文名 *','商品描述','件数','件数单位','毛重','毛重单位','体积','体积单位','标准数量 *','标准单位 *','合同单价（元）','包装数量','包装单位','货物单价（元）','货物价值（万元）','贸易合同号（类型）','业务项目号','商品英文名'];
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
function cf(label,key,o={}){return field(label,createForm[key]||'',Object.assign({name:key},o));}
function editableTransportCard(){
  const isRoad=createForm.transportType==='汽运';
  const common=`${cf('运输类型','transportType',{required:true,options:opts.transport})}
    ${isRoad?'':cf('航运类型','shippingType',{required:true,options:opts.shipping})}
    ${cf('装运类别','loadType',{required:true,options:isRoad?['散货','集装箱']:opts.loadType})}
    ${isRoad?'':cf('操作模式','opMode',{options:opts.opMode})}
    ${isRoad?'':cf('提单种类','billType',{options:opts.billType})}
    ${isRoad?'':cf('是否直航','direct',{options:opts.yesNo})}`;
  let body='';
  if(isRoad){
    body=`${common}
      ${cf('收货单位','roadReceiver',{placeholder:'请选择'})}
      ${cf('起运地','roadOrigin',{placeholder:'请选择'})}
      ${cf('起运地（国别）省市区','roadOriginRegion',{readonly:true})}
      ${cf('起运地联系人','roadOriginContact')}
      ${cf('起运地联系方式','roadOriginPhone')}
      ${cf('起运地详细地址','roadOriginAddress',{readonly:true})}
      ${cf('目的地','roadDestination',{placeholder:'请选择'})}
      ${cf('目的地（国别）省市区','roadDestinationRegion',{readonly:true})}
      ${cf('目的地联系人','roadDestinationContact')}
      ${cf('目的地联系方式','roadDestinationPhone')}
      ${cf('目的地详细地址','roadDestinationAddress',{readonly:true})}
      ${cf('期望发运日期','expectedDate',{type:'date'})}
      ${cf('最晚送达日期','latestDate',{type:'date'})}
      ${cf('其他特殊要求','otherSpecial',{textarea:true,span:'span-2'})}`;
  }else if(createForm.loadType==='集装箱'){
    body=`${common}
      ${cf('装箱方式','packing',{options:opts.packing})}
      ${createForm.shippingType==='国际航运'?cf('订箱方式','boxMode',{options:opts.boxMode}):''}
      ${cf('揽货方式','cargoMode',{options:opts.cargoMode})}
      ${cf('代理','agent',{options:opts.agents})}
      ${cf('代理代号','agentCode',{options:[createForm.agentCode||'CCT202610150013']})}
      ${cf('代理业务员','agentSales')}
      ${cf('收货地','receiver',{placeholder:'请选择'})}
      ${cf('收货地（国别）省市区','receiverRegion',{readonly:true})}
      ${cf('收货地详细地址','receiverAddress',{readonly:true})}
      ${cf('起运港','portFrom',{required:true,options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门']})}
      ${cf('起运港（国别）省市区','portFromRegion',{readonly:true})}
      ${cf('起运港服务条款','fromTerms',{required:true,options:opts.freightTerms})}
      ${cf('起运码头','fromTerminal')}
      ${cf('目的港','portTo',{required:true,options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门']})}
      ${cf('目的港（国别）省市区','portToRegion',{readonly:true})}
      ${cf('目的港服务条款','toTerms',{required:true,options:opts.freightTerms})}
      ${cf('目的码头','toTerminal')}
      ${cf('卸货港','dischargePort',{options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门']})}
      ${cf('卸货港（国别）省市区','dischargePortRegion',{readonly:true})}
      ${cf('卸货地','dischargePlace',{placeholder:'请选择'})}
      ${cf('卸货地（国别）省市区','dischargePlaceRegion',{readonly:true})}
      ${cf('卸货地详细地址','dischargeAddress',{readonly:true})}
      ${cf('交货地','deliveryPlace',{placeholder:'请选择'})}
      ${cf('交货地（国别）省市区','deliveryPlaceRegion',{readonly:true})}
      ${cf('交货地详细地址','deliveryAddress',{readonly:true})}
      ${cf('其他特殊要求','otherSpecial',{textarea:true,span:'span-2'})}`;
  }else if(createForm.loadType==='散货'){
    body=`${common}
      ${cf('起运港','portFrom',{required:true,options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门']})}
      ${cf('起运港（国别）省市区','portFromRegion',{readonly:true})}
      ${cf('起运码头','fromTerminal')}
      ${cf('目的港','portTo',{required:true,options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门']})}
      ${cf('目的港（国别）省市区','portToRegion',{readonly:true})}
      ${cf('目的码头','toTerminal')}
      ${cf('卸货港','dischargePort',{options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门']})}
      ${cf('卸货港（国别）省市区','dischargePortRegion',{readonly:true})}
      ${cf('最迟装运期','latestShipment',{type:'date'})}
      ${cf('卸货条款','dischargeTerms',{options:['LO','FO','LO POR','CY','FIO','FLT']})}
      ${cf('船证要求','shipCert')}
      ${cf('船龄要求','shipAge')}
      ${cf('佣金比例(%)','commission')}
      ${cf('其他特殊要求','otherSpecial',{textarea:true,span:'span-2'})}`;
  }else if(createForm.loadType==='件杂货'){
    body=`${common}
      ${cf('起运港','portFrom',{required:true,options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门']})}
      ${cf('起运港（国别）省市区','portFromRegion',{readonly:true})}
      ${cf('起运港联系人','portFromContact')}
      ${cf('起运港联系方式','portFromPhone')}
      ${cf('起运码头','fromTerminal')}
      ${cf('目的港','portTo',{required:true,options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门']})}
      ${cf('目的港（国别）省市区','portToRegion',{readonly:true})}
      ${cf('目的港联系人','portToContact')}
      ${cf('目的港联系方式','portToPhone')}
      ${cf('目的码头','toTerminal')}
      ${cf('卸货港','dischargePort',{options:['富纳富提','香港','法马古斯塔','上海','宁波','厦门']})}
      ${cf('卸货港（国别）省市区','dischargePortRegion',{readonly:true})}
      ${cf('最迟装运期','latestShipment',{type:'date'})}
      ${cf('卸货条款','dischargeTerms',{options:['LO','FO','LO POR','CY','FIO','FLT']})}
      ${cf('船证要求','shipCert')}
      ${cf('船龄要求','shipAge')}
      ${cf('佣金比例(%)','commission')}
      ${cf('邮件接收人','emailReceiver')}
      ${cf('其他特殊要求','otherSpecial',{textarea:true,span:'span-2'})}`;
  }else{
    body=`${common}${cf('其他特殊要求','otherSpecial',{textarea:true,span:'span-2'})}`;
  }
  return cubeCard('运输要求',`<div class="grid-6">${body}</div>`);
}
function editableVoyageCard(){
  const body=`<div class="grid-6">
    ${cf('起运港ETD','etd',{type:'date'})}${cf('目的港ETA','eta',{type:'date'})}
    ${cf('船东合约号','contractNo')}${cf('MBL#','mbl')}${cf('HBL#','hbl')}${cf('订舱单号','bookingNo')}
    ${cf('船代','shipAgent',{options:opts.shipAgent})}${cf('货代','forwarder',{options:opts.shipAgent})}${cf('船东','shipOwner',{options:opts.shipOwner})}
    ${cf('船名/呼号/MMSI/IMO','vesselKeyword',{placeholder:'请输入内容'})}${cf('MMSI','mmsi')}${cf('船名','vesselName')}
    ${cf('航次','voyageNo')}${cf('航线','route',{options:opts.routes})}${cf('靠泊码头','berth')}${cf('柜期到期日','containerExpiry',{type:'date'})}
  </div>`;
  return cubeCard('航程要求',body);
}
function arrangementReferenceActions(isExec){
  const primary=isExec?'完结需求':'提交审批';
  return `<button class="btn outline-primary" data-toast="已模拟${primary}">${primary}</button><button class="btn danger" data-toast="已模拟删除确认">删除</button><button class="btn outline-primary" data-go="list">返回</button>`;
}function renderDetail(page){
  const isExec=page==='exec';
  const no=state.activeRowId||(isExec?'FLR202610200038':'FLR202610160032');
  let mainCards;
  if(isExec){
    mainCards=`${baseCard(true)}${customerCard(true)}${transportCard(true)}${voyageCard(true)}${containerCard(true)}${sendReceiveCard(true)}${execFeeSection()}${profitCard(true)}${attachmentCard(true)}${systemCard(true)}`;
  }else{
    const isWater=createForm.transportType==='水运';
    const showContainer=isWater&&createForm.loadType==='集装箱';
    mainCards=`${baseCard(false)}${customerCard(false)}${editableTransportCard()}${isWater?editableVoyageCard():''}${showContainer?containerCard(false):''}${showContainer?sendReceiveCard(false):''}${feeCard(false,'recv')}${feeCard(false,'pay')}${profitCard(false)}${attachmentCard(false)}${systemCard(false)}`;
  }
  return `<div class="detail-scroll ${state.detailView==='arrangement'&&!isExec?'empty-arrangement-scroll':''}"><div class="detail-page ${isExec?'exec-mode':'create-mode'}">
    <section class="cube-card"><div class="detail-titlebar"><div class="detail-title"><span class="caret">▼</span><span>物流需求单详情（${no}）</span><span class="expand-icon">⛶</span></div><div class="detail-actions">${detailActions(isExec)}</div></div></section>
    <div id="detailCards">${mainCards}</div>
    ${isExec?renderExecutionLower():''}
  </div></div>`;
}
const portRegions={'富纳富提':'大洋洲/图瓦卢','香港':'亚洲/中国','法马古斯塔':'欧洲/塞浦路斯','上海':'亚洲/中国','宁波':'亚洲/中国','厦门':'亚洲/中国'};
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
function optimizedDetailActions(isExec){
  if(state.detailView==='arrangement')return `<button class="btn outline-primary" data-toast="已模拟完结需求">完结需求</button><button class="btn danger" data-toast="已模拟删除确认">删除</button><button class="btn outline-primary" data-go="list">返回</button>`;
  const more=`<div class="dropdown-wrap"><button class="btn outline-primary" data-dropdown>更多操作 <span style="font-size:10px">⌄</span></button><div class="dropdown-menu"><button data-toast="已模拟打印">打印</button><button data-toast="已模拟打开审批进度">审批进度</button><button data-toast="已模拟进入修改OP">修改OP</button><button data-collapse-all>收起全部</button></div></div>`;
  if(isExec)return `<button class="btn outline-primary" data-toast="已模拟完结需求">完结需求</button><div class="dropdown-wrap"><button class="btn outline-primary" data-dropdown>发起对账 <span style="font-size:10px">⌄</span></button><div class="dropdown-menu"><button data-toast="已模拟发起客户对账">客户对账</button><button data-toast="已模拟发起供应商对账">供应商对账</button><button data-toast="已模拟打开对账记录">对账记录</button></div></div>${more}<button class="btn outline-primary" data-go="list">返回</button>`;
  return `<button class="btn primary" data-toast="已模拟提交审批">提交审批</button><button class="btn danger" data-toast="已模拟删除确认">删除</button>${more}<button class="btn outline-primary" data-go="list">返回</button>`;
}
function arrangementReferenceActions(isExec){
  const primary=isExec?'完结需求':'提交审批';
  return `<button class="btn outline-primary" data-toast="已模拟${primary}">${primary}</button><button class="btn danger" data-toast="已模拟删除确认">删除</button><button class="btn outline-primary" data-go="list">返回</button>`;
}function renderDetail(page){
  const isExec=page==='exec';
  const no=state.activeRowId||(isExec?'FLR202610200038':'FLR202610160032');
  let infoCards;
  if(isExec){
    infoCards=`${baseCard(true)}${customerCard(true)}${transportCard(true)}${voyageCard(true)}${containerCard(true)}${sendReceiveCard(true)}${execFeeSection()}${profitCard(true)}${attachmentCard(true)}${systemCard(true)}`;
  }else{
    const isWater=createForm.transportType==='水运';
    const showContainer=isWater&&createForm.loadType==='集装箱';
    infoCards=`${baseCard(false)}${customerCard(false)}${editableTransportCard()}${isWater?editableVoyageCard():''}${showContainer?containerCard(false):''}${showContainer?sendReceiveCard(false):''}${feeCard(false,'recv')}${feeCard(false,'pay')}${profitCard(false)}${attachmentCard(false)}${systemCard(false)}`;
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
    <div class="ref-task-footer"><button class="btn outline-primary mini" data-toast="已模拟添加任务">＋ 添加任务</button></div>
  </article>`;
}
function renderExecutionLower(){
  const base=[['物流委托名称','ui自动化物流安排510309',true],['委托方法人公司','厦门建发生生物流有限公司',true],['物流委托类型','我司委托',true],['物流供应商','中联铁运集团有限公司',true],['供应商商户','中联铁运集团有限公司',true],['反馈方式','自反馈',true],['来源单据类型','采购/移仓'],['来源单据号',''],['作业组织','数字化中心',true],['作业组织人员',''],['委托备注','北港到厂水运入库，靠泊窗口需提前与港口调度确认。'],['报审说明','']];
  const fields=base.map(([l,v,r],i)=>field(l,v,{readonly:false,required:!!r,textarea:l==='委托备注'||l==='报审说明',span:i===0?'span-2':(l==='委托备注'||l==='报审说明')?'span-3':''})).join('');
  return `<div class="execution-ref-layout">
    <aside class="execution-tree-card"><div class="execution-tree-head"><span>执行结构</span><button class="btn link" data-toast="已模拟收起执行结构">«</button></div><div class="execution-tree-list"><button class="exec-delegation-node">${icon('order')}<span>ui自动化物流安排510309</span></button><button class="exec-task-node active">${icon('ship')}<span>华东物流运营中心 / 上海调度组 → 客户收货仓</span></button></div><button class="exec-add-delegation" data-toast="已模拟新增委托">＋ 新增委托</button></aside>
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
  const body=`<div class="goods-summary-bar"><span>共 <b>1</b> 条商品</span><span>标准数量 <b>1 ${g.u3}</b></span><span>毛重 <b>—</b></span><span>体积 <b>—</b></span><span>货值 <b>—</b></span></div><div class="table-scroll goods-table-scroll"><table class="mini-table" style="min-width:1500px"><thead><tr><th style="width:150px">客户订单号</th><th style="width:180px">客户</th><th style="width:130px">商品中文名</th><th style="width:140px">商品描述</th><th style="width:105px">件数/单位</th><th style="width:105px">毛重/单位</th><th style="width:105px">体积/单位</th><th style="width:125px">标准数量/单位</th><th style="width:100px">单件重量</th><th style="width:120px">单件重量单位</th><th style="width:120px">规格尺寸</th><th style="width:100px">溢装率（%）</th><th style="width:100px">短装率（%）</th><th style="width:130px">货物单价（元）</th><th style="width:140px">货物总价（万元）</th><th style="width:180px">贸易合同号（类型）</th><th style="width:150px">商品英文名</th><th style="width:80px">操作</th></tr></thead><tbody><tr><td>${g.no}</td><td>${g.customer}</td><td>${g.name}</td><td></td><td></td><td>${g.u1}</td><td>${g.u2}</td><td>${g.u3}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>${isExec?'':'<button class="btn link" style="color:var(--danger)">删除</button>'}</td></tr></tbody></table></div>`;
  return cubeCard('商品明细列表',body,{actions:isExec?'':'<button class="btn outline-primary mini" data-toast="已模拟打开商品选择弹窗">选择商品</button>'});
}
function renderDetail(page){
  const isExec=page==='exec';
  const no=state.activeRowId||(isExec?'FLR202610200038':'FLR202610160032');
  const activeRecord=getActiveDemandRecord();
  const displayStatus=activeRecord.status||(isExec?'执行中':'创建');
  const isWater=isExec||createForm.transportType==='水运';
  const showContainer=isExec||(isWater&&createForm.loadType==='集装箱');
  const overview=`${baseCard(isExec)}${customerCard(isExec)}`;
  const transport=isExec?`${transportCard(true)}${voyageCard(true)}${containerCard(true)}${sendReceiveCard(true)}`:`${editableTransportCard()}${isWater?editableVoyageCard():''}${showContainer?containerCard(false):''}${showContainer?sendReceiveCard(false):''}`;
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
      <div class="detail-actions">${state.detailView==='arrangement'?arrangementReferenceActions(isExec):optimizedDetailActions(isExec)}</div>
    </div></section>
    <div class="detail-view-panel ${state.detailView==='info'?'active':''}" data-view-panel="info">${infoView}</div>
    <div class="detail-view-panel ${state.detailView==='arrangement'?'active':''}" data-view-panel="arrangement">${arrangement}</div>
    <div class="detail-view-panel ${state.detailView==='documents'?'active':''}" data-view-panel="documents">${documents}</div>
  </div></div>`;
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-detail-section]');if(t){state.detailSection=t.dataset.detailSection;render();}});
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
    <section class="cube-card doc-list-card"><div class="doc-list-head"><div class="doc-list-title">单据列表 <span>${docs.length}</span></div><div class="doc-filter-tabs">${filters.map(([id,l,n])=>`<button class="doc-filter ${active===id?'active':''}" data-doc-filter="${id}">${l} <b>${n}</b></button>`).join('')}</div><div class="dropdown-wrap"><button class="btn primary" data-dropdown>＋ 新建单据 <span style="font-size:10px">⌄</span></button><div class="dropdown-menu"><button data-doc-open="新建提单">提单</button><button data-doc-open="新建代理结算单">代理结算单</button><button data-doc-open="新建客户对账单">客户对账单</button><button data-doc-open="新建供应商对账单">供应商对账单</button><button data-doc-open="新建发票登记单">发票登记单</button><button data-doc-open="新建付款申请单">付款申请单</button><button data-doc-open="新建收款认领单">收款认领单</button></div></div></div><div class="table-scroll"><table class="mini-table doc-table"><thead><tr><th>单据类型</th><th>单据编号</th><th>状态</th><th>客户 / 供应商</th><th>关联单据</th><th>金额</th><th>更新时间</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div></section>
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
    <div class="doc-type-nav-row"><div class="doc-type-nav">${nav}</div><div class="dropdown-wrap"><button class="btn primary" data-dropdown>＋ 新建单据 <span style="font-size:10px">⌄</span></button><div class="dropdown-menu"><button data-doc-open="新建提单">提单</button><button data-doc-open="新建代理结算单">代理结算单</button><button data-doc-open="新建客户对账单">客户对账单</button><button data-doc-open="新建供应商对账单">供应商对账单</button><button data-doc-open="新建发票登记单">发票登记单</button><button data-doc-open="新建付款申请单">付款申请单</button><button data-doc-open="新建收款认领单">收款认领单</button></div></div></div>
    <section class="cube-card doc-list-card"><div class="doc-list-head"><div class="doc-heading-block"><div class="doc-list-title">${selected}<span>${shown.length}</span></div><div class="doc-list-sub">${pending?`${pending} 条待处理`:'暂无待处理事项'} · 按更新时间倒序</div></div><div class="doc-list-filters"><input class="doc-search" name="docSearch" aria-label="搜索单据编号、客户或供应商" placeholder="搜索单据编号、客户或供应商"><select class="doc-status-filter" name="docStatus" aria-label="单据状态"><option>全部状态</option><option>待确认</option><option>待审批</option><option>已对账</option><option>已完成</option></select></div></div><div class="doc-fixed-table"><table class="mini-table doc-table"><thead><tr><th>单据编号</th>${showType?'<th>单据类型</th>':''}<th>状态</th><th>客户 / 供应商</th><th>关联单据</th><th>金额</th><th>更新时间</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div><div class="doc-pagination"><span>共 ${shown.length} 条</span><button class="page-btn active">1</button><span class="doc-page-size">每页 20 条</span></div></section>
  </div>`;
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-doc-type]');if(t){state.docFilter=t.dataset.docType;render();}});
function customerCard(isExec){
  const selected = getActiveDemandRecord();
  const showSelected = isExec || Boolean(prototypeParams.get('no'));
  const selectedGoods = selected.type && selected.type.includes('集装箱') ? '集装箱货物' : selected.type && selected.type.includes('散货') ? '散货货物' : '—';
  const d=showSelected?{order:selected.order||'—',company:selected.customer||'—',date:demandBusinessDate(selected),contact:'',email:'',sales:'苏丽蓉',agent:'',remark:selected.biz||'',businessType:demandBusinessType(selected),transportType:selected.type||'',loadType:demandLoadType(selected),goods:{no:selected.order||'—',customer:selected.customer||'—',name:selectedGoods,unit1:'—',unit2:'—',unit3:'—'}}:{order:'FCO202610160032',company:'成都柠檬时光科技有限公司',date:'2026-10-16',contact:'11',email:'',sales:'林美燕',agent:'菊风公司传媒有限公司b590c',remark:'自动化订单备注',businessType:'内贸',transportType:createForm.transportType,loadType:createForm.loadType,goods:{no:'FCO202610160032',customer:'成都柠檬时光科技有限公司',name:'玉米',unit1:'吨',unit2:'立方米',unit3:'吨'}};
  const tags=['运输',d.businessType,d.transportType,d.loadType].filter(Boolean).map(t=>`<span class="order-tag">${esc(t)}</span>`).join('');
  const meta=(l,v)=>`<div class="related-meta"><span class="related-meta-label">${l}</span><span class="related-meta-value" title="${esc(v||'')}">${v||'—'}</span></div>`;
  return `<section class="cube-card customer-goods-card"><div class="cube-head"><button class="collapse-btn" data-collapse aria-label="收起"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button><div class="title">客户及商品明细</div></div><div class="cube-body"><div class="customer-goods-layout">
    <section class="related-orders-panel"><div class="related-orders-head">查看关联客户订单 <b>（1）</b></div><div class="related-order-card"><div class="related-order-top"><span class="related-order-no">${d.order}</span><span class="external-client">（外部客户）</span><div class="related-order-tags">${tags}</div></div><div class="related-company-row"><div class="related-company">${d.company}</div><div class="related-meta"><span class="related-meta-label">委托方组织：</span><span class="related-meta-value">—</span></div></div><div class="related-meta-grid">${meta('结算抬头：',d.company)}${meta('业务日期：',d.date)}${meta('联系人：',d.contact)}${meta('联系邮箱：',d.email)}${meta('业务员：',d.sales)}${meta('代理：',d.agent)}${meta('备注：',d.remark)}<div class="related-meta"></div></div></div></section>
    <section class="goods-panel"><div class="goods-panel-head">商品明细列表</div><div class="goods-table-scroll"><table class="mini-table customer-goods-table"><thead><tr><th style="width:170px">客户订单号</th><th style="width:180px">客户</th><th style="width:150px">商品中文名</th><th style="width:150px">商品描述</th><th style="width:120px">件数/单位</th><th style="width:120px">毛重/单位</th><th style="width:130px">体积/单位</th><th style="width:130px">标准数量/单位</th><th style="width:110px">单件重量</th><th style="width:120px">规格尺寸</th><th style="width:120px">货物单价（元）</th><th style="width:80px">操作</th></tr></thead><tbody><tr class="selected-goods-row"><td>${d.goods.no}</td><td>${d.goods.customer}</td><td>${d.goods.name}</td><td>—</td><td><span class="goods-cell-value">—</span></td><td><span class="goods-cell-value">—</span><span class="goods-unit">${d.goods.unit1}</span></td><td><span class="goods-cell-value">—</span><span class="goods-unit">${d.goods.unit2}</span></td><td><span class="goods-cell-value">—</span><span class="goods-unit">${d.goods.unit3}</span></td><td><span class="goods-cell-value">—</span></td><td><span class="goods-cell-value">—</span></td><td><span class="goods-cell-value">—</span></td><td>${isExec?'':'<button class="btn link" style="color:var(--danger)">删除</button>'}</td></tr></tbody></table></div></section>
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

const feeLedger = [
  { side: 'recv', statementNo: 'DZ202610200031', statementName: '青岛绿洲园花生食品有限公司 2026-10 应收对账单', statementType: '客户对账单', party: '青岛绿洲园花生食品有限公司', completedAt: '2026-10-21', fee: '海运费', currency: 'CNY', amount: '12,000.00', invoiced: '12,000.00', invoices: [{ id: 'SR202610200018', status: '已开票', amount: '12,000.00', tone: 'success' }], settled: '12,000.00', outstanding: '0.00', payments: [{ id: 'SK202610200007', status: '已收款', amount: '12,000.00', tone: 'success' }], statementStatus: '已对账', statementTone: 'success', settlementStatus: '已收付', tone: 'success' },
  { side: 'recv', statementNo: 'DZ202610200031', statementName: '青岛绿洲园花生食品有限公司 2026-10 应收对账单', statementType: '客户对账单', party: '青岛绿洲园花生食品有限公司', completedAt: '2026-10-21', fee: '港杂费', currency: 'CNY', amount: '4,000.00', invoiced: '4,000.00', invoices: [{ id: 'SR202610200018', status: '已开票', amount: '3,000.00', tone: 'success' }, { id: 'SR202610200019', status: '已开票', amount: '1,000.00', tone: 'success' }], settled: '4,000.00', outstanding: '0.00', payments: [{ id: 'SK202610200007', status: '已收款', amount: '3,000.00', tone: 'success' }, { id: 'SK202610200008', status: '已收款', amount: '1,000.00', tone: 'success' }], statementStatus: '已对账', statementTone: 'success', settlementStatus: '已收付', tone: 'success' },
  { side: 'recv', statementNo: 'DZ202610200031', statementName: '青岛绿洲园花生食品有限公司 2026-10 应收对账单', statementType: '客户对账单', party: '青岛绿洲园花生食品有限公司', completedAt: '2026-10-21', fee: '报关费', currency: 'CNY', amount: '3,000.00', invoiced: '0.00', invoices: [], settled: '1,500.00', outstanding: '1,500.00', payments: [{ id: 'SK202610200008', status: '部分收款', amount: '1,500.00', tone: 'warning' }], statementStatus: '已对账', statementTone: 'success', settlementStatus: '部分收付', tone: 'warning' },
  { side: 'pay', statementNo: 'DZ202610200022', statementName: '中联铁运集团有限公司 2026-10 应付对账单', statementType: '供应商对账单', party: '中联铁运集团有限公司', completedAt: '2026-10-20', fee: '海运费', currency: 'CNY', amount: '10,000.00', invoiced: '10,000.00', invoices: [{ id: 'CB202610200016', status: '已登记', amount: '10,000.00', tone: 'success' }], settled: '10,000.00', outstanding: '0.00', payments: [{ id: 'FK202610200009', status: '已付款', amount: '6,000.00', tone: 'success' }, { id: 'FK202610200010', status: '已付款', amount: '4,000.00', tone: 'success' }], statementStatus: '待确认', statementTone: 'warning', settlementStatus: '已付款', tone: 'success', sourceDoc: 'JS202610200012' },
  { side: 'pay', statementNo: 'DZ202610200022', statementName: '中联铁运集团有限公司 2026-10 应付对账单', statementType: '供应商对账单', party: '中联铁运集团有限公司', completedAt: '2026-10-20', fee: '港杂费', currency: 'CNY', amount: '5,000.00', invoiced: '5,000.00', invoices: [{ id: 'CB202610200016', status: '已登记', amount: '5,000.00', tone: 'success' }], settled: '2,000.00', outstanding: '3,000.00', payments: [{ id: 'FK202610200009', status: '部分付款', amount: '2,000.00', tone: 'warning' }], statementStatus: '待确认', statementTone: 'warning', settlementStatus: '部分付款', tone: 'warning', sourceDoc: 'JS202610200012' },
  { side: 'pay', statementNo: 'DZ202610200023', statementName: '中联铁运集团有限公司 2026-10 代理对账单', statementType: '代理对账单', party: '中联铁运集团有限公司', completedAt: '2026-10-21', fee: '代理费', currency: 'CNY', amount: '5,500.00', invoiced: '5,500.00', invoices: [{ id: 'CB202610200016', status: '已登记', amount: '5,500.00', tone: 'success' }], settled: '0.00', outstanding: '5,500.00', payments: [{ id: 'FK202610200011', status: '待审批', amount: '0.00', tone: 'warning' }], statementStatus: '待确认', statementTone: 'warning', settlementStatus: '待付款', tone: 'warning', sourceDoc: 'JS202610200012' },
  { side: 'recv', statementNo: 'DZ202610200023', statementName: '中联铁运集团有限公司 2026-10 代理对账单', statementType: '代理对账单', party: '中联铁运集团有限公司', completedAt: '2026-10-21', fee: '垫付费用', currency: 'CNY', amount: '3,000.00', invoiced: '0.00', invoices: [], settled: '0.00', outstanding: '3,000.00', payments: [{ id: 'SK202610200009', status: '待收款', amount: '0.00', tone: 'warning' }], statementStatus: '待确认', statementTone: 'warning', settlementStatus: '待收款', tone: 'warning', sourceDoc: 'JS202610200012' }
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
  return `<section class="cube-card doc-all-card"><div class="doc-query-bar"><span class="doc-query-title">提单列表</span><span class="doc-query-hint">仅展示提单登记单</span><span class="doc-result-count">共 ${docs.length} 条</span></div><div class="doc-all-table-wrap"><table class="mini-table doc-all-table"><thead><tr><th>单据类型</th><th>单据编号</th><th>船东提单号</th><th>货代提单号</th><th>航司主单号</th><th>我司分单号</th><th>状态</th><th>创建人</th><th>创建时间</th><th>修改人</th><th>修改时间</th><th>操作</th></tr></thead><tbody>${rows || '<tr><td colspan="12" class="doc-empty">暂无提单登记单</td></tr>'}</tbody></table></div></section>`;
}

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
  return `<section class="cube-card doc-all-card doc-hub-card">${renderPaymentLedger(isExec)}</section>`;
}

document.addEventListener('change', e => {
  if (e.target.id === 'paymentTypeFilter') { state.paymentFilter = e.target.value; render(); }
});

function renderDetail(page){
  const isExec=page==='exec';
  const no=state.activeRowId||(isExec?'FLR202610200038':'FLR202610160032');
  const activeRecord=getActiveDemandRecord();
  const displayStatus=activeRecord.status||(isExec?'执行中':'创建');
  const isWater=isExec||createForm.transportType==='水运';
  const showContainer=isExec||(isWater&&createForm.loadType==='集装箱');
  const overview=`${baseCard(isExec)}${customerCard(isExec)}`;
  const transport=isExec?`${transportCard(true)}${voyageCard(true)}${containerCard(true)}${sendReceiveCard(true)}`:`${editableTransportCard()}${isWater?editableVoyageCard():''}${showContainer?containerCard(false):''}${showContainer?sendReceiveCard(false):''}`;
  const fees=isExec?`${execFeeSection()}${profitCard(true)}`:`${feeCard(false,'recv')}${feeCard(false,'pay')}${profitCard(false)}`;
  const records=`${attachmentCard(isExec)}${systemCard(isExec)}`;
  const billList=renderBillList(isExec);
  const arrangement=isExec?renderExecutionLower():`<div class="arrangement-empty-shell"><span class="empty-message">暂无物流安排，请先新增物流委托。</span><button class="btn primary" data-toast="已模拟新增物流委托"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>新增物流委托</button></div>`;
  const documents=renderDocumentsView(isExec);
  const view=state.detailView==='documents'?'documents':'info';
  const sections=['overview','transport','fees','records','arrangement','bills'];
  const activeSection=sections.includes(state.detailSection)?state.detailSection:'overview';
  const nav=[['overview','基础信息'],['transport','运输要求'],['fees','费用与利润'],['records','附件与记录'],['arrangement',`物流安排${isExec?' (1)':' (0)'}`],['bills','提单列表']];
  const panels={overview,transport,fees,records,arrangement,bills:billList};
  return `<div class="detail-scroll"><div class="detail-page ${isExec?'exec-mode':'create-mode'}">
    <section class="cube-card"><div class="detail-titlebar"><div class="detail-title"><span style="width:8px;height:8px;border-radius:2px;background:#2563eb;display:inline-block"></span><span>物流需求详情（${no}）</span><span class="expand-icon">⛶</span></div><span class="detail-status ${displayStatus==='执行中'?'running':displayStatus==='创建'?'draft':'status-create'}">${displayStatus}</span><div class="detail-view-switch"><button class="detail-view-tab ${view==='info'?'active':''}" data-detail-view="info">需求详情</button><button class="detail-view-tab ${view==='documents'?'active':''}" data-detail-view="documents">实际收付</button></div><div class="detail-actions">${optimizedDetailActions(isExec)}</div></div></section>
    ${view==='info'?`<div class="detail-section-tabs">${nav.map(([id,l])=>`<button class="detail-section-tab ${activeSection===id?'active':''}" data-detail-section="${id}">${l}</button>`).join('')}</div><div class="detail-section-panel active" id="section-${activeSection}">${panels[activeSection]||panels.overview}</div>`:`<div class="doc-independent-view">${documents}</div>`}
  </div></div>`;
}
document.addEventListener('change',e=>{if(e.target.id==='docTypeFilter'){const val=e.target.value;const card=e.target.closest('.doc-all-card');const rows=[...card.querySelectorAll('tbody tr[data-doc-type]')];let count=0;rows.forEach(r=>{const show=val==='all'||r.dataset.docType===val;r.style.display=show?'':'none';if(show)count++;});const label=card.querySelector('#docResultCount');if(label)label.textContent=`共 ${count} 条`;}});
function render(){
  renderTopTabs();
  renderSidebar();
  const main=document.getElementById('main');
  main.innerHTML=state.page==='list'?renderList():state.page==='document'?renderDocumentPage():renderDetail(state.page);
  state.dropdownOpen=false;
}
document.addEventListener('click',e=>{
  const rowOpen=e.target.closest('[data-row-open]');
  if(rowOpen){
    e.preventDefault();
    const id=rowOpen.dataset.rowOpen;
    const mode=rowOpen.dataset.rowMode==='create'?'create':'exec';
    if(PROTOTYPE_VIEW==='list'){
      window.location.href=prototypeUrl(PROTOTYPE_DETAIL_FILE,{no:id,mode});
      return;
    }
    state.activeRowId=id;
    state.page=mode;
    state.detailView='info';
    state.detailSection='overview';
    state.selectedRows.clear();
    render();
    return;
  }
  const go=e.target.closest('[data-go]');
  if(go){
    e.preventDefault();
    const target=go.dataset.go;
    if(target==='list'){
      window.location.href=prototypeUrl(PROTOTYPE_LIST_FILE);
      return;
    }
    if(target==='create'||target==='exec'){
      window.location.href=prototypeUrl(PROTOTYPE_DETAIL_FILE,{mode:target,no:state.activeRowId||''});
      return;
    }
    state.page=target;
    state.selectedRows.clear();
    render();
    return;
  }
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
    if(PROTOTYPE_VIEW==='detail'){
      window.location.href=prototypeUrl(PROTOTYPE_LIST_FILE);
      return;
    }
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
  const mode=row.dataset.rowMode||'exec';
  window.location.href=prototypeUrl(PROTOTYPE_DETAIL_FILE,{no:row.dataset.rowId,mode});
},true);
render();
