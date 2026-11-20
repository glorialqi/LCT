(function () {
  'use strict';

  const embedded = window.self !== window.top || new URLSearchParams(window.location.search).get('embed') === '1';
  if (embedded) document.documentElement.classList.add('demand-embedded');

  let toastTimer = null;

  function showToast(message, tone) {
    const toast = document.getElementById('demandToast');
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.toggle('is-error', tone === 'error');
    toast.classList.toggle('is-success', tone === 'success');
    toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function delay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    window.requestAnimationFrame(() => {
      const autofocus = dialog.querySelector('[autofocus]') || dialog.querySelector('input, select, textarea, button');
      if (autofocus) autofocus.focus();
    });
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
  }

  function notifyParent(page, view) {
    if (!embedded || !window.parent || window.parent === window) return;
    window.parent.postMessage({ type: 'ct-page-ready', page, view }, '*');
  }

  const statusTone = {
    pending: 'pending',
    received: 'done',
    rejected: 'rejected',
    closed: 'closed',
    current: 'done',
    generated: 'done',
    partial: 'pending',
    over: 'exception'
  };

  function statusTag(label, tone, extraClass) {
    return '<span class="status ' + escapeHtml(tone || statusTone[tone] || 'closed') +
      ' ' + escapeHtml(extraClass || '') + '">' + escapeHtml(label) + '</span>';
  }

  window.DemandUI = {
    embedded,
    showToast,
    escapeHtml,
    delay,
    openDialog,
    closeDialog,
    notifyParent,
    statusTag,
    statusTone
  };
})();

