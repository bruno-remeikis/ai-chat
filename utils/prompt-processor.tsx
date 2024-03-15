import { CodeBlock } from "@/components/CodeBlock"
import { useTheme } from "@/contexts/Theme"
import React, { useEffect, useState } from "react"

const BoldSpan = ({ children }: { children: string }) => {
  const { theme } = useTheme();
  return (
    <span style={{
      color: theme === 'dark' ? 'rgb(192, 132, 252)' : 'rgb(126, 34, 206)',
      fontWeight: 'bold'
      // fontSize: '1.1rem'
    }}>{ children }</span>
  )
}

/**
 * Converte a resposta textual da IA Gemini para elementos HTML
 * @param text Texto retornado pela IA
 * @returns Lista de elementos HTML
 */
export function processPrompt(text: string): React.JSX.Element[] {
  
  // Realiza um subprocessamento do texto (para identificar outros elementos)
  function process2(text: string): React.JSX.Element[] | string {
    // Identifica textos destacados (negrito)
    if(text.includes('**')) {
      const elements: React.JSX.Element[] = []
      let bold = text.startsWith('**')

      const parts = text.split('**')
      let part
      for(let i = 0; i < parts.length; i++) {
        part = parts[i]
        if(part === '')
          continue

        const r = bold
          ? <BoldSpan key={i}>{ part }</BoldSpan>
          : <>{ part }</>

        bold = !bold
        elements.push(r)
      }
      return elements
    }
    // Se não cair em nenhum dos casos acima, retorna o texto puro
    return text
  }

  let progLang: string | null = null
  let codeText: string = ''

  let elements: React.JSX.Element[] = []

  const lines = text.split('\n')
  let line
  for(let i = 0; i < lines.length; i++)
  {
    line = lines[i]

    // Identifica início/fim de bloco de código
    if(line.startsWith('```')) {
      // Identifica fim
      if(progLang) {
        const codeBlock = <CodeBlock key={i} text={codeText} lang={progLang} />
        progLang = null
        codeText = ''
        elements.push(codeBlock)
        continue
      }
      // Identifica início
      else {
        progLang = line.substring(3)
        continue
      }
    }

    // Caso esteja no meio do processamento de um bloco de código, apenas guarda a linha
    if(progLang) {
      codeText += line + '\n'
      continue
    }

    // Identifica listas
    if(line.startsWith('* ')) {
      const li = <li key={i}>{ process2(line.substring(2)) }</li>
      elements.push(li)
      continue
    }

    // Se não cair em nenhum dos casos acima, coloca o texto em um parágrafo simples
    const p = <p key={i} className='mb-3 last:mb-0'>{ process2(line) }</p>
    elements.push(p)
  }

  return elements
}