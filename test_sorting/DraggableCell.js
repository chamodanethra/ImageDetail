import React, {Component} from 'react';
import {Animated, PanResponder, Dimensions, View, Image} from 'react-native';

export default class DraggableCell extends Component {
  constructor(props) {
    super(props);
    // console.log('OriginalCoordinateX : ' + props.absolutePositionX);

    this.state = {
      didMount: false,
      width: 0,
      height: 0,
      touchedCoordinateX: 0,
      touchedCoordinateY: 0,
      position: new Animated.ValueXY(),
      zIndex: props.chosenIndex === null ? 999 : props.chosenIndex + 20,
    };
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => this.props.chosenIndex !== null,
      onMoveShouldSetPanResponder: () => !this.props.areAllObjectsSorted,
      onPanResponderGrant: (event, gesture) => {
        if (this.props.chosenIndex !== null) {
          this.props.onTouchSelected(this.props.chosenIndex);
          this.setState({
            zIndex: 999,
          });
        } else {
          this.props.onTouchSelected(-1);
        }
        this.setState({
          touchedCoordinateX: event.nativeEvent.pageX,
          touchedCoordinateY: event.nativeEvent.pageY,
        });
      },
      onPanResponderRelease: (event, gesture) => {
        this.gameLogic(gesture);
      },

      onPanResponderMove: Animated.event([
        null,
        {dx: this.state.position.x, dy: this.state.position.y},
      ]),
    });
  }

  componentDidMount() {
    let initialHeight = ((mainContainerDimensions.height * 9) / 40) * 0.8;
    let initialWidth =
      ((mainContainerDimensions.width + this.props.navBarHeight) * 0.7 -
        25 * 2) /
      3;
    let maxWidth = Math.min(120, initialWidth);
    Image.getSize(
      `${this.props.imageUriSlice}${this.props.gameObject}.png`,
      (width, height) => {
        let verticalScaleFactor = initialHeight / height;
        let scaledHeight = height * verticalScaleFactor;
        let scaledWidth = width * verticalScaleFactor;
        if (width > maxWidth) {
          let horizontalScaleFactor = maxWidth / width;
          scaledWidth *= horizontalScaleFactor;
          scaledHeight *= horizontalScaleFactor;
        }
        this.setState({
          didMount: true,
          width: scaledWidth,
          height: scaledHeight,
        });
      },
    );
  }

  gameLogic(gesture) {
    let releasedCoordinateX = gesture.moveX === 0 ? gesture.x0 : gesture.moveX;
    let releasedCoordinateY = gesture.moveY === 0 ? gesture.y0 : gesture.moveY;

    let originalCoordinateX = 0;
    if (this.props.absolutePositionX) {
      originalCoordinateX = this.props.absolutePositionX;
    } else {
      if (this.props.gameObjectCount === 3) {
        originalCoordinateX =
          mainContainerDimensions.width / 2 +
          ((this.props.position - 1) *
            (mainContainerDimensions.width * 0.7 - 25 * 2)) / //paddingHorizontal: 25
            3;
      } else if (this.props.gameObjectCount === 2) {
        originalCoordinateX =
          mainContainerDimensions.width / 2 +
          ((this.props.position * 2 - 1) *
            (mainContainerDimensions.width * 0.7 - 25 * 2)) / //paddingHorizontal: 25
            4;
      } else {
        originalCoordinateX = mainContainerDimensions.width / 2;
      }
    }
    let originalCoordinateY = this.props.absolutePositionY
      ? this.props.absolutePositionY
      : (mainContainerDimensions.height * 71) / 80;

    let adjustedReleasedCoordinateX =
      releasedCoordinateX + originalCoordinateX - this.state.touchedCoordinateX;
    let adjustedReleasedCoordinateY =
      releasedCoordinateY + originalCoordinateY - this.state.touchedCoordinateY;

    if (
      !(
        this.state.touchedCoordinateX - 25 <= releasedCoordinateX &&
        releasedCoordinateX <= this.state.touchedCoordinateX + 25 &&
        this.state.touchedCoordinateY - 25 <= releasedCoordinateY &&
        releasedCoordinateY <= this.state.touchedCoordinateY + 25
      )
    ) {
      let leftResult =
        this.props.dropZoneCoordinates.startX <=
        adjustedReleasedCoordinateX - this.state.width / 2
          ? 2
          : this.props.dropZoneCoordinates.startX <= adjustedReleasedCoordinateX
          ? 1
          : 0;

      let rightResult =
        this.props.dropZoneCoordinates.endX >=
        adjustedReleasedCoordinateX + this.state.width / 2
          ? 2
          : this.props.dropZoneCoordinates.endX >= adjustedReleasedCoordinateX
          ? 1
          : 0;

      let topResult =
        this.props.dropZoneCoordinates.startY <=
        adjustedReleasedCoordinateY - this.state.height / 2
          ? 2
          : this.props.dropZoneCoordinates.startY <= adjustedReleasedCoordinateY
          ? 1
          : 0;

      let offSetX = 0;
      if (leftResult === 1) {
        offSetX =
          // 25 / 2 +
          this.props.dropZoneCoordinates.startX -
          (adjustedReleasedCoordinateX - this.state.width / 2);
        this.setState({result: -1});
      }
      if (rightResult === 1) {
        offSetX = -// 25 / 2 +
        (
          adjustedReleasedCoordinateX +
          this.state.width / 2 -
          this.props.dropZoneCoordinates.endX
        );
      }

      let offSetY = 0;
      if (topResult === 1) {
        offSetY =
          // 25 / 2 +
          this.state.height / 2 - adjustedReleasedCoordinateY;
      }

      // console.log('height/2 : ' + this.state.height / 2);
      // // console.log('adjustedY : ' + adjustedReleasedCoordinateY);
      // console.log('releasedX : ' + releasedCoordinateX);
      // console.log('width/2 : ' + this.state.width / 2);
      // console.log('adjustedX : ' + adjustedReleasedCoordinateX);
      // console.log(
      //   'adjustment :' + (originalCoordinateX - this.state.touchedCoordinateX),
      // );
      // console.log(
      //   'dropZoneCoordinateX :' + this.props.dropZoneCoordinates.endX,
      // );

      // // console.log('offSetY : ' + offSetY);
      // console.log('offSetX : ' + offSetX);
      // // console.log('offSetY : ' + offSetY);

      let result =
        this.props.dropZoneCoordinates.startX <= adjustedReleasedCoordinateX &&
        adjustedReleasedCoordinateX <= this.props.dropZoneCoordinates.endX &&
        this.props.dropZoneCoordinates.startY <= adjustedReleasedCoordinateY &&
        adjustedReleasedCoordinateY + this.state.height / 2 <=
          this.props.dropZoneCoordinates.endY;

      leftResult = rightResult = topResult = 2;
      if (this.props.gameObject) {
        if (result) {
          Animated.timing(this.state.position, {
            toValue: {
              x: 0,
              y: 0,
            },
            duration: 0,
          }).start();
          this.props.chosenIndex == null
            ? this.props.onSelect(
                true,
                adjustedReleasedCoordinateX + offSetX,
                adjustedReleasedCoordinateY + offSetY,
                this.props.element,
              )
            : this.props.onSelect(
                true,
                adjustedReleasedCoordinateX + offSetX,
                adjustedReleasedCoordinateY + offSetY,
                this.props.chosenIndex,
              );
        } else {
          if (this.props.chosenIndex === null) {
            Animated.spring(this.state.position, {
              toValue: {
                x: 0,
                y: 0,
              },
              friction: 100,
            }).start();
            this.props.onSelect(false, 0, 0, this.props.element);
          } else {
            Animated.timing(this.state.position, {
              toValue: {
                x: 0,
                y: 0,
              },
              duration: 0,
            }).start();
            this.props.onSelect(
              false,
              originalCoordinateX,
              originalCoordinateY,
              this.props.chosenIndex,
            );
          }
        }
      }
    } else {
      Animated.timing(this.state.position, {
        toValue: {
          x: 0,
          y: 0,
        },
        duration: 0,
      }).start();
      this.props.chosenIndex !== null &&
        this.props.onSelect(
          true,
          originalCoordinateX,
          originalCoordinateY,
          this.props.chosenIndex,
        );
    }
  }

  render() {
    let currentUri = this.props.gameObject
      ? `${this.props.imageUriSlice}${this.props.gameObject}.png`
      : `http://www.cf.wmich.edu/images/ClipArt/LightBulb3.png`;

    return this.props.chosenIndex === null ? (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          flexDirection: 'row',
        }}>
        <Animated.View
          {...this.panResponder.panHandlers}
          onLayout={event => {
            var {x, y, width, height} = event.nativeEvent.layout;
            if (!this.state.didMount) {
              this.setState({
                width: width,
                height: height,
              });
            }
          }}
          style={[
            {
              height: ((mainContainerDimensions.height * 9) / 40) * 0.8,
              position: 'absolute',
              zIndex: this.state.zIndex,
              justifyContent: 'center',
              transform: this.state.position.getTranslateTransform(),
            },
          ]}>
          {this.state.didMount && (
            <Image
              source={{uri: currentUri}}
              style={{
                height: this.state.height,
                width: this.state.width,
                backgroundColor: 'blue',
                alignSelf: 'center',
              }}
            />
          )}
        </Animated.View>
      </View>
    ) : (
      <Animated.View
        {...this.panResponder.panHandlers}
        onLayout={event => {
          var {x, y, width, height} = event.nativeEvent.layout;
          if (!this.state.didMount) {
            this.setState({
              width: width,
              height: height,
            });
          }

          if (
            width + this.props.absolutePositionX >
            mainContainerDimensions.width / 2
          ) {
            if (mainContainerDimensions.width / 2 - (x + width) < 0) {
              this.state.position.setOffset({
                x: mainContainerDimensions.width / 2 - (x + width),
                y: 0,
              });
            } else if (x < 0) {
              this.state.position.setOffset({
                x: -x,
                y: y < 0 ? -y : 0,
              });
            }
          }
        }}
        style={[
          {
            height: ((mainContainerDimensions.height * 9) / 40) * 0.8,
            position: 'absolute',
            zIndex: this.state.zIndex,
            left:
              this.props.absolutePositionX -
              this.state.width / 2 -
              (this.props.environment * mainContainerDimensions.width) / 2,
            top: this.props.absolutePositionY - this.state.height / 2,
            transform: this.state.position.getTranslateTransform(),
          },
        ]}>
        {this.state.didMount && (
          <Image
            source={{uri: currentUri}}
            style={{
              height: this.state.height,
              width: this.state.width,
              alignSelf: 'center',
            }}
          />
        )}
      </Animated.View>
    );
  }
}

const availableHeight = Dimensions.get('window').height;
const availableWidth = Dimensions.get('window').width;
const mainContainerDimensions = {
  height: Math.min(availableHeight, availableWidth) - 25,
  width: Math.max(availableHeight, availableWidth),
};
