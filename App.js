import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './HomeScreen'
import SelectSongScreen from './SelectSongScreen'
import EditSongDetailsScreen from './EditSongDetailsScreen';
import SongsDirectoryScreen from './SongsDirectoryScreen';
import SongDetailsDirectoryScreen from './SongDetailsDirectoryScreen';
import BackupPlaylistScreen from './BackupPlaylistScreen';

import {db} from './config';


const Stack = createStackNavigator();

class App extends React.Component {
  render = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={({ navigation }) => ({
            headerRight: () => (
              <View style={{
                paddingRight: 20
              }}>
                <Button
                  onPress={() => { navigation.navigate("Select Song") }}
                  title="Upload"
                  color="#2c3e50"
                />
              </View>
            ),
          })} />


          <Stack.Screen name="Select Song" component={SelectSongScreen} />
          <Stack.Screen name="Edit Song Details" component={EditSongDetailsScreen} />


          <Stack.Screen name="Songs Directory" component={SongsDirectoryScreen} />



          <Stack.Screen name="Song Details" component={SongDetailsDirectoryScreen} />


          <Stack.Screen name="Backup Playlist" component={BackupPlaylistScreen} />

          
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  gotoUploadScreen = () => {
    this.props.navigation.navigate("Upload Song")
  }

}

export default App;