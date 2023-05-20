import React, {useState,  useEffect} from "react";
import {View, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet , Image ,ToastAndroid} from "react-native";
import Background from "./background";
import Btn1 from "../assets/buttons/btn1";
import TextField from "./textField";
import { colors } from "../assets/constants/colors";
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login({navigation}){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

   const signIn = async () => {
        try {
            console.log("click")
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          this.setState({ userInfo });
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      };

    function LoginAuth(){
        auth().signInWithEmailAndPassword(email, password).
         then (async(response)=> {
            try {
                await AsyncStorage.setItem("uid", response.user.uid).then(
                    ()=> {ToastAndroid.show("Logged In", ToastAndroid.SHORT)
                    if (email=="admin@gmail.com" && password=="admin123"){
                        navigation.navigate("AdminNav");
                    }
                    else{
                        navigation.navigate("Root");
                    }
                })
              } catch (error) {
                console.log(error);
              }       
         }).
          catch((error)=> {ToastAndroid.show(error.message, ToastAndroid.SHORT)})
     }
   

    return(
        <View style = {{flex : 1 , backgroundColor:'#1F4A83'}}>
        <KeyboardAvoidingView>
        <View style = {{  backgroundColor:'white'}}>
        <View style = {{backgroundColor:'#1F4A83' , height:200 ,  width:370, borderBottomLeftRadius:100}}></View>
     <View style = {{backgroundColor:'#1F4A83'}}>
        <View style = {{ backgroundColor:'white' , borderTopRightRadius:80 , height:800}}>
            <Text style={{fontFamily: "Poppins-BoldItalic", marginBottom:20, fontSize: 32, alignSelf:"center", color: '#1F4A83', marginTop:50}}>LOGIN</Text>
         
            <TextField placeholder="Email" keyboardType="email-address" name="mail-outline" onChangeText={setEmail} value={email} />
             <TextField placeholder="Password" secureTextEntry={true} name="lock" onChangeText={setPassword} value={password} /> 
            <TouchableOpacity style={{backgroundColor:'#1F4A83', borderRadius: 10, justifyContent: "center", alignItems: "center", marginLeft:120, marginTop: 40, height: 49, width: 130}} onPress={()=>LoginAuth()} >
      <Text style={{color: "white", fontSize: 20,  fontFamily: "Poppins-SemiBold"}}> Login </Text>
      </TouchableOpacity>
 

            <View style={{flexDirection: "row", alignContent: "center", justifyContent: "center", paddingTop : 25}}>
                <Text style={{color: '#1F4A83', fontFamily:"Poppins-Regular" , fontSize : 16}}> Don't have an account?
                <Text style={{color:'#F96E69',textDecorationLine: "underline", marginLeft:2, fontSize:19,fontFamily:"Poppins-Bold"}} onPress={()=> navigation.navigate("SignUp")}>  Sign Up</Text> </Text>
            </View>
            </View>
            </View>
            </View>
            </KeyboardAvoidingView>
        
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

