import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Feedback_list() {
  const [isLoading, setIsLoading] = useState(true); 
  const navigation = useNavigation();
  const [feedbackList, setFeedbackList] = useState([]);
  const [usertitle, setUsertitle] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkUsername = async () => {
      const usernametitle = await AsyncStorage.getItem('username');
      console.log('usertitle:', usernametitle);
      setUsertitle(usernametitle);
    };
    checkUsername();
  }, []);


  useEffect(() => {
    if (usertitle) {
      fetchDashboardData();
    }
  }, [usertitle]);

    useFocusEffect(
      React.useCallback(() => {
        if (!usertitle) return; // Only fetch if usertitle is set

        fetchDashboardData();
        const interval = setInterval(() => {
          fetchDashboardData();
        }, 1000);

        return () => clearInterval(interval);
      }, [usertitle]) // Add usertitle as a dependency
    );




    const fetchDashboardData = async () => {
    try {
      setIsLoading(true);  // Start loading
      const formData = new FormData();
      formData.append('username', usertitle);
      console.log('usertitle:', usertitle);
      const response = await fetch(`${config.API_BASE_URL}/feedback_list/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setFeedbackList(data.feedbackList || []); // Use empty array as fallback
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setFeedbackList([]); // Set empty array on error
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleDeleteMessage = async (date) => {
        try {
            setIsLoading(true);  // Start loading
            const response = await fetch(`${config.API_BASE_URL}/feedback_delete/`, {
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

      /* const handleFeedbackContent = async (date) => {
        try {
            setIsLoading(true);  // Start loading
            const response = await fetch(`${config.API_BASE_URL}/feedback_content/`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date }),
            });
            const data = await response.json();
            if (response.ok) {
                await AsyncStorage.setItem('content_date', data.content);
                navigation.navigate('Feedback_content'); 
            }
            } catch (error) {
            console.error('Error fetching dashboard data:', error);
            } finally {
            setIsLoading(false); // End loading
            }
        };
    */

         const handleFeedbackContent = async (date) => {
                await AsyncStorage.setItem('content_date', date);
                navigation.navigate('Feedback_content'); 
        };

  return (
    <ImageBackground 
      source={require('../../assets/main_page_background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView style={styles.scrollView}>
              <View style={styles.contentContainer}>
                {feedbackList.map((feedback) => (
                  <TouchableOpacity 
                    key={feedback.id}
                    style={styles.competitionCard}
                    onPress={() => handleFeedbackContent(feedback.created_at)}
                  >
                <View style={{ flex: 1 }}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{feedback.feedback_title}</Text>
                    <TouchableOpacity
                      style={{ marginLeft: 8, padding: 4, backgroundColor: '#ff5252', borderRadius: 8 }}
                      onPress={() => handleDeleteMessage(feedback.created_at)}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>刪除</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1 }} />
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>日期: {feedback.created_at}</Text>
                  </View>
                </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
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
    //justifyContent: 'space-between',
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
    flexDirection: 'row',
    justifyContent: 'flex-start',   // Align to left
    alignItems: 'flex-end',  
    //left: 0,
    //top: '80%',
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
});