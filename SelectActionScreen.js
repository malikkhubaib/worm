const { View, Button, Text } = require("react-native")
import * as React from 'react';
const audioEditorPackageId = "com.pamsys.lexisaudioeditor";
import { openApp } from "rn-openapp";

class SelectActionScreen extends React.Component {
    constructor(props){
        super(props)
    }
    render = () => {
        return (

            <View style={{ flex: 1, padding: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Select Action</Text>
                <Button
                    title="Just upload the song!"
                    onPress={() => this.selectSong()}

                />
                <Button 
                    title="Preprocess song"
                    onPress={() => { this.openAudioEditor() }}
                />

            </View>
        )
    }

    selectSong = () => {
        this.props.navigation.navigate("Select Song")
    }


    openAudioEditor = () => {
        console.log("open");
        openApp(audioEditorPackageId)
          .then(result => {
              console.log(result)
              this.props.navigation.navigate("Select Song")
          })
          .catch(e => console.warn(e))
    }
}

export default SelectActionScreen