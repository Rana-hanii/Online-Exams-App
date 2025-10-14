export const API_ENDPOINTS = {
  subjects: {
    base: `/subjects`, //* get all subjects
    limit: `/subjects?limit=6`, //* get all subjects
    byId: (id: string) => `/subjects/${id}`, //* get subject by id
    delete: (id: string) => `/subjects/${id}`, //* delete subject by id
    update: (id: string) => `/subjects/${id}`, //* update subject by id
    add: `/subjects`, //* add new subject
  },

  exams: {
    base: `/exams`, //* get all exams
    byId: (id: string) => `/exams/${id}`, //* get exam by id
    onSubject: (subjectId: string) => `/exams?subject=${subjectId}`, //* get all exams on subject by sub ID
    add: `/exams`, //* add new exam
  },

  questions: {
    base: `/questions`, //* get all questions
    byId: (id: string) => `/questions/${id}`, //* get question by id , get single question
    byExam: (examId: string) => `/questions?exam=${examId}`, //* get questions by exam id
    history: `/questions/history`, //* get questions history by user id
    check: `/questions/check`, //* check questions
    add: `/questions`, //* add new question
  },

  user:{
    profileData:'/auth/profileData',
    updateProfile:'/auth/editProfile',
    changePassword:'/auth/changePassword'
  }
};
