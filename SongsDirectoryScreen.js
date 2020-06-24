import * as React from 'react';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Song from './Song'

import axios from 'axios'
import { db } from './config';

class SongsDirectoryScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            songs: []
        }
    }

    componentDidMount = () => {

        console.log("WORKING")
        var ref = db.ref("songs/");
        ref.on("value", res => {
            if (res.val() == null)
                return
            var songs = []
            console.log(res.val())
            Object.keys(res.val()).forEach((k) => {
                var item = res.val()[k]
                songs.push({ id: k, song: item })

            })
            this.setState({ songs })
            console.log("All songs", songs)
        })

    }

    searchDB = (str) => {

        axios.get("http://192.168.1.4:3000/songs/" + str)
            .then(res => {
                console.log(res.data)
                this.setState({ songs: res.data.songs })
            })
    }
    render = () => {
        return (
            <View style={{ flex: 1, padding: 10, }}>
                <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>Songs</Text>
                <TextInput style={{ marginBottom: 10, borderBottomWidth: 2 }}
                    placeholder="Search"
                    onChangeText={(str) => { this.searchDB(str) }}
                />
                <SafeAreaView>
                    <FlatList
                        data={this.state.songs}
                        renderItem={({ item }) => <Song id={item.id} song={item.song} navigation={this.props.navigation} />}
                        keyExtractor={item => item.id}
                    />
                </SafeAreaView>
            </View>
        )
    }
}

export default SongsDirectoryScreen;