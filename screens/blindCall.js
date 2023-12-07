import React, { Component, useRef, useState, useEffect } from 'react';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo
} from 'react-native-twilio-video-webrtc';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Share,
  Pressable
} from 'react-native';
import Tts from 'react-native-tts';
import firestore from '@react-native-firebase/firestore';


// import axios from 'axios';
// import auth from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';

const BlindVideo = ({ navigation, route }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState(route.params.token);
  const [isAnswer, setIsAnswer] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isActive, setIsActive] = useState("");
  const twilioRef = useRef(null);

  let timer = null;
  const TIMEOUT = 500;

  useEffect(() => {
    _onConnectButtonPress();
  }, []);

  const debounce = (operation, op) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      switch (operation) {
        case 1:
          // switch camera
          _onFlipButtonPress();
          break;
        case 2:
          // turn camera off
          _onOffCameraFeed(false);
          break;
        case 3:
          _onMuteButtonPress();
          break;
        case 4:
          _onEndButtonPress(true);
          break;
        default: 
          console.log("Do nothing");
      }
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        switch (op) {
          case 1:
            Tts.speak('Switch Camera');
            break;
          case 2:
            // turn camera off
            Tts.speak('OFF camera');
            break;
          case 3:
            Tts.speak('Mute');
            break;
          case 4:
            Tts.speak('End Call');
            break;
        }
      }, TIMEOUT);
    }
  };


  const _onOffCameraFeed = event => {
    console.log("off feed...");
    twilioRef.current.setLocalVideoEnabled(!isVideoEnabled)
      .then(isEnabled => {
        console.log("isEnabled: ", isEnabled);
        setIsVideoEnabled(isEnabled);
      });
  };
  const _onConnectButtonPress = () => {
    twilioRef.current.connect({ accessToken: token });
    // Tts.speak('Searching the volunteer');
    setStatus('connecting');
  }

  const _onEndButtonPress = () => {
    // Tts.speak("Do you really want to end the call. doubletap again to confirm");
    console.log("ending...");
    twilioRef.current.disconnect();
  };

  const _onMuteButtonPress = () => {
    console.log("muting...");
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then(isEnabled => setIsAudioEnabled(!isAudioEnabled));
  };

  const _onFlipButtonPress = () => {

    console.log("switching...");
    twilioRef.current.flipCamera();
  };

  const disconnectRoom = () => {
    twilioRef.current.disconnect();
    navigation.navigate('FriendList',{userID: route.params.userID});
  }



  const _onRoomDidConnect = ({ roomName, error }) => {
    console.log('onRoomDidConnect: ', roomName);
    Tts.speak('Room connected successfully')
    setStatus('connected');
    firestore().collection('users').doc(route.params.userID).update({ isEngaged: true });
  };

  const _onRoomDidDisconnect = async ({ roomName, error }) => {
    console.log('[Disconnect]ERROR: ', error);
    setStatus('disconnected');
    Tts.speak('Room disconnected');
    firestore().collection('users').doc(route.params.userID).update({ isEngaged: false });
    //Voice.onSpeechResults = onSpeechResultsHandler;
    //Tts.speak("Double tap on the screen to add the volunteer in your contactlist (10sec) or 2 buttons");
    //setTimeout(() => Voice.start(), 12000);
    // 
    // Tts.speak('contact added successfully');
    // navigation.navigate('rev');
    // navigation.goBack();
    navigation.navigate('FriendList',{userID: route.params.userID});
  };

  const _onRoomDidFailToConnect = error => {
    console.log('[FailToConnect]ERROR: ', error);

    //setStatus('disconnected');
    // Tts.speak('Room disconnected');
    firestore().collection('users').doc(route.params.userID).update({ isEngaged: false })
    navigation.goBack();
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);

    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ]),
    );
  };

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track);
    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);
    setVideoTracks(videoTracksLocal);
  };
  return (
    <View style={styles.container}>
      {
        status === 'disconnected' &&
        <View>
          <Text style={styles.welcome}>
            React Native Twilio Video
          </Text>
          <TextInput
            style={styles.input}
            autoCapitalize='none'
            value={token}
            onChangeText={(text) => setToken(text)}>
          </TextInput>
          <Button
            title="Connect"
            style={styles.button}
            onPress={_onConnectButtonPress}>
          </Button>
        </View>
      }

      {
        (status === 'connected' || status === 'connecting') &&
        <View style={styles.callContainer}>
          {
            status === 'connected' &&
            <View style={styles.remoteGrid}>
              {
                Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                  return (

                    <TwilioVideoParticipantView
                      style={styles.remoteVideo}
                      key={trackSid}
                      trackIdentifier={trackIdentifier}
                    />

                  )
                })
              }
            </View>
          }
          <View style={styles.parent}>
            <Pressable
              style={[styles.child,{  backgroundColor: '#023E8A'}]}
              onPress={() => {
                debounce(1, 1);
              }}>
              <Text style={{
                color: 'white', fontSize: 24
              }}>Switch Camera</Text>
            </Pressable>
            <Pressable
              style={[styles.child,{ backgroundColor: '#023E8A'}]}
              onPress={() => {
                debounce(2, 2);
              }}>
              <Text style={{
                color: 'white', fontSize: 24
              }}>Off Camera</Text>
            </Pressable>
          </View>
          <View style={styles.parent}>
            <Pressable  style={[styles.child,  {backgroundColor: '#023E8A'}]} onPress={() => {
              debounce(3, 3);
            }}>
              <Text style={{
                color: 'white', fontSize: 24
              }}>Mute</Text>
            </Pressable>
            <Pressable  style={[styles.child,{ backgroundColor: '#023E8A'}]} onPress={() => {
              debounce(4, 4);
            }}>
              <Text style={{
                color: 'white', fontSize: 24
              }}>End Call</Text>
            </Pressable>
          </View>
        </View>
      }

      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
        onRoomParticipantDidDisconnect={disconnectRoom}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    color: "black"
  },
  callContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    color: "black"
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 40,
    color: "black"
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: "center",
    backgroundColor: "white",
    color: "black"
  },
  button: {
    marginTop: 100,
    color: "black"
  },
  localVideo: {
    flex: 1,
    width: 125,
    height: 200,
    position: "absolute",
    right: 10,
    bottom: 400,
    borderRadius: 2,
    borderColor: '#4e4e4e',
    color: "black"
  },
  remoteGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    color: "black"
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    color: "black"
  },
  parent: {
    width: '100%',
    height: '50%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    display: 'flex',
    margin:'1%'
  },
  child: {
    width: '47%',
    height: '100%',
    margin: '1%',
    alignItems: 'center',
    justifyContent:'center'
  }
});

export default BlindVideo;