// Generated by LiveScript 1.6.0
(function(){
  var slice$ = [].slice;
  angular.module('nioExplorer.main', []).controller('mainCtrl', function($rootScope, $scope, $location){
	
	
	setTimeout(function(){
		setInterval(function(){
			
			if ($location.path() === '/') {
				
				let blockNumNew = $scope.blocks[0].number + 1;
				
				$rootScope.web3.eth.getBlock(blockNumNew, function(err, item){
					if (err != null) {
					  return console.log('getBlock err: '+err);
					}
					
					console.log('block number: '+blockNumNew);
					
					$scope.blockNum = blockNumNew;
					$scope.blocks.unshift(item);
					$scope.blocks.splice(-1,1);
					
					$rootScope.safeApply();
				});
			}
			
		}, 1000); // 1 sec reload
	}, 100);


	
    var loadBlock, init;
    loadBlock = function(arg$, cb){
      var item, items;
      item = arg$[0], items = slice$.call(arg$, 1);
      if (item == null) {
        return cb(null);
      }
      console.log(item);
      return $rootScope.web3.eth.getBlock($scope.blockNum - item, function(err, item){
		
        if (err != null) {
          return cb(err);
        }
        $scope.blocks.push(item);
        return loadBlock(items, function(err){
          if (err != null) {
            return cb(err);
          }
          return cb(null);
        });
      });
    };
    init = function(){
      var cb;
      cb = console.log;
      $rootScope.loading = true;
      return $rootScope.web3.eth.getBlockNumber(function(err, number){
        if (err != null) {
          return cb(err);
        }
        $scope.blockNum = number;
        $scope.blocks = [];
        return loadBlock([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], function(err){
          if (err != null) {
            return cb(err);
          }
          return $rootScope.safeApply(function(){
            $rootScope.loading = false;
			
            return console.log('loadingstop', err);
          });
        });
      });
    };
    console.log('init');
    return init(function(err){
      return console.log(err);
    });
	
	
	
  });
  angular.module('nioExplorer.search', []).controller('searchCtrl', function($rootScope, $scope, $location){
    var goToBlockInfos, goToAddrInfos, goToTxInfos;
    goToBlockInfos = function(requestStr){
      return $location.path('/block/' + requestStr);
    };
    goToAddrInfos = function(requestStr){
      return $location.path('/address/' + requestStr);
    };
    goToTxInfos = function(requestStr){
      return $location.path('/transaction/' + requestStr);
    };
    return $scope.processRequest = function(){
      var requestStr;
      requestStr = $scope.ethRequest.split('0x').join('');
      if (requestStr.length === 40) {
        return goToAddrInfos(requestStr);
      } else {
        if (requestStr.length === 64) {
          if (/[0-9a-zA-Z]{64}?/.test(requestStr)) {
            return goToTxInfos('0x' + requestStr);
          } else if (/[0-9]{1,7}?/.test(requestStr)) {
            return goToBlockInfos(requestStr);
          }
        } else {
          if (parseInt(requestStr) > 0) {
            return goToBlockInfos(parseInt(requestStr));
          }
        }
      }
      return alert('Don\'t know how to handle ' + requestStr);
    };
  });
}).call(this);
