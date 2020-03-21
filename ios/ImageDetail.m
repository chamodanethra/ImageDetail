//
//  ImageDetail.m
//  ImageProcessing
//
//  Created by RYDE on 3/18/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(ImageDetail, NSObject)
RCT_EXTERN_METHOD(setImageURIs: (NSString* __nonnull)url)
RCT_EXTERN_METHOD(getSortedDimensions: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(getSortedCornerCoordinates: (RCTResponseSenderBlock)callback)
@end
