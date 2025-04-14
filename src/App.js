import React, { useState } from 'react';
import './App.css';

const clues = [
  {
    id: 1,
    imageUrl: '/images/dt.png',
    answer: 'Dragon Tales',
  },
  {
    id: 2,
    imageUrl: '/images/lilac.png',
    answer: 'lilac',
  },
  {
    id: 3,
    imageUrl: '/images/swiss.png',
    answer: 'switzerland',
  },
  {
    id:4,
    imageUrl: '/images/garb.png',
    answer: 'garba'
  },
  {
    id:5,
    imageUrl: '/images/NB.png',
    answer: 'naren'
  },
  {
    id:6,
    imageUrl: '/images/pk.png',
    answer: 'pikachu'
  },
  {
    id:7,
    imageUrl: '/images/rn.png',
    answer: 'rain'
  },
  {
    id:8,
    imageUrl: '/images/aw.png',
    answer: 'arabic wedding'
  },
  {
    id:9,
    imageUrl: '/images/bhul.png',
    answer: 'bhool bhulaiyaa'
  },
  {
    id:10,
    imageUrl: '/images/br.png',
    answer: 'bibhatsa'
  },
  {
    id:11,
    imageUrl: '/images/dk.png',
    answer: 'dal khichdi'
  },
  {
    id:12,
    imageUrl: '/images/dp.png',
    answer: 'dragon potato'
  },
  {
    id:13,
    imageUrl: '/images/kk.png',
    answer: 'kathak'
  },
  {
    id:14,
    imageUrl: '/images/kn.png',
    answer: 'krishnayan'
  },
  {
    id:15,
    imageUrl: '/images/kp.png',
    answer: 'crispello'
  },
  {
    id:16,
    imageUrl: '/images/mango.png',
    answer: 'mango'
  },
  {
    id:17,
    imageUrl: '/images/pg.png',
    answer: 'pavagadh'
  },
  {
    id:18,
    imageUrl: '/images/pj.png',
    answer: 'pinju'
  },
  {
    id:19,
    imageUrl: '/images/rk.png',
    answer: 'ranbir kapoor'
  },
  {
    id:20,
    imageUrl: '/images/sk.png',
    answer: 'seekh kebab'
  },
  {
    id:21,
    imageUrl: '/images/sn.png',
    answer: 'sun'
  },
  {
    id:22,
    imageUrl: '/images/sw.png',
    answer: 'swing'
  },
  {
    id:23,
    imageUrl: '/images/ao.png',
    answer: 'aglio olio'
  },
  {
    id:24,
    imageUrl: '/images/bd.png',
    answer: 'bhasha'
  },
  {
    id:25,
    imageUrl: '/images/bn.png',
    answer: 'brooklyn nine nine'
  },
  {
    id:26,
    imageUrl: '/images/mk.png',
    answer: 'madhav kyay nathi'
  },
  {
    id:27,
    imageUrl: '/images/bb.png',
    answer: 'bachuben'
  }
];

const ImageClue = ({ src, round }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
    <div className="round-indicator">Round <span className="round-number">{round}</span>/27</div>
      <div className="image-container" onClick={toggleModal}>
        <img src={src} alt="Clue" className="clue-image" />
      </div>
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content">
            <img src={src} alt="Clue enlarged" className="modal-image" />
          </div>
        </div>
      )}
    </>
  );
};

const AnswerTiles = ({ answer, onSubmit, tiles, setTiles, keyboardStatus, setKeyboardStatus }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);  // Track submission state

  const words = answer.trim().split(' ');
  const expectedLength = answer.replace(/\s/g, '').length;

  // Function to handle letter clicks and update tiles
  const handleLetterClick = (char) => {
    if (tiles.length < expectedLength) {
      setTiles([...tiles, char]);
    }
  };

  // Function to handle backspace action
  const handleBackspace = () => {
    setTiles(tiles.slice(0, -1));
  };

  // Function to submit the answer and check if it's correct
  const handleSubmit = () => {
    const userAnswer = tiles.join('');
    setIsSubmitted(true);  // Mark as submitted
    onSubmit(userAnswer);
  };

  const renderWordTiles = () => {
    let tileIndex = 0;
    return (
      <div className="tiles-word-group">
        {words.map((word, i) => (
          <div key={i} className="tiles-single-word">
            {Array.from({ length: word.length }).map((_, j) => {
              const currentTile = tiles[tileIndex] || ''; // Get current letter or empty if not filled
              tileIndex++;
              return (
                <div key={j} className="tile-display">
                  {currentTile}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const getKeyButtonClass = (letter) => {
    const status = keyboardStatus[letter] || 'default'; // Use default if no status is set
    return `key-button ${status}`;
  };

  return (
    <div className="answer-container">
      {renderWordTiles()}

      <div className="keyboard">
        {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.split('').map((char) => (
              <button
                key={char}
                onClick={() => handleLetterClick(char)}
                className={getKeyButtonClass(char)}
              >
                {char}
              </button>
            ))}
          </div>
        ))}
        <div className="keyboard-row">
          <button onClick={handleBackspace} className="key-button special">←</button>
          <button onClick={handleSubmit} className="key-button special">Submit</button>
        </div>
      </div>
    </div>
  );
};

const Feedback = ({ status }) => {
  if (status === null) return null;
  return (
    <div className={`feedback ${status ? 'correct' : 'incorrect'}`}>
      {status ? 'Wah Bhasha wah!' : 'Try Again buddy!'}
    </div>
  );
};

const Game = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [keyboardStatus, setKeyboardStatus] = useState({}); // Track keyboard status
  const [tiles, setTiles] = useState([]); // Track tiles for the current word

  const currentClue = clues[currentIndex];

  // Function to reset keyboard status for the next round
  const resetKeyboardStatus = () => {
    setKeyboardStatus({});
    setTiles([]);  // Clear the current tiles
  };

  const handleAnswerSubmit = (userAnswer) => {
    if (userAnswer.toUpperCase() === currentClue.answer.replace(/\s/g, '').toUpperCase()) {
      setIsCorrect(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsCorrect(null);
        resetKeyboardStatus(); // Reset keyboard for the next round
      }, 1000);
    } else {
      setIsCorrect(false);
    }
  };

  if (!currentClue) return <div className="game-complete"><div>You completed the game! 🎉</div><div>Now finish second birthday Challenge: <a href="https://www.geoguessr.com/quiz/6573318f-d235-4177-95ab-f3c6ceb33a35?r=632534ad4d6352b411e20171">Take me THERE!</a></div></div>;

  return (
    <div className="game-wrapper">
      <ImageClue src={currentClue.imageUrl} round={currentIndex + 1} />
      <AnswerTiles
        answer={currentClue.answer}
        onSubmit={handleAnswerSubmit}
        tiles={tiles}
        setTiles={setTiles}
        keyboardStatus={keyboardStatus}
        setKeyboardStatus={setKeyboardStatus}
      />
      <Feedback status={isCorrect} />
    </div>
  );
};

export default Game;
