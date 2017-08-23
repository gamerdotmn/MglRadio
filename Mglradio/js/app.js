var host = "http://app.mglradio.com";
var height = 0;
var storage = window.localStorage;

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
            .state('app.detail', {
                       url: "/detail/:id",
                       views: {
                    'newsContent' :{
                                   templateUrl: "templates/detail.html",
                                   controller: "DetailCtrl"
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
            .state('app.logout', {
                       url: "/logout",
                       views: {
                    'contentContent' :{
                                   templateUrl: "templates/logout.html",
                                   controller: "LogoutCtrl"
                               }
                }
                   })
            .state('app.search', {
                       url: "/search",
                       views: {
                    'contentContent' :{
                                   templateUrl: "templates/search.html",
                                   controller: "SearchCtrl"
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
        $urlRouterProvider.otherwise("/app/news");
        $ionicConfigProvider.views.transition('ios');
        $ionicConfigProvider.scrolling.jsScrolling(true);
    })
    .directive('imageonload', function() {
        return {
            link: function(scope, element, attrs) {
                element.on('load', function() {
                    element.parent().find('center').remove();
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
    .controller('IndexCtrl', function($scope, $state, $rootScope, $ionicModal, $ionicHistory, $ionicLoading, dataService, $http, $interval, $timeout, $window) {
        $scope.status = 0;
        
        $scope.rs = 1;
        $scope.logo = "<img src='img/logo.png' style='height: 100%;'>";
        $scope.rtitle = 'MGL RADIO';
        $scope.page=0;
        $scope.goBack = function() {
            $ionicHistory.goBack();
        }
        
        $scope.loadmore=function(){
             if($scope.page>0)
             {
             console.log('more');
             $http.get("http://app.mglradio.com/api/news.php?p="+$scope.page)
            .then(function(response) {
                
                for(var i=0;i<response.data.news.length;i++)
                {
                    $scope.news.push(response.data.news[i]);
                }
                $scope.page=$scope.page+1;
             });
             $scope.$broadcast('scroll.infiniteScrollComplete');
             }
             
        };
        
        $scope.load = function() {
            $ionicLoading.show({template:'<ion-spinner icon="ripple"></ion-spinner>'});
            dataService.getInit().success(function(data) {
                console.log(data);
                $scope.categories = data.categories;
                $scope.news = data.news;
                $scope.timetables = data.timetables;
                if ($scope.timetables.length > 0) {
                    $scope.rs = 2;
                }
                $scope.today = data.today;
                $scope.page=1;
                $timeout(function () {
                $ionicLoading.hide();
                },2000);
            }).error(function() {
                $ionicLoading.hide();
            });
            
            dataService.getContent().success(function(data) {
                $scope.types = data.types;
                $timeout(function () {
                $ionicLoading.hide();
                },2000);
            }).error(function() {
                $ionicLoading.hide();
            });
        };
        $rootScope.contents = [];
        
        $scope.load();
        $scope.doRefresh = function() {
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
        }, 2500);
        // content hesgiin code
        $ionicModal.fromTemplateUrl('templates/payment.html', {
                                        scope: $scope
                                    }).then(function(modal) {
                                        $scope.paymentmodal = modal;
                                    });
            
        $ionicModal.fromTemplateUrl('templates/contentdetail.html', {
                                        scope: $scope,
                                        animation: 'animated slideInRight'
                                    }).then(function(modal) {
                                        $scope.modal = modal;
                                    });
        $rootScope.$on("CallDetail", function(event, data) {
            var id = data.data;
            $scope.detail(id);
        });
        
        $scope.detail = function(id) {
            angular.forEach($rootScope.contents, function(value, key) {
                if (value.id===id) {
                    $rootScope.contentdetail = value;
                }
            });
            $scope.modal.show();
        }
        $rootScope.paymentstatus = true;
        
        $scope.checklogin = function() {
            if ($rootScope.loginstatus) {
                if ($rootScope.paymentstatus) {
                    $scope.modal.hide();
                    $timeout(function () {
                        $rootScope.$emit("CallDownload", {});
                    }, 500);
                } else {
                    $scope.paymentmodal.show();     
                }
            } else {
                $scope.modal.hide();
                $window.location.href = '#/app/login';
            }
        }
        
        if (!storage.getItem("username")) {
            $rootScope.loginstatus = false;
        } else {
            $rootScope.loginstatus = true;
            $rootScope.username = storage.getItem("username");
        }
        
        $scope.changepage = function(name) {
            $window.location.href = '#/app/' + name;
        }
        
        $scope.leftside = false;
        
        $rootScope.$on('$stateChangeSuccess', 
                       function(event, toState, toParams, fromState, fromParams) { 
                           if ($state.current.name === "app.news") {
                               $scope.leftside = true;
                           }
                           if ($state.current.name === "app.content") {
                               $scope.leftside = false;
                           }
                       });
        
        $scope.downloadstatus = "";
        $scope.downloadanimate = "slideInUp";
    })
    .controller('NewsCtrl', function($rootScope, $scope, $ionicLoading) {
        $scope.net = navigator.onLine;
    })
    .controller('CategoryCtrl', function($scope, $ionicLoading, $timeout, $stateParams) {
        $ionicLoading.show({template: '<ion-spinner icon="ripple"></ion-spinner>'});
        if ($stateParams !== 'undefined') {
            $scope.category_news = [];
            $scope.count = 0;
            angular.forEach($scope.news, function(value, key) {
                if (value.category_id===$stateParams.id) {
                    $scope.category_news.push(value);
                    $scope.count++;
                }
            });
            $scope.category_id = $stateParams.id;
            
            angular.forEach($scope.categories, function(value, key) {
                if (value.id === $stateParams.id) {
                    $scope.logo = "<p>" + value.name + "</p>";
                }
            });
        }
        $timeout(function () {
            $ionicLoading.hide();
        }, 1000); 
    })
    .controller('DetailCtrl', function($rootScope, $scope, $ionicLoading, $stateParams) {
        $scope.categoryid = 0;
        angular.forEach($scope.news, function(value, key) {
            if (value.id===$stateParams.id) {
                $scope.newsdetail = value;
                $scope.categoryid = value.category_id;
            }
        });
        
        $scope.relnews = [];
        var count = 0;
        angular.forEach($scope.news, function(value, key) {
            if (count < 3) {
                if (value.category_id === $scope.categoryid && value.id !== $stateParams.id) {
                    $scope.relnews.push(value);
                    count++;
                }
            }
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
    .controller('RadioCtrl', function($rootScope, $scope, $ionicLoading, $window, $timeout, $ionicScrollDelegate) {
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
        
        $scope.active = function() {
            var now = moment();
            var d = false;
            
            if (typeof($scope.timetables)!=="undefined") {
                for (var i = $scope.timetables.length - 1;i >= 0;i--) {
                    $scope.timetables[i].isactive = false;
                    $scope.timetables[i].isnotif = false;
                    if (window.localStorage.getItem($scope.timetables[i].id)!==null) {
                        $scope.timetables[i].isnotif = true;
                    }
                    var t = moment($scope.timetables[i].date + "T" + $scope.timetables[i].time + $scope.today[0].tz);
                    $scope.timetables[i].ttime = t.local().format('HH:mm');
                
                    if (now.isAfter(t)) {
                        if (d===false) {
                            $scope.timetables[i].isactive = true;
                            d = true;
                            $timeout(function () {
                                var h = document.querySelector('.hutulburdiv .list .item').offsetHeight;
                                console.log(h);
                                $ionicScrollDelegate.scrollTo(0, i * h, true);
                            }, 1000);
                        }
                    }
                }
            }
        }
        
        $scope.playstatus = false;
        $scope.active();
        
        setInterval(function() { 
            $scope.active();
        }, 30000);
        
        setInterval(function() { 
            $scope.$apply(function () {
                $scope.playstatus = isplaying;
            });
        }, 100);
        
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
        }
        
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
                            var t = moment(c.date + "T" + c.time + $scope.today[0].tz);
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
        //$scope.scroll = function() {
        //    var now = moment();
        //    var d = false;
        //    if (typeof($scope.timetables)!=="undefined") {
        //        alert();
        //        for (var i = $scope.timetables.length - 1;i >= 0;i--) {
        //            var t = moment($scope.timetables[i].date + "T" + $scope.timetables[i].time + $scope.today[0].tz);
        //            if (now.isAfter(t)) {
        //                if (d===false) {
        //                    d = true;
        //                    //var h = angular.element(document.querySelector('.list'))[0].offsetHeight;
        //                    //$ionicScrollDelegate.scrollTo(0, i * h, true);
        //                    $timeout(function () {
        //                        var h = document.querySelector('.hutulburdiv .list .item').offsetHeight;
        //                        console.log(h);
        //                        $ionicScrollDelegate.scrollTo(0, i * h, true);
        //                    }, 5000);
        //                }
        //            }
        //        }
        //    }
        //}
        //$scope.scroll();
    })
    .controller('TvCtrl', function($rootScope, $scope, $ionicLoading, $http, $timeout) {
        $scope.playVideo = function() {
            if ($scope.app==="youtube") {
                window.open('https://www.youtube.com/watch?v=' + $scope.vid, '_system');
            } else {
                window.open('https://www.facebook.com/' + $scope.id + '/videos/' + $scope.vid, '_system');
            }
        };
    })
    .controller('ContentCtrl', function($rootScope, $scope, $ionicLoading, $ionicModal, $window, dataService, $timeout) {
        $ionicLoading.show({template:'<ion-spinner icon="ripple"></ion-spinner>'});
        dataService.getContent().success(function(data) {
            $rootScope.contents = data.contents;
            $ionicLoading.hide();
        }).error(function() {
            $ionicLoading.hide();
        });
        
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            var fileTransfer = new FileTransfer();
            var db = window.sqlitePlugin.openDatabase({name: "my.db"});
            
            $rootScope.$on("CallDownload", function() {
                $scope.download();
            });
            
            $scope.download = function() {
                //alert("download" + $rootScope.contentdetail.id);
                if (ionic.Platform.isAndroid()) {
                    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, onFileSystemSuccess, onError);
                } else {
                    // for iOS
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onError);
                }
            }
            
            /*db.transaction(function(tx) {
            //tx.executeSql('DROP TABLE IF EXISTS content');
            tx.executeSql('CREATE TABLE IF NOT EXISTS content (id integer primary key, name text, description text, path text, img text, type_id integer, time text, year integer)');
                
            tx.executeSql('DELETE * FROM content');
            db.transaction(function(tx) {
            tx.executeSql("select * from content;", [], function(tx, res) {
            console.log("res.rows.length: " + res.rows.length);
            console.log("res.rows.item(0): " + res.rows.item(0).path);
            });
            });
            db.executeSql("pragma table_info (content);", [], function(res) {
            console.log("PRAGMA res: " + JSON.stringify(res));
            });
            tx.executeSql("INSERT INTO content (name, description, path, price, img) VALUES (?,?,?,?,?)", ["test", "test","/local/Mglradio",100,"/mglradio/img"], function(tx, res) {
            console.log("insertId: " + res.insertId + " -- probably 1"); 
            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
            db.transaction(function(tx) {
            tx.executeSql("select * from content;", [], function(tx, res) {
            console.log("res.rows.length: " + res.rows.length + " -- should be 1");
            console.log("res.rows.item(0): " + res.rows.item(0).path);
            });
            });
            }, function(e) {
            console.log("ERROR: " + e.message);
            });
            });*/
            
            function onError() {
                navigator.notification.alert("Татахад алдаа гарлаа дахин оролдоно уу!", alertCallback, "Алдаа", "Хаах");
            };
            function alertCallback() {
            }
            function onFileSystemSuccess(fileSystem) {
                var entry = "";
                if (ionic.Platform.isAndroid()) {
                    entry = fileSystem;
                } else {
                    entry = fileSystem.root;
                }
                entry.getDirectory("MglRadio", {
                                       create: true,
                                       exclusive: false
                                   }, onGetDirectorySuccess, onGetDirectoryFail);
            };
            function onGetDirectorySuccess(dir) {
                cdr = dir;
                var filename = $rootScope.contentdetail.path.substring($rootScope.contentdetail.path.lastIndexOf('/') + 1);
                dir.getFile(filename, {
                                create: true,
                                exclusive: false
                            }, gotFileEntry, errorHandler);
            };
            function onGetDirectoryFail(err) {
                console.log(err);
            };
            function errorHandler(err) {
                console.log(err);
            };
            function gotFileEntry() {
                var filename = $rootScope.contentdetail.path.substring($rootScope.contentdetail.path.lastIndexOf('/') + 1);
                var documentUrl = $rootScope.contentdetail.path;
                var uri = encodeURI(documentUrl);
                
                fileTransfer.onprogress = function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                        $scope.downloadstatus = perc + "% татсан";
                    }
                };
                
                fileTransfer.download(uri, cdr.nativeURL + filename,
                                      function(entry) {
                                          $scope.downloadanimate = "slideOutDown";
                                          $timeout(function () {
                                              $scope.downloadstatus = "";
                                          }, 1000);
                                          var t = moment();
                                          var now = t.local().toDate();
                                          var date = new Date();
                                          cordova.plugins.notification.local.schedule({
                                                                                          id: parseInt($rootScope.contentdetail.id),
                                                                                          title: "FM 102.1",
                                                                                          text: "Контент амжилттай татагдлаа.",
                                                                                          at: date, 
                                                                                          autoClear:  true, 
                                                                                          data: { contentid : $rootScope.contentdetail.id }
                                                                                      });
                                          cordova.plugins.notification.local.on("click", function (notification) {
                                              //joinMeeting(notification.data.meetingId);
                                              //alert(notification.data.id);
                                              $rootScope.$emit("CallDetail", {data: notification.id});
                                          });
                                          //console.log("download complete: " + entry.toURL());
                                          //statusDom.innerHTML = "<video height='240' controls><source src='" + entry.toURL() + "' type='video/mp4'>";
                                      },
                                      function(error) {
                                          navigator.notification.alert("Контент татахад алдаа гарлаа. Интернет холболтоо шалган дахин оролдоно уу!", alertCallback, "Алдаа", "Хаах");
                                      },
                                      false
                    );
            };
        }
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
            
            angular.forEach($scope.types, function(value, key) {
                if (value.id === $stateParams.id) {
                    $scope.logo = value.name;
                }
            });
        }
        $timeout(function () {
            $ionicLoading.hide();
        }, 1000); 
    })
    .controller('SearchCtrl', function($scope) {
        $scope.input = "<input type='text' id='searchinput' ng-model='searchvalue' onkeyup='searchval(this.value)' placeholder='Хайлт' class='searchinput' >";
        
        var h = window.innerHeight;
        var sh = (h * 30) / 100;
        $scope.height = sh;
    })
    .controller('DownloadCtrl', function($scope, $window) {
        $scope.watch = function(id) {
            alert(id);
        }
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
                                storage.setItem("username", user.name);
                                storage.setItem("password", user.pwd);
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
                                            console.log(data);
                                            if (data === "2") {
                                                storage.setItem("username", user.user_id);
                                                storage.setItem("password", user.pwd);
                                                $rootScope.loginstatus = true; 
                                                $rootScope.username = user.user_id;
                                                $window.location.href = '#/app/content';
                                            } else if (data === "0") {
                                                navigator.notification.alert("Нэвтрэх нэр давхардаж байна!", alertCallback, "Алдаа", "Хаах");
                                            } else if (data === "1") {
                                                navigator.notification.alert("И-мейл хаяг давхардаж байна!", alertCallback, "Алдаа", "Хаах");
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
                            storage.setItem("username", res[0]);
                            storage.setItem("password", res[1]);
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
    .controller('LogoutCtrl', function($scope, $window, $rootScope) {
        $rootScope.loginstatus = false; 
        $rootScope.username = "";
        storage.removeItem("username");
        storage.removeItem("password"); 
        $window.location.href = '#/app/content';
    })
    .filter('trustAsHtml', function($sce) {
        return $sce.trustAsHtml;
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