import { useField } from "formik";

interface Option {
  label: string;
  value: string | number;
}

interface FormikSelectProps {
  label: string;
  name: string;
  options: Option[];
}

export const FormikSelect = ({
  label,
  options,
  ...props
}: FormikSelectProps) => {
  const [field, meta] = useField(props.name);

  return (
    <div>
      <label>{label}</label>
      <select {...field} {...props}>
        <option value="">Tanlang</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {meta.touched && meta.error && <div>{meta.error}</div>}
    </div>
  );
};
