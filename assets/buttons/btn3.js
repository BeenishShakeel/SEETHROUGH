import React from "react";
import {View, Text,TouchableOpacity} from 'react-native';
import { colors } from "../constants/colors";

export default function Btn3(props){
    return(
      <TouchableOpacity style={{backgroundColor:colors.primary, borderRadius: 30, justifyContent: "center", alignItems: "center",alignSelf: "center",marginTop: 50, height: 60, width: 300}} onPress={props.onPress}>
      <Text style={{ marginLeft:120, width:200 , color: "white", fontSize: 20,  fontFamily: "Poppins-SemiBold", alignSelf: "center"}}>{props.btnLabel}</Text>
      </TouchableOpacity>
      
    );
  }