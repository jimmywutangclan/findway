import { StyleSheet, Dimensions } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#90EE90",
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 30,
  },
  mainView: {
    margin: 50,
    padding: 40,
    flex: 1,
  },
  input: {
    height: 40,
  },
  map: {
    width: Dimensions.get('window').width/1.5,
    height: Dimensions.get('window').height / 2,
    right: 25,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
});
