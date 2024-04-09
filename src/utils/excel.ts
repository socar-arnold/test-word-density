import { ChangeEvent, ChangeEventHandler } from "react";

export type DensityData = {
  word: string;
  count: number;
};

export type WordData = {
  sheetName: string;
  datas: { memo: string; question_ids: number; reservation_id: number }[];
};
const xlsx = require("xlsx");

export const makeFromData = (data: DensityData[]) => {
  const today = new Date();
  const [year, month, date] = [
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  ];

  const file = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(data);

  // Add worksheet to the workbook
  xlsx.utils.book_append_sheet(file, worksheet, "WordsData");
  return xlsx.writeFile(file, `단어체크-${year}-${month}-${date}.xlsx`);
  // Write the workbook to a file
};

const readFromFile = async (file: File): Promise<WordData[]> => {
  const workbook = xlsx.read(await file.arrayBuffer());
  const worksheets = workbook.SheetNames.map(
    (sheetName: string) => workbook.Sheets[sheetName]
  );
  // 헤더 옵션이 다양함. 나중에 한국어로 변경하려면 옵션 변경 필요
  //https://docs.sheetjs.com/docs/api/utilities/array#array-output

  const rawData = worksheets.map((worksheet: any, index: number) => {
    const sheetName = workbook.SheetNames[index];
    const datas = xlsx.utils.sheet_to_json(worksheet);

    return {
      sheetName,
      datas,
    };
  });

  return rawData as WordData[];
};

export const readExcelFile = (e: ChangeEvent<HTMLInputElement>) => {
  const target = e.target;
  const file = target?.files?.[0];

  if (file) {
    return readFromFile(file);
  }
};
