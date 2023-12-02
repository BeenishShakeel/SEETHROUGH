import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ToastAndroid  , TextInput, KeyboardAvoidingView} from "react-native";
import TextField2 from "./textField2";
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../assets/constants/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Writtensignup({ navigation }) {
  const [currentLocation, setCurrentLocation] = useState(0);
  useEffect(() => {

 const locationWatchId = Geolocation.watchPosition(
   position => {
     const { latitude, longitude } = position.coords;
     setCurrentLocation({latitude , longitude});
     console.log(currentLocation)
   },
   error => console.error(error),
   { enableHighAccuracy: true, distanceFilter: 10 }
 );

   // Clean up by clearing the watch subscriptions
   return () => {
     Geolocation.clearWatch(locationWatchId);
   };
 }, []);
  const data = [
    { key: '1', value: 'Urdu' },
    { key: '2', value: 'English' },
    { key: '3', value: 'French' }
  ];
 

  
  const [phone, setPhoneNumber] = useState('')
  const [language, setLanguage] = useState('')
  const[location,setLocation] =  useState('')
 

  // useEffect(() => {
  //   const locationWatchId = Geolocation.watchPosition(
  //     position => {
  //       const { latitude, longitude } = position.coords;
  //       setCurrentLocation({latitude , longitude});
  //     },
  //     error => console.error(error),
  //     { enableHighAccuracy: true, distanceFilter: 10 }
  //   );
  // }, []);
  

 async function SignUpAuth() {
  if (phone.length !== 11) {
    ToastAndroid.show("Phone number must be 11 digits.", ToastAndroid.SHORT);
    return;
  }

  // Validate other fields
  if (!phone || !language) {
    ToastAndroid.show("Please fill in all fields.", ToastAndroid.SHORT);
    return;
  }
    
  const random1 = Math.random().toString(36).substring(2, 7);
    const random2 = Math.random().toString(36).substring(2, 7);
    const userId = `${random1}-${random2}`;
    const { latitude, longitude } = currentLocation;
    const geoPoint = new firestore.GeoPoint(latitude, longitude);
    const userRef = firestore().collection('blind').doc(userId);

    await userRef.set({
      phonenumber: phone,
      language: language,
      location:geoPoint
    });

    ToastAndroid.show("Account Updated Successfully!", ToastAndroid.SHORT);

    await AsyncStorage.setItem('userId', userId);
    console.log('User ID saved successfully.');
    navigation.navigate("open");
  }
  
  return (
    <KeyboardAvoidingView>
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ backgroundColor: '#1F4A83', height: 800, marginTop: 150, width: 370, borderTopLeftRadius: 80, borderTopRightRadius: 80 }}>
        {/* color: colors.primary */}

        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 30, alignSelf: "center", marginTop: 70, color: 'white' }}>REGISTER</Text>
        
        
        <View style={{marginLeft:50 , marginTop:50, width :300 , flexDirection: "row", backgroundColor : "#1F4A83", alignItems: "center", height: 52, borderRadius: 22,  paddingLeft: 10}}>
    <MaterialIcons name= {"phone"} size = {18} color= {'white'} ></MaterialIcons>
    <TextInput placeholder= "Phone Number" value = {phone} onChangeText={setPhoneNumber} placeholderTextColor={'white'} style={{ fontSize:15, height: 48, width: 200, borderRadius: 50, color: 'white',  backgroundColor: "#1F4A83",  paddingTop: 15, paddingLeft: 10, fontFamily:"Poppins-Regular"}}>
    </TextInput>
  
    </View>
    <View style ={{ borderBottomWidth: 0.5, 
      borderColor:'#D5D8DC', width:250 ,  marginLeft:50,
       }}>
       </View>
       <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
       <MaterialIcons name= {"language"} size = {20} style = {{marginLeft:60  , position: 'absolute'}} color= {'white'} ></MaterialIcons>
       
   
       <SelectList
     
       setSelected={(val) => setLanguage(val)}
       data={data}
       save="value"
       closeicon={<MaterialIcons style={{ marginTop: 10, marginLeft: 7 }} name="clear" size={25} color={'white'}></MaterialIcons>}
       arrowicon={<Icon name="chevron-down" size={22} style={{ marginTop: 5 ,marginRight:55 }} color={'white'} />}
       searchicon={<Icon name="search-outline" style={{ marginBottom: 4 , marginRight:10, position: 'absolute' }} size={20} color={'white'} />}
       boxStyles={{
         width: 250, borderColor: '#1F4A83',
         borderRadius: 25 , marginLeft:55 ,  zIndex: 1
       }}
       placeholderTextColor={colors.primary}

       inputStyles={{
         fontSize: 17, color: 'white', fontFamily: "Poppins-Regular", marginTop: 2, marginLeft: 12
       }}
       backgroundColor='white'
       fontFamily='Poppins-SemiBold'
       dropdownTextStyles={{ fontSize: 15, color: "#1F4A83" }}
       dropdownStyles={{ height: 120, width: 250, marginLeft: 50, backgroundColor: 'white', borderColor: 'white' }}
       badgeTextStyles={{ fontfamily: 'Poppins-Regular', fontSize: 12 }}
       badgeStyles={{ backgroundColor: '#274116' }}
       labelStyles={{ fontSize: 2, fontFamily: 'Poppins-SemiBold' }}
       label="Categories"
     />
  
     </View>
     
     <View style ={{ borderBottomWidth: 0.5, 
      borderColor:'#D5D8DC', width:250 ,  marginLeft:50, marginTop:290, position:'absolute'
       }}>
       </View>

      
        {/* <TextField2 placeholder="Confirm Password" secureTextEntry={true} name="lock" onChangeText={setConfirmPassword} value={confirmPassword} /> */}

        <View style={{ marginTop: 440, marginLeft: 80, position: 'absolute' }}>

          <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 15, alignItems: "center", marginLeft: 30, marginTop: 0, height: 50, width: 140 }} onPress={() => SignUpAuth()}>
            <Text style={{ color: "#1F4A83", fontSize: 16, marginRight: 50, fontFamily: "Poppins-Black", marginTop: 15 , marginLeft:30 }}>Register</Text>

          </TouchableOpacity>
        </View>
       

      </View>
    </View>
    </KeyboardAvoidingView>
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
