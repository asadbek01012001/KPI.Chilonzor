import axios from "axios";
import { AutoMapper } from "../../utils/mapper";
import { CrimesResponse } from "./its.dto";

async function getToken() {
  const res = await axios.post("http://10.190.4.44:7085/api/authenticate", {
    username: "chilonzorsituation",
    password: "Ch_situation2026$$",
  });

  return res.data.id_token;
}

export const itsService = {
  getAll: async (q: any): Promise<any> => {
    const body = {
      regionId: 10,
      districtId: 1288,
      startDate: "17.01.2026",
      endDate: "13.04.2026",
    };

    const token = await getToken();

    const res = await axios.post(
      "http://10.190.4.44:7085/api/v1/integration/area/get-area-report",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  },
};
