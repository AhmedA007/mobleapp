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
  Modal,
  Platform,
  Button,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native'; 
import { RootStackParamList } from './types'; 
import SoundPlayer from 'react-native-sound-player'; 
import { createStackNavigator } from '@react-navigation/stack'; 

// Get device width and height for responsive design
const { width, height } = Dimensions.get('window');

// Image assets used in the app
const images = {
  homeBackground: require('./assets/HomeBackground.png'),
  bedIcon: require('./assets/DailyAlarm_BedIcon.png'),
  alarmIcon: require('./assets/DailyAlarm_AlarmIcon.png'),
  settingsIcon: require('./assets/DailyAlarm_SettingsIcon.png'),
  capybaraImage: require('./assets/CapybaraImage.png'),
  bottomBarHome: require('./assets/BottomBar_Home.png'),
  bottomBarStats: require('./assets/BottomBar_Stats.png'),
  bottomBarAssistant: require('./assets/BottomBar_Assistant.png'),
  bottomBarAlarm: require('./assets/BottomBar_Alarm.png'),
};

// Types for days and alarm/bed times
type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
type TimeType = 'bed' | 'alarm';
type Times = Record<DayOfWeek, { bed: string; alarm: string }>;

// Default times for each day
const defaultTimes: Times = {
  Mon: { bed: '22:00', alarm: '06:30' },
  Tue: { bed: '22:00', alarm: '06:30' },
  Wed: { bed: '22:00', alarm: '06:30' },
  Thu: { bed: '22:00', alarm: '06:30' },
  Fri: { bed: '23:00', alarm: '07:30' },
  Sat: { bed: '23:30', alarm: '08:30' },
  Sun: { bed: '22:30', alarm: '07:00' },
};

// Main App component
const App = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // State for switches and time pickers
  const [bedTimeEnabled, setBedTimeEnabled] = useState(true);
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false); 
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Mon');
  const [times, setTimes] = useState<Times>(defaultTimes);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingType, setEditingType] = useState<TimeType | null>(null);

  // Days of the week for calendar UI
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Play or stop relaxing sleep music
  const handlePlayPause = () => {
    if (isPlaying) {
      SoundPlayer.stop();
      setIsPlaying(false);
    } else {
      try {
        SoundPlayer.playSoundFile('sleepingmusic', 'mp3');
        setIsPlaying(true);
      } catch (e) {
        console.log('Cannot play the sound file', e);
      }
    }
  };

  // Open modal to edit bed/alarm time
  const openEditModal = (type: 'bed' | 'alarm') => {
    setEditingType(type);
    setModalVisible(true);
  };

  // Update time for selected day and type
  const handleTimeChange = (newTime: string) => {
    setTimes(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [editingType!]: newTime,
      },
    }));
    setModalVisible(false);
    setEditingType(null);
  };

  // Modal for picking time
  const renderTimePicker = () => (
    <Modal
      transparent
      visible={modalVisible}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={{
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
      }}>
        <View style={{
          backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center'
        }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Set {editingType === 'bed' ? 'Bed Time' : 'Alarm Time'} for {selectedDay}
          </Text>
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            {['21:00','22:00','22:30','23:00','23:30','00:00','06:00','06:30','07:00','07:30','08:00','08:30'].map(t => (
              <TouchableOpacity key={t} onPress={() => handleTimeChange(t)} style={{ margin: 4 }}>
                <Text style={{ color: '#222', padding: 6, backgroundColor: '#eee', borderRadius: 4 }}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );

  // Main UI rendering
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={images.homeBackground}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={styles.innerContainer}>
          <StatusBar barStyle="light-content" />

          {/* Header section */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerName}>Hunter,</Text>
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>Good Morning</Text>
                <Text style={styles.sunEmoji}>🌞</Text>
              </View>
            </View>
          </View>

          {/* Sleeping Music Card */}
          <View style={styles.sleepingMusicCard}>
            <Text style={styles.musicCardTitle}>Relaxing Sleep Music</Text>
            <Text style={styles.musicCardSubtitle}>
              Play soothing music to help you sleep better.
            </Text>
            <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
              <Text style={styles.playButtonText}>
                {isPlaying ? 'Stop' : 'Play'}
              </Text>
            </TouchableOpacity>
            {isPlaying && (
              <Text style={{ color: 'white', marginTop: 10 }}>Playing...</Text>
            )}
          </View>

          {/* Sleep Calendar Section */}
          <Text style={styles.calendarTitle}>Your Sleep Calendar</Text>
          <View style={styles.calendar}>
            {daysOfWeek.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={styles.calendarColumn}
                onPress={() => setSelectedDay(day as DayOfWeek)}
              >
                <View
                  style={[
                    styles.dateCircle,
                    day === selectedDay ? styles.activeDateCircle : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      day === selectedDay ? styles.activeDateText : null,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sleep Tools Section */}
          <View style={styles.toolsContainer}>
            {/* Bed Time Card */}
            <View style={styles.toolCard}>
              <View style={styles.toolHeader}>
                <Image
                  style={styles.toolIconContainer}
                  source={images.bedIcon}
                />
                <TouchableOpacity onPress={() => openEditModal('bed')}>
                  <Image
                    style={styles.toolSettingsIcon}
                    source={images.settingsIcon}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.toolTitle}>Bed time</Text>
              <Text style={styles.toolTime}>
                {times[selectedDay].bed}
              </Text>
              <Switch
                value={bedTimeEnabled}
                onValueChange={setBedTimeEnabled}
                trackColor={{ false: '#3e3e3e', true: '#50D890' }}
                thumbColor="#fff"
                style={styles.switch}
              />
            </View>

            {/* Alarm Card */}
            <View style={styles.toolCard}>
              <View style={styles.toolHeader}>
                <Image
                  style={styles.toolIconContainer}
                  source={images.alarmIcon}
                />
                <TouchableOpacity onPress={() => openEditModal('alarm')}>
                  <Image
                    style={styles.toolSettingsIcon}
                    source={images.settingsIcon}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.toolTitle}>Alarm</Text>
              <Text style={styles.toolTime}>
                {times[selectedDay].alarm}
              </Text>
              <Switch
                value={alarmEnabled}
                onValueChange={setAlarmEnabled}
                trackColor={{ false: '#3e3e3e', true: '#50D890' }}
                thumbColor="#fff"
                style={styles.switch}
              />
            </View>
          </View>

          {renderTimePicker()}

          {/* Sleep Problem Card */}
          <View style={styles.problemCard}>
            <View>
              <Text style={styles.problemQuestion}>Have a problem</Text>
              <Text style={styles.problemTitle}>Sleeping?</Text>
              <TouchableOpacity
                style={styles.assistantButton}
                onPress={() => navigation.navigate('Assistant')} // Navigate to Assistant
              >
                <Text style={styles.assistantButtonText}>
                  Go to Assistant
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sleepImageContainer}>
              <Image
                source={images.capybaraImage}
                style={styles.sleepImage}
              />
            </View>
          </View>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity
              style={styles.navSelectedItem}
              onPress={() => navigation.navigate('Home')} // Navigate to App.tsx
            >
              <Image source={images.bottomBarHome} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigation.navigate('Analytics')} // Navigate to Analytics.tsx
            >
              <Image source={images.bottomBarStats} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigation.navigate('Assistant')} // Navigate to Assistant.tsx
            >
              <Image source={images.bottomBarAssistant} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigation.navigate('Alarm')} // Navigate to Alarm.tsx
            >
              <Image source={images.bottomBarAlarm} />
            </TouchableOpacity>
          </View>
          
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

// Stack navigator for the app
const AppNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide default header
      }}
    >
      <Stack.Screen name="HomeScreen" component={App} />
      {}
    </Stack.Navigator>
  );
};

// Styles for the app, using device dimensions for responsiveness
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(22, 19, 89, 1)',
    padding: 0,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05, 
    paddingTop: height * 0.04,       
    paddingBottom: height * 0.18,    
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: height * 0.015, 
  },
  headerContent: {
    flex: 1,
  },
  headerName: {
    color: '#AAAACC',
    fontSize: width * 0.04,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    color: 'white',
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  sunEmoji: {
    fontSize: width * 0.055,
    marginLeft: width * 0.02,
  },
  calendarTitle: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: height * 0.012,
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
  },
  calendarColumn: {
    alignItems: 'center',
  },
  dayText: {
    color: '#AAA',
    marginBottom: height * 0.005,
    fontSize: width * 0.035,
  },
  dateCircle: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: width * 0.055,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDateCircle: {
    backgroundColor: 'white',
  },
  activeDateText: {
    color: '#1E1F38',
    fontWeight: 'bold',
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
  },
  toolCard: {
    backgroundColor: 'rgba(11, 97, 150, 0.4)',
    borderRadius: 16,
    padding: width * 0.04,
    width: '48%',
    minHeight: height * 0.18,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.008,
  },
  toolIconContainer: {
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: width * 0.045,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolSettingsIcon: {
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: width * 0.035,
    opacity: 0.75,
    top: 10,
    right: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTitle: {
    color: 'white',
    fontSize: width * 0.05,
    width: '75%',
    fontWeight: 'bold',
  },
  toolTime: {
    color: '#FFF',
    opacity: 0.4,
    fontSize: width * 0.04,
    width: '75%',
    marginBottom: height * 0.01,
  },
  switch: {
    opacity: 0.95,
    alignSelf: 'flex-start',
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    marginBottom: height * 0.01,
  },
  sleepingMusicCard: {
    backgroundColor: 'rgba(11, 97, 150, 0.7)',
    borderRadius: 16,
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.015,
    alignItems: 'center',
  },
  musicCardTitle: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  musicCardSubtitle: {
    color: 'white',
    fontSize: width * 0.035,
    textAlign: 'center',
    marginBottom: height * 0.015,
  },
  playButton: {
    backgroundColor: 'rgba(4, 217, 143, 0.75)',
    borderRadius: 8,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.08,
  },
  playButtonText: {
    fontSize: width * 0.045,
    color: 'white',
    fontWeight: 'bold',
  },
  problemCard: {
    backgroundColor: 'rgba(5, 161, 132, 0.4)',
    borderRadius: 16,
    padding: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
  },
  problemQuestion: {
    color: '#FFF',
    opacity: 0.4,
    fontSize: width * 0.04,
    marginBottom: -height * 0.005,
  },
  problemTitle: {
    color: 'white',
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  assistantButton: {
    backgroundColor: 'rgba(4, 217, 143, 0.75)',
    borderRadius: 8,
    paddingVertical: height * 0.01,
    opacity: 0.95,
    paddingHorizontal: width * 0.06,
    alignSelf: 'flex-start',
  },
  assistantButtonText: {
    fontSize: width * 0.04,
    color: 'white',
    fontWeight: 'bold',
  },
  sleepImageContainer: {
    justifyContent: 'center',
  },
  sleepImage: {
    width: width * 0.4,
    height: height * 0.15,
    resizeMode: 'contain',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(38, 32, 153, 0.5)',
    borderRadius: 16,
    padding: height * 0.015,
    position: 'absolute',
    bottom: height * 0.02,
    alignSelf: 'center', 
    width: width * 0.92,
  },
  navItem: {
    opacity: 0.5,
    flex: 1, 
    alignItems: 'center',
  },
  navSelectedItem: {
    opacity: 1,
    flex: 1,
    alignItems: 'center',
  },
});

export default AppNavigator;