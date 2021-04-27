
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';

import Slider from 'rc-slider';

import styles from './styles.module.scss';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player(){

    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const { episodeList, currentEpisodeIndex, isPlaying, tooglePlay, setPlayingState, playNext, playPrevious, hasNext, hasPrevious, isLooping, toogleLoop, isShuffling, toogleShuffle, clearPlayerState } = usePlayer(); //PEGAR VARIAVEL DO CONTEXTO PLAYER

    // TODA VEZ QUE O isPlaying MUDAR, ALGO ACONTECERÁ
    useEffect(() => {
        // SE NÃO HOUVER REFERENCIA
        if(!audioRef.current){
            return;
        }
        // SE isPlaying FOR TRUE
        if(isPlaying){
            audioRef.current.play();
        }else{
            audioRef.current.pause();
        }
    }, [isPlaying])

    // OUVIR O PROGRESSO DO AUDIO
    function setupProgressListener(){
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime)); //PEGAR TEMPO ATUAL DO PLAYER
        })
    }   

    // FUNÇÃO PARA ALTERAR O PROGRESSO DO AUDIO
    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount)
    }

    // AO FINALIZAR O AUDIO
    function handleEpisodeEnded(){
        if(hasNext){
            playNext();
        }else{
            clearPlayerState();
        }
    }

    const episode = episodeList[currentEpisodeIndex];

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>
            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }

            <footer className={!episode ? styles.empty: ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress ?? 0)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            // episode.duration retorna o numero de segundos do episódio
                            //value é o progresso que o episódio já progrediu
                            <Slider max={episode.duration} onChange={handleSeek} value={progress} trackStyle={{ backgroundColor: '#04d361' }} railStyle={{ backgroundColor: '#9f75ff' }}  handleStyle={{borderColor: '#04d361', borderWidth: '4px' }} />
                        ): (
                            <div className={styles.emptySlider}></div>
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>
                {/* AUDIO */}
                { episode && (
                    <audio onEnded={handleEpisodeEnded} onLoadedMetadata={setupProgressListener} loop={isLooping} ref={audioRef} src={episode.url} autoPlay onPlay={() => setPlayingState(true)} onPause={() => setPlayingState(false)}></audio>
                ) }
                {/* BOTÕES */}
                <div className={styles.buttons}>
                    <button type="button" disabled={!episode || episodeList.length == 1} onClick={toogleShuffle} className={isShuffling ? styles.isActive : ''}>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" disabled={!hasPrevious || !episode} onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button type="button" onClick={tooglePlay} className={styles.playButton} disabled={!episode}>
                        { isPlaying ? (
                            <img src="/pause.svg" alt="Pause"/>
                            ) : (
                            <img src="/play.svg" alt="Tocar"/>
                        ) }
                    </button>
                    <button type="button" disabled={!hasNext || !episode} onClick={playNext}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    <button type="button" disabled={!episode} onClick={toogleLoop} className={isLooping ? styles.isActive : ''}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}

