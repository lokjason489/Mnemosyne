import React from "react";
import { StoopTest, NumberTest, BallTest } from "../../components";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tab from '@mui/material/Tab';
import { Tabs, Typography } from "@mui/material";

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
			style={{width:"100%"}}
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 ,width:"100%"}}>
					{children}
				</Box>
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

const HomePage: React.FC<Props> = () => {
	const [option, setOption] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setOption(newValue);
	};

	const defaultTheme = createTheme();
	return (
		<ThemeProvider theme={defaultTheme}>
			<CssBaseline />
			<AppBar color="transparent" position="relative">
				<Toolbar disableGutters>
					<Box sx={{ width: "100%" , display:"flex",justifyContent:"center"}}>
						<Tabs
							sx={ {paddingLeft : "30px" , paddingRight: "30px", margin : 0, display:"flex",justifyContent:"center",alignItems:"center"}}
							variant="fullWidth"
							value={option}
							onChange={handleChange}
							aria-label="basic tabs example"
						>
							<Tab label="短期記憶測驗"  {...a11yProps(0)} /> 
							<Tab label="小球記憶測驗"  {...a11yProps(1)}/>
							<Tab label="斯特魯測試"  {...a11yProps(2)}/>
						</Tabs>
					</Box>
				</Toolbar>
			</AppBar>
			{
				<Container maxWidth="md" sx={{height: "100%", display:"flex",justifyContent:"center",alignItems:"center"}}>
					<TabPanel value={option} index={0}>
						<NumberTest onClose={setOption}></NumberTest>
					</TabPanel>
					<TabPanel value={option} index={1}>
						<BallTest onClose={setOption}/>
					</TabPanel>
					<TabPanel value={option} index={2}>
						<StoopTest onClose={setOption}></StoopTest>
					</TabPanel>
				</Container>
			}
		</ThemeProvider>
	);
};

export default HomePage;
