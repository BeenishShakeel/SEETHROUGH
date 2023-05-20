import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, ToastAndroid } from "react-native";
import Background from "./background";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Btn1 from "../assets/buttons/btn1";
import Back4 from "./back4";
import TextField from "./textField";
import { Gif } from 'react-native-gif'
import Icon from "react-native-vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { colors } from "../assets/constants/colors";
import Sound from 'react-native-sound';
import * as Animatable from 'react-native-animatable';
import Voice from '@react-native-voice/voice';
import axios, { all } from "axios";
import Tts from 'react-native-tts';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
const projectId = 'voicebot-387211';
const agentId = '881a6865-855f-4014-aabd-23513a3ff494';
const languageCode = 'en'
const location = 'us-central1'
const sessionId = Math.random().toString(36).substring(7);
function detectIntentText(query, lat, long) {
   axios.post("http://192.168.18.55:8000/get-response", {query: query, location: {latitude: lat, longitude: long }})
   .then(response => {
      console.log(response.data);
      if(response.data) {
         Tts.speak(response.data.responses[0].text.text[0]);
      }
   })
   .catch(err => console.error(err));
}

export default function Open({ navigation }) {
   const [lat, setLat] = useState();
   const [long, setLong] = useState();
   const[lang,setlang] = useState("")
   const[result,setResult] = useState("")
   const[starttext,setstarttext] = useState("To start videocall speak videocall")
   const [audioData, setAudioData] = useState(null);
   const isFocused = useIsFocused();
   useEffect(() => {
      if(isFocused){ 
         console.log("called"); 
         getUserId()
        } 
      Voice.onSpeechStart = onSpeechStartHandler;
      Voice.onSpeechEnd = onSpeechEndHandler;
      Voice.onSpeechResults = onSpeechResultsHandler;
      var hasLocationPermission = requestLocationPermission();
      if(hasLocationPermission){
         getLocation();
      }
      return () => {
         Voice.destroy().then(Voice.removeAllListeners);
      }
   }, [isFocused])

   const onSpeechStartHandler = (e) => {
      console.log('start handler');
   }

   const onSpeechEndHandler = (e) => {
      console.log('end handler');
   }

   const onSpeechResultsHandler = (e) => {
      console.log(e);
      if (e.value.length > 0) {
         detectIntentText(e.value[0], lat, long);
      }
   }
   const requestLocationPermission = async () => {
      var allow = false;
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'App Camera Permission',
            message:
              'App needs access to your location ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the location');
          allow = true;
        } else {
          console.log('location permission denied');
        }
        return allow;
      } catch (err) {
        console.warn(err);
      }
    };
    async function getUserId() {
      try {
        const userString = await AsyncStorage.getItem('userId');
        if (userString !== null) {
          console.log('User ID:', userString);
          database().ref(`/blind/${userString}`).once("value").then(snapshot => {
            let language = snapshot.val().language
            AsyncStorage.setItem('language', language).then(() => {
              Promise.resolve(); // wrap in Promise.resolve()
            });
          }) 
        const condition = await AsyncStorage.getItem('language')
        if(condition === "English")
        {
         english()
        }
        if(condition === "Urdu")
        {
          urdu()
        }
        if(condition === "French")
        {
          french()
        }
        } 
        else {
          navigation.navigate("blindsignup")
          console.log('User ID not found.');
        }
      } catch (error) {
        console.error(error);
      }
    
    }
    const english = async () =>
    {
      Tts.setDefaultRate(0.4);
      Tts.speak("Welcome")
      Tts.speak("To start Video call speak Video call")
      Tts.speak("To start GPS voice guidance speak Voice guidance")
      Tts.speak("For offline help speak offline help")
        
    }
    const urdu = async () =>
    {
      const options = {
        method: 'GET',
        url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
        params: {text:"welcome , To start Video call speak Video call , To start GPS voice guidance speak Voice guidance , For offline help speak offline help ", to: 'ur', from: 'en'},
        headers: {
          'X-RapidAPI-Key': 'bac0b4a01dmsh637f968c8035314p1dc8b0jsn281bde6eebf7',
          'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
        }
      };
      const sound2 = new Sound(require('./media14.mp3'),
  (error, sound) => {
    if (error) {
      alert('error' + error.message);
      return;
    }
    sound2.play(() => {
      sound2.setSpeed(0.4);
      sound2.release();
    });
  });
     
  
      
  
    }
    const french = async () =>
    {
      const options = {
        method: 'GET',
        url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
        params: {text:"Welcome , To start Video call speak Video call , To start GPS voice guidance speak Voice guidance , For offline help speak 'offline help'", to: 'fr', from: 'en'},
        headers: {
          'X-RapidAPI-Key': 'bac0b4a01dmsh637f968c8035314p1dc8b0jsn281bde6eebf7',
          'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
        }
      };
      axios.request(options).then(function (response) {
        const result = response.data;
        const text = result.translated_text[result.to];
          setlang(text);
          Tts.setDefaultRate(0.4);
          Tts.speak(text);
          console.log(lang);
      
        //console.log(response.data);
      })
    }
  
   const getLocation = () =>{
      Geolocation.getCurrentPosition(
         (position) => {
           console.log(position);
           setLat(position.coords.latitude);
           setLong(position.coords.longitude);
         },
         (error) => {
           // See error code charts below.
           console.log(error.code, error.message);
         },
         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
     );
   }
   // <Animatable.View style={{ backgroundColor: 'white', marginTop: 390, height: 365, width: 360, borderTopLeftRadius: 60, borderTopRightRadius: 60 }} animation="fadeInUpBig" >
   //          <Text style={{ marginTop: 100, fontSize: 25, marginLeft: 110, fontFamily: "Poppins-Bold", color: '#368BC1' }} onPress={() => { Voice.start() }}>Listening....</Text>
   //          <Animatable.Image
   //             style={{ marginLeft: 140, borderRadius: 10, marginTop: 20, width: 75, height: 75 }}
   //             source={require('../assets/images/google.png')} animation="bounceIn" duration={10000}

   //          />

   //          <Icon name="arrow-forward-outline" style={{ marginTop: 30 }} marginLeft={280} size={45} color={'#368BC1'} onPress={() => navigation.navigate('splashScreen')} />
   //       </Animatable.View>
   return (
   
      <Back4>
         
</Back4>
     
   )
}