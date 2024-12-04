export function applyTheme(theme: string) {
  const rootContainer = document.querySelector("#__root");
  rootContainer?.setAttribute("class", theme);
  if (!rootContainer) throw new Error("Can't find Popup root element");
}
