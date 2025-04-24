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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Import navigation hook
import { RootStackParamList } from './types'; // Import the type for navigation routes

// Width and height of the screen
const { width, height } = Dimensions.get('window');

// Image sources
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

const App = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Initialize navigation with typed routes

  // State for switches
  const [bedTimeEnabled, setBedTimeEnabled] = useState(true);
  const [alarmEnabled, setAlarmEnabled] = useState(true);

  // Days of the week for calendar
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dates = [21, 22, 23, 24, 25, 26, 27];
  
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

          {/* Notification Card */}
          <View style={styles.notificationCard}>
            <TouchableOpacity style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.notificationText}>
              You have slept <Text style={{ fontWeight: 'bold' }}>9h 13m</Text>
            </Text>
            <Text style={styles.notificationSubtext}>
              That is <Text style={{ fontWeight: 'bold' }}>above</Text> your{' '}
              <Text style={styles.underlinedText}>recommendation</Text>
            </Text>
          </View>

          {/* Sleep Calendar Section */}
          <Text style={styles.calendarTitle}>Your Sleep Calendar</Text>
          <View style={styles.calendar}>
            {daysOfWeek.map((day, index) => (
              <View key={index} style={styles.calendarColumn}>
                <Text style={styles.dayText}>{day}</Text>
                <View
                  style={[
                    styles.dateCircle,
                    dates[index] === 24 ? styles.activeDateCircle : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,
                      dates[index] === 24 ? styles.activeDateText : null,
                    ]}
                  >
                    {dates[index]}
                  </Text>
                </View>
              </View>
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
                <TouchableOpacity>
                  <Image
                    style={styles.toolSettingsIcon}
                    source={images.settingsIcon}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.toolTitle}>Bed time</Text>
              <Text style={styles.toolTime}>7H and 28Min</Text>
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
                <TouchableOpacity>
                  <Image
                    style={styles.toolSettingsIcon}
                    source={images.settingsIcon}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.toolTitle}>Alarm</Text>
              <Text style={styles.toolTime}>16H and 18Min</Text>
              <Switch
                value={alarmEnabled}
                onValueChange={setAlarmEnabled}
                trackColor={{ false: '#3e3e3e', true: '#50D890' }}
                thumbColor="#fff"
                style={styles.switch}
              />
            </View>
          </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(22, 19, 89, 1)',
    padding: 0,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: height * 0.1, // Add padding to avoid overlap with bottom navigation
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
  headerName: {
    color: '#AAAACC',
    fontSize: 16,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sunEmoji: {
    fontSize: 22,
    marginLeft: 8,
  },
  bellButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#807946',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCard: {
    backgroundColor: 'rgba(11, 97, 150, 0.7)',
    borderRadius: 16,
    padding: height * 0.06,
    marginBottom: height * 0.02,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: height * 0.01,
    right: height * 0.02,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
  },
  notificationText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  notificationSubtext: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  underlinedText: {
    textDecorationLine: 'underline',
  },
  calendarTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: height * 0.015,
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  calendarColumn: {
    alignItems: 'center',
  },
  dayText: {
    color: '#AAA',
    marginBottom: height * 0.008,
  },
  dateCircle: {
    width: height * 0.04,
    height: height * 0.04,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDateCircle: {
    backgroundColor: 'white',
  },
  dateText: {
    color: '#AAA',
  },
  activeDateText: {
    color: '#1E1F38',
    fontWeight: 'bold',
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  toolCard: {
    backgroundColor: 'rgba(11, 97, 150, 0.4)',
    borderRadius: 16,
    padding: height * 0.02,
    width: '48%',
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },
  toolIconContainer: {
    width: '25%',
    borderRadius: 20,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolSettingsIcon: {
    borderRadius: 20,
    opacity: 0.75,
    top: 10,
    right: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTitle: {
    color: 'white',
    fontSize: 24,
    width: '75%',
    fontWeight: 'bold',
  },
  toolTime: {
    color: '#FFF',
    opacity: 0.4,
    fontSize: 14,
    width: '75%',
    marginBottom: 12,
  },
  switch: {
    opacity: 0.95,
    alignSelf: 'flex-start',
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    marginBottom: 10,
  },
  problemCard: {
    backgroundColor: 'rgba(5, 161, 132, 0.4)',
    borderRadius: 16,
    padding: height * 0.025,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  problemQuestion: {
    color: '#FFF',
    opacity: 0.4,
    fontSize: 16,
    marginBottom: -height * 0.005,
  },
  problemTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  assistantButton: {
    backgroundColor: 'rgba(4, 217, 143, 0.75)',
    borderRadius: 8,
    paddingVertical: height * 0.008,
    opacity: 0.95,
    paddingHorizontal: width * 0.06,
    alignSelf: 'flex-start',
  },
  assistantButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  sleepImageContainer: {
    justifyContent: 'center',
  },
  sleepImage: {
    width: 160,
    height: 120,
    resizeMode: 'contain',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(38, 32, 153, 0.5)',
    borderRadius: 16,
    paddingVertical: height * 0.02, // Use relative height for padding
    paddingHorizontal: width * 0.05, // Use relative width for padding
    position: 'absolute', // Ensure it stays at the bottom
    bottom: 0, // Align to the bottom of the screen
    width: '100%', // Ensure it spans the full width of the screen
  },
  navItem: {
    opacity: 0.5,
    flex: 1, // Distribute space evenly among navigation items
    alignItems: 'center', // Center the content horizontally
  },
  navSelectedItem: {
    opacity: 1,
    flex: 1, // Distribute space evenly among navigation items
    alignItems: 'center', // Center the content horizontally
  },
});

export default App;