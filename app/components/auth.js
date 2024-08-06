import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(auth?.currentUser?.email);

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="email..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="password..."
      />
      <button onClick={signIn}>Submit</button>
    </div>
  );
};
