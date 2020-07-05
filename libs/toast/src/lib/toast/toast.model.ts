export class Toast {
  id: string;
  type: ToastType;
  heading: string;
  message: string;
  keepAfterRouteChange: boolean;
  fade: boolean;
  position: string;

  constructor(init?: Partial<Toast>) {
    Object.assign(this, init);
  }
}

export enum ToastType {
  SUCCESS='SUCCESS',
  ERROR='ERROR',
  WARNING='WARNING',
}
