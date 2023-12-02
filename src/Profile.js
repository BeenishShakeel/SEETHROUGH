
import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet , Image ,Alert,ToastAndroid,ImageBackground} from "react-native";
import Back3 from "./back3";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Btn1 from "../assets/buttons/btn1";
import Share from 'react-native-share';
import Icon from "react-native-vector-icons/Ionicons";
import TextField from "./textField";
import{captureRef} from'react-native-view-shot';
import { colors } from "../assets/constants/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
//import { ImageBackground } from "react-native/Libraries/Image/Image";

import firestore from '@react-native-firebase/firestore';

export default function Profile({navigation}){
  const [name, setName] = useState("")
  const [email, setemail] = useState("")
  const [userId, setUserId] =useState("")
  const [phoneNumber, setphonenumber] = useState("")
  const[rating,setrating] = useState(0.0);
  const [isActive, setIsActive] = useState(false);
  
 
  /*async function fetchData() {
    try {
      const value = await AsyncStorage.getItem("uid")
      if (value !== null) {
        database().ref(`/users/${value}`).once("value").then(snapshot => {
          let name = snapshot.val().firstName + snapshot.val().lastName
          let email = snapshot.val().email 
          let phoneNumber = snapshot.val().phoneNumber 
          setName(name)
          setemail(email)
          setphonenumber(phoneNumber)
        })
      }
    }
    catch (error) {
      console.log(error)
    }
  }*/


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
            const isActiveValue = userData.isActive; 
            setIsActive(isActiveValue);
            if (userData) {
              const { firstName, lastName, email, phoneNumber , rating } = userData;
              const name = firstName + ' ' + lastName;
              const formattedRating = parseFloat(rating).toFixed(1);
              setName(name);
              setemail(email);
              setphonenumber(phoneNumber);
              setrating(formattedRating);
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
async function toggleActiveStatus() {
  try {
   
    setIsActive((prevIsActive) => !prevIsActive);

    
    const value = await AsyncStorage.getItem("uid");
    if (value !== null) {
      await firestore().collection('users').doc(value).update({
        isActive: !isActive, // Toggle the value
      });
    }
  } catch (error) {
    console.error('Error toggling active status:', error);
  }
}


  useEffect(() => {

    fetchData();
  },

    []);

    function LogOut(){
      auth().signOut().then(() => {
        ToastAndroid.show("Signed Out!", ToastAndroid.SHORT)
        navigation.navigate("Login")
      });
    }

   /* async  function deleteaccount(){
      const value = await AsyncStorage.getItem("uid")
      if (value !== null)
      setUserId(value);
      database().ref(`/users/${userId}`).
      remove().
      then(
          ()=> {
              // ToastAndroid.show("Deleted  Successfully!", ToastAndroid.SHORT)
             
              navigation.navigate("Login")
          }
      ).catch((error)=> ToastAndroid.show(error.message, ToastAndroid.SHORT))
      await AsyncStorage.removeItem(value)
      ToastAndroid.show("Deleted  Successfully!", ToastAndroid.SHORT)
  } */
  

async function deleteaccount() {
  const value = await AsyncStorage.getItem("uid");

  if (value !== null) {
    try {
      // Use Firestore to delete the user's document based on their UID
      await firestore().collection('users').doc(value).delete();

      // Remove the UID from AsyncStorage
      await AsyncStorage.removeItem("uid");

      ToastAndroid.show("Deleted Successfully!", ToastAndroid.SHORT);
      navigation.navigate("Login");
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }
}


 // <ImageBackground
          // source={require('../assets/images/new4.jpg')}
          // style={styles.image}>
  const url = "https://www.pinterest.com/pin/855824735466276690"
    const share = async() =>
    {
        
        const  shareOptions ={
            message:'You can join  See Through My Eyes To Help Blind People',
            url,
          
        } 
        try{
            const ShareResponse =  Share.open(shareOptions); 
        }
        catch(error)
        {
            console.log('Error =>',error);
        }
    };
    return(
      <View style = {{backgroundColor:'white' , flex:1 }}>
    <View style = {{borderBottomLeftRadius:30}}>
    <View style = {styles.image}>
    <View style={{ flexDirection: 'row' }}>
    <View style={{ backgroundColor: isActive ? 'green' : 'red',  width: 35, height: 35, marginTop:6, marginLeft:10, borderRadius: 20 }}>
    <MaterialIcons style={{ marginTop: 5, marginLeft: 7 }} name={isActive ? 'check' : 'close'} size={22} color={'white'} onPress={toggleActiveStatus} />
  </View>
  <Text style={{ fontSize: 15, marginTop: 12, marginLeft: 4, fontFamily: "Poppins-SemiBold", color: 'white' }}> Active</Text>
          <View style ={{flexDirection:'column' , marginLeft:45 ,marginTop:2}}>
          <Icon name="log-out-outline" style={{ height: 30, width: 30, marginLeft: 170 }}
            size={35} color={'white'} onPress={LogOut}/>
            <Text style = {{ marginLeft : 160 ,fontFamily: 'Poppins-SemiBoldItalic',color:'white' , fontSize:13}}>
              LogOut
            </Text>
            </View>
           
            </View>
  


            <View style ={{ width:20}}>
            <Image
       source={require('../assets/images/pro.png')}
      style ={styles.image1}></Image>
      </View>
          <Text style={{  fontFamily: 'Poppins-BoldItalic', color: 'white',  marginLeft: 125, fontSize: 24 }}>
          My Profile
        </Text>
        <Text style={{  fontFamily: 'Poppins-BoldItalic', color: 'white',  marginLeft: 140, fontSize: 15 }}>
        Rating : {rating}
      </Text>

       
  
      
      <View style={{ flexDirection: 'row' , backgroundColor:'white' , marginBottom:100, width:370, borderTopRightRadius:100 }}>
        
    
      
     
     
        <View style ={{ flexDirection:'column' , backgroundColor:'white' ,marginTop:10, borderRadius:40 ,height:370,width:320}}> 
       
        <View style ={{flexDirection:'row' }}>
       
        <View style = {{backgroundColor:'#1F4A83' ,
        marginLeft:19, marginTop:40, borderRadius:50,width:40,height:40}}>
        <MaterialIcons  style = {{marginTop:5 , marginLeft:7}} name="edit" size = {25} color= {'white'}></MaterialIcons>
          </View> 
                                <Text  style = {{fontSize:15, marginTop:50, marginLeft:20,fontFamily :"Poppins-SemiBold" , color :'black'}} >{name}</Text>
                                </View>
                           
                                <View style ={{ borderBottomWidth: 1, marginTop:9,
                                  borderColor:'#D5D8DC', width:500
                                 }}>
                                  </View>
                                  
                <View style ={{flexDirection:'row' , marginTop:10}}>
                <View style = {{backgroundColor:'#1F4A83' , marginLeft:19, borderRadius:50,width:40,height:40}}>
                <MaterialIcons  style = {{marginTop:8 , marginLeft:10}} name="email" size = {22} color= {'white'}></MaterialIcons>
                  </View> 
                <Text  style = {{fontSize:15, marginTop:10, marginLeft:20,fontFamily :"Poppins-SemiBold" , color :'black'}} >{email}</Text>
              </View>
              <View style ={{ borderBottomWidth: 1, marginTop:9,
                borderColor:'#D5D8DC', width:500
               }}>
                </View>
              <View style={{ flexDirection:'row',marginTop:10}}>
              <View style = {{backgroundColor:'#1F4A83' , marginLeft:19,  borderRadius:50,width:40,height:40}}>
              <MaterialIcons  style = {{marginTop:8 , marginLeft:10}} name="phone" size = {22} color= {'white'}></MaterialIcons>
                </View> 
                <Text  style = {{fontSize:15, marginTop:10, marginLeft:20,fontFamily :"Poppins-SemiBold" , color :'black'}} >{phoneNumber}</Text>
                </View>
                <View style ={{ borderBottomWidth: 1, marginTop:9,
                  borderColor:'#D5D8DC', width:500
                 }}>
                  </View>
                 
        <View style ={{flexDirection:'row' , marginTop:10,backgroundColor :'white'}}>
        <View style = {{backgroundColor:'#1F4A83' , marginLeft:19,  borderRadius:50,width:40,height:40}}>
        <Icon name="pencil-sharp" style={{ marginTop: 9, marginLeft: 10, borderRadius: 20 }}
        size={20} color={'white'} />
        
          </View> 
          <Text style={{ fontFamily: "Poppins-SemiBold", textDecorationStyle: 'double',color:'black', fontSize: 15  , marginTop:7, marginLeft:19  }}  > Edit Profile </Text>
        
          <Icon name="chevron-forward-outline" style = {{marginTop:8}}marginLeft= {134}  size ={25} onPress={() => navigation.navigate("EditProfile")}  color = {'black'}/>
             
       

        {/* <Icon name="chevron-forward-outline" style={{marginTop:13,  }}  size={25} color={'white'} /> */}
    </View>
    <View style ={{ borderBottomWidth: 1, marginTop:9,
      borderColor:'#D5D8DC', width:500
     }}>
      </View>
      <View style ={{flexDirection:'row' , marginTop:10,backgroundColor :'white'}}>
        <View style = {{backgroundColor:'#1F4A83' , marginLeft:19,  borderRadius:50,width:40,height:40}}>
        <MaterialIcons  style = {{marginTop:7 ,marginLeft:7}} name="clear" size = {25} color= {'white'}></MaterialIcons>
        
          </View> 
          <Text style={{ fontFamily: "Poppins-SemiBold", alignItems: "center",color:'black',marginTop: 7, marginLeft:19, fontSize: 15 }} > Delete Account</Text>
             <Icon name="chevron-forward-outline" style = {{marginTop:8}}marginLeft= {104}  size ={25}  color = {'black'} onPress={() =>Alert.alert(
              "Alert Title",
              "Do you want to delete your account",
             [
               {
                 text: "No",
                 onPress: () => console.log("Not Deleting the account"),
                 style: "cancel"
               },
               { text: "Yes", onPress: () =>   {deleteaccount()} } 
              
              ]
            
               ) }/>
             

       

        {/* <Icon name="chevron-forward-outline" style={{marginTop:13,  }}  size={25} color={'white'} /> */}
    </View>
    <View style ={{ borderBottomWidth: 1, marginTop:9,
      borderColor:'#D5D8DC', width:500
     }}>
      </View>
    

    {/* <Icon name="chevron-forward-outline" style={{marginTop:13,  }}  size={25} color={'white'} /> */}


      {/* <Text style = {{fontSize:20, marginTop:10, marginLeft:20,fontFamily :"Poppins-Bold" , color :'white'}}>Delete Your Account</Text> */}
                {/* <View
        style={{
          elevation: 4,
          shadowColor: 'black', marginLeft:20,  marginTop: 10, marginBottom: 10, flexDirection: 'row', backgroundColor: '#368BC1', borderRadius: 20, width: 200, height: 54
        }}> */}
      
             <View style = {{ flexDirection:'row', marginTop :50, }}>
             <View style = {{backgroundColor:'#1F4A83' , marginLeft:310,  width:49,height:70, borderBottomLeftRadius:100 , borderTopLeftRadius:100}}>
             <MaterialIcons  style = {{marginTop:20 , marginLeft:14}} name="share" size = {30} color= {'white'} onPress={()=>share()}></MaterialIcons>
               </View> 
          
           </View>
           
            </View>
            </View>
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
  }

});