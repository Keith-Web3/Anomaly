import MapWrapper from './components/MapWrapper'
import Providers from './Providers'

export default function Home() {
  return (
    <div className="min-h-screen grid grid-rows-[1fr] grid-cols-[auto_1fr]">
      <Providers>
        <MapWrapper />
      </Providers>
    </div>
  )
}
