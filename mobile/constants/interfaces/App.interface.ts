import { ReactNode } from "react";

export interface ChartData {
  name: String;
  temp: Number;

}

export interface AppState {
  modules: ModuleState[];
}

export interface ModuleState {
  deviceId: String;
  status: Boolean;
  data: Array<ChartData>;
  temperature: Number;
  humidity: Number;
}

export interface TextInformation {
  fontSize: Number;
  color: String;
}

export interface InformationProps {
  value: Number;
  unit: String;
  textInformation: TextInformation;
  children: ReactNode;
}
