(function () {
  "use strict";
  var title = document.querySelector(".ct-query-card .ct-query-title");
  if (!title) return;
  if (title.tagName === "BUTTON" || title.classList.contains("query-toggle")) return;

  var card = title.closest(".ct-query-card");
  if (!card) return;
  title.setAttribute("role", "button");
  title.setAttribute("tabindex", "0");
  title.setAttribute("aria-expanded", card.classList.contains("query-collapsed") ? "false" : "true");
  title.style.cursor = "pointer";

  function toggle() {
    var collapsed = card.classList.toggle("query-collapsed");
    title.setAttribute("aria-expanded", collapsed ? "false" : "true");
  }

  title.addEventListener("click", toggle);
  title.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  });
})();