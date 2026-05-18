import React, { Fragment, useState } from "react";
import "./assets/report_table.scss";
import FullTBodyButton from "../ui/FullTbodyButton";
import FullTHeadButton from "../ui/FullTHeadButton";

interface RatingTableProps {
  onSelectDistrict: (name: string) => void;
  tableData?: any[];
  directions?: any[];
}

export function ReportBaseTable({
  onSelectDistrict,
  tableData,
  directions,
}: RatingTableProps) {
  const [isFullTBody, setIsFullTBody] = useState(false);
  const [isFullTHead, setIsFullTHead] = useState(false);

  const formatValue = (val: number | null) => {
    if (val === null) return "";
    return val.toFixed(1).replace(".", ",");
  };

  return (
    <div className="rating-table">
      <div className="rating-table__scroll">
        <table
          className="rt-table"
          style={{ minWidth: isFullTHead ? "2800px" : "unset" }}
        >
          <thead className="rt-thead">
            <tr className="rt-header-row">
              <th rowSpan={2} className="rt-th rt-th--yellow rt-th--rank">
                Эгаллаган ўрни
              </th>
              <th
                rowSpan={2}
                className="rt-th rt-th--yellow rt-th--name"
                style={{
                  width: "30px",
                }}
              >
                Маҳалла номи
              </th>
              <th rowSpan={2} className="rt-th rt-th--yellow rt-th--total">
                Жами тўплаган балл
              </th>
              <th rowSpan={2} className="rt-th rt-th--yellow rt-th--avg">
                Жами йўналишлар бўйича ўртача ўрни
              </th>
              <th rowSpan={2} className="rt-th rt-th--red rt-th--jarima">
                Олдини олиш мумкин бўлган жиноят бўйича жарима
              </th>
              <th
                rowSpan={2}
                className="rt-th rt-th--yellow rt-th--jarima-ball"
              >
                102" бўйича қўлланилган жарима
              </th>
              <th
                rowSpan={2}
                className="rt-th rt-th--cyan rt-th--qoldiq position-relative"
              >
                Жарима фоизларидан сўнг қолган балл
                <FullTHeadButton
                  value={isFullTHead}
                  setValue={() => setIsFullTHead(!isFullTHead)}
                />
              </th>

              {isFullTHead &&
                directions &&
                directions.map((dir) => (
                  <th key={dir.key} colSpan={2} className="rt-th rt-th--cyan">
                    {dir.name}
                  </th>
                ))}
              <th
                rowSpan={2}
                className="rt-th rt-th--yellow rt-th--jarima-ball"
              >
                Жами "102" -0,05%
              </th>
              <th
                colSpan={2}
                className="rt-th rt-th--yellow rt-th--jarima-ball"
              >
                шундан
              </th>
              <th
                rowSpan={2}
                className="rt-th rt-th--yellow rt-th--jarima-ball"
              >
                Жами олдини олиш мумкин бўлган жиноят (ЖК 47 моддаси)
              </th>
              <th
                colSpan={4}
                className="rt-th rt-th--yellow rt-th--jarima-ball"
              >
                шундан
              </th>
            </tr>

            <tr className="rt-subheader-row">
              {isFullTHead &&
                directions &&
                directions.map((dir) => (
                  <Fragment key={`sub-${dir.key}`}>
                    <th className="rt-th rt-th--sub">балл</th>
                    <th className="rt-th rt-th--sub">ўрни</th>
                  </Fragment>
                ))}
              <th className="rt-th rt-th--yellow rt-th--jarima-ball">
                П.И ни чақириш -0,5%
              </th>
              <th className="rt-th rt-th--yellow rt-th--jarima-ball">
                ИИОдан норози -0,5%
              </th>
              <th className="rt-th rt-th--yellow rt-th--jarima-ball">
                ижтимоий хавфи катта бўлмаган <br /> -5%
              </th>
              <th className="rt-th rt-th--yellow rt-th--jarima-ball">
                унча оғир бўлмаган жиноят <br /> -10%
              </th>
              <th className="rt-th rt-th--yellow rt-th--jarima-ball">
                оғир жиноят <br /> -15%
              </th>
              <th className="rt-th rt-th--yellow rt-th--jarima-ball">
                ўта оғир жиноят ҳар бирига <br /> -20%
              </th>
            </tr>
          </thead>

          <tbody>
            {tableData &&
              tableData.map((row: any, idx: number) => {
                if (idx > 9 && idx < 45 && !isFullTBody) return null;
                const isTop10 = row.overall_rank <= 10;
                const isBottom10 = row.overall_rank > tableData.length - 10;
                const rowParity =
                  idx % 2 === 0 ? "rt-row--even" : "rt-row--odd";
                const name = row.region_name;

                const rankClass = isTop10
                  ? "is-top"
                  : isBottom10
                    ? "is-bottom"
                    : "is-mid";

                const bgClass = isTop10
                  ? "_leader_bg"
                  : isBottom10
                    ? "_last_bg"
                    : "_middle_bg";

                return (
                  <tr
                    key={row.rank}
                    className={`rt-row ${rowParity}`}
                    onClick={() => onSelectDistrict(name)}
                  >
                    <td className={`rt-td rt-td--rank ${rankClass} ${bgClass}`}>
                      {row.overall_rank} - ўрин
                      {Boolean(idx === 9) && (
                        <FullTBodyButton
                          value={isFullTBody}
                          setValue={() => setIsFullTBody(!isFullTBody)}
                        />
                      )}
                    </td>
                    <td className={`rt-td rt-td--name ${bgClass}`}>{name}</td>
                    <td className={`rt-td rt-td--total ${bgClass}`}>
                      {formatValue(row.kpi_total)}
                    </td>
                    <td className={`rt-td rt-td--avg ${bgClass}`}>
                      {formatValue(row.average_rank)}
                    </td>
                    <td className={`rt-td rt-td--jarima ${bgClass}`}>
                      -{formatValue(row.crimes_total_score)}%
                    </td>
                    <td className={`rt-td rt-td--jarima-ball ${bgClass}`}>
                      -{formatValue(row.em_total_score)}%
                    </td>
                    <td className={`rt-td rt-td--qoldiq ${bgClass}`}>
                      {formatValue(row.total_score)}
                    </td>

                    {isFullTHead &&
                      directions &&
                      directions.map((dir) => {
                        const index = row.directions.findIndex(
                          (item: any) => item.direction_id === dir.id,
                        );
                        const directionRank = row.directions[index]?.rank;
                        const directionSore = row.directions[index]?.score;

                        return (
                          <Fragment key={`${row.rank}-${dir.key}`}>
                            <td className="rt-td rt-td--ball">
                              {formatValue(directionSore)}
                            </td>
                            <td className="rt-td rt-td--orni">
                              {directionRank}
                            </td>
                          </Fragment>
                        );
                      })}
                    <td className={`rt-td rt-td--ball ${bgClass}`}>
                      {formatValue(row?.emergency102.total_calls_102)}
                    </td>
                    <td className={`rt-td rt-td--ball ${bgClass}`}>
                      {formatValue(row?.emergency102.call_pi)}
                    </td>
                    <td className={`rt-td rt-td--ball ${bgClass}`}>
                      {formatValue(row?.emergency102.iio_complaint)}
                    </td>
                    <td className={`rt-td rt-td--ball ${bgClass}`}>
                      {formatValue(row?.crimes?.total_crimes)}
                    </td>
                    <td className={`rt-td rt-td--ball ${bgClass}`}>
                      {formatValue(row?.crimes?.minor_crimes)}
                    </td>
                    <td className={`rt-td rt-td--ball ${bgClass}`}>
                      {formatValue(row?.crimes?.medium_crimes)}
                    </td>
                    <td className={`rt-td rt-td--ball ${bgClass}`}>
                      {formatValue(row?.crimes?.serious_crimes)}
                    </td>
                    <td className={`rt-td rt-td--ball ${bgClass}`}>
                      {formatValue(row?.crimes?.critical_crimes)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
