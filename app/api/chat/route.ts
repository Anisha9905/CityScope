import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"

const filePath = path.join(process.cwd(), "data/civicQA.json")
const civicQA: { q: string; a: string }[] = JSON.parse(fs.readFileSync(filePath, "utf-8"))

// Simple similarity function (case-insensitive substring match)
function findAnswer(question: string) {
  const lowerQ = question.toLowerCase()
  // First try exact substring match
  for (const item of civicQA) {
    if (item.q.toLowerCase().includes(lowerQ)) return item.a
  }

  // Fallback: find question with most words in common
  let maxMatch = 0
  let bestAnswer = "Sorry, I don't know the answer."
  const questionWords = lowerQ.split(" ")

  for (const item of civicQA) {
    const itemWords = item.q.toLowerCase().split(" ")
    const matches = itemWords.filter((w) => questionWords.includes(w)).length
    if (matches > maxMatch) {
      maxMatch = matches
      bestAnswer = item.a
    }
  }
  return bestAnswer
}

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json()
    const answer = findAnswer(question)
    return NextResponse.json({ answer })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ answer: "Sorry, I couldn't fetch an answer." }, { status: 500 })
  }
}
