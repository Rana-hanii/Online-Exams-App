import { Injectable } from '@angular/core';
import { SubjectsEffects } from './subjects/subjects.effects';

@Injectable()
export class AppEffects {
}

export const appEffects = [
  SubjectsEffects
];
