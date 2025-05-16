import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './types';

// Main Sleep Analytics component
const SleepAnalytics = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // State for sleep metrics
  const [metrics, setMetrics] = useState({
    totalSleepTime: 0,
    sleepOnsetLatency: 0,
    wakeAfterSleepOnset: 0,
    numberOfAwakenings: 0,
  });

  // State for tracking if sleep is being recorded
  const [tracking, setTracking] = useState(false);
  const [sleepStart, setSleepStart] = useState<Date | null>(null);

  // Start sleep tracking: reset metrics and record start time
  const startTracking = () => {
    setTracking(true);
    setSleepStart(new Date());
    setMetrics({
      totalSleepTime: 0,
      sleepOnsetLatency: 0,
      wakeAfterSleepOnset: 0,
      numberOfAwakenings: 0,
    });
  };

  // Stop sleep tracking: calculate metrics based on time elapsed
  const stopTracking = () => {
    if (sleepStart) {
      const sleepEnd = new Date();
      const diffMs = sleepEnd.getTime() - sleepStart.getTime();
      const totalSleepTime = diffMs / (1000 * 60); // in minutes

      // Simulate other metrics for demo purposes
      const sleepOnsetLatency = Math.random() * 20 + 5; // 5-25 mins
      const wakeAfterSleepOnset = Math.random() * 15 + 2; // 2-17 mins
      const numberOfAwakenings = Math.floor(Math.random() * 3); // 0-2

      setMetrics({
        totalSleepTime,
        sleepOnsetLatency,
        wakeAfterSleepOnset,
        numberOfAwakenings,
      });
    }
    setTracking(false);
    setSleepStart(null);
  };

  // Render the analytics UI
  return (
    <LinearGradient colors={["#1E293B", "#0F172A"]} style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Page Title */}
          <Text style={styles.title}>Sleep Analytics</Text>
          <Text style={styles.subtitle}>Based on our data</Text>

          {/* Core Sleep Metrics Section */}
          <Text style={styles.sectionTitle}>Core Sleep Metrics</Text>
          <View style={styles.metricsContainer}>
            {/* Sleep Onset Latency */}
            <View style={styles.metricCard}>
              <Image source={require('./assets/sleepIcon.png')} style={styles.metricIcon} />
              <Text style={styles.metricTitle}>Sleep Onset Latency</Text>
              <Text style={styles.metricValue}>{metrics.sleepOnsetLatency.toFixed(2)} mins</Text>
            </View>
            {/* Wake After Sleep Onset */}
            <View style={styles.metricCard}>
              <Image source={require('./assets/wakeIcon.png')} style={styles.metricIcon} />
              <Text style={styles.metricTitle}>Wake After Sleep Onset</Text>
              <Text style={styles.metricValue}>{metrics.wakeAfterSleepOnset.toFixed(2)} mins</Text>
            </View>
            {/* Number of Awakenings */}
            <View style={styles.metricCard}>
              <Image source={require('./assets/awakeIcon.png')} style={styles.metricIcon} />
              <Text style={styles.metricTitle}>Number of Awakenings</Text>
              <Text style={styles.metricValue}>{metrics.numberOfAwakenings}</Text>
            </View>
            {/* Total Sleep Time */}
            <View style={styles.metricCard}>
              <Image source={require('./assets/sleepIcon.png')} style={styles.metricIcon} />
              <Text style={styles.metricTitle}>Total Sleep Time</Text>
              <Text style={styles.metricValue}>{metrics.totalSleepTime.toFixed(2)} mins</Text>
            </View>
          </View>

          {/* Start/Stop Tracking Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.customButton, tracking && styles.disabledButton]}
              onPress={startTracking}
              disabled={tracking}
            >
              <Text style={styles.buttonText}>Start Sleep</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.customButton, !tracking && styles.disabledButton]}
              onPress={stopTracking}
              disabled={!tracking}
            >
              <Text style={styles.buttonText}>Stop Sleep</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Image source={require('./assets/BottomBar_Home.png')} />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navSelectedItem}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Image source={require('./assets/BottomBar_Stats.png')} />
            <Text style={styles.navLabel}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Assistant')}
          >
            <Image source={require('./assets/BottomBar_Assistant.png')} />
            <Text style={styles.navLabel}>Assistant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Alarm')}
          >
            <Image source={require('./assets/BottomBar_Alarm.png')} />
            <Text style={styles.navLabel}>Alarm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1, 
    justifyContent: "space-between", 
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, 
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricCard: {
    backgroundColor: "#334155",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  metricIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  metricTitle: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  metricValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  customButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  disabledButton: {
    backgroundColor: "#6B7280",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(38, 32, 153, 0.5)",
    borderRadius: 16,
    paddingVertical: Dimensions.get("window").height * 0.02,
    paddingHorizontal: Dimensions.get("window").width * 0.05,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: {
    opacity: 0.5,
    flex: 1,
    alignItems: "center",
  },
  navSelectedItem: {
    opacity: 1,
    flex: 1,
    alignItems: "center",
  },
  navLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
});

export default SleepAnalytics;