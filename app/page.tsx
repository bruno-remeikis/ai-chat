'use client'

import React, { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { LoadingDots } from "../components/LoadingDots"
import { processPrompt } from "@/utils/prompt-processor"
import { IoSend } from "react-icons/io5"
import { ThemeSwitch } from "@/components/ThemeSwitch"
import Link from "next/link"

type AiResponse = {
  response: string
}

type Role = 'user' | 'ai'

type Prompt = {
  role: Role
  text: string
  error?: boolean
}

// type ProcessedPrompt = React.JSX.Element | React.JSX.Element[]

type BaloonProps = {
  role: Role
  children: string | React.JSX.Element | React.JSX.Element[]
  className?: string
}

function Balloon({ role, children, className }: BaloonProps) {
  const [elements, setElements] = useState<React.JSX.Element[]>([])

  useEffect(() => {
    if(typeof children === 'string')
      setElements(processPrompt(children))
    else if(Array.isArray(children))
      setElements(children)
    else
      setElements([children])
  }, [])

  return (
    <div className={`text-black dark:text-white bg-gray-100/25 dark:bg-gray-500/25 min-w-20 ${role === 'user' ? 'self-end sm:ml-12 ml-4' : 'self-start sm:mr-12 mr-4'} p-3 mb-3 last:mb-0 rounded-md shadow-md ${className}`}>
      <span className='block text-xs dark:font-thin font-light'>{ role === 'user' ? 'Você' : 'IA' }</span>
      <div className=''>
        {elements}
      </div>
    </div>
  )
}

export default function Home()
{
  const [text, setText] = useState<string>('')
  const [prompts, setPrompts] = useState<Prompt[]>([ /*{role:'user',text:'aaa'}, {role:'ai',text:'bbb'}*/ ])
  const [loading, setLoading] = useState<boolean>(false)

  const processText = useCallback(processPrompt, []);
  // const processedText = useMemo(() => processText(text), [text, processText]);

  /*const memoizedPrompts = useCallback(() =>
    prompts.map((p, i) => (
      <Baloon key={i} role={p.role} className={p.role === 'user' ? 'animation-slideUp' : undefined}>
        { useMemo(() => processPrompt(p.text), [p.text]) }
      </Baloon>
  )), [prompts]);*/

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const prompt = text.trim()

    if(!prompt)
      return;

    setLoading(true)
    setText('')
    setPrompts(p => [...p, { role: 'user', text: prompt }])

    const config = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    }

    try {
      const response = await fetch('/api/chat', config)
      const result: AiResponse = await response.json()

      if(!response.ok) {
        setPrompts(p => [...p, { role: 'ai', text: result.response, error: true }]) // I don't understand what you're asking me to do. Can you please clarify?
        return;
      }

      setPrompts(p => [...p, { role: 'ai', text: result.response }])
    }
    catch(err) {
      console.error(err)
      setPrompts(p => [...p, { role: 'ai', text: "Desculpe. Hoje não estou funcionando corretamente.", error: true }])
    }
    finally {
      setLoading(false)
      // window.scrollTo(0, document.body.scrollHeight);
    }
  }

  return (
    <div className='flex flex-col items-center min-h-svh'>

      {/* Menú superior */}
      <div className='fixed flex justify-between items-center bg-gray-200 dark:bg-gray-900 w-full pr-[1rem] shadow z-50'>
        <Link
          className='p-[1rem] hover:bg-white/10 transition-all'
          href='https://portifolio-remeikis.vercel.app/'
          target='_blank'
        >
          <span className='block text-black dark:text-gray-300 font-extralight  text-xs'>Desenvolvido por</span>
          <span className='block text-black dark:text-gray-300 font-light text-sm'>Bruno Remeikis</span>
        </Link>

        <div>
          <ThemeSwitch />
        </div>
      </div>

      {/* https://hypercolor.dev/ */}
      <div className={
        'flex-1 flex flex-col items-center w-full p-6 pt-24 ' +
        // Light background gradient:
        'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-300 ' +
        // Dark background gradient:
        'dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-900 dark:to-black'
      }>
        <div className='flex-1 flex flex-col md:w-[46rem] w-full'> {/* overflow-y-scroll */}
          
          {/* Dialog baloons */}
          {/* overflow-x-hidden  */}
          <div className='flex-1 flex flex-col justify-end mb-6 rounded'> {/* bg-gray-500/25 */}
            {/* {prompts.map((p, i) =>
              <Baloon key={i} role={p.role} className={`${p.role === 'user' ? 'animation-slideUp' : ''} ${p.error ? 'bg-red-300 dark:bg-red-600/50' : ''}`}>
                { processPrompt(p.text).map(el => el) }
              </Baloon>
            )} */}
            {prompts.map((p, i) =>
              <Balloon key={i} role={p.role} className={`${p.role === 'user' ? 'animation-slideUp' : ''} ${p.error ? 'bg-red-300 dark:bg-red-600/50' : ''}`}>
                { p.text }
              </Balloon>
            )}
            {/* { memoizedPrompts() } */}
          </div>

          {/* No baloonw yet */}
          {prompts.length === 0 &&
            <span className='flex-1 self-center text-gray-400 dark:text-white/40 font-extralight'>Converse com a IA</span>}

          {/* Loading baloon */}
          {loading &&
            <Balloon role='ai' className='animation-slideUp'>
              <LoadingDots className='mt-2' size='0.375rem' /*color='rgba(255, 255, 255, 0.85)'*/ />
            </Balloon>}

          {/* Input form */}
          <form onSubmit={handleSubmit} className='flex'>
            <input type='text' value={text} onChange={e => { e.preventDefault(); setText(e.target.value) }} placeholder='Escreva aqui' className="flex-1 bg-transparent dark:text-white text-black h-10 px-3 border-[2px] dark:border-fuchsia-800 border-purple-700/60 rounded" /> {/* dark:border-purple-500/90 bg-white/20 */}
            <button type="submit" className='flex justify-center items-center bg-purple-600 dark:bg-fuchsia-800 w-10 h-10 ml-2 rounded transition hover:opacity-75'>
              <IoSend className='text-white' />
            </button>
          </form>
          
        </div>
      </div>

    </div>
  )
}
