import styled from '@emotion/styled'
import { motion } from 'framer-motion'

const DetailsArrow = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  svg {
    width: 1.4rem;
  }
`

export default DetailsArrow