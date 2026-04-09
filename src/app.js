const html = htm.bind(React.createElement);
window.html = html;

const siteContent = window.siteContent;

function getRouteParts() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  const normalized = hash.startsWith("/") ? hash : `/${hash}`;
  return normalized.split("/").filter(Boolean);
}

function useHashRoute() {
  const [parts, setParts] = React.useState(() => getRouteParts());

  React.useEffect(() => {
    const handleChange = () => setParts(getRouteParts());
    window.addEventListener("hashchange", handleChange);
    return () => window.removeEventListener("hashchange", handleChange);
  }, []);

  const navigate = (path) => {
    window.location.hash = path.startsWith("/") ? path : `/${path}`;
  };

  return {
    parts,
    pathname: `/${parts.join("/")}`.replace(/\/+$/, "") || "/",
    navigate,
  };
}

function useThemeMode() {
  const [theme, setTheme] = React.useState(() => {
    return window.localStorage.getItem("mj-theme") || "light";
  });

  React.useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem("mj-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}

function useLoveClock(startDateString) {
  const startDate = new Date(startDateString);
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const diffMs = Math.max(now - startDate, 0);
  let diff = Math.floor(diffMs / 1000);
  const seconds = diff % 60;
  diff = Math.floor(diff / 60);
  const minutes = diff % 60;
  diff = Math.floor(diff / 60);
  const hours = diff % 24;
  diff = Math.floor(diff / 24);
  const days = diff % 30;
  diff = Math.floor(diff / 30);
  const months = diff % 12;
  const years = Math.floor(diff / 12);

  return { years, months, days, hours, minutes, seconds };
}

function useMemorySearch(memories) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const value = query.toLowerCase().trim();
    if (!value) {
      return memories;
    }

    return memories.filter((memory) => {
      const haystack = [
        memory.title,
        memory.summary,
        ...(memory.tags || []),
        ...(memory.body || []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(value);
    });
  }, [memories, query]);

  return { query, setQuery, filtered };
}

function NavPill({ label, route, pathname }) {
  const active = pathname === route;
  return html`
    <a href=${`#${route}`} className=${`nav-pill ${active ? "active" : ""}`}>
      ${label}
    </a>
  `;
}

function AppShell({ children, pathname, navigate, theme, toggleTheme }) {
  return html`
    <div className="app-shell">
      <div className="background-orb orb-1"></div>
      <div className="background-orb orb-2"></div>
      <div className="background-orb orb-3"></div>

      <header className="topbar">
        <button className="brand-button" onClick=${() => navigate("/")}>
          <span className="brand-mark">MJ</span>
          <span>
            <strong>${siteContent.brand}</strong>
            <small>Una historia para volver a sentir</small>
          </span>
        </button>

        <nav className="floating-nav" aria-label="Secciones principales">
          ${siteContent.sections.slice(0, 6).map(
            (section) => html`
              <${NavPill}
                key=${section.route}
                label=${section.title}
                route=${section.route}
                pathname=${pathname}
              />
            `,
          )}
        </nav>

        <button className="theme-toggle" onClick=${toggleTheme}>
          ${theme === "light" ? "Modo oscuro" : "Modo claro"}
        </button>
      </header>

      <main className=${pathname === "/" ? "page page-home" : "page"}>
        ${children}
      </main>
    </div>
  `;
}

function HomePage() {
  return html`
    <section className="hero-panel">
      <div className="hero-copy">
        <p className="eyebrow">Maria & Juanjo</p>
        <h1>${siteContent.homeTitle}</h1>
        <p className="hero-text">${siteContent.homeSubtitle}</p>
        <p className="hero-quote">"${siteContent.introQuote}"</p>
        <div className="hero-actions">
          <a className="button-primary" href="#/recuerdos">Entrar al album</a>
          <a className="button-secondary" href="#/tiempo">Ver contador</a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="portrait-stack">
          <img src="./assets/imgs/maria.jpeg" alt="Maria Isabel" />
          <img src="./assets/imgs/juan.jpeg" alt="Juanjo" />
        </div>
      </div>
    </section>

    <section className="section-intro">
      <div className="section-heading">
        <p className="eyebrow">Explorar</p>
        <h2>Exploren cada rincón de su historia</h2>
      </div>
      <div className="route-grid">
        ${siteContent.sections.map(
          (section) => html`
            <a
              key=${section.route}
              href=${`#${section.route}`}
              className=${`route-card route-${section.accent}`}
            >
              <span className="route-kicker">Seccion</span>
              <h3>${section.title}</h3>
              <p>${section.description}</p>
              <span className="route-arrow">Abrir</span>
            </a>
          `,
        )}
      </div>
    </section>
  `;
}

function InstruccionesPage() {
  return html`
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Instrucciones</p>
        <h1>Como usar este lugar</h1>
        <p>
          Esta pagina existe para guardar recuerdos de ustedes. No funciona como red social ni necesita base de datos para seguir creciendo.
        </p>
      </div>

      <div className="timeline">
        <article className="timeline-item">
          <span className="timeline-date">Paso 1</span>
          <h2>Leer los recuerdos</h2>
          <p>
            En la seccion de recuerdos aparecen las tarjetas con cada momento. Al entrar en una, se abre su pagina con fotos, texto y detalles.
          </p>
        </article>
        <article className="timeline-item">
          <span className="timeline-date">Paso 2</span>
          <h2>Anadir un recuerdo</h2>
          <p>
            Maria Isabel puede escribir un recuerdo desde el formulario. Luego tu lo agregas a la pagina cuando quieras actualizar el proyecto.
          </p>
        </article>
        <article className="timeline-item">
          <span className="timeline-date">Paso 3</span>
          <h2>Cuidar lo importante</h2>
          <p>
            No hay momentos pequenos. Si fue bonito para ustedes, merece quedar guardado aqui.
          </p>
        </article>
      </div>

      <div className="hero-actions">
        <a className="button-primary" href="#/anadir-recuerdo">Ir al formulario</a>
        <a className="button-secondary" href="#/recuerdos">Ver recuerdos</a>
      </div>
    </section>
  `;
}

function AddMemoryPage() {
  return html`
    <section className="section-block centered">
      <div className="section-heading">
        <p className="eyebrow">Anadir recuerdo</p>
        <h1>Este espacio es para seguir llenando su historia</h1>
        <p>
          Si Maria quiere agregar un nuevo recuerdo, puede hacerlo desde el formulario. La idea es que escriba el momento y luego tu lo subes a la pagina.
        </p>
      </div>

      <article className="letter-card">
        <p className="letter-preview">No tiene que ser perfecto.</p>
        <p>Si fue importante para ustedes, tambien merece quedar guardado.</p>
      </article>

      <div className="hero-actions">
        <a
          className="button-primary"
          href=${siteContent.memoryFormUrl}
          target="_blank"
          rel="noreferrer"
        >
          Abrir formulario
        </a>
        <a className="button-secondary" href="#/instrucciones">Ver instrucciones</a>
      </div>
    </section>
  `;
}

function NosotrosPage() {
  return html`
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Nosotros</p>
        <h1>Dos formas de querer bien dentro de una misma historia</h1>
      </div>

      <div className="profile-grid">
        ${siteContent.people.map(
          (person) => html`
            <article key=${person.name} className="profile-card">
              <img src=${person.image} alt=${person.name} />
              <div className="profile-content">
                <p className="profile-label">${person.nickname}</p>
                <h2>${person.name}</h2>
                <p>${person.summary}</p>
                <ul className="trait-list">
                  ${person.traits.map((trait, index) => html`<li key=${index}>${trait}</li>`)}
                </ul>
                <div className="detail-capsules">
                  <span>Color favorito: ${person.placeholders.color}</span>
                  <span>Sueno: ${person.placeholders.dream}</span>
                  <span>Le gusta: ${person.placeholders.favoriteThing}</span>
                </div>
              </div>
            </article>
          `,
        )}
      </div>
    </section>

    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Compania</p>
        <h2>Tambien hay hogar en las pequenas presencias</h2>
      </div>
      <div className="pet-grid">
        ${siteContent.pets.map(
          (pet) => html`
            <article key=${pet.name} className="pet-card">
              <img src=${pet.image} alt=${pet.name} />
              <h3>${pet.name}</h3>
              <p>${pet.description}</p>
            </article>
          `,
        )}
      </div>
    </section>
  `;
}

function TiempoPage() {
  const clock = useLoveClock(siteContent.relationshipStart);

  return html`
    <section className="section-block centered">
      <div className="section-heading">
        <p className="eyebrow">Tiempo juntos</p>
        <h1>Desde el ${siteContent.relationshipLabel}</h1>
        <p>Un contador que no busca ser frio, sino recordar que el tiempo tambien puede verse bonito.</p>
      </div>

      <div className="counter-grid">
        ${Object.entries(clock).map(
          ([unit, value]) => html`
            <div key=${unit} className="time-card">
              <span>${value}</span>
              <small>${translateUnit(unit)}</small>
            </div>
          `,
        )}
      </div>
    </section>
  `;
}

function RecuerdosPage() {
  const { query, setQuery, filtered } = useMemorySearch(siteContent.memories);

  return html`
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Recuerdos</p>
        <h1>Momentos guardados para volver cuando quieran</h1>
        <p>Un lugar para volver a esos planes, viajes y dias que merecen quedarse guardados.</p>
      </div>

      <div className="search-panel">
        <input
          type="search"
          value=${query}
          onInput=${(event) => setQuery(event.target.value)}
          placeholder="Buscar por titulo, lugar, tipo de plan o palabra..."
          aria-label="Buscar recuerdos"
        />
      </div>

      <div className="memory-grid">
        ${filtered.map(
          (memory) => html`
            <a key=${memory.slug} href=${`#/recuerdos/${memory.slug}`} className="memory-card">
              <div className="memory-card-body">
                <p className="memory-date">${memory.displayDate}</p>
                <h2>${memory.title}</h2>
                <p>${memory.summary}</p>
                <div className="tag-row">
                  ${memory.tags.map((tag) => html`<span key=${tag}>${tag}</span>`)}
                </div>
              </div>
            </a>
          `,
        )}
      </div>

      ${filtered.length === 0
        ? html`<p className="empty-state">No se encontro ningun recuerdo con ese filtro.</p>`
        : null}

      <div className="hero-actions">
        <a className="button-primary" href="#/anadir-recuerdo">Anadir un recuerdo</a>
        <a className="button-secondary" href="#/instrucciones">Como funciona</a>
      </div>
    </section>
  `;
}

function MemoryDetailPage({ slug, navigate }) {
  const memory = siteContent.memories.find((item) => item.slug === slug);

  if (!memory) {
    return html`
      <section className="section-block centered">
        <h1>Ese recuerdo aun no existe</h1>
        <button className="button-primary" onClick=${() => navigate("/recuerdos")}>
          Volver a recuerdos
        </button>
      </section>
    `;
  }

  return html`
    <section className="section-block">
      <button className="back-link" onClick=${() => navigate("/recuerdos")}>
        Volver al album
      </button>

      <div className="memory-hero">
        <img src=${memory.cover} alt=${memory.title} />
        <div className="memory-hero-copy">
          <p className="eyebrow">${memory.displayDate}</p>
          <h1>${memory.title}</h1>
          <p>${memory.summary}</p>
          <div className="tag-row">
            ${memory.tags.map((tag) => html`<span key=${tag}>${tag}</span>`)}
          </div>
        </div>
      </div>

      <div className="memory-story">
        ${memory.body.map((paragraph, index) => html`<p key=${index}>${paragraph}</p>`)}
      </div>

      <div className="memory-gallery">
        ${memory.images.map(
          (image, index) => html`<img key=${image} src=${image} alt=${`${memory.title} ${index + 1}`} />`,
        )}
      </div>
    </section>
  `;
}

function LugaresPage() {
  return html`
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Lugares</p>
        <h1>Todo lo que ya habitaron juntos y lo que aun falta por descubrir</h1>
      </div>

      <div className="stats-row">
        <article className="stat-card">
          <strong>${siteContent.places.visited.length}</strong>
          <span>Lugares visitados</span>
        </article>
        <article className="stat-card">
          <strong>${siteContent.places.wishlist.length}</strong>
          <span>Destinos por ir</span>
        </article>
      </div>

      <div className="places-layout">
        <div className="place-panel">
          <h2>Ya conocidos</h2>
          <div className="capsule-grid">
            ${siteContent.places.visited.map(
              (place) => html`<span key=${place} className="capsule visited">${place}</span>`,
            )}
          </div>
        </div>
        <div className="place-panel">
          <h2>En la mira</h2>
          <div className="capsule-grid">
            ${siteContent.places.wishlist.map(
              (place) => html`<span key=${place} className="capsule">${place}</span>`,
            )}
          </div>
        </div>
      </div>
    </section>
  `;
}

function TimelinePage() {
  return html`
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Timeline</p>
        <h1>La historia vista como una secuencia de momentos</h1>
      </div>

      <div className="timeline">
        ${siteContent.timeline.map(
          (item) => html`
            <article key=${item.title} className="timeline-item">
              <span className="timeline-date">${item.date}</span>
              <h2>${item.title}</h2>
              <p>${item.text}</p>
            </article>
          `,
        )}
      </div>
    </section>
  `;
}

function CartasPage() {
  const [openIndex, setOpenIndex] = React.useState(0);

  return html`
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Cartas</p>
        <h1>Una seccion mas intima, pensada para sentir sin prisa</h1>
        <p>Aqui podemos dejar mensajes de tono privado o delicado. Luego, si quieres, lo convertimos en una zona con clave ligera.</p>
      </div>

      <div className="letters-grid">
        ${siteContent.letters.map(
          (letter, index) => html`
            <button
              key=${letter.title}
              className=${`letter-tab ${openIndex === index ? "active" : ""}`}
              onClick=${() => setOpenIndex(index)}
            >
              ${letter.title}
            </button>
          `,
        )}
      </div>

      <article className="letter-card">
        <p className="letter-preview">${siteContent.letters[openIndex].preview}</p>
        <p>${siteContent.letters[openIndex].body}</p>
      </article>
    </section>
  `;
}

function PlaylistPage() {
  return html`
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Playlist</p>
        <h1>Canciones que pueden enviarlos directo a una memoria</h1>
        <p>Aqui pueden ir sumando canciones especiales y abrirlas directo en Spotify.</p>
      </div>

      <div className="playlist-grid">
        ${siteContent.playlist.map(
          (song) => html`
            <a
              key=${song.title}
              className="playlist-card"
              href=${song.spotifyUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span className="playlist-chip">Spotify</span>
              <h2>${song.title}</h2>
              <p className="memory-date">${song.artist || "Artista"}</p>
              <p>${song.note}</p>
              <span className="playlist-link">Abrir enlace</span>
            </a>
          `,
        )}
      </div>

      <div className="hero-actions">
        <a
          className="button-primary"
          href=${siteContent.songFormUrl}
          target="_blank"
          rel="noreferrer"
        >
          Anadir cancion
        </a>
      </div>
    </section>
  `;
}

function SuenosPage() {
  return html`
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Suenos</p>
        <h1>Todo lo que esta bonito incluso antes de suceder</h1>
      </div>

      <div className="dream-grid">
        ${siteContent.dreams.map(
          (dream) => html`
            <article key=${dream} className="dream-card">
              <p>${dream}</p>
            </article>
          `,
        )}
      </div>

      <div className="hero-actions">
        <a
          className="button-primary"
          href=${siteContent.dreamFormUrl}
          target="_blank"
          rel="noreferrer"
        >
          Anadir sueno
        </a>
      </div>
    </section>
  `;
}

function FrasesPage() {
  return html`
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Frases</p>
        <h1>Pequenas lineas que resumen una energia completa</h1>
      </div>

      <div className="quote-grid">
        ${siteContent.quotes.map(
          (quote) => html`
            <blockquote key=${quote} className="quote-card">
              <p>${quote}</p>
            </blockquote>
          `,
        )}
      </div>
    </section>
  `;
}

function ProximamentePage() {
  return html`
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Proximamente</p>
        <h1>Ideas listas para seguir creciendo</h1>
      </div>

      <div className="upcoming-list">
        ${siteContent.upcoming.map(
          (item) => html`
            <article key=${item} className="upcoming-card">
              <p>${item}</p>
            </article>
          `,
        )}
      </div>
    </section>
  `;
}

function translateUnit(unit) {
  const labels = {
    years: "Anos",
    months: "Meses",
    days: "Dias",
    hours: "Horas",
    minutes: "Minutos",
    seconds: "Segundos",
  };

  return labels[unit] || unit;
}

function renderPage(pathname, parts, navigate) {
  if (pathname === "/") {
    return html`<${HomePage} />`;
  }
  if (pathname === "/instrucciones") {
    return html`<${InstruccionesPage} />`;
  }
  if (pathname === "/anadir-recuerdo") {
    return html`<${AddMemoryPage} />`;
  }
  if (pathname === "/nosotros") {
    return html`<${NosotrosPage} />`;
  }
  if (pathname === "/tiempo") {
    return html`<${TiempoPage} />`;
  }
  if (pathname === "/recuerdos") {
    return html`<${RecuerdosPage} />`;
  }
  if (parts[0] === "recuerdos" && parts[1]) {
    return html`<${MemoryDetailPage} slug=${parts[1]} navigate=${navigate} />`;
  }
  if (pathname === "/lugares") {
    return html`<${LugaresPage} />`;
  }
  if (pathname === "/timeline") {
    return html`<${TimelinePage} />`;
  }
  if (pathname === "/cartas") {
    return html`<${CartasPage} />`;
  }
  if (pathname === "/playlist") {
    return html`<${PlaylistPage} />`;
  }
  if (pathname === "/suenos") {
    return html`<${SuenosPage} />`;
  }
  if (pathname === "/frases") {
    return html`<${FrasesPage} />`;
  }
  if (pathname === "/proximamente") {
    return html`<${ProximamentePage} />`;
  }

  return html`
    <section className="section-block centered">
      <h1>Esta seccion aun no existe</h1>
      <p>Podemos crearla cuando quieras.</p>
      <a className="button-primary" href="#/">Volver al inicio</a>
    </section>
  `;
}

function App() {
  const { parts, pathname, navigate } = useHashRoute();
  const { theme, toggleTheme } = useThemeMode();

  return html`
    <${AppShell}
      pathname=${pathname}
      navigate=${navigate}
      theme=${theme}
      toggleTheme=${toggleTheme}
    >
      ${renderPage(pathname, parts, navigate)}
    </${AppShell}>
  `;
}

window.App = App;
