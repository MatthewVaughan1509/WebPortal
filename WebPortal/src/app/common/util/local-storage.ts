export class LocalStorage {
    private static key = "defaultPpmInsights";
    static keyPlant = `${this.key}PlantId`;
    static keyRegion = `${this.key}RegionId`;
    static keyEventCategory = `${this.key}EventCategoryId`;

    public static setRegionId(regionId: number): void {
        localStorage.setItem(this.keyRegion, regionId.toString());
    }

    public static getRegionId(): number {
        if (localStorage.getItem(this.keyRegion) !== null) {
            return parseInt(localStorage.getItem(this.keyRegion));
        }
        return undefined;
    }

    public static setPlantId(plantId: number): void {
        localStorage.setItem(this.keyPlant, plantId.toString());
    }

    public static getPlantId(): number {
        if (localStorage.getItem(this.keyPlant) !== null) {
            return parseInt(localStorage.getItem(this.keyPlant));
        }
        return undefined;
    }

    public static setEventCategoryId(eventCategoryId: number): void {
        localStorage.setItem(this.keyEventCategory, eventCategoryId.toString());
    }

    public static getEventCategoryId(): number {
        if (localStorage.getItem(this.keyEventCategory) !== null) {
            return parseInt(localStorage.getItem(this.keyEventCategory));
        }
        return undefined;
    }
}