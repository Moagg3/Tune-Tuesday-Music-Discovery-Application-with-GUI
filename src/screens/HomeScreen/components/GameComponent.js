import React from 'react'
import {View, Text, Dimensions} from 'react-native'
export default function GameComponent(params) {
    
    return (
      <View style = {{
        height: 80,
        width: '100%',
        borderBottomColor: '#6930c3',
        borderBottomWidth: 3,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-evenly',
        backgroundColor:'#0000',
      }}>
        <Text style = {{
        color: '#2cc',
        fontSize:15
        }}>
          {params.GameName}
        </Text>
      </View>
      
    );
};
