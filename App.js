import React from 'react';
import { Text, TextInput, View, Modal, SectionList } from 'react-native';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import styles from './styles';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_API_PREFIX = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // json payloads
      keyword: '',
      data: {},
      // for the map view
      latitude: 39.9526,
      longitude: 75.1652,
      radius: 5000,
      routeCoordinates: [],
      prevLatLong: {},
      coordinate: new AnimatedRegion({
        latitude: 39.9526,
        longitude: 75.1652,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      })
    };
  }

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05
  });

  // text is the text from the query
  updateKeyword = text => {
    this.setState({ keyword: text });
  };

  fetchNearbyAreas = () => {
    // res.data.results is where the actually relevant information/data is
    // good to note above
    // data.name is a placeholder for the specific context, replace with whatever we mean to actually use
    axios.get(GOOGLE_API_PREFIX +
      `keyword=${this.state.keyword}` +
      `&location=${this.state.latitude}%2C${this.state.longitude}` +
      `&radius=${this.state.radius}` +
      `&key=${GOOGLE_API_KEY}`
    )
      .then(res => {
        this.setState({ data: res.data.results.map(result => result.name) });
      })
      .catch(err => console.log(`Did not get data: ${err.message}`));
  };

  async componentDidMount() {
    Location.requestForegroundPermissionsAsync();

    this.watchID = await Location.watchPositionAsync(
      { accuracy: 6 },
      position => {
        const { coordinate, routeCoordinates } = this.state;
        const { latitude, longitude } = position.coords;
        const newCoordinate = {
          latitude,
          longitude
        };

        coordinate.timing(newCoordinate).start();

        this.setState({
          latitude,
          longitude,
          latitudeDelta: latitude - this.state.latitude,
          longitudeDelta: longitude - this.state.longitude,
          routeCoordinates: routeCoordinates.concat([newCoordinate]),
          prevLatLong: newCoordinate
        });
      }
    );
  }

  componentWillUnmount() {
    if (this.watchID) {
      this.watchID.remove();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text>This is our app for DragonHacks!</Text> */}
        <Modal
          transparent={true}
          visible={this.state.show}
        >
          <View style={styles.mainView}>
            <Text style={styles.title}>FindWay</Text>
            <TextInput
              style={styles.input}
              placeholder="Type here to find!"
              onChangeText={this.updateKeyword}
              onSubmitEditing={this.fetchNearbyAreas}
            />
            <Text>Helping you find {this.state.keyword}</Text>
            <MapView
              style={styles.map}
              showUserLocation
              followUserLocation
              loadingEnabled
              region={this.getMapRegion()}
            >
              <Marker.Animated
                ref={marker => this.marker = marker}
                coordinate={this.state.coordinate}
              />
            </MapView>
            <SectionList
              sections={[
                { title: '1', data: this.state.data },
              ]}
              renderItem={({ item }) => <Text>{`\u2022 ${item}`}</Text> }
              renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
              keyExtractor={(_, index) => index}
            />
          </View>
        </Modal>
      </View>
    );
  }
}