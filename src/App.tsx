import { useEffect, useState } from "react";
import { animals } from "./AnimalData";
import "./App.css";
import Card from "./Card";
import { cars } from "./CarData";
import { fruits } from "./FruitData";
import { Fruit } from "./types";

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [fastestTime, setFastestTime] = useState(0);
  const [latestTime, setLatestTime] = useState(0);

  const [cards, setCards] = useState<Fruit[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [firstClick, setFirstClick] = useState<Fruit>();
  const [secondClick, setSecondClick] = useState<Fruit>();
  const types = ["fruits", "animals", "cars"];
  const [currentType, setCurrentType] = useState("fruits");

  const shuffleTypes = (type: string) => {
    let arr = [...fruits, ...fruits];

    if (type == "fruits") {
      arr = [...fruits, ...fruits];
    } else if (type == "animals") {
      arr = [...animals, ...animals];
    } else if (type == "cars") {
      arr = [...cars, ...cars];
    }

    return arr;
  };

  const shuffleCards = (type: string) => {
    const arr = shuffleTypes(type);

    const shuffled = arr
      .sort(() => Math.random() - 0.5) // shuffle
      .map((item, index) => ({ ...item, id: index + 1 })); // add id

    setCards(shuffled);
  };

  const handleClick = (card: Fruit) => {
    if (isRunning) {
      if (firstClick) {
        setSecondClick(card);
      } else {
        setFirstClick(card);
      }
    }
    // firstClick ? setSecondClick(card) : setFirstClick(card);
  };

  const resetData = () => {
    setDisabled(false);
    setFirstClick(undefined);
    setSecondClick(undefined);
  };

  const startGame = () => {
    // resetData();
    // setIsRunning(false);
    // if (time > 0) {
    //   setTime(0);
    //   shuffleCards(getRandom());
    // }

    restartGame();
    setIsRunning(true);
  };

  const restartGame = () => {
    // if (isRunning) {
    resetData();
    shuffleCards(currentType);
    setIsRunning(false);
    setTime(0);
    // }
  };

  const getRandom = () => {
    let randomType;
    do {
      randomType = types[Math.floor(Math.random() * types.length)];
    } while (randomType === currentType);

    setCurrentType(randomType);
    return randomType;
  };

  useEffect(() => {
    let timeInterval: number;

    if (isRunning) {
      timeInterval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(timeInterval);
  }, [isRunning]);

  useEffect(() => {
    shuffleCards(getRandom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstClick && secondClick) {
      setDisabled(true);
      if (firstClick.src === secondClick.src) {
        setCards((c) => {
          const updated = c.map((card) => {
            if (card.src === firstClick.src) {
              return { ...card, isMatched: true };
            } else {
              return card;
            }
          });

          // win the game
          if (updated.every((fruit) => fruit.isMatched)) {
            setIsRunning(false);
            setTime(0);
            setLatestTime(time);
            if (fastestTime == 0 || time < fastestTime) {
              setFastestTime(time);
            }
          }

          return updated;
        });

        resetData();
      } else {
        setTimeout(() => {
          resetData();
        }, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstClick, secondClick]);

  return (
    <>
      <div className="w-full main">
        <div className="xl:container mx-auto px-8 xl:px-0">
          <h1 className="text-orange-500 font-semibold text-3xl mt-10">
            Match The Pairs
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-asterisk w-10 z-10 animate-wheel inline-block"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12l8 -4.5" />
              <path d="M12 12v9" />
              <path d="M12 12l-8 -4.5" />
              <path d="M12 12l8 4.5" />
              <path d="M12 3v9" />
              <path d="M12 12l-8 4.5" />
            </svg>
          </h1>
          <h2 className="text-lg text-gray-300">
            Flip the cards to find matching pairs. Complete the game in the
            fastest time!
          </h2>
          <div className="md:flex justify-between py-5">
            <div className="md:w-3/5 text-xl text-gray-300">
              <span className={fastestTime == 0 ? "hidden" : "inline-block"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-pennant-2 inline-block w-10 z-10 animate-item-ylevel"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M16 21h-4" />
                  <path d="M14 21v-18" />
                  <path d="M14 4l-9 4l9 4" />
                </svg>
                <span className="ml-10">Fastest Winning Time : </span>
                <span className="font-bold text-blue-500 text-2xl">
                  {fastestTime}
                </span>{" "}
                seconds
              </span>
              <span className={fastestTime !== 0 ? "hidden" : "inline-block"}>
                <span className="">
                  Shuffle the types of card by clicking{" "}
                  <span className="text-blue-400">'Shuffle'</span>. <br /> Hit
                  <span className="text-blue-400"> 'Start'</span> when ready. To
                  stop mid-game, press{" "}
                  <span className="text-blue-400">'Reset'</span>.
                </span>
              </span>
              <br />
              {latestTime > 0 ? (
                <>
                  <span className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-clock-hour-8 inline-block w-10 z-10 animate-wheel"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                      <path d="M12 12l-3 2" />
                      <path d="M12 7v5" />
                    </svg>
                    Previous Time :{" "}
                    <span className="font-bold text-blue-500 text-2xl">
                      {latestTime}
                    </span>{" "}
                    seconds
                  </span>
                </>
              ) : (
                ""
              )}
            </div>
            <div className="md:w-2/5 flex md:justify-end">
              <button
                className="inline-block mr-3 mt-3 px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 hover:text-white"
                onClick={() => shuffleCards(getRandom())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-arrows-shuffle inline-block mr-1 mb-1"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M18 4l3 3l-3 3" />
                  <path d="M18 20l3 -3l-3 -3" />
                  <path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" />
                  <path d="M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3" />
                </svg>
                Shuffle
              </button>

              <button
                className={`inline-block mr-3 mt-3 px-3 py-2 rounded bg-green-400 hover:bg-green-600 hover:text-white ${
                  isRunning
                    ? "cursor-not-allowed bg-gray-400 hover:text-black hover:bg-gray-400"
                    : "cursor-pointer"
                }`}
                disabled={isRunning}
                onClick={startGame}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`icon icon-tabler icons-tabler-outline icon-tabler-player-play mr-1 mb-1 ${
                    isRunning ? "hidden" : "inline-block"
                  }`}
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M7 4v16l13 -8z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`icon icon-tabler icons-tabler-filled icon-tabler-player-play  mr-1 mb-1  ${
                    isRunning ? "inline-block" : "hidden"
                  }`}
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
                </svg>
                Start
              </button>
              <button
                className="inline-block  mt-3 px-3 py-2 rounded bg-red-500 hover:bg-red-600 hover:text-white"
                onClick={restartGame}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-refresh inline-block mr-1 mb-1"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                </svg>
                Reset
              </button>
            </div>
          </div>
          <span className={isRunning ? "inline-block" : "hidden"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-hourglass-empty inline-block w-10 z-10 animate-wheel"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1z" />
              <path d="M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1z" />
            </svg>
            Time :{" "}
            <span className="font-bold text-blue-500 text-2xl">{time}</span>{" "}
            seconds
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 py-20">
            {cards &&
              cards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  flipped={
                    card.isMatched || card == firstClick || card == secondClick
                  }
                  disabled={disabled}
                  currentType={currentType}
                  handleClick={handleClick}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
