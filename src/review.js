
import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet ,TouchableOpacity, TextInput, Image ,Alert,ToastAndroid,ImageBackground} from "react-native";
import Back3 from "./back3";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Btn1 from "../assets/buttons/btn1";
import Share from 'react-native-share';

import TextField from "./textField";
import{captureRef} from'react-native-view-shot';
import { colors } from "../assets/constants/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import TypewriterText from './TypewriterText';
import AnimatedText from './AnimatedText';
import Rating from "./Rating";
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
//import { ImageBackground } from "react-native/Libraries/Image/Image";


export default function Review({navigation}){
 
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [submittedFeedback, setSubmittedFeedback] = useState('');
  const [submittedRating, setSubmittedRating] = useState(0.0);
  const[name,setName] = useState('')
  const [isPopupVisible, setPopupVisible] = useState(false);

  const showPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const handleFeedbackChange = (text) => {
    setFeedback(text);
    console.log(feedback)
    handleSubmit();
    
  };
 
  const ReviewPopup = ({ isVisible, onClose }) => {
    return (
      <Modal isVisible={isVisible} animationIn="bounceIn" animationOut="bounceOut">
        <Animatable.View animation="fadeInUp" style={styles.modalContent}>
          <Text style={styles.messageText}>Thank you for your review! {name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animatable.View>
      </Modal>
    );
  };
  

  const handleStarPress = (selectedRating) => {
    // Round the selectedRating to one decimal place
    const roundedRating = parseFloat(selectedRating.toFixed(1));
    setRating(roundedRating);
    console.log(rating)
  };
  const handleSubmit = () => {
    // Store the submitted feedback and rating
    fetchData();
    setSubmittedFeedback(feedback);
    setSubmittedRating(rating);
   
  }
  // async function fetchData() {
  //   try {
  //     const value = await AsyncStorage.getItem("uid")
  //     if (value !== null) {
  //       database().ref(`/users/${value}`).once("value").then(snapshot => {
  //         let name = snapshot.val().firstName + snapshot.val().lastName
  //         setName(name)
  //       })
  //     }
  //   }
  //   catch (error) {
  //     console.log(error)
  //   }
  // }


  async function fetchData() {
    try {
      const value = await AsyncStorage.getItem("uid");
  
      if (value !== null) {
        // Use Firestore to fetch user data based on the user's UID
        firestore()
          .collection('users')
          .doc(value)
          .get()
          .then((documentSnapshot) => {
            if (documentSnapshot.exists) {
              const userData = documentSnapshot.data();
  
              if (userData) {
                const name = userData.firstName + ' ' + userData.lastName;
                setName(name);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }
  

function sendrating() {
  const random1 = Math.random().toString(36).substring(2, 7);
  const random2 = Math.random().toString(36).substring(2, 7);
  const result = `${random1}-${random2}`;

  firestore()
    .collection('rating')
    .doc(result)
    .set({
      rating: submittedRating,
      feedback: submittedFeedback,
      name: name,
    })
    .then(() => {
      ToastAndroid.show("Rating Updated Successfully!", ToastAndroid.SHORT);
      console.log("done");
      showPopup();
    })
    .catch((error) => {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    });
}

// function sendrating(){
//   const random1 = Math.random().toString(36).substring(2, 7);
//     const random2 = Math.random().toString(36).substring(2, 7);
//     const result = `${random1}-${random2}`;
 
//   database().ref(`/rating/${result}`).
//   set({rating:submittedRating, feedback:submittedFeedback , name:name }).
//   then(
//       ()=> {
//           ToastAndroid.show("Rating Updated Successfully!", ToastAndroid.SHORT)
//           console.log("done")
//           showPopup();
  
//       }
//   ).catch((error)=> ToastAndroid.show(error.message, ToastAndroid.SHORT))      
       
//  }
  useEffect(() => {
    console.log("Submitted Feedback:", submittedFeedback);
  }, [submittedFeedback]);

  useEffect(() => {
    console.log("Submitted Rating:", submittedRating);
  }, [submittedRating]);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starIconName = i <= rating ? 'star' : 'star-border';
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
          <Icon name={starIconName} size={27} color={i <= rating ? 'gold' : 'gray'} style={styles.star} />
        </TouchableOpacity>
      );
    }
    return stars;
  }
   
    return(
    
      <View style = {{flex : 1 , backgroundColor:'#1F4A83'}}>

     
      <View style = {{  backgroundColor:'white' , flex:1}}>
      <View style = {{backgroundColor:'#1F4A83' , height:200 ,  width:370, borderBottomLeftRadius:70  , borderBottomRightRadius:70}}>
      <TypewriterText text="More Than Just Review !!!" typingInterval={50}  />
   
<Text style = {{fontFamily :"Poppins-Bold",
color:'#1F4A83' , color:'white' ,  fontSize:20 , marginTop:20 , marginLeft:120}}>Give FeedBack</Text>
      </View>
<View style ={{marginTop:20, flexDirection:'column'}}>

<Text style = {{fontFamily :"Poppins-Bold",
color:'#1F4A83' , fontSize:19 ,  marginTop:10 ,  marginLeft:20}}>How Did We Do??</Text>
<View style={styles.container}>
    
      <View style={styles.starsContainer}>{renderStars()}</View>
      <Text style={styles.ratingText}>{rating > 0 ? `${rating.toFixed(1)}` : 'No rating'}</Text>
    </View>
<Text style ={{fontFamily :"Poppins-Bold",
color:'#1F4A83' , fontSize:19 , marginTop:10 , marginLeft:20}}>Care to Share More About it</Text>
<TextInput
style={styles.input}
placeholder="            Write your feedback here"
multiline
numberOfLines={5}
value={feedback}
textAlignVertical="top"
onChangeText={handleFeedbackChange}
/>
<TouchableOpacity style={{backgroundColor:'#1F4A83', borderRadius:10, alignItems: "center", marginLeft:120, marginTop: 25, height: 60, width: 140}} >
<Text style={{color: "white", fontSize: 20, marginRight:10,  fontFamily: "Poppins-Black" , marginTop:15}} onPress={sendrating}>Register</Text>

</TouchableOpacity>
<ReviewPopup isVisible={isPopupVisible} onClose={closePopup} />
</View>
</View>
</View>
    
        )
}
const styles = StyleSheet.create({
    imageBackground: {
		flex: 1,
        width:400,
		height:750,
		backgroundColor: '#2A5EE0',
	},
  input: {
    marginTop:17,
    width:290,
    height:150,
    marginLeft:30,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 30,
    padding: 10,
    fontSize: 16,
  },
	image: {
  //  marginTop:50,
		width: '100%',
	height: 250,

		backgroundColor:'#1F4A83'
		
	},
  image1:
  {
  
    marginLeft:130,
    width:"500%"
  },container: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom:10
  },
  star: {
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: 18,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  messageText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  }

});