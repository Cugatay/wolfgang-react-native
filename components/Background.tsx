import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

interface Props {
  time?: 'day' | 'vote' | 'night' | 'roleSelect';
}

const positions = {
  default: {
    start: { x: 0.5, y: -0.4 },
    end: { x: 0.5, y: 1.4 },
  },
  roleSelect: {
    start: { x: 0.5, y: 0.2 },
    end: { x: 0.5, y: 1.6 },
  },
  day: {
    start: { x: 0.5, y: 0.2 },
    end: { x: 0.5, y: 1.6 },
  },
  vote: {
    start: { x: 0.5, y: -0.4 },
    end: { x: 0.5, y: 1.6 },
  },
  night: {
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
};

const StyledLinearGradient = styled(LinearGradient)({ ...StyleSheet.absoluteFillObject });

export default function Background({ time }: Props) {
  const color = time === 'night' ? ['#2D3775', '#6B2D75'] : ['#5E6ED7', '#9d32ad'];
  const position = time ? positions[time] : positions.default;

  return (
    <StyledLinearGradient colors={color} start={position.start} end={position.end} />
  );
}
