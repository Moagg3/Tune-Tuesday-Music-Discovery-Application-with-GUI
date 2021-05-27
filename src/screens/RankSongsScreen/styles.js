import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { flex: 1, alignItems: 'center' },
    buttonContainer: { flexDirection: "row", },
    buttonBlack: { alignItems: 'center', backgroundColor: "#000000", padding: 10, },
    buttonBlue: { margin: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: "#22CCCC", padding: 5, borderRadius: 5,},
    buttonWide: { margin: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: "#22CCCC", padding: 5, borderRadius: 5, width: '40%',},
    pic: {width: 30, height: 30,},
    header: { height:50, flexDirection: 'row', backgroundColor: "#22CCCC", },
    elem: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 5,
    },
    buttonBar: { justifyContent: 'center', alignItems: 'center', backgroundColor: "#22CCCC",},
    submission: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    
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
      //height: 400,
      backgroundColor: "black",
      borderRadius: 20,
      borderColor: '#2CC',
      borderWidth: 2,
      padding: 15,
      alignItems: "center",
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