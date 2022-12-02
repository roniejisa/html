class GalleryFile {
	constructor(element) {
		this.element = element;
		this.fileDrag;
		this.width;
		this.height;
		this.files = [];
		this.onChange();
	}

	onChange() {
		this.element.addEventListener("change", async (event) => {
			await this.uploadFile(event);
		});
	}

	async uploadFile(event) {
		const listImageNew = Array.from(event.target.files);
		this.files = await [...this.files, ...listImageNew];

		await this.pasteIntoGallery(listImageNew);
		await this.onDragable();
		await this.sortList();
		this.pushOldFile();
	}

	async pushOldFile() {
		var dataTranfer = new DataTransfer();
		for await (const file of this.files) {
			dataTranfer.items.add(file);
		}
		this.element.files = dataTranfer.files;
	}

	async pasteIntoGallery(list) {
		const gallery = document.querySelector(
			`[gallery-of="${this.element.name}"]`
		);
		list.forEach((file) => {
			const divImage = document.createElement("div");
			divImage.className = "rsgi";
			const image = URL.createObjectURL(file);
			Object.assign(divImage.style, {
				backgroundImage: `url(${image})`,
				paddingBottom: `50%`,
				backgroundSize: `cover`,
				backgroundRepeat: `no-repeat`,
				backgroundPosition: `center`,
			});
			gallery.append(divImage);
		});
	}

	async sortList() {
		const gallery = document.querySelector(
			`[gallery-of="${this.element.name}"]`
		);
		if (!gallery) return;
		const listImage = gallery.querySelectorAll(".rsgi");
		listImage.forEach((item, index) =>
			item.setAttribute("data-sort", index)
		);
	}

	async onDragable() {
		const gallery = document.querySelector(
			`[gallery-of="${this.element.name}"]`
		);
		const spanImages = gallery.querySelectorAll("div.rsgi");
		spanImages.forEach((item) => {
			item.draggable = true;
			item.addEventListener("dragstart", (event) =>
				this.dragStart(event)
			);
			item.addEventListener("dragend", (event) =>
				this.dragEnd(event)
			);
			item.addEventListener("dragover", (event) =>
				this.dragOver(event)
			);
			// item.addEventListener("dragenter", (event) =>
			// 	this.dragEnter(event)
			// );
			// item.addEventListener("dragleave", (event) =>
			// 	this.dragLeave(event)
			// );
			item.addEventListener("drop", (event) => this.dragDrop(event));
			item.addEventListener("dblclick", () => this.deleteFile(item));
		});
	}

	async deleteFile(item) {
		item.remove();
		this.sortOrDelete();
		this.pushOldFile();
	}

	dragOver(event) {
		event.preventDefault();
		if (event.target != this.fileDrag) {
			const calculator =
				event.clientX / event.target.offsetWidth -
				Math.floor(event.clientX / event.target.offsetWidth);
			if (calculator < 0.5) {
				event.target.parentNode.insertBefore(
					this.fileDrag,
					event.target
				);
			} else {
				event.target.parentNode.insertBefore(
					this.fileDrag,
					event.target.nextSibling
				);
			}
		}
	}

	dragDrop(event) {
		event.preventDefault();
		this.sortOrDelete();
	}

	sortOrDelete() {
		const gallery = document.querySelector(
			`[gallery-of="${this.element.name}"]`
		);
		if (!gallery) return;

		const listImage = gallery.querySelectorAll(".rsgi");
		//Sau khi di chuyển hoàn tất thì lấy lại dữ liệu của các phần tử trong mảng và gắn vào mảng mới
		const arraySort = Array.from(listImage).map((item) =>
			item.getAttribute("data-sort")
		);
		//Tạo lại mảng file sắp xếp theo thứ tự vừa di chuyển
		this.files = arraySort.reduce((files, current) => {
			files.push(this.files[current]);
			return files;
		}, []);
		// Sắp xếp lại mảng file cho đúng thứ tự
		this.sortList();
		console.log(this.files);
	}

	dragStart(event) {
		this.fileDrag = event.target;
		const image = this.fileDrag.getBoundingClientRect();
		this.width = image.width;
		this.height = image.height;
		this.fileDrag.classList.add("dragging");
	}

	dragEnd(event) {
		this.fileDrag?.classList?.remove("dragging");
		this.fileDrag = null;
	}
}

window.addEventListener("DOMContentLoaded", function () {
	document.querySelectorAll("input[type=file]").forEach((item) => {
		new GalleryFile(item);
	});
});

document.querySelector("form").onsubmit = (e) => {
	e.preventDefault();
	elForm = e.target;
	if (!elForm instanceof Element) return;
	var formData = new FormData(elForm);
	var request = new XMLHttpRequest();
	request.open("POST", "http://foo.com/submitform.php");
	request.send(formData);
};
