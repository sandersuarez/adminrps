import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import colors from '../../styles/colors'

const Details = styled(motion.details)`
  display: flex;
  border-radius: .5rem;
  border: 1px solid ${ colors.primary };
  overflow: hidden;

  p {
    margin: 0;
  }
`

export default Details