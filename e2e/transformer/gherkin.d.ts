export const cucumber: Cucumber;
export const process: (
  sourceText: string,
  sourcePath: string,
  options: TransformOptions<TransformerConfig>,
) => TransformedSource;
