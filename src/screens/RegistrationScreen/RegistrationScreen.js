import React, { useState } from 'react'
import { Text, StatusBar, Button, StyleSheet, Image, TextInput, TouchableOpacity, View, Alert } from 'react-native';
//import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { firebase } from '../../firebase/config'

export default function RegistrationScreen({ navigation }) {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    //Check registration for necessary constraints and push data to firebase
    const checkRegister = () => {
      const usersRef = firebase.firestore().collection('users')
        if (!fullName.trim()) {
          Alert.alert('All fields must be filled out','Please Enter Your Name');
          return;
        }
        if (!email.trim()) {
            Alert.alert('All fields must be filled out','Please Enter an Email');
            return;
        }
        if (!password.trim()) {
            Alert.alert('All fields must be filled out', 'Please Enter a Password');
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords don't match")
            return;
        }

        //Push data to firebase auth and firestore users collection
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
              let unique;
              let friendCode;
              let querySnapshot;
              const createdUser = response.user;
              
              //Generate unique 6 character friend code, size of possible set reduces inefficiency as collisions are rare
              do{
                friendCode = generateFriendCode();
                querySnapshot = usersRef.where("friendCode", "==", friendCode).where("id", "!=", createdUser.uid).get().then((snapshot) => {
                  if (snapshot.empty) {
                    unique = true;
                  } else {
                    unique = false;
                  }
                })
              } while (unique == false);
              
                const data = {
                  id: createdUser.uid,
                  email,
                  fullName,
                  friendCode: friendCode,
                };
              
                usersRef
                  .doc(createdUser.uid)
                  .set(data)
                  .then(() => {
                      navigation.navigate('Home', {user: data})
                  })
                  .catch((error) => {
                      alert(error)
                  });
                
            })
            .catch((error) => {
                alert(error)
            });
        
    };

  
    //Generate random 6 character friend code, size of possible set reduces inefficiency as collisions are rare
    const generateFriendCode = () => {
      var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var code = '';
      for (var i = 6; i > 0; --i) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }
      return code;
    }


    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#22cccc' }]}>

        <StatusBar barStyle="dark-content" backgroundColor="#22cccc" />

        <Image source={require('../../logo.png')} style={styles.pic} />

        <Text style={{
          color: '#000',
          paddingTop: 20,
          paddingBottom: 20,
          fontSize: 20
        }}>Log in to start discovering new music!</Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#000"
          onChangeText={
            (value) => setFullName(value)
          }
          style={{
            height: 40,
            width: 250,
            color: "#000",
            borderColor: '#000',
            borderWidth: 3,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            marginBottom: 20,
            marginTop: 20
          }}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#000"
          onChangeText={
            (value) => setEmail(value)
          }
          style={{
            height: 40,
            width: 250,
            color: "#000",
            borderColor: '#000',
            borderWidth: 3,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            marginBottom: 20,
            marginTop: 20
          }}
        />

        <TextInput
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor="#000"
          onChangeText={
            (value) => setPassword(value)
          }
          style={{
            height: 40,
            width: 250,
            color: "#000",
            borderColor: '#000',
            borderWidth: 3,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            marginBottom: 20,
          }}
        />

        <TextInput
          secureTextEntry={true}
          placeholder="Confirm Password"
          placeholderTextColor="#000"
          onChangeText={
            (value) => setConfirmPassword(value)
          }
          style={{
            height: 40,
            width: 250,
            color: "#000",
            borderColor: '#000',
            borderWidth: 3,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            marginBottom: 20,
          }}
        />

        <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonBlack}
          onPress={() => checkRegister()}
        >
          <Text style={{ color: '#2cc' }}>Register</Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
  
    );
  }