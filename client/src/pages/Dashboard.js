import React, { useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Divider,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WalletIcon from "@mui/icons-material/Wallet";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import TranslateIcon from "@mui/icons-material/Translate";
import HotelIcon from "@mui/icons-material/Hotel";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LuggageIcon from "@mui/icons-material/Luggage";
import ShieldIcon from "@mui/icons-material/Shield";

import { logout } from "../redux/actions/authActions";

// Views
import DashboardHome from "./dashboard/DashboardHome";
import TripsView from "./dashboard/TripsView";
import ExpensesView from "./dashboard/ExpensesView";
import WeatherView from "./dashboard/WeatherView";
import TranslatorView from "./dashboard/TranslatorView";
import BookingView from "./dashboard/BookingView";
import ProfileView from "./dashboard/ProfileView";
import TripDetail from "./dashboard/TripDetail";
import PackingView from "./dashboard/PackingView";
import CultureSafetyAlerts from "./dashboard/CultureSafetyAlerts";

const mobileDrawerWidth = 240;
const desktopDrawerWidth = 280;

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const notifications = [
    {
      id: 1,
      title: "Trip created successfully",
      time: "2 min ago",
    },
    {
      id: 2,
      title: "Weather forecast updated",
      time: "10 min ago",
    },
    {
      id: 3,
      title: "Budget exceeded for Goa trip",
      time: "1 hour ago",
    },
    {
      id: 4,
      title: "New destination suggestions available",
      time: "Today",
    },
    {
      id: 5,
      title: "Manali trip completed",
      time: "Yesterday",
    },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", path: "", icon: <DashboardIcon /> },
    { text: "My Trips", path: "trips", icon: <ExploreIcon /> },
    { text: "Expenses", path: "expenses", icon: <WalletIcon /> },
    { text: "Weather", path: "weather", icon: <WbSunnyIcon /> },
    { text: "Translator", path: "translator", icon: <TranslateIcon /> },
    { text: "Bookings", path: "bookings", icon: <HotelIcon /> },
    { text: "Packing", path: "packing", icon: <LuggageIcon /> },
    { text: "Safety & Culture", path: "culture-safety", icon: <ShieldIcon /> },
  ];

  const isActive = (path) => {
    const currentPath = location.pathname.split("/dashboard/")[1] || "";
    if (path === "") return currentPath === "";
    return currentPath.startsWith(path);
  };

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ExploreIcon sx={{ color: "white", fontSize: 22 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              background: "linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}
          >
            PackGo
          </Typography>
        </Box>
      </Box>
      <Divider />

      {/* User Info */}
      <Box sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: 3,
            bgcolor: "primary.light",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/dashboard/profile");
            setMobileOpen(false);
          }}
        >
          <Avatar
            alt={user?.name || "User"}
            sx={{
              width: 42,
              height: 42,
              bgcolor: "primary.main",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "primary.dark" }}
              noWrap
            >
              {user?.name || "Traveler"}
            </Typography>
            <Typography variant="caption" sx={{ color: "primary.main" }} noWrap>
              {user?.email || ""}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />

      {/* Nav Items */}
      <List sx={{ flexGrow: 1, pt: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <Tooltip title={item.text} placement="right" arrow>
              <ListItemButton
                component={Link}
                to={`/dashboard/${item.path}`}
                onClick={() => setMobileOpen(false)}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 2.5,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                    "& .MuiListItemIcon-root": { color: "white" },
                    "&:hover": { bgcolor: "primary.dark" },
                  },
                  "&:hover": { bgcolor: "rgba(63, 81, 181, 0.08)" },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive(item.path) ? "white" : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      {item.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider />
      <List sx={{ px: 1, pb: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2.5,
              color: "error.main",
              "&:hover": { bgcolor: "error.light" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "error.main" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  Logout
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box
        component="nav"
        sx={{ width: { md: desktopDrawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: mobileDrawerWidth,
              transition: "all 0.3s ease",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: desktopDrawerWidth,
              borderRight: "1px solid",
              borderColor: "divider",
              boxShadow: "2px 0 12px rgba(0,0,0,0.04)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: "100%",
            md: `calc(100% - ${desktopDrawerWidth}px)`,
          },
          bgcolor: "grey.50",
        }}
      >
        <AppBar
          position="sticky"
          color="default"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="Notifications">
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleNotificationOpen}
                >
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Profile">
                <IconButton size="large" onClick={handleMenu} color="inherit">
                  <Avatar
                    alt={user?.name || "User"}
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: "primary.main",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/dashboard/profile");
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>

              <Menu
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={handleNotificationClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    width: 340,
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 10px 35px rgba(0,0,0,0.15)",
                    border: "1px solid",
                    borderColor: "divider",
                  },
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Notifications
                  </Typography>
                </Box>

                <Box
                  sx={{
                    maxHeight: 320,
                    overflowY: "auto",
                  }}
                >
                  {notifications.map((notification) => (
                    <MenuItem
                      key={notification.id}
                      onClick={handleNotificationClose}
                      sx={{
                        py: 1.5,
                        alignItems: "flex-start",
                        borderBottom: "1px solid",
                        borderColor: "grey.100",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                        >
                          {notification.title}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                          }}
                        >
                          {notification.time}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Box>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ minHeight: "calc(100vh - 65px)" }}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="trips" element={<TripsView />} />
            <Route path="trips/:id" element={<TripDetail />} />
            <Route path="expenses" element={<ExpensesView />} />
            <Route path="weather" element={<WeatherView />} />
            <Route path="translator" element={<TranslatorView />} />
            <Route path="bookings" element={<BookingView />} />
            <Route path="profile" element={<ProfileView />} />
            <Route path="packing" element={<PackingView />} />
            <Route path="culture-safety" element={<CultureSafetyAlerts />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
