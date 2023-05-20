import React from "react";
import {View, ImageBackground, StyleSheet} from 'react-native';


export default function Background({children}){
   return(
    <View style={styles.container}>
        <ImageBackground source={require("../assets/images/new4.jpg")} style={styles.backgroundImage}>
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
      width:'100%',
      height: "100%"
    },
  });
