import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increase, decrease } from "./counterSlice";

CounterFeature.propTypes = {};

function CounterFeature(props) {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter);

  const handleIncreaseClick = () => {
    const action = increase(); //action creator
    console.log(action);
    dispatch(action);
  };

  const handleDecreaseClick = () => {
    const action = decrease(); //action creator
    console.log(action);
    dispatch(action);
  };

  return (
    <div>
      Counter: {count}
      <div>
        <button onClick={handleIncreaseClick}>Increase</button>
        <button onClick={handleDecreaseClick}>Decrease</button>
      </div>
    </div>
  );
}

export default CounterFeature;
