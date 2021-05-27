import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Text, StatusBar, Button, StyleSheet, Image, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { LoginScreen, RegistrationScreen, HomeScreen, CreateGameScreen, CurrentGameScreen, RankSongsScreen, SongSubmissionScreen, SessionHistoryScreen, CurrentPointScreen, RoundSummary, GuessDJ } from './src/screens'
import { firebase } from './src/firebase/config'
import { render } from 'react-dom';
//import * as Notifications  from 'expo-notifications';
import Constants from 'expo-constants';
import { LogBox } from 'react-native';


const Stack = createStackNavigator();

export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)


  // registerForPushNotificationsAsync = async () => {
  //   if (Constants.isDevice) {
  //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== 'granted') {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== 'granted') {
  //       alert('Failed to get push token for push notification!');
  //       return;
  //     }
  //     const token = (await Notifications.getExpoPushTokenAsync()).data;
  //     await firebase.firestore().collection('users').doc(user.id).set({lastToken: token}, {merge: true})
  //   } else {
  //     alert('Must use physical device for Push Notifications');
  //   }
  
  //   if (Platform.OS === 'android') {
  //     Notifications.setNotificationChannelAsync('default', {
  //       name: 'default',
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: '#FF231F7C',
  //     });
  //   }
  // };
  

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        //alert('user')
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setUser(userData)
            setLoading(false)
          })
          // .then(() => {
          //   registerForPushNotificationsAsync();
          // })
          .catch((error) => {
            setLoading(false)
          });
          
      } else {
        //alert('no user')
        setLoading(false)
      }
    });
  }, []);

  if (loading) {
    return (<></>)
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown:false }} initialRouteName={(user !== null) ? 'Home' : 'Login'}>
            <Stack.Screen name="Home">
              {props => <HomeScreen {...props} extraData={user} />}
            </Stack.Screen>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
            <Stack.Screen name="RankSongs" component={RankSongsScreen} />
            <Stack.Screen name="CreateGame">
              {props => <CreateGameScreen {...props} extraData={user} />}
            </Stack.Screen>
            <Stack.Screen name="CurrentGame">
              {props => <CurrentGameScreen {...props} gameId/>}
            </Stack.Screen>
            <Stack.Screen name="SongSubmission" component={SongSubmissionScreen} />
            <Stack.Screen name="SessionHistory" component={SessionHistoryScreen} />
            <Stack.Screen name="CurrentPoint" component={CurrentPointScreen} />
            <Stack.Screen name="RoundSummary" component={RoundSummary} />
      </Stack.Navigator>
    </NavigationContainer>
  );


  

  
}


