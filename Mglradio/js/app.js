var host = "http://app.mglradio.com";
var height = 0;
var storage = window.localStorage;

angular.module('mglradioapp', ['ionic','ngAnimate','ngSanitize'])
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
            .state('app.login', {
                       url: "/login",
                       views: {
                    'contentContent' :{
                                   templateUrl: "templates/login.html",
                                   controller: "LoginCtrl"
                               }
                }
                   })
            .state('app.signup', {
                       url: "/signup",
                       views: {
                    'contentContent' :{
                                   templateUrl: "templates/signup.html",
                                   controller: "SignupCtrl"
                               }
                }
                   })
            .state('app.forget', {
                       url: "/forget",
                       views: {
                    'contentContent' :{
                                   templateUrl: "templates/forget.html",
                                   controller: "ForgetCtrl"
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
                   });
        $urlRouterProvider.otherwise("/app/content");
        $ionicConfigProvider.views.transition('ios');
        $ionicConfigProvider.scrolling.jsScrolling(true);
    })
    .config(function($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
    })
    .run(function($rootScope, $ionicPlatform) {
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    })
    .controller('IndexCtrl', function($scope, $rootScope, $ionicHistory, $ionicLoading, dataService, $http, $interval, $timeout) {
        $scope.status = 0;
        $scope.rs = 1;
        $scope.logo = "<img src='img/logo.png' style='height: 100%;'>";
        $scope.rtitle = 'MGL RADIO';
        $scope.goBack = function() {
            $ionicHistory.goBack();
        }
        
        $scope.load = function() {
            $ionicLoading.show({template:'<ion-spinner icon="ripple"></ion-spinner>'});
            dataService.getInit().success(function(data) {
                $scope.categories = data.categories;
                $scope.news = data.news;
                $scope.timetables = data.timetables;
                if ($scope.timetables.length > 0) {
                    $scope.rs = 2;
                }
                $scope.today = data.today;
                $ionicLoading.hide();
            }).error(function() {
                $ionicLoading.hide();
            });
        };
        
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
                                  if (divs[i].innerHTML != "LIVE") {
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
        
        if (!storage.getItem("username")) {
            $scope.loginstatus = false;
        } else {
            $scope.loginstatus = true;
        }
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
                    'Та интернет холболтоо шалгаад дахин үзээрэй.',
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
                        if (b == 1) {
                            var t = moment(c.date + "T" + c.time + $scope.today[0].tz);
                            var now = t.local().toDate();
                            cordova.plugins.notification.local.schedule({
                                                                            id: parseInt(c.id),
                                                                            title: "FM 102.1",
                                                                            message: c.time + ' ' + c.title + " хөтөлбөр эхэллээ.",
                                                                            firstAt: now, // firstAt and at properties must be an IETF-compliant RFC 2822 timestamp
                                                                            //every: "week", // this also could be minutes i.e. 25 (int)
                                                                            //sound: "file://sounds/reminder.mp3",
                                                                            //icon: "http://icons.com/?cal_id=1",
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
                        if (b == 1) {
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
    .controller('ContentCtrl', function($rootScope, $scope, $ionicLoading, $ionicModal, $window, dataService) {
        $scope.toggleGroup = function(group) {
            group.show = !group.show;
        };
        $scope.isGroupShown = function(group) {
            return group.show;
        };
        
        $scope.search = function() {
            var search = document.getElementById("searchinput").value;
            alert(search);
        }
        $ionicModal.fromTemplateUrl('templates/contentdetail.html', {
                                        scope: $scope
                                    }).then(function(modal) {
                                        $scope.modal = modal;
                                    });
        $scope.detail = function(id) {
            angular.forEach($scope.contents, function(value, key) {
                if (value.id===id) {
                    $scope.contentdetail = value;
                }
            });
            $scope.modal.show();
        }
        
        $scope.checklogin = function() {
            $scope.modal.hide();
            $window.location.href = '#/app/login';
        }
        
        $scope.loadcontent = function() {
            $ionicLoading.show({template:'<ion-spinner icon="ripple"></ion-spinner>'});
            dataService.getContent().success(function(data) {
                $scope.contents = data.contents;
                $scope.types = data.types;
                $scope.top = data.top;
                $ionicLoading.hide();
            }).error(function() {
                $ionicLoading.hide();
            });
        };
        
        $scope.loadcontent();
        
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            var fileTransfer = new FileTransfer();
            var db = window.sqlitePlugin.openDatabase({name: "my.db"});
            db.transaction(function(tx) {
                //tx.executeSql('DROP TABLE IF EXISTS test_table');
                tx.executeSql('CREATE TABLE IF NOT EXISTS content (id integer primary key, name text, description text, path text, price integer, img text)');

                // demonstrate PRAGMA:
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
            });
            
            $scope.download = function() {
                alert("download");
                if (ionic.Platform.isAndroid()) {
                    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, onFileSystemSuccess, onError);
                } else {
                    // for iOS
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onError);
                }
            }
            function onError(e) {
                navigator.notification.alert("Error : Downloading Failed");
            };
            function onFileSystemSuccess(fileSystem) {
                var entry = "";
                if (ionic.Platform.isAndroid()) {
                    entry = fileSystem;
                } else {
                    entry = fileSystem.root;
                }
                entry.getDirectory("Mglradio", {
                                       create: true,
                                       exclusive: false
                                   }, onGetDirectorySuccess, onGetDirectoryFail);
            };
            function onGetDirectorySuccess(dir) {
                cdr = dir;
                dir.getFile("big_buck_bunny_480p_20mb.mp4", {
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
            function gotFileEntry(fileEntry) {
                var documentUrl = "http://www.sample-videos.com/video/mp4/480/big_buck_bunny_480p_20mb.mp4";
                var uri = encodeURI(documentUrl);
                
                fileTransfer.onprogress = function(progressEvent) {
                    statusDom = document.querySelector('#status');
                    if (progressEvent.lengthComputable) {
                        var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                        statusDom.innerHTML = perc + "% loaded...";
                    } else {
                        if (statusDom.innerHTML == "") {
                            statusDom.innerHTML = "Loading";
                        } else {
                            statusDom.innerHTML += ".";
                        }
                    }
                };
                
                fileTransfer.download(uri, cdr.nativeURL + "big_buck_bunny_480p_20mb.mp4",
                                      function(entry) {
                                          console.log("download complete: " + entry.toURL());
                                          statusDom.innerHTML = "<video height='240' controls><source src='" + entry.toURL() + "' type='video/mp4'>";
                                      },
                                      function(error) {
                                          console.log("download error source " + error.source);
                                          console.log("download error target " + error.target); 
                                          console.log("download error code" + error.code);
                                      },
                                      false
                    );
            };
        }
    })
    .controller('LoginCtrl', function($scope, $window, $http) {
        function alertCallback() {
        }
        $scope.signup = function() {
            $window.location.href = '#/app/signup';
        }
        $scope.forget = function() {
            $window.location.href = '#/app/forget';
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
                                $scope.loginstatus = true;
                                $window.location.href = '#/app/content';
                            } else {
                                navigator.notification.alert("Нэвтрэхэд алдаа гарлаа дахин оролдоно уу!", alertCallback, "Алдаа", "Хаах");
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
        $scope.facebooklogin = function() {
            alert("fb");
            //$window.location.href = '#/app/signup';
        }
    })
    .controller('LogoutCtrl', function($scope, $window) {
        $scope.loginstatus = false; 
        storage.removeItem("username");
        storage.removeItem("password"); 
        $window.location.href = '#/app/login';
    })
    .controller('SignupCtrl', function($scope, $window, $http) {
        $scope.submit = function(user) {
            if (user) {
                if (typeof user.name !== "undefined" && user.name !== "") {
                    if (typeof user.email !== "undefined" && user.email !== "") {
                        if (typeof user.pwd !== "undefined" && user.pwd !== "") {
                            if (typeof user.confirm !== "undefined" && user.confirm !== "") {
                                if (user.pwd === user.confirm) {
                                    var data = {
                                        name:user.name,
                                        email:user.email,
                                        pwd:user.pwd
                                    };
                                    var signupresponse = $http.post(host + "/api/signup.php", data, {});

                                    signupresponse.success(function(data, status, headers, config) {
                                        if (data === "1") {
                                            storage.setItem("username", user.name);
                                            storage.setItem("password", user.pwd);
                                            $scope.loginstatus = true; 
                                            $window.location.href = '#/app/content';
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
        function alertCallback() {
        }
    })
    .controller('ForgetCtrl', function($scope, $window) {
        $scope.submit = function(user) {
            if (user) {
                if (typeof user.email !== "undefined" && user.email !== "") {
                    
                } else {
                    navigator.notification.alert("Цахим хаягаа оруулна уу!", alertCallback, "Алдаа", "Хаах");
                }
            } else {
                navigator.notification.alert("Талбарыг бөглөнө үү!", alertCallback, "Алдаа", "Хаах");
            }
            //$window.location.href = '#/app/content';
        }
        function alertCallback() {
        }
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
    .directive('tabsSwipable', [
                   '$ionicGesture', function($ionicGesture) {
                       //
                       // make ionTabs swipable. leftswipe -> nextTab, rightswipe -> prevTab
                       // Usage: just add this as an attribute in the ionTabs tag
                       // <ion-tabs tabs-swipable> ... </ion-tabs>
                       //
                       return {
                           restrict: 'A',
                           require: 'ionTabs',
                           link: function(scope, elm, attrs, tabsCtrl) {
                               var onSwipeLeft = function() {
                                   var target = tabsCtrl.selectedIndex() + 1;
                                   if (target < tabsCtrl.tabs.length) {
                                       scope.$apply(tabsCtrl.select(target));
                                   }
                               };
                               var onSwipeRight = function() {
                                   var target = tabsCtrl.selectedIndex() - 1;
                                   if (target >= 0) {
                                       scope.$apply(tabsCtrl.select(target));
                                   }
                               };
		    
                               var swipeGesture = $ionicGesture.on('swipeleft', onSwipeLeft, elm).on('swiperight', onSwipeRight);
                               scope.$on('$destroy', function() {
                                   $ionicGesture.off(swipeGesture, 'swipeleft', onSwipeLeft);
                                   $ionicGesture.off(swipeGesture, 'swiperight', onSwipeRight);
                               });
                           }
                       };
                   }
               ])
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