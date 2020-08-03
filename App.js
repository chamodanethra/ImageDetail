/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, NativeModules, Image} from 'react-native';
import TestSortingScreen from './TestSortingScreen';
import MemoryGameScreen from './MemoryGameScreen';
import BuildAToyScreen from './BuildAToyScreen';

const objects = ['1', '2', '3', '4', '5', '6'];

export default class App extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   dimensionsArray: [],
    //   cornerCoordinatesArray: [],
    //   height: 0,
    // };
    NativeModules.ImageDetail.setImageURIs(
      `https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/build-game`,
      [5, 6, 6, 5, 5, 5, 5, 5, 4, 5, 4, 5],
    );
  }

  // getAdjustedWidth = () => {
  //   NativeModules.ImageDetail.getHardNavigationBarHeight((error, height) => {
  //     this.setState({
  //       height,
  //     });
  //   });
  // };

  render() {
    return (
      <BuildAToyScreen
        gameIndex={53}
        gameData={{
          objectsCountsArray: [5, 6, 6, 5, 5, 5, 5, 5, 4, 5, 4, 5],
          imageUriSlice: `https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/build-game`,
        }}
      />
    );
    // return (
    //   <View style={styles.container}>
    //     <View style={{width: 215, height: 325, backgroundColor: 'red'}}>
    //       {this.state.cornerCoordinatesArray.map((corner, i) => (
    //         <Image
    //           key={i}
    //           source={{
    //             uri: `https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/build-game/farm-animals/icon-${
    //               objects[i]
    //             }.png`,
    //           }}
    //           style={{
    //             position: 'absolute',
    //             top: corner[1],
    //             left: corner[0],
    //             height:
    //               this.state.dimensionsArray[i][3] -
    //               this.state.dimensionsArray[i][2],
    //             width:
    //               this.state.dimensionsArray[i][1] -
    //               this.state.dimensionsArray[i][0],
    //             resizeMode: 'contain',
    //             zIndex: 200,
    //           }}
    //         />
    //       ))}
    //     </View>
    //   </View>
    // );

    // return (
    //   <TestSortingScreen
    //     navBarHeight={this.state.height}
    //     gameIndex={20}
    //     gameData={{
    //       imageUriSlice: `https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/icons/vehicle/`,
    //       imageFormat: '.png',
    //       objectCategories: {
    //         gameObjectsLeftCategory: [
    //           'plane-green',
    //           'plane-grey',
    //           'plane-helicop',
    //           'plane-orange',
    //           'plane-purple',
    //           'plane-yellow',
    //           'plane-airship',
    //         ],
    //         gameObjectsRightCategory: [
    //           'ride-ambulance',
    //           'ride-bus-yellow',
    //           'ride-car-blue',
    //           'ride-car-grey',
    //           'ride-car-red',
    //           'ride-jeep-red',
    //           'ride-truck-yellow',
    //         ],
    //       },
    //       backgroundImage:
    //         'https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/backgrounds/sorting-sky-and-road-background.png',
    //     }}
    //   />
    // );

    // return (
    //   <MemoryGameScreen
    //     gameIndex={36}
    //     gameData={{
    //       gameObjects: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    //       // gameObjects: [1, 2, 3, 4, 5, 6],
    //     }}
    //   />
    // );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    margin: 25,
  },
});
