import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import agricultureTheme  from './theme';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import Toast from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: agricultureTheme.colors.primary,
        backgroundColor: '#FFFFFF',
        height: 'auto',
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 5,
        width: '90%',
        maxWidth: 500,
        alignSelf: 'center',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: '#263238',
      }}
      text2Style={{
        fontSize: 13,
        color: '#455A64',
      }}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Feather name="check-circle" size={24} color={agricultureTheme.colors.primary} />
        </View>
      )}
    />
  ),
  
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#B71C1C',
        backgroundColor: '#FFFFFF',
        height: 'auto',
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 5,
        width: '90%',
        maxWidth: 500,
        alignSelf: 'center',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: '#263238',
      }}
      text2Style={{
        fontSize: 13,
        color: '#455A64',
      }}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Feather name="alert-circle" size={24} color="#B71C1C" />
        </View>
      )}
    />
  ),
  
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#0288D1',
        backgroundColor: '#FFFFFF',
        height: 'auto',
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 5,
        width: '90%',
        maxWidth: 500,
        alignSelf: 'center',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: '#263238',
      }}
      text2Style={{
        fontSize: 13,
        color: '#455A64',
      }}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Feather name="info" size={24} color="#0288D1" />
        </View>
      )}
    />
  ),
  
  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#FFA000',
        backgroundColor: '#FFFFFF',
        height: 'auto',
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 5,
        width: '90%',
        maxWidth: 500,
        alignSelf: 'center',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: '#263238',
      }}
      text2Style={{
        fontSize: 13,
        color: '#455A64',
      }}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Feather name="alert-triangle" size={24} color="#FFA000" />
        </View>
      )}
      renderTrailingIcon={() => (
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => Toast.hide()}
        >
          <Feather name="x" size={20} color="#757575" />
        </TouchableOpacity>
      )}
    />
  ),
};

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});