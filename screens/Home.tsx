import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, Image, TouchableWithoutFeedback, Text, ActivityIndicator,
  Animated, Easing, View, Dimensions, ScrollView, TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';
import { gql, useMutation, useQuery } from '@apollo/client';
import normalize from 'react-native-normalize';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import Background from '../components/Background';
import useStore from '../stores';
import { RootStackParamList } from '../App';
import avatarImages from '../avatars';
import AvatarSelect from './AvatarSelect';

const avatar = avatarImages[25];

const Container = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const CharacterCard = styled.TouchableOpacity({
  width: normalize(200),
  height: normalize(264),
  // paddingVertical: normalize(12),
  alignItems: 'center',
  justifyContent: 'center',
});

const Username = styled.Text({
  fontSize: normalize(32),
  color: 'rgba(255, 255, 255, 0.7)',
  marginTop: 20,
});

const Win = styled.Text({
  fontSize: normalize(28),
  color: 'rgba(255, 255, 255, 0.5)',
  marginTop: normalize(38),
});

const WinCount = styled.Text({
  fontSize: normalize(28),
  color: '#12FFF1',
  marginTop: normalize(4),
});

const TapToPlay = styled(Animated.Text)({
  position: 'absolute',
  fontSize: normalize(44),
  color: 'rgba(255, 255, 255, 0.5)',
});

const MAIN_SCREEN = gql`
  query MainScreen($token: String!) {
    mainScreen(token: $token) {
      winCount
      avatar
      username
    }
  }
`;

const JOIN_GAME = gql`
  mutation JoinGame($token: String!) {
    joinGame(token: $token) {
      players {
        username
        avatar
        isAlive
      }
    }
  }
`;

interface IMainScreen {
  mainScreen: {
    winCount: number;
    avatar: number;
    username: string;
  }
}

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function Home({ navigation }: Props) {
  const logout = useStore((state: any) => state.logout);
  const updateGame = useStore((state: any) => state.updateGame);
  const token = useStore((state: any) => state.token);
  const currentAvatar = useStore((state: any) => state.currentAvatar);
  const setCurrentAvatar = useStore((state: any) => state.setCurrentAvatar);
  const setUsername = useStore((state: any) => state.setUsername);

  const [avatarSelectScreen, setAvatarSelectScreen] = useState(false);

  // const removeMessages = useStore((state: any) => state.removeMessages);

  const playButtonAnim = useRef(new Animated.Value(0)).current;

  const { data, loading, error } = useQuery<IMainScreen>(MAIN_SCREEN,
    { variables: { token } });

  const [joinGame, {
    data: gameData,
    error: gameError,
    loading: gameLoading,
  }] = useMutation(JOIN_GAME, { variables: { token } });

  useEffect(() => {
    if (data?.mainScreen.avatar !== undefined) {
      setCurrentAvatar(data.mainScreen.avatar);
      setUsername(data.mainScreen.username);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      logout();
    }

    if (gameData) {
      updateGame(gameData.joinGame);
      navigation.navigate('Game');
    }
  }, [error, gameData, gameError]);

  const handleJoinGame = () => {
    if (avatarSelectScreen) {
      setAvatarSelectScreen(false);
      return;
    }
    if (!gameLoading) {
      joinGame();

      Animated.timing(playButtonAnim, {
        toValue: -25,
        duration: 250,
        useNativeDriver: false,
      // easing: Easing.bounce,
      }).start(() => {
        Animated.timing(playButtonAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
          easing: Easing.bounce,
        }).start();
      });
    }
  };

  if (loading) {
    return (
      <Container>
        <StatusBar style="light" />
        <Background />

        <Text style={{ color: 'white' }}>Loading...</Text>
        <ActivityIndicator />
      </Container>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={handleJoinGame}>
      <Container>
        <StatusBar style="light" />
        <Background />

        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <CharacterCard onPress={() => setAvatarSelectScreen(!avatarSelectScreen)}>
            <LinearGradient colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)']} start={{ x: 0.5, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFillObject, { borderRadius: 16, borderColor: 'white', borderWidth: 0.3 }]} />

            {currentAvatar
                    && (
                    <Image
                      source={avatarImages[currentAvatar].image}
                      style={{
                        width: avatarImages[currentAvatar].sizes[0],
                        height: avatarImages[currentAvatar].sizes[1],
                      }}
                    />
                    )}
            <Username>{data?.mainScreen.username}</Username>
          </CharacterCard>

          {
            !avatarSelectScreen
              && (
              <>
                <Win>WIN</Win>
                <WinCount>{data?.mainScreen.winCount}</WinCount>

                <View style={{
                  marginTop: normalize(68), position: 'relative', width: Dimensions.get('window').width, overflow: 'visible', height: normalize(48), alignItems: 'center',
                }}
                >
                  <TapToPlay style={{ marginTop: playButtonAnim }}>TAP TO PLAY</TapToPlay>
                </View>
              </>
              )
          }
        </View>
        {
          avatarSelectScreen
          && <AvatarSelect />
        }

      </Container>
    </TouchableWithoutFeedback>
  );
}
