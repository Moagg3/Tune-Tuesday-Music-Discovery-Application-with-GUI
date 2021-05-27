import React, { useState, useEffect } from 'react'
import { Text, StatusBar, Button, StyleSheet, Image, TextInput, TouchableOpacity, View, Alert, Linking } from 'react-native';
import styles from './Components/styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { Directions } from 'react-native-gesture-handler';
import GameComponent from './Components/RoundSummaryComp';
import  AppBar from '../GlobalComponents/AppBarComponent';
import { firebase } from '../../firebase/config';
import {Icon} from 'react-native-elements'

export default function RoundSummary({ route, navigation, extraData }) {
    
  // states for firebase calls
  const [title, setTitle] = useState("Loading");
  const [songs, setSongs] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [test2, setTest2] = useState([]);
  let roundData;
  let data = [0];
  const tempp = [];
  let songstemp = [];
  let songCount = [];
  //firebase calls to set the states to correct data
  let x = 1;

  useEffect(() => { 
        
    async function firebaseCalls() {
        setLoading(false);
        const roundRef = await firebase.firestore().collection('rounds').doc(route.params.roundId);
        //let songstemp = [];
        const round = await roundRef.get();
        const roundData = await round.data();
        const memberRef = await firebase.firestore().collection('games').doc(roundData.game).collection('members');
        const songsquery = await roundRef.collection('songs').orderBy('rank', 'asc').get();
        var c = 0;
        await songsquery.forEach(async song => {
            const sub = await song.data();
            const memberSnap = await memberRef.doc(sub.user).get();
            const memberData = await memberSnap.data();
            const entry = {key: c, obj: sub, title: sub.songName, artist: sub.artistName, link: sub.songLink, id: sub.id, rank: sub.rank, com: sub.comments, name: memberData.displayName};
            //const entry = sub.songName;
            c = c + 1;
            songCount.push(c);
            songstemp.push(entry);
            //console.log(entry);
            //setSongs(songstemp);
        });
        setSongs(songstemp);
        setList(songCount);
        //tempp = songstemp
        const gameRef = await firebase.firestore().collection('games').doc(roundData.game).get();
        const gameData = gameRef.data();
        setTitle('Round ' + roundData.roundNumber);
        //setLoading(false);
    }
    if(loading) {
        firebaseCalls();
        //setData(songlist);
    }
  }, [loading, songs]);  
  
  return (

          <SafeAreaView style={[styles.container, { backgroundColor: '#000000' }]}>

            <StatusBar barStyle="light-content" backgroundColor="#2cc" />

            <AppBar navigation={navigation} Title={title} BackLink="SessionHistory" />


            <View style={styles.userList}>
            {songs.map((item, key)=>{
              //var c = item.com;
              return (
                <View
                style={{
                    backgroundColor: "#000000",
                    //alignItems: 'center',
                    justifyContent: 'center',
                    padding: 5,
                    width: '90%',
                    marginBottom: 2,
                    borderRadius: 7,
                    borderWidth: 2,
                    borderColor: '#2cc',
                    flexDirection: 'row'
                }}>
                <View style={styles.submission}>
                <Text
                    style={{
                        color: '#2CC',
                        fontSize: 20,
                        fontWeight: 'bold',
                }}>
                {item.rank}) {item.title} by {item.artist}
                </Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                }}> 
                
                <TouchableOpacity style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: "#22CCCC",
                        borderRadius: 3,
                        padding: 5,
                        marginRight: 5
                    }}
                    onPress={() => Alert.alert("Submitted by: " + item.name + '\n' + item.com)}>
                    
                   
                    <Icon 
                      name='comment'
                      size= {22}
                    />
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: "#22CCCC",
                        borderRadius: 3,
                        padding: 5,
                    }}
                    onPress={() => Linking.openURL(item.link)}>
                    <Icon 
                      name='music-note'
                      size= {22}
                    />
                    </TouchableOpacity>
                    </View>
            </View>
              )
            })}
            </View>

            <View style={styles.elem}/>
          </SafeAreaView>
        );
      }