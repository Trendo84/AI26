import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { AIService } from '../services/ai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const QUICK_QUESTIONS = [
  'How do I know if my cat is healthy?',
  'What should I feed my cat?',
  'Why does my cat knead?',
  'How often should I groom my cat?',
];

export default function ChatScreen() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Meow! I'm Bruce, your personal cat companion. I've been a British Shorthair for quite some time now, and I know a thing or two about feline life. Ask me anything about cat care, behavior, health, or just chat about your whiskers. I'm here to help! 🐾",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiService, setAiService] = useState<AIService | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initializeAI();
  }, []);

  const initializeAI = async () => {
    try {
      const apiKey = await AsyncStorage.getItem('ai_api_key');
      if (apiKey) {
        const service = new AIService({
          provider: 'openrouter',
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          apiKey,
        });
        setAiService(service);
      }
    } catch (error) {
      console.log('Error initializing AI:', error);
    }
  };

  const sendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      let response: string;

      // Try quick response first
      if (aiService) {
        const quickResponse = aiService.getQuickResponse(text);
        if (quickResponse) {
          response = quickResponse;
        } else {
          // Use AI service
          const conversationHistory = messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          }));
          response = await aiService.chat(text, conversationHistory);
        }
      } else {
        // Fallback to quick responses only
        const service = new AIService({
          provider: 'openrouter',
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          apiKey: 'dummy',
        });
        response = service.getQuickResponse(text) || 
          "I'd love to help! To use my full AI capabilities, please add your OpenRouter API key in Settings. For now, try asking about feeding, kneading, sleeping, or water!";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Hmm, I seem to be having trouble connecting. Please check your API key in Settings or try again later!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          <View style={styles.bruceIntro}>
            <View style={[styles.bruceAvatar, { backgroundColor: theme.accent }]}>
              <Text style={styles.bruceAvatarEmoji}>🐱</Text>
            </View>
            <View>
              <Text style={[styles.bruceName, { color: theme.colorScheme === 'dark' ? theme.text : '#FFFFFF' }]}>
                Bruce
              </Text>
              <Text style={[styles.bruceSubtitle, { color: theme.colorScheme === 'dark' ? theme.textSecondary : 'rgba(255,255,255,0.7)' }]}>
                Your British Shorthair AI Assistant
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickQuestions}
            contentContainerStyle={styles.quickQuestionsContent}
          >
            {QUICK_QUESTIONS.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickQuestion, { borderColor: theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.3)' }]}
                onPress={() => handleQuickQuestion(question)}
              >
                <Text style={[styles.quickQuestionText, { color: theme.colorScheme === 'dark' ? theme.text : '#FFFFFF' }]}>
                  {question.split('?')[0]}?
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageRow,
                message.role === 'user' && styles.messageRowUser,
              ]}
            >
              <View style={[
                styles.messageAvatar,
                { backgroundColor: message.role === 'user' ? '#007AFF' : theme.accent }
              ]}>
                <Text style={styles.messageAvatarText}>
                  {message.role === 'user' ? '👤' : '🐱'}
                </Text>
              </View>
              <View
                style={[
                  styles.messageBubble,
                  {
                    backgroundColor: message.role === 'user' ? '#007AFF' : theme.card,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    {
                      color: message.role === 'user' ? '#FFFFFF' : theme.text,
                    },
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            </View>
          ))}

          {isLoading && (
            <View style={styles.messageRow}>
              <View style={[styles.messageAvatar, { backgroundColor: theme.accent }]}>
                <Text style={styles.messageAvatarText}>🐱</Text>
              </View>
              <View style={[styles.messageBubble, { backgroundColor: theme.card }]}>
                <ActivityIndicator color={theme.accent} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.inputContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
              placeholder="Ask Bruce anything..."
              placeholderTextColor={theme.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: inputText.trim() ? theme.accent : theme.border }]}
              onPress={() => sendMessage()}
              disabled={!inputText.trim() || isLoading}
            >
              <Text style={styles.sendButtonText}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  bruceIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 16,
  },
  bruceAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bruceAvatarEmoji: {
    fontSize: 32,
  },
  bruceName: {
    fontSize: 24,
    fontWeight: '700',
  },
  bruceSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  quickQuestions: {
    marginTop: 8,
  },
  quickQuestionsContent: {
    gap: 8,
    paddingRight: 20,
  },
  quickQuestion: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickQuestionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  messagesContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  messageRow: {
    flexDirection: 'row',
    gap: 10,
    maxWidth: '80%',
  },
  messageRowUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageAvatarText: {
    fontSize: 18,
  },
  messageBubble: {
    flex: 1,
    padding: 12,
    borderRadius: 18,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  inputContainer: {
    padding: 12,
    paddingBottom: 20,
    borderTopWidth: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
});
