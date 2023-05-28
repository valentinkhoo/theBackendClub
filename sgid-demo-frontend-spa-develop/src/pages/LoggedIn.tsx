import {
  HStack,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
  VStack,
} from '@chakra-ui/react'
import { Navigate } from 'react-router-dom'
import { LogOutButton } from '../components/LogOutButton'
import { useAuth } from '../hooks/useAuth'

export const LoggedInPage = (): JSX.Element => {
  const { isLoading, user } = useAuth()

  if (isLoading) {
    return <Spinner />
  }
  if (user === null) {
    return <Navigate to="/" />
  }
  return (
    <VStack spacing="32px">
      <Heading>Logged in successfully!</Heading>
      <TableContainer>
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td>sgID</Td>
              <Td>{user.sub}</Td>
            </Tr>
            <Tr>
              <Td>Name</Td>
              <Td>{user.data['myinfo.name']}</Td>
            </Tr>
            <Tr>
              <Td>Favourite ice cream flavour</Td>
              <Td>{user.data.iceCream}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <HStack justifyContent={'center'} w="100%">
        <LogOutButton />
      </HStack>
    </VStack>
  )
}
