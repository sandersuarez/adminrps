interface Message<T extends string> {
  content: string
  type: T
}

export default Message
