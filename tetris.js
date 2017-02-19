(function() {
	function Tetris(config) {
		var that = this;

		that.canvas = config.canvas;
		that.context = that.canvas.getContext("2d");
		that.isPaused = false;
		that.level = 1;
		that.isGameOver = false;
		that.updateIntervalPerLevel = {
			1: 600,
			2: 550,
			3: 500,
			4: 450,
			5: 400,
			6: 350,
			7: 300,
			8: 250,
			9: 200
		};

		that.scoresFactorPerLinesCompleted = {
			1: 20,
			2: 50,
			3: 100,
			4: 250
		};

		that.linesToLevelUp = {
			2: 10,
			3: 25,
			4: 40,
			5: 60,
			6: 85,
			7: 115,
			8: 150,
			9: 200
		};

		that.levelUpdateInterval = that.updateIntervalPerLevel[that.level];

		that.fpsLabel = new TetrisNamespace.FPSLabel({
			context: that.context,
			position: {x: 320, y: 25}
		});

		that.fallingTetrimino = TetrisNamespace.TetriminoFactory.getNextTetrimino(that);
		that.nextTetrimino = TetrisNamespace.TetriminoFactory.getNextTetrimino(that);

		that.lines = 0;
		that.scores = 0;

		that.boardGrid = [];
		that.boardGridCopy = [];

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

			that.level = 1;
			that.lines = 0;
			that.scores = 0;
			that.keyboard = {
				keyPressed: ""
			};
			that.boardGrid = [];
			that.boardGridCopy = [];

			for (var i = 0; i < BOARD_GRID_HEIGHT; i++) {
				that.boardGrid.push(that._createEmptyRow());
			}

			that._saveBoardState();

			that.fallingTetrimino = TetrisNamespace.TetriminoFactory.getNextTetrimino(that);
			that.nextTetrimino = TetrisNamespace.TetriminoFactory.getNextTetrimino(that);
		},

		_createEmptyRow: function() {
			var row = [];

			for (var j = 0; j < BOARD_GRID_WIDTH; j++) {
				row.push({used: 0, color: 0});
			}

			return row;
		},

		start: function() {
			var that = this;

			if (that.isGameOver) {
				that._init();
			}

			that.isGameOver = that.isPaused = false;

			that.render();
		},

		pause: function() {
			this.isPaused = true;
		},

		render: function() {
			var that = this;

			if (that.isGameOver) {
				that._renderGameOver();
				return;
			}

			if (that.isPaused) {
				that._renderPaused();
				return;
			}

			that._invalidate();

			setTimeout(that.render.bind(that), that.levelUpdateInterval);
		},

		_invalidate: function(keyCode) {
			var that = this;

			that._update(keyCode);

			that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);

			that._render();
		},

		_clearLinesIfNeeded: function() {
			var that = this,
				rowsRemoved = 0;

			for (var i = 0; i < that.boardGrid.length; i++) {
				var row = that.boardGrid[i],
					atomsCount = 0;

				for (var j = 0; j < row.length; j++) {
					if (row[j].used === 0) {
						break;
					} else {
						atomsCount++;
					}
				}

				if (atomsCount === row.length) {
					that.boardGrid.splice(i, 1);
					that.boardGrid.unshift(that._createEmptyRow());
					that._saveBoardState();
					rowsRemoved++;
				}
			}

			return rowsRemoved;
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

		canRotate: function(tetrimino, angle) {
			return tetrimino.col + tetrimino.getLength(angle) <= BOARD_GRID_WIDTH;
		},

		hasCollisionOnLeft: function(tetrimino) {
			var that = this,
				matrix = tetrimino.getMatrix();

			if (tetrimino.col === 0) {
				return true;
			}

			for (var i = 0; i < matrix.length; i++) {
				var row = matrix[i],
					firstAtomIndex = row.indexOf(1);

				if (firstAtomIndex === -1) {
					continue;
				}

				if (that.boardGridCopy[tetrimino.row + i][tetrimino.col + firstAtomIndex - 1].used === 1) {
					return true;
				}
			}

			return false;
		},

		hasCollisionOnRight: function(tetrimino) {
			var that = this,
				matrix = tetrimino.getMatrix();

			if (tetrimino.col === BOARD_GRID_WIDTH - 1) {
				return true;
			}

			for (var i = 0; i < matrix.length; i++) {
				var row = matrix[i],
					lastAtomIndex = row.lastIndexOf(1);

				if (lastAtomIndex === -1) {
					continue;
				}

				if (that.boardGridCopy[tetrimino.row + i][tetrimino.col + lastAtomIndex + 1].used === 1) {
					return true;
				}
			}

			return false;
		},

		_render: function() {
			var that = this,
				ctx = that.context;

			that._renderBackground();

			that.fpsLabel.render();

			that._renderBoard();
			that._renderNextTetriminoPreview();

			that._renderStatisticsPanel();

			if (that.fallingTetrimino.isDown) {
				that._saveBoardState();

				var rowsRemoved = that._clearLinesIfNeeded();
				that._updateStatistics(rowsRemoved);

				if (that._isGameOver(that.nextTetrimino)) {
					that.isGameOver = true;
					return;
				}

				that.fallingTetrimino = that.nextTetrimino;
				that.nextTetrimino = TetrisNamespace.TetriminoFactory.getNextTetrimino(that);
			}
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

			ctx.font = "16px Arial";
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

		_renderStatisticsPanel: function() {
			var that = this,
				ctx = that.context;

			ctx.font = "14px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";

			ctx.fillText("Level: " + that.level, 320, 250);
			ctx.fillText("Lines: " + that.lines, 320, 275)
			ctx.fillText("Scores: " + that.scores, 320, 300)
		},

		_updateStatistics: function(rowsRemoved) {
			if (rowsRemoved === 0) {
				return;
			}

			var that = this,
				scores = rowsRemoved > 0 ? that.level * that._getScores(rowsRemoved) : 0;

			that.scores += scores;
			that.lines += rowsRemoved;

			if (that.level < 9) {
				var linesToLevelUp = that.linesToLevelUp[that.level + 1];
				if (that.lines >= linesToLevelUp) {
					that.level++;
					that.levelUpdateInterval = that.updateIntervalPerLevel[that.level];
					that.fallingTetrimino.updateInterval = that.levelUpdateInterval;
					that.nextTetrimino.updateInterval = that.levelUpdateInterval;
				}
			}
		},

		_getScores: function(lines) {
			return this.scoresFactorPerLinesCompleted[lines];
		},

		_isGameOver: function(tetrimino) {
			var that = this,
				matrix = tetrimino.getMatrix();

			for (var i = matrix.length - 1; i >= 0; i--) {
				var row = matrix[i];

				for (var j = 0; j < row.length; j++) {
					if (row[j] === 1 && (that.boardGrid[i + tetrimino.row][j + tetrimino.col].used === 1)) {
						return true;
					}
				}
			}

			return false;
		},

		gameOver: function() {
			var that = this;

			if (that.isPaused) {
				return;
			}

			that.isGameOver = true;
		},

		_renderGameOver: function() {
			var that = this,
				ctx = that.context;

			ctx.font = "20px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";

			ctx.fillText("Game Over!", 100, 250);
		},

		_renderPaused: function() {
			var that = this,
				ctx = that.context;

			ctx.font = "20px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";

			ctx.fillText("Paused", 120, 250);
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