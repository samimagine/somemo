import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FlippableCard from "@/components/FlippableCard";

const Memo: React.FC = () => {
  const [cards, setCards] = useState<
    { id?: number; front: string; back: string; isChecked?: boolean }[]
  >([]);
  const [newCard, setNewCard] = useState({ front: "", back: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = "https://somemo-backend.onrender.com/cards";

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token missing. Redirecting to login.");
      alert("Please log in.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    console.log("Sending Token:", token);

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error("401 Unauthorized. Redirecting to login.");
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }
      const errorMsg = await response.text();
      throw new Error(errorMsg || "Unknown error occurred");
    }
    return response.json();
  };

  const fetchCards = async () => {
    setLoading(true);
    try {
      const data = await authFetch(`${API_BASE}/`);
      setCards(data);
    } catch (err) {
      console.error("Error fetching cards:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCard.front.trim() || !newCard.back.trim()) {
      setError("Both the front and back fields are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Adding card with data:", newCard);

      const response = await fetch(
        "https://somemo-backend.onrender.com/cards/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            front: newCard.front,
            back: newCard.back,
            isChecked: false,
          }),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to add card");
      }

      const card = await response.json();
      console.log("Added card:", card);
      setCards((prevCards) => [...prevCards, card]);
      setNewCard({ front: "", back: "" });
    } catch (err) {
      console.error("Error adding card:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleCheckChange = (index: number, isChecked: boolean) => {
    setCards((prevCards) =>
      prevCards.map((card, i) => (i === index ? { ...card, isChecked } : card))
    );
  };

  const handleRemember = async () => {
    const checkedCards = cards.filter((card) => card.isChecked);

    try {
      const data = await authFetch(`${API_BASE}/save-checked/`, {
        method: "POST",
        body: JSON.stringify(checkedCards),
      });
      alert(data.message || "Checked cards saved successfully!");
    } catch (err) {
      console.error("Error saving checked cards:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    }
  };

  useEffect(() => {
    fetchCards();
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
            key={card.id || index}
            front={card.front}
            back={card.back}
            isChecked={card.isChecked}
            onCheckChange={(isChecked) => handleCheckChange(index, isChecked)}
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
