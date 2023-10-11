import React, {useState , useEffect} from "react";
import {Text,View, StyleSheet,TouchableOpacity, ToastAndroid} from "react-native";
import Background2 from "./background2";
import Btn1 from "../assets/buttons/btn1";
import TextField2 from "./textField2";
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../assets/constants/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS } from '@react-native-permissions'; // Import the necessary functions
export default function SignUp({navigation}){
    const [language, setLanguage] = React.useState();
    const [location, setLocation] = useState(null);
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
      const [rating , setRating] = useState(0.0)
    
  useEffect(() => {

    
    
        Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log(position);
              setLocation({ latitude, longitude });
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      
  },

    []);
      

     

      
      function SignUpAuth() {
        if (password === confirmPassword) {
            const randomRating = Math.floor(Math.random() * 11); 
             const rating = (randomRating * 0.5).toFixed(1);
          auth()
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
              const userRef = firestore().collection('users').doc(response.user.uid);
      
              userRef
                .set({
                  firstName: firstName,
                  lastName: lastName,
                  phoneNumber: phoneNumber,
                  email: email,
                  language: language,
                  rating: rating,
                  location: location,
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
      /*function SignUpAuth(){
       
          if(password===confirmPassword){
        
              auth().createUserWithEmailAndPassword(email, password).
               then((response) => {
                  database().ref(`/users/${response.user.uid}`).set({
                  firstName : firstName,
                  lastName : lastName,
                  phoneNumber : phoneNumber,
                  email: email,
                  language:language
  
              }).then((res) => {
                  ToastAndroid.show("User Created Successfully", ToastAndroid.SHORT)
                  navigation.navigate("Login")
              })
              }).
              
          catch((error) => {
              ToastAndroid.show(error.message, ToastAndroid.SHORT);
              console.log("Error : ", error.message)
          })
      }
      else{
          ToastAndroid.show("Your Password doesn't match!", ToastAndroid.SHORT);
      }
      }
      */
    return(
        <View style = {{flex: 1 ,  backgroundColor:'white'}}>
        <View style = {{backgroundColor:'#1F4A83' , height:1000 , marginTop:60, width:370, borderTopLeftRadius:80 ,borderTopRightRadius:80}}>
        {/* color: colors.primary */}

            <Text style={{fontFamily: "Poppins-SemiBold", fontSize: 30, alignSelf:"center", marginTop :30,color:'white' }}>REGISTER</Text>
            <TextField2 placeholder="First Name" name="edit"   onChangeText={setFirstName} value={firstName}  />
            <TextField2 placeholder="Last Name" name="edit"  onChangeText={setLastName} value={lastName}/>
            <TextField2 placeholder="Email" keyboardType="numeric" name="mail-outline"  onChangeText={setEmail} value={email} />
            <TextField2 placeholder="Password"  keyboardType="email-address"  name="lock" secureTextEntry={true} onChangeText={setPassword} value={password}/>
            <TextField2 placeholder="Confirm Password" secureTextEntry={true} name="lock" onChangeText={setConfirmPassword} value={confirmPassword}  />
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
          
            <View style = {{marginTop :540, marginLeft:80, position: 'absolute'}}>
           
            <TouchableOpacity style={{backgroundColor:'white', borderTopLeftRadius:100, alignItems: "center", marginLeft:180, marginTop: 40, height: 80, width: 170}} onPress={()=>SignUpAuth()}>
            <Text style={{color: "#1F4A83", fontSize: 20, marginRight:50,  fontFamily: "Poppins-Black" , marginTop:25}}>Register</Text>
          
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
