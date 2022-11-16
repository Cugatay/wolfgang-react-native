import React from 'react';
import {
  StyleSheet, TouchableOpacity, TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import normalize from 'react-native-normalize';
import styled from 'styled-components/native';

const ButtonText = styled.Text({
  color: 'white',
  fontSize: normalize(24),
  fontWeight: 'bold',
});

interface Props extends TouchableOpacityProps {
    textStyle?: any;
    title: string
}

export default function GlassyButton({
  textStyle, title, style, ...props
}: Props) {
  return (
    <TouchableOpacity
      {...props}
      style={[{
        width: normalize(200),
        height: normalize(46),
        borderRadius: normalize(8),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 0.3,
        overflow: 'hidden',
      }, style]}
    >
      <LinearGradient colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)']} start={{ x: 0.5, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFillObject, { }]} />
      <ButtonText style={textStyle}>{title}</ButtonText>
    </TouchableOpacity>
  );
}
