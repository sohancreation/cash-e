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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string
          id: string
          is_priyo: boolean
          name: string
          phone: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_priyo?: boolean
          name: string
          phone: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_priyo?: boolean
          name?: string
          phone?: string
          user_id?: string
        }
        Relationships: []
      }
      missions: {
        Row: {
          code: string
          completed: boolean
          created_at: string
          description: string | null
          id: string
          progress: number
          reward_cashback_cents: number
          reward_xp: number
          target: number
          title: string
          user_id: string
        }
        Insert: {
          code: string
          completed?: boolean
          created_at?: string
          description?: string | null
          id?: string
          progress?: number
          reward_cashback_cents?: number
          reward_xp?: number
          target?: number
          title: string
          user_id: string
        }
        Update: {
          code?: string
          completed?: boolean
          created_at?: string
          description?: string | null
          id?: string
          progress?: number
          reward_cashback_cents?: number
          reward_xp?: number
          target?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          icon: string | null
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_seed: string
          balance_cents: number
          created_at: string
          district: string | null
          division: string | null
          dob: string | null
          gender: string | null
          id: string
          last_active_date: string | null
          level: number
          name: string
          nid: string | null
          persona: Database["public"]["Enums"]["persona_kind"]
          phone: string
          referral_code: string | null
          streak: number
          tier: Database["public"]["Enums"]["tier_kind"]
          updated_at: string
          xp: number
        }
        Insert: {
          avatar_seed?: string
          balance_cents?: number
          created_at?: string
          district?: string | null
          division?: string | null
          dob?: string | null
          gender?: string | null
          id: string
          last_active_date?: string | null
          level?: number
          name?: string
          nid?: string | null
          persona?: Database["public"]["Enums"]["persona_kind"]
          phone: string
          referral_code?: string | null
          streak?: number
          tier?: Database["public"]["Enums"]["tier_kind"]
          updated_at?: string
          xp?: number
        }
        Update: {
          avatar_seed?: string
          balance_cents?: number
          created_at?: string
          district?: string | null
          division?: string | null
          dob?: string | null
          gender?: string | null
          id?: string
          last_active_date?: string | null
          level?: number
          name?: string
          nid?: string | null
          persona?: Database["public"]["Enums"]["persona_kind"]
          phone?: string
          referral_code?: string | null
          streak?: number
          tier?: Database["public"]["Enums"]["tier_kind"]
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          created_at: string
          due_date: string | null
          emoji: string
          id: string
          name: string
          saved_cents: number
          target_cents: number
          user_id: string
        }
        Insert: {
          created_at?: string
          due_date?: string | null
          emoji?: string
          id?: string
          name: string
          saved_cents?: number
          target_cents: number
          user_id: string
        }
        Update: {
          created_at?: string
          due_date?: string | null
          emoji?: string
          id?: string
          name?: string
          saved_cents?: number
          target_cents?: number
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          bundle_quota: number | null
          created_at: string
          expires_at: string | null
          id: string
          kind: string
          meta: Json
          plan_id: string
          plan_name: string
          price_cents: number
          status: string
          user_id: string
        }
        Insert: {
          bundle_quota?: number | null
          created_at?: string
          expires_at?: string | null
          id?: string
          kind: string
          meta?: Json
          plan_id: string
          plan_name: string
          price_cents: number
          status?: string
          user_id: string
        }
        Update: {
          bundle_quota?: number | null
          created_at?: string
          expires_at?: string | null
          id?: string
          kind?: string
          meta?: Json
          plan_id?: string
          plan_name?: string
          price_cents?: number
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_cents: number
          counterparty: string | null
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["tx_kind"]
          meta: Json
          note: string | null
          user_id: string
        }
        Insert: {
          amount_cents: number
          counterparty?: string | null
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["tx_kind"]
          meta?: Json
          note?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          counterparty?: string | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["tx_kind"]
          meta?: Json
          note?: string | null
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
      award_xp: { Args: { p_user: string; p_xp: number }; Returns: undefined }
      claim_mission: { Args: { p_mission: string }; Returns: Json }
      credit_wallet: {
        Args: {
          p_amount_cents: number
          p_counterparty: string
          p_kind: Database["public"]["Enums"]["tx_kind"]
          p_meta?: Json
          p_note?: string
        }
        Returns: Json
      }
      daily_checkin: { Args: never; Returns: Json }
      debit_wallet: {
        Args: {
          p_amount_cents: number
          p_award_xp?: number
          p_counterparty: string
          p_kind: Database["public"]["Enums"]["tx_kind"]
          p_meta?: Json
          p_note?: string
        }
        Returns: Json
      }
      find_recipient: {
        Args: { p_phone: string }
        Returns: {
          avatar_seed: string
          id: string
          name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      transfer_money: {
        Args: { p_amount_cents: number; p_note?: string; p_to_phone: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
      persona_kind: "student" | "farmer" | "merchant" | "gig" | "general"
      tier_kind: "silver" | "gold" | "platinum"
      tx_kind:
        | "send"
        | "receive"
        | "bill"
        | "recharge"
        | "cashin"
        | "cashout"
        | "savings"
        | "bundle"
        | "ott"
        | "bazaar"
        | "reward"
        | "postpay"
        | "signup_bonus"
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
      app_role: ["admin", "user"],
      persona_kind: ["student", "farmer", "merchant", "gig", "general"],
      tier_kind: ["silver", "gold", "platinum"],
      tx_kind: [
        "send",
        "receive",
        "bill",
        "recharge",
        "cashin",
        "cashout",
        "savings",
        "bundle",
        "ott",
        "bazaar",
        "reward",
        "postpay",
        "signup_bonus",
      ],
    },
  },
} as const
