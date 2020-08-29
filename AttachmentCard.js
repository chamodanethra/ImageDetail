import React from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

const {height: wHeight, width: wWidth} = Dimensions.get('window');
const MARGIN = 16;
const internalStyles = StyleSheet.create({
  card: {
    marginVertical: MARGIN,
    alignSelf: 'center',
  },
});

const AttachmentCard = ({type, y, index, buttonContainerHeight}) => {
  const offSet = index ? 60 - MARGIN : 0;
  const CARD_HEIGHT = (wWidth * 0.8 * 228) / 362 + MARGIN * 2;
  const height = wHeight - buttonContainerHeight;
  const position = Animated.subtract(index * CARD_HEIGHT, y);
  const isDisappearing = -CARD_HEIGHT;
  const isTop = 0;
  const isBottom = height - CARD_HEIGHT;
  const isAppearing = height;
  const translateY = Animated.add(
    Animated.add(
      y,
      y.interpolate({
        inputRange: [0, 0.00001 + index * CARD_HEIGHT],
        outputRange: [0, -index * CARD_HEIGHT - offSet],
        extrapolateRight: 'clamp',
      }),
    ),
    position.interpolate({
      inputRange: [isBottom, isAppearing],
      outputRange: [0, -CARD_HEIGHT / 2],
      extrapolate: 'clamp',
    }),
  );
  const scale = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.2],
    extrapolate: 'clamp',
  });
  const opacity = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.2, 1, 1, 0.2],
  });
  return (
    <Animated.View
      style={[
        internalStyles.card,
        {opacity, transform: [{translateY}, {scale}]},
      ]}
      key={index}>
      {index ? (
        <Image
          source={require('./card1.png')}
          style={{
            width: wWidth * 0.8,
            height: (wWidth * 0.8 * 228) / 362,
            alignSelf: 'center',
            resizeMode: 'contain',
          }}
        />
      ) : (
        <View
          style={[internalStyles.card, styles.CardContainer, {height: 200}]}>
          <View style={{alignItems: 'center'}}>
            <Image
              style={styles.ProfileImage}
              source={require('./avatar.jpeg')}
            />
          </View>
          <View style={styles.info}>
            <Text style={styles.iconProfile} />
            <Text style={styles.FF_Regular}>Name </Text>
            <Text style={[styles.FF_Bold, styles.FS_18]}>
              {''}
              Jhone Doe
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.iconProfile}>
              <FontAwesome name="birthday-cake" size={25} />
            </Text>
            <Text style={styles.FF_Regular}>Age </Text>
            <Text style={[styles.FF_Bold, styles.FS_18]}>
              {''}
              24
            </Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

export default AttachmentCard;
