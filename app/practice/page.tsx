"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Room = {
  id: number;
  name: string;
};

type Reservation = {
  id: number;
  name: string;
  room_id: number;
  responsible: string;
  date: string;
  start_time: string;
  end_time: string;
  tags: string[] | null;
};

const times = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const practiceTags = [
  "合奏練習",
  "パートレッスン",
  "自主パー練",
  "個人練習",
  "室内楽大会",
  "その他",
];

export default function PracticePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [selectedDate, setSelectedDate] = useState("2026-10-15");

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedStart, setSelectedStart] = useState("");
  const [selectedEnd, setSelectedEnd] = useState("");

  const [name, setName] = useState("");
  const [responsible, setResponsible] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  // -----------------------------
  // 部屋と予約情報を取得
  // -----------------------------

  async function loadData() {
    const { data: roomData, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .order("id");

    if (roomError) {
      console.error(roomError);
      return;
    }

    const { data: reservationData, error: reservationError } =
      await supabase
        .from("practice_rooms")
        .select("*")
        .eq("date", selectedDate);

    if (reservationError) {
      console.error(reservationError);
      return;
    }

    setRooms(roomData || []);
    setReservations(reservationData || []);
  }

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  // -----------------------------
  // 予約が入っているか確認
  // -----------------------------

  function getReservation(roomId: number, time: string) {
    return reservations.find((reservation) => {
      if (reservation.room_id !== roomId) return false;

      const start = reservation.start_time.slice(0, 5);
      const end = reservation.end_time.slice(0, 5);

      return time >= start && time < end;
    });
  }

  // -----------------------------
  // 空きマスをクリック
  // -----------------------------

  function openReservation(
    room: Room,
    start: string
  ) {
    const index = times.indexOf(start);

    const end =
      index < times.length - 1
        ? times[index + 1]
        : "18:00";

    setSelectedRoom(room);
    setSelectedStart(start);
    setSelectedEnd(end);

    setName("");
    setResponsible("");
    setSelectedTags([]);

    setModalOpen(true);
  }

  // -----------------------------
  // タグ選択
  // -----------------------------

  function toggleTag(tag: string) {
    setSelectedTags((current) => {
      if (current.includes(tag)) {
        return current.filter((t) => t !== tag);
      }

      return [...current, tag];
    });
  }

  // -----------------------------
  // 予約登録
  // -----------------------------

  async function handleReservation() {
    if (!selectedRoom) return;

    if (!name.trim()) {
      alert("練習名を入力してください");
      return;
    }

    if (!responsible.trim()) {
      alert("担当者を入力してください");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("practice_rooms")
      .insert({
        name: name,
        room_id: selectedRoom.id,
        responsible: responsible,
        date: selectedDate,
        start_time: selectedStart,
        end_time: selectedEnd,
        tags: selectedTags,
      });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("予約に失敗しました");
      return;
    }

    alert("予約しました！");

    setModalOpen(false);

    loadData();
  }

  return (
    <main
      style={{
        padding: "30px",
        background: "#f5f7f5",
        minHeight: "100vh",
      }}
    >
      {/* タイトル */}

      <h1
        style={{
          marginBottom: "10px",
          fontSize: "32px",
        }}
      >
        🎺 練習部屋スケジュール
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "25px",
        }}
      >
        空いている時間をクリックすると予約できます
      </p>

      {/* 日付 */}

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* スケジュール */}

      <div
        style={{
          overflowX: "auto",
          background: "white",
          borderRadius: "12px",
          padding: "10px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `140px repeat(${times.length}, 100px)`,
            minWidth: "1040px",
          }}
        >
          {/* 左上 */}

          <div
            style={{
              padding: "12px",
              fontWeight: "bold",
              background: "#eee",
              border: "1px solid #ddd",
            }}
          >
            部屋
          </div>

          {/* 時間 */}

          {times.map((time) => (
            <div
              key={time}
              style={{
                padding: "12px",
                textAlign: "center",
                fontWeight: "bold",
                background: "#eee",
                border: "1px solid #ddd",
              }}
            >
              {time}
            </div>
          ))}

          {/* 部屋 */}

          {rooms.map((room) => (
            <>
              <div
                key={`room-${room.id}`}
                style={{
                  padding: "15px 10px",
                  fontWeight: "bold",
                  background: "#fafafa",
                  border: "1px solid #ddd",
                }}
              >
                {room.name}
              </div>

              {times.map((time) => {
                const reservation = getReservation(
                  room.id,
                  time
                );

                if (reservation) {
                  return (
                    <div
                      key={`${room.id}-${time}`}
                      style={{
                        padding: "8px",
                        background: "#ffb3b3",
                        border: "1px solid #ddd",
                        minHeight: "70px",
                        cursor: "default",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {reservation.name}
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {reservation.responsible}
                      </div>

                      <div
                        style={{
                          fontSize: "11px",
                          marginTop: "4px",
                        }}
                      >
                        {reservation.start_time.slice(0, 5)}
                        {"〜"}
                        {reservation.end_time.slice(0, 5)}
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={`${room.id}-${time}`}
                    onClick={() =>
                      openReservation(room, time)
                    }
                    style={{
                      background: "#b8f2c2",
                      border: "1px solid #ddd",
                      minHeight: "70px",
                      cursor: "pointer",
                      fontSize: "20px",
                    }}
                    title={`${room.name} ${time}〜`}
                  >
                    ＋
                  </button>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* -------------------------------- */}
      {/* 予約モーダル */}
      {/* -------------------------------- */}

      {modalOpen && selectedRoom && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              width: "100%",
              maxWidth: "500px",
              borderRadius: "16px",
              padding: "25px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            {/* モーダルタイトル */}

            <h2
              style={{
                marginTop: 0,
                marginBottom: "5px",
              }}
            >
              {selectedRoom.name}
            </h2>

            <p
              style={{
                color: "#666",
                marginTop: 0,
                marginBottom: "20px",
              }}
            >
              {selectedDate}
              <br />
              {selectedStart}〜{selectedEnd}
            </p>

            {/* 練習名 */}

            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "bold",
              }}
            >
              練習名
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：木管合奏"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "15px",
                boxSizing: "border-box",
              }}
            />

            {/* 担当者 */}

            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "bold",
              }}
            >
              担当者
            </label>

            <input
              type="text"
              value={responsible}
              onChange={(e) =>
                setResponsible(e.target.value)
              }
              placeholder="例：田中"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "20px",
                boxSizing: "border-box",
              }}
            />

            {/* タグ */}

            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              タグ
            </label>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "25px",
              }}
            >
              {practiceTags.map((tag) => {
                const selected =
                  selectedTags.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "20px",
                      border: selected
                        ? "2px solid #333"
                        : "1px solid #ccc",
                      background: selected
                        ? "#333"
                        : "#f5f5f5",
                      color: selected
                        ? "white"
                        : "#333",
                      cursor: "pointer",
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* ボタン */}

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                キャンセル
              </button>

              <button
                onClick={handleReservation}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#333",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {loading ? "登録中..." : "予約する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}