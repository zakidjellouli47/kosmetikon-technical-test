import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  template: `
    <div class="modal-overlay" (click)="cancel.emit()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header"><h3>{{ title }}</h3></div>
        <div class="modal-body"><p>{{ message }}</p></div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="cancel.emit()">{{ cancelText }}</button>
          <button class="btn btn-danger" (click)="confirm.emit()">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-body { padding: 20px 0; }
    .modal-body p { font-size: 16px; margin: 0; }
  `]
})
export class ConfirmModalComponent {
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}