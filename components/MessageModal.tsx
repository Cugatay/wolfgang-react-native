import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions, ScrollView, StyleSheet, Image,
} from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import normalize from 'react-native-normalize';
import { BlurView } from 'expo-blur';
import { gql, useMutation } from '@apollo/client';
import Background from './Background';
import Message from './Message';
import useStore from '../stores';

const { width, height } = Dimensions.get('window');

const SEND_MESSAGE = gql`
  mutation SendMessage($token: String!, $message: String!) {
  sendMessage(token: $token message: $message)
}
`;

const ModalContainer = styled.View({
  width: '100%',
  height: '83%',
  bottom: 0,
  position: 'absolute',
  paddingHorizontal: normalize(12),
  paddingVertical: normalize(20),
  alignItems: 'center',
  backgroundColor: 'black',
  borderTopLeftRadius: normalize(20),
  borderTopRightRadius: normalize(20),
  overflow: 'hidden',
});

const ModalLine = styled.View({
  width: 134,
  height: 3,
  backgroundColor: 'white',
  borderRadius: 100,
  marginBottom: normalize(20),
  // overflow: 'hidden',
});

const BottomContainer = styled.View({
  width: '100%',
  height: normalize(64),
  flexDirection: 'row',
  alignItems: 'center',
});

const InputContainer = styled(BlurView)({
  flex: 1,
  justifyContent: 'center',
  // alignItems: 'center',
  borderRadius: normalize(8),
  borderWidth: 0.3,
  borderColor: 'white',
  height: normalize(52),
  overflow: 'hidden',
});

const Input = styled.TextInput({
  color: 'white',
  fontSize: normalize(20),
  fontWeight: 'bold',
  paddingHorizontal: normalize(16),
  ...StyleSheet.absoluteFillObject,

});

const SendContainer = styled.TouchableOpacity({
  height: normalize(52),
  width: normalize(52),
  marginLeft: normalize(16),
  borderRadius: normalize(8),
  overflow: 'hidden',
  borderWidth: 0.3,
  borderColor: 'white',
});

interface IMessage {
  username: string;
  message: string;
  chat: 'village' | 'vampire';
}

interface Props {
    isModalVisible: boolean;
    // eslint-disable-next-line no-unused-vars
    setIsModalVisible: (newVal: boolean) => void;
    time?: 'day' | 'vote' | 'night' | 'roleSelect';
  newMessage: IMessage;
}

export default function MessageModal({
  isModalVisible, setIsModalVisible, time, newMessage,
}: Props) {
  const token = useStore((state: any) => state.token);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const scrollViewRef = useRef<any>(null);
  const [scrollOffset, setScrollOffset] = useState<undefined | number>(undefined);
  const [messageText, setMessageText] = useState('');
  const [createdMessage, setCreatedMessage] = useState<IMessage | null>(null);

  const [sendMessage] = useMutation(SEND_MESSAGE, { variables: { token, message: messageText } });

  const handleOnScroll = (event: any) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const handleScrollTo = (p: any) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  const handleSendMessage = async () => {
    const msg: IMessage = {
      username: 'You', message: messageText, chat: time === 'night' ? 'vampire' : 'village',
    };
    setCreatedMessage(msg);
    const { data } = await sendMessage();

    scrollViewRef.current?.scrollToEnd({ animated: true });

    setMessageText('');
    if (data.sendMessage === 'success') {
      setMessages([...messages, msg]);
    }

    setCreatedMessage(null);
  };

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 0);
  }, [isModalVisible]);

  useEffect(() => {
    if (newMessage) {
      setMessages([...messages, newMessage]);
    }
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 200);
  }, [newMessage]);

  return (
    <Modal
      propagateSwipe
      isVisible={isModalVisible}
      onBackdropPress={() => setIsModalVisible(false)}
      onSwipeComplete={() => setIsModalVisible(false)}
      swipeDirection="down"
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      scrollOffsetMax={100000}
      onBackButtonPress={() => setIsModalVisible(false)}
      backdropColor="rgba(0,0,0, 0.6)"
      style={{
        flex: 1, width, height, margin: 0, padding: 0, position: 'relative',
      }}
    >
      <ModalContainer>
        <Background time={time} />

        <ModalLine />

        <ScrollView
          ref={scrollViewRef}
          onScroll={handleOnScroll}
          scrollEventThrottle={16}
          style={{
            width: '100%',
          }}
        >
          {messages.slice(-25).map((message) => (
            <Message username={message.username} message={message.message} chat={message.chat} />
          ))}
          {createdMessage
            && <Message username="You" message={createdMessage?.message} loading />}
        </ScrollView>

        <BottomContainer style={{}}>
          <InputContainer intensity={100} style={{ }}>
            <Input
              onSubmitEditing={handleSendMessage}
              placeholder="Type Your Message Here"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={messageText}
              onChangeText={(t) => setMessageText(t)}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 200);
              }}
            />
          </InputContainer>
          {/* </InputContainer> */}

          <SendContainer onPress={handleSendMessage}>
            <BlurView
              intensity={100}
              style={[{ ...StyleSheet.absoluteFillObject }, {
                justifyContent: 'center',
                alignItems: 'center',
              }]}
            >
              <Image source={require('../assets/send.png')} style={{ width: normalize(32), height: normalize(29) }} />
            </BlurView>
          </SendContainer>
        </BottomContainer>
      </ModalContainer>
    </Modal>
  );
}
