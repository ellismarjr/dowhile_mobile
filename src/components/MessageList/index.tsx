import React, { useEffect, useState } from 'react';

import {
  ScrollView
} from 'react-native';
import { api } from '../../services/api';
import { Message, MessageProps } from '../Message';

import { styles } from './styles';

const message  = {
    id: '1',
    text: 'Não vejo a hora de começar esse evento, com certeza vai ser o melhor de todos os tempos, vamooo pra cima! 🔥🔥',
    user: {
      name: 'Dianne Russell',
      avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
}

export function MessageList() {
  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    async function getMessages() {
      const response = await api.get('/messages/last3');
      setCurrentMessages(response.data);
    }

    getMessages();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {currentMessages.map(message => (
         <Message key={message.id} data={message}/>
      ))}
    </ScrollView>
  );
}