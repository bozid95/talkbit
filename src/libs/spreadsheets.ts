import { WordEntry } from "@/types/index";

export async function fetchSpreadsheetData(): Promise<WordEntry[]> {
  const sheetId = process.env.SPREADSHEET_ID!;
  const sheetName = process.env.SHEET_NAME!;
  const apiKey = process.env.GOOGLE_API_KEY!;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch spreadsheet data");

  const data = await res.json();
  const [headers, ...rows] = data.values;

  return rows.map((row: string[]) => {
    const entry: Record<string, string> = {};
    headers.forEach((header: string, i: number) => {
      entry[header] = row[i] || "";
    });
    return entry as unknown as WordEntry;
  });
}

interface TeamEntry {
  Nama: string;
  Link: string;
}

export async function fetchTeamData(): Promise<TeamEntry[]> {
  const sheetId = process.env.SPREADSHEET_ID!;
  const apiKey = process.env.GOOGLE_API_KEY!;
  const sheetName = process.env.SHEET_ABOUT || "tentang";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch team sheet");

  const data = await res.json();
  const [headers, ...rows] = data.values;

  return rows.map((row: string[]) => {
    const entry: Record<string, string> = {};
    headers.forEach((header: string, i: number) => {
      entry[header] = row[i] || "";
    });
    return entry as unknown as TeamEntry;
  });
}
