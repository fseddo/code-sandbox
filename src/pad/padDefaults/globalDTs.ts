export const globalDTs = `declare module "*.css";
declare module "*.svg" {
  const src: string;
  export default src;
}
`;
