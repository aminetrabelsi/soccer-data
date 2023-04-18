import { c as create_ssr_component, e as escape } from "../../chunks/index.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let msg = "";
  return `<h1>${escape(msg)}</h1>`;
});
export {
  Page as default
};
