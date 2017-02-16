(function() {
	function Tetris(config) {
		var that = this;

		that.canvas = config.canvas;
		that.context = that.canvas.getContext("2d");

		that.fpsLabel = new TetrisNamespace.FPSLabel({
			context: that.context,
			position: {x: 320, y: 25}
		});

		that.fallingTetrimino = TetrisNamespace.TetriminoFactory.getNextTetrimino();
		that.nextTetrimino = TetrisNamespace.TetriminoFactory.getNextTetrimino();

		that.boardGrid = [];

		that.keyboard = {
			keyPressed: ""
		};

		that._init();

		window.onkeydown = function(event) {
			var code = event.code;

			if (code !== "ArrowLeft" && code !== "ArrowRight" && code !== "ArrowUp" && code !== "ArrowDown") {
				return;
			}

			that._invalidate(code);
		}
	}

	Tetris.prototype = {
		_init: function() {
			var that = this;

			that.boardGrid = [];

			for (var i = 0; i < BOARD_GRID_HEIGHT; i++) {
				var line = [];

				for (var j = 0; j < BOARD_GRID_WIDTH; j++) {
					line.push({used: 0, color: 0});
				}

				that.boardGrid.push(line);
			}

			that._saveBoardState();
		},

		render: function() {
			var that = this;

			that._invalidate();

			setTimeout(that.render.bind(that), 500);
		},

		_invalidate: function(keyCode) {
			var that = this;

			that._update(keyCode);

			that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);

			that._render();
		},

		_update: function(keyCode) {
			var that = this;

			that.fpsLabel.update();

			that.fallingTetrimino.update(keyCode);

			that._updateBoardGrid();
		},

		_updateBoardGrid: function() {
			var that = this,
				tetriminoMatrix = that.fallingTetrimino.getMatrix();

			that._restoreBoardState();

			for (var i = tetriminoMatrix.length - 1; i >= 0; i--) {
				var row = tetriminoMatrix[i];

				for (var j = 0; j < row.length; j++) {
					var atom = row[j];

					if (!atom) {
						continue;
					}

					if (that.fallingTetrimino.row + i === that.boardGrid.length - 1) {
						that.fallingTetrimino.isDown = true;
					}

					if (!that.fallingTetrimino.isDown && that.boardGridCopy[that.fallingTetrimino.row + i + 1][that.fallingTetrimino.col + j].used === 1) {
						that.fallingTetrimino.isDown = true; //if next line is occupied
					}

					that.boardGrid[that.fallingTetrimino.row + i][that.fallingTetrimino.col + j] = {used: 1, color: that.fallingTetrimino.color};
				}
			}
		},

		_render: function() {
			var that = this,
				ctx = that.context;

			that._renderBackground();

			that.fpsLabel.render();

			that._renderBoard();
			that._renderNextTetriminoPreview();
		},

		_renderBoard: function() {
			var that = this,
				ctx = that.context;

			for (var i = 0; i < BOARD_GRID_HEIGHT; i++) {
				for (var j = 0; j < BOARD_GRID_WIDTH; j++) {
					var atom = that.boardGrid[i][j];

					if (!atom.used) {
						continue;
					}

					ctx.lineWidth = 2;
					ctx.strokeStyle = "white";
					ctx.fillStyle = atom.color;

					var x = j * 25 + 4,
						y = i * 25 + 4;

					ctx.strokeRect(x, y, 25, 25);
					ctx.fillRect(x, y, 25, 25);
				}
			}

			if (that.fallingTetrimino.isDown) {
				that._saveBoardState();

				that.fallingTetrimino = that.nextTetrimino;
				that.nextTetrimino = TetrisNamespace.TetriminoFactory.getNextTetrimino();
			}
		},

		_saveBoardState: function() {
			var that = this;

			that.boardGridCopy = that._deepClone(that.boardGrid);
		},

		_restoreBoardState: function() {
			var that = this;

			that.boardGrid = that._deepClone(that.boardGridCopy);
		},

		_deepClone: function(object) {
			if (!object) return null;

			return JSON.parse(JSON.stringify(object));
		},

		_renderBackground: function() {
			var that = this,
				ctx = that.context;


			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, WIDTH, HEIGHT);

			ctx.lineWidth = 5;
			ctx.strokeStyle = "cyan";
			ctx.strokeRect(0, 0, that.canvas.width, that.canvas.height);

			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.moveTo(307, 0);
			ctx.lineTo(307, that.canvas.height);
			ctx.stroke();
		},

		_renderNextTetriminoPreview: function() {
			var that = this,
				ctx = that.context,
				tetriminoMatrix = that.nextTetrimino.getMatrix(),
				startX = 325,
				startY = 100;

			ctx.font = "20px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";
			ctx.fillText("Next:", 320, 75);

			for (var i = 0; i < tetriminoMatrix.length; i++) {
				var row = tetriminoMatrix[i];

				for (var j = 0; j < row.length; j++) {
					var atom = row[j];

					if (!atom) {
						continue;
					}

					ctx.lineWidth = 2;
					ctx.strokeStyle = "white";
					ctx.fillStyle = that.nextTetrimino.color;
					ctx.strokeRect(startX + j * 25, startY + i * 25, 25, 25);
					ctx.fillRect(startX + j * 25, startY + i * 25, 25, 25);
				}
			}
		},
	};

	window.TetrisNamespace = window.TetrisNamespace || {};
	TetrisNamespace.Tetris = Tetris;

	const
		WIDTH = 600,
		HEIGHT = 600,
		BOARD_GRID_WIDTH = 12,
		BOARD_GRID_HEIGHT = 20
})();