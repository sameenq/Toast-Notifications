import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Toast, ToastType } from './toast.model';
import { ToastService } from './toast.service';

@Component({
  selector: 'xyz-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})

export class ToastComponent implements OnInit,OnDestroy {

  @Input() id = 'default-alert';
  @Input() fade = true;
  @Input() limit:number;
  @Input() duration:number;
 
  position:string = 'top-right';
  options = {
    keepAfterRouteChange: false
};

  toasts: Toast[] = [];
  toastSubscription: Subscription;

  constructor(private router: Router, public toastService: ToastService) { }

  ngOnInit() {
    // subscribe to new toast notifications
    this.toastSubscription = this.toastService.onToast(this.id)
        .subscribe(toast => {

            toast.position = this.position;
            // clear toasts when an empty alert is received
            if (!toast.message) {
                // filter out alerts without 'keepAfterRouteChange' flag
                this.toasts = this.toasts.filter(x => x.keepAfterRouteChange);
                
                // remove 'keepAfterRouteChange' flag on the rest
                this.toasts.forEach(x => delete x.keepAfterRouteChange);
                return;
            }

            //set toast limit to 5 only if unset
            if(!this.limit){
                this.limit = 5;
            }

            if(this.toasts.length < this.limit){
                this.toasts.push(toast);
            }
           
            // Set toast timeout to 5 seconds if the user input is empty
            if (!this.duration) {
                this.duration = 5000;
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
        this.toasts.find(x => x === toast).fade = true;

        // remove toast after faded out
        setTimeout(() => {
            this.toasts = this.toasts.filter(x => x !== toast);
        }, 250);
    } else {
        // remove toast
        this.toasts = this.toasts.filter(x => x !== toast);
    }
}

/**
 * Set Css for Toast Notification Type 
 * 
 * @param toast 
 */
setToastType(toast: Toast) {
    if (!toast) return;

    const classes = ['toast'];
            
    const ToastTypeClass = {
        [ToastType.Success]: 'toast-success',
        [ToastType.Error]: 'toast-error',
        [ToastType.Warning]: 'toast-warning'
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
