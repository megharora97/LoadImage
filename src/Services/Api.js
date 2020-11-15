import React, { Component } from 'react';
import { Platform, StyleSheet, Dimensions, Image, Alert, FlatList, ScrollView, StatusBar, TouchableOpacity, SafeAreaView, View, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Button, Text, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios'
import Config from '../Utils/Config';

const { height, width } = Dimensions.get('window');

export const GetimageData = (Url1, formData) => {
    let Url = Url1
    var authOptions = {
        method: 'POST',
        url: Url,
        data: formData,
        headers: {
            "Accept": 'application/json',
            'Content-Type': 'multipart/form-data'
        },
    };
    console.log("authOptions GetimageData", authOptions);
    return axios(authOptions)
        .then(res => {
            if (res.data) {
                console.log('authOptions GetimageData resdata', res.data);
                if (res.data.status == 'success') {
                    return res.data
                }
                else {
                    throw res.data.error
                }
            }
            else {
                console.log("Image Api done but erro occured", res);
            }
        })
        .catch((error) => {
            console.log('GetimageData ', error);
            handleError(error)
        });
}



// export const SaveimageData = () => {
//     let Url = Config.SaveDataApi
//     let formData = new FormData();
//     formData.append("first_name", '');
//     formData.append("last_name", '');
//     formData.append("email", '');
//     formData.append("phone", '');
//     formData.append("user_image", '');

//     var authOptions = {
//         method: 'POST',
//         url: Url,
//         data: formData,
//         json: true
//     };
//     console.log("authOptions SaveimageData", JSON.stringify(authOptions));
//     return axios(authOptions)
//         .then(res => {
//             if (res.data) {
//                 console.log('authOptions SaveimageData resdata', res.data);
//                 if (res.data.status) {
//                     return res.data
//                 }
//                 else {
//                     throw res.data.error
//                 }
//             }
//             else {
//                 console.log("SaveimageData Api done but erro occured", res);
//             }
//         })
//         .catch((error) => {
//             console.log('GetimageData ', error);
//             handleError(error)
//         });
// }



function handleError(error) {
    console.log("Eror" + JSON.stringify(error));
    if (!error.response) {
        throw 'Please Check your Network Connection'
        //n/w error
    }
    else {
        const code = error.response.status
        //resp dataa
        const response = error.response.data
        console.log('Code' + code + 'response', +response);


        if (error.response.status === 400) {
            throw 'Please Provide Valid Credentials'

        }
        else {
            throw 'OOPs Server Eror Ocuured'
        }
    }

}