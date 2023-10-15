import AudioRecorderPlayer from 'react-native-audio-recorder-player';

class RecorderService {
  
  constructor() {
    this.audioRecorderPlayer = new AudioRecorderPlayer();
  }

  onStartRecord = async () => {
    try {
      const result = await this.audioRecorderPlayer.startRecorder();
      console.log(result);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
  
  onStopRecord = async () => {
    try {
      const result = await this.audioRecorderPlayer.stopRecorder();
      console.log(result);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };
  
  onStartPlay = async () => {
    try {
      const msg = await this.audioRecorderPlayer.startPlayer();
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