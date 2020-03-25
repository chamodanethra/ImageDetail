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
  
  func alphaAt(x:UInt16,y:UInt16)->UInt8{
    let pixelPosition = (Int(image.size.width) * Int(y) * scale + Int(x)) * 4 * scale
    return pointer[pixelPosition + Pixel.alpha.rawValue]
  }
}

@objc(ImageDetail)
class ImageDetail: NSObject {
  struct ImageAttributes {
    var startX:UInt16
    var startY:UInt16
    var endX:UInt16
    var endY:UInt16
    init(
      startX:UInt16,
      startY:UInt16,
      endX:UInt16,
      endY:UInt16
    ) {
      self.startX = startX
      self.startY = startY
      self.endX = endX
      self.endY = endY
    }
  }
  
  @objc
  var dimensionsArray:NSArray = [[UInt16]]() as NSArray
  
  @objc
  var cornerCoordinatesArray:NSArray = [[UInt16]]() as NSArray
  
  var availableArray:Array = Array(repeating: Array(repeating: true, count: 325), count: 215)
  var imagesSizeArray:Array = [UInt16]()
  var imagesWidthArray:Array = [UInt16]()
  var imagesArray:Array = [[[Bool]]]()
  var imagesCornerCoordinateArray:Array = [[UInt16]]()
  
  @objc
  func setImageURIs(_ url: NSString, withCount: NSNumber) {
//    print(Date())
    var imageDimensionsArray:Array = [[UInt16]]()
    for i in 0 ..< Int(truncating: withCount){
      let fullURL = url as String + String(i+1) + ".png"
      guard let imageURL = URL(string: fullURL) else { return }
      guard let imageData = try? Data(contentsOf: imageURL) else { return }
      guard let imageUI = UIImage(data: imageData) else { return }
      
      //getting all the pixels
      if let reader = ImagePixelReader(image: imageUI) {
        var imageAttributes = ImageAttributes(startX: UInt16(0),startY: UInt16(imageUI.size.height), endX: UInt16(0), endY: UInt16(0))
        //iterate over all pixels
        var isFirstPixelFound = false
        for x in 0 ..< UInt16(imageUI.size.width){
          var isFirstPixelInColumn = false
          for y in 0 ..< UInt16(imageUI.size.height){
            let isPixelTransparent = reader.alphaAt(x: x, y: y) == 0
            if !isPixelTransparent {
              if !isFirstPixelFound {
                imageAttributes.startX = x
                isFirstPixelFound = true
              }
              imageAttributes.endX = x
              if !isFirstPixelInColumn {
                isFirstPixelInColumn = true
                if imageAttributes.startY >= y {
                  imageAttributes.startY = y
                }
              }
              if imageAttributes.endY <= y {
                imageAttributes.endY = y
              }
            }
          }
        }//x loop ends

        let maxWidth = imageAttributes.endX + 1 - imageAttributes.startX
        let maxHeight = imageAttributes.endY + 1 - imageAttributes.startY
        var imageArray = Array(repeating: Array(repeating: false, count: Int(maxHeight)), count: Int(maxWidth))
        for x in imageAttributes.startX ..< imageAttributes.startX + maxWidth {
          for y in imageAttributes.startY ..< imageAttributes.startY + maxHeight {
            let isPixelTransparent = reader.alphaAt(x: x, y: y) == 0
            if !isPixelTransparent {
              let indexX = Int(x - imageAttributes.startX)
              let indexY = Int(y - imageAttributes.startY)
              imageArray[indexX][indexY] = true
            }
          }
        }
        imagesArray.append(imageArray)
        
        imageDimensionsArray.append([imageAttributes.startX, imageAttributes.endX + 1, imageAttributes.startY, imageAttributes.endY+1])
        imagesSizeArray.append(maxWidth * maxHeight)
        imagesWidthArray.append(maxWidth)
      }
    }
    dimensionsArray = imageDimensionsArray as NSArray
    
    generateRandomPosition(0)
    cornerCoordinatesArray = imagesCornerCoordinateArray as NSArray
//    print(Date())
  }
  
  func generateRandomPosition(
    _ depthNumber: Int) {
    if (depthNumber < imagesArray.count) {
      let nextImageWidth = (imagesWidthArray[depthNumber])
      let nextImageHeight = (imagesSizeArray[depthNumber]) / nextImageWidth
      var isIternationCountExceeded = false
      var iterationCount:UInt8 = 0
      L1: while true {
        iterationCount += 1
        let nextRandomNumberX = UInt16.random(in: 0 ..< (215 - nextImageWidth))
        let nextRandomNumberY = UInt16.random(in: 0 ..< (325 - nextImageHeight))
        
        for x in nextRandomNumberX ..< nextRandomNumberX + nextImageWidth{
          let i = Int(x - nextRandomNumberX)
          for y in nextRandomNumberY ..< nextRandomNumberY + nextImageHeight{
            let j = Int(y - nextRandomNumberY)
            if imagesArray[depthNumber][i][j] && !availableArray[Int(x)][Int(y)] {
              if iterationCount <= 50 {
                continue L1
              } else { // bring state of all variables to the point where recursion was called for the first time
                imagesCornerCoordinateArray.removeAll()
                availableArray = Array(repeating: Array(repeating: true, count: 325), count: 215)
                isIternationCountExceeded = true
                break L1
              }
            }
          }
        }
        
        for x in nextRandomNumberX ..< nextRandomNumberX + nextImageWidth{
          let i = Int(x - nextRandomNumberX)
          for y in nextRandomNumberY ..< nextRandomNumberY + nextImageHeight{
            let j = Int(y - nextRandomNumberY)
            if imagesArray[depthNumber][i][j] {
              availableArray[Int(x)][Int(y)] = false
            }
          }
        }
        imagesCornerCoordinateArray.append([nextRandomNumberX, nextRandomNumberY])
        break L1
      }
      if isIternationCountExceeded {
        generateRandomPosition(0)
      } else {
        generateRandomPosition(depthNumber + 1)
      }
    }
  }
  
  @objc
  func getDimensions(_ callback: RCTResponseSenderBlock) {
    callback([NSNull(), dimensionsArray])
  }
  
  @objc
  func getCornerCoordinates(_ callback: RCTResponseSenderBlock) {
    callback([NSNull(), cornerCoordinatesArray])
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
