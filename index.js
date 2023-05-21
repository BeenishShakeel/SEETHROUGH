/**
 * @format
 */

import { AppRegistry} from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import BackgroundService from 'react-native-background-actions';
import RNShake from 'react-native-shake';
import invokeApp from 'react-native-invoke-app';

AppRegistry.registerComponent(appName, () => App);

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    await new Promise( async (resolve) => {
        RNShake.addListener(() => {
            invokeApp();
        });
        for (let i = 0; BackgroundService.isRunning(); i++) {
            console.log(i);
            await sleep(delay);
        }
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