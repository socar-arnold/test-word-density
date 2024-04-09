"use client";
import DensityChecker from "@/class/DensityChecker";
import { DensityData, makeFromData, readExcelFile } from "@/utils/excel";
import { ChangeEvent, useState } from "react";

const density = new DensityChecker();

export default function Home() {
  const [result, setResult] = useState<DensityData[]>([]);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const result = await readExcelFile(e);
    const check = density.calculateKeywordsDensity(
      result
        ?.flatMap((el) => el.datas)
        .map((el) => el.memo)
        .join("")
    );

    setResult(check);
  };

  const onSave = () => {
    if (!result.length) alert("액셀 데이터를 업로드해주세요");
    makeFromData(result);
  };

  return (
    <main className="main-container">
      <h1>Word Density Calculator</h1>
      <div className="input-wrapper">
        <input
          id="upload-keyword"
          type="file"
          accept=".xlsx, .xls"
          onChange={onChange}
        />

        <button className="excel-button" onClick={onSave}>
          액셀로 다운받기
        </button>
      </div>
      <section className="result-wrapper">
        <ul>
          {result.map((el, idx) => (
            <li key={idx + el.word}>
              {el.word}: {el.count}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
