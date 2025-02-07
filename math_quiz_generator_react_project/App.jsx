import React from "react"
import { nanoid } from "nanoid"
import CheckAnswerButton from "./components/CheckAnswerButton"
import GetNewProblemButton from "./components/GetNewProblemButton"
import StartButton from "./components/StartButton"

export default function App() {
    // --- State Variables ---
    // State variables hold data that can change and cause the component to re-render

    const [mathProblem, setMathProblem] = React.useState(getRandomProblem)
    const [currentResponse, setCurrentResponse] = React.useState("")
    const [recentCorrectAnswer, setRecentCorrectAnswer] = React.useState(false)
    const [recentStatusChange, setRecentStatusChange] = React.useState(false)
    const [answerStatus, setAnswerStatus] = React.useState("")
    const [gameStarted, setGameStarted] = React.useState(false)
    
    // --- Helper Functions ---

    function getRandomProblem() {
        // Generates a random math problem
        const firstNum = getRandomNumber(10)
        let secondNum = getRandomNumber(10)
        const operator = getRandomOperator()
        // Special case: Prevent division by zero
        if (operator === "÷" && secondNum === 0) {
            secondNum = 1 + getRandomNumber(9)
        }
        const mathProblem = {
            string: `${firstNum} ${operator} ${secondNum} =`,
            answer: getCorrectAnswer(firstNum, secondNum, operator).toFixed(2),
            submittedResponse: undefined,
        }
        return mathProblem
    }

    function getNewProblem() {
        // Resets the game with a new problem
        setAnswerStatus("")
        setCurrentResponse("")
        setMathProblem(getRandomProblem)
    }

    function getCorrectAnswer(firstNum, secondNum, operator) {
         // Calculates the correct answer
        const x = firstNum
        const y = secondNum
        if (operator === "+") {
            return x + y
        } else if (operator === "-") {
            return x - y
        } else if (operator === "x") {
            return x * y
        } else {
            return x / y
        }
    }

    function getAnswerStatus(num) {
        // Determines the feedback message based on the user's answer
        if (num < mathProblem.answer) {
            return "Too Low."
        } else if (num > mathProblem.answer) {
            return "Too High."
        } else if (num == mathProblem.answer) {
            return "Correct!"
        } else {
            return "Invalid Input."
        }
    }

    function getRandomNumber(maximum) {
        return Math.round(Math.random() * maximum)
    }

    function getRandomOperator() {
        const operators = ["+", "-", "x", "÷"]
        return operators[getRandomNumber(3)] // Index 3 is inclusive
    }

    function updateResponse(e) {
        setCurrentResponse(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault() // Prevent the form from submitting normally
        let userAnswer = +(+currentResponse).toFixed(2) // Convert to a number
        setMathProblem((prevData) => ({
            ...prevData,
            submittedResponse: userAnswer,
        }))
        setAnswerStatus(() => getAnswerStatus(userAnswer))
        setRecentStatusChange(true)
        if (mathProblem.answer == userAnswer) {
            setRecentCorrectAnswer(true)
        }
    }

    React.useEffect(() => {
        let timeOut
        if (recentCorrectAnswer) {
            timeOut = setTimeout(() => {
                setRecentCorrectAnswer(false)
                getNewProblem()
            }, 2000)
        }
        return () => clearTimeout(timeOut)
    }, [recentCorrectAnswer])

    // --- useEffect hooks for side effects ---
    React.useEffect(() => {
        let timeOut
        if (recentStatusChange) {
            timeOut = setTimeout(() => {
                setRecentStatusChange(false)
            }, 2000)
        }
        return () => clearTimeout(timeOut) // Clean up timer
    }, [recentStatusChange])

    // --- Styling and Conditional Rendering ---
    let inputClass = gameStarted ? "" : "hidden "// Dynamically control input visibility

    if (answerStatus === "Correct!") {
        inputClass += "input-accepted" // Add style for correct answers
    }
    
    const messageClass = answerStatus
        .toLowerCase()
        .split(" ")
        .join("-")
        .slice(0, -1)

    // Create button components
    const gamePlayButtons = [
        <GetNewProblemButton
            disabled={recentCorrectAnswer}
            clickHandler={getNewProblem}
            key={nanoid()}
        />,
        <CheckAnswerButton disabled={recentCorrectAnswer} key={nanoid()} />,
    ]

    const startButton = (
        <StartButton clickHandler={() => setGameStarted(true)} />
    )
    
    function showStates() {
        
        const states = {
            mathProblem, 
            currentResponse, 
            recentCorrectAnswer, 
            recentStatusChange, 
            answerStatus, 
            gameStarted
        }
        
        const line = "-----------------------------" 
        const space = "‎ "    
        const timeStamp = (new Date).toLocaleTimeString() 
        
        for (const state in states) {
            
            if (states[state] === mathProblem) {
                console.log(space)
                console.log(line)
                console.log(`States as of ${timeStamp}`)
                console.log(space)
            } 
            
            const value = states[state] === "" ? `""` 
                : typeof states[state] === "object" ? stringify(states[state]) 
                : states[state]
            
            function stringify(obj) {
                const string = Object.entries(obj)
                    .map(([key, value]) => {
                        const parsedValue = typeof value === "undefined" ? value : `"${value}"`
                        return `${key}: ${parsedValue}`})
                    .join(', ')
                return `{${string}}`
            } 
            
            console.log(state + " = " + value)
        
            if (state !== "gameStarted") {
                console.log(space)
            }
        } 
    }
    
    // --- JSX: The structure of the User Interface ---
    return (
        <div className="wrapper">  
     
            { !gameStarted && <h1>Math-o-Matic</h1> }

            <form onSubmit={handleSubmit}>
            
                <label>
                    { gameStarted && <div className="problem-container">{mathProblem.string}</div>}
                    <input 
                        type="number" 
                        name="value"
                        placeholder="?"
                        onChange={updateResponse}
                        value={currentResponse}
                        className={inputClass}
                        autoComplete="off"
                        required
                    />
                </label>
                       
                <div className={`message-container ${messageClass}`}>
                    {recentStatusChange && answerStatus}
                </div>
                
                <div className="button-container">
                    {gameStarted ? gamePlayButtons : startButton }
                </div>
                
            </form>
        </div>
  )
}