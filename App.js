/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, NativeModules, Image} from 'react-native';

const objects = ['1', '2', '3', '4', '5', '6'];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensionsArray: [],
      cornerCoordinatesArray: [],
    };
  }

  componentDidMount() {
    this.setImageURIs();
  }

  setImageURIs = () => {
    NativeModules.ImageDetail.setImageURIs(
      `https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/build-game/farm-animals/`,
      objects.length,
    );
    NativeModules.ImageDetail.getDimensions((error, dimensionsArray) => {
      this.setState({
        dimensionsArray,
      });
    });

    NativeModules.ImageDetail.getCornerCoordinates(
      (error, cornerCoordinatesArray) => {
        this.setState({
          cornerCoordinatesArray,
        });
      },
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{width: 215, height: 325, backgroundColor: 'red'}}>
          {this.state.cornerCoordinatesArray.map((corner, i) => (
            <Image
              key={i}
              source={{
                uri: `https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/build-game/farm-animals/icon-${objects[i]}.png`,
              }}
              style={{
                position: 'absolute',
                top: corner[1],
                left: corner[0],
                height:
                  this.state.dimensionsArray[i][3] -
                  this.state.dimensionsArray[i][2],
                width:
                  this.state.dimensionsArray[i][1] -
                  this.state.dimensionsArray[i][0],
                resizeMode: 'contain',
                zIndex: 100,
              }}
            />
          ))}
        </View>
      </View>
    );
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
