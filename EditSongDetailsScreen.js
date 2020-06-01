import * as React from 'react';
import { View, Text, Button, StyleSheet, TextInput, ProgressBarAndroid, ToastAndroid } from 'react-native';


import axios from 'axios'
import Axios from 'axios';

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
                        onPress={() => this.startUpload()} />

                </View>
            </View>
        )
    }


    startUpload = () => {
        let data = new FormData();
        data.append('song', this.state.song);
        data.append('songDetails', JSON.stringify(this.state.songDetails))

        let url = "http://192.168.137.1:3000/songs/"
        /*
        console.log(data)
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: data,
        };
        fetch(url, config)
            .then((checkStatusAndGetJSONResponse) => {
                console.log(checkStatusAndGetJSONResponse);
                return (checkStatusAndGetJSONResponse)
            }).then((data) => { console.log(data) }).catch((err) => { console.log(err) });
        */

        //using axios for progress tracking
        let config = {
            onUploadProgress: progressEvent => {
                let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                this.setState({ uploadProgress: percentCompleted })
                // do whatever you like with the percentage complete
                // maybe dispatch an action that will update a progress bar or something
            }
        }
        axios.post(url, data, config)
            .then(response => {
                console.log(response)
                if(response.data.err){
                    alert(response.data.err)
                }else{
                    alert("Song successfully uploaded!")
                    this.props.navigation.navigate("Song Details", {
                        details: response.data.song
                    })
                }
            })
    }
}


export default EditSongDetailsScreen