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

  $http.get('/users/d9922e8a646863d7c6000000/posts.json').success(function(data) {
    $scope.posts = data.posts;
  });

//	$scope.posts = [
//		generatePost(),
//		generatePost(),
//		generatePost(),
//		generatePost()
//	];

	$scope.format = function(text, tags) {
		return '<h2>' + text + '</h2>';
	};

	$scope.nextPage = function() {
		$scope.posts.push(generatePost());
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
