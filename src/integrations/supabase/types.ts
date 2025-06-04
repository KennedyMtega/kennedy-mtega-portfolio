export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string | null
          excerpt: string
          featured: boolean | null
          id: string
          image_url: string | null
          published: boolean | null
          published_at: string | null
          slug: string
          subheading: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string | null
          excerpt: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          slug: string
          subheading?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          slug?: string
          subheading?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          email: string | null
          id: string
          message: string | null
          name: string | null
          payment_method: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          payment_method?: string | null
          status: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          payment_method?: string | null
          status?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          country: string | null
          created_at: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          page_path: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          page_path: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          page_path?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          featured: boolean | null
          full_description: string
          github_url: string | null
          id: string
          image_url: string | null
          order_index: number | null
          preview_image_url: string | null
          project_url: string | null
          short_description: string
          slug: string
          technologies: string[]
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          featured?: boolean | null
          full_description: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          order_index?: number | null
          preview_image_url?: string | null
          project_url?: string | null
          short_description: string
          slug: string
          technologies?: string[]
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          featured?: boolean | null
          full_description?: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          order_index?: number | null
          preview_image_url?: string | null
          project_url?: string | null
          short_description?: string
          slug?: string
          technologies?: string[]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_purchases: {
        Row: {
          amount: number | null
          client_email: string
          client_name: string
          client_phone: string | null
          created_at: string | null
          currency: string | null
          id: string
          message: string | null
          purchase_type: string
          service_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          client_email: string
          client_name: string
          client_phone?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          message?: string | null
          purchase_type: string
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          client_email?: string
          client_name?: string
          client_phone?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          message?: string | null
          purchase_type?: string
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_purchases_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          created_at: string | null
          currency: string | null
          description: string
          featured: boolean | null
          features: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          order_index: number | null
          price: number | null
          pricing_type: string
          short_description: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description: string
          featured?: boolean | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          price?: number | null
          pricing_type: string
          short_description?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string
          featured?: boolean | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          price?: number | null
          pricing_type?: string
          short_description?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          id: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          id?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          email: string
          full_name: string
          id: string
          last_login: string | null
          role: string
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          full_name: string
          id?: string
          last_login?: string | null
          role?: string
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          full_name?: string
          id?: string
          last_login?: string | null
          role?: string
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_device_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          device_type: string
          count: number
        }[]
      }
      get_donation_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_amount: number
          donation_count: number
          average_amount: number
          completed_count: number
          pending_count: number
          failed_count: number
        }[]
      }
      get_popular_pages: {
        Args: { limit_count?: number }
        Returns: {
          page_path: string
          view_count: number
        }[]
      }
      get_referrer_stats: {
        Args: { limit_count?: number }
        Returns: {
          referrer: string
          count: number
        }[]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      hash_password: {
        Args: { password: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      verify_password: {
        Args: { password: string; hashed_password: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
