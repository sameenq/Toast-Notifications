export class Toast {
    id: string;
    type: ToastType;
    message: string;
    keepAfterRouteChange: boolean;
    fade: boolean;
    position:string;

    constructor(init?:Partial<Toast>) {
        Object.assign(this, init);
    }
}

export enum ToastType {
    Success,
    Error,
    Warning
}