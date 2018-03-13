		megaPoolApp.controller('fflAuctionCtrl',['$scope', '$http', 'userdata', function($scope, $http, userdata){
			$scope.league;
			$scope.settings = [];
			$scope.budgets=[];
			$scope.rosters=[];
			$scope.auction=[];
			$scope.getSettings=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_get_settings_api.php?LeagueID="+$scope.league.leagueID).then(function(response) {
					$scope.settings = response.data;
				});
			};
			$scope.getbudgetData=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_budget_api.php?LeagueID="+$scope.league.leagueID+"&years=1&start="+$scope.selectYear).then(function(response) {
					$scope.budgets = response.data;
				});
			};

			$scope.refreshPicks=function(){
				$http({  
					method: 'GET',
					url: 'http://www.marchmegapool.com/apis/ffl_auction_api.php?league=' + $scope.league.leagueID +'&year='+$scope.selectYear
				}).then(function(response){
					$scope.auction = response.data;
				});
			};

			$scope.updateRosters=function(){
				$http({  
					method: 'GET',
					url: 'http://www.marchmegapool.com/apis/ffl_draft_roster_api.php?league=' + $scope.league.leagueID +'&year='+$scope.selectYear
				}).then(function(response){
					$scope.rosters = response.data;
				});
			};

			$scope.refresh=function(){
				$scope.getbudgetData();
				$scope.updateRosters();
				$scope.refreshPicks();
			};
			$scope.calcRemain=function(owner){
				var spent = 0;
				for(i=0;i<$scope.auction.length;i++){
					if($scope.auction[i].ownerId==owner.id){
						spent += parseInt($scope.auction[i].bid);
					}
				}
				
				return owner.years[0].value - spent;
			};
			$scope.calcSpots=function(owner){
				var maxSpots = $scope.settings.rosterComp.length;
				var spots = 0;
				for(i=0;i<$scope.auction.length;i++){
					if($scope.auction[i].ownerId==owner.id){
						spots += 1;
					}
				}
				return maxSpots-spots;
				
			};
			$scope.calcMax=function(owner){
				var remSpots;
				if (remSpots=$scope.calcSpots(owner)){
						return $scope.calcRemain(owner) -remSpots+1;
				}
				return 0;
			};
			$scope.calcAvg=function(owner){
				var remSpots;
				if (remSpots=$scope.calcSpots(owner)){
						return Math.round(($scope.calcRemain(owner)/remSpots) * 100) / 100;
				}
				return 0;
			};
	
			$scope.league = userdata.getCurLeague();
			$scope.getSettings();
			$scope.selectYear = new Date().getFullYear();
			$scope.refresh();
		}]);
		
