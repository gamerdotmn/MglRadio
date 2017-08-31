var download = {

    videoName: "",
    imgName:"",
    d_name: "",
    d_path:"",
    d_img:"",
    d_image:"",
    d_video:"",
    downloadFile: function(uriString, targetFile) {
    
        var complete = function() {
             if(window.localStorage.getItem("d_is")!==null)
             {
                 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                    fileSystem.root.getFile(download.imgName, { create: true }, function (filePath) {
                        
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
                });
                 
            }
        };
        var error = function (err) {
            console.log('Error: ' + err);
        };
        var progress = function(progress) {
           window.downloadstatus=parseInt(100 * progress.bytesReceived / progress.totalBytesToReceive) + ' %';
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
        download.videoName=download.d_path.substring(download.d_path.lastIndexOf('/') + 1);
        download.imgName=download.d_img.substring(download.d_img.lastIndexOf('/') + 1);
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile(download.videoName, { create: true }, function (newFile) {
                download.d_video=newFile.toURL()+"/"+download.videoName;
                download.downloadFile(download.d_path, newFile);
            });
        });
    },
    
    stopDownload: function () {
        download.downloadPromise && download.downloadPromise.cancel();
    }
};