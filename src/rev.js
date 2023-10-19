import React, { useState , useEffect , useRef } from 'react';
import {View, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet , Image ,ToastAndroid} from "react-native";
import Voice from '@react-native-voice/voice';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Tts from 'react-native-tts';
import axios from 'axios';
import open from '../src/open';

export default function Rev({navigation}){
    const [review, setreview] = useState(0);
    const[language,setlangauge] = useState(0)
    const[rate,setrate] = useState(0)
    useEffect(() => {
      getUserId()    
      }, []);
     
      
   
      
    
      async function getUserId() {
        try {
          const userString = await AsyncStorage.getItem('userId');
          if (userString !== null) {
            console.log('User ID:', userString);
            firestore().collection('blind').doc(userString).get().then(querySnapshot => {
              console.log("Blind's data: ", querySnapshot[0].data());
              AsyncStorage.setItem("language", querySnapshot[0].data().language);
            });
            const condition = await AsyncStorage.getItem('language')
            if (condition === "English") {
              english()
            }
            if (condition === "Urdu") {
              urdu()
            }
            if (condition === "French") {
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
  
    
    const urdu = (audioURL) => {
      const options = {
        method: 'GET',
        url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
        params: { text: "Our Volunteers are working for you with their heart your opinion is important . Speak your opinion about them after beep sound", to: 'ur', from: 'en' },
        headers: {
          'X-RapidAPI-Key': 'bac0b4a01dmsh637f968c8035314p1dc8b0jsn281bde6eebf7',
          'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
        }
      };
      axios.request(options).then(function (response) {
        const result = response.data;
        const text = result.translated_text[result.to];
    
        Tts.setDefaultRate(0.4);
        Tts.speak(text);
        Tts.addEventListener('tts-finish', () => {
          start();
        });
  
  
      })
      

       }
       const french = (audioURL) => {
        const options = {
          method: 'GET',
          url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
          params: { text: "our Volunteers are working for you with their heart your opinion is important . Speak your opinion about Volunteer after beep sound", to: 'fr', from: 'en' },
          headers: {
            'X-RapidAPI-Key': 'bac0b4a01dmsh637f968c8035314p1dc8b0jsn281bde6eebf7',
            'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
          }
        };
        axios.request(options).then(function (response) {
          const result = response.data;
          const text = result.translated_text[result.to];
      
          Tts.setDefaultRate(0.4);
          Tts.speak(text);
          Tts.addEventListener('tts-finish', () => {
            start();
          });
    
   
        })
       
       }
       const english = (audioURL) => {
        Tts.speak("Our Volunteers are working for you with their heart your opinion is important . Speak your opinion about them after beep sound");
       Tts.setDefaultRate(0.4)
       Tts.addEventListener('tts-finish', () => {
        start();
      });
     
     
       }
      const start = async() =>
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

} catch (error) {
console.log("error raised", error)
}
}
const onSpeechStartHandler = (e) => {
console.log("starttterrr handler==>>>", e)
}
const onSpeechEndHandler = (e) => {

console.log("stop handler", e)

}

const onSpeechResultsHandler2 = async(e) => {
 
    const text = e.value.toString()
    const text1 = text.split(',')[0].trim();
    console.log(text1)
    const userString =  await AsyncStorage.getItem('userId');
              const userRef = firestore().collection('blind').doc(userString);
               userRef.update({
                rating: text1,
              });
              console.log(text1)
    navigation.navigate('open')
    }






    return(
      <View style={{ flex: 1 }}>
      
        <Image source={require("../assets/images/gh.gif")} style={styles.backgroundImage}
        />
     
    </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 800,
    width: 400,
  },
  backgroundImage: {
    width: "100%",
    height: "100%"
  }
});
