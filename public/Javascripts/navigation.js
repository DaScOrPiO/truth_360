document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navContainer = document.querySelector(".list-container");
  const item = document.querySelector(".hamburger-item");

  hamburger.addEventListener("click", () => {
    if (navContainer.classList.contains("no-display")) {
      navContainer.classList.remove("no-display");
      item.textContent = "close";
    } else {
      navContainer.classList.add("no-display");
      item.textContent = "menu";
    }
  });

  document.addEventListener("click", (e) => {
    if (
      !hamburger.contains(e.target) &&
      !navContainer.classList.contains("no-display")
    ) {
      navContainer.classList.add("no-display");
      item.textContent = "menu";
    }
  });
});
