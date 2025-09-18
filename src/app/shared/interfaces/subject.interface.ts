

export interface SubjectState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  selectedSubject: Subject | null;
}
export interface Subjects {
  message: string;
  metadata: Metadata;
  subjects: Subject[];
}

export interface Subject {
  _id: string;
  name: string;
  icon: string;
  createdAt: string;
}

export interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
}