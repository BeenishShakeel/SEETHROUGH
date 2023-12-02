import axios from "axios"

export const setupVideoCall = (navigation, user) =>{
    axios.post('http://192.168.18.55:8000/get-videoToken', {identity: user.userID, room: 'Video Room'})
    .then(response =>{
        console.log(response.data.token);
        axios.post("http://192.168.18.55:8000/notify", {deviceID: user.deviceID, roomID: 'Video Room'})
        .then(res => {
          console.log("Data: ", res.data);
          navigation.navigate('BlindVideo', {
              token: response.data.token,
              userID : user.userID
          });
        })
        .catch(err => console.error(err));
    });
}