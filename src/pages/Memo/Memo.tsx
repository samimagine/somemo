import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FlippableCard from "@/components/FlippableCard";

const Memo: React.FC = () => {
  const [cards, setCards] = useState<
    { front: string; back: string; isChecked?: boolean }[]
  >([]);
  const [newCard, setNewCard] = useState({ front: "", back: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCards = () => {
    try {
      const savedCards = JSON.parse(
        localStorage.getItem("rememberedCards") || "[]"
      );
      if (savedCards.length > 0) {
        console.log("Loaded cards from localStorage:", savedCards);
        setCards(savedCards);
        setLoading(false);
      } else {
        console.log("No cards in localStorage. Fetching from backend...");
        fetchCards();
      }
    } catch (err) {
      console.error("Error reading from localStorage:", err);
      fetchCards();
    }
  };

  const fetchCards = () => {
    fetch("https://somemo-backend.onrender.com/cards")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }
        return response.json();
      })
      .then((data) => {
        const mergedCards = data.cards.map(
          (card: { front: string; back: string }) => ({
            ...card,
            isChecked: false,
          })
        );
        console.log("Fetched cards from backend:", mergedCards);
        setCards(mergedCards);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cards from backend:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("https://somemo-backend.onrender.com/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add card");
        }
        return response.json();
      })
      .then((card) => {
        const newCardWithState = { ...card, isChecked: false };
        setCards((prevCards) => [...prevCards, newCardWithState]);
        setNewCard({ front: "", back: "" });
      })
      .catch((err) => {
        console.error("Error adding card:", err);
        setError(err.message);
      });
  };

  const handleCheckChange = (index: number, isChecked: boolean) => {
    setCards((prevCards) =>
      prevCards.map((card, i) => (i === index ? { ...card, isChecked } : card))
    );
  };

  const handleRemember = () => {
    try {
      localStorage.setItem("rememberedCards", JSON.stringify(cards));
      console.log("Saved cards to localStorage:", cards);
      alert("Cards saved to localStorage!");
    } catch (err) {
      console.error("Error saving to localStorage:", err);
      alert("Failed to save cards to localStorage.");
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Collections (Memo)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {cards.map((card, index) => (
          <FlippableCard
            key={index}
            front={card.front}
            back={card.back}
            isChecked={card.isChecked}
            onCheckChange={(isChecked) => {
              handleCheckChange(index, isChecked);
              const updatedCards = cards.map((c, i) =>
                i === index ? { ...c, isChecked } : c
              );
              localStorage.setItem(
                "rememberedCards",
                JSON.stringify(updatedCards)
              );
            }}
          />
        ))}
      </div>

      <form onSubmit={addCard} className="mb-4">
        <h2 className="text-lg font-bold mb-2">Add a New Card</h2>
        <div className="mb-2">
          <Label htmlFor="front">Front (German):</Label>
          <Input
            id="front"
            type="text"
            value={newCard.front}
            onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
            required
          />
        </div>
        <div className="mb-2">
          <Label htmlFor="back">Back (English):</Label>
          <Input
            id="back"
            type="text"
            value={newCard.back}
            onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
            required
          />
        </div>
        <Button type="submit">Add Card</Button>
      </form>

      <Button onClick={handleRemember} variant="secondary">
        Remember
      </Button>
    </div>
  );
};

export default Memo;
