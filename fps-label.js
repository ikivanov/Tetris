define([], function() {
	class FPSLabel {
		constructor(config) {
			this.context = config.context;
			this.position = config.position;

			this.oldTime = new Date();
			this.framesCounter = 0;
			this.fps = 0;
		}

		update() {
			const ctx = this.context,
				now = new Date(),
				diff = now.getTime() - this.oldTime.getTime();

			if (diff < 1000) {
				this.framesCounter++;
			} else {
				this.fps = this.framesCounter;
				this.framesCounter = 0;
				this.oldTime = new Date();
			}
		}

		render() {
			const ctx = this.context;

			ctx.font = "14px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";
			ctx.fillText("fps: " + this.fps, this.position.x, this.position.y);
		}
	}

	return FPSLabel;
});