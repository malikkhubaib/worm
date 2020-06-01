import * as React from 'react';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Song from './Song'

import axios from 'axios'

class SongsDirectoryScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            songs: []
        }

        axios.get("http://192.168.137.1:3000/songs/")
            .then(res => {
                console.log(res.data)
                this.setState({songs: res.data.songs})
            })
    }

    componentDidMount = () => {

    }

    searchDB = (str) => {

        axios.get("http://192.168.137.1:3000/songs/"+str)
            .then(res => {
                console.log(res.data)
                this.setState({songs: res.data.songs})
            })
    }
    render = () => {
        return (
            <View style={{ flex: 1, padding: 10, }}>
                <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>Songs</Text>
                <TextInput style={{ marginBottom: 10, borderBottomWidth: 2 }}
                    placeholder="Search"
                    onChangeText={(str)=> {this.searchDB(str)}}
                />
                <SafeAreaView>
                    <FlatList
                        data={this.state.songs}
                        renderItem={({ item }) => <Song details={item} navigation={this.props.navigation}/>}
                        keyExtractor={item => item.id}
                    />
                </SafeAreaView>
            </View>
        )
    }
}

export default SongsDirectoryScreen;