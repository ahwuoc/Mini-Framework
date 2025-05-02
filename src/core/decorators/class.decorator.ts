import { setMetadata } from "../manager/metadata.manager";
export const Controller = (prefix: string = ""): ClassDecorator =>
  setMetadata("class_metadata", { prefix: prefix });

export const InjectTable = (): ClassDecorator => {
  return (target: any) => {};
};
