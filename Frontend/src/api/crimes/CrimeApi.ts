import { BaseApi } from "../BaseApi";
import { CreateCrimeProps, UpdateCrimeProps, CrimeQueryProps } from "./CrimeDto";

export class CrimeApi extends BaseApi {
  // rows[] + totals{} birgalikda qaytadi
  public async getAll(query?: CrimeQueryProps): Promise<{ rows: any[]; totals: any }> {
    const res = await this.getWithMeta("crimes", { query } as any);
    return { rows: res?.data ?? [], totals: res?.meta?.totals ?? null };
  }

  public getById(id: string) {
    return this.get(`crimes/${id}`);
  }

  public create(json: CreateCrimeProps) {
    return this.post("crimes", { json });
  }

  public bulkCreate(items: CreateCrimeProps[]) {
    return this.post("crimes/bulk", { json: { items } });
  }

  public update(id: string, json: UpdateCrimeProps) {
    return this.patch(`crimes/${id}`, { json });
  }

  public remove(id: string) {
    return this.delete(`crimes/${id}`);
  }
}
