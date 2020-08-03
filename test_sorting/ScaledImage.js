import React, {Component} from 'react';
import {Image, Dimensions} from 'react-native';
export default class ScaledImage extends Component {
  constructor(props) {
    super(props);
    this.maxWidth = Math.min(120, props.width);
    this.state = {height: 50, width: 50};
  }

  componentDidMount() {
    Image.getSize(this.props.uri, (width, height) => {
      this.setState({width, height});
    });
  }

  render() {
    let verticalScaleFactor = this.props.height / this.state.height;
    let scaledHeight = this.state.height * verticalScaleFactor;
    let scaledWidth = this.state.width * verticalScaleFactor;
    if (this.state.width > this.maxWidth) {
      let horizontalScaleFactor = this.maxWidth / this.state.width;
      scaledWidth *= horizontalScaleFactor;
      scaledHeight *= horizontalScaleFactor;
    }

    return (
      <Image
        source={{uri: this.props.uri}}
        style={{
          height: scaledHeight,
          width: scaledWidth,
          // backgroundColor: 'blue',
          alignSelf: 'center',
        }}
      />
    );
  }
}

const availableHeight = Dimensions.get('window').height;
const availableWidth = Dimensions.get('window').width;
const mainContainerDimensions = {
  height: Math.min(availableHeight, availableWidth) - 25,
  width: Math.max(availableHeight, availableWidth),
};
