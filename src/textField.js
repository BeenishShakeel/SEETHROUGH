import React from "react";
import {TextInput, View} from 'react-native';
import { colors } from "../assets/constants/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function TextField(props){
  return(
    <View style={{flexDirection: "row", backgroundColor : "white", alignItems: "center", height: 58, borderRadius: 25, elevation: 4, paddingLeft: 10, marginTop: 30}}>
    <MaterialIcons style ={{marginLeft:10}}name= {props.name} size = {20} color= {colors.primary} ></MaterialIcons>
    <TextInput {...props} placeholderTextColor={colors.primary} style={{fontSize:15, height: 58, width: 270, borderRadius: 20, color: colors.primary,  backgroundColor: "white",  paddingTop: 15, paddingLeft: 10, fontFamily:"Poppins-Regular"}}>
    </TextInput>
    </View>
  );
}