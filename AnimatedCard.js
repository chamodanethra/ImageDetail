import React, {PureComponent} from 'react';
import {Animated, TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class AnimatedCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rotateAnimation: new Animated.Value(0),
      didTimeOut: false,
      tapState: false,
      contentVisibleTransition: true,
    };
  }

  componentDidMount() {
    if (this.props.isNewGame && !this.state.didTimeOut) {
      this.startNewGame();
    }
  }

  startNewGame = () => {
    setTimeout(() => {
      this.startAnimation();
    }, 3000);
  };

  componentDidUpdate() {
    if (this.props.isGameOver && this.state.didTimeOut) {
      this.setState({didTimeOut: false});
    }
    if (this.props.isNewGame && !this.state.didTimeOut) {
      this.startNewGame();
    }
    if (this.props.incorrectIndex == this.props.gridIndex) {
      this.setState({tapState: false}, () => {
        // setTimeout(() => {
        this.startAnimation();
        // }, 600);
      });
    }
  }

  startAnimation = () => {
    this.state.rotateAnimation.setValue(0);
    Animated.timing(this.state.rotateAnimation, {
      toValue: 85,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      this.setState(
        {
          contentVisibleTransition: false,
          didTimeOut: true,
        },
        () => {
          this.state.rotateAnimation.setValue(95);
          Animated.timing(this.state.rotateAnimation, {
            toValue: 180,
            duration: 400,
            useNativeDriver: true,
          }).start(() => {
            this.setState({
              tapState: true,
            });
          });
        },
      );
    });
  };

  tapAnimation = () => {
    Animated.timing(this.state.rotateAnimation, {
      toValue: 95,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      this.setState({contentVisibleTransition: true}, () => {
        this.state.rotateAnimation.setValue(85);
        Animated.timing(this.state.rotateAnimation, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          this.setState(
            {
              tapState: true,
              contentVisibleTransition: false,
            },
            () => {
              this.props.onTapCard(this.props.gridIndex);
            },
          );
        });
      });
    });
  };

  onPressAnimatedCard = () => {
    if (
      this.state.tapState &&
      !(this.props.isCompleted || this.props.isTapped) &&
      this.state.didTimeOut
    ) {
      this.setState({tapState: false}, () => {
        this.tapAnimation();
      });
    }
  };

  render() {
    const rotateInterpolate = this.state.rotateAnimation.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });
    const animatedStyles = {
      transform: [{perspective: 300}, {rotateY: rotateInterpolate}],
    };

    if (this.props.gridIndex == 0) {
      // console.log('xxx');
    }

    let childComponent =
      typeof this.props.child == 'number' ? (
        <Text style={styles.text}>{this.props.child}</Text>
      ) : (
        <Image source={{uri: this.props.child}} />
      );
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.7}
        onPress={this.onPressAnimatedCard}>
        <Animated.View style={[styles.thumbWrapper, animatedStyles]}>
          {!this.state.didTimeOut ||
          this.props.isTapped ||
          this.props.isCompleted ||
          this.state.contentVisibleTransition ||
          this.props.incorrectIndex == this.props.gridIndex ||
          this.props.isGameOver ? (
            childComponent
          ) : (
            <Text style={styles.invertedText}>?</Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    // flex: 1,
    margin: 7.5,
    borderRadius: 9,
    backgroundColor: 'red',
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  thumbWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  text: {
    fontSize: 75,
    fontWeight: 'bold',
  },
  invertedText: {
    fontSize: 75,
    fontWeight: 'bold',
    transform: [{rotateY: '180deg'}],
  },
});
