import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ToastAndroid } from "react-native";
import TextField2 from "./textField2";
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../assets/constants/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUp({ navigation }) {
  const [selectedLanguages, setSelectedLanguages] = React.useState([]);
  const [location, setLocation] = useState(null);
  const [language, setLanguage] = React.useState();
// const [location, setLocation] = useState({latitude: 33.6224444, longitude: 73.0960449});
  const data = [
    { key: '1', value: 'Urdu' },
    { key: '2', value: 'English' },
    { key: '3', value: 'French' }
  ];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rating, setRating] = useState(0.0);
  const [currentLocation, setCurrentLocation] = useState(0);
  //useEffect(() => {
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
  // }, [setCurrentLocation])


  function SignUpAuth() {
    if (password === confirmPassword) {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (response) => {
          await AsyncStorage.setItem('userId', response.user.uid);
          await AsyncStorage.setItem('check', response.user.uid);
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          let randomId = '';
        
          for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * 10);
            randomId += characters.charAt(randomIndex);
          }
          const userRef = firestore().collection('users').doc(response.user.uid);
          //const { latitude, longitude } = currentLocation
         // const geoPoint = new firestore.GeoPoint(latitude, longitude);
          userRef
            .set({
              firstName: firstName,
              lastName: lastName,
              phoneNumber: phoneNumber,
              email: email,
              languages: selectedLanguages,
              rating: 5,
              //location: geoPoint,
              isActive:true,
              isEngaged:false,
              role : "volunteer"
           
            })
            .then(() => {
              ToastAndroid.show("User Created Successfully", ToastAndroid.SHORT);
              navigation.navigate("Login");
            })
            .catch((error) => {
              ToastAndroid.show(error.message, ToastAndroid.SHORT);
              console.log("Error: ", error.message);
            });
        })
        .catch((error) => {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
          console.log("Error: ", error.message);
        });
    } else {
      ToastAndroid.show("Your Password doesn't match!", ToastAndroid.SHORT);
    }
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ backgroundColor: '#1F4A83', height: 1000, marginTop: 60, width: 370, borderTopLeftRadius: 80, borderTopRightRadius: 80 }}>
        {/* color: colors.primary */}

        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 30, alignSelf: "center", marginTop: 30, color: 'white' }}>REGISTER</Text>
        <TextField2 placeholder="First Name" name="edit" onChangeText={setFirstName} value={firstName} />
        <TextField2 placeholder="Last Name" name="edit" onChangeText={setLastName} value={lastName} />
        <TextField2 placeholder="Email" keyboardType="email-address" name="mail-outline" onChangeText={setEmail} value={email} />
        <TextField2 placeholder="Password" name="lock" secureTextEntry={true} onChangeText={setPassword} value={password} />
        <TextField2 placeholder="Confirm Password" secureTextEntry={true} name="lock" onChangeText={setConfirmPassword} value={confirmPassword} />
        <TextField2 placeholder="Phone Number" name="phone" onChangeText={setPhoneNumber} value={phoneNumber}
        />
<View style = {{flexDirection:'column'}}>
        <MultipleSelectList
        setSelected={(val) => setSelectedLanguages(val)}
          data={data}
          save="value"
          multiSelect={true}
          closeicon={<MaterialIcons style={{ marginTop: 10, marginLeft: 7 }} name="clear" size={25} color={'white'}></MaterialIcons>}
          arrowicon={<Icon name="chevron-down" size={22} style={{ marginTop: 5 }} color={'white'} />}
          searchicon={<Icon name="search-outline" style={{ marginBottom: 4 }} size={20} color={'white'} />}
          boxStyles={{
            width: 250, height:80, borderColor: '#1F4A83',
            borderRadius: 25, marginTop: 17, marginLeft: 18
          }}
          placeholderTextColor={colors.primary}

          inputStyles={{
            fontSize: 17, color: 'white', fontFamily: "Poppins-Regular", marginTop: 2, marginLeft: 12
          }}
          backgroundColor='white'
          fontFamily='Poppins-SemiBold'
          dropdownTextStyles={{ fontSize: 15, color: "#1F4A83" }}
          dropdownStyles={{ height: 120, width: 250, marginLeft: 20, backgroundColor: 'white', borderColor: 'white' }}
          badgeTextStyles={{ fontfamily: 'Poppins-Regular', color:'#1F4A83', fontSize: 14 }}
          badgeStyles={{ backgroundColor: 'white'  }}
          labelStyles={{ fontSize: 2, fontFamily: 'Poppins-SemiBold' }}
          label="Categories"
          style={{ marginTop: 4 }} 
        />
        <View style ={{ borderBottomWidth: 0.5, 
          borderColor:'#D5D8DC', width:300 ,  marginLeft:30, marginBottom:20,
           }}>
           </View>
           </View>
        {/* <TextField2 placeholder="Confirm Password" secureTextEntry={true} name="lock" onChangeText={setConfirmPassword} value={confirmPassword} /> */}

        <View style={{ marginTop: 540, marginLeft: 80, position: 'absolute' }}>

          <TouchableOpacity style={{ backgroundColor: 'white', borderTopLeftRadius: 100, alignItems: "center", marginLeft: 180, marginTop: 40, height: 80, width: 170 }} onPress={() => SignUpAuth()}>
            <Text style={{ color: "#1F4A83", fontSize: 20, marginRight: 50, fontFamily: "Poppins-Black", marginTop: 25 }}>Register</Text>

          </TouchableOpacity>
        </View>
        {/* onPress={SignUpAuth} */}

      </View>
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
    marginLeft: 40,
    borderRadius: 13,
  }
});
