document.addEventListener("DOMContentLoaded", function () {
    // Initialize the carousel
    const carouselElement = document.getElementById("movie-image-slider");
    const carousel = new bootstrap.Carousel(carouselElement);
  
    // Add event listener to each "Review" button to pause the carousel
    for (let i = 0; i < values.length; i++) {
      const reviewButton = document.getElementById("review-button" + i);
      if (reviewButton) {
        reviewButton.addEventListener("click", function () {
          // Use the already initialized 'carousel' variable
          if (carousel) {
            carousel.pause();
          }
        });
      }
    }
  
    // Add event listener to the modal close button to resume the carousel
    const modalCloseButtons = document.querySelectorAll(
      '[data-bs-dismiss="modal"]'
    );
    modalCloseButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        // Use the already initialized 'carousel' variable
        if (carousel) {
          carousel.cycle();
        }
      });
    });
  });
  