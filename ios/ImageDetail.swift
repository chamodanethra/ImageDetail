//
//  ImageDetail.swift
//  ImageProcessing
//
//  Created by RYDE on 3/18/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import UIKit

class ImagePixelReader {

    enum Pixel:Int {
        case alpha = 3
    }
  
    let image:UIImage

    private var data:CFData
    private let pointer:UnsafePointer<UInt8>
    private let scale:Int

    init?(image:UIImage){
        self.image = image
        guard let cfdata = self.image.cgImage?.dataProvider?.data,
              let pointer = CFDataGetBytePtr(cfdata) else {
            return nil
        }
        self.scale = Int(image.scale)
        self.data = cfdata
        self.pointer = pointer
    }

    func alphaAt(x:Int,y:Int)->UInt8{
      assert(CGFloat(x) < image.size.width)
      assert(CGFloat(y) < image.size.height)
      let pixelPosition = (Int(image.size.width) * y * scale + x) * 4 * scale

      return pointer[pixelPosition + Pixel.alpha.rawValue]
    }
}


@objc(ImageDetail)
class ImageDetail: NSObject {
  
  struct BoundaryCoordinates {
          var startX:Int
          var startY:Int
          var endX:Int
          var endY:Int
  
    init(
      startX:Int,
      startY:Int,
      endX:Int,
      endY:Int
    ) {
        self.startX = startX
        self.startY = startY
        self.endX = endX
        self.endY = endY
    }
  }
  
  @objc
  var boundaryCoordinates:NSDictionary = ["startX": 0, "startY": 0, "endX": 0, "endY": 0]
  
  @objc
  func turnOn(_ url: NSString) {
    
    guard let imageURL = URL(string: url as String) else { return }
    guard let imageData = try? Data(contentsOf: imageURL) else { return }
    guard let imageUI = UIImage(data: imageData) else { return }
    
    //getting all the pixels you need
    if let reader = ImagePixelReader(image: imageUI) {
      var boundaryCoordinates = BoundaryCoordinates(startX: Int(imageUI.size.width),startY: Int(imageUI.size.height), endX: 0, endY: 0)
       //iterate over all pixels
      for x in 0 ..< Int(imageUI.size.width){
        for y in 0 ..< Int(imageUI.size.height){

          let isTransparent = reader.alphaAt(x: x, y: y) == 0
          if !isTransparent {
            if x > boundaryCoordinates.endX {
              boundaryCoordinates.endX = x
            }
            if x < boundaryCoordinates.startX {
              boundaryCoordinates.startX = x
            }
            if y > boundaryCoordinates.endY {
              boundaryCoordinates.endY = y
            }
            if y < boundaryCoordinates.startY {
              boundaryCoordinates.startY = y
            }
          }
        }
        self.boundaryCoordinates = ["startX": boundaryCoordinates.startX, "startY": boundaryCoordinates.startY, "endX": boundaryCoordinates.endX, "endY": boundaryCoordinates.endY]
        }
      print(self.boundaryCoordinates)

    }
  }
  
  @objc
  func getStatus(_ callback: RCTResponseSenderBlock) {
    callback([NSNull(), boundaryCoordinates])
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
