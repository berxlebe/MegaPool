		megaPoolApp.controller('contractsCtrl',['$scope', '$http', 'userdata',function($scope, $http, userdata){
			$scope.contracts = [];
            $scope.league;
			$scope.settings = [];
			$scope.getSettings=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_get_settings_api.php?LeagueID="+$scope.league.leagueID).then(function(response) {
					$scope.settings = response.data;
				});
			};

			$scope.getTableData=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_contracts_api.php?LeagueID="+$scope.league.leagueID).then(function(response) {
					$scope.contracts = response.data;
				});
			};
			$scope.sortTable=function(column){
				$scope.sorter=column;
			};
			$scope.league = userdata.getCurLeague();
			$scope.getTableData(); 
			$scope.getSettings();

		}]);
		
