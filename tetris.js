(function() {
	function Tetris(config) {
		var that = this;

		that.canvas = config.canvas;
		that.context = that.canvas.getContext("2d");

		that.fpsLabel = new TetrisNamespace.FPSLabel({
			context: that.context,
			position: {x: 320, y: 25}
		});

		that.fallingFigure = TetrisNamespace.TetriminoFactory.CreateById("Z", {
			position: {row: 0, col: 3},
			angle: 0,
			tetris: that
		});

		that.boardGrid = [];

		that.keyboard = {
			keyPressed: ""
		};

		that._init();

		window.onkeydown = function(event) {
			var code = event.code;

			that.keyboard.keyPressed = code;
		}

		window.onkeyup = function(event) {
			that.keyboard.keyPressed = "";
		}
	}

	Tetris.prototype = {
		_init: function() {
			var that = this;

			that.boardGrid = [];

			for (var i = 0; i < BOARD_GRID_HEIGHT; i++) {
				var line = [];

				for (var j = 0; j < BOARD_GRID_WIDTH; j++) {
					line.push(0);
				}

				that.boardGrid.push(line);
			}

			that._saveBoardState();
		},

		render: function() {
			var that = this;

			requestAnimationFrame(that.render.bind(that));

			that._update();

			that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);

			that._render();
		},

		_update: function() {
			var that = this;

			that.fpsLabel.update();

			that.fallingFigure.update(that.keyboard);
		},

		_render: function() {
			var that = this,
				ctx = that.context;

			that._renderBackground();

			that.fpsLabel.render();

			that._renderBoard();
		},

		_renderBoard: function() {
			var that = this,
				ctx = that.context;

			for (var i = 0; i < BOARD_GRID_HEIGHT; i++) {
				for (var j = 0; j < BOARD_GRID_WIDTH; j++) {
					var atom = that.boardGrid[i][j];

					if (!atom) {
						continue;
					}

					ctx.lineWidth = 2;
					ctx.strokeStyle = "red";

					var x = j * 25 + 4,
						y = i * 25 + 4;

					ctx.strokeRect(x, y, 25, 25);
				}
			}

			if (that.fallingFigure.isDown) {
				that._saveBoardState();

				that.fallingFigure = TetrisNamespace.TetriminoFactory.CreateById("J", {
					position: {row: 0, col: 3},
					angle: 180,
					tetris: that
				});
			}
		},

		_saveBoardState: function() {
			var that = this;

			that.boardGridCopy = [];
			for (var i = 0; i < that.boardGrid.length; i++) {
				that.boardGridCopy.push(that.boardGrid[i].slice());
			}
		},

		_restoreBoardState: function() {
			var that = this;

			that.boardGrid = [];
			for (var i = 0; i < that.boardGridCopy.length; i++) {
				that.boardGrid.push(that.boardGridCopy[i].slice());
			}
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
		}
	};

	window.TetrisNamespace = window.TetrisNamespace || {};
	TetrisNamespace.Tetris = Tetris;

	const
		WIDTH = 600,
		HEIGHT = 600,
		BOARD_GRID_WIDTH = 12,
		BOARD_GRID_HEIGHT = 20
})();