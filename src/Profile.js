
import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet , Image ,Alert,ToastAndroid} from "react-native";
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
import { ImageBackground } from "react-native/Libraries/Image/Image";


export default function Profile({navigation}){
  const [name, setName] = useState("")
  const [email, setemail] = useState("")
  const [userId, setUserId] =useState("")
  const [phoneNumber, setphonenumber] = useState("")
  
  async function fetchData() {
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

    async  function deleteaccount(){
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
  }


  const url = "https://www.vecteezy.com/vector-art/606261-eye-logo-vector"
    const share = async() =>
    {
        
        const  shareOptions ={
            message:'My Friend and Family Please Join See Through My Eyes To Help Blind People',
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
      
          //  <View style ={{flex:1,backgroundColor:'#98AFC7',borderRadius:50}}>
         <Back3> 
      {/* <View style ={{backgroundColor:'#98AFC7' , borderRadius:12}}> */}
      <View style={{ flexDirection: 'row' , marginTop:10}}>
        <Text style={{ marginTop: 10, fontFamily: 'Poppins-SemiBold', color: 'white', marginLeft: 16, fontSize: 22 }}>
          My Profile
        </Text>
        <View style ={{flexDirection:'column'}}>
        <Icon name="log-out-outline" style={{ height: 50, marginTop:10, width: 50, marginLeft: 170 }}
          size={35} color={'white'} onPress={LogOut}/>
          <Text style = {{ marginLeft : 160 ,color:'white' , fontSize:15}}>
            LogOut
          </Text>
          </View>
      </View>
  <View style ={{marginTop:10 , width:20}}>
             <Image
				source={require('../assets/images/pro.png')}
			style ={styles.image}></Image>
      </View>
     
        <View style ={{marginLeft:19, flexDirection:'column' , backgroundColor:'#98AFC7' ,marginTop:40, borderRadius:40 ,height:370,width:320}}> 
        <View style ={{flexDirection:'row' }}>
                                <MaterialIcons  style = {{marginLeft:20 , marginTop:30}} name="edit" size = {25} color= {'black'}></MaterialIcons>
                                <Text  style = {{fontSize:17, marginTop:30, marginLeft:20,fontFamily :"Poppins-SemiBold" , color :'black'}} >{name}</Text>
                                </View>
                <View style ={{flexDirection:'row' }}>
                <MaterialIcons  style = {{marginLeft:20 , marginTop:10}} name="email" size = {25} color= {'black'}></MaterialIcons>
                <Text  style = {{fontSize:17, marginTop:10, marginLeft:20,fontFamily :"Poppins-SemiBold" , color :'black'}} >{email}</Text>
              </View>
              <View style={{ flexDirection:'row'}}>
                <MaterialIcons  style = {{marginLeft:20 , marginTop:10}} name="phone" size = {25} color= {'black'}></MaterialIcons>
                <Text  style = {{fontSize:17, marginTop:10, marginLeft:20,fontFamily :"Poppins-SemiBold" , color :'black'}} >{phoneNumber}</Text>
                </View>
              
            
              
                {/* <Text style = {{fontSize:20, marginTop:10, marginLeft:20,fontFamily :"Poppins-Bold" , color :'white'}}>Update Your Account</Text> */}

             
                {/* <View
        style={{
          elevation: 4,
          shadowColor: 'black', marginLeft:20,  marginTop: 20, marginBottom: 10, flexDirection: 'row', backgroundColor: '#000080', borderRadius: 20, width: 200, height: 54
        }}> */}
        <View style ={{flexDirection:'row'}}>
        <Icon name="pencil-sharp" style={{ marginTop: 14, marginLeft: 14, borderRadius: 20 }}
          size={20} color={'black'} />

        <Text style={{ fontFamily: "Poppins-Bold", textDecorationLine: 'underline',textDecorationStyle: 'double',alignItems: "center",color:'black', marginTop: 13,marginLeft:10, fontSize: 17  }} onPress={() => navigation.navigate("EditProfile")} > Edit Profile </Text>

        {/* <Icon name="chevron-forward-outline" style={{marginTop:13,  }}  size={25} color={'white'} /> */}
    </View>
    
    

      {/* <Text style = {{fontSize:20, marginTop:10, marginLeft:20,fontFamily :"Poppins-Bold" , color :'white'}}>Delete Your Account</Text> */}
                {/* <View
        style={{
          elevation: 4,
          shadowColor: 'black', marginLeft:20,  marginTop: 10, marginBottom: 10, flexDirection: 'row', backgroundColor: '#368BC1', borderRadius: 20, width: 200, height: 54
        }}> */}
        <View style = {{flexDirection:'row'}}>
        <MaterialIcons  style = {{marginLeft:14, marginTop:17}} name="clear" size = {24} color= {'red'}></MaterialIcons>
              

        <Text style={{ fontFamily: "Poppins-Bold",  textDecorationLine: 'underline',alignItems: "center",color:'black',marginTop: 15,marginLeft:6, fontSize: 17 }} onPress={() =>Alert.alert(
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
     
        ) }> Delete Account</Text>

       </View>
      
   
     
   
             <View style = {{ flexDirection:'row', marginTop :20, }}>
             <MaterialIcons  style = {{marginLeft:10}} name="share" size = {25} color= {'black'}  onPress={()=>share()}></MaterialIcons>
          <Text style = {{fontSize:15,marginTop:2, marginLeft:7,fontFamily :"Poppins-Bold" , color :'black'}}>Share App With friend And Family</Text>
           </View>
            </View>
           {/* </View> */}
           </Back3>   
    )
}
const styles = StyleSheet.create({
    imageBackground: {
		flex: 1,
        width:400,
		height:700,
		backgroundColor: '#2A5EE0',
	},
	image: {
  //  marginTop:50,
	// 	width: '50%',
	// 	height: 100,
   marginLeft:110
		
		
	},

});