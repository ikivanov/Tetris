(function() {
	const INITIAL_ROW = 0,
		  INITIAL_COL = 3,
		  ANGLES = [0, 90, 180, 270],
		  INVALID_TETRIMINO_ANGLE_MSG = "Invalid tetrimino angle.",
		  BOARD_GRID_WIDTH = 12;

	class Tetrimino {
		constructor(config) {
			this.tetris = config.tetris;

			this.row = config.row || INITIAL_ROW;
			this.col = config.col || INITIAL_COL;
			this.color = config.color || "red";
			this.angle = config.angle || 0;

			this.isDown = false;

			this.lastUpdatedTime = new Date();
			this.updateInterval = this.tetris.levelUpdateInterval;
		}

		getMatrix(angle) {
			if (angle === undefined) {
				return this.matrix[this.angle];
			}

			if (ANGLES.indexOf(angle) === -1) {
				throw new Error(INVALID_TETRIMINO_ANGLE_MSG);
			}

			return this.matrix[angle];
		}

		getLength(angle) {
			if (angle === undefined) {
				return this.matrix[this.angle][0].length;
			}

			if (ANGLES.indexOf(angle) === -1) {
				throw new Error(INVALID_TETRIMINO_ANGLE_MSG);
			}

			return this.matrix[angle][0].length;
		}

		update(keyCode) {
			const now = new Date(),
				tetris = TetrisNamespace.TetrisGame,
				matrix = this.getMatrix();

			if (this.isDown) {
				return;
			}

			if (keyCode && keyCode === "ArrowLeft") {
				if (this.col > 0 && !tetris.hasCollisionOnLeft(this)) {
					this.col--;
				}
			}

			if (keyCode && keyCode === "ArrowRight") {
				if (this.col < (BOARD_GRID_WIDTH - matrix[0].length) && !tetris.hasCollisionOnRight(this)) {
					this.col++;
				}
			}

			if (keyCode && keyCode === "ArrowUp") {
				let newAngle = this.angle;

				if (newAngle === 270) {
					newAngle = 0;
				} else {
					newAngle += 90;
				}

				if (tetris.canRotate(this, newAngle)) {
					this.angle = newAngle;
				}
			}

			if (keyCode && keyCode === "ArrowDown") {
				this.row++;

				this.lastUpdatedTime = new Date();
			}

			if (this._canUpdate()) {
				this.row++;

				this.lastUpdatedTime = new Date();
			}
		}

		_canUpdate() {
			const now = new Date();

			return now.getTime() - this.lastUpdatedTime.getTime() > this.updateInterval;
		}
	}

	window.TetrisNamespace = window.TetrisNamespace || {};
	TetrisNamespace.Tetrimino = Tetrimino;
})();