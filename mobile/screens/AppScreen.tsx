
import * as React from "react";
import { View } from "react-native";
import { AppState, ModuleState } from "../constants/interfaces/App.interface";
import { FlexAlignType, StyleSheet } from "react-native";
import { COLORS } from "../constants/styles/colors.js";
import { getModules } from '../services/axios';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import VisibilityIcon from '@mui/icons-material/Visibility';
import cloneDeep from 'lodash/cloneDeep';

export function AppScreen({ navigation }) {
  const [values, setValues] = React.useState<AppState>({
    modules: [],
  });

  const handleModules = (module, status) => {
    const modulesCloned = cloneDeep(values.modules)
    module.status = status
    modulesCloned[modulesCloned.indexOf(modulesCloned.find(item => item.deviceId == module.deviceId))] = module
    setValues({...values, modules: modulesCloned})
  }

  const listItem = (module: any, modules: any, setValuesFromList: any) => {
    return (
      <Box
        key={module.deviceId}
        sx={{
          bgcolor: COLORS.WHITE_COLOR,
          width: 1
        }}
      >
        <ListItemButton
          alignItems="flex-start"
          sx={{
            px: 3,
            pt: 2.5,
            '&:hover, &:focus': { '& svg': { opacity: 0 } },
          }}
          onClick={() => navigation.navigate('Module', {
            deviceName: module.deviceId,
            status: module.status,
            values: values,
            handleModules: handleModules
          })}
        >
          <ListItemText
            primary={ module.deviceId }
            primaryTypographyProps={{
              fontSize: 15,
              fontWeight: 'medium',
              lineHeight: '20px',
              mb: '2px',
              color: COLORS.ALGECO_BLUE
            }}
            secondary={`Température: ${module.temperature}°C, Humidité: ${module.humidity}%, Chauffage ${module.status ? "ON" : "OFF"}`}
            secondaryTypographyProps={{
              noWrap: true,
              fontSize: 12,
              lineHeight: '16px',
              color: 'rgba(9, 29, 100,0.5)',
            }}
            sx={{ my: 0 }}
          />
          <VisibilityIcon
            sx={{
              mr: -1,
              opacity: 0,
              transition: '0.2s',
            }}
          />
        </ListItemButton>
      </Box>
    )
  }

  React.useEffect(async () => {
    let modules: any[] = []
    await getModules()
      .then(result => {
        result.forEach((module, index) => {
          module.status = true
        })
        modules = result
      })
      .catch(error => {
        console.log(error)
      })
    setValues(state => ({...state, modules: modules }))
  }, []);

  return (
    <View style={appScreenStyles.baseFlex}>
      {
        values.modules.map(({ deviceId, humidity, temperature, status, data }) => listItem({ deviceId, humidity, temperature, status, data }, values.modules, setValues)
      )}
    </View>
  );
}

const flexAlignCenter = { flex: 1, alignItems: "center" as FlexAlignType };

const appScreenStyles = StyleSheet.create({
    baseFlex: {
        ...flexAlignCenter,
        justifyContent: "center",
        width: '100%'
    }
});
