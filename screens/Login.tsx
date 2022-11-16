import React, { useState } from 'react';
import { Image, KeyboardAvoidingView } from 'react-native';
import normalize from 'react-native-normalize';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { gql } from '@apollo/client';
import Background from '../components/Background';
import GlassyButton from '../components/GlassyButton';
import client from '../apollo-client';

import { RootStackParamList } from '../App';
import useStore from '../stores';

const Container = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const StyledInput = styled.TextInput({
  width: normalize(280),
  fontSize: normalize(20),
  fontWeight: 'bold',
  color: 'white',
  borderBottomWidth: 1,
  borderBottomColor: 'white',
  paddingBottom: normalize(8),
});

const InfoText = styled.Text({
  fontSize: normalize(16),
  fontWeight: 'bold',
  marginTop: 20,
  color: 'white',
});

const DecoratedText = styled.Text({
  textDecoration: 'underline',
  textDecorationColor: 'white',
});

const ErrorText = styled.Text({
  color: 'rgb(255, 0, 0)',
  fontSize: normalize(14),
  width: normalize(280),
  marginTop: normalize(12),
  fontWeight: 500,
});

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username password: $password)
  }
`;

interface LoginValue {
  login: string;
}

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function Login({ navigation }: Props) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const login = useStore((state: any) => state.login);

  const handleLogin = async () => {
    setError(null);
    try {
      const { data } = await client.mutate<LoginValue>({
        mutation: LOGIN,
        variables: { username, password },
      });
      login(data?.login);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Container>
      <Background />

      <KeyboardAvoidingView style={{ alignItems: 'center' }}>
        <Image source={require('../assets/vote.png')} style={{ marginBottom: normalize(40) }} />

        <StyledInput onChangeText={(value) => setUsername(value)} placeholder="Username" placeholderTextColor="rgba(255, 255, 255, 0.6)" />

        <StyledInput onChangeText={(value) => setPassword(value)} placeholder="Password" secureTextEntry placeholderTextColor="rgba(255, 255, 255, 0.6)" style={{ marginTop: normalize(32) }} />
        <ErrorText>{error}</ErrorText>

        <GlassyButton title="Login" style={{ marginTop: normalize(40) }} onPress={handleLogin} />
        <InfoText>
          Don’t Have an Account?
          {' '}
          <DecoratedText onPress={() => navigation.navigate('Register')}>Register</DecoratedText>
        </InfoText>
      </KeyboardAvoidingView>
    </Container>
  );
}
