import "./globals.css";
import Providers from "../components/Providers";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import MusicPlayer from "../components/MusicPlayer";
import AppVersionCheck from "../components/AppVersionCheck";

export const metadata = {
  title: "Afrifashion",
  description: "African Fashion Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppVersionCheck />
          <Header />
          <div className="topmargin">{children}</div>
          <MusicPlayer />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
