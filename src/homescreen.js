import React, { useState,useEffect } from 'react';
//import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { Text, View, StyleSheet ,Image ,TouchableOpacity,TextInput} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import Back3 from "./back3";
export default function HomeScreen({ navigation, route }) 
{
  
    return(
     
     <View style = {{backgroundColor:'white'}}>   
     <Image
     style={{ marginLeft: 10, borderRadius: 10, marginTop: 50, width: 300, height: 305 }}
     source={require('../assets/images/hy.png')}
   /> 
  <View style = {{  width:360, marginTop:100 ,height:330, backgroundColor:'#1F4A83', borderTopLeftRadius:300}}>
              <Text style = {{marginLeft:110,fontFamily:'Poppins-Bold',marginTop:100 , fontSize:30,color:'white' }}>Hello Admin!!
              </Text> 
              <View style = {{marginLeft:260 }}>
              <TouchableOpacity style={{ width: 60,height : 60, margin: 15  , borderRadius:50, backgroundColor:'white'}}  onPress={() => navigation.navigate('Userdetail')}>
                   <View style = {{flexDirection:'row'}}>
                  
                   <Icon name="chevron-forward-outline" style = {{marginTop:8}}marginLeft= {10}  size ={45}  color = {'#1F4A83'}/>
                   </View>
                   </TouchableOpacity>
                   </View>
              </View>
     </View>
    
    );
  }
  const styles = StyleSheet.create({
    image: {
		width: '90%',
        marginTop:455,
        marginLeft:7,
        borderTopLeftRadius:350,
		height: 260,
        borderRadius:30
		
		
	},
});