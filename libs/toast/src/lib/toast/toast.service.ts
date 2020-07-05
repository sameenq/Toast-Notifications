import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Toast, ToastType} from './toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
    private subject = new Subject<Toast>();
    private defaultId = 'default-alert';

    // enable subscribing to toasts observable
    onToast(id = this.defaultId): Observable<Toast> {
        return this.subject.asObservable().pipe(filter(x => x && x.id === id));
    }

    // convenience methods
      success(heading:string,message: string, options?: any) {
        this.toast(new Toast({ ...options, type: ToastType.Success, message,heading }));
    }

    error(heading:string,message: string, options?: any) {
        this.toast(new Toast({ ...options, type: ToastType.Error, message,heading }));
    }

    warn(heading:string,message: string, options?: any) {
        this.toast(new Toast({ ...options, type: ToastType.Warning, message,heading  }));
    }

    // main alert method    
    toast(toast: Toast) {
        toast.id = toast.id || this.defaultId;
        this.subject.next(toast);
    }

    // clear toasts message
    clear(id = this.defaultId) {
        this.subject.next(new Toast({ id }));
    }
}
