import React, {PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  StatusBar,
} from 'react-native';

import AnimatedCard from './AnimatedCard';

class MemoryGameScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.gameObjects = props.gameData.gameObjects;

    let randomArray = [];
    for (let i = 0; i < numColumns * numRows; i++) {
      randomArray.push(i);
    }
    this.shuffleArray(randomArray);
    this.state = {
      iterationCount: 0,
      keyArray: [],
      randomArray,
      isGameOver: false,
      isNewGame: true,
      lastTwoTapIndices: [],
      completedArray: [],
      incorrectIndex: -1,
    };
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  componentDidUpdate() {
    if (this.state.iterationCount === this.state.randomArray.length) {
      setTimeout(() => {
        this.setState({
          isGameOver: true,
          completedArray: [],
          iterationCount: 0,
        });
      }, 2000);
    }
  }

  onTapCard = index => {
    if (this.state.lastTwoTapIndices.length == 0) {
      this.setState({
        lastTwoTapIndices: [index],
        isNewGame: false,
        incorrectIndex: -1,
      });
    } else if (this.state.lastTwoTapIndices.length == 1) {
      if (
        this.state.randomArray[this.state.lastTwoTapIndices[0]] %
          ((numColumns * numRows) / 2) ==
        this.state.randomArray[index] % ((numColumns * numRows) / 2)
      ) {
        let currentCompletedArray = [...this.state.completedArray];
        currentCompletedArray.push(this.state.lastTwoTapIndices[0]);
        currentCompletedArray.push(index);

        this.setState({
          lastTwoTapIndices: [],
          iterationCount: this.state.iterationCount + 2,
          completedArray: currentCompletedArray,
          incorrectIndex: -1,
        });
      } else {
        let incorrectIndex = this.state.lastTwoTapIndices[0];
        this.setState(
          {
            incorrectIndex: incorrectIndex,
            lastTwoTapIndices: [index],
          },
          () => {
            setTimeout(() => {
              this.setState({incorrectIndex: -1});
            }, 400);
          },
        );
      }
    }
  };

  startNewGame = () => {
    let randomArray = [];
    for (let i = 0; i < numColumns * numRows; i++) {
      randomArray.push(i);
    }
    this.shuffleArray(randomArray);
    this.setState({
      iterationCount: 0,
      keyArray: [],
      randomArray,
      isGameOver: false,
      isNewGame: true,
      lastTwoTapIndices: [],
      completedArray: [],
      incorrectIndex: -1,
    });
  };
  render() {
    let imageUriSlice = this.props.gameData.imageUriSlice
      ? this.props.gameData.imageUriSlice
      : 0;
    return (
      <View style={{backgroundColor: 'yellow', height: '100%', width: '100%'}}>
        <StatusBar hidden />
        <View style={styles.mainContainer}>
          <View style={styles.gameArea}>
            <View style={styles.wrapper}>
              {[0, 1, 2].map(e => {
                return (
                  <View
                    key={e}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    {[0, 1, 2, 3].map(f => {
                      return (
                        <View
                          key={f}
                          style={{
                            flex: 1,
                          }}>
                          <AnimatedCard
                            gridIndex={numColumns * e + f}
                            child={
                              imageUriSlice +
                              this.gameObjects[
                                this.state.randomArray[numColumns * e + f] %
                                  ((numColumns * numRows) / 2)
                              ]
                            }
                            onTapCard={this.onTapCard}
                            isTapped={this.state.lastTwoTapIndices.includes(
                              numColumns * e + f,
                            )}
                            isCompleted={this.state.completedArray.includes(
                              numColumns * e + f,
                            )}
                            incorrectIndex={this.state.incorrectIndex}
                            isGameOver={this.state.isGameOver}
                            isNewGame={this.state.isNewGame}
                          />
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const numColumns = 4; // update styling values also if this is modified;
const numRows = 3; // update styling values also if this is modified;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 25,
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  gameArea: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  wrapper: {
    flexDirection: 'column',
    width: '75%',
    height: '95%',
    alignSelf: 'center',
  },

  text: {
    fontSize: 75,
    fontWeight: 'bold',
  },
});

const availableHeight = Dimensions.get('window').height - 25 * 2;
const availableWidth = Dimensions.get('window').width - 25 * 2;
const mainContainerDimensions = {
  height: Math.min(availableHeight, availableWidth),
  width: Math.max(availableHeight, availableWidth),
};

export default MemoryGameScreen;
