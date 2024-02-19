import React from "react";
import styles from "./Navbar.module.css"; 
import Avatar from "react-avatar";
import Menu from "@mui/material/Menu";
import { Link } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Help from "../../assests/icons/Help.png";
import Settings from "../../assests/icons/Setting.png";
import Logout from "../../assests/icons/Logout.png";
import Badge from "@mui/material/Badge";
import Sidebar from "../Sidebar/Sidebar";
import aboutus from "../../assests/icons/aboutus.png"
import logoicon from '../../assests/icons/eco-journey-logo-icon-bg.png'
import logotext from '../../assests/icons/eco-journey-logo-text-bg.png'
const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <nav className={styles.navbar}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <Sidebar />
        </div>
        <span className={styles.navLink}><img src={logoicon} style={{height:'30px'}} alt="" /><img style={{height:'30px'}} src={logotext} alt="" /></span>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div className={styles.containerInput}>
          <input type="text" placeholder="Search" name="text" className={styles.input} />
          <svg
            fill="#000000"
            width="20px"
            height="20px"
            viewBox="0 0 1920 1920"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M790.588 1468.235c-373.722 0-677.647-263.924-677.647-677.647 0-373.722 263.925-677.647 677.647-677.647 373.723 0 677.647 263.925 677.647 677.647 0 373.723-263.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div className={styles.avatar}>
          <Badge
            color="success"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            overlap="circular"
            badgeContent=" "
            variant="dot"
          >
            <Avatar
              onClick={handleClick}
              src="https://avatars.githubusercontent.com/u/101623496?v=4"
              size="50"
              round={true}
            />
          </Badge>
        </div>
         
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        style={{ marginTop: "10px", borderRadius: "10px" }}
      >
        <MenuItem onClick={handleClose} to="/profile" component={Link} className={styles.MenuItems}>

          <div className={styles.Profile}>
            <Badge
              style={{color:'red!important'}}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              overlap="circular"
              badgeContent=" "
              variant="dot"
            >
              <Avatar
                onClick={handleClick}
                src="https://avatars.githubusercontent.com/u/101623496?v=4"
                size="50"
                round={true}
              />
            </Badge>
           
              <div
                
                style={{  fontSize: "17px", fontWeight:"bold" , fontFamily:"sans-serif"}}
              >
                Asheerul Haque
              </div>
              <div
               
                style={{ fontSize: "15px"}}
              >
                admin
            </div>
          </div>
        </MenuItem>
        <MenuItem onClick={handleClose} to="/aboutus" component={Link} className={styles.MenuItems}>
          <ListItemIcon >
             <img src={aboutus} alt="Help" width={26} height={26}/>
          </ListItemIcon>
          About Us
        </MenuItem>
        <MenuItem onClick={handleClose} to="/settings" component={Link} className={styles.MenuItems}>
          <ListItemIcon >
            <img src={Settings} alt="Setting" width={26} height={26}/>
          </ListItemIcon>
          Settings
        </MenuItem>
        
        <Divider />
        <MenuItem onClick={handleClose} to="/help" component={Link} className={styles.MenuItems}>
          <ListItemIcon >
             <img src={Help} alt="Help" width={26} height={26}/>
          </ListItemIcon>
          Help
        </MenuItem>
        
        <MenuItem onClick={handleClose}  className={styles.MenuItems}>
          <ListItemIcon >
            <img src={Logout} alt="Logout" width={25} height={25}/>
          </ListItemIcon>
          Logout
        </MenuItem>
         <Divider />
         <div
               
                style={{display:'flex', alignItems:'center',justifyContent:'space-evenly', fontSize: "15px", padding:'10px'}}
              >
                <span>Privacy Policy</span>&#8226;
               <span>Terms & Service</span>
            </div>
      </Menu>
    </nav>
  );
};

export default Navbar;
