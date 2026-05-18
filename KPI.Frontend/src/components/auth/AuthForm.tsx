import "./assets/auth_form.scss";
import "../ui/assets/custom_button.scss";
import { Form, Formik, useField } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { CustomInput } from "../form/InputField";
import { LoginValues } from "./AuthFormWrapper";

function AuthInput({
  label,
  name,
  width: _width,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const [field, meta] = useField(name);
  return (
    <div>
      <CustomInput label={label} {...field} {...rest} />
      {meta.touched && meta.error && (
        <div style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>
          {meta.error}
        </div>
      )}
    </div>
  );
}

interface Props {
  readonly initialValues: LoginValues;
  readonly onSubmit: (value: LoginValues) => void;
}

export default function AuthForm({ initialValues, onSubmit }: Props) {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    email: Yup.string().required(t("auth.usernameRequired")),
    password: Yup.string().required(t("auth.passwordRequired")),
  });

  return (
    <div className="auth_form_wrapper">
      <div className="auth_org_sub">{t("auth.system")}</div>
      <div className="auth_divider">
        <span className="auth_divider_line" />
        <span className="auth_divider_text">{t("auth.loginTitle")}</span>
        <span className="auth_divider_line" />
      </div>
      <div className="auth_form_body">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="w-100">
            <AuthInput
              name="email"
              label={t("auth.username")}
              placeholder={t("auth.usernamePlaceholder")}
            />
            <div className="mt-4">
              <AuthInput
                name="password"
                label={t("auth.password")}
                placeholder={t("auth.passwordPlaceholder")}
                type="password"
              />
            </div>
            <div className="mt-5">
              <button type="submit" className="app-btn app-btn--primary w-100">
                {t("auth.signIn")}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
      <div className="auth_footer_note">{t("auth.copyright")}</div>
    </div>
  );
}
