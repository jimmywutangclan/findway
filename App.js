// App.js
// Referenced: https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8
import React from 'react';
import { Text, View, Modal, FlatList, TouchableOpacity } from 'react-native';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';

import * as Device from 'expo-device';
import * as Location from 'expo-location';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from "expo-font";
import { Inter_900Black } from '@expo-google-fonts/inter';

import axios from 'axios';
import styles from './styles';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_API_PREFIX = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';

console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      names: [],
      nearby: [],
      // for the map view
      latitude: 39.9526,
      longitude: 75.1652,
      radius: 5000,
      prevLatLong: {},
      coordinate: new AnimatedRegion({
        latitude: 39.9526,
        longitude: 75.1652,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }),
      // for fonts
      isLoaded: false
    };
  }
  
  // JS doesn’t have a built-in sleep function
  sleep = time => new Promise(resolve => setTimeout(resolve, time))

  // returns necessary location coordinates
  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05
  });

  fetchNearbyAreas = keyword => {
    // res.data.results is where the actually relevant information/data is
    // good to note above
    // data.name is a placeholder for the specific context, replace with whatever we mean to actually use
    axios.get(GOOGLE_API_PREFIX +
      `keyword=${keyword}` +
      `&location=${this.state.latitude}%2C${this.state.longitude}` +
      `&radius=${this.state.radius}` +
      `&key=${GOOGLE_API_KEY}`
    )
      .then(res => {
        const results = res.data.results;
        const names = results.map(result => result.name);
        const nearby = results.map(result => result.geometry.location);
        this.setState({ names, nearby });
      })
      .catch(err => {
        console.log(`Did not get data: ${err.message}`);
      });

    this.sleep(10000).then(() => { }).catch(err => console.log('Sleep failed: ' + err.message));
  };

  // create a helper function to load the font 
  loadFontsAsync = async () => {
    await Font.loadAsync({
      Inter_900Black
    });
    this.setState({ isLoaded: true });
  };

  async componentDidMount() {
    await this.loadFontsAsync();
    await SplashScreen.hideAsync();
    await Location.requestForegroundPermissionsAsync();

    this.watchID = await Location.watchPositionAsync(
      { accuracy: 6 },
      async position => {
        const { coordinate } = this.state;
        const { latitude, longitude } = position.coords;
        const newCoordinate = { latitude, longitude };

        coordinate.timing(newCoordinate).start();

        this.setState({
          latitude,
          longitude,
          latitudeDelta: latitude - this.state.latitude,
          longitudeDelta: longitude - this.state.longitude,
          prevLatLong: newCoordinate
        });

        console.log(`Refreshing location for ${Device.deviceName}...`)
        await this.fetchNearbyAreas('Gardens');
      }
    );
  }

  async componentWillUnmount() {
    if (this.watchID) {
      await this.watchID.remove();
    }
  }

  render() {
    if (!this.state.isLoaded) {
      console.log('Loading...');
      return <AppLoading style={styles.stretch} />;
    }

    return (
      <View style={styles.container}>
        <Modal
          transparent={true}
          visible={this.state.show}
        >
          <View style={styles.mainView}>
            <Text style={styles.title}>FindWay</Text>
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
              {
                this.state.nearby.map(({ lat, lng }, index) =>
                  <Marker
                    key={index}
                    coordinate={{ latitude: lat, longitude: lng }}
                    title={this.state.names[index]}
                    pinColor={'#6a8768'}
                  />)
              }
            </MapView>
            <FlatList
              style={{ flex: 1 }}
              data={this.state.names}
              renderItem={({ item }) =>
                <View style={styles.listItem}>
                  <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                </View>
              }
              keyExtractor={(_, index) => index}
            />
          </View>
        </Modal>
      </View>
    );
  }
}