import { useParams } from "react-router-dom";
import { useIndicatorContext } from "../../api/indicators/IndicatorApiContext";
import { useCallback, useEffect, useState } from "react";
import { showToast } from "../ui/Toast";

import IndicatorsTable from "./IndicatorsTable";

interface Props {
  readonly defaultDirectionId: string;
  readonly onEdit: (id: string) => void;
}

export default function IndicatorsTableWrapper({ defaultDirectionId, onEdit }: Props) {
  const [indicators, setIndicators] = useState<any[]>([]);
  const { tab = defaultDirectionId } = useParams();
  const { IndicatorApi } = useIndicatorContext();

  const loadIndicators = useCallback(() => {
    IndicatorApi.getAll({ direction_id: tab, limit: 30 })
      .then(setIndicators)
      .catch(console.log);
  }, [IndicatorApi, tab]);

  useEffect(() => { loadIndicators(); }, [loadIndicators]);

  const handleDelete = useCallback((item: any) => {
    if (!window.confirm(`"${item.name}" ni o'chirasizmi?`)) return;
    IndicatorApi.remove(item.id)
      .then(() => {
        showToast(`"${item.name}" o'chirildi`, "success");
        loadIndicators();
      })
      .catch(() => showToast("O'chirishda xatolik", "error"));
  }, [IndicatorApi, loadIndicators]);

  return (
    <IndicatorsTable
      data={indicators}
      onDelete={handleDelete}
      onEdit={(item) => onEdit(item.id)}
    />
  );
}
