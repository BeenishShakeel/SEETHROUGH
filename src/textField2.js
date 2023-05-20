import React from "react";
import {TextInput, View} from 'react-native';
import { colors } from "../assets/constants/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function TextField(props){
  return(
    <View>
    <View style={{marginLeft:30 , width :300 , flexDirection: "row", backgroundColor : "#1F4A83", alignItems: "center", height: 52, borderRadius: 22,  paddingLeft: 10 , marginTop:5}}>
    <MaterialIcons name= {props.name} size = {18} color= {'white'} ></MaterialIcons>
    <TextInput {...props} placeholderTextColor={'white'} style={{ fontSize:15, height: 48, width: 250, borderRadius: 50, color: 'white',  backgroundColor: "#1F4A83",  paddingTop: 15, paddingLeft: 10, fontFamily:"Poppins-Regular"}}>
    </TextInput>
  
    </View>
    <View style ={{ borderBottomWidth: 0.5, 
      borderColor:'#D5D8DC', width:300 ,  marginLeft:30,
       }}>
       </View>
       </View>
  );
}