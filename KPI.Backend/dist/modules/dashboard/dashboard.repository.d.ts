export declare const dashboardRepository: {
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
    } | null>;
    getAllMahalla: (from?: string, to?: string, sector?: number) => Promise<{
        region_id: any;
        region_name: any;
        sector: any;
        kpi_total: number;
        total_score: number;
        overall_rank: number;
        average_rank: number;
    }[]>;
    topCrimes: (from?: string, to?: string) => Promise<{
        region_id: any;
        region_name: any;
        sector: any;
        rank: number;
        total_crimes: number;
        minor_crimes: number;
        medium_crimes: number;
        serious_crimes: number;
        critical_crimes: number;
        penalty_score: number;
    }[]>;
    top102: (from?: string, to?: string) => Promise<{
        region_id: any;
        region_name: any;
        sector: any;
        rank: number;
        total_calls_102: number;
        call_pi: number;
        iio_complaint: number;
        penalty_score: number;
    }[]>;
    sectorSummary: (from?: string, to?: string) => Promise<{
        sector: number;
        region_count: number;
        kpi_score: number;
        crime_score: number;
        em_score: number;
    }[]>;
    sectorRegions: (from?: string, to?: string) => Promise<any[]>;
    directionsWithCount: (from?: string, to?: string) => Promise<{
        direction_id: any;
        direction_name: any;
        indicator_count: number;
    }[]>;
    regionsByDirection: (directionId: string, from?: string, to?: string) => Promise<{
        region_id: any;
        region_name: any;
        sector: any;
        total_score: number;
        rank: number;
    }[]>;
    indicatorsByDirectionAndRegion: (directionId: string, regionId: string, from?: string, to?: string) => Promise<{
        indicator_id: any;
        indicator_name: any;
        parent_id: any;
        is_subtraction: any;
        max_score: number;
        achieved_score: number;
        total_value: number;
    }[]>;
    regionSummary: (regionId: string, from?: string, to?: string) => Promise<{
        region_id: any;
        region_name: any;
        sector: any;
        region_rank: number;
        kpi_total: number;
        total_score: number;
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
        directions: {
            direction_id: any;
            direction_name: any;
            score: number;
            rank: number;
        }[];
    } | null>;
    info: (from?: string, to?: string) => Promise<{
        indicators: {
            parent_count: number;
            child_count: number;
            total_count: number;
        };
        regions_count: number;
        directions_count: number;
        avg_completion: number;
        leader: {
            region_id: any;
            region_name: any;
            total_score: number;
        } | null;
    }>;
    _buildIntervals(from: string, to: string): {
        intervals: {
            from: string;
            to: string;
            label: string;
        }[];
        intervalDays: number;
    };
    chartRegion: (regionId: string, from: string, to: string) => Promise<{
        region_id: string;
        interval_days: number;
        data: {
            label: string;
            from: string;
            to: string;
            kpi_score: number;
            total_score: number;
        }[];
    }>;
    chartDirection: (directionId: string, from: string, to: string) => Promise<{
        direction_id: string;
        direction_name: any;
        interval_days: number;
        data: {
            label: string;
            from: string;
            to: string;
            score: number;
        }[];
    }>;
    chartDistrict: (from: string, to: string) => Promise<{
        interval_days: number;
        data: {
            label: string;
            from: string;
            to: string;
            total_kpi: number;
            total_score: number;
        }[];
    }>;
};
//# sourceMappingURL=dashboard.repository.d.ts.map