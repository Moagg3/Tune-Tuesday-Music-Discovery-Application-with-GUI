import React, { useState } from 'react'
import { Text, StatusBar, Button, StyleSheet, Image, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import styles from './Components/styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { Directions } from 'react-native-gesture-handler';
import GameComponent from './Components/GameComponent';
import  AppBar from '../GlobalComponents/AppBarComponent';

export default function CurrentGameScreen({ navigation, extraData }) {
    return (
          <SafeAreaView style={[styles.container, { backgroundColor: '#000000' }]}>

            <StatusBar barStyle="light-content" backgroundColor="#2cc" />

            <AppBar navigation={navigation} Title="Current Point" BackLink="CurrentGame" />


            <View style={styles.userList}>

              <GameComponent
                Name = {'User A'}
                Point = {'6'}
              />

              <GameComponent
                Name = {'User B'}
                Point = {'4'}
              />

              <GameComponent
                Name = {'User C'}
                Point = {'3'}
              />

              <GameComponent
                Name = {'User D'}
                Point = {'1'}
              />
            </View>

            <View style={styles.elem}/>
          </SafeAreaView>
        );
      }