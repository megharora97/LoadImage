import React, { Component } from 'react';
import { Platform, StyleSheet, Dimensions, Image, Alert, FlatList, ScrollView, StatusBar, SafeAreaView, View, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Button, Text, Icon, Input } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { SaveimageData } from '../Services/Api';
import { SaveDataApi } from '../Utils/Config';
import { GetimageData } from '../Services/Api';

import RNFetchBlob from 'rn-fetch-blob'
let imagePath = null

const { height, width } = Dimensions.get('window');

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FirstName: '',
      FirstName_error: '',
      LastName: '',
      LastName_error: '',
      Email: '',
      Email_error: '',
      MobileNo: '',
      MobileNo_error: '',
      loading: false,
      img: null,
      img1: null,
    }
  }

  async componentDidMount() {
    console.log('this.props.route.params', this.props.route.params.image)
    if (this.props && this.props.route && this.props.route.params) {
      this.setState({ img: this.props.route.params.image })
      await RNFetchBlob
        .config({
          fileCache: true,
          // by adding this option, the temp files will have a file extension
          appendExt: 'png'
        })
        .fetch('GET', this.props.route.params.image, {
          //some headers ..
        })
        .then((res) => {
          // the temp file path with file extension `png`
          let part = res.path().indexOf("files")
          let url = res.path().slice(part)
          console.log('The file saved to ', res, res.path(), part, res.path().slice(part), RNFetchBlob.wrap(res.path()))
          imagePath = res.path()
          // uri:res.path(),

          let photo = {
            filename: 'file.jpeg',
            uri: 'file://' + res.path(),
            type: 'image/jpeg',
            name: 'image'
          }
          this.setState({ img1: photo })
          return res.readFile("base64")

        })
        .then((res) => {
          // the temp file path with file extension `png`
          console.log('base ', res)
        })

    }

  }

  validateEmail(Email) {
    console.log('validateEmail :- ' + Email);
    var Email_Regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return Email_Regex.test(Email);
  }


  async SaveData() {
    const { FirstName, LastName, Email, MobileNo, img, img1 } = this.state

    this.setState({ loading: true })
    let formData = new FormData();
    formData.append('first_name', FirstName);
    formData.append('last_name', LastName);
    formData.append('email', Email);
    formData.append('phone', MobileNo);
    formData.append('user_image', img1);

    await GetimageData(SaveDataApi, formData)
      .then((res) => {
        this.setState({ loading: false })
        console.log("SaveData res", res);
        if (res.status === 'success') {
          let Response = res.images
          console.log("Response", Response);
          alert(res.message)
          this.props.navigation.navigate('Home')
        }
        else {
          alert(res.result)
        }
      })
      .catch((error) => {
        this.setState({ loading: false })
        console.log('SaveData Eroor', error);
        alert(error)
      })
  }



  SubmitFields = () => {
    Keyboard.dismiss();
    const { FirstName, FirstName_error, LastName, LastName_error, Email, Email_error, MobileNo, MobileNo_error } = this.state;
    this.setState({ FirstName_error: '', LastName_error: '', Email_error: '', MobileNo_error: '', })

    let FirstNameN = ''
    if (FirstName) { FirstNameN = FirstName.trim() }

    let LastNameN = ''
    if (LastName) { LastNameN = LastName.trim() }

    let EmailN = ''
    if (Email) { EmailN = Email.trim() }

    let EmailValid = false
    if (EmailN) { EmailValid = this.validateEmail(EmailN) }

    let MobileNoN = ''
    if (MobileNo) { MobileNoN = MobileNo.toString() }

    if (!FirstNameN && LastNameN && EmailN && !MobileNoN) {
      Alert.alert('', 'All fields are required!!', [{ text: 'Okay', onPress: () => { this.FirstNameInput.focus(); } },], { cancelable: false })
    }
    else if (!FirstNameN) {
      this.setState({ FirstName_error: 'Please enter First Name' })
      this.FirstNameInput.focus();
    }
    else if (!LastNameN) {
      this.setState({ LastName_error: 'Please enter Last Name' })
      this.LastNameInput.focus();

    }
    else if (!EmailN) {
      this.setState({ Email_error: 'Please enter Email Address' })
      this.EmailInput.focus();
    }
    else if (!EmailValid) {
      this.setState({ Email_error: 'Please enter valid email address' })
      this.EmailInput.focus();
    }
    else if (!MobileNoN) {
      this.setState({ MobileNo_error: 'Please enter  Mobile Number ' })
      this.MobileInput.focus();
    }
    else if (MobileNoN.length < 10) {
      this.setState({ MobileNo_error: 'Please Enter Valid Mobile Number' })
      this.MobileInput.focus();
    }
    else if (MobileNoN) {
      let num = MobileNoN.replace(".", '');
      if (isNaN(num)) {
        this.setState({ MobileNo_error: 'Please enter valid mobile no.' })
        this.MobileInput.focus();
      }
      else {

        this.SaveData()
      }
    }


  }


  render() {
    const { FirstName, FirstName_error, LastName, LastName_error, Email, Email_error, MobileNo, MobileNo_error, img1, img } = this.state;

    return (
      <SafeAreaView style={{ flex: 1 }}>

        <KeyboardAvoidingView style={{ flex: 1, width: '100%', alignItems: 'center' }} >
          <ScrollView style={{}} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>

            <View style={{ margin: height / 80 }}>
              {img && img != '' ?
                <Image
                  source={{ uri: img }}
                  style={{ height: width / 1.1, width: width / 1.1 }}
                  placeholderStyle={{ backgroundColor: 'transparent' }}
                  resizeMode='contain'
                  resizeMethod='resize'
                />
                : null}
            </View>


            <View style={{ marginTop: height / 80 }}>
              {/* FirstName */}
              <View>
                <Input
                  inputContainerStyle={styles.inputContainer_Style}
                  containerStyle={{ alignItems: 'center', }}
                  autoCapitalize="none"
                  inputStyle={[styles.input_style]}
                  onChangeText={value => this.setState({ FirstName: value, FirstName_error: '' })}
                  value={FirstName}
                  secureTextEntry={false}
                  keyboardType='default'
                  returnKeyType='next'
                  onSubmitEditing={() => this.LastNameInput.focus()}
                  ref={input => (this.FirstNameInput = input)}
                  placeholder='FirstName'
                  placeholderTextColor='#D3D3D3'
                  errorStyle={{ color: 'red', width: '100%', fontSize: height / 70 }}
                  errorMessage={FirstName_error}
                />
              </View>

              {/* LastName */}
              <View >
                <Input
                  inputContainerStyle={styles.inputContainer_Style}
                  containerStyle={{ alignItems: 'center', }}
                  autoCapitalize="none"
                  inputStyle={[styles.input_style]}
                  onChangeText={value => this.setState({ LastName: value, LastName_error: '' })}
                  value={LastName}
                  secureTextEntry={false}
                  keyboardType='default'
                  returnKeyType='next'
                  onSubmitEditing={() => this.EmailInput.focus()}
                  ref={input => (this.LastNameInput = input)}
                  placeholder='LastName'
                  placeholderTextColor='#D3D3D3'
                  errorStyle={{ color: 'red', width: '100%', fontSize: height / 70 }}
                  errorMessage={LastName_error}

                />
              </View>

              {/* Email */}
              <View>
                <Input
                  inputContainerStyle={styles.inputContainer_Style}
                  containerStyle={{ alignItems: 'center', }}
                  autoCapitalize="none"
                  inputStyle={[styles.input_style]}
                  onChangeText={value => this.setState({ Email: value, Email_error: '' })}
                  value={Email}
                  secureTextEntry={false}
                  keyboardType='email-address'
                  returnKeyType='next'
                  onSubmitEditing={() => this.MobileInput.focus()}
                  ref={input => (this.EmailInput = input)}
                  placeholder='Email'
                  placeholderTextColor='#D3D3D3'
                  errorStyle={{ color: 'red', width: '100%', fontSize: height / 70 }}
                  errorMessage={Email_error}

                />
              </View>

              {/* MobileNo */}
              <View>
                <Input
                  inputContainerStyle={styles.inputContainer_Style}
                  containerStyle={{ alignItems: 'center', }}
                  autoCapitalize="none"
                  inputStyle={[styles.input_style]}
                  onChangeText={value => this.setState({ MobileNo: value, MobileNo_error: '' })}
                  value={MobileNo}
                  maxLength={15}
                  secureTextEntry={false}
                  keyboardType='phone-pad'
                  returnKeyType='done'
                  ref={input => (this.MobileInput = input)}
                  placeholder='Mobile No '
                  placeholderTextColor='#D3D3D3'
                  errorStyle={{ color: 'red', width: '100%', fontSize: height / 70 }}
                  errorMessage={MobileNo_error}

                />
              </View>

            </View>

            <View style={{ justifyContent: 'center', marginTop: height / 30, alignItems: 'center' }}>
              <Button
                titleStyle={{ justifyContent: 'center', fontSize: height / 47, alignContent: "center", color: 'black' }}
                containerStyle={{ width: width / 2.5, }}
                buttonStyle={{ backgroundColor: 'yellow' }}
                onPress={() => this.SubmitFields()}
                title="SUBMIT"
              />
            </View>



          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

    );
  }
}

export default Details

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  input_style: {
    marginBottom: -15,
    fontSize: height / 50,
    color: 'white',
    borderBottomColor: '#D3D3D3'
  },
  inputContainer_Style: {
    borderColor: '#D3D3D3',
    borderBottomWidth: 0.5,
    height: height / 17,
    marginLeft: -10,
    width: '100%',

  },

});