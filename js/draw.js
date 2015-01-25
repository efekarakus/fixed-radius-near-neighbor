var points = [
	// x < 175
	{x: 10, y: 10},
	{x: 40, y: 50},
	{x: 90, y: 25},
	{x: 140, y : 20},
	{x: 170, y: 150},
	{x: 30, y: 190},
	{x: 150, y: 300},
	{x: 40, y: 400},
	{x: 90, y: 480},
	{x: 160, y: 420},

	// 175 < x < 350
	{x: 215, y: 85},
	{x: 300, y: 140},
	{x: 335, y: 20},
	{x: 250, y: 250},
	{x: 340, y: 500},

	// 350 < x < 525
	{x: 480, y: 60},
	{x: 379, y: 200},
	{x: 420, y: 350},
	{x: 500, y: 450},

	// 525 < x < 700
	{x: 680, y: 10},
	{x: 530, y: 75},
	{x: 650, y: 150},
	{x: 620, y: 320},
	{x: 635, y: 510}
];

var r = 175;

var frnn = new FRNN(points, r);


function drawSearch()
{
	var width = 700, height = 525;
	var svg = d3.select('.box').select('svg');

	if (svg.empty())
	{
		svg = d3.select('.box')
			.append('svg')
			.attr('width', width)
			.attr('height', height);
	}

	var rectangles = [
		{x: 0, y: 0, width: r, height: r, type: 'c'},
		{x: r, y: 0, width: r, height: r, type: 'f'},
		{x: r, y: r, width: r, height: r, type: 'f'},
		{x: 0, y: r, width: r, height: r, type: 'f'}
	];

	var rect = svg.selectAll('rect.bucket')
		.data(rectangles)
		.enter()
		.append('rect')
			.attr('x', function(d) { return d.x; })
			.attr('y', function(d) { return d.y; })
			.attr('width', function(d) { return d.width; })
			.attr('height', function(d) { return d.height; })
			.attr('class', 'bucket')
			.style('fill', '#fff');	
}

function transitionPairs(p1, p2, count, delayStart, duration)
{
	var cPoint = d3.select($('#' + p1.x + '' + p1.y)[0]);
	var oPoint = d3.select($('#' + p2.x + '' + p2.y)[0]);

	var active = d3.select('.point.active');

	if (cPoint.attr('class').indexOf('active') === -1) 
	{
		active.attr('class', 'point');
		cPoint.attr('class', 'point active');

		cPoint.transition()
			.duration(duration)
			.delay(function() { return delayStart + count * duration; })
			.ease('linear')
			.each('start', function() {
				active
					.attr('r', 5)
					.style('stroke-width', 1);

				d3.selectAll('circle.point')
					.attr('r', 5)
					.style('fill', '#A0A0A0');

				var t = d3.select(this);

				t.style('fill', '#CB15B7')
				 .attr('r', 8)
				 .style('stroke-width', 2);
			});		
	}

	oPoint.transition()
		.duration(duration)
		.delay(function() { return delayStart + count * duration; })
		.ease('linear')
		.each('start', function() {
			d3.select(this)
				.attr('r', 8)
				.style('fill', '#6F5DBA')
				.style('stroke-width', 2);
		})
		.each('end', function() {
			d3.select(this)
				.attr('r', 5)
				.style('stroke-width', 1);
		})

}


function transitionSearch()
{
	var svg = d3.select('.box').select('svg');

	var rect = svg.selectAll('rect.bucket');
	rect.transition()
		.duration(1000)
		.delay(function(d, i) { return i === 0 ? 0 : 250; })
		.ease('linear')
		.style('fill', function(d) { return d.type === 'c' ? '#4682B8' : '#59CFCB'; })
		.style('fill-opacity', '0.5');


	frnn.pair("00", transitionPairs, 750, 500);
}

function drawRepeat()
{
	var width = 700, height = 525;
	var svg = d3.select('.box').select('svg');

	if (svg.empty())
	{
		svg = d3.select('.box')
			.append('svg')
			.attr('width', width)
			.attr('height', height);
	}

	var rectangles = [];
	for (var i = 0; i < Math.floor(width/r); i++) {
		for (var j = 0; j < Math.floor(height/r); j++) {
			rectangles.push({x: i, y: j, width: r, height: r});
		}
	}

	var rect = svg.selectAll('rect.bucket')
		.data(rectangles)
		.enter()
		.append('rect')
			.attr('id', function(d) { return 'bucket' + d.x + '' + d.y; })
			.attr('x', function(d) { return d.x*r; })
			.attr('y', function(d) { return d.y*r; })
			.attr('width', function(d) { return d.width; })
			.attr('height', function(d) { return d.height; })
			.attr('class', 'bucket')
			.style('fill', '#fff');	
}

function transitionRepeat()
{
	function toKey(bucket) {
		return bucket[0] + '' + bucket[1];
	}

	var width = 700, height = 525;
	var svg = d3.select('.box').select('svg');

	var delayStart = 0;
	var pointDuration = 250;
	for (var j = 0; j < Math.floor(height/r); j++) {
		for (var i = 0; i < Math.floor(width/r); i++) {
			var cbucket = toKey([i,j]);
			var fbuckets = frnn._getForwardBuckets([i,j]);

			var pairs = frnn.pair(cbucket, transitionPairs, delayStart, pointDuration);

			var rect = d3.select($('#bucket' + cbucket)[0])
				.attr('endTransitionDelay', pairs.length*pointDuration)
				.transition()
				.delay(delayStart)
				.style('fill', '#4682B8')
				.style('fill-opacity', '0.5')
				.each('end', function() {
					var delay = d3.select(this).attr('endTransitionDelay');

					d3.select(this)
						.transition()
						.delay(delay)
						.style('fill', '#fff')
						.style('fill-opacity', '1');
				});

			delayStart += pairs.length*pointDuration;
		}
	}
}

function drawEnd()
{

	function toKey(pair) {
		return pair.x + '' + pair.y;
	}

	var pairs = frnn.search();
	var neighbors = {};

	pairs.forEach(function(pair) {

		var p1 = pair[0];
		var p2 = pair[1];

		var key1 = toKey(p1);
		var key2 = toKey(p2);

		if (!(key1 in neighbors)) {
			neighbors[key1] = [p2];
		} else {
			neighbors[key1].push(p2);
		}

		if (!(key2 in neighbors)) {
			neighbors[key2] = [p1];
		} else {
			neighbors[key2].push(p1);
		}
	});

	function highlightRandomElement()
	{
		var pair = pairs[Math.floor(Math.random()*pairs.length)][0];
		var key = toKey(pair);

		var n = neighbors[key];

		d3.select($('#'+key)[0])
			.transition()
			.duration(1000)
			.each('start', function() {
				d3.select(this)
					.attr('r', '8')
					.style('stroke-width', '2')
					.style('fill', '#CB15B7');
			})
			.each('end', function() {
				d3.select(this)
					.attr('r', '5')
					.style('stroke-width', '1')
					.style('fill', '#A0A0A0');


				highlightRandomElement();
			});

		n.forEach(function(neighbor) {
			var key = toKey(neighbor);

			d3.select($('#'+key)[0])
			.transition()
			.duration(1000)
			.each('start', function() {
				d3.select(this)
					.attr('r', '8')
					.style('stroke-width', '2')
					.style('fill', '#6F5DBA');
			})
			.each('end', function() {
				d3.select(this)
					.attr('r', '5')
					.style('stroke-width', '1')
					.style('fill', '#A0A0A0');
			});

		});
	}

	highlightRandomElement();
}


function drawBuckets() 
{
	var width = 700, height = 525;
	var svg = d3.select('.box').select('svg');

	if (svg.empty())
	{
		svg = d3.select('.box')
			.append('svg')
			.attr('width', width)
			.attr('height', height);
	}

	var lines = [
		{x1: 175, y1: 0, x2: 175, y2: 525},
		{x1: 350, y1: 0, x2: 350, y2: 525},
		{x1: 525, y1: 0, x2: 525, y2: 525},
		{x1: 0, y1: 175, x2: 700, y2: 175},
		{x1: 0, y1: 350, x2: 700, y2: 350}
	];

	svg.selectAll('line.bucket')
		.data(lines)
		.enter()
		.append('line')
			.attr('x1', function(d) { return d.x1; })
			.attr('y1', function(d) { return d.y1; })
			.attr('x2', function(d) { return d.x2; })
			.attr('y2', function(d) { return d.y2; })
			.attr('stroke-dasharray', '5, 5')
			.attr('class', 'bucket');
}

function drawOverall() 
{
	var width = 700, height = 525;


	var svg = d3.select('.box').select('svg');

	if (svg.empty())
	{
		svg = d3.select('.box')
			.append('svg')
			.attr('width', width)
			.attr('height', height);
	}

	svg.append('rect')
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'bound-box');

	svg.selectAll('.point')
		.data(points)
		.enter()
		.append('circle')
			.attr('id', function(d) { return d.x + '' + d.y; })
			.attr('cx', function(d) { return d.x; })
			.attr('cy', function(d) { return d.y; })
			.attr('r', function(d) { return 5; })
			.attr('class', 'point');

	width = 75, height = 525;

	var svg = d3.select('.legend')
		.append('svg')
		.attr('width', width)
		.attr('height', height);

	svg.append('line')
		.attr('x1', 0)
		.attr('y1', 0)
		.attr('x2', 0)
		.attr('y2', r)
		.attr('class', 'r');

	svg.append('text')
		.attr('x', 20)
		.attr('y', 90)
		.attr('class', 'r')
		.text('r');
}