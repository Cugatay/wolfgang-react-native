import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef } from 'react';
import {
  Animated, Dimensions, StyleSheet, Image, Easing,
} from 'react-native';
import styled from 'styled-components/native';
import normalize from 'react-native-normalize';
import { BlurView } from 'expo-blur';

import { RootStackParamList } from '../App';

const teams = {
  villagers: {
    icon: require('../assets/villager-icon.png'),
    sizes: [48, 39],
    explaining: 'Protect Your Village and Execute the Vampires',
  },
  vampires: {
    icon: require('../assets/vampire-icon.png'),
    sizes: [40, 40],
    explaining: 'Kill Everyone With Your Teammate At Midnight',
  },
};

type winners = 'villagers' | 'vampires';

const Container = styled(Animated.View)({
  position: 'absolute',
  zIndex: 2,
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.3)',
});

const Content = styled(Animated.View)<{winner: winners}>((props: any) => ({
  width: normalize(276),
  height: normalize(372),
  borderRadius: 20,
  overflow: 'hidden',
  borderColor: props.winner === 'villagers' ? 'white' : 'black',
  borderWidth: 0.5,
//   elevation: 5,
//   backgroundColor: 'red',
}));

const Role = styled.View<{winner: winners}>((props: any) => ({
  width: normalize(132),
  height: normalize(84),
  borderRadius: 12,
  overflow: 'hidden',
  borderColor: props.winner === 'villagers' ? 'white' : 'black',
  borderWidth: 0.3,
//   elevation: 5,
//   backgroundColor: 'red',
}));

const Winner = styled.Text({
  fontSize: normalize(32),
  fontWeight: 600,
  color: 'white',
  marginTop: normalize(12),
});

const WonTheGame = styled.Text({
  fontSize: normalize(24),
  fontWeight: 300,
  color: 'white',
  marginTop: 4,
});

const MainMenuButton = styled.TouchableOpacity<{winner: winners}>((props: any) => ({
  width: normalize(200),
  height: normalize(44),
  borderRadius: 8,
  overflow: 'hidden',
  borderColor: props.winner === 'villagers' ? 'white' : 'black',
  borderWidth: 0.3,
  marginTop: normalize(28),
}));

const MainMenuText = styled.Text({
  fontSize: normalize(24),
  fontWeight: 'bold',
  color: 'white',
});

type GameScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Game'
>;

type Props = {
  navigation: GameScreenNavigationProp;
  winner: 'villagers' | 'vampires'
};

export default function Victory({ navigation, winner }: Props) {
  const animationValue = useRef(new Animated.Value(0)).current;

  const opacityInterpolate = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    easing: Easing.ease,
  });

  const marginInterpolate = animationValue.interpolate({
    inputRange: [0, 1.2],
    outputRange: [normalize(100), 0],
  });

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: 1.2,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, []);
  console.log('winner');
  console.log(winner);

  return (
    <Container style={{ opacity: opacityInterpolate }}>
      <Content style={{ marginTop: marginInterpolate }} winner={winner}>
        <BlurView intensity={100} tint={winner === 'villagers' ? 'default' : 'dark'} style={{ ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' }}>

          <Role winner={winner}>
            <BlurView intensity={100} tint={winner === 'villagers' ? 'default' : 'dark'} style={{ ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={teams[winner].icon}
                style={{
                  width: teams[winner].sizes[0],
                  height: teams[winner].sizes[1],
                }}
              />
            </BlurView>
          </Role>

          <Winner>
            {winner.charAt(0).toUpperCase()! + winner.slice(1)}
          </Winner>

          <WonTheGame>
            Won the Game
          </WonTheGame>

          <MainMenuButton winner={winner} onPress={() => navigation.navigate('Home')}>
            <BlurView intensity={100} tint={winner === 'villagers' ? 'default' : 'dark'} style={{ ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' }}>
              <MainMenuText>Main Menu</MainMenuText>
            </BlurView>
          </MainMenuButton>
        </BlurView>
      </Content>
    </Container>
  );
}
