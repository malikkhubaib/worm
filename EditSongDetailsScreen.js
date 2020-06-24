import * as React from 'react';
import { View, Text, Button, StyleSheet, TextInput, ProgressBarAndroid, ToastAndroid } from 'react-native';


import axios from 'axios'
import Axios from 'axios';

import { db, storage, auth } from './config'

const styles = StyleSheet.create({
    textInput: {
        borderBottomColor: "grey",
        borderBottomWidth: 2,
        padding: 10
    }
})

const jsmediatags = require('jsmediatags');

class EditSongDetailsScreen extends React.Component {
    constructor(props) {
        super(props)
        const { song } = this.props.route.params

        this.state = {
            song,
            songDetails: {
                title: "",
                artists: "",
                albums: "",
            },
            uploadProgress: 0
        }

        //this library isn't working right now
        //this.extractID3TagDetails()
    }

    extractID3TagDetails = () => {
        try {
            let uri = this.state.song.uri
            console.log(encodeURI(uri))
            new jsmediatags.Reader(encodeURI(uri))
                .read({
                    onSuccess: (tag) => {
                        console.log('Success!');
                        console.log(tag);
                    },
                    onError: (error) => {
                        console.log('Error');
                        console.log(error);
                    }
                });
        } catch (e) {
            console.error(e)
        }
    }

    render = () => {
        return (
            <View style={{
                padding: 10
            }}>
                <View>
                    <Text
                        style={{ marginBottom: 30, fontSize: 20, fontWeight: "bold" }}>Song Details: </Text>
                    <Text>Title:</Text>
                    <TextInput style={styles.textInput} value={this.state.songDetails.title} onChangeText={(s) => { let songDetails = this.state.songDetails; songDetails.title = s; this.setState({ songDetails: songDetails }) }} />
                    <Text>Artists:</Text>
                    <TextInput style={styles.textInput} value={this.state.songDetails.artists} onChangeText={(s) => { let songDetails = this.state.songDetails; songDetails.artists = s; this.setState({ songDetails: songDetails }) }} />
                    <Text>Album:</Text>
                    <TextInput style={styles.textInput} value={this.state.songDetails.album} onChangeText={(s) => { let songDetails = this.state.songDetails; songDetails.album = s; this.setState({ songDetails: songDetails }) }} />

                    <Text style={{ marginBottom: 50 }}></Text>
                    <Text>Upload Progress: </Text>
                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        indeterminate={false}
                        progress={this.state.uploadProgress}
                    />
                    <Button
                        title="Start Upload"
                        onPress={() => this.startFBSUpload()} />

                </View>
            </View>
        )
    }

    startFBSUpload = async () => {
        // var bucket = storage.ref("/"+this.state.song)
        console.log(this.state.song)
        console.log(Object.keys(this.state.song))
        //name
        var filename = this.state.song.name
        var pathToFile = this.state.song.uri

        var bucket = storage.ref("/" + (new Date()).getTime() + " - " + filename)

        // var downloadUrl = await bucket.getDownloadURL()
        // console.log("Download: " + downloadUrl)
        var response = fetch(this.state.song.uri)
        var blob = await (await response).blob()
        console.log(response)
        console.log(blob)
        var task = bucket.put(blob);

        task.on('state_changed', taskSnapshot => {
            console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
            var percent = taskSnapshot.bytesTransferred/taskSnapshot.totalBytes
            console.log(percent)
            this.setState({uploadProgress: percent})
        });

        task.then(() => {
            console.log('Song uploaded to the bucket!');
            ToastAndroid.show("Song uploaded, adding to list!", ToastAndroid.LONG)
            this.addSongToList(bucket)
        });
    }

    addSongToList = async (ref) => {
        var uid = auth.currentUser.uid
        var downloadUrl = await ref.getDownloadURL()
        console.log("Download: " + downloadUrl)
        var child = db.ref("songs/").push()
        var song = {
            download_url: downloadUrl,
            meta: this.state.songDetails,
            user: uid
        }
        child.set(song)
        ToastAndroid.show("Added to list!", ToastAndroid.SHORT)
        this.props.navigation.navigate("Song Details", {
            song: song,
            id: (await child).key
        })
    }
}


export default EditSongDetailsScreen