import React from "react";

interface Props {
    onClose:  React.Dispatch<React.SetStateAction<number>>;
}

const StoopTest: React.FC<Props> = ({onClose}) => {
	const [count, setCount] = React.useState(0);

	const startTimer = () => {
		setCount(0);
		const timer = setInterval(() => {
			setCount((count) => count + 1);
		}, 1000);
		return () => clearInterval(timer);
	};

	const stroop = [
		{ value: "red", text: "紅色" },
		{ value: "blue", text: "藍色" },
		{ value: "green", text: "綠色" },
		{ value: "yellow", text: "黃色" },
		{ value: "purple", text: "紫色" },
		{ value: "orange", text: "橙色" },
		{ value: "black", text: "黑色" },
		{ value: "white", text: "白色" },
		{ value: "pink", text: "粉紅色" },
		{ value: "brown", text: "棕色" },
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
	const [stroopResultTime, setStroopResultTime] = React.useState(0);
	const [stroopResultCorrect, setStroopResultCorrect] = React.useState(0);
	const [stroopResultWrong, setStroopResultWrong] = React.useState(0);

	return (
		<>
			{!stroopStart && (
				<button
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
					Start Stroop Test
				</button>
			)}
			{stroopStart && !stroopEnd && (
				<div className="flex flex-col justify-center items-center gap-2">
					<h1 className="text-4xl">斯特魯測試</h1>
					<h2 className="text-2xl">按單詞顏色的按鈕，而不是文本的顏色！</h2>
					<h2 className="text-8xl" style={{ color: stroopColor.value }}>
						{stroopWord.text}
					</h2>
					<div className="grid grid-cols-5 gap-4 pt-6">
						{stroop.map((color, index) => (
							<button
								key={index}
								style={{
									backgroundColor: color.value,
									color: color.value === "black" ? "white" : "black",
								}}
								className="m-2 p-2 rounded-md min-w-fit w-20 font-bold"
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
							</button>
						))}
					</div>
				</div>
			)}
			{stroopEnd && !stroopResult && (
				<div>
					<h1>Stroop Test Results</h1>
					<h2>Correct Answers: {stroopCorrect}</h2>
					<h2>Wrong Answers: {stroopWrong}</h2>
					<h2>Time: {stroopTime} seconds</h2>
					<button
						onClick={() => {
							setStroopStart(false);
							setStroopEnd(false);
							setStroopCorrect(0);
							setStroopWrong(0);
							setStroopTime(0);
							setStroopResult(false);
							setStroopResultTime(stroopTime);
							setStroopResultCorrect(stroopCorrect);
							setStroopResultWrong(stroopWrong);
                            onClose(0);
						}}
					>
						Back to Home
					</button>
				</div>
			)}
			{stroopResult && (
				<div>
					<h1>Stroop Test Results</h1>
					<h2>Time: {stroopResultTime} seconds</h2>
					<h2>Correct Answers: {stroopResultCorrect}</h2>
					<h2>Wrong Answers: {stroopResultWrong}</h2>
				</div>
			)}
		</>
	);
};

export default StoopTest;
