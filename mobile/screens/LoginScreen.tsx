import { AuthenticationContext } from "../App";
import { LoginState } from "../constants/interfaces/Login.interface";
import * as React from "react";
import { View, Image } from "react-native";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { FlexAlignType, StyleSheet } from "react-native";
import { COLORS } from "../constants/styles/colors.js";
import { styled } from '@mui/material/styles';
import { connect } from "../services/axios";

const flexAlignCenter = { flex: 1, alignItems: "center" as FlexAlignType };

export function LoginScreen() {
  const { signIn } = React.useContext(AuthenticationContext);
  const [values, setValues] = React.useState<LoginState>({
    username: "",
    usernameError: false,
    password: "",
    passwordError: false,
    showPassword: false,
  });

  const handleChange =
    (prop: keyof LoginState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // Request
  const handleFormSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setValues({
      ...values,
      usernameError: false,
      passwordError: false,
    });

    const connectApi = await connect(values.username, values.password)
    if (connectApi.success) {
      signIn({ token: connectApi.token });
    } else {
      setValues({
      ...values,
        usernameError: false,
        passwordError: false,
      });
    }
  };

  const showPasswordEye = (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
        edge="end"
      >
        {values.showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  )

  return (
    <View style={loginScreenStyles.baseFlex}>
      <View style={loginScreenStyles.logoContainer}>
        <Image
          style={loginScreenStyles.logo}
          source={require("../assets/pictures/algeco.png")}
        />
      </View>

      <View style={loginScreenStyles.formContainer}>
        <FormControl
          sx={{ m: 1, width: "100%", margin: "30px 0px 15px 0px" }}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-username">Username</InputLabel>

          <OutlinedInput
            id="outlined-username"
            type="text"
            value={values.username}
            onChange={handleChange("username")}
            label="Username"
            error={values.usernameError}
          />
        </FormControl>

        <FormControl
          sx={{ m: 1, width: "100%", margin: "15px 0px" }}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>

          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? "text" : "password"}
            value={values.password}
            onChange={handleChange("password")}
            endAdornment={showPasswordEye}
            label="Password"
            error={values.passwordError}
          />
        </FormControl>

        <LoginButton
          variant="contained"
          onClick={handleFormSubmit}
        >
          Se connecter
        </LoginButton>
      </View>
    </View>
  );
}


const loginScreenStyles = StyleSheet.create({
    baseFlex: {
        ...flexAlignCenter,
        justifyContent: "center"
    },
    logoContainer: {
        height: "15",
        width: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    logo: {
        width: "100%",
        height: 130,
    },
    formContainer: {
        alignItems: "center",
        justifyContent: "flex-start",
        width: "80%"
    }
});

const LoginButton = styled(Button)({
  marginTop: 30,
  marginRight: 0,
  marginBottom: 15,
  marginLeft: 0,
  width: "100%",
  height: 60,
  fontSize: 21,
  backgroundColor: COLORS.ALGECO_BLUE,
  color: COLORS.WHITE_COLOR
})
