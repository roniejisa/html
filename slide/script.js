const images = document.querySelectorAll(".image");
const prev = document.querySelector(".gallery .prev");
const next = document.querySelector(".gallery .next");
const close = document.querySelector(".gallery .close");
const galleryImg = document.querySelector(".gallery__inner img");
const gallery = document.querySelector(".gallery");

let currentIndex = 0;

images.forEach((image, index) => {
	image.addEventListener("click", async function () {
		currentIndex = await index;
		await checkButton();
		await showImage();
		toggleClass("show");
	});
});
next.addEventListener("click", async function () {
	currentIndex++;
	await checkButton();
	await showImage();
});

prev.addEventListener("click", async function () {
	currentIndex--;
	await checkButton();
	await showImage();
});

close.addEventListener("click", toggleClass);

gallery.addEventListener("click", function (e) {
	if (e.target !== e.currentTarget) return;
	toggleClass("hide");
});

document.addEventListener("keydown", function (e) {
	if (e.keyCode == 27) {
		toggleClass("hide");
	}
});

function toggleClass(action) {
	switch (action) {
		case "show":
			gallery.classList.add("show");
			break;
		case "hide":
			gallery.classList.remove("show");
			break;
	}
}

async function showImage() {
	galleryImg.src = await images[currentIndex].querySelector("img").src;
}

async function checkButton() {
	if (currentIndex == 0) {
		prev.animate(
			[
				{
					opacity: 0,
					pointerEvents: "none",
				},
			],
			{
				duration: 200,
				fill: "forwards",
			}
		);
	} else {
		prev.animate(
			[
				{
					opacity: 1,
					pointerEvents: "all",
				},
			],
			{
				duration: 200,
				fill: "forwards",
			}
		);
	}

	if (currentIndex == images.length - 1) {
		next.animate(
			[
				{
					opacity: 0,
					pointerEvents: "none",
				},
			],
			{
				duration: 200,
				fill: "forwards",
			}
		);
	} else {
		next.animate(
			[
				{
					opacity: 1,
					pointerEvents: "all",
				},
			],
			{
				duration: 200,
				fill: "forwards",
			}
		);
	}
}
