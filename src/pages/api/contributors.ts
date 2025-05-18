// pages/api/contributors.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchTeamData } from "@/libs/spreadsheets";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const team = await fetchTeamData();
      res.status(200).json(team);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch team data" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
