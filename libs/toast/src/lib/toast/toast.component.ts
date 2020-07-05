import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { Toast, ToastType, HeaderMessage } from './toast.model';
import { ToastService } from './toast.service';
import { MODAL_CONFIG_DEFAULTS } from './toast.config';

@Component({
  selector: 'xyz-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;
  @Input() limit= MODAL_CONFIG_DEFAULTS.limit;
  @Input() duration= MODAL_CONFIG_DEFAULTS.duration;
  @Input() message: string;

  position= MODAL_CONFIG_DEFAULTS.position;

  private options = {
    keepAfterRouteChange: false,
  };

  toasts: Toast[] = [];
  toastSubscription: Subscription;
  toastType= ToastType;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    // subscribe to new toast notifications
    this.toastSubscription = this.toastService
      .onToast(this.id)
      .subscribe((toast) => {
        toast.position = this.position;
        // clear toasts when an empty alert is received
        if (!toast.message) {
          // filter out alerts without 'keepAfterRouteChange' flag
          this.toasts = this.toasts.filter((x) => x.keepAfterRouteChange);

          // remove 'keepAfterRouteChange' flag on the rest
          this.toasts.forEach((x) => delete x.keepAfterRouteChange);
          alert('Please enter notification message');
          return;
        }

        if (this.toasts.length < this.limit) {
          this.toasts.push(toast);
        }

        setTimeout(() => this.removeToast(toast), this.duration);
      });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.toastSubscription.unsubscribe();
  }

  removeToast(toast: Toast) {
    // check if already removed to prevent error on auto close
    if (!this.toasts.includes(toast)) return;

    if (this.fade) {
      // fade out toast
      this.toasts.find((x) => x === toast).fade = true;

      // remove toast after faded out
      setTimeout(() => {
        this.toasts = this.toasts.filter((x) => x !== toast);
      }, 250);
    } else {
      // remove toast
      this.toasts = this.toasts.filter((x) => x !== toast);
    }
  }

  /**
   * Show success notification
   */
  showSuccess() {
    this.toastService.success(HeaderMessage.SUCCESS, this.message, this.options);
  }

  /**
   * Show error notification
   */
  showError() {
    this.toastService.error(HeaderMessage.ERROR, this.message, this.options);
  }

  /**
   * Show warning notification
   */
  showWarning() {
    this.toastService.warn(HeaderMessage.WARNING, this.message, this.options);
  }
}
