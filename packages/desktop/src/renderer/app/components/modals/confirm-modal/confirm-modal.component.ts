import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ConfirmModalPayload } from 'src/renderer/app/models/ui.model';
import { UIService } from 'src/renderer/app/services/ui.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  public confirmModalPayload$: Observable<ConfirmModalPayload>;
  private destroy$ = new Subject<void>();

  constructor(private uiService: UIService) {}

  ngOnInit() {
    this.confirmModalPayload$ = this.uiService.getModalPayload$('confirm').pipe(
      tap((confirmModalPayload) => {
        this.uiService
          .getModalInstance('confirm')
          .result.then(() => {
            // confirm was validated
            confirmModalPayload.confirmed$.next(true);
          })
          .catch(() => {
            // confirm was closed
            confirmModalPayload.confirmed$.next(false);
          });
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  public close() {
    this.uiService.closeModal('confirm');
  }

  public dismiss() {
    this.uiService.dismissModal('confirm');
  }
}
