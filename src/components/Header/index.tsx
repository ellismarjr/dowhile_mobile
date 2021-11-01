import React from 'react';

import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import LogoSVG from '../../assets/logo.svg';
import { useAuth } from '../../hooks/useAuth';
import { UserPhoto } from '../UserPhoto';

import { styles } from './styles';

export function Header() {
  const { signOut, user } = useAuth();

  return (
    <View style={styles.container}>
      <LogoSVG />

      <View style={styles.logoutButton}>
        {user && (
          <TouchableOpacity onPress={signOut}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        )}

        <UserPhoto
          imageUri={user?.avatar_url}
        />
      </View>


    </View>
  );
}