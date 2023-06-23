import { Box, Button, Typography } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";

interface Props {
	onClose: React.Dispatch<React.SetStateAction<number>>;
}

const StoopTest: React.FC<Props> = ({ onClose }) => {
	const [count, setCount] = React.useState(0);

	const startTimer = () => {
		setCount(0);
		const timer = setInterval(() => {
			setCount((count) => count + 1);
		}, 1000);
		return () => clearInterval(timer);
	};

	const stroop = [
		{ textColor: "white", value: "red", text: "紅色" },
		{ textColor: "white", value: "blue", text: "藍色" },
		{ textColor: "white", value: "green", text: "綠色" },
		{ textColor: "black", value: "yellow", text: "黃色" },
		{ textColor: "white", value: "purple", text: "紫色" },
		{ textColor: "white", value: "orange", text: "橙色" },
		{ textColor: "white", value: "black", text: "黑色" },
		{ textColor: "black", value: "white", text: "白色" },
		{ textColor: "white", value: "pink", text: "粉紅色" },
		{ textColor: "white", value: "brown", text: "棕色" },
	];
	const [stroopColor, setStroopColor] = React.useState(
		stroop[Math.floor(Math.random() * 10)]
	);
	const [stroopWord, setStroopWord] = React.useState(
		stroop[Math.floor(Math.random() * 10)]
	);
	const [stroopCorrect, setStroopCorrect] = React.useState(0);
	const [stroopWrong, setStroopWrong] = React.useState(0);
	const [stroopTime, setStroopTime] = React.useState(0);
	const [stroopStart, setStroopStart] = React.useState(false);
	const [stroopEnd, setStroopEnd] = React.useState(false);
	const [stroopResult, setStroopResult] = React.useState(false);


	return (
		<>
			{!stroopStart && (
				<Box
					sx={{
						flexGrow: 1,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							setStroopStart(true);
							setStroopEnd(false);
							setStroopCorrect(0);
							setStroopWrong(0);
							setStroopTime(0);
							setStroopResult(false);
							startTimer();
						}}
					>
						開始斯特魯測試
					</Button>
				</Box>
			)}
			{stroopStart && !stroopEnd && (
				<Box
					sx={{
						flexGrow: 1,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						paddingBottom: "20%",
					}}
				>
					<h1>斯特魯測試</h1>
					<h2>按單詞顏色的按鈕，而不是文本的顏色！</h2>
					<h1 style={{ color: stroopColor.value,width:"150px", textAlign:"center" , backgroundColor: "rgba(0,0,0,.4)" }}>{stroopWord.text}</h1>

					<Grid
						container
						spacing={{ xs: 2, md: 3 }}
						columns={{ xs: 4, sm: 12, md: 12, lg: 12 }}
					>
						{stroop.map((color, index) => (
							<Grid
								xs={2}
								sm={4}
								md={3}
								lg={3}
								display="flex"
								justifyContent="center"
								alignItems="center"
							>
								<Button
									variant="contained"
									key={index}
									style={{
										backgroundColor: color.value,
										color: color.textColor,
										width: "50%",
										margin: "auto",
										fontWeight: "bold",
									}}
									onClick={() => {
										if (!stroopEnd) {
											const colorLowerCase = stroopColor.value.toLowerCase();
											const wordLowerCase = stroopWord.value.toLowerCase();
											if (
												colorLowerCase === color.value.toLowerCase() &&
												colorLowerCase !== wordLowerCase
											) {
												setStroopCorrect(stroopCorrect + 1);
											} else if (
												colorLowerCase !== color.value.toLowerCase() &&
												colorLowerCase !== wordLowerCase
											) {
												setStroopWrong(stroopWrong + 1);
											}
											if (stroopCorrect + stroopWrong === 9) {
												setStroopEnd(true);
												setStroopTime(count);
											} else {
												setStroopColor(stroop[Math.floor(Math.random() * 10)]);
												setStroopWord(stroop[Math.floor(Math.random() * 10)]);
											}
										}
									}}
								>
									{color.text}
								</Button>
							</Grid>
						))}
					</Grid>
				</Box>
			)}
			{stroopEnd && !stroopResult && (
				<Box
					sx={{
						flexGrow: 1,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						gap: "3px",
					}}
				>
					<Typography variant="h4" align="center">Stroop Test Results</Typography>
					<Typography variant="h4" align="center">Correct Answers: {stroopCorrect}</Typography>
					<Typography variant="h4" align="center">Wrong Answers: {stroopWrong}</Typography>

					<Typography variant="h4" align="center">Time: {stroopTime} seconds</Typography>
					<Button
						variant="outlined"
						onClick={() => {
							setStroopStart(false);
							setStroopEnd(false);
							setStroopCorrect(0);
							setStroopWrong(0);
							setStroopTime(0);
							setStroopResult(false);
							onClose(2);
						}}
					>
						Again
					</Button>
				</Box>
			)}
		</>
	);
};

export default StoopTest;
