// Declare the following custom types to quiet the typechecker on
// non-TypeScript resources
// https://webpack.js.org/guides/typescript/#importing-other-assets

declare module "*.svg" {
    const content: any;
    export default content;
}

declare module "*.json" {
    const content: any;
    export default content;
}

declare module "*.scss" {
    const content: any;
    export default content;
}