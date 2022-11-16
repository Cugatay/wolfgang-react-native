import React from 'react';
import { StyleSheet } from 'react-native';
import normalize from 'react-native-normalize';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

const MessageContainer = styled.View<{me?: boolean, loading?: boolean}>((props: any) => ({
  paddingTop: normalize(8),
  paddingLeft: normalize(12),
  paddingBottom: normalize(8),
  paddingRight: normalize(52),
  borderWidth: 0.3,
  borderColor: 'white',
  overflow: 'hidden',
  borderRadius: normalize(12),
  minHeight: normalize(72),
  alignItems: 'center',
  marginBottom: normalize(12),
  alignSelf: props.me ? 'flex-end' : 'flex-start',
  flexDirection: props.me ? 'row-reverse' : 'row',
  maxWidth: '90%',
  opacity: props.loading ? 0.5 : 1,
}));

const UserAvatar = styled.Image({
  width: normalize(56),
  height: normalize(56),
  marginRight: 0,
});

const TextContainer = styled.View<{me?: boolean}>((props: any) => ({
  marginHorizontal: normalize(8),
  alignItems: props.me ? 'flex-end' : 'flex-start',
}));

const Username = styled.Text({
  color: 'white',
  fontWeight: 'bold',
  fontSize: normalize(20),
});

const MessageText = styled.Text<{me?: boolean}>((props: any) => ({
  color: 'white',
  fontSize: normalize(19),
  marginTop: 2,
  textAlign: props.me ? 'right' : 'left',
}));

interface Props {
    username: string;
    message: string;
    chat?: 'village' | 'vampire';
    loading?: boolean;
}

export default function Message({
  username, message, chat, loading,
}: Props) {
  const chatColors = chat === 'vampire'
    ? ['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0)'] : ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)'];

  const me = username === 'You';

  return (
    <MessageContainer me={me} loading={loading}>
      <LinearGradient
        colors={chatColors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFillObject, { borderRadius: normalize(12) }]}
      />

      <UserAvatar source={require('../assets/avatar.png')} />
      <TextContainer me={me}>
        <Username>{username}</Username>
        <MessageText me={me}>{message}</MessageText>
      </TextContainer>
    </MessageContainer>
  );
}
