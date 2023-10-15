import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Pressable, NativeModules } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Sound from 'react-native-sound';
import Voice from '@react-native-voice/voice';
import axios from "axios";
import Tts from 'react-native-tts';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contacts from 'react-native-contacts';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import VoiceOperations from "./services/PicoVoice";
import { distance } from 'fastest-levenshtein';
import firestore from '@react-native-firebase/firestore';
import { VolunteerSearchWithRating, VolunteerSearchFromContacts, VolunteerSearchNearestLocation } from "./volunteerSearchService";
import { setupVideoCall } from "./videoService";
import Recorder from "./services/RecorderService";

const voiceOperations = new VoiceOperations();

function detectIntentText(navigation, query, lat, long, contacts, startRecording) {
  axios.post("http://192.168.18.11:8000/get-response", { query: query, location: { latitude: lat, longitude: long } })
    .then(async (response) => {
      console.log("Response: ", response.data);
      if (response.data.intent === "search volunteer with good rating") {
        VolunteerSearchWithRating()
          .then(user => {
            setupVideoCall(navigation, user);
          })
          .catch(err => console.error(err));
      }
      else if (response.data.intent === "search volunteer from contacts") {
        VolunteerSearchFromContacts()
          .then(user => {
            setupVideoCall(navigation, user);
          })
          .catch(err => console.error(err));
      }
      else if (response.data.intent === "search volunteer with nearest location") {
        VolunteerSearchNearestLocation()
          .then(user => {
            setupVideoCall(navigation, user);
          })
          .catch(err => console.error(err));
      }
      else if (response.data.intent === "Make a Call") {
        let name = response.data.data.queryResult.parameters.fields.person.structValue.fields.name.stringValue;
        let distances = contacts.map(contact => {
          let c = contact?.givenName;
          return distance(name, c);
        });

        let min = Math.min(...distances);
        let contact = contacts[distances.indexOf(min)];
        if (contact) {
          RNImmediatePhoneCall.immediatePhoneCall(contact.phoneNumbers[0].number);
        }
      }
      else if (response.data.intent === "Message a contact") {
        let DirectSms = NativeModules.DirectSms;
        let name = response.data.data.queryResult.parameters.fields.person.structValue.fields.name.stringValue;
        let distances = contacts.map(contact => {
          let c = contact?.givenName;
          return distance(name, c);
        });
        let min = Math.min(...distances);
        let contact = contacts[distances.indexOf(min)];
        if (contact) {
          DirectSms.sendDirectSms(contact.phoneNumbers[0].number, "Hello Beeni! Aap kaachi ho?");
        }

      }
      else if (response.data.intent === "Start Timer") {
        const durationObj = response.data.data.queryResult.parameters.fields.duration.structValue.fields;
        const duration = durationObj.amount.numberValue;
        const unit = durationObj.unit.stringValue;
        voiceOperations.startTimer(duration, unit);
        Tts.speak("Timer has been set. Your phone will ring as soon as the timer ends");
      }
      else if (response.data.intent === "Set Alarm") {
        let alarmSetup;
        const targetDate = response.data.data.queryResult.parameters.fields.alarmdatetime.structValue.fields;
        if (targetDate.future) {
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
        if (alarmSetup)
          Tts.speak("Alarm has been set");
        else
          Tts.speak("Alarm could not be setup. Please give a correct time");
      }
      else if (response.data.intent === "Start stopwatch") {
        voiceOperations.startStopwatch();
        Tts.speak("Stopwatch has been started");
      }
      else if (response.data.intent === "Stop stopwatch") {
        const stopwatchReading = voiceOperations.stopStopwatch();
        Tts.speak(`Stopwatch has been stopped at ${stopwatchReading}`);
      }
      else if (response.data.intent === "Start recording") {
        Tts.speak('Recording started');
        startRecording();
        Recorder.onStartRecord();
      }
      else if (response.data.intent === "Play audio") {
        startRecording();
        Recorder.onStartPlay();
      }

      if (response.data && response.data.responses.length > 0) {
        Tts.speak(response.data.responses[0].text.text[0]);
      }

    })
    .catch(err => console.error(err));
}

export default function Open({ navigation }) {
  const [lat, setLat] = useState(33.6500104);
  const [long, setLong] = useState(73.1556531);
  const [lang, setlang] = useState("");
  const [contacts, setContacts] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const isFocused = useIsFocused();
  
  useEffect(() => {
    if (isFocused) {
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
      setContacts(contacts);
    });

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, [isFocused])


  const onSpeechStartHandler = (e) => {
    
  }

  const onSpeechEndHandler = (e) => {
    
  }


  const onSpeechResultsHandler = (e) => {
    if (e.value.length > 0) {
      detectIntentText(navigation, e.value[0], lat, long, contacts, () => setIsRecording(true));
    }
  }

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
    // Geolocation.getCurrentPosition(
    //   (position) => {
    //     console.log(position);
    //     setLat(position.coords.latitude);
    //     setLong(position.coords.longitude);
    //   },
    //   (error) => {
    //     // See error code charts below.
    //     console.log(error.code, error.message);
    //   },
    //   { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    // );
  }

  return (
    <View style={{ flex: 1 }}>
      <Pressable onPress={() => {
        if(isRecording) {
          Recorder.onStopRecord();
          Recorder.onStopPlay();
          setIsRecording(false);
        }
        else
          Voice.start();
      }}>
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
