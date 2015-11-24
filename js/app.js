angular.module('Spent', [])
	.controller('SpentController', function ($scope) {
		$scope.categoryNames = ['Bills & Utilities', 'Food', 'Shopping', 'Health'];
		$scope.billsSubCatNames = ['Rent', 'Utilities', 'Misc Bills'];
		$scope.foodSubCatNames = ['Coffee', 'Restaurant', 'Groceries'];
		$scope.shoppingSubCatNames = ['Clothing', 'Electronics', 'Books', 'Sporting Goods', 'Misc'];
		$scope.healthSubCatNames = ['Dentist', 'Doctor', 'Eye Care', 'Gym', 'Pharmacy'];

		$scope.subCategoryOptions = [];

		$scope.index = 0;
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
			$scope.transactions[$scope.index] = {
				amount: $scope.amount,
				category: $scope.amtCategory,
				subCategory: $scope.amtSubCategory
			}

			$scope.categories[$scope.amtCategory].total += $scope.amount;
			$scope.categories[$scope.amtCategory].transactions.push($scope.index);

			$scope.subCategories[$scope.amtSubCategory].subTotal += $scope.amount;
			$scope.subCategories[$scope.amtSubCategory].transactions.push($scope.index);

			$scope.index++;

			console.log($scope.transactions, $scope.categories, $scope.subCategories);
		};

		$scope.setSubCatOptions = function () {
			console.log($scope.amtCategory);
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

		drawPlot();
		var slices = getSlices();
		var visDiv = $('#spent-vis');
		
		// for (var key in slices) {
		// 	$(slices[key]).click(function (data) {
		// 		console.log(data[0	]);
		// 		visDiv.data[0].labels = getClickData(key).labels;
		// 		visDiv.data[0].values = getClickData(key).values;
		// 		Plotly.redraw(visDiv);
		// 	});
		// }		

		function getPlotData() {
			var data = {
				labels: [],
				values: []
			}
			for (var key in $scope.categories) {
				var total = $scope.categories[key].total;
				if (total > 0) {
					data.labels.push(key);
					data.values.push(total);
				}
			}
			return data;
		}

		function drawPlot() {
			var visDiv = $('#spent-vis')[0],
				labels = getPlotData().labels,
				values = getPlotData().values,
				text = values.map(function(amt) {
					return '$' + amt;
				}),
				colors = ['#B4D5E0', '#E0E9E4', '#8CBDC1', '#54A9A9', '#8D7071'],

				data = [
					{	
						type: 'pie',
						labels: labels,
						values: values,
						text: text,
						opacity: 0.75,
						hole: 0.4,
						hoverinfo: 'label',
						textinfo: 'text',
						showlegend: false,
						marker : {
							colors: colors			
						}
					}
				],
				layout = {
					title: 'Spent by Categories',
					height: 500,
					width: 500
				};
			Plotly.newPlot(visDiv, data, layout);
		}

		function getSlices() {
			var chart = $('.slice');
			var slices = {};
			var infoLabels = getPlotData().labels;
			for (var i = 0; i < infoLabels.length; i++) {
				slices[infoLabels[i]] = chart[i];
			}
			return slices;
		}

		function getClickData(key) {
			var data = {
				labels: [],
				values: []
			}
			var subCats = $scope.categories[key].subCategories;
			subCats.forEach(function (subCat) {
				var subTotal = $scope.subCategories[subCat].subTotal;
				if (subTotal > 0) {
					data.labels.push(subCat);
					data.values.push(subTotal);
				}
			});

			return data;
		}



		var billsSlice = slices[0];
		var billCats = ['Rent', 'Utilities'];
		var billAmounts = ['727', '43'];
		var billText = billAmounts.map(function (amt) {
			return '$' + amt;
		});

		// var shoppingSlice = slices[2];
		// var healthSlice = slices[3];
		// var Services = slices[4];

		$(billsSlice).click(function (data) {
			visDiv.data[0].labels = billCats;
			visDiv.data[0].values = billAmounts;
		
			Plotly.redraw(visDiv); 
		});
	});

