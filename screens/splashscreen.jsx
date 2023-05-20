import  React,{useEffect} from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import logo from '../assets/eyecon.jpg';

export default function SplashScreen({navigation}){
  useEffect(()=>{
    setTimeout(()=>{
       navigation.navigate('SignUp');
    },3000);
  },[]);
  return(
    <View style={styles.background}>
        <View style={styles.outerCircle}>
            <View style={styles.interCircle}>
                <View style={styles.innerCircle}>
                  <Image source={logo} style={styles.img}></Image> 
                </View>
            </View>
        </View>   
    </View>
  );
}

const styles = StyleSheet.create({
  background:{
    backgroundColor:"#05558F",
    height:500,
    alignItems:'center',
    justifyContent:'center',
    flex:1
  },
  img:{
    width:120,
    height:120,
    borderRadius:120
   
  },
  txt:{
    color:'white',
    fontSize:50,
    fontFamily:'Preahvihear',
    letterSpacing:1
  },
  innerCircle:{
    borderRadius:120,
    borderColor:'white',
    borderWidth:8,
    width:200,
    height:200,
    justifyContent:'center',
    alignItems:'center'
  },
  outerCircle:{
    borderRadius:180,
    borderColor:'white',
    width:350,
    height:350,
    borderWidth:3,
    justifyContent:'center',
    alignItems:'center'
  },
  interCircle:{
    borderRadius:150,
    borderColor:'white',
    width:280,
    height:280,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:5
  }
});