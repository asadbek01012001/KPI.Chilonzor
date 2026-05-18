import { useCallback, useEffect, useState } from "react";
import { useDashboardContext } from "../../api/dashboard/DashboardApiContext";

import DashboardDirectionsTable from "../directions/DashboardDirectionsTable";
import DashboardIndicatorTable from "../indicators/DashboardIndicatorsTable";
import DashbaordRegionsTable from "../regions/DashboardRegionsTable";
import Loading from "../ui/Loading";
import moment from "moment";

interface Props {
  readonly startDate?: Date | null;
  readonly endDate?: Date | null;
}

export default function DashboardDirectionsTab({ startDate, endDate }: Props) {
  const [activeDirection, setActiveDirection] = useState("");
  const [activeRegion, setAactiveRegion] = useState("");

  const [directions, setDirections] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { DashboardApi } = useDashboardContext();

  useEffect(() => {
    setLoading(true);
    DashboardApi.getDirections()
      .then((resDirection) => {
        if (resDirection.length > 0) {
          setActiveDirection(resDirection[0].direction_id);
          setDirections(resDirection);
          DashboardApi.getRegionsByDirection(resDirection[0].direction_id, {
            from: moment(startDate).format("YYYY-MM-DD"),
            to: moment(endDate).format("YYYY-MM-DD"),
          }).then((resRegion) => {
            if (resRegion.length > 0) {
              setRegions(resRegion);
              setAactiveRegion(resRegion[0].region_id);

              DashboardApi.getIndicatorsByDirectionAndRegion(
                resDirection[0].direction_id,
                resRegion[0].region_id,
                {
                  from: moment(startDate).format("YYYY-MM-DD"),
                  to: moment(endDate).format("YYYY-MM-DD"),
                },
              ).then((resInidicators) => setIndicators(resInidicators));
            }
          });
        }
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [DashboardApi, startDate, endDate]);

  const selectDireciton = useCallback(
    (id: string) => {
      DashboardApi.getRegionsByDirection(id, {
        from: moment(startDate).format("YYYY-MM-DD"),
        to: moment(endDate).format("YYYY-MM-DD"),
      }).then((resRegion) => {
        if (resRegion.length > 0) {
          setRegions(resRegion);
          setAactiveRegion(resRegion[0].region_id);
          setActiveDirection(id);

          DashboardApi.getIndicatorsByDirectionAndRegion(
            id,
            resRegion[0].region_id,
            {
              from: moment(startDate).format("YYYY-MM-DD"),
              to: moment(endDate).format("YYYY-MM-DD"),
            },
          ).then((resInidicators) => setIndicators(resInidicators));
        }
      });
    },
    [DashboardApi, startDate, endDate],
  );

  const selectRegion = useCallback(
    (id: string) => {
      DashboardApi.getIndicatorsByDirectionAndRegion(activeDirection, id).then(
        (resInidicators) => {
          if (resInidicators.length > 0) {
            setIndicators(resInidicators);
            setAactiveRegion(id);
          }
        },
      );
    },
    [DashboardApi, activeDirection],
  );

  if (loading) return <Loading />;

  return (
    <div className="row h-100">
      <div className="col-12 col-md-3 h-100">
        <DashboardDirectionsTable
          items={directions}
          activeId={activeDirection}
          setRegion={selectDireciton}
        />
      </div>
      <div className="col-12 col-md-4 h-100">
        <DashbaordRegionsTable
          title="Маҳаллалар"
          average={regions?.length}
          rows={regions}
          activeId={activeRegion}
          setRegion={selectRegion}
        />
      </div>
      <div className="col-12 col-md-5 h-100">
        <DashboardIndicatorTable
          title="Кўрсаткичлар"
          average={indicators?.length}
          rows={indicators}
        />
      </div>
    </div>
  );
}
