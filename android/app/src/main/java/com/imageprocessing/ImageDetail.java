package com.imageprocessing;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;

public class ImageDetail extends ReactContextBaseJavaModule {

    public ImageDetail(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    boolean[][] availableArray = new boolean[215][325];
    int[] imagesSizeArray;
    int[] imagesWidthArray;
    ArrayList<boolean[][]> imagesArray = new ArrayList<boolean[][]>();
    int [][]imagesCornerCoordinatesArray;
    int [][]imagesDimensionsArray;

    @ReactMethod
    public void setImageURIs(String url, int withCount) {
        for (int i = 0; i < 215; i++) {
            for (int j = 0; j < 325; j++) {
                availableArray[i][j] = true;
            }
        }
        try {
            Bitmap bmp = null;
            imagesSizeArray = new int[withCount];
            imagesWidthArray = new int[withCount];
            imagesCornerCoordinatesArray = new int[withCount][2];
            imagesDimensionsArray = new int[withCount][4];
            for (int i = 0; i < withCount; i++) {
                String fullURL = url + (i + 1) + ".png";
                bmp = BitmapFactory.decodeStream((InputStream) new URL(fullURL).getContent());
                boolean isFirstPixelFound = false;
                int startX = 0;
                int startY = bmp.getHeight();
                int endX = 0;
                int endY = 0;
                for (int x = 0; x < bmp.getWidth(); x++) {
                    boolean isFirstPixelInColumn = false;
                    for (int y = 0; y < bmp.getHeight(); y++) {
                        boolean isPixelTransparent = Color.alpha(bmp.getPixel(x, y)) == 0;
                        if (!isPixelTransparent) {
                            if (!isFirstPixelFound) {
                                startX = x;
                                isFirstPixelFound = true;
                            }
                            endX = x;
                            if (!isFirstPixelInColumn) {
                                isFirstPixelInColumn = true;
                                if (startY >= y) {
                                    startY = y;
                                }
                            }
                            if (endY <= y) {
                                endY = y;
                            }
                        }
                    }
                }

                int maxWidth = endX + 1 - startX;
                int maxHeight = endY + 1 - startY;
                boolean[][] imageArray = new boolean[maxWidth][maxHeight];
                for (int x = startX; x < startX + maxWidth; x++) {
                    for (int y = startY; y < startY + maxHeight; y++) {
                        boolean isPixelTransparent = Color.alpha(bmp.getPixel(x, y)) == 0;
                        if (!isPixelTransparent) {
                            int indexX = x - startX;
                            int indexY = y - startY;
                            imageArray[indexX][indexY] = true;
                        }
                    }
                }
                imagesArray.add(imageArray);
                imagesDimensionsArray[i][0] = startX;
                imagesDimensionsArray[i][1] = endX + 1;
                imagesDimensionsArray[i][2] = startY;
                imagesDimensionsArray[i][3] = endY + 1;
                imagesSizeArray[i] = maxWidth * maxHeight;
                imagesWidthArray[i] = maxWidth;
            }
            generateRandomPosition(0);
        } catch (IOException e) {
        }
    }

    private void generateRandomPosition(int depthNumber) {
        if (depthNumber < imagesArray.size()) {
            int imageWidth = imagesWidthArray[depthNumber];
            int imageHeight = imagesSizeArray[depthNumber] / imageWidth;
            boolean isIterationCountExceeded = false;
            int iterationCount = 0;
            L1: while (true) {
                iterationCount++;
                int randomNumberX = (int) (Math.random() * (215 - imageWidth));
                int randomNumberY = (int) (Math.random() * (325 - imageHeight));

                for (int x = randomNumberX; x < randomNumberX + imageWidth; x++) {
                    int i = x - randomNumberX;
                    for (int y = randomNumberY; y < randomNumberY + imageHeight; y++) {
                        int j = y - randomNumberY;
                        if (imagesArray.get(depthNumber)[i][j] && !availableArray[x][y]) {
                            if (iterationCount <= 50) {
                                continue L1;
                            } else { // bring state of all variables to the point where recursion was called for the
                                // first time
                                for (int k = 0; k < 215; k++) {
                                    for (int l = 0; l < 325; l++) {
                                        availableArray[k][l] = true;
                                    }
                                }
                                isIterationCountExceeded = true;
                                break L1;
                            }
                        }
                    }
                }

                for (int x = randomNumberX; x < randomNumberX + imageWidth; x++) {
                    int i = x - randomNumberX;
                    for (int y = randomNumberY; y < randomNumberY + imageHeight; y++) {
                        int j = y - randomNumberY;
                        if (imagesArray.get(depthNumber)[i][j]) {
                            availableArray[x][y] = false;
                        }
                    }
                }
                imagesCornerCoordinatesArray[depthNumber][0] = randomNumberX;
                imagesCornerCoordinatesArray[depthNumber][1] = randomNumberY;
                break L1;
            }
            if (isIterationCountExceeded) {
                generateRandomPosition(0);
            } else {
                generateRandomPosition(depthNumber + 1);
            }
        }
    }

    @ReactMethod
    public void getDimensions(
        Callback successCallback) {
        WritableArray dimensionsArray = Arguments.createArray();
        for (int i = 0; i < imagesDimensionsArray.length; i++) {
            WritableArray intermediateArray = Arguments.createArray();
            for (int j = 0; j < 4; j++) {
                intermediateArray.pushInt(imagesDimensionsArray[i][j]);
            }
            dimensionsArray.pushArray(intermediateArray);
        }
            successCallback.invoke(null, dimensionsArray);
    }

    @ReactMethod
    public void getCornerCoordinates(
            Callback successCallback) {
        WritableArray cornerCoordinatesArray = Arguments.createArray();
        for (int i = 0; i < imagesCornerCoordinatesArray.length; i++) {
            WritableArray intermediateArray = Arguments.createArray();
            for (int j = 0; j < 2; j++) {
                intermediateArray.pushInt(imagesCornerCoordinatesArray[i][j]);
            }
            cornerCoordinatesArray.pushArray(intermediateArray);
        }
        successCallback.invoke(null, cornerCoordinatesArray);
    }

    @Override
    public String getName() {
        return "ImageDetail";
    }

}
