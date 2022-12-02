let DA = {
	attrMain: "tab-rs",
	attrTarget: "tab-rs-target",
	attrTargetShow: "tab-rs-target-show",
	attrMainShow: "tab-rs-show",
	arrClassHidden: [
		"opacity-0",
		"invisible",
		"h-0",
		"pointer-events-none",
		"translate-y-[15px]",
	],
};

class TabRS {
	constructor(configs = {}) {
		this.df = { ...DA, ...configs };
		this.mainNode = [
			...document.querySelectorAll(`[${this.df.attrMain}]`),
		];
		this.targetNode = [
			...document.querySelectorAll(`[${this.df.attrTarget}]`),
		];
		this.init();
	}

	init = () => {
		this.first();
		this.handleClick();
	};

	first = () => {
		const elMainShow = this.mainNode.filter((el) =>
			el.hasAttribute(this.df.attrMainShow)
		);
		if (!elMainShow[0]) return;
		this.removeClassHidden(elMainShow[0]);
	};

	handleClick = () => {
		for (let a = 0; a < this.targetNode.length; a++) {
			this.targetNode[a].onclick = () => {
				if (this.targetNode[a].hasAttribute(this.df.attrTargetShow))
					return;
				// Kiểm tra nội dung được hiển thị
				const noteCheck = this.mainNode.map((el) => {
					if (
						el.getAttribute(this.df.attrMain) ==
						this.targetNode[a].getAttribute(this.df.attrTarget)
					) {
						return {
							el,
							isShow: true,
						};
					} else {
						return {
							el,
							isShow: false,
						};
					}
				});
				// Thêm thuộc tính
				for (let b = 0; b < noteCheck.length; b++) {
					noteCheck[b].isShow
						? this.removeClassHidden(noteCheck[b].el)
						: this.addClassHidden(noteCheck[b].el);
				}
				// Thêm attribute show cho button
				for (let c = 0; c < this.targetNode.length; c++) {
					a == c
						? !this.targetNode[c].hasAttribute(this.df.attrTargetShow) &&
						  this.targetNode[c].setAttribute(this.df.attrTargetShow, "")
						: this.targetNode[c].hasAttribute(this.df.attrTargetShow) &&
						  this.targetNode[c].removeAttribute(this.df.attrTargetShow);
				}
			};
		}
	};

	removeClassHidden = async (el) => {
		var indexHidden = this.df.arrClassHidden.length;
		while (indexHidden--) {
			let classCurrent = this.df.arrClassHidden[indexHidden];
			el.classList.contains(classCurrent) &&
				el.classList.remove(classCurrent);
		}
		window.dispatchEvent(new CustomEvent("tab.rs.hidden"), {
			detail: {
				node: el,
			},
		});
	};

	addClassHidden = async (el) => {
		var indexHidden = this.df.arrClassHidden.length;
		while (indexHidden--) {
			let classCurrent = this.df.arrClassHidden[indexHidden];
			!el.classList.contains(classCurrent) &&
				el.classList.add(classCurrent);
		}

		window.dispatchEvent(new CustomEvent("tab.rs.show"), {
			detail: {
				node: el,
			},
		});
	};
}

window.addEventListener("DOMContentLoaded", function () {
	window["tabRS"] = new TabRS();
});

export default TabRS;
