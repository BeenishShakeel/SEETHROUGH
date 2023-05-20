import React from "react";
import {View, Text, TextInput} from 'react-native';
import { colors } from "../assets/constants/colors";

export default function TextField3(props){
    return(
        <View style={{flexDirection : "row", marginLeft: 30}}>
        <View style = {{width: 80}}>
        <Text style={{marginVertical: 10, color: "#4D4D4D", fontSize: 14, paddingTop: 20, fontFamily: "Poppins-Regular"}}>{props.label}</Text>
        </View>
        <TextInput {...props} style={{borderBottomWidth:1,  marginLeft: 10,marginTop: 20 ,borderColor: colors.secondary, fontSize: 14, width: 220, fontFamily: "Poppins-Regular"}} />

        
      
      </View>
    );
}