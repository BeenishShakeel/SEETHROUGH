import firestore from '@react-native-firebase/firestore';
import { getDistance, getPreciseDistance } from 'geolib';

export const VolunteerSearchWithRating = async () => {
  return new Promise((resolve, reject) => {
    firestore().collection('users')
      .where('isActive', '==', true)
      .where('isEngaged', '==', false)
      .where('rating', '>=', 4.5)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.length > 0) {
          resolve(querySnapshot[0].id);
        }
        else {
          resolve(null);
        }
      })
      .catch(err => reject(err));
  });
}

export const VolunteerSearchFromContacts = () => {
  return new Promise((resolve, reject) => {
    firestore().collection('blind')
      .doc('bicq9-qara8')
      .get()
      .then(blind => {
        const contactsArray = blind.data().contacts;
        if (contactsArray.length > 0) {
          firestore().collection("users")
            .where(firestore.FieldPath.documentId(), 'in', contactsArray)
            .where('isActive', '==', true)
            .where('isEngaged', '==', false)
            .get()
            .then(querySnapshot => {
              resolve(querySnapshot[0].id);
            })
            .catch(err => reject(err));
        }
      })
      .catch(err => reject(err));
  });
}

export const VolunteerSearchNearestLocation = async () => {

  return new Promise((resolve, reject) => {
    let b_latitude = 0;
    let b_longitude = 0;
    let v_latitude = 0;
    let v_longitude = 0;
    let i = 0;
    let nearestVolunteerId = null;
    let minDistance = Number.MAX_VALUE;

    firestore().collection('blind')
      .doc('bicq9-qara8')
      .get()
      .then(blind => {
        b_latitude = blind.data().location.latitude;
        b_longitude = blind.data().location.longitude;
      })
      .catch(err => reject(err));

    firestore().collection('users')
      .where('isActive', '==', true)
      .where('isEngaged', '==', false)
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
          }
        })
        resolve(nearestVolunteerId);
      })
      .catch(err => reject(err));

  });

}
