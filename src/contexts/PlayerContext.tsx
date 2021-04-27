import { createContext, ReactNode, useContext, useState } from 'react';

// TIPAGEM
type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    tooglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    toogleLoop: () => void;
    toogleShuffle: () => void;
    clearPlayerState: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode; //ESSA PROPRIEDADE REACTNODE USAMOS QUANDO O DADO PODE SER QUALQUER COISA
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps){

    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode){
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number){
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function toogleLoop(){
        setIsLooping(!isLooping);
    }

    function toogleShuffle(){
        setIsShuffling(!isShuffling);
    }
    
    function tooglePlay(){
        setIsPlaying(!isPlaying);
    }

    function setPlayingState(state: boolean){
        setIsPlaying(state);
    }

    // VARIFICAR SE O INDEX DO PRÓXIMO EPISÓDIO FOR MAIOR QUE O NÚMERO DE ITENS DA LISTAGEM // SE NÃO EXISTIR
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
    // VARIFICAR SE O INDEX DO PRÓXIMO EPISÓDIO FOR MAIOR QUE O NÚMERO DE ITENS DA LISTAGEM // SE NÃO EXISTIR
    const hasPrevious = currentEpisodeIndex > 0;

    function playNext(){
        // VERIFICAR SE É PARA EMBARALHAR
        if(isShuffling){ 
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        }else if(hasNext){
            // VAI PEGAR O EPISÓDIO QUE ESTÁ TOCANDO NO MOMENTO E ACRESCENTAR MAIS UM
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }else{
            return;
        }
    }

    function playPrevious(){
        if(hasPrevious){
            // VAI PEGAR O EPISÓDIO QUE ESTÁ TOCANDO NO MOMENTO E ACRESCENTAR MAIS UM
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }else{
            return;
        }
    }

    // LIMPAR PLAYER
    function clearPlayerState(){
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }
    
    return (
        <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, tooglePlay, setPlayingState, playList, playNext, playPrevious, hasNext, hasPrevious, isLooping, toogleLoop, toogleShuffle, isShuffling, clearPlayerState }}>
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}