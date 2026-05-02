import "./assets/input_control.scss";

import { useField } from "formik";

import cx from "classnames";

interface FormikInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  readonly inputClassName?: string;
}

export const FormikInput = ({
  label,
  inputClassName,
  ...props
}: FormikInputProps) => {
  const [field, meta] = useField(props.name);

  return (
    <div className="custom_formik_input_wrapper">
      {Boolean(label) && (
        <label
          className={cx("custom_formik_input_label", {
            error_label: Boolean(meta.touched && meta.error),
          })}
        >
          {label}
        </label>
      )}
      <input
        {...field}
        {...props}
        className={cx("custom_formik_input", {
          error_input_border: Boolean(meta.touched && meta.error),
          inputClassName,
        })}
        value={field.value ?? ""}
      />

      {meta.touched && meta.error && (
        <div className="custom_formik_error_label">{meta.error}</div>
      )}
    </div>
  );
};
