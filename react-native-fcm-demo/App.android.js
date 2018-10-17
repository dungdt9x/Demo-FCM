/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class AppAndroid extends Component {
constructor(props) {
    super(props);

    this.state = {
        latitude: null,
        longitude: null,
        error:null,
    };
  }
    componentDidMount = async () => {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
            });
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            // user has permissions
        } else {
            // user doesn't have permission
            try {
                await firebase.messaging().requestPermission();
                // User has authorised
            } catch (error) {
                // User has rejected permissions
                alert('No permission for notification');
            }
        }

        const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            // App was opened by a notification
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            if (notification.body!==undefined) {
                var message = 'Body FCM: ' + notification.body;
                if (this.state.longitude !== null) {
                    message = message + ' & Location: ' + JSON.stringify(this.state);
                }
                console.log(message);
                alert(message);
            } else {
                var seen = [];
                var message = 'Body FCM: ' + JSON.stringify(notification.data, function(key, val) {
                    if (val != null && typeof val == "object") {
                        if (seen.indexOf(val) >= 0) {
                            return;
                        }
                        seen.push(val);
                    }
                    return val;
                });
                 if (this.state.longitude !== null) {
                    message = message + ' & Location: ' + JSON.stringify(this.state);
                }
                console.log(message);
                alert(message);
            }
            firebase.notifications().removeDeliveredNotification(notification.notificationId);
        }

        const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
            .setDescription('My apps test channel');

        // Create the channel
        firebase.notifications().android.createChannel(channel);

        firebase.messaging().subscribeToTopic('news1');

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
            console.log('get Message');
            console.log(notification);
            notification
                .android.setChannelId('test-channel')
                .android.setSmallIcon('ic_launcher');
            firebase.notifications()
                .displayNotification(notification);
        });
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            if (notification.body!==undefined) {
                 var message = 'Body FCM: ' + notification.body;
                if (this.state.longitude !== null) {
                    message = message + ' & Location: ' + JSON.stringify(this.state);
                }
                console.log(message);
                alert(message);
            } else {
                var seen = [];
                var message = 'Body FCM: ' + JSON.stringify(notification.data, function(key, val) {
                    if (val != null && typeof val == "object") {
                        if (seen.indexOf(val) >= 0) {
                            return;
                        }
                        seen.push(val);
                    }
                    return val;
                });
                 if (this.state.longitude !== null) {
                    message = message + ' & Location: ' + JSON.stringify(this.state);
                }
                console.log(message);
                alert(message);
            }
            firebase.notifications().removeDeliveredNotification(notification.notificationId);
        });
    }

    componentWillUnmount() {
        this.notificationDisplayedListener();
        this.notificationListener();
        this.notificationOpenedListener();
    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
