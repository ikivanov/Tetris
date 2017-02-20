(function() {
	const UPDATE_INTERVAL_PER_LEVEL = { 1: 600, 2: 550, 3: 500, 4: 450, 5: 400, 6: 350, 7: 300, 8: 250, 9: 200 },
			SCORES_FACTOR_PER_LINES_COMPLETED = { 1: 20, 2: 50, 3: 100, 4: 250 },
			LINES_TO_LEVEL_UP = { 2: 10, 3: 25, 4: 40, 5: 60, 6: 85, 7: 115, 8: 150, 9: 200 },
			FPS_LABEL_POSITION = { x: 320, y: 25 },
			TETRIMINO_PREVIEW_CAPTION_POSITION = { x: 320, y: 75 };
			TETRIMINO_PREVIEW_POSITION = { x: 325, y: 100 },
			LEVEL_TEXT_POSITION = { x: 320, y: 250 },
			LINES_TEXT_POSITION = { x: 320, y: 275 },
			SCORE_TEXT_POSITION = { x: 320, y: 300 },
			GAME_OVER_TEXT_POSTION = { x: 100, y: 250 },
			PAUSE_TEXT_POSITION = { x: 120, y: 250 },
			SPLITTER_POSITION = { x: 307, y: 0 },
			ATOM_LENGTH = 25,
			ATOM_OFFSET = 4,
			BOARD_GRID_WIDTH = 12,
			BOARD_GRID_HEIGHT = 20,
			MAX_LEVEL = 9;

	function Tetris(config) {
		var that = this;

		that.canvas = config.canvas;
		that.context = that.canvas.getContext("2d");

		that.fpsLabel = new TetrisNamespace.FPSLabel({
			context: that.context,
			position: FPS_LABEL_POSITION
		});

		that._init();

		document.addEventListener("keydown", that._onKeyDown.bind(that));
	}

	Tetris.prototype = {
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

			setTimeout(function() {
				requestAnimationFrame(that.render.bind(that));

				that._invalidate();
			}, that.levelUpdateInterval);
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

		_init: function() {
			var that = this;

			that.level = 1;
			that.levelUpdateInterval = UPDATE_INTERVAL_PER_LEVEL[that.level];
			that.lines = 0;
			that.scores = 0;
			that.keyboard = { keyPressed: "" };
			that.boardGrid = [];
			that.boardGridCopy = [];

			for (var i = 0; i < BOARD_GRID_HEIGHT; i++) {
				that.boardGrid.push(that._createEmptyRow());
			}

			that._saveBoardState();

			that.fallingTetrimino = TetrisNamespace.TetriminoFactory.getNextTetrimino(that);
			that.nextTetrimino = TetrisNamespace.TetriminoFactory.getNextTetrimino(that);
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

			if (that.fallingTetrimino.isDown) {
				that._onTetriminoDown();
			}
		},

		_render: function() {
			var that = this,
				ctx = that.context;

			that._renderBackground();

			that.fpsLabel.render();

			that._renderBoard();
			that._renderNextTetriminoPreview();

			that._renderStatisticsPanel();
		},

		_createEmptyRow: function() {
			var row = [];

			for (var j = 0; j < BOARD_GRID_WIDTH; j++) {
				row.push({ used: 0, color: 0 });
			}

			return row;
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

					that.boardGrid[that.fallingTetrimino.row + i][that.fallingTetrimino.col + j] = { used: 1, color: that.fallingTetrimino.color };
				}
			}
		},

		_onTetriminoDown: function() {
			var that = this;

			that._saveBoardState();

			var rowsRemoved = that._clearLinesIfNeeded();
			that._updateStatistics(rowsRemoved);

			if (that._isGameOver(that.nextTetrimino)) {
				that.isGameOver = true;
				return;
			}

			that.fallingTetrimino = that.nextTetrimino;
			that.nextTetrimino = TetrisNamespace.TetriminoFactory.getNextTetrimino(that);
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

					var x = j * ATOM_LENGTH + ATOM_OFFSET,
						y = i * ATOM_LENGTH + ATOM_OFFSET;

					ctx.strokeRect(x, y, ATOM_LENGTH, ATOM_LENGTH);
					ctx.fillRect(x, y, ATOM_LENGTH, ATOM_LENGTH);
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
			ctx.fillRect(0, 0, that.canvas.width, that.canvas.height);

			ctx.lineWidth = 5;
			ctx.strokeStyle = "brown";
			ctx.strokeRect(0, 0, that.canvas.width, that.canvas.height);

			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.moveTo(SPLITTER_POSITION.x, SPLITTER_POSITION.y);
			ctx.lineTo(SPLITTER_POSITION.x, that.canvas.height);
			ctx.stroke();
		},

		_renderNextTetriminoPreview: function() {
			var that = this,
				ctx = that.context,
				tetriminoMatrix = that.nextTetrimino.getMatrix(),
				startX = TETRIMINO_PREVIEW_POSITION.x,
				startY = TETRIMINO_PREVIEW_POSITION.y;

			ctx.font = "16px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";
			ctx.fillText("Next:", TETRIMINO_PREVIEW_CAPTION_POSITION.x, TETRIMINO_PREVIEW_CAPTION_POSITION.y);

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
					ctx.strokeRect(startX + j * ATOM_LENGTH, startY + i * ATOM_LENGTH, ATOM_LENGTH, ATOM_LENGTH);
					ctx.fillRect(startX + j * ATOM_LENGTH, startY + i * ATOM_LENGTH, ATOM_LENGTH, ATOM_LENGTH);
				}
			}
		},

		_renderStatisticsPanel: function() {
			var that = this,
				ctx = that.context;

			ctx.font = "14px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";

			ctx.fillText("Level: " + that.level, LEVEL_TEXT_POSITION.x, LEVEL_TEXT_POSITION.y);
			ctx.fillText("Lines: " + that.lines, LINES_TEXT_POSITION.x, LINES_TEXT_POSITION.y)
			ctx.fillText("Scores: " + that.scores, SCORE_TEXT_POSITION.x, SCORE_TEXT_POSITION.y)
		},

		_updateStatistics: function(rowsRemoved) {
			if (rowsRemoved === 0) {
				return;
			}

			var that = this,
				scores = rowsRemoved > 0 ? that.level * that._getScores(rowsRemoved) : 0;

			that.scores += scores;
			that.lines += rowsRemoved;

			if (that.level < MAX_LEVEL) {
				if (that.lines >= LINES_TO_LEVEL_UP[that.level + 1]) {
					that.level++;
					that.levelUpdateInterval = UPDATE_INTERVAL_PER_LEVEL[that.level];
					that.fallingTetrimino.updateInterval = that.levelUpdateInterval;
					that.nextTetrimino.updateInterval = that.levelUpdateInterval;
				}
			}
		},

		_getScores: function(lines) {
			return SCORES_FACTOR_PER_LINES_COMPLETED[lines];
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

			ctx.fillText("Game Over!", GAME_OVER_TEXT_POSTION.x, GAME_OVER_TEXT_POSTION.y);
		},

		_renderPaused: function() {
			var that = this,
				ctx = that.context;

			ctx.font = "20px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";

			ctx.fillText("Paused", PAUSE_TEXT_POSITION.x, PAUSE_TEXT_POSITION.y);
		},

		_onKeyDown: function(e) {
			var that = this,
				code = e.code;

			if (code === "KeyS") {
				that.start();
			}

			if (code === "KeyP") {
				that.pause();
			}

			if (that.isGameOver || that.isPaused) {
				return;
			}

			if (code !== "ArrowLeft" && code !== "ArrowRight" && code !== "ArrowUp" && code !== "ArrowDown") {
				return;
			}

			that._invalidate(code);
		}
	};

	window.TetrisNamespace = window.TetrisNamespace || {};
	TetrisNamespace.Tetris = Tetris;
})();