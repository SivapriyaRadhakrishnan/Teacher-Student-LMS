export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "admin" | "teacher" | "student";

export type SubmissionStatus =
  | "pending"
  | "submitted"
  | "late_submission"
  | "reviewed"
  | "approved"
  | "needs_improvement"
  | "rejected";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          role: UserRole;
          created_at: string | null;
        };
        Insert: {
          id: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          role: UserRole;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: UserRole;
          created_at?: string | null;
        };
        Relationships: [];
      };
      years: {
        Row: {
          id: string;
          year_name: string;
          teacher_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          year_name: string;
          teacher_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          year_name?: string;
          teacher_id?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "years_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      batches: {
        Row: {
          id: string;
          batch_name: string;
          year_id: string;
          teacher_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          batch_name: string;
          year_id: string;
          teacher_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          batch_name?: string;
          year_id?: string;
          teacher_id?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "batches_year_id_fkey";
            columns: ["year_id"];
            isOneToOne: false;
            referencedRelation: "years";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "batches_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      students: {
        Row: {
          id: string;
          user_id: string;
          batch_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          batch_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          batch_id?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "students_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "students_batch_id_fkey";
            columns: ["batch_id"];
            isOneToOne: false;
            referencedRelation: "batches";
            referencedColumns: ["id"];
          },
        ];
      };
      assignments: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          instructions: string | null;
          deadline: string | null;
          max_marks: number | null;
          batch_id: string;
          teacher_id: string;
          reference_file_url: string | null;
          allowed_types: string[] | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          instructions?: string | null;
          deadline?: string | null;
          max_marks?: number | null;
          batch_id: string;
          teacher_id: string;
          reference_file_url?: string | null;
          allowed_types?: string[] | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          instructions?: string | null;
          deadline?: string | null;
          max_marks?: number | null;
          batch_id?: string;
          teacher_id?: string;
          reference_file_url?: string | null;
          allowed_types?: string[] | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "assignments_batch_id_fkey";
            columns: ["batch_id"];
            isOneToOne: false;
            referencedRelation: "batches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assignments_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          file_url: string | null;
          submission_link: string | null;
          notes: string | null;
          feedback: string | null;
          marks: number | null;
          status: SubmissionStatus;
          submitted_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          student_id: string;
          file_url?: string | null;
          submission_link?: string | null;
          notes?: string | null;
          feedback?: string | null;
          marks?: number | null;
          status?: SubmissionStatus;
          submitted_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          student_id?: string;
          file_url?: string | null;
          submission_link?: string | null;
          notes?: string | null;
          feedback?: string | null;
          marks?: number | null;
          status?: SubmissionStatus;
          submitted_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey";
            columns: ["assignment_id"];
            isOneToOne: false;
            referencedRelation: "assignments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "submissions_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
