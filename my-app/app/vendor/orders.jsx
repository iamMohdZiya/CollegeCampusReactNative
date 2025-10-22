import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import apiClient from '../../src/api/client';

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await apiClient.get('/orders/history');
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (orderId) => {
    try {
      await apiClient.put(`/orders/${orderId}/confirm`);
      Alert.alert('Success', 'Payment confirmed successfully');
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to confirm payment');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#ff9800';
      case 'confirmed':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item._id.slice(-6)}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.customerInfo}>
        <Text style={styles.customerLabel}>Customer:</Text>
        <Text style={styles.customerName}>{item.student?.name || 'Unknown'}</Text>
      </View>

      <View style={styles.orderItems}>
        <Text style={styles.itemsLabel}>Items:</Text>
        {item.items.map((orderItem, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemName}>{orderItem.product?.name || 'Unknown Product'}</Text>
            <Text style={styles.itemDetails}>
              Qty: {orderItem.quantity} × ₹{orderItem.priceAtPurchase}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.total}>
          Total: ₹{item.totalAmount}
        </Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {item.status === 'pending' && (
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => handleConfirmPayment(item._id)}
        >
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchOrders}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders received yet</Text>
            <Text style={styles.emptySubtext}>Orders from students will appear here</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchOrders}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  customerInfo: {
    marginBottom: 12,
  },
  customerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderItems: {
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  item: {
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
