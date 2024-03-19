import "./App.css";
import React, { useRef, useState } from "react";

//Firebase SDK
import { initializeApp } from "firebase/app";

// Firebase services
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// react-firebase-hooks
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, query, orderBy, limit, addDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7sQdW-E0vMVt4c0HHv0u_FxXESgQo4EY",
  authDomain: "superchat-54c03.firebaseapp.com",
  projectId: "superchat-54c03",
  storageBucket: "superchat-54c03.appspot.com",
  messagingSenderId: "276198539763",
  appId: "1:276198539763:web:38a93949cff78c05d0d286",
  measurementId: "G-BBZBK7QYBY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

//
function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h2> Welcome to React Chat Application</h2>
        <SignOut />
      </header>

      <section> {user ? <ChatRoom /> : <SignIn />} </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <div style={{ align: "centre" }}>
        <div style={{ paddingTop: 120, fontSize: 28 }}>
          --------------------- App Guidelines ---------------------
        </div>
        <div style={{ padding: 10 }}>Do not use any abusive language !</div>
        <div style={{ padding: 10 }}>
          Do not share any inappropriate content !
        </div>
        <div style={{ padding: 10 }}>
          Do not share any personal information here !
        </div>

        <div style={{ padding: 10 }}>
          Do not breach the community standards or you will be permanently
          banned !
        </div>
        <div>
          ----------------------------------------------------------------------------------------
        </div>
      </div>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();
  // Construct the Firestore query
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("createdAt"), limit(100));

  // Use the Firestore query with useCollectionData hook
  const [messages] = useCollectionData(q, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    // Add a new document to the "messages" collection
    await addDoc(messagesRef, {
      text: formValue,
      createdAt: new Date(),
      uid,
      photoURL,
    });

    setFormValue("");

    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type something if U are a Human 💦💦💦"
        />

        <button type="submit" disabled={!formValue}>
          ✔
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
          alt="user"
        />
        <div>{text}</div>
      </div>
    </>
  );
}

export default App;
