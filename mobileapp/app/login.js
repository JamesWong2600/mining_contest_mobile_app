import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import { useState , useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const navigation = useNavigation();

    useEffect(() => {
  const checkUsername = async () => {
    const usernametitle = await AsyncStorage.getItem('username');
      alert(usernametitle);
    if (usernametitle) {
      navigation.navigate('Dashboard');
    }
  };
  checkUsername();
}, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //const [usertitle, setUsertitle] = useState([]);
   const switchbutton = async () => {
       navigation.navigate('Register'); 
  }

const handleLogin = async () => {
    try {
    const response = await fetch('http://192.168.0.78:8000/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
         body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      //alert('Login successful!');
      await AsyncStorage.setItem('username', username);
      navigation.navigate('Dashboard'); 

      // Add navigation to login screen here if needed
    } else {
      alert(data.error || 'Registration failed');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error:', error.message);
  }
  };


    return (
    <ImageBackground 
      source={require('./assets/main_page_background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.contentContainer}>
        <View style={styles.loginContainer}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
            Welcome to Mining Contest Association
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.switchButton}
            onPress={switchbutton}
          >
            <Text style={styles.loginButtonText}>Switch to Register</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    width: '80%',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 0,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  loginButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
    switchButton: {
    backgroundColor: '#FF96F3',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});