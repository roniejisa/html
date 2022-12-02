const defaultOption = {
	attributeMain: "[main-otp-rs]",
	classSub: "sub-otp-rs",
	autoSubmit: false,
};

class OTP {
	constructor(
		element,
		options = {
			...defaultOption,
		}
	) {
		this.default = {
			...defaultOption,
			...options,
		};

		this.element = element;
		this.autoSubmit = this.default.autoSubmit;
		this.main = this.element.querySelector(this.default.attributeMain);
		this.subs = this.element.getElementsByClassName(
			this.default.classSub
		);
	}

	start = () => {
		Array.from(this.subs).forEach((input, key) => {
			input.onpaste = async (e) => {
				e.preventDefault();
				let paste = (
					e.clipboardData || window.clipboardData
				).getData("text");
				const string = paste.replace(/[^\w\s]/gi, "").split("");
				string.length > 0 &&
					string.forEach((text, keySub) => {
						const inputSub = this.subs[keySub];
						if (keySub < this.subs.length) {
							inputSub.value = text;
							if (keySub == this.subs.length - 1) {
								inputSub.focus();
							}
						}
					});
				this.end();
			};

			input.onkeydown = async (e) => {
				let inputForcus;
				if (e.ctrlKey && e.keyCode == 86) {
					return false;
				}
				e.preventDefault();
				if (
					(e.keyCode > 47 && e.keyCode < 58) ||
					(e.keyCode > 64 && e.keyCode < 91)
				) {
					input.value = event.key;
				}

				if (e.keyCode == 8 && input.value != "") {
					input.value = "";
				} else if (e.keyCode == 8 && key > 0) {
					inputForcus = this.subs[key - 1];
					inputForcus.value = "";
					inputForcus.focus();
				} else if (e.keyCode == 9) {
					if (key <= this.subs.length - 2) {
						inputForcus = this.subs[key + 1];
					} else {
						inputForcus = this.subs[0];
					}
					inputForcus.focus();
				} else if ([33, 38, 39].some((n) => n == e.keyCode)) {
					if (key <= this.subs.length - 2) {
						inputForcus = this.subs[key + 1];
						inputForcus.focus();
					}
				} else if ([34, 37, 40].some((n) => n == e.keyCode)) {
					if (key > 0) {
						inputForcus = this.subs[key - 1];
						inputForcus.focus();
					}
				} else if (
					e.keyCode != 8 &&
					key < this.subs.length - 1 &&
					((e.keyCode > 47 && e.keyCode < 58) ||
						(e.keyCode > 64 && e.keyCode < 91))
				) {
					let index = key + 1;
					let inputForcus = this.subs[index];
					inputForcus.focus();
				}
				this.end();
			};
		});
	};

	end = () => {
		this.main.value = "";
		Array.from(this.subs).forEach((input, key) => {
			let value = input.value.trim();
			if (value != "") {
				const inputArray = value.split("");
				input.value = value.length == 1 ? value : inputArray[0];
				value = input.value;
			}
			this.main.value += `${value}`;
		});
		if (this.autoSubmit && this.main.length == this.subs.length) {
			this.submit();
		}
	};

	submit = () => {};
}

new OTP(document.querySelector("[otp-rs]"), {
	autoSubmit: false,
	attributeMain: "[abcd]",
	classSub: "test",
}).start();
