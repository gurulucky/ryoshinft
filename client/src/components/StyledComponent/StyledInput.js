import { TextField, Button, Card, Tabs, Tab, Checkbox } from "@material-ui/core";
import { styled } from "@material-ui/system";
import { CircularProgress } from '@mui/material';

export const AmountField = styled(TextField)({
    '& label.Mui-focused': {
        color: "rgb(225,0,0)",
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: "rgb(225,0,0)",
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: "rgb(226 29 29)",
        },
        '&:hover fieldset': {
            borderColor: "rgb(225,0,0)",
        },
        '&.Mui-focused fieldset': {
            borderColor: "rgb(225,0,0)",
        },
    },
    '& .MuiOutlinedInput-input': {
        color: "rgb(221, 221, 221)"
    },
    '& .MuiInputLabel-root': {
        color: "rgb(221, 221, 221)"
    },
});

export const SelectShow = styled(TextField)({
    fontFamily: "Poppins, sans-serif",
    '& label.Mui-focused': {
        color: "rgb(225,0,0)",
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: "rgb(225,0,0)",
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: "rgb(226 29 29)",
        },
        '&:hover fieldset': {
            borderColor: "rgb(225,0,0)",
        },
        '&.Mui-focused fieldset': {
            borderColor: "rgb(225,0,0)",
        },
    },
    '& .MuiOutlinedInput-input': {
        color: "rgb(221, 221, 221)",
        padding:'7px 14px'
    },
    '& .MuiInputLabel-root': {
        color: "rgb(221, 221, 221)"
    },
    
});

export const BuyButton = styled(Button)({
    color: "white",
    backgroundColor: "rgb(225, 29, 29)",
    boxShadow: "5px 5px 5px -2px rgb(148 0 0 / 68%)",
    fontFamily: "Poppins, sans-serif",
    '&:hover': {
        backgroundColor: "rgb(255, 42, 42)",
        boxShadow: "5px 5px 5px -2px rgb(148 0 0 / 68%)",
    },
    '&:disabled': {
        backgroundColor: "rgb(116, 26, 26)",

        color: "grey"
    },
    textTransform: "inherit"
});

export const ConnectButton = styled(Button)({
    color: "white",
    backgroundColor: "rgb(225, 29, 29)",
    boxShadow: "5px 5px 5px -2px rgb(249 4 4 / 68%)",
    fontFamily: "Poppins, sans-serif",
    '&:hover': {
        backgroundColor: "rgb(255, 42, 42)",
        boxShadow: "5px 5px 5px -2px rgb(249 4 4 / 68%)",
    },
    '&:disabled': {
        backgroundColor: "rgb(116, 26, 26)",
        color: "grey"
    },
    minWidth: "32px"
});

export const NavMenuItem = styled(Button)(({ theme }) => ({
    color: "white",
    fontFamily: "Poppins, sans-serif",
    fontWeight: "400",
    fontSize: "1.2rem",
    lineHeight: "1.334",
    letterSpacing: "0em",
    // maxWidth: "100px",
    // textShadow:"7px 6px 10px black",
    '&:hover': {
        color: "red",
    },
    textTransform: "inherit"
}));

export const StyledCard = styled(Card)({
    backgroundColor: "rgb(62, 62, 62)",
    // p: "6px",
    // maxWidth: {xs:"260px"},
    width: '100%',
    borderRadius: "18px",
    boxShadow: "11px 11px 6px -1px rgb(160 160 160 / 20%)",

});

export const StyledTabs = styled((props) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: '#ff0000',
    },
    marginBottom: "20px",
});

export const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        fontFamily: "Poppins, sans-serif",
        textTransform: 'none',
        fontWeight: "400",
        fontSize: "18px",
        marginRight: "2px",
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-selected': {
            color: '#fff',
        },
        '&.Mui-focusVisible': {
            backgroundColor: 'rgba(100, 95, 228, 0.32)',
        },
    }),
);

export const StyledCheckbox = styled(Checkbox)({
    color: 'rgb(225, 29, 29)',
    '&.Mui-checked': {
        color: 'rgb(255, 42, 42)',
    },
});

export const StyledCircleProgress = styled(CircularProgress)({
    color: 'white'
});