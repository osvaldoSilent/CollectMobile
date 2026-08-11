import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Modal, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useCameraPermissions } from 'expo-camera'; // 👈 Importación directa del hook

export default function App() {
  const [arVisible, setArVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions(); // 👈 Uso directo

  const handleOpenAR = async () => {
    // Verificar y solicitar permiso nativo al SO antes de abrir la cámara
    if (!permission?.granted) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permiso requerido", 
          "Es necesario otorgar acceso a la cámara para poder visualizar la Realidad Aumentada."
        );
        return;
      }
    }
    setArVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111" />
      
      {/* Header / Inicio */}
      <View style={styles.header}>
        <Text style={styles.title}>collectAR 📦</Text>
        <Text style={styles.subtitle}>Coleccionables en Realidad Aumentada</Text>
      </View>

      {/* Hero Card / Tarjeta de Producto */}
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>EDICIÓN LIMITADA</Text>
        </View>
        <Text style={styles.cardTitle}>Tarjeta Coleccionable #01</Text>
        <Text style={styles.cardDescription}>
          Escanea el marcador físico o visualiza el modelo 3D directamente desde tu cámara.
        </Text>

        <TouchableOpacity 
          style={styles.arButton} 
          onPress={handleOpenAR}
          activeOpacity={0.8}
        >
          <Text style={styles.arButtonText}>👁️ Ver en Realidad Aumentada</Text>
        </TouchableOpacity>
      </View>

      {/* Modal con el Visor WebAR */}
      <Modal visible={arVisible} animationType="slide" onRequestClose={() => setArVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setArVisible(false)}>
            <Text style={styles.closeButtonText}>✕ Cerrar Cámara</Text>
          </TouchableOpacity>
          
          <WebView
            source={{ uri: 'https://osvaldosilent.github.io/collectAR/' }}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={['*']}
            onPermissionRequest={(request) => {
              request.grant(request.resources);
            }}
            style={{ flex: 1 }}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f11', paddingHorizontal: 20, paddingTop: 40 },
  header: { marginBottom: 30 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  card: { backgroundColor: '#1a1a1e', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#2d2d35' },
  badge: { backgroundColor: '#e63946', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  cardDescription: { fontSize: 14, color: '#aaa', lineHeight: 20, marginBottom: 20 },
  arButton: { backgroundColor: '#fff', paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
  arButtonText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
  closeButton: { backgroundColor: '#222', padding: 14, alignItems: 'center', zIndex: 10 },
  closeButtonText: { color: '#fff', fontWeight: 'bold' }
});