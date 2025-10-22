import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import apiClient from '../../src/api/client';

export default function AdminVendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data } = await apiClient.get('/admin/vendors');
      setVendors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorApproval = async (vendorId, status) => {
    try {
      await apiClient.put(`/admin/vendors/${vendorId}/approve`, { status });
      Alert.alert('Success', `Vendor ${status === 'approve' ? 'approved' : 'rejected'} successfully`);
      fetchVendors(); // Refresh the vendors list
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update vendor status');
    }
  };

  const getStatusColor = (isApproved) => {
    return isApproved ? '#4caf50' : '#ff9800';
  };

  const getStatusText = (isApproved) => {
    return isApproved ? 'Approved' : 'Pending';
  };

  const renderVendorItem = ({ item }) => (
    <View style={styles.vendorCard}>
      <View style={styles.vendorHeader}>
        <Text style={styles.vendorName}>{item.name}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.isApproved) }]}>
          {getStatusText(item.isApproved)}
        </Text>
      </View>

      <View style={styles.vendorDetails}>
        <Text style={styles.detailText}>Email: {item.email}</Text>
        <Text style={styles.detailText}>Shop: {item.shopName || 'Not set'}</Text>
        <Text style={styles.detailText}>UPI ID: {item.upiId || 'Not set'}</Text>
        <Text style={styles.detailText}>
          Joined: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {!item.isApproved && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleVendorApproval(item._id, 'approve')}
          >
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleVendorApproval(item._id, 'reject')}
          >
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
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
          onPress={fetchVendors}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pendingVendors = vendors.filter(vendor => !vendor.isApproved);
  const approvedVendors = vendors.filter(vendor => vendor.isApproved);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vendor Management</Text>
        <Text style={styles.headerSubtitle}>
          {pendingVendors.length} pending, {approvedVendors.length} approved
        </Text>
      </View>

      <FlatList
        data={vendors}
        renderItem={renderVendorItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No vendors found</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchVendors}
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
  },
  list: {
    padding: 16,
  },
  vendorCard: {
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
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  vendorDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
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
