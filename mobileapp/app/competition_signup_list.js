import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import config from './config';

export default function CompetitionSignupList() {
  const [competitions, setCompetitions] = useState([
    //{ id: 1, title: 'Minecraft春季挖礦大賽', date: '2025-4-19', status: '報名中', prize: '$1000' },
    //{ id: 2, title: 'Minecraft夏季挖礦大賽', date: '2025-7-19', status: '報名中', prize: '$1500' },
    //{ id: 3, title: 'Minecraft秋季挖礦大賽', date: '2025-10-19', status: '即將開始', prize: '$2000' },
  ]);
  const [isLoading, setIsLoading] = useState(true); 
  const navigation = useNavigation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const signupforcompetition = (comp) => {
    if (comp.status === '報名中') {
      alert('報名成功');
      //navigation.navigate('CompetitionSignup'); 
    }
    else if (comp.status === '未開放') {
      alert('未開放');
    }
    else if (comp.status === '已結束') {
      alert('已結束');
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboardData();
      const interval = setInterval(() => {
      fetchDashboardData();
      }, 1000); // 1000ms = 1 second

      // Cleanup function to clear interval when screen loses focus
      return () => clearInterval(interval);
    }, [])
  );

    const fetchDashboardData = async () => {
    try {
      setIsLoading(true);  // Start loading
      const response = await fetch(`${config.API_BASE_URL}/signup_list/`, {
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

  return (
    <ImageBackground 
      source={require('./assets/main_page_background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {competitions.map((comp) => (
            <TouchableOpacity 
              key={comp.id}
              style={styles.competitionCard}
              onPress={() => signupforcompetition(comp)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{comp.title}</Text>
                <View style={[
                  styles.statusBadge,
                 { backgroundColor: 
                      comp.status === '報名中' ? 'green' : 
                      comp.status === '未開放' ? '#B8860B' : 
                      'red' 
                  }
                ]}>
                  <Text style={styles.statusText}>{comp.status}</Text>
                </View>
              </View>
              
              <View style={styles.cardContent}>
                <Text style={styles.dateText}>日期: {comp.date}</Text>
                <Text style={styles.prizeText}>獎金: {comp.prize}</Text>
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