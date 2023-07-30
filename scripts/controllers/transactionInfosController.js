angular.module('ethExplorer.tx', ['ngRoute','ui.bootstrap'])
    .controller('transactionInfosCtrl', function ($rootScope, $scope, $location, $routeParams,$q) {

       var web3 = $rootScope.web3;
	
        $scope.init=function()
        {
            $scope.txId=$routeParams.transactionId;

            if($scope.txId!==undefined) { // add a test to check if it match tx paterns to avoid useless API call, clients are not obliged to come from the search form...
                $rootScope.loading = true;
                getTransactionInfos()
                    .then(function(result){
                        //TODO Refactor this logic, asynchron calls + services....
                    var number = web3.eth.blockNumber;
                    $rootScope.loading = false;
                    $scope.result = result;

                    if(result.blockHash!==undefined){
                        $scope.blockHash = result.blockHash;
                    }
                    else{
                        $scope.blockHash ='pending';
                    }
                    if(result.blockNumber!==undefined){
                        $scope.blockNumber = result.blockNumber;
                    }
                    else{
                        $scope.blockNumber ='pending';
                    }
                    $scope.from = result.from;
                    $scope.gas = result.gas;
                    $scope.gasPrice = (result.gasPrice.c[0]/1000000000000000000).toFixed(9) + " GWEI";
                    $scope.hash = result.hash;
                    $scope.input = result.input; // that's a string
                    $scope.nonce = result.nonce;
                    $scope.to = result.to;
                    $scope.transactionIndex = result.transactionIndex;
                    $scope.ethValue = result.value.c[0] / 10000; 
                    $scope.txprice = (result.gas * result.gasPrice)/1000000000000000000 + " NIO";
                    if($scope.blockNumber!==undefined){
                        $scope.conf = number - $scope.blockNumber;
                        if($scope.conf===0){
                            $scope.conf='unconfirmed'; //TODO change color button when unconfirmed... ng-if or ng-class
                        }
                    }
                        //TODO Refactor this logic, asynchron calls + services....
                    if($scope.blockNumber!==undefined){
                        var info = web3.eth.getBlock($scope.blockNumber);
                        if(info!==undefined){
                            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit', second:'2-digit' };
                            options.timeZoneName = 'short';
                            $scope.time = new Date(info.timestamp * 1000).toLocaleDateString('en-US', options);
                        }
                    }

                });

            }



            else{
                $location.path("/"); // add a trigger to display an error message so user knows he messed up with the TX number
            }


            function getTransactionInfos(){
                var deferred = $q.defer();

                web3.eth.getTransaction($scope.txId,function(error, result) {
                    if(!error){
                        deferred.resolve(result);
                    }
                    else{
                        deferred.reject(error);
                    }
                });
                return deferred.promise;

            }



        };
        $scope.init();
        console.log($scope.result);

    });
