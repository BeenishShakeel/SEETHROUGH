import React ,  {useRef}  from 'react';
import { StyleSheet, View ,useEffect, TouchableOpacity, Animated, Text, ImageBackground, Image } from 'react-native';
import Btn2 from '../assets/buttons/btn2';
import Btn3 from '../assets/buttons/btn3';
import Btn1 from '../assets/buttons/btn1';
import * as Animatable from 'react-native-animatable';
export default function Splash({navigation, route} ) {
	
// 	<View style = {{backgroundColor:'white' , height:400}}>
// 	<
	return (
		<View style = {{flex:1 , backgroundColor:'#1F4A83' }} >
	 
		<View style = {{backgroundColor:'white'}}>
		<Animatable.Image
				 	style={ styles.image }
					source={require('../assets/images/campuraai-02.jpg')} animation = "bounceIn" duration={10000}
				   />
				   <Animatable.Text style = {{marginTop:10, marginLeft:20, fontFamily: "Poppins-ExtraBoldItalic"  , fontSize:29 ,color :'#1F4A83'}} animation = "bounceIn" duration={10000} >See Through My Eyes</Animatable.Text>
		</View>
		<View style = {{backgroundColor:'white' , height:200 , width:370, borderBottomRightRadius:300}}>

	  </View>
	  <View style = {{backgroundColor:'white' , height:200 , width:370,  borderBottomRightRadius:200}}>
	  <View style = {{backgroundColor:'#1F4A83' , height:300 , width:370,  borderTopLeftRadius:100}}>
	  <TouchableOpacity style=
	  	{{backgroundColor:'#1F4A83', 
		  borderRadius: 30, 
		  justifyContent: "center", 
		  alignItems: "center",
		  alignSelf: "center",
		  marginTop: 80, 
		  height: 60, 
		  width: 180
		  }} onPress={() => navigation.navigate('Login')}>
      <Text style={{ width:200 , marginLeft:140, color: "white", fontSize: 23,  fontFamily: "Poppins-SemiBold", alignSelf: "center"}}>Login</Text>
      <View style ={{ borderBottomWidth: 0.5, 
		borderColor:'#D5D8DC', width:70 ,  marginLeft:10,
	   }}>
	   </View>
	  </TouchableOpacity>
	  <TouchableOpacity style={{backgroundColor:'#1F4A83', borderRadius: 30, justifyContent: "center", alignItems: "center",alignSelf: "center",marginTop: 10, height: 60, width: 180}} 
	  onPress={() => navigation.navigate('SignUp')}>
      <Text style={{ width:200 , marginLeft:100, color: "white", fontSize: 23,  fontFamily: "Poppins-SemiBold", alignSelf: "center"}}>Register</Text>
	  <View style ={{ borderBottomWidth: 0.5, 
		borderColor:'#D5D8DC', width:110 , 
	   }}>
	   </View>
	  </TouchableOpacity>
	  
		
	  
	 
	  </View>
	  </View>				
			</View>
	
	);
};

const styles = StyleSheet.create({
	cutDiamondTop: {
		width: 100,
		height: 300,
		borderTopWidth: 0,
		borderTopColor: "transparent",
		borderLeftColor: "transparent",
		borderLeftWidth: 25,
		borderRightColor: "transparent",
		borderRightWidth: 25,
		borderBottomColor: "red",
		borderBottomWidth: 25,
	  },
	  cutDiamondBottom: {
		width: 0,
		height: 0,
		borderTopWidth: 70,
		borderTopColor: "red",
		borderLeftColor: "transparent",
		borderLeftWidth: 50,
		borderRightColor: "transparent",
		borderRightWidth: 50,
		borderBottomColor: "transparent",
		borderBottomWidth: 0,
	  },
	backgroundImage: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width:370,
		height: "100%"
	  },
	  cutDiamond: {
		width: 100,
		height: 100,
	  },

	image: {
		width: '40%',
		height: 200,
		marginTop:10,
		marginLeft:100,
		justifyContent: 'center',
		alignItems: 'center',
		//resizeMode: 'cover',
	},
});