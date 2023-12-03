import React, { useState, useEffect } from "react";
import { View, ImageBackground, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Back5({ children, navigation }) {
  const [buttonVisible, setButtonVisible] = useState(true);

  const handleSignUpPress = () => {
    navigation.navigate('writtensignup');
  };

  const renderButton = () => {
    if (!buttonVisible) {
      return null;
    }

    return (
      <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUpPress}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={require("../assets/images/gh.gif")} style={styles.backgroundImage}>
        {renderButton()}
      </ImageBackground>
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 16,
    right: 5,
    height: 43,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15
  },
  buttonText: {
    color: "#1F4A83",
    fontWeight: "bold",
    fontSize: 16,
  },
});
