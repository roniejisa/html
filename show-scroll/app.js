var rsScroll = document.querySelectorAll("[sos]");
document.body.style.overflowX = "hidden";
window.onscroll = function (e) {
    // Lây dữ liệu của khối
    rsScroll.forEach((item) => {
        toggleAnimationOnScroll(item);
    });
};

function toggleAnimationOnScroll(element) {
    element.getClientRects();
    var rect = element.getClientRects()[0];
    var heightScreen = window.innerHeight;
    // Check Element có ở trong mà hình không
    if (rect.bottom < 0 || rect.top > heightScreen) {
        element.classList.remove("start");
    } else {
        element.classList.add("start");
    }
}
