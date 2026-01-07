document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("filter-form");
  const clearBtn = document.querySelector('a[href="index.html"]');

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
