var download = {

    videoName: "",//22cc07b5-b740-4a37-a536-10020272442e
    imgName:"",//c13fd8ee-36c8-4d25-b2d0-ca70a6b5abc5
    d_name: "",//test
    d_path:"",//http://
    d_img:"",//http://
    d_image:"",//file://
    d_video:"",//file://
    d_time:"",//2017-09-29
    downloadFile: function(uriString, targetFile) {
    
        var complete = function() {
             if(window.localStorage.getItem("d_is")!==null)
             {
                 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                    fileSystem.root.getDirectory("mglr",{create:true},function(dir) {
                    fileSystem.root.getFile("mglr/"+download.imgName, { create: true }, function (filePath) {
                        
                        download.d_image=filePath.toURL();
                        
                        fileTransfer.download(
                            download.d_img,
                            download.d_image,
                            function(entry) {
                                
                                 var d_name=window.localStorage.getItem("d_name");
                                 var d_description=window.localStorage.getItem("d_description");
                                 var d_typen=window.localStorage.getItem("d_typen");
                                 var d_time=window.localStorage.getItem("d_time");
                                 var d_id=parseInt(window.localStorage.getItem("d_id"));
                                 
                                 db.transaction(function(tx) {
                      
                                  tx.executeSql('INSERT INTO content (id,name,description,path,img,typen,time) VALUES (?,?,?,?,?,?,?)', [d_id,d_name,d_description,download.d_video,download.d_image,d_typen,d_time], function(tx, res) {
                                        var $body = angular.element(document.body);    
                                        var $rootScope = $body.injector().get('$rootScope');   
                                        $rootScope.$apply(function () {      
                                            
                                            for(var j=0;j<$rootScope.contents.length;j++)
                                            {
                                                if (parseInt($rootScope.contents[j].id)===parseInt(d_id))
                                                {
                                                    $rootScope.contents[j].path=download.d_video;
                                                    $rootScope.contents[j].img=download.d_image;
                                                    $rootScope.contents[j].downloaded=2;
                                                    
                                                }
                                            }
                                        });
                                        window.localStorage.removeItem("d_is");
                                        window.localStorage.removeItem("d_name");
                                        window.localStorage.removeItem("d_description");
                                        window.localStorage.removeItem("d_path");
                                        window.localStorage.removeItem("d_img");
                                        window.localStorage.removeItem("d_typen");
                                        window.localStorage.removeItem("d_time");
                                        window.localStorage.removeItem("d_id");
                                        
                                  }, function(error) {
                                    console.log('query error: ' + error.message);
                                  });
                                  
                                }, function(error) {
                                  console.log('transaction error: ' + error.message);
                                }, function() {
                                  //console.log('query ok');
                                });
                                
                                cordova.plugins.notification.local.schedule({
                                      title: "FM 102.1",
                                      text: "Амжилттай татагдлаа - "+download.d_name,
                                      autoClear:  true
                                });
                                window.downloadstatus="";
                                
                            },
                            function(error) {  
                                console.log(error.message); 
                            }  
                        );
                    });
                  },function(){});
                });
                 
            }
        };
        
        var error = function (err) {
            console.log('Error: ' + err);
        };
        var progress = function(progress) {
           window.downloadstatus=parseInt(100 * progress.bytesReceived / progress.totalBytesToReceive) + '% ТАТСАН';
        };
        try {
            
            var downloader = new BackgroundTransfer.BackgroundDownloader();
            var _download = downloader.createDownload(uriString, targetFile, download.d_name);
            download.downloadPromise = _download.startAsync().then(complete, error, progress);
            
        } catch(e) {
            console.log('Error: ' + e);
        }
    },
    
    startDownload: function () {
        download.videoName=uuidv4();
        download.imgName=uuidv4();
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            
            fileSystem.root.getDirectory("mglr",{create:true},function(dir) {
            
            fileSystem.root.getFile("mglr/"+download.videoName, { create: true }, function (newFile) {
                download.d_video=newFile;
                download.downloadFile(download.d_path, download.d_video);
            });
            
            },function(){});
        });
    },
    
    stopDownload: function () {
        download.downloadPromise && download.downloadPromise.cancel();
    }
};