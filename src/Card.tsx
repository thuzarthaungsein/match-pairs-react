import Cover from "./assets/fruits/cover.jpg";
import { Fruit } from "./types";

const Card = ({
  card,
  flipped,
  disabled,
  handleClick,
}: {
  card: Fruit;
  flipped: boolean;
  disabled: boolean;
  handleClick: (card: Fruit) => void;
}) => {
  const cardClick = () => {
    console.log("click");
    console.log("disabled", disabled);
    if (!disabled) {
      handleClick(card);
    }
  };
  return (
    <div className="card w-full h-full">
      <div className={flipped ? "flipped" : ""}>
        <img
          src={card.src}
          alt=""
          className="object-contain rounded-lg w-full h-full front"
        />

        <img
          src={Cover}
          alt=""
          className="object-contain rounded-lg w-full h-full cover"
          onClick={cardClick}
        />
      </div>
    </div>
  );
};

export default Card;
