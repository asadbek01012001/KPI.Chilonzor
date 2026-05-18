import { useEffect, useState } from "react";
import { useReportContext } from "../../api/reports/ReportApiContext";
import { DatePicker } from "../form/DatePickerField";
import { CustomInput } from "../form/InputField";
import { ReportBaseTable } from "../tables/ReportBaseTable";
import { useDirectionContext } from "../../api/directions/DirectionApiContext";

import TabPage from "../tabs/TabPage";
import CustomButton from "../ui/CustomButton";
import Loading from "../ui/Loading";
import moment from "moment";

export default function ReportsTab() {
  const startDayFilter = new Date(2026, 0, 19);
  const todayForFilter = new Date();

  const [directions, setDirections] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(startDayFilter);
  const [endDate, setEndDate] = useState<Date | null>(todayForFilter);
  const [loading, setLoading] = useState(false);

  const { ReportApi } = useReportContext();
  const { DirectionApi } = useDirectionContext();

  useEffect(() => {
    DirectionApi.getAll()
      .then((resDirections) => setDirections(resDirections))
      .catch((e) => console.log(e));
  }, [DirectionApi]);

  useEffect(() => {
    setLoading(true);
    ReportApi.getMahallaReport({
      from: moment(startDate).format("YYYY-MM-DD"),
      to: moment(endDate).format("YYYY-MM-DD"),
      ...(searchValue ? { search: searchValue } : {}),
    })
      .then((resReport) => setData(resReport))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, [ReportApi, startDate, endDate, searchValue]);

  return (
    <TabPage
      headerCompoonent={
        <div className="d-flex justify-content-between align-items-center">
          <CustomButton
            variant="primary"
            label={`"Excel" да юклаш`}
            className="px-4"
            onClick={() => {
              const fileName = `${moment(startDate).format("DD-MM-YYYY")}_${moment(endDate).format("DD-MM-YYYY")}`;
              ReportApi.getExcelReport(
                {
                  from: moment(startDate).format("YYYY-MM-DD"),
                  to: moment(endDate).format("YYYY-MM-DD"),
                },
                fileName,
              )
                .then((res) => console.log(res))
                .catch((e) => console.log(e));
            }}
          />
          <div className="d-flex gap-2">
            <CustomInput
              width="400"
              placeholder="Қидириш..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <DatePicker
              placeholder="Бошланғич сана"
              value={startDate}
              onChange={(date) => setStartDate(date)}
            />
            <DatePicker
              placeholder="Охирги сана"
              value={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </div>
        </div>
      }
    >
      {loading ? (
        <Loading />
      ) : (
        <ReportBaseTable
          onSelectDistrict={(name) => console.log(name)}
          directions={directions}
          tableData={data}
        />
      )}
    </TabPage>
  );
}
