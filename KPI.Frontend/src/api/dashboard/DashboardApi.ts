import { BaseApi } from "../BaseApi";
import {
  MahallaQueryProps,
  TopQueryProps,
  DateRangeProps,
} from "./DashboardDto";

export class DashboardApi extends BaseApi {
  // Barcha mahallalar overview yoki bitta mahalla detali
  public getMahalla(query: MahallaQueryProps) {
    return this.get("dashboard/mahalla", { query });
  }

  // Jinoyatchilik bo'yicha top mahallalar
  public getTopCrimes(query?: TopQueryProps) {
    return this.get("dashboard/top-crimes", { query });
  }

  // 102 bo'yicha top mahallalar
  public getTop102(query?: TopQueryProps) {
    return this.get("dashboard/top-102", { query });
  }

  // 4 ta sektor bo'yicha umumiy hisobot
  public getSectors(query?: DateRangeProps) {
    return this.get("dashboard/sectors", { query });
  }

  // Dashboard umumiy ma'lumotlar (indikatorlar, regionlar, directions, o'rtacha, lider)
  public getInfo(query?: DateRangeProps) {
    return this.get("dashboard/info", { query });
  }

  // Yo'nalishlar + har birida nechta indicator
  public getDirections(query?: DateRangeProps) {
    return this.get("dashboard/directions", { query });
  }

  // Berilgan yo'nalish bo'yicha mahallalar reytingi
  public getRegionsByDirection(directionId: string, query?: DateRangeProps) {
    return this.get(`dashboard/directions/${directionId}/regions`, { query });
  }

  // Yo'nalish + mahalla uchun indikatorlar va ballari
  public getIndicatorsByDirectionAndRegion(
    directionId: string,
    regionId: string,
    query?: DateRangeProps,
  ) {
    return this.get(
      `dashboard/directions/${directionId}/regions/${regionId}/indicators`,
      { query },
    );
  }

  // Mahalla uchun crime + 102 + directions umumiy ko'rsatkichlari
  public getRegionSummary(regionId: string, query?: DateRangeProps) {
    return this.get(`dashboard/regions/${regionId}/summary`, { query });
  }

  // Chart 1: MFY umumiy ball dinamikasi — vaqt bo'yicha (max 20 interval)
  // from/to majburiy
  public getChartRegionTimeline(
    regionId: string,
    query: Required<DateRangeProps>,
  ) {
    return this.get(`dashboard/chart/region/${regionId}/timeline`, { query });
  }

  // Chart 2: Yo'nalish bo'yicha barcha MFYlar bali — snapshot
  // from/to optional
  public getChartDirection(directionId: string, query?: DateRangeProps) {
    return this.get(`dashboard/chart/direction/${directionId}`, { query });
  }

  // Chart 3: Tuman umumiy — barcha MFYlar total_score bo'yicha reyting
  // from/to optional
  public getChartDistrict(query?: DateRangeProps) {
    return this.get("dashboard/chart/district", { query });
  }
}
