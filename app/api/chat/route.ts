import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv'
import { NextRequest, NextResponse } from "next/server"

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null

export async function GET(req: NextRequest) {
  if(!genAI)
    return NextResponse.json({ response: 'Desculpe. Houve um erro em nosso servidor.' }, { status: 500 })

  try {
    const prompt = req.nextUrl.searchParams.get('prompt') //req.query.prompt

    if(!prompt)
      return NextResponse.json({ response: 'Desculpe. Houve um erro ao tentar contactar a IA.' }, { status: 400 })

    const model = genAI.getGenerativeModel({ model: "gemini-pro"})

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    console.log(text)
    return NextResponse.json({ response: text })
  }
  catch(err) {
      console.error(err)
      return NextResponse.json({ response: 'Desculpe. Houve um erro em nosso servidor.' }, { status: 500 })
  }
}