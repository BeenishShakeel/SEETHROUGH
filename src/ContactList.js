import React, {useEffect, useState} from 'react';
import {FlatList, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Contacts from 'react-native-contacts';
import Contact from '../src/Contact';
import Voice from '@react-native-voice/voice';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

const ContactsList = ({navigation}) => {
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    Contacts.getAll().then(contacts => {
      setContacts(contacts);
    });
    
      Voice.onSpeechStart = onSpeechStartHandler;
      Voice.onSpeechEnd = onSpeechEndHandler;
      Voice.onSpeechResults = onSpeechResultsHandler;
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    }, []);


    const onSpeechStartHandler = (e) => {
      console.log('start handler');
    }
  
    const onSpeechEndHandler = (e) => {
      console.log('end handler');
    }
  
    const onSpeechResultsHandler = (e) => {
      console.log(e);
      if (e.value.length > 0) {
        if(e.value[0].includes(`call`)) {
          let name = e.value[0].substring(5);
          let contact = contacts.find((contact) => contact?.givenName[0]).toLowerCase().indexOf(name.toLowerCase());
          console.log(contact);
          if(contact != -1){
              RNImmediatePhoneCall.immediatePhoneCall(contacts[contact].number);
          }
        }
        else {
          detectIntentText(e.value[0], lat, long);
        }
      }
    }



  const keyExtractor = (item, idx) => {
    return item?.recordID?.toString() || idx.toString();
  };
  const renderItem = ({item, index}) => {
    return <Contact contact={item} />;
  };
  return (
    <FlatList
      data={contacts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={styles.list}
    />
  );
};
const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
export default ContactsList;