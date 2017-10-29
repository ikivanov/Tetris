(function() {
	window.TetrisNamespace = window.TetrisNamespace || {};

	class LTetrimino extends TetrisNamespace.Tetrimino {
		constructor(config) {
			super(config);

			this.color = "orange";

			this.matrix = {
				"0":
				[
					[1, 0],
					[1, 0],
					[1, 1]
				],
				"90":
				[
					[0, 0, 1],
					[1, 1, 1]
				],
				"180":
				[
					[1, 1],
					[0, 1],
					[0, 1]
				],
				"270":
				[
					[1, 1, 1],
					[1, 0, 0]
				]
			};
		}
	}

	class JTetrimino extends TetrisNamespace.Tetrimino {
		constructor(config) {
			super(config);

			this.color = "blue";

			this.matrix = {
				"0":
				[
					[0, 1],
					[0, 1],
					[1, 1]
				],
				"90":
				[
					[1, 1, 1],
					[0, 0, 1]
				],
				"180":
				[
					[1, 1],
					[1, 0],
					[1, 0]
				],
				"270":
				[
					[1, 0, 0],
					[1, 1, 1]
				]
			};
		}
	}

	class OTetrimino extends TetrisNamespace.Tetrimino {
		constructor(config) {
			super(config);

			this.color = "yellow";

			const rotation =
			[
				[1, 1],
				[1, 1]
			];

			this.matrix = {
				"0": rotation,
				"90": rotation,
				"180": rotation,
				"270": rotation
			};
		}
	}

	class ITetrimino extends TetrisNamespace.Tetrimino {
		constructor(config) {
			super(config);

			const horizontal =
				[
					[1, 1, 1, 1]
				],
				vertical =
				[
					[1],
					[1],
					[1],
					[1]
				];


			this.color = "cyan";

			this.matrix = {
				"0": horizontal,
				"90": vertical,
				"180": horizontal,
				"270": vertical
			};
		}
	}

	class STetrimino extends TetrisNamespace.Tetrimino {
		constructor(config) {
			super(config);

			const horizontal =
				[
					[0, 1, 1],
					[1, 1, 0]
				],
				vertical =
				[
					[1, 0],
					[1, 1],
					[0, 1]
				];

			this.color = "green";

			this.matrix = {
				"0": horizontal,
				"90": vertical,
				"180": horizontal,
				"270": vertical
			};
		}
	}

	class TTetrimino extends TetrisNamespace.Tetrimino {
		constructor(config) {
			super(config);

			this.color = "purple";

			this.matrix = {
				"0":
				[
					[1, 1, 1],
					[0, 1, 0]
				],
				"90":
				[
					[0, 1],
					[1, 1],
					[0, 1]
				],
				"180":
				[
					[0, 1, 0],
					[1, 1, 1]
				],
				"270":
				[
					[1, 0],
					[1, 1],
					[1, 0]
				]
			};
		}
	}

	class ZTetrimino extends TetrisNamespace.Tetrimino {
		constructor(config) {
			super(config);

			const horizontal =
				[
					[1, 1, 0],
					[0, 1, 1]
				],
				vertical =
				[
					[0, 1],
					[1, 1],
					[1, 0]
				];

			this.color = "red";
			this.matrix = {
				"0": horizontal,
				"90": vertical,
				"180": horizontal,
				"270": vertical
			};
		}
	}

	TetrisNamespace.ZTetrimino = ZTetrimino;
	TetrisNamespace.TTetrimino = TTetrimino;
	TetrisNamespace.LTetrimino = LTetrimino;
	TetrisNamespace.JTetrimino = JTetrimino;
	TetrisNamespace.OTetrimino = OTetrimino;
	TetrisNamespace.ITetrimino = ITetrimino;
	TetrisNamespace.STetrimino = STetrimino;
})();