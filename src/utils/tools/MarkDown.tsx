import classNames from 'classnames';
import React from 'react';
import { createUseStyles } from 'react-jss';
import ReactMarkdown from 'react-markdown';
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import { matchMarkDownSpecialKeysAtLineEnd } from '../validations/regex';

interface MarkDownProps extends ReactMarkdownOptions {
  color?: string;
  wordBreak?: string;
  fontSize?: any;
}

type Rules = string;

type StyleProps = {
  color?: string;
  wordBreak?: string;
  fontSize?: any;
};

const useStyles = createUseStyles<Rules, StyleProps>({
  container: ({ color, wordBreak, fontSize }) => ({
    color: color || 'inherit',
    wordBreak: wordBreak || 'break-word',
    fontSize,
    '& a': {
      textDecoration: 'underline',
    },
    '& ul': {
      paddingLeft: '25px',
    },
    '& ol': {
      paddingLeft: '25px',
    },
  }),
});

export const MarkDown = ({
  children,
  className,
  color,
  wordBreak,
  fontSize,
  ...rest
}: MarkDownProps) => {
  const classes = useStyles({ color, wordBreak, fontSize });

  const newValue = children
    ? children.replaceAll(matchMarkDownSpecialKeysAtLineEnd, '\\\n')
    : '';
  const finalValue =
    newValue[newValue.length - 2] === '\\'
      ? newValue.slice(0, newValue.length - 2)
      : newValue;
  return (
    <ReactMarkdown
      className={classNames(classes.container, className)}
      components={{
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" referrerPolicy="no-referrer" />
        ),
      }}
      {...rest}
    >
      {finalValue}
    </ReactMarkdown>
  );
};
