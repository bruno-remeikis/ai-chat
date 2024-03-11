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
        let bold = text.startsWith('**')
        return text.split('**').map((t, i) => {
          bold = !bold
          return bold ? <span key={i} className='font-bold text-purple-500'>{ t }</span> : <>{ t }</>
        })
      }
      // Se não cair em nenhum dos casos acima, retorna o texto puro
      return text
    }

    // Quebra o texto em linhas
    return text.split('\n').map((line, i) => {
      // Identifica listas
      if(line.startsWith('* '))
        return <li key={i}>{process2(line.substring(2))}</li>
      // Se não cair em nenhum dos casos acima, coloca o texto em um parágrafo simples
      return <p key={i} className='mb-3 last:mb-0'>{ process2(line) }</p>
    })
  }