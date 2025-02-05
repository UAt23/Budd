import { View, Text, StyleSheet } from 'react-native';

export default function Categories() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Categories Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
}); 