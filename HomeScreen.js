import * as React from 'react';
import { View, Text, Button, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {db, auth} from './config'

class HomeScreen extends React.Component {
    constructor(props) {
        super(props)


        //login
        var email, pwd
        email = "khubaib@gmail.com"
        pwd = "123456"
        auth.signInWithEmailAndPassword(email, pwd).then(r => {
            console.log(r)
            console.log(Object.keys(r))
            ToastAndroid.show("Login successful!", ToastAndroid.SHORT)
        }).catch(err => {
            ToastAndroid.show(err.toString(), ToastAndroid.SHORT)
        })
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

                <Text style={{ margin: 5 }} />

                <Button
                    title="Backup Playlist"
                    color="#27ae60"
                    onPress={() => this.props.navigation.navigate("Backup Playlist")} />
            </View>
        );
    }


}

export default HomeScreen;