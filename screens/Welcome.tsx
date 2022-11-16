import React from 'react';
import {
  StyleSheet, View, Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import normalize from 'react-native-normalize';
import { ScrollView } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import Background from '../components/Background';
import GlassyButton from '../components/GlassyButton';
import { RootStackParamList } from '../App';

type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

const GlassCardContainer = styled.View({
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  paddingTop: Constants.statusBarHeight + normalize(48),
  paddingBottom: normalize(48),
  paddingLeft: normalize(24),
  paddingRight: normalize(24),
  justifyContent: 'center',
  alignItems: 'center',
});

const GlassCard = styled.View({
  flex: 1,
  maxHeight: 710,
  borderRadius: normalize(24),
  borderColor: 'white',
  borderWidth: 0.3,
  // justifyContent: 'center',
  alignItems: 'center',
  // padding: '0 20px',
  position: 'relative',
  padding: '28px 20px',
});

const GlassBackground = styled(LinearGradient)(
  { ...StyleSheet.absoluteFillObject }, { borderRadius: normalize(24) },
);

const DotsContainer = styled.View({
  position: 'absolute',
  width: Dimensions.get('window').width,
  bottom: normalize(12),
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
});

const Dot = styled.View<{main?: boolean}>(({ main }: any) => ({
  // width: main ? normalize(10) : normalize(8),
  // height: main ? normalize(10) : normalize(8),
  width: normalize(8),
  height: normalize(8),
  borderRadius: 50,
  opacity: main ? 1 : 0.5,
  backgroundColor: 'white',
  marginHorizontal: normalize(4),
}));

const Logo = styled.Image({
  marginBottom: normalize(32),
  // maxWidth: '100%',
  // width: '100%',
  // width: 100,
});

const Title = styled.Text({
  color: 'white',
  fontWeight: 'bold',
  fontSize: normalize(40),
  marginBottom: normalize(20),
  textAlign: 'center',
});

const Subtitle = styled.Text({
  color: 'white',
  fontSize: normalize(20),
  textAlign: 'center',
});

const SubtitleWithSpace = styled(Subtitle)({
  marginTop: normalize(12),
});

const Bold = styled.Text({
  fontWeight: 'bold',
});

const data = [
  () => (
    <>
      <Logo source={require('../assets/vote.png')} />
      <Title>Vamping</Title>

      <Subtitle>
        Welcome to the Vamping!
      </Subtitle>
      <Subtitle>
        This is a simple game that you can play online.
      </Subtitle>

      <SubtitleWithSpace>
        So let me explain the basics of this game
      </SubtitleWithSpace>
    </>
  ),
  () => (
    <>
      <Logo source={require('../assets/exclamation.png')} />
      <Title>Purpose of Players</Title>

      <Subtitle>
        There are two different teams in every game: Vampires and Villagers
      </Subtitle>
      <SubtitleWithSpace>
        Vampires must kill the whole village
      </SubtitleWithSpace>

      <SubtitleWithSpace>
        Villagers have to find the Vampires in the game and have to execute them
      </SubtitleWithSpace>
    </>
  ),
  () => (
    <>
      <Logo source={require('../assets/roles.png')} style={{ }} />
      <Title>Roles</Title>

      <Subtitle>
        At the beginning of the game, you will get a role. And these roles are:
      </Subtitle>

      <SubtitleWithSpace>
        <Bold>Doctor:</Bold>
        {' '}
        You can protect people
      </SubtitleWithSpace>
      <Subtitle>
        <Bold>Seer:</Bold>
        {' '}
        You can investigate roles
      </Subtitle>
      <Subtitle>
        <Bold>Villager:</Bold>
        {' '}
        Ingenuous players
      </Subtitle>
      <Subtitle>
        <Bold>Vampire:</Bold>
        {' '}
        Enemies of all villagers, they can kill unprotected villagers
      </Subtitle>
    </>
  ),
  () => (
    <>
      <Logo source={require('../assets/times.png')} />
      <Title>Times</Title>

      <Subtitle>
        There are three times in each game:
        {' '}
        <Bold>Day,</Bold>
        {' '}
        <Bold>Vote</Bold>
        {' '}
        and
        {' '}
        <Bold>Night</Bold>
      </Subtitle>

      <SubtitleWithSpace>
        In
        {' '}
        <Bold>Day,</Bold>
        {' '}
        you can discuss who are the vampires and seer can informate villagers.
      </SubtitleWithSpace>

      <SubtitleWithSpace>
        In
        {' '}
        <Bold>Vote,</Bold>
        {' '}
        every player can vote someone to execute the player.
      </SubtitleWithSpace>

      <SubtitleWithSpace>
        In
        {' '}
        <Bold>Night;</Bold>
        {' '}
        seer, doctor and vampires can use their skills
      </SubtitleWithSpace>
    </>
  ),
  () => (
    <>
      <Logo source={require('../assets/done.png')} />
      <Title>And That’s It</Title>

      <Subtitle>
        Now, you are ready to save your village.
      </Subtitle>

      <SubtitleWithSpace>
        The only thing that you have to do is joining the game!
      </SubtitleWithSpace>
    </>
  ),
];

export default function Welcome({ navigation }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Background />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={200}
        decelerationRate="fast"
        pagingEnabled
      >
        {
        data.map((CardData, index) => (
          <GlassCardContainer
            key={index}
          >
            <GlassCard>
              <GlassBackground
                colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                <CardData />

                {
                  index === data.length - 1
                    ? (
                      <>
                        <GlassyButton style={{ marginTop: 28 }} title="Login" onPress={() => navigation.navigate('Login')} />

                        <GlassyButton style={{ marginTop: 16 }} title="Register" onPress={() => navigation.navigate('Register')} />
                      </>
                    ) : null
                }
              </ScrollView>

              <DotsContainer>
                {data.map((_, dotIndex) => (
                  <Dot key={dotIndex} main={index === dotIndex} />
                ))}
              </DotsContainer>

            </GlassCard>
          </GlassCardContainer>
        ))
      }
      </ScrollView>
    </View>
  );
}
