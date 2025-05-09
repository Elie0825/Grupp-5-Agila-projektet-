import React from "react";
import "../css/MarvelTimeline.css";

const MarvelTimeline: React.FC = () => {
  return (
    <div className="mt-container">
      <header className="mt-header">
        <img src="/media/hero-header.svg" alt="Hero header" />
        <div className="mt-header__text">
          <h1>MARVELS HISTORIA</h1>
          <p>Från färgglada serier till ett globalt filmimperium</p>
        </div>
      </header>

      <main className="mt-content">
        <section className="mt-history-section">
          <h3>Superhjältar på papper – Marvels serier och Stan Lees arv</h3>
          <p>
            Marvels historia började redan 1939, då som Timely Publications, och utvecklades under 1950-talet till det som i dag är Marvel Comics. Men det stora genombrottet kom under 1960-talet när Stan Lee, tillsammans med legendariska tecknare som Jack Kirby och Steve Ditko, revolutionerade serietidningsvärlden.
          </p>
          <p>
            Stan Lee var inte bara författare, utan också en visionär. Han skapade hjältar som Spider-Man, Fantastic Four, Iron Man, Thor, Hulk och X-Men – karaktärer som inte bara hade superkrafter, utan också personliga bekymmer, relationer och djupa identitetskriser. Det gjorde dem mänskliga, trovärdiga och älskade av fans världen över.
          </p>

          <figure className="mt-figure">
            <img src="/media/stan-lee.svg" alt="Stan Lee logo" />
            <img src="/media/tidning-omslag.svg" alt="tidning omslag" />
          </figure>

          <h3>Från serietidningar till bioduken – Marvels första filmsteg</h3>
          <p>
            Långt innan Marvel Studios var ett begrepp, licensierade Marvel sina karaktärer till andra filmbolag. Det första riktiga genombrottet på bioduken kom med filmen "Blade" (1998), som visade att superhjältefilmer kunde vara mörka, stilrena – och framgångsrika.
          </p>
          <p>
            Kort därefter kom "X-Men" (2000), som etablerade superhjältefilmer som ett populärkulturellt fenomen, följt av "Spider-Man" (2002) i regi av Sam Raimi, som blev en världssuccé. Det var tydligt: Marvels värld hade potential långt bortom seriernas ramar.
          </p>

          <figure className="mt-figure">
            <img src="/media/blade-omslag.svg" alt="Blade omslag logo" />
            <img src="/media/x-men-omslag 1.svg" alt="X-Men omslag logo" />
          </figure>
          
          <h3>Marvel Studios – födelsen av ett filmiskt universum</h3>

          <p>Även om Marvel Studios grundades redan 1996, dröjde det till 2008 innan de lanserade sin första egenproducerade film: "Iron Man", med Robert Downey Jr. i huvudrollen.</p>
          <p>Filmen blev inte bara en succé – den lade grunden för det som kom att kallas Marvel Cinematic Universe (MCU).</p> 
          <p>Idén var banbrytande: varje film skulle vara en del av ett större narrativt pussel.</p>
          <p>Hjältarna skulle kunna mötas, påverka varandras världar och bygga upp mot större händelser – något som kulminerade i filmer som "The Avengers" (2012).</p>
          <p>MCU blev snabbt ett av världens mest framgångsrika och älskade filmprojekt.</p>

          <figure className="landscape-container">
            <img src="/media/iron-man.svg" alt="Iron Man logo" className="iron" /> 
          </figure>

          <h4>Disney kliver in – en ny era för Marvel</h4>
          
          <p>
            År 2009 förvärvades Marvel Entertainment av The Walt Disney Company för cirka 4 miljarder dollar. Köpet gav Marvel tillgång till Disneys enorma resurser, globala distributionskanaler och kreativa nätverk.
          </p>
          <p>
            Det var ett strategiskt steg som stärkte Marvels position inom både film, TV, streaming och merchandise. Med Disney i ryggen kunde Marvel expandera sitt universum ännu mer – med nya karaktärer, serier, teman och diversifierade berättelser.
          </p>
          <p>
            Sedan dess har Disney varit med och lanserat nya faser inom MCU, med filmer som "Black Panther", "Doctor Strange", och serier som "WandaVision" och "Loki" på Disney+.
          </p>

          <figure className="landscape-container">
            <img src="/media/marvel-and-disney.svg" alt="Disney plus Marvel logo" className="Marvel-logo-bild" />
          </figure>
        </section>
      </main>

      <footer className="mt-footer">Data från MCU, OMDb & Superhero API.
          © 2025 Marvelous Ratings.
          Marvelous Ratings är ett fanprojekt och är inte associerat med Marvel eller Disney.
      </footer>
    </div>
  );
};

export default MarvelTimeline;