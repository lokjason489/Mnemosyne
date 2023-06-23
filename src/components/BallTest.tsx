import React, { useState, useEffect, useRef } from "react";
import {
	Box,
	Button,
	Grid,
	Slider,
	TextField,
	Typography,
} from "@mui/material";
import { t } from "i18next";

interface Props {
	onClose: React.Dispatch<React.SetStateAction<number>>;
}

const BallTest: React.FC<Props> = ({ onClose }) => {
	const [numBalls, setNumBalls] = useState<number[]>([7, 13]);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const handleSliderChange = (event: Event, value: number | number[]) => {
		setNumBalls(value as number[]);
	};

	const isColliding = (
		x: number,
		y: number,
		diameter: number,
		balls: number[][]
	) => {
		for (let i = 0; i < balls.length; i++) {
			const [bx, by] = balls[i];
			const distance = Math.sqrt((x - bx) ** 2 + (y - by) ** 2);
			if (distance < diameter) {
				return true;
			}
		}
		return false;
	};

	const getRandomInt = (max: number, min: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	const handleClick = () => {
		const diameter = 50;
		const canvasWidth = document.getElementById("canvas")?.clientWidth;
		const canvasHeight = document.getElementById("canvas")?.clientHeight;
		let balls: number[][] = [];
		if (canvasWidth && canvasHeight) {
			let numBall = getRandomInt(numBalls[1], numBalls[0]);
			setBallTestRandomNum(numBall);
			for (let i = 0; i < numBall; i++) {
				let x = Math.floor(Math.random() * (canvasWidth - diameter));
				let y = Math.floor(Math.random() * (canvasHeight - diameter));

				while (isColliding(x, y, diameter, balls)) {
					x = Math.floor(Math.random() * (canvasWidth - diameter));
					y = Math.floor(Math.random() * (canvasHeight - diameter));
				}

				balls.push([x, y]);
			}

			const canvas = canvasRef.current;
			const ctx = canvas?.getContext("2d");

			if (ctx && canvas) {
				const drawBall = (x: number, y: number) => {
					ctx.beginPath();
					ctx.arc(
					  x + diameter / 2,
					  y + diameter / 2,
					  diameter / 2,
					  0,
					  2 * Math.PI
					);
					ctx.fill();
				  };

				const updateBalls = () => {
					ctx.clearRect(0, 0, canvasWidth, canvasHeight);
					ctx.fillStyle = "red";

					balls.forEach(([x, y]) => {
						drawBall(x, y);
					});

					balls.forEach((ball, index) => {
						let [x, y] = ball;

						x += Math.floor(Math.random() * 10) - 5;
						y += Math.floor(Math.random() * 10) - 5;

						x = Math.max(0, Math.min(x, canvasWidth - diameter));
						y = Math.max(0, Math.min(y, canvasHeight - diameter));

						balls[index] = [x, y];
					});

					// window.requestAnimationFrame(updateBalls);
				};
				setBallTestConfirm((value) => !value);
				setBallTestStart((value) => !value);
				updateBalls();
				setTimeout(() => {
					balls = [];
					updateBalls();
					setBallTestStart((value) => !value);
					setBallTestInputStart((value) => !value);
				}, 1000);
			}
		}
	};

	const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setBallTestInputNum(event.target.value);
	};

	const [BallTestRandomNum, setBallTestRandomNum] = React.useState(0);
	const [BallTestInputNum, setBallTestInputNum] = React.useState("0");
	const [BallTestConfirm, setBallTestConfirm] = React.useState(true);
	const [BallTestStart, setBallTestStart] = React.useState(false);
	const [BallTestInputStart, setBallTestInputStart] = React.useState(false);
	const [BallTestEnd, setBallTestEnd] = React.useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");

		if (ctx && canvas) {
			const canvasWidth = document.getElementById("canvas")?.clientWidth;
			const canvasHeight = document.getElementById("canvas")?.clientHeight;
			if (canvasWidth && canvasHeight) {
				canvas.width = canvasWidth;
				canvas.height = canvasHeight;
				ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			}
		}
	}, []);

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
				paddingBottom: "20%",
			}}
		>
			<Grid container spacing={2} alignItems="center" justifyContent={"center"}>
				{BallTestConfirm &&
					!BallTestStart &&
					!BallTestInputStart &&
					!BallTestEnd && (
						<>
							<Grid item xs={12}>
								<Typography variant="h4" align="center">
										{t("BallTest_Start")}
									</Typography>
									<Typography paddingTop={2} variant="body2" align="center">
										{t("Ball_desc")}
									</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="body1" gutterBottom>
								{t('BallNum')}: {numBalls[0]} - {numBalls[1]}
								</Typography>
								<Slider
									value={numBalls}
									onChange={handleSliderChange}
									min={5}
									valueLabelDisplay="auto"
									max={50}
									step={1}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sx={{ display: "flex", justifyContent: "center" }}
							>
								<Grid item>
									<Button
										variant="contained"
										color="primary"
										onClick={handleClick}
									>
										{t('start')}
									</Button>
								</Grid>
							</Grid>
						</>
					)}
				<Grid item xs={12} md={8} lg={6}>
					{BallTestInputStart && (
						<form
							onSubmit={() => {
								setBallTestEnd(true);
								setBallTestInputStart(false);
								setBallTestConfirm(false);
								setBallTestStart(false);
							}}
						>
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
									label={t('inputNum')}
									id="userInput"
									name="userInput"
									autoFocus
									fullWidth
									focused
									autoCorrect="off"
									autoComplete="off"
									autoCapitalize="off"
									spellCheck="false"
									value={BallTestInputNum}
									onChange={handleInput}
								/>
								<Button variant="outlined" type="submit">
								{t('submit')}
								</Button>
							</Box>
						</form>
					)}
					{BallTestEnd && (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								gap: "12px",
							}}
						>	
							<Typography variant="h4" align="center">
						{t("BallTest")}
					</Typography>
							<Typography variant="h5" align="center">
							{t('display_Ball')}: {BallTestRandomNum}
							</Typography>
							<Typography variant="h5" align="center">
							{t('yser_Input_Ball')}: {BallTestInputNum}
							</Typography>
							<Button
								variant="outlined"
								onClick={() => {
									setBallTestConfirm(true);
									setBallTestStart(false);
									setBallTestInputStart(false);
									setBallTestEnd(false);
									onClose(1);
								}}
							>
								{t('again')}
							</Button>
						</Box>
					)}
				</Grid>
			</Grid>
			<div
				
				className={`${BallTestStart ? "" : "hidden"}`}
				style={
					{
						height:"100%",
						width:"100%",
						position:"absolute",
						display: "flex",
						justifyContent: "center",
						top:0,
						bottom:0,
						alignItems:'center'
					}
				}
			>
				<canvas id="canvas" style={{
					aspectRatio: 1,
					width: "100%",
					maxWidth:"450px",
					maxHeight:"450px",
				}} ref={canvasRef} />
			</div>
		</Box>
	);
};

export default BallTest;
