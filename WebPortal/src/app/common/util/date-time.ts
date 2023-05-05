import { objectUtils } from "./object-utils";

export class dateTime {
    static ln = !objectUtils.isNullOrUndefined(navigator.language) && navigator.language !== '' ? navigator.language : 'en';
    public static getInfoFormat(): string {
        switch (this.ln) {
            case "en-GB":
                return "dd-MM HH:mm";
            case "en-US":
                return "MM-dd HH:mm"
            default:
                return "dd-MM HH:mm";
        }
    }
    public static getDateFormat(): string {
        switch (this.ln) {
            case "en-GB":
                return "dd/MM/yyyy";
            case "en-US":
                return "MM/dd/yyyy"
            default:
                return "dd/MM/yyyy";
        }
    }

    public static getDateTimeFormat(): string {
        switch (this.ln) {
            case "en-GB":
                return "dd-MM-yyyy HH:mm";
            case "en-US":
                return "MM-dd-yyyy HH:mm"
            default:
                return "dd-MM-yyyy HH:mm";
        }

    }

    public static getDateTimeFullFormat(): string {
        switch (this.ln) {
            case "en-GB":
                return "dd-MM-yyyy HH:mm:ss";
            case "en-US":
                return "MM-dd-yyyy HH:mm:ss"
            default:
                return "dd-MM-yyyy HH:mm:ss";
        }
    }

    public static getRegionDateFormat(region: string): string {
        let f = "yyyy-MM-dd";
        switch (region) {
            case "NORTH AMERICAS":
            case "AMERICAS":
            case "ASIA":
                f = "MM/dd/yyyy";
                break;
            case "EUROPE":
                f = "dd/MM/yyyy";
                break;
            default:
                break;
        }
        return f;
    }

    public static getRegionDateTimeFormat(): string {
        let f = "dd/MM/yyyy HH:mm:ss";
        switch (this.ln) { 
            case "en-US":
                f = "MM/dd/yyyy HH:mm:ss";
                break;
            case "en-GB":
                f = "dd/MM/yyyy HH:mm:ss";
                break;
            default:
                break;
        }
        return f;
    }

    public static getFormattedDateByRegion(d: Date, region: string): string {
        if (d) {
            d = new Date(d);
            let date = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
            let month = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
            let hour = d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`;
            let minute = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`;
            let second = d.getSeconds() > 9 ? d.getSeconds() : `0${d.getSeconds()}`;

            if (region) {
                switch (region) {
                    case "NORTH AMERICAS":
                    case "AMERICAS":
                    case "ASIA":
                        return `${month}/${date}/${d.getFullYear()}, 
                            ${hour}:${minute}:${second}`;
                        break;
                    case "EUROPE":
                        return `${date}/${month}/${d.getFullYear()}, 
                            ${hour}:${minute}:${second}`;
                        break;
                    default:
                        break;
                }
                return `${date}/${month}/${d.getFullYear()}, 
            ${hour}:${minute}:${second}`;
            }
        }

        return d.toLocaleString();
    }

    public static convertStringToDdate(dateString: string, region: string): Date {
        let f: string = dateTime.getRegionDateFormat(region);
        let d: Date = new Date();
        let values: any[] = [];
        switch (f) {
            case "MM/dd/yyyy":
                values = dateString.split('/');
                d = new Date(+values[2], values[0] - 1, +values[1]);
                break;
            case "dd/MM/yyyy":
                values = dateString.split('/');
                d = new Date(+values[2], values[1] - 1, +values[0]);
                break;
            default:
                // yyyy-MM-dd format
                values = dateString.split('-');
                d = new Date(+values[2], values[1] - 1, +values[0]);
                break;
        }
        return d;
    }

    public static getShortDateString(dateString: string, region: string): string {
        let f: string = dateTime.getRegionDateFormat(region);
        let d: string = dateString;
        let values: string[] = [];
        switch (f) {
            case "MM/dd/yyyy":
            case "dd/MM/yyyy":
                values = dateString.split('/');
                d = `${values[0]}/${values[1]}/${values[2].substring(2)}`;
                break;
            default:
                // yyyy-MM-dd format
                values = dateString.split('-');
                d = `${values[0].substring(2)}/${values[1]}/${values[2]}`;
                break;
        }
        return d;
    }

    public static toDateString(arg, withTime = true): string {
        if (arg && (arg instanceof Date || arg.length)) {
            let d = new Date(arg);
            let date = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
            let month = (d.getMonth() + 1) > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
            if (withTime == false) {
                return `${d.getFullYear()}-${month}-${date} 00:00:00`;
            }

            let hour = d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`;
            let minute = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`;
            let second = d.getSeconds() > 9 ? d.getSeconds() : `0${d.getSeconds()}`;
            return `${d.getFullYear()}-${month}-${date} ${hour}:${minute}:${second}`;
        }

        return arg;
    }

    // get only date part as string e.g 2020-01-20
    public static getDateString(arg): string {
        if (arg && (arg instanceof Date || arg.length)) {
            let d = new Date(arg);
            let date = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
            let month = (d.getMonth() + 1) > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
            return `${d.getFullYear()}-${month}-${date}`;
        }
        return arg;
    }

    public static getMonthName(date: Date, getShortName: boolean): string {
        let monthNames: string[] = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        let name: string = monthNames[date.getMonth()];
        return getShortName ? name.substring(0, 3) : name;
    }

    public static getDateUtc(date?: Date): number {
        if (!date) {
            var date = new Date();
        }
        var utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
            date.getUTCDate(), date.getUTCHours(),
            date.getUTCMinutes(), date.getUTCSeconds());
        return utc;
    }
}