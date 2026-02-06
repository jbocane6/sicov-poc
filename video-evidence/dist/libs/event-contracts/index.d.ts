export declare enum EvidenceType {
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    TRANSCRIPT = "TRANSCRIPT"
}
export interface EvidenceStoredEvent {
    eventId: string;
    inspectionId: string;
    evidenceType: EvidenceType;
    filePath: string;
    createdAt: string;
}
export interface SyncAck {
    status: 'RECEIVED' | 'ERROR';
    reason?: string;
}
