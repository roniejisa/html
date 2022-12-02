"use strict";
const configDefault = {
	attrMain: "tooltip-rs",
	attrPosition: "tooltip-rs-position",
	attrIndex: "tooltip-rs-index",
};
class TooltipRS {
	constructor(config = {}) {
		this.df = { ...configDefault, ...config };
		this.run();
	}
	run() {
		const dataToolTipRS = [];
		const listTooltipRS = document.querySelectorAll(
			`[${this.df.attrMain}]`
		);
		listTooltipRS.forEach((item, index) => {
			let position = "top";
			if (
				item.hasAttribute(`${this.df.attrPosition}`) &&
				["top", "left", "right", "bottom"].includes(
					item.getAttribute(`${this.df.attrPosition}`)
				)
			) {
				position = item.getAttribute(`${this.df.attrPosition}`);
			}
			dataToolTipRS.push({
				index,
				position,
				timeOutTooltip: null,
			});

			item.onmouseenter = () => {
				if (document.querySelector(`[${this.df.attrIndex}="${index}"]`))
					return;
				clearTimeout(dataToolTipRS[index]["timeOutTooltip"]);
				const text = item.getAttribute(this.df.attrMain);
				const tooltip = document.createElement("span");
				tooltip.setAttribute(this.df.attrIndex, index);
				tooltip.insertAdjacentHTML("beforeend", text);

				Object.assign(tooltip.style, {
					position: "fixed",
					padding: "4px 10px",
					borderRadius: "4px",
					background: "rgba(0,0,0,.5)",
					color: "white",
					opacity: 0,
					zIndex: 2408,
					transition: "all 200ms",
				});

				document.body.append(tooltip);

				let { left, top, transform } = this.getDataPosition(
					item,
					tooltip,
					dataToolTipRS[index]["position"]
				);

				tooltip.style.transform = transform;
				tooltip.style.left = left + "px";
				tooltip.style.top = top + "px";

				setTimeout(() => {
					if (tooltip) {
						tooltip.style.transform = "";
						tooltip.style.opacity = "";
					}
				}, 200);
			};

			item.removeEventListener("click", removeTooltip);
			item.onmouseleave = () => removeTooltip();
			item.addEventListener("click", removeTooltip);

			var removeTooltip = () => {
				const tooltips = document.querySelectorAll(
					`[${this.df.attrIndex}="${index}"]`
				);
				for (let i = 0; i < tooltips.length; i++) {
					tooltips[i].remove();
				}
			};
		});
	}

	getDataPosition = (item, tooltip, position) => {
		let leftWithClient = item.offsetLeft;
		let topWithClient = item.offsetTop;
		const rectEl = item.getBoundingClientRect();
		const { width: widthItem, height: heightItem } = rectEl;
		const { width: widthTooltip, height: heightTooltip } =
			tooltip.getBoundingClientRect();
		// Giữa và trên
		const marginTooltip = 10;
		let left = "";
		let top = "";
		let transform = "";
		switch (position) {
			case "left":
				left = leftWithClient - widthTooltip - marginTooltip;
				top =
					topWithClient -
					window.scrollY +
					heightItem / 2 -
					heightTooltip / 2;
				transform = `translateX(-${marginTooltip * 1.5}px)`;
				break;
			case "right":
				left = leftWithClient + widthItem + marginTooltip;
				top =
					topWithClient -
					window.scrollY +
					heightItem / 2 -
					heightTooltip / 2;
				transform = `translateX(${marginTooltip * 1.5}px)`;
				break;
			case "bottom":
				left = leftWithClient + widthItem / 2 - widthTooltip / 2;
				top = topWithClient - window.scrollY + heightItem + marginTooltip;
				transform = `translateY(+${marginTooltip * 1.5}px)`;
				break;
			default:
				top = topWithClient - window.scrollY - heightItem - marginTooltip;
				left = leftWithClient + widthItem / 2 - widthTooltip / 2;
				if (top < 0) {
					top =
						topWithClient - window.scrollY + heightItem + marginTooltip;
					transform = `translateY(-${marginTooltip * 1.5}px)`;
				} else {
					transform = `translateY(${marginTooltip * 1.5}px)`;
				}
				if (left < 0) {
					left = leftWithClient + widthItem + marginTooltip;
				}
				break;
		}
		return { left, top, transform };
	};
}
window.addEventListener("DOMContentLoaded", function () {
	window["tooltipRS"] = new TooltipRS();
});

export default TooltipRS;
/**
 * Trong thẻ main sẽ thêm html
 * trong thể position sẽ thêm 1 trong các vị trí [top,left,right,bottom] mặc định là top
 *
 */
