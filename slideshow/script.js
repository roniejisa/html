var SLIDESHOW = (function () {
    const preview = document.querySelector(".preview");
    const next = document.querySelector(".next");
    const prev = document.querySelector(".prev");
    const img = preview.querySelector("img");
    let currentItem = 0;
    let time = 5000;
    let auto = true;
    let autoBy = "NEXT";
    let position = "CENTER";
    const listItems = document.querySelectorAll(".list .image");

    next.onclick = function () {
        updateCurrentIndex("NEXT");
        updatePreview("LEFT");
    };

    prev.onclick = function () {
        currentItem--;
        updateCurrentIndex("PREV");
        updatePreview("RIGHT");
    };

    listItems.forEach((item, index) => {
        item.onclick = () => {
            currentItem = index;
            updatePreview();
        };
    });
    function updateCurrentIndex(type = autoBy) {
        if (type == "NEXT") {
            currentItem++;
            if (currentItem > listItems.length - 1) {
                currentItem = 0;
            }
        } else {
            if (currentItem < 0) {
                currentItem = listItems.length - 1;
            }
        }
    }

    function updatePreview(position = "CENTER") {
        listItems.forEach((item) => {
            item.classList.remove("active");
        });
        listItems[currentItem].classList.add("active");
        img.src = listItems[currentItem].querySelector("img").src;
        img.animate(
            [
                {
                    transform: position == "CENTER" ? "scale(0.9)" : position == "LEFT" ? "translateX(-100%)" : "translateX(100%)",
                },
                {
                    transform: position == "CENTER" ? "scale(1)" : "translateX(0)",
                },
            ],
            {
                duration: 300,
                easing: "ease-in-out",
                fill: "forwards",
            }
        );
    }

    if (auto) {
        setInterval(function () {
            updateCurrentIndex(autoBy);
            updatePreview(position);
        }, time);
    }
})();
