// --------------------
// VARIABLES
// --------------------

let artworks = [];

let selectedArtwork = null;

let artworkImage = null;

let imageIsLoading = false;


// HTML elements

let homePage =
  document.querySelector("#homePage");

let resultPage =
  document.querySelector("#resultPage");

let searchButton =
  document.querySelector("#searchButton");

let tryAgainButton =
  document.querySelector("#tryAgainButton");

let message =
  document.querySelector("#message");

let resultBirthday =
  document.querySelector("#resultBirthday");

let artTitle =
  document.querySelector("#artTitle");

let artArtist =
  document.querySelector("#artArtist");

let artYear =
  document.querySelector("#artYear");



// --------------------
// MONTH NAMES
// --------------------

let monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];



// --------------------
// LOAD JSON
// --------------------

fetch("artworks.json?v=6")

  .then(function(response) {

    return response.json();

  })

  .then(function(data) {

    artworks = data;

    console.log("Artwork data loaded");

    console.log(artworks);

  })

  .catch(function(error) {

    console.log("JSON error:");

    console.log(error);

    message.innerHTML =
      "Could not load artwork data.";

  });



// --------------------
// SEARCH BUTTON
// --------------------

searchButton.addEventListener(
  "click",
  function() {

    let month =
      document.querySelector("#month").value;

    let day =
      document.querySelector("#day").value;


    // No date selected

    if (
      month == "" ||
      day == ""
    ) {

      message.innerHTML =
        "Please choose a month and day.";

      return;
    }


    // Reset

    selectedArtwork = null;

    artworkImage = null;

    imageIsLoading = false;

    message.innerHTML = "";


    // Search JSON

    for (
      let i = 0;
      i < artworks.length;
      i++
    ) {

      if (
        artworks[i].month == month &&
        artworks[i].day == day
      ) {

        selectedArtwork =
          artworks[i];

        break;
      }

    }


    // No artwork

    if (
      selectedArtwork == null
    ) {

      message.innerHTML =
        "No artwork found for this date yet.";

      return;
    }


    // Update text

    resultBirthday.innerHTML =
      monthNames[month].toUpperCase()
      + " "
      + day;


    artTitle.innerHTML =
      selectedArtwork.title;


    artArtist.innerHTML =
      selectedArtwork.artist;


    artYear.innerHTML =
      selectedArtwork.artYear;


    // Switch page

    homePage.style.display =
      "none";

    resultPage.style.display =
      "block";


    // Load artwork image

    imageIsLoading = true;


    artworkImage = loadImage(

      selectedArtwork.image,

      function() {

        imageIsLoading = false;

        console.log(
          "Image loaded:",
          selectedArtwork.image
        );

      },

      function(error) {

        imageIsLoading = false;

        artworkImage = null;

        console.log(
          "Image failed:",
          selectedArtwork.image
        );

        console.log(error);

      }

    );

  }
);



// --------------------
// TRY AGAIN
// --------------------

tryAgainButton.addEventListener(
  "click",
  function() {

    resultPage.style.display =
      "none";

    homePage.style.display =
      "grid";

    selectedArtwork = null;

    artworkImage = null;

    imageIsLoading = false;

  }
);



// --------------------
// P5 SETUP
// --------------------

function setup() {

  let canvas =
    createCanvas(
      560,
      650
    );

  canvas.parent(
    "canvasContainer"
  );

}



// --------------------
// P5 DRAW
// --------------------

function draw() {

  // White background
  background(255);


  // Loading

  if (
    imageIsLoading == true
  ) {

    fill(140);

    noStroke();

    textAlign(
      CENTER,
      CENTER
    );

    textSize(14);

    text(
      "Loading artwork...",
      width / 2,
      height / 2
    );

    return;
  }


  // Image failed

  if (
    selectedArtwork != null &&
    artworkImage == null
  ) {

    fill(140);

    noStroke();

    textAlign(
      CENTER,
      CENTER
    );

    textSize(14);

    text(
      "Artwork image could not be loaded.",
      width / 2,
      height / 2
    );

    return;
  }


  // Nothing selected

  if (
    artworkImage == null
  ) {

    return;
  }


  // --------------------
  // FIT IMAGE
  // --------------------

  let scaleAmount = min(
    width / artworkImage.width,
    height / artworkImage.height
  );


  // Special zoom
  if (
    selectedArtwork.zoom
  ) {

    scaleAmount =
      scaleAmount *
      selectedArtwork.zoom;

  }


  let newWidth =
    artworkImage.width *
    scaleAmount;


  let newHeight =
    artworkImage.height *
    scaleAmount;


  let x =
    (width - newWidth) / 2;


  let y =
    (height - newHeight) / 2;


  // Display image

  image(
    artworkImage,
    x,
    y,
    newWidth,
    newHeight
  );

}