var megaPoolApp = angular.module('megaPoolApp',['ngRoute','ngDraggable']);


megaPoolApp.factory('userdata', ['$http', function($http) {
    var userDataService = {};
	userDataService.leagues = [];
	userDataService.profile={UID:null,
							userName:null,
							email:null};
	userDataService.curLeague=null;
	userDataService.curEntry=null;

	userDataService.observerCallbacks = [];
	
	userDataService.registerObserverCallback = function(callback){
			userDataService.observerCallbacks.push(callback);
	  };
	userDataService.notifyObservers = function(){
			angular.forEach(userDataService.observerCallbacks, function(callback){
				callback();
			});
	  };

	userDataService.getLeagues=function(UID){
		$http.get("http://www.marchmegapool.com/apis/league_list_api.php?uid="+UID).then(function(response) {
			userDataService.leagues = response.data;
			userDataService.notifyObservers();

		});
	};
    userDataService.setLeagues = function(leagues) {
        userDataService.leagues = leagues;
		userDataService.notifyObservers();
    };
    userDataService.setUID = function(UID) {
        userDataService.profile.UID=UID;
		userDataService.notifyObservers();
    };
    userDataService.setCurLeague = function(league) {
        userDataService.curLeague=league;
		userDataService.notifyObservers();
    };
    userDataService.setCurEntry = function(entry) {
        userDataService.curEntry=entry;
		userDataService.notifyObservers();
    };
	
	userDataService.checkMegaLock = function(){
		var league = userDataService.getCurLeague();
		var current = new Date();
		var lock = new Date(parseInt(league.lock3));
		if(current.getTime()>lock.getTime()){
			return 3;
		}
		lock = new Date(parseInt(league.lock2));
		if(current.getTime()>lock.getTime()){
			return 2;
		}
		lock = new Date(parseInt(league.lock1));
		if(current.getTime()>lock.getTime()){
			return 1;
		}
		return 0;
	}

	userDataService.getCurLeague = function(){
		for(var i=0; i<userDataService.leagues.length;i++){
			if(userDataService.leagues[i].leagueID == userDataService.curLeague){
				return userDataService.leagues[i];
			}
		}
	};
    return userDataService;
}]);




megaPoolApp.service('msgBoard', ['$http', function($http) {
	this.getBoard=function(leagueID,start,count){
		var promise = $http.get("http://www.marchmegapool.com/apis/msg_board_api.php?LeagueID="+leagueID+"&number="+count+"&start="+start).then(function(response) {
			var ret_data = response.data;
			for (var i =0; i<ret_data.threads.length; i++){
				ret_data.threads[i].lastTimestamp = new Date(ret_data.threads[i].lastTimestamp)
				ret_data.threads[i].firstTimestamp = new Date(ret_data.threads[i].firstTimestamp)
			}
			return ret_data;
		});
		return promise;

	};
	this.getThread=function(threadID){
		var promise = $http.get("http://www.marchmegapool.com/apis/msg_thread_api.php?threadID="+threadID+"&method=read").then(function(response) {
			var ret_data = response.data;
			for(var i =0; i <ret_data.posts.length; i++){
				ret_data.posts[i].TimeStamp = new Date(ret_data.posts[i].TimeStamp)
			}
			return response.data;
		});
		return promise;

	};
	
	this.postThread=function(entryID,threadID, text){
		var promise = $http.get("http://www.marchmegapool.com/apis/msg_thread_api.php?threadID="+threadID+"&method=post&poster="+entryID+"&text="+text).then(function(response) {
			return response.data;
		});
		return promise;

	};
	this.newThread=function(entryID,leagueID, thread){
		var promise = $http.get("http://www.marchmegapool.com/apis/msg_thread_api.php?LeagueID="+leagueID+"&method=new&poster="+entryID+"&text="+thread.text+"&title="+thread.title).then(function(response) {
			return response.data;
		});
		return promise;

	};


}]);

megaPoolApp.service('standings', ['$http', function($http) {
	this.getStandings=function(leagueID,year){
		var promise = $http.get("http://www.marchmegapool.com/apis/standings_api.php?LeagueID="+leagueID+"&year="+year).then(function(response) {
			if(JSON.stringify(response.data).length<4){
				return null;
			}

			return response.data;
		});
		return promise;

	};
	this.calcPct=function(record){
		var tieWins = 0
		if (record.ties>0)
		{
			tieWins = record.ties/2;
		}
		var totalWins = parseInt(record.wins) + tieWins;
		var games = parseInt(record.wins) + parseInt(record.losses) + parseInt(record.ties);
		var fullpct = totalWins/games;
		return fullpct.toFixed(3);
	};
	this.calcGB=function(record){
		return "";
	};
	this.calcTotal=function(team){
		if(/\S/.test(team)){
			return parseFloat(team.player.total)+parseFloat(team.bracket.total)+parseFloat(team.team.total);
		}
		else{
			return "";
		}
	}


}]);