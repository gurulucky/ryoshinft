import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const Alert = (props) => {
    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Ryoshi vision"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.text}                    
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary" autoFocus>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Alert;