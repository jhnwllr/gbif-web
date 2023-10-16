import Image from 'next/image';
import styles from './header.module.css';

const menuItems = ['Get data', 'How-to', 'Tools', 'Community', 'About']

export const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.headerContentContainer}>
                <div className={styles.left}>                
                    <Image src="/header-logo.svg" alt="GBIF logo" width="30" height="30" />
                    <nav>
                        <ul className={styles.menu}>
                            {menuItems.map((item) => (
                                <li className={styles.menuItem} key={item}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className={styles.right}>
                                right
                </div>
            </div>
        </header>
    )
}