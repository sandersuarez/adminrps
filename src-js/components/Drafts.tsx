import React, { FC, MouseEventHandler, ReactElement, useEffect, useState } from 'react'
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
import { DraftMessage, DraftMessageTypes } from '../hooks/useDrafts'
import AlertTypes from '../shapes/AlertTypes'
import { forEach } from 'lodash'
import DraftShape, { DraftContent } from '../shapes/DraftShape'

const Container = styled.article`
  margin-top: ${ margins.mobile.bigVertical };
  display: flex;
  flex-direction: column;
  gap: ${ margins.mobile.mediumVertical };

  h3 {
    line-height: 1em;
  }

  ${ breakpoints.tablet } {
    margin-top: ${ margins.tablet.bigVertical };
    gap: ${ margins.tablet.mediumVertical };
  }
`

interface IProps {
  setFirstSidePanel: React.Dispatch<React.SetStateAction<Panels>>
  handleOpenSidePanel: () => void
  message: DraftMessage | undefined
  setColMessage: React.Dispatch<React.SetStateAction<DraftMessage | undefined>>
  getDrafts: () => void
  getDraft: (draftID: number) => void
  drafts: (DraftShape & DraftContent)[] | undefined
}

const Drafts: FC<IProps> = (
  {
    setFirstSidePanel,
    handleOpenSidePanel,
    message,
    setColMessage,
    getDrafts,
    getDraft,
    drafts,
  }) => {

  const [notes, setNotes] = useState<ReactElement<NoteProps>[]>()

  const handleClick: MouseEventHandler<HTMLElement> = (e) => {
    setFirstSidePanel(Panels.Drafts)
    getDraft(Number(e.currentTarget.id))
    handleOpenSidePanel()
  }

  const generateNotes = () => {
    let notes: ReactElement<NoteProps>[] = []
    if (drafts !== undefined) {
      forEach(drafts, (draft, index) => {

        // noinspection SpellCheckingInspection
        notes.push(
          <Note
            key={ index }
            id={ draft.coddraft.toString() }
            draft={ draft }
            setColMessage={ setColMessage }
            onClick={ handleClick }
          />,
        )
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
        message !== undefined && message.type === DraftMessageTypes.Info &&
        <Alert message={ message.content }
               type={ AlertTypes.Empty } />
      }
      {
        message !== undefined && message.type === DraftMessageTypes.Error &&
        <Alert message={ message.content + '. Contacte con el administrador.' }
               type={ AlertTypes.Error } />
      }
      {
        message !== undefined && message.type === DraftMessageTypes.Warning &&
        <Alert message={ message.content } type={ AlertTypes.Warning } />
      }
      {
        drafts !== undefined &&
        <>
          <NoteContainer noteList={ notes } />
          <Options>
            <Button customType={ ButtonTypes.Danger }>{ 'Eliminar todos los borradores' }</Button>
          </Options>
        </>
      }
    </Container>
  )
}

export default Drafts