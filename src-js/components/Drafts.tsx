import React, { FC, FormEventHandler, MouseEventHandler, ReactElement, useEffect, useState } from 'react'
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
import { DraftMessage, DraftMessageTypes, GetDraft } from '../hooks/useDrafts'
import AlertTypes from '../shapes/AlertTypes'
import { forEach } from 'lodash'
import DraftShape from '../shapes/DraftShape'
import Modal from './Modal'

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
  setFirstSidePanel: (Panel: Panels) => void
  handleOpenSidePanel: () => void
  message: DraftMessage | undefined
  setColMessage: (message: DraftMessage | undefined) => void
  getDrafts: () => void
  getDraft: (data: GetDraft['Request']) => void
  deleteDrafts: () => void
  drafts: DraftShape[] | undefined
}

const Drafts: FC<IProps> = (
  {
    setFirstSidePanel,
    handleOpenSidePanel,
    message,
    setColMessage,
    getDrafts,
    getDraft,
    deleteDrafts,
    drafts,
  }) => {

  const [notes, setNotes] = useState<ReactElement<NoteProps>[]>()
  const [showModal, setShowModal] = useState<boolean>(false)

  const handleClick: MouseEventHandler<HTMLElement> = (e) => {
    setFirstSidePanel(Panels.Drafts)
    // noinspection SpellCheckingInspection
    getDraft({ coddraft: Number(e.currentTarget.id) })
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
            index={ index }
            id={ draft.coddraft.toString() }
            draft={ draft }
            setColDraftMessage={ setColMessage }
            onClick={ handleClick }
          />,
        )
      })
    }
    setNotes(notes)
  }

  const remove: FormEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    deleteDrafts()
  }

  const openDeleteModal = () => {
    setShowModal(true)
  }

  const closeDeleteModal = () => {
    setShowModal(false)
  }

  useEffect(getDrafts, [])
  useEffect(generateNotes, [drafts])

  return (
    <Container>
      {
        showModal &&
        <Modal
          cancel={ closeDeleteModal }
          message={ '¿Seguro que quiere eliminar todos los borradores guardados? Esta acción no puede deshacerse.' }
          leftButton={
            <Button
              customType={ ButtonTypes.Danger }
              onClick={ (e) => {
                closeDeleteModal()
                remove(e)
                close()
              } }
            >
              { 'Sí, eliminar' }
            </Button>
          }
          rightButton={
            <Button
              customType={ ButtonTypes.Secondary }
              onClick={ closeDeleteModal }
            >
              { 'No, cancelar' }
            </Button>
          }
        />
      }
      <h2>Borradores</h2>
      {
        message !== undefined && message.type === DraftMessageTypes.Info &&
        <Alert message={ message.content } type={ AlertTypes.Empty } />
      }
      {
        message !== undefined && message.type === DraftMessageTypes.Error &&
        <Alert message={ message.content + '. Contacte con el administrador.' } type={ AlertTypes.Error } />
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
            <Button
              customType={ ButtonTypes.Danger }
              onClick={ (e) => {
                e.preventDefault()
                openDeleteModal()
              } }
            >
              { 'Eliminar todos los borradores' }
            </Button>
          </Options>
        </>
      }
    </Container>
  )
}

export default Drafts