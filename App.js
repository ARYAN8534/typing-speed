import React, { useState, useEffect } from 'react';
import './App.css';

export default function Form(props) {
  const [text, setText] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [currentKey, setCurrentKey] = useState('');
  const [topRowInterval, setTopRowInterval] = useState(null);
  const [bottomRowInterval, setBottomRowInterval] = useState(null);
  const [homeRowInterval, setHomeRowInterval] = useState(null);
  const [numberRowInterval, setNumberRowInterval] = useState(null);
  const [referenceText, setReferenceText] = useState('');
  const [scrollingKeys, setScrollingKeys] = useState([]);
  const [isScrolling, setIsScrolling] = useState({ top: false, bottom: false, number: false, home: false });
  const [correctChars, setCorrectChars] = useState(0);
  const [totalScrollingChars, setTotalScrollingChars] = useState(0);
  const [typingInterval, setTypingInterval] = useState(null);
  const [scrollingSelected, setScrollingSelected] = useState(''); 
  const [selectedButton, setSelectedButton] = useState(''); 
  const [selectedInterval, setSelectedInterval] = useState(1000); 
  const [paragraph, setParagraph] = useState('');
  const [isParagraphActive, setIsParagraphActive] = useState(false);




  const predefinedParagraph =
  'The quick brown fox jumps over the lazy dog. Typing speed is measured in words per minute.';

  




  const homeKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'];
  const topRowKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const bottomRowKeys = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
  const numberRowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  useEffect(() => {
  if (currentKey) {
    setReferenceText(`Type: ${currentKey}`);
  }
  }, [currentKey]);

  const calculateWPM = () => {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const wpm = elapsedTime > 0 ? (wordCount / (elapsedTime / 60)) : 0;
  setWordsPerMinute(wpm);
  };

  const handleRemoveAll = () => {
    // Remove Challenge Logic
    setCurrentKey('');
    setScrollingKeys([]);
    clearInterval(topRowInterval);
    clearInterval(bottomRowInterval);
    clearInterval(numberRowInterval);
    clearInterval(homeRowInterval);
    setIsScrolling({ top: false, bottom: false, number: false, home: false });

   
    setCurrentKey('');   
    setScrollingKeys([]); 
  };


  const handleButtonClick = (buttonType, interval) => {
    setSelectedButton(buttonType); 
    setSelectedInterval(interval); 
    handleSelectScrollingKeys(buttonType); 
  };
  
 


  const calculateAccuracy = () => { 
    const totalTypedChars = correctChars + mistakes; const accuracy = totalTypedChars === 0 ? 0 : (correctChars / totalTypedChars) * 100; 
    setAccuracy(accuracy);
   };
  
  const handleStartParagraph = () => {
    setParagraph(predefinedParagraph);
    setText('');
    setMistakes(0);
    setAccuracy(100);
    setElapsedTime(0);
    setWordsPerMinute(0);
    setInputDisabled(false);
    setIsParagraphActive(true);
    handleStartTimer();
  };

  const handleOnChange = (event) => {
    const newText = event.target.value;
    setText(newText);
  
    if (isParagraphActive) {
      // Paragraph Mistake Handling
      let currentMistakes = 0;
      let currentCorrectChars = 0;
  
      const paragraphSlice = paragraph.slice(0, newText.length);
      for (let i = 0; i < newText.length; i++) {
        if (newText[i] !== paragraphSlice[i]) {
          currentMistakes++;
        } else {
          currentCorrectChars++;
        }
      }
  
      // Calculate untyped characters
      const untypedChars = paragraph.length - newText.length;
      const totalMistakes = currentMistakes + (untypedChars > 0 ? untypedChars : 0);
  
      setMistakes(totalMistakes);
      setCorrectChars(currentCorrectChars);
    } else {
      // Scrolling Keys Mistake Handling
      let currentMistakes = 0;
      let currentCorrectChars = 0;
      const newTypedChars = newText.slice(text.length);
  
      newTypedChars.split('').forEach((char) => {
        if (scrollingKeys.includes(char)) {
          currentCorrectChars++;
          setScrollingKeys((prevKeys) => prevKeys.filter((key) => key !== char));
        } else {
          currentMistakes++;
        }
      });
  
      const missingChars = totalScrollingChars - (correctChars + mistakes);
      setMistakes((prevMistakes) => prevMistakes + currentMistakes + missingChars);
      setCorrectChars((prevCorrectChars) => prevCorrectChars + currentCorrectChars);
    }
  
    
    calculateAccuracy();
    calculateWPM();
  
    if (!timerRunning) {
      handleStartTimer();
    }
  };
  
  
  const handleStopTimer = () => {
  setTimerRunning(false);
  clearInterval(typingInterval);
  setInputDisabled(true);
  calculateWPM();
  };

 
  const handleStartTimer = () => {
  setElapsedTime(0);
  setTimerRunning(true);
  const intervalId = setInterval(() => {
    setElapsedTime((prev) => {
    if (prev >= 60) {
      clearInterval(intervalId);
      setTimerRunning(false);
      setInputDisabled(true);
      handleRemoveAll();
      return prev;
    }
    return prev + 1;
    });
  }, 1000);
  setTypingInterval(intervalId);
  };

  const handleSelectScrollingKeys = (rowType) => {
  setScrollingSelected(rowType);
  };

   
  const handleStartScrolling = () => {
    if (scrollingSelected) {
      const rowKeys =
        scrollingSelected === 'top'
          ? topRowKeys
          : scrollingSelected === 'bottom'
          ? bottomRowKeys
          : scrollingSelected === 'number'
          ? numberRowKeys
          : homeKeys;
  
      const scrollingInterval = selectedInterval === 1000 ? 1000 : 2000; 
      const intervalId = setInterval(() => {
        const newKey = rowKeys[Math.floor(Math.random() * rowKeys.length)];
        setCurrentKey(newKey);
        setScrollingKeys((prevKeys) => [...prevKeys.slice(-5), newKey]);
        setTotalScrollingChars((prev) => prev + 1);
      }, scrollingInterval);
  
     
      if (scrollingSelected === 'top') setTopRowInterval(intervalId);
      else if (scrollingSelected === 'bottom') setBottomRowInterval(intervalId);
      else if (scrollingSelected === 'number') setNumberRowInterval(intervalId);
      else setHomeRowInterval(intervalId);
  
      
      setIsScrolling((prev) => ({ ...prev, [scrollingSelected]: true }));
      setScrollingSelected('');
    }
  };
  
  

  const handleStopScrolling = (rowType) => {
  switch (rowType) {
    case 'top':
    if (topRowInterval) clearInterval(topRowInterval);
    break;
    case 'bottom':
    if (bottomRowInterval) clearInterval(bottomRowInterval);
    break;
    case 'number':
    if (numberRowInterval) clearInterval(numberRowInterval);
    break;
    case 'home':
    if (homeRowInterval) clearInterval(homeRowInterval);
    break;
    default:
    break;
  }
  
  setIsScrolling((prev) => ({ ...prev, [rowType]: false }));
  setScrollingKeys([]);
  };

  
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
  
  buttons.forEach(btn => btn.classList.remove('btn-clicked'));
  
  
  button.classList.add('btn-clicked');
  });
});


const resetTyping = () => {
  setText('');
  setMistakes(0);
  setCorrectChars(0);
  setElapsedTime(0);
  setWordsPerMinute(0);
  setTimerRunning(false);
  setInputDisabled(false);
  setTotalScrollingChars(0);
  setParagraph('');
  setIsParagraphActive(false);

  
 
  clearInterval(topRowInterval);
  clearInterval(bottomRowInterval);
  clearInterval(numberRowInterval);
  clearInterval(homeRowInterval);
  clearInterval(typingInterval);
  
 
  setIsScrolling({ top: false, bottom: false, number: false, home: false });
  
 
  setSelectedButton('');
  
  
  handleRemoveAll();
};


  useEffect(() => {
    if (scrollingKeys.length === 0) {
      return;
    }
    
    const missingChars = totalScrollingChars - (correctChars + mistakes);
    
    const validMissingChars = missingChars > 0 ? missingChars : 0;
    
    setMistakes((prevMistakes) => prevMistakes + validMissingChars);
  }, [totalScrollingChars, correctChars, mistakes, scrollingKeys]);
  
  return (
  <div className='container'>
    <h1>{props.heading}</h1>

    <div className="mb-3">
    <p style={{ color: 'white' }}>{isParagraphActive ? paragraph : 'Select a challenge to begin!'}</p>

    <div className="reference-text">
      <span>{referenceText}</span>
    </div>

   
    
    <textarea
      className="form-control"
      value={text}
      onChange={handleOnChange}
      id="myBox"
      rows="8"
      onClick={handleStartScrolling}
      placeholder="Start typing here..."
      disabled={inputDisabled} 
    ></textarea>
    </div>

    <div className="container1">
    <div className="marquee-container">
      {scrollingKeys.map((key, index) => (
      <span key={index} className="marquee-text">
        {key}
      </span>
      ))}
    </div>
    </div>

    

   
   
    <button
  className={`btn btn-primary mx-1 ${selectedButton === 'home1' ? 'btn-clicked' : ''}`}
  onClick={() => handleButtonClick('home', 1000)} 
>
  {isScrolling.home ? 'Stop Home Row (1s)' : 'Select Home Row (1s)'}
</button>

<button
  className={`btn btn-primary mx-1 ${selectedButton === 'top1' ? 'btn-clicked' : ''}`}
  onClick={() => handleButtonClick('top', 1000)} 
>
  {isScrolling.top ? 'Stop Top Row (1s)' : 'Select Top Row (1s)'}
</button>

<button
  className={`btn btn-primary mx-1 ${selectedButton === 'bottom1' ? 'btn-clicked' : ''}`}
  onClick={() => handleButtonClick('bottom', 1000)}
>
  {isScrolling.bottom ? 'Stop Bottom Row (1s)' : 'Select Bottom Row (1s)'}
</button>

<button
  className={`btn btn-primary mx-1 ${selectedButton === 'number1' ? 'btn-clicked' : ''}`}
  onClick={() => handleButtonClick('number', 1000)} 
>
  {isScrolling.number ? 'Stop Number Row (1s)' : 'Select Number Row (1s)'}
</button>

<button
  className={`btn btn-primary mx-1 ${selectedButton === 'home2' ? 'btn-clicked' : ''}`}
  onClick={() => handleButtonClick('home', 2000)} 
>
  {isScrolling.home ? 'Stop Home Row (2s)' : 'Start Home Row (2s)'}
</button>

<button
  className={`btn btn-primary mx-1 ${selectedButton === 'top2' ? 'btn-clicked' : ''}`}
  onClick={() => handleButtonClick('top', 2000)} 
>
  {isScrolling.top ? 'Stop Top Row (2s)' : 'Start Top Row (2s)'}
</button>

<button
  className={`btn btn-primary mx-1 ${selectedButton === 'bottom2' ? 'btn-clicked' : ''}`}
  onClick={() => handleButtonClick('bottom', 2000)}
>
  {isScrolling.bottom ? 'Stop Bottom Row (2s)' : 'Start Bottom Row (2s)'}
</button>

<button
  className={`btn btn-primary mx-1 ${selectedButton === 'number2' ? 'btn-clicked' : ''}`}
  onClick={() => handleButtonClick('number', 2000)} 
>
  {isScrolling.number ? 'Stop Number Row (2s)' : 'Start Number Row (2s)'}
</button>

<button className="btn btn-warning mx-1" onClick={resetTyping}>Reset</button>

      
            

        

          <div className="my-4">
            <h1>Your Typing Summary</h1>
            <p style={{ color: 'white' }}>Correct Characters: {correctChars}</p>
            <p style={{ color: 'white' }}>Mistakes: {mistakes}</p>
            <p style={{ color: 'white' }}>Words: {text.trim().split(/\s+/).length} | Characters: {text.length}</p>
            <p style={{ color: 'white' }}>Elapsed Time: {elapsedTime} seconds</p>
            <p style={{ color: 'white' }}>Typing Speed: {wordsPerMinute.toFixed(2)} WPM</p>
            <p style={{ color: 'white' }}>Accuracy: {accuracy.toFixed(2)}%</p>
            <p style={{ color: 'white' }}>Total Scrolling Characters Shown: {totalScrollingChars}</p>
           
          </div>

          <button className="btn btn-primary mx-1" onClick={handleStartParagraph}>
        Start Paragraph Challenge
      </button>
          <button className="btn btn-warning mx-1" onClick={handleStopTimer}>Stop Timer</button>
          <button  className="btn btn-warning mx-1" onClick={handleRemoveAll}>Remove Challenge & Text</button>
          <button   className="btn btn-warning mx-1" onClick={handleStopScrolling}>Stop Scrolling</button>
          


          </div>
  );
}