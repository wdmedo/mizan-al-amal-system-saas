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
      accounts: {
        Row: {
          balance: number
          created_at: string
          id: string
          name: string
        }
        Insert: {
          balance: number
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      capital_entries: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string
          id: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          description: string
          id?: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          id?: string
          type?: string
        }
        Relationships: []
      }
      completed_customers: {
        Row: {
          amount: number
          broker_percentage: number
          created_at: string
          fixed_interest: number
          id: string
          id_number: string
          name: string
          net_profit: number
          phone_number: string
          product_difference: number
          total_payment: number
        }
        Insert: {
          amount: number
          broker_percentage: number
          created_at?: string
          fixed_interest: number
          id?: string
          id_number: string
          name: string
          net_profit: number
          phone_number: string
          product_difference: number
          total_payment: number
        }
        Update: {
          amount?: number
          broker_percentage?: number
          created_at?: string
          fixed_interest?: number
          id?: string
          id_number?: string
          name?: string
          net_profit?: number
          phone_number?: string
          product_difference?: number
          total_payment?: number
        }
        Relationships: []
      }
      coverage_transactions: {
        Row: {
          amount: number
          coverage_id: string
          created_at: string
          date: string
          description: string
          id: string
          type: string
        }
        Insert: {
          amount: number
          coverage_id: string
          created_at?: string
          date?: string
          description: string
          id?: string
          type: string
        }
        Update: {
          amount?: number
          coverage_id?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "coverage_transactions_coverage_id_fkey"
            columns: ["coverage_id"]
            isOneToOne: false
            referencedRelation: "coverages"
            referencedColumns: ["id"]
          },
        ]
      }
      coverages: {
        Row: {
          amount: number
          created_at: string
          id: string
          received_by: string
          received_from: string
          remaining: number
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          received_by: string
          received_from: string
          remaining: number
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          received_by?: string
          received_from?: string
          remaining?: number
        }
        Relationships: []
      }
      customer_followups: {
        Row: {
          created_at: string
          customer_name: string
          follow_date: string
          id: string
          monday_status: string | null
          sunday_status: string | null
          thursday_status: string | null
          tuesday_status: string | null
          updated_at: string
          wednesday_status: string | null
        }
        Insert: {
          created_at?: string
          customer_name: string
          follow_date?: string
          id?: string
          monday_status?: string | null
          sunday_status?: string | null
          thursday_status?: string | null
          tuesday_status?: string | null
          updated_at?: string
          wednesday_status?: string | null
        }
        Update: {
          created_at?: string
          customer_name?: string
          follow_date?: string
          id?: string
          monday_status?: string | null
          sunday_status?: string | null
          thursday_status?: string | null
          tuesday_status?: string | null
          updated_at?: string
          wednesday_status?: string | null
        }
        Relationships: []
      }
      daily_visits: {
        Row: {
          bank: string | null
          created_at: string
          customer_name: string
          customer_phone: string
          date: string
          day: string
          id: string
          mediator: string | null
          notes: string | null
          reception_employee: string | null
          updated_at: string
        }
        Insert: {
          bank?: string | null
          created_at?: string
          customer_name: string
          customer_phone: string
          date?: string
          day: string
          id?: string
          mediator?: string | null
          notes?: string | null
          reception_employee?: string | null
          updated_at?: string
        }
        Update: {
          bank?: string | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          date?: string
          day?: string
          id?: string
          mediator?: string | null
          notes?: string | null
          reception_employee?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      employee_transactions: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string
          employee_id: string
          id: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          description: string
          employee_id: string
          id?: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          employee_id?: string
          id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_transactions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          advances: number
          created_at: string
          id: string
          name: string
          salary: number
        }
        Insert: {
          advances?: number
          created_at?: string
          id?: string
          name: string
          salary: number
        }
        Update: {
          advances?: number
          created_at?: string
          id?: string
          name?: string
          salary?: number
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string
          id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          description: string
          id?: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          customer_id: string | null
          id: string
          source: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id?: string | null
          id?: string
          source: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string | null
          id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "pending_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_customers: {
        Row: {
          created_at: string
          id: string
          id_number: string
          name: string
          phone_number: string
        }
        Insert: {
          created_at?: string
          id?: string
          id_number: string
          name: string
          phone_number: string
        }
        Update: {
          created_at?: string
          id?: string
          id_number?: string
          name?: string
          phone_number?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
