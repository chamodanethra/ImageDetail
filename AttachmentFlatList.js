import React, {useRef, useState} from 'react';
import {Animated, Dimensions, FlatList, View, TextInput} from 'react-native';
import {Button} from 'react-native-paper';
import Svg, {Circle} from 'react-native-svg';

import AttachmentCard from './AttachmentCard';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const useLazyRef = initializer => {
  const ref = useRef();
  if (ref.current === undefined) {
    ref.current = initializer();
  }
  return ref.current;
};

const DIMENSION_WIDTH = Dimensions.get('screen').width;
const DIMENSION_HEIGHT = Dimensions.get('window').height;
const cards = Array.from({length: 1000}, (item, index) => {
  return {index, url: index};
});

const AttachmentFlatList = ({buttonContainerHeight, headerHeight}) => {
  const y = useLazyRef(() => new Animated.Value(0));
  const z = useLazyRef(() => new Animated.Value(-60));
  const offsetY = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const onScroll = useLazyRef(() =>
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {y},
          },
        },
      ],
      {
        useNativeDriver: true,
        listener: event => {
          if (
            offsetY.current > event.nativeEvent.contentOffset.y &&
            !isVisible &&
            offsetY.current > 60
          ) {
            setIsVisible(true);
            searchAnimation();
          }
          if (
            offsetY.current + 50 < event.nativeEvent.contentOffset.y &&
            offsetY.current > DIMENSION_HEIGHT
          ) {
            // setIsVisible(false);
            searchReverseAnimation();
          }
          if (offsetY.current >= 0 && offsetY.current < DIMENSION_HEIGHT) {
            searchAnimation();
            setIsVisible(true);
          }
          offsetY.current = event.nativeEvent.contentOffset.y;
        },
      },
    ),
  );
  const searchAnimation = () => {
    Animated.timing(z, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setSearchText('');
      setSearchTextVisible(true);
    });
  };
  const searchReverseAnimation = () => {
    setSearchText('');
    setSearchTextVisible(false);
    Animated.timing(z, {
      toValue: -60,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
    });
  };
  const [buttonVisible, setButtonVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchTextVisible, setSearchTextVisible] = useState(false);
  // useEffect(() => new Array(50000).fill(0).forEach((v, i) => console.log(i)));
  return (
    <View>
      {/* <Animated.View
        style={[
          {backgroundColor: 'red', flex: 1},
          {transform: [{translateY: Animated.subtract(0, y)}]},
        ]}>
        <Svg height={150} width="100%">
          <Circle
            cx={DIMENSION_WIDTH / 2}
            cy={`-${898 - 150 + 2}`}
            r="898.5"
            fill={'#C182D3'}
            stroke={'#C182D3'}
            strokeWidth="2"
          />
        </Svg>
      </Animated.View> */}
      {/* <Animated.View
        style={{
          height: 60,
          width: DIMENSION_WIDTH,
          backgroundColor: '#C182D3',
          position: 'absolute',
          transform: [{translateY: Animated.subtract(0, y)}],
        }}
      /> */}
      {isVisible && (
        <Animated.View
          style={{
            height: 60,
            width: DIMENSION_WIDTH,
            backgroundColor: '#C182D3',
            position: 'absolute',
            transform: [{translateY: z}],
          }}>
          {searchTextVisible && (
            <View
              style={{
                backgroundColor: '#C182D3',
                height: '80%',
                width: '80%',
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  borderWidth: 2,
                  height: 40,
                  borderRadius: 20,
                  width: buttonVisible ? '70%' : '100%',
                  borderColor: 'grey',
                  alignItems: 'center',
                }}>
                <TextInput
                  style={{
                    height: 40,
                    width: '100%',
                    textAlignVertical: 'auto',
                    textAlign: 'left',
                    color: 'black',
                    marginLeft: 20,
                  }}
                  placeholder={`${cards.length} files`}
                  onChangeText={text => {
                    setSearchText(text);
                    setButtonVisible(text.length !== 0);
                  }}
                  value={searchText}
                />
              </View>
              {buttonVisible && (
                <Button
                  onPress={() => {
                    setButtonVisible(false);
                    setSearchText('');
                  }}
                  // title={'Cancel'}
                >
                  {'Cancel'}
                </Button>
              )}
            </View>
          )}
        </Animated.View>
      )}
      <AnimatedFlatList
        scrollEventThrottle={16}
        bounces={false}
        {...{onScroll}}
        data={cards}
        renderItem={({index, item: {url}}) => (
          <AttachmentCard
            {...{
              index,
              url,
              buttonContainerHeight,
              y,
            }}
          />
        )}
        style={{
          transform: [
            {
              scale: z.interpolate({
                inputRange: [-60, 0],
                outputRange: [
                  1,
                  (DIMENSION_HEIGHT -
                    60 -
                    60 -
                    16 / 2 -
                    buttonContainerHeight) /
                    (DIMENSION_HEIGHT - 60 - buttonContainerHeight),
                ],
              }),
            },
            {translateY: Animated.divide(Animated.add(60, z), 2)},
          ],
        }}
        keyExtractor={item => `${item.index}`}
      />
    </View>
  );
};

export default AttachmentFlatList;
