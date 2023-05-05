export class IngestionPlantMetric {
    Id: number;
    PlantMetricId: number;
    MetricGroupName: string | null;
    MetricName: string | null;
    InActive: boolean;
    IngestionFrequencyId: number;
    IngestionIntervalId: number;
    LastIngestedTimeStamp: string | null;
    LastProcessedTimeStamp: Date;
    IngestionServiceMessage: string | null;
    InsertedBy: string | null;
    InsertedOn: Date;
    ModifiedBy: string | null;
    ModifiedOn: Date | null;
}