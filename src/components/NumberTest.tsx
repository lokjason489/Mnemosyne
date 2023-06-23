import React from "react";
import {
	Box,
	Button,
	Grid,
	Slider,
	TextField,
	Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation();

	const startTimer = () => {
		const numbers: React.SetStateAction<number[]> = [];
		while (numbers.length < level) {
			let num = Math.floor(Math.random() * 10); // 隨機生成一個數字
			if(numbers.length > 0 && numbers[numbers.length - 1] === num) {
				continue;
			}else {
				numbers.push(num); // 將這個数字加入散程
			}
		}
		setNumbers(numbers);
		setInputIndex(0);
		setNumberTestStart(true);
		setNumberTestEnd(false);
		countRef.current = 0;
		setCount(0);
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
		<Box
			sx={{
				padding: 2,
				position: "relative",
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				height: "100%",
			}}
		>
			{NumberTestConfirm && (
				<Box
					sx={{
						padding: 2,
						position: "relative",
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						height: "100%",
						paddingBottom: "20%",
					}}
				>
					<Box
						sx={{
							padding: 2,
							position: "relative",
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
							paddingBottom: "20%",
						}}
					>
						<Grid container spacing={2} alignItems="center">
							<>
								<Grid item xs={12}>
									<Typography variant="h4" align="center">
										{t("NumberTest_Start")}
									</Typography>
									<Typography paddingTop={2} variant="body2" align="center">
										{t("Number_desc")}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="body1" gutterBottom>
										{t("level")}: {level}
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
								<Grid
									item
									xs={12}
									sx={{ display: "flex", justifyContent: "center" }}
								>
									<Button
										variant="contained"
										color="primary"
										onClick={() => {
											setNumberTestConfirm(false);
											setNumberTestEnd(false);
											setNumberTestInputStart(false);
											setNumberTestCorrect(0);
											setNumberTestWrong(0);
											startTimer();
										}}
									>
										{t("start")}
									</Button>
								</Grid>
							</>
						</Grid>
					</Box>
				</Box>
			)}
			{NumberTestStart && !NumberTestInputStart && !NumberTestEnd && (
				<Box
					sx={{
						flexGrow: 1,
						padding: 2,
						position: "relative",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						height: "100%",
						paddingBottom: "20%",
						gap: "8px",
					}}
				>
					<Typography variant="h4" align="center">
						{t("currNum")}
					</Typography>
					<Typography variant="h1" align="center">
						{numbers[count]}
					</Typography>
				</Box>
			)}
			{!NumberTestStart && NumberTestInputStart && !NumberTestEnd && (
				<Box
					maxWidth={"sm"}
					sx={{
						flexGrow: 1,
						padding: 2,
						position: "relative",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						height: "100%",
						width: "100%",
						paddingBottom: "20%",
						gap: "8px",
					}}
				>
					<form style={{ width: "100%" }} onSubmit={handleInputSubmit}>
						<Box
							sx={{
								flexGrow: 1,
								padding: 2,
								position: "relative",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								height: "100%",
								width: "100%",
								gap: "8px",
							}}
						>
							<TextField
								variant="standard"
								label={t("inputNum")}
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
								{t("submit")}
							</Button>
						</Box>
					</form>
				</Box>
			)}
			{!NumberTestStart && !NumberTestInputStart && NumberTestEnd && (
				<Box
					sx={{
						flexGrow: 1,
						padding: 2,
						position: "relative",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						height: "100%",
						paddingBottom: "20%",
						gap: "8px",
					}}
				>
					<Typography variant="h4" align="center">
						{t("NumberTest")}
					</Typography>
					{/* <h2>Time: {NumberTestTime} seconds</h2> */}
					<Typography variant="h5" align="center">
						{t("correct_Ans")} : {NumberTestCorrect}
					</Typography>
					<Typography variant="h5" align="center">
						{t("wrong_Ans")} : {NumberTestWrong}
					</Typography>
					<Button
						variant="outlined"
						size="large"
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
						{t("again")}
					</Button>
				</Box>
			)}
		</Box>
	);
};

export default NumberTest;
