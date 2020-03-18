//
//  ImageDetail.m
//  ImageProcessing
//
//  Created by RYDE on 3/18/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(ImageDetail, NSObject)
RCT_EXTERN_METHOD(turnOn: (NSString* __nonnull)url)
RCT_EXTERN_METHOD(getStatus: (RCTResponseSenderBlock)callback)
@end
