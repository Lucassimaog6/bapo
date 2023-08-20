import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, TouchableHighlight, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';

export default function Login({ navigation }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {
    const response = await fetch('http://54.198.45.10:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password})
    })

    if (!response.ok) return console.log('Error');
    const data = await response.json();
    if (data.error) return console.log(data.error);

    navigation.navigate('Chat', { userId: data["userId"] });
  }

  return (
    <KeyboardAvoidingView behavior={ Platform.OS === 'ios' ? 'padding' : 'height' } style={styles.view}>

      <StatusBar style="auto" />

      <TextInput
        value={email}
        onChangeText={text => setEmail(text)}
        placeholder='username'
        style={styles.loginInput} />

      <TextInput
        value={password}
        onChangeText={text => setPassword(text)}
        placeholder='•••••••••'
        secureTextEntry={true} style={styles.loginInput} />

      <TouchableHighlight 
        style={styles.loginButton}
        onPress={handleLogin}  
      >
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableHighlight>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loginInput: {
    minWidth: '70%',
    borderColor: '#9ca3af',
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    fontSize: 20,
  },
  loginButton: {
    minWidth: '70%',
    backgroundColor: '#9ca3af',
    padding: 10,
    borderRadius: 8,
    fontSize: 20,
  },
  loginButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
  }
});
