import React, {useState} from "react";
import {View, Text, StyleSheet , Image ,ToastAndroid} from "react-native";
import Background from "./background";
import Btn1 from "../assets/buttons/btn1";
import TextField from "./textField";
import { colors } from "../assets/constants/colors";
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Login({navigation}){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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
        <Background> 
          
        <View style = {{position:'relative'}}>
            <Text style={{fontFamily: "Poppins-Bold", fontSize: 32, alignSelf:"center", color: 'white'}}>Sign In</Text>
            <TextField placeholder="Email" keyboardType="email-address" name="mail-outline" onChangeText={setEmail} value={email} />
            <TextField placeholder="Password" secureTextEntry={true} name="lock" onChangeText={setPassword} value={password} />
            <Btn1 btnLabel="Log In"   onPress={()=>LoginAuth()} />
            <View style={{flexDirection: "row", alignContent: "center", justifyContent: "center", paddingTop : 25}}>
                <Text style={{color: 'white', fontFamily:"Poppins-Regular" , fontSize : 17}}> Don't have an account?
                <Text style={{textDecorationLine: "underline", fontFamily:"Poppins-Regular"}} onPress={()=> navigation.navigate("SignUp")}>  Sign Up</Text> </Text>
            </View>
            </View>
        </Background>
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

