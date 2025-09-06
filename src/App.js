import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h2>OTP component in React.js</h2>
      <div className="otp-root">
        <OTP />
      </div>
      <span className="subtitle">Try: 12345</span>
      <div className="features">
        <span>⌨️ Keyboard navigation</span>
        <span>📋 Paste support</span>
      </div>
    </div>
  );
}

function OTP({ otpLength = 5 }) {
  const {
    inputArr,
    inputArrRefs,
    onPasteHandler,
    onChangeHandler,
    onKeyDownHandler,
  } = useOTP(otpLength);

  return inputArr.map((value, i) => {
    const name = `Digit for ${i + 1} of ${otpLength}`;
    return (
      <input
        key={i}
        ref={(el) => {
          return (inputArrRefs.current[i] = el);
        }}
        tabIndex={i}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        onPaste={onPasteHandler}
        type={"text"}
        inputMode="numeric"
        pattern="[0-9]"
        className="otp-input"
        name={name}
        aria-label={name}
        value={value}
      />
    );
  });
}

function useOTP(otpLength) {
  const [inputArr, setInputArr] = useState(new Array(otpLength).fill(""));
  const inputArrRefs = useRef([]);

  useEffect(() => {
    // auto focus
    inputArrRefs.current[0]?.focus();
  }, []);

  const onChangeHandler = (e) => {
    const value = e.target.value;
    if (value && isNaN(value)) {
      return;
    }
    const newArr = [...inputArr];
    const index = e.target.tabIndex;
    newArr[index] = value.slice(-1);
    setInputArr(newArr);
    // set next input to focus
    if (value) {
      inputArrRefs.current[index + 1]?.focus();
    }
  };

  const onKeyDownHandler = (e) => {
    const key = e.key;
    const index = e.target.tabIndex;
    switch (key) {
      case "Backspace":
        if (!inputArr[index]) {
          inputArrRefs.current[index - 1]?.focus();
          const newArr = [...inputArr];
          newArr[index - 1] = "";
          setInputArr(newArr);
        }
        break;
      case "ArrowLeft":
        inputArrRefs.current[index - 1]?.focus();
        break;
      case "ArrowRight":
        inputArrRefs.current[index + 1]?.focus();
        break;
      default:
        break;
    }
  };

  const onPasteHandler = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const charArr = pastedData.split("");
    const isNumberStr = charArr.every((item) => !isNaN(item));
    if (!isNumberStr) {
      return;
    }
    const newArr = [...inputArr];
    charArr.forEach((item, i) => (newArr[i] = item));
    setInputArr(newArr);
    console.log(pastedData);
  };

  return {
    inputArr,
    inputArrRefs,
    onChangeHandler,
    onKeyDownHandler,
    onPasteHandler,
  };
}
