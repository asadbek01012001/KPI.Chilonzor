import { BaseApi } from "../BaseApi";
import { CreateEmergency102Props, UpdateEmergency102Props, Emergency102QueryProps } from "./Emergency102Dto";

export class Emergency102Api extends BaseApi {
  // rows[] + totals{} birgalikda qaytadi
  public async getAll(query?: Emergency102QueryProps): Promise<{ rows: any[]; totals: any }> {
    const res = await this.getWithMeta("emergency102", { query });
    return { rows: res?.data ?? [], totals: res?.meta?.totals ?? null };
  }

  public getById(id: string) {
    return this.get(`emergency102/${id}`);
  }

  public create(json: CreateEmergency102Props) {
    return this.post("emergency102", { json });
  }

  public bulkCreate(items: CreateEmergency102Props[]) {
    return this.post("emergency102/bulk", { json: { items } });
  }

  public update(id: string, json: UpdateEmergency102Props) {
    return this.patch(`emergency102/${id}`, { json });
  }

  public remove(id: string) {
    return this.delete(`emergency102/${id}`);
  }
}
