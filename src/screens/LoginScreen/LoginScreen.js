import React, { useState } from 'react'
import { Text, StatusBar, Button, StyleSheet, Image, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import styles from './styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { firebase } from '../../firebase/config'


export default function LoginScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const Register = () => {
      navigation.navigate('Registration');
    };

    //Check login info for necessary constraints
    const checkLogin = () => {

        if (!email.trim()) {
            Alert.alert('All fields must be filled out','Please Enter an Email');
            return;
        }
        if (!password.trim()) {
            Alert.alert('All fields must be filled out', 'Please Enter a Password');
            return;
        }

        //Run firebase authentication and sign in
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert("User does not exist anymore.")
                            return;
                        }
                        const user = firestoreDocument.data()
                        navigation.navigate('Home', {user})
                    })
                    .catch(error => {
                        alert(error)
                    });
            })
            .catch(error => {
                alert(error)
            })
    };

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

        <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonBlack}
          onPress={() => Register()}
        >
          <Text style={{ color: '#2cc' }}>Register</Text>
        </TouchableOpacity>
        <Text>     </Text>
        <TouchableOpacity
          style={styles.buttonBlack}
          onPress={() => checkLogin()}
        >
          <Text style={{ color: '#2cc' }}>Log In</Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
  
    );
  }