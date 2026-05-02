import { useCallback } from "react";
import { CustomInput } from "../form/InputField";
import { CustomSelect } from "../form/SelectField";
import AppButton from "../ui/CustomButton";
import { update } from "immupdate";
import "./assets/usersForm.scss";

interface Props {
  readonly initialValues: any;
  readonly setInitialValues: (value: any) => void;
  readonly roleOptions: Array<{ value: string; label: string }>;
  readonly statusOptions: Array<{ value: string; label: string }>;
  readonly loading?: boolean;
  readonly submitting?: boolean;
  readonly isEditMode?: boolean;
  readonly onSubmit: (value: any) => void;
}

export default function UsersForm({
  initialValues,
  setInitialValues,
  roleOptions,
  statusOptions,
  loading = false,
  submitting = false,
  isEditMode = false,
  onSubmit,
}: Props) {
  const onChangeName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInitialValues((prev: any) =>
        update(prev, {
          name: event.target.value,
        }),
      );
    },
    [setInitialValues],
  );

  const onChangeEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInitialValues((prev: any) =>
        update(prev, {
          email: event.target.value,
        }),
      );
    },
    [setInitialValues],
  );

  const onChangePassword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInitialValues((prev: any) =>
        update(prev, {
          password: event.target.value,
        }),
      );
    },
    [setInitialValues],
  );

  const onChangeRole = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setInitialValues((prev: any) =>
        update(prev, {
          role: event.target.value,
        }),
      );
    },
    [setInitialValues],
  );

  const onChangeStatus = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setInitialValues((prev: any) =>
        update(prev, {
          is_active: event.target.value === "true",
        }),
      );
    },
    [setInitialValues],
  );

  const handleSubmit = useCallback(() => {
    onSubmit(initialValues);
  }, [onSubmit, initialValues]);

  return (
    <div className="row p-4">
      <div className="col-6">
        <CustomInput
          name="name"
          type="text"
          placeholder="Исми шарифи"
          label="Исми шарифи"
          value={initialValues.name}
          onChange={onChangeName}
          disabled={loading || submitting}
        />
      </div>

      <div className="col-6">
        <CustomInput
          name="email"
          type="email"
          placeholder="Электрон почта"
          label="Электрон почта"
          value={initialValues.email}
          onChange={onChangeEmail}
          disabled={loading || submitting}
        />
      </div>

      {!isEditMode && (
        <div className="col-6 mt-3">
          <CustomInput
            name="password"
            type="password"
            placeholder="Парол"
            label="Парол"
            value={initialValues.password}
            onChange={onChangePassword}
            disabled={loading || submitting}
          />
        </div>
      )}

      <div className="col-6 mt-3 custom-select-wrapper">
        <CustomSelect
          name="role"
          label="Роль"
          options={roleOptions}
          value={initialValues.role}
          onChange={onChangeRole}
          placeholder="Рольни танланг"
          disabled={loading || submitting}
        />
      </div>

      <div className="col-6 mt-3 custom-select-wrapper">
        <CustomSelect
          name="is_active"
          label="Фаол (актив)"
          options={statusOptions}
          value={String(initialValues.is_active)}
          onChange={onChangeStatus}
          placeholder="Холатни танланг"
          disabled={loading || submitting}
        />
      </div>

      <div className="col-12 mt-5">
        <AppButton
          label={
            submitting ? "Юборилмоқда..." : isEditMode ? "Янгилаш" : "Сақлаш"
          }
          variant="primary"
          className="w-100"
          onClick={handleSubmit}
          disabled={loading || submitting}
        />
      </div>
    </div>
  );
}
