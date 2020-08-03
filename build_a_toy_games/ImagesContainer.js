import React, {Component} from 'react';
import {View, NativeModules, ActivityIndicator} from 'react-native';
import DraggableCell from './DragabbleCell';

export default class ImagesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensionsArray: [],
      cornerCoordinatesArray: [],
      availableArray: [],
      isLoading: false,
      priorityIndex: -1,
    };
  }

  componentDidMount() {
    if (this.props.isNewGameStarted) {
      this.callNativeAlgorithms();
      this.props.updateIsNewGameStarted();
    }
  }

  componentDidUpdate() {
    if (this.props.isNewGameStarted) {
      this.callNativeAlgorithms();
      this.props.updateIsNewGameStarted();
    }
  }

  callNativeAlgorithms = async () => {
    var array = this.props.objectsCountsArray.slice(
      0,
      1 + (this.props.gameIndex % 12),
    );
    var end = array.reduce(function(a, b) {
      return a + b;
    }, 0);
    var start = end - this.props.objectsCountsArray[this.props.gameIndex % 12];
    try {
      this.setState({isLoading: true}, async () => {
        let result = await NativeModules.ImageDetail.setImageURIs(
          `https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/build-game`,
          this.props.objectsCountsArray,
        );
        // console.log(result);
        this.setState({isLoading: false}, () => {
          NativeModules.ImageDetail.initialiseAvailableArray(
            this.props.scaledHeight,
            this.props.scaledWidth,
          );
          NativeModules.ImageDetail.generateRandomPosition(start, end);
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
          NativeModules.ImageDetail.getAvailableArray(
            (error, availableArray) => {
              this.setState({
                availableArray,
              });
            },
          );
        });
      });
    } catch (e) {}
  };

  onTouchStartImageContainer = (xCoordinate, yCoordinate) => {
    if (this.state.priorityIndex == -1) {
      if (
        Math.floor((xCoordinate - this.props.startX) / this.props.scaleFactor) <
          this.state.availableArray.length &&
        Math.floor((yCoordinate - this.props.startY) / this.props.scaleFactor) <
          this.state.availableArray[0].length
      )
        this.setState({
          priorityIndex: this.state.availableArray[
            Math.floor(
              (xCoordinate - this.props.startX) / this.props.scaleFactor,
            )
          ][
            [
              Math.floor(
                (yCoordinate - this.props.startY) / this.props.scaleFactor,
              ),
            ]
          ],
        });
    }
  };

  onTouchReleaseCell = () => {
    this.setState({priorityIndex: -1});
  };

  render() {
    return !this.state.isLoading ? (
      <View
        style={{
          width: '90%',
          height: '100%',
          backgroundColor: 'white',
        }}
        onTouchStart={event => {
          this.onTouchStartImageContainer(
            event.nativeEvent.pageX,
            event.nativeEvent.pageY,
          );
        }}>
        {this.state.cornerCoordinatesArray.map((corner, i) => (
          <DraggableCell
            key={i}
            index={i}
            uri={`https://la-frontend.s3-ap-southeast-1.amazonaws.com/images/build-game/${(this
              .props.gameIndex %
              12) +
              1}/icon-${i + 1}.png`}
            position={{
              top: corner[1] * this.props.scaleFactor,
              left: corner[0] * this.props.scaleFactor,
              startX: this.state.dimensionsArray[i][0] * this.props.scaleFactor,
              endX: this.state.dimensionsArray[i][1] * this.props.scaleFactor,
              startY: this.state.dimensionsArray[i][2] * this.props.scaleFactor,
              endY: this.state.dimensionsArray[i][3] * this.props.scaleFactor,
            }}
            parentStartX={this.props.startX}
            parentStartY={this.props.startY}
            imageOffsetX={this.props.imageOffsetX}
            imageOffsetY={this.props.imageOffsetY}
            onSelect={this.props.onSelect}
            isVisible={this.props.remainingArray.includes(i + 1)}
            isPriority={this.state.priorityIndex == i}
            onTouchReleaseCell={this.onTouchReleaseCell}
          />
        ))}
      </View>
    ) : (
      <ActivityIndicator style={{alignSelf: 'center'}} />
    );
  }
}
