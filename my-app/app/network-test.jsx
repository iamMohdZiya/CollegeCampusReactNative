import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { API_CONFIG } from '../src/config/api';
import { testAPIConnection } from '../src/utils/networkUtils';

export default function NetworkTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState([]);

  const testConnection = async (url) => {
    try {
      // Test both the root endpoint and health endpoint
      const baseUrl = url.replace('/api', '');
      const healthUrl = baseUrl + '/health';
      
      const response = await fetch(baseUrl, {
        method: 'GET',
        timeout: 10000, // Increased timeout
      });
      
      const healthResponse = await fetch(healthUrl, {
        method: 'GET',
        timeout: 10000,
      });
      
      return {
        url,
        success: response.ok,
        status: response.status,
        message: response.ok 
          ? `Connected! Health: ${healthResponse.ok ? 'OK' : 'Failed'}`
          : `HTTP ${response.status}`,
      };
    } catch (error) {
      return {
        url,
        success: false,
        status: 'Error',
        message: error.message,
      };
    }
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);
    
    const urlsToTest = [
      API_CONFIG.BASE_URL,
      ...API_CONFIG.ALTERNATIVE_URLS,
    ];

    const testResults = [];
    
    for (const url of urlsToTest) {
      const result = await testConnection(url);
      testResults.push(result);
      setResults([...testResults]);
    }
    
    setTesting(false);
    
    // Show summary
    const successful = testResults.filter(r => r.success);
    if (successful.length > 0) {
      Alert.alert(
        'Connection Found!', 
        `Found working connection: ${successful[0].url}\n\nUpdate your API_CONFIG.BASE_URL to use this URL.`
      );
    } else {
      Alert.alert(
        'No Connections Found', 
        'None of the tested URLs worked. Make sure:\n\n1. Backend server is running on port 5000\n2. Both devices are on the same WiFi network\n3. Your computer\'s IP address is correct'
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Network Connection Test</Text>
        <Text style={styles.subtitle}>
          This will test different API URLs to find one that works
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.testButton, testing && styles.disabledButton]}
        onPress={runTests}
        disabled={testing}
      >
        <Text style={styles.testButtonText}>
          {testing ? 'Testing...' : 'Test Connections'}
        </Text>
      </TouchableOpacity>

      {results.length > 0 && (
        <View style={styles.results}>
          <Text style={styles.resultsTitle}>Test Results:</Text>
          {results.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultUrl}>{result.url}</Text>
              <Text style={[
                styles.resultStatus,
                { color: result.success ? '#4CAF50' : '#F44336' }
              ]}>
                {result.success ? '✓ SUCCESS' : '✗ FAILED'}
              </Text>
              <Text style={styles.resultMessage}>{result.message}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>Instructions:</Text>
        <Text style={styles.instructionText}>
          1. Make sure your backend server is running (npm run dev)
        </Text>
        <Text style={styles.instructionText}>
          2. Both your computer and phone should be on the same WiFi
        </Text>
        <Text style={styles.instructionText}>
          3. If no connections work, find your computer's IP address:
        </Text>
        <Text style={styles.instructionText}>
          • Windows: Run 'ipconfig' in command prompt
        </Text>
        <Text style={styles.instructionText}>
          • Mac/Linux: Run 'ifconfig' in terminal
        </Text>
        <Text style={styles.instructionText}>
          4. Update the IP in src/config/api.js
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  testButton: {
    backgroundColor: '#2196F3',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  results: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  resultItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultUrl: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  resultStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultMessage: {
    fontSize: 12,
    color: '#666',
  },
  instructions: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});
