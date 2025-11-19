#import "Klipy.h"
#import <React/RCTUtils.h>
#import <AVKit/AVKit.h>
#import <WebKit/WebKit.h>

// Access Swift types (KlipyMediaPickerHost) exposed from the RNKlipy module.
#if __has_include(<RNKlipy/RNKlipy-Swift.h>)
#import <RNKlipy/RNKlipy-Swift.h>
#elif __has_include("RNKlipy-Swift.h")
#import "RNKlipy-Swift.h"
#endif

@class KlipyMediaPickerHost;

static NSString *klipyApiKey = nil;

@implementation Klipy

- (NSArray<NSString *> *)supportedEvents
{
  return @[ @"onReactionSelected" ];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeKlipySpecJSI>(params);
}

// TurboModule registration: the name must match the JS spec / TurboModuleRegistry key.
+ (NSString *)moduleName
{
  return @"NativeKlipy";
}

// Required by the Spec / NativeEventEmitter. These are kept as no-op
// methods because event subscription is handled on the JS side and
// events are emitted from native using the separate KlipyEvents emitter.
- (void)addListener:(NSString *)eventName
{
  // No-op
}

- (void)removeListeners:(double)count
{
  // No-op
}

// Synchronous initialize method as declared in NativeKlipySpec (no Promise blocks).
- (void)initialize:(NSString *)apiKey options:(NSDictionary *)options
{
  klipyApiKey = apiKey;
  // TODO: Use apiKey to configure your Klipy networking base URL similar to the demo app.
}

// Synchronous open method as declared in NativeKlipySpec (no Promise blocks).
- (void)open
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *rootViewController = RCTPresentedViewController();
    if (rootViewController != nil) {
      [KlipyMediaPickerHost.shared open:rootViewController];
      [self setMediaPickerVisible:YES];
    }
  });
}

- (void)setMediaPickerVisible:(BOOL)visible
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[NSNotificationCenter defaultCenter] postNotificationName:@"KlipyMediaPickerVisibilityChanged"
                                                        object:nil
                                                      userInfo:@{ @"visible": @(visible) }];
  });
}

@end
