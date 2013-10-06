var words = ["be","am","is","are","was, were","been","bear","bore","borne","beat","beat","beaten","become","became","become","beget","begot","begotten)","begin","began","begun","bend","bent","bent","bet","bet","bet","beware","defective verb","bid","bid","bid","bid","bade","bid","bidden","bid","bide","bided","bode","bided","bidden","bind","bound","bound","bite","bit","bitten","bleed","bled","bled","blow","blew","blown","break","broke","broken","breed","bred","bred","bring","brought","brought","build","built","built","burn","burnt","burned","burnt","burned","burst","burst","burst","buy","bought","bought","can","could","cast","cast","cast","catch","caught","caught","choose","chose","chosen","clad","clad","cladded","clad","cladded","cleave","clove","cleft","cloven","cleft","cling","clung","clung","come","came","come","cost","cost","cost","creep","crept","creeped","crept","creeped","crow","crowed","crew","crowed","cut","cut","cut","dare","dared","deal","dealt","dealt","dig","dug","dug","dive","dived","dove","dived","do","does","did","done","drag","dragged","drug","dragged","drug","draw","drew","drawn","dream","dreamed","dreamt","dreamed","dreamt","drink","drank","drunk","drive","drove","driven","dwell","dwelt","dwelled","dwelt","dwelled","eat","ate","eaten","fall","fell","fallen","feed","fed","fed","feel","felt","felt","fight","fought","fought","find","found","found","fit","fit","fitted","fit","fitted","flee","fled","fled","fling","flung","flung","fly","flew","flown","forbid","forbade","forbid","forbidden","forget","forgot","forgotten","forsake","forsook","forsaken","freeze","froze","frozen","get","got","gotten","got","gild","gilded","gilt","gilded","gilt","give","gave","given","go","went","gone","grind","ground","ground","grow","grew","grown","hang","hung","hanged","hung","hanged","have (has)","had","had","hear","heard","heard","hew","hewed","hewn","hewed","hide","hid","hidden","hit","hit","hit","hoist","hoist","hoisted","hoist","hoisted","hold","held","held","hurt","hurt","hurt","keep","kept","kept","kneel","knelt","kneeled","knelt","kneeled","knit","knit","knitted","knit","knitted","know","knew","known","lay","laid","laid","lead","led","led","lean","leaned","leant","leaned","leant","leap","leaped","leapt","leaped","leapt","learn","learned","learnt","learned","learnt","leave"];

var generatePost = function() {

	var id = Math.floor(Math.random() * 100000);
	var text = '';
	var tags = [];
	for (var i = 0, l = Math.ceil(Math.random() * 15); i < l; i++) {
		var word = words[Math.floor(Math.random() * words.length)];
		if (tags.length < 3) {
			tags.push(word);
		}
		text += word + ' ';
	}
	text = text.trim();

	return {
		id: id, 	
		text: text,
		date: new Date(new Date().getTime() * Math.random()),
		tags: tags
	};

};

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
    units.unshift('Post Date');
    $scope.units = units;
  });

  $scope.yAxis = undefined;
  $scope.xAxis = undefined;

  $scope.updateAxis = function(str) {
    console.log($scope.yAxis);
    console.log($scope.xAxis);
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
