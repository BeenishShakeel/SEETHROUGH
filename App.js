import React, { useCallback, useEffect } from 'react';
import { Text, Linking, AppState } from 'react-native';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
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
import Video from './screens/video';
import ContactsList from './src/ContactList';
import Contact from './src/Contact';
import VoiceOperations from "./src/Clock";
import Rev from './src/rev';
import imageScreen from './screens/imageScreen';
import { Alert } from 'react-native';
import BlindVideo from './screens/blindCall';
import FriendList from './screens/FriendList';
import Writtensignup from './src/writtensignup'
import IncomingCall from "./screens/IncomingCall";
import messaging from '@react-native-firebase/messaging';
import { useState } from 'react';


function Root({ navigation }) {

  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [caller, setCaller] = useState(null);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(onMessageReceived);
    return unsubscribe;
  }, [onMessageReceived]);

  useEffect(() => {
    Linking.addEventListener("url", event => {
      if(event.url) {
        const token = event.url.split("/")[3];
        const blindName = event.url.split("/")[4];
        setCaller({
          name: blindName,
          roomID: token
        });
        setShowIncomingCall(true);
      }
    });
    // Linking.getInitialURL().then(url => {
    //   if(url) {
    //     const token = url.split("/")[3];
    //     setCaller({
    //       name: "Ali Taimoor",
    //       rating: 4.8,
    //       roomID: token
    //     });
    //     setShowIncomingCall(true);
    //   }
    // })
    // .catch(err => console.error(err));
  }, []);

  const onMessageReceived = (message) => {
    setCaller({
      name: "Ali Taimoor",
      rating: 4.8,
      roomID: message.data.roomID
    });
    setShowIncomingCall(true);
  }

  const declineCall = useCallback(() => {
    setShowIncomingCall(false);
    setCaller(null);
  });

  const acceptCall = useCallback(() => {
    navigation.navigate("Video", { token: caller.roomID });
    setShowIncomingCall(false);
    setCaller(null);
  }, [caller]);

  if (showIncomingCall) {
    return <IncomingCall callerName={caller.name} rating={caller.rating} onDecline={declineCall} onAccept={acceptCall} />
  }

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

const linking = {
  prefixes: ["helpify://"],
  config: {
    initialRouteName: "Root",
    screens: {
      Root: 'Root/:token/:name'
    }
  }
};

export default function App() {
  
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='main' >
        <Stack.Screen name="main" component={Main} />
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
        <Stack.Screen name='IncomingCall' component={IncomingCall} />
        <Stack.Screen name='imageScreen' component={imageScreen}></Stack.Screen>
        <Stack.Screen name='BlindVideo' component={BlindVideo}></Stack.Screen>
        <Stack.Screen name='FriendList' component={FriendList}></Stack.Screen>
        <Stack.Screen name='writtensignup' component={Writtensignup}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

