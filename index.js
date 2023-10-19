/**
 * @format
 */

import { Alert, AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import BackgroundService from 'react-native-background-actions';
import RNShake from 'react-native-shake';
import invokeApp from 'react-native-invoke-app';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

AppRegistry.registerComponent(appName, () => App);

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

// callFunctions();