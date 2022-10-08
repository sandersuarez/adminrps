import React, { FC, ReactElement, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import Alert from './Alert'
import NoteContainer from './NoteContainer'
import Note, { NoteProps } from './Note'
import Button from './buttons/Button'
import margins from '../styles/margins'
import ButtonTypes from '../shapes/ButtonTypes'
import Options from './buttons/Options'
import Panels from '../shapes/Panels'
import { Draft, DraftContent, DraftMessage, DraftMessageTypes } from '../hooks/useDrafts'
import AlertTypes from '../shapes/AlertTypes'
import { forEach } from 'lodash'

const Container = styled.article`
  margin-top: ${ margins.mobile.bigVertical };
  display: flex;
  flex-direction: column;
  gap: ${ margins.mobile.mediumVertical };

  h3 {
    line-height: 1em;
  }

  ${ breakpoints.tablet } {
    margin: 2rem 0 0 0;
  }
`

interface IProps {
  setFirstSidePanel: React.Dispatch<React.SetStateAction<Panels>>
  handleOpenSidePanel: () => void
  message: DraftMessage | undefined
  setColMessage: React.Dispatch<React.SetStateAction<DraftMessage | undefined>>
  getDrafts: () => void
  drafts: (Draft & DraftContent)[] | undefined
}

const Drafts: FC<IProps> = (
  {
    setFirstSidePanel,
    handleOpenSidePanel,
    message,
    setColMessage,
    getDrafts,
    drafts,
  }) => {

  const [notes, setNotes] = useState<ReactElement<NoteProps>[]>()

  const handleClick = () => {
    setFirstSidePanel(Panels.Drafts)
    handleOpenSidePanel()
  }

  const generateNotes = () => {
    let notes: ReactElement<NoteProps>[] = []
    if (drafts !== undefined) {
      forEach(drafts, (draft, index) => {
        notes.push(<Note key={ index } draft={ draft } setColMessage={ setColMessage } onClick={ handleClick } />)
      })
    }
    setNotes(notes)
  }

  useEffect(getDrafts, [])
  useEffect(generateNotes, [drafts])

  return (
    <Container>
      <h2>Borradores</h2>
      {
        message && message.type === DraftMessageTypes.Info &&
        <Alert message={ message.content }
               type={ AlertTypes.Empty } />
      }
      {
        message && message.type === DraftMessageTypes.Error &&
        <Alert message={ message.content + '. Contacte con el administrador.' }
               type={ AlertTypes.Error } />
      }
      {
        message && message.type === DraftMessageTypes.Warning &&
        <Alert message={ message.content } type={ AlertTypes.Warning } />
      }
      {
        !message &&
        <>
          <NoteContainer noteList={ notes } />
          <Options>
            <Button customType={ ButtonTypes.Primary }>{ 'Ver todos' }</Button>
            <Button customType={ ButtonTypes.Danger }>{ 'Eliminar todos los borradores' }</Button>
          </Options>
        </>
      }
    </Container>
  )
}

export default Drafts