import PowerIcon from '@mui/icons-material/PowerSettingsNew';
import Thermostat from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import IconButton from "@mui/material/IconButton";
import * as React from "react";
import { Dimensions, Text, View } from "react-native";
import { ModuleState } from "../constants/interfaces/App.interface";
import { FlexAlignType, StyleSheet } from "react-native";
import { COLORS } from "../constants/styles/colors.js";
import { InformationComponent } from "../components/InformationComponent"
import { getModule } from '../services/axios';

const screenWidth = Dimensions.get('window').width;

export function ModuleScreen({ route, navigation }) {
  const { deviceName, status, values, handleModules } = route.params;
  const [moduleCloned, setValues] = React.useState<ModuleState>({
    status: status
  });

  const modules = values.modules
  let interval = React.useRef(null)

  const handleOnOffButton = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setValues({...moduleCloned, status: !moduleCloned.status})
  };

  React.useEffect(async () => {
    await getModule(deviceName)
      .then(result => {
        const response = result
        setValues({status: moduleCloned.status, temperature: response.temperature,  deviceId: response.deviceId, data: response.data, humidity: response.humidity})
      })
      .catch(error => {
        console.log(error)
      })

    interval.current = setInterval(async () => {
      await getModule(deviceName)
        .then(result => {
          const responseInterval = result
          setValues(moduleCloned => ({status: moduleCloned.status, temperature: responseInterval.temperature,  deviceId: responseInterval.deviceId, data: responseInterval.data, humidity: responseInterval.humidity}))
        })
        .catch(error => {
          console.log(error)
        })
    }, 5000);

    return () => {
      clearInterval(interval.current);
    };
  }, []);


  React.useEffect(() => {
    handleModules(moduleCloned, moduleCloned.status)
  }, [moduleCloned]);

  return (
    <View style={appScreenStyles.baseFlex}>
      <View style={appScreenStyles.informationsContainer}>
        <InformationComponent value={moduleCloned.temperature} unit="°C" textInformation={appScreenStyles.textTempInformation}>
          <Thermostat style={{ fontSize: 100, color: COLORS.TEMP_COLOR }}/>
        </InformationComponent>

        <InformationComponent value={moduleCloned.humidity} unit="%" textInformation={appScreenStyles.textHumInformation}>
          <OpacityIcon style={{ fontSize: 100, marginLeft: 8, color: COLORS.HUMIDITY_COLOR }}/>
        </InformationComponent>

      </View>

      <View style={appScreenStyles.chartContainer}>
        <Text>Température</Text>

        <AreaChart
            width={screenWidth}
            height={300}
            data={moduleCloned.data}
            margin={{ top: 10, right: 0, left: -35, bottom: 0 }}
        >
            <CartesianGrid strokeDasharray="3 3"/>

            <XAxis dataKey="date" label="Date"/>

            <YAxis label="Température"/>

            <Tooltip/>

            <Area
                type="monotone"
                dataKey="temperature"
                stroke="#8884d8"
                fill="#8884d8"
            />
        </AreaChart>
      </View>

      <View style={appScreenStyles.buttonContainer}>
        <IconButton
            style={{ backgroundColor: moduleCloned.status ? COLORS.ALGECO_BLUE : COLORS.RED_COLOR, padding: 50 }}
            onClick={handleOnOffButton}
            size="large"
        >
            <PowerIcon style={{ color: COLORS.WHITE_COLOR, fontSize: 40 }} />
        </IconButton>

        <Text style={appScreenStyles.powerText}>
            État du chauffage : {moduleCloned.status ? "marche" : "à l'arrêt"}
        </Text>
      </View>
    </View>
  );
}

const flexAlignCenter = { flex: 1, alignItems: "center" as FlexAlignType };
const fontSizeTen = { fontSize: 100 };

const appScreenStyles = StyleSheet.create({
    baseFlex: {
        ...flexAlignCenter,
        justifyContent: "center"
    },
    informationsContainer: {
        ...flexAlignCenter,
        marginBottom: 80,
        marginTop: 50,
        justifyContent: "center"
    },
    informationContainer: {
        ...flexAlignCenter,
        marginTop: 0,
        flexDirection: "row"
    },
    textTempInformation: {
        ...fontSizeTen,
        color: COLORS.TEMP_COLOR
    },
    textHumInformation: {
        ...fontSizeTen,
        color: COLORS.HUMIDITY_COLOR
    },
    iconInformation: {
        ...fontSizeTen,
        marginLeft: 8
    },
    chartContainer: {
        ...flexAlignCenter,
        marginBottom: 0,
        justifyContent:"flex-end"
    },
    buttonContainer: {
        ...flexAlignCenter,
        justifyContent: "flex-end"
    },
    powerText: {
        margin:20,
        fontSize:30
    }
});
