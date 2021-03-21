import {UIPRoot} from './core/root';
import {UIPEditor} from './editor/editor';
import {UIPPreview} from './preview/preview';
import {UIPSettings} from './settings/settings';
import {UIPTextSetting} from './settings/setting/text-setting/text-setting';
import {UIPSelectSetting} from './settings/setting/select-setting/select-setting';
import {UIPBoolSetting} from './settings/setting/bool-setting/bool-setting';
import {UIPSnippets} from './snippets/snippets';

export {
	UIPRoot,
	UIPEditor,
	UIPPreview,
	UIPSettings,
	UIPTextSetting,
	UIPSelectSetting,
	UIPBoolSetting,
	UIPSnippets
};

export function init() {
	UIPRoot.register();
	UIPEditor.register();
	UIPPreview.register();
	UIPSettings.register();
	UIPTextSetting.register();
	UIPSelectSetting.register();
	UIPBoolSetting.register();
	customElements.whenDefined(UIPRoot.is).then(() => UIPSnippets.register());
}
