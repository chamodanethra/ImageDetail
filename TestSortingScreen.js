import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  StatusBar,
  NativeModules,
} from 'react-native';

import DraggableCell from './test_sorting/DraggableCell';
import DraggableCellsContainer from './test_sorting/DraggableCellsContainer';

class TestSortingScreen extends Component {
  constructor(props) {
    super(props);
    this.gameObjects = [
      props.gameData.objectCategories.gameObjectsLeftCategory,
      props.gameData.objectCategories.gameObjectsRightCategory,
    ];
    this.objectTiers = this.gameObjects[0].length;

    let randomArray = [];
    for (let i = 0; i < this.objectTiers * 2; i++) {
      randomArray.push(i);
    }
    this.shuffleArray(randomArray);

    this.state = {
      iterationCount: 0,
      completedArray: [],
      completedAdjustedReleasedCoordinatesXArray: [],
      completedAdjustedReleasedCoordinatesYArray: [],
      activeEnvironment: 0,
      keyArray: [],
      randomArray,
      isGameOver: false,
    };
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  onSelectCell = (
    isCorrect,
    adjustedReleasedCoordinateX,
    adjustedReleasedCoordinateY,
    position,
  ) => {
    if (isCorrect) {
      let modifiedCompletedArray = [...this.state.completedArray];
      let modifiedcompletedAdjustedReleasedCoordinatesXArray = [
        ...this.state.completedAdjustedReleasedCoordinatesXArray,
      ];
      let modifiedcompletedAdjustedReleasedCoordinatesYArray = [
        ...this.state.completedAdjustedReleasedCoordinatesYArray,
      ];

      modifiedCompletedArray.push(position);
      modifiedcompletedAdjustedReleasedCoordinatesXArray.push(
        adjustedReleasedCoordinateX,
      );
      modifiedcompletedAdjustedReleasedCoordinatesYArray.push(
        adjustedReleasedCoordinateY,
      );

      if (this.state.iterationCount !== this.objectTiers * 2) {
        let newKey = !this.state.iterationCount
          ? 1
          : [...this.state.keyArray].pop() + 1;
        let modifiedKeyArray = [...this.state.keyArray];
        modifiedKeyArray.push(newKey);
        this.setState({
          completedArray: [...modifiedCompletedArray],
          completedAdjustedReleasedCoordinatesXArray: [
            ...modifiedcompletedAdjustedReleasedCoordinatesXArray,
          ],
          completedAdjustedReleasedCoordinatesYArray: [
            ...modifiedcompletedAdjustedReleasedCoordinatesYArray,
          ],
          keyArray: [...modifiedKeyArray],
          iterationCount: this.state.iterationCount + 1,
        });
      }
    }
  };

  onMoveItem = (
    isCorrect,
    adjustedReleasedCoordinateX,
    adjustedReleasedCoordinateY,
    chosenIndex,
  ) => {
    let value = this.state.completedArray[chosenIndex];
    let modifiedCompletedArray = [...this.state.completedArray];
    let modifiedcompletedAdjustedReleasedCoordinatesXArray = [
      ...this.state.completedAdjustedReleasedCoordinatesXArray,
    ];
    let modifiedcompletedAdjustedReleasedCoordinatesYArray = [
      ...this.state.completedAdjustedReleasedCoordinatesYArray,
    ];

    modifiedCompletedArray.push(value);
    modifiedcompletedAdjustedReleasedCoordinatesXArray.push(
      adjustedReleasedCoordinateX,
    );
    modifiedcompletedAdjustedReleasedCoordinatesYArray.push(
      adjustedReleasedCoordinateY,
    );

    if (chosenIndex > -1) {
      modifiedCompletedArray.splice(chosenIndex, 1);
      modifiedcompletedAdjustedReleasedCoordinatesXArray.splice(chosenIndex, 1);
      modifiedcompletedAdjustedReleasedCoordinatesYArray.splice(chosenIndex, 1);
    }

    let modifiedKeyArray = [...this.state.keyArray];
    let newKey = [...modifiedKeyArray].pop() + 1;
    modifiedKeyArray.push(newKey);
    modifiedKeyArray.splice(chosenIndex, 1);

    this.setState({
      completedArray: [...modifiedCompletedArray],
      completedAdjustedReleasedCoordinatesXArray: [
        ...modifiedcompletedAdjustedReleasedCoordinatesXArray,
      ],
      completedAdjustedReleasedCoordinatesYArray: [
        ...modifiedcompletedAdjustedReleasedCoordinatesYArray,
      ],
      keyArray: [...modifiedKeyArray],
    });
  };

  onTouchSelected = chosenIndex => {
    this.setState({
      activeEnvironment:
        chosenIndex === -1
          ? null
          : this.state.completedArray[chosenIndex] >= this.objectTiers
          ? 1
          : 0,
    });
  };

  getRemainingGameObjects(randomArray, completedArray) {
    return randomArray.filter(e => !completedArray.includes(e));
  }

  startNewGame = () => {
    let randomArray = [];
    for (let i = 0; i < this.objectTiers * 2; i++) {
      randomArray.push(i);
    }
    this.shuffleArray(randomArray);
    this.setState({
      iterationCount: 0,
      completedArray: [],
      completedAdjustedReleasedCoordinatesXArray: [],
      completedAdjustedReleasedCoordinatesYArray: [],
      activeEnvironment: 0,
      keyArray: [],
      randomArray,
      isGameOver: false,
    });
  };

  render() {
    let remainingArray = this.getRemainingGameObjects(
      this.state.randomArray,
      this.state.completedArray,
    );

    return (
      <View>
        <StatusBar hidden />
        <ImageBackground
          source={{uri: `${this.props.gameData.backgroundImage}`}}
          style={{width: '100%', height: '100%'}}>
          <View style={styles.mainContainer}>
            <View style={styles.gameArea}>
              <View style={{flex: 31, flexDirection: 'row'}}>
                <View
                  className={'left-side-environment'}
                  style={{
                    zIndex: this.state.activeEnvironment ? 1 : 2,
                    flex: 1,
                  }}>
                  <View
                    style={{
                      position: 'absolute',
                      zIndex: 6,
                      width: '100%',
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}>
                    {this.state.completedArray.map(
                      (chosen, index) =>
                        chosen < this.objectTiers && (
                          <DraggableCell
                            key={this.state.keyArray[index]}
                            gameObject={
                              /* Contains each single animal already sorted in the deep sea environment  */
                              this.gameObjects[
                                Math.floor(chosen / this.objectTiers)
                              ][chosen % this.objectTiers]
                            }
                            imageUriSlice={this.props.gameData.imageUriSlice}
                            chosenValue={chosen}
                            chosenIndex={index}
                            onSelect={this.onMoveItem}
                            onTouchSelected={this.onTouchSelected}
                            environment={0}
                            dropZoneCoordinates={{
                              startX: 0,
                              startY: 0,
                              endX:
                                mainContainerDimensions.width / 2 +
                                this.props.navBarHeight,
                              endY: (mainContainerDimensions.height * 31) / 40,
                            }}
                            absolutePositionX={
                              this.state
                                .completedAdjustedReleasedCoordinatesXArray[
                                index
                              ]
                            }
                            absolutePositionY={
                              this.state
                                .completedAdjustedReleasedCoordinatesYArray[
                                index
                              ]
                            }
                            areAllObjectsSorted={
                              this.state.iterationCount ===
                              this.state.randomArray.length
                            }
                            navBarHeight={this.props.navBarHeight}
                          />
                        ),
                    )}
                  </View>
                </View>
                <View
                  className={'right-side-environment'}
                  style={{
                    zIndex: this.state.activeEnvironment ? 2 : 1,
                    flex: 1,
                  }}>
                  <View
                    style={{
                      position: 'absolute',
                      zIndex: 6,
                      width: '100%',
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}>
                    {this.state.completedArray.map(
                      (chosen, index) =>
                        chosen >= this.objectTiers && (
                          <DraggableCell /* Contains each single animal already sorted in the deep sea environment  */
                            key={this.state.keyArray[index]}
                            gameObject={
                              this.gameObjects[
                                Math.floor(chosen / this.objectTiers)
                              ][chosen % this.objectTiers]
                            }
                            imageUriSlice={this.props.gameData.imageUriSlice}
                            chosenValue={chosen}
                            chosenIndex={index}
                            onSelect={this.onMoveItem}
                            onTouchSelected={this.onTouchSelected}
                            environment={1}
                            dropZoneCoordinates={{
                              startX: mainContainerDimensions.width / 2,
                              startY: 0,
                              endX:
                                mainContainerDimensions.width +
                                this.props.navBarHeight,
                              endY: (mainContainerDimensions.height * 31) / 40,
                            }}
                            absolutePositionX={
                              this.state
                                .completedAdjustedReleasedCoordinatesXArray[
                                index
                              ]
                            }
                            absolutePositionY={
                              this.state
                                .completedAdjustedReleasedCoordinatesYArray[
                                index
                              ]
                            }
                            areAllObjectsSorted={
                              this.state.iterationCount ===
                              this.state.randomArray.length
                            }
                            navBarHeight={this.props.navBarHeight}
                          />
                        ),
                    )}
                  </View>
                </View>
              </View>
              <View style={{flex: 9, width: '70%'}}>
                <View style={[styles.DraggableCellContainer, {zIndex: 3}]}>
                  <DraggableCellsContainer /* Contains 3 animals at most which need to be sorted  */
                    iterationCount={this.state.iterationCount}
                    variableGameObjects={remainingArray.slice(
                      0,
                      Math.min(3, remainingArray.length),
                    )}
                    gameObjects={this.gameObjects}
                    objectTiers={this.objectTiers}
                    onTouchSelected={this.onTouchSelected}
                    onSelect={this.onSelectCell}
                    imageUriSlice={this.props.gameData.imageUriSlice}
                    navBarHeight={this.props.navBarHeight}
                  />
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingBottom: 25,
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

  DraggableCellContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C4C4C4',
    borderRadius: 8,
    shadowColor: '#727272',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
});

const availableHeight = Dimensions.get('window').height;
const availableWidth = Dimensions.get('window').width;
const mainContainerDimensions = {
  height: Math.min(availableHeight, availableWidth) - 25,
  width: Math.max(availableHeight, availableWidth),
};

export default TestSortingScreen;
