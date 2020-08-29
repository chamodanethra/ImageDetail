import React, {Fragment, useState, useRef} from 'react';
import {Text, Button, View, Animated, StatusBar} from 'react-native';

import styles from './styles';

import AttachmentFlatList from './AttachmentFlatList';

const AttachmentsContainer = props => {
  const [buttonContainerHeight, setButtonContainerHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(60);

  return (
    <Fragment>
      <StatusBar hidden />
      <View style={{height: 60, width: '100%', backgroundColor: '#C182D3'}} />
      <View style={[styles.Container, {zIndex: 2}]}>
        <AttachmentFlatList {...{buttonContainerHeight, headerHeight}} />
      </View>
      <View
        style={{backgroundColor: 'white'}}
        onLayout={event => {
          let {height} = event.nativeEvent.layout;
          setButtonContainerHeight(height);
        }}>
        <View style={styles.immButtonBox}>
          <Button style={styles.immBtn_full} title="Add" />
        </View>
      </View>
    </Fragment>
  );
};

export default AttachmentsContainer;
