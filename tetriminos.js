(function() {
	window.TetrisNamespace = window.TetrisNamespace || {};

	LTetrimino.prototype = Object.create(TetrisNamespace.Tetrimino.prototype);
	LTetrimino.prototype.constructor = LTetrimino;

	function LTetrimino(config) {
		var that = this;

		TetrisNamespace.Tetrimino.call(that, config);

		that.color = "orange";

		that.matrix = {
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
	};

    JTetrimino.prototype = Object.create(TetrisNamespace.Tetrimino.prototype);
	JTetrimino.prototype.constructor = JTetrimino;

	function JTetrimino(config) {
		var that = this;

		TetrisNamespace.Tetrimino.call(that, config);

		that.color = "blue";

		that.matrix = {
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
	};

    OTetrimino.prototype = Object.create(TetrisNamespace.Tetrimino.prototype);
	OTetrimino.prototype.constructor = OTetrimino;

	function OTetrimino(config) {
		var that = this;

		TetrisNamespace.Tetrimino.call(that, config);

		that.color = "yellow";

		var rotation =
		[
			[1, 1],
			[1, 1]
		];

		that.matrix = {
			"0": rotation,
			"90": rotation,
			"180": rotation,
			"270": rotation
		};
	};

	ITetrimino.prototype = Object.create(TetrisNamespace.Tetrimino.prototype);
	ITetrimino.prototype.constructor = ITetrimino;

	function ITetrimino(config) {
		var that = this,
			horizontal =
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

		TetrisNamespace.Tetrimino.call(that, config);

		that.color = "cyan";

		that.matrix = {
			"0": horizontal,
			"90": vertical,
			"180": horizontal,
			"270": vertical
		};
	};

	STetrimino.prototype = Object.create(TetrisNamespace.Tetrimino.prototype);
	STetrimino.prototype.constructor = STetrimino;

	function STetrimino(config) {
		var that = this,
			horizontal =
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

		TetrisNamespace.Tetrimino.call(that, config);

		that.color = "green";

		that.matrix = {
			"0": horizontal,
			"90": vertical,
			"180": horizontal,
			"270": vertical
		};
	};

	TTetrimino.prototype = Object.create(TetrisNamespace.Tetrimino.prototype);
	TTetrimino.prototype.constructor = TTetrimino;

	function TTetrimino(config) {
		var that = this;

		TetrisNamespace.Tetrimino.call(that, config);

		that.color = "purple";

		that.matrix = {
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
	};

	ZTetrimino.prototype = Object.create(TetrisNamespace.Tetrimino.prototype);
	ZTetrimino.prototype.constructor = ZTetrimino;

	function ZTetrimino(config) {
		var that = this,
			horizontal =
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

		TetrisNamespace.Tetrimino.call(that, config);

		that.color = "red";
		that.matrix = {
			"0": horizontal,
			"90": vertical,
			"180": horizontal,
			"270": vertical
		};
	};

	TetrisNamespace.ZTetrimino = ZTetrimino;
	TetrisNamespace.TTetrimino = TTetrimino;
	TetrisNamespace.LTetrimino = LTetrimino;
	TetrisNamespace.JTetrimino = JTetrimino;
	TetrisNamespace.OTetrimino = OTetrimino;
	TetrisNamespace.ITetrimino = ITetrimino;
	TetrisNamespace.STetrimino = STetrimino;
})();