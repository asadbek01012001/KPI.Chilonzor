import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDirectionContext } from "../../api/directions/DirectionApiContext";

import NationalGuardIcon from "../icons/NationalGuard";
import DailyRatingIcon from "../icons/DailyRatingIcon";
import EvenRatingIcon from "../icons/EvenRatingIcon";
import PoliceIcon from "../icons/PoliceIcon";
import SidebarItem from "./SidebarItem";
import SidebarWrapper from "./SidebarWrapper";
import TQHIcon from "../icons/TQHIcon";
import SidebarItemSecond from "./SidebarItemSecond";
import Emergency102Icon from "../icons/Emergency102Icon";
import IndicatorIcon from "../icons/IndicatorIcon";

export default function Sidebar() {
  const [directions, setDirections] = useState<any[]>([]);

  const { tab = directions.length > 0 ? directions[0]?.id : "" } = useParams<{
    tab?: string;
  }>();

  const { DirectionApi } = useDirectionContext();

  useEffect(() => {
    DirectionApi.getAll()
      .then((res) => setDirections(res))
      .catch((e) => console.log(e))
      .finally();
  }, [DirectionApi]);

  return (
    <SidebarWrapper>
      <SidebarItem
        icon={<DailyRatingIcon color="#2473BD" />}
        link="/dashboard/statistics"
        title="Дашбоард"
      />
      <SidebarItem
        icon={<EvenRatingIcon color="#2473BD" />}
        link="/dashboard/reports"
        title="Самарадорлик"
      />
      <SidebarItem
        icon={<NationalGuardIcon color="#2473BD" />}
        link="/dashboard/work_done"
        title="Хисоботлар"
      >
        {directions.map((direction) => (
          <SidebarItemSecond
            key={direction.id}
            tab={direction.id}
            activeTab={tab}
          >
            {direction.name}
          </SidebarItemSecond>
        ))}
      </SidebarItem>
      <SidebarItem
        icon={<Emergency102Icon color="#2473BD" />}
        link="/dashboard/emergency102"
        title="102"
      />
      <SidebarItem
        icon={<TQHIcon color="#2473BD" />}
        link="/dashboard/crimes"
        title="Жиноятлар"
      />

      <SidebarItem
        icon={<IndicatorIcon color="#2473BD" />}
        link="/dashboard/indicators"
        title="Кўрсаткичлар"
      />
      <SidebarItem
        icon={<PoliceIcon color="#2473BD" />}
        link="/dashboard/users"
        title="Фойдаланувчилар"
      />
    </SidebarWrapper>
  );
}
