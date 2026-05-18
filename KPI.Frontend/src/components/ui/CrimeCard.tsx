import React from "react";
import CrimeStatisticInfo from "./CrimeStatisticInfo";
import "./assets/crime_card.scss";
import { CloseIcon } from "./Modal";

interface MahallaDetailProps {
  region_name: string;
  region_rank: number;
  total_score: number;
  crimes: {
    critical_crimes: number;
    medium_crimes: number;
    minor_crimes: number;
    serious_crimes: number;
    crimes_total_score: number;
    critical_crimes_score: number;
    minor_crimes_score: number;
    medium_crimes_score: number;
    serious_crimes_score: number;
  };
  emergency102: {
    total_calls_102: number;
    call_pi: number;
    iio_complaint: number;
    calls_102_score: number;
    pi_call_score: number;
    iio_complaint_score: number;
  };
  directions: any[];
}

interface Props {
  readonly data: MahallaDetailProps;
  readonly onClose?: () => void;
}

export default function MahallaDetail({ data, onClose }: Props) {
  const formatValue = (val: number | null) => {
    if (val === null) return "";
    return val.toFixed(1).replace(".", ",");
  };

  const { emergency102, crimes, directions } = data;

  return (
    <div className="mdc-wrapper h-100">
      <div className="mdc-header d-flex justify-content-between">
        <div>
          <h2 className="mdc-header-title">{data.region_name}</h2>
          <div className="mdc-header-rank">
            <span className="mdc-header-rank-icon">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
            {formatValue(data.total_score)} балл | {data.region_rank} ўрин
          </div>
        </div>
        <div>
          <button className="eup-close" onClick={() => onClose && onClose()}>
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="mdc-body h-100">
        <div>
          <div className="mdc-section-label">Жиноят</div>
          <div className="mdc-cards-grid">
            <CrimeStatisticInfo
              icon="⚠️"
              name="Ижтимоий хавфи катта бўлмаган"
              iconVariant="orange"
              value={crimes?.minor_crimes}
              score={`${crimes?.minor_crimes_score}%`}
              barWidth={crimes?.minor_crimes * crimes?.minor_crimes_score}
            />
            <CrimeStatisticInfo
              icon="🏛"
              name="Унча оғир бўлмаган жиноят"
              iconVariant="blue"
              value={crimes?.medium_crimes}
              score={`${crimes?.medium_crimes_score}%`}
              barWidth={crimes?.medium_crimes * crimes?.medium_crimes_score}
            />
            <CrimeStatisticInfo
              icon="⚖️"
              name="Оғир жиноят"
              iconVariant="yellow"
              value={crimes?.serious_crimes}
              score={`${crimes?.serious_crimes_score}%`}
              barWidth={crimes?.serious_crimes * crimes?.serious_crimes_score}
            />
            <CrimeStatisticInfo
              icon="🔨"
              name="Ўта оғир жиноят ҳар бирига"
              iconVariant="red"
              value={crimes?.critical_crimes}
              score={`${crimes?.critical_crimes_score}%`}
              barWidth={crimes?.critical_crimes * crimes?.critical_crimes_score}
            />
          </div>
        </div>
        <div>
          <div className="mdc-section-label mdc-section-label--cyan">102</div>
          <div className="mdc-wide-card" style={{ marginBottom: 8 }}>
            <div className="mdc-wide-card-top">
              <div className="mdc-wide-card-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="3" y="3" width="8" height="8" rx="1" />
                  <rect x="13" y="3" width="8" height="8" rx="1" />
                  <rect x="3" y="13" width="8" height="8" rx="1" />
                  <rect x="13" y="13" width="8" height="8" rx="1" />
                </svg>
              </div>
              <span className="mdc-wide-card-label">Жами "102"</span>
            </div>
            <div className="mdc-wide-card-bottom">
              <span className="mdc-wide-pct">
                {emergency102.calls_102_score}%
              </span>
              <div className="mdc-wide-bar-wrap">
                <div
                  className="mdc-wide-bar"
                  style={{
                    width: `${emergency102.total_calls_102 * emergency102.calls_102_score}%`,
                  }}
                />
              </div>
              <span className="mdc-wide-val">
                {emergency102.total_calls_102}
              </span>
            </div>
          </div>
          <div className="mdc-small-cards-row">
            <div className="mdc-stat-card">
              <div className="mdc-stat-card-top">
                <span className="mdc-stat-icon mdc-stat-icon--blue">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <span className="mdc-stat-card-label">П.И ни чақириш</span>
              </div>
              <div className="mdc-stat-card-bottom">
                <span className="mdc-stat-pct">
                  -{emergency102.pi_call_score}%
                </span>
                <div className="mdc-stat-bar-wrap">
                  <div
                    className="mdc-stat-bar mdc-stat-bar--blue"
                    style={{
                      width: `${emergency102.call_pi * emergency102.pi_call_score}%`,
                    }}
                  />
                </div>
                <span className="mdc-stat-val">{emergency102.call_pi}</span>
              </div>
            </div>

            <div className="mdc-stat-card">
              <div className="mdc-stat-card-top">
                <span className="mdc-stat-icon mdc-stat-icon--orange">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </span>
                <span className="mdc-stat-card-label">ИИОдан норози</span>
              </div>
              <div className="mdc-stat-card-bottom">
                <span className="mdc-stat-pct">
                  -{emergency102.iio_complaint_score}%
                </span>
                <div className="mdc-stat-bar-wrap">
                  <div
                    className="mdc-stat-bar mdc-stat-bar--orange"
                    style={{
                      width: `${emergency102.iio_complaint * emergency102.iio_complaint_score}%`,
                    }}
                  />
                </div>
                <span className="mdc-stat-val">
                  {emergency102.iio_complaint}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mdc-table-wrap">
          <table className="mdc-table">
            <thead className="mdc-table-head">
              <tr>
                <th className="mdc-table-th">Йўналишлар</th>
                <th className="mdc-table-th">Балл</th>
                <th className="mdc-table-th">Ўрни</th>
              </tr>
            </thead>
            <tbody>
              {directions &&
                directions.map((row: any, i: number) => (
                  <tr
                    key={i}
                    className={`mdc-table-tr mdc-table-tr--${i % 2 === 0 ? "even" : "odd"}`}
                  >
                    <td className="mdc-table-td mdc-table-td--name">
                      {row.direction_name}
                    </td>
                    <td className="mdc-table-td mdc-table-td--score">
                      {formatValue(row.score)}
                    </td>
                    <td className="mdc-table-td mdc-table-td--rank">
                      {row.rank}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
