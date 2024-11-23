import { useEffect, useState } from "react";
import "./App.css";
import Card from "./Card";
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

  const shuffleCards = () => {
    const shuffled = [...fruits, ...fruits]
      .sort(() => Math.random() - 0.5) // shuffle
      .map((fruit, index) => ({ ...fruit, id: index + 1 })); // add id

    setCards(shuffled);
    console.log(cards);
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
    restartGame();
    setIsRunning(true);
  };

  const restartGame = () => {
    // if (isRunning) {
    resetData();
    shuffleCards();
    setIsRunning(false);
    setTime(0);
    // }
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
    shuffleCards();
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
      <div className="w-full main h-screen">
        <div className="container mx-auto ">
          <h1 className="text-orange-500 font-semibold text-3xl mt-10">
            Match The Pairs
          </h1>
          <div className="flex justify-between py-5">
            <div className="text-xl text-gray-500">
              <span className="">
                Fastest Winning Time :{" "}
                <span className="font-bold text-blue-600 text-2xl">
                  {fastestTime}
                </span>{" "}
                seconds
              </span>
              <br />
              {latestTime > 0 ? (
                <>
                  <span className="">
                    Your Time :{" "}
                    <span className="font-bold text-blue-600 text-2xl">
                      {latestTime}
                    </span>{" "}
                    seconds
                  </span>
                  <br />
                </>
              ) : (
                ""
              )}
              <span className={isRunning ? "inline-block" : "hidden"}>
                Time :{" "}
                <span className="font-bold text-blue-600 text-2xl">{time}</span>{" "}
                seconds
              </span>
            </div>
            <div className="">
              <button
                className={`inline-block mr-3 mt-3 px-3 py-2 rounded bg-green-400 hover:bg-green-600 hover:text-white ${
                  isRunning
                    ? "cursor-not-allowed bg-gray-400 hover:text-black hover:bg-gray-400"
                    : "cursor-pointer"
                }`}
                disabled={isRunning}
                onClick={startGame}
              >
                Start
              </button>
              <button
                className="inline-block  mt-3 px-3 py-2 rounded bg-red-500 hover:bg-red-600 hover:text-white"
                onClick={restartGame}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-8 py-20">
            {cards &&
              cards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  flipped={
                    card.isMatched || card == firstClick || card == secondClick
                  }
                  disabled={disabled}
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
