import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { flex: 1, justifyContent: 'space-between', },
    header: { height:50, flexDirection: 'row', backgroundColor: "#22CCCC", },
    footer: { height:50, backgroundColor: "#22CCCC", },
    content: { flex: 1, alignItems:'center', },
    userList: { flex: 1, alignItems: 'center', paddingTop: 10 },
    elem: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 5,
    },
    submission: { width: '75%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    elem2: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderColor: '#2cc',
      borderBottomWidth:0.5,
      padding: 7,
    },
    userInfo: { flexDirection: 'row', alignItems: 'center', },
    userProfile: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#22CCCC", },
    userName: { paddingLeft: 10, },
    userSubmit: { padding: 8, },
    buttonGold: { backgroundColor: "#FFDF00", padding: 10, borderRadius: 5, },
    buttonBlue: { alignItems: 'center', backgroundColor: "#22CCCC", padding: 10, borderRadius: 5, },
    dummyBox: {backgroundColor: "#22CCCC", padding: 10, borderRadius: 5, },
  });