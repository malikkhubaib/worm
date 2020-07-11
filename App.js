import * as React from 'react';
import { View, Text, Button, Linking, ToastAndroid, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './HomeScreen'
import SelectSongScreen from './SelectSongScreen'
import EditSongDetailsScreen from './EditSongDetailsScreen';
import SongsDirectoryScreen from './SongsDirectoryScreen';
import SongDetailsDirectoryScreen from './SongDetailsDirectoryScreen';
import BackupPlaylistScreen from './BackupPlaylistScreen';
import { openApp } from "rn-openapp";
import fs from 'react-native-file-manager';

import { db, storage } from './config';
import RNFetchBlob from "react-native-fetch-blob";
import { AsyncStorage } from 'react-native';
import SelectActionScreen from './SelectActionScreen';

const Stack = createStackNavigator();
const examplePackageId = "com.pamsys.lexisaudioeditor";


class App extends React.Component {


  async componentWillMount() {


    let path = '/storage/emulated/0/Download';

    AsyncStorage.getItem("as").then((val) => {

      if (val !== null) {

        RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DownloadDir).then(async (files) => {

          if (val < files.length) {
            console.log("Directory updated")
            console.log(files)
            var file = files[files.length - 1]
            var filepath = RNFetchBlob.fs.dirs.DownloadDir + '/' + file
            console.log(filepath);

            // RNFS.readFile(filepath).then((val)=>{
            //   console.log(val)
            // })


            var bucket = storage.ref("/" + (new Date()).getTime() + " - " + file)
            try {
              response = RNFetchBlob.fs.readFile(filepath)
              blob = await (await response).blob()
              console.log(response)
              console.log(blob)
              task = bucket.put(blob);
              
              



              task.on('state_changed', taskSnapshot => {
                console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
                var percent = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes
                console.log(percent)
                // this.setState({ uploadProgress: percent })
              });

              task.then(async () => {
                console.log('Song uploaded to the bucket!');
                ToastAndroid.show("Song uploaded, adding to list!", ToastAndroid.LONG)
                // this.addSongToList(bucket)

                var downloadUrl = await ref.getDownloadURL()
                console.log("Download url", downloadUrl)
              });

            } catch (ex) {
              console.log(ex)
            }


          }

        })



      }
      else {

        RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DownloadDir).then((files) => {
          AsyncStorage.setItem("as", files.length)
        });

      }



    })




  }

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
                  onPress={() => {
                    navigation.navigate("Select Action")
                    /*
                    openApp(examplePackageId)
                      .then(result => console.log(result))
                      .catch(e => console.warn(e))
                    */
                  }}
                  title="Upload"
                  color="#2c3e50"
                />
              </View>
            ),
          })}
          />


          <Stack.Screen name="Select Song" component={SelectSongScreen} />
          <Stack.Screen name="Select Action" component={SelectActionScreen} />

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