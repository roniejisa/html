const process = document.querySelector(".process");
const range = document.querySelector(".range");

range.addEventListener("mousemove", function (e) {
    const processWidth = e.pageX - this.offsetLeft;
    var percent = Math.round((processWidth / this.offsetWidth) * 100);
    updatePercent(percent);
});

function updatePercent(percent) {
    process.style.width = percent + "%";
    process.querySelector("span").innerHTML = percent + "%";
    document.body.setAttribute("style", `background:rgba(0,0,0,${percent / 100})`);
}
