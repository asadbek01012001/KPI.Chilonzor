"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoMapper = void 0;
class AutoMapper {
    static map(items, ClassRef, config = {}) {
        return items.map((item) => {
            const instance = new ClassRef();
            for (const key in item) {
                if (config[key]) {
                    instance[key] = config[key](item);
                }
                else {
                    instance[key] = item[key];
                }
            }
            return instance;
        });
    }
}
exports.AutoMapper = AutoMapper;
//# sourceMappingURL=mapper.js.map