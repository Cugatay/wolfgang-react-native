import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useRef } from 'react';
import {
  Dimensions, Animated, Image,
} from 'react-native';
import normalize from 'react-native-normalize';
import styled from 'styled-components/native';
import useStore from '../stores';
import Background from './Background';

const Container = styled(Animated.View)({
  position: 'absolute',
  zIndex: 2,
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  justifyContent: 'center',
  alignItems: 'center',
});

const YourRole = styled(Animated.Text)({
  color: 'white',
  fontSize: normalize(40),
  fontWeight: 'bold',
  marginBottom: normalize(24),
  // marginTop: -20,
});

const RolePic = styled(Animated.View)({
  width: normalize(132),
  height: normalize(84),
  borderWidth: 5,
  borderColor: 'white',
  borderRadius: normalize(12),
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: normalize(8),
});

const Role = styled(Animated.Text)({
  color: 'white',
  fontSize: normalize(28),
  fontWeight: 500,
  marginBottom: normalize(24),
});

const Explaining = styled(Animated.Text)({
  color: 'white',
  fontSize: normalize(20),
  width: '95%',
  fontWeight: 300,
  paddingHorizontal: normalize(30),
  textAlign: 'center',
});

const GameStarting = styled(Animated.Text)({
  color: 'white',
  position: 'absolute',
  // bottom: 32,
  left: 0,
  fontSize: normalize(20),
  fontWeight: 100,
  width: Dimensions.get('window').width,
  textAlign: 'center',
});

const roles = {
  villager: {
    icon: require('../assets/villager-icon.png'),
    sizes: [48, 39],
    explaining: 'Protect Your Village and Execute the Vampires',
  },
  seer: {
    icon: require('../assets/seer-icon.png'),
    sizes: [48, 34],
    explaining: 'You Can See One Player’s Role At Midnight',
  },
  doctor: {
    icon: require('../assets/doctor-icon.png'),
    sizes: [43, 49],
    explaining: 'You Can Protect Someone At Midnight',
  },
  vampire: {
    icon: require('../assets/vampire-icon.png'),
    sizes: [40, 40],
    explaining: 'Kill Everyone With Your Teammate At Midnight',
  },
};

const MY_ROLE = gql`
  query MyRole($token: String!) {
    myRole(token: $token) {
      role
      otherVampire
    }
  }
`;

type rolesType = 'villager' | 'seer' | 'doctor' | 'vampire';

interface MyRole {
  myRole: {
    role: rolesType;
    otherVampire?: string;
  };
}

export default function RoleSelect() {
  const token = useStore((store: any) => store.token);
  const changeRole = useStore((store: any) => store.changeRole);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const {
    data, loading, error, refetch,
  } = useQuery<MyRole>(MY_ROLE, { variables: { token } });

  const containerOpacity = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
  });

  const yourRoleOpacity = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: [0, 1],
  });

  const rolePicOpacity = animatedValue.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
  });

  const roleOpacity = animatedValue.interpolate({
    inputRange: [0, 220],
    outputRange: [0, 1],
  });

  const explainingOpacity = animatedValue.interpolate({
    inputRange: [0, 240],
    outputRange: [0, 1],
  });

  const gameStartingOpacity = animatedValue.interpolate({
    inputRange: [0, 240],
    outputRange: [0, 1],
  });

  const gameStartingBottom = animatedValue.interpolate({
    inputRange: [0, 240],
    outputRange: [0, 32],
  });

  const marginTop = animatedValue.interpolate({
    inputRange: [0, 240],
    outputRange: [0, normalize(-20)],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (!loading) {
      Animated.timing(animatedValue, {
        toValue: 240,
        duration: 5000,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }).start();
        }, 1000);
      });
    }
  }, [loading]);

  useEffect(() => {
    if (data?.myRole) {
      changeRole(data.myRole);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Container style={{ opacity: containerOpacity }}>
      <Background time="day" />

      {
      !loading && !error
      && (
      <>
        <YourRole style={{ marginTop, opacity: yourRoleOpacity }}>Your Role Is:</YourRole>

        <RolePic style={{ opacity: rolePicOpacity }}>
          <Image
            source={roles[data?.myRole.role!].icon}
            style={{
              width: roles[data?.myRole.role!].sizes[0],
              height: roles[data?.myRole.role!].sizes[1],
            }}
          />
        </RolePic>

        <Role
          style={{ opacity: roleOpacity }}
        >
          {data?.myRole.role.charAt(0).toUpperCase()! + data?.myRole.role.slice(1)}
        </Role>

        <Explaining
          style={{ opacity: explainingOpacity }}
        >
          {roles[data?.myRole.role!].explaining}
        </Explaining>

        <GameStarting
          style={{ opacity: gameStartingOpacity, bottom: gameStartingBottom }}
        >
          Game is about to start
        </GameStarting>
      </>
      )
    }

    </Container>
  );
}
