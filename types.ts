export interface Lead {
  id: string;
  name: string;
  avatar: string;
  status: 'paid' | 'pending' | 'new';
  lastMessage: string;
  time: string;
  unread: number;
  tag?: string; // New property for custom tags
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}