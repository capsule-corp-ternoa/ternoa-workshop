import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import SideMenu from './SideMenu'
import Hamburger from 'assets/svg/Components/Hamburger'
import styles from './MobileHeader.module.scss'
import { ILinks } from '../interfaces'

interface MobileHeaderProps {
  projectName: string
  ternoaLogo: React.ReactNode
  links?: ILinks[]
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ projectName, ternoaLogo, links }) => {
  const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)
  const [navBackground, setNavBackground] = useState<any>('')
  const navRef = useRef()
  navRef.current = navBackground

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 30
      if (show) {
        setNavBackground('headerScrolled')
      } else {
        setNavBackground('')
      }
    }
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <nav className={`wrapper ${styles.nav} ${styles[navBackground]}`}>
        <Link href="/">
          <a className={styles.logo} title={projectName}>
            {ternoaLogo}
            <div className={styles.logoTitle}>{projectName}</div>
          </a>
        </Link>
        <button onClick={() => setIsMenuExpanded(!isMenuExpanded)} title="Open menu">
          <Hamburger className={styles.button} />
        </button>
      </nav>

      <SideMenu ternoaLogo={ternoaLogo} projectName={projectName} isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} links={links} />
    </>
  )
}

export default MobileHeader
