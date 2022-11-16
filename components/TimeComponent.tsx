import React, { useEffect, useRef } from 'react';
import {
  Animated,
} from 'react-native';
import normalize from 'react-native-normalize';
import styled from 'styled-components/native';

const Container = styled.View({
  width: 328,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
});

const Icon = styled(Animated.Image)({
  width: normalize(46),
  height: normalize(52),
});

const Line = styled.View({
  width: '100%',
  borderBottomWidth: 3,
  borderBottomColor: 'rgba(255, 255, 255, 0.5)',
  marginTop: normalize(76),
});

const AbsoluteLine = styled(Animated.View)({
//   width: `${30}%`,
  borderBottomWidth: 3,
  borderBottomColor: 'white',
  position: 'absolute',
  left: 0,
  bottom: 0,
});

type times = 'day' | 'vote' | 'night' | 'roleSelect' | undefined;

interface Props {
    time: times
}

export default function TimeComponent({ time }: Props) {
  const dayValue = useRef(new Animated.Value(0)).current;
  const voteValue = useRef(new Animated.Value(0)).current;
  const nightValue = useRef(new Animated.Value(0)).current;

  const lineWidth = useRef(new Animated.Value(328)).current;

  const widthInterpolate = lineWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 328],
    extrapolate: 'clamp',
  });

  const changeValues = (newTime: times) => {
    Animated.timing(dayValue, {
      toValue: newTime === 'day' || newTime === 'roleSelect' || !newTime ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    Animated.timing(voteValue, {
      toValue: newTime === 'vote' ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    Animated.timing(nightValue, {
      toValue: newTime === 'night' ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    changeValues(time);

    const seconds = {
      day: 45,
      vote: 15,
      night: 30,
      roleSelect: 0,
    };

    Animated.timing(lineWidth, {
      toValue: 1,
      duration: 10,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(lineWidth, {
        toValue: 0,
        duration: 1000 * seconds[time || 'roleSelect'],
        useNativeDriver: false,
      }).start();
    });
  }, [time]);

  return (
    <Container>
      <Icon source={require('../assets/day-icon.png')} style={{ position: 'absolute', opacity: dayValue }} />
      <Icon source={require('../assets/vote-icon.png')} style={{ position: 'absolute', opacity: voteValue }} />
      <Icon source={require('../assets/night-icon.png')} style={{ position: 'absolute', opacity: nightValue }} />

      <Line />
      <AbsoluteLine style={{ width: widthInterpolate }} />
    </Container>
  );
}
