import React, { useState } from 'react'
import { Text, StatusBar, TextInput, TouchableOpacity, View, Alert, ScrollView } from 'react-native';
import { Slider, CheckBox } from 'react-native-elements';
import styles from './styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import  AppBar from '../GlobalComponents/AppBarComponent';
import { firebase } from '../../firebase/config'

export default function CreateGameScreen({ navigation }) {
    
  //State declarations
  const [gameName, setGameName] = useState('');
  const [roundNumber, setRoundNumber] = useState('5');
  const [roundLength, setRoundLength] = useState(7);
  const [judgingLength, setJudgingLength] = useState(24);
  const [judgeSelect, setJudgeSelect] = useState(false);
  let user;

  //Function to do backend Firebase writes to create game data
  const createGame = () => {
    //Find current user data
    firebase.firestore().collection('users')
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then(firestoreDocument => {
      if (!firestoreDocument.exists) {
          alert("User not signed in.")
          return;
      }
      user = firestoreDocument.data()

      //Check inputs for non-null values
      if (!gameName.trim()) {
        Alert.alert('All fields must be filled out','Please Enter a Game Name');
        return;
      } //Check game name field
      if (!roundNumber.trim()) {
        Alert.alert('All fields must be filled out','Please Enter a Round Number');
        return;
      } //Check round number field


      const gameData = {
        gameName:gameName,
        numberOfRounds:roundNumber,
        roundLength:roundLength,
        judgingLength:judgingLength,
        initialJudgeSelect:judgeSelect,
        isStarted: false,
      } //Data for Games doc to be added to Collection

      firebase.firestore().collection('games').add(gameData).catch(error => {alert(error)}) //Add game data to database
      .then(res => {
        gameData.id = res.id
        
        const memberData = {
          id: user.id,
          creator: true,
          memberType: "participant",
          points: 0,
          submitted: false,
        } //Data for members doc in members collection in game doc
        
        //set id field in game doc
        firebase.firestore().collection('games').doc(gameData.id).set({id: gameData.id}, {merge: true})
        .catch(error => {
          alert(error)
        }); 

        //Set Members collection within game with initial user data
        firebase.firestore().collection('games').doc(gameData.id).collection('members').doc(user.id).set(memberData)
        .catch(error => {alert(error)}); 

        //Add Game to User doc
        const userDoc = firebase.firestore().collection('users').doc(user.id);
        userDoc.update({games: firebase.firestore.FieldValue.arrayUnion(gameData.id)})
        .then(() => {
          navigation.navigate('CurrentGame', {gameId: gameData.id});
          //Go to current game screen
        })


      })
      .catch(error => {
          alert(error)
      }) 
    });  
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#000000' }]}>

      <StatusBar
      backgroundColor="#2cc"
      barStyle={"light-content"} />

      <AppBar navigation={navigation} Title="Tune Tuesday" BackLink="Home" />

      <ScrollView>
        <View 
          style={{
            marginTop: 20,
            alignItems:'center',
            width: 300
          }}>
            
            <Text style={styles.title}>Create Game</Text>
            
            <Text style={ styles.inputTitle }>Game Name</Text>
            <TextInput
              placeholder="MyGame"
              placeholderTextColor="#105e5e"
              onChangeText={
                (value) => setGameName(value)
              }
              style={styles.textInput}>
            </TextInput>

              
            <Text style={{
              color: '#2cc',
              marginBottom: 10,
              fontSize: 25,
              alignSelf: 'flex-start'
            }}>Number of Rounds</Text>
            <TextInput
              keyboardType="numeric"
                value={''+roundNumber}
              fontSize={30}
              onChangeText={
                (value) => setRoundNumber(value)
              }
              style={styles.numInput}>
            </TextInput>

            <View style={{
              flexDirection: 'row',
              width: 300
              }}>

                <Text style={ styles.inputTitle }> Round Length: </Text>

                <Text style={{
                  color: '#19e676',
                  paddingBottom: 10,
                  fontSize: 25,
                  alignSelf: 'flex-start'
                }}>  {roundLength} days</Text>
            </View>

            <Slider
            value={roundLength}
            onValueChange={(value) => setRoundLength(value)}
            thumbTintColor="#2cc"
            thumbStyle={{ height: 30, width: 30}}
            maximumValue={30}
            minimumValue={2}
            step={1}
            width={300}
            style= {{marginBottom:30}}
            />

            <View style={{
              flexDirection: 'row',
              width: 300
              }}>

                <Text style={styles.inputTitle}>Judging Time: </Text>

                <Text style={{
                  color: '#19e676',
                  paddingBottom: 10,
                  fontSize: 25,
                  alignSelf: 'flex-start'
                }}>  {judgingLength} hours</Text>
            </View>

            <Slider
              value={judgingLength}
              onValueChange={(value) => setJudgingLength(value)}
              thumbTintColor="#2cc"
              thumbStyle={{ height: 30, width: 30}}
              maximumValue={24}
              minimumValue={4}
              step={1}
              width={300}
              style={{marginBottom:20}}
            />
            
            <View style={{
              flexDirection: 'row',
              width: 300,
              alignItems: 'center',
              justifyContent: 'space-between',
              }}>

                <Text style={{
                  color: '#2cc',
                  fontSize: 25,
                }}>First Judge: </Text>

                <View>
                  <CheckBox
                    title='Random'
                    checked={!judgeSelect}
                    checkedColor='#19e676'
                    textStyle= {{color:'#2cc', marginLeft:2, fontSize:17}}
                    onIconPress={() => setJudgeSelect(false)}
                    onPress={() => setJudgeSelect(false)}
                    containerStyle={{padding:5, backgroundColor:'#000', borderColor:'#000', margin:0, marginLeft:5, justifyContent:'center'}}
                    style={{}}
                  />

                  <CheckBox
                    title='Select a User'
                    checked={judgeSelect}
                    checkedColor='#19e676'
                    textStyle= {{color:'#2cc', marginLeft:2, fontSize:17}}
                    onIconPress={() => setJudgeSelect(true)}
                    onPress={() => setJudgeSelect(true)}
                    containerStyle={{padding:5, backgroundColor:'#000', borderColor:'#000', margin:0, marginLeft:5, justifyContent:'center'}}
                    style={{marginBottom:0}}
                  />
                </View>
                
                
            </View>
            
        </View>

        

        <TouchableOpacity
          style={styles.buttonBlue}
          onPress={() => createGame()}
        >
          <Text style={{ fontSize:20 }}>Create</Text>
        </TouchableOpacity>
      </ScrollView>
      

    </SafeAreaView>
  );
}