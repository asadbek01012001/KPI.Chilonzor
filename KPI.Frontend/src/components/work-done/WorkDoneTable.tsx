import WorkDoneBaseTable from "../tables/WorkDoneBaseTable";

export default function WorkDoneTable({
  mode,
}: {
  mode?: "oneDay" | "timePeriod";
}) {
  return <WorkDoneBaseTable directions={[]} tableData={[]} mode={mode} />;
}
