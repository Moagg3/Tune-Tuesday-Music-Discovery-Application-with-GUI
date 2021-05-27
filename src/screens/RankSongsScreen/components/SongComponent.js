import React from 'react'
import {Text, TouchableOpacity, Dimensions} from 'react-native'
export default function SongComponent(Song, Artist) {
    
    return (<TouchableOpacity
                    style={{
                        backgroundColor: "#000000",
                        //alignItems: 'center',
                        justifyContent: 'center',
                        padding: 5,
                        margin: 2,
                        borderRadius: 7,
                        borderWidth: 2,
                        borderColor: '#22CCCC',
                    }}>
                    <Text
                        style={{
                            color: '#2CC',
                            fontSize: 25,
                    }}>
                    {Rank.Rank} stuff
                    </Text>
                </TouchableOpacity>
    );
    };