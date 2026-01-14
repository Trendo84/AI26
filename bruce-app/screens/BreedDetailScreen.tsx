import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Share,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Breed } from '../data/breeds';
import * as Haptics from 'expo-haptics';
import * as ContextMenu from 'zeego/context-menu';

const TraitItem = ({ label, value, theme }: { label: string; value: number; theme: any }) => (
  <View style={styles.traitItem}>
    <Text style={[styles.traitLabel, { color: theme.text }]}>{label}</Text>
    <View style={styles.traitValue}>
      {[...Array(5)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.traitDot,
            { backgroundColor: i < value ? theme.accent : theme.border },
          ]}
        />
      ))}
    </View>
  </View>
);

export default function BreedDetailScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const breed = route.params?.breed as Breed;

  if (!breed) {
    return null;
  }

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `Check out the ${breed.name} cat breed! ${breed.description}`,
        title: breed.name,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.accent }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: 'rgba(255,255,255,0.3)' }]}
          onPress={handleClose}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <ContextMenu.Root>
          <ContextMenu.Trigger>
            <View style={styles.headerContent}>
              <Text style={styles.headerEmoji}>{breed.emoji}</Text>
            </View>
          </ContextMenu.Trigger>
          
          <ContextMenu.Content>
            <ContextMenu.Item key="share" onSelect={handleShare}>
              <ContextMenu.ItemTitle>Share Breed</ContextMenu.ItemTitle>
              <ContextMenu.ItemIcon ios={{ name: 'square.and.arrow.up' }} />
            </ContextMenu.Item>
            
            <ContextMenu.Item key="favorite" onSelect={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}>
              <ContextMenu.ItemTitle>Add to Favorites</ContextMenu.ItemTitle>
              <ContextMenu.ItemIcon ios={{ name: 'heart' }} />
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.title, { color: theme.text }]}>{breed.name}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {breed.origin} • {breed.weight} • {breed.lifespan}
        </Text>

        {/* Temperament Tags */}
        <View style={styles.tags}>
          {breed.temperament.map((trait, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: theme.card }]}>
              <Text style={[styles.tagText, { color: theme.text }]}>{trait}</Text>
            </View>
          ))}
        </View>

        {/* Personality Traits */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Personality Traits</Text>
          <TraitItem label="Affection Level" value={breed.traits.affection} theme={theme} />
          <TraitItem label="Energy Level" value={breed.traits.energy} theme={theme} />
          <TraitItem label="Grooming Needs" value={breed.traits.grooming} theme={theme} />
          <TraitItem label="Intelligence" value={breed.traits.intelligence} theme={theme} />
          <TraitItem label="Vocalization" value={breed.traits.vocalization} theme={theme} />
        </View>

        {/* About */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About This Breed</Text>
          <Text style={[styles.description, { color: theme.text }]}>{breed.description}</Text>
        </View>

        {/* Care Requirements */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Care Requirements</Text>
          <Text style={[styles.description, { color: theme.text }]}>{breed.care}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 120,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  traitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  traitLabel: {
    fontSize: 15,
  },
  traitValue: {
    flexDirection: 'row',
    gap: 4,
  },
  traitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
});
