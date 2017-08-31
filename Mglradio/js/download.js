var download = {

    fileName: "PointerEventsCordovaPlugin.wmv",
    uriString: "http://media.ch9.ms/ch9/8c03/f4fe2512-59e5-4a07-bded-124b06ac8c03/PointerEventsCordovaPlugin.wmv", 
    title: "PointerEventsCordovaPlugin",
    
    downloadFile: function(uriString, targetFile) {

        var complete = function() {
            console.log('Done');
        };
        var error = function (err) {
            console.log('Error: ' + err);
        };
        var progress = function(progress) {
           var p=100 * progress.bytesReceived / progress.totalBytesToReceive + '%';
           console.log(p);
           return p;
        };
        try {

            var downloader = new BackgroundTransfer.BackgroundDownloader();
            var _download = downloader.createDownload(uriString, targetFile, download.title);
            download.downloadPromise = _download.startAsync().then(complete, error, progress);
            
        } catch(err) {
            console.log('Error: ' + err);
        }
    },
    
    startDownload: function () {
        
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            console.log(download.fileName);
            fileSystem.root.getFile(download.fileName, { create: true }, function (newFile) {
                console.log(JSON.stringify(newFile));
                console.log(download.uriString);
                download.downloadFile(download.uriString, newFile);
            });
        });
    },
    
    stopDownload: function () {
        download.downloadPromise && download.downloadPromise.cancel();
    }
};