export interface Student {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentWithEnrollmentCount extends Student {
  enrollment_count: number;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  created_at: string;
}

export interface EnrollmentWithCourse extends Enrollment {
  courses: {
    id: string;
    name: string;
    code: string;
  };
}
