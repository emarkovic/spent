angular.module('Spent', [])
	.controller('SpentController', function ($scope) {
		$scope.categoryNames = ['Bills & Utilities', 'Food', 'Shopping', 'Health'];
		$scope.billsSubCatNames = ['Rent', 'Utilities', 'Misc Bills'];
		$scope.foodSubCatNames = ['Coffee', 'Restaurant', 'Groceries'];
		$scope.shoppingSubCatNames = ['Clothing', 'Electronics', 'Books', 'Sporting Goods', 'Misc'];
		$scope.healthSubCatNames = ['Dentist', 'Doctor', 'Eye Care', 'Gym', 'Pharmacy'];
		$scope.subCategoryOptions = [];
		$scope.index = 9;
		$scope.transactions = {
			0 : {
				amount: 727,
				category: 'Bills & Utilities',
				subCategory: 'Rent'
			},
			1 : {
				amount: 43,
				category: 'Bills & Utilities',
				subCategory: 'Utilities'
			},
			2 : {
				amount: 100,
				category: 'Bills & Utilities',
				subCategory: 'Misc Bills'
			},
			3 : {
				amount: 10,
				category: 'Food',
				subCategory: 'Restaurant'
			},
			4 : {
				amount: 20,
				category: 'Food',
				subCategory: 'Restaurant'
			},
			5 : {
				amount: 4,
				category: 'Food',
				subCategory: 'Coffee'
			},
			6 :{
				amount: 35,
				category: 'Food',
				subCategory: 'Groceries'
			},
			7 : {
				amount: 40,
				category: 'Shopping',
				subCategory: 'Electronics'
			},
			8 : {
				amount: 50,
				category: 'Health',
				subCategory: 'Doctor'
			}
		};
		$scope.categories = {
			'Bills & Utilities' : {
				total: 870,
				transactions : [0, 1, 2],
				subCategories : ['Rent', 'Utilities', 'Misc Bills']
			},
			'Food' : {
				total: 69,
				transactions: [3, 4, 5, 6],
				subCategories: ['Coffee', 'Restaurant', 'Groceries']
			},
			'Shopping' : {
				total: 40,
				transactions: [7],
				subCategories: ['Clothing', 'Electronics', 'Books', 'Sporting Goods', 'Misc']
			},
			'Health' : {
				total: 50,
				transactions: [8],
				subCategories: ['Dentist', 'Doctor', 'Eye Care', 'Gym', 'Pharmacy']
			},
		};

		$scope.subCategories = {
			'Rent' : {
				subTotal: 727,
				transactions : [0],
				categories : ['Bills & Utilities']
			},
			'Utilities' : {
				subTotal: 43,
				transactions : [1],
				categories : ['Bills & Utilities']
			},
			'Misc Bills' : {
				subTotal: 100,
				transactions : [2],
				categories : ['Bills & Utilities']
			},

			'Coffee' : {
				subTotal: 4,
				transactions : [5],
				categories : ['Food']
			},
			'Restaurant' : {
				subTotal: 30,
				transactions : [3, 4],
				categories : ['Food']
			},
			'Groceries' : {
				subTotal: 35,
				transactions : [6],
				categories : ['Food']
			},

			'Clothing' : {
				subTotal: 0,
				transactions : [],
				categories : ['Shopping']
			},
			'Electronics' : {
				subTotal: 40,
				transactions : [7],
				categories : ['Shopping']
			},
			'Books' : {
				subTotal: 0,
				transactions : [],
				categories : ['Shopping']
			},
			'Sporting Goods' : {
				subTotal: 0,
				transactions : [],
				categories : ['Shopping']
			},
			'Misc' : {
				subTotal: 0,
				transactions : [],
				categories : ['Shopping']
			},

			'Dentist' : {
				subTotal: 0,
				transactions : [],
				categories : ['Health']
			},
			'Doctor' : {
				subTotal: 50,
				transactions : [8],
				categories : ['Health']
			},
			'Eye Care' : {
				subTotal: 0,
				transactions : [],
				categories : ['Health']
			},
			'Gym' : {
				subTotal: 0,
				transactions : [],
				categories : ['Health']
			},
			'Pharmacy' : {
				subTotal: 0,
				transactions : [],
				categories : ['Health']
			}
		}

		$scope.addTransaction = function () {
			$scope.showTransactions = false;
			$scope.onSubCat = false;
			$scope.transactions[$scope.index] = {
				amount: $scope.amount,
				category: $scope.amtCategory,
				subCategory: $scope.amtSubCategory,
				location: $scope.amtLocation,
				description: $scope.amtDescription
			}

			$scope.categories[$scope.amtCategory].total += parseInt($scope.amount);
			$scope.categories[$scope.amtCategory].transactions.push($scope.index);

			$scope.subCategories[$scope.amtSubCategory].subTotal += parseInt($scope.amount);
			$scope.subCategories[$scope.amtSubCategory].transactions.push($scope.index);
			
			$scope.amount = null;
			$scope.amtCategory = null;
			$scope.amtSubCategory = null;
			$scope.amtLocation = null;
			$scope.amtDescription = null;

			$scope.index++;	

			clearChart();
			redrawChart(getCategoryData());
		};

		$scope.setSubCatOptions = function () {
			switch ($scope.amtCategory) {
				case 'Bills & Utilities':
					$scope.subCategoryOptions = $scope.billsSubCatNames;
					break;
				case 'Food':
					$scope.subCategoryOptions = $scope.foodSubCatNames;
					break;
				case 'Shopping':
					$scope.subCategoryOptions = $scope.shoppingSubCatNames;
					break;
				case 'Health':
					$scope.subCategoryOptions = $scope.healthSubCatNames;
					break;
				default:
					$scope.subCategoryOptions = [];
			}
		};

		$scope.ctx = $('#spent-vis').get(0).getContext("2d");			
		$scope.chart = new Chart($scope.ctx).Doughnut(getCategoryData(), getOptions());
		$scope.onSubCat = false;
		$scope.showTransactions = false;

		$('#spent-vis').click(function (event) {
			var activePts = $scope.chart.getSegmentsAtEvent(event);
			
			if (activePts.length === 0 && $scope.onSubCat) { //nothing was clicked
				$scope.onSubCat = false;
				$scope.showTransactions = false;
				$scope.$apply();
				clearChart();
				redrawChart(getCategoryData());
			} else if (activePts.length != 0 && $scope.onSubCat) { //a subcategory was clicked
				$scope.showTransactions = true;				
				$scope.transactionName = activePts[0].label;
				console.log(activePts[0].label)
				$scope.transactionsForShow = getTransactions(activePts[0].label);
				console.log($scope.transactionsForShow);
				$scope.$apply();
			} else if (activePts.length != 0 && !$scope.onSubCat) { //a category was clicked
				$scope.onSubCat = true;
				var selectedCategory = activePts[0].label;	
				clearChart();
				redrawChart(getSubCategoryData(selectedCategory));
			}			
		})

		function getCategoryData() {
			var data = [];
			var colors = ['#B4D5E0', '#E0E9E4', '#8CBDC1', '#54A9A9', '#8D7071'];
			var index = 0;
			Object.keys($scope.categories).forEach(function (key) {
				data.push({
					value: $scope.categories[key].total,					
					color: colors[index],
					label: key
				});
				index++;
			});
			return data;
		}

		function getSubCategoryData(category) {
			var data = [];
			var colors = ['#B4D5E0', '#E0E9E4', '#8CBDC1', '#54A9A9', '#8D7071'];
			var index = 0;
			var subCategories = $scope.categories[category].subCategories;
			subCategories.forEach(function (subCat) {
				data.push({
					value: $scope.subCategories[subCat].subTotal,
					color: colors[index],
					label: subCat
				});
				index++;
			});
			return data;
		}

		function getTransactions(subCategory) {
			var transForShow = [];
			console.log($scope.subCategories[subCategory]);
			var trans = $scope.subCategories[subCategory].transactions;

			trans.forEach(function (index) {
				transForShow.push($scope.transactions[index]);
			});
			console.log(transForShow);
			return transForShow;
		}

		function getOptions() {
			return {
			    //Boolean - Whether we should show a stroke on each segment
			    segmentShowStroke : true,

			    scaleShowLabels: true,

			    //String - The colour of each segment stroke
			    segmentStrokeColor : "#fff",

			    //Number - The width of each segment stroke
			    segmentStrokeWidth : 2,

			    //Number - The percentage of the chart that we cut out of the middle
			    percentageInnerCutout : 40, // This is 0 for Pie charts

			    //Number - Amount of animation steps
			    animationSteps : 100,

			    //String - Animation easing effect
			    animationEasing : "easeOutBounce",

			    //Boolean - Whether we animate the rotation of the Doughnut
			    animateRotate : true,

			    //Boolean - Whether we animate scaling the Doughnut from the centre
			    animateScale : false,

			    //String - A legend template
			    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
			}	
		}

		function clearChart() {
			var length = $scope.chart.segments.length;
			for (var i = 0; i < length; i++) {
				$scope.chart.removeData(0);
			}
		}

		function redrawChart(data) {			
			data.forEach(function (segmentData) {				
				$scope.chart.addData(segmentData);
			});
		}
	});

