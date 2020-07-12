import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Toast, ToastType } from './toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {

    private subject = new Subject<Toast>();

    onToast(): Observable<Toast> {
        return this.subject.asObservable();
    }

    success(heading:string,message: string, options?: any) {
        this.showToast(new Toast({ ...options, type: ToastType.SUCCESS, message,heading }));
    }

    error(heading:string,message: string, options?: any) {
        this.showToast(new Toast({ ...options, type: ToastType.ERROR, message,heading }));
    }

    warning(heading:string,message: string, options?: any) {
        this.showToast(new Toast({ ...options, type: ToastType.WARNING, message,heading  }));
    }
    
    
    showToast(toast: Toast) {
        this.subject.next(toast);
    }

    clearMessages() {
        this.subject.next();
    }
}
