export class objectUtils {

    public static isNullOrUndefined(object: any): object is null | undefined {
        return object == null || object == undefined;
    }

    public static isFunction(obj: any) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    public static deepCopy<T>(source: T): T {
        let copy;

        if (Array.isArray(source)) {
            copy = [];
            for (var i = 0, len = source.length; i < len; i++) {
                copy[i] = this.deepCopy(source[i]);
            }
            return copy as T;
        }

        if (source instanceof Date) {
            copy = new Date(source.getTime());
            return copy as T;
        }

        if (source && typeof source === 'object') {
            copy = Object.getOwnPropertyNames(source).reduce((o, prop) => {
                Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop));
                o[prop] = this.deepCopy(source[prop]);
                return o;
            }, Object.create(Object.getPrototypeOf(source)));
            return copy as T;
        }

        copy = source as T;
        return copy as T;
    }
}