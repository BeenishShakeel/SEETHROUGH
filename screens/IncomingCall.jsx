import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Linking,
} from 'react-native';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/MaterialIcons';

const image = {uri: 'https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30506.jpg'};
const ringtone = new Sound(require("../assets/ringtone.mp3"));

const IncomingCall = ({callerName, rating, onAccept, onDecline}) => {

  useEffect(() => {
    ringtone.setNumberOfLoops(-1).play();
    return () => {
      ringtone.stop();
    }
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.callerInfo}>
          <Text style={styles.callerName}>{callerName}</Text>
          <Text style={styles.rating}>
            <Icon name="star" size={30} color="white" />
            {rating}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={onAccept}
          >
            <Icon name="call" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.declineButton]}
            onPress={onDecline}>
            <Icon name="call-end" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const BUTTON_SIZE = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  callerInfo: {
    marginBottom: 40,
    alignItems: 'center',
  },
  callerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  rating: {
    fontSize: 24,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    marginHorizontal: 20,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
  },
  acceptButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  declineButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  }
});

export default IncomingCall;
