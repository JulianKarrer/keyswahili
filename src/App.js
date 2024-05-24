import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Vocabulary } from './vocab';
import Fuse from 'fuse.js'
import starImage from "./assets/star.png"


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
  const [recommendedOnly, setRecommendedOnly] = useState(true)
  // measure div dimensions to adjust layout
  const [wide, setWide] = useState(false);
  const ref = useRef({ current: null });
  const recommendedBox = useRef({ current: null });
  const update = () => setWide(ref.current ?
    ref.current.getBoundingClientRect().width > ref.current.getBoundingClientRect().height :
    {}
  );
  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  // update the displayed word
  const randWord = () => {
    let words = recommendedOnly ? Vocabulary.filter((word) => word.recommended) : Vocabulary
    setCurrentWord(getRand(words))
  }
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
      <div>

        <input
          checked={recommendedOnly}
          type="checkbox" id="recommendedCheckbox"
          style={{ display: 'none' }} ref={recommendedBox}
          onChange={() => { setRecommendedOnly(recommendedBox.current.checked) }}
        />
        <label htmlFor="recommendedCheckbox" className='recommendedLabel'
          style={{
            color: recommendedOnly ? "#141414" : "#999",
            right: wide ? "0" : "50%",
          }}>
          <span className='recommendedExplanation'>nur empfohlene Vokabeln anzeigen</span>
          <img src={starImage} style={{
            height: "100%", filter: recommendedOnly ? "" : "brightness(700%)",
            transform: "translateY(15%)", transition: "0.2s linear"
          }} title='nur für Anfänger empfohlene Vokabeln anzeigen' alt="nur empfohlene Vokabeln anzeigen" />
        </label>
      </div>
    </div >
  );
}

const Row = ({ id, elem }) => {
  return (
    <div key={id} style={{ display: "flex", padding: "10px 0px 10px 0px", backgroundColor: id % 2 === 0 ? " #f4f4f4" : " #ededed", }}>
      <div className="searchResCol">{elem.de}</div>
      <div className="searchResCol"> {elem.tz}</div>
      <div className="searchResCol" style={{ position: "relative" }}>
        {elem.category}
        {elem.recommended &&
          <img src={starImage} style={{
            position: "absolute", right: "10px", height: "calc(10px + 1vmin)",
            top: "50%", transform: "translateY(-50%)",
          }} alt="recommended" title='empfohlene Vokabel für Anfänger' />
        }
      </div>
    </div>
  )
}

function Search({ style }) {
  const [fuse, setFuse] = useState(null)
  const [res, setRes] = useState([])
  const [query, setQuery] = useState("")
  const searchRef = useRef({ current: null })
  useEffect(() => {
    const fuseOptions = {
      isCaseSensitive: false,
      threshold: 0.4,
      keys: ["de", "tz", "category"]
    };
    setFuse(new Fuse(Vocabulary, fuseOptions));
  }, [])
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
        {/* <Row key={-1} id={-1} elem={{ "de": "deutsch", "tz": "kiswahili", "recommended": true, "category": "Kategorie" }} /> */}
        <div className='searchContainerInner'>
          {/* {JSON.stringify(res)} */}
          {(query === "" ? Vocabulary : res.map((elem) => elem.item)).map((elem, id) => <Row key={id} id={id} elem={elem} />)}
        </div>
      </div>
    </div>
  );
}



export default App;
