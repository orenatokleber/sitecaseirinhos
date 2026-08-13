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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bio_links: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          sort_order: number
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          is_approved: boolean
          post_id: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean
          post_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          allow_comments: boolean
          author_name: string
          category: string | null
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          published_at: string | null
          reading_time_min: number | null
          slug: string
          sort_order: number | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          allow_comments?: boolean
          author_name?: string
          category?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          reading_time_min?: number | null
          slug: string
          sort_order?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          allow_comments?: boolean
          author_name?: string
          category?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          reading_time_min?: number | null
          slug?: string
          sort_order?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cake_addon_prices: {
        Row: {
          addon_id: string
          created_at: string
          id: string
          price: number
          size_id: string | null
          updated_at: string
        }
        Insert: {
          addon_id: string
          created_at?: string
          id?: string
          price: number
          size_id?: string | null
          updated_at?: string
        }
        Update: {
          addon_id?: string
          created_at?: string
          id?: string
          price?: number
          size_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cake_addon_prices_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "cake_addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cake_addon_prices_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "cake_sizes"
            referencedColumns: ["id"]
          },
        ]
      }
      cake_addons: {
        Row: {
          applies_to: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          pricing_type: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          applies_to?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          pricing_type?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          applies_to?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          pricing_type?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      cake_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      cake_category_prices: {
        Row: {
          category_id: string
          created_at: string
          id: string
          price: number
          size_id: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          price?: number
          size_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          price?: number
          size_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cake_category_prices_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "cake_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cake_category_prices_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "cake_sizes"
            referencedColumns: ["id"]
          },
        ]
      }
      cake_decorations: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          sort_order: number
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cake_flavors: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cake_flavors_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "cake_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cake_rectangular: {
        Row: {
          class1_price: number | null
          class2_price: number | null
          created_at: string
          dimensions: string | null
          id: string
          is_active: boolean
          name: string
          note: string | null
          slices: number | null
          sort_order: number
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          class1_price?: number | null
          class2_price?: number | null
          created_at?: string
          dimensions?: string | null
          id?: string
          is_active?: boolean
          name: string
          note?: string | null
          slices?: number | null
          sort_order?: number
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          class1_price?: number | null
          class2_price?: number | null
          created_at?: string
          dimensions?: string | null
          id?: string
          is_active?: boolean
          name?: string
          note?: string | null
          slices?: number | null
          sort_order?: number
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      cake_sizes: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          ring_size: string | null
          slices: number | null
          sort_order: number
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          ring_size?: string | null
          slices?: number | null
          sort_order?: number
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          ring_size?: string | null
          slices?: number | null
          sort_order?: number
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      campaign_events: {
        Row: {
          campaign_id: string
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          participation_id: string | null
          user_agent: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          participation_id?: string | null
          user_agent?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          participation_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_events_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_events_participation_id_fkey"
            columns: ["participation_id"]
            isOneToOne: false
            referencedRelation: "campaign_participations"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_participations: {
        Row: {
          campaign_id: string
          created_at: string
          fingerprint: string | null
          id: string
          ip_address: string | null
          participant_name: string
          participant_whatsapp: string
          prize_id: string | null
          source: string
          status: string
          user_agent: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          fingerprint?: string | null
          id?: string
          ip_address?: string | null
          participant_name: string
          participant_whatsapp: string
          prize_id?: string | null
          source?: string
          status?: string
          user_agent?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          fingerprint?: string | null
          id?: string
          ip_address?: string | null
          participant_name?: string
          participant_whatsapp?: string
          prize_id?: string | null
          source?: string
          status?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_participations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_participations_prize_id_fkey"
            columns: ["prize_id"]
            isOneToOne: false
            referencedRelation: "campaign_prizes"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_prizes: {
        Row: {
          campaign_id: string
          color: string
          created_at: string
          description: string | null
          emoji: string
          id: string
          is_active: boolean
          min_purchase: number | null
          name: string
          prize_type: string
          probability_pct: number
          product_name: string | null
          sort_order: number
          stock_total: number | null
          stock_used: number
          updated_at: string
          validity_days: number
          value: number | null
        }
        Insert: {
          campaign_id: string
          color?: string
          created_at?: string
          description?: string | null
          emoji?: string
          id?: string
          is_active?: boolean
          min_purchase?: number | null
          name: string
          prize_type?: string
          probability_pct?: number
          product_name?: string | null
          sort_order?: number
          stock_total?: number | null
          stock_used?: number
          updated_at?: string
          validity_days?: number
          value?: number | null
        }
        Update: {
          campaign_id?: string
          color?: string
          created_at?: string
          description?: string | null
          emoji?: string
          id?: string
          is_active?: boolean
          min_purchase?: number | null
          name?: string
          prize_type?: string
          probability_pct?: number
          product_name?: string | null
          sort_order?: number
          stock_total?: number | null
          stock_used?: number
          updated_at?: string
          validity_days?: number
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_prizes_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_rewards: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          loyalty_points_awarded: number | null
          participation_id: string
          redeemed_at: string | null
          redeemed_by: string | null
          reward_code: string
          status: string
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          loyalty_points_awarded?: number | null
          participation_id: string
          redeemed_at?: string | null
          redeemed_by?: string | null
          reward_code: string
          status?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          loyalty_points_awarded?: number | null
          participation_id?: string
          redeemed_at?: string | null
          redeemed_by?: string | null
          reward_code?: string
          status?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_rewards_participation_id_fkey"
            columns: ["participation_id"]
            isOneToOne: true
            referencedRelation: "campaign_participations"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          instagram: Json
          mechanic_type: string
          name: string
          require_story_share: boolean
          rules: Json
          slug: string
          starts_at: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          instagram?: Json
          mechanic_type?: string
          name: string
          require_story_share?: boolean
          rules?: Json
          slug: string
          starts_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          instagram?: Json
          mechanic_type?: string
          name?: string
          require_story_share?: boolean
          rules?: Json
          slug?: string
          starts_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      delivery_popups: {
        Row: {
          bg_color: string | null
          coupon_code: string | null
          created_at: string
          description: string | null
          discount_text: string | null
          id: string
          image_url: string | null
          is_active: boolean
          popup_type: string
          sort_order: number | null
          text_color: string | null
          title: string
          updated_at: string
        }
        Insert: {
          bg_color?: string | null
          coupon_code?: string | null
          created_at?: string
          description?: string | null
          discount_text?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          popup_type?: string
          sort_order?: number | null
          text_color?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          bg_color?: string | null
          coupon_code?: string | null
          created_at?: string
          description?: string | null
          discount_text?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          popup_type?: string
          sort_order?: number | null
          text_color?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt_text: string | null
          category: string | null
          created_at: string
          id: string
          image_url: string
          is_active: boolean | null
          sort_order: number | null
          title: string | null
        }
        Insert: {
          alt_text?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean | null
          sort_order?: number | null
          title?: string | null
        }
        Update: {
          alt_text?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean | null
          sort_order?: number | null
          title?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          id: string
          page_path: string
          page_title: string | null
          referrer: string | null
          user_agent: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          page_path: string
          page_title?: string | null
          referrer?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          page_path?: string
          page_title?: string | null
          referrer?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price: number | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      redirect_clicks: {
        Row: {
          clicked_at: string
          id: string
          redirect_id: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string
          id?: string
          redirect_id: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string
          id?: string
          redirect_id?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "redirect_clicks_redirect_id_fkey"
            columns: ["redirect_id"]
            isOneToOne: false
            referencedRelation: "redirects"
            referencedColumns: ["id"]
          },
        ]
      }
      redirects: {
        Row: {
          created_at: string
          destination_url: string
          id: string
          is_active: boolean
          slug: string
          title: string | null
          total_clicks: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_url: string
          id?: string
          is_active?: boolean
          slug: string
          title?: string | null
          total_clicks?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_url?: string
          id?: string
          is_active?: boolean
          slug?: string
          title?: string | null
          total_clicks?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_sections: {
        Row: {
          content: string | null
          cta_link: string | null
          cta_text: string | null
          id: string
          image_url: string | null
          metadata: Json | null
          section_key: string
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          section_key: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          section_key?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      sweet_flavors: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          type_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          type_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          type_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sweet_flavors_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "sweet_types"
            referencedColumns: ["id"]
          },
        ]
      }
      sweet_packages: {
        Row: {
          created_at: string
          id: string
          price: number
          quantity: number
          sort_order: number
          type_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          quantity: number
          sort_order?: number
          type_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          quantity?: number
          sort_order?: number
          type_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sweet_packages_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "sweet_types"
            referencedColumns: ["id"]
          },
        ]
      }
      sweet_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
          weight_g: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
          weight_g?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
          weight_g?: number | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          stars: number | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          stars?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          stars?: number | null
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
          role?: Database["public"]["Enums"]["app_role"]
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
      increment_redirect_clicks: {
        Args: { redirect_id: string }
        Returns: undefined
      }
      select_prize_atomically: {
        Args: {
          p_campaign_id: string
          p_fingerprint?: string
          p_ip_address?: string
          p_participant_name: string
          p_participant_whatsapp: string
          p_source?: string
          p_user_agent?: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
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
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
