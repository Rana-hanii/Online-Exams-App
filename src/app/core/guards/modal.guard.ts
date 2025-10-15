import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';
import { AppState } from '../../store/app.state';
import { selectQuestionModalOpen } from '../../store/questions/questions.selectors';

export interface CanComponentDeactivate {
  canDeactivate?: () => boolean | Promise<boolean>;
}

@Injectable({ providedIn: 'root' })
export class ModalGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private store: Store<AppState>) {}

  canDeactivate(component?: CanComponentDeactivate) {
    //! If component provides its own canDeactivate, prefer that
    if (component && component.canDeactivate) {
      const res = component.canDeactivate();
      if (typeof res === 'boolean') return res;
      return res;
    }

    // Otherwise check store questionModalOpen flag: if modal open, block navigation
    return this.store.select(selectQuestionModalOpen).pipe(
      first(),
      map((open) => {
        // if the modal is open, prevent navigation (return false)
        return !open;
      })
    );
  }
  
}
