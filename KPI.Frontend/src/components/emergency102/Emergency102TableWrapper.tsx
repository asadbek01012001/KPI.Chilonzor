import { useEffect, useState } from "react";
import { useEmergency102Context } from "../../api/emergency102/Emergency102ApiContext";
import moment from "moment";

import Emergency102Table from "../tables/Emergency102Table";
import Loading from "../ui/Loading";

interface Props {
  readonly startDate?: Date | null;
  readonly endDate?: Date | null;
}

export default function Emergency102TableWrapper({ startDate, endDate }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { Emergency102Api } = useEmergency102Context();

  useEffect(() => {
    setLoading(true);
    Emergency102Api.getAll({
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
  }, [Emergency102Api, startDate, endDate]);

  if (loading) return <Loading />;

  return (
    <Emergency102Table
      data={data}
      totals={totals}
      handleBlur={(v) => console.log(v)}
    />
  );
}
