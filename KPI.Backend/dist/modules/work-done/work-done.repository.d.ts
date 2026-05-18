export declare const workDoneRepository: {
    getByDirection: (directionId: string, from?: string, to?: string) => Promise<{
        indicator_id: any;
        indicator_name: any;
        parent_id: any;
        max_score: number;
        regions: {
            region_id: any;
            region_name: any;
            sector: any;
            score: number;
            value: number;
        }[];
    }[]>;
    getByDirectionAndIndicator: (directionId: string, indicatorId: string, from?: string, to?: string) => Promise<{
        indicator_id: any;
        indicator_name: any;
        parent_id: any;
        max_score: number;
        regions: {
            region_id: any;
            region_name: any;
            sector: any;
            score: number;
            value: number;
        }[];
    } | null>;
};
//# sourceMappingURL=work-done.repository.d.ts.map