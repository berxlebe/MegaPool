		megaPoolApp.controller('editBracketCtrl',['$scope', '$http', '$window',  'standings', 'userdata', function($scope, $http, $window, standings, userdata){
			$scope.league;
			$scope.year;
			$scope.bracket={};
			$scope.ratio = 1165/1562;
			$scope.control={save:false};

			$scope.checkLock=function(){
				return userdata.checkMegaLock();
			};
			$scope.getBracket=function(){
				$http.get("http://www.marchmegapool.com/apis/bracket_api.php?EntryID="+$scope.league.entryID+"&year="+$scope.year).then(function(response) {
					$scope.bracket = response.data;
				});
			};
			$scope.saveBracket=function(){
				var data={"EntryID":$scope.league.entryID,
				"entryData":$scope.bracket};
				$http.post("http://www.marchmegapool.com/apis/edit_bracket_api.php", data).then(function(response) {
					switch(response.data){
						case "-1":
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
			$scope.selectTeam=function(team){
				var nextSpot;
				var oldTeam
				$scope.control.save=false;
				nextSpot = $scope.nextSlot(team.region, team.slot);
				oldTeam = $scope.setTeam(team.name,team.id,nextSpot.newSlot,nextSpot.newRegion);
				if(oldTeam>0){
					$scope.clearNext(oldTeam,nextSpot.newSlot,nextSpot.newRegion);
				}
				
			};
			$scope.setTeam=function(name,id,slot,region){
				var retVal=0;
				if(slot=="RIGHTSEMI" || region=="TOPRIGHT" || region=="LOWERRIGHT"){
					for(var i=0;i<$scope.bracket.rightside.length;i++){
						if($scope.bracket.rightside[i].slot==slot && $scope.bracket.rightside[i].region==region){
							if($scope.bracket.rightside[i].id != id){
								retVal=$scope.bracket.rightside[i].id;
								$scope.bracket.rightside[i].name = name;
								$scope.bracket.rightside[i].id = id;
							}
						}
					}
				}
				else{
					for(var i=0;i<$scope.bracket.leftside.length;i++){
						if($scope.bracket.leftside[i].slot==slot && $scope.bracket.leftside[i].region==region){
							if($scope.bracket.leftside[i].id != id){
								retVal=$scope.bracket.leftside[i].id;
								$scope.bracket.leftside[i].name = name;
								$scope.bracket.leftside[i].id = id;
							}
						}
					}
				}
				return retVal;
				
			};
			$scope.clearNext=function(teamID,slot,region){
				var nextSpot = $scope.nextSlot(region, slot);
				var nextTeam = 0;
				if(nextSpot.newSlot=="RIGHTSEMI" || region=="TOPRIGHT" || region=="LOWERRIGHT"){
					for(var i=0;i<$scope.bracket.rightside.length;i++){
						if($scope.bracket.rightside[i].slot==nextSpot.newSlot 
							&& $scope.bracket.rightside[i].region==nextSpot.newRegion
							&& $scope.bracket.rightside[i].id == teamID){
								nextTeam = $scope.setTeam("","",nextSpot.newSlot,nextSpot.newRegion);
						}
					}
				}
				else{
					for(var i=0;i<$scope.bracket.leftside.length;i++){
						if($scope.bracket.leftside[i].slot==nextSpot.newSlot 
							&& $scope.bracket.leftside[i].region==nextSpot.newRegion
							&& $scope.bracket.leftside[i].id == teamID){
								nextTeam = $scope.setTeam("","",nextSpot.newSlot,nextSpot.newRegion);
						}
					}
				}
				if(nextTeam>0){
					$scope.clearNext(teamID,nextSpot.newSlot,nextSpot.newRegion);
				}

				
				
			};
							
			$scope.nextSlot=function(region, slot){
				var retval ={"newSlot":"",
							"newRegion":region}
				switch(slot){
					case "1SEED":
					case "16SEED":
						retval.newSlot = "1v16WINNER";
						break;
					case "2SEED":
					case "15SEED":
						retval.newSlot = "2v15WINNER";
						break;
					case "3SEED":
					case "14SEED":
						retval.newSlot = "3v14WINNER";
						break;
					case "4SEED":
					case "13SEED":
						retval.newSlot = "4v13WINNER";
						break;
					case "5SEED":
					case "12SEED":
						retval.newSlot = "5v12WINNER";
						break;
					case "6SEED":
					case "11SEED":
						retval.newSlot = "6v11WINNER";
						break;
					case "7SEED":
					case "10SEED":
						retval.newSlot = "7v10WINNER";
						break;
					case "8SEED":
					case "9SEED":
						retval.newSlot = "8v9WINNER";
						break;
					case "1v16WINNER":
					case "8v9WINNER":
						retval.newSlot = "POD1";
						break;
					case "2v15WINNER":
					case "7v10WINNER":
						retval.newSlot = "POD2";
						break;
					case "3v14WINNER":
					case "6v11WINNER":
						retval.newSlot = "POD3";
						break;
					case "4v13WINNER":
					case "5v12WINNER":
						retval.newSlot = "POD4";
						break;
					case "POD1":
					case "POD4":
						retval.newSlot = "SEMI1";
						break;
					case "POD2":
					case "POD3":
						retval.newSlot = "SEMI2";
						break;
					case "SEMI1":
					case "SEMI2":
						retval.newSlot = "REGIONALCHAMP";
						break;
					case "REGIONALCHAMP":
						switch(region){
							case "TOPLEFT":
							case "LOWERLEFT":
								retval.newSlot = "LEFTSEMI";
								break;
							case "TOPRIGHT":
							case "LOWERRIGHT":
								retval.newSlot = "RIGHTSEMI";
								break;
						}
						retval.newRegion="FINALS"
						break
					case "LEFTSEMI":
					case "RIGHTSEMI":
						retval.newSlot = "CHAMP";
						break;
				}
				return retval;
			};
			$scope.year = new Date().getFullYear();
			$scope.league = userdata.getCurLeague();
			$scope.getBracket();

		}]);
		
