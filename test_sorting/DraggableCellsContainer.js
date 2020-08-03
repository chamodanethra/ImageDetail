import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import DraggableCell from './DraggableCell';

export default class DraggableCellsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {variableGameObjects: []};
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.variableGameObjects !== prevState.variableGameObjects) {
      return {variableGameObjects: nextProps.variableGameObjects};
    } else return null;
  }

  render() {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          paddingHorizontal: 25,
        }}>
        {this.state.variableGameObjects.map((element, index) => (
          <View
            style={{
              flex: 1,
            }}
            key={element}>
            <DraggableCell
              gameObject={
                this.props.gameObjects[
                  Math.floor(element / this.props.objectTiers)
                ][element % this.props.objectTiers]
              }
              imageUriSlice={this.props.imageUriSlice}
              gameObjectCount={this.state.variableGameObjects.length}
              chosenIndex={null}
              position={index}
              element={element}
              environment={Math.floor(element / this.props.objectTiers)}
              onTouchSelected={this.props.onTouchSelected}
              onSelect={this.props.onSelect}
              dropZoneCoordinates={
                element < this.props.objectTiers
                  ? {
                      startX: 0,
                      startY: 0,
                      endX:
                        mainContainerDimensions.width / 2 +
                        this.props.navBarHeight,
                      endY: (mainContainerDimensions.height * 31) / 40,
                    }
                  : {
                      startX: mainContainerDimensions.width / 2,
                      startY: 0,
                      endX:
                        mainContainerDimensions.width + this.props.navBarHeight,
                      endY: (mainContainerDimensions.height * 31) / 40,
                    }
              }
              absolutePositionX={null}
              absolutePositionY={null}
              navBarHeight={this.props.navBarHeight}
            />
          </View>
        ))}
      </View>
    );
  }
}

const availableHeight = Dimensions.get('window').height;
const availableWidth = Dimensions.get('window').width;
const mainContainerDimensions = {
  height: Math.min(availableHeight, availableWidth) - 25,
  width: Math.max(availableHeight, availableWidth),
};
