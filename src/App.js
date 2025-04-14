import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const ImageClue = ({ src, round, onImageLoad }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className="round-indicator">
        Round <span className="round-number">{round}</span>/27
      </div>
      <div className="image-container" onClick={toggleModal}>
        <img
          src={src}
          alt="Clue"
          className="clue-image"
          onLoad={onImageLoad} // 🧠 Call this to notify parent that loading is done
        />
      </div>
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content">
            <img
              src={src}
              alt="Clue enlarged"
              className="modal-image"
              onLoad={onImageLoad} // Optional: Call it here too if needed
            />
          </div>
        </div>
      )}
    </>
  );
};


const AnswerTiles = ({ answer, onSubmit }) => {
  const [tiles, setTiles] = useState([]);
  const [keyboardLetters, setKeyboardLetters] = useState([]);
  const words = answer.trim().split(' ');
  const expectedLength = answer.replace(/\s/g, '').length;

  useEffect(() => {
    const getKeyboardLetters = () => {
      const answerChars = answer.replace(/\s/g, '').toUpperCase().split('');
      const extraLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        .split('')
        .filter((c) => !answerChars.includes(c))
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      return [...answerChars, ...extraLetters].sort(() => 0.5 - Math.random()).map((char, index) => ({ char, id: `${char}-${index}` }));
    };

    setKeyboardLetters(getKeyboardLetters());
    setTiles([]); // Clear tiles when answer changes (new round)
  }, [answer]);

  const handleLetterClick = (keyObj) => {
  if (tiles.length < expectedLength) {
    const newTiles = [...tiles, keyObj];
    const newKeyboard = keyboardLetters.filter((k) => k.id !== keyObj.id);
    setTiles(newTiles);
    setKeyboardLetters(newKeyboard);

    // Auto-submit if last tile filled
    if (newTiles.length === expectedLength) {
      setTimeout(() => handleSubmit(newTiles), 300); // slight delay for UX
    }
  }
};


  const handleBackspace = () => {
    if (tiles.length > 0) {
      const lastKey = tiles[tiles.length - 1];
      setTiles(tiles.slice(0, -1));
      setKeyboardLetters([...keyboardLetters, lastKey]);
    }
  };

  const handleSubmit = (submittedTiles = tiles) => {
    onSubmit(submittedTiles.map(t => t.char).join(''));
  };

  const renderWordTiles = () => {
  const wordLengths = words.map(word => word.length);
  let tileIndex = 0;

  return (
    <div className="tiles-word-group">
      {wordLengths.map((length, i) => (
        <div key={i} className="tiles-single-word">
          {Array.from({ length }).map((_, j) => {
            const currentTile = tiles[tileIndex];
            const currentIndex = tileIndex;
            tileIndex++;

            return (
              <div
                key={j}
                className={`tile-display ${currentTile ? 'clickable' : ''}`}
                onClick={() => {
                  if (currentTile) {
                    const newTiles = [...tiles];
                    const removedTile = newTiles.splice(currentIndex, 1)[0];
                    setTiles(newTiles);
                    setKeyboardLetters(prev => [...prev, removedTile]);
                  }
                }}
              >
                {currentTile ? currentTile.char : ''}
              </div>
            );
          })}
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
          {keyboardLetters.map((keyObj) => (
            <button
              key={keyObj.id}
              onClick={() => handleLetterClick(keyObj)}
              className="key-button"
            >
              {keyObj.char}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Feedback = ({ status }) => {
  if (status === null) return null;
  return (
    <div className={`feedback ${status ? 'correct' : 'incorrect'}`}>
      {status ? 'Wah Bhasha Wah!' : 'Try Again Buddy!'}
    </div>
  );
};

const Game = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isAllImagesLoaded, setIsAllImagesLoaded] = useState(false);

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
      imageUrl: process.env.PUBLIC_URL + '/images/RK.png',
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

  // Preload all the images when the game starts
  useEffect(() => {
    const preloadImages = clues.map(clue => new Promise(resolve => {
      const img = new Image();
      img.src = clue.imageUrl;
      img.onload = resolve;
    }));

    // Once all images are loaded, set isAllImagesLoaded to true
    Promise.all(preloadImages).then(() => {
      setIsAllImagesLoaded(true);
    });
  }, [clues]);

  const currentClue = clues[currentIndex];



  const handleAnswerSubmit = (userAnswer) => {
    if (userAnswer.toUpperCase() === currentClue.answer.replace(/\s/g, '').toUpperCase()) {
      setIsCorrect(true);
      setTimeout(() => {
        if (currentIndex + 1 >= clues.length) {
          setGameCompleted(true);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
        setIsCorrect(null);
      }, 1000);
    } else {
      setIsCorrect(false);
    }
  };

  if (gameCompleted) {
    return (
      <div className="game-complete">
        You completed the game! 🎉<br />
        <a href="https://www.geoguessr.com/quiz/6573318f-d235-4177-95ab-f3c6ceb33a35?r=632534ad4d6352b411e20171">Now finish the second Birthday special challenge!</a>
      </div>
    );
  }

  return (
    <div className="game-wrapper">
      {/* Loading screen */}
      {!isAllImagesLoaded ? (
        <div className="loader-container loader-active">
          <div className="birthday-banner">Happy Birthday Bhasha! 🎉🎈</div>
          <img
            className="loader-img"
            src={`${process.env.PUBLIC_URL}/images/loading.gif`}
            alt="Loading..."
          />
          <h3>Loading...</h3>
        </div>
      ) : (
        // Game content goes here
        <div className="game-content">
          <div className="birthday-banner">Happy Birthday Bhasha! 🎉🎈</div>
          <ImageClue
            src={currentClue.imageUrl}
            round={currentIndex + 1}
          />
          <AnswerTiles
            answer={currentClue.answer}
            onSubmit={handleAnswerSubmit}
          />
          <Feedback status={isCorrect} />
        </div>
      )}
    </div>
  );
};

export default Game;
