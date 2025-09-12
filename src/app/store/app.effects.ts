import { Injectable } from '@angular/core';
import { ExamsEffects } from './exams/exams.effects';
import { SubjectsEffects } from './subjects/subjects.effects';

@Injectable()
export class AppEffects {
}

export const appEffects = [
  SubjectsEffects,
  ExamsEffects
];
