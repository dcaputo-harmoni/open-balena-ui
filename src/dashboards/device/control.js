import React from "react";
import { 
    useAuthProvider,
    useNotify,
} from 'react-admin';
import {
    Grid,
    Button,
    Card,
    Typography
 } from '@mui/material'; 
 import utf8decode from '../../lib/utf8decode';

 const Control = props => {
    const authProvider = useAuthProvider();
    const notify = useNotify();

    const invokeSupervisor = (device, command) => {
        const session = authProvider.getSession();
        return fetch(`${process.env.REACT_APP_OPEN_BALENA_API_URL}/supervisor/v1/${command}`, {
            method: 'POST',
            body: JSON.stringify({ "uuid": device.uuid }),
            headers: new Headers({ 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.jwt}`,
            }),
            insecureHTTPParser: true
        }).then(response => {
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            return response.body.getReader().read().then((streamData) => {
                const result = utf8decode(streamData.value);
                if (result === "OK") notify(`Successfully executed command ${command} on device ${device['device name']}`);
            })
        })
        .catch(() => {
            notify(`Error: Could not execute command ${command} on device ${device['device name']}`)
        });
    }

    return (
        <Grid container spacing={2} columns={12}>
            <Grid item xs={4} key={1}>
                <Card sx={{padding: "0.75em"}}>
                    <Typography variant="subtitle1" gutterBottom sx={{textAlign: "center", fontWeight: "bold"}}>
                        Device Control
                    </Typography>
                    <Button onClick={() => invokeSupervisor(props.record, "blink")} variant={"contained"} sx={{p:"4px", m:"4px", minWidth:"180px"}}>Blink</Button> Blink indicator light on device<br/>
                    <Button onClick={() => invokeSupervisor(props.record, "reboot")} variant={"contained"} sx={{p:"4px", m:"4px", minWidth:"180px"}}>Reboot</Button> Reboot device <br/>
                    <Button onClick={() => invokeSupervisor(props.record, "shutdown")} variant={"contained"} sx={{p:"4px", m:"4px", minWidth:"180px"}}>Shutdown</Button> Shut down device <br/>
                </Card>
            </Grid>
            <Grid item xs={4} key={2}>
                <Card sx={{padding: "0.75em"}}>
                    <Typography variant="subtitle1" gutterBottom sx={{textAlign: "center", fontWeight: "bold"}}>
                        Container Control
                    </Typography>
                    <Button onClick={() => invokeSupervisor(props.record, "blink")} variant={"contained"} sx={{p:"4px", m:"4px", minWidth:"180px"}}>Blink</Button> Blink indicator light on device<br/>
                    <Button onClick={() => invokeSupervisor(props.record, "reboot")} variant={"contained"} sx={{p:"4px", m:"4px", minWidth:"180px"}}>Reboot</Button> Reboot device <br/>
                    <Button onClick={() => invokeSupervisor(props.record, "shutdown")} variant={"contained"} sx={{p:"4px", m:"4px", minWidth:"180px"}}>Shutdown</Button> Shut down device <br/>
                </Card>
            </Grid>
            <Grid item xs={4} key={3}>
                <Card sx={{padding: "0.75em"}}>
                    <Typography variant="subtitle1" gutterBottom sx={{textAlign: "center", fontWeight: "bold"}}>
                        Fleet Control
                    </Typography>
                    <Button onClick={() => invokeSupervisor(props.record, "blink")} variant={"contained"} sx={{p:"4px", m:"4px", minWidth:"180px"}}>Blink</Button> Blink indicator light on device<br/>
                    <Button onClick={() => invokeSupervisor(props.record, "reboot")} variant={"contained"} sx={{p:"4px", m:"4px", minWidth:"180px"}}>Reboot</Button> Reboot device <br/>
                    <Button onClick={() => invokeSupervisor(props.record, "shutdown")} variant={"contained"} sx={{p:"4px", m:"4px", minWidth:"180px"}}>Shutdown</Button> Shut down device <br/>
                </Card>
            </Grid>
        </Grid>
    )}
export default Control;