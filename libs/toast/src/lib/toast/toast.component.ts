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
  @Input() fade = MODAL_CONFIG_DEFAULTS.fade;
  @Input() limit= MODAL_CONFIG_DEFAULTS.limit;
  @Input() duration= MODAL_CONFIG_DEFAULTS.duration;
  @Input() message= MODAL_CONFIG_DEFAULTS.message;

  position= MODAL_CONFIG_DEFAULTS.position;

  private options = {
    keepAfterRouteChange: false,
  };

  toasts: Toast[] = [];
  groupToasts: Toast[] = [];

  toastSubscription: Subscription;
  toastType= ToastType;
  public show:boolean = false;
  public buttonName:any = 'Show';

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    // subscribe to new toast notifications
    this.toastSubscription = this.toastService
      .onToast()
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
        else{
          this.groupToasts.push(toast);
        }

        setTimeout(() =>{
          this.removeToast(toast);
          this.removeGroupToast(toast);
        }, this.duration);
      });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.toastSubscription.unsubscribe();
  }

  removeGroupToast(toast)
  {
    if (this.groupToasts.length>0) {
      this.groupToasts = this.toasts.filter((x) => x !== toast);
    }

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
        ;
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
    this.toastService.warning(HeaderMessage.WARNING, this.message, this.options);
  }

  /**
   * Toggle group notification button text
   */
  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
}