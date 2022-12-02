const optionsDefault = {
	classOneImage: "upload__img-box",
	classOneClose: "upload__img-close",
	attribute: "gallery-of",
	maxFileAttribute: "max-file",
	maxFileSizeAttribute: "max-size",
	defaultMaxFile: Infinity,
	defaultMaxSizeAttribute: 10240000,
};

export default class changeMultipleImage {
	constructor(options, isLoadFileOld = false) {
		options = { ...optionsDefault, ...options };
		this.check = "element" in options && "attribute" in options;
		if (!this.check) {
			alert("Nhập tên Element chứa Input và Attribute của Gallery");
			return;
		}
		this.classOneImage = options.classOneImage;
		this.classOneClose = options.classOneClose;
		this.element = options.element;
		this.attribute = options.attribute;
		this.arrayClass = this.element
			.getAttribute("data-class")
			.split(" ");
		this.oldFiles = [];
		this.oldURL = {};
		this.maxFile =
			this.element.getAttribute(`${options.maxFileAttribute}`) ??
			options.defaultMaxFile;
		this.maxFileSize =
			this.element.getAttribute(`${options.maxFileSizeAttribute}`) ??
			options.defaultMaxSizeAttribute; /* 10 MB */
		this.findPreviewBox();
		this.initInputUpload();
		if (isLoadFileOld) {
			this.pushFileOld();
		}
	}

	findPreviewBox = () => {
		this.uploadImageInput = this.element.querySelector("input");
		this.previewImageBox = document.querySelector(
			`[ ${this.attribute}="${this.uploadImageInput.name.replace(
				"[]",
				""
			)}"]`
		);
		this.listImage = this.previewImageBox.getElementsByClassName(
			this.classOneImage
		);
	};

	initInputUpload = () => {
		if (!this.uploadImageInput) return;
		this.uploadImageInput.addEventListener("change", async (event) => {
			var files = Array.from(event.target.files);
			var filesArr = [];
			for (const file of files) {
				this.validateFileUpload(file) && filesArr.push(file);
			}
			var fileBuffer = new DataTransfer();
			[...Array.from(this.oldFiles), ...filesArr].forEach((file) =>
				fileBuffer.items.add(file)
			);
			var fileFinals = fileBuffer.files;
			this.uploadImageInput.files = fileFinals;
			this.oldFiles = fileFinals;
			this.updateFileList(filesArr);
		});
	};

	validateFileUpload = (file) => {
		if (this.oldFiles.length >= this.maxFile) {
			console.log(
				`Đã vượt qua số lượng file tối đa ${this.maxFile}!`
			);
			return false;
		}
		if (!file.type.match("image.*")) {
			console.log(`Tệp ${file.name} không phải là hình ảnh!`);
			return false;
		}
		if (file.size > this.maxFileSize) {
			console.log(
				`Tệp ${file.name}: ${this.humanFileSize(
					file.size
				)} đã vượt quá dung lượng tối đa ${this.humanFileSize(
					this.maxFileSize
				)}!`
			);
			return false;
		}

		if (
			!Array.from(this.oldFiles).some(
				(item) => item.name == file.name
			)
		) {
			return true;
		}
		return false;
	};

	updateFileList = async (files) => {
		var filesArr = Array.from(files);
		for (const file of filesArr) {
			var image = window.URL.createObjectURL(file);
			const elementImagePreview = document.createElement("div");
			elementImagePreview.classList.add(
				this.classOneImage,
				...this.arrayClass
			);
			elementImagePreview.innerHTML = `<div class="img-bg">
                                                <div class="c-img">
                                                    <img src="${image}" alt="" class="img-fluid">
                                                </div>
                                            </div>`;

			const elementRemovePreview = document.createElement("div");
			elementRemovePreview.classList.add(this.classOneClose);
			elementRemovePreview.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>`;
			elementRemovePreview.setAttribute("data-file", file.name);
			elementRemovePreview.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				this.removeFile(file.name, file.size, file.lastModified);
				window.URL.revokeObjectURL(
					elementRemovePreview
						.closest(".img-bg")
						.querySelector("img").src
				);
				elementRemovePreview
					.closest(`.${this.classOneImage}`)
					.remove();
				this.sortList();
			});
			elementImagePreview
				.querySelector(".img-bg")
				.appendChild(elementRemovePreview);
			if (this.previewImageBox) {
				if (!this.element.hasAttribute("has-file")) {
					this.element.setAttribute("has-file", true);
				}
				this.previewImageBox.appendChild(elementImagePreview);
			}
		}
		await this.onDragable();
		await this.sortList();
	};

	pushFileOld = async () => {
		var fileBuffer = new DataTransfer();
		for await (const box of this.listImage) {
			const img = box.querySelector("img");
			const file = this.dataURLtoFile(img.src, img.title);
			fileBuffer.items.add(file);
			const deleteEl = box.querySelector(`${this.classOneClose}`);
			deleteEl.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				this.removeFile(file.name, file.size, file.lastModified);
				box.remove();
				this.sortList();
			});
		}
		this.oldFiles = fileBuffer.files;
		this.uploadImageInput.files = this.oldFiles;
		return true;
	};

	removeFile = async (name, size, lastModified) => {
		var fileBuffer = new DataTransfer();
		Array.from(this.uploadImageInput.files)
			.filter(
				(item) =>
					item.name != name &&
					item.size != size &&
					item.lastModified != lastModified
			)
			.forEach((file) => fileBuffer.items.add(file));
		this.uploadImageInput.files = fileBuffer.files;
		this.oldFiles = fileBuffer.files;
		if (
			this.uploadImageInput.files.length == 0 &&
			this.element.hasAttribute("has-file")
		) {
			this.element.removeAttribute("has-file");
		}
	};

	sortList = async () => {
		[this.previewImageBox, this.listImage] = this.getBoxAndListImage();
		for (var i = 0; i < this.listImage.length; i++) {
			this.listImage[i].setAttribute("data-sort", i);
		}
	};

	getBoxAndListImage = () => {
		const box = document.querySelector(
			`[ ${this.attribute}="${this.uploadImageInput.name.replace(
				"[]",
				""
			)}"]`
		);

		const list = box.querySelectorAll(`.${this.classOneImage}`);

		return [box, list];
	};
	onDragable = async () => {
		this.previewImageBox = document.querySelector(
			`[ ${this.attribute}="${this.uploadImageInput.name.replace(
				"[]",
				""
			)}"]`
		);
		this.listImage = this.previewImageBox.querySelectorAll(
			`.${this.classOneImage}`
		);
		for (const item of this.listImage) {
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
			item.addEventListener("drop", (event) => this.dragDrop(event));
		}
	};

	dragOver = (event) => {
		event.preventDefault();
		if (event.target != this.fileDrag && this.fileDrag != undefined) {
			const calculator =
				event.clientX /
					event.target.closest(`.${this.classOneImage}`)
						.offsetWidth -
				Math.floor(
					event.clientX /
						event.target.closest(`.${this.classOneImage}`)
							.offsetWidth
				);
			if (calculator < 0.5) {
				event.target
					.closest(`.${this.classOneImage}`)
					.parentNode.insertBefore(
						this.fileDrag,
						event.target.closest(`.${this.classOneImage}`)
					);
			} else {
				event.target
					.closest(`.${this.classOneImage}`)
					.parentNode.insertBefore(
						this.fileDrag,
						event.target.closest(`.${this.classOneImage}`)
							.nextSibling
					);
			}
		}
		this.sortOrDelete();
	};

	dragDrop = (event) => {
		event.preventDefault();
	};

	sortOrDelete = () => {
		this.previewImageBox = document.querySelector(
			`[ ${this.attribute}="${this.uploadImageInput.name.replace(
				"[]",
				""
			)}"]`
		);
		this.listImage = this.previewImageBox.querySelectorAll(
			`.${this.classOneImage}`
		);

		const arraySort = Array.from(this.listImage).map((item) =>
			item.getAttribute("data-sort")
		);
		//Tạo lại mảng file sắp xếp theo thứ tự vừa di chuyển
		const files = arraySort.reduce((files, current) => {
			files.push(this.uploadImageInput.files[current]);
			return files;
		}, []);
		var fileBuffer = new DataTransfer();
		files.forEach((file) => fileBuffer.items.add(file));
		this.uploadImageInput.files = fileBuffer.files;
		this.oldFiles = fileBuffer.files;
		// Sắp xếp lại mảng file cho đúng thứ tự
		this.sortList();
	};

	dragStart = (event) => {
		this.fileDrag = event.target.classList.contains(this.classOneImage)
			? event.target
			: event.target.closest(`.${this.classOneImage}`);
		const image = this.fileDrag.getBoundingClientRect();
		this.width = image.width;
		this.height = image.height;
		this.fileDrag.classList.add("dragging");
	};

	dragEnd = (event) => {
		this.fileDrag?.classList?.remove("dragging");
		this.fileDrag = null;
	};

	humanFileSize = async (B, i = true) => {
		var e = i ? 1e3 : 1024;
		if (Math.abs(B) < e) return B + " B";
		var a = i
				? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
				: ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
			t = -1;
		do (B /= e), ++t;
		while (Math.abs(B) >= e && t < a.length - 1);
		return B.toFixed(1) + " " + a[t];
	};

	dataURLtoFile = (base64, filename) => {
		var arr = base64.split(","),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return new File([u8arr], filename, {
			type: mime,
		});
	};
}
