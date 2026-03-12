export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          certificate_id: string // e.g., FMI-PR-2026-001
          student_id: string
          course_name: string
          course_code: string
          duration: string
          issue_date: string
          status: 'active' | 'revoked'
          qr_code_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          certificate_id: string
          student_id: string
          course_name: string
          course_code: string
          duration: string
          issue_date: string
          status?: 'active' | 'revoked'
          qr_code_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          certificate_id?: string
          student_id?: string
          course_name?: string
          course_code?: string
          duration?: string
          issue_date?: string
          status?: 'active' | 'revoked'
          qr_code_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      enquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string | null
          source: string // which page the enquiry came from
          status: 'new' | 'contacted' | 'closed'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message?: string | null
          source: string
          status?: 'new' | 'contacted' | 'closed'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string | null
          source?: string
          status?: 'new' | 'contacted' | 'closed'
          created_at?: string
        }
      }
      job_listings: {
        Row: {
          id: string
          title: string
          company: string
          location: string
          description: string | null
          contact_type: 'whatsapp' | 'email' | 'link'
          contact_value: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          location: string
          description?: string | null
          contact_type: 'whatsapp' | 'email' | 'link'
          contact_value: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          location?: string
          description?: string | null
          contact_type?: 'whatsapp' | 'email' | 'link'
          contact_value?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      certificate_status: 'active' | 'revoked'
      enquiry_status: 'new' | 'contacted' | 'closed'
      contact_type: 'whatsapp' | 'email' | 'link'
    }
  }
}

// Helper types
export type Student = Database['public']['Tables']['students']['Row']
export type Certificate = Database['public']['Tables']['certificates']['Row']
export type Enquiry = Database['public']['Tables']['enquiries']['Row']
export type JobListing = Database['public']['Tables']['job_listings']['Row']

// Certificate with student info (joined)
export type CertificateWithStudent = Certificate & {
  student: Student
}
