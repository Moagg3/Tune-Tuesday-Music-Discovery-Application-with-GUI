import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { flex:1, alignItems: 'center', top:0, marginTop:0, height:Dimensions.get('window').height},
    buttonContainer: { flexDirection: "row", },
    buttonBlack: { alignItems: 'center', backgroundColor: "#000000", padding: 10, },
    buttonBlue: { alignItems: 'center', backgroundColor: "#22CCCC", padding: 10, marginBottom: 40, marginTop:50, borderRadius:5},

    pic: {width: 180, height: 100, marginTop: 20, },
    gameList: { width: '100%',  height:'60%', borderColor:'#6930c3', borderWidth:3},
    modalContainer: {
      position: 'absolute',
      left: 0,
      right:0,
      top:0,
      bottom:0,
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)',
    },

    modalView: { 
      opacity: 1,
      marginTop: '50%',
      width: '60%',
      height: 200,
      backgroundColor: "black",
      borderRadius: 20,
      borderColor: '#2CC',
      borderWidth: 2,
      paddingBottom: 40,
      alignItems: "center",
      justifyContent:'space-evenly',
      shadowColor: "#2cc",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 5,
    },
  });