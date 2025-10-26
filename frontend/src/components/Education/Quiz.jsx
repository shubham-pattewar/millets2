import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './Education.css';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const questions = [
    {
      question: 'Which millet is highest in calcium?',
      options: ['Pearl Millet', 'Finger Millet (Ragi)', 'Foxtail Millet', 'Little Millet'],
      correctAnswer: 1,
      explanation: 'Finger Millet (Ragi) has 364mg of calcium per 100g, making it excellent for bone health!'
    },
    {
      question: 'What is the glycemic index category of most millets?',
      options: ['High', 'Medium', 'Low', 'Very High'],
      correctAnswer: 2,
      explanation: 'Millets have a low glycemic index, making them ideal for diabetes management.'
    },
    {
      question: 'Are millets gluten-free?',
      options: ['Yes', 'No', 'Some are', 'Only when processed'],
      correctAnswer: 0,
      explanation: 'All millets are naturally gluten-free, making them safe for people with celiac disease!'
    },
    {
      question: 'Which nutrient is abundant in Pearl Millet?',
      options: ['Calcium', 'Iron', 'Vitamin C', 'Vitamin D'],
      correctAnswer: 1,
      explanation: 'Pearl Millet is rich in iron (8mg per 100g), helping prevent anemia.'
    },
    {
      question: 'What is the main environmental benefit of growing millets?',
      options: ['High yield', 'Low water requirement', 'Fast growth', 'No pests'],
      correctAnswer: 1,
      explanation: 'Millets require very little water compared to rice and wheat, making them sustainable crops.'
    }
  ];

  const handleAnswerClick = (selectedIndex) => {
    setSelectedAnswer(selectedIndex);
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    
    setAnsweredQuestions([
      ...answeredQuestions,
      {
        question: questions[currentQuestion].question,
        userAnswer: selectedAnswer,
        correctAnswer: questions[currentQuestion].correctAnswer,
        isCorrect
      }
    ]);

    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setAnsweredQuestions([]);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return '🎉 Perfect! You are a Millet Expert!';
    if (percentage >= 80) return '🌟 Excellent! You know your millets well!';
    if (percentage >= 60) return '👍 Good job! Keep learning!';
    return '📚 Nice try! Learn more about millets!';
  };

  if (showScore) {
    return (
      <div className="education-container">
        <div className="container">
          <div className="quiz-result">
            <h1>{getScoreMessage()}</h1>
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{score}</span>
                <span className="score-total">/ {questions.length}</span>
              </div>
            </div>
            <p>You answered {score} out of {questions.length} questions correctly!</p>

            <div className="answers-review">
              <h3>Review Your Answers</h3>
              {answeredQuestions.map((item, index) => (
                <div key={index} className={`answer-review-card ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="review-header">
                    {item.isCorrect ? (
                      <FaCheckCircle color="#4CAF50" size={24} />
                    ) : (
                      <FaTimesCircle color="#F44336" size={24} />
                    )}
                    <h4>Question {index + 1}</h4>
                  </div>
                  <p className="review-question">{item.question}</p>
                  <p className="review-answer">
                    Your answer: {questions[index].options[item.userAnswer]}
                  </p>
                  {!item.isCorrect && (
                    <p className="review-correct">
                      Correct answer: {questions[index].options[item.correctAnswer]}
                    </p>
                  )}
                  <p className="review-explanation">{questions[index].explanation}</p>
                </div>
              ))}
            </div>

            <div className="quiz-actions">
              <button onClick={restartQuiz} className="btn btn-primary">
                Try Again
              </button>
              <a href="/benefits" className="btn btn-outline">
                Learn More About Millets
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="education-container">
      <div className="container">
        <div className="quiz-container">
          <div className="quiz-header">
            <h1>🧠 Millet Knowledge Quiz</h1>
            <div className="quiz-progress">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="quiz-content">
            <h2 className="question-text">{questions[currentQuestion].question}</h2>
            
            <div className="options-grid">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${selectedAnswer === index ? 'selected' : ''}`}
                  onClick={() => handleAnswerClick(index)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary btn-large"
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;