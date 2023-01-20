let inputValue = document.getElementById("shieldId");
inputValue.addEventListener("change", function () {
  if (inputValue.checked) 
      localStorage.setItem("shield", true);
});



// let inputValue = document.getElementById("shieldId");
// inputValue.addEventListener("change", function () {
//   console.log(inputValue.checked)
// });