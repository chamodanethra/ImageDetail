/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  Button,
  Platform,
} from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {boundaryCoordinates: {}};
    this.turnOn();
  }
  turnOn = () => {
    if (Platform.OS == 'ios') {
      NativeModules.ImageDetail.turnOn(
        `https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/icons/fruits/vegetable-3d-corn.png`,
      );
      this.updateStatus();
    } else if (Platform.OS == 'android') {
      let object = 'vegetable-3d-tomatto';
      NativeModules.ImageDetail.turnOn(
        `https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/icons/fruits/${object}.png`,
      )
        .then(boundaryCoordinates => {
          // console.log(boundaryCoordinates.startX);
          // console.log(boundaryCoordinates.startY);
          // console.log(boundaryCoordinates.endX);
          // console.log(boundaryCoordinates.endY);
          this.setState({boundaryCoordinates});
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  updateStatus() {
    NativeModules.ImageDetail.getStatus((error, boundaryCoordinates) => {
      this.setState({boundaryCoordinates: boundaryCoordinates});
      //console.log('boundaryCoordinates ', this.state.boundaryCoordinates);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Light App!!</Text>
        <Text> {this.state.boundaryCoordinates.startX}</Text>
        <Text> {this.state.boundaryCoordinates.startY}</Text>
        <Text> {this.state.boundaryCoordinates.endX}</Text>
        <Text> {this.state.boundaryCoordinates.endY}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
