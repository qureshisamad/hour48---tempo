export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          client_id: string;
          technician_id: string;
          service_id: string;
          booking_date: string;
          booking_time: string;
          status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          technician_id: string;
          service_id: string;
          booking_date: string;
          booking_time: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          technician_id?: string;
          service_id?: string;
          booking_date?: string;
          booking_time?: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          avatar: string | null;
          phone: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          avatar?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          avatar?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          client_id: string;
          technician_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          client_id: string;
          technician_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          client_id?: string;
          technician_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          duration: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          duration?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          duration?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      specialties: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      technician_specialties: {
        Row: {
          id: string;
          technician_id: string;
          specialty_id: string;
        };
        Insert: {
          id?: string;
          technician_id: string;
          specialty_id: string;
        };
        Update: {
          id?: string;
          technician_id?: string;
          specialty_id?: string;
        };
      };
      technicians: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          avatar: string | null;
          bio: string | null;
          location: string | null;
          experience: string | null;
          rating: number | null;
          review_count: number | null;
          available: boolean | null;
          next_available: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          avatar?: string | null;
          bio?: string | null;
          location?: string | null;
          experience?: string | null;
          rating?: number | null;
          review_count?: number | null;
          available?: boolean | null;
          next_available?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          avatar?: string | null;
          bio?: string | null;
          location?: string | null;
          experience?: string | null;
          rating?: number | null;
          review_count?: number | null;
          available?: boolean | null;
          next_available?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
