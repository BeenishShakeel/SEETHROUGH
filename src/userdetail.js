import React, {useState, useEffect} from "react";
import {View, Text,StyleSheet ,TouchableOpacity,FlatList,Alert, Image ,ToastAndroid} from "react-native";
import Background from "./background";
import { Searchbar } from 'react-native-paper';
import Btn1 from "../assets/buttons/btn1";
import TextField from "./textField";
import { colors } from "../assets/constants/colors";
import Share from 'react-native-share';
import Back3 from "./back3";
import auth from '@react-native-firebase/auth';
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firestore , doc} from '@react-native-firebase/firestore';


export default function Userdetail({navigation}){
    const[user,setUser] = useState([]);
    const[userId,setUserId] = useState("");
      const [users, setUsers] = useState([]);
      const groupUsersByRating = (usersData) => {
        const groupedUsers = {};
        usersData.forEach((user) => {
          const rating = user.rating;
          if (!groupedUsers[rating]) {
            groupedUsers[rating] = [];
          }
          groupedUsers[rating].push(user);
        });
    
        // Create a flattened array
        const result = [];
        for (const rating in groupedUsers) {
          if (groupedUsers.hasOwnProperty(rating)) {
            result.push(...groupedUsers[rating]);
          }
        }
    
        return result;
      };
    async function fetchData() {
    try {
      const usersSnapshot = await firestore().collection('users').orderBy('rating', 'desc').get();
      const usersData = usersSnapshot.docs.map((doc) => doc.data());
      const groupedUsers = groupUsersByRating(usersData);
      setUsers(groupedUsers);
     
    } catch (error) {
      console.error(error);
    }
  }

    
      useEffect(() => {
        fetchData()
      }, [])

      async function deleteaccount(id) {
        if (id !== null) {
          try {
            const docRef = firestore().collection('users').doc(id);
      
            // Get the document data along with its ID
            const docSnapshot = await docRef.get();
      
            if (docSnapshot.exists) {
              const documentData = docSnapshot.data();
              const documentId = docSnapshot.id;
      
              // Delete the document
              await firestore().collection('users').doc(documentId).delete();
      
              // Remove the UID from AsyncStorage
              await AsyncStorage.removeItem("uid");
      
              ToastAndroid.show("Deleted Successfully!", ToastAndroid.SHORT);
              
            } else {
              console.log("Document does not exist");
            }
          } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
          }
        }
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
      function LogOut(){
       
          ToastAndroid.show("Signed Out!", ToastAndroid.SHORT)
          navigation.navigate("Login")
     
      }
    return(
       


        <View style={{ flex:1,marginTop: 25}}>
            <View style ={{ flexDirection: 'row' }}>
        <Image
          style={{ marginLeft: 20, borderRadius: 10, marginTop: 2, width: 65, height: 65 }}
          source={require('../assets/images/pro.png')}
        />
        <View style = {{flexDirection:'row'}}>
         <View style={{ marginTop: 20, flexDirection: 'column' }}>

       
          <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#1F4A83', fontSize: 18, marginLeft: 10 }}>
            Admin
          </Text>
        </View>
        <View style = {{width:40 , height:40 ,marginLeft:163, marginTop:8, backgroundColor:'#1F4A83', borderRadius:10}}>
         <MaterialIcons  style = {{marginTop:8 , marginLeft:8}} name="share" size = {24} color= {'white'}  onPress={()=>share()}></MaterialIcons>
        </View>
        </View>
        </View>

   
 {/* <View style={{ marginTop: 20, width:300, marginLeft: 15 }} >
      <Searchbar
// value = {filter} onChangeText = {setFilter} onSubmitEditing = {fetchData}
          placeholder="Search User" style={{ borderRadius: 67, marginLeft:30,
           fontSize: 15, backgroundColor: "white" }} placeholderTextColor={'grey'} iconColor='#368BC1' /> 
      </View>  */}
      <View>
      <View style={{ marginTop: 10 }}>
            <Text style={{ fontFamily: 'Poppins-Bold', marginTop: 10, color: 'black', fontSize: 27, marginTop: 5, marginLeft: 100 }}>
            List Of Users
            </Text>
          </View>
         
          <FlatList
            data={users}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item}) =>
            
                <View style={{ marginTop: 30, flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>
                 <Image
				source={require('../assets/images/f.png')}
				style={styles.image}></Image>
                <View style={{flexDirection:'column'}}>
                  <View style ={{flexDirection:'row'}}>

                    <Text style={{ fontFamily: 'Poppins-SemiBold', marginTop: 5, color: '#1F4A83', fontSize: 15, marginLeft: 10}}>
                      {item.firstName}
                      </Text>
                      <Text style={{ fontFamily: 'Poppins-SemiBold', marginTop: 5, color: '#1F4A83', fontSize: 15, marginLeft: 5}}>
                      {item.lastName}
                      </Text>
                      <Icon name= 'star' size={15} color={'gold'} style={{marginLeft:195 , marginTop:8 , position:'absolute'}} />
                      <Text
                  style={{
                    position:'absolute',
                    fontFamily: 'Poppins-SemiBold',
                    marginTop: 5,
                    color: '#565654',
                    fontSize: 15,
                    marginLeft: 211,
                  }}
                >
                        Rating : {item.rating}
                </Text>
                     
                    </View>    
                    <Text style={{ fontFamily: 'Poppins-SemiBold',  color: '#1F4A83', fontSize: 15, marginLeft: 10}}>
                      {item.email}
                      </Text>    
                      </View>              
                    
                    
                   <View style ={{position:'absolute'}}>
                     <TouchableOpacity   style={{ marginTop:28,marginLeft:275, width: 75
                      
                      ,height : 30 , margin: 15  ,borderRadius:8, backgroundColor:'#B21807'}}
                       onPress={() => Alert.alert(
                        "Delete User",
                        "Are you sure you want to Delete this user",
                        [
                          {
                            text: "No",
                            onPress: () => console.log("Not Deleting the restaurant"),
                            style: "cancel"
                          },
                          {
                            text: "Yes", onPress: async () => {
                              try {
                               console.log(item.id)
                                deleteaccount(item.id);
                              } 
                              
                         catch (error) {
                                console.error(error);
                                ToastAndroid.show("Error deleting user", ToastAndroid.SHORT);
                              }
                            },
                          }
                        ]
                      )}>
                   <View style = {{flexDirection:'row'}}>
                   <Text style ={{fontFamily:'Poppins-SemiBold',   marginLeft : 20,fontSize:13 ,marginTop : 5,color :'white'}}>
                   Delete 
                   </Text>
                  
                   </View>
                   </TouchableOpacity>
                   </View>
                  </View>
                  <View style = {{ borderWidth: 1,
                    borderColor:'black',
                    margin:10}}>
                </View>
                </View>
                

            }
          />

        </View>
        </View>
      

     
    
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
		width: 50,
     
        marginLeft:15,
		height: 50,
      
		
		
	},

});