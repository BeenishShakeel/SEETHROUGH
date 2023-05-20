import React from "react";
import {TextInput, View} from 'react-native';
import { colors } from "../assets/constants/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function TextField(props){
  return(
    <View>
     <View style={{flexDirection: "row", backgroundColor : "white", alignItems: "center", height: 60, borderRadius: 25,  paddingLeft: 10, marginTop:10 }}>
 
    <MaterialIcons style ={{marginLeft:50}}name= {props.name} size = {20} color= {'#1F4A83'} ></MaterialIcons>
    
    <TextInput {...props} placeholderTextColor={'#1F4A83'} style={{fontSize:15, height: 58, width: 190, borderRadius: 20, color:'#1F4A83',  backgroundColor: "white",  paddingTop: 15, paddingLeft: 10, fontFamily:"Poppins-Regular"}}>
    </TextInput>
</View>
<View style ={{ borderBottomWidth: 0.5, 
  borderColor:'#1F4A83', width:280 ,  marginLeft:50,
   }}>
   </View>
   </View>
  
  );
}