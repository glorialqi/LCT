(function () {
  'use strict';

  const ICONS = {
    loading: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.2-8.56"/></svg>',
    empty: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg>',
    error: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5M12 16.5h.01"/></svg>',
    forbidden: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    offline: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8a12 12 0 0 1 16 0M7 11a8 8 0 0 1 10 0M10 14a3.5 3.5 0 0 1 4 0"/><path d="M12 18h.01M3 3l18 18"/></svg>',
    success: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 9"/></svg>',
    warning: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 22 21H2z"/><path d="M12 9v5M12 17.5h.01"/></svg>'
  };

  const COPY = {
    loading: { title: '正在加载数据…', message: '请稍候，数据加载完成后会自动显示。' },
    empty: { title: '暂无数据', message: '当前条件下没有可显示的数据。' },
    error: { title: '加载失败', message: '服务暂时不可用，请稍后重试。' },
    forbidden: { title: '暂无访问权限', message: '请联系管理员开通权限后重试。' },
    offline: { title: '网络连接已断开', message: '请检查网络连接后重新加载。' },
    success: { title: '操作成功', message: '数据已更新。' },
    warning: { title: '部分数据未加载', message: '可以继续使用已加载的数据，或稍后刷新。' }
  };

  function create(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function stateBlock(state, options) {
    const copy = COPY[state] || COPY.empty;
    const block = create('div', 'ui-state-block');
    block.dataset.state = state;
    block.dataset.density = options.density || 'default';

    const icon = create('div', 'ui-state-icon');
    icon.innerHTML = ICONS[state] || ICONS.empty;
    block.appendChild(icon);

    block.appendChild(create('div', 'ui-state-title', options.title || copy.title));
    block.appendChild(create('p', 'ui-state-message', options.message || copy.message));

    if (options.meta) block.appendChild(create('div', 'ui-state-meta', options.meta));

    if (options.actionLabel) {
      const actions = create('div', 'ui-state-actions');
      const action = create('button', 'secondary', options.actionLabel);
      action.type = 'button';
      if (typeof options.onAction === 'function') action.addEventListener('click', options.onAction);
      actions.appendChild(action);
      block.appendChild(actions);
    }
    return block;
  }

  function loadingBlock(options) {
    const block = stateBlock('loading', { ...options, density: 'compact' });
    const skeleton = create('div', 'ui-skeleton-table');
    for (let i = 0; i < (options.rows || 4); i += 1) {
      const row = create('div', 'ui-skeleton-row');
      [0, 1, 2, 3].forEach((idx) => {
        const line = create('span', 'ui-skeleton' + (idx === 3 ? ' is-short' : idx === 2 ? ' is-tiny' : ''));
        row.appendChild(line);
      });
      skeleton.appendChild(row);
    }
    block.appendChild(skeleton);
    return block;
  }

  function ensureTableOverlay(host) {
    if (!host) return null;
    host.classList.add('ui-table-state-host');
    let overlay = host.querySelector(':scope > .ui-table-state-overlay');
    if (!overlay) {
      overlay = create('div', 'ui-table-state-overlay');
      host.appendChild(overlay);
    }
    return overlay;
  }

  function setTableState(host, options) {
    if (typeof host === 'string') host = document.querySelector(host);
    if (!host) return null;
    const state = options.state || 'loading';
    if (state === 'ready' || state === 'idle') {
      clearTableState(host);
      return null;
    }
    const overlay = ensureTableOverlay(host);
    overlay.hidden = false;
    overlay.classList.toggle('is-preserving-header', Boolean(options.preserveHeader));
    overlay.classList.toggle('is-refreshing', state === 'loading' && options.mode === 'refresh');
    overlay.replaceChildren(state === 'loading' ? loadingBlock(options) : stateBlock(state, options));
    overlay.setAttribute('role', state === 'error' || state === 'offline' ? 'alert' : 'status');
    overlay.setAttribute('aria-live', state === 'error' || state === 'offline' ? 'assertive' : 'polite');
    host.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
    return overlay;
  }

  function clearTableState(host) {
    if (typeof host === 'string') host = document.querySelector(host);
    if (!host) return;
    host.removeAttribute('aria-busy');
    const overlay = host.querySelector(':scope > .ui-table-state-overlay');
    if (overlay) overlay.remove();
  }

  function fieldMessageId(field, input) {
    if (input.id) return input.id + '-state-message';
    field.dataset.uiFieldSeq = field.dataset.uiFieldSeq || String(Math.random()).slice(2);
    return 'ui-field-' + field.dataset.uiFieldSeq + '-state-message';
  }

  function setFieldState(input, state, message) {
    if (typeof input === 'string') input = document.querySelector(input);
    if (!input) return;
    const field = input.closest('.ui-field, .field, .form-field, .manual-filter-field') || input.parentElement;
    if (!field) return;
    field.classList.remove('is-invalid', 'is-valid', 'is-warning', 'is-disabled', 'is-readonly');
    if (state === 'invalid' || state === 'error') field.classList.add('is-invalid');
    else if (state === 'valid' || state === 'success') field.classList.add('is-valid');
    else if (state === 'warning') field.classList.add('is-warning');
    else if (state === 'disabled') field.classList.add('is-disabled');
    else if (state === 'readonly') field.classList.add('is-readonly');

    let msg = field.querySelector('.ui-field-message');
    if (!msg) {
      msg = create('div', 'ui-field-message');
      field.appendChild(msg);
    }
    const id = fieldMessageId(field, input);
    msg.id = id;
    msg.className = 'ui-field-message' + (state === 'invalid' || state === 'error' ? ' ui-field-error' : '');
    msg.textContent = message || '';
    input.setAttribute('aria-describedby', id);
    input.setAttribute('aria-invalid', state === 'invalid' || state === 'error' ? 'true' : 'false');
  }

  function clearFieldState(input) {
    if (typeof input === 'string') input = document.querySelector(input);
    if (!input) return;
    const field = input.closest('.ui-field, .field, .form-field, .manual-filter-field') || input.parentElement;
    if (field) {
      field.classList.remove('is-invalid', 'is-valid', 'is-warning', 'is-disabled', 'is-readonly');
      const msg = field.querySelector('.ui-field-message');
      if (msg) msg.textContent = '';
    }
    input.removeAttribute('aria-invalid');
  }

  function controlLabel(input) {
    if (input.getAttribute('aria-label')) return input.getAttribute('aria-label');
    if (input.labels && input.labels.length) return input.labels[0].textContent.trim().replace('*', '');
    const field = input.closest('.ui-field, .field, .form-field');
    const label = field && field.querySelector('.ui-field-label, .field-label, .filter-label, label');
    return label ? label.textContent.trim().replace('*', '') : '此项';
  }

  function validateRequired(scope) {
    if (typeof scope === 'string') scope = document.querySelector(scope);
    if (!scope) return { valid: true, invalidCount: 0, firstInvalid: null };
    const invalid = [];
    scope.querySelectorAll('input, select, textarea').forEach((input) => {
      if (!input.required || input.disabled || input.readOnly || input.type === 'hidden') return;
      const value = (input.value || '').trim();
      if (!value) {
        const label = controlLabel(input);
        setFieldState(input, 'invalid', (input.tagName === 'SELECT' ? '请选择' : '请填写') + label);
        invalid.push(input);
      } else {
        clearFieldState(input);
      }
    });
    if (invalid[0]) invalid[0].focus();
    return { valid: invalid.length === 0, invalidCount: invalid.length, firstInvalid: invalid[0] || null };
  }

  function setButtonLoading(button, loading, loadingLabel) {
    if (typeof button === 'string') button = document.querySelector(button);
    if (!button) return;
    button.classList.toggle('ui-button', true);
    if (loading) {
      if (!button.dataset.uiOriginalHtml) button.dataset.uiOriginalHtml = button.innerHTML;
      if (!button.dataset.uiWasDisabled) button.dataset.uiWasDisabled = String(button.disabled);
      button.innerHTML = '<span class="ui-button-label">' + button.dataset.uiOriginalHtml + '</span>';
      button.classList.add('is-loading');
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      button.setAttribute('aria-label', loadingLabel || '处理中');
    } else {
      if (button.dataset.uiOriginalHtml) {
        button.innerHTML = button.dataset.uiOriginalHtml;
        delete button.dataset.uiOriginalHtml;
      }
      button.classList.remove('is-loading');
      button.disabled = button.dataset.uiWasDisabled === 'true';
      delete button.dataset.uiWasDisabled;
      button.removeAttribute('aria-busy');
      button.removeAttribute('aria-label');
    }
  }

  function showFormAlert(scope, tone, message) {
    if (typeof scope === 'string') scope = document.querySelector(scope);
    if (!scope) return null;
    let alert = scope.querySelector('[data-ui-form-alert]');
    if (!alert) {
      alert = create('div', 'ui-form-alert');
      alert.setAttribute('data-ui-form-alert', '');
      scope.prepend(alert);
    }
    alert.classList.add('ui-form-alert');
    alert.hidden = false;
    alert.dataset.tone = tone || 'info';
    alert.setAttribute('role', tone === 'error' ? 'alert' : 'status');
    alert.setAttribute('aria-live', tone === 'error' ? 'assertive' : 'polite');
    const icon = tone === 'error' ? '!' : tone === 'success' ? '✓' : tone === 'warning' ? '!' : 'i';
    alert.innerHTML = '<span class="ui-form-alert-icon" aria-hidden="true">' + icon + '</span><span class="ui-form-alert-text"></span>';
    alert.querySelector('.ui-form-alert-text').textContent = message;
    return alert;
  }

  function clearFormAlert(scope) {
    if (typeof scope === 'string') scope = document.querySelector(scope);
    const alert = scope && scope.querySelector('[data-ui-form-alert]');
    if (alert) {
      alert.hidden = true;
      alert.textContent = '';
    }
  }

  function watchDirty(scope, indicator) {
    if (typeof scope === 'string') scope = document.querySelector(scope);
    if (typeof indicator === 'string') indicator = document.querySelector(indicator);
    if (!scope) return { isDirty: () => false, markClean: () => {} };
    let dirty = false;
    const update = () => {
      if (dirty) return;
      dirty = true;
      scope.dataset.dirty = 'true';
      if (indicator) indicator.hidden = false;
    };
    const markClean = () => {
      dirty = false;
      scope.dataset.dirty = 'false';
      if (indicator) indicator.hidden = true;
    };
    scope.addEventListener('input', update);
    scope.addEventListener('change', update);
    window.addEventListener('beforeunload', (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    });
    return { isDirty: () => dirty, markClean };
  }

  function setFormDisabled(scope, disabled) {
    if (typeof scope === 'string') scope = document.querySelector(scope);
    if (!scope) return;
    scope.querySelectorAll('input, select, textarea, button').forEach((control) => {
      if (disabled) {
        if (!control.dataset.uiWasDisabled) control.dataset.uiWasDisabled = String(control.disabled);
        control.disabled = true;
      } else {
        control.disabled = control.dataset.uiWasDisabled === 'true';
        delete control.dataset.uiWasDisabled;
      }
    });
  }

  window.UIState = {
    setTableState,
    clearTableState,
    setFieldState,
    clearFieldState,
    validateRequired,
    setButtonLoading,
    showFormAlert,
    clearFormAlert,
    watchDirty,
    setFormDisabled
  };
})();
