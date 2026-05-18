"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const dashboard_repository_1 = require("./dashboard.repository");
const response_1 = require("../../utils/response");
const dates = (req) => ({
    from: req.query.from,
    to: req.query.to,
});
exports.dashboardController = {
    getMahalla: async (req, res, next) => {
        try {
            const { from, to } = dates(req);
            const region_id = req.query.region_id;
            if (!region_id) {
                const sector = req.query.sector ? parseInt(req.query.sector) : undefined;
                (0, response_1.sendSuccess)(res, await dashboard_repository_1.dashboardRepository.getAllMahalla(from, to, sector), 'Barcha mahallalar');
                return;
            }
            const data = await dashboard_repository_1.dashboardRepository.getMahalla(region_id, from, to);
            if (!data) {
                res.status(404).json({ success: false, message: 'Mahalla topilmadi' });
                return;
            }
            (0, response_1.sendSuccess)(res, data, 'Mahalla dashboard');
        }
        catch (err) {
            next(err);
        }
    },
    topCrimes: async (req, res, next) => {
        try {
            const { from, to } = dates(req);
            (0, response_1.sendSuccess)(res, await dashboard_repository_1.dashboardRepository.topCrimes(from, to), "Jinoyatchilik bo'yicha mahallalar reytingi");
        }
        catch (err) {
            next(err);
        }
    },
    top102: async (req, res, next) => {
        try {
            const { from, to } = dates(req);
            (0, response_1.sendSuccess)(res, await dashboard_repository_1.dashboardRepository.top102(from, to), "102 bo'yicha mahallalar reytingi");
        }
        catch (err) {
            next(err);
        }
    },
    sectorSummary: async (req, res, next) => {
        try {
            const { from, to } = dates(req);
            (0, response_1.sendSuccess)(res, await dashboard_repository_1.dashboardRepository.sectorSummary(from, to), 'Sektor statistikasi');
        }
        catch (err) {
            next(err);
        }
    },
    sectorRegions: async (req, res, next) => {
        try {
            const { from, to } = dates(req);
            (0, response_1.sendSuccess)(res, await dashboard_repository_1.dashboardRepository.sectorRegions(from, to), "Sektorlar bo'yicha MFYlar");
        }
        catch (err) {
            next(err);
        }
    },
    directionsWithCount: async (req, res, next) => {
        try {
            const { from, to } = dates(req);
            (0, response_1.sendSuccess)(res, await dashboard_repository_1.dashboardRepository.directionsWithCount(from, to), "Yo'nalishlar va indikatorlar soni");
        }
        catch (err) {
            next(err);
        }
    },
    regionsByDirection: async (req, res, next) => {
        try {
            const { from, to } = dates(req);
            const { directionId } = req.params;
            (0, response_1.sendSuccess)(res, await dashboard_repository_1.dashboardRepository.regionsByDirection(directionId, from, to), "Yo'nalish bo'yicha mahallalar reytingi");
        }
        catch (err) {
            next(err);
        }
    },
    indicatorsByDirectionAndRegion: async (req, res, next) => {
        try {
            const { from, to } = dates(req);
            const { directionId, regionId } = req.params;
            (0, response_1.sendSuccess)(res, await dashboard_repository_1.dashboardRepository.indicatorsByDirectionAndRegion(directionId, regionId, from, to), 'Indikatorlar bali');
        }
        catch (err) {
            next(err);
        }
    },
    regionSummary: async (req, res, next) => {
        try {
            const { from, to } = dates(req);
            const { regionId } = req.params;
            const data = await dashboard_repository_1.dashboardRepository.regionSummary(regionId, from, to);
            if (!data) {
                res.status(404).json({ success: false, message: 'Mahalla topilmadi' });
                return;
            }
            (0, response_1.sendSuccess)(res, data, "Mahalla umumiy ko'rsatkichlari");
        }
        catch (err) {
            next(err);
        }
    },
    info: async (req, res, next) => {
        try {
            const { from, to } = dates(req);
            (0, response_1.sendSuccess)(res, await dashboard_repository_1.dashboardRepository.info(from, to), "Dashboard umumiy ma\'lumotlar");
        }
        catch (err) {
            next(err);
        }
    },
    chartRegion: async (req, res, next) => {
        try {
            const { from, to } = dates(req);
            const { regionId } = req.params;
            if (!from || !to) {
                res.status(400).json({ success: false, message: "'from' va 'to' majburiy" });
                return;
            }
            (0, response_1.sendSuccess)(res, await dashboard_repository_1.dashboardRepository.chartRegion(regionId, from, to), 'MFY ball dinamikasi');
        }
        catch (err) {
            next(err);
        }
    },
    chartDirection: async (req, res, next) => {
        try {
            const { from, to } = dates(req);
            const { directionId } = req.params;
            if (!from || !to) {
                res.status(400).json({ success: false, message: "'from' va 'to' majburiy" });
                return;
            }
            (0, response_1.sendSuccess)(res, await dashboard_repository_1.dashboardRepository.chartDirection(directionId, from, to), "Yo'nalish ball dinamikasi");
        }
        catch (err) {
            next(err);
        }
    },
    chartDistrict: async (req, res, next) => {
        try {
            const { from, to } = dates(req);
            if (!from || !to) {
                res.status(400).json({ success: false, message: "'from' va 'to' majburiy" });
                return;
            }
            (0, response_1.sendSuccess)(res, await dashboard_repository_1.dashboardRepository.chartDistrict(from, to), "Tuman umumiy ball dinamikasi");
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=dashboard.controller.js.map