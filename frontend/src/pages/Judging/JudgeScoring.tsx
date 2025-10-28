import React, { useEffect, useState } from "react";
import type{ChangeEvent, FormEvent} from "react"

interface Judge {
  id: number;
  name: string;
}

interface Team {
  id: number;
  team_number: number;
  room: string;
}

interface Score {
  category1: number | null;
  category2: number | null;
  category3: number | null;
  category4: number | null;
  category5: number | null;
}
const JudgeScoring: React.FC = () => {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [selectedJudge, setSelectedJudge] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<number | "">("");

  const [categories, setCategories] = useState<Score>({
    category1: null,
    category2: null,
    category3: null,
    category4: null,
    category5: null,
  });

  const [message, setMessage] = useState<string>("");

  // Fetch judges and rooms
  useEffect(() => {
    fetch("api.hiskule.skule.ca/judgeDropdown")
      .then((res) => res.json())
      .then((data: Judge[]) => setJudges(data))
      .catch(console.error);

    fetch("api.hiskule.skule.ca/rooms")
      .then((res) => res.json())
      .then((data: string[]) => setRooms(data))
      .catch(console.error);
  }, []);

  // Fetch teams when room is selected
  useEffect(() => {
    if (!selectedRoom) return;
    fetch(`api.hiskule.skule.ca/rooms/${encodeURIComponent(selectedRoom)}/teams`)
      .then((res) => res.json())
      .then((data: Team[]) => setTeams(data))
      .catch(console.error);
  }, [selectedRoom]);

   useEffect(() => {
    if (!selectedJudge || !selectedTeam) return;
    fetch(`api.hiskule.skule.ca/scores/${encodeURIComponent(selectedJudge)}/${selectedTeam}`)
        .then(res => res.json())
        .then(data => {
            if (data.previousScores) {
            setCategories({
                category1: data.previousScores.category1 ?? null,
                category2: data.previousScores.category2 ?? null,
                category3: data.previousScores.category3 ?? null,
                category4: data.previousScores.category4 ?? null,
                category5: data.previousScores.category5 ?? null,
            });
            setMessage("Loaded previous scores.");
            } else {
            setCategories({ category1: null, category2: null, category3: null, category4: null, category5: null });
            setMessage("No previous scores found.");
            }
  });



    }, [selectedJudge, selectedTeam]);


  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategories((prev) => ({
      ...prev,
      [name]: value === "" ? null : parseFloat(value),
    }));
  };

  // Submit scores
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedJudge || !selectedTeam || !selectedRoom) return;

    const res = await fetch("api.hiskule.skule.ca/judge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        judgeName: selectedJudge,
        room: selectedRoom,
        teamNumber: selectedTeam,
        ...categories,
      }),
    });

    const data = await res.json();
    setMessage(data.message || "Submitted!");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">🏆 Judge Scoring</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Judge Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Judge</label>
          <select
            className="w-full border rounded-md p-2"
            value={selectedJudge}
            onChange={(e) => setSelectedJudge(e.target.value)}
          >
            <option value="">Select Judge</option>
            {judges.map((j) => (
              <option key={j.id} value={j.name}>
                {j.name}
              </option>
            ))}
          </select>
        </div>

        {/* Room Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Room</label>
          <select
            className="w-full border rounded-md p-2"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            <option value="">Select Room</option>
            {rooms.map((room, i) => (
              <option key={i} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>

        {/* Team Dropdown */}
        {selectedRoom && (
          <div>
            <label className="block mb-1 font-medium">Team</label>
            <select
              className="w-full border rounded-md p-2"
              value={selectedTeam}
              onChange={(e) =>
                setSelectedTeam(e.target.value === "" ? "" : parseInt(e.target.value))
              }
            >
              <option value="">Select Team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.team_number}>
                  Team {t.team_number}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Category Inputs */}
        {selectedTeam && (
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(categories).map((cat, idx) => (
              <div key={idx}>
                <label className="block mb-1 font-medium">Category {idx + 1}</label>
                <input
                  type="number"
                  name={cat}
                  value={categories[cat as keyof Score] ?? ""}
                  placeholder={
                        categories[cat as keyof Score] !== null &&
                        categories[cat as keyof Score] !== undefined
                        ? String(categories[cat as keyof Score])
                        : ""
                    }
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  min={0}
                  max={10}
                />
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        {selectedTeam && (
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            onClick = {handleSubmit}
          >
            Submit Scores
          </button>
        )}
      </form>

      {message && <p className="mt-4 text-center text-gray-700 font-medium">{message}</p>}
    </div>
  );
}


export default JudgeScoring;