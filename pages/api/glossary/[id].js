import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Valid id is required" });
    }

    try {
      await prisma.glossary.delete({
        where: { id },
      });
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting glossary entry:", error);
      res.status(500).json({ error: "Failed to delete glossary entry" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}