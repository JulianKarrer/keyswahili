import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Vocabulary } from './vocab';


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
    <div className={className} ref={ref}>
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



export default App;
