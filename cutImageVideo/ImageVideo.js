function showImage(image) {
	return image;
}

class getImageOfVideo {
	constructor(path, secs) {
		this.path = path;
		this.secs = secs;
		this.video = document.createElement("video");
	}

	getImage = () => {
		this.video.onloadedmetadata = () => {
			if ("function" === typeof this.secs) {
				this.secs = this.secs(this.video.duration);
			}
			this.video.currentTime = Math.min(
				Math.max(
					0,
					(this.secs < 0 ? this.video.duration : 0) + this.secs
				),
				this.video.duration
			);
		};

		this.video.onseeked = (e) => {
			var canvas = document.createElement("canvas");
			canvas.height = this.video.videoHeight;
			canvas.width = this.video.videoWidth;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
			this.image = canvas.toDataURL();
			showImage.call(test, this.image);
		};

		this.video.onerror = (e) => {
			this.error = e;
		};

		this.video.src = this.path;
	};
}
