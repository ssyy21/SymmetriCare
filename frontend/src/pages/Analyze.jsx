import Webcam from "react-webcam";
import axios from "axios";
import { useRef, useState, useEffect } from "react";

function Analyze() {
  const webcamRef = useRef(null);

  const [score, setScore] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const captureAndAnalyze = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const blob = await fetch(imageSrc).then(res => res.blob());

    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/analyze",
        formData
      );

      setScore(res.data.score);
      setMessages(res.data.message);

    } catch (err) {
      console.error(err);
    }
  };

  const downloadReport = async () => {
  if (!webcamRef.current) return;

  const imageSrc = webcamRef.current.getScreenshot();
  if (!imageSrc) return;

  const blob = await fetch(imageSrc).then(res => res.blob());

  const formData = new FormData();
  formData.append("file", blob, "frame.jpg");

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/generate-report",
      formData,
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "Posture_Report.pdf");

    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (err) {
    console.error(err);
  }
};

  // 🔁 Real-time loop
  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        captureAndAnalyze();
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">

      <h1 className="text-3xl font-bold mb-6">SymmetriCare</h1>

      {/* CAMERA */}
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg border border-gray-700 w-[500px]"
      />

      {/* BUTTON */}
      <div className="flex gap-4 mt-4">

  <button
    onClick={() => setIsRunning(!isRunning)}
    className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
  >
    {isRunning ? "Stop Analysis" : "Start Analysis"}
  </button>

  <button
    onClick={downloadReport}
    className="px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600"
  >
    Download Report
  </button>

</div>

      {/* RESULTS */}
      {score !== null && (
        <div className="mt-6 text-center">

          <h2
            className={`text-3xl font-bold ${
              score > 80
                ? "text-green-400"
                : score > 60
                ? "text-yellow-400"
                : "text-red-500"
            }`}
          >
            Score: {score}
          </h2>

          <div className="mt-4">
            {messages.map((msg, index) => (
              <p key={index} className="text-lg text-red-400">
                {msg}
              </p>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}

export default Analyze;























// import Webcam from "react-webcam";
// import axios from "axios";
// import { useRef, useState, useEffect } from "react";

// function Analyze() {
//   const webcamRef = useRef(null);

//   const [score, setScore] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isRunning, setIsRunning] = useState(false);
//   const [processedImage, setProcessedImage] = useState(null);

//   const captureAndAnalyze = async () => {
//     if (!webcamRef.current) return;

//     const imageSrc = webcamRef.current.getScreenshot();
//     if (!imageSrc) return;

//     const blob = await fetch(imageSrc).then(res => res.blob());

//     const formData = new FormData();
//     formData.append("file", blob, "frame.jpg");

//     try {
//       const res = await axios.post("http://127.0.0.1:8000/analyze", formData);

//       setScore(res.data.score);
//       setMessages(res.data.message);
//       setProcessedImage(res.data.image);

//     } catch (err) {
//       console.error(err);
//     }
//   };


//   const downloadReport = async () => {
//   if (!webcamRef.current) return;

//   const imageSrc = webcamRef.current.getScreenshot();
//   if (!imageSrc) return;

//   const blob = await fetch(imageSrc).then(res => res.blob());

//   const formData = new FormData();
//   formData.append("file", blob, "frame.jpg");

//   try {
//     const res = await axios.post(
//       "http://127.0.0.1:8000/generate-report",
//       formData,
//       {
//         responseType: "blob", // VERY IMPORTANT
//       }
//     );

//     // Create download link
//     const url = window.URL.createObjectURL(new Blob([res.data]));

//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "Posture_Report.pdf");

//     document.body.appendChild(link);
//     link.click();

//     link.remove();
//   } catch (err) {
//     console.error(err);
//   }
// };

//   // 🔁 REAL-TIME LOOP
//   useEffect(() => {
//     let interval;

//     if (isRunning) {
//       interval = setInterval(() => {
//         captureAndAnalyze();
//       }, 1000); // every 1 sec
//     }

//     return () => clearInterval(interval);
//   }, [isRunning]);

//   return (
//   <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center p-6">

//     {/* Card */}
//     <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col items-center">

//       {/* Title */}
//       <h1 className="text-3xl font-bold mb-4 tracking-wide">
//         SymmetriCare
//       </h1>

//             <div className="rounded-xl overflow-hidden border border-gray-700 shadow-lg relative w-[500px]">

//   {/* Hidden webcam (keeps capturing frames) */}
//   <Webcam
//     ref={webcamRef}
//     screenshotFormat="image/jpeg"
//     className="hidden"
//   />

//   {/* Display processed frames */}
//   {processedImage ? (
//     <img
//       src={`data:image/jpeg;base64,${processedImage}`}
//       className="w-full h-auto"
//     />
//   ) : (
//     <div className="flex items-center justify-center h-[300px] bg-gray-800">
//       <p className="text-gray-400">Starting camera...</p>
//     </div>
//   )}

// </div>
//       {/* Buttons */}
//       <div className="flex gap-4 mt-6">

//         <button
//           onClick={() => setIsRunning(!isRunning)}
//           className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200"
//         >
//           {isRunning ? "Stop Analysis" : "Start Analysis"}
//         </button>

//         <button
//           onClick={downloadReport}
//           className="px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition duration-200"
//         >
//           Download Report
//         </button>

//       </div>

//       {/* Loading */}
//       {loading && (
//         <p className="mt-4 text-gray-400 animate-pulse">
//           Analyzing posture...
//         </p>
//       )}

//       {/* Results */}
//       {score !== null && (
//         <div className="mt-6 text-center">

//           {/* Score Badge */}
//           <div
//             className={`text-4xl font-bold ${
//               score > 80
//                 ? "text-green-400"
//                 : score > 60
//                 ? "text-yellow-400"
//                 : "text-red-500"
//             }`}
//           >
//             {score}
//           </div>

//           <p className="text-gray-400 mt-1">Posture Score</p>

//           {/* Messages */}
//           <div className="mt-4 space-y-2">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className="bg-red-500/10 border border-red-400 text-red-300 px-4 py-2 rounded-lg"
//               >
//                 {msg}
//               </div>
//             ))}
//           </div>

//         </div>
//       )}

//     </div>
//   </div>
// );
// }

// export default Analyze;