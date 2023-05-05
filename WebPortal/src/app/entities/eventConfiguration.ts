export class EventConfiguration {
    Id: number;
    Name: string;
    PlantId: number;
    EquipmentTagId: number;
    EventCategoryId: number;
    EventSourceId: number | null;
    StartIp21Tag: string;
    EndIp21Tag: string;
    StartConditionId: number | null;
    EndConditionId: number | null;
    InsertedBy: string | null;
    InsertedOn: string;
    ModifiedBy: string | null;
    ModifiedOn: string | null;
}
