import React, {Component} from 'react';
import {StyleSheet, View, ImageBackground, StatusBar, Text} from 'react-native';
import Sound from 'react-native-sound';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import BackButton from '../../../components/common/BackButton';
import InfoButton from '../../../components/common/InfoButton';
import SoundButton from '../../../components/common/SoundButton';
import SuccessModal from '../../../components/common/SuccessModal';
import Cell from '../../../components/games/matching_games/Cell';
import ScaleText from '../../../components/games/matching_games/ScaleText';

class MatchingScreen extends Component {
  constructor(props) {
    super(props);
    let upperObjectsArray = [...this.props.gameData.upperObjectsArray];
    let lowerObjectsArray = [...this.props.gameData.lowerObjectsArray];
    this.shuffleArray(upperObjectsArray);
    this.shuffleArray(lowerObjectsArray);
    this.state = {
      iterationCount: 0,
      completedArray: [[], []],
      isGameOver: false,
      isNewGameStarted: true,
      selectedRow: 0,
      zIndexArray: Array(2).fill(Array(upperObjectsArray.length).fill(0)),
      upperObjectsArray,
      lowerObjectsArray,
      longestWordLower: 0,
      foundLongestLower: !this.props.gameData.isLowerLetters,
      longestWordUpper: 0,
      foundLongestUpper: !this.props.gameData.isUpperLetters,
      countLower: 0,
      countUpper: 0,
    };
  }

  componentDidUpdate() {
    if (
      this.state.iterationCount === this.props.gameData.upperObjectsArray.length
    ) {
      setTimeout(() => {
        this.gameOverSound();
        this.setState({
          isGameOver: true,
          iterationCount: 0,
        });
      }, 2000);
    }
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  gameOverSound = () => {
    if (!this.props.functionality.isMute) {
      let sound1 = new Sound(
        require('../../../assets/audio/game_success.mp3'),
        (error, sound) => {
          if (error) {
            alert('error' + error.message);
            return;
          }
          sound1.play(() => {
            sound1.release();
          });
        },
      );
    }
  };

  onSelect = (isCorrect, isUpperRow, index, dropIndex) => {
    if (isCorrect) {
      if (!this.props.functionality.isMute) {
        let sound1 = new Sound(
          require('../../../assets/audio/correct_pick.mp3'),
          (error, sound) => {
            if (error) {
              alert('error' + error.message);
              return;
            }
            sound1.play(() => {
              sound1.release();
            });
          },
        );
      }
      let modifiedCompletedArray = [...this.state.completedArray];
      if (isUpperRow) {
        modifiedCompletedArray[0].push(index);
        modifiedCompletedArray[1].push(dropIndex);
      } else {
        modifiedCompletedArray[1].push(index);
        modifiedCompletedArray[0].push(dropIndex);
      }

      this.setState({
        iterationCount: this.state.iterationCount + 1,
        completedArray: modifiedCompletedArray,
      });
    } else {
      if (!this.props.functionality.isMute) {
        let sound1 = new Sound(
          require('../../../assets/audio/incorrect_pick.mp3'),
          (error, sound) => {
            if (error) {
              alert('error' + error.message);
              return;
            }
            sound1.play(() => {
              sound1.release();
            });
          },
        );
      }
    }
  };

  setZIndices = (selectedRow, index) => {
    let zIndexArray = Array(2).fill(
      Array(this.props.gameData.upperObjectsArray.length).fill(0),
    );
    zIndexArray[selectedRow][index] = 1;
    this.setState({selectedRow, zIndexArray});
  };

  startNewGame = () => {
    let upperObjectsArray = [...this.props.gameData.upperObjectsArray];
    let lowerObjectsArray = [...this.props.gameData.lowerObjectsArray];
    this.shuffleArray(upperObjectsArray);
    this.shuffleArray(lowerObjectsArray);
    this.setState({
      completedArray: [[], []],
      isGameOver: false,
      isNewGameStarted: true,
      upperObjectsArray,
      lowerObjectsArray,
      countLower: 0,
      countUpper: 0,
    });
  };

  updateIsNewGameStarted = () => {
    this.setState({
      isNewGameStarted: false,
    });
  };

  updateLongestWordLower = wordLength => {
    let x = this.state.longestWordLower;
    let iterateFinish =
      this.state.countLower === this.state.lowerObjectsArray.length - 1;
    if (x < wordLength) {
      x = wordLength;
    }
    this.setState(state => ({
      longestWordLower: x,
      countLower: state.countLower + 1,
      foundLongestLower: iterateFinish,
    }));
  };

  updateLongestWordUpper = wordLength => {
    let x = this.state.longestWordUpper;
    let iterateFinish =
      this.state.countUpper === this.state.upperObjectsArray.length - 1;
    if (x < wordLength) {
      x = wordLength;
    }
    this.setState(state => ({
      longestWordUpper: x,
      countUpper: state.countUpper + 1,
      foundLongestUpper: iterateFinish,
    }));
  };

  render() {
    const {lowerObjectsArray, upperObjectsArray} = this.state;
    return (
      <View style={{height: '100%', width: '100%'}}>
        {this.props.gameData.isUpperLetters &&
          !this.state.foundLongestUpper &&
          upperObjectsArray.map((e, i) => (
            <ScaleText
              key={i}
              fontSize={this.props.gameData.upperFontSize}
              fontWeight={this.props.gameData.upperFontWeight}
              word={e}
              callBack={this.updateLongestWordUpper}
            />
          ))}

        {this.props.gameData.isLowerLetters &&
          !this.state.foundLongestLower &&
          lowerObjectsArray.map((e, i) => (
            <ScaleText
              key={i}
              fontSize={this.props.gameData.lowerFontSize}
              fontWeight={this.props.gameData.lowerFontWeight}
              word={e}
              callBack={this.updateLongestWordLower}
            />
          ))}

        {/* {this.props.gameData.isLowerLetters &&
          !this.state.foundLongestLower &&
          lowerObjectsArray.map((e, i) => (
            <Text
              key={i}
              onLayout={event => {
                let y = event.nativeEvent.layout.width / 0.95;
                this.setState(
                  state => {
                    let x = state.longestWordLower;
                    if (y > x) {
                      x = y;
                    }
                    return {
                      longestWordLower: x,
                    };
                  },
                  () => {
                    this.setState(m => {
                      return {
                        foundLongestLower: i == lowerObjectsArray.length - 1,
                      };
                    });
                  },
                );
              }}
              style={{
                position: 'absolute',
                fontSize: this.props.gameData.lowerFontSize,
                fontWeight: this.props.gameData.lowerFontWeight,
                color: 'transparent',
              }}>
              {lowerObjectsArray[i]}
            </Text>
          ))} */}

        <StatusBar hidden />
        <ImageBackground
          source={require('../../../assets/images/bg/matrix-1.png')}
          style={{width: '100%', height: '100%'}}>
          <View style={styles.mainContainer}>
            <View
              style={{position: 'absolute', left: 25, top: 25, zIndex: 999}}>
              <BackButton onPress={() => this.props.navigation.goBack()} />
            </View>
            <View style={styles.gameArea}>
              <View
                style={[styles.upperRow, {zIndex: 1 - this.state.selectedRow}]}>
                {[...Array(this.state.upperObjectsArray.length).keys()].map(
                  e => (
                    <View
                      key={e}
                      style={[
                        styles.upperRowSlot,
                        {zIndex: this.state.zIndexArray[0][e]},
                      ]}>
                      <Cell
                        isUpperRow={true}
                        index={e}
                        setZIndices={this.setZIndices}
                        gameObject={this.state.upperObjectsArray[e]}
                        dropIndex={this.state.lowerObjectsArray.indexOf(
                          this.props.gameData.lowerObjectsArray[
                            this.props.gameData.upperObjectsArray.indexOf(
                              this.state.upperObjectsArray[e],
                            )
                          ],
                        )}
                        offsetX={styles.mainContainer.paddingHorizontal}
                        offsetY={styles.mainContainer.paddingVertical}
                        onSelect={this.onSelect}
                        isMatchable={!this.state.completedArray[0].includes(e)}
                        isNewGameStarted={this.state.isNewGameStarted}
                        updateIsNewGameStarted={this.updateIsNewGameStarted}
                        objectsCount={this.state.upperObjectsArray.length}
                        imageUriSlice={this.props.gameData.imageUriSlice}
                        cellImageRatio={this.props.gameData.cellImageRatio}
                        isUpperLetters={this.props.gameData.isUpperLetters}
                        upperFontSize={this.props.gameData.upperFontSize}
                        upperFontColorsArray={
                          this.props.gameData.upperFontColorsArray
                        }
                        upperFontWeight={this.props.gameData.upperFontWeight}
                        longestWord={this.state.longestWordUpper}
                        foundLongest={
                          this.state.foundLongestLower &&
                          this.state.foundLongestUpper
                        }
                      />
                      <View style={styles.emptySlot} />
                    </View>
                  ),
                )}
              </View>
              <View style={[styles.lowerRow, {zIndex: this.state.selectedRow}]}>
                {[...Array(this.state.lowerObjectsArray.length).keys()].map(
                  e => (
                    <View
                      key={e}
                      style={[
                        styles.lowerRowSlot,
                        {zIndex: this.state.zIndexArray[1][e]},
                      ]}>
                      <Cell
                        isUpperRow={false}
                        index={e}
                        setZIndices={this.setZIndices}
                        gameObject={this.state.lowerObjectsArray[e]}
                        dropIndex={this.state.upperObjectsArray.indexOf(
                          this.props.gameData.upperObjectsArray[
                            this.props.gameData.lowerObjectsArray.indexOf(
                              this.state.lowerObjectsArray[e],
                            )
                          ],
                        )}
                        offsetX={styles.mainContainer.paddingHorizontal}
                        offsetY={styles.mainContainer.paddingVertical}
                        onSelect={this.onSelect}
                        isMatchable={!this.state.completedArray[1].includes(e)}
                        isNewGameStarted={this.state.isNewGameStarted}
                        updateIsNewGameStarted={this.updateIsNewGameStarted}
                        objectsCount={this.state.lowerObjectsArray.length}
                        imageUriSlice={this.props.gameData.imageUriSlice}
                        cellImageRatio={this.props.gameData.cellImageRatio}
                        isLowerLetters={this.props.gameData.isLowerLetters}
                        lowerFontSize={this.props.gameData.lowerFontSize}
                        lowerFontColorsArray={
                          this.props.gameData.lowerFontColorsArray
                        }
                        lowerFontWeight={this.props.gameData.lowerFontWeight}
                        longestWord={this.state.longestWordLower}
                        foundLongest={
                          this.state.foundLongestLower &&
                          this.state.foundLongestUpper
                        }
                      />
                      <View style={styles.emptySlot} />
                    </View>
                  ),
                )}
              </View>
            </View>

            <View style={{position: 'absolute', right: 25, top: 25}}>
              <InfoButton />
            </View>
            <View style={{position: 'absolute', right: 25, bottom: 25}}>
              <SoundButton />
            </View>
          </View>
        </ImageBackground>

        {this.state.isGameOver && (
          <SuccessModal
            startNewGame={this.startNewGame}
            navigation={this.props.navigation}
            gameIndex={this.props.gameIndex}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    functionality: state.functionality,
  };
};

export default connect(mapStateToProps)(MatchingScreen);

const styles = StyleSheet.create({
  mainContainer: {
    paddingVertical: 25,
    paddingHorizontal: 97,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameArea: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    // backgroundColor: 'green',
  },
  upperRow: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  lowerRow: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'blue',
  },
  upperRowSlot: {
    height: '80%',
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'flex-start',
  },
  lowerRowSlot: {
    height: '80%',
    flexDirection: 'column-reverse',
    flex: 1,
    alignSelf: 'flex-end',
  },
});
