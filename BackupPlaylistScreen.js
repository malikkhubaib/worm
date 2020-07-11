import * as React from 'react';
import { View, Text, Button, StyleSheet, TextInput, ProgressBarAndroid, ToastAndroid } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
import Song from './Song';

import RNFetchBlob from "react-native-fetch-blob";

import { db, auth, getBackupPlaylist, downloadSong } from './config';

class BackupPlaylistScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            songs: [],
            progress: 0,
            userId: "5e5d9967aad37740b0ca9df5",
            currentlyDownloading: null,
            progress: 0,
            downloader: null
        }

        this.fetchBackupPlaylist()
    }

    fetchBackupPlaylist = async () => {
        let userId = auth.currentUser.uid
        let songs = await getBackupPlaylist(userId)
        console.log("OAISNdOAISND:", songs)
        this.setState({ songs })
    }

    render() {
        return (
            <View style={{ flex: 1, padding: 10 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }} >Backup and Restore</Text>
                    <Text style={{ marginBottom: 20 }}>Welcome to Cloud Backup</Text>
                </View>
                {this.state.currentlyDownloading == null &&
                    <Text style={{ marginBottom: 30, fontWeight: "bold", fontSize: 20 }}>Songs in Backup Playlist</Text>
                }
                {this.state.currentlyDownloading != null &&
                    <Text style={{ marginBottom: 30, fontWeight: "bold", fontSize: 20 }}>Songs left to download</Text>
                }
                <FlatList
                    data={this.state.songs}
                    renderItem={({ item }) =>
                        <Song song={item.song} id={item.id} navigation={this.props.navigation} />
                    }
                    keyExtractor={item => item.id}
                />

                {this.state.currentlyDownloading == null &&
                    <Button
                        title="Restore"
                        onPress={() => this.restoreSongs()} />}

                {this.state.currentlyDownloading != null && <View>
                    <Text style={{ marginTop: 20, marginBottom: 10, fontWeight: "bold", fontSize: 25 }}>Currently downloading...</Text>
                    <Song song={this.state.currentlyDownloading.song} id={this.state.currentlyDownloading.id} navigation={this.props.navigation} />
                    <Text>Download Progress: </Text>
                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        indeterminate={false}
                        progress={this.state.progress}
                    />
                </View>}
                {/*
                {this.state.downloader != null &&
                    <View>
                        <Button
                            title="Stop Restore"
                            style={{ background: "red" }}
                            onPress={() => { this.stopRestore() }} />
                    </View>
                }
                 */}
            </View>
        )
    }


    onprogress = (recv, total) => {
        console.log("ONPROGRESS: ", (recv / total))
        this.setState({ progress: (recv / total) })
    }
    onsave = () => {
        console.log("ONSAVE:", "Song downloaded")
        this.setState({ currentlyDownloading: null, progress: 0, downloader: null })
        this.restoreSongs()
    }
    onerror = () => {
        console.log("ONERROR:", "error occured")
    }

    restoreSongs = () => {

        var songs = this.state.songs;
        var song = songs.pop(0)
        if (song) {
            console.log("RESTORESONGS:", "Downloading: " + song.id)
            var downloader = downloadSong(song.id, this, this.onprogress, this.onsave, this.onerror)
            this.setState({ currentlyDownloading: song, downloader })

        }

    }
    stopRestore = async () => {
        if (this.state.downloader == null) {
            ToastAndroid.show("No download in progress!", ToastAndroid.SHORT)

        } else {
            console.log(this.state.downloader)
                (await this.state.downloader).cancel((r) => {
                    console.log(r)
                })
            this.setState({ downloader: null, currentlyDownloading: null, progress: 0 })
        }
    }

}


export default BackupPlaylistScreen