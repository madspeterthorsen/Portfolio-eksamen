const pan = document.querySelector("#pan");
console.log(pan);
pan.classList.add("pan_animation");
pan.classList.add("stop");

pan.addEventListener("mouseover", startPanorama);
pan.addEventListener("mouseout", stopPanorama);

function startPanorama() {
  this.classList.remove("stop");
}

function stopPanorama() {
  this.classList.add("stop");
}
