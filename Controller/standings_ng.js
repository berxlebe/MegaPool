		megaPoolApp.controller('standingsCtrl',['$scope', '$http',  '$routeParams', 'userdata', 'standings', function($scope, $http, $routeParams, userdata, standings){
			$scope.league;
			$scope.year;
			$scope.standings=[];
			$scope.playerStand=0;
			$scope.fullStand=0;
			$scope.bracketStand=0;
			$scope.teamStand=0;
			$scope.getStandings=function(){
				standings.getStandings($scope.league.leagueID,$scope.year).then(function(d) {
					$scope.standings = d;
				});
			};
			$scope.sortTable=function(column){
                if(column == $scope.sorter){
                    $scope.reverser = !$scope.reverser
                }
                else{
                    $scope.sorter=column;
                    $scope.reverser=false;
                }
			};
			$scope.setStandings=function(game){				
				$scope.playerStand=0;
				$scope.fullStand=0;
				$scope.bracketStand=0;
				$scope.teamStand=0;
				switch($routeParams.GAME_TYPE){
					case "player":
						$scope.playerStand = 1;
						break;
					case "team":
						$scope.teamStand = 1;
						break;
					case "bracket":
						$scope.bracketStand = 1;
						break;
					default:
						$scope.fullStand = 1;
						break;
				}
			}
					
			$scope.calcPct=standings.calcPct;
			$scope.calcGB=standings.calcGB;
			$scope.calcTotal=standings.calcTotal;

			if($routeParams.GAME_TYPE){
				$scope.setStandings($routeParams.GAME_TYPE);
			}
			else{
				$scope.fullStand=1;
			}

			$scope.year = new Date().getFullYear();
			$scope.league = userdata.getCurLeague();
			$scope.getStandings(); 
		}]);
		
