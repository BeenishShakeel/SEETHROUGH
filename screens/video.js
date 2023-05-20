import React, { Component, useRef , useState} from 'react';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo
} from 'react-native-twilio-video-webrtc';
import{
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Button
    } from 'react-native';

const Video = ({navigation}) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2Y1MThkMmY4MTk5MWY2NTY2NDFiMDAyYzY3MzQ5MmY4LTE2NzYzODAwMjIiLCJpc3MiOiJTS2Y1MThkMmY4MTk5MWY2NTY2NDFiMDAyYzY3MzQ5MmY4Iiwic3ViIjoiQUM2YjNmZDNkMGIyYzMyMGNmNTFkNGUxYjBhNTAxOTcyZiIsImV4cCI6MTY3NjM4MzYyMiwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiQmVlbmlzaCBTaGFrZWVsIiwidmlkZW8iOnsicm9vbSI6IkJ1bnR5LVNoYWtlZWwifX19._a-0Z4uH2_hNAATdx6hK1RBIJ27XP0kkLZNCxCZKt-c');
  const twilioRef = useRef(null);

  const _onConnectButtonPress = () => {
    twilioRef.current.connect({ accessToken: token });
    setStatus('connecting');
  }
  
  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();
  };

  const _onMuteButtonPress = () => {
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then(isEnabled => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioRef.current.flipCamera();
  };

  const _onRoomDidConnect = ({roomName, error}) => {
    console.log('onRoomDidConnect: ', roomName);

    setStatus('connected');
  };

  const _onRoomDidDisconnect = ({ roomName, error }) => {
    console.log('[Disconnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = error => {
    console.log('[FailToConnect]ERROR: ', error);

    setStatus('disconnected');
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
          <View
            style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onEndButtonPress}>
              <Text style={{fontSize: 12}}>End</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onMuteButtonPress}>
              <Text style={{fontSize: 12}}>{ isAudioEnabled ? "Mute" : "Unmute" }</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onFlipButtonPress}>
              <Text style={{fontSize: 12}}>Flip</Text>
            </TouchableOpacity>
            <TwilioVideoLocalView
              enabled={true}
              style={styles.localVideo}
            />
          </View>
        </View>
      }

      <TwilioVideo
        ref={ twilioRef }
        onRoomDidConnect={ _onRoomDidConnect }
        onRoomDidDisconnect={ _onRoomDidDisconnect }
        onRoomDidFailToConnect= { _onRoomDidFailToConnect }
        onParticipantAddedVideoTrack={ _onParticipantAddedVideoTrack }
        onParticipantRemovedVideoTrack= { _onParticipantRemovedVideoTrack }
      />
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white"
    },
    callContainer: {
      flex: 1,
      position: "absolute",
      bottom: 0,
      top: 0,
      left: 0,
      right: 0
    },
    welcome: {
      fontSize: 30,
      textAlign: "center",
      paddingTop: 40
    },
    input: {
      height: 50,
      borderWidth: 1,
      marginRight: 70,
      marginLeft: 70,
      marginTop: 50,
      textAlign: "center",
      backgroundColor: "white"
    },
    button: {
      marginTop: 100
    },
    localVideo: {
      flex: 1,
      width: 125,
      height: 200,
      position: "absolute",
      right: 10,
      bottom: 400,
      borderRadius: 2,
      borderColor: '#4e4e4e'
    },
    remoteGrid: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap"
    },
    remoteVideo: {
      width: '100%',
      height: '100%'
    },
    optionsContainer: {
      position: "absolute",
      left: 0,
      bottom: 0,
      right: 0,
      height: 100,
      // backgroundColor: "blue",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: 'center'
    },
    optionButton: {
      width: 60,
      height: 60,
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 100 / 2,
      backgroundColor: "grey",
      justifyContent: "center",
      alignItems: "center"
    }
  });
  
export default Video;