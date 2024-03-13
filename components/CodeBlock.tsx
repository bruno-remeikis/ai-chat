import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from "@/contexts/Theme";

type CodeBlockProps = {
    text: string;
    lang: string;
}

export const CodeBlock = ({ text, lang }: CodeBlockProps) =>
{
    const { theme } = useTheme()

    return (
        <SyntaxHighlighter
            language={lang}
            style={theme === 'dark' ? coldarkDark : oneLight}
            customStyle={{
                borderLeft: `4px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}`,
                borderRadius: '0.3rem',
                backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
            }}
            showLineNumbers

            wrapLines
            wrapLongLines
            lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
            >
            { text }
        </SyntaxHighlighter>
    )
}