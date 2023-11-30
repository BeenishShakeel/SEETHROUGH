import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Image, Pressable } from 'react-native';
import Tts from 'react-native-tts';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Main1({ navigation }) {
    useEffect(()=>{
        getuserid()
       
    })
    const getuserid =  async () =>
    {
        try {
            const userString =  await AsyncStorage.getItem('userId');
            const value = await AsyncStorage.getItem('check');
            console.log("blindid" + userString)
            console.log("userud" + value)
            console.log(userString)
            if (userString !== null) {
               navigation.navigate('open');
            }
            if(userString === null){
                console.log('User ID:', userString);
                Tts.speak('Double on the bottom of the screen to signup as a blind');
            }
            if(value !== null)
            {
                console.log("hy")
                navigation.navigate('Login')
            }
        }
        catch (error) {
            console.error(error);
          }
    }

    const myContactList = async () => {
        const userID = await AsyncStorage.getItem('userId');
        firestore().collection('blind').doc(userID).update({
            contacts: firestore.FieldValue.arrayUnion(route.params.userID)
        });
        Tts.speak('contact added Successfully');
    }

    let timer = null;
    const TIMEOUT = 500;

    const debounce = (operation, op) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
            switch (operation) {
                case 1: {
                    navigation.navigate('splashScreen',{role:'volunteer'});
                    break;
                }
                case 2: {
                    // navigate back
                    navigation.navigate('open',{role:'Blind'});
                    break;
                }
            }
        } else {
            clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                switch (op) {
                    case 1:
                        Tts.speak('signup as a volunteer');
                        break;
                    case 2:
                        // turn camera off
                        Tts.speak('Signup as a blind');
                        break;
                }
            }, TIMEOUT);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.parent}>
                <Pressable style={[styles.child, { backgroundColor: '#023E8A' }]} onPress={() => {
                    debounce(1, 1);
                }}>
                    <Text style={styles.text}>SignUp as a Volunteer</Text>
                </Pressable>
            </View>
            <View style={styles.parent}>
                <Pressable style={[styles.child, { backgroundColor: '#03045E' }]} onPress={() => {
                    debounce(2, 2);
                }}>
                    <Text style={styles.text}>SignUp as a Blind </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    parent: {
        width: '96%',
        height: '50%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        display: 'flex',
        backgroundColor: 'white',
        margin: '1%'

    },
    child: {
        width: '100%',
        height: '100%',
        margin: '1%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text:
    {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    }
})

