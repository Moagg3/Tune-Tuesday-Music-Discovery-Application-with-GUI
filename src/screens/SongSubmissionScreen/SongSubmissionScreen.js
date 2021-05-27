import React, { useState, useEffect } from "react";
import { Text, StatusBar, Button, StyleSheet, Image, TextInput, TouchableOpacity, View, Alert, Modal } from "react-native";
import styles from './styles';
import  AppBar from '../GlobalComponents/AppBarComponent';
import { firebase } from '../../firebase/config';

export default function SongSubmissionScreen({ route, navigation, ...props}) {

  // submission data for firebase calls
  const [title, setTitle] = useState("Loading");
  const [artistName, setArtistName] = useState('');
  const [comments, setComments] = useState('');
  const [songLink, setSongLink] = useState('');
  const [songName, setSongName] = useState('');
  const [rank, setRank] = useState('');
  const [user, setUser] = useState('');
  const [submitted, setSubmitted] = useState(true);
  let roundData;
  let userData;
  const [game, setGame] = useState('');
  const [round, setRound] = useState('');

  // firebase calls to get title of the game
  useEffect(() => {
    async function firebaseCalls() {
      const roundRef = await firebase.firestore().collection('rounds').doc(route.params.roundId).get();
      roundData = roundRef.data();
      setRound(route.params.roundId);
      const gameRef = await firebase.firestore().collection('games').doc(roundData.game).get();
      gameData = gameRef.data();
      setGame(roundData.game);
      setTitle(gameData.gameName);
    }
    firebaseCalls();
  }, [title]);
  
  const setSubmit = async () => {
    const user = await firebase.auth().currentUser.uid;
    const roundRef = await firebase.firestore().collection('rounds').doc(route.params.roundId).get();
    roundData = roundRef.data();
    const gameRef = await firebase.firestore().collection('games').doc(roundData.game).get();
    gameData = gameRef.data();
    setSubmitted(true);
  }
  //submitting song and store data to firebase, then navigate to CurrentGameScreen
  const submitSong = () => {
    firebase.firestore().collection('users')
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then(firestoreDocument => {
      if (!firestoreDocument.exists) {
        alert("User not signed in.")
        return;
      }
      userData = firestoreDocument.data()
      if (!songName.trim()) {
        Alert.alert('All fields must be filled out', 'Please Enter a Song Name');
        return;
      }
      if (!artistName.trim()) {
        Alert.alert('All fields must be filled out', 'Please Enter an Artist Name');
        return;
      }
      if (!songLink.trim()) {
        Alert.alert('All fields must be filled out', 'Please Enter a Song Link');
        return;
      }
      const songData = {
        artistName:artistName,
        comments:comments,
        rank: 0,
        songLink:songLink,
        songName:songName,
        user:userData.id
      }
      firebase.firestore().collection('games').doc(game).collection('members').doc(firebase.auth().currentUser.uid).update({submitted:true});
      firebase.firestore().collection('rounds').doc(route.params.roundId).collection('songs')
      .add(songData).catch(error => {alert(error)})
      .then(navigation.navigate("CurrentGame", {gameId: game}));
      })

  }
  // return the components to the screen
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2cc" />
      <AppBar Title={title} BackLink="CurrentGame" navigation={navigation} />
      <View style={styles.content}>
      <Text style={styles.songSubmission2}>Song Submission</Text>
      <TextInput
        placeholder="  Song Name"
        placeholderTextColor="rgba(34,204,204,1)"
        onChangeText={
          (value) => setSongName(value)
        }
        style={styles.placeholder}
      ></TextInput>
      <TextInput
        placeholder="  Artist Name"
        placeholderTextColor="rgba(34,204,204,1)"
        onChangeText={
          (value) => setArtistName(value)
        }
        style={styles.placeholder}
      ></TextInput>
      <TextInput
        placeholder="  Song Link"
        placeholderTextColor="rgba(34,204,204,1)"
        onChangeText={
          (value) => setSongLink(value)
        }
        style={styles.placeholder}
      ></TextInput>
      <TextInput
        placeholder="  Comments"
        placeholderTextColor="rgba(34,204,204,1)"
        onChangeText={
          (value) => setComments(value)
        }
        style={styles.placeholder}
      ></TextInput>
      <View style={styles.buttonBlue}>
        <TouchableOpacity
          onPress={() => submitSong()}
        >
          <Text style={styles.submit}>Submit</Text>
        </TouchableOpacity>
      </View>
      </View>
      <View style={styles.content}></View>
      <View style={styles.footer}></View>
    </View>
  );
}

