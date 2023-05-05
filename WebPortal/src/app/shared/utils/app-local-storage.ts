export class AppLocalStorage {

    static getItem(key: string): string {
        return localStorage.getItem(key);
    }

    static setItem(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    static removeItem(key: string) {
        localStorage.removeItem(key);
    }

    static accessToken: string = "AccessToken";

    static setAccessToken(value: string) {
        localStorage.setItem(this.accessToken, value);
    }

    static getAccessToken(): string {
        return localStorage.getItem(this.accessToken);
    }

    static codeVerifier: string = "codeVerifier";

    static setCodeVerifier(value: string) {
        localStorage.setItem(this.codeVerifier, value);
    }

    static getCodeVerifier(): string {
        return localStorage.getItem(this.codeVerifier);
    }
}