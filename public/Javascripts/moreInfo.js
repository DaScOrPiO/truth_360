document.addEventListener("DOMContentLoaded", function () {
  const reviewContainer = document.getElementById("reviews-container");
  const moreButtons = document.querySelectorAll('[id^="view-more"]');
  const showInfoButtons = document.querySelectorAll('[id^="show-info"]');
  const reviewsPerPage = 5;
  let currentIndex = 0;
  let movieReviews;

  const shouldButtonDisplay = (movieIndex) => {
    console.log("shouldDisplayRan");

    // Check if movieIndex is within the bounds of moreData array
    if (movieIndex < moreData.length) {
      // Get the current movie at the movieIndex
      const currentMovie = moreData[movieIndex];

      // Filter reviews for the current movie
      movieReviews = reviewItems.filter(
        (item) => item.Movie_id === currentMovie.id
      );

      // Check if there are more than 5 reviews for the current movie
      const displayStyle = movieReviews.length > 5 ? "block" : "none";

      moreButtons.forEach((el) => (el.style.display = displayStyle));
    } else {
      // Hide all buttons if movieIndex is out of bounds
      moreButtons.forEach((el) => (el.style.display = "block"));
    }
  };

  // Add event listener to all "Show Info" buttons
  showInfoButtons.forEach((button, index) => {
    button.addEventListener("click", () => shouldButtonDisplay(index));
  });

  function displayReviews(startIndex, endIndex) {
    reviewContainer.innerHTML = ""; // Clear existing reviews

    for (let i = startIndex; i < endIndex; i++) {
      if (moreData[i]) {
        // Filter reviews for the current movie
        movieReviews = reviewItems.filter(
          (item) => item.Movie_id === moreData[i].id
        );

        if (movieReviews.length > 0) {
          // Append the review HTML to the container
          movieReviews.forEach((review) => {
            reviewContainer.innerHTML += `
                  <div class="card mb-3 mx-3">
                    <div class="card-body">
                      <h1 class="fs-5">Author: ${review.Author.username}</h1>
                      <p class="starability-result" data-rating="${review.Ratings}">
                        Rated: ${review.Ratings} stars
                      </p>
                      <p class="card-text">Review: ${review.Comment}</p>
                    </div>
                  </div>
                `;
          });
        }
      }
    }

    shouldButtonDisplay(currentIndex); // Call the function after displaying new reviews
  }

  function handleViewMore() {
    const nextIndex = currentIndex + reviewsPerPage;
    displayReviews(currentIndex, nextIndex);
    currentIndex = nextIndex;

    if (currentIndex >= movieReviews.length || movieReviews.length === 0) {
      console.log(currentIndex >= movieReviews.length);
      Swal.fire({
        icon: "info",
        title: "No more data to load.",
      });
    }
  }

  // Initial call to display the button based on the initial set of reviews
  shouldButtonDisplay(currentIndex);

  // Add event listener to the "View More" button
  showInfoButtons.forEach((button, index) => {
    button.addEventListener("click", () => shouldButtonDisplay(index));
  });

  moreButtons.forEach((button) => {
    button.addEventListener("click", handleViewMore);
  });
});
