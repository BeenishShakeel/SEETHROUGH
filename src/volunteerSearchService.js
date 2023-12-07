import firestore from '@react-native-firebase/firestore';
import { getDistance, getPreciseDistance } from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';


export const VolunteerSearchWithRating = () => {
  console.log("i am searching volunteer");
  Tts.speak('Searching the volunteer');
  return new Promise(async (resolve, reject) => {
    const userID = await AsyncStorage.getItem('userId');
    console.log(userID);

    await firestore().collection('blind')
      .doc(userID)
      .get()
      .then(blind => {
        //const contactsArray = blind.data().contacts;
         b_language = blind.data().language;
      })
    await firestore().collection('users')
      .where('isActive', '==', true)
      .where('isEngaged', '==', false)
      .where('languages', 'array-contains', b_language)
      .orderBy('rating', 'desc')
      .limit(1)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot =>{
          console.log("name", documentSnapshot.firstName);
          return resolve({
            userID: documentSnapshot.id,
            deviceID: documentSnapshot.data().deviceID
          });
        });
          return resolve(null);    
        })
      .catch(err => reject(err));
      });
  }


export const VolunteerSearchFromContacts =  () => {
  Tts.speak('Searching the volunteer');
  return new Promise(async (resolve, reject) => {
    const userID = await AsyncStorage.getItem('userId');
    await firestore().collection('blind')
      .doc(userID)
      .get()
      .then(blind => {
        const contactsArray = blind.data().contacts;
        b_language = blind.data().language;
        if (contactsArray.length > 0) {
          firestore().collection("users")
            .where(firestore.FieldPath.documentId(), 'in', contactsArray)
            .where('isActive', '==', true)
            .where('isEngaged', '==', false)
            .where(b_language, 'in', 'languages')
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(documentSnapshot => {
                return resolve({
                  userID: documentSnapshot.id,
                  deviceID: documentSnapshot.data().deviceID
                });
              });
              return resolve(null);
            })
            .catch(err => reject(err));
        }
      })
      .catch(err => reject(err));
  });
}

export const VolunteerSearchNearestLocation = () => {
  Tts.speak('Searching the volunteer');
  return new Promise(async (resolve, reject) => {
    let b_latitude = 0;
    let b_longitude = 0;
    let v_latitude = 0;
    let v_longitude = 0;
    let i = 0;
    let nearestVolunteerId = null;
    let nearestVolunteerDeviceID = null;
    let minDistance = Number.MAX_VALUE;

    const userID = await AsyncStorage.getItem('userId');
    firestore().collection('blind')
      .doc(userID)
      .get()
      .then(blind => {
        b_latitude = blind.data().location.latitude;
        b_longitude = blind.data().location.longitude;
        b_language = blind.data().language;
      })
      .catch(err => reject(err));

    await firestore().collection('users')
      .where('isActive', '==', true)
      .where('isEngaged', '==', false)
      .where(b_language, 'in', 'languages')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          v_latitude = documentSnapshot.data().location.latitude;
          v_longitude = documentSnapshot.data().location.longitude;

          let distance = getPreciseDistance(
            { latitude: v_latitude, longitude: v_longitude },
            { latitude: b_latitude, longitude: b_longitude }

          );
          if (distance < minDistance) {
            minDistance = distance;
            nearestVolunteerId = documentSnapshot.id;
            nearestVolunteerDeviceID = documentSnapshot.data().deviceID;
          }
        })
        resolve({
          userID: nearestVolunteerId,
          deviceID: nearestVolunteerDeviceID
        });
      })
      .catch(err => reject(err));

  });

}
