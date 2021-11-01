import React from 'react';

import {
  View
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../theme';
import { Button } from '../Button';

import { styles } from './styles';

export function SignInBox() {
  const { signIn, isSigninIn } = useAuth();
  return (
    <View style={styles.container}>
      <Button
        icon="github"
        title="ENTRAR COM O GITHUB"
        backgroundColor={COLORS.YELLOW}
        color={COLORS.BLACK_PRIMARY}
        onPress={signIn}
        isLoading={isSigninIn}
      />
    </View>
  );
}