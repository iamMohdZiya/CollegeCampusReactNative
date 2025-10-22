import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';

export default function Layout() {
  return (
    <AuthProvider>
      <CartProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: true,
              headerStyle: { backgroundColor: '#007bff' },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen 
              name="index" 
              options={{ 
                title: 'Home'
              }} 
            />
            <Stack.Screen 
              name="login" 
              options={{ 
                title: 'Login'
              }} 
            />
            <Stack.Screen 
              name="register" 
              options={{ 
                title: 'Register'
              }} 
            />
            <Stack.Screen 
              name="student/index" 
              options={{ 
                title: 'Browse Products'
              }} 
            />
            <Stack.Screen 
              name="student/cart" 
              options={{ 
                title: 'Shopping Cart'
              }} 
            />
            <Stack.Screen 
              name="student/orders" 
              options={{ 
                title: 'My Orders'
              }} 
            />
            <Stack.Screen 
              name="vendor/index" 
              options={{ 
                title: 'Vendor Dashboard'
              }} 
            />
            <Stack.Screen 
              name="vendor/add-product" 
              options={{ 
                title: 'Add New Product'
              }} 
            />
            <Stack.Screen 
              name="vendor/products" 
              options={{ 
                title: 'Manage Products'
              }} 
            />
            <Stack.Screen 
              name="vendor/orders" 
              options={{ 
                title: 'Orders Received'
              }} 
            />
            <Stack.Screen 
              name="vendor/profile" 
              options={{ 
                title: 'Shop Profile'
              }} 
            />
            <Stack.Screen 
              name="admin/index" 
              options={{ 
                title: 'Admin Dashboard'
              }} 
            />
            <Stack.Screen 
              name="admin/vendor" 
              options={{ 
                title: 'Manage Vendors'
              }} 
            />
            <Stack.Screen 
              name="admin/invoices" 
              options={{ 
                title: 'All Invoices'
              }} 
            />
            <Stack.Screen 
              name="network-test" 
              options={{ 
                title: 'Network Test'
              }} 
            />
          </Stack>
        </SafeAreaView>
      </CartProvider>
    </AuthProvider>
  );
}
