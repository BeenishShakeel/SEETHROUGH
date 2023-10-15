import React, { useState , useEffect } from 'react';
import {View, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet , Image ,ToastAndroid} from "react-native";
import Background from "./background";
import Btn1 from "../assets/buttons/btn1";
import TextField from "./textField";
import { colors } from "../assets/constants/colors";
import auth from '@react-native-firebase/auth';
import MapView , {Marker}from 'react-native-maps';
import {apikey} from './googlemapkey';
import axios from 'axios';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import getAutocompleteResults from './getAutocompleteResults';
import MapViewDirections from 'react-native-maps-directions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import Sound from 'react-native-sound';
import Geocoder from 'react-native-geocoding';
Geocoder.init('AIzaSyB9n_eejCbVynkIbQw1hwVQ87OfZ8Jyioc');
const removeHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, '');
};
const ANGLE_THRESHOLD = 15;
const LEFT_TURN_THRESHOLD = 45;
const RIGHT_TURN_THRESHOLD = 45;
export default function Gps({navigation}){
  const [currentLocation, setCurrentLocation] = useState(0);
  const[destination,setdestination] =  useState('')
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userHeading, setUserHeading] = useState(0);
  const[destination1,setdestination1] =  useState(0)
  const[directions,setdirection] =  useState('')
  const [destinationSet, setDestinationSet] = useState(false); // New state variable
  const GOOGLE_PLACES_API_KEY = 'AIzaSyB9n_eejCbVynkIbQw1hwVQ87OfZ8Jyioc';
 
  useEffect(() => {
    play();
     // Watch user's location updates
  const locationWatchId = Geolocation.watchPosition(
    position => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({latitude , longitude});
    },
    error => console.error(error),
    { enableHighAccuracy: true, distanceFilter: 10 }
  );

    // Clean up by clearing the watch subscriptions
    return () => {
      Geolocation.clearWatch(locationWatchId);
    };
  }, []);

 
  
  const calculate_bearing = (lat1, lon1, lat2, lon2) => {
    const deltaLon = lon2 - lon1;
  
    const y = Math.sin(deltaLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
  
    let bearing = Math.atan2(y, x);
    bearing = (bearing * 180) / Math.PI; // Convert to degrees
    bearing = (bearing + 360) % 360; // Normalize to 0-359 degrees
  
    return bearing;
  };
  
  const calculateRelativeDirection = (currentHeading, stepBearing) => {
    const angleDifference = (stepBearing - currentHeading + 360) % 360;
  
    if (angleDifference <= ANGLE_THRESHOLD) {
      return "Move straight";
    } else if (angleDifference <= LEFT_TURN_THRESHOLD) {
      return "Turn left";
    } else if (angleDifference <= RIGHT_TURN_THRESHOLD) {
      return "Turn right";
    } else {
      return "Continue";
    }
  };
// Inside your Gps component or any appropriate function



  useEffect(() => {
    console.log('Current location:', currentLocation );
    
  }, [currentLocation ]);
  useEffect(() => {
    console.log('Destination:', destination);
    if (destination) {
      searchDestination(destination)
     // getDestinationCoordinates(destination);
    }
  }, [destination]);
  useEffect(() => {
    console.log('Destination coordinates:', destination1);
    if (destinationSet) { // Check if destinationSet is true
      calculateDistance(); // Call calculateDistance only when the destination is set
    }
  }, [destination1]);
 
  const directionMapping = {
    north: "straight",
    south: "straight",
    east: "right",
    west: "left",
    northeast: "slightly right",
    northwest: "slightly left",
    southeast: "sharp right",
    southwest: "sharp left",
  };
  useEffect(() => {
    if (directions.length > 0) {
      speakNextDirection();
    }
  }, [currentLocation, directions]);
  const speakNextDirection = () => {
    if (currentStepIndex < directions.length) {
      const nextStep = directions[currentStepIndex];
      const stepInstructions = removeHtmlTags(nextStep.html_instructions);
      const stepBearing = calculate_bearing(
        currentLocation.latitude,
        currentLocation.longitude,
        nextStep.end_location.lat,
        nextStep.end_location.lng
      );
      
      const stepInstruction = stepInstructions;
      const regex = /\b(north|south|east|west|northeast|northwest|southeast|southwest)\b/gi;
      const modifiedStepInstruction = stepInstruction.replace(regex, (match) => directionMapping[match.toLowerCase()]);
      
      const relativeDirection = calculateRelativeDirection(userHeading, stepBearing);
      Tts.speak(`${relativeDirection} ${modifiedStepInstruction} for ${nextStep.duration.text}`);
  
      // Increment currentStepIndex to move to the next step
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // User has reached the destination
      Tts.speak('You have reached your destination.');
    }
  };
  
  const fetchDirections = async () => {
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json`;
   
    const params = {
      origin: `${currentLocation.latitude},${currentLocation.longitude}`,
      destination: `${destination1.latitude},${destination1.longitude}`,
      key: 'AIzaSyB9n_eejCbVynkIbQw1hwVQ87OfZ8Jyioc',
      mode: 'walking'
    };
    try {
      const response = await axios.get(apiUrl, { params });
      const directions = response.data.routes[0].legs[0].steps;
      setdirection(directions)  
      if (currentStepIndex < directions.length) {
        const nextStep = directions[currentStepIndex];
        const stepInstructions = removeHtmlTags(nextStep.html_instructions);
        console.log('Next Step Instructions:', stepInstructions);
  
        const stepBearing = calculate_bearing(
          currentLocation.latitude,
          currentLocation.longitude,
          nextStep.end_location.lat,
          nextStep.end_location.lng
        );
        const stepInstruction = stepInstructions;
        console.log(stepInstruction)

        // Use regular expressions to identify cardinal directions in the step instruction
        const regex = /\b(north|south|east|west|northeast|northwest|southeast|southwest)\b/gi;
        const modifiedStepInstruction = stepInstruction.replace(regex, (match) => directionMapping[match.toLowerCase()]);
        
        console.log(modifiedStepInstruction);

        const relativeDirection = calculateRelativeDirection(userHeading, stepBearing);
        console.log(relativeDirection)
        console.log(stepInstructions)
        Tts.speak(`${relativeDirection} ${modifiedStepInstruction} for ${nextStep.duration.text}`);

  // Increment currentStepIndex to move to the next step
      setCurrentStepIndex(currentStepIndex + 1);
} else {
  // User has reached the destination
  Tts.speak('You have reached your destination.');
}
      
        }
            
     catch (error) {
      console.error('Error fetching directions:', error);
    }
  };
    
    const [coordinates] = useState([
        {
          latitude:  33.6179074,
          longitude: 72.9834155,
        },
        {
          latitude:  33.651592,
          longitude: 73.156456,
        },
            ]);
            
          
            const play = (audioURL) => {
              const sound2 = new Sound(require('./destinationurdu.mp3'),
              (error, sound) => {
                if (error) {
                  alert('error' + error.message);
                  return;
                }
                sound2.play(() => {
                  sound2.setSpeed(0.4);
                  sound2.release();
                start();
                
                });
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
const text = e.value.toString()
const text1 = text.split(',')[0].trim();
setdestination(text1)

}
const searchDestination = (query) => {
  const radius = 5000; // Change the radius value according to your requirement (in meters)
  const location = `${currentLocation.latitude},${currentLocation.longitude}`;
    const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${GOOGLE_PLACES_API_KEY}&query=${query}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length > 0) {
          const result = data.results[0];
          const { lat, lng } = result.geometry.location;
          setDestinationSet(true);
          setdestination1({
            latitude: lat,
            longitude: lng,
            name: result.name,

          });
         
        } else {
          Tts.speak('Destination not found. Please try again.');
        }
      })
      .catch((error) => {
        console.error(error);
        Tts.speak('An error occurred while searching for the destination.');
      });
   
  };
  const calculateDistance = () => {

    const toRadians = (degrees) => {
      return (degrees * Math.PI) / 180;
    };
    const lat1 = toRadians(currentLocation.latitude);
    const lon1 = toRadians(currentLocation.longitude);
    const lat2 = toRadians(destination1.latitude);
    const lon2 = toRadians(destination1.longitude);
    console.log(currentLocation.latitude , currentLocation.longitude)
    console.log(destination1.latitude , destination1.longitude)
    const R = 6371e3; // Earth's radius in meters

  const Δlat = lat2 - lat1;
  const Δlon = lon2 - lon1;

  // Haversine formula
  const a = Math.sin(Δlat / 2) * Math.sin(Δlat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(Δlon / 2) * Math.sin(Δlon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceInMeters = R * c;
  const distanceInKilometers = distanceInMeters / 1000;
  const roundedDistance = Math.round(distanceInKilometers * 100) / 100;
    
    
    Tts.speak(`The distance to your destination is ${roundedDistance} kilometers.`);
    console.log(roundedDistance)
    fetchDirections()
  };
  


    return(
       
        <View style = {{ flex:1}}>
        <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
            latitude: 33.626057,
            longitude:73.071442,
          latitudeDelta: 0.0622,
          longitudeDelta: 0.0121,
        }}  language="en" >
        <MapViewDirections
          origin={currentLocation}
          destination={destination1}
          
          apikey={"AIzaSyB9n_eejCbVynkIbQw1hwVQ87OfZ8Jyioc"} 
          //AIzaSyAoJNvyfx5Gtg5v4B-NAD8bcLUbXScHxwk
          strokeWidth={4}
          strokeColor="#111111"
        />
        
        {currentLocation ? <Marker coordinate={currentLocation} /> : null}
        {destination1 ? <Marker coordinate={destination1} /> : null}
        
        
      </MapView>
       </View>
            
        
    );
}
const styles = StyleSheet.create({
  
    errormessage: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        backgroundColor: '#F50057',
        padding: 7,
        width: 300,
        marginLeft:40,
        borderRadius: 13,
    }
});

