import { gql, useSubscription } from '@apollo/client';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert, Dimensions, Text,
} from 'react-native';
import normalize from 'react-native-normalize';
import styled from 'styled-components/native';
import MessageButton from '../components/MessageButton';
import { RootStackParamList } from '../App';
import Background from '../components/Background';
import RoleSelect from '../components/RoleSelect';
import TimeComponent from '../components/TimeComponent';
import UserCard, { IShownRole } from '../components/UserCard';
import Victory from '../components/Victory';
import useStore from '../stores';
import MessageModal from '../components/MessageModal';

const Container = styled.View({
  flex: 1,
  paddingTop: normalize(32),
  alignItems: 'center',
});

const MainContainer = styled.View({
  flex: 1,
  width: Dimensions.get('window').width,
  alignItems: 'center',
  marginTop: '4%',
});

const UserContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: '98%',
  position: 'relative',
  height: '88%',
  minHeight: normalize(400),
});

const BottomContainer = styled.KeyboardAvoidingView({
  width: '100%',
  height: normalize(60),
  paddingVertical: '1.5%',
  paddingHorizontal: '7%',
  marginBottom: 8,
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  bottom: 0,
});

const SUBSCRIBE_GAME = gql`
subscription GameUpdated($token: String!) {
  gameUpdated(token: $token) {
    time
    winner
    players {
      username
      avatar
      isAlive
    }
  }
}
`;

const SUBSCRIBE_MESSAGE = gql`
subscription PlayerSentMessage($token: String!) {
  playerSentMessage(token: $token) {
      username
      message
      chat
    }
  }
`;

const SUBSCRIBE_VOTE = gql`
subscription PlayerVoted($token: String!) {
  playerVoted(token: $token) {
    player_username
    target_username
  }
}
`;

export interface IPlayer {
      username: string;
      avatar: number;
      isAlive: boolean;
}

interface IGame {
    players: IPlayer[];
    time?: 'day' | 'vote' | 'night' | 'roleSelect';
    winner? : 'villagers' | 'vampires';
}

export interface IVote {
    player_username: string;
    target_username: string;
}

type GameScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Game'
>;

type Props = {
  navigation: GameScreenNavigationProp;
};

export default function Game({ navigation }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [votes, setVotes] = useState<IVote[]>([]);
  const [protectedUser, setProtectedUser] = useState('');
  const [shownRole, setShownRole] = useState<null | IShownRole>(null);

  const token: string = useStore((state: any) => state.token);
  const changeRole = useStore((state: any) => state.changeRole);
  const game = useStore<IGame | null>((state: any) => state.game);
  const updateGame = useStore((state: any) => state.updateGame);

  const { data } = useSubscription<{gameUpdated: IGame}>(SUBSCRIBE_GAME,
    { variables: { token } });

  const { data: messageData } = useSubscription(SUBSCRIBE_MESSAGE,
    { variables: { token } });

  const { data: voteData } = useSubscription<{playerVoted: IVote}>(SUBSCRIBE_VOTE,
    { variables: { token } });

  useEffect(() => {
    changeRole({ role: null, otherVampire: null });
  }, []);

  useEffect(
    () => navigation.addListener('beforeRemove', (e) => {
      if (!game?.winner) {
        e.preventDefault();

        Alert.alert(
          'Do you want to leave?',
          'Are you sure you want to leave the game?',
          [
            { text: "Don't leave", style: 'cancel', onPress: () => {} },
            {
              text: 'Leave',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
          ],
        );
      }
    }),
    [navigation, game?.winner],
  );

  useEffect(() => {
    if (data/* && !data?.gameUpdated.winner */) {
      if (game?.time !== data.gameUpdated.time) {
        setVotes([]);
        setProtectedUser('');
        setShownRole(null);
      }
      console.log(data.gameUpdated);
      updateGame(data.gameUpdated);
    }
  }, [data]);

  useEffect(() => {
    if (voteData?.playerVoted) {
      const existVote = votes.find(
        (v) => v.player_username === voteData.playerVoted.player_username,
      );

      if (!existVote) {
        setVotes([...votes, voteData.playerVoted]);
      } else {
        const filteredVotes = votes.filter(
          (v) => v.player_username !== voteData.playerVoted.player_username,
        );

        const newVotes = voteData.playerVoted.target_username
          ? [...filteredVotes, voteData.playerVoted] : filteredVotes;

        setVotes(newVotes);
      }
    }
  }, [voteData]);

  return (
    <Container>
      <StatusBar style="light" />

      <Background time={game?.time || 'day'} />

      {
        game?.time === 'roleSelect'
        && (
          <RoleSelect />
        )
      }

      {
        game?.winner
      && <Victory navigation={navigation} winner={game.winner} />
      }

      <TimeComponent time={game?.time} />

      <MainContainer>
        <UserContainer>
          {game?.players.map((player, idx) => (
            <UserCard
              key={player.username}
              player={player}
              index={idx + 1}
              died={!player.isAlive}
              avatarNumber={player.avatar}
              votes={votes.filter((v) => v.target_username === player.username)}
              setVotes={setVotes}
              protectedUser={protectedUser}
              setProtectedUser={setProtectedUser}
              shownRole={shownRole}
              setShownRole={(u: IShownRole | null) => setShownRole(u)}
              vote={game.players.findIndex(
                (p) => p.username
                === votes.find((v) => v.player_username === player.username)?.target_username,
              ) + 1}
              time={game.time}
            />
          ))}
        </UserContainer>

        <BottomContainer>
          <MessageButton
            setIsModalVisible={setIsModalVisible}
            lastMessage={messageData?.playerSentMessage}
          />
        </BottomContainer>
      </MainContainer>

      {
          game?.time !== 'roleSelect'
        && (
        <MessageModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          time={game?.time}
          newMessage={messageData?.playerSentMessage}
        />
        )
      }
    </Container>
  );
}
