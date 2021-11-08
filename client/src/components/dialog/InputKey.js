import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const InputKey = (props) => {
    const [key, setKey] = useState();

    const onOk = (e) => {
        if(key.trim()){
            props.handleOk(key.trim());
        }
    }

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
                    Please input key received by email.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Mint Key"
                    type="text"
                    fullWidth
                    onChange={(e) => setKey(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onOk} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default InputKey;