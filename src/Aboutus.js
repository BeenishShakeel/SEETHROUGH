import React, {useState} from "react";
import {View, Text, StyleSheet ,ImageBackground, Image ,ToastAndroid} from "react-native";
import Background from "./background";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Btn1 from "../assets/buttons/btn1";
import TextField from "./textField";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../assets/constants/colors";



export default function Aboutus({navigation}){
    return(
     
             <ImageBackground
			source={require('../assets/images/new4.jpg')}
			resizeMode='cover'
			style={styles.imageBackground}
			imageStyle={{ opacity: 0.6 }}>
 <Image
				source={require('../assets/images/aboutus.webp')}
				style={styles.image}></Image>
		<Text style = {{marginTop : 20 , fontSize:25, marginLeft:70, fontFamily :"Poppins-Bold" , color :'white'}}>Whats Our Moto??</Text>
		<View style = {{ marginTop :10, marginLeft:10, marginRight:45,alignItems:'center'}}>
        <Text style ={{fontSize:17, marginTop:10, marginLeft:10, justifyContent:'center', marginRight:6,fontFamily :"Poppins-SemiBold" , color :'white' }}>See Through My Eyes is a free app 
        for receiving video 
            support . Every day, sighted
             volunteers and professionals
              their eyes to
              solve tasks big and small to help
               blind and low-vision  
               people lead independent life   </Text>
               </View>
             <View style = {{flexDirection:'row'}}> 
             <View style ={{flexDirection:'column'}}>
             <View style = {{backgroundColor:"#368BC1" , marginLeft:30, marginTop:80, borderRadius:50,width:55,height:55}}>
               <MaterialIcons style = {{marginTop:5 , marginLeft:10}}name="call" size = {40} color= {'white'}></MaterialIcons>
               </View>
               <Text style = {{fontSize:15,marginTop:10, marginLeft:10, fontFamily :"Poppins-Bold" , color :'white'}}>Free calls</Text>
             </View>
             <View style = {{flexDirection:'column'}}>
             <View style = {{backgroundColor:'#368BC1' , marginLeft:60, marginTop:80, borderRadius:50,width:55,height:55}}>
             {/* <Icon name="moon-outline" size={40} style={{ marginLeft:10 , marginTop: 5 }} color={'white'} /> */}
             <MaterialCommunityIcons  style = {{marginTop:6 , marginLeft:8}} name="hours-24" size = {40} color= {'white'}></MaterialCommunityIcons>
               </View>
               <Text style = {{fontSize:15, marginLeft:20, marginTop:10, fontFamily :"Poppins-Bold" , color :'white'}}>Available 24Hours</Text>
             </View>
             <View style = {{flexDirection:'column'}}>
             {/* #15317E */}
             <View style = {{backgroundColor:'#368BC1' , marginLeft:34, marginTop:80, borderRadius:50,width:55,height:55}}>
             <MaterialIcons  style = {{marginTop:6 , marginLeft:8}} name="security" size = {40} color= {'white'}></MaterialIcons>
               </View>  
           <Text style = {{fontSize:15,  marginTop:10, marginLeft:10, fontFamily :"Poppins-Bold" , color :'white'}}>Fully Secure</Text>
             </View>
              </View>
              
        </ImageBackground>

       
       
       
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
		width: '85%',
        marginTop:5,
        marginLeft:7,
		height: 220,
        borderRadius:30
		
		
	},

});