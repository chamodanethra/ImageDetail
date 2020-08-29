import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {usePanGestureHandler, withOffset} from 'react-native-redash';
import StyleGuide from './StyleGuide';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ball: {
    backgroundColor: StyleGuide.palette.primary,
    height: 100,
    width: 100,
    borderRadius: 50,
  },
});

const Test = () => {
  const {gestureHandler, translation, state} = usePanGestureHandler();
  const translateX = withOffset(translation.x, state);
  const translateY = withOffset(translation.y, state);
  // useEffect(() => new Array(50000).fill(0).forEach((v, i) => console.log(i)));
  return (
    <View style={styles.container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={[styles.ball, {transform: [{translateX}, {translateY}]}]}
        />
      </PanGestureHandler>
    </View>
  );
};

export default Test;
