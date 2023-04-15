import { Platform } from 'react-native'

import { Pressable, theme, useTheme } from 'native-base'

import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs'

import { House, Tag, SignOut } from 'phosphor-react-native'

import {
  previewRouteParams,
  userAdDetailsRouteParams,
  adDetailsParams,
} from 'src/@types/adRouteParams'

import { Home } from '@screens/Home'
import { UserAds } from '@screens/UserAds'
import { AdDetails } from '@screens/AdDetails'
import { CreateAd } from '@screens/CreateAd'
import { EditAd } from '@screens/EditAd'
import { PreviewAd } from '@screens/PreviewAd'
import { UserAdDetails } from '@screens/UserAdDetails'
import { useAuth } from '@hooks/useAuth'

type TAppRoutes = {
  home: undefined
  adDetails: adDetailsParams
  createAd: undefined
  editAd: previewRouteParams
  previewAd: previewRouteParams
  userAdDetails: userAdDetailsRouteParams
  userAds: undefined
  logOut: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<TAppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<TAppRoutes>()

export function AppRoutes() {
  const { sizes, colors } = useTheme()

  const { signOut } = useAuth()

  const iconSize = sizes[6]

  function handleLogOut() {
    signOut()
  }

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.gray[700],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.gray[100],
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: sizes[8],
          paddingTop: sizes[6],
          alignContent: 'center',
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => <House size={iconSize} color={color} />,
        }}
      />
      <Screen
        name="userAds"
        component={UserAds}
        options={{
          tabBarIcon: ({ color }) => <Tag size={iconSize} color={color} />,
        }}
      />
      <Screen
        name="logOut"
        component={SignOut}
        options={{
          tabBarIcon: () => (
            <Pressable
              onPress={handleLogOut}
              style={{ alignItems: 'baseline' }}
              h={'24px'}
              w={'24px'}
            >
              <SignOut size={iconSize} color={theme.colors.red[400]} />
            </Pressable>
          ),
        }}
      />
      <Screen
        name="adDetails"
        component={AdDetails}
        options={{
          tabBarButton: () => null,
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Screen
        name="createAd"
        component={CreateAd}
        options={{
          tabBarButton: () => null,
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Screen
        name="editAd"
        component={EditAd}
        options={{
          tabBarButton: () => null,
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Screen
        name="previewAd"
        component={PreviewAd}
        options={{
          tabBarButton: () => null,
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Screen
        name="userAdDetails"
        component={UserAdDetails}
        options={{
          tabBarButton: () => null,
          tabBarShowLabel: false,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Navigator>
  )
}
