package com.imageprocessing;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.IllegalViewOperationException;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class ImageDetail extends ReactContextBaseJavaModule  {

    public ImageDetail(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    public static WritableMap map = new WritableNativeMap();

    @ReactMethod
    public void turnOn(String url, Promise promise) {
        Bitmap bmp = null;
        try {
            WritableNativeMap boundaryCoordinates = new WritableNativeMap();
            bmp = BitmapFactory.decodeStream((InputStream) new URL(url).getContent());
            int width = bmp.getWidth();
            int height = bmp.getHeight();

            int startX = width;
            int startY = height;
            int endX = 0;
            int endY = 0;

            for (int x = 0; x < width; x++) {
                for (int y = 0; y < height; y++) {
                    boolean isTransparent = Color.alpha(bmp.getPixel(x, y)) == 0;
                    if (!isTransparent) {
                        if (x > endX) {
                            endX = x;
                        }
                        if (x < startX) {
                            startX = x;
                        }
                        if (y > endY) {
                            endY = y;
                        }
                        if (y < startY) {
                            startY = y;
                        }
                    }
                }
            }
            boundaryCoordinates.putInt("startX", startX);
            boundaryCoordinates.putInt("startY", startY);
            boundaryCoordinates.putInt("endX", endX);
            boundaryCoordinates.putInt("endY", endY);

            Log.d("TAG", "turnOn: " + startX);
            promise.resolve(boundaryCoordinates);
        } catch (IOException e) {
            promise.reject(e);
        }

        // HashMap<String, Integer> hm = new HashMap<>();
        // hm.put("startX", startX);
        // hm.put("startY", startY);
        // hm.put("endX", endX);
        // hm.put("endY", endY);
        //
        // for (Map.Entry<String, Integer> entry : hm.entrySet()) {
        // map.putInt(entry.getKey(), entry.getValue());
        // }

    }
    @Override
    public String getName() {
        return "ImageDetail";
    }

}

