import {
  Divider,
  Image,
  ListItem,
  ListProps,
  OrderedList,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from '@chakra-ui/react'
import {
  Callout,
  CodeBlock,
  createIFrameHandler,
  createLinkHandler,
  Doc,
  Heading,
  MarkMap,
  NodeViewComponentProps,
  TextHandler,
} from '@remirror/react'

export const imageHandler = ({
  node: {
    attrs: { src, alt },
  },
}: NodeViewComponentProps) => {
  return <Image my={4} borderRadius="8px" src={src} alt={alt} />
}

export const unorderedListHandler = ({ children }: ListProps) => {
  return <UnorderedList>{children}</UnorderedList>
}

export const listItemHandler = ({ children }: ListProps) => {
  return <ListItem>{children}</ListItem>
}

export const typeMap = {
  blockquote: 'blockquote',
  bulletList: unorderedListHandler,
  callout: Callout,
  codeBlock: CodeBlock,
  doc: Doc,
  hardBreak: 'br',
  heading: Heading,
  horizontalRule: Divider,
  iframe: createIFrameHandler({ style: { width: '100%' } }),
  image: imageHandler,
  listItem: listItemHandler,
  paragraph: 'p',
  orderedList: OrderedList,
  text: TextHandler,
  table: Table,
  tableHeader: Thead,
  tableHeaderCell: Th,
  tbody: Tbody,
  tableRow: Tr,
  tableCell: Td,
} satisfies MarkMap

export const markMap = {
  italic: 'em',
  bold: 'strong',
  code: 'code',
  link: createLinkHandler({ target: '_blank' }),
  underline: 'u',
  table: 'table',
  tableHeader: 'thead',
  tableHeaderCell: 'th',
  tbody: 'tbody',
  tableRow: 'tr',
  tableCell: 'td',
} satisfies MarkMap
