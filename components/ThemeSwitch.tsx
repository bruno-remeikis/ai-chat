import { Theme, useTheme } from '@/contexts/Theme'
import { Switch } from '@headlessui/react'
import { SunIcon } from '@heroicons/react/24/solid'
import { useEffect } from 'react'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export const ThemeSwitch = () =>
{
    const rlsTheme = useReadLocalStorage<Theme>('theme')

    const { theme, setTheme } = useTheme()
    const [ lsTheme, setLsTheme ] = useLocalStorage('theme', 'light')
    const enabled = theme === 'light'
        
    useEffect(() => {
        document.body.classList.remove('light', 'dark')
        document.body.classList.add(lsTheme)
    }, [lsTheme])

    const handleThemeChange = (enabled: boolean) => {
        setLsTheme(enabled ? 'light' : 'dark')
        setTheme(enabled ? 'light' : 'dark')
    }

    return (
        <Switch
            checked={enabled}
            onChange={handleThemeChange}
            className={classNames(
                enabled ? 'bg-gray-400' : 'bg-yellow-600',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out'
            )}
        >
            <span className='sr-only'>Use setting</span>
            <span
                className={classNames(
                    enabled ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
            >
                <span
                    className={classNames(
                        enabled
                            ? 'opacity-0 duration-100 ease-out'
                            : 'opacity-100 duration-200 ease-in',
                        'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                    )}
                    aria-hidden='true'
                >
                    <SunIcon className='h-3 w-3 text-gray-400' />
                </span>
                <span
                    className={classNames(
                        enabled
                            ? 'opacity-100 duration-200 ease-in'
                            : 'opacity-0 duration-100 ease-out',
                        'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                    )}
                    aria-hidden='true'
                >
                    <SunIcon className='h-3 w-3 text-yellow-600' />
                </span>
            </span>
        </Switch>
    )
}