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

export interface ModalConfig
{
    duration: number;
    limit: number,
    message: string, 
    position: string;
}

export enum ToastType {
  SUCCESS='SUCCESS',
  ERROR='ERROR',
  WARNING='WARNING',
}

export enum HeaderMessage {
    SUCCESS='Success :)',
    ERROR='Error :(',
    WARNING='Warning!',
  }
