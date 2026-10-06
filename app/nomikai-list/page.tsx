"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Nomikai = {
  id: number;
  name: string;
  room: string | null;
  responsible: string | null;
  date: string | null;
  time: string | null;
  description: string | null;
  tags: string[] | null;
};

export default function Home() {
  const [nomikais, setNomikais] = useState<Nomikai[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchNomikais = async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("nomikai")
      .select("*");

    // デバッグ用
    console.log("Supabase data:", data);
    console.log("Supabase error:", error);

    if (error) {
      console.error("飲み会取得エラー:", error);
      setNomikais([]);
      setErrorMessage(error.message);
    } else {
      setNomikais(data ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNomikais();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#e7ffd1",
        padding: "30px 20px 60px",
        fontFamily:
          "Arial, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            gap: "20px",
          }}
        >
          <div>
            <h1
              style={{
                display: "inline-block",
                padding: "13px 18px",
                background: "#245238",
                borderRadius: "20px",
                color: "#ffffff",
                fontSize: "32px",
              }}
            >
              🍻 春合宿飲み部屋リスト{" "}

              <span style={{display: "inline-block",
              padding: "13px 18px",
              background: "#0d7e1c", fontSize: "28px", color: "#ffffff", borderRadius: "40px", fontWeight: "normal", }} >

                {new Date().getMonth() + 1}月{new Date().getDate()}日
             </span>
  
            </h1>
            

            <p
              style={{
                marginTop: "8px",
                color: "#666",
              }}
            >
              合宿中の飲み会を確認できます
            </p>
          </div>

          <Link
            href="/nomikai-yoyaku"
            style={{
              display: "inline-block",
              padding: "13px 18px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "700",
              whiteSpace: "nowrap",
            }}
          >
            ＋ 飲み会を登録
          </Link>
        </div>

        {/* 読み込み中 */}
        {loading && (
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            読み込み中...
          </div>
        )}

        {/* Supabaseエラー */}
        {!loading && errorMessage && (
          <div
            style={{
              background: "#fef2f2",
              color: "#b91c1c",
              padding: "20px",
              borderRadius: "16px",
              marginBottom: "20px",
            }}
          >
            <strong>データ取得エラー</strong>

            <p
              style={{
                marginBottom: 0,
                wordBreak: "break-word",
              }}
            >
              {errorMessage}
            </p>
          </div>
        )}

        {/* 飲み会がない場合 */}
        {!loading &&
          !errorMessage &&
          nomikais.length === 0 && (
            <div
              style={{
                background: "#fff",
                padding: "40px",
                borderRadius: "16px",
                textAlign: "center",
                color: "#666",
              }}
            >
              <p>まだ飲み会が登録されていません。</p>

              <Link
                href="/nomikai-yoyaku"
                style={{
                  color: "#2563eb",
                  fontWeight: "700",
                }}
              >
                最初の飲み会を登録する
              </Link>
            </div>
          )}

        {/* 飲み会リスト */}
        {!loading &&
          !errorMessage &&
          nomikais.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {nomikais.map((nomikai) => (
                <div
                  key={nomikai.id}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow:
                      "0 4px 15px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* 飲み会名 */}
                  <h2
                    style={{
                      margin: "0 0 15px",
                      fontSize: "23px",
                    }}
                  >
                    {nomikai.name}
                  </h2>

                  {/* タグ */}
                  {nomikai.tags &&
                    nomikai.tags.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                          marginBottom: "18px",
                        }}
                      >
                        {nomikai.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              padding: "5px 10px",
                              borderRadius: "20px",
                              background: "#dbeafe",
                              color: "#1d4ed8",
                              fontSize: "12px",
                              fontWeight: "700",
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                  {/* 情報 */}
                  <div
                    style={{
                      display: "grid",
                      gap: "10px",
                      color: "#444",
                      fontSize: "14px",
                    }}
                  >
                    {nomikai.room && (
                      <div>
                        🏠 <strong>部屋：</strong>
                        {nomikai.room}
                      </div>
                    )}

                    {nomikai.responsible && (
                      <div>
                        👤 <strong>責任者：</strong>
                        {nomikai.responsible}
                      </div>
                    )}

                    {nomikai.date && (
                      <div>
                        📅 <strong>日付：</strong>
                        {nomikai.date}
                      </div>
                    )}

                    {nomikai.time && (
                      <div>
                        🕐 <strong>開始：</strong>
                        {nomikai.time.slice(0, 5)}
                      </div>
                    )}
                  </div>

                  {/* 説明 */}
                  {nomikai.description && (
                    <div
                      style={{
                        marginTop: "18px",
                        padding: "14px",
                        background: "#f8fafc",
                        borderRadius: "10px",
                        color: "#555",
                        lineHeight: "1.6",
                        fontSize: "14px",
                      }}
                    >
                      {nomikai.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>
    </main>
  );
}
