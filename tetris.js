define(['fps-label', 'tetrimino-factory'],
	function(FPSLabel, TetriminoFactory) {
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

	class Tetris {
		constructor(config) {
			this.canvas = config.canvas;
			this.context = this.canvas.getContext("2d");
			this.tetriminoFactory = new TetriminoFactory();

			this.fpsLabel = new FPSLabel({
				context: this.context,
				position: FPS_LABEL_POSITION
			});

			this._init();

			document.addEventListener("keydown", this._onKeyDown.bind(this));
		}

		render() {
			if (this.isGameOver) {
				this._renderGameOver();
				return;
			}

			if (this.isPaused) {
				this._renderPaused();
				return;
			}

			setTimeout(() => {
				requestAnimationFrame(this.render.bind(this));

				this._invalidate();
			}, this.levelUpdateInterval);
		}

		start() {
			if (this.isGameOver) {
				this._init();
			}

			this.isGameOver = this.isPaused = false;

			this.render();
		}

		pause() {
			this.isPaused = true;
		}

		_init() {
			this.level = 1;
			this.levelUpdateInterval = UPDATE_INTERVAL_PER_LEVEL[this.level];
			this.lines = 0;
			this.scores = 0;
			this.keyboard = { keyPressed: "" };
			this.boardGrid = [];
			this.boardGridCopy = [];

			for (let i = 0; i < BOARD_GRID_HEIGHT; i++) {
				this.boardGrid.push(this._createEmptyRow());
			}

			this._saveBoardState();

			this.fallingTetrimino = this.tetriminoFactory.getNextTetrimino(this);
			this.nextTetrimino = this.tetriminoFactory.getNextTetrimino(this);
		}

		_invalidate(keyCode) {
			this._update(keyCode);

			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			this._render();
		}

		_update(keyCode) {
			this.fpsLabel.update();

			this.fallingTetrimino.update(keyCode);

			this._updateBoardGrid();

			if (this.fallingTetrimino.isDown) {
				this._onTetriminoDown();
			}
		}

		_render() {
			const ctx = this.context;

			this._renderBackground();

			this.fpsLabel.render();

			this._renderBoard();
			this._renderNextTetriminoPreview();

			this._renderStatisticsPanel();
		}

		_createEmptyRow() {
			const row = [];

			for (let j = 0; j < BOARD_GRID_WIDTH; j++) {
				row.push({ used: 0, color: 0 });
			}

			return row;
		}

		_clearLinesIfNeeded() {
			let rowsRemoved = 0;

			for (let i = 0; i < this.boardGrid.length; i++) {
				const row = this.boardGrid[i];
				let atomsCount = 0;

				for (let j = 0; j < row.length; j++) {
					if (row[j].used === 0) {
						break;
					} else {
						atomsCount++;
					}
				}

				if (atomsCount === row.length) {
					this.boardGrid.splice(i, 1);
					this.boardGrid.unshift(this._createEmptyRow());
					this._saveBoardState();
					rowsRemoved++;
				}
			}

			return rowsRemoved;
		}

		_updateBoardGrid() {
			const tetriminoMatrix = this.fallingTetrimino.getMatrix();

			this._restoreBoardState();

			for (let i = tetriminoMatrix.length - 1; i >= 0; i--) {
				const row = tetriminoMatrix[i];

				for (let j = 0; j < row.length; j++) {
					const atom = row[j];

					if (!atom) {
						continue;
					}

					if (this.fallingTetrimino.row + i === this.boardGrid.length - 1) {
						this.fallingTetrimino.isDown = true;
					}

					if (!this.fallingTetrimino.isDown && this.boardGridCopy[this.fallingTetrimino.row + i + 1][this.fallingTetrimino.col + j].used === 1) {
						this.fallingTetrimino.isDown = true; //if next line is occupied
					}

					this.boardGrid[this.fallingTetrimino.row + i][this.fallingTetrimino.col + j] = { used: 1, color: this.fallingTetrimino.color };
				}
			}
		}

		_onTetriminoDown() {
			this._saveBoardState();

			const rowsRemoved = this._clearLinesIfNeeded();

			this._updateStatistics(rowsRemoved);

			if (this._isGameOver(this.nextTetrimino)) {
				this.isGameOver = true;
				return;
			}

			this.fallingTetrimino = this.nextTetrimino;
			this.nextTetrimino = this.tetriminoFactory.getNextTetrimino(this);
		}

		canRotate(tetrimino, angle) {
			return tetrimino.col + tetrimino.getLength(angle) <= BOARD_GRID_WIDTH;
		}

		hasCollisionOnLeft(tetrimino) {
			const matrix = tetrimino.getMatrix();

			if (tetrimino.col === 0) {
				return true;
			}

			for (let i = 0; i < matrix.length; i++) {
				const row = matrix[i],
					firstAtomIndex = row.indexOf(1);

				if (firstAtomIndex === -1) {
					continue;
				}

				if (this.boardGridCopy[tetrimino.row + i][tetrimino.col + firstAtomIndex - 1].used === 1) {
					return true;
				}
			}

			return false;
		}

		hasCollisionOnRight(tetrimino) {
			const matrix = tetrimino.getMatrix();

			if (tetrimino.col === BOARD_GRID_WIDTH - 1) {
				return true;
			}

			for (let i = 0; i < matrix.length; i++) {
				const row = matrix[i],
					lastAtomIndex = row.lastIndexOf(1);

				if (lastAtomIndex === -1) {
					continue;
				}

				if (this.boardGridCopy[tetrimino.row + i][tetrimino.col + lastAtomIndex + 1].used === 1) {
					return true;
				}
			}

			return false;
		}

		_renderBoard() {
			const ctx = this.context;

			for (let i = 0; i < BOARD_GRID_HEIGHT; i++) {
				for (let j = 0; j < BOARD_GRID_WIDTH; j++) {
					const atom = this.boardGrid[i][j];

					if (!atom.used) {
						continue;
					}

					ctx.lineWidth = 2;
					ctx.strokeStyle = "white";
					ctx.fillStyle = atom.color;

					const x = j * ATOM_LENGTH + ATOM_OFFSET,
						y = i * ATOM_LENGTH + ATOM_OFFSET;

					ctx.strokeRect(x, y, ATOM_LENGTH, ATOM_LENGTH);
					ctx.fillRect(x, y, ATOM_LENGTH, ATOM_LENGTH);
				}
			}
		}

		_saveBoardState() {
			this.boardGridCopy = this._deepClone(this.boardGrid);
		}

		_restoreBoardState() {
			this.boardGrid = this._deepClone(this.boardGridCopy);
		}

		_deepClone(object) {
			if (!object) return null;

			return JSON.parse(JSON.stringify(object));
		}

		_renderBackground() {
			const ctx = this.context;

			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			ctx.lineWidth = 5;
			ctx.strokeStyle = "brown";
			ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.moveTo(SPLITTER_POSITION.x, SPLITTER_POSITION.y);
			ctx.lineTo(SPLITTER_POSITION.x, this.canvas.height);
			ctx.stroke();
		}

		_renderNextTetriminoPreview() {
			const ctx = this.context,
				tetriminoMatrix = this.nextTetrimino.getMatrix(),
				startX = TETRIMINO_PREVIEW_POSITION.x,
				startY = TETRIMINO_PREVIEW_POSITION.y;

			ctx.font = "16px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";
			ctx.fillText("Next:", TETRIMINO_PREVIEW_CAPTION_POSITION.x, TETRIMINO_PREVIEW_CAPTION_POSITION.y);

			for (let i = 0; i < tetriminoMatrix.length; i++) {
				const row = tetriminoMatrix[i];

				for (let j = 0; j < row.length; j++) {
					const atom = row[j];

					if (!atom) {
						continue;
					}

					ctx.lineWidth = 2;
					ctx.strokeStyle = "white";
					ctx.fillStyle = this.nextTetrimino.color;
					ctx.strokeRect(startX + j * ATOM_LENGTH, startY + i * ATOM_LENGTH, ATOM_LENGTH, ATOM_LENGTH);
					ctx.fillRect(startX + j * ATOM_LENGTH, startY + i * ATOM_LENGTH, ATOM_LENGTH, ATOM_LENGTH);
				}
			}
		}

		_renderStatisticsPanel() {
			const ctx = this.context;

			ctx.font = "14px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";

			ctx.fillText("Level: " + this.level, LEVEL_TEXT_POSITION.x, LEVEL_TEXT_POSITION.y);
			ctx.fillText("Lines: " + this.lines, LINES_TEXT_POSITION.x, LINES_TEXT_POSITION.y)
			ctx.fillText("Scores: " + this.scores, SCORE_TEXT_POSITION.x, SCORE_TEXT_POSITION.y)
		}

		_updateStatistics(rowsRemoved) {
			if (rowsRemoved === 0) {
				return;
			}

			const scores = rowsRemoved > 0 ? this.level * this._getScores(rowsRemoved) : 0;

			this.scores += scores;
			this.lines += rowsRemoved;

			if (this.level < MAX_LEVEL) {
				if (this.lines >= LINES_TO_LEVEL_UP[this.level + 1]) {
					this.level++;
					this.levelUpdateInterval = UPDATE_INTERVAL_PER_LEVEL[this.level];
					this.fallingTetrimino.updateInterval = this.levelUpdateInterval;
					this.nextTetrimino.updateInterval = this.levelUpdateInterval;
				}
			}
		}

		_getScores(lines) {
			return SCORES_FACTOR_PER_LINES_COMPLETED[lines];
		}

		_isGameOver(tetrimino) {
			const matrix = tetrimino.getMatrix();

			for (let i = matrix.length - 1; i >= 0; i--) {
				const row = matrix[i];

				for (let j = 0; j < row.length; j++) {
					if (row[j] === 1 && (this.boardGrid[i + tetrimino.row][j + tetrimino.col].used === 1)) {
						return true;
					}
				}
			}

			return false;
		}

		gameOver() {
			if (this.isPaused) {
				return;
			}

			this.isGameOver = true;
		}

		_renderGameOver() {
			const ctx = this.context;

			ctx.font = "20px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";

			ctx.fillText("Game Over!", GAME_OVER_TEXT_POSTION.x, GAME_OVER_TEXT_POSTION.y);
		}

		_renderPaused() {
			const ctx = this.context;

			ctx.font = "20px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";

			ctx.fillText("Paused", PAUSE_TEXT_POSITION.x, PAUSE_TEXT_POSITION.y);
		}

		_onKeyDown(e) {
			const code = e.code;

			if (code === "KeyS") {
				this.start();
			}

			if (code === "KeyP") {
				this.pause();
			}

			if (this.isGameOver || this.isPaused) {
				return;
			}

			if (code !== "ArrowLeft" && code !== "ArrowRight" && code !== "ArrowUp" && code !== "ArrowDown") {
				return;
			}

			this._invalidate(code);
		}
	}

	return Tetris;
});