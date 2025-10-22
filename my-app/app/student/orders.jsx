import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import apiClient from '../../src/api/client';

export default function Orders() {
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#ff9800';
      case 'confirmed':
        return '#4caf50';
      case 'delivered':
        return '#2196f3';
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
          {item.status}
        </Text>
      </View>

      <View style={styles.orderItems}>
        {Array.isArray(item?.items) && item.items.length > 0 ? (
          item.items.map((orderItem, idx) => {
            const prod = orderItem?.product || {};
            return (
              <View key={orderItem?._id ?? `item-${idx}`} style={styles.item}>
                <Text style={styles.itemName}>{prod.name ?? 'Unnamed product'}</Text>
                <Text style={styles.itemDetails}>
                  Qty: {orderItem?.quantity ?? 0} × ₹{prod.price ?? '0.00'}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.itemDetails}>No items available for this order</Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.vendor}>
          Vendor: {item.vendor?.shopName || 'Unknown'}
        </Text>
        <Text style={styles.total}>
          Total: ₹{item.totalAmount}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
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
          <Text style={styles.emptyText}>No orders found</Text>
        }
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
  orderItems: {
    marginBottom: 12,
  },
  item: {
    marginBottom: 8,
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
  vendor: {
    fontSize: 12,
    color: '#666',
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 32,
    fontSize: 16,
  },
});
