class couterRun {
	constructor(options) {
		this.listCounter =
			"attribute" in options
				? document.querySelectorAll(`[${options.attribute}]`)
				: [];
		if (this.listCounter.length == 0) return;
		this.attributeShow =
			"attributeShow" in options &&
			options.attributeShow &&
			"counter-show";
		this.time = "time" in options ? options.time : 1000;
		this.count = "count" in options ? options.count : 0;
		this.listCount = {};
		this.watchEl = this.listCounter[0];
		this.runAgain = "runAgain" in options ? options.runAgain : true;
		this.isRun = true;
		this.countElement();
	}

	countElement = () => {
		const io = new IntersectionObserver((entries) => {
			entries.forEach(async (entry) => {
				if (entry.isIntersecting && this.isRun) {
					this.isRun = false;
					this.listCounter.forEach((item, key) => {
						this.listCount[key] = this.count;
						const element = item.querySelector(
							`[${this.attributeShow}]`
						);
						const to = Number(element.innerText);
						let step = to / this.time;
						let counting = setInterval(() => {
							this.listCount[key] += step;
							if (this.listCount[key] > to) {
								clearInterval(counting);
								element.innerText = to;
								this.isRun = this.runAgain;
							} else {
								element.innerText = Math.round(
									this.listCount[key]
								);
							}
						});
					});
				}
			});
		});
		io.observe(this.watchEl);
	};
}

new couterRun({
	time: 10000,
	attribute: "counter",
	attributeShow: "counter-show",
});