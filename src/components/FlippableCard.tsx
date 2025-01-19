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
          className="absolute inset-0 w-full h-full backface-hidden flex items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardHeader className="flex items-center justify-center h-full">
            <CardTitle className="text-2xl text-center">{front}</CardTitle>
          </CardHeader>
          <CardFooter>
            <div
              className={`absolute bottom-2 right-2 text-2xl ${
                isCheckedState ? "text-green-600" : "text-blue-600"
              }`}
            >
              {isCheckedState ? <GrStatusGood /> : <TbHandFingerRight />}
            </div>
          </CardFooter>
        </Card>
        <Card
          className="absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardContent className="flex items-center justify-center text-2xl text-center h-full p-0">
            {back}
          </CardContent>
          <CardFooter>
            <div className="mt-1 flex items-center space-x-2">
              <Checkbox
                checked={isCheckedState}
                onCheckedChange={handleCheck}
                className="h-4 w-4"
              />
              <span>Done!</span>
            </div>
            {isCheckedState && (
              <div className="absolute bottom-2 right-2 text-green-600 text-2xl">
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
