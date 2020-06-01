import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20 }}>Welcome to WORM</Text>
                <Text style={{ marginBottom: 30 }}>World of real music</Text>
                <Button
                    title="Online Songs Directory"
                    color="#2c3e50"
                    onPress={() => this.props.navigation.navigate("Songs Directory")} />

                <Text style={{margin:5}} />

                <Button
                    title="Backup Playlist"
                    color="#27ae60"
                    onPress={() => this.props.navigation.navigate("Backup Playlist")} />
            </View>
        );
    }
}

export default HomeScreen;