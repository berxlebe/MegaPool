		megaPoolApp.controller('teamCtrl',['$scope', '$http', '$window',  '$routeParams',  'standings', 'userdata', function($scope, $http, $window, $routeParams, standings, userdata){
			$scope.league;
			$scope.year;
			$scope.entryID;
			$scope.standings=null;
			$scope.pool=null;
			$scope.current_year;
			$scope.limit=6;
			$scope.teamCost=0;
			$scope.popUp=0;
			$scope.control={save:false};
			$scope.expandText = "Click To Expand";
			$scope.checkLock=function(){
				if($scope.year<$scope.current_year){
					return 3;
				}
				return userdata.checkMegaLock();
			};
			$scope.currentLock = userdata.checkMegaLock;
			$scope.getStandings=function(){
				standings.getStandings($scope.league.leagueID,$scope.year).then(function(d) {
					$scope.standings = d;
				});
			};
			$scope.calcCost=function(){
				$scope.teamCost=0;
				for(var i=0;i<$scope.pool.length;i++){
					if($scope.pool[i].selected=="true"){
						$scope.teamCost+=parseInt($scope.pool[i].cost);
					}
				}
			};
			$scope.checkCurrentYear=function(){
				if($scope.league.lastYearActive < (new Date().getFullYear()) &&
					!userdata.checkMegaLock()){
					return 1;
				}
				else{
					return 0;
				}
			};
			$scope.newyear= function(){
				$http.get("http://www.marchmegapool.com/apis/new_mega_year_api.php?EntryID="+$scope.league.entryID+"&LeagueID="+$scope.league.leagueID).then(function(response) {
					if(response.data<0){
						$window.alert('Sorry the deadline for joining this years pool has already passed.');
					}
					else{
						$scope.league.lastYearActive = new Date().getFullYear();
						$scope.popUp = 1;
						$scope.getPool();

					}
				});
			};
			$scope.closePop=function(){
				$scope.popUp=0;
			}
			$scope.saveTeam=function(){
				if($scope.teamCost!=100){
					$window.alert("Save failed, team costs must add up to exactly 100");
					return;
				}

				var teamList ="";
				var count =0;
				for(var i =0; i< $scope.pool.length;i++){
					if($scope.pool[i].selected=="true"){
						if(count>0){
							teamList = teamList + "||";
						}
						teamList = teamList + $scope.pool[i].id;
						count++;
					}
				}
				if(count<5){
					$window.alert("Save failed, entry must have at least 5 teams");
					return;
				}
				$http.get("http://www.marchmegapool.com/apis/edit_team_api.php?EntryID="+$scope.league.entryID+"&teamArray="+teamList).then(function(response) {
					switch(response.data){
						case "-1":
							$window.alert("Save failed, lock date for saving entries has already passed");
							break;
						case "-2":
							$window.alert("Save failed, entry must have at least 5 teams");
							break;
						case "-3":
							$window.alert("Save failed, team costs must add up to exactly 100");
							break;
						case "-4":
							$window.alert("Save failed, write to database failed, entry may not exist");
							break;
						default:
							$scope.control.save=true;
							break;
					}
				});
					
			};
			$scope.onDropOn=function(data,evt){
				$scope.control.save=false;
				data.selected='true';
				$scope.calcCost();
			};
			$scope.onDropOff=function(data,evt){
				$scope.control.save=false;
				data.selected='false';
				$scope.calcCost();
			};
			$scope.sortByIntSeed = function(team){
				return parseInt(team.seed);
			};

			$scope.getTeam=function(){
				$http.get("http://www.marchmegapool.com/apis/team_pool_api.php?EntryID="+$scope.entryID+"&year="+$scope.year).then(function(response) {
					$scope.pool = response.data;
					$scope.calcCost();
				});
			};
			$scope.getPool=function(){
				$scope.getStandings();
				$scope.getTeam();
			}
			$scope.checkEntry=function(){
				if($scope.pool){
					for(var i=0;i<$scope.pool.length;i++){
						if($scope.pool[i].selected=="true"){
							return 1;
						}
					}
				}
				return 0;
			};
			$scope.expand=function(){
				if($scope.limit ==6){
					$scope.limit =68;
					$scope.expandText="Hide";
				}
				else{
					$scope.limit=6;
					$scope.expandText="Click To Expand";
				}
			};
				
			$scope.current_year = new Date().getFullYear();
			$scope.year = $scope.current_year;
			$scope.league = userdata.getCurLeague();
			if($routeParams.DISP_ID){
				$scope.entryID=$routeParams.DISP_ID;
				if($routeParams.DISP_YEAR){
					$scope.year = $routeParams.DISP_YEAR;
				}
			}
			else{
				$scope.entryID = $scope.league.entryID;
			}
				
			$scope.getPool();

		}]);
		
