import React, {useState,  useEffect} from "react";
import {View, Text, StyleSheet ,ImageBackground, Image ,ToastAndroid} from "react-native";
import Background from "./background";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Btn1 from "../assets/buttons/btn1";
import Back4  from "./back4";
import axios from 'axios';

import TextField from "./textField";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../assets/constants/colors";
import * as Animatable from 'react-native-animatable';
import Sound from 'react-native-sound';
import { io } from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Tts from 'react-native-tts';
import { Button } from "react-native-paper";
import { useAnimatedGestureHandler } from "react-native-reanimated";

export default function BlindSignup({navigation}){
    const [hasRun, setHasRun] = useState(false);
    const [id,setid] = useState('')
    const[language,setlanguage] = useState('')
    const[audio,setaudio] = useState('')
    const [phoneNumber , setPhoneNumber] = useState('');
    useEffect(() => {
      
       // sendAkt();
       play1()
              
       },[]);
       const play1 = (audioURL) => {
        const sound1 = new Sound(require('./media112.mp3'),
        (error, sound) => {
          if (error) {
            alert('error' + error.message);
            return;
          }
          sound1.play(() => {
            sound1.release();
            play2();
          });
        });
       }     
       const play2 = (audioURL) => {
        const sound2 = new Sound(require('./media111.mp3'),
        (error, sound) => {
          if (error) {
            alert('error' + error.message);
            return;
          }
          sound2.play(() => {
            sound2.setSpeed(0.4);
            sound2.release();
          start1();
          
          });
        });
       }
       const start1 = async() =>
               {
                Voice.onSpeechStart = onSpeechStartHandler;
                Voice.onSpeechEnd = onSpeechEndHandler;
                Voice.onSpeechResults = onSpeechResultsHandler2;
                startRecording();
                return () => {
                  Voice.destroy().then(Voice.removeAllListeners);
                }
            
              
               }
              
      
  const startRecording = async () => {
    try {
      console.log("start")
      await Voice.start('en-Us')
    } catch (error) {
      console.log("error raised", error)
    }
    stopRecording();
    console.log("stop")
  }
  const stopRecording = async () => {
    try {
      await Voice.stop()
      // Voice.onSpeechResults = onSpeechResultsHandler2;
    } catch (error) {
      console.log("error raised", error)
    }
  }
  const onSpeechStartHandler = (e) => {
    console.log("starttterrr handler==>>>", e)
  }
  const onSpeechEndHandler = (e) => {
    // setLoading(false)
    console.log("stop handler", e)
   // Voice.onSpeechResults = onSpeechResultsHandler2;
  }
const onSpeechResultsHandler2 = async(e) => {
  console.log(e.value.toString())
  if(e.value.toString() === "Urdu" || e.value.toString() === "English" || e.value.toString() === "French")
  {
    let text3 = e.value.toString();
    await AsyncStorage.setItem('language', text3);
    setlanguage(text3)
    setinfo()
  }
else
  {
 let text1 = e.value.toString();
 const phoneNumber = text1.split(',')[0].trim();
 const phoneNumberWithoutSpaces = phoneNumber.replace(/\s/g, ''); // replace all spaces with an empty string
 const phoneNumberLength = phoneNumberWithoutSpaces.length;
 console.log(phoneNumberLength)
 if(phoneNumberLength == 11)
 {
  setPhoneNumber(phoneNumberWithoutSpaces);
  await AsyncStorage.setItem('phonenumber', phoneNumberWithoutSpaces);
  console.log(phoneNumberWithoutSpaces)
 const options = {
  method: 'GET',
  url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
  params: {text: "which language do you speak", to: 'ur', from: 'en'},
  headers: {
    'X-RapidAPI-Key': 'bac0b4a01dmsh637f968c8035314p1dc8b0jsn281bde6eebf7',
    'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
  }
};

let isTtsFinished = false;
let everCalled = 1;
let once = 1;
Tts.addEventListener('tts-finish', () => {
  isTtsFinished = true;
});
// axios.request(options).then( function (response) {
//   const result = response.data;
//   const text = result.translated_text[result.to];
//   Tts.setDefaultRate(0.5);
//   Tts.speak(text);
// });
// while (!isTtsFinished) {
//   await new Promise(resolve => setTimeout(resolve, 100));
// }
Tts.speak("Which language do you speak?");
isTtsFinished = false;
while (!isTtsFinished) {
  await new Promise(resolve => setTimeout(resolve, 100));

}
const sound2 = new Sound(require('./media12.mp3'),
(error, sound) => {
  if (error) {
    alert('error' + error.message);
    return;
  }
  sound2.play(() => {
    sound2.release();
  });
});
setTimeout(() => {

    start1()

  }, 2000);
  }
  else{

    const sound2 = new Sound(require('./114.mp3'),
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
 

setTimeout(() => {
const sound3 = new Sound(require('./1.mp3'),
(error, sound) => {
  if (error) {
    alert('error' + error.message);
    return;
  }
  sound3.play(() => {
    sound3.setSpeed(0.4);
    sound3.release();
    start1()
  });
});
},5000)
  

  }
}
}
  async function setinfo()
  {
    const random1 = Math.random().toString(36).substring(2, 7);
    const random2 = Math.random().toString(36).substring(2, 7);
    const userId = `${random1}-${random2}`;
        setid(userId);
        const language1= await AsyncStorage.getItem('language');
        const phone= await AsyncStorage.getItem('phonenumber');
        console.log(id)
        console.log(phone)
        console.log(language1)
    database().ref(`/blind/${userId}`).
 set({phonenumber:phone, language:language1 }).
 then(
     ()=> {
         ToastAndroid.show("Account Updated Successfully!", ToastAndroid.SHORT)
          setUserId(userId);
         setTest(true)
         navigation.navigate("MyProfile")
     }
 ).catch((error)=> ToastAndroid.show(error.message, ToastAndroid.SHORT))
  }
  async function setUserId(userId) {
    try {
      const userString = JSON.stringify(userId);
      await AsyncStorage.setItem('userId', userString);
      console.log('User ID saved successfully.');
     navigation.navigate("open")
    } catch (error) {
      console.error(error);
    }
  }
  //onPress={() => navigation.navigate('splashScreen')}
  // const  setuserid = (async() => 
  // {
  //   console.log("hy helloooooo")
  //   console.log(id);
  //   await AsyncStorage.setItem("uid", id)
  // })
    return(

        <Back4>

       
        
  </Back4>
    )}