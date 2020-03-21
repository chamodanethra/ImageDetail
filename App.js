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
  Platform,
  Image,
  Dimensions,
} from 'react-native';

const objects = ['1', '2', '3', '4', '5'];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensionsArray: [],
      cornerCoordinatesArray: [],
      boundaryCoordinatesArray: [],
    };
    //console.log(Dimensions.get('window').width - 25 * 2);
  }

  componentDidMount() {
    this.setImageURIs();
  }

  setImageURIs = () => {
    if (Platform.OS == 'ios') {
      NativeModules.ImageDetail.setImageURIs(
        `https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/build-game/car-assemble/`,
      );
      NativeModules.ImageDetail.getSortedDimensions(
        (error, dimensionsArray) => {
          this.setState({
            dimensionsArray,
          });
          console.log('dimensionsArray ', this.state.dimensionsArray);
        },
      );

      NativeModules.ImageDetail.getSortedCornerCoordinates(
        (error, cornerCoordinatesArray) => {
          this.setState({
            cornerCoordinatesArray,
          });
          console.log(
            'cornerCoordinatesArray ',
            this.state.cornerCoordinatesArray,
          );
        },
      );
    } else if (Platform.OS == 'android') {
      var boundaryCoordinatesArray = [];
      objects.forEach((object, index) => {
        NativeModules.ImageDetail.setImageURIs(
          `https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/build-game/car-assemble/${object}.png`,
        )
          .then(boundaryCoordinates => {
            // console.log(boundaryCoordinates.startX);
            // console.log(boundaryCoordinates.startY);
            // console.log(boundaryCoordinates.endX);
            // console.log(boundaryCoordinates.endY);
            boundaryCoordinatesArray.push(boundaryCoordinates);
            // console.log(boundaryCoordinatesArray);

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

  render() {
    return Platform.OS == 'android' ? (
      <View style={styles.container}>
        {this.state.boundaryCoordinatesArray.map(element => (
          <View>
            <Text style={styles.welcome}>Welcome to Light App!!</Text>
            <Text style={styles.welcome}>
              {element.boundaryCoordinates.startX}
            </Text>
            <Text style={styles.welcome}>
              {element.boundaryCoordinates.startY}
            </Text>
            <Text style={styles.welcome}>
              {element.boundaryCoordinates.endX}
            </Text>
            <Text style={styles.welcome}>
              {element.boundaryCoordinates.endY}
            </Text>
          </View>
        ))}
      </View>
    ) : (
      <View style={styles.container}>
        <View style={{width: 215, height: 325, backgroundColor: 'red'}}>
          {this.state.cornerCoordinatesArray.map((object, i) => (
            // <View
            //   key={i}
            //   style={{
            //     backgroundColor: 'red',
            //     position: 'absolute',
            //     top: object[1],
            //     left: object[0],
            //     height:
            //       this.state.dimensionsArray[i][3] -
            //       this.state.dimensionsArray[i][2],
            //     width:
            //       this.state.dimensionsArray[i][1] -
            //       this.state.dimensionsArray[i][0],
            //     resizeMode: 'contain',
            //   }}>
            <Image
              key={i}
              source={{
                uri: `https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/build-game/car-assemble/icon-${objects[i]}.png`,
              }}
              style={{
                position: 'absolute',
                top: object[1],
                left: object[0],
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
            // </View>
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
