export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      booking_allocations: {
        Row: {
          allocated: number | null
          booking_id: string
          created_at: string
          id: string
          label: string | null
          quantity: number | null
          room_type: string | null
          updated_at: string
        }
        Insert: {
          allocated?: number | null
          booking_id: string
          created_at?: string
          id?: string
          label?: string | null
          quantity?: number | null
          room_type?: string | null
          updated_at?: string
        }
        Update: {
          allocated?: number | null
          booking_id?: string
          created_at?: string
          id?: string
          label?: string | null
          quantity?: number | null
          room_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_allocations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_guests: {
        Row: {
          booking_id: string
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_guests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_rooming_lists: {
        Row: {
          booking_id: string
          created_at: string
          entries: Json
          file_name: string | null
          id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          entries?: Json
          file_name?: string | null
          id?: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          entries?: Json
          file_name?: string | null
          id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_rooming_lists_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_rooms: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          notes: string | null
          occupancy: number | null
          quantity: number | null
          room_type: string | null
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          notes?: string | null
          occupancy?: number | null
          quantity?: number | null
          room_type?: string | null
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          occupancy?: number | null
          quantity?: number | null
          room_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_rooms_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_type: Database["public"]["Enums"]["booking_type"]
          cancelled_at: string | null
          city: string | null
          contact: Json
          country: string | null
          created_at: string
          delegates: number | null
          destination: string | null
          end_date: string | null
          guests: number | null
          hotel_name: string | null
          hotel_reference: string | null
          id: string
          image_key: string | null
          meeting_spaces: number | null
          name: string | null
          nights: number | null
          reference: string
          request: Json
          rooms: number | null
          start_date: string | null
          status: string
          status_note: string | null
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_type?: Database["public"]["Enums"]["booking_type"]
          cancelled_at?: string | null
          city?: string | null
          contact?: Json
          country?: string | null
          created_at?: string
          delegates?: number | null
          destination?: string | null
          end_date?: string | null
          guests?: number | null
          hotel_name?: string | null
          hotel_reference?: string | null
          id?: string
          image_key?: string | null
          meeting_spaces?: number | null
          name?: string | null
          nights?: number | null
          reference?: string
          request?: Json
          rooms?: number | null
          start_date?: string | null
          status?: string
          status_note?: string | null
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_type?: Database["public"]["Enums"]["booking_type"]
          cancelled_at?: string | null
          city?: string | null
          contact?: Json
          country?: string | null
          created_at?: string
          delegates?: number | null
          destination?: string | null
          end_date?: string | null
          guests?: number | null
          hotel_name?: string | null
          hotel_reference?: string | null
          id?: string
          image_key?: string | null
          meeting_spaces?: number | null
          name?: string | null
          nights?: number | null
          reference?: string
          request?: Json
          rooms?: number | null
          start_date?: string | null
          status?: string
          status_note?: string | null
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_read_booking: { Args: { _booking_id: string }; Returns: boolean }
      generate_booking_reference: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      owns_booking: { Args: { _booking_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "staff" | "customer"
      booking_type: "leisure" | "me"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "customer"],
      booking_type: ["leisure", "me"],
    },
  },
} as const
