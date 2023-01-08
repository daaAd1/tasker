import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";

const cardVariants = {
  selected: {
    rotateY: 180,
    x: 0,
    opacity: 1,
    transition: { duration: 0.5 },
    zIndex: 10,
    boxShadow:
      "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
  },
  notSelected: {
    rotateY: 0,
    x: 0,
    opacity: 1,
    zIndex: 10,
    boxShadow:
      "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
    transition: { duration: 0.5 },
  },
};

const FlippingCard = ({ children, renderTodayList }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const selectCard = (card) => {
    setSelectedCard(selectedCard ? null : card);
  };
  const handleCardMouseUp = (e, card) => {
    selectCard(card);
  };

  return (
    <div className="w-full h-full bg-gray-100 justify-center items-center">
      <div
        className="max-w-full h-screen whitespace-nowrap overflow-hidden w-full
        perspective-default"
      >
        <motion.div
          className="relative inline-block w-full h-full bg-white margin-10 rounded-2xl"
          variants={cardVariants}
          animate={selectedCard === 1 ? "selected" : "notSelected"}
        >
          <div className={``}>
            {selectedCard === 1 ? (
              <div
                style={{
                  transform: "rotateY(180deg)",
                }}
                className="h-[91vh]"
              >
                <button
                  className="z-20 flex flex-row items-center justify-center px-4 py-2
              absolute top-4 right-6 bg-orange-300 rounded-md"
                  onClick={(e) => handleCardMouseUp(e, 1)}
                >
                  <ArrowPathRoundedSquareIcon className="w-6 h-6 text-white mr-2" />
                  <span className="uppercase text-white font-semibold text-sm">
                    Flip
                  </span>
                </button>
                {children}
              </div>
            ) : (
              <>
                <button
                  className="z-20 flex flex-row items-center justify-center px-4 py-2
              absolute top-4 right-6 bg-orange-300 rounded-md"
                  onClick={(e) => handleCardMouseUp(e, 1)}
                >
                  <ArrowPathRoundedSquareIcon className="w-6 h-6 text-white mr-2" />
                  <span className="uppercase text-white font-semibold text-sm">
                    Flip
                  </span>
                </button>
                {renderTodayList()}
              </>
            )}
            {/* <div
              style={{
                transform: "translateX(0px) rotateY(180deg) translateZ(0px)",
              }}
              className={`${selectedCard === 1 ? "" : "invisible h-0"}`}
            >
              {children}
            </div>
            <div className={`${selectedCard === 1 ? "invisible h-0" : ""}`}>
              {renderTodayList()}
            </div> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FlippingCard;
