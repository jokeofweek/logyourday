var POST_DATE = 'Post Date';

var module = angular.module('lyd');

module.controller('PostListCtrl', ['$scope', '$http', function($scope, $http) {

  $http.get('/posts.json').success(function(data) {
    $scope.posts = data;
  });

  $scope.message = '';

  $scope.transform = function(str, tagsObj) {
  	// Swap tagsObj to be denormalized => normalized
  	var tags = {};
    for (var key in tagsObj) {
      tags[tagsObj[key]] = key;
    }
    // Add the I in the front
    str = "I " + str.trim();
		// Replace all hashtags with links.
		str = str.replace(/[#]+[A-Za-z0-9-_]+/g, function(hash) {
			// Only replace the hash if it's in the set of tags.
			if (hash && tags[hash]) {
				return '<a target="_self" href=/graph/' + encodeURIComponent(tags[hash]) + ' class="tag_link">' + hash + '</a>';
			} else {
				return hash;
			}
		});
		// Replace all words with links.
    var tagReplacer =  function(tag) {
      if (tag && tag.length > 0 && tag.charAt(0) != '#' && tags[tag]) {
        return '<a target="_self" href=/graph/' + encodeURIComponent(tags[tag]) + ' class="tag_link">' + tag + '</a>';
      } else {
        return tag;
      }
    }; 
    str = str.replace(/(\w+)/g, tagReplacer);
    return str.trim();
  };

  $scope.relativeTime = function(time) {
  	return moment(time).fromNow();
  };

  $scope.onSubmit = function() {
    if ($scope.message) {
      $http.post('/posts', {
        message: $scope.message,
        utf8: "\u2713",
        authenticity_token: document.getElementById('authenticity_token').value
      }).success(function(data) {
        $scope.message = '';
        $scope.posts.unshift(data['post']);
      });
    }
    return false;
  };

  $scope.nextPage = function() {
		$scope.posts.push(generatePost());
  };

}]);

module.controller('PostGraphCtrl', ['$scope', '$http', function($scope, $http) {

  // Fetch tags and transform to checklist form.
  $http.get('/users/tags.json').success(function(data) {
    // Get the preset tags.
    var preset = document.getElementById('preset-tags').value;
    // Remove root object
    data = data ? data['tags'] : [];
    // Convert
    var tags = [];
    for (var i = 0, l = data.length; i < l; i++) {
      tags.push({name: data[i], checked: data[i] == preset});
    }
    $scope.tags = tags;
  });
  // Fetch units 
  $http.get('/users/units.json').success(function(data) {
    var units = data ? data['units'] : []
    units.unshift(POST_DATE);
    $scope.units = units;
  });

  $scope.yAxis = undefined;
  $scope.xAxis = undefined;

  var getFilterString = function() {
    var filters = [];
    // Find all checked tags.
    for (var i = 0, l = $scope.tags.length; i < l; i++) {
      if ($scope.tags[i].checked) {
        filters.push(encodeURIComponent($scope.tags[i].name));
      }
    }
    // If we have axes and they're not the date, then add in.
    if ($scope.xAxis && $scope.xAxis != POST_DATE) {
      filters.push(encodeURIComponent($scope.xAxis));
    }
    if ($scope.yAxis && $scope.yAxis != POST_DATE) {
      filters.push(encodeURIComponent($scope.yAxis));
    }

    return filters.join(',');
  };

  $scope.updateGraph = function() {
    // Only update when we have a value in both axes.
    if ($scope.yAxis && $scope.xAxis) {
      var filterString = getFilterString();
      if (filterString.length) {
        $http.get('/posts/tag/' + filterString + '.json').success(function(data) {
          renderGraph(data);
        });
      }
    }
  };

  function getAxisValue(row, axis) {
    if (axis == POST_DATE) {
      return new Date(row.created_at);
    } else {
      // Find the metric in the row
      for (var i = 0, l = row.metrics.length; i < l; i++) {
        if (row.metrics[i][1] == axis) {
          return Number(row.metrics[i][0]);
        }
      }
    }
  };

  // Style issues
  var width = 500;
  var height = 500;
  var padding = 30;

  function getScale(key, axis, dataset, rangeL, rangeR) {
    // Special time scale for POST_DATE
    if (axis == POST_DATE) {
      var minDate = d3.min(dataset, function(d) { return d[key]; });
      minDate.setDate(minDate.getDate() - 1);
      var maxDate = d3.max(dataset, function(d) { return d[key]; });

      return d3.time.scale().
        domain([minDate, maxDate]).
        range([rangeL, rangeR]);
    } else {
      return d3.scale.linear().
        domain([0, d3.max(dataset, function(d) { return d[key]; })]).
        range([rangeL, rangeR]);
    }
  };

  function getAxis(axis, scale, orient) {
    // Special axis for POST_DATE
    if (axis == POST_DATE) {
      return d3.svg.axis().
        scale(scale).
        orient(orient).
        tickFormat(d3.time.format("%d %b")).
        ticks(6);
    } else {
      return d3.svg.axis().
        scale(scale).
        orient(orient).
        tickFormat(function (d) { return d; }).
        tickSize(5, 5, 0).
        ticks(6);
    }
  };

  function renderGraph(data) {
    var dataSet = [];
    // Generate all points
    for (var i = 0, l = data.length; i < l; i++) {
      var obj = {
        x: getAxisValue(data[i], $scope.xAxis),
        y: getAxisValue(data[i], $scope.yAxis)
      };

      // Make sure it had both metrics
      if (!obj.x || !obj.y) {
        continue;
      }

      dataSet.push(obj);
    }

    var xScale = getScale('x', $scope.xAxis, dataSet, padding, width - padding);
    var yScale = getScale('y', $scope.yAxis, dataSet, height - padding, padding);

    var xAxis = getAxis($scope.xAxis, xScale, 'bottom');
    var yAxis = getAxis($scope.yAxis, yScale, 'left');

    // Remove old svg.
    d3.select('#graph-area svg').remove();
    var svg = d3.select("#graph-area").
      append("svg").
      attr("viewBox", "0 0 " + width + " " + height);

    svg.append("g").
      attr("class", "axis x-axis").
      attr("transform", "translate(0," + (height - padding) + ")").
      call(xAxis);

    svg.append("g").
      attr("class", "axis y-axis").
      attr("transform", "translate(" + padding + ",0)").
      call(yAxis)

    // draw line graph
    var line = d3.svg.line()
      .x(function(d) { 
          return xScale(d.x); 
      })
      .y(function(d) { 
          return yScale(d.y); 
      });


    svg.append("svg:path").attr("d", line(dataSet));

    // plot circles
    svg.selectAll("circle")
      .data(dataSet)
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .attr("cx", function(d) {
          return xScale(d.x);
      })
      .attr("cy", function(d) {
          return yScale(d.y);
      })
      .attr("r", 5)

  };
}]);