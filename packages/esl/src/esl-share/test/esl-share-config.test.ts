import {promisifyTimeout} from '../../esl-utils/async/promise/timeout';
import {ESLShareConfig} from '../core/esl-share-config';
import type {ESLShareButtonConfig, ESLShareGroupConfig} from '../core/esl-share-config';

describe('ESLShareConfig tests', () => {
  const SAMPLE_GROUP_1: ESLShareGroupConfig = {name: 'group1', list: 'sn1 sn2'};
  const SAMPLE_GROUP_2: ESLShareGroupConfig = {name: 'group2', list: 'sn2 sn3 sn4'};
  const SAMPLE_GROUP_3: ESLShareGroupConfig = {name: 'group3', list: 'group:group1 group:group2'};
  const SAMPLE_BUTTON_1: ESLShareButtonConfig = {name: 'sn1', title: 'SN1', action: 'media', link: 'https://sn1.com'};
  const SAMPLE_BUTTON_2: ESLShareButtonConfig = {name: 'sn2', title: 'SN2', action: 'media', link: 'https://sn2.com', icon: '<svg id="svg-2"></svg>'};
  const SAMPLE_BUTTON_3: ESLShareButtonConfig = {name: 'sn3', title: 'SN3', action: 'media', link: 'https://sn3.com'};
  const SAMPLE_BUTTON_4: ESLShareButtonConfig = {name: 'sn4', title: 'SN4', action: 'media', link: 'https://sn4.com', icon: '<svg id="svg-4"></svg>'};
  const SAMPLE_BUTTON_5: ESLShareButtonConfig = {name: 'sn-5', title: 'SN5', action: 'media', link: 'https://sn5.com'};
  const SAMPLE_BUTTON_6: ESLShareButtonConfig = {name: 'sn6', title: 'SN6', action: 'media', link: 'https://sn5.com', additional: {a: 1, b: 'test'}};

  describe('Getting ESLShareConfig state', () => {
    const instance: ESLShareConfig = new (ESLShareConfig as any)();
    const groups: ESLShareGroupConfig[] = [SAMPLE_GROUP_1, SAMPLE_GROUP_2, SAMPLE_GROUP_3];
    const buttons: ESLShareButtonConfig[] = [SAMPLE_BUTTON_1, SAMPLE_BUTTON_2, SAMPLE_BUTTON_3, SAMPLE_BUTTON_4, SAMPLE_BUTTON_5];
    instance.append(groups).append(buttons);

    test.each([
      ['sn1', SAMPLE_BUTTON_1],
      ['sn2', SAMPLE_BUTTON_2],
      ['sn3', SAMPLE_BUTTON_3],
      ['sn4', SAMPLE_BUTTON_4],
      ['sn-5', SAMPLE_BUTTON_5]
    ])('ESLShareConfig.prototype.getButton resolves existing group %s', (name: string, button: any) => {
      expect(instance.getButton(name)).toEqual(button);
    });

    test.each([
      '', 'sn6', 'group1'
    ])('ESLShareConfig.prototype.getButton does not resolves non-existing group %s', (name: string) => {
      expect(instance.getButton(name)).toBeUndefined();
    });

    test.each([
      ['group1', SAMPLE_GROUP_1],
      ['group2', SAMPLE_GROUP_2],
      ['group3', SAMPLE_GROUP_3]
    ])('ESLShareConfig.prototype.getGroup resolves existing group %s', (name: string, group: any) => {
      expect(instance.getGroup(name)).toEqual(group);
    });

    test.each([
      '', 'group0', 'sn1'
    ])('ESLShareConfig.prototype.getGroup does not resolves non-existing group %s', (name: string) => {
      expect(instance.getGroup(name)).toBeUndefined();
    });

    test('ESLShareConfig.prototype.get(\'all\') resolves all buttons', () => {
      expect(instance.get('all')).toEqual(buttons);
    });

    test.each([
      'allstart',
      'middleallterm',
      'endall',
      'hello-all-1',
      'group:all'
    ])('ESLShareConfig.prototype.get(%s) does not resolves to all buttons as nonexistent', (name) => {
      expect(instance.get(name)).toEqual([]);
    });

    test.each([
      ['all', ['sn1', 'sn2', 'sn3', 'sn4', 'sn-5']],
      ['group1', []],
      ['group2', []],
      ['group:group1', ['sn1', 'sn2']],
      ['group:group2', ['sn2', 'sn3', 'sn4']],
      ['group:group3', ['sn1', 'sn2', 'sn3', 'sn4']],
      ['sn1', ['sn1']],
      ['sn2', ['sn2']],
      ['', []]
    ])('ESLShareConfig.prototype.get resolves "%s" query to list %s', (name: string, list: string[]) => {
      const result = instance.get(name);
      expect(result.map((cfg) => cfg.name)).toEqual(list);
      for (const res of result) {
        expect(res).toEqual(expect.objectContaining({
          name: expect.any(String),
          title: expect.any(String),
          action: expect.any(String),
          link: expect.any(String)
        }));
      }
    });

    describe('ESLShareConfig selects buttons from the list with deduplication behavior', () => {
      test.each([
        ['sn1 sn1 sn1', ['sn1']],
        ['sn2 sn1 sn2', ['sn2', 'sn1']],
        ['sn1 sn2 sn2 sn1', ['sn1', 'sn2']],
        ['group:group1 group:group1', ['sn1', 'sn2']],
        ['group:group2 group:group1 group:group2', ['sn2', 'sn3', 'sn4', 'sn1']],
        ['sn4 group:group2 sn4 group:group2', ['sn4', 'sn2', 'sn3']],
        ['all all all', ['sn1', 'sn2', 'sn3', 'sn4', 'sn-5']],
        ['sn3 all', ['sn3', 'sn1', 'sn2', 'sn4', 'sn-5']],
        ['group:group2 sn-5 all', ['sn2', 'sn3', 'sn4', 'sn-5', 'sn1']]
      ])('ESLShareConfig.prototype.get resolves "%s" query to list %s', (name: string, list: string[]) => {
        const result = instance.get(name);
        expect(result.map((cfg) => cfg.name)).toEqual(list);
      });
    });
  });

  describe('ESLShareConfig resolve recursive config', () => {
    const instance: ESLShareConfig = new (ESLShareConfig as any)();

    beforeEach(() => instance.clear());

    test('ESLShareConfig.prototype.get resolves group referencing itself to empty list', () => {
      instance.append({name: 'group', list: 'group:group'});
      expect(instance.get('group:group')).toEqual([]);
    });

    test('ESLShareConfig.prototype.get ignors non-existing groups', () => {
      instance.append(SAMPLE_BUTTON_1);
      instance.append({name: 'group', list: 'group:group'});
      expect(instance.get('sn1 group:group')).toContain(SAMPLE_BUTTON_1);
    });
  });

  describe('Setting ESLShareConfig state', () => {
    const instance: ESLShareConfig = new (ESLShareConfig as any)();
    beforeEach(() => instance.clear());

    test('ESLShareConfig.prototype.append appends buttons', () => {
      instance.append([SAMPLE_BUTTON_1, SAMPLE_BUTTON_2]);
      expect(instance.buttons.length).toBe(2);
      expect(instance.groups.length).toBe(0);
    });

    test('ESLShareConfig.prototype.append appends groups', () => {
      instance.append([SAMPLE_GROUP_1, SAMPLE_GROUP_2]);
      expect(instance.buttons.length).toBe(0);
      expect(instance.groups.length).toBe(2);
    });

    test('ESLShareConfig.prototype.append does not create duplicates', () => {
      instance.append([SAMPLE_BUTTON_1, SAMPLE_BUTTON_1]).append(SAMPLE_BUTTON_1);
      expect(instance.buttons.length).toBe(1);
      expect(instance.groups.length).toBe(0);
    });

    test('ESLShareConfig.prototype.append accepts single button config', () => {
      instance.append(SAMPLE_BUTTON_1);
      expect(instance.buttons.length).toBe(1);
      expect(instance.groups.length).toBe(0);
    });

    test('ESLShareConfig.prototype.append accepts single group config', () => {
      instance.append(SAMPLE_GROUP_1);
      expect(instance.buttons.length).toBe(0);
      expect(instance.groups.length).toBe(1);
    });
  });

  describe('ESLShareConfig notify about changes', () => {
    const instance: ESLShareConfig = new (ESLShareConfig as any)();
    const callback = jest.fn();

    beforeEach(async () => {
      callback.mockClear();
      instance.clear();
      await Promise.resolve();
      instance.addEventListener(callback);
    });
    afterEach(() => instance.removeEventListener(callback));

    test('ESLShareConfig.prototype.append notifies about buttons change', async () => {
      instance.addEventListener(callback);
      expect(callback).toBeCalledTimes(0);
      instance.append(SAMPLE_BUTTON_1);
      expect(callback).toBeCalledTimes(0);
      await Promise.resolve();
      expect(callback).toBeCalledTimes(1);
    });

    test('ESLShareConfig.prototype.append notifies about groups change', async () => {
      instance.addEventListener(callback);
      expect(callback).toBeCalledTimes(0);
      instance.append(SAMPLE_GROUP_1);
      expect(callback).toBeCalledTimes(0);
      await Promise.resolve();
      expect(callback).toBeCalledTimes(1);
    });

    test('ESLShareConfig.prototype.append notifies about buttons change', async () => {
      instance.append([SAMPLE_BUTTON_1, SAMPLE_BUTTON_2]);
      await Promise.resolve();
      expect(callback).toBeCalledTimes(1);
    });

    test('ESLShareConfig.prototype.append notifies about groups change', async () => {
      instance.append([SAMPLE_GROUP_1, SAMPLE_GROUP_2]);
      await Promise.resolve();
      expect(callback).toBeCalledTimes(1);
    });

    test('ESLShareConfig.prototype.append notifies about multiple change in macro-task once', async () => {
      instance.append(SAMPLE_BUTTON_1);
      instance.append(SAMPLE_GROUP_1);
      instance.append(SAMPLE_BUTTON_2);
      instance.append(SAMPLE_GROUP_2);
      expect(callback).toBeCalledTimes(0);
      await Promise.resolve();
      expect(callback).toBeCalledTimes(1);
    });

    test('ESLShareConfig.prototype.append notifies about multiple change of separate tasks', async () => {
      instance.append(SAMPLE_BUTTON_1);
      await Promise.resolve();
      expect(callback).toBeCalledTimes(1);
      await promisifyTimeout(0);
      instance.append(SAMPLE_GROUP_1);
      await Promise.resolve();
      expect(callback).toBeCalledTimes(2);
    });

    test('ESLShareConfig.prototype.append notifies about config reset', async () => {
      instance.append(SAMPLE_BUTTON_1);
      await Promise.resolve();
      expect(callback).toBeCalledTimes(1);
      instance.clear();
      await Promise.resolve();
      expect(callback).toBeCalledTimes(2);
    });
  });

  describe('ESLShareConfig.set static API', () => {
    test('ESLShareConfig instance is a singleton', () => {
      expect(ESLShareConfig.instance).toBeInstanceOf(ESLShareConfig);
      expect(ESLShareConfig.instance).toBe(ESLShareConfig.instance);
    });

    test('ESLShareConfig.set appends a button', () => {
      ESLShareConfig.set({buttons: [SAMPLE_BUTTON_1]});
      expect(ESLShareConfig.instance.buttons.length).toBe(1);
      expect(ESLShareConfig.instance.groups.length).toBe(0);
    });

    test('ESLShareConfig.set appends a group', () => {
      ESLShareConfig.set({groups: [SAMPLE_GROUP_1]});
      expect(ESLShareConfig.instance.buttons.length).toBe(1);
      expect(ESLShareConfig.instance.groups.length).toBe(1);
    });

    test('ESLShareConfig.set accepts empty config', () => {
      ESLShareConfig.set({});
      expect(ESLShareConfig.instance.buttons.length).toBe(1);
      expect(ESLShareConfig.instance.groups.length).toBe(1);
    });

    test('ESLShareConfig.set accepts provider function', () => {
      ESLShareConfig.set(() => ({buttons: [SAMPLE_BUTTON_2]}));
      expect(ESLShareConfig.instance.buttons.length).toBe(2);
      expect(ESLShareConfig.instance.groups.length).toBe(1);
    });

    test('ESLShareConfig.set accepts provider promise', async () => {
      const promise = Promise.resolve({buttons: [SAMPLE_BUTTON_3]});
      ESLShareConfig.set(promise);
      await promise;
      expect(ESLShareConfig.instance.buttons.length).toBe(3);
      expect(ESLShareConfig.instance.groups.length).toBe(1);
    });
  });

  describe('ESLShareConfig.update', () => {
    const instance: ESLShareConfig = new (ESLShareConfig as any)();

    beforeEach(async () => {
      instance.clear();
      await Promise.resolve();
    });

    test('ESLShareConfig.update does not fail if no items with passed name', () => {
      instance.append([SAMPLE_BUTTON_1, SAMPLE_BUTTON_2]);
      instance.update('sn3', {title: 'SN3'});
      expect(instance.buttons).toEqual([SAMPLE_BUTTON_1, SAMPLE_BUTTON_2]);
    });

    test('ESLShareConfig.update change a single button with the passed name', () => {
      instance.append([SAMPLE_BUTTON_1, SAMPLE_BUTTON_2]);
      instance.update('sn2', {title: 'SN2Updated', link: '#'});
      expect(instance.get('sn2')).toEqual([expect.objectContaining({...SAMPLE_BUTTON_2, title: 'SN2Updated', link: '#'})]);
    });

    test('ESLShareConfig.update updates a group of items', () => {
      instance.append([SAMPLE_BUTTON_1, SAMPLE_BUTTON_2]);
      instance.append(SAMPLE_GROUP_1);
      instance.update(SAMPLE_GROUP_1.name, {link: '#'});
      for (const btn of instance.get(SAMPLE_GROUP_1.name)) {
        expect(btn.link).toBe('#');
      }
    });

    test('ESLShareConfig.update merge additional properties', () => {
      instance.append(SAMPLE_BUTTON_6);
      instance.update('sn6', {additional: {a: 2, c: 'test'}});
      expect(instance.get('sn6')).toEqual([expect.objectContaining({...SAMPLE_BUTTON_6, additional: {a: 2, b: 'test', c: 'test'}})]);
    });

    test('ESLShareConfig.update does not introduce new items', () => {
      instance.append([SAMPLE_BUTTON_1, SAMPLE_BUTTON_2]);
      instance.update('sn1', {title: 'SN3'});
      expect(instance.buttons.length).toEqual(2);
    });
  });
});
