import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ToastAndroid } from "react-native";
//import Background from "./background";
//import MaterialIcons from "react-native-vector-icons/MaterialIcons";
//import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//import Btn1 from "../assets/buttons/btn1";
import Back5 from "./back5";
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
// import TextField from "./textField";
// import Icon from "react-native-vector-icons/Ionicons";
// import { colors } from "../assets/constants/colors";
// import * as Animatable from 'react-native-animatable';
import Sound from 'react-native-sound';
//import { io } from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';
//import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Tts from 'react-native-tts';
//import { Button } from "react-native-paper";
//import { useAnimatedGestureHandler } from "react-native-reanimated";

export default function BlindSignup({ navigation }) {
  const [hasRun, setHasRun] = useState(false);
  const [id, setid] = useState('')
  const [language, setlanguage] = useState('')
  const [audio, setaudio] = useState('')
  const [lang, setlang] = useState('')
  const langRef = useRef('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentLocation, setCurrentLocation] = useState(0);
  const [audioInstance, setAudioInstance] = useState(null);

  // useEffect(() => {
  //   const locationWatchId = Geolocation.watchPosition(
  //     position => {
  //       const { latitude, longitude } = position.coords;
  //       setCurrentLocation({ latitude, longitude });
  //       console.log({ latitude, longitude });
  //     },
  //     error => console.error(error),
  //     { enableHighAccuracy: true, distanceFilter: 10 }
  //   );

  //   // Clean up by clearing the watch subscriptions
  //   return () => {
  //     Geolocation.clearWatch(locationWatchId);
  //   };
  // }, [setCurrentLocation]);

  useEffect(() => {

    // sendAkt();
    play1()
    return () => {
      stopRecording();
      stopAudio();
      Voice.destroy().then(Voice.removeAllListeners);
    };

  }, []);
  const play1 = (audioURL) => {
    const sound1 = new Sound(require('./media112.mp3'),
      (error, sound) => {
        if (error) {
          alert('error' + error.message);
          return;
        }
        setAudioInstance(sound);
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
        setAudioInstance(sound);
        sound2.play(() => {
          sound2.setSpeed(0.4);
          sound2.release();
          start1();

        });
      });
  }
  const stopAudio = () => {
    if (audioInstance) {
      audioInstance.stop(() => {

        audioInstance.release();
        setAudioInstance(null);
      });
    }
  };
  const start1 = async () => {
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
    //stopRecording();
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
  const onSpeechResultsHandler2 = async (e) => {
    console.log(e.value.toString())
    console.log("langvalue" + langRef.current);
    if (langRef.current.includes("yes")) {
      if (e.value.toString() === "Urdu" || e.value.toString() === "English" || e.value.toString() === "French") {
        let text3 = e.value.toString();
        await AsyncStorage.setItem('language', text3);
        setlanguage(text3)
        setinfo()
      }
      else {
        Tts.addEventListener('tts-finish', () => {
          isTtsFinished = true;
        });
        Tts.speak("Kindly speak your language again?");
        isTtsFinished = false;
        while (!isTtsFinished) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        const sound2 = new Sound(require('./urdur1.mp3'),
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
          start1();
        }, 2500);
        langRef.current = "yes";
      }
    }
    else {
      let text1 = e.value.toString();
      const phoneNumber = text1.split(',')[0].trim();
      const phoneNumberWithoutSpaces = phoneNumber.replace(/\s/g, '');
      const phoneNumberLength = phoneNumberWithoutSpaces.length;
      console.log(phoneNumberLength)
      if (phoneNumberLength == 11) {
        setPhoneNumber(phoneNumberWithoutSpaces);
        langRef.current = "yes";

        await AsyncStorage.setItem('phonenumber', phoneNumberWithoutSpaces);
        console.log(phoneNumberWithoutSpaces)
        const options = {
          method: 'GET',
          url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
          params: { text: "which language do you speak", to: 'ur', from: 'en' },
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
      else {

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
        }, 5000)


      }
    }
  }

  async function setinfo() {
    const random1 = Math.random().toString(36).substring(2, 7);
    const random2 = Math.random().toString(36).substring(2, 7);
    const userId = `${random1}-${random2}`;

    try {
      const language1 = await AsyncStorage.getItem('language');
      const phone = await AsyncStorage.getItem('phonenumber');
      console.log(userId);
      console.log(phone);
      console.log(language1);

      // Use the callback form to get the most up-to-date state
      // setCurrentLocation(prevLocation => {
      //   const { latitude, longitude } = prevLocation;
      //   const geoPoint = new firestore.GeoPoint(latitude, longitude);

      // Create a reference to the Firestore collection and set the data
      const userRef = firestore().collection('blind').doc(userId);

      userRef.set({
        phonenumber: phone,
        language: language1,
        // location: geoPoint,
        role: "blind"
      });

      //   return prevLocation;
      // });

      ToastAndroid.show("Account Updated Successfully!", ToastAndroid.SHORT);

      await AsyncStorage.setItem('userId', userId);
      console.log('User ID saved successfully.');
      Voice.destroy().then(Voice.removeAllListeners);
      navigation.navigate("open");

    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }

  return (
    <Back5 navigation={navigation}>


    </Back5>
  )
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
    height: "100%"
  },
  buttonContainer: {
    position: "absolute",
    bottom: 16,
    left: 250,
    width: 100,
    height: 43,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
  },
  buttonText: {
    color: "#1F4A83",
    fontWeight: "bold",
    fontSize: 16
  },
});