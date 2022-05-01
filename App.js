import React from 'react';
import { StyleSheet, Text, TextInput, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

let LATITUDE = 39.9526;
let LONGITUDE = 75.1652;
let LATITUDE_DELTA = 0.05;
let LONGITUDE_DELTA = 0.05;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: '',
      // for the map view
      latitude: LATITUDE,
      longitude: LONGITUDE,
      routeCoordinates: [],
      prevLatLng: {},
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      })
    };
  }

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });

  async componentDidMount() {
    const { status } = Location.requestForegroundPermissionsAsync();

    this.watchID = await Location.watchPositionAsync({ accuracy: 6 },
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
          prevLatLng: newCoordinate
        });
      }
    );
  }

  componentWillUnmount() {
    this.watchID.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>This is our app for DragonHacks!</Text>
        <Text>What are you looking for?</Text>
        <TextInput style={{ height: 40 }} placeholder="Type here to find!" onChangeText={newText => this.setState({ keyword: newText })} />
        <Text>Helping you find {this.state.keyword}</Text>

        <MapView
          style={styles.map}
          showUserLocation
          followUserLocation
          loadingEnabled
          region={this.getMapRegion()}
        >
          <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
          />
        </MapView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4287f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  }
});
