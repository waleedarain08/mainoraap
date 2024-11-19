import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore,doc,getDocs, collection , updateDoc, addDoc , arrayUnion} from "firebase/firestore"; 


const firebaseConfig = {
  apiKey: "AIzaSyBZhcOnULEZxBgdYrL9gGTNtq7zPymnJqg",
  authDomain: "scrapbook-c65ed.firebaseapp.com",
  projectId: "scrapbook-c65ed",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ScrapbookApp = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [name, setName] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState('');

  useEffect(() => {
   async function fetchData() {
      const data =  [];
      const q = collection(db, "questions");
      const querySnapshot =  await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });      
      setQuestions(data);
    }
    fetchData(); 
  }, [answer]);

  const handleAddQuestion = async() => {
    try {
      const newDoc = await addDoc(collection(db, 'questions'), {
        question: newQuestion,
        answers: [],
         });
         console.log(newDoc.id);
         setQuestions((prevQuestions) => [
          ...prevQuestions,
          { id: newDoc.id, question: newQuestion, answers: [] },
        ]);
        setNewQuestion('');
    } catch(err) {
      console.error("writeToDB failed. reason :", err)
    }
  };

  const handleAddAnswer = async(question) => {  
    if(name===""){
      alert("Please Enter Your Name");
    }else{
    setSelectedQuestionId(question.id);  
   // console.log(name,answer)
    try {
      console.log(selectedQuestionId);
      await updateDoc(doc(collection(db, "questions"), question.id), {
        answers: arrayUnion({ name, answer }),
      });
      setAnswer('');
      //setName('')
    } catch(err) {
      console.error("writeToDB failed. reason :", err)
    }
  }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Main Aur Aap</h1>
      <div className="flex flex-col mb-4" >
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Add a new question"
          className="p-2 border border-gray-300 rounded-lg mb-2"
        />
        <button
          onClick={handleAddQuestion}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add Question
        </button>
      </div>
      <h5>Your Name</h5>
      <input
       // style={{marginTop:"3%",marginLeft:"5%",marginBottom:"1%"}}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Your Name"
        className="p-2 border border-gray-300 rounded-lg mb-4"
      />
      <ul>
        {questions.map((question) => (
          <li key={question.id} className="mb-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">{question.question}</h2>
            </div>
            <ul>
              {question.answers.map((answer, index) => (
                <li key={index} className="mb-2">
                  <p>
                    <span className="font-bold">{answer.name}:</span> {answer.answer}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex flex-col">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer"
                className="p-2 border border-gray-300 rounded-lg mb-2"
              />
              <button
                onClick={() => {
                  handleAddAnswer(question);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Add Answer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScrapbookApp;