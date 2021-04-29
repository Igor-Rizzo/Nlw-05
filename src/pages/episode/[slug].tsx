import { GetStaticPaths, GetStaticProps } from "next"
import { api } from "../../Services/api"
import {useRouter} from 'next/router' 
import { format, parseISO } from "date-fns"
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString"

type Episode = {
    id: string,
    title: string,
    thumbnail: string,
    description: string,
    members: string,
    duration: number,
    durationAsString: string,
    url: string,
    publishedAt: string  
}
type EpisodeProps = {
    episode: Episode
}


export default function Episode({episode}: EpisodeProps) {
    const router = useRouter()
    return (
        <h1>{episode.title}</h1>
        
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params
    
    const { data } = await api.get(`/episode/${slug}`)

    const episode = {
            id: data.id,
            title: data.title,
            thumbnail: data.thumbnail,
            members: data.members,
            publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
            duration: Number(data.file.duration),
            durationAsString: convertDurationToTimeString(Number(data.file.duration)),
            description: data.description,
            url: data.file.url,
    }

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24, 
    }
}