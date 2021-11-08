import React from 'react';
import { Link } from 'react-router-dom';
import { Stack, Drawer, Typography, Divider } from '@material-ui/core';
import { NavMenuItem } from '../StyledComponent/StyledInput';

export default function TemporaryDrawer(props) {
  const list = (
    <Stack direction="column" alignItems="center" spacing={5} sx={{ width: 250, height: "100%", backgroundColor: "rgb(62, 62, 62)" }}
      role="presentation"
      onClick={props.closeDrawer}
      onKeyDown={props.closeDrawer}>
      <Stack direction="row" sx={{ p: "10px", backgroundColor: "rgb(19, 5, 5)" }}>
        <img src="/logo.png" width="64px" alt="logo"></img>
        <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>
          Ryoshi Vision Concerts
        </Typography>
      </Stack>
      <Divider sx={{ m: "20px" }} />
      <Link to='/drop' style={{ textDecoration: 'none' }}>
        <NavMenuItem variant="h5" color="white">
          Drop
        </NavMenuItem>
      </Link>
      <Link to='/market' style={{ textDecoration: 'none' }}>
        <NavMenuItem variant="h5" color="white">
          Mercatus
        </NavMenuItem>
      </Link>
      <Link to='/assets' style={{ textDecoration: 'none' }}>
        <NavMenuItem variant="h5" color="white">
          Forge
        </NavMenuItem>
      </Link>
      <a href='https://ryoshi.vision' style={{ textDecoration: 'none' }} target='_blank' rel="noreferrer">
        <NavMenuItem variant="h6" color="white">
          Buy Ryoshi
        </NavMenuItem>
      </a>
      {
        props.manager ?
          <Link to='/manager' style={{ textDecoration: 'none' }}>
            <NavMenuItem variant="h5">
              Manager
            </NavMenuItem>
          </Link>
          : null
      }
    </Stack>

  );

  return (
    <Drawer
      anchor={"left"}
      open={props.open}
      onClose={props.closeDrawer}
    >
      {list}
    </Drawer>
  );
}
