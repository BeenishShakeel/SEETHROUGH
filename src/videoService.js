import axios from "axios"

export const setupVideoCall = (navigation, userId) =>{
    axios.post('http://192.168.18.55:8000/get-videoToken', {identity: userId, room: 'Video Room'})
    .then(response =>{
        console.log(response.data.token);
        navigation.navigate('Video',{
            token: response.data.token
        });
    })
}