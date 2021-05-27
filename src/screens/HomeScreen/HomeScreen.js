import React, { useState, useEffect } from 'react'
import { Modal, ScrollView, Text, StatusBar, Button, StyleSheet, Image, TextInput, TouchableOpacity, View, Alert, Dimensions, FlatList } from 'react-native';
import {Icon} from 'react-native-elements'
import styles from './styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { Directions } from 'react-native-gesture-handler';
import GameComponent from './components/GameComponent';
import  AppBar from '../GlobalComponents/AppBarComponent';
import Navigation from '@react-navigation/native';
import { firebase } from '../../firebase/config';


export default function HomeScreen({ navigation, user }) {
  // Sets states that will be utilized in the rest of the code
  const[loading, setLoading] = useState(true);
  const[userGames, setGames] = useState([]);
  const[codeWindow, setCodeWindow] = useState(false);
  const[friendCode, setFriendCode] = useState('');

    const logout = () => {
        firebase.auth().signOut()
            .then(
                navigation.navigate('Login')
            )
            .catch((error) => {
                alert(error);
                return
            });
    };
    // Retrieves a list of games based on the user so we can populate on the home screen
    const getGames = async () => {
      setLoading(false);
      let tempUserGames = [];
      const userDoc = await firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid).get();
      setFriendCode(userDoc.data().friendCode)
      const userGameIDs = userDoc.data().games;
      if (userGameIDs && userGameIDs.length > 0) {
        await userGameIDs.map(async gameID => {
          const gameDoc = await firebase.firestore().collection('games').doc(gameID).get();
          tempUserGames.push(gameDoc.data());
          setGames(tempUserGames);
        })
      } else {
        setGames(tempUserGames);
      }
      
    }
    //Creates a list of the games the user is in that shows up on the screen
    const getGameComponents = () => {
      if (userGames.length == 0) {
        return (
          <View style={{height:80, width:'100%', alignContent:'center'}}>
            <Text style={{color:'#2cc'}}>Try Creating a Game!</Text>
          </View>
        )
      }
      return (
        <FlatList
          data={userGames}
          renderItem={({ item }) => (
            <TouchableOpacity
            onPress={() => navigation.navigate('CurrentGame', {gameId: item.id})}
            >
              <GameComponent 
              GameName = {item.gameName}
              />
            </TouchableOpacity>
          )}
          />
      ); 
    }
    //Helps for a rendering issue to only proc reloads of the screen when we want it to
    useEffect(() => {
      if (loading) {
        getGames();
      }
    }, [loading]);

    useEffect(() => {
      const unsubscribe = navigation.addListener("focus", ()=> {
        if (!loading) {
          setLoading(true);
        }
        
      })
      return unsubscribe;
    }, [navigation]);


    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#000000' }]}>

        <StatusBar barStyle="light-content" backgroundColor="#2cc" />

        <AppBar navigation={navigation} Title="Tune Tuesday" BackLink="Login" Component={
          <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
            <TouchableOpacity onPress={() => setLoading(true)} style={{marginRight:10}}>
              <Icon name='refresh' type='FontAwesome' color='#000' size={25}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setCodeWindow(true)}} style={{alignSelf:'flex-end'}}>
              <Icon name='slideshare' type='entypo' color='#000' size={25} />
            </TouchableOpacity>
          </View>
            
          } 
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={codeWindow}
          onRequestClose={() => {
            setCodeWindow(!codeWindow);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={()=>{setCodeWindow(!codeWindow)}} style={{position:'absolute', right:5, top:4}}>
                <Icon name='cross' type="entypo" color='#2cc' size={20}/>
              </TouchableOpacity>
              <Text style={{color: '#2cc', textAlign: 'center', fontSize:20,}}>Your Friend Code:</Text>
              <Text selectable={true} style={{color: '#6930c3', fontSize:30,}}>{friendCode}</Text>
            </View>
          </View>
        </Modal>

          <TouchableOpacity
            style={styles.buttonBlue}
            onPress={() => navigation.navigate('CreateGame', {user})}
          >
            <Text>Create Game</Text>
          </TouchableOpacity>

          
          <View style={styles.gameList}>
          
            {
              getGameComponents()
            }
          
          </View>
          

          <TouchableOpacity
            style={styles.buttonBlue}
            onPress={() => logout()}
          >
            <Text>Log Out</Text>
          </TouchableOpacity>
        
        
        

      </SafeAreaView>
    );
  }