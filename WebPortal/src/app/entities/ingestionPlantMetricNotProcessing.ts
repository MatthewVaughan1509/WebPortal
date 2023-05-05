export class IngestionPlantMetricNotProcessing {
    Id: number;
    Region: string | null;
    Plant: string | null;
    MetricGroupName: string | null;
    MetricName: string | null;
    InActive: boolean;
    IngestionFrequency: string | null;
    DataSamplingInterval: string | null;
    Seconds: number;
    LastIngestedTimeStamp: Date | null;
    IngestionServiceMessage: string | null;
    DaysDelayed: number;
}