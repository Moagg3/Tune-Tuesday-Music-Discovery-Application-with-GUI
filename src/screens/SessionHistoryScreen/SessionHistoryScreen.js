import React, { useState, useEffect } from 'react'
import { Text, StatusBar, Button, StyleSheet, Image, TextInput, TouchableOpacity, View, Alert, Dimensions } from 'react-native';
import styles from './styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { Directions } from 'react-native-gesture-handler';
import RoundComponent from './components/RoundComponent';
import  AppBar  from '../GlobalComponents/AppBarComponent';
import 'react-native-vector-icons';
import { firebase } from '../../firebase/config';
import { Icon } from 'react-native-elements';

export default function SessionHistoryScreen({ route, navigation, extraData }) {
  
  const [title, setTitle] = useState("Loading");
  const [round, setRound] = useState('');
  const [pastRounds, setPastRounds] = useState([]);
  const [game, setGame] = useState('');
  const [loading, setLoading] = useState(true);

  let roundData;
  let gameData;

  const roundAd = route.params.roundId;

  useEffect(() => {

    async function firebaseCalls() {
      setLoading(false);
      const roundRef = await firebase.firestore().collection('rounds').doc(route.params.roundId).get();
      roundData = await roundRef.data();
      setRound(route.params.roundId);
      const gameRef = await firebase.firestore().collection('games').doc(roundData.game).get();
      gameData = await gameRef.data();
      setGame(gameData);
      let gameId = gameData.id;
      const gRef = await firebase.firestore().collection('games').doc(roundData.game);
      const memberRef = await gRef.collection('members');
      const roundsList = await firebase.firestore().collection('rounds').where('game', '==', gameId).where('isActive', '==', false).orderBy('roundNumber', 'asc').get();
      var c = 0
      var rn = 0
      let roundsTemp = [];
      await roundsList.forEach(async round => {
        const r = await round.data();
        rn = r.roundNumber;
        const jud = await memberRef.doc(r.judge).get();
        const j = await jud.data();

        const entry = {key: c, num: r.roundNumber, id: r.id, judge: j.displayName};
        c = c + 1;
        roundsTemp.push(entry);
        if (roundsTemp.length > pastRounds.length) {
          setPastRounds(roundsTemp);
        }
        
      });
      //setPastRounds(roundsTemp);
      setGame(roundData.game);
      setTitle(gameData.gameName);
    }

    if (loading) {
      firebaseCalls();
    }
  }, [loading]);
    
  return (

    <SafeAreaView style={[styles.container, { backgroundColor: '#000000' }]}>
      
      <StatusBar barStyle="light-content" backgroundColor="#2cc" />

      <AppBar
        navigation={navigation}
        Title={title}
        BackLink='CurrentGame' 
        Component= {
          <TouchableOpacity onPress={() => setLoading(true)}>
            <Icon name='refresh' type='FontAwesome' color='#000' size={25}/>
          </TouchableOpacity>
        }
        />

      <Text style={{
          color: '#2cc',
          marginTop: 40,
          marginBottom: 50,
          fontSize: 36
        }}>Session History</Text>


      {pastRounds.map((item, key)=>{
        //getJudgeDN(item.judge);
        console.log(pastRounds);
        return (
            <TouchableOpacity
            style={{
                backgroundColor: "#000000",
                //alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                width: '90%',
                marginBottom: 2,
                borderRadius: 7,
                borderWidth: 2,
                borderColor: '#2cc',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}
            onPress={() => navigation.navigate("RoundSummary", {roundId: item.id})}>
            <Text
                style={{
                    color: '#2CC',
                    fontSize: 20,
                    fontWeight: 'bold',
            }}>
            Round {item.num}
            </Text>
            <Text
                style={{
                    color: '#2CC',
                    fontSize: 20,
                    fontWeight: 'bold',
            }}>
            Judge: {item.judge}
            </Text>
        </TouchableOpacity>
        )
      })}

    </SafeAreaView>
  );
}