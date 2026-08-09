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
      certificates: {
        Row: {
          consecration_id: string
          full_name: string
          id: string
          issued_at: string
          started_on: string | null
          storage_key: string | null
          user_id: string
          verification_code: string
        }
        Insert: {
          consecration_id: string
          full_name: string
          id?: string
          issued_at?: string
          started_on?: string | null
          storage_key?: string | null
          user_id: string
          verification_code?: string
        }
        Update: {
          consecration_id?: string
          full_name?: string
          id?: string
          issued_at?: string
          started_on?: string | null
          storage_key?: string | null
          user_id?: string
          verification_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_consecration_id_fkey"
            columns: ["consecration_id"]
            isOneToOne: false
            referencedRelation: "consecrations"
            referencedColumns: ["id"]
          },
        ]
      }
      companion_assignments: {
        Row: {
          companion_id: string
          created_at: string
          id: string
          share_intentions: boolean
          share_journal: boolean
          share_petitions: boolean
          user_id: string
        }
        Insert: {
          companion_id: string
          created_at?: string
          id?: string
          share_intentions?: boolean
          share_journal?: boolean
          share_petitions?: boolean
          user_id: string
        }
        Update: {
          companion_id?: string
          created_at?: string
          id?: string
          share_intentions?: boolean
          share_journal?: boolean
          share_petitions?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "companion_assignments_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "spiritual_companions"
            referencedColumns: ["id"]
          },
        ]
      }
      consecration_day_sections: {
        Row: {
          body: string | null
          day_id: string
          id: string
          section_type: string
          sort_order: number
          title: string | null
        }
        Insert: {
          body?: string | null
          day_id: string
          id?: string
          section_type: string
          sort_order?: number
          title?: string | null
        }
        Update: {
          body?: string | null
          day_id?: string
          id?: string
          section_type?: string
          sort_order?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consecration_day_sections_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "consecration_days"
            referencedColumns: ["id"]
          },
        ]
      }
      consecration_days: {
        Row: {
          church_teaching: string | null
          consecration_id: string
          day_number: number
          estimated_minutes: number
          hero_image: string | null
          id: string
          introduction: string | null
          meditation: string | null
          motto: string | null
          objective: string | null
          prayer: string | null
          progressive_consecration: string | null
          published_at: string | null
          purpose: string | null
          stage_id: string | null
          status: string
          subtitle: string | null
          teaching: string | null
          title: string
        }
        Insert: {
          church_teaching?: string | null
          consecration_id: string
          day_number: number
          estimated_minutes?: number
          hero_image?: string | null
          id?: string
          introduction?: string | null
          meditation?: string | null
          motto?: string | null
          objective?: string | null
          prayer?: string | null
          progressive_consecration?: string | null
          published_at?: string | null
          purpose?: string | null
          stage_id?: string | null
          status?: string
          subtitle?: string | null
          teaching?: string | null
          title: string
        }
        Update: {
          church_teaching?: string | null
          consecration_id?: string
          day_number?: number
          estimated_minutes?: number
          hero_image?: string | null
          id?: string
          introduction?: string | null
          meditation?: string | null
          motto?: string | null
          objective?: string | null
          prayer?: string | null
          progressive_consecration?: string | null
          published_at?: string | null
          purpose?: string | null
          stage_id?: string | null
          status?: string
          subtitle?: string | null
          teaching?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "consecration_days_consecration_id_fkey"
            columns: ["consecration_id"]
            isOneToOne: false
            referencedRelation: "consecrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consecration_days_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "consecration_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      consecration_stages: {
        Row: {
          accent_color: string | null
          consecration_id: string
          description: string | null
          end_day: number
          hero_image: string | null
          id: string
          motto: string | null
          stage_number: number
          start_day: number
          title: string
        }
        Insert: {
          accent_color?: string | null
          consecration_id: string
          description?: string | null
          end_day: number
          hero_image?: string | null
          id?: string
          motto?: string | null
          stage_number: number
          start_day: number
          title: string
        }
        Update: {
          accent_color?: string | null
          consecration_id?: string
          description?: string | null
          end_day?: number
          hero_image?: string | null
          id?: string
          motto?: string | null
          stage_number?: number
          start_day?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "consecration_stages_consecration_id_fkey"
            columns: ["consecration_id"]
            isOneToOne: false
            referencedRelation: "consecrations"
            referencedColumns: ["id"]
          },
        ]
      }
      consecrations: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number
          id: string
          motto: string | null
          published_at: string | null
          slug: string
          status: string
          subtitle: string | null
          theme_config: Json
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days?: number
          id?: string
          motto?: string | null
          published_at?: string | null
          slug: string
          status?: string
          subtitle?: string | null
          theme_config?: Json
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number
          id?: string
          motto?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          subtitle?: string | null
          theme_config?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      doctrinal_references: {
        Row: {
          author: string | null
          commentary: string | null
          day_id: string
          excerpt: string | null
          id: string
          reference: string | null
          reference_type: string
          sort_order: number
          source_url: string | null
          work: string | null
        }
        Insert: {
          author?: string | null
          commentary?: string | null
          day_id: string
          excerpt?: string | null
          id?: string
          reference?: string | null
          reference_type: string
          sort_order?: number
          source_url?: string | null
          work?: string | null
        }
        Update: {
          author?: string | null
          commentary?: string | null
          day_id?: string
          excerpt?: string | null
          id?: string
          reference?: string | null
          reference_type?: string
          sort_order?: number
          source_url?: string | null
          work?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctrinal_references_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "consecration_days"
            referencedColumns: ["id"]
          },
        ]
      }
      examination_questions: {
        Row: {
          day_id: string
          id: string
          question: string
          sort_order: number
        }
        Insert: {
          day_id: string
          id?: string
          question: string
          sort_order?: number
        }
        Update: {
          day_id?: string
          id?: string
          question?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "examination_questions_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "consecration_days"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string | null
          asset_type: string
          consecration_id: string | null
          created_at: string
          day_id: string | null
          duration_seconds: number | null
          file_size: number | null
          height: number | null
          id: string
          is_downloadable: boolean
          mime_type: string | null
          provider: string
          public_url: string | null
          storage_key: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          asset_type: string
          consecration_id?: string | null
          created_at?: string
          day_id?: string | null
          duration_seconds?: number | null
          file_size?: number | null
          height?: number | null
          id?: string
          is_downloadable?: boolean
          mime_type?: string | null
          provider?: string
          public_url?: string | null
          storage_key: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          asset_type?: string
          consecration_id?: string | null
          created_at?: string
          day_id?: string | null
          duration_seconds?: number | null
          file_size?: number | null
          height?: number | null
          id?: string
          is_downloadable?: boolean
          mime_type?: string | null
          provider?: string
          public_url?: string | null
          storage_key?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_consecration_id_fkey"
            columns: ["consecration_id"]
            isOneToOne: false
            referencedRelation: "consecrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "consecration_days"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          coronilla_reminder: boolean
          daily_reminder: boolean
          id: string
          reminder_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          coronilla_reminder?: boolean
          daily_reminder?: boolean
          id?: string
          reminder_time?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          coronilla_reminder?: boolean
          daily_reminder?: boolean
          id?: string
          reminder_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prayers: {
        Row: {
          body: string
          consecration_id: string | null
          id: string
          kind: string
          response: string | null
          slug: string
          sort_order: number
          title: string
        }
        Insert: {
          body: string
          consecration_id?: string | null
          id?: string
          kind?: string
          response?: string | null
          slug: string
          sort_order?: number
          title: string
        }
        Update: {
          body?: string
          consecration_id?: string | null
          id?: string
          kind?: string
          response?: string | null
          slug?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayers_consecration_id_fkey"
            columns: ["consecration_id"]
            isOneToOne: false
            referencedRelation: "consecrations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          community: string | null
          created_at: string
          display_name: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          community?: string | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          community?: string | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          body: string | null
          category: string
          consecration_id: string | null
          external_url: string | null
          id: string
          media_id: string | null
          sort_order: number
          status: string
          summary: string | null
          title: string
        }
        Insert: {
          body?: string | null
          category: string
          consecration_id?: string | null
          external_url?: string | null
          id?: string
          media_id?: string | null
          sort_order?: number
          status?: string
          summary?: string | null
          title: string
        }
        Update: {
          body?: string | null
          category?: string
          consecration_id?: string | null
          external_url?: string | null
          id?: string
          media_id?: string | null
          sort_order?: number
          status?: string
          summary?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_consecration_id_fkey"
            columns: ["consecration_id"]
            isOneToOne: false
            referencedRelation: "consecrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      scripture_references: {
        Row: {
          citation: string
          commentary: string | null
          day_id: string
          id: string
          passage: string | null
          sort_order: number
        }
        Insert: {
          citation: string
          commentary?: string | null
          day_id: string
          id?: string
          passage?: string | null
          sort_order?: number
        }
        Update: {
          citation?: string
          commentary?: string | null
          day_id?: string
          id?: string
          passage?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "scripture_references_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "consecration_days"
            referencedColumns: ["id"]
          },
        ]
      }
      spiritual_companions: {
        Row: {
          avatar_url: string | null
          community: string | null
          created_at: string
          id: string
          message: string | null
          name: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          community?: string | null
          created_at?: string
          id?: string
          message?: string | null
          name: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          community?: string | null
          created_at?: string
          id?: string
          message?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_consecrations: {
        Row: {
          completed_at: string | null
          consecration_id: string
          created_at: string
          current_day: number
          expected_end_date: string | null
          id: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          consecration_id: string
          created_at?: string
          current_day?: number
          expected_end_date?: string | null
          id?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          consecration_id?: string
          created_at?: string
          current_day?: number
          expected_end_date?: string | null
          id?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_consecrations_consecration_id_fkey"
            columns: ["consecration_id"]
            isOneToOne: false
            referencedRelation: "consecrations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_day_progress: {
        Row: {
          audio_position_seconds: number
          completed: boolean
          completed_at: string | null
          day_number: number
          id: string
          purpose_accepted: boolean
          purpose_outcome: string | null
          updated_at: string
          user_consecration_id: string
          user_id: string
        }
        Insert: {
          audio_position_seconds?: number
          completed?: boolean
          completed_at?: string | null
          day_number: number
          id?: string
          purpose_accepted?: boolean
          purpose_outcome?: string | null
          updated_at?: string
          user_consecration_id: string
          user_id: string
        }
        Update: {
          audio_position_seconds?: number
          completed?: boolean
          completed_at?: string | null
          day_number?: number
          id?: string
          purpose_accepted?: boolean
          purpose_outcome?: string | null
          updated_at?: string
          user_consecration_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_day_progress_user_consecration_id_fkey"
            columns: ["user_consecration_id"]
            isOneToOne: false
            referencedRelation: "user_consecrations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_intentions: {
        Row: {
          content: string
          created_at: string
          id: string
          updated_at: string
          user_consecration_id: string | null
          user_id: string
          visibility: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_consecration_id?: string | null
          user_id: string
          visibility?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_consecration_id?: string | null
          user_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_intentions_user_consecration_id_fkey"
            columns: ["user_consecration_id"]
            isOneToOne: false
            referencedRelation: "user_consecrations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_journal_entries: {
        Row: {
          content: string
          created_at: string
          day_number: number | null
          id: string
          prompt: string | null
          updated_at: string
          user_consecration_id: string | null
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          day_number?: number | null
          id?: string
          prompt?: string | null
          updated_at?: string
          user_consecration_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          day_number?: number | null
          id?: string
          prompt?: string | null
          updated_at?: string
          user_consecration_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_journal_entries_user_consecration_id_fkey"
            columns: ["user_consecration_id"]
            isOneToOne: false
            referencedRelation: "user_consecrations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_petitions: {
        Row: {
          answered: boolean
          content: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          answered?: boolean
          content?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          answered?: boolean
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: []
      }
      user_prayer_progress: {
        Row: {
          completed_count: number
          consecration_id: string | null
          current_bead: number
          current_group: number
          id: string
          last_prayed_at: string | null
          prayer_slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_count?: number
          consecration_id?: string | null
          current_bead?: number
          current_group?: number
          id?: string
          last_prayed_at?: string | null
          prayer_slug?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_count?: number
          consecration_id?: string | null
          current_bead?: number
          current_group?: number
          id?: string
          last_prayed_at?: string | null
          prayer_slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_prayer_progress_consecration_id_fkey"
            columns: ["consecration_id"]
            isOneToOne: false
            referencedRelation: "consecrations"
            referencedColumns: ["id"]
          },
        ]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "companion" | "editor" | "admin"
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
      app_role: ["user", "companion", "editor", "admin"],
    },
  },
} as const
