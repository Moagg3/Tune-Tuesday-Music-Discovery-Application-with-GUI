import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { flex: 1, alignItems: 'center', height: Dimensions.get('window').height },
    buttonContainer: { flexDirection: "row", },
    buttonBlack: { alignItems: 'center', backgroundColor: "#000000", padding: 10, },
    buttonBlue: { alignItems: 'center', backgroundColor: "#22CCCC", width:100, padding: 10, marginTop:10, borderRadius: 5 },
    pic: {width: 180, height: 100, marginTop: 20, },
    textInput: { height: 40, width: 300, color: "#2cc", borderColor: '#2cc', borderWidth: 3, paddingTop: 10, paddingBottom: 10, paddingLeft: 10, marginBottom: 10,},
    title: { color: '#2cc', marginTop: 10, marginBottom: 10, fontSize: 36 },

    inputTitle: { color: '#2cc', marginBottom: 10, fontSize: 25, alignSelf: 'flex-start' },
    numInput: { textAlign:'center', alignSelf:'flex-start', height: 50, width: 80, color: "#2cc", borderColor: '#2cc', borderWidth: 3, marginBottom: 30,},
  });