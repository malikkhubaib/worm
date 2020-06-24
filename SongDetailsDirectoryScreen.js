import * as React from 'react'

import { View, Text, Button, StyleSheet, ProgressBarAndroid, ToastAndroid } from 'react-native';
import RNFetchBlob from "react-native-fetch-blob";

import axios from 'axios'
import { db, auth } from './config';

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

        // this.isLikedOrNot()

    }

    isLikedOrNot = () => {
        let songId = this.state.details._id
        axios.get("http://192.168.1.4:3000/users/" + this.state.userId + "/likedPlaylist/")
            .then((res) => {
                let songs = res.data.songs
                for (let i = 0; i < songs.length; i++) {
                    if (songs[i]._id == this.state.details.songId) {
                        this.setState({ liked: true })
                        return
                    }
                }
            })
    }

    likeOrUnlike = () => {
        let songId = this.state.details._id
        let url = "http://192.168.1.4:3000/users/" + this.state.userId + "/likedPlaylist"
        console.log(url)
        if (this.state.liked) {
            axios.delete(url, { songId: songId })
                .then((res) => {
                    if (res.data.err) {
                        alert(res.data.err.message)
                    } else {
                        this.setState({ liked: false })
                    }
                })
        } else {
            axios.post(url, { songId: songId })
                .then((res) => {
                    if (res.data.err) {
                        alert(res.data.err.message)
                    } else {
                        this.setState({ liked: true })

                    }
                })
        }
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
                <Text>Download Progress: </Text>


                <ProgressBarAndroid
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={this.state.progress}
                />
                <View style={{ alignItems: 'center' }} >

                    <Button
                        title="Download"
                        color="#3f51b5"
                        onPress={() => this.downloadSong()} />

                    <Text style={{ marginBottom: 150 }}></Text>
                    <Button
                        title="Add to backup playlist"
                        color="#3f51b5"
                        onPress={() => this.addToBackupPlaylist()} />
                    <Text style={{ marginBottom: 5 }} />
                    <Button
                        title="Delete"
                        color="#e74c3c"
                        onPress={() => this.deleteSong()} />
                </View>
            </View >
        )
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
                child.remove( async(com) => {
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

    downloadSong = () => {
        let ext = this.state.song.download_url.split('?')[0].split('.')
        ext = ext[ext.length - 1]
        let filePath = RNFetchBlob.fs.dirs.DownloadDir + '/' + this.state.song.meta.title + '.' + ext;
        //let filePath = RNFetchBlob.fs.dirs.DownloadDir + '/a.mp3';
        console.log(filePath)
        let that = this
        RNFetchBlob.fetch('GET', this.state.song.download_url)
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


export default SongDetailsDirectoryScreen