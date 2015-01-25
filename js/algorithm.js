function FRNN(points, r)
{
	this.points = points;
	this.r = r;
	this.buckets = {};
	var buckets = this.buckets;
	

	(function build() {
		this.points.forEach(function(point) {
			var key = FRNN.prototype._toKey(point);

			if (!(key in buckets)) {
				buckets[key] = [point];
			} else {
				buckets[key].push(point);
			}
		});
	})();
}

FRNN.prototype._toKey = function(point) {
	var i1 = Math.floor(point.x/r);
	var i2 = Math.floor(point.y/r);

	return i1 + "" + i2;
}

FRNN.prototype._distance = function(p1, p2) {
	return (p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y);
}

FRNN.prototype._getForwardBuckets = function(bucket) {
	var buckets = this.buckets;
	var i1 = parseInt(bucket[0]);
	var i2 = parseInt(bucket[1]);

	var topRight = (i1 + 1) + "" + (i2 - 1);
	var right = (i1 + 1) + "" + i2;
	var bottomRight = (i1 + 1) + "" + (i2 + 1);
	var bottom = (i1) + "" + (i2 + 1);

	var potentials = [topRight, right, bottomRight, bottom]
	var forwards = []

	potentials.forEach(function(p) {
		if (p in buckets) forwards.push(p);
	});

	return forwards;
}

FRNN.prototype.pair = function(bucket, callback, delay, duration) {
	var neighbors = this._getForwardBuckets(bucket);
	neighbors.push(bucket);

	var pairs = [];

	var b = this.buckets[bucket];

	var count = 0;
	for (var i = 0; i < b.length; i++) {
		var point = b[i];

		for (var j = 0; j < neighbors.length; j++) {

			var neighborPoints = this.buckets[neighbors[j]];

			for (var k = 0; k < neighborPoints.length; k++) {
				var npoint = neighborPoints[k];

				if (point === npoint) continue;

				var distance = this._distance(point, npoint);
				if (distance <= (this.r*this.r)) {

					if (!(callback == undefined)) callback(point, npoint, count, delay, duration);

					pairs.push([point, npoint]);
					count++;
				}
			}
		}
	}

	return pairs;
}

FRNN.prototype.search = function() {
	var buckets = this.buckets;

	var keys = Object.keys(buckets).sort();

	var allPairs = [];
	for (var i = 0; i < keys.length; i++) {
		var bucket = keys[i];
		var pairs = this.pair(bucket);

		pairs.forEach(function(p) {
			allPairs.push(p);
		})
	}
	return allPairs;
}