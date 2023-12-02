import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, ToastAndroid, Alert } from "react-native";
import Background from "./background";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import messaging from '@react-native-firebase/messaging';
import Btn1 from "../assets/buttons/btn1";
import TextField from "./textField";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../assets/constants/colors";
import axios from "axios";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Aboutus({ navigation }) {
  const images = [
    require('../assets/images/12.jpg'),

    require('../assets/images/112.jpg'),
    require('../assets/images/13.jpg'),
    require('../assets/images/15.jpg'),
    require('../assets/images/16.jpg'),
    require('../assets/images/111.jpg'),

    // Add more image paths here
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const getFcmToken = async () => {
      try {
        const userString = await AsyncStorage.getItem('userId');
        console.log(userString)
        if (userString !== null) {
          console.log('Volunteer ID:', userString);
          AsyncStorage.setItem('volunteerid', userString)
          await messaging().registerDeviceForRemoteMessages();
          const fcmToken = await messaging().getToken();
          if (fcmToken) {
            console.log("FCM Token: ", fcmToken);
            await firestore().collection('users').doc(userString).update({ deviceID: fcmToken });
          }
          else {
            console.log("No FCM Token");
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    getFcmToken();

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => {
      clearInterval(interval);
    }
  }, []);


  return (
    <View style={{ backgroundColor: "#D5DBDB", flex: 1 }}>

      <Image
        source={images[currentImageIndex]}
        style={styles.image}></Image>
      <Text style={{ marginTop: 20, fontSize: 25, marginLeft: 60, fontFamily: "Poppins-Bold", color: '#1F4A83' }}>Whats Our Moto??</Text>
      <View style={{ marginTop: 10, marginLeft: 10, marginRight: 45, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginTop: 13, marginLeft: 10, textAlign: 'justify', fontFamily: "Poppins-Italic", color: 'black' }}>See Through My Eyes is a free app for receiving video
          support  Every day, sighted
          volunteers and professionals
          their eyes to
          solve tasks big and small to help
          blind and low-vision
          people lead independent life
        </Text>
       
      </View>
      <View style={{ marginLeft: 10, flexDirection: 'row' }}>
        <View style={{ flexDirection: 'column' }}>
          <View style={{ backgroundColor: "#1F4A83", marginLeft: 30, marginTop: 100, borderRadius: 50, width: 50, height: 50 }}>
            <MaterialIcons style={{ marginTop: 8, marginLeft: 10 }} name="call" size={30} color={'white'}></MaterialIcons>
          </View>
          <Text style={{ fontSize: 13, marginTop: 10, marginLeft: 26, fontFamily: "Poppins-SemiBold", color: 'black' }}>Free calls</Text>
        </View>
        <View style={{ flexDirection: 'column' }}>
          <View style={{ backgroundColor: '#1F4A83', marginLeft: 65, marginTop: 100, borderRadius: 50, width: 50, height: 50 }}>
            {/* <Icon name="moon-outline" size={40} style={{ marginLeft:10 , marginTop: 5 }} color={'white'} /> */}
            <MaterialCommunityIcons style={{ marginTop: 6, marginLeft: 7 }} name="hours-24" size={35} color={'white'}></MaterialCommunityIcons>
          </View>
          <Text style={{ fontSize: 13, marginLeft: 35, marginTop: 10, fontFamily: "Poppins-SemiBold", color: 'black' }}>Available 24/7</Text>
        </View>
        <View style={{ flexDirection: 'column' }}>
          {/* #15317E */}
          <View style={{ backgroundColor: '#1F4A83', marginLeft: 50, marginTop: 100, borderRadius: 50, width: 50, height: 50 }}>
            <MaterialIcons style={{ marginTop: 8, marginLeft: 10 }} name="security" size={30} color={'white'}></MaterialIcons>
          </View>
          <Text style={{ fontSize: 13, marginTop: 10, marginLeft: 40, fontFamily: "Poppins-SemiBold", color: 'black' }}>Fully Secure</Text>
        </View>
      </View>


    </View>

  )
}
const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: 400,
    height: 700,
    backgroundColor: '#2A5EE0',
  },
  image: {
    width: '100%',
    height: 220,
  }
});