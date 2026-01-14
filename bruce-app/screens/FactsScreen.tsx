import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';

type Fact = {
  id: string;
  badge: string;
  title: string;
  content: string;
  tags: string[];
};

const FACTS: Fact[] = [
  {
    id: '1',
    badge: '✨ TODAY\'S FACT',
    title: 'Cats Have a Third Eyelid',
    content: 'Cats possess a third eyelid called a nictitating membrane. This translucent eyelid helps protect their eyes from debris and lubricates the eye surface. If you can see it frequently when your cat is awake, it might indicate health issues and you should consult a vet.',
    tags: ['Anatomy', 'Health'],
  },
  {
    id: '2',
    badge: '🧠 DID YOU KNOW',
    title: 'Cats Sleep 12-16 Hours Daily',
    content: 'Cats are crepuscular, meaning they\'re most active during dawn and dusk. This is why your cat might wake you up early! Their excessive sleeping helps conserve energy for hunting (or playing with toys). Older cats can sleep up to 20 hours a day.',
    tags: ['Behavior', 'Sleep'],
  },
  {
    id: '3',
    badge: '🔬 SCIENCE',
    title: 'Cats Can\'t Taste Sweetness',
    content: 'Unlike humans and dogs, cats lack the taste receptors for sweetness. This is because they\'re obligate carnivores - their diet in the wild consists entirely of meat. This genetic trait explains why cats aren\'t interested in sugary foods!',
    tags: ['Biology', 'Nutrition'],
  },
  {
    id: '4',
    badge: '💡 FUN FACT',
    title: 'Cats Have 230+ Bones',
    content: 'Humans have 206 bones, but cats have around 230-250 bones depending on tail length. Their extra vertebrae give them incredible flexibility - allowing them to twist, rotate, and squeeze through tight spaces. This is why they always land on their feet!',
    tags: ['Anatomy', 'Science'],
  },
  {
    id: '5',
    badge: '🎯 BEHAVIOR',
    title: 'Slow Blinks Mean "I Love You"',
    content: 'When your cat slowly blinks at you, they\'re showing trust and affection - it\'s like a cat kiss! You can slow blink back to return the sentiment. This behavior is rooted in cats\' body language; sustained eye contact can be threatening, so closing their eyes shows they feel safe.',
    tags: ['Behavior', 'Communication'],
  },
  {
    id: '6',
    badge: '👃 SENSES',
    title: 'Cats Have 200 Million Scent Receptors',
    content: 'A cat\'s sense of smell is 14 times stronger than a human\'s. They have about 200 million odor-sensitive cells in their noses, compared to our mere 5 million. This super-powered nose helps them detect prey, identify territory, and recognize their humans.',
    tags: ['Senses', 'Biology'],
  },
  {
    id: '7',
    badge: '🐾 HISTORY',
    title: 'Ancient Egyptians Worshipped Cats',
    content: 'In ancient Egypt, cats were considered sacred and associated with the goddess Bastet. Killing a cat, even accidentally, was punishable by death. When a family cat died, household members would shave their eyebrows as a sign of mourning.',
    tags: ['History', 'Culture'],
  },
  {
    id: '8',
    badge: '🎵 SOUND',
    title: 'Cats Make Over 100 Vocal Sounds',
    content: 'While dogs make about 10 vocal sounds, cats can produce over 100 different vocalizations! Each cat develops unique sounds to communicate with their humans. Meowing is actually primarily used to talk to humans - cats rarely meow at each other as adults.',
    tags: ['Communication', 'Behavior'],
  },
];

export default function FactsScreen() {
  const { theme } = useTheme();

  const handleShare = async (fact: Fact) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `${fact.title}\n\n${fact.content}\n\n- From Bruce Cat Companion 🐱`,
        title: fact.title,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={[styles.hero, { backgroundColor: theme.primary }]}>
          <Text style={styles.heroEmoji}>🐱</Text>
          <Text style={[styles.heroTitle, { color: theme.colorScheme === 'dark' ? theme.text : '#FFFFFF' }]}>
            Daily Cat Facts
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.colorScheme === 'dark' ? theme.textSecondary : 'rgba(255,255,255,0.8)' }]}>
            Learn something new every day
          </Text>
        </View>

        {/* Facts */}
        {FACTS.map((fact) => (
          <TouchableOpacity
            key={fact.id}
            style={[styles.factCard, { backgroundColor: theme.card }]}
            onPress={() => handleShare(fact)}
            activeOpacity={0.7}
          >
            <View style={[styles.badge, { backgroundColor: theme.accent }]}>
              <Text style={styles.badgeText}>{fact.badge}</Text>
            </View>
            <Text style={[styles.factTitle, { color: theme.text }]}>{fact.title}</Text>
            <Text style={[styles.factContent, { color: theme.text }]}>{fact.content}</Text>
            <View style={styles.tags}>
              {fact.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: theme.background }]}>
                  <Text style={[styles.tagText, { color: theme.textSecondary }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
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
    paddingBottom: 20,
  },
  hero: {
    borderRadius: 24,
    padding: 30,
    marginBottom: 24,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
  },
  factCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  factTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  factContent: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
  },
});
