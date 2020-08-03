import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  ImageBackground,
  StatusBar,
  Image,
} from 'react-native';

import ImagesContainer from './build_a_toy_games/ImagesContainer';

class BuildAToyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didMount: false,
      iterationCount: 0,
      completedArray: [],
      isGameOver: false,
      isNewGameStarted: true,
      height: 0,
      width: 0,
      scaledHeight: 0,
      scaledWidth: 0,
    };
    this.objectsArray = [];
    for (
      let i = 0;
      i < this.props.gameData.objectsCountsArray[this.props.gameIndex % 12];
      i++
    ) {
      this.objectsArray.push(i + 1);
    }
  }
  componentDidMount() {
    this.getScaledImageDimensions();
  }

  getScaledImageDimensions = () => {
    Image.getSize(
      this.props.gameData.imageUriSlice +
        '/' +
        ((this.props.gameIndex % 12) + 1) +
        '/empty.png',
      (width, height) => {
        let maxImageHeight = mainContainerDimensions.height;
        let currentImageWidth =
          (mainContainerDimensions.width * width) /
          iPhone11ProMainContainerDimensions.width;
        let horizontalScaleFactor = currentImageWidth / width;
        let scaledWidth = currentImageWidth;
        let scaledHeight = height * horizontalScaleFactor;
        if (scaledHeight > maxImageHeight) {
          let verticalScaleFactor = maxImageHeight / scaledHeight;
          scaledWidth *= verticalScaleFactor;
          scaledHeight *= verticalScaleFactor;
        }
        this.setState({
          height: height,
          width: width,
          scaledHeight: scaledHeight,
          scaledWidth: scaledWidth,
          didMount: true,
        });
      },
    );
  };

  componentDidUpdate() {
    if (
      this.state.iterationCount ===
      this.props.gameData.objectsCountsArray[this.props.gameIndex % 12]
    ) {
      setTimeout(() => {
        this.setState({
          isGameOver: true,
          iterationCount: 0,
        });
      }, 2000);
    }
  }

  onSelect = (isCorrect, index) => {
    if (isCorrect) {
      let modifiedCompletedArray = [...this.state.completedArray];
      modifiedCompletedArray.push(index + 1);
      this.setState({
        iterationCount: this.state.iterationCount + 1,
        completedArray: modifiedCompletedArray,
      });
    }
  };

  startNewGame = () => {
    this.setState({
      completedArray: [],
      isGameOver: false,
      isNewGameStarted: true,
    });
  };

  updateIsNewGameStarted = () => {
    this.setState({
      isNewGameStarted: false,
    });
  };

  getRemainingGameObjects(completedArray) {
    return this.objectsArray.filter(e => !completedArray.includes(e));
  }

  render() {
    let remainingArray = this.getRemainingGameObjects(
      this.state.completedArray,
    );
    let scaleFactor = this.state.scaledWidth / this.state.width;
    let imageOffsetX =
      styles.mainContainer.paddingHorizontal +
      ((mainContainerDimensions.width * this.state.width) /
        iPhone11ProMainContainerDimensions.width -
        this.state.scaledWidth) *
        0.5;
    let imageOffsetY =
      styles.mainContainer.paddingVertical +
      (mainContainerDimensions.height - this.state.scaledHeight) * 0.5;
    return (
      <View>
        <StatusBar hidden />
        <ImageBackground
          source={require('./assets/images/bg/matrix-1.png')}
          style={{width: '100%', height: '100%'}}>
          <View style={styles.mainContainer}>
            {this.state.didMount && (
              <View style={styles.gameArea}>
                <View
                  style={{
                    height: mainContainerDimensions.height,
                    flex: this.state.width,
                    // backgroundColor: 'brown',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{
                      height: this.state.scaledHeight,
                      width: this.state.scaledWidth,
                      position: 'absolute',
                      resizeMode: 'cover',
                      // backgroundColor: 'blue',
                    }}
                    source={{
                      uri:
                        this.props.gameData.imageUriSlice +
                        '/' +
                        ((this.props.gameIndex % 12) + 1) +
                        (this.props.gameData.objectsCountsArray[
                          this.props.gameIndex % 12
                        ] == this.state.completedArray.length
                          ? '/complete.png'
                          : '/empty.png'),
                    }}
                  />
                  {this.props.gameData.objectsCountsArray[
                    this.props.gameIndex % 12
                  ] != this.state.completedArray.length &&
                    this.state.completedArray.map(chosenIndex => (
                      <Image
                        key={chosenIndex}
                        style={{
                          height: this.state.scaledHeight,
                          width: this.state.scaledWidth,
                          position: 'absolute',
                          resizeMode: 'cover',
                        }}
                        source={{
                          uri:
                            this.props.gameData.imageUriSlice +
                            '/' +
                            ((this.props.gameIndex % 12) + 1) +
                            '/' +
                            chosenIndex +
                            '.png',
                        }}
                      />
                    ))}
                </View>
                <View
                  style={{
                    height: mainContainerDimensions.height,
                    flex:
                      iPhone11ProMainContainerDimensions.width -
                      this.state.width,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    // backgroundColor: 'blue',
                  }}>
                  <ImagesContainer
                    height={mainContainerDimensions.height}
                    width={
                      (mainContainerDimensions.width *
                        (iPhone11ProMainContainerDimensions.width -
                          this.state.width)) /
                      iPhone11ProMainContainerDimensions.width
                    }
                    remainingArray={remainingArray}
                    objectsCountsArray={this.props.gameData.objectsCountsArray}
                    gameIndex={this.props.gameIndex}
                    startX={
                      styles.mainContainer.paddingHorizontal +
                      (mainContainerDimensions.width * this.state.width) /
                        iPhone11ProMainContainerDimensions.width +
                      (mainContainerDimensions.width *
                        (1 - 0.9) *
                        (iPhone11ProMainContainerDimensions.width -
                          this.state.width)) /
                        iPhone11ProMainContainerDimensions.width // 90% of ImageContiner Width
                    }
                    startY={styles.mainContainer.paddingVertical}
                    imageOffsetX={imageOffsetX}
                    imageOffsetY={imageOffsetY}
                    scaledHeight={Math.floor(
                      mainContainerDimensions.height / scaleFactor,
                    )}
                    scaledWidth={Math.floor(
                      0.9 *
                        Math.floor(
                          (mainContainerDimensions.width *
                            (iPhone11ProMainContainerDimensions.width -
                              this.state.width)) /
                            iPhone11ProMainContainerDimensions.width /
                            scaleFactor,
                        ),
                    )}
                    scaleFactor={scaleFactor}
                    onSelect={this.onSelect}
                    isNewGameStarted={this.state.isNewGameStarted}
                    updateIsNewGameStarted={this.updateIsNewGameStarted}
                  />
                </View>
              </View>
            )}
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default BuildAToyScreen;

const styles = StyleSheet.create({
  mainContainer: {
    paddingVertical: 25,
    paddingHorizontal: 77,
    flex: 1,
  },
  gameArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    // backgroundColor: 'green',
  },
});

const availableHeight = Dimensions.get('window').height;
const availableWidth = Dimensions.get('window').width;
const mainContainerDimensions = {
  height: Math.min(availableHeight, availableWidth) - 25 * 2,
  width:
    Math.max(availableHeight, availableWidth) -
    77 * 2 +
    (Platform.OS === 'android' ? 48 : 0),
};

const iPhone11ProMainContainerDimensions = {
  width: 658,
};
