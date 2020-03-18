/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, NativeModules, Button} from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {boundaryCoordinates: {}};
  }
  turnOn = () => {
    NativeModules.ImageDetail.turnOn(
      `http://www.cf.wmich.edu/images/ClipArt/LightBulb3.png`,
    );
    this.updateStatus();
  };

  updateStatus() {
    NativeModules.ImageDetail.getStatus((error, boundaryCoordinates) => {
      this.setState({boundaryCoordinates: boundaryCoordinates});
      console.log('boundaryCoordinates ', this.state.boundaryCoordinates);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Light App!!</Text>
        <Text> Go</Text>
        <Button onPress={this.turnOn} title="Turn ON " color="#FF6347" />
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
