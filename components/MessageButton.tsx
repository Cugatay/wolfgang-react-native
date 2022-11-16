import React from 'react';
import { StyleSheet, Text } from 'react-native';
import styled from 'styled-components/native';
import normalize from 'react-native-normalize';
import { BlurView } from 'expo-blur';

const MessageContainer = styled.TouchableOpacity({
  width: '100%',
  height: normalize(52),
  //   borderWidth: 0.7,
  //   borderColor: 'white',
  borderRadius: normalize(8),
  overflow: 'hidden',
  borderWidth: 0.4,
  borderColor: 'white',
});

const StyledBlur = styled(BlurView)({
  ...StyleSheet.absoluteFillObject,
  //   justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: normalize(20),
  flexDirection: 'row',
});

const ChatIcon = styled.Image({
  width: normalize(28),
  height: normalize(28),
  marginRight: normalize(8),
});

const UsernameText = styled.Text({
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
});

const MessageText = styled.Text({
  color: 'white',
  fontSize: 18,
  fontWeight: 300,
});

interface Props {
    // eslint-disable-next-line no-unused-vars
    setIsModalVisible: (newBool: boolean) => void;
    lastMessage?: {
      username: string;
      message: string;
    }
}

export default function MessageButton({ setIsModalVisible, lastMessage }: Props) {
  return (
    <MessageContainer onPress={() => setIsModalVisible(true)}>
      <StyledBlur intensity={100}>
        <ChatIcon source={require('../assets/chat-icon.png')} />

        <Text ellipsizeMode="tail" numberOfLines={1} style={{ flex: 1 }}>
          <UsernameText>{lastMessage?.username ? `${lastMessage?.username}: ` : 'No Message Has Sent Yet'}</UsernameText>
          <MessageText>{lastMessage?.message}</MessageText>
        </Text>
      </StyledBlur>
    </MessageContainer>
  );
}
