import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

export default function Feedback() {
  const [competitions, setCompetitions] = useState([
    //{ id: 1, title: 'Minecraft春季挖礦大賽', date: '2025-4-19', status: '報名中', prize: '$1000' },
    //{ id: 2, title: 'Minecraft夏季挖礦大賽', date: '2025-7-19', status: '報名中', prize: '$1500' },
    //{ id: 3, title: 'Minecraft秋季挖礦大賽', date: '2025-10-19', status: '即將開始', prize: '$2000' },
  ]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const navigation = useNavigation();
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');

   const [name, setName] = useState('');
   const [size, setSize] = useState('');
   const [url, setUrl] = useState('');
  const [usertitle, setUsertitle] = useState([]);
  
    useEffect(() => {
    const checkUsername = async () => {
      const usernametitle = await AsyncStorage.getItem('username');
      setUsertitle(usernametitle);
    };
    checkUsername();
  }, []);
    /* const fetchDashboardData = async () => {
    try {
      setIsLoading(true);  // Start loading
      const response = await fetch('http://192.168.0.78:8000/feedback_type/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCompetitions(data.signupList || []); // Use empty array as fallback
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setCompetitions([]); // Set empty array on error
    } finally {
      setIsLoading(false); // End loading
    }
  };
*/





const handleSubmit = async () => {
  if (!title.trim()) {
    alert('請輸入標題');
    return;
  }
  if (!description.trim()) {
    alert('請輸入描述');
    return;
  }

  // Example: Prepare FormData for file upload
  const formData = new FormData();
  formData.append('username', usertitle);
  formData.append('title', title);
  formData.append('description', description);

  try {
    const response = await fetch(`${config.API_BASE_URL}/feedback_submit/`, {
      method: 'POST',
      body: formData,
     /* headers: {
        'Content-Type': 'multipart/form-data',
      }, */
    });
    const data = await response.json();
    if (response.ok) {
      alert('提交成功！');
      setDescription('');
      setTitle('');
      navigation.navigate('Feedback_type');
    } else {
      alert('提交失敗: ' + (data.error || '未知錯誤'));
      console.error('Error uploading file:', error);
    }
  } catch (error) {
    alert('提交失敗: ' + error.message);
  }
};

  return (
    <ImageBackground 
      source={require('../assets/main_page_background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.competitionCard}>
        <Text style={{ flex: 1, padding: 8, fontWeight: 'bold', width: '100%', textAlign: 'center', fontSize: 20, color: 'white', textShadowColor: 'black', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 }}>提供建議</Text>
        <Text style={{ flex: 1, padding: 8, width: '100%', fontSize: 20, color: 'black'}}>使用者: {usertitle} </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 10,
            marginTop: 12,
            marginBottom: 8,
            minHeight: 40,
            height: 50,
            backgroundColor: '#fff',
          }}
          placeholder="請輸入主題"
          multiline
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 10,
            marginTop: 12,
            marginBottom: 8,
            minHeight: 40,
            height: 200,
            backgroundColor: '#fff',
          }}
          placeholder="請輸入描述...(建議不超過兩百字)"
          multiline
          value={description}
          onChangeText={setDescription}
        />
        <Button title="提交" onPress={handleSubmit} />
      </TouchableOpacity>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  competitionCard: {
    position: 'absolute',
    top: '10%',
    width: '90%',
    left: '5%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  prizeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E91E63',
  },
});