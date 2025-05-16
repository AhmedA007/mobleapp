// Reference: https://platform.openai.com/docs/api-reference/ 

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions, ImageBackground } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native'; 
import { RootStackParamList } from './types';
import axios from "axios";

// Image assets used in the assistant page
const images = {
  assistantBackground: require('./assets/AssistantBackground.png'),
  bottomBarHome: require('./assets/BottomBar_Home.png'),
  bottomBarStats: require('./assets/BottomBar_Stats.png'),
  bottomBarAssistant: require('./assets/BottomBar_Assistant.png'),
  bottomBarAlarm: require('./assets/BottomBar_Alarm.png'),
  sendIcon: require('./assets/sendIcon.png'),
};

const MAX_MESSAGES = 20; // Limit the number of messages in the chat

// Get device width and height for responsive design
const { width, height } = Dimensions.get('window');

// Main AI Chat component
const AIChat = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // State for chat messages, input, and loading status
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you rise with ease?", sender: "bot" },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to send a message to the AI assistant
  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    // Prevent sending more than MAX_MESSAGES
    if (messages.length >= MAX_MESSAGES) {
      const limitMessage = {
        id: messages.length + 1,
        text: "You have reached the maximum number of messages allowed. Please try again later.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, limitMessage]);
      return;
    }

    // Add user's message to chat
    const userMessage = { id: messages.length + 1, text: inputText, sender: "user" };
    setMessages([...messages, userMessage]);
    setInputText("");

    setLoading(true); // Show loading indicator
    try {
      // Make API call to OpenAI
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", 
              content: "You are a sleep wellness AI assistant for the app RiseEase. Your tasks are: 1. Provide concise and summarized responses. 2. Focus on improving the user's sleeping habits. 3. Avoid overly technical language and keep responses user-friendly and personable 4. Offer actionable advice when possible." 
            },
            ...messages.map((msg) => ({
              role: msg.sender === "bot" ? "assistant" : "user",
              content: msg.text,
            })),
            { role: "user", content: inputText },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: /*apikey*/'', 
          },
        }
      );

      // Add AI's response to chat
      const botMessage = {
        id: messages.length + 2,
        text: response.data.choices[0].message.content,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      // Handle API errors
      console.error("Error communicating with ChatGPT API:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, something went wrong. Please try again later.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <ImageBackground
      source={images.assistantBackground}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <View style={styles.innerContainer}>
        {/* Page Title */}
        <Text style={styles.title}>AI Assistant</Text>

        {/* Chat Messages */}
        <ScrollView style={styles.messageContainer} showsVerticalScrollIndicator={false}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageWrapper,
                msg.sender === "bot" ? styles.botMessage : styles.userMessage,
              ]}
            >
              {/* Show avatar for bot messages */}
              {msg.sender === "bot" && (
                <Image
                  source={require("./assets/bot-avatar.png")} 
                  style={styles.avatar}
                />
              )}
              <View
                style={{
                  borderRadius: 16,
                  padding: 12,
                  flexShrink: 1,
                  backgroundColor: msg.sender === "bot" ? "rgba(4, 217, 143, 0.25)" : "rgba(184, 184, 184, 0.25)", 
                }}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            </View>
          ))}
          {/* Show loading message while waiting for AI response */}
          {loading && (
            <View style={[styles.messageWrapper, styles.botMessage]}>
              <Image
                source={require("./assets/bot-avatar.png")} 
                style={styles.avatar}
              />
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input area for user to type messages */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Message your AI sleep assistant"
            placeholderTextColor="#ccc"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Image source={images.sendIcon} style={{ width: height*0.023, height: height*0.02 }}/>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Image source={images.bottomBarHome} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Image source={images.bottomBarStats} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navSelectedItem}
            onPress={() => navigation.navigate('Assistant')}
          >
            <Image source={images.bottomBarAssistant} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Alarm')}
          >
            <Image source={images.bottomBarAlarm} />
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: 'rgba(22, 19, 89, 1)',
    justifyContent: 'center',
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 16,
  },
  messageContainer: {
    flex: 1,
    marginBottom: height * 0.02,
  },
  messageWrapper: {
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "flex-start", 
    maxWidth: "80%", 
  },
  botMessage: {
    alignSelf: "flex-start", 
  },
  userMessage: {
    alignSelf: "flex-end", 
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: "rgba(4, 217, 143, 0.25)", 
    flexShrink: 1, 
  },
  messageText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8, 
    marginTop: 0, 
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(202, 202, 202, 0.2)',
    borderRadius: 16,
    paddingVertical: height * 0.01, 
    paddingHorizontal: height * 0.02, 
    marginBottom: height * 0.02, 
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: height*0.01,
  },
  sendButton: {
    padding: 8,
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(38, 32, 153, 0.5)',
    borderRadius: 16,
    padding: height * 0.02,
    alignSelf: 'center', // Center horizontally
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

export default AIChat;
