
import { useState } from 'react'
import { AboutSection } from './components/AboutSection'
import { AdminPanel } from './components/AdminPanel'
import { Footer } from './components/Footer'
import { GallerySection } from './components/GallerySection'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { TimelineSection } from './components/TimelineSection'
import { usePersistentContent } from './hooks/usePersistentContent'

function App() {
  const [adminOpen, setAdminOpen] = useState(false)
  const { content, actions } = usePersistentContent()

  return (
    <>
      <Header onOpenAdmin={() => setAdminOpen(true)} />
      <main>
        <HeroSection content={content} />
        <AboutSection content={content} />
        <TimelineSection content={content} />
        <GallerySection content={content} />
      </main>
      <Footer
        email={content.contactEmail}
        mainDriveUrl={content.driveFolderUrl}
        photoDriveUrl={content.photoFolderUrl}
        videoDriveUrl={content.videoFolderUrl}
        instagramUrl={content.instagramUrl}
        tiktokUrl={content.tiktokUrl}
        title={content.footerTitle}
        description={content.footerDescription}
      />
      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        content={content}
        onSave={actions.update}
        onReset={actions.reset}
      />
    </>
  )
}

export default App
