import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, StyleSheet, Image, Pressable, NativeModules, TouchableOpacity, Text, ImageBackground } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Sound from 'react-native-sound';
import Voice from '@react-native-voice/voice';
import axios from "axios";
import Tts from 'react-native-tts';
import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contacts from 'react-native-contacts';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import VoiceOperations from "./services/PicoVoice";
import firestore from '@react-native-firebase/firestore';
import { VolunteerSearchWithRating, VolunteerSearchFromContacts, VolunteerSearchNearestLocation } from "./volunteerSearchService";
import { setupVideoCall } from "./videoService";
import Recorder from "./services/RecorderService";
import Fuse from 'fuse.js';



const voiceOperations = new VoiceOperations();

export default function Open({ navigation }) {
  const [lat, setLat] = useState(33.6500104);
  const [long, setLong] = useState(73.1556531);
  const [lang, setlang] = useState("");
  const [contacts, setContacts] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const isFocused = useIsFocused();

  let phoneNumber = "";

  useEffect(() => {
    if (isFocused) {
      getUserId()
    }

    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;

    var hasLocationPermission = requestLocationPermission();
    if (hasLocationPermission) {
      getLocation();
    }

    Contacts.getAll().then(fetchedContacts => {
      // console.log("Fetched contacts: ", fetchedContacts.length)
      setContacts(fetchedContacts);
    });

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }

  }, [isFocused]);

  useEffect(() => {
    if (contacts.length !== 0) {
      console.log("Contacts length now is: ", contacts.length);
      Voice.onSpeechStart = onSpeechStartHandler;
      Voice.onSpeechEnd = onSpeechEndHandler;
      Voice.onSpeechResults = onSpeechResultsHandler;
    }
  }, [contacts]);

  useEffect(() => {
    console.log("-----------resetting handler------------");
    Voice.onSpeechResults = onSpeechResultsHandler;
  }, [contacts]);

  // useEffect(() => {
  //   if (isRecordingMessage) {
  //     // Tts.speak("Please tap the screen and speak your message");
  //     start1();
  //     // Voice.onSpeechResults = onSpeechResultsHandler;
  //   }
  // }, [isRecordingMessage]);
  const start2 = async () => {
    console.log("record audio");
    Voice.destroy().then(() => {
      Voice.onSpeechResults = onSpeechResultsHandler;
      Recording();
    });
  }

  const Recording = async () => {
    try {
      console.log("start recording ");
      Tts.speak('Recording started');
      await Recorder.onStartRecord();
    } catch (error) {
      console.log("error raised", error);
    }
    console.log("stop Recording");
  }

  const start = async () => {
    console.log("start recording name");
    Voice.destroy().then(() => {
      Voice.onSpeechResults = onSpeechResultsHandler3;
      startRecording();
    });
  }

  const start1 = async () => {
    console.log("in start");
    Voice.destroy().then(() => {
      Voice.onSpeechResults = onSpeechResultsHandler2;
      startRecording();
    });
  }


  const startRecording = async () => {
    try {
      console.log("start message");
      await Voice.start('en-Us');
    } catch (error) {
      console.log("error raised", error);
    }
    console.log("stop startRecording");
  }

  const detectIntentText = useCallback((query) => {
    console.log("detecting")
    axios.post("http://192.168.18.55:8000/get-response", { query: query, location: { latitude: lat, longitude: long } })
      .then(async (response) => {
        // console.log("Response: ", response.data);
        if (response.data.intent === "search volunteer with good rating") {
          console.log("i am here to search");
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
          const options = {
            keys: ['displayName'], // Replace 'name' with the key you want to search in your contacts
          };
          const fuse = new Fuse(contacts, options);
          const contact = fuse.search(name);
          // console.log('hmm');
          console.log(contact[0]);

          if (contact) {
            RNImmediatePhoneCall.immediatePhoneCall(contact[0].item.phoneNumbers[0].number);
          }
          else {
            Tts.speak('contact does not exist');
          }
        }
        else if (response.data.intent === "Message a contact") {
          let name = response.data.data.queryResult.parameters.fields.person.structValue.fields.name.stringValue;
          const options = {
            keys: ['displayName'], // Replace 'name' with the key you want to search in your contacts
          };
          const fuse = new Fuse(contacts, options);
          const contact = fuse.search(name);
          console.log("Matched contact: ", contact[0]);
          if (contact) {
            setTimeout(start1, 5000);
            Tts.speak(`kindly record your message for ${contact[0].item.displayName}`);
            phoneNumber = contact[0].item.phoneNumbers[0].number;
          }
          else {
            Tts.speak('contact does not exist');
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
          console.log("Alarm: ", response.data.data.queryResult.parameters)
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
          return;
        }
        else if (response.data.intent === "Stop stopwatch") {
          const stopwatchReading = voiceOperations.stopStopwatch();
          Tts.speak(`Stopwatch has been stopped at ${stopwatchReading}`);
          return;
        }
        else if (response.data.intent === "Start recording") {
          setTimeout(start,5000);
          Tts.speak('what do you want to name this recording');
          setTimeout(start2, 12000);
        }
        else if (response.data.intent === "Play audio") {
          // setIsRecording(true);
          Recorder.onStartPlay();
        }
        else if(response.data.intent === "instructions"){
          Tts.speak('Welcome First of all you need to double tap for any function to get perform');
          Tts.speak('To do a sim call use keyword call contact name like call Ali');
          Tts.speak('To do a sim message use keyword message contact name. it will then ask you to record your message body');
          Tts.speak('To search and get in call with a good rated volunteer use keyword search volunteer with good rating');
          Tts.speak('To search and get in call with a nearest located volunteer use keyword search volunteer near me');
          Tts.speak('To search and get in call with a volunteer from your app contactlist use keyword search volunteer from contacts');
          Tts.speak('To add the volunteer in your contact the app will ask you to tap yes or no at the end of the call');
          Tts.speak('During the videocall with the volunteer double tap on the top left to switch camera on the top right to off camera on the bottom left to get muted and on the bottom right to end the call ');
          Tts.speak('To set an alarm double tap and say keyword set an alarm for 5pm');
          Tts.speak('To start stopwatch use keyword start stopwatch and to stop use stop stopwatch');
          Tts.speak('To start the timer use keyword set a timer for 10 minutes');
          Tts.speak('To record an audio use keyword start recording and to stop say stop recording');
          Tts.speak('it will then ask you to tell the name to save recording so that you can play it later on by using keyword play recordingname')
        }

        if (response.data && response.data.responses.length > 0) {
          Tts.speak(response.data.responses[0].text.text[0]);
        }

      })
      .catch(err => console.error(err));
  }, [contacts, lat, long]);

  const onSpeechStartHandler = (e) => {
    console.log('start handler');
  }

  const onSpeechEndHandler = (e) => {
    console.log("stop handler");
  }

  const onSpeechResultsHandler3 = (e) => {
    if (e.value.length > 0) {
      console.log("name of the recording: ", e.value[0]);
    }
  }
  
 
  const onSpeechResultsHandler2 = (e) => {
    if (e.value.length > 0) {
      console.log("Message Body: ", e.value[0]);
      let DirectSms = NativeModules.DirectSms;
      DirectSms.sendDirectSms(phoneNumber, e.value[0]);
      phoneNumber = "";
      Voice.destroy().then(() => {
        Voice.onSpeechResults = onSpeechResultsHandler;
      });
    }
  }
  const onSpeechResultsHandler = (e) => {
    if (e.value.length > 0) {
      console.log("Before invoking, contacts length: ", contacts.length);
      detectIntentText(e.value[0]);
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
    Tts.speak("Welcome! How can I assist you");
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

    const options = {
      method: 'GET',
      url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
      params: { text: "welcome , How can I assist you", to: 'ur', from: 'en' },
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
    });
  }

  const getLocation = () => {
    // Geolocation.getCurrentPosition(
    //   (position) => {
    //     console.log("Position: ", position);
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
        if (isRecording) {
          Recorder.onStopRecord();
          // Tts.speak('Recording has been stopped');
          Recorder.onStopPlay();
          setIsRecording(false);
        }
        else
          Voice.start();
      }}>

        <ImageBackground source={require("../assets/images/gh.gif")} style={styles.backgroundImage}>

        </ImageBackground>
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
    width: '100%',
    height: '100%',
  }
});
