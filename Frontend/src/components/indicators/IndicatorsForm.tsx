import { useCallback } from "react";
import { CustomInput } from "../form/InputField";
import { AutoResizeTextarea } from "../form/TextareaField";
import AppButton from "../ui/CustomButton";
import { update } from "immupdate";

interface Props {
  readonly initialValues: any;
  readonly setInitialValues: (value: any) => void;
  readonly onSubmit: (value: any) => void;
}

export default function IndicatorsForm({ initialValues, setInitialValues, onSubmit }: Props) {
  const onChangeName = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInitialValues((prev: any) => update(prev, { name: event.target.value }));
    },
    [setInitialValues],
  );

  const onChangeScore = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (/^\d*\.?\d*$/.test(event.target.value)) {
        setInitialValues((prev: any) => update(prev, { score: event.target.value }));
      }
    },
    [setInitialValues],
  );

  const onChangeIndex = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (/^\d*$/.test(event.target.value)) {
        setInitialValues((prev: any) => update(prev, { index: event.target.value }));
      }
    },
    [setInitialValues],
  );

  const onChangeSubtraction = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInitialValues((prev: any) => update(prev, { is_subtraction: event.target.checked }));
    },
    [setInitialValues],
  );

  return (
    <div className="row p-4">
      <div className="col-12">
        <AutoResizeTextarea
          placeholder="Кўрсаткич номи"
          label="Кўрсаткич номи"
          value={initialValues.name}
          onChange={onChangeName}
        />
      </div>
      <div className="col-6 mt-3">
        <CustomInput
          placeholder="Балл"
          label="Балл"
          value={initialValues.score}
          onChange={onChangeScore}
        />
      </div>
      <div className="col-6 mt-3">
        <CustomInput
          placeholder="Тартиб рақами"
          label="Индекс"
          value={initialValues.index ?? ""}
          onChange={onChangeIndex}
        />
      </div>
      <div className="col-12 mt-3">
        <div
          className="d-flex align-items-center gap-2"
          style={{
            padding: "10px 14px",
            background: "rgba(79,142,247,0.06)",
            border: "1px solid rgba(79,142,247,0.2)",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={() =>
            setInitialValues((prev: any) =>
              update(prev, { is_subtraction: !prev.is_subtraction }),
            )
          }
        >
          <input
            type="checkbox"
            id="is_subtraction"
            checked={!!initialValues.is_subtraction}
            onChange={onChangeSubtraction}
            style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#4f8ef7" }}
          />
          <label htmlFor="is_subtraction" style={{ cursor: "pointer", margin: 0, fontSize: "14px" }}>
            Айирма (is_subtraction) — болалар йиғиндиси асосийдан айирилади
          </label>
        </div>
      </div>
      <div className="col-12 mt-4">
        <AppButton label="Юбориш" variant="primary" className="w-100" onClick={() => onSubmit(initialValues)} />
      </div>
    </div>
  );
}
