import React, { FC, ReactElement } from 'react'
import { css } from '@emotion/react'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'

const styles = css`
  --lateral-padding: 2.25em;

  // reset styles
  background: none;
  font: inherit;
  opacity: 1;

  display: flex;
  align-items: center;
  column-gap: 3.3rem;
  padding-right: var(--lateral-padding);
  padding-left: var(--lateral-padding);
  border: 1px solid ${ colors.primary };
  border-radius: .5rem;
  flex-basis: 12.8rem;
  overflow: hidden;

  svg {
    fill: ${ colors.primary };
    width: 4.67rem;
    flex-shrink: 0;
  }

  ${ breakpoints.tablet } {
    flex-basis: 19.5rem;
    padding: 0 6rem;
    column-gap: 5.5rem;
    border-radius: 1rem;
    height: 19.5rem;

    svg {
      width: 6.5rem;
    }
  }

  ${ breakpoints.desktop } {
    flex-basis: 49.4rem;
  }
`

interface IProps {
  className?: string,
  title: string,
  icon: ReactElement,
  handleClick: () => void,
}

/**
 * Component that defines a special type of button with a card form, with an icon and text. Its principal function is
 * to serve as navigation element between section articles.
 */
const ArticleButton: FC<IProps> = (
  {
    className,
    title,
    icon,
    handleClick,
  },
) => {
  return (
    <button className={ className } title={ title } css={ styles } onClick={ handleClick }>
      { icon }
      { title }
    </button>
  )
}

export default ArticleButton