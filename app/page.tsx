'use client'

import React, { FormEvent, useEffect, useState } from "react"
import { LoadingDots } from "../components/LoadingDots"
import { processPrompt } from "@/utils/prompt-processor"
import { IoSend } from "react-icons/io5"
import { ThemeSwitch } from "@/components/ThemeSwitch"

type AiResponse = {
  response: string
}

type Role = 'user' | 'ai'

type Prompt = {
  role: Role
  text: string
}

type BaloonProps = {
  role: Role
  children: React.JSX.Element | React.JSX.Element[]
  className?: string
}

function Baloon({ role, children, className = '' }: BaloonProps) {
  return (
    <div className={`text-black dark:text-white bg-gray-300/25 dark:bg-gray-500/25 min-w-20 ${role === 'user' ? 'self-end ml-12' : 'self-start mr-12'} p-3 mb-3 last:mb-0 rounded-md shadow-md ${className}`}>
      <span className='block text-xs dark:font-thin font-light'>{ role === 'user' ? 'Você' : 'IA' }</span>
      { children }
    </div>
  )
}

export default function Home() {
  const [text, setText] = useState<string>('')
  const [prompts, setPrompts] = useState<Prompt[]>([ /*{role:'user',text:'aaa'}, {role:'ai',text:'bbb'}*/ ])
  const [loading, setLoading] = useState<boolean>(false)

  

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const prompt = text.trim()

    if(!prompt)
      return;

    setLoading(true)
    setText('')
    setPrompts(p => [...p, { role: 'user', text: prompt }])

    const config = {
      method: "GET", // or 'PUT'
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify(data),
    }

    try {
      const response = await fetch(`http://localhost:3000/api/chat?prompt=${prompt.trim()}`, config)
      const result: AiResponse = await response.json()

      if(!response.ok) {
        setPrompts(p => [...p, { role: 'ai', text: result.response }]) // I don't understand what you're asking me to do. Can you please clarify?
        return;
      }

      console.log(result)
      setPrompts(p => [...p, { role: 'ai', text: result.response }])
    }
    catch(err) {
      setPrompts(p => [...p, { role: 'ai', text: "Desculpe. Hoje não estou funcionando corretamente." }])
    }
    finally {
      setLoading(false)
      // window.scrollTo(0, document.body.scrollHeight);
    }
  }

  return (
    <div className='min-h-screen'>
      <div className='fixed top-[1rem] right-[1rem]'>
        <ThemeSwitch />
      </div>

      {/* https://hypercolor.dev/ */}
      <div className={
        'flex flex-col items-center min-h-screen p-6 pt-16 ' +
        // Light background gradient:
        'linear-gradient(to right, rgb(229, 231, 235), rgb(156, 163, 175), rgb(75, 85, 99)) ' +
        // Dark background gradient:
        'dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-900 dark:to-black'
        //'dark:bg-gradient-to-r dark:from-slate-900 dark:via-purple-900 dark:to-slate-900'
      }>
        <div className='flex-1 flex flex-col md:w-[42rem] w-full'>
          
          {/* Dialog baloons */}
          <div className='flex-1 flex flex-col justify-end mb-6 rounded'> {/* bg-gray-500/25 */}
            {prompts.map((p, i) =>
              <Baloon key={i} role={p.role} className={p.role === 'user' ? 'animation-slideUp' : undefined}>
                { processPrompt(p.text) }
              </Baloon>
            )}
          </div>

          {/* No baloonw yet */}
          {prompts.length === 0 &&
            <span className='flex-1 self-center dark:text-white/40 font-thin'>Converse com a IA</span>}

          {/* Loading baloon */}
          {loading &&
            <Baloon role='ai' className='animation-slideUp'>
              <LoadingDots className='mt-2' size='0.375rem' /*color='rgba(255, 255, 255, 0.85)'*/ />
            </Baloon>}

          {/* Input form */}
          <form onSubmit={handleSubmit} className='flex'>
            <input value={text} onChange={e => setText(e.target.value)} placeholder='Escreva aqui' className="flex-1 bg-transparent dark:text-white text-black h-10 px-3 border-[1px] dark:border-white/60 border-purple-700/60 rounded" /> {/* dark:border-purple-500/90 bg-white/20 */}
            <button type="submit" className='flex justify-center items-center bg-purple-600 w-10 h-10 ml-2 rounded transition hover:opacity-75'>
              <IoSend className='text-white' />
            </button>
          </form>
          
        </div>
      </div>
    </div>
  )
  /*return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );*/
}
