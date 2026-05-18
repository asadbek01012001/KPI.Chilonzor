"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itsService = void 0;
const axios_1 = __importDefault(require("axios"));
async function getToken() {
    const res = await axios_1.default.post("http://10.190.4.44:7085/api/authenticate", {
        username: "chilonzorsituation",
        password: "Ch_situation2026$$",
    });
    return res.data.id_token;
}
exports.itsService = {
    getAll: async (q) => {
        const body = {
            regionId: 10,
            districtId: 1288,
            startDate: "17.01.2026",
            endDate: "13.04.2026",
        };
        const token = await getToken();
        const res = await axios_1.default.post("http://10.190.4.44:7085/api/v1/integration/area/get-area-report", body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    },
};
//# sourceMappingURL=its.service.js.map