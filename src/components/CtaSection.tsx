import { Container } from './Container'

export const CtaSection = () => (
  <Container className="accent-strip">
    <div className="cta-box">
      <div>
        <p className="eyebrow">Ruang yang terus bisa dikembangkan</p>
        <h2>Bisa jadi website perkenalan, album kelas, dan arsip jangka panjang.</h2>
      </div>
      <div>
        <p>
          Tambahkan nama lengkap anggota, kategori event, playlist video, halaman alumni, buku tamu,
          atau pesan kenangan tiap semester.
        </p>
        <a className="primary-button" href="#gallery">
          Mulai isi dokumentasi
        </a>
      </div>
    </div>
  </Container>
)
