var download = {

    fileName: "PointerEventsCordovaPlugin.wmv",
    uriString: "http://media.ch9.ms/ch9/8c03/f4fe2512-59e5-4a07-bded-124b06ac8c03/PointerEventsCordovaPlugin.wmv", 
    
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
        };
        
        try {

            var downloader = new BackgroundTransfer.BackgroundDownloader();
            var download = downloader.createDownload(uriString, targetFile);
            app.downloadPromise = download.startAsync().then(complete, error, progress);

        } catch(err) {
            console.log('Error: ' + err);
        }
    },
    
    startDownload: function () {
        
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile(app.fileName, { create: true }, function (newFile) {
                downloadFile(app.uriString, newFile);
            });
        });
    },
    
    stopDownload: function () {
        app.downloadPromise && app.downloadPromise.cancel();
    },
    
    getFileInfo: function () {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            fileSystem.root.getFile(app.fileName, { create: true }, function (fileEntry) {
                fileEntry.file(function (meta) {
                    console.log("Modified: " + meta.lastModifiedDate + "<br/>" + "size: " + meta.size);
                });
            }, function(error) {
                console.log(error);
            });
        });
    }
};