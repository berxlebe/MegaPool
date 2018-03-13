		megaPoolApp.controller('picksCtrl',['$scope', '$http',  'userdata', function($scope, $http, userdata){
			$scope.league;
			$scope.picks;

			$scope.getTableData=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_picks_api.php?LeagueID="+$scope.league.leagueID+"&Year="+$scope.selectYear).then(function(response) {
					$scope.picks = response.data;
				});
			};
			$scope.hasOwnPick=function(round){
				if (round.hasOwnProperty('picks')){
					for(var i=0; i<round.picks.length;i++){
						if(round.picks[i].origOwner == -1){
							return 0;
						}
					}
				}
				return 1;
			};


			$scope.selectYear = new Date().getFullYear();
			$scope.league = userdata.getCurLeague();
			$scope.getTableData();
		}]);


	megaPoolApp.filter('ordinal', function(){
		return function(n) {
			if(3<n<20){
				return (n+"th");
			}
			if(n%10==1){
				return (n+"st");
			}
			if(n%10==2){
				return (n+"nd");
			}
			if(n%10==3){
				return (n+"rd");
			}
		
			return (n+"th");
		};
	});
	megaPoolApp.filter('rangeYearPlus', function(){
		return function(n) {
		  var res = [];
		  for (var i = n; i <= new Date().getFullYear()+3; i++) {
			res.push(i);
		  }
		  return res;
		};
	});
