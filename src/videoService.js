import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setupVideoCall = async (navigation, user) =>{
    
    const name = await AsyncStorage.getItem('name');
    console.log("namee:",name)
    console.log('id',user.userID);
    axios.post('http://192.168.18.55:8000/get-videoToken', {identity: user.userID, room: 'Video Room'})
    .then(response =>{
        console.log(response.data.token);
        axios.post("http://192.168.18.55:8000/notify", {deviceID: user.deviceID, roomID: 'Video Room', name: name})
        .then(res => {
          console.log("Data: ", res.data);
          navigation.navigate('BlindVideo', {
              token: response.data.token,
              userID : user.userID,
            //   name: name
              
          });
        })
        .catch(err => console.error(err));
    });
}