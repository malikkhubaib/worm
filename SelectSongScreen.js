import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import DocumentPicker from 'react-native-document-picker';
import { TextInput } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    textInput: {
        borderBottomColor: "grey",
        borderBottomWidth: 2,
        padding: 10
    }
})

const jsmediatags = require('jsmediatags');

class SelectSongScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            song: {
                uri: "", type: "", name: "", size: 0
            }
        }
    }
    render = () => {
        return (
            <View style={{ flex: 1, padding: 10, }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Song Uploader</Text>
                <Text
                    style={{
                        marginBottom: 20
                    }}>Pick a song</Text>
                <Button
                    title="Pick a song"
                    onPress={() => this.selectSong()}
                />

            </View>
        );
    }

    selectSong = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio],
            });
            console.log(
                res
            );

            let song = {
                uri: res.uri,
                type: res.type,
                name: res.name,
                size: res.size
            }
            //upload song
            
            //then goto next screen
            this.props.navigation.navigate("Edit Song Details", {
                song
            })


        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }
    
}

export default SelectSongScreen;