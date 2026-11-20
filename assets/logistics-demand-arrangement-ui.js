(() => {
  if (window.LogisticsArrangementUI) return;

  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const routeCatalog = [
    { id: 'demand-route-1', label: '线路 1', origin: '上海港', destination: '洛杉矶港', transport: '水运', load: '集装箱', status: '执行中', quantity: '1 柜' },
    { id: 'demand-route-2', label: '线路 2', origin: '洛杉矶', destination: '芝加哥', transport: '铁运', load: '集装箱', status: '执行中', quantity: '1 柜' },
    { id: 'demand-route-3', label: '线路 3', origin: '芝加哥', destination: '哥伦布', transport: '汽运', load: '散货', status: '待安排', quantity: '12 吨' }
  ];
  const taskTypes = ['汽运任务', '水运任务', '铁运任务', '空运任务', '其他任务'];
  const launchTaskTypes = ['汽运', '水运', '铁运', '航空'];
  const loadTypes = ['散货', '集装箱'];
  let launchState = null;
  let taskState = null;
  let routePicker = null;

  const getToast = (message) => {
    if (typeof window.toast === 'function') {
      window.toast(message);
      return;
    }
    const host = document.getElementById('toastHost') || document.body;
    const node = document.createElement('div');
    node.className = 'toast';
    node.textContent = message;
    host.appendChild(node);
    window.setTimeout(() => node.remove(), 2200);
  };
  const taskTypeForRoute = (route) => route ? ({ '汽运': '汽运任务', '水运': '水运任务', '铁运': '铁运任务', '航空': '空运任务' }[route.transport] || '其他任务') : '水运任务';
  const routeLabel = (route) => route ? `${route.label} · ${route.origin} → ${route.destination}` : '未引用线路';
  const findRoute = (id) => routeCatalog.find((route) => route.id === id) || null;

  function openLaunchDialog(trigger) {
    closeLaunchDialog();
    const demandNo = trigger?.dataset.demandNo || document.body.dataset.demandNo || 'FLR202610200038';
    const demandType = trigger?.dataset.demandType || '水运集装箱';
    const department = trigger?.dataset.demandDept || '数字化中心';
    const sales = trigger?.dataset.demandSales || '苏丽蓉';
    const company = trigger?.dataset.demandCompany || '厦门建发生生物流有限公司';
    launchState = {
      demandNo,
      routes: routeCatalog.map((route) => ({ ...route })),
      consignments: [{
        id: 'C1',
        name: '未命名物流委托',
        legalCompany: company,
        type: '我司委托-已准入供应商',
        supplier: '中联铁运集团有限公司',
        supplierMerchant: '',
        tasks: [{ id: 'T1', routeId: 'demand-route-1', type: '水运', load: '集装箱' }]
      }],
      sequence: 1,
      dragRouteId: ''
    };

    const organization = [
      ['业务员', sales], ['业务员部门', department], ['业务员经营单位', '供应链物流科技'],
      ['业务员核算组', department], ['业务员公司', company], ['作业组织', department], ['作业组织人员', sales]
    ].map(([label, value]) => `<div class="ld-arrangement-field"><label>${esc(label)}<span class="required">*</span></label><input value="${esc(value)}" readonly></div>`).join('');

    const overlay = document.createElement('div');
    overlay.className = 'ld-arrangement-backdrop';
    overlay.dataset.launchOverlay = '1';
    overlay.innerHTML = `<section class="ld-arrangement-dialog" role="dialog" aria-modal="true" aria-labelledby="ldLaunchTitle">
      <header class="ld-arrangement-head"><h2 class="ld-arrangement-title" id="ldLaunchTitle">发起物流安排</h2><button class="ld-arrangement-close" type="button" data-ld-close aria-label="关闭发起物流安排">×</button></header>
      <div class="ld-arrangement-body">
        <section class="ld-arrangement-section"><div class="ld-arrangement-section-head"><div class="ld-arrangement-section-title">组织信息</div></div><div class="ld-arrangement-form-grid">${organization}</div></section>
        <section class="ld-arrangement-section"><div class="ld-arrangement-section-head"><div class="ld-arrangement-section-title">可分配线路</div><div class="ld-arrangement-section-note">按住线路卡片，拖拽到下方任一物流委托即可生成任务</div></div><div class="ld-arrangement-route-pool" data-ld-route-pool></div></section>
        <section class="ld-arrangement-section"><div class="ld-arrangement-section-head"><div class="ld-arrangement-section-title">物流委托与任务</div><button class="ld-arrangement-add-consignment" type="button" data-ld-add-consignment>＋ 新增委托</button></div><div data-ld-consignment-list></div></section>
      </div>
      <footer class="ld-arrangement-foot"><button class="btn" type="button" data-ld-close>取消</button><button class="btn primary" type="button" data-ld-confirm>确认创建</button></footer>
    </section>`;
    document.body.appendChild(overlay);
    document.body.classList.add('ld-arrangement-dialog-open');
    renderLaunch(overlay);

    overlay.addEventListener('input', (event) => {
      const field = event.target.closest('[data-ld-consignment-field]');
      if (!field) return;
      const item = launchState.consignments.find((consignment) => consignment.id === field.dataset.ldCommission);
      if (item) item[field.dataset.ldConsignmentField] = field.value;
    });

    overlay.addEventListener('change', (event) => {
      const field = event.target.closest('[data-ld-task-field]');
      if (!field) return;
      const item = launchState.consignments.find((consignment) => consignment.id === field.dataset.ldCommission);
      const task = item?.tasks.find((entry) => entry.id === field.dataset.ldTask);
      if (task) task[field.dataset.ldTaskField] = field.value;
    });

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay || event.target.closest('[data-ld-close]')) { closeLaunchDialog(); return; }
      if (event.target.closest('[data-ld-add-consignment]')) {
        launchState.sequence += 1;
        launchState.consignments.push({
          id: `C${launchState.sequence}`, name: '未命名物流委托', legalCompany: company,
          type: '我司委托-已准入供应商', supplier: '中联铁运集团有限公司', supplierMerchant: '', tasks: []
        });
        renderLaunch(overlay);
        return;
      }
      const addTask = event.target.closest('[data-ld-add-task]');
      if (addTask) {
        const consignmentHost = addTask.closest('.ld-arrangement-consignment')?.querySelector('.ld-arrangement-tasks');
        openInlineTaskComposer(addTask, { anchor: consignmentHost, initialRoute: findRoute(addTask.dataset.ldRouteId), onConfirm: (task) => {
          const consignment = launchState?.consignments.find((item) => item.id === addTask.dataset.ldCommission);
          if (!consignment || !launchState) return;
          launchState.sequence += 1;
          consignment.tasks.push({ id: `T${launchState.sequence}`, routeId: task.routeId, type: task.type === '空运任务' ? '航空' : task.type.replace('任务', ''), load: task.load });
          renderLaunch(document.querySelector('[data-launch-overlay]'));
        }});
        return;
      }
      const deleteTask = event.target.closest('[data-ld-delete-task]');
      if (deleteTask) {
        const consignment = launchState.consignments.find((item) => item.id === deleteTask.dataset.ldCommission);
        if (consignment) consignment.tasks = consignment.tasks.filter((task) => task.id !== deleteTask.dataset.ldTask);
        renderLaunch(overlay);
        return;
      }
      const deleteConsignment = event.target.closest('[data-ld-delete-consignment]');
      if (deleteConsignment) {
        launchState.consignments = launchState.consignments.filter((item) => item.id !== deleteConsignment.dataset.ldDeleteConsignment);
        renderLaunch(overlay);
        return;
      }
      if (event.target.closest('[data-ld-confirm]')) {
        const consignmentCount = launchState.consignments.length;
        const taskCount = launchState.consignments.reduce((sum, item) => sum + item.tasks.length, 0);
        closeLaunchDialog();
        getToast(`物流安排已发起：${consignmentCount} 个委托、${taskCount} 个任务`);
      }
    });

    overlay.addEventListener('dragstart', (event) => {
      const card = event.target.closest('[data-ld-route-card]');
      if (!card || card.classList.contains('is-assigned')) { event.preventDefault(); return; }
      launchState.dragRouteId = card.dataset.ldRouteCard;
      event.dataTransfer?.setData('text/plain', launchState.dragRouteId);
    });
    overlay.addEventListener('dragover', (event) => {
      const zone = event.target.closest('[data-ld-drop]');
      if (!zone) return;
      event.preventDefault();
      zone.classList.add('is-dragover');
    });
    overlay.addEventListener('dragleave', (event) => event.target.closest('[data-ld-drop]')?.classList.remove('is-dragover'));
    overlay.addEventListener('drop', (event) => {
      const zone = event.target.closest('[data-ld-drop]');
      if (!zone) return;
      event.preventDefault();
      zone.classList.remove('is-dragover');
      const routeId = event.dataTransfer?.getData('text/plain') || launchState.dragRouteId;
      const route = findRoute(routeId);
      if (!route) return;
      const assigned = launchState.consignments.some((item) => item.tasks.some((task) => task.routeId === routeId));
      if (assigned) { getToast('该线路已分配任务'); return; }
      const consignment = launchState.consignments.find((item) => item.id === zone.dataset.ldDrop);
      if (!consignment) return;
      launchState.sequence += 1;
      consignment.tasks.push({ id: `T${launchState.sequence}`, routeId, type: route.transport, load: route.load });
      renderLaunch(overlay);
    });
  }

  function renderLaunch(overlay) {
    if (!overlay || !launchState) return;
    const assigned = new Set(launchState.consignments.flatMap((item) => item.tasks.map((task) => task.routeId)).filter(Boolean));
    const pool = overlay.querySelector('[data-ld-route-pool]');
    if (pool) pool.innerHTML = launchState.routes.map((route) => {
      const isAssigned = assigned.has(route.id);
      return `<article class="ld-arrangement-route-card ${isAssigned ? 'is-assigned' : ''}" draggable="${!isAssigned}" data-ld-route-card="${esc(route.id)}">
        <div class="ld-arrangement-route-card-head"><span>${esc(route.label)}</span><span>${isAssigned ? '已分配' : '可分配'}</span></div>
        <div class="ld-arrangement-route-card-path">${esc(route.origin)} → ${esc(route.destination)}</div>
        <div class="ld-arrangement-route-card-mode">${esc(route.transport)} · ${esc(route.load)}</div>
        <div class="ld-arrangement-route-drag-hint">${isAssigned ? '已分配到任务' : '按住卡片拖到下方委托'}</div>
      </article>`;
    }).join('');
    const list = overlay.querySelector('[data-ld-consignment-list]');
    if (list) list.innerHTML = launchState.consignments.length ? launchState.consignments.map((consignment, index) => {
      const tasks = consignment.tasks.length ? consignment.tasks.map((task) => {
        const route = findRoute(task.routeId);
        return `<div class="ld-arrangement-task-card">
          <div class="ld-arrangement-task-field"><label>关联线路</label><div class="ld-arrangement-task-route-value" title="${esc(routeLabel(route))}">${esc(routeLabel(route))}</div></div>
          <div class="ld-arrangement-task-field"><label>首段运输任务类型</label><select data-ld-task-field="type" data-ld-task="${esc(task.id)}" data-ld-commission="${esc(consignment.id)}">${launchTaskTypes.map((type) => `<option ${type === task.type ? 'selected' : ''}>${type}</option>`).join('')}</select></div>
          <div class="ld-arrangement-task-field"><label>装运类别</label><select data-ld-task-field="load" data-ld-task="${esc(task.id)}" data-ld-commission="${esc(consignment.id)}">${loadTypes.map((load) => `<option ${load === task.load ? 'selected' : ''}>${load}</option>`).join('')}</select></div>
          <button class="ld-arrangement-task-delete" type="button" data-ld-delete-task="${esc(task.id)}" data-ld-commission="${esc(consignment.id)}" aria-label="删除任务">×</button>
        </div>`;
      }).join('') : '<div class="ld-arrangement-task-empty">暂无任务</div>';
      return `<article class="ld-arrangement-consignment" data-ld-drop="${esc(consignment.id)}">
        <div class="ld-arrangement-consignment-head"><div class="ld-arrangement-consignment-title">委托 ${index + 1}</div><div class="ld-arrangement-consignment-actions"><button class="ld-arrangement-mini-btn" type="button" data-ld-add-task data-ld-commission="${esc(consignment.id)}" data-ld-route-id="${esc(launchState.routes.find((route) => !assigned.has(route.id))?.id || '')}">＋ 新增任务</button><button class="ld-arrangement-icon-btn" type="button" data-ld-delete-consignment="${esc(consignment.id)}" aria-label="删除委托">×</button></div></div>
        <div class="ld-arrangement-form-grid">
          <div class="ld-arrangement-field"><label>物流委托名称<span class="required">*</span></label><input data-ld-consignment-field="name" data-ld-commission="${esc(consignment.id)}" value="${esc(consignment.name)}" placeholder="请输入物流委托名称"></div>
          <div class="ld-arrangement-field"><label>委托方法人公司<span class="required">*</span></label><input data-ld-consignment-field="legalCompany" data-ld-commission="${esc(consignment.id)}" value="${esc(consignment.legalCompany)}"></div>
          <div class="ld-arrangement-field"><label>运输委托类型<span class="required">*</span></label><select data-ld-consignment-field="type" data-ld-commission="${esc(consignment.id)}"><option ${consignment.type === '我司委托-已准入供应商' ? 'selected' : ''}>我司委托-已准入供应商</option><option ${consignment.type === '供应商直委托' ? 'selected' : ''}>供应商直委托</option></select></div>
          <div class="ld-arrangement-field"><label>物流供应商<span class="required">*</span></label><select data-ld-consignment-field="supplier" data-ld-commission="${esc(consignment.id)}"><option>中联铁运集团有限公司</option><option>青岛远洋物流有限公司</option><option>待分配承运商</option></select></div>
          <div class="ld-arrangement-field"><label>供应商商户</label><select data-ld-consignment-field="supplierMerchant" data-ld-commission="${esc(consignment.id)}"><option value="">请选择</option><option>默认商户</option></select></div>
        </div>
        <div class="ld-arrangement-tasks"><div class="ld-arrangement-task-head"><div class="ld-arrangement-task-title">任务信息（${consignment.tasks.length}）</div></div><div class="ld-arrangement-task-list">${tasks}</div><div class="ld-arrangement-dropzone" data-ld-drop="${esc(consignment.id)}">将上方线路拖到此委托内，即可生成任务</div></div>
      </article>`;
    }).join('') : '<div class="ld-arrangement-task-empty">暂无物流委托，请点击“新增委托”。</div>';
  }

  function closeLaunchDialog() {
    document.querySelectorAll('[data-launch-overlay]').forEach((node) => node.remove());
    if (!document.querySelector('.ld-arrangement-backdrop, .ld-route-picker-backdrop')) document.body.classList.remove('ld-arrangement-dialog-open');
    launchState = null;
  }

  function openInlineTaskComposer(trigger, { initialRoute = null, onConfirm = null, anchor = null } = {}) {
    closeInlineTaskComposer();
    const task = {
      type: initialRoute ? taskTypeForRoute(initialRoute) : '水运任务',
      load: initialRoute?.load || '集装箱',
      routeId: initialRoute?.id || ''
    };
    taskState = { task, onConfirm, container: null };
    const panel = document.createElement('section');
    panel.className = 'ld-inline-task-panel';
    panel.dataset.inlineTaskComposer = '1';
    panel.innerHTML = `<div class="ld-inline-task-head"><div class="ld-task-title-row"><h3 class="ld-inline-task-title">新增任务</h3><button class="ld-task-reference-btn" type="button" data-ld-reference-route><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/></svg>引用物流需求线路</button></div><button class="ld-inline-task-close" type="button" data-ld-task-close aria-label="关闭新增任务">×</button></div>
      <div class="ld-inline-task-body">
        <div class="ld-task-row"><div class="ld-task-label">任务类型</div><div class="ld-task-options">${taskTypes.map((type) => `<button class="ld-task-option ${task.type === type ? 'is-selected' : ''}" type="button" data-ld-task-type="${type}">${type}</button>`).join('')}</div></div>
        <div class="ld-task-row"><div class="ld-task-label">装运类别</div><div class="ld-task-options">${loadTypes.map((load) => `<button class="ld-task-option ${task.load === load ? 'is-selected' : ''}" type="button" data-ld-task-load="${load}">${load}</button>`).join('')}</div></div>
        <div class="ld-task-route-summary" data-ld-task-route-summary hidden></div>
      </div>
      <div class="ld-inline-task-foot"><button class="btn" type="button" data-ld-task-close>取消</button><button class="btn primary" type="button" data-ld-task-confirm>确认</button></div>`;

    const host = anchor || trigger?.closest('.ref-task-card');
    if (host && host.classList?.contains('ref-task-card')) host.insertAdjacentElement('afterend', panel);
    else if (host) host.appendChild(panel);
    else document.querySelector('.delegation-ref-body')?.appendChild(panel);
    taskState.container = panel;
    renderSelectedTaskRoute(panel);

    panel.addEventListener('click', (event) => {
      if (event.target.closest('[data-ld-task-close]')) { closeInlineTaskComposer(); return; }
      const type = event.target.closest('[data-ld-task-type]');
      if (type) {
        taskState.task.type = type.dataset.ldTaskType;
        panel.querySelectorAll('[data-ld-task-type]').forEach((button) => button.classList.toggle('is-selected', button === type));
        return;
      }
      const load = event.target.closest('[data-ld-task-load]');
      if (load) {
        taskState.task.load = load.dataset.ldTaskLoad;
        panel.querySelectorAll('[data-ld-task-load]').forEach((button) => button.classList.toggle('is-selected', button === load));
        return;
      }
      if (event.target.closest('[data-ld-reference-route]')) { openRoutePicker(); return; }
      if (event.target.closest('[data-ld-task-confirm]')) {
        const confirmedTask = { ...taskState.task };
        const callback = taskState.onConfirm;
        closeInlineTaskComposer();
        if (callback) callback(confirmedTask);
        getToast(confirmedTask.routeId ? `已新增任务并引用${routeLabel(findRoute(confirmedTask.routeId))}` : '已新增任务');
      }
    });
    window.requestAnimationFrame(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  }

  function renderSelectedTaskRoute(container) {
    if (!container || !taskState) return;
    const summary = container.querySelector('[data-ld-task-route-summary]');
    if (!summary) return;
    const route = findRoute(taskState.task.routeId);
    if (!route) { summary.hidden = true; summary.innerHTML = ''; return; }
    summary.hidden = false;
    summary.innerHTML = `<div class="ld-task-route-summary-head"><span>已引用物流需求线路</span><span>选择后可继续调整任务类型与装运类别</span></div><div class="ld-task-route-grid">
      <div class="ld-task-route-field"><span>线路</span><strong title="${esc(route.label)}">${esc(route.label)}</strong></div>
      <div class="ld-task-route-field"><span>起运地</span><strong title="${esc(route.origin)}">${esc(route.origin)}</strong></div>
      <div class="ld-task-route-field"><span>目的地</span><strong title="${esc(route.destination)}">${esc(route.destination)}</strong></div>
      <div class="ld-task-route-field"><span>运输方式</span><strong>${esc(route.transport)} · ${esc(route.load)}</strong></div>
      <div class="ld-task-route-field"><span>线路状态</span><strong>${esc(route.status)}</strong></div>
    </div>`;
  }

  function openRoutePicker() {
    if (!taskState) return;
    routePicker?.remove();
    routePicker = document.createElement('div');
    routePicker.className = 'ld-route-picker-backdrop';
    routePicker.dataset.routePicker = '1';
    routePicker.innerHTML = `<section class="ld-arrangement-dialog ld-route-picker-dialog" role="dialog" aria-modal="true" aria-labelledby="ldRoutePickerTitle">
      <header class="ld-arrangement-head"><h2 class="ld-arrangement-title" id="ldRoutePickerTitle">引用物流需求线路</h2><button class="ld-arrangement-close" type="button" data-ld-picker-close aria-label="关闭线路清单">×</button></header>
      <div class="ld-route-picker-body"><div class="ld-route-picker-tip"><i>i</i><span>请选择一条物流需求线路，当前任务仅可引用一条线路。</span></div><div class="ld-route-picker-table-wrap"><table class="ld-route-picker-table" aria-label="物流需求线路清单"><thead><tr><th>选择</th><th>线路</th><th>起运地</th><th>目的地</th><th>运输方式</th><th>装运类别</th><th>需求数量</th><th>线路状态</th></tr></thead><tbody>
        ${routeCatalog.map((route) => `<tr data-ld-picker-row="${esc(route.id)}" class="${taskState.task.routeId === route.id ? 'is-selected' : ''}"><td><input type="radio" name="ldDemandRoute" value="${esc(route.id)}" ${taskState.task.routeId === route.id ? 'checked' : ''} aria-label="选择${esc(route.label)}"></td><td><span class="ld-route-line-name">${esc(route.label)}</span></td><td>${esc(route.origin)}</td><td>${esc(route.destination)}</td><td>${esc(route.transport)}</td><td>${esc(route.load)}</td><td>${esc(route.quantity)}</td><td><span class="ld-route-status ${route.status === '待安排' ? 'is-pending' : ''}">${esc(route.status)}</span></td></tr>`).join('')}
      </tbody></table></div><div class="ld-route-picker-foot"><div class="ld-route-picker-selected" data-ld-picker-selected>${taskState.task.routeId ? `已选择：${esc(routeLabel(findRoute(taskState.task.routeId)))}` : '尚未选择线路'}</div><div class="ld-route-picker-actions"><button class="btn" type="button" data-ld-picker-close>取消</button><button class="btn primary" type="button" data-ld-picker-confirm>确认引用</button></div></div></div>
    </section>`;
    document.body.appendChild(routePicker);

    routePicker.addEventListener('click', (event) => {
      const row = event.target.closest('[data-ld-picker-row]');
      if (row) {
        routePicker.querySelectorAll('[data-ld-picker-row]').forEach((item) => item.classList.toggle('is-selected', item === row));
        const input = row.querySelector('input[type="radio"]');
        if (input) input.checked = true;
        taskState.task.routeId = row.dataset.ldPickerRow;
        const label = routePicker.querySelector('[data-ld-picker-selected]');
        if (label) label.textContent = `已选择：${routeLabel(findRoute(taskState.task.routeId))}`;
        return;
      }
      if (event.target === routePicker || event.target.closest('[data-ld-picker-close]')) { closeRoutePicker(); return; }
      if (event.target.closest('[data-ld-picker-confirm]')) {
        const checked = routePicker.querySelector('input[name="ldDemandRoute"]:checked');
        if (!checked) { getToast('请选择一条物流需求线路'); return; }
        const route = findRoute(checked.value);
        if (route) {
          taskState.task.routeId = route.id;
          taskState.task.type = taskTypeForRoute(route);
          taskState.task.load = route.load;
          const composer = taskState.container;
          composer?.querySelectorAll('[data-ld-task-type]').forEach((button) => button.classList.toggle('is-selected', button.dataset.ldTaskType === taskState.task.type));
          composer?.querySelectorAll('[data-ld-task-load]').forEach((button) => button.classList.toggle('is-selected', button.dataset.ldTaskLoad === taskState.task.load));
          renderSelectedTaskRoute(composer);
        }
        closeRoutePicker();
      }
    });
  }

  function closeRoutePicker() {
    routePicker?.remove();
    routePicker = null;
  }

  function closeInlineTaskComposer() {
    closeRoutePicker();
    document.querySelectorAll('[data-inline-task-composer]').forEach((node) => node.remove());
    taskState = null;
    if (!document.querySelector('.ld-arrangement-backdrop')) document.body.classList.remove('ld-arrangement-dialog-open');
  }

  document.addEventListener('click', (event) => {
    const launch = event.target.closest('[data-launch-logistics-arrangement]');
    if (launch) { event.preventDefault(); openLaunchDialog(launch); return; }
    const task = event.target.closest('[data-open-logistics-task]');
    if (task) { event.preventDefault(); openInlineTaskComposer(task); }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (routePicker) { closeRoutePicker(); return; }
    if (document.querySelector('[data-inline-task-composer]')) { closeInlineTaskComposer(); return; }
    if (document.querySelector('[data-launch-overlay]')) closeLaunchDialog();
  });

  window.LogisticsArrangementUI = { openLaunchDialog, openInlineTaskComposer };
})();
