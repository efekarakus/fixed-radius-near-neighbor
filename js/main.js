function clear() {

	function removeTransition() {
		d3.selectAll('.point')
			.transition()
			.duration(0);
	}

	function removeExplanation() {
		$(".explanation").html('');
	}

	function removeSearch() {
		var svg = d3.select('.vis').select('svg');
		svg.selectAll('rect.bucket').remove();
	}

	function removeBuckets() {
		var svg = d3.select('.vis').select('svg');
		svg.selectAll('line.bucket').remove();
	}

	function removeOverall() {
		var svg = d3.select('.vis').selectAll('svg');
		svg.remove();
	}

	removeTransition();

	removeExplanation();
	removeSearch();
	removeBuckets();
	removeOverall();
}

function writeDefition() {
	$(".explanation").html(
		"Given a set of points and a distance <i>r</i> > 0, report all pairs of distinct points <i>p, q ∈ P</i> such that" +
		" the distance between them is less than or equal to <i>r</i>, i.e. |<i>pq</i>| ≤ <i>r</i>"
	);
}

function writeBucket() {
	$(".explanation").html(
		"Create a square grid of side length <i>r</i>. Each grid is given an index and can be thought of as a bucket of points. Store" +
		" the indices in a hashtable. The points in a bucket can be stored in an unordered list."
	);
}

function writeSearch() {
	$(".explanation").html(
		"For a bucket <span class='cbucket'>b</span>, search <span class='cbucket'>b</span> and its <span class='fbucket'>forward</span> buckets.<br/>" + 
		"For all points <i>x</i> in <span class='cbucket'>b</span>, find <i>x'</i> such that <i>|xx'| ≤ r</i>"
	);
}

function writeRepeat() {
	$(".explanation").html(
		"Repeat step 3 for every bucket."
	);
}

function writeEnd() {
	$(".explanation").html(
		"All pairs of points are highlighted below."
	);
};


$(document).ready(function() {

	function isActive(name) {
		var active = $(".subnav.active");
		return active.attr('id') === name;
	}

	function changeActive(name) {
		var active = $(".subnav.active");
		var newActive = $("#" + name);

		active.removeClass('active');
		newActive.addClass('active');
	}

	clear();
	writeDefition();

	drawOverall();

	$("#definition").click(function() {
		if (isActive("definition")) return;

		clear();
		writeDefition();

		drawOverall();

		changeActive("definition");
	});

	$("#bucket").click(function() {
		if (isActive("bucket")) return;

		clear();
		writeBucket();

		drawBuckets();
		drawOverall();

		changeActive("bucket");
	});

	$("#search").click(function() {
		if (isActive("search")) return;

		clear();
		writeSearch();

		drawSearch();
		drawBuckets();
		drawOverall();

		transitionSearch();

		changeActive("search");
	});

	$("#repeat").click(function() {
		if (isActive("repeat")) return;

		clear();
		writeRepeat();

		drawRepeat();
		drawBuckets();
		drawOverall();

		transitionRepeat();

		changeActive("repeat");
	});

	$("#end").click(function() {
		if (isActive("end")) return;

		clear();
		writeEnd();

		drawOverall();

		drawEnd();

		changeActive("end");
	});
});