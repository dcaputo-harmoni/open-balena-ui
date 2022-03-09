import * as React from "react";
import {
    TextField,
    Datagrid,
    List,
} from 'react-admin';

export const ServiceInstanceList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField label="Service Type" source="service type" />
                <TextField label="IP Address" source="ip address" />
                <TextField label="Last Heartbeat" source="last heartbeat" />
            </Datagrid>
        </List>
    )
};

const serviceInstnace = {
    list: ServiceInstanceList,
}

export default serviceInstnace;