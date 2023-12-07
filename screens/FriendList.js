import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Image, Pressable } from 'react-native';
import Tts from 'react-native-tts';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';

export default function FriendList({ navigation, route}) {

    useEffect(() => {
        Tts.speak("Do you want to add this volunteer in your contact list. double Tap on the top to say yes and double tap on the bottom to say no");
    }, [])


    const myContactList = async () => {
        console.log('in contact list')
        const userID = await AsyncStorage.getItem('userId');
        const vID = await AsyncStorage.getItem('id')
        console.log('blind DI ID',userID)
        firestore().collection('blind').doc(userID).update({
            contacts: firestore.FieldValue.arrayUnion(vID)
        });
        Tts.speak('contact added Successfully');
    }

    let timer = null;

    
    const TIMEOUT = 500;

    const debounce = async (operation, op) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
            switch (operation) {
                case 1: {
                    // add to contactlist
                    myContactList();
                    const userID = await AsyncStorage.getItem('id');
                    console.log("in list",userID);
                    navigation.navigate('rev',userID);
                }
                    break;
                case 2: {
                    // navigate back
                    navigation.navigate('rev',route.params.userID);
                    break;
                }
            }
        } else {
            clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                switch (op) {
                    case 1:
                        Tts.speak('Yes');
                        break;
                    case 2:
                        // turn camera off
                        Tts.speak('No');
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
                    <Text style={styles.text}>Yes</Text>
                </Pressable>
            </View>
            <View style={styles.parent}>
                <Pressable style={[styles.child, { backgroundColor: '#03045E' }]} onPress={() => {
                    debounce(2, 2);
                }}>
                    <Text style={styles.text}>No</Text>
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
        fontSize: 50,
        fontWeight: 'bold'
    }
})

