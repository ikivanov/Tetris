(function() {
	function Tetrimino(config) {
		var that = this;

		that.tetris = config.tetris;

		that.row = config.row || 0;
		that.col = config.col || 3;
		that.color = config.color || "red";
		that.angle = config.angle || 0;

		that.isDown = false;

		that.lastKeyPressedTime = new Date();
		that.keyPressedInterval = 40;
		that.lastUpdatedTime = new Date();
		that.updateInterval = 500;
	}

	Tetrimino.prototype = {
		getMatrix: function() {
			var that = this;

			return that.matrix[that.angle];
		},

		update: function(keyboard) {
			var that = this,
				now = new Date();

			if (that.isDown) {
				return;
			}

			var code = keyboard.keyPressed;
			if (code && code === "ArrowLeft" && that._canProcessKeyboardInput()) {
				if (that.col > 0) {
					that.col--;
					that.lastKeyPressedTime = now;
				}
			}

			if (code && code === "ArrowRight" && that._canProcessKeyboardInput()) {
				if (that.col < 9) {
					that.col++;
					that.lastKeyPressedTime = new Date();
				}
			}

			if (code && code === "ArrowUp" && that._canProcessKeyboardInput()) {
				if (that.angle === 270) {
					that.angle = 0;
				} else {
					that.angle += 90;
				}
			}

			if (code && code === "ArrowDown" && that._canProcessKeyboardInput()) {
			}

			if (that._canUpdate()) {
				that.row++;

				that.lastUpdatedTime = new Date();
			}
		},

		_canProcessKeyboardInput: function() {
			var that = this,
				now = new Date();

			return now.getTime() - that.lastKeyPressedTime.getTime() > that.keyPressedInterval;
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