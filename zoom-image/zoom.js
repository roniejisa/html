class Zoom {
	constructor(el) {
		this.element = el;
		this.radius = 25;
		this.mouse;
		this.w;
		this.h;
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.element.append(this.canvas);
		this.styleCanvas();
		this.hover();
		this.blur();
	}
	styleCanvas() {
		this.element.style.position = "relative";
		Object.assign(this.canvas.style, {
			position: "absolute",
			top: 0,
			left: 0,
			zIndex: 10,
		});
	}

	hover() {
		this.element.addEventListener("mousemove", (e) => {
			const rect = this.element
				.querySelector("[zoom-main]")
				.getBoundingClientRect();
			this.canvas.height = rect.height;
			this.canvas.width = rect.width;
			this.mouse = this.mousemove(e);
			this.canvasShow();
			this.showPreview();
		});
	}
	showPreview() {
		const elDiv = document.createElement("div");
		elDiv.setAttribute("zoom-preview", "true");
		const img = this.element.querySelector("[zoom-main]");
		if (!document.body.querySelector("[zoom-preview]")) {
			const reactImage = img.getBoundingClientRect();
			Object.assign(elDiv.style, {
				width: this.canvas.width * 1.5 + "px",
				height: this.canvas.height * 1.5 + "px",
				position: "fixed",
				border: "1px solid #ebebeb",
				left: reactImage.left + reactImage.width + 15 + "px",
				top: reactImage.top + "px",
				background: `url(${img.dataset.zoom})`,
                backgroundRepeat:"no-repeat",
                backgroundSize:100 - this.radius + '%'
			});
			document.body.append(elDiv);
		}
        const elDivNew = document.body.querySelector('[zoom-preview]')
		elDivNew.style.backgroundPosition =`${this.mouse.x - this.w}px ${this.mouse.y - this.h}px`
	}
	canvasShow() {
		const posX = this.mouse.x / 2;
		const posY = this.mouse.y / 2;
		this.w = (this.canvas.width * this.radius) / 100;
		this.h = (this.canvas.height * this.radius) / 100;
		this.ctx.fillStyle = `rgba(100,100,100,0.5)`;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.clearRect(posX, posY, this.w, this.h);
		this.ctx.rect(posX, posY, this.w, this.h);
		this.ctx.strokeStyle = "green";
		this.ctx.lineWidth = 2;
		this.ctx.stroke();
		this.ctx.translate(posX, posY);
	}
	blur() {
		this.element.addEventListener("mouseleave", (e) => {
			this.canvas.height = 0;
			this.canvas.width = 0;
		});
	}

	mousemove(event) {
		var mouse = { x: 0, y: 0 };
		var reactCanvas = this.canvas.getBoundingClientRect();
		var x, y;
		console.log(reactCanvas);
		x = event.clientX - reactCanvas.left;
		y = event.clientY - reactCanvas.top;

		mouse.x = x;
		mouse.y = y;

		return mouse;
	}
}
const zoom = new Zoom(document.querySelector(".zoom"));
