import * as React from 'react'

import { View, Text, Button, StyleSheet, ProgressBarAndroid, ToastAndroid } from 'react-native';
import RNFetchBlob from "react-native-fetch-blob";

import axios from 'axios'
import { db, auth, isLiked, likeUnlike, addToBackupPlaylist, downloadSong } from './config';





class SongDetailsDirectoryScreen extends React.Component {
    constructor(props) {
        super(props)
        let { song, id } = this.props.route.params
        console.log(song)
        this.state = {
            song: song,
            id: id,
            progress: 0,
            liked: false,
            userId: "5e5d9967aad37740b0ca9df5"
        }

        this.isLikedOrNot()

    }

    isLikedOrNot = async () => {
        let songId = this.state.id
        let userId = auth.currentUser.uid
        let x = await isLiked(songId, userId)
        console.log("liked: ", x)
        this.setState({ liked: x })
    }

    likeOrUnlike = async () => {
        let userId = auth.currentUser.uid
        let songId = this.state.id
        let x = await likeUnlike(songId, userId)
        this.setState({ liked: x })
    }

    render() {
        return (
            <View style={{ padding: 10 }}>
                <Text>ID: {this.state.id}</Text>
                <Text style={{ fontSize: 25, fontWeight: "bold", textTransform: "capitalize" }}>{this.state.song.meta.title}</Text>
                <Text style={{ textTransform: "capitalize" }}>{this.state.song.meta.artists}</Text>
                <Text>{this.state.song.meta.album}</Text>

                <View style={{ alignItems: 'flex-end' }}>

                    <Button
                        style={{ color: 'pink' }}
                        title={this.state.liked ? "Unlike" : "Like"}
                        onPress={() => this.likeOrUnlike()}
                    />
                </View>
                <Text style={{ marginBottom: 20 }}></Text>
                {this.state.progress != 0 && <View>

                    <Text>Download Progress: </Text>


                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        indeterminate={false}
                        progress={this.state.progress}
                    />
                </View>}
                <View style={{ alignItems: 'center' }} >

                    <Button
                        title="Download"
                        color="#3f51b5"
                        onPress={() => this.dSong()}
                    />

                    <Text style={{ marginBottom: 150 }}></Text>

                    <Text style={{ marginBottom: 5 }} />

                    <Button
                        title="Delete"
                        color="#e74c3c"
                        onPress={() => { this.deleteSong() }}
                    />
                </View>
            </View >
        )
    }
    dSong = () => {
        downloadSong(this.state.id, this);
    }


    deleteSong = () => {
        let songId = this.state.id
        console.log('"' + songId + '"')
        var child = db.ref("songs/" + songId)
        let uid = auth.currentUser.uid
        child.once("value", snap => {
            var val = snap.val()
            console.log("song:", snap)
            console.log("keys", Object.keys(snap))
            console.log(val.user, uid, val.user == uid)
            if (val.user == uid) {
                child.remove(async (com) => {
                    console.log(com)
                    this.props.navigation.navigate("Songs Directory")
                }).catch(err => {
                    ToastAndroid.show(err.toString(), ToastAndroid.SHORT)

                })
            } else {
                ToastAndroid.show("Can't delete, you didn't upload this", ToastAndroid.SHORT)
            }
        }, err => {
            console.log("err:", err)
            ToastAndroid.show(err.toString(), ToastAndroid.SHORT)
        })
    }

    addToBackupPlaylist = () => {

        console.log(this.state.details)
        if (this.state.details._id == null) {
            alert("ID Not assigned yet!")
        } else {
            data = { songId: this.state.details._id }


            axios.post("http://192.168.1.4:3000/users/" + this.state.userId + "/backupPlaylist", data)
                .then((response) => {
                    console.log(response.data)
                    if (response.data.err) {
                        alert(response.data.err.message)
                    } else {
                        alert("Song added")
                    }
                })

        }
    }

}


export default SongDetailsDirectoryScreen