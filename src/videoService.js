import axios from "axios"

export const setupVideoCall = (navigation, user) =>{
    axios.post('http://192.168.18.16:8000/get-videoToken', {identity: user.userID, room: 'Video Room'})
    .then(response =>{
        console.log(response.data.token);
        axios.post("http://192.168.18.16:8000/notify", {deviceID: user.deviceID, roomID: 'Video Room'})
        .then(res => {
          console.log("Data: ", res.data);
          navigation.navigate('Video', {
              token: response.data.token
          });
        })
        .catch(err => console.error(err));
    });
}