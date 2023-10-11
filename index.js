/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import BackgroundService from 'react-native-background-actions';
import RNShake from 'react-native-shake';
import invokeApp from 'react-native-invoke-app';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

AppRegistry.registerComponent(appName, () => App);

function onMessageReceived(message) {
	console.log("Notification data: ", message.data);
	notifee.displayNotification({
		title: "Incoming call",
		body: "Somebody needs your help",
		android: {
			channelId: 'volunteerhelp',
		},
	});
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

const veryIntensiveTask = async () => {
	await new Promise(async () => {
		RNShake.addListener(() => {
			invokeApp();
		});
	});
};

const options = {
	taskName: 'Example',
	taskTitle: 'ExampleTask title',
	taskDesc: 'ExampleTask description',
	taskIcon: {
		name: 'ic_launcher',
		type: 'mipmap',
	},
	color: '#ff00ff',
	parameters: {
		delay: 1000,
	},
};

async function callFunctions() {
	await BackgroundService.start(veryIntensiveTask, options);
}

callFunctions();