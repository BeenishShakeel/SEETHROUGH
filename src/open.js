import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, ToastAndroid, Pressable, FlatList, NativeModules } from "react-native";
import Background from "./background";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Btn1 from "../assets/buttons/btn1";
import Back4 from "./back4";
import TextField from "./textField";
import { Gif } from 'react-native-gif'
import Icon from "react-native-vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import Sound from 'react-native-sound';
import Voice from '@react-native-voice/voice';
import axios, { all } from "axios";
import Tts from 'react-native-tts';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contacts from 'react-native-contacts';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import VoiceOperations from "./services/PicoVoice";
import { distance, closest } from 'fastest-levenshtein';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { NavigationContainer } from '@react-navigation/native';
// import database from '@react-native-firebase/database';
// import {utils} from '@react-native-firebase/app';
// import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { VolunteerSearchWithRating, VolunteerSearchFromContacts, VolunteerSearchNearestLocation } from "./volunteerSearchService";
import { setupVideoCall } from "./videoService";

const audioRecorderPlayer = new AudioRecorderPlayer();
let volunteer_id = null;

//export default ContactsList;
//export {Contact};
//import Contacts from 'react-native-contacts';
//import {Contact} from '.';

const voiceOperations = new VoiceOperations();

function detectIntentText(navigation, query, lat, long, contacts) {
  axios.post("http://192.168.18.55:8000/get-response", { query: query, location: { latitude: lat, longitude: long } })
    .then(async (response) => {
      console.log("Response: ", response.data);
      if (response.data.intent === "search volunteer with good rating") {
        VolunteerSearchWithRating()
        .then(user => {
          console.log("User: ", user);
          setupVideoCall(navigation, user);
        })
        .catch(err => console.error(err));
      }
      else if (response.data.intent === "search volunteer from contacts") {
        VolunteerSearchFromContacts()
        .then(user => {
          console.log("User: ", user);
          setupVideoCall(navigation, user);
        })
        .catch(err => console.error(err));
      }
      else if (response.data.intent === "search volunteer with nearest location") {
        VolunteerSearchNearestLocation()
        .then(user => {
          console.log("User: ", user);
          setupVideoCall(navigation, user);
        })
        .catch(err => console.error(err));
      }
      else if (response.data.intent === "Make a Call") {
        console.log("i am trying to contact");
        let name = response.data.data.queryResult.parameters.fields.person.structValue.fields.name.stringValue;
        let distances = contacts.map(contact => {
              let c = contact?.givenName;
              return distance(name, c);
            });
    
            let min = Math.min(...distances);
            console.log("min", min)
            let contact = contacts[distances.indexOf(min)];
            console.log(contact);
            if (contact) {
              RNImmediatePhoneCall.immediatePhoneCall(contact.phoneNumbers[0].number);
            }
      }
       else if (response.data.intent === "Message a contact") {
        let DirectSms = NativeModules.DirectSms;
        let name = response.data.data.queryResult.parameters.fields.person.structValue.fields.name.stringValue;
        console.log("Name: ", name);
        let distances = contacts.map(contact => {
          let c = contact?.givenName;
          return distance(name, c);
        });
        console.log(distances);
        let min = Math.min(...distances);
        console.log("min", min)
        let contact = contacts[distances.indexOf(min)];
        console.log(contact);
        if (contact) {
          DirectSms.sendDirectSms(contact.phoneNumbers[0].number, "Hello Been]! Aap kaachi ho?");
        }
     
      }
    else if(response.data.intent === "Start Timer") {
        const durationObj = response.data.data.queryResult.parameters.fields.duration.structValue.fields;
        const duration = durationObj.amount.numberValue;
        const unit = durationObj.unit.stringValue;
        voiceOperations.startTimer(duration, unit);
        Tts.speak("Timer has been set. Your phone will ring as soon as the timer ends");
      }
      else if(response.data.intent === "Set Alarm") {
        let alarmSetup;
        const targetDate = response.data.data.queryResult.parameters.fields.alarmdatetime.structValue.fields;
        if(targetDate.future) {
          const futureDate = targetDate.future.structValue.fields;
          const month = futureDate.month.numberValue;
          const day = futureDate.day.numberValue;
          const hours = futureDate.hours.numberValue;
          const minutes = futureDate.minutes.numberValue;
          alarmSetup = voiceOperations.setAlarm(month, day, hours, minutes);
        }
        else {
          const hours = targetDate.hours.numberValue;
          const minutes = targetDate.minutes.numberValue;
          alarmSetup = voiceOperations.setAlarm(null, null, hours, minutes);
        }
        if(alarmSetup) 
          Tts.speak("Alarm has been set");
        else
          Tts.speak("Alarm could not be setup. Please give a correct time");
      }
      else if(response.data.intent === "Start stopwatch") {
        voiceOperations.startStopwatch();
        Tts.speak("Stopwatch has been started");
      }
      else if(response.data.intent === "Stop stopwatch") {
        const stopwatchReading = voiceOperations.stopStopwatch();
        Tts.speak(`Stopwatch has been stopped at ${stopwatchReading}`);
      }
      

      //console.log("lat:", lat)
      //console.log("long:", long)
      //console.log("res: ", response.data);
    
      if (response.data) {
        Tts.speak(response.data.responses[0].text.text[0]);
      }
    })
    .catch(err => console.error(err));
}

export default function Open({ navigation }) {
  const [lat, setLat] = useState(33.6500104);
  const [long, setLong] = useState(73.1556531);
  const [lang, setlang] = useState("")
  const [contacts, setContacts] = useState([]);
  const [audioFileName, setAudioFileName] = useState('');

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      console.log("called");
      getUserId()
    }

    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    var hasLocationPermission = requestLocationPermission();
    if (hasLocationPermission) {
      getLocation();
    }

    Contacts.getAll().then(contacts => {
      // console.log(contacts);
      setContacts(contacts);
      //saveContacts();
      
     
    });

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

  const startRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      Tts.speak(result);

      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
      setAudioFileName(result);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const playAudio = async () => {
    try {
      await audioRecorderPlayer.startPlayer(audioFileName);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };


  const onSpeechResultsHandler = (e) => {
    console.log(e);
    if (e.value.length > 0) {
      if (e.value[0].includes("start recording")) {
        Tts.speak('Recording started');
        startRecording();
      }
      else if (e.value[0].includes("stop recording")) {
        stopRecording();
      }
      else if (e.value[0].includes("play audio") && audioFileName) {
        playAudio();
      }
      else {
        detectIntentText(navigation, e.value[0], lat, long, contacts);
      }
    }
  }
  // const saveContacts = async () =>{
  //   const userRef = firestore().collection('blind').doc(userId);
  //     await userRef.set({
  //       contacts : contacts.forEach( contact => {
  //         name: contact.givenName
  //         number: contact.phoneNumbers[0].number
  //       })
  //     });
  // }

  const requestLocationPermission = async () => {
    var allow = false;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'App location Permission',
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
  const english = async () => {
    Tts.setDefaultRate(0.4);
    Tts.speak("Welcome")
    Tts.speak("How can I assist you")

  }
  const urdu = async () => {
    const options = {
      method: 'GET',
      url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
      params: { text: "welcome , How can I assist you ", to: 'ur', from: 'en' },
      headers: {
        'X-RapidAPI-Key': 'bac0b4a01dmsh637f968c8035314p1dc8b0jsn281bde6eebf7',
        'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
      }
    };
    const sound2 = new Sound(require('./mediaa14.mp3'),
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
  const french = async () => {
    const options = {
      method: 'GET',
      url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
      params: { text: "welcome , How can I assist you", to: 'fr', from: 'en' },
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

  const getLocation = () => {
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

  return (
    <View style={{ flex: 1 }}>
      <Pressable onPress={() => { Voice.start() }}>
        <Image source={require("../assets/images/gh.gif")} style={styles.backgroundImage}
        />
      </Pressable>
    </View>
  );
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
