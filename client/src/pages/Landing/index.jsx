import Login from "components/Auth/Login";
import Signup from "components/Auth/Signup";
import styles from "./Landing.module.scss";
import taskStyle from "../Dashboard/components/styles/Task.module.scss";
import { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import LoadingServer from "components/LoadingServer";
import edit from "images/edit.svg";
import clock from "images/clock.svg";

const backgroundUrl =
  "https://images.unsplash.com/photo-1615552713642-73c367c8915c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1681&q=80";

function Landing({ isLoggedIn }) {
  const [registered, setRegistered] = useState(true);
  const [serverAwake, setServerAwake] = useState(false);

  async function wakeServer() {
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/wakeserver`
      );
      if (res) {
        await setServerAwake(true);
        await isLoggedIn();
      }
    } catch {
      console.log("Sorry, something went wrong :(");
    }
  }
  useEffect(() => {
    wakeServer();
    document.body.style.backgroundImage = `url(${backgroundUrl})`;
  }, []);

  return (
    <>
      {serverAwake ? (
        <main>
          <div className={styles.wrapper}>
            <div className={styles.container}>
              {registered ? (
                <Login setRegistered={setRegistered} />
              ) : (
                <Signup setRegistered={setRegistered} />
              )}
              <div className={styles.taskContainer}>
                <div className={taskStyle.taskbox}>
                  <div className={taskStyle.header}>
                    <div className={taskStyle.title}>Make things happen</div>
                  </div>
                  <div className={taskStyle.notes}>
                    kanban board + pomodoro timer
                    <p>
                      <strong>To get a better handle on your day:</strong>
                    </p>
                    <p>
                      Use this handy tool to split your work into tasks and
                      consider how long each should take to <br />
                      complete.
                    </p>
                  </div>
                  <div className={taskStyle.options}>
                    <button className={taskStyle.optionBtn}>
                      <img
                        src={edit}
                        className={taskStyle.edit}
                        alt="edit"
                      ></img>
                    </button>
                    <button className={taskStyle.delete}>✕</button>

                    <div className={styles.time}>
                      <button>
                        <img
                          src={clock}
                          className={taskStyle.edit}
                          alt="clock"
                        ></img>
                      </button>
                    </div>
                    <span className={taskStyle.intervals}>0/12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <div className={styles.loadingContainer}>
          <LoadingServer />
        </div>
      )}
    </>
  );
}

export default withRouter(Landing);
