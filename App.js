import React,{useState,useEffect,useRef} from 'react'
import { View, Text } from 'react-native'
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import {showMessage, hideMessage} from 'react-native-flash-message';

const App = () => {
  const myRef = useRef('myLocalFlashMessage');
  const getToken = async () => {
    console.log('GETTING TOKEN');
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      console.log('TOKEN NOT FOUND');
      fcmToken = await firebase.messaging().getToken();
      console.log('fcmToken', fcmToken);
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } else {
      console.log('TOKEN ALREADY EXIST ', fcmToken);
    }
  };

  const checkPermission = async () => {
    console.log('CHECKING');
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      getToken();
      console.log('PERMISSIONS GRANTED');
    } else {
      console.log('PERMISSIONS NOT GRANTED');
      requestPermission();
    }
  };

  const requestPermission = async () => {
    console.log('PERMISSIONS');
    try {
      await firebase.messaging().requestPermission();
      getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  };

  const createNotificationListeners = () => {
    onUnsubscribeNotificaitonListener = firebase
      .notifications()
      .onNotification(notification => {
        notification.android.setChannelId("daily");
        firebase.notifications().displayNotification(notification);
        console.log('notification', notification);
        console.log('notification', notification.title);
        console.log('notification', notification.body);
        showMessage({
          hideOnPress: true,
          message: notification.title,
          description:notification.body,
          type: 'info',
          autoHide: false,
          animated: true,
        });
      });
  };

  const removeNotificationListeners = () => {
    onUnsubscribeNotificaitonListener();
  };

  useEffect(()=>{
    FlashMessage.setColorTheme({
      success: "#019147",
      info: "#0072CA",
      warning: "#EE732E ",
      danger: "#Ac2625",
    });
    checkPermission();
    createNotificationListeners();
    return()=>{
      removeNotificationListeners();
    }
  },[])
  return (
    <View>
      <Text>Helllo World</Text>
      <FlashMessage ref={myRef} />
    </View>
  )
}

export default App;