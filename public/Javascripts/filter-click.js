document.addEventListener("DOMContentLoaded", function () {
  const filterSearch_btn = document.querySelector(".filter-search-btn");
  const filterSearch_container = document.querySelector(".filter-search");
  const confirmButton = document.querySelector(".confirm-btn");
  const clearButton = document.querySelector(".clear-btn");
  const include_adult = document.getElementById("includeAdult");
  const language = document.getElementById("lang");
  const primary_release_year = document.getElementById("release_year");
  const region = document.getElementById("location");

  filterSearch_btn.addEventListener("click", () => {
    filterSearch_container.classList.remove("hide");
    filterSearch_btn.classList.add("hide");
  });

  confirmButton.addEventListener("click", () => {
    filterSearch_container.classList.add("hide");
    filterSearch_btn.classList.remove("hide");
  });

  clearButton.addEventListener("click", () => {
    include_adult.checked = false;
    primary_release_year.value = "";
    language.value = "";
    region.value = "";
  });

  document.addEventListener("click", (e) => {
    if (
      !filterSearch_container.contains(e.target) &&
      !filterSearch_btn.contains(e.target)
    ) {
      if (
        !filterSearch_container.classList.contains("hide") &&
        filterSearch_btn.classList.contains("hide")
      ) {
        filterSearch_container.classList.add("hide");
        filterSearch_btn.classList.remove("hide");
        include_adult.checked = false;
        primary_release_year.value = "";
        language.value = "";
        region.value = "";
      }
    }
  });
});
