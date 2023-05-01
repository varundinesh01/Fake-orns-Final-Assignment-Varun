import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

function App() {
  const [dailyContribution, setDailyContribution] = useState(20);
  const [myAge, setMyAge] = useState(25);
  const [interestRate, setInterestRate] = useState(2);
  const interestRateDec = interestRate / 100;
  const yearsElapsed = 75 - myAge;
  const containerHeight = 400;

  const handleSliderChange = (event) => {
    setDailyContribution(parseInt(event.target.value, 10));
  };

  const handleAgeChange = (event) => {
    setMyAge(parseInt(event.target.value, 10));
  };

  function handleInterestRateChange(event) {
    setInterestRate(parseFloat(event.target.value));
  }

  const data = [];

  for (let index = 0; index < yearsElapsed; index++) {
    const previous = data[index - 1] || { principal: 0 };
    const principal = previous.principal + dailyContribution * 365;
    const n = index + 1;
    const interest = Math.round(
      principal * Math.pow(1 + interestRateDec, n) - principal
    );

    data.push({ year: index + 1, principal, interest });
  }

  const barWidth = 5;
  const margin = 5;

  // const maxPrincipal = Math.max(...data.map((item) => item.principal));
  // const maxInterest = Math.max(...data.map((item) => item.interest));
  // const maxBarHeight = Math.max(maxPrincipal, maxInterest);
  // const barHeightFactor = (maxPrincipal / maxInterest) * 0.0003;
  const maxPrincipal = Math.max(...data.map((item) => item.principal));
  const maxInterest = Math.max(...data.map((item) => item.interest));
  const maxTotal = Math.max(maxPrincipal + maxInterest);

  const barHeightFactor = (containerHeight + dailyContribution) / maxTotal;

  const [selectedBar, setSelectedBar] = useState(15);
  const containerRef = useRef(null);
  const controls = useAnimation(); // Initialize the animation control
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e) => {
    const containerRect = containerRef.current.getBoundingClientRect();

    const offsetX = e.pageX - containerRect.left - 50; //50px padding on the left
    const nearestBarIndex = Math.min(
      Math.max(Math.round(offsetX / (barWidth + margin) - 1), 0),
      data.length - 1
    );
    setSelectedBar(nearestBarIndex);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleDrag(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleDrag(e);
    }
  };

  useEffect(() => {
    if (selectedBar !== null) {
      // Update the orb position with a smooth animation
      controls.start({
        left: `${50 + selectedBar * (margin + barWidth) - barWidth}px`,
        bottom: `${
          50 +
          (data[selectedBar].principal + data[selectedBar].interest) *
            barHeightFactor -
          12
        }px`,
        transition: { duration: 0.2, ease: "easeOut" } // Customize the animation duration and easing
      });
    }
  }, [selectedBar, controls]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "50px" }}>Investment Calculator </h1>
      <div style={{ marginBottom: "20px", fontFamily: "Arial, sans-serif" }}>
        <label htmlFor="daily-contribution">
          My Daily Contribution : ${dailyContribution}
        </label>
        <input
          type="range"
          id="daily-contribution"
          name="daily-contribution"
          min="1"
          max="50"
          value={dailyContribution}
          onChange={handleSliderChange}
          style={{
            width: "90%",
            height: "10px",
            borderRadius: "5px",
            backgroundColor: "#ddd",
            appearance: "none"
          }}
        />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="my-age">My Age: </label>
        <input
          type="number"
          id="my-age"
          name="my-age"
          value={myAge}
          onChange={handleAgeChange}
          style={{
            padding: "5px",
            fontSize: "16px",
            border: "2px solid #ddd",
            borderRadius: "5px",
            width: "90%"
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="interest-rate">Interest Rate (0.0% - 5.0%): </label>
        <input
          type="number"
          id="interest-rate"
          name="interest-rate"
          min="0.01"
          max="5"
          step="0.01"
          value={interestRate}
          onChange={handleInterestRateChange}
          style={{
            padding: "5px",
            fontSize: "16px",
            border: "2px solid #ddd",
            borderRadius: "5px",
            width: "90%"
          }}
        />
      </div>

      <div
        ref={containerRef}
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-end",
          height: `${containerHeight}px`,
          width: `${data.length * (barWidth + margin)}px`,
          position: "relative",
          backgroundColor: "#fdf0d5",
          paddingTop: "100px",
          paddingRight: "50px",
          paddingLeft: "50px",
          paddingBottom: "50px"
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div style={{ position: "absolute", bottom: "10px" }}>Age</div>
        <div
          style={{
            position: "absolute",
            right: "10px",
            top: "250px",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
            transformOrigin: "50% 50%",
            justifyContent: "center"
          }}
        >
          Investment
        </div>

        {selectedBar !== null && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "15px",
              zIndex: 2,
              fontFamily: "Arial, sans-serif", // Add the desired font family
              fontSize: "16px" // Adjust the font size as needed
            }}
          >
            <div>Age = {(selectedBar + myAge + 1).toFixed(0)}</div>
            <div>Principal = $ {data[selectedBar].principal.toFixed(2)}</div>
            <div>Interest = $ {data[selectedBar].interest.toFixed(2)}</div>
            <div style={{ fontWeight: "bold" }}>
              Total = ${" "}
              {(
                data[selectedBar].interest + data[selectedBar].principal
              ).toFixed(2)}
            </div>
          </div>
        )}
        {data.map((item, index) => (
          <div key={index} style={{ marginLeft: margin }}>
            <div
              style={{
                height: item.interest * barHeightFactor,
                width: barWidth,
                backgroundColor: "#669bbc",
                boxShadow:
                  index === selectedBar ? "0 0 7px 2px #c1121f" : "none"
              }}
              animate={controls}
            ></div>

            <div
              style={{
                height: item.principal * barHeightFactor,
                width: barWidth,
                backgroundColor: "#003049",
                boxShadow:
                  index === selectedBar ? "0 0 7px 2px #c1121f" : "none"
              }}
            ></div>
            <div>
              {((index + 1) % 10 === 0 || index === 0) &&
              index !== selectedBar ? (
                <div
                  style={{
                    position: "absolute",
                    bottom: "32px",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "10px"
                  }}
                >
                  {index + 1 + myAge}
                </div>
              ) : null}
            </div>

            <div>
              {index === selectedBar ? (
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: "32px",
                    //left: "50%",
                    //transform: "translateX(-50%)",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "14px"
                  }}
                  animate={{ y: 10 }}
                >
                  {index + 1 + myAge}
                </motion.div>
              ) : null}
            </div>
          </div>
        ))}
        {selectedBar !== null && (
          <motion.div
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              width: `${barWidth * 4}px`,
              height: `${barWidth * 4}px`,
              backgroundColor: "transparent",
              border: "2px solid #c1121f",
              borderRadius: "50%"
            }}
            animate={controls} // Bind the animation control to the motion.div
          ></motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
