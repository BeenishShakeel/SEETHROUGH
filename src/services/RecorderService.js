import { Platform } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Tts from 'react-native-tts';
import RNFetchBlob from 'rn-fetch-blob';

class RecorderService {
  
  constructor() {
    this.audioRecorderPlayer = new AudioRecorderPlayer();
  }

  resolvePath(recordingName) {
    const dirs = RNFetchBlob.fs.dirs;
    path = Platform.select({
      android: `${dirs.MusicDir}/${recordingName}.mp3`
    });
    return path;
  }

  onStartRecord = async (recordingName) => {
    try {
      const path = this.resolvePath(recordingName);
      const result = await this.audioRecorderPlayer.startRecorder(path);
      console.log(result);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
  
  onStopRecord = async () => {
    try {
      const result = await this.audioRecorderPlayer.stopRecorder();
      console.log(result);
      Tts.speak("Recording stopped");
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };
  
  onStartPlay = async (recordingName, stopBlocking) => {
    try {
      const path = this.resolvePath(recordingName);
      this.audioRecorderPlayer.addPlayBackListener((info) => {
        if(info.currentPosition === info.duration) {
          stopBlocking();
        }
      });
      const msg = await this.audioRecorderPlayer.startPlayer(path);
      console.log(msg);
    } catch (error) {
      console.error('Error playing recording:', error);
    }
  };
  
  onPausePlay = async () => {
    try {
      await this.audioRecorderPlayer.pausePlayer();
    } catch (error) {
      console.error('Error pausing recording:', error);
    }
  };
  
  onStopPlay = async () => {
    try {
      this.audioRecorderPlayer.stopPlayer();
      this.audioRecorderPlayer.removePlayBackListener();
    } catch (error) {
      console.error('Error stopping recording play:', error);
    }
  };

}

const Recorder = new RecorderService();

export default Recorder;