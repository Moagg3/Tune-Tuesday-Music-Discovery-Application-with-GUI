import React from 'react'
import { Text, StatusBar, Button, StyleSheet, Image, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import styles from './styles';

export default function GameComponent(params) {

  const getPoint = () => {
    return (
      <Text style={{
        color: '#2cc',
        fontSize: 15,
      }}>{params.Points} points</Text>
    )
  }

  const getSubmit = () => {
    if (params.Submitted == 'judge') {
      return (
        <Text style={{
          color: '#6930c3',
          fontSize: 20,
        }}>Judge</Text>
      )
    } else if (params.Submitted) {
      return (
        <Text style={{
          color: '#2cc',
          fontSize: 15,
        }}>Submitted</Text>
      )
    } else {
      return (
        <Text style={{
          color: '#2cc',
          fontSize: 15,
        }}>Not Submitted</Text>
      )

    }
  }
    return (
          <View style={styles.elem2}>
            <View style={styles.userInfo}>
              <View style={styles.userProfile} />
              <View style={styles.userName}>
                <Text style={{
                  color: '#2cc',
                  fontSize: 20,
                }}>{params.Name}</Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.userPoint}>
                {getPoint()}
              </View>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.userSubmit}>
                {getSubmit()}
              </View>
            </View>
          </View>
    )
}
