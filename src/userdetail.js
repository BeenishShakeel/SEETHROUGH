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


export default function Userdetail({navigation}){
    const[user,setUser] = useState([]);
    const[userId,setUserId] = useState("");
    function fetchData() {
        let tempdata = [];
        try {
          database().ref('/users/').once('value').then((snap) => {
             console.log("snap values " )
             console.log(snap.val())
            setUser(Object.values(snap.val()))
        
            console.log("user value " )
            console.log(user)
          }
          )
        } catch (error) {
          console.log(error)
        }
      }
    
      useEffect(() => {
        fetchData()
      }, [])

      
        function deleteaccount(id){
      
        database().ref(`/users/${id}`).
        remove().
        then(
            ()=> {
                // ToastAndroid.show("Deleted  Successfully!", ToastAndroid.SHORT)
               
               
            }
        ).catch((error)=> ToastAndroid.show(error.message, ToastAndroid.SHORT))
       
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
         <View style={{ marginTop: 2, flexDirection: 'column' }}>

          <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#368BC1', fontSize: 17, marginTop: 10, marginLeft: 10 }}>
            Hello
          </Text>
          <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#368BC1', fontSize: 16, marginLeft: 10 }}>
            Admin
          </Text>
        </View>
        <View style = {{width:50 , height:50 ,marginLeft:150, backgroundColor:'#368BC1', borderRadius:10}}>
         <MaterialIcons  style = {{marginTop:8 , marginLeft:10}} name="share" size = {30} color= {'white'}  onPress={()=>share()}></MaterialIcons>
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
            data={user}
            KeyExtractor={(item, index) => item.key}
            renderItem={({ item}) =>
            
                <View style={{ marginTop: 30, flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>
                 <Image
				source={require('../assets/images/user4.png')}
				style={styles.image}></Image>
                <View style={{flexDirection:'column'}}>
                  <View style ={{flexDirection:'row'}}>

                    <Text style={{ fontFamily: 'Poppins-SemiBold', marginTop: 5, color: '#368BC1', fontSize: 15, marginLeft: 15}}>
                      {item.firstName}
                      </Text>
                      <Text style={{ fontFamily: 'Poppins-SemiBold', marginTop: 5, color: '#368BC1', fontSize: 15, marginLeft: 5}}>
                      {item.lastName}
                      </Text>
                     
                    </View>    
                    <Text style={{ fontFamily: 'Poppins-SemiBold',  color: '#368BC1', fontSize: 15, marginLeft: 15}}>
                      {item.email}
                      </Text>    
                      </View>              
                    
                    
                   <View style ={{position:'absolute'}}>
                     <TouchableOpacity   style={{ marginLeft:260, width: 90,height : 42 , margin: 15  ,borderRadius:12, backgroundColor:'#B21807'}}
                       onPress={() => Alert.alert(
                        "Delete Restaurant",
                        "Are you sure you want to Delete this restaurant",
                        [
                          {
                            text: "No",
                            onPress: () => console.log("Not Deleting the restaurant"),
                            style: "cancel"
                          },
                          {
                            text: "Yes", onPress: () => {
                              // let value = 3
                              // let arr = [1, 2, 3, 4, 5, 3]
                              let tempData = user.filter(itemm => itemm !== item)
      
                              setUser(tempData)
                              console.log(tempData)
      
                              database().ref('/users').set(tempData).then((res) => {
                                ToastAndroid.show("User Deleted Successfully", ToastAndroid.SHORT)
                              })
                            }
                          }
                        ]
                      )}>
                   <View style = {{flexDirection:'row'}}>
                   <Text style ={{fontFamily:'Poppins-SemiBold',   marginLeft : 15,fontSize:18 ,marginTop : 5,color :'white'}}>
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