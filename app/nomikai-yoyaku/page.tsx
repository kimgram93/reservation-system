"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const availableTags = [
  "1年生",
  "2年生",
  "パート",
  "先生",
  "弦",
  "木管",
  "金管",
  "打楽器",
  "参加歓迎",
  "わいわい",
  "ゲーム",
  "しっぽり",
  "雑談",
  "大人数",
  "少人数",
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [responsible, setResponsible] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => {
      if (current.includes(tag)) {
        return current.filter((item) => item !== tag);
      }

      return [...current, tag];
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");

    if (!name.trim()) {
      setMessage("飲み会の名前を入力してください。");
      return;
    }

    if (!room.trim()) {
      setMessage("飲む部屋を入力してください。");
      return;
    }

    if (!responsible.trim()) {
      setMessage("責任者を入力してください。");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("nomikai")
        .insert({
          name: name.trim(),
          room: room.trim(),
          responsible: responsible.trim(),
          date: date || null,
          time: time || null,
          description: description.trim() || null,
          tags: selectedTags,
        });

      if (error) {
        console.error("Supabase error:", error);
        setMessage(`登録に失敗しました：${error.message}`);
        return;
      }

      setMessage("✅ 飲み会を登録しました！");

      setName("");
      setRoom("");
      setResponsible("");
      setDate("");
      setTime("");
      setDescription("");
      setSelectedTags([]);
    } catch (error) {
      console.error(error);
      setMessage("登録中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#e7ffd1",
        padding: "40px 20px 60px",
        fontFamily:
          "Arial, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "650px",
          margin: "0 auto",
        }}
      >
        {/* 一覧に戻る */}
        <Link
          href="/nomikai-list"
          style={{
            display: "inline-block",
            marginBottom: "20px",
            color: "#333",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          ← 飲み会一覧に戻る
        </Link>

        {/* タイトル */}
        <h1
          style={{
            textAlign: "center",
            fontSize: "32px",
            marginBottom: "10px",
          }}
        >
          🍻 合宿飲み会登録
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          飲み会の情報を登録してください
        </p>

        {/* 登録フォーム */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          {/* 飲み会名 */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              飲み会の名前
              <span style={requiredStyle}>必須</span>
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：2年生学年飲み"
              style={inputStyle}
            />
          </div>

          {/* 部屋 */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              飲む部屋
              <span style={requiredStyle}>必須</span>
            </label>

            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="例：302号室"
              style={inputStyle}
            />
          </div>

          {/* 責任者 */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              責任者
              <span style={requiredStyle}>必須</span>
            </label>

            <input
              type="text"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder="例：法政太郎"
              style={inputStyle}
            />
          </div>

          {/* 日付 */}
          <div style={fieldStyle}>
            <label style={labelStyle}>日付</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* 時間 */}
          <div style={fieldStyle}>
            <label style={labelStyle}>開始時間</label>

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* タグ */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              どんなグループ？
            </label>

            <p
              style={{
                fontSize: "13px",
                color: "#777",
                margin: "0 0 10px",
              }}
            >
              当てはまるタグを選択してください
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {availableTags.map((tag) => {
                const selected = selectedTags.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: "9px 14px",
                      borderRadius: "20px",
                      border: selected
                        ? "2px solid #2563eb"
                        : "1px solid #d1d5db",
                      background: selected
                        ? "#2563eb"
                        : "#fff",
                      color: selected
                        ? "#fff"
                        : "#333",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: selected ? "700" : "400",
                    }}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>

            {/* 選択中タグ */}
            {selectedTags.length > 0 && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px",
                  background: "#eff6ff",
                  borderRadius: "8px",
                  color: "#2563eb",
                  fontSize: "14px",
                }}
              >
                <strong>選択中：</strong>{" "}
                {selectedTags.map((tag) => `#${tag}`).join(" ")}
              </div>
            )}
          </div>

          {/* 説明 */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              一言・説明
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="どんな飲み会なのか自由に書いてください"
              rows={5}
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: "120px",
              }}
            />
          </div>

          {/* メッセージ */}
          {message && (
            <div
              style={{
                padding: "13px",
                marginBottom: "20px",
                borderRadius: "9px",
                background: message.startsWith("✅")
                  ? "#ecfdf5"
                  : "#fef2f2",
                color: message.startsWith("✅")
                  ? "#047857"
                  : "#b91c1c",
              }}
            >
              {message}
            </div>
          )}

          {/* 登録ボタン */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              background: loading ? "#9ca3af" : "#2563eb",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? "登録しています..."
              : "🍻 飲み会を登録する"}
          </button>
        </form>
      </div>
    </main>
  );
}

const fieldStyle = {
  marginBottom: "22px",
};

const labelStyle = {
  display: "block",
  fontWeight: "700",
  fontSize: "15px",
  marginBottom: "8px",
};

const requiredStyle = {
  display: "inline-block",
  marginLeft: "8px",
  padding: "2px 6px",
  borderRadius: "4px",
  background: "#fee2e2",
  color: "#dc2626",
  fontSize: "11px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "12px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  outline: "none",
  background: "#fff",
};
