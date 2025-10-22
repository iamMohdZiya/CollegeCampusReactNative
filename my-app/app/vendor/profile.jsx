import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../../src/api/client';
import { useAuth } from '../../src/context/AuthContext';

export default function VendorProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    shopName: '',
    upiId: '',
    qrCodeUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Pre-fill form with existing data if available
    if (user) {
      setProfile({
        shopName: user.shopName || '',
        upiId: user.upiId || '',
        qrCodeUrl: user.qrCodeUrl || '',
      });
    }
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // In a real app, you would upload this image to your server/cloud storage
      // and get back a URL. For now, we'll just use the local URI
      setProfile({ ...profile, qrCodeUrl: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    if (!profile.shopName.trim()) {
      Alert.alert('Error', 'Shop name is required');
      return;
    }

    try {
      setLoading(true);
      await apiClient.put('/vendors/profile', profile);
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Shop Name</Text>
          <TextInput
            style={styles.input}
            value={profile.shopName}
            onChangeText={(text) => setProfile({ ...profile, shopName: text })}
            placeholder="Enter shop name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>UPI ID</Text>
          <TextInput
            style={styles.input}
            value={profile.upiId}
            onChangeText={(text) => setProfile({ ...profile, upiId: text })}
            placeholder="Enter UPI ID"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>QR Code</Text>
          {profile.qrCodeUrl ? (
            <Image
              source={{ uri: profile.qrCodeUrl }}
              style={styles.qrCode}
            />
          ) : null}
          
          <TouchableOpacity 
            style={styles.imageButton}
            onPress={pickImage}
          >
            <Text style={styles.imageButtonText}>
              {profile.qrCodeUrl ? 'Change QR Code' : 'Upload QR Code'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  qrCode: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 8,
  },
  imageButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  imageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});