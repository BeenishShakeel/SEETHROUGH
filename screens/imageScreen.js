import React from "react";
import {View, Image, StyleSheet, Text} from 'react-native';

export default function ImageScreen({ navigation, route }) {
    return (
        <View style={styles.container}>
            {route.params.uri ? (
                <View style={styles.previewContainer}>
                    <Text>Preview</Text>
                    <Image
                        source={{ uri: `data:image/jpg;base64,${route.params.uri}` }}
                        style= {styles.previewImage}
                        resizeMode="contain"
                    />
                </View>
            ) : null}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    previewContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 10,
        backgroundColor: "#000",
    },
    previewImage: { 
        width: 600, 
        height:600,
        backgroundColor: "#fff" }
})