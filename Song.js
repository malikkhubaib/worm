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
            <TouchableOpacity onPress={()=>this.props.navigation.navigate("Song Details", {details: this.props.details})}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>{this.props.details.title}</Text>
                    <Text>{this.props.details.artists}</Text>
                    <Text>{this.props.details.album}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export default Song;