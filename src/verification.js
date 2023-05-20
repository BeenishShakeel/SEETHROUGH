import React, {useState} from "react";
import {View, Text, StyleSheet , Image ,ToastAndroid} from "react-native";
import Background from "./background";
import Btn1 from "../assets/buttons/btn1";
import TextField from "./textField";
import { colors } from "../assets/constants/colors";


export default function SignUp({navigation}){
    return(
        <Background>
        <View>
            <TextField placeholder="Email" keyboardType="email-address" name="mail-outline"
                             />
        </View>
        </Background>
    )}