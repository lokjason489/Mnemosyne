import React from "react";
import StoopTest from "../../components";

interface Props {}

const HomePage: React.FC<Props> = () => {

	const [option, setOption] = React.useState(0);

	const handleOption = (option: number) => {
		setOption(option);
	};

	return (
		<div className="flex flex-col min-h-screen bg-gray-400">
			<header className="">
				<div className="flex justify-around py-4">
					<button className="bg-primary py-4 px-6 text-secondary border-blue-100 rounded-md"
                    						onClick={() => handleOption(1)}>
						短期記憶測驗
					</button>
					<button className="bg-primary py-4 px-6 text-secondary border-blue-100 rounded-md">
						小球記憶測驗
					</button>
					<button
						className="bg-primary py-4 px-6 text-secondary border-blue-100 rounded-md"
						onClick={() => handleOption(3)}
					>
						Stroop Test
					</button>
				</div>
			</header>
			<body className="flex-1 flex justify-center items-center">
                {option ===1 &&(
                    <div>
                        </div>
                )}
				{option === 3 && (
					<StoopTest onClose={setOption}></StoopTest>
				)}
			</body>
			<footer></footer>
		</div>
	);
};

export default HomePage;
