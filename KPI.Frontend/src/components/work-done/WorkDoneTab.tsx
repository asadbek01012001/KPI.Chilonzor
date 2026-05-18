import { useEffect, useState, useCallback } from "react";
import "../ui/assets/custom_button.scss";
import { DatePicker } from "../form/DatePickerField";
import { ReportBaseTable } from "../tables/ReportBaseTable";
import { WorkDoneBaseTable } from "../tables/WorkDoneBaseTable";
import { useDirectionContext } from "../../api/directions/DirectionApiContext";
import { useWorkDoneContext } from "../../api/work-done/WorkDoneApiContext";
import { useIndicatorValueContext } from "../../api/indicator-values/IndicatorValueApiContext";
import { useReportContext } from "../../api/reports/ReportApiContext";

import TabPage from "../tabs/TabPage";
import Loading from "../ui/Loading";
import moment from "moment";

export default function WorkDoneTab() {
  const startDayFilter = new Date(2026, 0, 19);
  const todayForFilter = new Date();

  const [isSingleDay, setIsSingleDay] = useState(false);

  // Range mode state
  const [startDate, setStartDate] = useState<Date | null>(startDayFilter);
  const [endDate, setEndDate]     = useState<Date | null>(todayForFilter);
  const [rangeData, setRangeData] = useState<any[]>([]);

  // Single day mode state
  const [singleDate, setSingleDate]     = useState<Date | null>(new Date());
  const [indicators, setIndicators]     = useState<any[]>([]);
  const [regions, setRegions]           = useState<any[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [directions, setDirections] = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);

  const { DirectionApi }       = useDirectionContext();
  const { WorkDoneApi }        = useWorkDoneContext();
  const { IndicatorValueApi }  = useIndicatorValueContext();
  const { ReportApi }          = useReportContext();

  // Yo'nalishlarni yuklash
  useEffect(() => {
    DirectionApi.getAll()
      .then((res) => setDirections(res))
      .catch((e) => console.log(e));
  }, [DirectionApi]);

  // Range mode: hisobot jadvali
  useEffect(() => {
    if (isSingleDay || !startDate || !endDate) return;
    setLoading(true);
    ReportApi.getMahallaReport({
      from: moment(startDate).format("YYYY-MM-DD"),
      to:   moment(endDate).format("YYYY-MM-DD"),
    })
      .then((res) => setRangeData(res))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, [ReportApi, startDate, endDate, isSingleDay]);

  // Single day mode: indikator qiymatlari
  const fetchSingleDay = useCallback(async () => {
    if (!isSingleDay || !directions.length || !singleDate) return;
    setLoading(true);
    try {
      const dateStr = moment(singleDate).format("YYYY-MM-DD");
      const results = await Promise.allSettled(
        directions.map((dir: any) =>
          WorkDoneApi.getByDirection(dir.id, { from: dateStr, to: dateStr })
        )
      );

      const allIndicators: any[] = [];
      let regList: any[] = [];

      results.forEach((res, idx) => {
        if (res.status !== "fulfilled" || !Array.isArray(res.value)) return;
        const dir = directions[idx];
        res.value.forEach((ind: any) => {
          allIndicators.push({ ...ind, direction_id: dir.id });
        });
        if (!regList.length && res.value[0]?.regions?.length) {
          regList = res.value[0].regions.map((r: any) => ({
            id:   r.region_id,
            name: r.region_name,
          }));
        }
      });

      setIndicators(allIndicators);
      setRegions(regList);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [isSingleDay, singleDate, directions, WorkDoneApi]);

  useEffect(() => {
    fetchSingleDay();
  }, [fetchSingleDay]);

  // Katakni tahrirlash
  const handleCellChange = useCallback(
    async (indicatorId: string, regionId: string, maxScore: number, value: number | null) => {
      if (!singleDate) return;
      const ind = indicators.find((d: any) => d.indicator_id === indicatorId);
      if (!ind?.direction_id) return;
      try {
        await IndicatorValueApi.bulkCreate([{
          indicator_id: indicatorId,
          direction_id: ind.direction_id,
          region_id:    regionId,
          score:        maxScore,
          value:        value ?? 0,
          date:         moment(singleDate).format("YYYY-MM-DD"),
        }]);
        await fetchSingleDay();
      } catch (e) {
        console.log(e);
      }
    },
    [singleDate, indicators, IndicatorValueApi, fetchSingleDay]
  );

  // Kunni o'chirish
  const handleDelete = async () => {
    if (!singleDate) return;
    const dateStr = moment(singleDate).format("YYYY-MM-DD");
    if (!window.confirm(`${dateStr} sanasidagi barcha маълумотларni o'chirasizmi?`)) return;
    setDeleteLoading(true);
    try {
      await IndicatorValueApi.removeByDate(dateStr);
      await fetchSingleDay();
    } catch (e) {
      console.log(e);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <TabPage
      headerCompoonent={
        <div className="d-flex justify-content-between align-items-center gap-3">
          {/* Mode tugmalari */}
          <div className="d-flex align-items-center gap-2">
            <button
              className={`app-btn ${!isSingleDay ? "app-btn--primary" : "app-btn--secondary"} px-4`}
              onClick={() => setIsSingleDay(false)}
            >
              Вақт оралиғи
            </button>
            <button
              className={`app-btn ${isSingleDay ? "app-btn--primary" : "app-btn--secondary"} px-4`}
              onClick={() => setIsSingleDay(true)}
            >
              Бир кун
            </button>
          </div>

          {/* Date picker(lar) */}
          <div className="d-flex align-items-center gap-2">
            {isSingleDay ? (
              <>
                <DatePicker
                  placeholder="Сана"
                  value={singleDate}
                  onChange={(date) => setSingleDate(date)}
                />
                <button
                  className="app-btn app-btn--danger px-4"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "..." : "Ўчириш"}
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      }
    >
      {loading ? (
        <Loading />
      ) : isSingleDay ? (
        <WorkDoneBaseTable
          directions={indicators}
          tableData={regions}
          onCellChange={handleCellChange}
        />
      ) : (
        <ReportBaseTable
          onSelectDistrict={() => {}}
          directions={directions}
          tableData={rangeData}
        />
      )}
    </TabPage>
  );
}
