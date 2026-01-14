import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { themeNames, themeDisplayNames, ThemeName } from '../constants/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as ContextMenu from 'zeego/context-menu';

export default function SettingsScreen() {
  const { theme, themeName, setThemeName } = useTheme();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dailyFacts, setDailyFacts] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedApiKey = await AsyncStorage.getItem('ai_api_key');
      if (savedApiKey) setApiKey(savedApiKey);
      
      const savedNotifications = await AsyncStorage.getItem('notifications');
      if (savedNotifications) setNotifications(savedNotifications === 'true');
      
      const savedDailyFacts = await AsyncStorage.getItem('daily_facts');
      if (savedDailyFacts) setDailyFacts(savedDailyFacts === 'true');
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const handleThemeChange = async (newTheme: ThemeName) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setThemeName(newTheme);
  };

  const handleSaveApiKey = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await AsyncStorage.setItem('ai_api_key', apiKey);
      Alert.alert('Success', 'API key saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key');
    }
  };

  const handleNotificationsToggle = async (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications(value);
    await AsyncStorage.setItem('notifications', value.toString());
  };

  const handleDailyFactsToggle = async (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDailyFacts(value);
    await AsyncStorage.setItem('daily_facts', value.toString());
  };

  const openOpenRouterSignup = () => {
    Alert.alert(
      'Get API Key',
      'Visit openrouter.ai to create a free account and get your API key. OpenRouter provides access to multiple AI models including free options!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Website', onPress: () => console.log('Open openrouter.ai') },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.content}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Theme</Text>
          
          <View style={styles.themeGrid}>
            {themeNames.map((name) => (
              <ContextMenu.Root key={name}>
                <ContextMenu.Trigger>
                  <TouchableOpacity
                    style={[
                      styles.themeCard,
                      { backgroundColor: theme.card },
                      themeName === name && styles.themeCardSelected,
                    ]}
                    onPress={() => handleThemeChange(name)}
                  >
                    <View style={[styles.themePreview, { backgroundColor: theme.accent }]} />
                    <Text style={[styles.themeName, { color: theme.text }]}>
                      {themeDisplayNames[name]}
                    </Text>
                    {themeName === name && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                </ContextMenu.Trigger>
                
                <ContextMenu.Content>
                  <ContextMenu.Item key="preview" onSelect={() => handleThemeChange(name)}>
                    <ContextMenu.ItemTitle>Preview {themeDisplayNames[name]}</ContextMenu.ItemTitle>
                    <ContextMenu.ItemIcon ios={{ name: 'eye' }} />
                  </ContextMenu.Item>
                </ContextMenu.Content>
              </ContextMenu.Root>
            ))}
          </View>
        </View>

        {/* AI Configuration Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>AI Configuration</Text>
          <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
            Configure your AI provider for enhanced chat capabilities
          </Text>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardRow}>
              <Text style={[styles.label, { color: theme.text }]}>OpenRouter API Key</Text>
              <TouchableOpacity onPress={openOpenRouterSignup}>
                <Text style={[styles.link, { color: theme.accent }]}>Get Free Key</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="sk-or-v1-..."
              placeholderTextColor={theme.textSecondary}
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry={!showApiKey}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.cardRow}>
              <Text style={[styles.label, { color: theme.text }]}>Show API Key</Text>
              <Switch
                value={showApiKey}
                onValueChange={setShowApiKey}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.accent }]}
              onPress={handleSaveApiKey}
            >
              <Text style={styles.buttonText}>Save API Key</Text>
            </TouchableOpacity>

            <View style={[styles.infoBox, { backgroundColor: theme.background }]}>
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                💡 Free models available: Llama 3.1 8B, Gemma 2 9B{'\n'}
                💰 Budget option: GPT-4o Mini (~$0.01 per 50 messages){'\n'}
                ⚡ Premium: Claude 3 Haiku, Llama 3.1 70B
              </Text>
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>
                  Push Notifications
                </Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Receive updates and reminders
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={handleNotificationsToggle}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.separator, { backgroundColor: theme.border }]} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>
                  Daily Cat Facts
                </Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Get a new cat fact every day
                </Text>
              </View>
              <Switch
                value={dailyFacts}
                onValueChange={handleDailyFactsToggle}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.aboutRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Version</Text>
              <Text style={[styles.value, { color: theme.text }]}>1.0.0</Text>
            </View>
            
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
            
            <View style={styles.aboutRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Developer</Text>
              <Text style={[styles.value, { color: theme.text }]}>@cat.z0ne</Text>
            </View>
            
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
            
            <TouchableOpacity style={styles.aboutRow}>
              <Text style={[styles.label, { color: theme.text }]}>Privacy Policy</Text>
              <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
            </TouchableOpacity>
            
            <View style={[styles.separator, { backgroundColor: theme.border }]} />
            
            <TouchableOpacity style={styles.aboutRow}>
              <Text style={[styles.label, { color: theme.text }]}>Terms of Service</Text>
              <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bruce Credit */}
        <View style={styles.credit}>
          <Text style={styles.creditEmoji}>🐱</Text>
          <Text style={[styles.creditText, { color: theme.textSecondary }]}>
            Made with love by Bruce{'\n'}
            A British Shorthair with attitude
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 100,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
  },
  themeCardSelected: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  themePreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    fontSize: 18,
    color: '#007AFF',
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoBox: {
    padding: 12,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
  },
  separator: {
    height: 1,
    marginVertical: 8,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  value: {
    fontSize: 15,
  },
  chevron: {
    fontSize: 20,
  },
  credit: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  creditEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  creditText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
