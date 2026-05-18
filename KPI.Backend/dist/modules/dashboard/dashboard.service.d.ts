export declare const dashboardService: {
    getMahalla: (regionId: string, from?: string, to?: string) => Promise<{
        region_id: any;
        region_name: any;
        sector: any;
        kpi_total: number;
        total_score: number;
        average_rank: number;
        directions: {
            direction_id: any;
            score: number;
            rank: number;
        }[];
        crimes: {
            total_crimes: number;
            minor_crimes: number;
            medium_crimes: number;
            serious_crimes: number;
            critical_crimes: number;
            minor_crimes_score: number;
            medium_crimes_score: number;
            serious_crimes_score: number;
            critical_crimes_score: number;
            crimes_total_score: number;
        };
        emergency102: {
            total_calls_102: number;
            call_pi: number;
            iio_complaint: number;
            calls_102_score: number;
            pi_call_score: number;
            iio_complaint_score: number;
            em_total_score: number;
        };
    }>;
    getAllMahalla: (from?: string, to?: string, sector?: number) => Promise<{
        region_id: any;
        region_name: any;
        sector: any;
        kpi_total: number;
        total_score: number;
        overall_rank: number;
        average_rank: number;
    }[]>;
};
//# sourceMappingURL=dashboard.service.d.ts.map