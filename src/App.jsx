import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify'
import './App.css'

function App () {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  //console.log(backendUrl)
  const [auth, setAuth] = useState(localStorage.getItem('auth'));
  //feed vars
  const [seedFeed, setSeedFeed] = useState();
  const [outcome, setOutcome] = useState();
  const [streakScore, setStreakScore] = useState();

  //use vars
  const [streakScoreUse, setStreakScoreUse] = useState();
  const [seedUse, setSeedUse] = useState();

  //const [gaming, setGaming] = useState(false)
  const [results, setResults] = useState('')
  const [feedAction, setFeedAction] = useState(false);
  const [useAction, setUseAction] = useState(false);

  const resultsRef = useRef(null);

  function setAuthh (e) {
    setAuth(e.target.value.trim());
    localStorage.setItem('auth', e.target.value.trim());
  }

  async function seedAndStreakBasedPredictor (e) {
      try {
        e.preventDefault();
        if(!feedAction){
        
            setFeedAction(true)

            const {data} = await axios.post(backendUrl+'/seed', {
                seed: seedFeed,
                outcome, 
                streakScore
            },{headers: {
                "Authorization": auth
            }});
            //console.log(response)
            if(data.success){
            toast.success(data.message);
            e.target.reset();
            } else {
            toast.error(data.message)
            }
        }
      } catch (error) {
        toast.error(error.message)
      } finally{
        setFeedAction(false)
      }
     
  }

  async function getOutcome(e) {
    try {
      e.preventDefault()
      if(!useAction){

            setUseAction(true);

            const {data} = await axios.post(backendUrl+'/use/seedData', {
                seed: seedUse,
                streakScore: streakScoreUse
            });

            setResults(data.outComeData);
            //console.log(data.outComeData)
            e.target.reset();
        }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUseAction(false);
    }
  }

  useEffect(()=>{
    if(useAction){
        resultsRef.current.scrollIntoView()
    }
  }, [useAction])

  return (
    <>
      <div className="header">
        <h2>Number Algorithm predictor</h2>
        <p>Algo101</p>
    </div>
    <div className="main">
        <div className="feed-model">
            <p className="title">FEED MODEL</p>
            <div className="feed-main">
                <div className="key-sec">
                    <div>
                        <p className="key">Key</p>
                    </div>
                    <div className="keys">
                        <p> <span className="key-head">Seed</span> - A number that the algorithm throws </p>
                        <p> <span className="key-head">Outcome</span> - The number that followed the seed </p>
                        <p> <span className="key-head">Streak</span> - How many times in a row had numbers within the range that the seed belongs occured</p>
                        <p> <span className="key-head">Auth Code</span> - Authorisation code to feed data into model (saved on browser once entered)</p>
                        <p> <span className="key-head">Ranges</span> - Range one: <span className="range_1">1.00 - 1.99</span> Range two: <span className="range_2"> 2.00 - and above</span>  </p>
                    </div>  
                    <button className="hide-key-btn js-hide-key">hide key</button>
                </div>
                <div className="data-sec">
                    <p>Fill in the fields below. Make sure your data is from a realtime aviator game (Sp) (put decimals where applicable).</p>
                    <form onSubmit={seedAndStreakBasedPredictor} className="data-form js-data-form-feed">
                        <label htmlFor="seed">
                           <p>SEED </p> <input onChange={(e)=>setSeedFeed(Number(e.target.value).toFixed(2))} type="number" step={0.01} min={1.00} max={9.99} name="" id="seed" required/>
                        </label>
                        <label htmlFor="outcome">
                           <p>OUTCOME</p>  <input onChange={(e)=>setOutcome(Number(e.target.value).toFixed(2))} type="number" step={0.01} min={1.00} name="" id="outcome" required/>
                        </label>
                        <label htmlFor="streak">
                            <p>STREAK SCORE </p><input onChange={(e)=>setStreakScore(e.target.value)} type="number" step={1} min={1} name="" id="streak" required/>
                        </label>
                        {
                            auth == 'super101' || auth == 'authcodeAlgo' 
                            ? ''
                            : <label htmlFor="auth">
                                <p>Auth Code</p> <input onChange={setAuthh} type="text"  name="" id="auth"/>
                            </label>
                        }
                        <button className="js-feed-submit-btn" type="submit">{feedAction ? 'submiting...' : 'submit'}</button>
                    </form>
                </div>
            </div>
            
        </div>
        <div className="use-model">
            <p className="title">USE MODEL</p>
            <div className="use-main">
                <div className="key-sec">
                    <div>
                        <p className="key">Key</p>
                    </div>
                    <div className="keys">
                        <p> <span className="key-head">Seed</span> - Latest outcome on your gaming screen</p>
                        <p> <span className="key-head">Streak</span> - How many times in a row had numbers within the range that the seed belongs occured</p>
                        <p> <span className="key-head">Ranges</span> - Range one: <span className="range_1">1.00 - 1.99</span> Range two: <span className="range_2"> 2.00 - and above</span> </p>
                    </div>  
                    <button className="hide-key-btn js-hide-key">hide key</button>
                </div>
                <div className="data-sec">
                    <ul className="use-txt">
                        <p style={{color: 'black', fontSize: 'large'}}>How to use model</p>
                        <li>
                            In your current gaming screen, pick the latest outcome and fill it on the seed field.
                        </li>
                        <li>
                            Count how many times numbers within the seed range have occured and fill that in streak score.
                        </li>
                        <li>
                            Click predict/press enter to generate the next possible outcome
                        </li>
                    </ul>
                    <form onSubmit={getOutcome} className="data-form-use js-data-form-use">
                        <label  className="use" htmlFor="seed">
                            <p>SEED </p><input onChange={(e)=>setSeedUse(Number(e.target.value).toFixed(2))} type="number" step={0.01} min={1.00} max={9.99} name="seed" id="seed" required/>
                        </label>
                        <label className="use" htmlFor="streak">
                            <p>STREAK SCORE</p>  <input onChange={(e)=>setStreakScoreUse(e.target.value)} type="number" step={1} min={1} name="seed" id="streak" required/>
                        </label>
                        <button type="submit" style={{width: '180px'}} >predict</button>
                    </form>
                    <div className="results-sec">
                        <p className="title">Results</p>
                        <div className="use-key">
                            <p className="key">key</p>
                            <div>
                                <div style={{width: '20px', height: '20px', backgroundColor: 'orange'}}></div>
                                <p>Weak Possibilty</p>
                            </div>
                            <div>
                                <div style={{width: '20px', height: '20px', backgroundColor: 'rgb(120, 137, 4)'}}></div>
                                <p>Stronger possibility</p>
                            </div>
                            <div>
                                <div style={{width: '20px', height: '20px', backgroundColor: 'rgb(18, 189, 2)'}}></div>
                                <p>Strongest possibility</p>
                            </div>
                        </div>
                        <div className="results" >
                            <div ref={resultsRef}>                            
                                {
                                    useAction ?
                                    <div className='res-loading'>
                                        <p>loading</p>
                                        <div className='load-one'></div>
                                        <div className='load-two'></div>
                                        <div className='load-three'></div>
                                    </div>
                                    :
                                    <>
                                        {
                                            results ?
                                            <p className={`outcome js-outcome ${results.streakScoreTick && results.variationScoreTick ? 'strongest-pos' : !results.streakScoreTick && results.variationScoreTick ? 'strong-pos' : !results.streakScoreTick && !results.variationScoreTick ? 'weak-pos': ''  }`}>{`Possibility X${results.possibleOutcome.lowerLimitPrediction} - X${results.possibleOutcome.upperLimitPrediction}`}</p>
                                            : <p className="outcome js-outcome">Fill the fields above and click predict to get a prediction</p>  
                                        }
                                    </>
                                }
                            </div>
                            <p>Enter resulting outcome on your gaming screen on the field below (optional).</p>
                            <div className="outcome-submission">
                                <input placeholder="Outcome" type="text"></input>
                                <button style={{width: '150px'}}>Submit</button>
                            </div>
                            <div className="accuracy-sec">
                                <p>Current Model Accuracy - </p>
                                <p className="acc">87%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="footer">
        <p>Algo101 &copy; 2026</p>
    </div>
    </>
  )
}

export default App
