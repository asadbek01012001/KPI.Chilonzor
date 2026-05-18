import { useEffect, useState, useCallback } from "react";
import { DatePicker } from "../form/DatePickerField";
import { useCrimeContext } from "../../api/crimes/CrimeApiContext";
import moment from "moment";

import TabPage from "../tabs/TabPage";
import AppButton from "../ui/CustomButton";
import CrimesTable from "../tables/CrimesBaseTable";
import CrimesExcelReader from "./CrimesExcelReader";
import Loading from "../ui/Loading";

export default function CrimesTab() {
  const [data, setData] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 0, 19));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [isExcelOpen, setIsExcelOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { CrimeApi } = useCrimeContext();

  const loadData = useCallback(() => {
    setLoading(true);
    CrimeApi.getAll({
      limit: 100,
      from: moment(startDate).format("YYYY-MM-DD"),
      to: moment(endDate).format("YYYY-MM-DD"),
    })
      .then(({ rows, totals: tots }) => {
        setData(rows);
        setTotals(tots);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [CrimeApi, startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <TabPage
        headerCompoonent={
          <div className="d-flex justify-content-between align-items-center">
            <AppButton
              variant="secondary"
              label={`"Excel" дан юклаш`}
              className="px-4"
              onClick={() => setIsExcelOpen(true)}
            />
            <div className="d-flex gap-2">
              <DatePicker
                placeholder="Бошланғич сана"
                value={startDate}
                onChange={setStartDate}
              />
              <DatePicker
                placeholder="Охирги сана"
                value={endDate}
                onChange={setEndDate}
              />
            </div>
          </div>
        }
      >
        {loading ? (
          <Loading />
        ) : (
          <CrimesTable
            data={data}
            totals={totals}
            handleBlur={(v) => console.log(v)}
          />
        )}
      </TabPage>

      {isExcelOpen && (
        <CrimesExcelReader
          onClose={() => setIsExcelOpen(false)}
          onSaved={loadData}
        />
      )}
    </>
  );
}
