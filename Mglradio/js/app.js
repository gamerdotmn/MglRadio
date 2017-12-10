var host = "http://app.mglradio.com";

angular.module('mglradioapp', ['ionic','ngAnimate','ngSanitize', 'ksSwiper'])
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $stateProvider
            .state('app', {
                       url: "/app",
                       abstract: true,
                       templateUrl: "templates/menu.html",
                       controller: "IndexCtrl"
                   }) 
            .state('app.news', { 
                       url: "/news", 
                       views: {
                    'newsContent' :{ 
                                   templateUrl: "templates/news.html",
                                   controller: "NewsCtrl"
                               }
                }
                   })
            .state('app.category', {
                       url: "/category/:id",
                       views: {
                    'newsContent' :{
                                   templateUrl: "templates/category.html",
                                   controller: "CategoryCtrl"
                               }
                }
                   })
            .state('app.category2', {
                       url: "/category2/:id",
                       views: {
                    'newsContent' :{
                                   templateUrl: "templates/category2.html",
                                   controller: "Category2Ctrl"
                               }
                }
                   })
            .state('app.detail', {
                       url: "/detail/:id",
                       views: {
                    'newsContent' :{
                                   templateUrl: "templates/detail.html",
                                   controller: "DetailCtrl"
                               }
                }
                   })
            .state('app.detail2', {
                       url: "/detail2/:id",
                       views: {
                    'newsContent' :{
                                   templateUrl: "templates/detail2.html",
                                   controller: "Detail2Ctrl"
                               }
                }
                   })
            .state('app.radio', {
                       url: "/radio",
                       views: {
                    'radioContent' :{
                                   templateUrl: "templates/radio.html",
                                   controller: "RadioCtrl"
                               }
                }
                   })
            .state('app.tv', {
                       url: "/tv",
                       views: {
                    'tvContent' :{
                                   templateUrl: "templates/tv.html",
                                   controller: "TvCtrl"
                               }
                }
                   })
            .state('app.content', {
                       url: "/content",
                       views: {
                    'contentContent' :{
                                   templateUrl: "templates/content.html",
                                   controller: "ContentCtrl"
                               }
                }
                   })
            .state('app.type', {
                       url: "/type/:id",
                       views: {
                    'contentContent' :{
                                   templateUrl: "templates/type.html",
                                   controller: "TypeCtrl"
                               }
                }
                   })
            .state('app.login', {
                       url: "/login",
                       views: {
                    'contentContent' :{
                                   templateUrl: "templates/login.html",
                                   controller: "LoginCtrl"
                               }
                }
                   })
            .state('app.download', {
                       url: "/download",
                       views: {
                    'contentContent' :{
                                   templateUrl: "templates/download.html",
                                   controller: "DownloadCtrl"
                               }
                }
                   });
        $urlRouterProvider.otherwise("/app/radio");
        $ionicConfigProvider.views.transition('ios');
        $ionicConfigProvider.scrolling.jsScrolling(true);
    })
    .directive('imageonload', function() {
        return {
            link: function(scope, element, attrs) {
                
                element.on('load', function() {
                    element.parent().find('center').remove();
                });
                element.on('error', function() {
                    document.getElementById("bigimg").src='img/logo.png';
                });
                scope.$watch('ngSrc', function() {
                    element.parent().prepend('<center><img src="img\\loading.gif" style="width:100px;height:100px;"/></center>');
                });    
            }
        }
    })
    .directive('bimg', function() {
        return {
            link: function(scope, element, attrs) {
                var image = new Image();
                image.src=attrs.bimg;
                image.onerror=function(){
                    element.css({
                        'background-image':'url(img/logo.png)'
                    }); 
                };
                image.onload = function () {
                    element.css({
                        'background-image':'url('+attrs.bimg+')'
                    });
                };
            }
        }
    })
    .config(function($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
    })
    .run(function($rootScope, $ionicPlatform) {
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    })
    .controller('IndexCtrl', function($scope, $state,$ionicScrollDelegate, $rootScope, $ionicModal, $location, $ionicHistory, $ionicLoading, dataService, $http, $interval, $timeout, $window) {
        $scope.status = 0;
        $scope.rtitle = 'MGL RADIO';
        $scope.page=0;
        $scope.moredata=false;
        $rootScope.loginstatus=false;
        
        $scope.menu =0;
        $scope.nexpand=0;
        $scope.iexpand=0;
        
        $scope.nexp=function()
        {
            if($scope.nexpand===0)
            {
                $scope.nexpand=1;
            }
            else
            {
                $scope.nexpand=0;
            }
            $ionicScrollDelegate.resize();
        };
        
        $scope.iexp=function()
        {
           if($scope.iexpand===0)
            {
                $scope.iexpand=1;
            }
            else
            {
                $scope.iexpand=0;
            }
            $ionicScrollDelegate.resize();
        };
        
        $rootScope.$on('$stateChangeSuccess', 
                       function(event, toState, toParams, fromState, fromParams) { 
                           if ($state.current.name === "app.news") {
                               $scope.menu = 0;
                           }
                           if ($state.current.name === "app.content") {
                               $scope.menu = 1;
                           }
                           if ($state.current.name === "app.download") {
                               $scope.menu = 1;
                           }
                       });
        
        setTimeout(function()
        {
            
            NativeStorage.getItem("username",function(obj){
            
                if(obj!==null)
                {
                    $rootScope.username=obj;
                    $rootScope.loginstatus=true;
                }
            
            },function(err){});
            
        },5000);
        
        $scope.tologin=function()
        {
            $window.location.href = '#/app/login';
        };
        
        $scope.tologout=function()
        {
            $rootScope.loginstatus = false; 
            $rootScope.username = "";
            NativeStorage.remove("username",function(obj){},function(err){});
            $window.location.href = '#/app/news';
        };
        
        $scope.goBack = function() {
            $ionicHistory.goBack();
        };
        
        $scope.loadmore=function(){
             if($scope.news!=null&&$scope.news.length>0)
             {
                 $http.get(host+"/api/news.php?p="+$scope.page)
                 .then(function(response) {
                   
                    for(var i=0;i<response.data.news.length;i++)
                    {
                        $scope.news.push(response.data.news[i]);
                    }
                    
                    $timeout(function () {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                         $scope.page=$scope.page+1;
                    },2000);
                 });
             }
             
        };
        
        $scope.load = function() {
            $ionicLoading.show({template:'<ion-spinner icon="ripple"></ion-spinner>'});
            dataService.getInit().success(function(data) {
                $scope.categories2 = data.categories2;
                $scope.categories = data.categories;
                $scope.news = data.news;
                
                $timeout(function () {
                $ionicLoading.hide();
                    $ionicLoading.hide();
                },2000);
                
                $timeout(function () {
                    $scope.moredata=true;
                },6000);
            }).error(function() {
                $ionicLoading.hide();
            });
        };
        $rootScope.contents = [];
        
        
        $scope.doRefresh = function() {
            $scope.page=0;
            $scope.load();
            $scope.$broadcast('scroll.refreshComplete');
        };
        
        $interval(function () {
            $http({
                      method : "GET",
                      url : host + "/api/tv.php"
                  }).then(function success(response) {
                      $scope.rtitle = response.data.radio;
                      if (typeof(MusicControls) !== 'undefined' && MusicControls!== null) {
                          MusicControls.updateTitle($scope.rtitle);
                      }
                      $scope.vid = response.data.vid;
                      $scope.id = response.data.id;
                      $scope.app = response.data.app;
                      if ($scope.app.length > 0) {
                          $scope.status = 1;
                          $timeout(function () {
                              var divs = document.getElementsByClassName('badge');
                              for (var i = 0;i < divs.length;i++) {
                                  if (divs[i].innerHTML !== "LIVE") {
                                      divs[i].innerHTML = "LIVE";
                                  }
                              }
                          }, 25); 
                      } else {
                          $scope.status = 0;
                      }
                  }, function error() {
                      $scope.status = 0;
                  });
        }, 5000);
        
        $ionicModal.fromTemplateUrl('templates/payment.html', {
                                        scope: $scope
                                    }).then(function(modal) {
                                        $scope.paymentmodal = modal;
                                    });
            
        $ionicModal.fromTemplateUrl('templates/contentdetail.html', {
                                        scope: $scope,
                                        animation: 'slide-in-up'
                                    }).then(function(modal) {
                                        $scope.modal = modal;
                                    });
        
        $scope.detail = function(id) {
            if($rootScope.loginstatus===false&&window.net===true)
            {
                $window.location.href = '#/app/login';    
            }
            else
            {
                angular.forEach($rootScope.contents, function(value, key) {
                if (value.id===id) {
                    $rootScope.contentdetail = value;
                }
                });
                $scope.modal.show();
            }
            
            
        };
        
        $scope.playvideo=function()
        {
            $scope.modal.hide();
            var ind=0;
            
            for(var k=0;k<gplaylist.length;k++)
            {
                if($rootScope.contentdetail.id===gplaylist[k].id)
                {
                    ind=k;
                    break;
                }
            }
            player_show(ind);
        };
        
        $scope.downloadvideo=function()
        {
            if(window.localStorage.getItem("d_is")===null)
            {
                angular.forEach($rootScope.contents, function(value, key) {
                    if (value.id===$rootScope.contentdetail.id) {
                        value.downloaded=1;
                        $rootScope.contentdetail = value;
                    }
                });
                
                window.localStorage.setItem("d_is", true);
                window.localStorage.setItem("d_id",$rootScope.contentdetail.id);
                window.localStorage.setItem("d_name",$rootScope.contentdetail.name);
                window.localStorage.setItem("d_description",$rootScope.contentdetail.description);
                window.localStorage.setItem("d_path",$rootScope.contentdetail.path);
                window.localStorage.setItem("d_img",$rootScope.contentdetail.img);
                window.localStorage.setItem("d_typen",$rootScope.contentdetail.typen);
                window.localStorage.setItem("d_time",$rootScope.contentdetail.time);
                
                window.download.d_path=encodeURI($rootScope.contentdetail.path);
                window.download.d_img=encodeURI($rootScope.contentdetail.img);
                window.download.d_name=$rootScope.contentdetail.name;
                window.download.d_time=$rootScope.contentdetail.time;
                
                window.download.startDownload();
            }
            else
            {
                navigator.notification.alert(
                    'Давхар таталт хийх боломжгүй байна.',
                    function() {
                    }, 
                    'Уучлаарай.', 
                    'OK'                  
                    );
            }
        };
        
        $scope.downloadstatus= "";
        $scope.downloadanimate = "slideInUp";
        
        setInterval(function() { 
            $scope.$apply(function () {
                $scope.downloadstatus=downloadstatus;
                $scope.downloadanimate=downloadanimate;
            });
        }, 500);
        
    })
    .controller('NewsCtrl', function($rootScope, $scope, $ionicLoading,$timeout,$window) {
       
        $scope.load();
        
    })
    .controller('Category2Ctrl', function($scope, $ionicLoading, $timeout, $stateParams,$http) {
        $scope.cnews = [];
        $ionicLoading.show({template: '<ion-spinner icon="ripple"></ion-spinner>'});
        $scope.category_id = $stateParams.id;
        $http.get("http://app.mglradio.com/api/cnews2.php?c="+$scope.category_id)
                 .then(function(response) {
                     $scope.cnews=response.data.news;
                     $ionicLoading.hide();
                     
                 });
    })
    .controller('CategoryCtrl', function($scope, $ionicLoading, $timeout, $stateParams,$http) {
        $scope.cnews = [];
        $ionicLoading.show({template: '<ion-spinner icon="ripple"></ion-spinner>'});
        $scope.category_id = $stateParams.id;
        $http.get("http://app.mglradio.com/api/cnews.php?c="+$scope.category_id)
                 .then(function(response) {
                     $scope.cnews=response.data.news;
                     $ionicLoading.hide();
                 });
    })
    .controller('DetailCtrl', function($rootScope, $scope, $ionicLoading, $stateParams,$http) {
        
        $ionicLoading.show({template: '<ion-spinner icon="ripple"></ion-spinner>'});
        $http.get("http://app.mglradio.com/api/detail.php?i="+$stateParams.id)
                 .then(function(response) {
                     $scope.newsdetail=response.data.news[0];
                     $scope.relnews=response.data.rels;
                     $ionicLoading.hide();
                 });
        
        $scope.share = function() {
            // this is the complete list of currently supported params you can pass to the plugin (all optional)
            var options = {
                url: $scope.newsdetail.share,
            } 
            var onSuccess = function() {
            }

            var onError = function() {
            }
            window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
        }
    })
.controller('Detail2Ctrl', function($rootScope, $scope, $ionicLoading, $stateParams,$http) {
        
        $ionicLoading.show({template: '<ion-spinner icon="ripple"></ion-spinner>'});
        $http.get("http://app.mglradio.com/api/detail2.php?i="+$stateParams.id)
                 .then(function(response) {
                     $scope.newsdetail=response.data.news[0];
                     $scope.relnews=response.data.rels;
                     $ionicLoading.hide();
                 });
        
        $scope.share = function() {
            var options = {
                url: $scope.newsdetail.share,
            } 
            var onSuccess = function() {
            }

            var onError = function() {
            }
            window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
        }
    })
    .controller('RadioCtrl', function($rootScope, $scope, $ionicLoading, $window, $timeout, $ionicScrollDelegate,$location,$http,$ionicModal) {
        $timeout(function () {
            $scope.net=window.net;
            if($scope.net===false)
            {
                //$window.location.href = '#/app/download';
            }
        }, 10000); 
        
        setTimeout(function()
        {
            var fileName = "photos.jpg",
            uriString = "https://content.ikon.mn/news/2017/12/8/28b833_MPA_PHOTO-4717_x974.jpg";
            alert('start');
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                fileSystem.root.getFile(fileName, { create: true }, function (targetFile) {
                    var complete = function() {
                        targetFile.file(function (meta) {
                            alert(meta);
                        });
                    };
                    var error = function (e) {
                        alert('error'+e);
                    };
                    var progress = function(p) {
                        console.log(parseInt(100 * p.bytesReceived / p.totalBytesToReceive));
                    };
                    var downloader = new BackgroundTransfer.BackgroundDownloader();
                    var download = downloader.createDownload(uriString, targetFile);
                    download.startAsync().then(complete, error, progress);
                    
                },function(e1){alert(e1);});
            },function(e2){alert(e2);});
        
        },10000);
        
        $scope.d=moment().weekday();
        $scope.ptitle="";
        
        if($scope.d===0)
        {
            $scope.d=7;
        }
        
        if($scope.d===1)
        {
            $scope.dt1=moment().add(0,'day').format('MM/DD');
            $scope.dt2=moment().add(1,'day').format('MM/DD');
            $scope.dt3=moment().add(2,'day').format('MM/DD');
            $scope.dt4=moment().add(3,'day').format('MM/DD');
            $scope.dt5=moment().add(4,'day').format('MM/DD');
            $scope.dt6=moment().add(5,'day').format('MM/DD');
            $scope.dt7=moment().add(6,'day').format('MM/DD');
        }
        else if($scope.d===2)
        {
            $scope.dt1=moment().add(-1,'day').format('MM/DD');
            $scope.dt2=moment().add(0,'day').format('MM/DD');
            $scope.dt3=moment().add(1,'day').format('MM/DD');
            $scope.dt4=moment().add(2,'day').format('MM/DD');
            $scope.dt5=moment().add(3,'day').format('MM/DD');
            $scope.dt6=moment().add(4,'day').format('MM/DD');
            $scope.dt7=moment().add(5,'day').format('MM/DD');
        }
        else if($scope.d===3)
        {
            $scope.dt1=moment().add(-2,'day').format('MM/DD');
            $scope.dt2=moment().add(-1,'day').format('MM/DD');
            $scope.dt3=moment().add(0,'day').format('MM/DD');
            $scope.dt4=moment().add(1,'day').format('MM/DD');
            $scope.dt5=moment().add(2,'day').format('MM/DD');
            $scope.dt6=moment().add(3,'day').format('MM/DD');
            $scope.dt7=moment().add(4,'day').format('MM/DD');
        }
        else if($scope.d===4)
        {
            $scope.dt1=moment().add(-3,'day').format('MM/DD');
            $scope.dt2=moment().add(-2,'day').format('MM/DD');
            $scope.dt3=moment().add(-1,'day').format('MM/DD');
            $scope.dt4=moment().add(0,'day').format('MM/DD');
            $scope.dt5=moment().add(1,'day').format('MM/DD');
            $scope.dt6=moment().add(2,'day').format('MM/DD');
            $scope.dt7=moment().add(3,'day').format('MM/DD');
        }
        else if($scope.d===5)
        {
            $scope.dt1=moment().add(-4,'day').format('MM/DD');
            $scope.dt2=moment().add(-3,'day').format('MM/DD');
            $scope.dt3=moment().add(-2,'day').format('MM/DD');
            $scope.dt4=moment().add(-1,'day').format('MM/DD');
            $scope.dt5=moment().add(0,'day').format('MM/DD');
            $scope.dt6=moment().add(1,'day').format('MM/DD');
            $scope.dt7=moment().add(2,'day').format('MM/DD');
        }
        else if($scope.d===6)
        {
            $scope.dt1=moment().add(-5,'day').format('MM/DD');
            $scope.dt2=moment().add(-4,'day').format('MM/DD');
            $scope.dt3=moment().add(-3,'day').format('MM/DD');
            $scope.dt4=moment().add(-2,'day').format('MM/DD');
            $scope.dt5=moment().add(-1,'day').format('MM/DD');
            $scope.dt6=moment().add(0,'day').format('MM/DD');
            $scope.dt7=moment().add(1,'day').format('MM/DD');
        }
        else if($scope.d===7)
        {
            $scope.dt1=moment().add(-6,'day').format('MM/DD');
            $scope.dt2=moment().add(-5,'day').format('MM/DD');
            $scope.dt3=moment().add(-4,'day').format('MM/DD');
            $scope.dt4=moment().add(-3,'day').format('MM/DD');
            $scope.dt5=moment().add(-2,'day').format('MM/DD');
            $scope.dt6=moment().add(-1,'day').format('MM/DD');
            $scope.dt7=moment().add(0,'day').format('MM/DD');
        }
        
        $ionicModal.fromTemplateUrl('templates/playlist.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.modalt = modal;
        });
        
        $scope.playType = function(id) {
            $scope.pause();
            $ionicLoading.show({template: '<ion-spinner icon="ripple"></ion-spinner>'});
            $http.get(host+"/api/playlist.php?id="+id)
                     .then(function(response) 
                        {
                            $scope.plist=response.data.list;
                            gplaylist=$scope.plist;
                            if($scope.plist.length>0)
                            {
                                $scope.ptitle=$scope.plist[0].tname;
                            }
                            $ionicLoading.hide();
                            $scope.modalt.show();
                        });
        };
        
        $scope.closeType = function() {
            $scope.modalt.hide();
        };
           
        $scope.getbyid = function(id) {
            var r = null;
            for (var i = $scope.timetables.length - 1;i >= 0;i--) {
                if (parseInt($scope.timetables[i].id)===id) {
                    r = $scope.timetables[i];
                    break;
                }
            }
            return r;
        };
        
        $scope.sc = function(d)
        {
            $ionicLoading.show({template: '<ion-spinner icon="ripple"></ion-spinner>'});
            $scope.d=d;
            $scope.timetables=[];
            $http.get(host+"/api/ts.php?day="+$scope.d)
                     .then(function(response) 
                        {
                            $scope.timetables=response.data.timetables;
                            $scope.active();
                            $ionicLoading.hide();
                            
                        });
        };
        
        $scope.active = function() {
            $ionicScrollDelegate.scrollTop();
            var now = moment();
            
            var d = false;
            if (typeof($scope.timetables)!=="undefined") {
                for (var i = $scope.timetables.length - 1;i >= 0;i--) {
                    
                    $scope.timetables[i].isactive = false;
                    $scope.timetables[i].isnotif = false;
                    if (window.localStorage.getItem($scope.timetables[i].id)!==null) {
                        $scope.timetables[i].isnotif = true;
                    }
                    var t = moment($scope.timetables[i].date + "T" + $scope.timetables[i].time+"+08:00");
                    $scope.timetables[i].ttime = t.local().format('HH:mm');
                    
                    if (moment().format('YYYY-MM-DD')===$scope.timetables[i].date&&now.isAfter(t)) {
                        if (d===false) {
                            $scope.timetables[i].isactive = true;
                            d = true;
                            $location.hash('r'+$scope.timetables[i].id);
                            $timeout(function () {
                                $ionicScrollDelegate.anchorScroll(true);
                                $ionicScrollDelegate.scrollBy(0,-30);
                            },100);
                        }
                    }
                }
            }
        }
        
        
        $scope.playstatus = false;
        $ionicLoading.show({template: '<ion-spinner icon="ripple"></ion-spinner>'});
        
        $http.get(host+"/api/ts.php?day="+$scope.d)
                 .then(function(response) 
                    {
                        $scope.timetables=response.data.timetables;
                        $scope.active();
                        $ionicLoading.hide();
                    });
        
        setInterval(function() { 
            $scope.$apply(function () {
                $scope.playstatus = isplaying;
            });
        }, 500);
        
        setInterval(function() { 
            $scope.active();
        }, 120000);
        
        $scope.playstatus = true;
        $scope.play = function() {
            if (!navigator.onLine) {
                navigator.notification.alert(
                    'Та интернет холболтоо шалгаад дахин үзнэ үү.',
                    function() {
                    }, 
                    'Уучлаарай, холболт амжилтгүй.', 
                    'OK'                  
                    );
            } else {
                if (my_media===null) {
                    $ionicLoading.show({template:'<ion-spinner icon="ripple"></ion-spinner>'});
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 2500);
                }
                play();
                $scope.playstatus = isplaying;
            }
        };
        
        $scope.playlist=function(o)
        {
            $scope.closeType();
            player_show(o);
        };
        
        $scope.pause = function() {
            pause();
            $scope.playstatus = isplaying;
        }
        
        $scope.notif = function(id) { 
            var c = $scope.getbyid(id);
            if (!c.isnotif) {
                
                navigator.notification.confirm(
                    c.time + ' ' + c.title + '-г сануулах уу?', 
                    function(b) {
                        if (b === 1) {
                            var t = moment(c.date + "T" + c.time+"+08:00");
                            
                            var now = t.local().toDate();
                            cordova.plugins.notification.local.schedule({
                                                                            id: parseInt(c.id),
                                                                            title: "FM 102.1",
                                                                            text: c.time + ' ' + c.title + " хөтөлбөр эхэллээ.",
                                                                            at: now, // firstAt and at properties must be an IETF-compliant RFC 2822 timestamp
                                                                            //every: "week", // this also could be minutes i.e. 25 (int)
                                                                            //sound: "file://sounds/reminder.mp3",
                                                                            //icon: "http://app.mglradio.com/build/images/logo/logo.png",
                                                                            data: { id:c.id }
                                                                        });
                            window.localStorage.setItem(c.id, true);
                            $scope.active();
                        }
                    }, 
                    'Сануулга', 
                    'Тийм,Үгүй'         
                    );
            } else {
                navigator.notification.confirm(
                    c.time + ' ' + c.title + '-г санамж устгах уу?', 
                    function(b) {
                        if (b === 1) {
                            cordova.plugins.notification.local.cancel(parseInt(c.id), function() {
                            });
                            window.localStorage.removeItem(c.id);
                            $scope.active();
                        }
                    }, 
                    'Сануулга', 
                    'Тийм,Үгүй'         
                    );
            }
        }
       
    })
    .controller('TvCtrl', function($rootScope, $scope, $ionicLoading, $http, $timeout,$ionicModal) {
        $scope.playVideo = function(app,id,vid) {
            if (app==="youtube") {
                window.open('https://www.youtube.com/watch?v=' + vid, '_system');
            } else {
                window.open('https://www.facebook.com/' + id + '/videos/' + vid, '_system');
            }
        };
        
        $scope.playLiveVideo = function() {
            if ($scope.app==="youtube") {
                window.open('https://www.youtube.com/watch?v=' + $scope.vid, '_system');
            } else {
                window.open('https://www.facebook.com/' + $scope.id + '/videos/' + $scope.vid, '_system');
            }
        };
        
        $ionicModal.fromTemplateUrl('templates/tvlist.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.modalt = modal;
        });
        
        $scope.playTV = function() {
            
            $ionicLoading.show({template: '<ion-spinner icon="ripple"></ion-spinner>'});
            $http.get(host+"/api/tvlist.php")
                     .then(function(response) 
                        {
                            $scope.tlist=response.data.list;
                            $ionicLoading.hide();
                            $scope.modalt.show();
                        });
        };
        
        $scope.closeTV = function() {
            $scope.modalt.hide();
        };
    })
    .controller('ContentCtrl', function($rootScope, $ionicScrollDelegate, $scope, $ionicLoading, $ionicModal, $window, dataService, $timeout) {
        
        $scope.gv=true;
        
        $scope.$on('$ionicView.enter', function(){
        
            $ionicLoading.show({template:'<ion-spinner icon="ripple"></ion-spinner>'});
            dataService.getContent().success(function(data) {
                var contents=data.contents;
                $rootScope.contents = contents;
                $rootScope.types=data.types;
                
                db.transaction(function(tx) {
                  tx.executeSql("select * from content", [], function(tx, results) {
                    
                    for(var i=0;i<results.rows.length;i++)
                    {
                        for(var j=0;j<contents.length;j++)
                        {
                            if (parseInt(contents[j].id)===parseInt(results.rows.item(i).id))
                            {
                                contents[j].img=results.rows.item(i).img;
                                contents[j].path=results.rows.item(i).path;
                                contents[j].downloaded=2;
                                break;
                            }
                        }
                    }
                    
                    $rootScope.contents = contents;
                    gplaylist=[];
                    
                    for(var k=0;k<$rootScope.contents.length;k++)
                    {
                        gplaylist[k]={id:$rootScope.contents[k].id,name:$rootScope.contents[k].name,img:$rootScope.contents[k].img,path:$rootScope.contents[k].path};         
                    }
                      
                  }, function(error) {
                  
                  });
                }, function(error) {
                
                }, function() {
                
                });
                
                $ionicLoading.hide();
            }).error(function() {
                $ionicLoading.hide();
            });    
            
        });
        $scope.net=true;
        $timeout(function () {
            $scope.net=window.net;
        }, 1000); 
        
        
        $scope.todownloading=function()
        {
            $window.location.href = '#/app/download';  
        };
        
        $scope.grid=function()
        {
            $scope.gv=true;  
            $ionicScrollDelegate.resize();
        };
        
        $scope.list=function()
        {
            $scope.gv=false;
            $ionicScrollDelegate.resize();
        };
        
        $scope.ot=function()
        {
            if($scope.gv)
            {
                $scope.list();
            }
            else
            {
                $scope.grid();
            }
        };
    })
    .controller('TypeCtrl', function($scope, $ionicLoading, $timeout, $stateParams, $rootScope) {
        $ionicLoading.show({template: '<ion-spinner icon="ripple"></ion-spinner>'});
        if ($stateParams !== 'undefined') {
            var h = window.innerHeight;
            var sh = (h * 30) / 100;
            $scope.height = sh;
            
            $scope.type_content = [];
            
            angular.forEach($rootScope.contents, function(value, key) {
                if (value.type_id===$stateParams.id) {
                    $scope.type_content.push(value);
                }
            });
        
            $scope.type_id = $stateParams.id;
            
        }
        $timeout(function () {
            $ionicLoading.hide();
        }, 1000); 
        
    })
    .controller('DownloadCtrl', function($scope, $window, $timeout,$interval,$rootScope,$ionicScrollDelegate) {
        
        $scope.gv=true;
        
        $scope.grid=function()
        {
            $scope.gv=true;  
            $ionicScrollDelegate.resize();
        };
        
        $scope.list=function()
        {
            $scope.gv=false;
            $ionicScrollDelegate.resize();
        };
        
        $scope.ot=function()
        {
            if($scope.gv)
            {
                $scope.list();
            }
            else
            {
                $scope.grid();
            }
        };
        
        $scope.downloadstatus="";
        $scope.dc=[];
        angular.forEach($rootScope.contents, function(value, key) {
                if (value.downloaded===1) {
                    $scope.downloadname=value.name;
                    $scope.downloadtypen=value.typen;
                    $scope.downloadtime=value.time;
                    $scope.downloadimg=value.img;
                }
            });
        
        $interval(function () {
            if(window.downloadstatus!=$scope.downloadstatus)
            {
                $scope.refresh();
            }
            $scope.downloadstatus=window.downloadstatus;
        }, 1000);
        
        $scope.tocontents=function()
        {
            $window.location.href = '#/app/content';  
        };
        
        $scope.detailo = function(id) {
            for(var i=0;i<$scope.dc.length;i++)
            {
                if($scope.dc[i].id===id)
                {
                    $rootScope.contentdetail={
                            id:id,
                            name:$scope.dc[i].name,
                            description:$scope.dc[i].description,
                            typen:$scope.dc[i].typen,
                            img:$scope.dc[i].img,
                            path:$scope.dc[i].path,
                            time:$scope.dc[i].time
                        };
                    break;
                }
            }
            
            $scope.modal.show();
        };
        
        $scope.refresh=function()
        {
              gplaylist=[];
              var dct=[];
              db.transaction(function(tx) {
              tx.executeSql("select * from content", [], function(tx, results) {
                $scope.$apply(function () {
                    
                for(var i=0;i<results.rows.length;i++)
                {
                    gplaylist[i]={id:results.rows.item(i).id,name:results.rows.item(i).name,img:results.rows.item(i).img,path:results.rows.item(i).path};       
                    dct.push({id:results.rows.item(i).id,name:results.rows.item(i).name,description:results.rows.item(i).description,path:results.rows.item(i).path,img:results.rows.item(i).img,typen:results.rows.item(i).typen,time:results.rows.item(i).time});
                }
                
                $scope.dc=dct;
                
                });
              }, function(error) {
              
              });
            }, function(error) {
            
            }, function() {
            
            });
        };
        $scope.refresh();
    })    
    .controller('LoginCtrl', function($scope, $window, $http, $rootScope, $timeout, $ionicLoading) {
        
        $scope.loginpage = true;
        $scope.signuppage = false;
        $scope.forgetpage = false;
        
        $scope.signuppageshow = function() {
            $ionicLoading.show({template: '<ion-spinner icon="ripple"></ion-spinner>'});
            $scope.loginpage = false;
            $scope.forgetpage = false;
            $timeout(function () {
                $scope.signuppage = true;
                $ionicLoading.hide();
            }, 1000);
        }
        $scope.forgetpageshow = function() {
            $ionicLoading.show({template: '<ion-spinner icon="ripple"></ion-spinner>'});
            $scope.loginpage = false;
            $scope.signuppage = false;
            $timeout(function () {
                $ionicLoading.hide();
                $scope.forgetpage = true;
            }, 1000);
        }
        $scope.back = function() {
            $ionicLoading.show({template: '<ion-spinner icon="ripple"></ion-spinner>'});
            if ($scope.loginpage) {
                $window.location.href = '#/app/content';
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1000);
            }
            if ($scope.signuppage) {
                $scope.signuppage = false;
                $scope.forgetpage = false;
                $timeout(function () {
                    $ionicLoading.hide();
                    $scope.loginpage = true;
                }, 1000);
            }
            if ($scope.forgetpage) {
                $scope.signuppage = false;
                $scope.forgetpage = false;
                $timeout(function () {
                    $ionicLoading.hide();
                    $scope.loginpage = true;
                }, 1000);
            }
        }
        
        function alertCallback() {
        }
        
        $scope.login = function(user) {
            if (user) {
                if (typeof user.name !== "undefined" && user.name !== "") {
                    if (typeof user.pwd !== "undefined" && user.pwd !== "") {
                        var data = {
                            name:user.name,
                            pwd:user.pwd
                        };
                        var loginresponse = $http.post(host + "/api/login.php", data, {});
                        loginresponse.success(function(data, status, headers, config) {
                            if (data === "1") {
                                NativeStorage.setItem("username",user.name);
                                $rootScope.loginstatus = true;
                                $rootScope.username = user.name;
                                $window.location.href = '#/app/content';
                            } else {
                                navigator.notification.alert("Нууц үг болон нэвтрэх нэр алдаатай байна!", alertCallback, "Алдаа", "Хаах");
                            }
                        });
                        loginresponse.error(function(data, status, headers, config) {
                            navigator.notification.alert("Нэвтрэхэд алдаа гарлаа дахин оролдоно уу!", alertCallback, "Алдаа", "Хаах");
                        });
                    } else {
                        navigator.notification.alert("Нууц үгээ оруулна уу!", alertCallback, "Алдаа", "Хаах");
                    }    
                } else {
                    navigator.notification.alert("Нэвтрэх нэрээ оруулна уу!", alertCallback, "Алдаа", "Хаах");
                }
            } else {
                navigator.notification.alert("Талбарыг бөглөнө үү!", alertCallback, "Алдаа", "Хаах");
            }
        }
        function alphanumeric(inputtxt) {
            var letterNumber = /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{6,50}$/;  
            if (inputtxt.match(letterNumber)) {  
                return true;  
            } else {   
                return false;   
            }  
        }  
        $scope.signup = function(user) {
            if (user) {
                if (typeof user.user_id !== "undefined" && user.user_id !== "") {
                    if (typeof user.email !== "undefined" && user.email !== "") {
                        if (typeof user.pwd !== "undefined" && user.pwd !== "") {
                            if (alphanumeric(user.pwd)) {
                                if (typeof user.confirm !== "undefined" && user.confirm !== "") {
                                    if (user.pwd === user.confirm) {
                                        var data = {
                                            user_id:user.user_id,
                                            email:user.email,
                                            pwd:user.pwd
                                        };
                                        var signupresponse = $http.post(host + "/api/signup.php", data, {});

                                        signupresponse.success(function(data, status, headers, config) {
                                            
                                            if (data === "2") {
                                                NativeStorage.setItem("username",user.user_id);
                                                $rootScope.loginstatus = true; 
                                                $rootScope.username = user.user_id;
                                                $window.location.href = '#/app/content';
                                            } else if (data === "0") {
                                                navigator.notification.alert("Нэвтрэх нэр давхардаж байна!", alertCallback, "Алдаа", "Хаах");
                                            } else if (data === "1") {
                                                navigator.notification.alert("Мэйл хаяг давхардаж байна!", alertCallback, "Алдаа", "Хаах");
                                            } else {
                                                navigator.notification.alert("Бүртгэхэд алдаа гарлаа дахин оролдоно уу!", alertCallback, "Алдаа", "Хаах");
                                            }
                                        });

                                        signupresponse.error(function(data, status, headers, config) {
                                            navigator.notification.alert("Бүртгэхэд алдаа гарлаа дахин оролдоно уу!", alertCallback, "Алдаа", "Хаах");
                                        });
                                    } else {
                                        navigator.notification.alert("Нууц үг зөрж байна!", alertCallback, "Алдаа", "Хаах");
                                    }
                                } else {
                                    navigator.notification.alert("Нууц үгээ дахин оруулах хэсгийг бөглөнө үү!", alertCallback, "Алдаа", "Хаах");
                                }   
                            } else {
                                navigator.notification.alert("Нууц үг 6 ба түүнээс дээш тэмдэгт байх ёстой бөгөөд Латин үсэг, тоогоор бичигдэнэ!", alertCallback, "Алдаа", "Хаах");
                            } 
                        } else {
                            navigator.notification.alert("Нууц үгээ оруулна уу!", alertCallback, "Алдаа", "Хаах");
                        }
                    } else {
                        navigator.notification.alert("Цахим хаягаа оруулна уу!", alertCallback, "Алдаа", "Хаах");
                    }    
                } else {
                    navigator.notification.alert("Нэвтрэх нэрээ оруулна уу!", alertCallback, "Алдаа", "Хаах");
                }
            } else {
                navigator.notification.alert("Талбарыг бөглөнө үү!", alertCallback, "Алдаа", "Хаах");
            }
        }
        $scope.forget = function(user) {
            if (user) {
                if (typeof user.email !== "undefined" && user.email !== "") {
                    var data = {
                        email:user.email
                    };
                    var forgetresponse = $http.post(host + "/api/forget.php", data, {});

                    forgetresponse.success(function(data, status, headers, config) { 
                        if (data !== "0") {
                            var str = data;
                            var res = str.split("=");
                            NativeStorage.setItem("username",res[0]);
                            $rootScope.loginstatus = true;
                            $rootScope.username = res[0];
                            navigator.notification.alert("Таны и-мейл хаягруу шинэ нууц үгийг илгээлээ. И-мейл хаягаа шалган шинэ нууц үгээрээ нэвтэрнэ үү.!", alertCallback, "Амжилттай", "Хаах");
                            $window.location.href = '#/app/content';
                        } else if (data === "0") {
                            navigator.notification.alert("И-мейл хаяг бүртгэлгүй байна!", alertCallback, "Алдаа", "Хаах");
                        } else {
                            navigator.notification.alert("Нууц үг сэргээхэд алдаа гарлаа дахин оролдоно уу!", alertCallback, "Алдаа", "Хаах");
                        }
                    });

                    forgetresponse.error(function(data, status, headers, config) {
                        navigator.notification.alert("Нууц үг сэргээхэд алдаа гарлаа дахин оролдоно уу!", alertCallback, "Алдаа", "Хаах");
                    });
                } else {
                    navigator.notification.alert("Цахим хаягаа оруулна уу!", alertCallback, "Алдаа", "Хаах");
                }
            } else {
                navigator.notification.alert("Талбарыг бөглөнө үү!", alertCallback, "Алдаа", "Хаах");
            }
        }
    })
    .filter('trustAsHtml', function($sce) {
        return $sce.trustAsHtml;
    })
    .filter('timeago2', function($sce) {
        return "123";
    })
    .filter("timeago", function () {
        return function (time, local, raw) {
            var t = time;
            var a = moment(time);
            var b = moment();
            var offset = b.diff(a, "seconds"),
                span = [],
                MINUTE = 60,
                HOUR = 3600,
                DAY = 86400,
                fulldate = false;

            if (offset <= MINUTE) {
                span = [ '', 'Дөнгөж сая' ];
            } else if (offset < (MINUTE * 60)) {
                span = [ Math.round(Math.abs(offset / MINUTE)), 'минутын' ];
            } else if (offset < (HOUR * 24)) {
                span = [ Math.round(Math.abs(offset / HOUR)), 'цагийн' ];
            } else if (offset < (DAY * 3.5)) {
                span = [ Math.round(Math.abs(offset / DAY)), 'өдрийн' ];
            } else {
                fulldate = true;
            }

            span = span.join(' ');

            if (raw === true) {
                return span;
            }
            
            if (fulldate === false) {
                return (offset >= MINUTE) ? span + ' өмнө' : '' + span;    
            } else {
                return t;
            }
        }
    })
    .factory('dataService', function($http) {
        return {
            getInit: function() {
                return $http.get(host + "/api/init.php", {timeout:30000});
            },
            getContent: function() {
                return $http.get(host + "/api/content.php", {timeout:30000});
            }
        }
    });