import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Toast,ToastType, HeaderMessage } from './toast.model';
import { ToastService } from './toast.service';
import { MODAL_CONFIG_DEFAULTS } from './toast.config';

@Component({
  selector: 'xyz-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})

export class ToastComponent implements OnInit, OnDestroy {
  @Input() limit= MODAL_CONFIG_DEFAULTS.limit;
  @Input() duration= MODAL_CONFIG_DEFAULTS.duration;
  @Input() message= MODAL_CONFIG_DEFAULTS.message;

  public position = MODAL_CONFIG_DEFAULTS.position;
  public toasts: Toast[] = [];
  public groupToasts: Toast[] = [];
  public toastType = ToastType;
  public buttonName:any = 'Show';

  private fade = MODAL_CONFIG_DEFAULTS.fade;
  private toastSubscription: Subscription;
  private view:boolean = false;
 
  constructor(private toastService: ToastService) {}

  ngOnInit() {
    // subscribe to new toast notifications
    this.toastSubscription = this.toastService
      .onToast()
      .subscribe((toast) => {

        if (!toast.message) {
          alert('Please enter notification message');
          return;
        }

        toast.position = this.position;

        if (this.toasts.length < this.limit) {
          this.toasts.push(toast);
        }
        else{
          this.groupToasts.push(toast);
        }

        setTimeout(() => {
            this.removeToast(toast);
            this.removeGroupToast(toast);
          }, this.duration
        );

      });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.toastSubscription.unsubscribe();
  }

  removeGroupToast(toast:Toast)
  {
    if (this.groupToasts.length>0) {
      this.groupToasts = this.toasts.filter((x) => x !== toast);
      this.buttonName = "Show";
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
    this.toastService.success(HeaderMessage.SUCCESS, this.message);
  }

  /**
   * Show error notification
   */
  showError() {
    this.toastService.error(HeaderMessage.ERROR, this.message);
  }

  /**
   * Show warning notification
   */
  showWarning() {
    this.toastService.warning(HeaderMessage.WARNING, this.message);
  }

  /**
   * Toggle group notification button text
   */
  toggle() {
    this.view = !this.view;

    if(this.view)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
}