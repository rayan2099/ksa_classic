export interface Car {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number; // in km
  location: string;
  description: string;
  condition: 'new_arrival' | 'available' | 'sold';
  type?: 'classic' | 'project';
  images: string[];
  contact_phone?: string;
  created_at: string;
  created_by?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: 'super_admin' | 'sub_admin';
  email: string;
  created_at: string;
  passcode?: string;
}

export interface MessageReply {
  id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  created_at: string;
  email_id?: string;
  email_status?: 'pending' | 'sent' | 'failed' | 'skipped';
}

export interface Message {
  id: string;
  car_id: string | null;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
  car_title?: string; // hydrated on join
  replies?: MessageReply[];
  confirmation_email_id?: string;
  confirmation_email_status?: 'pending' | 'sent' | 'failed' | 'skipped';
  email_warning?: string;
}

export interface DbState {
  cars: Car[];
  profiles: Profile[];
  messages: Message[];
}
