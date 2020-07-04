import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast/toast.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule,FormsModule],
  declarations: [ToastComponent],
  exports: [ToastComponent],
})
export class ToastModule {}
