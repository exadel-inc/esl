import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import {ESLBasePopup} from '../../esl-base-popup/ts/esl-base-popup';

@ExportNs('Popup')
export class ESLPopup extends ESLBasePopup {
	public static is = 'esl-popup';
	public static eventNs = 'esl:popup';
}

export default ESLPopup;