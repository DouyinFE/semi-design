import BaseTypography from './typography';
import Text from './text';
import Title from './title';
import Paragraph from './paragraph';

export type TypographyType = typeof BaseTypography & {
    Text: typeof Text;
    Title: typeof Title;
    Paragraph: typeof Paragraph;
};

const Typography = BaseTypography as TypographyType;
Typography.Text = Text;
Typography.Title = Title;
Typography.Paragraph = Paragraph;


export { BaseTypographyProps } from './base';
export { CopyableProps } from './copyable';
export { TitleProps } from './title';
export { TextProps } from './text';
export { ParagraphProps } from './paragraph';
export * from './interface';
export default Typography;
