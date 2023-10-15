// components/Rating.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Rating = () => {
  const [rating, setRating] = useState(0);

  const handleStarPress = (selectedRating) => {
    console.log(selectedRating)
    setRating(selectedRating);

  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starIconName = i <= rating ? 'star' : 'star-border';
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
          <Icon name={starIconName} size={27} color={i <= rating ? 'gold' : 'gray'} style={styles.star} />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
    
      <View style={styles.starsContainer}>{renderStars()}</View>
      <Text style={styles.ratingText}>{rating > 0 ? `${rating.toFixed(1)}` : 'No rating'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom:10
  },
  star: {
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: 18,
  },
});

export default Rating;
