import React from "react";
// import { checkNestedError } from '../../utils/common';
import styles from "./Error.module.css";

const ShowErrorMessage = ({
  errors,
  name,
  isnested,
  errorfont,
  mgLeft = 8,
}) => {
  let errorMessage = null;
  // if(isnested){
  //     errorMessage = checkNestedError(isnested, errors, name)
  // }
  return (
    <>
      {errorMessage && isnested ? (
        <p
          className={styles.error}
          style={{
            // marginLeft: 8,
            display:
              errors && Object.keys(errors).length === 0 ? "none" : "flex",
          }}
        >
          {errors && errorMessage}
        </p>
      ) : (
        <p
          className={styles.error}
          style={{
            // marginLeft: mgLeft,
            marginBottom: 0,
            fontSize: 13,
            display:
              errors && Object.keys(errors).length === 0 ? "none" : "flex",
          }}
        >
          {errors && errors[name]?.message}
        </p>
      )}
    </>
  );
};

export default ShowErrorMessage;
