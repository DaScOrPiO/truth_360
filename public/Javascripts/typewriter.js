document.addEventListener("DOMContentLoaded", function () {
  const selct = document.getElementById("type-text");

  var effect = new Typewriter(selct, {
    strings: [
      "Explore and discover new locations and movies",
      "Drop a movie or location review to help others",
    ],
    autoStart: true,
    loop: true,
    delay: 75,
  });

  effect.start();
});

const button = document.querySelector(".home-button");
button.addEventListener("click", () => (window.location.href = "/login"));
