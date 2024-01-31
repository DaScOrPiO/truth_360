document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const hamburger_item = document.querySelector(".hamburger-item");

  hamburger?.addEventListener("click", (e) => {
    sidebar.classList.toggle("no-display");
    if (!sidebar.classList.contains("no-display")) {
      hamburger_item.textContent = "close";
    } else {
      hamburger_item.textContent = "menu";
    }
  });

  document.addEventListener("click", (e) => {
    if (
      !hamburger.contains(e.target) &&
      !sidebar.classList.contains("no-display")
    ) {
      sidebar.classList.add("no-display");
    }

    if (!sidebar.classList.contains("no-display")) {
      hamburger_item.textContent = "close";
    } else {
      hamburger_item.textContent = "menu";
    }
  });
});
