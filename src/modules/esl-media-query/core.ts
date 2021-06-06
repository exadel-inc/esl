import {ESLScreenBreakpoint} from './core/esl-media-breakpoint';

export * from './core/esl-media-breakpoint';
export * from './core/esl-media-query';
export * from './core/esl-media-rule';
export * from './core/esl-media-rule-list';

ESLScreenBreakpoint.add('xs', 1, 767);
ESLScreenBreakpoint.add('sm', 768, 991);
ESLScreenBreakpoint.add('md', 992, 1199);
ESLScreenBreakpoint.add('lg', 1200, 1599);
ESLScreenBreakpoint.add('xl', 1600, 999999);
