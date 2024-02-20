document.addEventListener("DOMContentLoaded", function () {
  const submitButtton = document.getElementById("submit");

  document.getElementById("image").addEventListener("change", function (event) {
    const maxFileSize = 10 * 1024 * 1024;
    let totalSize = 0;

    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      totalSize += files[i].size;
      console.log(totalSize);
    }

    if (totalSize > maxFileSize) {
      Swal.fire({
        icon: "warning",
        text: "images size more than 10mb, please reduce size and try again",
        customClass: {
          confirmButton: "sweet-alert-btn",
        },
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
      submitButtton.disabled = true;
    } else {
      submitButtton.disabled = false;
    }
  });
});
