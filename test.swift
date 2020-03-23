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
    let pixelPosition = (Int(image.size.width) * y * scale + x) * 4 * scale
    return pointer[pixelPosition + Pixel.alpha.rawValue]
  }
}

@objc(ImageDetail)
class ImageDetail: NSObject {
  struct ImageAttributes {
    var startX:Int
    var startY:Int
    var endX:Int
    var endY:Int
    var startYArray: [Int]
    
    init(
      startX:Int,
      startY:Int,
      endX:Int,
      endY:Int,
      startYArray:[Int]
    ) {
      self.startX = startX
      self.startY = startY
      self.endX = endX
      self.endY = endY
      self.startYArray = startYArray
    }
  }
  
  @objc
  var dimensionsArray:NSArray = [[Int]]() as NSArray
  
  @objc
  var cornerCoordinatesArray:NSArray = [[Int]]() as NSArray
  
  var availableArray:Array = Array(repeating: Array(repeating: true, count: 325), count: 215)
  var availableArrayFirstIteration:Array = Array(repeating: Array(repeating: true, count: 325), count: 215)
  var imagesSizeArray:Array = [Int]()
  var sortedImagesSizeArray:Array = [Int]()
  var imagesWidthArray:Array = [Int]()
  var imagesArray:Array = [[[Bool]]]()
  var imagesCornerCoordinateArray:Array = [[Int]]()
  
  @objc
  func setImageURIs(_ url: NSString) {
    //print(Date())
    var imageDimensionsArray:Array = [[Int]]()
    for i in 0 ..< 5{
      let fullURL = url as String + String(i+1) + ".png"
      guard let imageURL = URL(string: fullURL) else { return }
      guard let imageData = try? Data(contentsOf: imageURL) else { return }
      guard let imageUI = UIImage(data: imageData) else { return }
      
      //getting all the pixels
      if let reader = ImagePixelReader(image: imageUI) {
        var imageAttributes = ImageAttributes(startX: -1,startY: Int(imageUI.size.height), endX: -1, endY: -1, startYArray: [])
        //iterate over all pixels
        for x in 0 ..< Int(imageUI.size.width){
          var firstPixelInColumn = false
          for y in 0 ..< Int(imageUI.size.height){
            let isPixelTransparent = reader.alphaAt(x: x, y: y) == 0
            if !isPixelTransparent {
              if imageAttributes.startX == -1 {
                imageAttributes.startX = x
              }
              imageAttributes.endX = x
              if !firstPixelInColumn {
                firstPixelInColumn = true
                imageAttributes.startYArray.append(y)
              }
              if imageAttributes.endY <= y {
                imageAttributes.endY = y
              }
            }
          }
        }//x loop ends
        imageAttributes.startY = imageAttributes.startYArray.min()!
        
        let maxWidth = imageAttributes.endX + 1 - imageAttributes.startX
        let maxHeight = imageAttributes.endY + 1 - imageAttributes.startY
        var imageArray = Array(repeating: Array(repeating: false, count: maxHeight), count: maxWidth)
        for x in 0 ..< imageAttributes.endX {
          for y in 0 ..< imageAttributes.endY {
            let isPixelTransparent = reader.alphaAt(x: x, y: y) == 0
            if !isPixelTransparent {
              let indexX = x - imageAttributes.startX
              let indexY = y - imageAttributes.startY
              imageArray[indexX][indexY] = true
            }
          }
        }
        imagesArray.append(imageArray)
        
        imageDimensionsArray.append([Int(imageAttributes.startX), Int(imageAttributes.endX + 1), Int(imageAttributes.startY), Int(imageAttributes.endY+1)])
        imagesSizeArray.append((imageAttributes.endX + 1 - imageAttributes.startX) * (imageAttributes.endY + 1 - imageAttributes.startY))
        
        imagesWidthArray.append(imageAttributes.endX + 1 - imageAttributes.startX)
      }
    }
    
    sortedImagesSizeArray = imagesSizeArray.map { $0 }
    //sortedImagesSizeArray = imagesSizeArray.map { $0 }.sorted { $0 > $1 }
    dimensionsArray = imageDimensionsArray as NSArray
    
    //select a corner randomly for positioning the largest image
    let startRandomCorner = Int.random(in: 0 ..< 3) //includes 3
    var startX = 0
    var startY = 0
    var indices = [0,0,0,0,0]
    for i in 0..<5  {
      indices[i] = imagesSizeArray.firstIndex(of: sortedImagesSizeArray[i])!
    }
    let imageWidth = imagesWidthArray[indices[0]]
    let imageHeight = sortedImagesSizeArray[0] / imageWidth
    if startRandomCorner % 2 == 1 {
      startX = 215 - imageWidth
    }
    if startRandomCorner / 2 >= 1 {
      startY = 325 - imageHeight
    }
    imagesCornerCoordinateArray.append([startX, startY])
    
    for x in startX ..< startX + imageWidth{
      for y in startY ..< startY + imageHeight{
        let i = x - startX;
        let j = y - startY;
        if imagesArray[indices[0]][i][j] {
          availableArray[x][y] = false
          availableArrayFirstIteration[x][y] = false
        }
      }
    }
    
    generateRandomPosition(1)
    var unsortedImagesCornerCoordinateArray = [[Int]]()
    for i in [0,1,2,3,4] {
      let inverseIndex = indices.firstIndex(of: i) ?? 0
      unsortedImagesCornerCoordinateArray.append(imagesCornerCoordinateArray[inverseIndex] )
    }
    cornerCoordinatesArray = unsortedImagesCornerCoordinateArray as NSArray
    //print(Date())
  }
  
  func generateRandomPosition(
    _ depthNumber: Int) {
    if (depthNumber < 5) {
      guard let nextIndex = imagesSizeArray.firstIndex(of:sortedImagesSizeArray[depthNumber] ) else { return }
      let nextImageWidth = imagesWidthArray[nextIndex]
      let nextImageHeight = sortedImagesSizeArray[depthNumber] / nextImageWidth
      var isIternationCountExceeded = false
      var iterationCount = 0
      L1: while true {
        iterationCount += 1
        let nextRandomNumberX = Int.random(in: 0 ..< (215 - nextImageWidth))
        let nextRandomNumberY = Int.random(in: 0 ..< (325 - nextImageHeight))
        
        for x in nextRandomNumberX ..< nextRandomNumberX + nextImageWidth{
          for y in nextRandomNumberY ..< nextRandomNumberY + nextImageHeight{
            let i = x - nextRandomNumberX;
            let j = y - nextRandomNumberY;
            if imagesArray[nextIndex][i][j] && !availableArray[x][y] {
              if iterationCount <= 50 {
                continue L1
              } else { // bring state of all variables to the point where recursion was called for the first time
                let corner = imagesCornerCoordinateArray[0].map { $0 }
                imagesCornerCoordinateArray.removeAll()
                imagesCornerCoordinateArray.append(corner)
                availableArray = availableArrayFirstIteration.map { $0 }
                isIternationCountExceeded = true
                break L1
              }
            }
          }
        }
        
        for x in nextRandomNumberX ..< nextRandomNumberX + nextImageWidth{
          for y in nextRandomNumberY ..< nextRandomNumberY + nextImageHeight{
            let i = x - nextRandomNumberX;
            let j = y - nextRandomNumberY;
            if imagesArray[nextIndex][i][j] {
              availableArray[x][y] = false
            }
          }
        }
        imagesCornerCoordinateArray.append([nextRandomNumberX, nextRandomNumberY])
        break L1
      }
      if isIternationCountExceeded {
        generateRandomPosition(1)
      } else {
        generateRandomPosition(depthNumber + 1)
      }
    }
  }
  
  @objc
  func getSortedDimensions(_ callback: RCTResponseSenderBlock) {
    callback([NSNull(), dimensionsArray])
  }
  
  @objc
  func getSortedCornerCoordinates(_ callback: RCTResponseSenderBlock) {
    callback([NSNull(), cornerCoordinatesArray])
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
