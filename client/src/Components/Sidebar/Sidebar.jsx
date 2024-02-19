import * as React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard'
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import Logo from '../../assests/logo/logo.png';
import MenuIcon from '@mui/icons-material/Menu'; // Import Menu icon
import styles from  './Sidebar.module.css'; // Import your CSS file for styling
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Import Logout icon
import logoicon from '../../assests/icons/eco-journey-logo-icon-bg.png'
import logotext from '../../assests/icons/eco-journey-logo-text-bg.png'
import { NavLink } from 'react-router-dom';


function SwipeableTemporaryDrawer() {
  const [state, setState] = React.useState({
    left: false, // Only 'left' anchor is used
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
  className={styles.sidebar}
  height="100vh"
  sx={{ width: 280}}
  role="presentation"
  onClick={toggleDrawer(anchor, false)}
  onKeyDown={toggleDrawer(anchor, false)}
>
  {/* Add logo image here */}
  <NavLink to="/"><div style={{display:'flex', flexDirection:'column',padding:'30px 0px 0px 0px'}}>
  <img src={logoicon} style={{height:'155px', width:'auto', padding:'2px'}} alt='logo' className={styles.logo}/>
  <img src={logotext} style={{height:'50px', width:'1100px ',margin:'0 0 0 25px'}} alt='logo' className={styles.logo}/>
  </div>
  </NavLink>
 
   <List className={styles.menuItems}>
    <ListItemButton to="/dashboard"  component={Link} className={styles.menuList}>
      <ListItemIcon>
        <DashboardIcon className={styles.icon}/>
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton to="/analytics"  component={Link}className={styles.menuList}>
      <ListItemIcon>
        <BarChartIcon className={styles.icon}/>
      </ListItemIcon>
      <ListItemText primary="Analytics" />
    </ListItemButton>
    <ListItemButton to="/carpooling"  component={Link} className={styles.menuList}>
      <ListItemIcon>
        <DashboardIcon className={styles.icon}/>
      </ListItemIcon>
      <ListItemText primary="Carpooling" />
    </ListItemButton>
    <ListItemButton to="/profile"  component={Link} className={styles.menuList}>
      <ListItemIcon>
        <AccountCircleIcon className={styles.icon}/>
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItemButton>
    <ListItemButton to="/settings"  component={Link} className={styles.menuList}>
      <ListItemIcon>
        <SettingsIcon className={styles.icon}/>
      </ListItemIcon>
      <ListItemText  primary="Settings" />
    </ListItemButton>

      <ListItemButton className={styles.lastItem}>
        <ListItemIcon>
          <ExitToAppIcon className={styles.icon} style={{color:'#E34040'}} /> {/* You will need to import the ExitToAppIcon component */}
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
  </List>
</Box>

  );

  return (
    <div>
      <React.Fragment>
        <Button onClick={toggleDrawer('left', true)}>
          <MenuIcon className={styles.menuIcon}/> 
        </Button>
        <SwipeableDrawer
          anchor="left"
          open={state.left}
          onClose={toggleDrawer('left', false)}
          onOpen={toggleDrawer('left', true)}
        >
          {list('left')}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}

export default SwipeableTemporaryDrawer;
