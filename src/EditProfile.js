import React, {useState, useEffect} from "react";
import {Text,View, StyleSheet,TouchableOpacity, ToastAndroid} from "react-native";
import Background2 from "./background2";
import Btn1 from "../assets/buttons/btn1";
import TextField2 from "./textField2";
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../assets/constants/colors";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
export default function EditProfile({navigation}){
    const [language, setLanguage] = React.useState();
    const data = [
        { key: '1', value: 'Urdu' },
        { key: '2', value: 'English' },
        { key: '3', value: 'French' }
      ];
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
      const [confirmPassword, setConfirmPassword] = useState('')
      const [firstName, setFirstName] = useState('')
      const [lastName, setLastName] = useState('')
      const [phoneNumber, setPhoneNumber] = useState('')
      const [newPassword, setNewPassword] = useState('');
      const [confirmNewPassword, setconfirmNewPassword] = useState('');
      const [test, setTest] = useState(false);
      const [userId, setUserId] = useState("");
      function LogOut(){
        auth().signOut().then(() => {
          ToastAndroid.show("Signed Out!", ToastAndroid.SHORT)
          navigation.navigate("Login")
        });
      }
     

async function UpdateAddress() {
  if (newPassword === confirmNewPassword) {
    try {
      const user = auth().currentUser;
      await user.updatePassword(newPassword);

      ToastAndroid.show("Password Updated Successfully", ToastAndroid.SHORT);
      navigation.navigate("Profile");
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  } else {
    ToastAndroid.show("Passwords do not match!", ToastAndroid.SHORT);
  }

  // Update the user's data in Firestore
  try {
    await firestore().collection('users').doc(userId).update({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      language: language,
    });

    ToastAndroid.show("Account Updated Successfully!", ToastAndroid.SHORT);
    setTest(true);
    navigation.navigate("Profile");
  } catch (error) {
    ToastAndroid.show(error.message, ToastAndroid.SHORT);
  }
}

  
  /*    function UpdateAddress(){
        if(newPassword===confirmNewPassword){
            var user = auth().currentUser;
                user.updatePassword(newPassword).then(() => {
                    ToastAndroid.show("Password Updated Successfully", ToastAndroid.SHORT) 
                    navigation.navigate("Profile")
                }).catch((error) => {  ToastAndroid.show(error.message, ToastAndroid.SHORT) });
        }
        else{
            ToastAndroid.show("Passwords do not match!", ToastAndroid.SHORT)
        }
        database().ref(`/users/${userId}`).
        update({firstName:firstName,lastName:lastName,email: email,  phoneNumber:phoneNumber,language:language}).
        then(
            ()=> {
                ToastAndroid.show("Account Updated Successfully!", ToastAndroid.SHORT)
                setTest(true)
                navigation.navigate("Profile")
            }
        ).catch((error)=> ToastAndroid.show(error.message, ToastAndroid.SHORT))
    }*/
   

    async function fetchData() {
      try {
        const value = await AsyncStorage.getItem("uid");
    
        if (value !== null) {
          setUserId(value);
    
          // Use Firestore to fetch user data based on the user's UID
          firestore()
            .collection('users')
            .doc(value)
            .get()
            .then((documentSnapshot) => {
              if (documentSnapshot.exists) {
                const userData = documentSnapshot.data();
    
                if (userData) {
                  const { firstName, lastName, email, language, phoneNumber } = userData;
                  setFirstName(firstName);
                  setLastName(lastName);
                  setEmail(email);
                  setPhoneNumber(phoneNumber);
                  setLanguage(language);
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } catch (error) {
        console.log(error);
      }
    }
    
   /* async function fetchData() {
        try {
          const value = await AsyncStorage.getItem("uid")
          if (value !== null) {
            setUserId(value);
            database().ref(`/users/${value}`).once("value").then(snapshot => {
              let firstname = snapshot.val().firstName
              let lastname   = snapshot.val().lastName
              let email = snapshot.val().email 
              let language =  snapshot.val().language
              let phoneNumber = snapshot.val().phoneNumber 
              setFirstName(firstname)
              setLastName(lastname)
              setEmail(email)
              setPhoneNumber(phoneNumber)
              setLanguage(language)
            })
          }
        }
        catch (error) {
          console.log(error)
        }
      }*/
    
      useEffect(() => {
    
        fetchData();
      },
    
        []);
    return(
        <View style = {{flex: 1 ,  backgroundColor:'white'}}>
        <View style = {{backgroundColor:'#1F4A83' , height:1000 , marginTop:70, width:370, borderTopLeftRadius:80 ,borderTopRightRadius:80}}>
        {/* color: colors.primary */}

            <Text style={{fontFamily: "Poppins-SemiBold", fontSize: 30, alignSelf:"center", marginTop :30,color:'white' }}>Update Profile</Text>
            <TextField2 placeholder="First Name" name="edit"   onChangeText={setFirstName} value={firstName}  />
            <TextField2 placeholder="Last Name" name="edit"  onChangeText={setLastName} value={lastName}/>
            <TextField2 placeholder="Email" keyboardType="numeric" name="mail-outline"  onChangeText={setEmail} value={email} />
            <TextField2 placeholder="Password"  keyboardType="email-address"  name="lock" secureTextEntry={true} onChangeText={setNewPassword} value={newPassword}/>
            <TextField2 placeholder="Confirm Password" secureTextEntry={true} name="lock" onChangeText={setconfirmNewPassword} value={confirmNewPassword}  />
            <TextField2 placeholder="Phone Number"  name="phone"   onChangeText={setPhoneNumber} value={phoneNumber} 
            />
      
            <SelectList
            setSelected={(val) =>  setLanguage(val)}
            data={data}
            save="value"
            closeicon={ <MaterialIcons  style = {{marginTop:10 ,marginLeft:7}} name="clear" size = {25} color= {'white'}></MaterialIcons>}
            arrowicon={<Icon name="chevron-down" size={22} style={{ marginTop: 5}} color={'white'} />}
            searchicon={<Icon name="search-outline" style={{ marginBottom: 4 }} size={20} color={'white'} />}
            boxStyles={{
              width: 250, borderColor:'#1F4A83',
              borderRadius: 25 , marginTop:17 , marginLeft:18
            }}
            placeholderTextColor={colors.primary}
           
            inputStyles={{
              fontSize: 17, color: 'white', fontFamily:"Poppins-Regular", marginTop: 2, marginLeft: 12
            }}
            backgroundColor='white'
            fontFamily='Poppins-SemiBold'
            dropdownTextStyles={{ fontSize: 15, color: "#1F4A83" }}
            dropdownStyles={{height:120,width:250, marginLeft:20, backgroundColor: 'white' , borderColor:'white' }}
            badgeTextStyles={{ fontfamily: 'Poppins-Regular', fontSize: 12 }}
            badgeStyles={{ backgroundColor: '#274116' }}
            labelStyles={{ fontSize: 2, fontFamily: 'Poppins-SemiBold' }}
            label="Categories"
          />
            {/* <TextField2 placeholder="Confirm Password" secureTextEntry={true} name="lock" onChangeText={setConfirmPassword} value={confirmPassword} /> */}
          
            <View style = {{marginTop :500, marginLeft:100, position: 'absolute'}}>
           
            <TouchableOpacity style={{backgroundColor:'white', borderTopLeftRadius:100, alignItems: "center", marginLeft:180, marginTop: 40, height: 80, width: 170}} onPress={UpdateAddress}>
            <Text style={{color: "#1F4A83", fontSize: 18, marginRight:70,  fontFamily: "Poppins-ExtraBold" , marginTop:25}}>Update</Text>
          
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
        marginLeft:40,
        borderRadius: 13,
    }
});
