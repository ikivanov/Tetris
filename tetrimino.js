(function() {
	function Tetrimino(config) {
		var that = this;

		that.position = config.position;
		that.tetris = config.tetris;
		that.isDown = false;
		that.lastKeyPressedTime = new Date();
		that.keyPressedInterval = 40;
		that.lastUpdatedTime = new Date();
		that.updateInterval = 500;
		that.isInitialized = false;

		that.row = 0;
		that.col = 0;
		that.color = "red";

		that.angle = config.angle;
	}

	Tetrimino.prototype = {
		update: function(keyboard) {
			var that = this,
				now = new Date();

			if (!that.isInitialized) {
				that._updateBoardGrid();
				that.isInitialized = true;
			}

			if (that.isDown) {
				return;
			}

			var code = keyboard.keyPressed;
			if (code && code === "ArrowLeft" && that._canProcessKeyboardInput()) {
				if (that.position.col > 0) {
					that.position.col--;
					that.lastKeyPressedTime = now;
				}
			}

			if (code && code === "ArrowRight" && that._canProcessKeyboardInput()) {
				if (that.position.col < 9) {
					that.position.col++;
					that.lastKeyPressedTime = new Date();
				}
			}

			if (that._canUpdate()) {
				that.position.row++;

				that._updateBoardGrid();

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

		_updateBoardGrid: function() {
			var that = this,
				grid = that.rotations[that.angle];

			that.tetris._restoreBoardState();

			for (var i = grid.length - 1; i >= 0; i--) {
				var row = grid[i];

				for (var j = 0; j < row.length; j++) {
					var atom = row[j];

					if (!atom) {
						continue;
					}

					if (that.position.row + i === that.tetris.boardGrid.length - 1) {
						that.isDown = true;
					}

					if (!that.isDown && that.tetris.boardGridCopy[that.position.row + i + 1][that.position.col + j] === 1) {
						that.isDown = true; //if next line is occupied
					}

					that.tetris.boardGrid[that.position.row + i][that.position.col + j] = 1;
				}
			}
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