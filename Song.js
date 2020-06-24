import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
class Song extends React.Component {
    constructor(props) {
        super(props)
        console.log("song data:", props)
    }
    render() {
        return (
            <TouchableOpacity onPress={()=>this.props.navigation.navigate("Song Details", {song: this.props.song, id: this.props.id})}>
                <View style={{marginBottom: 20, borderBottomColor: "black", borderBottomWidth: 1, paddingBottom: 10}}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>{this.props.song.meta.title}</Text>
                    <Text>{this.props.song.meta.artists}</Text>
                    <Text>{this.props.song.meta.album}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export default Song;