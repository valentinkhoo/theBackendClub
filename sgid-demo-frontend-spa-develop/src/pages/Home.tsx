import {
  Box,
  FormControl,
  HStack,
  Image,
  Spinner,
  Stack,
  VStack,
} from '@chakra-ui/react'
import { Button, FormLabel, Radio } from '@opengovsg/design-system-react'
import { useCallback, useMemo, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import sgidLogo from '../assets/logo.png'
import singpassLogo from '../assets/singpass.svg'
import { COLOURS } from '../theme/colours'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { VITE_BACKEND_URL } from '../config/constants'

enum IceCreamOptions {
  Vanilla = 'Vanilla',
  Chocolate = 'Chocolate',
  Strawberry = 'Strawberry',
}

export const HomePage = (): JSX.Element => {
  // Radio button state
  const [iceCream, setIceCream] = useState(IceCreamOptions.Vanilla)
  const iceCreamFieldId = useMemo(() => 'icecream', [])
  const handleIceCreamSelection = useCallback((value: IceCreamOptions) => {
    setIceCream(value)
  }, [])

  // Button loading state
  const [isLoading, setIsLoading] = useState(false)

  // Button click handler
  const { showBoundary } = useErrorBoundary()
  const handleLoginBtnClick = useCallback(() => {
    setIsLoading(true)
    fetch(`${VITE_BACKEND_URL}/api/auth-url?icecream=${iceCream}`, {
      credentials: 'include',
    })
      .then(async (r) => await r.json())
      .then(({ url }) => {
        window.location.href = url
      })
      .catch((e: unknown) => {
        setIsLoading(false)
        if (e instanceof Error) {
          showBoundary(e)
        }
        showBoundary(
          new Error(
            'Something went wrong while fetching the authorisation URL.'
          )
        )
      })
  }, [iceCream, showBoundary])

  const { user, isLoading: isUserLoading } = useAuth()

  if (isUserLoading) {
    return <Spinner />
  }
  if (user !== null) {
    return <Navigate to="/logged-in" />
  }
  return (
    <VStack spacing="48px">
      <HStack spacing="48px" justifyContent={'center'}>
        <Box w="30%">
          <Image src={sgidLogo} w="100%" />
        </Box>
        <Box w="40%">
          <Image src={singpassLogo} w="100%" />
        </Box>
      </HStack>
      <FormControl id={iceCreamFieldId} mb={6}>
        <FormLabel.Label>
          Favourite ice cream flavour
          <FormLabel.Description fontWeight={'400'}>
            This shows how you can keep state before and after login.
          </FormLabel.Description>
        </FormLabel.Label>
        <Radio.RadioGroup
          name={iceCreamFieldId}
          onChange={handleIceCreamSelection}
          value={iceCream}
        >
          <Stack spacing="0.5rem">
            {Object.values(IceCreamOptions).map((o, idx) => (
              <Radio allowDeselect={false} key={idx} value={o}>
                {o}
              </Radio>
            ))}
          </Stack>
        </Radio.RadioGroup>
      </FormControl>
      <Button
        onClick={handleLoginBtnClick}
        bgColor={COLOURS.PRIMARY}
        color="white"
        isLoading={isLoading}
      >
        Login with Singpass app
      </Button>
    </VStack>
  )
}
