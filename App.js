import React, { useEffect } from 'react';
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './src/login';
import Aboutus from './src/Aboutus';
import Open from './src/open';
import Profile from './src/Profile';
import Review from './src/review';
import Main from './src/main'
import BlindSignup from './src/blindsignup';
import SignUp from './src/signUp';
import EditProfile from './src/EditProfile'
import Verification from './src/verification'
import AdminNav from './src/AdminNav';
import Back5 from './src/back5';
import Gps from './src/gps';
import Splash from './src/splashScreen';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { colors } from './assets/constants/colors';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
import SplashScreen from './screens/splashscreen';
import Video from './screens/video';
import ContactsList from './src/ContactList';
import Contact from './src/Contact';
import VoiceOperations from "./src/Clock";
import messaging from "@react-native-firebase/messaging";
import notifee from '@notifee/react-native';
import Rev from './src/rev';
import { Alert } from 'react-native';
import Writtensignup from './src/writtensignup'
function onMessageReceived(message, navigation) {
  console.log("Notification data: ", message.data);
  notifee.displayNotification({
    title: "Incoming call",
    body: "Somebody needs your help",
    android: {
      channelId: 'volunteerhelp',
    },
  });
  navigation.navigate("Video", {token: message.data.roomID});
  // Alert.prompt("Incoming call", "Do you want to accept?", () => {

  // });
}

function Root({ navigation }) {

  useEffect(() => {
    messaging().onMessage((message) => onMessageReceived(message, navigation));
    messaging().setBackgroundMessageHandler((message) => onMessageReceived(message, navigation));
  }, []);
  
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        paddingVertical: 5,
        elevation: 20,
        backgroundColor: "white",
        position: "absolute",
        height: 60,
        paddingBottom: 6,
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Aboutus") {
          iconName = focused ? 'info' : 'info';
        }
        else if (route.name === "Profile") {
          iconName = focused ? 'person' : 'person';
        }
        else if (route.name === "Review") {
          iconName = focused ? 'star' : 'star';
        }
        return <MaterialIcons name={iconName} size={size} color={'#1F4A83'}></MaterialIcons>
      },
      tabBarActiveTintColor: '#1F4A83',
      tabBarInactiveTintColor: colors.grey,
    })}>

      <Tab.Screen name="Aboutus" component={Aboutus} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Review" component={Review} />
    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='main' >
      <Stack.Screen name="main" component={Main} 
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='open'>
        <Stack.Screen name="open" component={Open} />
        <Stack.Screen name="voiceOperations" component={VoiceOperations} />
        <Stack.Screen name="gps" component={Gps} />
        <Stack.Screen name="splashScreen" component={Splash} />
        <Stack.Screen name="blindsignup" component={BlindSignup} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="AdminNav" component={AdminNav} />
        <Stack.Screen name="back5" component={Back5} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Root" component={Root} />
        <Stack.Screen name='Video' component={Video}></Stack.Screen>
        <Stack.Screen name='ContactList' component={ContactsList}></Stack.Screen>
        <Stack.Screen name='Contact' component={Contact}></Stack.Screen>
        <Stack.Screen name='rev' component={Rev}></Stack.Screen>
        <Stack.Screen name='writtensignup' component={Writtensignup}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>


  );
}

