import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CardProps {
  front: string;
  back: string;
  isChecked?: boolean;
  onCheckChange?: (isChecked: boolean) => void;
}

const Card: React.FC<CardProps> = ({
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

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newCheckedState = !isCheckedState;
    setIsCheckedState(newCheckedState);

    if (onCheckChange) {
      onCheckChange(newCheckedState);
    }
  };

  return (
    <motion.div
      className="relative p-4 border rounded shadow cursor-pointer h-28"
      style={{
        perspective: "1000px",
      }}
      onClick={handleFlip}
    >
      <AnimatePresence initial={false}>
        {!isFlipped ? (
          <motion.div
            key="front"
            className="absolute inset-0 flex items-center justify-center bg-blue-100"
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -180 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-semibold text-lg">{front}</p>
            <div
              className={`absolute bottom-2 right-2 ${
                isCheckedState ? "text-green-600" : "text-blue-600"
              }`}
              style={{ fontSize: "1.5rem" }}
            >
              {isCheckedState ? "✔️" : "👆"}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            className="absolute inset-0 flex flex-col items-center justify-center bg-white"
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -180 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-semibold text-lg">{back}</p>
            <label className="mt-4 flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isCheckedState}
                onChange={handleCheck}
                className="h-4 w-4"
              />
              <span>Mark as done</span>
            </label>
            {isCheckedState && (
              <div
                className="absolute bottom-2 right-2 text-green-600"
                style={{ fontSize: "1.5rem" }}
              >
                ✔️
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Card;
