	megaPoolApp.controller('msgBoardCtrl',['$scope', '$http',  '$routeParams', 'userdata', 'msgBoard', function($scope, $http,  $routeParams, userdata, msgBoard){
			$scope.league ={};
			$scope.board={};
			$scope.thread={};
			$scope.control={
						newThread:false,
						currentThread:0,
						page:1
			};
			$scope.newPost={
				title:null,
				text:null
			};
			$scope.postText={text:null};
			$scope.setThread=function(threadID){
				$scope.control.currentThread = threadID;
				$scope.getThread($scope.control.currentThread);
				
			};
			$scope.closeThread=function(threadID){
				$scope.control.currentThread = 0;
				$scope.getBoard(($scope.control.page-1)*20);
				
			};
			$scope.nextPage=function(){
				var start = ($scope.control.page -2)*20;
				$scope.getBoard(start);
			};
			$scope.prevPage=function(){
				var start = $scope.control.page*20;
				$scope.getBoard(start);
			};
			$scope.getBoard=function(firstThread){
				msgBoard.getBoard($scope.league.leagueID,firstThread,20).then(function(d) {
					$scope.board = d;
				});				
			};
			$scope.getThread=function(threadID){
				msgBoard.getThread(threadID).then(function(d) {
					$scope.thread = d;
				});				
			};
			$scope.addPost=function(){
				msgBoard.postThread($scope.league.entryID,$scope.control.currentThread, $scope.postText.text).then(function(d){
					$scope.getThread($scope.control.currentThread);
					$scope.postText={text:null};
				});
			};
			$scope.addThread=function(){
				msgBoard.newThread($scope.league.entryID,$scope.league.leagueID,$scope.newPost).then(function(d){
					$scope.control.currentThread = d;
					$scope.getThread($scope.control.currentThread);
					$scope.control.newThread=false;
					$scope.newPost={
						title:null,
						text:null
					};

				});
			};
			if($routeParams.THREAD_ID){
				$scope.setThread($routeParams.THREAD_ID);
			}	
			$scope.league=  userdata.getCurLeague(); 
			$scope.getBoard(0);
	
	}]);