import moment from 'moment';
import NotificationSounds, {
  playSampleSound,
  stopSampleSound,
} from 'react-native-notification-sounds';

export default class VoiceOperations {

  constructor() {
    this.timerStartTime = moment.duration({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    });
    this.timerRef = null;
    this.alarmRef = null;
    this.stopwatchTimer = 0;
  }

  startTimer(duration, unit) {
    let seconds = duration;
    if (unit === "h") {
      seconds = duration * 3600;
    }
    else if (unit === "min") {
      seconds = duration * 60;
    }

    this.timerRef = setTimeout(() => {
      clearTimeout(this.timerRef);
      NotificationSounds.getNotifications("ringtone").then(soundsList => {
        playSampleSound(soundsList[0]);
        setTimeout(() => {
          stopSampleSound();
        }, 10000);
      })
    }, seconds*1000);
  }

  stopTimer() {
    clearTimeout(this.timerRef);
  }

  startStopwatch() {
    this.stopwatchTimer = Date.now();
  }

  stopStopwatch() {
    let timeElapsed = Date.now() - this.stopwatchTimer;
    this.stopwatchTimer = 0;
    return moment.utc(timeElapsed).format("HH:mm:ss")
  }

  setAlarm(month, day, hours, minutes) {
    const dt = new Date();
    if(month) {
      dt.setMonth(month-1);
      dt.setDate(day);
    }
    dt.setHours(hours);
    dt.setMinutes(minutes);
    dt.setSeconds(0);

    if (hours >= 24 || minutes >= 60) {
      console.error(`${hours}:${minutes} is an invalid time.`);
      return false;
    }

    if (dt.getTime() < Date.now()) {
      console.error("Invalid alarm time");
      return false;
    }

    this.alarmRef = setTimeout(() => {
      NotificationSounds.getNotifications("ringtone").then(soundsList => {
        playSampleSound(soundsList[0]);
        setTimeout(() => {
          stopSampleSound();
        }, 5000);
        clearTimeout(this.alarmRef);
      })
    }, dt.getTime() - Date.now());

    return true;

  }

  _dayToWeekday(day) {
    if (day == "tomorrow") return moment().day() + 1
    else if (day == "today") {
      return moment().day()
    } else if (day == "sunday") {
      return 7
    } else {
      return moment()
        .day(day)
        .day()
    }
  }

}