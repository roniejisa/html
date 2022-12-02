class chooseAndDragImage {
	constructor(element, configs = {}) {
		this.selectIndex = null;
		this.applyPosition = [];
		this.configs = configs;
		this.element = element;
		this.fileList = new DataTransfer();
		this.listImage = this.element.getElementsByClassName("upload");
		this.input = this.element.querySelector("input");
		this.listItems = [];
		this.init();
	}

	init = () => {
		Array.from(this.listImage).forEach((item) => {
			item.onclick = (e) => {
				this.selectIndex = item.dataset.position;
			};
		});

		this.input.onchange = async (e) => {
			if (e.target.files.length == 0) {
				return (this.input.files = this.fileList.files);
			}
			this.fileList = new DataTransfer();

			const newFile = await this.validateFile(e.target.files);

			[...this.listItems, ...newFile].forEach((file) =>
				this.fileList.items.add(file)
			);
			// this.listItems = await [...this.listItems, ...newFile];

			this.input.files = await this.fileList.files;
			this.listItems = await Array.from(this.fileList.files);
			await this.pushImage(newFile);
			await this.onDragable();
		};
	};

	removeFileOld = async (newFile) => {
		let indexOld = undefined;
		this.listItems.forEach((item, index) => {
			const elementChoose = Array.from(this.listImage)
				.find((item) => item.dataset.position == this.selectIndex)
				.querySelector("label .image-preview");
			if (
				elementChoose &&
				item.name == elementChoose.title &&
				item.size == elementChoose.dataset.size &&
				!newFile.some(
					(file) =>
						item.name == file.name && item.size == file.size
				)
			) {
				indexOld = index;
			}
		});
		if (indexOld !== undefined) {
			this.listItems = this.listItems.filter(
				(item, index) => index != indexOld
			);
		}
	};

	pushImage = async (newFile) => {
		let count = 0;
		for await (const file of newFile) {
			const image = window.URL.createObjectURL(file);
			const box = Array.from(this.listImage)
				.find(
					(item) =>
						item.dataset.position == this.applyPosition[count]
				)
				.querySelector("label");
			const select = document.createElement("div");
			select.className = "image-preview";
			select.title = file.name;
			select.dataset.size = file.size;
			const divAction = document.createElement("div");
			divAction.className = "image-action";
			const removeButton = document.createElement("button");
			removeButton.innerHTML =
				'<i class="fa-solid fa-trash-can"></i>';
			divAction.append(removeButton);
			select.append(divAction);
			select.setAttribute("style", `background-image:url(${image})`);
			if (box.querySelector(".image-preview")) {
				box.querySelector(".image-preview").remove();
			}
			box.append(select);
			select.onclick = (e) => {
				e.preventDefault();
				e.stopPropagation();
			};

			removeButton.onclick = this.removeItem;
			count++;
		}
	};

	removeItem = (e) => {
		const itemPreview = e.target.closest(".image-preview");
		this.fileList = new DataTransfer();

		this.listItems = this.listItems.filter(
			(item, index) =>
				item.name != itemPreview.title &&
				itemPreview.dataset.size != item.size
		);

		this.listItems.forEach((item) => this.fileList.items.add(item));
		this.input.files = this.fileList.files;
		itemPreview.remove();
	};

	validateFile = async (listItems) => {
		let newFile = Array.from(listItems);
		await this.removeFileOld(newFile);
		this.applyPosition = [];
		let number = 0;
		newFile.forEach((file) => {
			if (
				this.listItems.some(
					(item) =>
						item.name == file.name && item.size == file.size
				)
			) {
				number += 1;
			}
		});
		if (number > 0) {
			eval(`${this.configs.notify}`)(
				100,
				`Có ${number} file bị trùng`
			);
		}
		newFile = newFile.filter((file) => {
			return !this.listItems.some((item) => {
				return item.name == file.name && item.size == file.size;
			});
		});

		let numberFile = 0;

		if (
			this.listItems.length + newFile.length >
			Array.from(this.listImage).length
		) {
			eval(`${this.configs.notify}`)(
				100,
				`Không thể vượt quá ${this.listImage.length} files`
			);

			// Tình phần đang bị thừa
			numberFile =
				newFile.length -
				(Array.from(this.listImage).length -
					this.listItems.length);
		}

		// Tìm vị trí hiện tại đã có ảnh để không thêm vào
		var checkPositionHasImage = Array.from(this.listImage).map(
			(item) => (item.querySelector(".image-preview") ? true : false)
		);

		checkPositionHasImage.forEach((item, index) => {
			if (
				this.selectIndex == index ||
				(index > this.selectIndex && !item)
			) {
				this.applyPosition.push(index);
			}
		});

		// Nếu độ dài của ảnh lớn hơn - vị trí chọn hiện tại nhỏ hơn số lượng file tải lên thì số file cần bỏ đi bằng số lươn
		if (
			Array.from(this.listImage).length > newFile.length &&
			Array.from(this.listImage).length - this.selectIndex <
				newFile.length
		) {
			numberFile +=
				newFile.length -
				(Array.from(this.listImage).length - this.selectIndex);
		}
		newFile = newFile.splice(0, newFile.length - numberFile);

		numberFile = 0;
		if (this.applyPosition.length < newFile.length) {
			numberFile = newFile.length - this.applyPosition.length;
		}
		newFile = newFile.splice(0, newFile.length - numberFile);
		return newFile;
	};

	onDragable = async () => {
		Array.from(this.listImage).forEach((item) => {
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
			item.addEventListener("dragenter", (event) =>
				this.dragEnter(event)
			);
			// item.addEventListener("dragleave", (event) =>
			// 	this.dragLeave(event)
			// );
			item.addEventListener("drop", (event) => this.dragDrop(event));
			item.addEventListener("dblclick", () => this.deleteFile(item));
		});
	};

	dragOver = (event) => {
		event.preventDefault();
		if (event.target.closest(".upload") != this.fileDrag) {
			const calculator =
				event.clientX /
					event.target.closest(".upload").offsetWidth -
				Math.floor(
					event.clientX /
						event.target.closest(".upload").offsetWidth
				);
			if (calculator < 0.5) {
				event.target
					.closest(".upload")
					.parentNode.insertBefore(
						this.fileDrag,
						event.target.closest(".upload")
					);
			} else {
				event.target
					.closest(".upload")
					.parentNode.insertBefore(
						this.fileDrag,
						event.target.closest(".upload").nextSibling
					);
			}
		}
	};

	dragDrop = (event) => {
		event.preventDefault();
		event.target
			.closest(".upload")
			.querySelector("label")
			.removeAttribute("style");
		this.sortOrDelete();
	};

	dragLeave(event) {
		event.target
			.closest(".upload")
			.querySelector("label")
			.removeAttribute("style");
	}

	sortOrDelete = () => {
		//Tạo lại mảng file sắp xếp theo thứ tự vừa di chuyển
		this.listItems = Array.from(this.listImage)
			.filter((item) => item.querySelector(".image-preview"))
			.reduce((files, current) => {
				const imagePreview =
					current.querySelector(".image-preview");
				const file = this.listItems.find((file) => {
					return (
						file.name == imagePreview.title &&
						imagePreview.dataset.size == file.size
					);
				});
				files.push(file);
				return files;
			}, []);
		// Sắp xếp lại mảng file cho đúng thứ tự
		this.sortList();
	};

	async sortList() {
		Array.from(this.listImage).forEach((item, index) =>
			item.setAttribute("data-position", index)
		);
	}

	dragEnter(event) {
		event.target
			.closest(".upload")
			.querySelector("label").style.borderColor = "green";
	}

	dragStart = (event) => {
		this.fileDrag = event.target;
		const image = this.fileDrag.getBoundingClientRect();
		this.width = image.width;
		this.height = image.height;
		this.fileDrag.classList.add("dragging");
	};

	dragEnd = (event) => {
		this.fileDrag?.classList?.remove("dragging");
		this.fileDrag = null;
	};
}

new chooseAndDragImage(document.querySelector(".upload_imgs"));
