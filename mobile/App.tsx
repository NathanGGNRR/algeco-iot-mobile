import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import * as React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext, AuthState } from "./constants/interfaces/Global.interface.js";
import { LoginScreen } from "./screens/LoginScreen"
import { StyleSheet } from "react-native";
import { COLORS } from "./constants/styles/colors.js";
import { AppScreen } from "./screens/AppScreen"
import { ModuleScreen } from "./screens/ModuleScreen";


export const AuthenticationContext = React.createContext({} as AuthContext);
const Stack = createNativeStackNavigator();

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      userToken: null,
    } as AuthState
  );

  const authenticationContext: AuthContext = React.useMemo(
    () => ({
      signIn: async (data: any) => {
        dispatch({ type: "SIGN_IN", token: data.token })
      },
    }),
    []
  );

  const handleSignOut = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    dispatch({ type: "SIGN_OUT" });
  };

  const screenOptions: NativeStackNavigationOptions  = {
    headerTitle: () => (
      <Image
        style={{ height: "100%", width: 125 }}
        source={require("./assets/pictures/algeco.png")}
      />
    ),
    headerRight: () => (
      <LogoutIcon
        style={{ color: COLORS.ALGECO_BLUE, height: 25, width: 25, marginRight: 10, marginBottom: 15 }}
        onClick={handleSignOut}
      />
    ),
    headerTitleAlign: "center",
    headerTransparent: true,
    headerStyle: appStyles.headerStyle,
  }

  return (
    <NavigationContainer>
      <AuthenticationContext.Provider value={authenticationContext}>
        <Stack.Navigator screenOptions={screenOptions} initialRouteName="App">
          {state.userToken == null ? (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="App"
              component={AppScreen}
            />
          )}
          <Stack.Screen name="Module" component={ModuleScreen} />
        </Stack.Navigator>
      </AuthenticationContext.Provider>
    </NavigationContainer>
  );
}

const appStyles = StyleSheet.create({
    headerStyle: {
        backgroundColor: "transparent",
        borderWidth: 0,
        elevation: 0,
        borderBottomWidth: 0,
        borderBottomColor: "transparent",
    },
    container: {
        backgroundColor: COLORS.BACKGROUND,
    }
});
