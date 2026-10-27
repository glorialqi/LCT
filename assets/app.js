(function () {
  "use strict";

  const pages = {
    "customer-order-list": {
      title: "客户订单列表",
      description: "客户订单查询、客户委托单号与物流安排入口",
      file: "pages/customer-order-list-prototype.html"
    },
    "customer-order": {
      title: "客户订单跟踪",
      description: "客户订单、物流供应商与履约状态总览",
      file: "pages/customer-order-tracking.html"
    },
    "logistics-demand": {
      title: "物流需求列表",
      description: "物流需求查询、状态与列表管理",
      file: "pages/logistics-demand-list-prototype.html"
    },
    "trade-contract": {
      title: "贸易合同待办",
      description: "贸易合同销售待办、采购待办与配额调配",
      file: "pages/trade-contract-todo.html"
    }
  };

  const defaultPage = "customer-order";
  const navItems = Array.from(document.querySelectorAll("[data-page]"));
  const frames = Array.from(document.querySelectorAll(".page-frame[data-page]"));
  const pageTitle = document.getElementById("pageTitle");
  const pageDescription = document.getElementById("pageDescription");
  const openStandalone = document.getElementById("openStandalone");
  const refreshPage = document.getElementById("refreshPage");
  const loadingLayer = document.getElementById("loadingLayer");
  const prototypeInfo = document.getElementById("prototypeInfo");
  const appToast = document.getElementById("appToast");
  const loadedPages = new Set();
  let activePage = null;
  let loadingTimer = null;
  let toastTimer = null;

  function pageFromHash() {
    const key = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    return pages[key] ? key : defaultPage;
  }

  function showLoading() {
    clearTimeout(loadingTimer);
    loadingLayer.classList.remove("is-hidden");
    loadingTimer = window.setTimeout(hideLoading, 12000);
  }

  function hideLoading() {
    clearTimeout(loadingTimer);
    loadingLayer.classList.add("is-hidden");
  }


  function showToast(message) {
    clearTimeout(toastTimer);
    appToast.textContent = message;
    appToast.classList.add("show");
    toastTimer = window.setTimeout(() => appToast.classList.remove("show"), 2200);
  }

  function activatePage(key, updateHash) {
    if (!pages[key]) key = defaultPage;
    const previousPage = activePage;

    navItems.forEach((item) => {
      const active = item.dataset.page === key;
      item.classList.toggle("active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });

    frames.forEach((frame) => {
      const active = frame.dataset.page === key;
      frame.classList.toggle("active", active);
      frame.setAttribute("aria-hidden", active ? "false" : "true");
    });

    const config = pages[key];
    pageTitle.textContent = config.title;
    pageDescription.textContent = config.description;
    openStandalone.href = config.file;
    document.title = config.title + " · 物流控制塔";
    activePage = key;

    if ((key === "customer-order-list" || key === "logistics-demand") && previousPage && previousPage !== key) {
      const frame = frames.find((item) => item.dataset.page === key);
      if (frame) {
        loadedPages.delete(key);
        showLoading();
        frame.src = pages[key].file + "?embed=1&reset=" + Date.now();
      }
    }

    if (!loadedPages.has(key)) showLoading();
    else hideLoading();

    if (updateHash && window.location.hash !== "#" + key) {
      window.history.pushState(null, "", "#" + key);
    }
  }

  navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      activatePage(item.dataset.page, true);
    });
  });


  frames.forEach((frame) => {
    frame.addEventListener("load", () => {
      loadedPages.add(frame.dataset.page);
      if (frame.dataset.page === activePage) {
        hideLoading();
      }
    });
    frame.addEventListener("error", () => {
      if (frame.dataset.page === activePage) hideLoading();
    });
  });

  refreshPage.addEventListener("click", () => {
    const frame = frames.find((item) => item.dataset.page === activePage);
    if (!frame) return;
    showLoading();
    frame.src = pages[activePage].file + "?embed=1&refresh=" + Date.now();
  });

  if (prototypeInfo) {
    prototypeInfo.addEventListener("click", () => {
      showToast("当前为物流控制塔交互原型，左侧菜单可切换已接入页面。");
    });
  }

  window.addEventListener("hashchange", () => activatePage(pageFromHash(), false));
  window.addEventListener("popstate", () => activatePage(pageFromHash(), false));
  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "ct-page-ready") {
      loadedPages.add(event.data.page);
      if (event.data.page === activePage) hideLoading();
    }
  });

  activatePage(pageFromHash(), false);
})();
