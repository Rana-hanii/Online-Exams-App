# تاريخ الامتحانات - Exam History System

## نظرة عامة
تم إنشاء نظام لإدارة تاريخ الامتحانات باستخدام Local Storage بدلاً من API، حيث يتم حفظ جميع نتائج الامتحانات محلياً في المتصفح.

## الميزات الجديدة

### 1. حفظ نتائج الامتحانات تلقائياً
- يتم حفظ نتيجة كل امتحان تلقائياً عند الانتهاء منه
- البيانات تُحفظ في Local Storage وتبقى متاحة حتى بعد إعادة تشغيل المتصفح
- كل نتيجة تحتوي على تفاصيل كاملة للأسئلة والإجابات

### 2. صفحة تاريخ الامتحانات
- عرض جميع الامتحانات التي تم أداؤها
- إظهار النتيجة والوقت المستغرق لكل امتحان
- ترتيب الامتحانات من الأحدث للأقدم

### 3. Modal لعرض تفاصيل الامتحان
- عند الضغط على "عرض الإجابات" يظهر modal يحتوي على:
  - ملخص النتيجة (صحيحة، خاطئة، نسبة مئوية)
  - تفاصيل كل سؤال مع الإجابة الصحيحة والإجابة المختارة
  - تمييز بصري للإجابات الصحيحة والخاطئة

## كيفية الاستخدام

### 1. لحفظ نتيجة امتحان جديد
استخدم `ExamResultHandlerService` في نهاية الامتحان:

```typescript
import { ExamResultHandlerService } from './shared/utils/exam-result-handler.service';

// في component نتائج الامتحان
constructor(private examResultHandler: ExamResultHandlerService) {}

// عند ظهور النتائج
saveExamResult() {
  this.examResultHandler.saveExamResult(
    examId,           // ID الامتحان
    examTitle,        // عنوان الامتحان  
    examDuration,     // مدة الامتحان بالدقائق
    subjectId,        // ID المادة
    questions,        // array الأسئلة
    userAnswers,      // array إجابات المستخدم
    checkResult,      // نتيجة التصحيح من API
    timeSpent         // الوقت المستغرق بالثواني
  );
}
```

### 2. لعرض تاريخ الامتحانات
الصفحة متاحة في `/student/quiz-history` وتعرض:
- قائمة بجميع الامتحانات المحفوظة
- إمكانية عرض تفاصيل كل امتحان
- البيانات تُحمل تلقائياً من Local Storage

### 3. البيانات الوهمية للتجربة
تم إضافة بيانات وهمية تظهر تلقائياً إذا كان التاريخ فارغ لتسهيل التجربة والاختبار.

## بنية البيانات

### ExamHistoryItem
```typescript
interface ExamHistoryItem {
  _id: string;                    // ID فريد للنتيجة
  exam: {                         // بيانات الامتحان
    _id: string;
    title: string;
    duration: number;
    subject: string;
    numberOfQuestions: number;
  };
  user: string;                   // ID المستخدم
  score: number;                  // النتيجة
  totalQuestions: number;         // إجمالي الأسئلة
  correctAnswers: number;         // الإجابات الصحيحة
  wrongAnswers: number;           // الإجابات الخاطئة
  timeSpent: number;              // الوقت بالثواني
  completedAt: string;            // تاريخ الانتهاء
  questions?: ExamHistoryQuestion[]; // تفاصيل الأسئلة
}
```

### ExamHistoryQuestion
```typescript
interface ExamHistoryQuestion {
  questionId: string;             // ID السؤال
  question: string;               // نص السؤال
  userAnswer: string;             // إجابة المستخدم
  correctAnswer: string;          // الإجابة الصحيحة
  isCorrect: boolean;             // هل الإجابة صحيحة
  answers: Array<{                // خيارات الإجابة
    key: string;
    answer: string;
  }>;
}
```

## الملفات المحدثة

### Store Files
- `exams.actions.ts` - إضافة actions للتاريخ
- `exams.reducer.ts` - إضافة reducers للتاريخ  
- `exams.effects.ts` - إضافة effects للتاريخ
- `exams.selectors.ts` - إضافة selectors للتاريخ
- `exam.interface.ts` - إضافة interfaces جديدة

### Services
- `exam.service.ts` - إضافة methods لـ Local Storage
- `exam-result-handler.service.ts` - Service جديد لإدارة النتائج

### Components
- `quiz-history.component.ts` - تحديث كامل للاستخدام مع Store
- `quiz-history.component.html` - تحديث UI مع Modal

## كيفية التكامل مع صفحة النتائج

عند انتهاء الامتحان وظهور النتائج، أضف هذا الكود:

```typescript
// في component النتائج
import { ExamResultHandlerService } from '../shared/utils/exam-result-handler.service';

export class ExamResultsComponent {
  constructor(private examResultHandler: ExamResultHandlerService) {}
  
  ngOnInit() {
    // عند ظهور النتائج، احفظ البيانات
    this.examResultHandler.saveExamResult(
      this.examId,
      this.examTitle,
      this.examDuration,
      this.subjectId,
      this.questions,
      this.userAnswers,
      this.checkResult,
      this.timeSpent
    );
  }
}
```

## ملاحظات مهمة

1. **Local Storage**: جميع البيانات محفوظة محلياً في المتصفح
2. **البيانات الوهمية**: يتم إضافتها تلقائياً للتجربة، يمكن حذفها لاحقاً
3. **التوافق**: يعمل مع جميع المتصفحات الحديثة
4. **الأمان**: البيانات آمنة ومحفوظة محلياً فقط

## خطوات التشغيل

1. تأكد من تشغيل التطبيق: `ng serve`
2. انتقل إلى `/student/quiz-history`
3. ستجد بيانات وهمية للتجربة
4. اضغط على "عرض الإجابات" لرؤية التفاصيل
5. لاختبار حفظ نتيجة جديدة، أكمل امتحان واستخدم `ExamResultHandlerService`