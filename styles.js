// styles.js
import { StyleSheet, Dimensions } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b7cdce",
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter_900Black',
  },
  title: {
    fontSize: 30,
    color: "#fffdd0",
    alignItems: "center",
    left: 30,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    fontFamily: 'Inter_900Black',
  },
  heading: {
    color: "#ffd633",
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
    width: Dimensions.get('window').width / 1.5,
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
    color: "purple",
  },
  list: {
    fontSize: 15,
    color: "purple",
    alignItems: "center",
    backgroundColor: 'rgba(247,247,247,1.0)',
    left: 30,
    fontStyle: 'italic',
    fontFamily: 'Inter_900Black',
  },
  listItem: {
    margin: 10,
    padding: 10,
    backgroundColor: "#FFF",
    width: "80%",
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5
  }
});
