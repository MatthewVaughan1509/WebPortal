import { Params } from "@angular/router";

export class UrlParser {

    public params: Params = {};
    public urlWithoutQueryString: string = '';

    private remaining: string;
    private QUERY_PARAM_VALUE_RE = /^[^?&]+/;
    private QUERY_PARAM_RE = /^[^=?&]+/;

    constructor(url: string) {
        this.remaining = url;

        this.urlWithoutQueryString = url.indexOf('?') > 0 ? url.substring(0, url.indexOf('?')) : url;
        this.params = this.parseFragParams();
    }

    private parseFragParams(): Params {
        const params: Params = {};

        this.remaining = this.remaining.substring(this.remaining.indexOf('?'));

        if (this.consumeOptional('?')) {
            do {
                this.parseFragParam(params);
            } while (this.consumeOptional('&'));
        }
        return params;
    }

    private parseFragParam(params: Params): void {
        const key = this.matchQueryParams(this.remaining);
        if (!key) {
            return;
        }
        this.capture(key);
        let value: any = '';
        if (this.consumeOptional('=')) {
            const valueMatch = this.matchUrlQueryParamValue(this.remaining);
            if (valueMatch) {
                value = valueMatch;
                this.capture(value);
            }
        }

        const decodedKey = this.decodeQuery(key);
        const decodedVal = this.decodeQuery(value);

        if (params.hasOwnProperty(decodedKey)) {
            // Append to existing values
            let currentVal = params[decodedKey];
            if (!Array.isArray(currentVal)) {
                currentVal = [currentVal];
                params[decodedKey] = currentVal;
            }
            currentVal.push(decodedVal);
        } else {
            // Create a new value
            params[decodedKey] = decodedVal;
        }
    }

    private matchUrlQueryParamValue(str: string): string {
        const match = str.match(this.QUERY_PARAM_VALUE_RE);
        return match ? match[0] : '';
    }

    private matchQueryParams(str: string): string {
        const match = str.match(this.QUERY_PARAM_RE);
        return match ? match[0] : '';
    }


    private peekStartsWith(str: string): boolean {
        return this.remaining.startsWith(str);
    }

    private consumeOptional(str: string): boolean {
        if (this.peekStartsWith(str)) {
            this.remaining = this.remaining.substring(str.length);
            return true;
        }
        return false;
    }

    private capture(str: string): void {
        if (!this.consumeOptional(str)) {
            throw new Error(`Expected "${str}".`);
        }
    }

    private decodeQuery(s: string): string {
        return decodeURIComponent(s.replace(/\+/g, '%20'));
    }
}