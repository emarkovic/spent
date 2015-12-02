angular.module('Spent', [])
	.service('dataService', function () {
		this.getBillSubCategories = function () {
			return ['Rent', 'Utilities', 'Misc Bills'];
		};

		this.getFoodSubCategories = function () {
			return ['Coffee', 'Restaurant', 'Groceries'];
		};

		this.getShoppingSubCategories = function() {
			return ['Clothing', 'Electronics', 'Books', 'Sporting Goods', 'Misc'];
		};

		this.getHealthSubCategories = function () {
			return ['Dentist', 'Doctor', 'Eye Care', 'Gym', 'Pharmacy'];
		};

		this.getTransactions = function () {
			return {
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
		};

		this.getCategories = function () {
			return {
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
		};

		this.getSubCategories = function () {
			return {
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
			};
		};

	})
	.controller('SpentController', function ($scope, dataService) {	
		var transactions = JSON.parse(localStorage.getItem('transactions')) || dataService.getTransactions(),
			categories = JSON.parse(localStorage.getItem('categories')) || dataService.getCategories(),
			subCategories = JSON.parse(localStorage.getItem('subCategories')) || dataService.getSubCategories();
		$scope.categoryNames = ['Bills & Utilities', 'Food', 'Shopping', 'Health'];		
		$scope.index = localStorage.getItem('index') || 9;
		$scope.subCategoryOptions = [];	
		$scope.transactionsForShow = transactions;
		$scope.onSubCat = false;


		$scope.addTransaction = function () {
			$scope.onSubCat = false;
			transactions[$scope.index] = {
				amount: $scope.amount,
				category: $scope.amtCategory,
				subCategory: $scope.amtSubCategory,
				location: $scope.amtLocation,
				description: $scope.amtDescription
			}

			categories[$scope.amtCategory].total += parseInt($scope.amount);
			categories[$scope.amtCategory].transactions.push($scope.index);

			subCategories[$scope.amtSubCategory].subTotal += parseInt($scope.amount);
			subCategories[$scope.amtSubCategory].transactions.push($scope.index);						

			$scope.amount = null;
			$scope.amtCategory = null;
			$scope.amtSubCategory = null;
			$scope.amtLocation = null;
			$scope.amtDescription = null;

			$scope.transactionsForShow = transactions;
			$scope.transactionName = null;

			$scope.index++;	

			save();

			clearChart();
			redrawChart(getCategoryData());
		};

		$scope.setSubCatOptions = function () {
			switch ($scope.amtCategory) {
				case 'Bills & Utilities':
					$scope.subCategoryOptions = dataService.getBillSubCategories();
					break;
				case 'Food':
					$scope.subCategoryOptions = dataService.getFoodSubCategories();
					break;
				case 'Shopping':
					$scope.subCategoryOptions = dataService.getShoppingSubCategories();
					break;
				case 'Health':
					$scope.subCategoryOptions = dataService.getShoppingSubCategories();
					break;
				default:
					$scope.subCategoryOptions = [];
			}
		};
		//Since the chart is a canvas element, we must get the context in order to initialize 
		//our chart.
		$scope.ctx = $('#spent-vis').get(0).getContext("2d");			
		//Initializes a new chart using the context we fetched
		//chart.js provides some helper function for initializing the type of chart you might want
		//Here I chose a Doughnut chart. This function takes two parameters which are the chart data 
		//and chart options. The chart data must be an array of objects
		$scope.chart = new Chart($scope.ctx).Doughnut(getCategoryData(), getOptions());
		$scope.onSubCat = false;

		//Chart js supports click events. Attach a click event on the canvas element in which your 
		//chart lives and pass in "event" to the callback function. 
		//Chart js provides the chart.getSegmentsAtEvent(event) which returns an array. This pretty 
		//much tells you what you just clicked on. If you did not click on any part of the chart
		//but you did click on the canvas, this array will have a length of zero.
		//To find the name of the chart segment that was clicked do:
		//	chart.getSegmentsAtEvent(event)[0].label;
		$('#spent-vis').click(function (event) {
			var activePts = $scope.chart.getSegmentsAtEvent(event);

			//Here I am checking if any segment was clicked by checking if the 
			//segment at event array is of length 0
			if (activePts.length === 0 && $scope.onSubCat) { 
				$scope.onSubCat = false;

				$scope.transactionName = null;
				$scope.transactionsForShow = transactions;

				
				clearChart();
				redrawChart(getCategoryData());
			} else if (activePts.length != 0 && $scope.onSubCat) { //a subcategory was clicked
				//show transactions for a subcategory		 
				$scope.transactionName = activePts[0].label;				
				$scope.transactionsForShow = getTransactionsData(subCategories);
			} else if (activePts.length != 0 && !$scope.onSubCat) { //a category was clicked
				//show transactions for a category
				$scope.onSubCat = true;

				$scope.transactionName = activePts[0].label;	
				$scope.transactionsForShow = getTransactionsData(categories);			

				clearChart();
				redrawChart(getSubCategoryData($scope.transactionName));
			}	
			$scope.$apply();		
		});
/*
		This function is called to get the right data for the initialization of the chart.
		You must include the value of the segment you want and the label, key, color, along 
		with other options.
		Data is in this format
			var data = [
				{
					value: value,
					color: color,
					label: label
				},
				{
					value: value,
					color: color,
					label: label
				}
			]
		Each object in this array becomes a segment in the chart.
*/
		function getCategoryData() {
			var data = [];
			var colors = ['#B4D5E0', '#E0E9E4', '#8CBDC1', '#54A9A9', '#8D7071'];
			var index = 0;
			Object.keys(categories).forEach(function (key) {
				data.push({
					value: categories[key].total,					
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
			var subCategoriesTemp = categories[category].subCategories;
			subCategoriesTemp.forEach(function (subCat) {
				data.push({
					value: subCategories[subCat].subTotal,
					color: colors[index],
					label: subCat
				});
				index++;
			});
			return data;
		}

		function getTransactionsData(object) {
			var transForShow = [];
			var trans = object[$scope.transactionName].transactions;
			trans.forEach(function (index) {
				transForShow.push(transactions[index]);
			});
			return transForShow;
		}

		//These are the options required for initializing a chart. A complete list 
		//is found here: http://www.chartjs.org/docs/#getting-started-global-chart-configuration.
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
			    animationEasing : "easeInOutCubic",

			    //Boolean - Whether we animate the rotation of the Doughnut
			    animateRotate : true,

			    //Boolean - Whether we animate scaling the Doughnut from the centre
			    animateScale : false
			}
		}

		function clearChart() {
			//get the number of segments in the chart
			var length = $scope.chart.segments.length;
			for (var i = 0; i < length; i++) {	
				//You can clear the data in a chart by doing chart.removeData(index).
				//This function removes one segment of data at a time. You can get all
				//of the charts segments by doing chart.segments.length as I did above.
				$scope.chart.removeData(0);
			}
		}

		function redrawChart(data) {			
			data.forEach(function (segmentData) {	
				//You can add additional data to your chart by doing
				//chart.addData(data).
				//This adds one segment of data at a time so only pass it a single
				//object.
				$scope.chart.addData(segmentData);
			});
		}

		function save() {
			localStorage.setItem('transactions', JSON.stringify(transactions));
			localStorage.setItem('categories', JSON.stringify(categories));
			localStorage.setItem('subCategories', JSON.stringify(subCategories));
			localStorage.setItem('index', JSON.stringify($scope.index));
		}

	});

