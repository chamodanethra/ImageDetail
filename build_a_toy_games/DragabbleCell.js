import React, {Component} from 'react';
import {Animated, PanResponder, Image} from 'react-native';

export default class DraggableCell extends Component {
  constructor(props) {
    super(props);
    let minIdentifier = 0;
    this.state = {
      touchedCoordinateX: 0,
      touchedCoordinateY: 0,
      position: new Animated.ValueXY(),
      firstTouchReleased: true,
      releasedZIndex: 0,
    };
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () =>
        this.props.isVisible && this.props.isPriority,
      onStartShouldSetPanResponder: () => false,
      onPanResponderGrant: (event, gesture) => {
        minIdentifier = event.nativeEvent.touches[0].identifier;
        this.setState({
          touchedCoordinateX: event.nativeEvent.touches[0].pageX,
          touchedCoordinateY: event.nativeEvent.touches[0].pageY,
          firstTouchReleased: false,
        });
      },
      onPanResponderMove: (event, gesture) => {
        if (
          event.nativeEvent.touches[0].identifier == minIdentifier &&
          !this.state.firstTouchReleased
        ) {
          this.state.position.setValue({
            x:
              event.nativeEvent.touches[0].pageX -
              this.state.touchedCoordinateX,
            y:
              event.nativeEvent.touches[0].pageY -
              this.state.touchedCoordinateY,
          });
        }
      },
      onPanResponderEnd: (event, gesture) => {
        if (
          event.nativeEvent.touches.length != 0 &&
          event.nativeEvent.touches[0].identifier != minIdentifier &&
          !this.state.firstTouchReleased
        ) {
          this.setState({firstTouchReleased: true});
          this.gameLogic();
        }
      },
      onPanResponderRelease: (event, gesture) => {
        this.props.onTouchReleaseCell();
        if (!this.state.firstTouchReleased) {
          this.setState({firstTouchReleased: true});
          this.gameLogic();
        }
      },
    });
  }

  gameLogic() {
    let releasedCoordinateX =
      this.state.position.x._value + this.state.touchedCoordinateX;
    let releasedCoordinateY =
      this.state.position.y._value + this.state.touchedCoordinateY;

    let originalCoordinateX =
      this.props.parentStartX +
      this.props.position.left +
      (this.props.position.endX - this.props.position.startX) / 2;
    // console.log('originalCoordinateX : ' + originalCoordinateX);
    let originalCoordinateY =
      this.props.parentStartY +
      this.props.position.top +
      (this.props.position.endY - this.props.position.startY) / 2;
    // console.log('originalCoordinateY : ' + originalCoordinateY);
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
      let result =
        this.props.imageOffsetX + this.props.position.startX <=
          adjustedReleasedCoordinateX &&
        adjustedReleasedCoordinateX <=
          this.props.imageOffsetX + this.props.position.endX &&
        this.props.imageOffsetY + this.props.position.startY <=
          adjustedReleasedCoordinateY &&
        adjustedReleasedCoordinateY <=
          this.props.imageOffsetY + this.props.position.endY;
      if (result) {
        Animated.timing(this.state.position, {
          toValue: {
            x: 0,
            y: 0,
          },
          duration: 0,
        }).start(() => {
          this.setState({releasedZIndex: 0});
          this.props.onSelect(true, this.props.index);
        });
        this.props.onSelect(true, this.props.index);
      } else {
        this.setState({releasedZIndex: 1}, () => {
          this.props.onSelect(false, this.props.index);
          Animated.spring(this.state.position, {
            toValue: {
              x: 0,
              y: 0,
            },
            friction: 100,
          }).start(() => {
            this.setState({releasedZIndex: 0});
          });
        });
      }
    } else {
      Animated.timing(this.state.position, {
        toValue: {
          x: 0,
          y: 0,
        },
        duration: 0,
      }).start(() => {
        this.setState({releasedZIndex: 0});
      });
    }
  }

  render() {
    return (
      <Animated.View
        onTouchCancel={event => {
          this.state.position.setValue({x: 0, y: 0});
        }}
        {...this.panResponder.panHandlers}
        style={[
          {
            height: this.props.position.endY - this.props.position.startY,
            width: this.props.position.endX - this.props.position.startX,
            position: 'absolute',
            zIndex: this.state.releasedZIndex + (this.props.isPriority ? 1 : 0),
            left: this.props.position.left,
            top: this.props.position.top,
            transform: this.state.position.getTranslateTransform(),
          },
        ]}>
        {this.props.isVisible && (
          <Image
            source={{uri: this.props.uri}}
            style={{
              height: this.props.position.endY - this.props.position.startY,
              width: this.props.position.endX - this.props.position.startX,
              alignSelf: 'center',
              resizeMode: 'cover',
            }}
          />
        )}
      </Animated.View>
    );
  }
}
