/*
References:
For setting up the environment, Andriod Studio(for emulator), react-native cli, and running the app on the emulator:
https://www.youtube.com/watch?v=8ejuHsaXiwU
https://reactnative.dev/docs/environment-setup
How to use react-native:
https://reactnative.dev/docs/tutorial
*/

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Switch,
  Image,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Import navigation hook
import { RootStackParamList } from './types'; // Import the type for navigation routes
import DatePicker from 'react-native-date-picker'; // Import DatePicker

const { width, height } = Dimensions.get('window');

// Image sources
const images = {
  alarmBackground: require('./assets/AlarmBackground.png'),
  addAlarmIcon: require('./assets/add-alarm.png'),
  settingsIcon: require('./assets/DailyAlarm_SettingsIcon.png'),
  bottomBarHome: require('./assets/BottomBar_Home.png'),
  bottomBarStats: require('./assets/BottomBar_Stats.png'),
  bottomBarAssistant: require('./assets/BottomBar_Assistant.png'),
  bottomBarAlarm: require('./assets/BottomBar_Alarm.png'),
};

const Alarm = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Initialize navigation with typed routes

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [alarmToDelete, setAlarmToDelete] = useState<number | null>(null);

  // List of alarms
  var [alarms, setAlarms] = useState([
    { id: 1, name: 'Alarm 1', time: '11:20', morningNight: 'am', duration: '16H and 18Min', enabled: false },
  ]);

  // Function to toggle alarm
  const toggleAlarm = (id: number) => {
    setAlarms((prevAlarms) => {
      const updatedAlarms = prevAlarms.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      );
      return [...updatedAlarms].sort((a, b) => {
        if (a.morningNight !== b.morningNight) {
          return a.morningNight === 'am' ? -1 : 1;
        }
        const [aHours, aMinutes] = a.time.split(':').map(Number);
        const [bHours, bMinutes] = b.time.split(':').map(Number);
        return aHours !== bHours ? aHours - bHours : aMinutes - bMinutes;
      });
    });
  };

  const addAlarm = (time: string, morningNight: string) => {
    const newAlarm = {
      id: alarms.length + 1,
      name: `Alarm ${alarms.length + 1}`,
      time: time,
      morningNight: morningNight,
      duration: '0H and 0Min',
      enabled: false,
    };
    setAlarms([...alarms, newAlarm].sort((a, b) => {
      if (a.morningNight !== b.morningNight) {
        return a.morningNight === 'am' ? -1 : 1;
      }
      const [aHours, aMinutes] = a.time.split(':').map(Number);
      const [bHours, bMinutes] = b.time.split(':').map(Number);
      return aHours !== bHours ? aHours - bHours : aMinutes - bMinutes;
    }));
  }; 

  const handleDeleteAlarm = () => {
    if (alarmToDelete !== null) {
      setAlarms((prevAlarms) => prevAlarms.filter(alarm => alarm.id !== alarmToDelete));
      setAlarmToDelete(null);
      setDeleteModalVisible(false);
    }
  };

  // Helper to calculate duration until alarm
  const getDurationUntilAlarm = (alarmTime: string, morningNight: string) => {
    const now = new Date();

    // Parse alarm time
    let [alarmHour, alarmMinute] = alarmTime.split(':').map(Number);
    if (morningNight === 'pm' && alarmHour !== 12) alarmHour += 12;
    if (morningNight === 'am' && alarmHour === 12) alarmHour = 0;

    // Create a Date for the next alarm
    const alarmDate = new Date(now);
    alarmDate.setHours(alarmHour, alarmMinute, 0, 0);

    // If alarm time has already passed today, set for tomorrow
    if (alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }

    const diffMs = alarmDate.getTime() - now.getTime();
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffM = Math.floor((diffMs / (1000 * 60)) % 60);

    return `${diffH}H and ${diffM}Min`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={images.alarmBackground}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={styles.innerContainer}>
          <StatusBar barStyle="light-content" />

          {/* Header section */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text>
                <Text style={styles.title}>Your Alarms  </Text>
                <TouchableOpacity onPress={() => setOpen(true)}>
                  <Image
                    style={styles.toolSettingsIcon}
                    source={images.addAlarmIcon}
                  />
                </TouchableOpacity>
              </Text>
              <Text style={styles.titleDescription}>Set Custom Alarms</Text>
            </View>
          </View>

          {/* Date Picker */}
          <DatePicker
            modal
            open={open}
            date={date}
            mode="time"
            onConfirm={(selectedDate) => {
              setOpen(false);
              setDate(selectedDate);
              const hours = selectedDate.getHours() % 12 || 12;
              const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
              addAlarm(
                `${hours}:${minutes}`,
                selectedDate.getHours() >= 12 ? 'pm' : 'am'
              );
              console.log('Selected time:', selectedDate);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />

          {/* Alarm List */}
          <ScrollView style={styles.toolsContainer}>
            {alarms.map((alarm) => (
              <View
                key={alarm.id}
                style={[
                  styles.alarmCard,
                  { backgroundColor: alarm.enabled ? 'rgba(34, 122, 177, 0.3)' : 'rgba(107, 138, 158, 0.3)' }, // Dynamic background color
                ]}
              >
                <View style={styles.toolRowContainer}>
                  {/* Left Side */}
                  <View style={styles.toolTitleContainer}>
                    <Text>
                      <Text style={styles.toolTitle}>{alarm.time}</Text>
                      <Text style={[styles.toolTitle, { fontSize: 22 }]}>
                        {' ' + alarm.morningNight}
                      </Text>
                    </Text>
                    <Text style={styles.toolTime}>
                      {alarm.enabled
                        ? getDurationUntilAlarm(alarm.time, alarm.morningNight)
                        : '--'}
                    </Text>
                  </View>

                  {/* Right Side */}
                  <View style={styles.toolRowContainer}>
                    <TouchableOpacity
                      style={styles.toolSettingsWrapper}
                      onPress={() => {
                        setAlarmToDelete(alarm.id);
                        setDeleteModalVisible(true);
                      }}
                    >
                      <Image
                        style={styles.toolSettingsIcon}
                        source={images.settingsIcon}
                      />
                    </TouchableOpacity>

                    <View style={styles.toolSwitchWrapper}>
                      <Switch
                        value={alarm.enabled}
                        onValueChange={() => toggleAlarm(alarm.id)}
                        trackColor={{ false: '#3e3e3e', true: '#50D890' }}
                        thumbColor="#fff"
                        style={styles.switch}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Delete Confirmation Modal */}
          {deleteModalVisible && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: 24,
                  alignItems: 'center',
                  width: '80%',
                }}
              >
                <Text style={{ fontSize: 18, marginBottom: 16, color: '#222' }}>
                  Delete this alarm?
                </Text>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#e74c3c',
                      paddingVertical: 10,
                      paddingHorizontal: 24,
                      borderRadius: 8,
                      marginRight: 8,
                    }}
                    onPress={handleDeleteAlarm}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#aaa',
                      paddingVertical: 10,
                      paddingHorizontal: 24,
                      borderRadius: 8,
                    }}
                    onPress={() => {
                      setDeleteModalVisible(false);
                      setAlarmToDelete(null);
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
              <Image source={images.bottomBarHome} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Analytics')}>
              <Image source={images.bottomBarStats} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Assistant')}>
              <Image source={images.bottomBarAssistant} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navSelectedItem} onPress={() => navigation.navigate('Alarm')}>
              <Image source={images.bottomBarAlarm} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(22, 19, 89, 1)',
    padding: 0,
  },

  innerContainer: {
    flex: 1,
    padding: 20,
  },

  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: height * 0.02,
  },

  headerContent: {
    flex: 1,
  },

  titleDescription: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 16,
  },

  toolTitleContainer: {
    marginTop: 5,
    marginBottom: 5,
  },

  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

  alarmCard: {
    backgroundColor: 'rgba(11, 97, 150, 0.4)',
    borderRadius: 16,
    padding: height * 0.02,
    marginBottom: height * 0.02,
    width: '100%',
  },

  toolsContainer: {
    flexDirection: 'column',
    marginBottom: height * 0.02,
  },

  toolRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },

  toolSettingsWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
  },

  toolSwitchWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },

  toolSettingsIcon: {
    borderRadius: 20,
    opacity: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },

  toolTitle: {
    color: 'white',
    fontSize: 36,
    width: '75%',
    fontWeight: 'bold',
  },

  toolTime: {
    color: 'rgba(255,255,255, 0.4)',
    fontSize: 16,
    width: '100%',
    marginBottom: 12,
  },

  switch: {
    opacity: 0.95,
    alignSelf: 'flex-end',
    transform: [{ scaleX: 2 }, { scaleY: 2 }],
    marginRight: width * 0.1,
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(38, 32, 153, 0.5)',
    borderRadius: 16,
    padding: height * 0.02,
    marginTop: 'auto',
  },

  navItem: {
    opacity: 0.5,
  },

  navSelectedItem: {
    opacity: 1,
  },
});

export default Alarm;