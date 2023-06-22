import React from "react";
import {
	Box,
	Button,
	Grid,
	Slider,
	TextField,
	Typography,
} from "@mui/material";

interface Props {
	onClose: React.Dispatch<React.SetStateAction<number>>;
}

const NumberTest: React.FC<Props> = ({ onClose }) => {
	const countRef = React.useRef(0);
	const [count, setCount] = React.useState(0);
	const [level, setLevel] = React.useState<number>(10);
	const [numbers, setNumbers] = React.useState<number[]>([]);
	const [currentInput, setCurrentInput] = React.useState("");
	const [inputIndex, setInputIndex] = React.useState(0);

	const startTimer = () => {
		setNumbers(
			Array.from({ length: level }, () => Math.floor(Math.random() * 100))
		);
		setInputIndex(0);
		setNumberTestEnd(false);
		countRef.current = 0;
		const TimerId = setInterval(() => {
			countRef.current += 1;
			setCount(countRef.current);
			if (countRef.current >= level) {
				clearInterval(TimerId);
				setNumberTestInputStart(true);
				setNumberTestStart(false);
				setCurrentInput("");
			}
		}, 1000);
	};

	const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentInput(event.target.value);
	};

	const handleInputSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setInputIndex((index) => index + 1);
		if (currentInput === numbers[inputIndex].toString()) {
			setNumberTestCorrect((correct) => correct + 1);
		} else {
			setNumberTestWrong((wrong) => wrong + 1);
		}
		if (inputIndex === level - 1) {
			setNumberTestEnd(true);
			setNumberTestInputStart(false);
			return;
		}
		setCurrentInput("");
		document.getElementById("userInput")?.focus();
	};

	const handleSliderChange = (event: Event, newValue: number | number[]) => {
		setLevel(newValue as number);
	};

	const [NumberTestCorrect, setNumberTestCorrect] = React.useState(0);
	const [NumberTestWrong, setNumberTestWrong] = React.useState(0);
	const [NumberTestConfirm, setNumberTestConfirm] = React.useState(true);
	const [NumberTestStart, setNumberTestStart] = React.useState(false);
	const [NumberTestInputStart, setNumberTestInputStart] = React.useState(false);
	const [NumberTestEnd, setNumberTestEnd] = React.useState(false);

	return (
		<>
			{NumberTestConfirm && (
				<>
					<Box
						sx={{
							padding: 2,
							position: "relative",
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							paddingBottom: "20%",
						}}
					>
						<Grid container spacing={2} alignItems="center">
							<>
								<Grid item xs={12}>
									<Typography variant="h4" align="center">
										Number Test
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="body1" gutterBottom>
										level: {level}
									</Typography>
									<Slider
										value={typeof level === "number" ? level : 0}
										aria-label="Small"
										defaultValue={10}
										min={5}
										max={20}
										valueLabelDisplay="auto"
										onChange={handleSliderChange}
										aria-labelledby="input-slider"
									/>
								</Grid>
								<Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
									<Button
										variant="contained"
										color="primary"
										onClick={() => {
											setNumberTestConfirm(false);
											setNumberTestStart(true);
											setNumberTestEnd(false);
											setNumberTestInputStart(false);
											setNumberTestCorrect(0);
											setNumberTestWrong(0);
											startTimer();
										}}
									>
										Start
									</Button>
								</Grid>
							</>
						</Grid>
					</Box>
				</>
			)}
			{NumberTestStart && !NumberTestInputStart && !NumberTestEnd && (
				<Box
					sx={{
						flexGrow: 1,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<h3>Current Number:</h3>
					<h1>{numbers[count]}</h1>
				</Box>
			)}
			{!NumberTestStart && NumberTestInputStart && !NumberTestEnd && (
				<form onSubmit={handleInputSubmit}>
					<Box
						sx={{
							flexGrow: 1,
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							gap: "12px",
						}}
					>
						<TextField
							variant="standard"
							label="Enter the numbers"
							id="userInput"
							name="userInput"
							fullWidth
							autoFocus
							autoCorrect="off"
							autoComplete="off"
							autoCapitalize="off"
							spellCheck="false"
							value={currentInput}
							onChange={handleInput}
						/>
						<Button variant="outlined" type="submit">
							submit
						</Button>
					</Box>
				</form>
			)}
			{!NumberTestStart && !NumberTestInputStart && NumberTestEnd && (
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
					<Typography variant="h2" align="center">
						Number Test
					</Typography>
					{/* <h2>Time: {NumberTestTime} seconds</h2> */}
					<Typography variant="h2" align="center">
						Correct Answers: {NumberTestCorrect}
					</Typography>
					<Typography variant="h2" align="center">
						Wrong Answers: {NumberTestWrong}
					</Typography>
					<Button
						variant="outlined"
						onClick={() => {
							setNumberTestConfirm(true);
							setNumberTestStart(false);
							setNumberTestInputStart(false);
							setNumberTestEnd(false);
							setNumberTestCorrect(0);
							setNumberTestWrong(0);
							onClose(0);
						}}
					>
						Again
					</Button>
				</Box>
			)}
		</>
	);
};

export default NumberTest;
