import firestore from '@react-native-firebase/firestore';
import {getDistance, getPreciseDistance} from 'geolib';

export const VolunteerSearchWithRating = () => {
  firestore().collection('users')
    .where('isActive', '==', true)
    .where('isEngaged', '==', false)
    .where('rating', '>=', 4.5)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        console.log("User: ", documentSnapshot.id, "\t", documentSnapshot.data())
      })
    });
}

export const VolunteerSearchFromContacts = () => {
  console.log('i am on searching')
  firestore().collection('blind')
    .doc('ihtan-iu3jt')
    .get()
    .then(blind => {
      const contactsArray = blind.data().contacts;
      if (contactsArray.length > 0) {
        firestore().collection("users")
          .where(firestore.FieldPath.documentId() ,'in', contactsArray )
          .where('isActive', '==', true)
          .where('isEngaged', '==', false)
          .get()
          .then(querySnapshot =>{
            querySnapshot.forEach(documentSnapshot => {
              console.log("i am calling this volunteer", documentSnapshot.data());
            });
          })
      } 
    })
  
 
}

