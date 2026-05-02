import "./assets/auth_form.scss";
import { Form, Formik } from "formik";
import { FormikInput } from "../ui/FormikInput";
import { LoginValues } from "./AuthFormWrapper";
import * as Yup from "yup";
import Button from "../ui/Button";

const validationSchema = Yup.object({
  email: Yup.string().required("E-pochta majburiy"),
  password: Yup.string().required("Parol majburiy"),
});

interface Props {
  readonly initialValues: LoginValues;
  readonly onSubmit: (value: LoginValues) => void;
}

export default function AuthForm({ initialValues, onSubmit }: Props) {
  return (
    <div className="auth_form_wrapper">
      <div className="auth_form_title">ХУШ КЕЛИБСИЗ!</div>
      <div className="auth_form_input_group w-100 p-5">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="w-100">
            <div className="row">
              <div className="col-1" />
              <div className="col-10">
                <div className="row px-3">
                  <div className="col-12">
                    <FormikInput
                      name="email"
                      label="E-pochta manzil nomi"
                      placeholder="E-pochta manzil nomi"
                    />
                  </div>
                  <div className="col-12 mt-4">
                    <FormikInput
                      name="password"
                      label="Parol"
                      placeholder="Parol"
                    />
                  </div>
                  <div className="col-12 mt-5">
                    <Button className="w-100">Kirish</Button>
                  </div>
                </div>
              </div>
              <div className="col-1" />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
