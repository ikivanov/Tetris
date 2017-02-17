(function() {
	function Tetrimino(config) {
		var that = this;

		that.tetris = config.tetris;

		that.row = config.row || 0;
		that.col = config.col || 3;
		that.color = config.color || "red";
		that.angle = config.angle || 0;

		that.isDown = false;

		that.keyPressedInterval = 40;
		that.lastUpdatedTime = new Date();
		that.updateInterval = 500;
	}

	Tetrimino.prototype = {
		getMatrix: function(angle) {
			var that = this;

			if (angle === undefined) {
				return that.matrix[that.angle];
			}

			if ([0, 90, 180, 270].indexOf(angle) === -1) {
				throw new Error("Invalid tetrimino angle.");
			}

			return that.matrix[angle];
		},

		getLength: function(angle) {
			var that = this;

			if (angle === undefined) {
				return that.matrix[that.angle][0].length;
			}

			if ([0, 90, 180, 270].indexOf(angle) === -1) {
				throw new Error("Invalid tetrimino angle.");
			}

			return that.matrix[angle][0].length;
		},

		update: function(keyCode) {
			var that = this,
				now = new Date(),
				tetris = TetrisNamespace.TetrisGame,
				matrix = that.getMatrix();

			if (that.isDown) {
				return;
			}

			if (keyCode && keyCode === "ArrowLeft") {
				if (that.col > 0 && !tetris.hasCollisionOnLeft(that)) {
					that.col--;
				}
			}

			if (keyCode && keyCode === "ArrowRight") {
				if (that.col < (12 - matrix[0].length) && !tetris.hasCollisionOnRight(that)) {
					that.col++;
				}
			}

			if (keyCode && keyCode === "ArrowUp") {
				var newAngle = that.angle;

				if (newAngle === 270) {
					newAngle = 0;
				} else {
					newAngle += 90;
				}

				if (tetris.canRotate(that, newAngle)) {
					that.angle = newAngle;
				}
			}

			if (keyCode && keyCode === "ArrowDown") {
				that.row++;

				that.lastUpdatedTime = new Date();
			}

			if (that._canUpdate()) {
				that.row++;

				that.lastUpdatedTime = new Date();
			}
		},

		_canUpdate: function() {
			var that = this,
				now = new Date();

			return now.getTime() - that.lastUpdatedTime.getTime() > that.updateInterval;
		},

		render: function() {
		}
	};

	window.TetrisNamespace = window.TetrisNamespace || {};
	TetrisNamespace.Tetrimino = Tetrimino;

	const
		WIDTH = 600,
		HEIGHT = 600;
})();