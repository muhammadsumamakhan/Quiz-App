import './App.css';
import axios from "axios"; 
import { useEffect, useState } from "react";

function App() {
    const [questions, setQuestions] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null); 
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const [score, setScore] = useState(0); 
    const [userName, setUserName] = useState(""); 
    const [quizStarted, setQuizStarted] = useState(false); 

    useEffect(() => {
        axios('https://the-trivia-api.com/v2/questions')
            .then((res) => {
                console.log(res.data);
                setQuestions(res.data);
                shuffleAndSetAnswers(res.data[0]); 
            })
            .catch((err) => {
                console.log(err); 
            });
    }, []);

    const shuffleAndSetAnswers = (question) => {
        const answers = [question.correctAnswer, ...question.incorrectAnswers];
        const shuffled = answers.sort(() => Math.random() - 0.5);
        setShuffledAnswers(shuffled);
        setSelectedAnswer(null); 
    };

    const nextQuestion = () => {
        if (selectedAnswer === questions[currentIndex].correctAnswer) {
            setScore(score + 1); 
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            shuffleAndSetAnswers(questions[currentIndex + 1]); 
        } else {
            alert("End reached of questions");
        }
    };

    const isQuizFinished = questions && currentIndex === questions.length - 1;

    const startQuiz = () => {
        if (userName.trim() !== "") {
            setQuizStarted(true);
        } else {
            alert("Please enter your name to start the quiz.");
        }
    };

    return (
        <div className="container">
            <h1>Quiz App</h1>
            {!quizStarted ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <button onClick={startQuiz}>Start Quiz</button>
                </div>
            ) : (
                <div>
                    {questions ? 
                    isQuizFinished ? 
                    (
                        <div className="quiz-finished">
                            <h1>Quiz Finished!</h1>
                            <p>{userName}, your Score: {score} / {questions.length}</p>
                            {score / questions.length >= 0.5 ? 
                            ( 
                                <p className="pass-message">Congratulations! You passed the quiz.</p>
                            ) 
                            : 
                            (
                                <p className="fail-message">Sorry, you failed the quiz. Better luck next time!</p>
                            )}
                        </div>
                    ) 
                    : 
                    (
                        <div>
                            <h1 className="question">Q{currentIndex + 1}: {questions[currentIndex].question.text}</h1>
                            {shuffledAnswers.map((item, index) => (
                                <div key={index}>
                                    <input 
                                        type="radio" 
                                        name="question" 
                                        value={item} 
                                        id={`answer-${index}`} 
                                        checked={selectedAnswer === item} 
                                        onChange={() => setSelectedAnswer(item)} 
                                    />
                                    <label htmlFor={`answer-${index}`}>{item}</label>
                                </div>
                            ))}
                            <button onClick={nextQuestion}>Next</button>
                        </div>
                    ) 
                    : 
                    <h1>Loading...</h1>}
                </div>
            )}
        </div>
    );
}

export default App;
