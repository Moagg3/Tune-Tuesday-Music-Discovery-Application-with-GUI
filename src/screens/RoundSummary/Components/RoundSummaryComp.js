import React from 'react'
import { Text, StatusBar, Button, StyleSheet, Image, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import styles from './styles';

export default function GameComponent(UserName) {
    return (
          <View style={styles.elem2}>
            <View style={styles.userInfo}>
              <View style={styles.userProfile} />
              <View style={styles.userName}>
                <Text style={{
                  color: '#2cc',
                  fontSize: 20,
                }}>{UserName.Name}</Text>
              </View>
            </View>
            <View style={styles.userSubmit}>
              <Text style={{
                color: '#2cc',
                fontSize: 20,
              }}>Point : {UserName.Point}</Text>
            </View>
          </View>
    )
}