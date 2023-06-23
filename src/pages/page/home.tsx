import React, { useState } from "react";
import { StoopTest, NumberTest, BallTest } from "../../components";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import {
	Button,
	ClickAwayListener,
	Grow,
	IconButton,
	MenuItem,
	MenuList,
	Paper,
	Popper,
	Tabs,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import useMediaQuery from "@mui/material/useMediaQuery";

interface Props {}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			style={{ width: "100%", height: "100%" }}
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3, width: "100%", height: "100%" }}>{children}</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const darkTheme = createTheme({
	palette: {
	  mode: 'dark',
	  background: {
		default: '#222222',
		paper: '#313131',
	  },
	  primary: {
		main: '#90caf9',
	  },
	  secondary: {
		main: '#a5d6a7',
	  },
	  text: {
		primary: '#fafafa',
		secondary: '#c4c4c4 ',
	  },
	},
  });
  
  const lightTheme = createTheme({
	palette: {
	  mode: 'light',
	  background: {
		default: '#F4F7F5',
		paper: '#f4f7f5',
	  },
	  primary: {
		main: '#1976d2',
	  },
	  secondary: {
		main: '#4caf50',
	  },
	  text: {
		primary: '#333',
		secondary: '#777',
	  },
	},
  });

const HomePage: React.FC<Props> = () => {
	const [option, setOption] = React.useState(0);

	const [mode, setMode] = React.useState<"light" | "dark">(useMediaQuery('(prefers-color-scheme: dark)')? 'dark' : 'light');

	const { t, i18n } = useTranslation();
	const [open, setOpen] = React.useState(false);
	const colorMode = React.useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
			},
		}),
		[]
	);

	const theme = React.useMemo(
		() =>
		  createTheme({
			palette: {
			  mode,
			  background: mode === 'dark' ? darkTheme.palette.background : lightTheme.palette.background,
			  primary: mode === 'dark' ? darkTheme.palette.primary : lightTheme.palette.primary,
			  secondary: mode === 'dark' ? darkTheme.palette.secondary : lightTheme.palette.secondary,
			  text: mode === 'dark' ? darkTheme.palette.text : lightTheme.palette.text,
			},
		  }),
		[mode]
	  );

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setOption(newValue);
	};
	const languageList = [
		{ label: "English", value: "en" },
		{ label: "繁體中文", value: "tc" },
		{ label: "简体中文", value: "sc" },
	];

	const [language, setLanguage] = useState(
		languageList.filter((el) => el.value === "tc")[0].label
	);

	const anchorRef = React.useRef<HTMLButtonElement>(null);

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event: Event | React.SyntheticEvent) => {
		if (
			anchorRef.current &&
			anchorRef.current.contains(event.target as HTMLElement)
		) {
			return;
		}

		setOpen(false);
	};

	const handleClick = (lang: string) => {
		i18n.changeLanguage(lang);
		setLanguage(languageList.filter((el) => el.value === lang)[0].label);
		setOpen(false);
	};

	function handleListKeyDown(event: React.KeyboardEvent) {
		if (event.key === "Tab") {
			event.preventDefault();
			setOpen(false);
		} else if (event.key === "Escape") {
			setOpen(false);
		}
	}

	const prevOpen = React.useRef(open);
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current!.focus();
		}

		prevOpen.current = open;
	}, [open]);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AppBar color="transparent" position="relative">
					<Toolbar disableGutters>
						<Box sx={{ width: "100%", display: "flex", flexGrow: 1 }}>
							<Tabs
								value={option}
								centered
								onChange={handleChange}
								aria-label="Main Function Tabs"
								textColor="inherit"
							>
								<Tab label={t("NumberTest")} wrapped {...a11yProps(0)} />
								<Tab label={t("BallTest")} wrapped {...a11yProps(1)} />
								<Tab label={t("StoopTest")} wrapped {...a11yProps(2)} />
							</Tabs>
						</Box>
						<Box
							sx={{ display: "flex", justifyContent: "flex-end", flexGrow: 1 }}
						>
							<Button
								ref={anchorRef}
								id="composition-button"
								aria-controls={open ? "composition-menu" : undefined}
								aria-expanded={open ? "true" : undefined}
								aria-haspopup="true"
								size="small"
								sx={{ width: "100px" }}
								onClick={handleToggle}
							>
								{language}
							</Button>
							<Popper
								open={open}
								anchorEl={anchorRef.current}
								role={undefined}
								placement="top-start"
								transition
								disablePortal
							>
								{({ TransitionProps, placement }) => (
									<Grow
										{...TransitionProps}
										style={{
											transformOrigin:
												placement === "top-start" ? "top" : "bottom",
										}}
									>
										<Paper>
											<ClickAwayListener onClickAway={handleClose}>
												<MenuList
													autoFocusItem={open}
													id="composition-menu"
													aria-labelledby="composition-button"
													onKeyDown={handleListKeyDown}
													variant="selectedMenu"
												>
													{languageList.map((item, index) => (
														<MenuItem
															key={index}
															value={item.value}
															autoFocus
															selected={item.label === language}
															onClick={() => handleClick(item.value)}
															sx={{ justifyContent: "center" }}
														>
															{item.label}
														</MenuItem>
													))}
												</MenuList>
											</ClickAwayListener>
										</Paper>
									</Grow>
								)}
							</Popper>
						</Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: "flex-end",
								paddingRight: "10px",
							}}
						>
							<IconButton
								sx={{ ml: 1 }}
								onClick={colorMode.toggleColorMode}
								color="inherit"
							>
								{theme.palette.mode === "light" ? (
									<DarkModeRoundedIcon  color="primary"/>
								) : (
									<LightModeRoundedIcon color="primary"/>
								)}
							</IconButton>
						</Box>
					</Toolbar>
				</AppBar>
				{
					<Container
						maxWidth="md"
						sx={{
							height: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<TabPanel value={option} index={0}>
							<NumberTest onClose={setOption}></NumberTest>
						</TabPanel>
						<TabPanel value={option} index={1}>
							<BallTest onClose={setOption} />
						</TabPanel>
						<TabPanel value={option} index={2}>
							<StoopTest onClose={setOption}></StoopTest>
						</TabPanel>
					</Container>
				}
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
};

export default HomePage;
