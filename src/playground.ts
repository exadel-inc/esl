import {UIPRoot} from './core/root';
import {UIPEditor} from './editor/editor';
import {UIPPreview} from './preview/preview';
import {UIPSettings} from './settings/settings';
import {UIPTextSetting} from './settings/setting/text-setting/text-setting';
import {UIPListSetting} from './settings/setting/list-setting/list-setting';
import {UIPClassSetting} from './settings/setting/class-setting/class-setting';
import {UIPBoolSetting} from './settings/setting/bool-setting/bool-setting';
import {UIPSnippets} from './snippets/snippets';

export {
	UIPRoot,
	UIPEditor,
	UIPPreview,
	UIPSettings,
	UIPTextSetting,
	UIPListSetting,
	UIPClassSetting,
	UIPBoolSetting,
	UIPSnippets
};

export function init() {
	UIPRoot.register();
	UIPEditor.register();
	UIPPreview.register();
	UIPSettings.register();
	UIPTextSetting.register();
	UIPListSetting.register();
	UIPClassSetting.register();
	UIPBoolSetting.register();
	customElements.whenDefined(UIPRoot.is).then(() => UIPSnippets.register());
}
