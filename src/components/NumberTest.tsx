import React from "react";
import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Input,
	InputLabel,
	Slider,
	Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
interface Props {
	onClose: React.Dispatch<React.SetStateAction<number>>;
}

const NumberTest: React.FC<Props> = ({ onClose }) => {
	const countRef = React.useRef(0);
	const [count, setCount] = React.useState(0);
	const [level, setLevel] = React.useState<number>(12);
	const [numbers, setNumbers] = React.useState<number[]>([]);
	const [currentInput, setCurrentInput] = React.useState("");
	const [inputIndex, setInputIndex] = React.useState(0);
	const [userInputArray, setUserInputArray] = React.useState<number[]>([]);
	const [inputError,setInputError] = React.useState(false);
	const { t } = useTranslation();

	const startTimer = () => {
		const numbers: React.SetStateAction<number[]> = [];
		while (numbers.length < level) {
			let num = Math.floor(Math.random() * 10); // 隨機生成一個數字
			if (numbers.length > 0 && numbers[numbers.length - 1] === num) {
				continue;
			} else {
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
		if(event.target.value.length > 1){
			setInputError(true);
		}else{
			setInputError(false);
		}
		setCurrentInput(event.target.value);
	};

	const handleInputSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setInputIndex((index) => index + 1);
		let tempArray = userInputArray;
		tempArray.push(Number(currentInput));
		setUserInputArray(tempArray);
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
				width: "100%",
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
						width: "100%",
					}}
				>
					<Grid container spacing={3} sx={{ width: "100%" }}>
						<Grid xs={12}>
							<Typography variant="h4" align="center">
								{t("NumberTest_Start")}
							</Typography>
							<Typography paddingTop={2} variant="body2" align="center">
								{t("Number_desc")}
							</Typography>
						</Grid>
						<Grid xs={12}>
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
						<Grid xs={12} sx={{ display: "flex", justifyContent: "center" }}>
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
									setUserInputArray([]);
								}}
							>
								{t("start")}
							</Button>
						</Grid>
					</Grid>
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
					<Typography variant="h2" align="center">
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
					<Grid
						container
						spacing={{ xs: 1, sm: 1, md: 0 }}
						columns={{ xs: 4, sm: 8, md: 8 }}
						sx={{ width: "100%" }}
					>
						{Array.from(Array(numbers.length)).map((_, index) => {
							return (
								<Grid
									xs={1}
									sm={1}
									md={1}
									key={index}
									sx={{
										border: "0.125rem solid",
										borderRadius: "1rem",
										padding: 1,
										margin: 1,
									}}
								>
									<Typography
										variant="h5"
										align="center"
										sx={{
											aspectRatio: 1,
											margin: "auto",
											inset: "0",
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										{userInputArray[index]}
									</Typography>
								</Grid>
							);
						})}
					</Grid>
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
							<FormControl error={inputError} variant="standard" fullWidth>
								<InputLabel htmlFor="userInput">{t("inputNum")}</InputLabel>
								<Input
									id="userInput"
									placeholder="0"
									aria-describedby="user-input-number"
									inputProps={{ inputMode: "numeric", pattern: "^[0-9]{1}$" }}
									autoFocus
									autoCorrect="off"
									autoComplete="off"
									autoCapitalize="off"
									required
									spellCheck="false"
									value={currentInput}
									onChange={handleInput}
								/>
								<FormHelperText sx={{display: {xs: "none", sm: "block", md: "block", lg: "block", xl: "block"}, color: inputError ? "red" : ""}} id="user-input-number">
									{t("NumberInputError")}
								</FormHelperText>
							</FormControl>
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
					<Grid container>
						{numbers.map((number, index) => (
							<Grid container xs={4} sm={3} md={2} key={index}>
								<Typography
									variant="h5"
									align="center"
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									{number} : {userInputArray[index]}
									{number === userInputArray[index] ? (
										<CheckIcon sx={{ color: "green" }} />
									) : (
										<ClearIcon sx={{ color: "red" }} />
									)}{" "}
								</Typography>
							</Grid>
						))}
					</Grid>
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
