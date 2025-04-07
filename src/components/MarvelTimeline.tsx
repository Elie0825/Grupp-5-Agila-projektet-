import React from "react";
import "../css/MarvelTimeline.css";



const MarvelTimeline: React.FC = () => {
  return (
    <div className="marvel-historia">
      <h1>Marvel Cinematic Universe Timeline</h1>
      <header className="marvel-historia-header">
        <img src="" alt="" />
          <p>
            <span>Hej och välkommen till Marvel Historie-sida!</span>
            <span>Här kommer vi förklara hur Marvel kom till och vem som skapade alllt</span>
          </p> {/**denna div har Denise skapat */}
      </header>
      <main className="marvel-historia-content">
        <section> {/**här börjar kevin skapa */}
          <p className="marvel-container">
            <h2>Från färgglada serier till ett globalt filmimperium</h2>
            <h3>
            Superhjältar på papper – Marvels serier och Stan Lees arv
            </h3>
            <span>
            Marvels historia började redan 1939, då som Timely Publications, och utvecklades under 1950-talet till det som i dag är Marvel Comics. Men det stora genombrottet kom under 1960-talet när Stan Lee, tillsammans med legendariska tecknare som Jack Kirby och Steve Ditko, revolutionerade serietidningsvärlden.
            Stan Lee var inte bara författare, utan också en visionär. Han skapade hjältar som Spider-Man, Fantastic Four, Iron Man, Thor, Hulk och X-Men – karaktärer som inte bara hade superkrafter, utan också personliga bekymmer, relationer och djupa identitetskriser. Det gjorde dem mänskliga, trovärdiga och älskade av fans världen över. 
            </span>
            <figure> {/**denna figure har grace lagt till */}
            <img src="./src/Stan Lee 1.svg" alt="Stan Lee logo" />
              <img src="/src/tidning omslag 1.svg" alt="Marvel Tidningsomslag logo" />
            </figure>
            <h3>
            Från serietidningar till bioduken – Marvels första filmsteg
            </h3>
            <span>
            Långt innan Marvel Studios var ett begrepp, licensierade Marvel sina karaktärer till andra filmbolag. Det första riktiga genombrottet på bioduken kom med filmen "Blade" (1998), som visade att superhjältefilmer kunde vara mörka, stilrena – och framgångsrika.
            Kort därefter kom "X-Men" (2000), som etablerade superhjältefilmer som ett populärkulturellt fenomen, följt av "Spider-Man" (2002) i regi av Sam Raimi, som blev en världssuccé. Det var tydligt: Marvels värld hade potential långt bortom seriernas ramar.
            </span>            
            <figure> {/**denna figure har grace lagt till */}
              <img src="/src/blade omslag 1.svg" alt="Blade omslag logo" />
              <img src="/src/Xmen omslag 1.svg" alt="X-Men omslag logo" />
            </figure>
          </p> {/**till hit har Kevin skapat */}
          {/**här börjar Grace */}
            <h3>
            Disney kliver in – en ny era för Marvel
            </h3>
            <span>
              År 2009 förvärvades Marvel Entertainment av The Walt Disney Company för cirka 4 miljarder dollar. Köpet gav Marvel tillgång till Disneys enorma resurser, globala distributionskanaler och kreativa nätverk.
              Det var ett strategiskt steg som stärkte Marvels position inom både film, TV, streaming och merchandise. Med Disney i ryggen kunde Marvel expandera sitt universum ännu mer – med nya karaktärer, serier, teman och diversifierade berättelser.
              Sedan dess har Disney varit med och lanserat nya faser inom MCU, med filmer som "Black Panther", "Doctor Strange", och serier som "WandaVision" och "Loki" på Disney+.
            </span>
            <figure> {/**denna figure har grace lagt till */}
              <img src="/src/Iron man  1.svg" alt="Iron Man logo" />
              <img src="/src/marvel blir del av disney 1.svg" alt="Disney plus Marvel logo" />
            </figure>
            {/**här slutar grace */}
        </section> 
      </main>

      <footer>data hämtad från mcu och omdb api</footer>
    </div>
    
    

  );
};

export default MarvelTimeline;
