import React from 'react';
import {Dimensions, Image, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');
const ratio = 228 / 362;
export const CARD_WIDTH = width * 0.8;
export const CARD_HEIGHT = CARD_WIDTH * ratio;
const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
});

export default ({type}) => {
  let source;
  switch (type) {
    case 1:
      source = require('./card1.png');
      break;
    case 2:
      source = require('./card2.png');
      break;
    case 3:
      source = require('./card3.png');
      break;
    case 4:
      source = require('./card4.png');
      break;
    case 5:
      source = require('./card5.png');
      break;
    case 6:
      source = require('./card6.png');
      break;
    default:
      throw Error('Invalid card style');
  }
  return <Image source={source} style={styles.card} />;
};
