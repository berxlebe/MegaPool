		megaPoolApp.controller('fflBudgetCtrl',['$scope', '$http', 'userdata', function($scope, $http, userdata){
			$scope.league;
			$scope.settings = [];
			$scope.budgets=[];
			$scope.getSettings=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_get_settings_api.php?LeagueID="+$scope.league.leagueID).then(function(response) {
					$scope.settings = response.data;
				});
			};
			$scope.getbudgetData=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_budget_api.php?LeagueID="+$scope.league.leagueID+"&years=3").then(function(response) {
					$scope.budgets = response.data;
				});
			};

			$scope.league = userdata.getCurLeague();
			$scope.getSettings();
			$scope.getbudgetData();
		}]);
		
