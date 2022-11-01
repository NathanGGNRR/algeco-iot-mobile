import * as React from "react";
import { Text, View } from "react-native";
import { InformationProps } from "../constants/interfaces/App.interface";
import { StyleSheet } from "react-native";
import { Icon } from "@mui/material";

export class InformationComponent extends React.Component<InformationProps> {
    constructor(props: InformationProps) {
        super(props);
    }

    render() {
        return (
            <View style={appScreenStyles.informationContainer}>
                <Text style={this.props.textInformation}>
                    { this.props.value !== undefined ? `${this.props.value}${this.props.unit}` : '--' }
                </Text>

                <Icon style={{ fontSize: 100 }}>
                    {this.props.children}
                </Icon>
            </View>
        )
    }
}

const appScreenStyles = StyleSheet.create({
    informationContainer: {
        flex: 1,
        alignItems: "center",
        marginTop: 0,
        flexDirection: "row"
    }
});
