export const sanitize = (str: string): string => (str || '').replace(/\W+/g, '-').toLowerCase();

export const buildSnapshotName = (...snapshotParts: string[]): string => snapshotParts.map(sanitize).join('-');
