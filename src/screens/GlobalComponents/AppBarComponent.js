import React from 'react'
import {Text, Dimensions, StyleSheet, View, TouchableOpacity, State} from 'react-native'
import { Icon } from 'react-native-elements'

//AppBar to be imported and used on any screen, takes in a title, backlink (for back button), and optionally a 3rd component to render on the right
export default function AppBar(props) {
  
  //Get the component for the right side if one was passed in
  const getRightComponent = () => {
    if (props.Component) {
      return props.Component;
    } else {
      return <></>
    }
  }

  return (
    <View style={styles.header}>
      <View style={styles.elem}>
        <View style={styles.dummyBox}>

          <TouchableOpacity
            style={styles.buttonBack}
            onPress={() => props.navigation.navigate(props.BackLink)}
          >
            <Icon 
              name='arrow-left'
              size= {40}
            />
          </TouchableOpacity>

        </View>
        
          
        <View style={styles.dummyBox}>
          <Text style={{
            color: '#000',
            fontSize: 20,
            alignSelf: 'center'
          }}>{props.Title}</Text>
        </View>
        
        <View style={styles.dummyBox}>
          {getRightComponent()}
        </View>
        
      </View>
    </View>
  ); 
  
  
};



const styles = StyleSheet.create({
  header: { height:50, flexDirection: 'row', backgroundColor: "#22CCCC", alignItems:'center', top:0 },
  elem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding:10,
  },
  dummyBox: { flex:1, backgroundColor: "#22CCCC", borderRadius: 5, justifyContent:'center' },
  buttonBack: { justifyContent: 'center', backgroundColor: "transparent", alignSelf: 'flex-start'},
})
