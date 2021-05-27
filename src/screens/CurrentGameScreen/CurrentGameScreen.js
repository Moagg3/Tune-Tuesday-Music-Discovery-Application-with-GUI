import React, { useState, useEffect } from 'react'
import { ScrollView, Text, StatusBar, Button, StyleSheet, Image, TextInput, TouchableOpacity, View, Alert, Modal } from 'react-native';
import { Icon } from 'react-native-elements';
import styles from './Components/styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { Directions } from 'react-native-gesture-handler';
import GameComponent from './Components/GameComponent';
import  AppBar from '../GlobalComponents/AppBarComponent';
import { firebase } from '../../firebase/config';
import { TabRouter } from 'react-navigation';
import { Picker } from '@react-native-picker/picker'
import { useFocusEffect } from '@react-navigation/native'


export default function CurrentGameScreen({ route, navigation }) {

//GameState Enum
const states = {
  PREGAME: "pregame",
  WAITPREGAME: 'waitpregame',
  SUBMIT: "submit",
  WAITSUBMIT: 'waitsubmit',
  RANK: 'rank',
  WAITRANK: 'waitrank'
}

const [title, setTitle] = useState("Loading")
const [inviteWindow, setInviteWindow] = useState(false)
const [nameWindow, setNameWindow] = useState(false)
const [judgeWindow, setJudgeWindow] = useState(false)
const [judge, setJudge] = useState('')
const [friendCode, setFriendCode] = useState('')
const [users, setUsers] = useState([])
const [displayName, setDisplayName] = useState('')
const [gameState, setGameState] = useState(states.PREGAME);
const [loading, setLoading] = useState(true);
const [round, setRound] = useState('');
const [roundAd, setRoundAd] = useState('');

let gameData;


//Adds user to game from user input Friend Code
const invite = async () => {
  //Check for proper conditions to add more users
  if (friendCode.length != 6) {
    alert("Please Input a Full 6 Digit Friend Code");
    return;
  }
  if (users.length > 7) {
    alert("Cannot add more players. Game is already full.");
  }

  //Get requested user doc and game doc
  const usersRef = await firebase.firestore().collection('users');
  const gameDoc = await firebase.firestore().collection('games').doc(route.params.gameId);
  const querySnap = await usersRef.where('friendCode', '==', friendCode).get().catch(error => alert(error));
  if (querySnap.empty) {
    alert("Could not find a user with that Friend Code");
    return;
  }

  //Add the user to the game doc and add the game to the user doc, updating relevant fields
  querySnap.forEach(async doc => {
    const userData = await doc.data();
    const userDoc = await firebase.firestore().collection('users').doc(userData.id);
    const memberData = {
      id: userData.id,
      creator: false,
      memberType: "participant",
      points: 0,
      displayName: '',
      submitted: false,
    }
    gameDoc.collection('members').doc(userData.id).set(memberData).catch(error => alert(error));
    userDoc.update({games: firebase.firestore.FieldValue.arrayUnion(gameDoc.id)});
    setInviteWindow(false);
    setLoading(true);
  })
}


//Determine current game state on load
const getGameState = async (game) => {
  const memberRef = await firebase.firestore().collection('games').doc(route.params.gameId).collection('members');
  const memberQuery = await memberRef.get();
  const currentUserRef = await memberRef.doc(firebase.auth().currentUser.uid).get();
  const currentUser = await currentUserRef.data();
  let allSubmitted = true;
  let usersList = [];


  //Check for judge and submission status on all game members
  await memberQuery.forEach(async member => {
    const memberData = await member.data()
    if (memberData.memberType == 'judge') {
      setJudge(memberData);
      memberData.submitted = 'judge';
    }
    else if (!memberData.submitted) {
      allSubmitted = false;
    }
    usersList.push(memberData);
    setUsers(usersList)

  })
  //Set game state based on conditions
  if (!game.isStarted && currentUser.creator) {

    setGameState(states.PREGAME);


  } else if (!game.isStarted) {
    setGameState(states.WAITPREGAME);

  } else if (!currentUser.submitted && currentUser.memberType != 'judge') {
    setGameState(states.SUBMIT);

  } else if (!allSubmitted) {
    setGameState(states.WAITSUBMIT);

  } else if (currentUser.memberType == 'judge') {
    setGameState(states.RANK)

  } else {
    setGameState(states.WAITRANK);
  }

}


//Check if user has display name, if not open the display name modal popup
const checkDisplayName = async () => {
  const user = await firebase.auth().currentUser.uid;
  const memberDoc = await firebase.firestore().collection('games').doc(route.params.gameId).collection('members').doc(user).get();
  if (memberDoc.data().displayName == null || memberDoc.data().displayName == '') {
    setNameWindow(true);
  }
}


//Set a user's display name based on display name modal input
const setName = async () => {
  const user = await firebase.auth().currentUser.uid;
  const memberRef = await firebase.firestore().collection('games').doc(route.params.gameId).collection('members').doc(user);
  await memberRef.update({displayName:displayName});
  setLoading(true);
  setNameWindow(false);
}

//Start game from the pregame state based on 'start game' button press
const startGame = async () => {
  //Check necessary starting conditions
  if (users.length < 4) {
    alert('Must invite more players! A minimum of 4 players is required to start the game.')
    return;
  }

  //Update game doc and check for judge selection
  const gameRef = await firebase.firestore().collection('games').doc(route.params.gameId);
  const gameSnap = await gameRef.get();
  const game = await gameSnap.data();

  if (game.initialJudgeSelect) {
    // Open judge select popup modal if judge needs to be selected
    setJudgeWindow(true);

  } else {
    // Choose random judge otherwise
    setJudge(users[Math.floor(Math.random()*users.length)]);
    await gameRef.collection('members').doc(judge.id).update({memberType: 'judge'});

    // Create new round for the game and push to database
    const roundData = {
      game: game.id,
      isActive: true,
      roundNumber: 1,
      judge: judge.id,
    }
    await firebase.firestore().collection('rounds').add(roundData).then(async doc => {
      roundData.id = doc.id;
      await gameRef.update({activeRound:roundData.id, isStarted:true})
    })
    await firebase.firestore().collection('rounds').doc(roundData.id).set(roundData);
    setLoading(true);
  }

};


//Cancel game start if judge selection is cancelled
const cancelStart = async () => {
  setJudgeWindow(false);
  await firebase.firestore().collection('games').doc(route.params.gameId).update({isStarted:false});
  setLoading(true);
}


// Update backend with selected judge from modal popup
const selectJudge = async () => {
  const gameRef = await firebase.firestore().collection('games').doc(route.params.gameId);
  const gameSnap = await gameRef.get();
  const game = await gameSnap.data();
  alert(judge.displayName);
  await gameRef.collection('members').doc(judge.id).update({memberType: 'judge'});
  //Create new round and push to database
  const roundData = {
    game: game.id,
    isActive: true,
    roundNumber: 1,
    judge: judge.id,
  }
  await firebase.firestore().collection('rounds').add(roundData).then(async doc => {
    roundData.id = doc.id;
    await gameRef.update({activeRound:roundData.id, isStarted:true})
  })
  await firebase.firestore().collection('rounds').doc(roundData.id).set(roundData);
  setJudgeWindow(false);
  setLoading(true);
}

//Returns primary button on screen (Start Game, Submit Songs, Rank Songs, etc)
const getButton = () => {
  //Returns button based on game state
  switch (gameState) {
    case (states.PREGAME):
      return (<TouchableOpacity
                style={styles.buttonBlue}
                onPress={() => startGame()}
              >
                <Text>Start Game</Text>
              </TouchableOpacity>)

    case (states.WAITPREGAME):
      return (<Text style={{color:'#2cc'}}>Please Wait for the Creator to Start the Game</Text>)

    case states.SUBMIT:

      // Return dummy button if necessary round information is still being retrieved
      if (loading) {
        return (<TouchableOpacity
          style={styles.buttonBlue}
          onPress={() => navigation.navigate("SongSubmission", {roundId: '-1'})}
          >
          <Text>Submit Song</Text>
          </TouchableOpacity>)
      } else {
        return (<TouchableOpacity
          style={styles.buttonBlue}
          onPress={() => navigation.navigate("SongSubmission", {roundId: roundAd})}
          >
          <Text>Submit Song</Text>
          </TouchableOpacity>)
      }

    case states.WAITSUBMIT:
      return (<Text style={{color:'#2cc'}}>Waiting for All Players to Submit</Text>)


    case states.RANK:
      if (loading) {
        return (<TouchableOpacity
          style={styles.buttonBlue}
          onPress={() => navigation.navigate("RankSongs", {roundId: '-1'})}
          >
          <Text>Rank Songs</Text>
          </TouchableOpacity>)
      } else {
        return (<TouchableOpacity
          style={styles.buttonBlue}
          onPress={() => navigation.navigate("RankSongs", {roundId: roundAd})}

          >
          <Text>Rank Songs</Text>
          </TouchableOpacity>)
      }

    case states.WAITRANK:
      return (<Text style={{color:'#2cc'}}>Waiting for Judge to Rank Submissions</Text>)
  }
}

//Returns the current judge's display name as a string if one is selected
const getJudge = () => {
  if (gameState == states.PREGAME || gameState == states.WAITPREGAME) {
    return 'Undetermined'
  } else {
    return judge.displayName
  }
}

//Returns current round number if the game is active
const getRound = async (round) => {
  if (round){
    const roundRef = await firebase.firestore().collection('rounds').doc(round).get();
    setRound(roundRef.data())
  } else {
    const tempRound = {roundNumber:0, id: -1, judge:-1, game:route.params.gameId}
    setRound(tempRound)
  }
}

//On load retrieves all necessary backend data, loading state ensures this only happens when necessary
useEffect(() => {

  //Async function to perform all of the database calls
  async function firebaseCalls() {
    if (loading) {
    const gameRef = await firebase.firestore().collection('games').doc(route.params.gameId).get();
    gameData = gameRef.data();
    setTitle(gameData.gameName);
    await getGameState(gameData);
    await checkDisplayName();
    await getRound(gameData.activeRound);
    setRoundAd(gameData.activeRound);
    setLoading(false);
    }
  }

  firebaseCalls();


}, [loading]);

React.useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    if (!loading) {
      setLoading(true);
    }
  });

  return unsubscribe;
}, [navigation]);

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#000000' }]}>

        <StatusBar barStyle="light-content" backgroundColor="#2cc" />

        <AppBar navigation={navigation} Title={title} BackLink="Home" Component= {
          <TouchableOpacity onPress={() => setLoading(true)}>
            <Icon name='refresh' type='FontAwesome' color='#000' size={25}/>
          </TouchableOpacity>
        } />

        {/* Invite Popup Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={inviteWindow}
          onRequestClose={() => {
            setInviteWindow(!inviteWindow);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>

              <TouchableOpacity onPress={()=>{setInviteWindow(!inviteWindow)}} style={{position:'absolute', right:5, top:4}}>
                <Icon name='cross' type="entypo" color='#2cc' size={20}/>
              </TouchableOpacity>

              <Text style={{color: '#2cc', textAlign: 'center', marginTop:20}}>Please Enter a User's Friend Code to Invite Them to the Game!</Text>
              <TextInput maxLength={6} style={styles.textInput} onChangeText={(value) => setFriendCode(value)}></TextInput>

              <TouchableOpacity style={styles.buttonBlue} onPress={() => invite()}>
                <Text>Invite</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

        {/* Judge Select Popup Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={judgeWindow}
          onRequestClose={() => {
            cancelStart();
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>

              <TouchableOpacity onPress={()=>{cancelStart()}} style={{position:'absolute', right:5, top:4}}>
                <Icon name='cross' type="entypo" color='#2cc' size={20}/>
              </TouchableOpacity>

              <Text style={{color: '#2cc', textAlign: 'center', marginTop:20}}>Please Select a User to be the First Judge</Text>

              {/* List dropdown picker that loads all current game members as choices */}
              <Picker
                selectedValue = {judge}
                onValueChange={(itemValue, itemIndex) =>
                  setJudge(itemValue)
                }
                style={{width:'80%', height:'25%', marginTop: 10, backgroundColor:'#2cc', justifyContent:'center'}}
                itemStyle={{color:'#2cc'}}
              >
                {users.map(userDoc => {
                  return (
                    <Picker.Item label={(userDoc.displayName=='') ? 'Anonymous' : userDoc.displayName} value={userDoc} style={{justifyContent:'center'}}/>
                   )
                })}
              </Picker>

              <TouchableOpacity style={styles.buttonBlue} onPress={() => selectJudge()}>
                <Text>Select</Text>
              </TouchableOpacity>


            </View>
          </View>
        </Modal>

        {/* Display Name Popup Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={nameWindow}
          onRequestClose={() => {
            setNameWindow(!nameWindow);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>

              <TouchableOpacity onPress={()=>{setNameWindow(!nameWindow)}} style={{position:'absolute', right:5, top:4}}>
                <Icon name='cross' type="entypo" color='#2cc' size={20}/>
              </TouchableOpacity>

              <Text style={{color: '#2cc', textAlign: 'center', marginTop:20}}>Please Enter Your Display Name</Text>
              <TextInput style={styles.textInput} onChangeText={(value) => setDisplayName(value)}></TextInput>

              <TouchableOpacity style={styles.buttonBlue} onPress={() => setName()}>
                <Text>Submit</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>


          <View style={styles.elem}>

            <View style={styles.dummyBox}>
            <TouchableOpacity
                onPress={() => navigation.navigate("SessionHistory", {roundId: roundAd})}>
                  <Text>Session History</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dummyBox}>
              <TouchableOpacity
                onPress={() => setInviteWindow(!inviteWindow)}>
                  <Text>Invite</Text>
              </TouchableOpacity>
            </View>

          </View>

          <View style={styles.content}>

            <Text style={{
              color:'#2cc',
              fontSize:35
            }}>
              Round: {round.roundNumber}
            </Text>

            <Text style={{
              color: '#2cc',
              fontSize: 20,
            }}>Judge: {getJudge()}</Text>

            {getButton()}

          </View>

        <View style={styles.userList}>

          <ScrollView>
            { //Retrieve users' display names if they are created
              users.map(userDoc => {
                if (!userDoc.displayName) {
                  return (
                    <GameComponent Name={'Anonymous'} Points={userDoc.points} Submitted={userDoc.submitted} />
                  )
                } else {
                  return (
                    <GameComponent Name={userDoc.displayName} Points={userDoc.points} Submitted={userDoc.submitted} />
                  )
                }
              })
            }
          </ScrollView>

        </View>

      

      </SafeAreaView>
    );
  }
