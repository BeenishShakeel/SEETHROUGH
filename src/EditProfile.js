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
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  
      function UpdateAddress(){
        if(newPassword===confirmNewPassword){
            var user = auth().currentUser;
                user.updatePassword(newPassword).then(() => {
                    ToastAndroid.show("Password Updated Successfully", ToastAndroid.SHORT) 
                    navigation.navigate("MyProfile")
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
                navigation.navigate("MyProfile")
            }
        ).catch((error)=> ToastAndroid.show(error.message, ToastAndroid.SHORT))
    }

    async function fetchData() {
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
      }
    
      useEffect(() => {
    
        fetchData();
      },
    
        []);
    return(
        <View style = {{flex:1}}>
        <Background2> 
            <View style = {{flexDirection:'row'}}>
            <Text style={{fontFamily: "Poppins-Bold", fontSize: 25, marginLeft:30, alignSelf:"center", marginTop :15,color:'white'}}>Update Profile</Text>
           <View style = {{flexDirection:'column'}}>
            <Icon name="log-out-outline" style={{ height: 50,marginTop:25, borderRadius:30, width: 50, marginLeft: 100 }}
          size={35} color={'white'} onPress={LogOut}/>
          <Text style = {{ marginLeft : 85 ,color:'white' , fontSize:15}}>
            LogOut
          </Text>
          </View>
          </View>
            <TextField2 placeholder="First Name" name="edit"   onChangeText={setFirstName} value={firstName}  />
            <TextField2 placeholder="Last Name" name="edit"  onChangeText={setLastName} value={lastName}/>
            <TextField2 placeholder="Email" keyboardType="numeric" name="mail-outline"  onChangeText={setEmail} value={email} />
            <TextField2 placeholder="Password"  keyboardType="email-address"  name="lock" secureTextEntry={true} onChangeText={setNewPassword} value={newPassword}/>
            <TextField2 placeholder="Confirm Password" secureTextEntry={true} name="lock" onChangeText={setconfirmNewPassword} value={confirmNewPassword}  />
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
              dropdownStyles={{height:150, backgroundColor: 'white' , borderColor:'white' }}
              badgeTextStyles={{ fontfamily: 'Poppins-Regular', fontSize: 14 }}
              badgeStyles={{ backgroundColor: '#274116' }}
              labelStyles={{ fontSize: 2, fontFamily: 'Poppins-SemiBold' }}
              label="Categories"
            />
           </View>
            {/* <TextField2 placeholder="Confirm Password" secureTextEntry={true} name="lock" onChangeText={setConfirmPassword} value={confirmPassword} /> */}
          
           <View style = {{marginTop :550, marginLeft:40, position: 'absolute'}}>
            <Btn1 btnLabel="Update"   onPress={UpdateAddress}                         
                        /> 
           </View>
          
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
