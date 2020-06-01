import * as React from 'react';
import { View, Text, Button, StyleSheet, TextInput, ProgressBarAndroid, ToastAndroid } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
import Song from './Song';

import RNFetchBlob from "react-native-fetch-blob";

class BackupPlaylistScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            songs: [],
            progress: 0,
            userId: "5e5d9967aad37740b0ca9df5"
        }

        this.fetchBackupPlaylist()
    }

    fetchBackupPlaylist = () => {
        axios.get("http://192.168.137.1:3000/users/" + this.state.userId + "/backupPlaylist")
            .then((response) => {
                console.log(response.data)
                this.setState({ songs: response.data.songs })
            })
    }

    render() {
        return (
            <View style={{ flex: 1, padding: 10 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }} >Backup and Restore</Text>
                    <Text style={{ marginBottom: 20 }}>Welcome to Cloud Backup</Text>
                </View>
                <Text style={{ marginBottom: 30, fontWeight: "bold", fontSize: 20 }}>Songs in Backup Playlist</Text>

                <FlatList
                    data={this.state.songs}
                    renderItem={({ item }) =>
                        <Song details={item} navigation={this.props.navigation} />
                    }
                    keyExtractor={item => item.id}
                />
                <Button
                    title="Restore"
                    onPress={() => this.restoreSongs()} />
            </View>
        )
    }



    restoreSongs = () => {
        //axios.get("http://192.168.137.1:3000/users/"+this.state.userId+"/back")
        for (let i = 0; i < this.state.songs.length; i++) {
            let song = this.state.songs[i]
            this.downloadSong(song)
        }
    }


    downloadSong = (song) => {
        let ext = song.url.split('.')
        ext = ext[ext.length - 1]
        let filePath = RNFetchBlob.fs.dirs.DownloadDir + '/' + song.title + '.' + ext;
        //let filePath = RNFetchBlob.fs.dirs.DownloadDir + '/a.mp3';
        console.log(filePath)
        let that = this
        RNFetchBlob.fetch('GET', 'http://192.168.137.1:3000/' + song.url)
            .progress((received, total) => {
                console.log('progress', received / total)
                that.setState({ progress: (received / total) })
            })
            .then((res) => {
                //console.log(res)
                RNFetchBlob.fs.writeFile(filePath, res.base64(), 'base64')
                    .then(response => {
                        console.log('Success Log: ' + response);
                        ToastAndroid.show("File downloaded to location: " + filePath, ToastAndroid.LONG)
                        this.setState({ progress: 1 })
                    })
                    .catch(errors => {
                        console.log(" Error Log: " + errors);
                    })

            })
            // Something went wrong:
            .catch((errorMessage, statusCode) => {
                // error handling
                console.log(errorMessage)
            })
    }
}


export default BackupPlaylistScreen