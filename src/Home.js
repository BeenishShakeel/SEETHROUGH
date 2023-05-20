import React, {useState} from "react";
import {View, Text, StyleSheet , Image ,ToastAndroid} from "react-native";
import Background from "./background";
import Btn1 from "../assets/buttons/btn1";
import TextField from "./textField";
import { colors } from "../assets/constants/colors";



export default function Home({navigation}){
    return(
        <View style={{ marginTop: 25, flexDirection: 'row' }}>
        <Image
          style={{ marginLeft: 20, borderRadius: 10, marginTop: 2, width: 65, height: 65 }}
          source={require('../assets/images/logopic.jpg')}
        />
        <View style={{ marginTop: 2, flexDirection: 'column' }}>

          <Text style={{ fontFamily: 'Poppins-Medium', color: '#274116', fontSize: 12, marginTop: 10, marginLeft: 10 }}>
            Good Morning
          </Text>
          <Text style={{ fontFamily: 'Poppins-Medium', color: '#274116', fontSize: 16, marginLeft: 10 }}>
            {name}
          </Text>
        </View>

      

      <View style={{ marginTop: 10, marginLeft: 15 }} >
        <Searchbar

          placeholder="Search Category or restaurant" style={{ borderRadius: 67, width: 360, fontSize: 15, backgroundColor: "white" }} placeholderTextColor={'grey'} iconColor='green' value = {filter} onChangeText = {setFilter} onSubmitEditing = {fetchData}/>
      </View>
      </View>
    
    )
}