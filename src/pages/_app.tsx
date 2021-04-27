import '../styles/global.scss';

import styles from '../styles/app.module.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';
import { PlayerContextProvider } from '../contexts/PlayerContext';

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <div className="content">
            <Header />
            <Component {...pageProps} />
          </div>
        </main>
        <div className={styles.player}>
          <Player />
        </div>
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
