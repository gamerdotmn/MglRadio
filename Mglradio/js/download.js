var download = {

    fileName: "",
    uriString: "", 
    title: "",
    d_path:"",
    d_img:"",
    downloadFile: function(uriString, targetFile) {

        var complete = function() {
             if(window.localStorage.getItem("d_is")!==null)
             {
                 var d_name=window.localStorage.getItem("d_name");
                 var d_description=window.localStorage.getItem("d_description");
                 var d_typen=window.localStorage.getItem("d_typen");
                 var d_time=window.localStorage.getItem("d_time");
                 
                 window.downloadstatus="";
                 
                 db.transaction(function(tx) {
                      
                      tx.executeSql('INSERT INTO content (name,description,path,img,typen,time) VALUES (?,?,?,?,?,?)', [d_name,d_description,download.d_path,download.d_img,d_typen,d_time], function(tx, res) {
                            
                            window.localStorage.removeItem("d_is");
                            window.localStorage.removeItem("d_name");
                            window.localStorage.removeItem("d_description");
                            window.localStorage.removeItem("d_path");
                            window.localStorage.removeItem("d_img");
                            window.localStorage.removeItem("d_typen");
                            window.localStorage.removeItem("d_time");
                            
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
                                                                                          text: "Амжилттай татагдлаа - "+download.title,
                                                                                          autoClear:  true
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
            download.d_path=targetFile;
            var downloader = new BackgroundTransfer.BackgroundDownloader();
            var _download = downloader.createDownload(uriString, targetFile, download.title);
            download.downloadPromise = _download.startAsync().then(complete, error, progress);
            
        } catch(e) {
            console.log('Error: ' + e);
        }
    },
    
    startDownload: function () {
        
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile(download.fileName, { create: true }, function (newFile) {
                download.downloadFile(download.uriString, newFile);
            });
        });
    },
    
    stopDownload: function () {
        download.downloadPromise && download.downloadPromise.cancel();
    }
};