// import React from 'react';
// import {
//   StyleSheet,
//   Button,
//   View,
//   Text
// } from 'react-native';
// import { useIsFocused } from "@react-navigation/native";
// import { AudioRecorderPlayer } from 'react-native-audio-recorder-player';

// const audioRecorderPlayer = new AudioRecorderPlayer();
// import Voice from '@react-native-voice/voice';

// // Start recording
// const startRecording = async () => {
//   const result = await audioRecorderPlayer.startRecorder();
//   console.log('Recording started:', result);
// };

// // Stop recording
// const stopRecording = async () => {
//   const result = await audioRecorderPlayer.stopRecorder();
//   console.log('Recording stopped:', result);
// };

// const isFocused = useIsFocused();
// useEffect(() => {
//     if (isFocused) {
//       console.log("called");
//       getUserId()
//     }

//     Voice.onSpeechStart = onSpeechStartHandler;
//     Voice.onSpeechEnd = onSpeechEndHandler;
//     Voice.onSpeechResults = onSpeechResultsHandler;
    
//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     }
//   }, [isFocused])

//   const onSpeechStartHandler = (e) => {
//     console.log('start handler');
//   }

//   const onSpeechEndHandler = (e) => {
//     console.log('end handler');
//   }

//   const onSpeechResultsHandler = (e) => {
//     console.log(e);
//     if (e.value.length > 0) {
//       if (e.value[0].includes("record")) {
//         startRecording();
//       }
//     }
//   }
// export default function Record() {
//     return (
//         <View style={{ flex: 1 }}>
//           <Pressable onPress={() => { Voice.start() }}>
//             <Image source={require("../assets/images/gh.gif")} style={styles.backgroundImage}
//             />
//           </Pressable>
//         </View>
//       );
// }

  
