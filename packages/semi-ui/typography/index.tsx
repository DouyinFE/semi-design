import BaseTypography from './typography';
import Text from './text';
import Title from './title';
import Paragraph from './paragraph';

export type TypographyType = typeof BaseTypography & {
    Text: typeof Text;
    Title: typeof Title;
    Paragraph: typeof Paragraph
};

const Typography = BaseTypography as TypographyType;
Typography.Text = Text;
Typography.Title = Title;
Typography.Paragraph = Paragraph;


export type { BaseTypographyProps } from './base';
export type { CopyableProps } from './copyable';
export type { TitleProps } from './title';
export type { TextProps } from './text';
export type { ParagraphProps } from './paragraph';
export * from './interface';
export default Typography;
