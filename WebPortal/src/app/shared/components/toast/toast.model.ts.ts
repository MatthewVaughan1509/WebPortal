export class ToastNotification {
    public constructor(
    public toastType: ToastType,
    public toastMessage: string
    ){};
}

export enum ToastType {
    Custom = "custom",
    Error = "error",
    Info = "info",
    Success = "success",
    Warning = "warning"
}