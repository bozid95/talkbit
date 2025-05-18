import type { NextApiRequest, NextApiResponse } from "next";
import { fetchSpreadsheetData } from "@/libs/spreadsheets";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await fetchSpreadsheetData();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
}
