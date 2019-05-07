// const learnMoreButton = document.getElementById("learnMore");
// const goBackButton = document.getElementById("goBack");
const slider = document.getElementById("slider");

// learnMoreButton.addEventListener("click", () => {
//   slider.classList.add("right-panel-active");
// });

// goBackButton.addEventListener("click", () => {
//   slider.classList.remove("right-panel-active");
// });

// $(".LearnMore").click(function() {
//   alert("Hello");
// });

var learnMoreButtons = document.querySelectorAll(".learnMore");
var goBackButtons = document.querySelectorAll(".goBack");
var sliders = document.querySelectorAll(".slider");

for (var i = 0; i < learnMoreButtons.length; i++) {
  learnMoreButtons[i].addEventListener("click", function(event) {
    for (var i = 0; i < sliders.length; i++) {
      sliders[i].classList.add("right-panel-active");
    }
  });
}

for (var i = 0; i < goBackButtons.length; i++) {
  goBackButtons[i].addEventListener("click", function(event) {
    for (var i = 0; i < sliders.length; i++) {
      sliders[i].classList.remove("right-panel-active");
    }
  });
}


// for (var i = 0; i < sliders.length; i++) {
//   sliders[i].classList.add("right-panel-active");
// }