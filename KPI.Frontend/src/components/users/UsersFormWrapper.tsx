import { useCallback, useEffect, useState } from "react";
import { useUserContext } from "../../api/users/UserApiContext";
import UsersForm from "./UsersForm";

interface Props {
  readonly userId: string;
  readonly onSuccess?: () => void;
}

interface Option {
  value: string;
  label: string;
}

export default function UsersFormWrapper({ userId, onSuccess }: Props) {
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    is_active: true,
  });

  const roleOptions: Option[] = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "Foydalanuvchi" },
  ];

  const statusOptions: Option[] = [
    { value: "true", label: "Актив" },
    { value: "false", label: "Ноактив" },
  ];

  console.log("TEST_STATUS:", statusOptions);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { UserApi } = useUserContext();

  useEffect(() => {
    if (!userId) {
      setInitialValues({
        name: "",
        email: "",
        password: "",
        role: "user",
        is_active: true,
      });
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await UserApi.getById(userId);

        setInitialValues({
          name: user.name || "",
          email: user.email || "",
          password: "",
          role: user.role || "user",
          is_active: user.is_active ?? true,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [UserApi, userId]);

  const onSubmit = useCallback(
    async (values: any) => {
      try {
        setSubmitting(true);
        if (userId) {
          await UserApi.update(userId, {
            name: values.name,
            email: values.email,
          });
        } else {
          if (!values.password) {
            alert("Парол мажбурий!");
            setSubmitting(false);
            return;
          }

          await UserApi.create({
            name: values.name,
            email: values.email,
            password: values.password,
            role: values.role,
          });
        }

        onSuccess?.();
      } catch (error: any) {
        const errors = error.response?.data?.errors;
        if (errors?.length) {
          alert(
            `Xatolik:\n${errors.map((e: any) => `${e.field}: ${e.message}`).join("\n")}`,
          );
        } else {
          alert("Xatolik: " + (error.response?.data?.message || error.message));
        }
      } finally {
        setSubmitting(false);
      }
    },
    [UserApi, userId, onSuccess],
  );

  return (
    <UsersForm
      initialValues={initialValues}
      setInitialValues={setInitialValues}
      roleOptions={roleOptions}
      statusOptions={statusOptions}
      loading={loading}
      submitting={submitting}
      onSubmit={onSubmit}
      isEditMode={!!userId}
    />
  );
}
