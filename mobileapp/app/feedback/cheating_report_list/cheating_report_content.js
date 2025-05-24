import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Image } from 'react-native';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';

export default function Cheating_report_content() {
  const [competitions, setCompetitions] = useState([
    //{ id: 1, title: 'Minecraft春季挖礦大賽', date: '2025-4-19', status: '報名中', prize: '$1000' },
    //{ id: 2, title: 'Minecraft夏季挖礦大賽', date: '2025-7-19', status: '報名中', prize: '$1500' },
    //{ id: 3, title: 'Minecraft秋季挖礦大賽', date: '2025-10-19', status: '即將開始', prize: '$2000' },
  ]);
  const [isLoading, setIsLoading] = useState(true); 
  const navigation = useNavigation();
  const [rows, setRows] = useState([]);
  const [report_date, setreport_date] = useState({});
  const [username, setUsername] = useState('');
  const [report, setreport] = useState([]);

  const isImage = report[0]?.file?.endsWith('.jpg') || report[0]?.file?.endsWith('.png') || report[0]?.file?.endsWith('.jpeg');
  const isMp4 = report[0]?.file?.endsWith('.mp4') || report[0]?.file?.endsWith('.mov') || report[0]?.file?.endsWith('.avi') || report[0]?.file?.endsWith('.mkv');

  useEffect(() => {
   if (username && report_date) { 
    handleFeedbackContent();
   }
  }, [username && report_date]); // Fetch when username or report_date changes


  /*    
  useFocusEffect(
        React.useCallback(() => {
          console.log(`${username}, ${report_date}`);
          if (!username || !report_date) return; // Only fetch if usertitle is set
  
          handleFeedbackContent();
          const interval = setInterval(() => {
            handleFeedbackContent();
          }, 1000);
  
          return () => clearInterval(interval);
        }, [username || report_date]) // Add usertitle as a dependency
      );
  */


   useEffect(() => {
    const checkcontent_date = async () => {
      const the_report_date = await AsyncStorage.getItem('report_date');
      setreport_date(the_report_date);
    };
    checkcontent_date();
  }, []);

  useEffect(() => {
    const checkUsername = async () => {
      const usernametitle = await AsyncStorage.getItem('username');
      setUsername(usernametitle);
    };
    checkUsername();
  }, []);

  


    const handleFeedbackContent = async () => {
        try {
            setIsLoading(true);  // Start loading
            const formdata = new FormData();
            formdata.append('date', report_date);
            formdata.append('username', username);
            console.log(`${username}, ${report_date}`);
            const response = await fetch(`${config.API_BASE_URL}/report_content/`, {
                method: 'POST',
                body: formdata,
            });

            const data = await response.json();
            if (response.ok) {
                console.log('data:', data.report_list);
                setreport(data.report_list); // Use empty object as fallback
                console.log('file:', report[0]?.file );
                console.log('uploaded_at:', report[0]?.uploaded_at );
            }
            } catch (error) {
            console.error('Error fetching dashboard data:', error);
            } finally {
            setIsLoading(false); // End loading
            }
        };



  /* useFocusEffect(
    React.useCallback(() => {
      fetchRankingData();
      const interval = setInterval(() => {
        fetchRankingData();
      }, 1000);
      return () => clearInterval(interval);
    }, [])
  ); */

     //const rows = [
     // { ranking: 1, uuid: 'f4bb116b-00d2-4b1f-9c01-e203ad5ea3e1', name: 'fkw_hk', score: 9320 },
    //  { ranking: 2, uuid: '7f458f44-85bf-4984-8bd3-4077bb3e33dc', name: 'Jay1n', score: 8292 },
    //  { ranking: 3, uuid: 'fc48833b-366c-4357-82fc-5d3d16ca8b1a', name: 'eliseqwq', score: 7812 },
   // ];


   /* const fetchRankingData = async () => {
     const checkUsername = async () => {
      const usernametitle = await AsyncStorage.getItem('content');
      setUsertitle(usernametitle);
    };
  }; */

  return (
    <ImageBackground 
      source={require('../../assets/main_page_background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <View style={{ borderWidth: 1 }}>
            {/* Table Header */}
            <View style={{ flexDirection: 'row', backgroundColor: '#eee' }}>
              <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ flex: 1, padding: 8, fontWeight: 'bold', width: '100%', textAlign: 'center', fontSize: 20 }}>個人舉報記錄</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', backgroundColor: '#eee' }}>
              <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ flex: 1, padding: 8, fontWeight: 'bold', width: '100%', textAlign: 'left', fontSize: 16 }}>作者: {report[0]?.username}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', backgroundColor: '#eee' }}>
              <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ flex: 1, padding: 8, fontWeight: 'bold', width: '100%', textAlign: 'left', fontSize: 16 }}>創建日期: {report[0]?.uploaded_at}</Text>
              </View>
            </View>
            {/* Table Rows */}
              <View style={{ minHeight: 40, flexDirection: 'row', borderTopWidth: 2, borderColor: '#ccc', alignItems: 'center', backgroundColor: 'white', height:'100%'}}>
                {report.length > 0 && report[0]?.file ? (
                    isImage ? (
                      <View>
                      <Image source={{ uri: report[0]?.file }} style={{width: 320, height: 180, resizeMode: 'contain'}} />
                      </View>
                    ) : isMp4 ? (
                      <Video source={{ uri: report[0]?.file }} style={{width: 320, height: 180}} controls={true} resizeMode="contain" />
                    ) : (
                      <Text style={{ padding: 16 }}>不支援的影片格式</Text>
                    )
                  ) : (
                    <Text style={{ padding: 16 }}>沒有檔案</Text>
                  )}
              </View>
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