import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark, atomDark, base16AteliersulphurpoolLight, cb, coldarkCold, coldarkDark, coy, darcula, dark, dracula, duotoneDark, duotoneEarth, duotoneForest, duotoneLight, duotoneSea,
  duotoneSpace, funky, ghcolors, gruvboxDark, gruvboxLight, hopscotch, materialDark, materialLight,
  materialOceanic, nord, okaidia, oneDark, oneLight, pojoaque, prism, shadesOfPurple, solarizedlight,
  synthwave84, tomorrow, twilight, vs, vscDarkPlus, xonokai
} from 'react-syntax-highlighter/dist/esm/styles/prism'

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
          return bold ? <span key={i} className='font-bold' style={{ color: 'rgb(168, 85, 247)' }}>{ t }</span> : <>{ t }</>
        })
      }
      // Se não cair em nenhum dos casos acima, retorna o texto puro
      return text
    }

    let progLang: string | null = null
    let codeText: string = ''

    // Quebra o texto em linhas
    return text.split('\n').map((line, i) =>
    {
      // Identifica início/fim de bloco de código
      if(line.startsWith('```')) {
        // Identifica fim
        if(progLang) {
          // DARK: coldarkDark
          // LIGHT: oneLight
          const darkTheme = document.body.classList.contains('dark')
          const codeBlock =
            <SyntaxHighlighter
              key={i}
              language={progLang}
              style={darkTheme ? coldarkDark : oneLight}
              customStyle={{
                borderLeft: `4px solid ${darkTheme ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}`,
                borderRadius: '0.3rem',
                backgroundColor: darkTheme ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
              }}
              showLineNumbers

              wrapLines
              wrapLongLines
              lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
            >
              { codeText }
            </SyntaxHighlighter>
            
          progLang = null
          codeText = ''
          return codeBlock
        }
        // Identifica início
        else {
          progLang = line.substring(3)
          return <></>
        }
      }

      // Caso esteja no meio do processamento de um bloco de código, apenas guarda a linha
      if(progLang) {
        codeText += line + '\n'
        return <></>
      }

      // Identifica listas
      if(line.startsWith('* '))
        return <li key={i}>{process2(line.substring(2))}</li>

      // Se não cair em nenhum dos casos acima, coloca o texto em um parágrafo simples
      return <p key={i} className='mb-3 last:mb-0'>{ process2(line) }</p>
    })
  }