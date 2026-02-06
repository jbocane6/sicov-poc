interface GatewayPayload {
    filePath: string;
    inspectionId: string;
    evidenceType: 'VIDEO' | 'AUDIO';
}
export declare class VideoGatewayController {
    receiveFile(payload: GatewayPayload): Promise<{
        status: string;
        newPath: string;
        message?: undefined;
    } | {
        status: string;
        message: any;
        newPath?: undefined;
    }>;
}
export {};
