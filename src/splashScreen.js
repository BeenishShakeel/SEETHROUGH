import React ,  {useRef}  from 'react';
import { StyleSheet, View ,useEffect, Animated, Text, ImageBackground, Image } from 'react-native';
import Btn2 from '../assets/buttons/btn2';
import Btn3 from '../assets/buttons/btn3';
import Btn1 from '../assets/buttons/btn1';

export default function Splash({navigation, route} ) {
	
	
	return (
		<View style = {{ flex:1 ,backgroundColor:'white'}}>
			<View style = {{	marginTop : 50 ,justifyContent: 'center',
		alignItems: 'center',}}>
		
			<Image
				source={require('../assets/images/campuraai-02.jpg')}
				style={styles.image}></Image>
		
				<Text style = {{fontFamily: "Poppins-SemiBold"  , fontSize:27 ,color :'#686A6C'}}>SEE THROUGH MY EYES</Text>
       <View>
	   <Btn2 btnLabel="             Sign Up"  onPress={() => navigation.navigate('SignUp')}></Btn2>
	   <Btn3 btnLabel="Sign In" onPress={() => navigation.navigate('Login')} ></Btn3>
	
	   </View>
			</View>
		</View>
		// <ImageBackground
		// 	source={require('../assets/images/campuraai-02.jpg')}
		// 	resizeMode='cover'
		// 	style={styles.imageBackground}
		// 	imageStyle={{ opacity: 0.6 }}>
		// 	<Image
		// 		source={require('../assets/images/campuraai-02.jpg')}
		// 		style={styles.image}></Image>
		// </ImageBackground>
	);
};

const styles = StyleSheet.create({
	imageBackground: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2A5EE0',
	},
	image: {
		width: '40%',
		height: 200,
		justifyContent: 'center',
		alignItems: 'center',
		//resizeMode: 'cover',
	},
});