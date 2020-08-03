package com.imageprocessing;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Process;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.concurrent.Executor;

public class ImageDetail extends ReactContextBaseJavaModule {

    public ImageDetail(ReactApplicationContext reactContext, Executor executor) {
        super(reactContext);
        ImageDetail.executor = executor;
    }

    WritableArray dimensionsArray;
    static int[][] availableArray;
    static ArrayList<Integer> imagesSizeArray = new ArrayList<Integer>();
    static ArrayList<Integer> imagesWidthArray = new ArrayList<Integer>();
    static ArrayList<boolean[][]> imagesArray = new ArrayList<boolean[][]>();
    static ArrayList<int[]> imagesCornerCoordinatesArray = new ArrayList<int[]>();
    static ArrayList<int[]> imagesDimensionsArray = new ArrayList<int[]>();
    static boolean didInitialise = false;
    static int height;
    static int width;
    static int startingIndex = -1;
    static private Executor executor;

    @ReactMethod
    public void setImageURIs(String url, ReadableArray objectsCountsArray, Promise promise) {
        if (!didInitialise) {
            executor.execute((new Runnable() {
                @Override
                public void run() {
                    Process.setThreadPriority(Process.THREAD_PRIORITY_URGENT_DISPLAY);
                    for (int j = 0; j < objectsCountsArray.size(); j++) {
                        int objectsCount = objectsCountsArray.getInt(j);
                        for (int i = 0; i < objectsCount; i++) {
                            String fullURL = url + "/" + (j + 1) + "/" + (i + 1) + ".png";
                            Bitmap bmp = null;
                            boolean didFetch = false;
                            do {
                                try {
                                    bmp = BitmapFactory.decodeStream((InputStream) new URL(fullURL).getContent());
                                    didFetch = true;
                                } catch (IOException e) {
                                }
                            } while (didFetch == false);
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
                            int[][] imageArray = new int[maxWidth][maxHeight];
                            for (int x = startX; x < startX + maxWidth; x++) {
                                for (int y = startY; y < startY + maxHeight; y++) {
                                    boolean isPixelTransparent = Color.alpha(bmp.getPixel(x, y)) == 0;
                                    if (!isPixelTransparent) {
                                        int indexX = x - startX;
                                        int indexY = y - startY;
                                        imageArray[indexX][indexY] = 1;
                                    }
                                }
                            }

                            calculate(imageArray);
                            boolean[][] booleanImageArray = new boolean[maxWidth][maxHeight];
                            for (int x = 0; x < imageArray.length; x++) {
                                for (int y = 0; y < imageArray[0].length; y++) {
                                    booleanImageArray[x][y] = imageArray[x][y] == 1;
                                }
                            }

                            imagesArray.add(booleanImageArray);
                            imagesDimensionsArray.add(new int[] { startX, endX + 1, startY, endY + 1 });
                            imagesSizeArray.add(maxWidth * maxHeight);
                            imagesWidthArray.add(maxWidth);
                        }
                    }
                    didInitialise = true;
                    promise.resolve(imagesArray.size());
                }
            }));
        } else {
            promise.resolve(imagesArray.size());
        }
    }

    private static void calculate(int imageArray[][]) {
        for (int i = 0; i < imageArray.length; i++) {
            for (int j = 0; j < imageArray[0].length; j++) {
                if (imageArray[i][j] == 0) {
                    imageArray[i][j] = -1;
                    if (iterateWhite(i, j, imageArray)) {
                        imageArray[i][j] = 1;
                        fillHoles(i, j, imageArray);
                    }
                }
            }
        }
    }

    private static boolean iterateWhite(int x, int y, int imageArray[][]) {
        boolean isAHole = true;
        for (int i = -1; i <= 1; i++) {
            for (int j = -1; j <= 1; j++) {
                if (i == j || i + j == 0) {
                    continue;
                }
                if (x + i >= 0 && x + i < imageArray.length && y + j >= 0 && y + j < imageArray[0].length) {
                    if (imageArray[x + i][y + j] == 0) {
                        imageArray[x + i][y + j] = -1;
                        isAHole = isAHole & iterateWhite(x + i, y + j, imageArray);
                    }
                }
                if (x == 0 || x == imageArray.length - 1 || y == 0 || y == imageArray[0].length - 1) {
                    isAHole = false;
                }
            }
        }
        return isAHole;
    }

    private static void fillHoles(int x, int y, int imageArray[][]) {
        for (int i = -1; i <= 1; i++) {
            for (int j = -1; j <= 1; j++) {
                if (i == j || i + j == 0) {
                    continue;
                }
                if (x + i >= 0 && x + i < imageArray.length && y + j >= 0 && y + j < imageArray[0].length) {
                    if (imageArray[x + i][y + j] == -1) {
                        imageArray[x + i][y + j] = 1;
                        fillHoles(x + i, y + j, imageArray);
                    }
                }
            }
        }
    }

    @ReactMethod
    public void initialiseAvailableArray(int height, int width) {
        ImageDetail.availableArray = new int[width][height];
        for (int k = 0; k < width; k++) {
            for (int l = 0; l < height; l++) {
                availableArray[k][l] = -1;
            }
        }
        ImageDetail.height = height;
        ImageDetail.width = width;
    }

    @ReactMethod
    public void generateRandomPosition(int start, int end) {
        if (ImageDetail.startingIndex == -1) {
            ImageDetail.startingIndex = start;
        }
        while (!generateNonOverlappingPosition(start, end)) {
        }
    }

    private boolean generateNonOverlappingPosition(int startIndex, int endIndex) {
        if (startIndex < endIndex) {
            int imageWidth = imagesWidthArray.get(startIndex);
            int imageHeight = imagesSizeArray.get(startIndex) / imageWidth;
            boolean isIterationCountExceeded = false;
            int iterationCount = 0;
            L1: while (true) {
                iterationCount++;
                int randomNumberX = (int) (Math.random() * (width - imageWidth));
                int randomNumberY = (int) (Math.random() * (height - imageHeight));

                for (int x = randomNumberX; x < randomNumberX + imageWidth; x++) {
                    int i = x - randomNumberX;
                    for (int y = randomNumberY; y < randomNumberY + imageHeight; y++) {
                        int j = y - randomNumberY;
                        if (imagesArray.get(startIndex)[i][j] && availableArray[x][y] != -1) {
                            if (iterationCount <= 30) {
                                continue L1;
                            } else { // bring state of all variables to the point where recursion was called for the
                                // first time
                                imagesCornerCoordinatesArray = new ArrayList<int[]>();
                                for (int k = 0; k < width; k++) {
                                    for (int l = 0; l < height; l++) {
                                        availableArray[k][l] = -1;
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
                        if (imagesArray.get(startIndex)[i][j]) {
                            availableArray[x][y] = startIndex - ImageDetail.startingIndex;
                        }
                    }
                }
                imagesCornerCoordinatesArray.add(new int[] { randomNumberX, randomNumberY });
                break L1;
            }
            if (isIterationCountExceeded) {
                return false;
            } else {
                return generateNonOverlappingPosition(startIndex + 1, endIndex);
            }
        } else {
            // int upperDistance = 0;
            // L1: for (int y = 0; y < ImageDetail.availableArray[0].length; y++) {
            // for (int x = 0; x < ImageDetail.availableArray.length; x++) {
            // if (ImageDetail.availableArray[x][y] != -1) {
            // upperDistance = y;
            // break L1;
            // }
            // }
            // }
            // int lowerDistance = 0;
            // int maxLimitY = ImageDetail.availableArray[0].length - 1;
            // L1: for (int y = 0; y < ImageDetail.availableArray[0].length; y++) {
            // for (int x = 0; x < ImageDetail.availableArray.length; x++) {
            // if (ImageDetail.availableArray[x][maxLimitY - y] != -1) {
            // lowerDistance = y;
            // break L1;
            // }
            // }
            // }
            // int offSetY = (lowerDistance - upperDistance) / 2;
            // for (int i = startingIndex; i < endIndex; i++) {
            // ImageDetail.imagesCornerCoordinatesArray.get(i - startingIndex)[1] +=
            // offSetY;
            // }
            this.dimensionsArray = Arguments.createArray();
            for (int i = ImageDetail.startingIndex; i < endIndex; i++) {
                WritableArray intermediateArray = Arguments.createArray();
                for (int j = 0; j < 4; j++) {
                    intermediateArray.pushInt(imagesDimensionsArray.get(i)[j]);
                }
                this.dimensionsArray.pushArray(intermediateArray);
            }
            ImageDetail.startingIndex = -1;
            return true;
        }
    }

    @ReactMethod
    public void getDimensions(Callback successCallback) {
        successCallback.invoke(null, dimensionsArray);
    }

    @ReactMethod
    public void getCornerCoordinates(Callback successCallback) {
        WritableArray cornerCoordinatesArray = Arguments.createArray();
        for (int i = 0; i < imagesCornerCoordinatesArray.size(); i++) {
            WritableArray intermediateArray = Arguments.createArray();
            for (int j = 0; j < 2; j++) {
                intermediateArray.pushInt(imagesCornerCoordinatesArray.get(i)[j]);
            }
            cornerCoordinatesArray.pushArray(intermediateArray);
        }
        imagesCornerCoordinatesArray = new ArrayList<int[]>();
        successCallback.invoke(null, cornerCoordinatesArray);
    }

    @ReactMethod
    public void getAvailableArray(Callback successCallback) {
        WritableArray availableArray = Arguments.createArray();
        for (int i = 0; i < ImageDetail.availableArray.length; i++) {
            WritableArray intermediateArray = Arguments.createArray();
            for (int j = 0; j < ImageDetail.availableArray[0].length; j++) {
                intermediateArray.pushInt(ImageDetail.availableArray[i][j]);
            }
            availableArray.pushArray(intermediateArray);
        }
        successCallback.invoke(null, availableArray);
    }

    @Override
    public String getName() {
        return "ImageDetail";
    }
}