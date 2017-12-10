#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

// TODO This means that you can start a download of a large image or file, close the app and
// the download wilcontinue until it completes.
@interface BackgroundDownload : CDVPlugin <NSURLSessionDownloadDelegate>

@property NSString *targetFile;
@property NSString *downloadUri;
@property NSString *callbackId;

@property (nonatomic) NSURLSession *session;
@property (nonatomic) NSURLSessionDownloadTask *downloadTask;

- (void)startAsync:(CDVInvokedUrlCommand*)command;
- (void)stop:(CDVInvokedUrlCommand*)command;

@end