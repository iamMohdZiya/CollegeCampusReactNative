import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, showActions = true }) {
  const { addToCart } = useCart();

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>₹{product.price}</Text>
        <Text style={styles.vendor}>Seller: {product.vendor?.shopName || 'Unknown'}</Text>
        <Text style={styles.stock}>In Stock: {product.stock}</Text>
        
        {showActions && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => addToCart(product)}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
    marginBottom: 8,
  },
  vendor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  stock: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});