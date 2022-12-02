var STORAGE = (() => {
    return {
        get: function () {
            return localStorage.getItem("list")
                ? JSON.parse(localStorage.getItem("list"))
                : [];
        },
        set: function (list, item) {
            list.push({ value: item, active: true });
            localStorage.setItem("list", JSON.stringify(list));
        },
        change: function (list, key, active) {
            list[key].active = active;
            localStorage.setItem("list", JSON.stringify(list));
        },
        remove: function (list, key) {
            list.splice(key, 1);
            localStorage.setItem("list", JSON.stringify(list));
        },
    };
})();

window.addEventListener("DOMContentLoaded", function () {
    const content = document.querySelector(".content ul");
    const input = document.querySelector("input");

    const list = STORAGE.get();
    function createContent() {
        content.innerHTML = list
            .map((item) => {
                return `<li>
            <p class="${item.active ? "" : "line-through"}">${item.value}</p>
            <button type="button">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </li>`;
            })
            .join("");
        checkDone();
        removeItem();
    }

    createContent();

    function checkDone() {
        const pElement = content.querySelectorAll("li p");
        pElement.forEach((p, key) => {
            p.ondblclick = function () {
                if (p.classList.contains("line-through")) {
                    STORAGE.change(list, key, true);
                } else {
                    STORAGE.change(list, key, false);
                }
                p.classList.toggle("line-through");
            };
        });
    }

    function removeItem() {
        const removeBtn = content.querySelectorAll("li button");
        removeBtn.forEach(
            (button, key) =>
                (button.onclick = () => {
                    STORAGE.remove(list, key);
                    button.closest("li").remove();
                    createContent();
                })
        );
    }

    function typeAndEnter() {
        input.onkeydown = function (e) {
            if (e.key === "Enter") {
                if (e.target.value.trim() == "") return;
                STORAGE.set(list, e.target.value);
                e.target.value = "";
                createContent();
            }
        };
    }
    typeAndEnter();
});
