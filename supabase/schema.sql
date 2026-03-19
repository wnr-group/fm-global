-- FM Global Careers Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STUDENTS TABLE
-- ============================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CERTIFICATES TABLE
-- ============================================
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., FMI-PR-2026-001
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_name VARCHAR(255) NOT NULL,
  course_code VARCHAR(10) NOT NULL, -- PR, TH, AD, FD
  duration VARCHAR(100), -- e.g., "3 months"
  issue_date DATE NOT NULL,
  expiry_date DATE, -- Optional
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  qr_code_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENQUIRIES TABLE
-- ============================================
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT,
  source VARCHAR(50), -- Which page the enquiry came from
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- JOB LISTINGS TABLE
-- ============================================
CREATE TABLE job_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  requirements TEXT,
  salary_range VARCHAR(100),
  contact_type VARCHAR(20) CHECK (contact_type IN ('email', 'whatsapp', 'phone')),
  contact_value VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COURSES TABLE (for FM Institute)
-- ============================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(100),
  fee DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CERTIFICATE SEQUENCE TABLE
-- For auto-generating certificate IDs
-- ============================================
CREATE TABLE certificate_sequences (
  year INTEGER NOT NULL,
  course_code VARCHAR(10) NOT NULL,
  last_sequence INTEGER DEFAULT 0,
  PRIMARY KEY (year, course_code)
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate next certificate ID
CREATE OR REPLACE FUNCTION generate_certificate_id(p_course_code VARCHAR(10))
RETURNS VARCHAR(50) AS $$
DECLARE
  v_year INTEGER;
  v_sequence INTEGER;
  v_certificate_id VARCHAR(50);
BEGIN
  v_year := EXTRACT(YEAR FROM CURRENT_DATE);

  -- Insert or update sequence
  INSERT INTO certificate_sequences (year, course_code, last_sequence)
  VALUES (v_year, p_course_code, 1)
  ON CONFLICT (year, course_code)
  DO UPDATE SET last_sequence = certificate_sequences.last_sequence + 1
  RETURNING last_sequence INTO v_sequence;

  -- Format: FMI-PR-2026-001
  v_certificate_id := 'FMI-' || p_course_code || '-' || v_year || '-' || LPAD(v_sequence::TEXT, 3, '0');

  RETURN v_certificate_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- CERTIFICATES: Public can read (for verification), only authenticated can write
CREATE POLICY "Public can verify certificates"
  ON certificates FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage certificates"
  ON certificates FOR ALL
  USING (auth.role() = 'authenticated');

-- STUDENTS: Only authenticated can access
CREATE POLICY "Authenticated users can manage students"
  ON students FOR ALL
  USING (auth.role() = 'authenticated');

-- ENQUIRIES: Anyone can insert, only authenticated can read/update
CREATE POLICY "Anyone can submit enquiry"
  ON enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view enquiries"
  ON enquiries FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update enquiries"
  ON enquiries FOR UPDATE
  USING (auth.role() = 'authenticated');

-- JOB LISTINGS: Public can read active jobs, authenticated can manage all
CREATE POLICY "Public can view active jobs"
  ON job_listings FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage jobs"
  ON job_listings FOR ALL
  USING (auth.role() = 'authenticated');

-- COURSES: Public can read active courses, authenticated can manage
CREATE POLICY "Public can view active courses"
  ON courses FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage courses"
  ON courses FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_certificates_certificate_id ON certificates(certificate_id);
CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_job_listings_active ON job_listings(is_active);

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Insert sample courses
INSERT INTO courses (code, name, description, duration, fee) VALUES
  ('PR', 'Practical Training', 'Hands-on training in fluid mechanics systems', '3 months', 25000),
  ('TH', 'Theory Course', 'Comprehensive theoretical foundation', '2 months', 15000),
  ('AD', 'Advanced Program', 'Advanced concepts and specialized skills', '6 months', 45000),
  ('FD', 'Foundation Course', 'Basic introduction to fluid mechanics', '1 month', 10000);
