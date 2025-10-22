import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import apiClient from '../../src/api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { logout, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.replace('/login');
      return;
    }
    if (user && user.role === 'admin') {
      fetchDashboardStats();
    }
  }, [user, authLoading]);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await apiClient.get('/admin/dashboard-stats');
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  if (authLoading || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F44336" />
        <Text style={styles.loadingText}>
          {authLoading ? 'Checking authentication...' : 'Loading dashboard...'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchDashboardStats}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.cardRed]}>
            <Text style={styles.statValue}>{stats?.totalVendors || 0}</Text>
            <Text style={styles.statLabel}>Total Vendors</Text>
          </View>

          <View style={[styles.statCard, styles.cardGreen]}>
            <Text style={styles.statValue}>₹{stats?.totalSales || 0}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>

          <View style={[styles.statCard, styles.cardBlue]}>
            <Text style={styles.statValue}>{stats?.totalOrders || 0}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>

          <View style={[styles.statCard, styles.cardOrange]}>
            <Text style={styles.statValue}>{stats?.totalStudents || 0}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.vendorButton]}
          onPress={() => router.push('/admin/vendor')}
        >
          <Text style={styles.buttonText}>Manage Vendors</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.invoiceButton]}
          onPress={() => router.push('/admin/invoices')}
        >
          <Text style={styles.buttonText}>View Invoices</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '45%',
    margin: '2.5%',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardRed: {
    backgroundColor: '#ffebee',
  },
  cardGreen: {
    backgroundColor: '#e8f5e9',
  },
  cardBlue: {
    backgroundColor: '#e3f2fd',
  },
  cardOrange: {
    backgroundColor: '#fff3e0',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    padding: 20,
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  vendorButton: {
    backgroundColor: '#F44336',
  },
  invoiceButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 10,
    marginBottom: 30,
    padding: 15,
    alignItems: 'center',
  },
  logoutText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
  },
});
