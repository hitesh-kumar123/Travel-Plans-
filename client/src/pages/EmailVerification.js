import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EmailVerification() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/auth/verify-email/${token}`)
      .then((res) => {
        setMessage(res.data.msg);
      })
      .catch((err) => {
        setMessage(err.response?.data?.msg || "Verification failed");
      });
  }, [token]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>{message}</h2>
    </div>
  );
}
