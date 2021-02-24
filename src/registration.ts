import {
  UIPCheckSetting,
  UIPClassSetting,
  UIPEditor,
  UIPListSetting,
  UIPRoot,
  UIPPreview,
  UIPSettings,
  UIPSnippets,
  UIPTextSetting
} from './playground';

UIPRoot.register();
UIPEditor.register();
UIPPreview.register();
UIPSettings.register();
UIPTextSetting.register();
UIPListSetting.register();
UIPClassSetting.register();
UIPCheckSetting.register();
customElements.whenDefined(UIPRoot.is).then(() => UIPSnippets.register());
