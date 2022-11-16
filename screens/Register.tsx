import React, { useState } from 'react';
import { Image } from 'react-native';
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

const REGISTER = gql`
  mutation Register($username: String!, $password: String!, $email: String!) {
    register(username: $username password: $password email: $email)
  }
`;

interface RegisterValue {
  register: string;
}

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

export default function Login({ navigation }: Props) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const login = useStore((state: any) => state.login);

  const handleRegister = async () => {
    setError(null);
    try {
      const { data } = await client.mutate<RegisterValue>({
        mutation: REGISTER,
        variables: { username, password, email },
      });
      login(data?.register);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Container>
      <Background />

      <Image source={require('../assets/vote.png')} style={{ marginBottom: normalize(40) }} />

      <StyledInput onChangeText={(value) => setUsername(value)} placeholder="Username" placeholderTextColor="rgba(255, 255, 255, 0.6)" />

      <StyledInput onChangeText={(value) => setPassword(value)} placeholder="Password" secureTextEntry placeholderTextColor="rgba(255, 255, 255, 0.6)" style={{ marginTop: normalize(32) }} />

      <StyledInput onChangeText={(value) => setEmail(value)} placeholder="Email" placeholderTextColor="rgba(255, 255, 255, 0.6)" style={{ marginTop: normalize(32) }} />
      <ErrorText>{error}</ErrorText>

      <GlassyButton title="Register" style={{ marginTop: normalize(40) }} onPress={handleRegister} />
      <InfoText>
        Have an Account?
        {' '}
        <DecoratedText onPress={() => navigation.navigate('Register')}>Log In</DecoratedText>
      </InfoText>
    </Container>
  );
}
