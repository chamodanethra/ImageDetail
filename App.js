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

const objects = ['1', '2', '3', '4', '5'];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {boundaryCoordinates: {}, boundaryCoordinatesArray: []};
  }

  componentDidMount() {
    this.turnOn();
    console.log(this.state.boundaryCoordinatesArray);
  }

  turnOn = () => {
    if (Platform.OS == 'ios') {
      NativeModules.ImageDetail.turnOn(
        `https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/icons/fruits/vegetable-3d-corn.png`,
      );
      this.updateStatus();
    } else if (Platform.OS == 'android') {
      var boundaryCoordinatesArray = [];
      objects.forEach((object, index) => {
        NativeModules.ImageDetail.turnOn(
          `https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/build-game/car-assemble/${object}.png`,
        )
          .then(boundaryCoordinates => {
            // console.log(boundaryCoordinates.startX);
            // console.log(boundaryCoordinates.startY);
            // console.log(boundaryCoordinates.endX);
            // console.log(boundaryCoordinates.endY);
            boundaryCoordinatesArray.push(boundaryCoordinates);
            console.log(boundaryCoordinatesArray);

            this.setState(prevState => {
              return {
                boundaryCoordinatesArray: [
                  ...prevState.boundaryCoordinatesArray,
                  {boundaryCoordinates},
                ],
              };
            });
          })
          .catch(err => {
            console.error(err);
          });
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
    console.log('boundaryCoordinates ', this.state.boundaryCoordinatesArray[0]);
    return Platform.OS == 'android' ? (
      <View style={styles.container}>
        {this.state.boundaryCoordinatesArray.map(element => (
          <View>
            <Text style={styles.welcome}>Welcome to Light App!!</Text>
            <Text style={styles.welcome}>
              {element.boundaryCoordinates.startX}
            </Text>
            <Text style={styles.welcome}>
              {' '}
              {element.boundaryCoordinates.startY}
            </Text>
            <Text style={styles.welcome}>
              {' '}
              {element.boundaryCoordinates.endX}
            </Text>
            <Text style={styles.welcome}>
              {' '}
              {element.boundaryCoordinates.endY}
            </Text>
          </View>
        ))}
      </View>
    ) : (
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
