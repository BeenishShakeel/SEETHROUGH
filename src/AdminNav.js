import React from 'react';
import {NavigationContainer, TabActions} from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './homescreen';
import Userdetail from './userdetail';


export default function AdminNav({navigation}){

    const Stack = createStackNavigator();

    return(
        <NavigationContainer independent>
        <Stack.Navigator initialRouteName = 'splashScreen'>
          
           <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }} ></Stack.Screen>
             
            <Stack.Screen
            name="Userdetail"
            component={Userdetail}
            options={{ headerShown: false }}></Stack.Screen>
             
             </Stack.Navigator>
      </NavigationContainer>
    );
}