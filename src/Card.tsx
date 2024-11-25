import { useEffect, useState } from "react";
import AnimalCover from "./assets/animals/cover.jpg";
import CarCover from "./assets/cars/cover.jpg";
import FruitCover from "./assets/fruits/cover.jpg";
import { Fruit } from "./types";

const Card = ({
  card,
  flipped,
  disabled,
  currentType,
  handleClick,
}: {
  card: Fruit;
  flipped: boolean;
  disabled: boolean;
  currentType: string;
  handleClick: (card: Fruit) => void;
}) => {
  const cardClick = () => {
    if (!disabled) {
      handleClick(card);
    }
  };

  const [cover, setCover] = useState("");

  useEffect(() => {
    if (currentType == "fruits") {
      setCover(FruitCover);
    } else if (currentType == "animals") {
      setCover(AnimalCover);
    } else if (currentType == "cars") {
      setCover(CarCover);
    }
  }, [currentType]);

  return (
    <div className="card w-full h-full" draggable="false">
      <div className={flipped ? "flipped" : ""} draggable="false">
        <img
          src={card.src}
          alt=""
          className="object-contain rounded-lg w-full h-full front"
          draggable="false"
        />

        <img
          src={cover}
          alt=""
          className="object-contain rounded-lg w-full h-full cover drop-shadow"
          onClick={cardClick}
          draggable="false"
        />
      </div>
    </div>
  );
};

export default Card;
