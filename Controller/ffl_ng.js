	megaPoolApp.controller('fflCtrl',['$scope', '$http',  'userdata', 'msgBoard', function($scope, $http,  userdata, msgBoard){
			$scope.league ={};
			$scope.rankings = {};
			$scope.board={};
			$scope.year="-1";
			$scope.week="-1";
			$scope.publish = 1;
			
			$scope.getPowerRankings=function(publish){
				$http.get("http://www.marchmegapool.com/apis/ffl_pwr_rank_api.php?LeagueID="+userdata.curLeague+"&Week="+$scope.week+"&year="+$scope.year+"&publish="+publish).then(function(response) {
					$scope.rankings = response.data;
					if($scope.year == "-1"){
						$scope.year = $scope.rankings.year;
					}
					if($scope.week == "-1"){
						$scope.week = $scope.rankings.week;
					}
				});
			};
			
			$scope.writePowerRankings=function(){
				var req = {
					method: 'POST',
					url: 'http://www.marchmegapool.com/apis/ffl_save_pwr_rank_api.php',
					headers: {
						'Content-Type': undefined
					},
					data: { LeagueID: userdata.curLeague,
						rankID:'',
						note:'',
						publish:$scope.publish,
						week:'',
						ownerOrder:'',
						NextUp:'',
						comment:''
					}
				}

				$http(req).then(function(response) {
					if(response.data>0){
						alert("Rankings Saved");
					}
				});
			};

			$scope.checkAdmin=function(){
						return $scope.league.isAdmin;
			};
			$scope.setLeague=function(){
				$scope.league=  userdata.getCurLeague();
			};
			$scope.unsetPub=function(){
				$scope.publish = 0;
			}
			
			$scope.setLeague(); 
			$scope.getPowerRankings($scope.publish); 
			msgBoard.getBoard($scope.league.leagueID,0,5).then(function(d) {
				$scope.board = d;
			});
	
	}]);