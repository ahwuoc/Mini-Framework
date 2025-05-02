import { readdirSync, existsSync } from "fs";
import { join, resolve } from "path";
const dynamicImport = (folder: string) => {
  const allModule: any[] = [];
  const dir = join(process.cwd(), "src", folder);
  if (!existsSync(dir)) {
    return console.warn(`Folder hiện tại không tồn tại: ${dir}`);
  }
  const files = readdirSync(dir).filter(
    (file) => file.endsWith(".ts") || file.endsWith(".js"),
  );
  for (const file of files) {
    const filePath = resolve(dir, file);

    try {
      const module = require(filePath);
      const mod = module.default || module;
      allModule.push(mod);
    } catch (error) {
      console.error(`❌ Lỗi import ${filePath}:`, error);
    }
  }
  return allModule;
};
export default dynamicImport;
