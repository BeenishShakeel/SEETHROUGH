import React from "react";
import {TextInput, View} from 'react-native';
import { colors } from "../assets/constants/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function TextField(props){
  return(
    <View style={{marginLeft:23 , width :300 , flexDirection: "row", backgroundColor : "white", alignItems: "center", height: 52, borderRadius: 22, elevation: 4, paddingLeft: 10, marginTop: 15}}>
    <MaterialIcons name= {props.name} size = {18} color= {colors.primary} ></MaterialIcons>
    <TextInput {...props} placeholderTextColor={colors.primary} style={{ fontSize:15, height: 48, width: 250, borderRadius: 50, color: colors.primary,  backgroundColor: "white",  paddingTop: 15, paddingLeft: 10, fontFamily:"Poppins-Regular"}}>
    </TextInput>
    </View>
  );
}