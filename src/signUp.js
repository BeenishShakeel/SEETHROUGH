import React, {useState} from "react";
import {Text,View, StyleSheet,TouchableOpacity, ToastAndroid} from "react-native";
import Background2 from "./background2";
import Btn1 from "../assets/buttons/btn1";
import TextField2 from "./textField2";
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../assets/constants/colors";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
export default function SignUp({navigation}){
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
  
      function SignUpAuth(){
       
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
    return(
        <View style = {{flex:1}}>
        <Background2> 
        {/* color: colors.primary */}

            <Text style={{fontFamily: "Poppins-Bold", fontSize: 30, alignSelf:"center", marginTop :30,color:'white' }}>Sign Up</Text>
            <TextField2 placeholder="First Name" name="edit"   onChangeText={setFirstName} value={firstName}  />
            <TextField2 placeholder="Last Name" name="edit"  onChangeText={setLastName} value={lastName}/>
            <TextField2 placeholder="Email" keyboardType="numeric" name="mail-outline"  onChangeText={setEmail} value={email} />
            <TextField2 placeholder="Password"  keyboardType="email-address"  name="lock" secureTextEntry={true} onChangeText={setPassword} value={password}/>
            <TextField2 placeholder="Confirm Password" secureTextEntry={true} name="lock" onChangeText={setConfirmPassword} value={confirmPassword}  />
            <TextField2 placeholder="Phone Number"  name="phone"   onChangeText={setPhoneNumber} value={phoneNumber} 
            />
           <View style = {{zIndex: 1 , marginLeft:20, marginTop:17, backgroundColor:'white' , height:55, width:300,marginLeft:20, borderRadius:22}}>
            <SelectList
              setSelected={(val) =>  setLanguage(val)}
              data={data}
              save="value"
              arrowicon={<Icon name="chevron-down" size={22} style={{ marginTop: 5 }} color={colors.primary} />}
              searchicon={<Icon name="search-outline" style={{ marginBottom: 4 }} size={20} color={'#368BC1'} />}
              boxStyles={{
                width: 300, borderColor:'white',
                borderRadius: 25
              }}
              placeholderTextColor={colors.primary}
             
              inputStyles={{
                fontSize: 17, color: '#4863A0', fontFamily:"Poppins-Regular", marginTop: 2, marginLeft: 12
              }}
              backgroundColor='white'
              fontFamily='Poppins-SemiBold'
              dropdownTextStyles={{ fontSize: 20, color: "#368BC1" }}
              dropdownStyles={{ backgroundColor: 'white' , height:150, borderColor:'white' }}
              badgeTextStyles={{ fontfamily: 'Poppins-Regular', fontSize: 14 }}
              badgeStyles={{ backgroundColor: '#274116' }}
              labelStyles={{ fontSize: 2, fontFamily: 'Poppins-SemiBold' }}
              label="Categories"
            />
           </View>
            {/* <TextField2 placeholder="Confirm Password" secureTextEntry={true} name="lock" onChangeText={setConfirmPassword} value={confirmPassword} /> */}
          
           <View style = {{marginTop :550, marginLeft:40, position: 'absolute'}}>
            <Btn1 btnLabel="Sign Up"  onPress={()=>SignUpAuth()}
                           
                        /> 
           </View>
           {/* onPress={SignUpAuth} */}
           
        </Background2>
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
