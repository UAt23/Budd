import React, { useEffect } from 'react';
import { Text, Animated, StyleSheet, TextStyle } from 'react-native';

interface AnimatedNumberProps {
  value: number;
  style?: TextStyle;
  prefix?: string;
  duration?: number;
}

export default function AnimatedNumber({ 
  value, 
  style, 
  prefix = '', 
  duration = 1000 
}: AnimatedNumberProps) {
  const animatedValue = new Animated.Value(0);
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: duration,
      useNativeDriver: true,
    }).start();

    animatedValue.addListener((v) => {
      setDisplayValue(Math.round(v.value * 100) / 100);
    });

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [value]);

  return (
    <Text style={style}>
      {prefix}{displayValue.toFixed(2)}
    </Text>
  );
} 