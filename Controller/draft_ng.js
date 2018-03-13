	megaPoolApp.controller('draftCtrl',['$scope', '$http',  'userdata', function($scope, $http,  userdata){
			$scope.year;
			$scope.league = {};
			$scope.draft={};
			$scope.rankings={};
			$scope.rosters=[];
			$scope.settings=[];
			$scope.updateYear=function(year){
				if(year==-1){
					$scope.year = new Date().getFullYear();
				}
				else{
					$scope.year = year;
				}
				$scope.updatePicks();
				$scope.updateRanks();
				$scope.updateRosters();
				
			};
			$scope.getSettings=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_get_settings_api.php?LeagueID="+$scope.league.leagueID).then(function(response) {
					$scope.settings = response.data;
				});
			};
			$scope.getleague=function(){
				$scope.league = userdata.getCurLeague();
			}
			$scope.checkAdmin=function(){
						return $scope.league.isAdmin;
			};

			$scope.updatePicks=function(){
				$http({ 
					method: 'GET',
					url: 'http://www.marchmegapool.com/apis/ffl_draft_api.php?league=' + $scope.league.leagueID +'&year='+$scope.year
				}).then(function(response){
					$scope.draft = response.data;
				});
			};
			
			$scope.updateRanks=function(){
				$http({ 
					method: 'GET',
					url: 'http://www.marchmegapool.com/apis/ffl_espn300_api.php?league=' + $scope.league.leagueID +'&orderby=ESPNRank'
				}).then(function(response){
					$scope.rankings = response.data;
				});
			};

			$scope.updateRosters=function(){
				$http({  
					method: 'GET',
					url: 'http://www.marchmegapool.com/apis/ffl_draft_roster_api.php?league=' + $scope.league.leagueID +'&year='+$scope.year
				}).then(function(response){
					$scope.rosters = response.data;
				});
			};
			
			$scope.getleague();
			$scope.updateYear(-1);
			$scope.getSettings();
			
	
	
	}]);
	
	megaPoolApp.filter('rangeYear', function(){
		return function(n) {
		  var res = [];
		  for (var i = n; i <= new Date().getFullYear(); i++) {
			res.push(i);
		  }
		  return res;
		};
	});
	
		megaPoolApp.filter('rangeCount', function(){
		return function(n) {
		  var res = [];
		  for (var i = 1; i <= n; i++) {
			res.push(i);
		  }
		  return res;
		};
	});
	megaPoolApp.filter('posFilter', function(){
		return function(n) {
		  if(n.substring(0, 1)=="K"){
			  return "K";
		  }
		  if(n.substring(0, 3)=="DST"){
			  return "DST";
		  }
		  if(n.substring(0, 2)=="BE"){
			  return "Bench";
		  }
		  if(n.substring(0, 3)=="Flex"){
			  return "Flex";
		  }
		  
		  return n.substring(0, 2);
		};
	});
	
