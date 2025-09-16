import { Injectable } from '@angular/core';
import { ExamsEffects } from './exams/exams.effects';
import { QuestionsEffects } from './questions/questions.effects';
import { SubjectsEffects } from './subjects/subjects.effects';

@Injectable()
export class AppEffects {
}

export const appEffects = [
  SubjectsEffects,
  ExamsEffects,
  QuestionsEffects
];
