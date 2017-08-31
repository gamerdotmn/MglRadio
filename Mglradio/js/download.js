var download = {

    fileName: "",
    uriString: "", 
    title: "",
    
    downloadFile: function(uriString, targetFile) {

        var complete = function() {
             window.downloadstatus="";
             cordova.plugins.notification.local.schedule({
                                                                                          title: "FM 102.1",
                                                                                          text: "Амжилттай татагдлаа - "+download.title,
                                                                                          autoClear:  true
                                                                                      });
        };
        var error = function (err) {
            console.log('Error: ' + err);
        };
        var progress = function(progress) {
           window.downloadstatus=parseInt(100 * progress.bytesReceived / progress.totalBytesToReceive) + ' %';
        };
        try {

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