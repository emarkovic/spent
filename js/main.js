angular.module('Spent', ['ui.router', 'chart.js'])
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
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('main', {
				url: '/main',
				templateUrl: 'views/main.html',
				controller: 'MainController'
			})
			.state('main.overview', {
				url: '/overview',
				templateUrl: 'views/overview.html',
				controller: 'OverviewController'
			})
			.state('main.transactions', {
				url: '/transactions',
				templateUrl: 'views/transactions.html',
				controller: 'TransactionController'
			})
			.state('main.budgets', {
				url: '/budgets',
				templateUrl: 'views/budgets.html',
				controller: 'BudgetsController'
			});
		$urlRouterProvider.otherwise('/main/overview');			
	})
	.controller('MainController', ['$scope', function($scope){
		
	}])
	.controller('OverviewController', ['$scope', function($scope){
		
	}])
	.controller('TransactionController', ['$scope', 'dataService', function($scope, dataService){
		$scope.date = Date.now().toString();
		$scope.displayName = 'all transactions';
		$scope.categoryNames = ['Bills & Utilities', 'Food', 'Shopping', 'Health'];
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
					$scope.subCategoryOptions = dataService.getHealthSubCategories();
					console.log($scope.subCategoryOptions);
					break;
				default:
					$scope.subCategoryOptions = [];
			}
		};

		$scope.labels = $scope.categoryNames;
		$scope.data = _.pluck(dataService.getCategories(), 'total');
		

	}])
	.controller('BudgetsController', ['$scope', function($scope){
		
	}])