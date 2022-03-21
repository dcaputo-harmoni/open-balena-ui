import * as React from 'react';
import { 
    TextField,
    ReferenceField,
    ChipField
} from 'react-admin'
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
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
    labelCell: {
        fontWeight: "bold"
    },
    valueCell: {
        paddingRight: "10px",
        marginRight: "10px"
    },
}));

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
                                <TableRow class={classes.headerRow}>
                                    <TableCell colspan={4}> Device Status </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.labelCell}>UUID</TableCell>
                                    <TableCell className={classes.valueCell}>
                                        <TextField source="uuid"/>
                                    </TableCell>
                                    <TableCell className={classes.labelCell}>Fleet</TableCell>
                                    <TableCell className={classes.valueCell}>
                                        <ReferenceField label="Fleet" source="belongs to-application" reference="application" target="id">
                                            <ChipField source="app name" />
                                        </ReferenceField>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.labelCell}>Devices</TableCell>
                                    <TableCell className={classes.valueCell}>{record['numDevices']}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.labelCell}>Online</TableCell>
                                    <TableCell className={classes.valueCell}>{record['numOnlineDevices']}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.labelCell}>Type</TableCell>
                                    <TableCell className={classes.valueCell}>{record['deviceTypeName']}</TableCell>
                                </TableRow>
                                <TableRow>
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
                                <TableRow class={classes.headerRow}>
                                    <TableCell colspan={4}> Device Containers </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.labelCell}>UUID</TableCell>
                                    <TableCell className={classes.valueCell}>
                                        <TextField source="uuid"/>
                                    </TableCell>
                                    <TableCell className={classes.labelCell}>Fleet</TableCell>
                                    <TableCell className={classes.valueCell}>
                                        <ReferenceField label="Fleet" source="belongs to-application" reference="application" target="id">
                                            <ChipField source="app name" />
                                        </ReferenceField>
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