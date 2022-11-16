import React, { useEffect, useRef } from 'react';
import {
  Animated, Image, StyleSheet, Text, View,
} from 'react-native';
import styled from 'styled-components/native';
import normalize from 'react-native-normalize';
import { LinearGradient } from 'expo-linear-gradient';
import { gql, useMutation } from '@apollo/client';
import { IPlayer, IVote } from '../screens/Game';
import useStore from '../stores';
import Background from './Background';
import avatarImages from '../avatars';

const diedImage = require('../assets/died.png');

const roleImages = {
  villager: {
    icon: require('../assets/villager-icon.png'),
    sizes: [48, 39],
  },
  seer: {
    icon: require('../assets/seer-icon.png'),
    sizes: [48, 34],
  },
  doctor: {
    icon: require('../assets/doctor-icon.png'),
    sizes: [43, 49],
  },
  vampire: {
    icon: require('../assets/vampire-icon.png'),
    sizes: [40, 40],
  },
};
// require(`../assets/${died ? 'died' : 'avatar'}.png`)

const Container = styled.TouchableOpacity({
  width: '31%',
  height: '31%',
  // height: '31%',
  // minHeight: normalize(140),
  justifyContent: 'space-evenly',
  alignItems: 'center',
  borderRadius: normalize(16),
  marginHorizontal: '1%',
  marginBottom: '3%',
  position: 'relative',
  // borderRadius: normalize(12),
  borderColor: 'white',
  borderWidth: 0.3,
  overflow: 'hidden',
});

const AvatarContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
});

const UserAvatar = styled(Animated.Image)({
  width: '100%',
  height: '100%',
  position: 'relative',
  // marginBottom: normalize(12),
});

const Username = styled.Text({
  color: 'white',
  fontSize: normalize(18),
  fontWeight: 'bold',
  width: '90%',
  textAlign: 'center',
  // backgroundColor: 'red',
});

const Vote = styled(Animated.View)({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  position: 'absolute',
  zIndex: 2,
  // borderColor: 'white',
  // borderWidth: 0.3,
  justifyContent: 'center',
  alignItems: 'center',
  top: 0,
  left: 0,
});

const VoteCount = styled.Text({
  fontSize: normalize(40),
  fontWeight: 'bold',
  color: 'white',
});

const UserVoted = styled(Animated.View)({
  width: normalize(76),
  height: normalize(28),
  bottom: -10,
  position: 'absolute',
  borderRadius: 4,
  borderWidth: 0.3,
  borderColor: 'white',
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
});

const VotedText = styled.Text({
  fontSize: normalize(22),
  fontWeight: 'bold',
  color: 'white',
});

const VOTE_PLAYER = gql`
mutation Vote($token: String!, $targetUsername: String!) {
  vote(token: $token targetUsername: $targetUsername)
}
`;

const PROTECT_PLAYER = gql`
  mutation Protect($token: String!, $targetUsername: String!) {
    protectUser(token: $token targetUsername: $targetUsername)
  }
`;

const SHOW_ROLE = gql`
  mutation ShowRole($token: String!, $targetUsername: String!) {
    showRole(token: $token targetUsername: $targetUsername) {
      username
      role
    }
  }
`;

export interface IShownRole {
  username: string;
  role: string;
}

interface Props {
    player: IPlayer;
    index: number;
    votes: IVote[];
    vote?: number;
    time?: 'day' | 'vote' | 'night' | 'roleSelect';
    died: boolean;
    protectedUser: string;
    avatarNumber: number;
    // eslint-disable-next-line no-unused-vars
    setProtectedUser: (u: string) => void
    // eslint-disable-next-line no-unused-vars
    setVotes: (u: IVote[]) => void
    shownRole: IShownRole | null;
    // eslint-disable-next-line no-unused-vars
    setShownRole: (u: IShownRole | null) => void
}

export default function UserCard({
  player, index, votes, vote, time, died, protectedUser,
  setProtectedUser, shownRole, setShownRole, setVotes, avatarNumber,
}: Props) {
  const avatar = avatarImages[avatarNumber];
  const {
    role, token, otherVampire, username,
  } = useStore(
    (store: any) => ({
      role: store.role,
      otherVampire: store.otherVampire,
      token: store.token,
      username: store.username,
    }),
  );

  const votedValue = useRef(new Animated.Value(0)).current;
  const givenVoteValue = useRef(new Animated.Value(0)).current;

  const avatarOpacity = votedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.1],
    extrapolate: 'clamp',
  });

  const takenVoteOpacity = votedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const givenVoteOpacity = givenVoteValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const [voteUserMutation] = useMutation(VOTE_PLAYER, {
    variables: {
      token,
      targetUsername: player.username,
    },
  });

  const voteUser = () => {
    setVotes([...votes, { player_username: username, target_username: player.username }]);
    voteUserMutation();
  };

  const [protectPlayer] = useMutation(PROTECT_PLAYER, {
    variables: {
      token,
      targetUsername: player.username,
    },
  });

  const [showRole] = useMutation(SHOW_ROLE, {
    variables: {
      token,
      targetUsername: player.username,
    },
  });

  const handleClick = () => {
    if (time === 'night') {
      if (role === 'vampire') {
        voteUser();
      } else if (role === 'doctor') {
        protectPlayer();
        setProtectedUser(player.username !== protectedUser ? player.username : '');
      } else if (role === 'seer' && !shownRole) {
        showRole().then(({ data }) => {
          if (data?.showRole) {
            setShownRole(data.showRole);
          }
        });
      }
    } else if (time === 'vote') {
      voteUser();
    }
  };

  useEffect(() => {
    if (votes.length !== 0 || protectedUser === player.username
       || shownRole?.username === player.username) {
      Animated.timing(votedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(votedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [votes, protectedUser, shownRole]);

  useEffect(() => {
    if (vote !== 0) {
      Animated.timing(givenVoteValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(givenVoteValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [vote]);

  return (
    <Container onPress={handleClick}>
      <LinearGradient colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)']} start={{ x: 0.5, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFillObject]} />

      <AvatarContainer
        style={[died ? {
          width: normalize(72),
          height: normalize(82),
        } : {
          width: normalize(avatar.sizes[0] / 1.7),
          height: normalize(avatar.sizes[1] / 1.7),
        }]}
      >
        <UserAvatar
          source={died ? diedImage : avatar.image}
          style={{ opacity: avatarOpacity /* 0.1 */ }}
        />

        <UserVoted style={{ opacity: givenVoteOpacity }}>
          <View style={[StyleSheet.absoluteFillObject, { opacity: 0.9 }]}>
            <Background time={time} />
          </View>
          {
            vote !== 0
          && <VotedText>{`${vote}.`}</VotedText>
          }
        </UserVoted>

      </AvatarContainer>

      <Vote style={{ opacity: takenVoteOpacity /* 0.1 */ }}>
        <LinearGradient colors={time === 'night' ? ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)'] : ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0)']} start={{ x: 0.5, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFillObject]} />
        {
            votes.length !== 0
           && <VoteCount>{votes.length}</VoteCount>
          }
        { protectedUser === player.username
            && <Image source={require('../assets/shield.png')} style={{ width: normalize(40), height: normalize(50) }} /> }

        { shownRole?.username === player.username
            && (
            <Image
              source={roleImages[shownRole.role].icon}
              style={{
                width: roleImages[shownRole.role].sizes[0],
                height: roleImages[shownRole.role].sizes[1],
              }}
            />
            ) }
      </Vote>

      <Username style={otherVampire === player.username ? { color: 'red' } : {}} numberOfLines={1} ellipsizeMode="tail">{`${index}. ${player.username}`}</Username>

    </Container>
  );
}
