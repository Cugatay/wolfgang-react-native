import React from 'react';
import {
  View, Image, StyleSheet, TouchableOpacity,
} from 'react-native';
import normalize from 'react-native-normalize';
import { LinearGradient } from 'expo-linear-gradient';
import { gql, useMutation } from '@apollo/client';
import avatarImages from '../avatars';
import Background from '../components/Background';
import useStore from '../stores';
import GlassyButton from '../components/GlassyButton';

const CHANGE_AVATAR = gql`
  mutation ChangeAvatar($token: String!, $avatar: Int!) {
    changeAvatar(token: $token avatar: $avatar)
  } 
`;

export default function AvatarSelect() {
  const token = useStore((state: any) => state.token);
  const currentAvatar = useStore((state: any) => state.currentAvatar);
  const setCurrentAvatar = useStore((state: any) => state.setCurrentAvatar);
  const logout = useStore((state: any) => state.logout);

  const [changeAvatar] = useMutation(CHANGE_AVATAR);

  const handleChangeAvatar = (i: number) => {
    if (currentAvatar !== i) {
      setCurrentAvatar(i);
      changeAvatar({ variables: { token, avatar: i } });
    }
  };

  return (
    <View style={{
      flex: 1,
      alignContent: 'center',
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingBottom: 20,
    }}
    >
      {/* <Background /> */}

      {/* <GlassyButton
        onPress={logout}
        title="Log out"
        style={{
          position: 'absolute', right: normalize(12), top: normalize(40), width: normalize(100), height: normalize(32), borderRadius: normalize(4),
        }}
        textStyle={{ fontSize: 20 }}
      /> */}

      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
      >
        {
          Array.from(Array(25).keys()).map((i) => (
            <TouchableOpacity
              key={i}
              style={[{
                width: '18%', height: normalize(70), margin: '1%', justifyContent: 'center', alignItems: 'center', borderRadius: 16, borderColor: 'white', borderWidth: 0.3, overflow: 'hidden',
              }]}
              onPress={() => handleChangeAvatar(i + 1)}
            >
              <LinearGradient colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)']} start={{ x: 0.5, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
              <View style={[{ opacity: 0.8 }, StyleSheet.absoluteFillObject, currentAvatar === i + 1 ? { backgroundColor: '#1a56d6' } : {}]} />

              <Image
                source={avatarImages[i + 1].image}
                style={{
                  width: avatarImages[i + 1].sizes[0] / 3,
                  height: avatarImages[i + 1].sizes[1] / 3,
                }}
              />
            </TouchableOpacity>
          ))
        }
      </View>
    </View>

  );
}
