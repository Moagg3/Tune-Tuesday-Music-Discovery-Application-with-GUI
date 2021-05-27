import React, { useState, useCallback, useEffect } from 'react'
import { Text, StatusBar, Button, StyleSheet, Image, TextInput, TouchableOpacity, View, Alert, Linking, Modal } from 'react-native';
import styles from './styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import DraggableFlatList, { RenderItemParams, } from 'react-native-draggable-flatlist';
import  AppBar from '../GlobalComponents/AppBarComponent';
import { firebase } from '../../firebase/config';
import SongComponent from './components/SongComponent';
import { SocialIcon } from 'react-native-elements';
import { setItemTransition } from 'react-movable/lib/utils';
import { FlatList } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker'
import {Icon} from 'react-native-elements'






export default function RankSongsScreen({ route, navigation }) {

    // states for firebase calls
    const [title, setTitle] = useState("Loading");
    const [songs, setSongs] = useState([]);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guessWindow, setGuessWindow] = useState(false);
    const [guess1, setGuess1] = useState('default');
    const [guess2, setGuess2] = useState('default');
    const [guess3, setGuess3] = useState('default');
    const [guess4, setGuess4] = useState('default');
    const [users, setUsers] = useState([]);
    let roundData;
    let data = [0];
    const temp = [];
    let songstemp = [];
    let songCount = [];
    //firebase calls to set the states to correct data
    let x = 1;


    const submitRanks = async () => {
        const roundRef = await firebase.firestore().collection('rounds').doc(route.params.roundId);
        const roundSnap = await roundRef.get();
        const roundData = await roundSnap.data();
        const gameRef = await firebase.firestore().collection('games').doc(roundData.game);
        const memberRef = await gameRef.collection('members');
        let nextJudge = '';
        let judgePoints = 0;
        const guesses = [guess1, guess2, guess3];
        songs.forEach(async (entry, index) => {
            const songsRef = await roundRef.collection('songs').doc(entry.id);
            const increment = await firebase.firestore.FieldValue.increment(3 - index);
            await songsRef.set({
                rank: index+1,
            }, {merge:true})
            if (index == 0) {
              nextJudge = entry.obj.user;
            }
            if (index < 3) {
              await memberRef.doc(entry.obj.user).set({points: increment}, {merge:true})
              if (entry.obj.user == guesses[index].id) {
                judgePoints++;
              }
            }
        })

        const judgeIncrement = await firebase.firestore.FieldValue.increment(judgePoints);
        await memberRef.doc(roundData.judge).set({points: judgeIncrement}, {merge:true});

        memberRef.get().then(memberSnap => {
          memberSnap.forEach(member => {
            if (member.id == nextJudge) {
              member.ref.set({memberType:'judge', submitted:false}, {merge:true})
            } else {
              member.ref.set({memberType:'participant', submitted:false}, {merge:true})
            }
          })
        })
        const newRound = {
          game: roundData.game,
          isActive: true,
          judge: nextJudge,
          roundNumber: roundData.roundNumber + 1,
        }
        await firebase.firestore().collection('rounds').add(newRound).then(async doc => {
          newRound.id = doc.id;
          await gameRef.set({activeRound:newRound.id}, {merge:true})
        })
        await firebase.firestore().collection('rounds').doc(newRound.id).set(newRound);
        await roundRef.set({isActive: false}, {merge:true});
        setGuessWindow(false);
        navigation.navigate('CurrentGame', {gameId:roundData.game});
    }


    const getSongGuesses = () => {
      if (songs[0] != null) {
        return (
          <View>
            <View style={{flexDirection:'row', height:50, alignItems:'center', marginBottom:10}}>
              <Text style={{color:'#2cc', width:'30%'}}>{songs[0].title}</Text>
              <View style={{height:100, width:'70%', justifyContent:'center', alignItems:'flex-end', margin:0, padding:0}}>
              <Picker
                selectedValue = {guess1}
                onValueChange={(itemValue, itemIndex) =>
                  setGuess1(itemValue)
                }
                style={{width:'80%', height:'25%', marginTop: 10, backgroundColor:'#2cc', justifyContent:'center'}}
                itemStyle={{color:'#2cc'}}
              >
                <Picker.Item label={''} value={'default'} style={{justifyContent:'center'}}/>
                {users.map(userDoc => {
                return (
                    <Picker.Item label={(userDoc.displayName=='') ? 'Anonymous' : userDoc.displayName} value={userDoc} style={{justifyContent:'center'}}/>
                )
                })}
              </Picker>
              </View>
            </View>

            <View style={{flexDirection:'row', height:50, alignItems:'center', marginBottom:10}}>
              <Text style={{color:'#2cc', width:'30%'}}>{songs[1].title}</Text>
              <View style={{height:100, width:'70%', justifyContent:'center', alignItems:'flex-end', margin:0, padding:0}}>
              <Picker
                selectedValue = {guess2}
                onValueChange={(itemValue, itemIndex) =>
                  setGuess2(itemValue)
                }
                style={{width:'80%', height:'25%', marginTop: 10, backgroundColor:'#2cc', justifyContent:'center'}}
                itemStyle={{color:'#2cc'}}
              >
                <Picker.Item label={''} value={'default'} style={{justifyContent:'center'}}/>
                {users.map(userDoc => {
                return (
                    <Picker.Item label={(userDoc.displayName=='') ? 'Anonymous' : userDoc.displayName} value={userDoc} style={{justifyContent:'center'}}/>
                )
                })}
              </Picker>
              </View>
            </View>

            <View style={{flexDirection:'row', height:50, alignItems:'center', marginBottom:10}}>
              <Text style={{color:'#2cc', width:'30%'}}>{songs[2].title}</Text>
              <View style={{height:100, width:'70%', justifyContent:'center', alignItems:'flex-end', margin:0, padding:0}}>
              <Picker
                selectedValue = {guess3}
                onValueChange={(itemValue, itemIndex) =>
                  setGuess3(itemValue)
                }
                style={{width:'80%', height:'25%', marginTop: 10, backgroundColor:'#2cc', justifyContent:'center'}}
                itemStyle={{color:'#2cc'}}
              >
                <Picker.Item label={''} value={'default'} style={{justifyContent:'center'}}/>
                {users.map(userDoc => {
                return (
                    <Picker.Item label={(userDoc.displayName=='') ? 'Anonymous' : userDoc.displayName} value={userDoc} style={{justifyContent:'center'}}/>
                )
                })}
              </Picker>
              </View>
            </View>
          </View>
          
        )
      }
    }

    useEffect(() => { 
        
        async function firebaseCalls() {
            setLoading(false);
            const roundRef = await firebase.firestore().collection('rounds').doc(route.params.roundId);
            //let songstemp = [];
            const round = await roundRef.get();
            const roundData = round.data();
            const songsquery = await roundRef.collection('songs').get();
            var c = 0;
            await songsquery.forEach(async song => {
                const sub = await song.data();
                const entry = {key: c, obj: sub, title: sub.songName, artist: sub.artistName, com: sub.comments, link: sub.songLink, id: song.id};
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
            const gameRef = await firebase.firestore().collection('games').doc(roundData.game);
            const gameSnap = await gameRef.get();
            const gameData = await gameSnap.data();
            setTitle(gameData.gameName);

            const memberRef = await gameRef.collection('members');
            const memberQuery = await memberRef.get();
            let usersList = [];
            await memberQuery.forEach(async member => {
                const memberData = await member.data()
                if (memberData.memberType != 'judge') {
                    usersList.push(memberData);
                    setUsers(usersList);
                }
            })
            setGuess1(usersList[0]);
            setGuess2(usersList[0]);
            setGuess3(usersList[0]);
            //setLoading(false);
        }
        if(loading) {
            firebaseCalls();
            //setData(songlist);
        }
      }, [loading, songs]);  

      // rendering of the draggable list entities
    const renderItem = useCallback(
        ({ item, index, drag, isActive }: RenderItemParams<Item>) => {
            //console.log(songs[index]);
            return (
                <TouchableOpacity
                    style={{
                        backgroundColor: isActive ? '#22CCCC' : "#000000",
                        //alignItems: 'center',
                        justifyContent: 'center',
                        padding: 5,
                        marginBottom: 2,
                        borderRadius: 7,
                        borderWidth: 2,
                        borderColor: '#22CCCC',
                    }}
                    onPressIn={drag}
                  >
                    <View style={styles.submission}>
                      <Text
                          style={{
                              color: isActive ? 'black' : '#2CC',
                              fontSize: 20,
                          }}
                      >
                      {item.title} by {item.artist}
                      </Text>
                      <View style={{
                        flexDirection: 'row',
                        }}
                      > 
                      <TouchableOpacity 
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: "#22CCCC",
                          borderRadius: 3,
                          padding: 5,
                          marginRight: 5
                        }}
                        onPress={() => (item.com) ? Alert.alert("Comments: \n" + item.com) : Alert.alert("Comments: " + '\n' + "No comment")}
                      >
                        <Icon 
                          name='comment'
                          size= {22}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: isActive ? "#000000" : "#22CCCC",
                          borderRadius: 3,
                          padding: 5,
                        }}
                        onPress={() => Linking.openURL(item.link)}>
                        <Icon 
                          name='music-note'
                          size= {22}
                          color= 'black'
                        />
                      </TouchableOpacity>
                      </View>
                    </View>
                </TouchableOpacity>
            );
        },
        []
  );

    // return the components to the screen
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#000000' }]}>

        <StatusBar barStyle="light-content" backgroundColor="#2cc" />
        <AppBar Title={title} BackLink="CurrentGame" navigation={navigation} />

        {/* User Submission Guessing Popup Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={guessWindow}
          onRequestClose={() => {
            setGuessWindow(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>

              <TouchableOpacity onPress={()=>{setGuessWindow(false)}} style={{position:'absolute', right:5, top:4}}>
                <Icon name='cross' type="entypo" color='#2cc' size={20}/>
              </TouchableOpacity>

              <Text style={{color: '#2cc', textAlign: 'center', marginTop:10}}>Please Guess Which Users Submitted the Top 3 Songs</Text>
            
              {getSongGuesses()}
              {/* List dropdown picker that loads all current game members as choices */}
              

              <TouchableOpacity style={styles.buttonBlue} onPress={() => Alert.alert(
                'Finalize Rankings', '',
                [
                  {text: 'Yes', onPress: () => submitRanks()},
                  {text: 'Cancel', onPress: () => console.log("Cancel")},
                ],
                )}>
                <Text>Submit</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.buttonWide}
          onPress={() => setGuessWindow(true)}
        >
          <Text style={{
            fontSize: 20
          }}>Rank Songs</Text>
        </TouchableOpacity>
        <View style={{
            marginHorizontal: 10,
            flexDirection: 'row',
        }}>
            <View>
                { list.map((item, key)=>{
                return (
                    <TouchableOpacity
                    style={{
                        backgroundColor: "#000000",
                        //alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 10,
                        paddingRight: 10,
                        marginBottom: 2,
                        borderRadius: 7,
                        borderWidth: 2,
                        borderColor: 'black',
                    }}>
                    <Text
                        style={{
                            color: '#2CC',
                            fontSize: 20,
                            fontWeight: 'bold',
                    }}>
                    {item}
                    </Text>
                </TouchableOpacity>
                )
                })
                }
            </View>
            
            <DraggableFlatList
            data={songs}
            renderItem={renderItem}
            keyExtractor={(item, index) => `draggable-item-${item.key}`}
            onDragEnd={( songs ) =>setSongs(songs.data)}
            />
        </View>
        

        {/* <FlatList
        data={songCount}
        renderItem={ranks}
        keyExtractor={item => item.id}
        /> */}
      </SafeAreaView>
    );
}
