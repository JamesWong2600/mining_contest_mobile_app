import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Image } from 'react-native';
import config from '../config';

export default function Ranking() {
  const [competitions, setCompetitions] = useState([
    //{ id: 1, title: 'Minecraft春季挖礦大賽', date: '2025-4-19', status: '報名中', prize: '$1000' },
    //{ id: 2, title: 'Minecraft夏季挖礦大賽', date: '2025-7-19', status: '報名中', prize: '$1500' },
    //{ id: 3, title: 'Minecraft秋季挖礦大賽', date: '2025-10-19', status: '即將開始', prize: '$2000' },
  ]);
  const [isLoading, setIsLoading] = useState(true); 
  const navigation = useNavigation();
  const [rows, setRows] = useState([]);


  useEffect(() => {
    fetchRankingData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchRankingData();
      const interval = setInterval(() => {
        fetchRankingData();
      }, 1000);
      return () => clearInterval(interval);
    }, [])
  );

     //const rows = [
     // { ranking: 1, uuid: 'f4bb116b-00d2-4b1f-9c01-e203ad5ea3e1', name: 'fkw_hk', score: 9320 },
    //  { ranking: 2, uuid: '7f458f44-85bf-4984-8bd3-4077bb3e33dc', name: 'Jay1n', score: 8292 },
    //  { ranking: 3, uuid: 'fc48833b-366c-4357-82fc-5d3d16ca8b1a', name: 'eliseqwq', score: 7812 },
   // ];


    const fetchRankingData = async () => {
    try {
      setIsLoading(true);  // Start loading
      const response = await fetch(`${config.API_BASE_URL}/ranking/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Ranking data:', data);
        setRows(data.rankingList); // Use empty array as fallback
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setRows([]); // Set empty array on error
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
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
             <View style={{ height: '5%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ flex: 1, padding: 8, fontWeight: 'bold', width: '100%', textAlign: 'center', fontSize: 20, color: 'white', textShadowColor: 'black', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 }}>minecraft新春挖礦大賽2025排行榜</Text>
              </View>
          <View style={{ borderWidth: 1 }}>
            {/* Table Header */}
            <View style={{ flexDirection: 'row', backgroundColor: '#eee' }}>
              <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ flex: 1, padding: 8, fontWeight: 'bold', width: '100%', textAlign: 'center', fontSize: 8 }}>排名</Text>
              </View>
              <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ flex: 1, padding: 8, fontWeight: 'bold', width: '100%', textAlign: 'center', fontSize: 8 }}>Icon</Text>
              </View>
              <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ flex: 1, padding: 8, fontWeight: 'bold', width: '100%', textAlign: 'center', fontSize: 8 }}>玩家名稱</Text>
              </View>
              <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ flex: 1, padding: 8, fontWeight: 'bold', width: '100%', textAlign: 'center', fontSize: 8 }}>得分</Text>
              </View>
            </View>
            {/* Table Rows */}
            {rows.map((row, idx) => (
              <View key={idx} style={{ minHeight: 40, flexDirection: 'row', borderTopWidth: 2, borderColor: '#ccc', alignItems: 'center', backgroundColor: 'white' }}>
                <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ flex: 1, padding: 8, width: '100%', textAlign: 'center', fontSize: 8 }}>{row.unique_rank_id}</Text>
                </View>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  source={{ uri: `https://crafatar.com/avatars/${row.uuid}?size=32&overlay` }}
                  style={{ width: 24, height: 24, marginRight: 8, borderRadius: 4 }}
                />
                </View>
                <View style={{ width: '30%',  alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ flex: 1, padding: 8, width: '100%', textAlign: 'center', fontSize: 8 }}>{row.player}</Text>
                 </View>
                <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}> 
                <Text style={{ flex: 1, padding: 8, width: '100%', textAlign: 'center' , fontSize: 8}}>{row.point}</Text>
               </View>
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