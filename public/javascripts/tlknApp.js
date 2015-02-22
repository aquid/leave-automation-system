angular.module('development',[]).constant('appConifg',{apiURL:'http://localhost:3000'})
//-----------------------------------------*********************************---------------------------------------//
var Tlkn = angular.module('Tlkn',['ngCookies','ngRoute','ngTable','ui.bootstrap','development']);
//-----------------------------------------*********************************---------------------------------------//
Tlkn.config(['$routeProvider',function($routeProvider){
	$routeProvider
	.when('/',{
		controller : 'LoginController',
		templateUrl: '/partials/login.html'
	})
	.when('/home',{
		controller : 'HomeController',
		templateUrl: '/partials/dashboard.html'
	})
	.when('/admin',{
		controller : 'AdminController',
		templateUrl: '/partials/admin.html'
	})
	.otherwise({ redirectTo: '/'});
}])
//---------------------------------------------*********************************------------------------------------//
//                                           Login Controller For handeling Login
//---------------------------------------------*********************************------------------------------------//
Tlkn.controller('LoginController',['$scope','$http','$location','$cookieStore','appConifg',
	function($scope,$http,$location,$cookieStore,appConifg){
		$scope.access_token = $cookieStore.get('access_token');
		$scope.role = $cookieStore.get('role');
		if($scope.access_token != null){
			if($scope.role == "admin"){
				$location.path('/admin');
			}
			else{
				$location.path('/home');
			}
		}
		else{
			$scope.loginData = {};
			$scope.processLogin = function(){
				$http.post(appConifg.apiURL+'/login',$scope.loginData)
				.success(function(data){
					$http.post(appConifg.apiURL+'/role',data)
					.success(function(result){
						$cookieStore.put('access_token',data.access_token);
						$cookieStore.put('role',result)
						$scope.role = $cookieStore.get('role');
						if($scope.role == "manager"){
							$location.path('/admin');
						}
						else{
							$location.path('/home');
						}
					});
				})
				.error(function(data){
					alert(data.message);
				})
			}
		}
	}]
);
//---------------------------------------------*********************************------------------------------------//
//                                           Dashboard Controller For Emplaoyee
//---------------------------------------------*********************************------------------------------------//
Tlkn.controller('HomeController',['$scope','$cookieStore','$http','$location','ngTableParams','appConifg','$filter',
	function($scope,$cookieStore,$http,$location,ngTableParams,appConifg,$filter){
		if($cookieStore.get('access_token') == null){
			$location.path('/')
		}
		else{
			$scope.leaveData = {}
			$scope.leaveData.access_token = $cookieStore.get("access_token")
			$scope.format = 'dd-MM-yyyy';
			$scope.startminDate = new Date();
			var count = 10
			$scope.getLeave = function(){
				if(count == 10){
					count = 11
				}
				else{
					count = 10
				}
				var getleaveData = {}
				getleaveData.access_token = $cookieStore.get('access_token')
				$http.post(appConifg.apiURL+'/get/leave',getleaveData)
				.success(function(data){
					console.log(data)
					$scope.JsonData = data
					$scope.tableParams = new ngTableParams({
						page: 1,         
						count: count        
					}, {
						total: $scope.JsonData.length,
						getData: function($defer, params) {
							var filteredData = params.filter() ? $filter('filter')($scope.JsonData, params.filter()) : $scope.JsonData;
							var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
							params.total(orderedData.length);
							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						}
					});
				})
				.error(function(data){
					alert(data)
				})
			}
			$scope.getLeave()

			$scope.startopen = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				$scope.startopened = true;
			};
			$scope.endopen = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				$scope.endopened = true;
			};

			$scope.leaveCreate = function(leaveDetails){
				$scope.leaveForm.$invalid = true;
				$http.post(appConifg.apiURL+'/leave',leaveDetails)
				.success(function(data){
					alert("Leave applied succesfully")
					$scope.getLeave()
					console.log(data)
				})
				.error(function(data){
					alert(data)
				})
			};

			$scope.signOut = function(){
				$cookieStore.remove('access_token');
				$cookieStore.remove('role');
				$location.path('/')
			}
		}
	}]
);
//---------------------------------------------*********************************------------------------------------//
//                                        Admin Controller For Manager to update leave
//---------------------------------------------*********************************------------------------------------//
Tlkn.controller('AdminController',['$scope','$cookieStore','$http','$location','ngTableParams','appConifg','$filter',
	function($scope,$cookieStore,$http,$location,ngTableParams,appConifg,$filter){
		if($cookieStore.get('access_token') == null){
			$location.path('/');
		}
		else if($cookieStore.get('role')!= 'manager'){
			$location.path('/home');
		}
		else if($cookieStore.get('role') == 'manager'){
			$scope.edit_leave = false;
			$scope.status_value = {
				process:"InProcess"
				,accept:"approved"
				,reject :"rejected"
			}
			var count = 10
			$scope.getLeave = function(){
				if(count == 10){
					count = 11
				}
				else{
					count = 10
				}
				var getleaveData = {}
				getleaveData.access_token = $cookieStore.get('access_token')
				$http.post(appConifg.apiURL+'/get/leave',getleaveData)
				.success(function(data){
					console.log(data)
					$scope.JsonData = data
					$scope.tableParams = new ngTableParams({
						page: 1,         
						count: count        
					}, {
						total: $scope.JsonData.length,
						getData: function($defer, params) {
							var filteredData = params.filter() ? $filter('filter')($scope.JsonData, params.filter()) : $scope.JsonData;
							var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
							params.total(orderedData.length);
							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						}
					});
					$scope.tableParams.settings().$scope = $scope;
				    if($scope.tableParams){
				    	$scope.tableParams.reload();
				    }
				})
				.error(function(data){
					alert(data)
				})
			}
			$scope.getLeave()

			$scope.assign_status = function(data){
				$scope.edit_leave = true;
				$scope.leaveStatus = {}
				$scope.leaveStatus.id = data.leave_id
				$scope.leaveStatus.status = data.status;
			}

			$scope.update_status = function(data){
				$scope.leaveStatus.access_token = $cookieStore.get('access_token')
				$http.post(appConifg.apiURL+'/update/leave',$scope.leaveStatus)
				.success(function(data){
					alert("Leave updated succesfully")
					$scope.edit_leave = false;
					$scope.getLeave()
					console.log(data)
				})
				.error(function(data){
					$scope.edit_leave = false;
					alert(data)
				})

			}

			$scope.signOut = function(){
				$cookieStore.remove('access_token');
				$cookieStore.remove('role');
				$location.path('/')
			}
		}
		
	}]
);