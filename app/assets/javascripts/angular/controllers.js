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
				return '<a href="#" class="tag_link">' + hash + '</a>';
			} else {
				return hash;
			}
		});
		// Replace all words with links.
		str = str.replace(/(\w+)/g, function(tag) {
			if (tag && tag.length > 0 && tag.charAt(0) != '#' && tags[tag]) {
				return '<a href="#" class="tag_link">' + tag + '</a>';
			} else {
				return tag;
			}
		});
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
    // Remove root object
    data = data ? data['tags'] : [];
    // Convert
    var tags = [];
    for (var i = 0, l = data.length; i < l; i++) {
      tags.push({name: data[i], checked: false});
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
        filters.push($scope.tags[i].name);
      }
    }
    // If we have axes and they're not the date, then add in.
    if ($scope.xAxis && $scope.xAxis != POST_DATE) {
      filters.push($scope.xAxis);
    }
    if ($scope.yAxis && $scope.yAxis != POST_DATE) {
      filters.push($scope.yAxis);
    }
    return filters.join(',');
  };

  $scope.updateAxis = function(str) {
    // Only update when we have a value in both axes.
    if ($scope.yAxis && $scope.xAxis) {
      var filterString = getFilterString();
      if (filterString.length) {
        $http.get('posts/tag/' + filterString + '.json').success(function(data) {

        });
      }
      
    }
  };
}]);

/*
var CategoryListCtrl = ['$scope', '$http', function($scope, $http) {
	var url = 'categories';
	var query = '?sort=name';

	$http.get('proxy.php?q=' + Base64.encode(url + query)).success(function(data) {
		$scope.categories = data.categories;
	});
	
	$scope.search = function() {
		var parameters = '';
		
		if ($scope.query !== '') {
			
			parameters = '(name=' + encodeParameter($scope.query) + '*)';
		}
		
		$http.get('proxy.php?q=' + Base64.encode(url + parameters + query)).success(function(data) {
			$scope.categories = data.categories;
		});
	};
	
	$scope.orderProp = 'name';
}];
*/
