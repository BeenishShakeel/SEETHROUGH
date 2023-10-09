// components/AnimatedText.js
import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';

const AnimatedText = ({ text }) => {
  return (
    <View>
      {text.split(' ').map((word, index) => (
        <Animatable.Text
          key={index}
          animation="fadeIn" // You can use other animation types from react-native-animatable
          duration={1000}
          delay={index * 100} // Delay each word's animation
          style={{ marginBottom: 5, fontSize: 18 }}
        >
          {word}
        </Animatable.Text>
      ))}
    </View>
  );
};

export default AnimatedText;
