"use strict";
function bindToNode(node, namePush, fn) {
	node[namePush] = fn.bind(node);
}
const defaultConfig = {
	attrTarget: "modal-rs-target",
	attrMain: "modal-rs",
	attrMainShow: "modal-rs-show",
	attrClose: "modal-rs-close",
	attrNotClickOutside: "modal-rs-not-click-outside",
	arrClassHidden: ["invisible", "pointer-events-none", "opacity-0"],
};
class ModalRS {
	constructor(config = {}) {
		this.df = { ...defaultConfig, ...config };
		this.run();
	}
	addMethodForModal = () => {
		for (let a = 0; a < this.listModalNode.length; a++) {
			bindToNode(this.listModalNode[a], "show", () =>
				this.handleShowModal(this.listModalNode[a])
			);
			bindToNode(this.listModalNode[a], "hide", () =>
				this.handleHiddenModal(this.listModalNode[a])
			);
			if (this.listModalNode[a].hasAttribute(this.df.attrMainShow)) {
				this.listModalNode[a].show();
			}
		}
	};
	showModal = () => {
		for (let i = 0; i < this.listButtonNode.length; i++) {
			this.listButtonNode[i].style.cursor = "pointer";
			this.listButtonNode[i].onclick = (e) => {
				const modalRS = document.querySelector(
					`[${this.df.attrMain}="${this.listButtonNode[i].getAttribute(
						this.df.attrTarget
					)}"]`
				);
				e.preventDefault();
				modalRS
					? this.handleShowModal(modalRS, this.listButtonNode[i])
					: console.error("No Modal Selector 💥");
			};
		}
	};
	hiddenModal = () => {
		for (let i = 0; i < this.listModalNode.length; i++) {
			this.listModalNode[i].onclick = (e) => {
				e.stopPropagation();
				if (
					e.target.hasAttribute(this.df.attrClose) ||
					((e.target.hasAttribute(this.df.attrMain) ||
						e.target.closest(`[${this.df.attrClose}]`) != null) &&
						!this.listModalNode[i].hasAttribute(
							this.df.attrNotClickOutside
						))
				) {
					this.handleHiddenModal(this.listModalNode[i]);
				}
			};
		}
	};
	handleShowModal = (modalRS, target = null) => {
		this.df.arrClassHidden.forEach(
			(strClass) =>
				modalRS.classList.contains(strClass) &&
				modalRS.classList.remove(strClass)
		);
		document.body.style.overflow = "hidden";
		window.dispatchEvent(
			new CustomEvent("shown.modal.rs", {
				bubbles: true,
				detail: { id: modalRS.id, target: target, modal: modalRS },
			})
		);
		this.hiddenModal();
	};
	handleHiddenModal = (modalRS) => {
		this.df.arrClassHidden.forEach(
			(strClass) =>
				!modalRS.classList.contains(strClass) &&
				modalRS.classList.add(strClass)
		);
		document.body.style.overflow = "";
		window.dispatchEvent(
			new CustomEvent("hidden.modal.rs", { detail: { modal: modalRS } })
		);
	};
	run = () => {
		this.listModalNode = document.querySelectorAll(
			`[${this.df.attrMain}]`
		);
		this.listButtonNode = document.querySelectorAll(
			`[${this.df.attrTarget}]`
		);
		this.addMethodForModal();
		this.showModal();
		this.hiddenModal();
	};
}
window["modalRS"] = window["rsModal"] = window["MODAL_RS"] = new ModalRS();
export default ModalRS;