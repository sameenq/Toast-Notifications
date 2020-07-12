import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { Toast, ToastType } from './toast.model';
import { ToastService } from './toast.service';

@Component({
  selector: 'xyz-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})

export class ToastComponent implements OnInit,OnDestroy {

  @Input() fade = true;
  @Input() limit:number;
  @Input() duration:number;
  @Input() message:string;

  public show:boolean = false;
 public buttonName:any = 'Show';

  value:any;
 
  position:string = 'top-right';
  private options = {
    keepAfterRouteChange: false
};

  toasts: Toast[] = [];
  groupToast: Toast[] = [];

  toastSubscription: Subscription;
  
  constructor(private toastService: ToastService) { }

  ngOnInit() {

    this.toastSubscription = this.toastService.onToast().subscribe(toast => {
        toast.position = this.position;
        // clear toasts when an empty alert is received
        if (!toast.message) {
            // filter out toasts without 'keepAfterRouteChange' flag
            this.toasts = this.toasts.filter(x => x.keepAfterRouteChange);
            
            // remove 'keepAfterRouteChange' flag on the rest
            this.toasts.forEach(x => delete x.keepAfterRouteChange);
            alert('Please enter notification message');
            return;
        }git init

        //set toast limit to 5 only if unset
        if(!this.limit){
            this.limit = 5;
        }
        // Set toast timeout to 5 seconds if the user input is empty
        if (!this.duration) {
            this.duration = 5000;
        }

        if(this.toasts.length<this.limit)
        {
            this.toasts.push(toast);
        }
        else{
            this.groupToast.push(toast);

        }
       
        setTimeout(() => {
            this.removeToast(toast);
        }, this.duration);

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
        this.toasts.find(x => x === toast).fade = true;

        // remove toast after faded out
        setTimeout(() => {
            this.toasts = this.toasts.filter(x => x !== toast);
            this.groupToast = [];
        }, 250);
    } else {
        // remove toast
       this.toasts = this.toasts.filter(x => x !== toast);
    }
}

toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

/**
 * Show success notification
 */
showSuccess(){
    this.toastService.success('Success!!',this.message, this.options);
}

/**
 * Show error notification
 */
showError(){
    this.toastService.error('Error :(',this.message, this.options);
}

/**
 * Show warning notification
 */
showWarning(){
    this.toastService.warning('Warning!.',this.message, this.options);
}

/**
 * Set Css for Toast Notification Type 
 * 
 * @param toast 
 */
setToastHeader(toast: Toast) {
    if (!toast) return;

    const classes = ['header'];
            
    const ToastTypeClass = {
        [ToastType.Success]: 'header-success',
        [ToastType.Error]: 'header-error',
        [ToastType.Warning]: 'header-warning'
    }

    classes.push(ToastTypeClass[toast.type]);

    if (toast.fade) {
        classes.push('fade');
    }

    return classes.join(' ');
}

/**
 * set toast notification position
 * 
 * @param position 
 */
setPosition(position:string){
    return position;
}

}

