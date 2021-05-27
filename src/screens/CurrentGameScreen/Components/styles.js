import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { height:Dimensions.get('window').height, justifyContent: 'space-between', },
    header: { height:50, flexDirection: 'row', backgroundColor: "#22CCCC", },
    footer: { height:50, backgroundColor: "#22CCCC", },
    content: { flex: 5, alignItems:'center', justifyContent:'space-evenly', padding:10},
    userList: { flex: 7, borderColor: '#2cc', borderTopWidth:0.5, },
    elem: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 5,
      flex:1
    },
    elem2: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderColor: '#2cc',
      borderBottomWidth:0.5,
      padding: 7,
    },

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

    textInput: {
      height: '22%',
      width: '80%',
      color: "#2cc",
      borderColor: '#2cc',
      borderWidth: 3,
      padding: 5,
      margin: 10,
      textAlign: 'center',
      fontSize:20,
    },

    userInfo: { flex:1, flexDirection: 'row', alignItems: 'center', },
    userProfile: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#22CCCC", },
    userName: { padding: 10, },
    userPoint: { paddingLeft: 70, },
    userSubmit: { paddingLeft: 20, },
    buttonGold: { backgroundColor: "#FFDF00", padding: 10, borderRadius: 5, },
    buttonBlue: { alignItems: 'center', backgroundColor: "#22CCCC", paddingTop:7, paddingBottom:7, paddingLeft:12, paddingRight:12, borderRadius: 5, margin: 10 },
    dummyBox: {backgroundColor: "#22CCCC", padding: 10, borderRadius: 5, },
  });
