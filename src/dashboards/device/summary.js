import * as React from 'react';
import { 
    TextField,
    ReferenceField,
} from 'react-admin'
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import DeviceServices from '../../ui/DeviceServices';

const useStyles = makeStyles(() =>
  createStyles({
    outerTable: {
        '& td': {
            borderBottom: "none",
            width: "50%",
            padding: "0px",
            verticalAlign: "top",
            paddingLeft: "10px",
            paddingRight: "10px",
        }
    },
    innerTable: {
        '& td': {
            borderBottom: "none",
            width: "25%",
            padding: "4px"
        }
    },
    headerRow: {
        borderBottom: "2px #cccccc solid",
        '& td': {
            fontSize: "12pt",
            fontWeight: "bold",
            textAlign:"center"    
        }
    },
    dataRow: {
        '& td': {
            height: "30px",
        }
    },
    labelCell: {
        fontWeight: "bold"
    },
    valueCell: {
        textAlign: "right",
    },
  }),
);

const Summary = (props) => {
    const classes = useStyles();
    let { record } = props;
    return (
        <Table className={classes.outerTable}>
            <TableBody>
                <TableRow>
                    <TableCell>
                        <Table className={classes.innerTable}>
                            <TableBody>
                                <TableRow className={classes.headerRow}>
                                    <TableCell colSpan={4}> Status </TableCell>
                                </TableRow>
                                <TableRow className={classes.dataRow}>
                                    <TableCell class={classes.labelCell}>UUID</TableCell>
                                    <TableCell class={classes.valueCell}>
                                    </TableCell>
                                    <TableCell class={classes.labelCell}>Fleet</TableCell>
                                    <TableCell class={classes.valueCell}>
                                        <ReferenceField label="Fleet" source="belongs to-application" reference="application" target="id">
                                            <TextField source="app name" />
                                        </ReferenceField>
                                    </TableCell>
                                </TableRow>
                                <TableRow className={classes.dataRow}>
                                    <TableCell class={classes.labelCell}>Devices</TableCell>
                                    <TableCell class={classes.valueCell}>{record['numDevices']}</TableCell>
                                </TableRow>
                                <TableRow className={classes.dataRow}>
                                    <TableCell class={classes.labelCell}>Online</TableCell>
                                    <TableCell class={classes.valueCell}>{record['numOnlineDevices']}</TableCell>
                                </TableRow>
                                <TableRow className={classes.dataRow}>
                                    <TableCell class={classes.labelCell}>Type</TableCell>
                                    <TableCell class={classes.valueCell}>{record['deviceTypeName']}</TableCell>
                                </TableRow>
                                <TableRow className={classes.dataRow}>
                                    <TableCell colSpan={4} align="center">
                                        Foo
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableCell>
                    <TableCell>
                        <Table className={classes.innerTable}>
                            <TableBody>
                                <TableRow className={classes.headerRow}>
                                    <TableCell colSpan={4}> Services </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <DeviceServices {...props}/>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default Summary;