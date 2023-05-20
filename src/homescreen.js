import React, { useState,useEffect } from 'react';
//import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { Text, View, StyleSheet ,Image ,TouchableOpacity,TextInput} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import Back3 from "./back3";
export default function HomeScreen({ navigation, route }) 
{
  
    return(
        <Back3>
            {/* <Image
				source={require('../assets/images/back.jpg')}
			style ={styles.image}></Image> */}
  <View style = {{  width:360, marginTop:400 ,height:330, backgroundColor:'white', borderTopLeftRadius:300}}>
              <Text style = {{marginLeft:110,fontFamily:'Poppins-Bold',marginTop:150 , fontSize:30,color:'#368BC1' }}>Hello Admin
              </Text> 
              <View style = {{marginLeft:100}}>
              <TouchableOpacity style={{ width: 160,height : 52 , margin: 15  ,borderRadius:50, backgroundColor:'#368BC1'}}  onPress={() => navigation.navigate('Userdetail')}>
                   <View style = {{flexDirection:'row'}}>
                   <Text style ={{fontFamily:'Poppins-SemiBold',   marginLeft : 45,fontSize:22 ,marginTop : 5,color :'white'}}>
                   Next
                   </Text>
                   <Icon name="arrow-forward-outline" style = {{marginTop:10}}marginLeft= {4}  size ={25}  color = {'white'}/>
                   </View>
                   </TouchableOpacity>
                   </View>
              </View>
     
    {/* primary : "#368BC1",
              <View style = {{   alignItems:'center' ,marginTop:440, borderRadius: 45,backgroundColor:"#368BC1" , width :360, height : 280}}>
              <Text style = {{fontFamily:'Poppins-Bold',marginTop:100 , fontSize:22,color:'white' }}> Set Up Your business with us
              </Text>
              <TouchableOpacity style={{ marginTop :40,width: 180,height : 62 , margin: 15  ,borderRadius:50, backgroundColor:'#B48D42'}}  onPress={() => navigation.navigate('SecondScreen')}>
                   <View style = {{flexDirection:'row'}}>
                   <Text style ={{fontFamily:'Poppins-Bold',   marginLeft : 45,fontSize:25 ,marginTop : 12 ,color :'white'}}>
                   Next
                   </Text>
          
                   <Icon name="arrow-forward-outline" style = {{marginTop:16}}marginLeft= {16}  size ={32}  color = {'white'}/>
                   </View>
              </TouchableOpacity>
              </View>
     
      </View> */}
      </Back3>
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