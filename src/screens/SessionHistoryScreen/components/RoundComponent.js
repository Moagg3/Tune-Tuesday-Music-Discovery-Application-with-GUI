import React from 'react'
import {Text, Dimensions} from 'react-native'

export default function RoundComponent(RoundNumber) {
    
    return (<Text style = {{
        color: '#2cc',
        height: 80,
        width: Dimensions.get('window').width,
        borderColor:'#2cc',
        padding: 10,
        borderWidth: 3,
        fontSize:20,
        textAlignVertical:'center'
      }}>
          Round {RoundNumber.RoundNumber}
      </Text>
    );
    };
