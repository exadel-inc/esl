function loadPlugin(selector: string, loadCallback: () => void): void {
  if (document.querySelector(selector)) {
    loadCallback();
  }
}

export const registerAsyncPlugins = () => {
  loadPlugin('uip-editor', () => import(/* webpackChunkName: "uip-editor" */ './editor/editor'));
};
