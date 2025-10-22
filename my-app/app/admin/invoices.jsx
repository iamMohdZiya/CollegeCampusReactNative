import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import apiClient from '../../src/api/client';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data } = await apiClient.get('/admin/invoices');
      setInvoices(data);
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
      case 'cancelled':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const renderInvoiceItem = ({ item }) => (
    <View style={styles.invoiceCard}>
      <View style={styles.invoiceHeader}>
        <Text style={styles.invoiceId}>Order #{item._id.slice(-6)}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.invoiceDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Student:</Text>
          <Text style={styles.detailValue}>{item.student?.name || 'Unknown'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Vendor:</Text>
          <Text style={styles.detailValue}>{item.vendor?.shopName || 'Unknown'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total:</Text>
          <Text style={styles.detailValue}>₹{item.totalAmount}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.itemsSection}>
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

      {item.paymentConfirmedAt && (
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentLabel}>Payment Confirmed:</Text>
          <Text style={styles.paymentDate}>
            {new Date(item.paymentConfirmedAt).toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F44336" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchInvoices}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalRevenue = invoices
    .filter(invoice => invoice.status === 'confirmed')
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  const totalOrders = invoices.length;
  const confirmedOrders = invoices.filter(invoice => invoice.status === 'confirmed').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Invoices</Text>
        <Text style={styles.headerSubtitle}>
          {totalOrders} total orders, {confirmedOrders} confirmed
        </Text>
        <Text style={styles.revenueText}>
          Total Revenue: ₹{totalRevenue.toLocaleString()}
        </Text>
      </View>

      <FlatList
        data={invoices}
        renderItem={renderInvoiceItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No invoices found</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchInvoices}
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
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  revenueText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  invoiceCard: {
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
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  invoiceId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  invoiceDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  itemsSection: {
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  item: {
    marginBottom: 4,
    paddingLeft: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  itemDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  paymentInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paymentLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F44336',
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
  },
});
