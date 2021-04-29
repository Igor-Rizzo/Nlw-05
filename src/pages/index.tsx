//SPA  --------------------------------------------> EXEMPLO
/**
 * useEffect(() => {
    fetch('http://localhost:3333/episodes')
      .then(response => response.json())
      .then(data => console.log(data))

  },[])
 */
//SSR ---------------------------------------------> EXEMPLO 
/*
export async function getServerSideProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()
  return {
    props: {
      episodes: data,
    }
  }
 
}
 */
//SSG  ---------------------------------------------> EXEMPLO 
/*export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()
  return {
    props: {
      episodes: data,
    },
    revalidate: 60 *60 * 8
}
*/
import Image from 'next/image'
import { GetStaticProps } from 'next'
import { api } from '../Services/api'
import {format, parseISO} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { convertDurationToTimeString } from './../utils/convertDurationToTimeString'
import styles from './home.module.scss'
import Link from 'next/link'

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
  /// ...

}

type HomeProps = {
  latestEpisodes: Episode[]
  allEpisodes: Episode[]
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  objectFit="cover"
                  src={episode.thumbnail}
                  alt={episode.title}
                />

                <div className={styles.episodeDetails}>
                  <Link  href={`/episode/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{ episode.publishedAt }</span>
                  <span>{ episode.durationAsString }</span>
                </div>
                <button type="button">
                  <img src="play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}          
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
            <tbody>
              {allEpisodes.map(episode => {
                return (
                  <tr key={episode.id}>
                    <td style={{width: 72}}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episode/${episode.id}`}>
                        <a >{ episode.title}</a>
                      </Link>
                    </td>
                    <td>{ episode.members }</td>
                    <td style={{width: 100}}>{ episode.publishedAt }</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button">
                        <img src="play-green.svg" alt="Tocar episódio" />
                      </button>
                    </td>
                  </tr>
                )
              })}

            </tbody>
          
        </table>

      </section>
    </div>
  )
}

export  const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,

    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)
  
  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 *60 * 8 //Gerar uma nova requisição na api a cada 8 horas... E o HTML é statico usando getStaticProps. Só funciona em produção
  }
 
}
