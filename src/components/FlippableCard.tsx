import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TbHandFingerRight } from "react-icons/tb";
import { GrStatusGood } from "react-icons/gr";

interface FlippableCardProps {
  front: string;
  back: string;
  isChecked?: boolean;
  onCheckChange?: (isChecked: boolean) => void;
}

const FlippableCard: React.FC<FlippableCardProps> = ({
  front,
  back,
  isChecked = false,
  onCheckChange,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCheckedState, setIsCheckedState] = useState(isChecked);

  useEffect(() => {
    setIsCheckedState(isChecked);
  }, [isChecked]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleCheck = (checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    setIsCheckedState(isChecked);
    if (onCheckChange) {
      onCheckChange(isChecked);
    }
  };

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={handleFlip}
    >
      <div
        className="relative w-full h-28"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <Card
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardHeader>
            <CardTitle>{front}</CardTitle>
          </CardHeader>
          <CardFooter>
            <div
              className={`absolute bottom-2 right-2 ${
                isCheckedState ? "text-green-600" : "text-blue-600"
              }`}
              style={{ fontSize: "1.5rem" }}
            >
              {isCheckedState ? <GrStatusGood /> : <TbHandFingerRight />}
            </div>
          </CardFooter>
        </Card>
        <Card
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardContent>
            <p className="font-semibold text-lg text-center">{back}</p>
          </CardContent>
          <CardFooter>
            <Checkbox checked={isCheckedState} onCheckedChange={handleCheck} />
            <span>Done!</span>
            {isCheckedState && (
              <div
                className="absolute bottom-2 right-2 text-green-600"
                style={{ fontSize: "1.5rem" }}
              >
                <GrStatusGood />
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FlippableCard;
