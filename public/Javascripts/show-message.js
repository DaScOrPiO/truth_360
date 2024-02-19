document.addEventListener("DOMContentLoaded", function () {
  const text = document.querySelectorAll(".no-view1");
  const inputs = document.querySelectorAll(".text-input");
  const otherInputs = document.querySelectorAll(".no-text-desc");

  text.forEach((el, i) => {
    inputs.forEach((item, index) => {
      item.addEventListener("input", (e) => {
        if (document.activeElement === inputs[index]) {
          text[index].classList.remove("no-view1");
        }

        otherInputs.forEach((items) => {
          items.addEventListener("input", (e) => {
            el.classList.add("no-view1");
            console.log("No");
          });
        });
      });
    });
  });
});
