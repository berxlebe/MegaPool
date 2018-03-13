megaPoolApp.controller('menuCtrl',['$scope', '$http', '$location', 'menuUpdate', 'userdata', function($scope,$http, $location, menuUpdate, userdata){
	$scope.menu = {};
    $scope.menuIndex;
    $scope.uid;
    $scope.leagueID = -1;
	$scope.leagues;
	$scope.join={"EntryName":"",
					"leagueName":"",
					"lpass":"",
					"ltype":"",
					"retval":""};
	$scope.leagueT=[{"name":"Mega Pool", "id":1},
					{"name":"FFL Draft", "id":2},
					{"name":"FFL Auction", "id":3}];

	$scope.setLeague=function(LID){
		$scope.leagueID = LID;
		userdata.setCurLeague(LID);
	};
	$scope.callFunction = function (name){
		if(angular.isFunction($scope[name]))
		   $scope[name]();
	}
	$scope.setUID=function(UID){
		userdata.setUID(UID);
		$scope.uid = UID;
	};
	$scope.getLeagues=function(){
		userdata.getLeagues(userdata.profile.UID);
        $scope.leagues = userdata.leagues;
	};
	$scope.popJoin=function(){
		document.getElementById('join_pool').style.display = "inline";	
	};

    $scope.joinLeague=function(){
		if($scope.join.EntryName==""||
			$scope.join.leagueName ==""||
			$scope.join.lpass == ""){
				$scope.join.retval = "Info incomplete please try again";
				return;
		}
		if(!$scope.newLeague){
			$scope.join.ltype = 0;
		}
		var data={"UID":$scope.uid,
				"entryData":$scope.join};
		$http.post("http://www.marchmegapool.com/apis/join_league_api.php", data).then(function(response) {
			if(response.data.errCode>0){
				$scope.exitpass('join_pool');
				userdata.setCurEntry(response.data.EntryID);
				$scope.setLeague(response.data.LeagueID);
				$scope.getLeagues();
				$scope.updateMenu(response.data.LeagueID);
				switch(response.data.type){
					case "AuctionFFL":
						$location.path('/ffl_home');
						break;
					case "DraftFFL":
						$location.path('/ffl_home');
						break;
					case "Mega":
						$location.path('/megapool');
						break;
				}
			}
			else{
				$scope.join.retval = response.data.errMsg;
			}
		});
    };
	
	$scope.exitpass=function(id){
	    document.getElementById(id).style.display = "none";	
		$scope.join={"EntryName":"",
					"leagueName":"",
					"lpass":"",
					"ltype":"",
					"retval":""};
	};
	$scope.checkLogin=function(login,password){
		$http.get("http://www.marchmegapool.com/apis/password_api.php?login="+login+"&password="+password).then(function(response) {
			if (response.data>0){
				$scope.setUID(response.data);
				$scope.getLeagues();  
				$scope.updateMenu();
			}
			else{
//				$window.location.href = '/pass_failed.html';
			}
		});
	};
			
    $scope.updateMenu=function(){
        menuUpdate.getMenu($scope.uid, $scope.leagueID);
    };
	$scope.readMenu=function(){
		$scope.menu = menuUpdate.menu;
	};
	$scope.updateUserdata=function(){
        $scope.leagues = userdata.leagues;
		$scope.uid = userdata.profile.UID;
    };
	userdata.registerObserverCallback($scope.updateUserdata);
	menuUpdate.registerObserverCallback($scope.readMenu);

 }]);
		
megaPoolApp.factory('menuUpdate', ['menuSelect','$http', function menuUpdateService(menuSelect,$http){
	var menuUpdateService={};
	menuUpdateService.observerCallbacks = [];
	menuUpdateService.menu={};
	menuUpdateService.registerObserverCallback = function(callback){
			menuUpdateService.observerCallbacks.push(callback);
	  };
	menuUpdateService.notifyObservers = function(){
			angular.forEach(menuUpdateService.observerCallbacks, function(callback){
				callback();
			});
	  };
	menuUpdateService.getMenu=function(uid,leagueID){
		$http({ // get menu for chosen league 
			method: 'GET',
			url: 'http://www.marchmegapool.com/apis/menu_api.php?leagueID=' + leagueID +'&uid='+uid
		}).then(function(response){
			menuUpdateService.menu = response.data;
			menuUpdateService.notifyObservers();
		});
	};
	return menuUpdateService;
}]);

megaPoolApp.service('menuSelect',[function menuSelectService(){
        this.checkMenuStore=function(leagueID, menuArr){
             for(var i =0; i<menuArr.length; i++){
                if(menuArr[i].leagueID == leagueID){ /* stored data found for searched location*/
                        return i;
                }
            }
                 /*no stored data found*/
                 return -1;
                    
        }
}]);

megaPoolApp.filter('pageLink', function() {
    return function(type) {
		switch(type){
		case "Mega":
			return  "#!megapool";
			break;
		case "AuctionFFL":
		case "DraftFFL":
			return "#!ffl_home";
			break;
		}
    };
});