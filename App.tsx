import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {
  getCurrentPositionAsync,
  LocationAccuracy,
  LocationObject,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from 'expo-location';
import { styles } from './styles';
import { useEffect, useState, useRef } from 'react';

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1,
    }, (response) => {
      setLocation(response);
      mapRef.current?.animateCamera({
        pitch: 90,
        center: response.coords,
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          ref={mapRef}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
      )}
    </View>
  );
}
