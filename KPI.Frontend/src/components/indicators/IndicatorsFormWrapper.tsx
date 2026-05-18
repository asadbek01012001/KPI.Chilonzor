import { useCallback, useEffect, useState } from "react";
import { useIndicatorContext } from "../../api/indicators/IndicatorApiContext";
import { useParams } from "react-router-dom";
import { showToast } from "../ui/Toast";

import IndicatorsForm from "./IndicatorsForm";

interface Props {
  readonly selectedIndicator: string;
  readonly defaultDirectionId: string;
  readonly onDone?: () => void;
}

export default function IndicatorsFormWrapper({ selectedIndicator, defaultDirectionId, onDone }: Props) {
  const { tab = defaultDirectionId } = useParams();
  const [initialValues, setInitialValues] = useState<any>({
    name: "",
    score: "",
    index: "",
    is_subtraction: false,
  });

  const { IndicatorApi } = useIndicatorContext();

  useEffect(() => {
    if (selectedIndicator) {
      IndicatorApi.getById(selectedIndicator)
        .then((res) => setInitialValues({ ...res, score: String(res.score ?? ""), index: String(res.index ?? "") }))
        .catch(console.log);
    } else {
      setInitialValues({ name: "", score: "", index: "", is_subtraction: false });
    }
  }, [IndicatorApi, selectedIndicator]);

  const onSubmit = useCallback(
    (value: any) => {
      const json = {
        ...value,
        score: Number(value.score),
        index: value.index !== "" ? Number(value.index) : undefined,
        is_subtraction: !!value.is_subtraction,
      };

      const request = selectedIndicator
        ? IndicatorApi.update(selectedIndicator, json)
        : IndicatorApi.create({ ...json, direction_id: tab, parent_id: null });

      request
        .then(() => {
          showToast(selectedIndicator ? "Кўрсаткич янгиланди" : "Кўрсаткич қўшилди", "success");
          onDone?.();
        })
        .catch(() => showToast("Хатолик юз берди", "error"));
    },
    [selectedIndicator, IndicatorApi, tab, onDone],
  );

  return (
    <IndicatorsForm
      initialValues={initialValues}
      setInitialValues={setInitialValues}
      onSubmit={onSubmit}
    />
  );
}
