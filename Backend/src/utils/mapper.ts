export class AutoMapper {
  static map<T>(
    items: any[],
    ClassRef: new () => T,
    config: Record<string, (item: any) => any> = {},
  ): T[] {
    return items.map((item) => {
      const instance = new ClassRef();

      for (const key in item) {
        if (config[key]) {
          (instance as any)[key] = config[key](item);
        } else {
          (instance as any)[key] = item[key];
        }
      }

      return instance;
    });
  }
}
