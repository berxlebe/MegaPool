		megaPoolApp.controller('editPlayerCtrl',['$scope', '$http', '$window',  'standings', 'userdata', function($scope, $http, $window, standings, userdata){
			$scope.league;
			$scope.year;
			$scope.posArr = ['G1','G2','F1','F2','Flex'];
			$scope.pool=[];
			$scope.allRosters=[];
			$scope.rosters=[];
			$scope.modelIn={};
			$scope.modelIn.teams=[{"teamG1":null,"teamG2":null,"teamF1":null,"teamF2":null,"teamFlex":null},
							{"teamG1":null,"teamG2":null,"teamF1":null,"teamF2":null,"teamFlex":null},
							{"teamG1":null,"teamG2":null,"teamF1":null,"teamF2":null,"teamFlex":null}];

			$scope.modelIn.entry =[{"playerG1":null,"playerG2":null,"playerF1":null,"playerF2":null,"playerFlex":null},
							{"playerG1":null,"playerG2":null,"playerF1":null,"playerF2":null,"playerFlex":null},
							{"playerG1":null,"playerG2":null,"playerF1":null,"playerF2":null,"playerFlex":null}];

			$scope.control={save:false};
			$scope.checkLock=function(){
				return userdata.checkMegaLock();
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
				$http.get("http://www.marchmegapool.com/apis/new_mega_year_api.php?EntryID="+$scope.league.entryID+"LeagueID="+$scope.league.leagueID).then(function(response) {
					if(response.data<0){
						$window.alert('Sorry the deadline for joining this years pool has already passed.');
					}
					else{
						$scope.league.lastYearActive = new Date().getFullYear();
						$scope.popUp = 1;
					}
				});
			};
			$scope.filterArray=function(){
				var lock = userdata.checkMegaLock();
				if(lock==0){
						$scope.rosters = $scope.allRosters;
						return;
				}
				$scope.rosters=[];
				var game = lock*2;
				var key = "gm"+game+"Margin";
				for (var i=0; i<$scope.allRosters.length; i++){
					var margin = $scope.allRosters[i][key];
					if($scope.allRosters[i][key]>0){
						$scope.rosters.push($scope.allRosters[i]);
					}
				}
			};
			$scope.populateentry=function(week, position){
				for(var x=0;x<64;x++){
					let obj = $scope.allRosters[x].roster.find(o => o.id === $scope.modelIn.entry[week][('player'+position)]);
					if(obj){
						$scope.modelIn.teams[week][('team'+position)] = x;
						return;
					}
				}
				
				
			}
			$scope.getPlayerPool=function(){
				$http.get("http://www.marchmegapool.com/apis/player_entry_api.php?EntryID="+$scope.league.entryID+"&year="+$scope.year).then(function(response) {
					$scope.pool = response.data;
					if($scope.checkLock()<$scope.week){
						for(var i=0;i<3;i++){
							$scope.modelIn.entry[i].playerG1=$scope.pool.weeks[i][0].id;
							$scope.modelIn.entry[i].playerG2=$scope.pool.weeks[i][1].id;
							$scope.modelIn.entry[i].playerF1=$scope.pool.weeks[i][2].id;
							$scope.modelIn.entry[i].playerF2=$scope.pool.weeks[i][3].id;
							$scope.modelIn.entry[i].playerFlex=$scope.pool.weeks[i][4].id;
							for(var j=0; j<5;j++){
								$scope.populateentry(i,$scope.posArr[j]);
							}
						}
					}
				
				});
			};
			$scope.savePlayerPool=function(){
				$scope.control.save=false;
				var data={"EntryID":$scope.league.entryID,
				"entryData":$scope.modelIn.entry};
				$http.post("http://www.marchmegapool.com/apis/edit_player_entry_api.php", data).then(function(response) {
					switch(response.data){
						case "-2":
							$window.alert("Save failed, entry uses the same player more than once");
							break;
						case "-3":
							$window.alert("Save failed, lock date for saving entries has already passed");
							break;
						case "-4":
							$window.alert("Save failed, write to database failed, entry may not exist");
							break;
						default:
							$scope.control.save=true;
							break;
					}
							

					
				});
			}
			$scope.getRosters=function(){
				$http.get("http://www.marchmegapool.com/apis/mega_rosters_api.php").then(function(response) {
					$scope.allRosters = response.data;
					$scope.getPlayerPool();
					$scope.filterArray();
				});
			};
			$scope.getPool=function(){
//				$scope.getPlayerPool();
				$scope.getRosters();
			};
			var temp =$scope.checkLock();
			if(temp==3){
				$scope.week = 3;
			}
			else{
				$scope.week = temp+1;
			}
			$scope.year = new Date().getFullYear();
			$scope.league = userdata.getCurLeague();
			$scope.getPool();

		}]);
		
