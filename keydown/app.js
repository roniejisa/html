const eKey = document.querySelector(".key");
const eLocation = document.querySelector(".location");
const eWhich = document.querySelector(".which");
const eCode = document.querySelector(".code");
const result = document.querySelector(".result");
const box = document.querySelector(".box");
const divAlert = document.querySelector(".alert");

window.addEventListener("keydown", function (e) {
    if (box.classList.contains('hide')) {
        divAlert.classList.add('hide');
        box.classList.remove('hide');
    }
	result.innerText = e.code;
	eWhich.innerText = e.which;
	eCode.innerText = e.code;
	eLocation.innerText = e.location;
	eKey.innerText = e.key;
});
