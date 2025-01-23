import { Components } from 'react-markdown'

export const markdowns: Components = {
  p(props) {
    const { ...rest } = props
    return <p className="text-stone-400 my-2" {...rest} />
  },
  a(props) {
    const { ...rest } = props
    return (
      <a
        className="text-stone-100"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open the link in a new tab"
        {...rest}
      />
    )
  },
}
