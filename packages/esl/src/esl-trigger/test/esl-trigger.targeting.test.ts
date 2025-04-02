import {ESLTrigger} from '../core/esl-trigger';
import {createToggleableMock} from '../../esl-toggleable/test/toggleable.mock';

jest.mock('../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

describe('ESLTrigger find target according to the query in target attribute', () => {
  ESLTrigger.register();
  const $trigger = ESLTrigger.create();
  const $tgl1 = createToggleableMock();
  const $tgl2 = createToggleableMock();
  const $tgl3 = createToggleableMock();

  beforeAll(() => {
    $trigger.target = '::prev';
    document.body.append($tgl1);
    document.body.append($trigger);
    document.body.append($tgl2);
  });

  afterEach(() => jest.resetAllMocks());

  test('target from selector', () => {
    $trigger.click();
    expect($tgl1.show).toBeCalledTimes(1);
  });

  test('selector target removed', () => {
    $tgl1.remove();
    $trigger.click();
    expect($tgl1.show).toBeCalledTimes(0);
  });

  test('selector updated', () => {
    $trigger.target = '::next';
    $trigger.setAttribute('target', '::next');
    $trigger.click();
    expect($tgl2.show).toBeCalledTimes(1);
  });

  test('target set explicitly', () => {
    $trigger.$target = $tgl3;
    $trigger.click();
    expect($tgl3.show).toBeCalledTimes(1);
  });
});
