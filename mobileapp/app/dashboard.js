import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect, useLayoutEffect  } from 'react';
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard() {
  const [balance, setBalance] = useState('1000.00'); // Example balance
  const [contestsCount, setContestsCount] = useState(3); // Example contests count
  const [activities, setActivities] = useState([
   // { id: 1, text: 'minecraft勝出者:duck', time: '2025-4-19' },
   // { id: 2, text: 'minecraft春季挖礦小賽', time: '2025-4-19' },
   // { id: 3, text: 'minecraft勝出者:fkw_hk', time: '2025-1-31' },
    //{ id: 4, text: 'minecraft新春挖礦大賽', time: '2025-1-31'},
    // Add more activities as needed
  ]);
  const [usertitle, setUsertitle] = useState([]);
  const navigation = useNavigation();

    useEffect(() => {
    const checkUsername = async () => {
      const usernametitle = await AsyncStorage.getItem('username');
      setUsertitle(usernametitle);
    };
    checkUsername();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

    /* useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerRight: () => (
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.removeItem('username');
            navigation.replace('Login');
          }}
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: '#2196F3', fontWeight: 'bold', fontSize: 16 }}>登出</Text>
        </TouchableOpacity>
      ),
      title: 'Dashboard',
    });
  }, [navigation]); */

  const handleCompetitionSignup = () => {
      navigation.navigate('CompetitionSignupList'); 
  }

    const handleLogout = async () => {
      await AsyncStorage.removeItem('username');
      navigation.replace('Login');
    };

  const handleRanking = () => {
      navigation.navigate('Ranking'); 
  }

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://192.168.0.78:8000/dashboard/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        //setBalance(data.balance);
        //setContestsCount(data.contestsCount);
        setActivities(data.activities);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
          {/* Header Section */}
          <View style={styles.statsContainer}>
            <View style={styles.welcomeheader}>
                <Text style={styles.welcomeText}>歡迎! {usertitle}</Text>
            </View>
             <View style={styles.logoutheader}>
                <Text style={styles.welcomeText} onPress={handleLogout}>登出</Text>
            </View>
          </View>

          {/* Quick Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{contestsCount}</Text>
              <Text style={styles.statLabel}>舉辦過的比賽場數</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>參加過的比賽</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>報名過的比賽</Text>
            </View>
          </View>

          {/* Actions Section */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText} onPress={handleCompetitionSignup}>報名比賽</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>討論區</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>反饋</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText} onPress={handleRanking}>排行榜</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Activity Section */}
          <View style={styles.activityContainer}>
            <Text style={styles.sectionTitle}>近期活動</Text>
            {activities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <Text style={styles.activityText}>
                  {activity.title} {activity.amount}
                </Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
            ))}
          </View>
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
    width: '100%',
  },
  contentContainer: {
    padding: 20,
  },
  headerSection: {
  },
  welcomeheader:{
    width: '75%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutheader:{
    width: '20%',
    backgroundColor: 'rgba(236, 84, 84, 0.9)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  balanceText: {
    fontSize: 20,
    color: '#2196F3',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  activityContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  activityItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  activityText: {
    fontSize: 14,
    marginBottom: 5,
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
  },
});