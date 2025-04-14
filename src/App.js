import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const clues = [
  {
    id: 1,
    imageUrl: process.env.PUBLIC_URL + '/images/dt.png',
    answer: 'Dragon Tales',
  },
  {
    id: 2,
    imageUrl: process.env.PUBLIC_URL + '/images/lilac.png',
    answer: 'lilac',
  },
  {
    id: 3,
    imageUrl: process.env.PUBLIC_URL + '/images/swiss.png',
    answer: 'switzerland',
  },
  {
    id:4,
    imageUrl: process.env.PUBLIC_URL + '/images/garb.png',
    answer: 'garba'
  },
  {
    id:5,
    imageUrl: process.env.PUBLIC_URL + '/images/NB.png',
    answer: 'naren'
  },
  {
    id:6,
    imageUrl: process.env.PUBLIC_URL + '/images/pk.png',
    answer: 'pikachu'
  },
  {
    id:7,
    imageUrl: process.env.PUBLIC_URL + '/images/rn.png',
    answer: 'rain'
  },
  {
    id:8,
    imageUrl: process.env.PUBLIC_URL + '/images/aw.png',
    answer: 'arabic wedding'
  },
  {
    id:9,
    imageUrl: process.env.PUBLIC_URL + '/images/bhul.png',
    answer: 'bhool bhulaiyaa'
  },
  {
    id:10,
    imageUrl: process.env.PUBLIC_URL + '/images/br.png',
    answer: 'bibhatsa'
  },
  {
    id:11,
    imageUrl: process.env.PUBLIC_URL + '/images/dk.png',
    answer: 'dal khichdi'
  },
  {
    id:12,
    imageUrl: process.env.PUBLIC_URL + '/images/dp.png',
    answer: 'dragon potato'
  },
  {
    id:13,
    imageUrl: process.env.PUBLIC_URL + '/images/kk.png',
    answer: 'kathak'
  },
  {
    id:14,
    imageUrl: process.env.PUBLIC_URL + '/images/kn.png',
    answer: 'krishnayan'
  },
  {
    id:15,
    imageUrl: process.env.PUBLIC_URL + '/images/kp.png',
    answer: 'crispello'
  },
  {
    id:16,
    imageUrl: process.env.PUBLIC_URL + '/images/mango.png',
    answer: 'mango'
  },
  {
    id:17,
    imageUrl: process.env.PUBLIC_URL + '/images/pg.png',
    answer: 'pavagadh'
  },
  {
    id:18,
    imageUrl: process.env.PUBLIC_URL + '/images/pj.png',
    answer: 'pinju'
  },
  {
    id:19,
    imageUrl: process.env.PUBLIC_URL + '/images/rk.png',
    answer: 'ranbir kapoor'
  },
  {
    id:20,
    imageUrl: process.env.PUBLIC_URL + '/images/sk.png',
    answer: 'seekh kebab'
  },
  {
    id:21,
    imageUrl: process.env.PUBLIC_URL + '/images/sn.png',
    answer: 'sun'
  },
  {
    id:22,
    imageUrl: process.env.PUBLIC_URL + '/images/sw.png',
    answer: 'swing'
  },
  {
    id:23,
    imageUrl: process.env.PUBLIC_URL + '/images/ao.png',
    answer: 'aglio olio'
  },
  {
    id:24,
    imageUrl: process.env.PUBLIC_URL + '/images/bd.png',
    answer: 'bhasha'
  },
  {
    id:25,
    imageUrl: process.env.PUBLIC_URL + '/images/bn.png',
    answer: 'brooklyn nine nine'
  },
  {
    id:26,
    imageUrl: process.env.PUBLIC_URL + '/images/mk.png',
    answer: 'madhav kyay nathi'
  },
  {
    id:27,
    imageUrl: process.env.PUBLIC_URL + '/images/bb.png',
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


const AnswerTiles = ({ answer, onSubmit, tapSound }) => {
  const [tiles, setTiles] = useState([]);
  const [keyboardLetters, setKeyboardLetters] = useState([]);
  const words = answer.trim().split(' ');
  const expectedLength = answer.replace(/\s/g, '').length;

  useEffect(() => {
    const getKeyboardLetters = () => {
      const uniqueAnswerLetters = Array.from(new Set(answer.replace(/\s/g, '').toUpperCase()));
      const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      const remainingLetters = allLetters.filter(letter => !uniqueAnswerLetters.includes(letter));

      while (uniqueAnswerLetters.length < 16) {
        const randomIndex = Math.floor(Math.random() * remainingLetters.length);
        const letter = remainingLetters.splice(randomIndex, 1)[0];
        uniqueAnswerLetters.push(letter);
      }

      return uniqueAnswerLetters.sort();
    };

    setKeyboardLetters(getKeyboardLetters());
    setTiles([]);
  }, [answer]);

  const handleLetterClick = (char) => {
    if (tiles.length < expectedLength) {
      setTiles([...tiles, char]);
    }
  };

  const handleBackspace = () => {
    setTiles(tiles.slice(0, -1));
  };

  const handleSubmit = () => {
    onSubmit(tiles.join(''));
  };


  const renderWordTiles = () => {
    let tileIndex = 0;
    return (
      <div className="tiles-word-group">
        {words.map((word, i) => (
          <div key={i} className="tiles-single-word">
            {Array.from({ length: word.length }).map((_, j) => (
              <div key={j} className="tile-display">
                {tiles[tileIndex++] || ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="answer-container">
      {renderWordTiles()}

      <div className="keyboard">
        <div className="keyboard-row">
          {keyboardLetters.map((char) => (
            <button
              key={char}
              onClick={() => handleLetterClick(char)}
              className="key-button"
            >
              {char}
            </button>
          ))}
        </div>
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
      {status ? 'Correct!' : 'Try Again!'}
    </div>
  );
};

const Game = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);

  const currentClue = clues[currentIndex];

  const handleAnswerSubmit = (userAnswer) => {
    if (userAnswer.toUpperCase() === currentClue.answer.replace(/\s/g, '').toUpperCase()) {
      setIsCorrect(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsCorrect(null);
      }, 1000);
    } else {
      setIsCorrect(false);
    }
  };

  if (!currentClue) return <div className="game-complete">You completed the game! 🎉</div>;

  return (
    <div className="game-wrapper">
      <ImageClue src={currentClue.imageUrl} round={currentIndex + 1} />
      <AnswerTiles answer={currentClue.answer} onSubmit={handleAnswerSubmit} />
      <Feedback status={isCorrect} />
    </div>
  );
};

export default Game;
