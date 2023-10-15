// components/TypewriterText.js
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

const TypewriterText = ({ text, typingInterval = 100 }) => {
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setTypedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, typingInterval);

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex, text, typingInterval]);

  return <Text style={styles.text}>{typedText}</Text>;
};

const styles = StyleSheet.create({
  text: {
    marginTop:55,
    marginLeft:45,
    fontSize: 25,
    fontFamily :"Poppins-Bold",
    color:'white'
  },
});

export default TypewriterText;
