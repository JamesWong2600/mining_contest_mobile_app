import { StatusBar } from 'expo-status-bar';
import { TextInput, StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import config from '../config';

export default function Forum() {
  let isdelete = 0;
  const notificationListener = useRef();
  const responseListener = useRef();

  const [messagelist, setmessagelist] = useState([
    //{ id: 1, title: 'Minecraft春季挖礦大賽', date: '2025-4-19', status: '報名中', prize: '$1000' },
    //{ id: 2, title: 'Minecraft夏季挖礦大賽', date: '2025-7-19', status: '報名中', prize: '$1500' },
    //{ id: 3, title: 'Minecraft秋季挖礦大賽', date: '2025-10-19', status: '即將開始', prize: '$2000' },
  ]);
  const [isLoading, setIsLoading] = useState(true); 
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [content, setcontent] = useState('');
  const [date, setdate] = useState('');
   const [usertitle, setUsertitle] = useState([]);
    
    const prevMessagesRef = useRef([]);

    const areMessagesDifferent = (oldList, newList) => {
    console.log(`${oldList.length} + ${oldList.length}`);
    if (oldList.length < newList.length) return false;  
    if (oldList.length > newList.length) return true;
    for (let i = 0; i < oldList.length; i++) {
        if (
        oldList[i].id > newList[i].id ||
        oldList[i].content > newList[i].content
        ) {
        return true;
        }
    }
    return false;
    };

   useEffect(() => {
    // Register for notifications
    registerForPushNotificationsAsync().then(token => {
      console.log('Expo Push Token:', token);
      // You can send this token to your server here
    });

    // Listener for incoming foreground notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      Alert.alert(notification.request.content.title, notification.request.content.body);
    });

    // Listener for user interaction with notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('User tapped on notification:', response);
      // Handle navigation or logic
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


    const handleDeleteMessage = async (date) => {
        try {
            setIsLoading(true);  // Start loading
            const response = await fetch(`${config.API_BASE_URL}/forum_delete_message/`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date }),
            });

            if (response.ok) {
                 console.log('isdelete:', isdelete);
                isdelete = 0;
                alert('訊息已刪除!');
            }
            } catch (error) {
            console.error('Error fetching dashboard data:', error);
            } finally {
            setIsLoading(false); // End loading
            }
        };

    useEffect(() => {
    const checkUsername = async () => {
      const usernametitle = await AsyncStorage.getItem('username');
      setUsername(usernametitle);
    };
    checkUsername();
  }, []);

  useEffect(() => {
    fetchforumMessageData();
  }, []);


  useFocusEffect(
    React.useCallback(() => {
     fetchforumMessageData();
      const interval = setInterval(() => {
      fetchforumMessageData();
      }, 1000); // 1000ms = 1 second

      // Cleanup function to clear interval when screen loses focus
      return () => clearInterval(interval);
    }, [])
  );


    const fetchforumMessageData = async () => {
    try {
      setIsLoading(true);  // Start loading
      const response = await fetch(`${config.API_BASE_URL}/forum/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
         if (areMessagesDifferent(prevMessagesRef.current, data.messages_list)) {
        // The message list has changed!
        // You can show an alert or notification here
           if (username !== data.messages_list[0].username) {
            if (isdelete === 1) {
              alert('有新訊息！');
            }
           //alert('有新訊息！');
           }
         }
        setmessagelist(data.messages_list); 
        prevMessagesRef.current = data.messages_list;// Use empty array as fallback
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false); // End loading
    }
  }; 
  

    const sendMessage = async () => {
    try {
      setIsLoading(true);  // Start loading
      const response = await fetch(`${config.API_BASE_URL}/forum_send_message/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({ username, content }),
      });

      if (response.ok) {
          //alert('Message sent successfully!');
          console.log('isdelete:', isdelete);
         //isdelete = 1;
         //if (username !== data.messages_list[0].username) {
         //if (isdelete === 1) {
         //  alert('有新訊息！');
         // }
       // }
          
          setcontent('')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false); // End loading
    }
  }; 

  return (
    <ImageBackground 
      source={require('../assets/main_page_background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
        <View style={styles.chatArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {messagelist.map((msg) => (
            <TouchableOpacity 
              key={msg.id}
              style={styles.competitionCard}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{msg.username}</Text>
                <View style={[
                  styles.statusBadge,
                ]}>
                  <Text style={styles.statusText}>日期: {msg.date}</Text>
                </View>
                    {username === msg.username && (
                        <TouchableOpacity
                        style={{ marginLeft: 8, padding: 4, backgroundColor: '#ff5252', borderRadius: 8 }}
                        onPress={() => handleDeleteMessage(msg.date)}
                        >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>刪除</Text>
                        </TouchableOpacity>
                    )}
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.dateText}>{msg.content}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
       <View style={styles.chatboxContainer}>
            <TextInput
            style={styles.chatbox}
            placeholder="請輸入你的訊息..."
            multiline={true}
            value={content}
            onChangeText={setcontent}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>發送</Text>
            </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission not granted for notifications!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    height: '100%',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
    height: '100%',
  },
  competitionCard: {
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
    color: 'black',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 8,
  },
  statusText: {
    color: 'black',
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
    chatArea: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'flex-end'
    },

    chatboxContainer: {
    height: '18%', 
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
     alignItems: 'center',
  },
    sendButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: 80,
    alignItems: 'center',
    marginLeft: 8,
    },
    sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    },
    chatbox: {
    flex: 1, // Make input take available space
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    },
});