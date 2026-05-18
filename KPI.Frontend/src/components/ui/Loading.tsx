import "./assets/loading.scss";
import { useTranslation } from "react-i18next";

export default function Loading() {
  const { t } = useTranslation();
  return (
    <div className="loading-wrapper">
      <div className="spinner" />
      <h4 className="text-light mt-3">{t("common.loading")}</h4>
    </div>
  );
}
