import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ExamHistoryItem, ExamHistoryQuestion } from '../interfaces/exam.interface';
import { CheckQuestionsResponse, Question, UserAnswer } from '../interfaces/question.interface';
import * as ExamsActions from '../../store/exams/exams.actions';

@Injectable({
  providedIn: 'root'
})
export class ExamResultHandlerService {
  private store = inject(Store);

  /**
   * حفظ نتيجة الامتحان في local storage وإضافتها للـ store
   * يتم استدعاء هذه الدالة عند انتهاء الامتحان وظهور النتيجة
   */
  saveExamResult(
    examId: string,
    examTitle: string,
    examDuration: number,
    subjectId: string,
    questions: Question[],
    userAnswers: UserAnswer[],
    checkResult: CheckQuestionsResponse,
    timeSpent: number
  ): void {
    try {
      // إنشاء تفاصيل الأسئلة مع الإجابات
      const questionsDetails: ExamHistoryQuestion[] = questions.map((question, index) => {
        const userAnswer = userAnswers.find(ua => ua.questionId === question._id);
        const userAnswerKey = userAnswer ? this.getUserAnswerKey(question, userAnswer.selectedAnswer) : '';
        
        return {
          questionId: question._id,
          question: question.question,
          userAnswer: userAnswerKey,
          correctAnswer: question.correct,
          isCorrect: userAnswer?.isCorrect || false,
          answers: question.answers
        };
      });

      // إنشاء كائن نتيجة الامتحان
      const examResult: ExamHistoryItem = {
        _id: this.generateUniqueId(),
        exam: {
          _id: examId,
          title: examTitle,
          duration: examDuration,
          subject: subjectId,
          numberOfQuestions: questions.length
        },
        user: 'current-user', // يمكن تحديثها لاحقاً من user service
        score: checkResult.correct,
        totalQuestions: parseInt(checkResult.total),
        correctAnswers: checkResult.correct,
        wrongAnswers: checkResult.wrong,
        timeSpent: timeSpent,
        completedAt: new Date().toISOString(),
        questions: questionsDetails
      };

      // حفظ النتيجة في store (والذي سيحفظها تلقائياً في local storage)
      this.store.dispatch(ExamsActions.saveExamResult({ examResult }));

      console.log('تم حفظ نتيجة الامتحان بنجاح:', examResult);
      
    } catch (error) {
      console.error('خطأ في حفظ نتيجة الامتحان:', error);
    }
  }

  /**
   * الحصول على مفتاح الإجابة من index الإجابة المختارة
   */
  private getUserAnswerKey(question: Question, selectedAnswerIndex: number): string {
    if (selectedAnswerIndex >= 0 && selectedAnswerIndex < question.answers.length) {
      return question.answers[selectedAnswerIndex].key;
    }
    return '';
  }

  /**
   * إنشاء ID فريد للامتحان
   */
  private generateUniqueId(): string {
    return `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * إنشاء نموذج بيانات وهمية للتجربة (يمكن حذفها لاحقاً)
   */
  createSampleExamHistory(): void {
    const sampleExams: ExamHistoryItem[] = [
      {
        _id: 'sample_1',
        exam: {
          _id: 'exam_1',
          title: 'امتحان HTML الأساسي',
          duration: 30,
          subject: 'web_dev',
          numberOfQuestions: 20
        },
        user: 'current-user',
        score: 18,
        totalQuestions: 20,
        correctAnswers: 18,
        wrongAnswers: 2,
        timeSpent: 1200, // 20 minutes in seconds
        completedAt: new Date(Date.now() - 86400000).toISOString(), // yesterday
        questions: [
          {
            questionId: 'q1',
            question: 'ما هو الوسم المستخدم لإنشاء رابط في HTML؟',
            userAnswer: 'a',
            correctAnswer: 'a',
            isCorrect: true,
            answers: [
              { key: 'a', answer: '<a>' },
              { key: 'b', answer: '<link>' },
              { key: 'c', answer: '<href>' },
              { key: 'd', answer: '<url>' }
            ]
          },
          {
            questionId: 'q2',
            question: 'أي من هذه الوسوم يستخدم للعناوين؟',
            userAnswer: 'c',
            correctAnswer: 'a',
            isCorrect: false,
            answers: [
              { key: 'a', answer: '<h1>' },
              { key: 'b', answer: '<title>' },
              { key: 'c', answer: '<header>' },
              { key: 'd', answer: '<head>' }
            ]
          }
        ]
      },
      {
        _id: 'sample_2',
        exam: {
          _id: 'exam_2',
          title: 'امتحان CSS المتقدم',
          duration: 45,
          subject: 'web_dev',
          numberOfQuestions: 15
        },
        user: 'current-user',
        score: 12,
        totalQuestions: 15,
        correctAnswers: 12,
        wrongAnswers: 3,
        timeSpent: 2100, // 35 minutes
        completedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        questions: []
      }
    ];

    // حفظ البيانات الوهمية
    sampleExams.forEach(exam => {
      this.store.dispatch(ExamsActions.saveExamResult({ examResult: exam }));
    });
  }
}