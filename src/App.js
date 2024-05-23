import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Vocabulary } from './vocab';
import Fuse from 'fuse.js'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className='headercontainer'>
          <span className="headerspan" style={{ fontStyle: "italic", marginLeft: "-2vmin" }}>
            KEY
          </span><span className="headerspan">SWAHILI</span>
        </div>
        <span className='subheader'>Lerne Kiswahili Grundlagen Online</span>
      </header>
      <QA className='qa' />
      <div style={{ height: "15vh" }}></div>
      <Search />
      <div style={{ height: "15vh" }}></div>
    </div >
  );
}

const getRand = (arr) => arr[Math.floor(Math.random() * arr.length)]


function QA({ style, className }) {
  const [currentWord, setCurrentWord] = useState(Vocabulary[0])
  const [revealed, setRevealed] = useState(true)
  // measure div dimensions to adjust layout
  const [wide, setWide] = useState(false);
  const ref = useRef({ current: null });
  const update = () => setWide(ref.current ?
    ref.current.getBoundingClientRect().width > ref.current.getBoundingClientRect().height :
    {}
  );
  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  // set the initial word
  const randWord = () => { setCurrentWord(getRand(Vocabulary)) }
  return (
    <div className={className} style={style} ref={ref}>
      <div className='qaContainer' style={{ display: "flex", flexDirection: wide ? "row" : "column" }}>
        <div className='qaSubContainer' style={{ width: wide ? "30vw" : "60vw", height: wide ? "60vh" : "30vh" }}>
          <span className="languageLabel">deutsch</span>
          <div className='wordsContainer'><p className="wordP" style={{ textAlign: "center" }}>{(currentWord) && currentWord["de"]}</p></div>
        </div>
        <div className='qaSubContainer' style={{ width: wide ? "30vw" : "60vw", height: wide ? "60vh" : "30vh" }}>
          <span style={{ bottom: wide ? "auto" : "0px", position: wide ? "inherit" : "absolute" }} className="languageLabel">kiswahili</span>
          <div className='wordsContainer'><p className="wordP" style={{ textAlign: "center" }}>{(currentWord) && revealed && currentWord["tz"]}</p></div>
        </div>
        <button type="button" className='goButton' onClick={() => { if (revealed) { randWord() }; setRevealed(!revealed); }}>GO!</button>
      </div>
      <span className='categoryLabel'>kategorie: {(currentWord) && currentWord["category"]}</span>
    </div >
  );
}



function Search({ style }) {
  const [fuse, setFuse] = useState(null)
  const [res, setRes] = useState([])
  const [query, setQuery] = useState("")
  const searchRef = useRef({ current: null })
  useEffect(() => {
    const fuseOptions = {
      isCaseSensitive: false,
      // includeScore: false,
      // shouldSort: true,
      // includeMatches: false,
      // findAllMatches: false,
      // minMatchCharLength: 1,
      // location: 0,
      threshold: 0.4,
      // distance: 100,
      // useExtendedSearch: false,
      // ignoreLocation: false,
      // ignoreFieldNorm: false,
      // fieldNormWeight: 1,
      keys: ["de", "tz", "category"]
    };
    setFuse(new Fuse(Vocabulary, fuseOptions));
  }, [])
  useEffect(() => { console.log(res) }, [res])
  return (
    <div className="searchContainer" style={{ ...style }}>
      <input
        type="text"
        value={query}
        placeholder="Wörter suchen..."
        className="searchInput"
        ref={searchRef}
        style={query === "" ? { color: "#aaa", fontFamily: "MontserratItalic" } : { color: "#141414", fontFamily: "MontserratBold" }}
        onInput={() => {
          setQuery(searchRef.current.value)
          setRes(fuse.search(searchRef.current.value))
        }} />
      <div className='searchResContainer'>
        {/* {JSON.stringify(res)} */}
        {(query === "" ? Vocabulary : res.map((elem) => elem.item)).map((elem, id) =>
          <div key={id} style={{ display: "flex", padding: "10px 0px 10px 0px", backgroundColor: id % 2 === 0 ? " #f4f4f4" : " #ededed", ...style }}>
            <div className="searchResCol">{elem.de}</div>
            <div className="searchResCol"> {elem.tz}</div>
            <div className="searchResCol" style={{ textTransform: "capitalize" }}> {elem.category}</div>
          </div >
        )
        }
      </div>
    </div>
  );
}



export default App;
