import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { breeds, getBreedsByCategory, searchBreeds, Breed } from '../data/breeds';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const CATEGORIES = [
  { id: 'all', label: 'All Breeds' },
  { id: 'popular', label: 'Popular' },
  { id: 'longhair', label: 'Long Hair' },
  { id: 'shorthair', label: 'Short Hair' },
  { id: 'large', label: 'Large' },
  { id: 'active', label: 'Active' },
  { id: 'vocal', label: 'Vocal' },
];

export default function BreedsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [displayBreeds, setDisplayBreeds] = useState<Breed[]>(breeds);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setDisplayBreeds(searchBreeds(query));
    } else {
      setDisplayBreeds(getBreedsByCategory(selectedCategory));
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(categoryId);
    setSearchQuery('');
    setDisplayBreeds(getBreedsByCategory(categoryId));
  };

  const handleBreedPress = (breed: Breed) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('BreedDetail', { breed });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.content}>
        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search breeds..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category.id ? theme.primary : theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => handleCategorySelect(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category.id ? 
                      (theme.colorScheme === 'dark' ? theme.text : '#FFFFFF') : 
                      theme.text,
                  },
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Breeds Grid */}
        <View style={styles.grid}>
          {displayBreeds.map((breed) => (
            <TouchableOpacity
              key={breed.id}
              style={[styles.breedCard, { backgroundColor: theme.card }]}
              onPress={() => handleBreedPress(breed)}
              activeOpacity={0.7}
            >
              <View style={[styles.breedImage, { backgroundColor: theme.accent + '20' }]}>
                <Text style={styles.breedEmoji}>{breed.emoji}</Text>
              </View>
              <View style={styles.breedInfo}>
                <Text style={[styles.breedName, { color: theme.text }]} numberOfLines={1}>
                  {breed.name}
                </Text>
                <Text style={[styles.breedOrigin, { color: theme.textSecondary }]} numberOfLines={1}>
                  {breed.origin}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {displayBreeds.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>😿</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No breeds found matching "{searchQuery}"
            </Text>
          </View>
        )}
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
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  breedCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  breedImage: {
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breedEmoji: {
    fontSize: 48,
  },
  breedInfo: {
    padding: 12,
  },
  breedName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  breedOrigin: {
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
  },
});
