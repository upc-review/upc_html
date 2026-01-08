document.addEventListener("DOMContentLoaded", function () {
  const filterBtn = document.getElementById("filter-btn");

filterBtn.addEventListener("click", function (event) {
  event.preventDefault();
  showStaticWarning();
});

const showStaticWarning = function () {
  alert(
    "This page is for review purposes only.\n\n" +
    "Advanced filtering features are not available in this static version."
  );
};


  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      showStaticWarning();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showStaticWarning();
    });
  }
});
