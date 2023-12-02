import React, { useState , useEffect , useRef } from 'react';
import {View, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet , Image ,ToastAndroid} from "react-native";
import Voice from '@react-native-voice/voice';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Tts from 'react-native-tts';
import axios from 'axios';
import open from '../src/open';
const firebaseid = "asFea23WojeHhKbRUmSqBWKL9xM2";
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
      const sound2 = new Sound(require('./urdur.mp3'),
      (error, sound) => {
        if (error) {
          alert('error' + error.message);
          return;
        }
        sound2.play(() => {
          sound2.release();
         
            start();
      
        });
      });
      
      // const options = {
      //   method: 'GET',
      //   url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
      //   params: { text: "Kindly give a opinion about our volunteers. Your options for opinion  are  ,,  very good , good , Suitable, bad , very bad", to: 'ur', from: 'en' },
      //   headers: {
      //     'X-RapidAPI-Key': 'bac0b4a01dmsh637f968c8035314p1dc8b0jsn281bde6eebf7',
      //     'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
      //   }
      // };
      // axios.request(options).then(function (response) {
      //   const result = response.data;
      //   const text = result.translated_text[result.to];
    
      //   Tts.setDefaultRate(0.3);
      //   Tts.speak(text);
      //   Tts.addEventListener('tts-finish', () => {
      //     start();
      //   });
  
  
      // })
      

       }
       const french = (audioURL) => {
        const options = {
          method: 'GET',
          url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
          params: { text: "Kindly give a opinion about our volunteers. Your options for opinion  are  ,,  very good, good, satisfactory, bad, very bad", to: 'fr', from: 'en' },
          headers: {
            'X-RapidAPI-Key': 'bac0b4a01dmsh637f968c8035314p1dc8b0jsn281bde6eebf7',
            'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
          }
        };
        axios.request(options).then(function (response) {
          const result = response.data;
          const text = result.translated_text[result.to];
      
          Tts.setDefaultRate(0.3);
          Tts.speak(text);
          Tts.addEventListener('tts-finish', () => {
            start();
          });
    
   
        })
       
       }
       const english = (audioURL) => {
        Tts.setDefaultRate(0.4)
        Tts.speak("Kindly give a opinion about our volunteers. Your options for opinion  are  ,,  very good, good, satisfactory, bad, very bad");
      
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
    console.log(e.value.toString())
    const text = e.value.toString()
    const text1 = text.split(',')[0].trim().toLowerCase().replace(/\s/g, ''); ;
    console.log(text1)
    let rate = 0;
    if (text1.includes("bahutbura")) {
      console.log("hellos");
      rate = 1;
    } else if (text1.includes("bura")) {
      rate = 2;
    } else if (text1.includes("theek")) {
      rate = 3;
    } else if (text1 === "bahutachcha") {
      rate = 5;
    } else if (text1 === "achcha") {
      rate = 4;
    } else if (text1.includes("verygood")) {
      rate = 5;
    } else if (text1.includes("good")) {
      rate = 4;
    } else if (text1.includes("satisfactory")) {
      rate = 3;
    }
    else if (text1.includes("verybad")) {
      rate = 1;
    }
     else if (text1.includes("bad")) {
      rate = 2;
    } 
    else if(text1.includes("skip"))
    console.log(rate)
   // const userString =  await AsyncStorage.getItem('userId');
   try{
              const userRef = firestore().collection('users').doc(firebaseid);
              // userRef.update({
              //   rating: rate,
              // });
              const userDoc = await userRef.get();
              const userRatings = userDoc.data().ratings || [];
          
              // Add the new rating to the array
              userRatings.push(rate);
          
              // Calculate the average rating
              const averageRating = userRatings.reduce((sum, rating) => sum + rating, 0) / userRatings.length;
              const roundedAverageRating = parseFloat(averageRating.toFixed(1));
              // Update the average rating in the user document
              userRef.update({
                rating: roundedAverageRating,
                ratings: userRatings, // Update the ratings array
              });
            } catch (error) {
              console.error('Error updating rating:', error);
            }
          
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
