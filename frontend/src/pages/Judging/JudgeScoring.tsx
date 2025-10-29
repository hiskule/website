import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent} from "react";
import styled from "styled-components";
import Select from "react-select";

const StyledJudgingPage = styled.div`
  width: 100vw;
  min-height: 100vh;
  position: relative;
  background: linear-gradient(180deg, white 15%, #c9ecffff 100%);
  padding-top: 60px;
`;

const Container = styled.div`
  max-width: 32rem;
  margin: 2.5rem auto;
  padding: 1.5rem;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  overflow: visible;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 95%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
`;

const Button = styled.button`
  width: 100%;
  margin-top: 1rem;
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 0;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const Message = styled.p`
  margin-top: 1rem;
  text-align: center;
  color: #374151;
  font-weight: 500;
`;

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
  const [teams, setTeams] = useState<{ value: number; label: string }[]>([]);

  const [selectedJudge, setSelectedJudge] = useState<Judge | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<{ value: string; label: string } | null>(
    null
  );
  const [selectedTeam, setSelectedTeam] = useState<{ value: number; label: string } | null>(
    null
  );

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
    fetch("http://localhost:3000/judgeDropdown")
      .then((res) => res.json())
      .then((data: Judge[]) => setJudges(data))
      .catch(console.error);

    fetch("http://localhost:3000/rooms")
      .then((res) => res.json())
      .then((data: string[]) => setRooms(data))
      .catch(console.error);
  }, []);

  // Fetch teams when room is selected
  useEffect(() => {
    if (!selectedRoom) return;
    fetch(`http://localhost:3000/rooms/${encodeURIComponent(selectedRoom.value)}/teams`)
      .then((res) => res.json())
      .then((data: Team[]) =>
        setTeams(
          data.map((t) => ({ value: t.team_number, label: `Team ${t.team_number}` }))
        )
      )
      .catch(console.error);
  }, [selectedRoom]);

  // Fetch previous score
  useEffect(() => {
    if (!selectedJudge || !selectedTeam) return;
    fetch(
      `http://localhost:3000/scores/${encodeURIComponent(
        selectedJudge.name
      )}/${selectedTeam.value}`
    )
      .then((res) => res.json())
      .then((data) => {
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
          setCategories({
            category1: null,
            category2: null,
            category3: null,
            category4: null,
            category5: null,
          });
          setMessage("No previous scores found.");
        }
      });
  }, [selectedJudge, selectedTeam]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategories((prev) => ({
      ...prev,
      [name]: value === "" ? null : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedJudge || !selectedTeam || !selectedRoom) return;

    const res = await fetch("http://localhost:3000/judge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        judgeName: selectedJudge.name,
        room: selectedRoom.value,
        teamNumber: selectedTeam.value,
        ...categories,
      }),
    });

    const data = await res.json();
    setMessage(data.message || "Submitted!");
  };

  return (
    <StyledJudgingPage>
      <Container>
        <Title>🏆 Judge Scoring</Title>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label>Judge</Label>
            <Select
              options={judges.map((j) => ({ value: j.name, label: j.name }))}
              value={selectedJudge ? { value: selectedJudge.name, label: selectedJudge.name } : null}
              onChange={(option) =>
                setSelectedJudge(option ? { id: 0, name: option.value } : null)
              }
              placeholder="Select Judge"
            />
          </div>


           
        {selectedJudge && (
        <div>
            <Label>Room</Label>
            <Select
            options={rooms.map((r) => ({ value: r, label: r }))}
            value={selectedRoom}
            onChange={(option) => setSelectedRoom(option)}
            placeholder="Select Room"/>
        </div>
        )}


          {selectedRoom && (
            <div>
                <Label>Team</Label>
                <Select
  options={teams.map((t) => ({
    value: t.value,
    label: `Team ${t.value}`,
  }))}
  value={selectedTeam} // the currently selected team
  onChange={(option) => setSelectedTeam(option)} // <-- set selectedTeam here
  placeholder="Select Team"
/>

            </div>
            )}


          {selectedTeam && (
            <Grid>
              {Object.keys(categories).map((cat, idx) => (
                <div key={idx}>
                  <Label>Category {idx + 1}</Label>
                  <Input
                    type="number"
                    name={cat}
                    value={categories[cat as keyof Score] ?? ""}
                    placeholder={
                      categories[cat as keyof Score] !== null
                        ? String(categories[cat as keyof Score])
                        : ""
                    }
                    onChange={handleChange}
                    min={0}
                    max={10}
                  />
                </div>
              ))}
            </Grid>
          )}

          {selectedTeam && <Button type="submit" onClick={handleSubmit}>Submit Scores</Button>}
        </Form>

        {message && <Message>{message}</Message>}
      </Container>
    </StyledJudgingPage>
  );
};

export default JudgeScoring;
