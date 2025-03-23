// src/components/CategoryItem.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Category } from '../screens/CategoriesScreen';

interface CategoryItemProps {
  category: Category;
  onPress?: () => void;
}

export default function CategoryItem({ category, onPress }: CategoryItemProps): JSX.Element {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <Title style={styles.title}>{category.name}</Title>
        <Paragraph style={styles.description} numberOfLines={2}>
          {category.description}
        </Paragraph>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    // Aplicamos boxShadow para la web y elevation para Android
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#263238',
  },
  description: {
    fontSize: 14,
    color: '#455A64',
  },
});
