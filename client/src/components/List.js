import { Droppable } from "react-beautiful-dnd";
import { useState } from "react";
import Task from "./Task";
import "../styles/List.scss";
import AddTask from "./AddTask";
import requests from "../requests";

function List({
  list,
  listData,
  getUserInfo,
  index,
  setListData,
  userData,
  setShowTimer,
}) {
  const [addingTask, setAddingTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [intervals, setIntervals] = useState(0);

  const openAddTaskForm = async () => {
    if (addingTask) {
      await setAddingTask(false);
      await setTaskName("");
    } else setAddingTask(true);
  };

  const addUserTask = async (e) => {
    e.preventDefault();
    if (taskName === "") return;
    await requests.addTask(list.id, taskName, intervals);
    await getUserInfo();
    await setTaskName("");
    await setAddingTask(false);
  };

  const startTask = async (taskIndex) => {
    //front end changes
    let listCopy = JSON.parse(JSON.stringify(listData));
    const task = listCopy[index].Tasks[taskIndex];
    listCopy[index].Tasks.splice(taskIndex, 1);
    listCopy[1].Tasks.unshift(task);
    await setListData(listCopy);
    await setShowTimer(true);

    //backend changes
    await requests.deleteTask(task.id);
    await requests.addTask(listCopy[1].id, task.name, task.intervals, true);
  };

  return (
    <div
      key={list.id}
      className="list-container"
      // style={{ alignText: "center", margin: "10px" }}
    >
      <Droppable droppableId={list.id}>
        {(provided, snapshot) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="list"
              style={{
                // background: snapshot.isDraggingOver && "rgb(184, 226, 251)",
                background: snapshot.isDraggingOver && "rgb(215, 236, 250)",
                // background: snapshot.isDraggingOver && "rgb(229, 188, 160)",
              }}
            >
              <h3>{list.name}</h3>
              {list.Tasks.map((task, i) => {
                return (
                  <Task
                    task={task}
                    index={i}
                    listIndex={index}
                    setListData={setListData}
                    listData={listData}
                    key={task.id}
                    startTask={startTask}
                  />
                );
              })}
              {provided.placeholder}
              <div className="list-option-btns">
                <AddTask
                  addingTask={addingTask}
                  openAddTaskForm={openAddTaskForm}
                  addTask={addUserTask}
                  taskName={taskName}
                  setTaskName={setTaskName}
                  setAddingTask={setAddingTask}
                  userData={userData}
                  setIntervals={setIntervals}
                  intervals={intervals}
                />
                {list.name === "completed" && !addingTask && (
                  <button className="clear-list-btn">clear list</button>
                )}
              </div>
            </div>
          );
        }}
      </Droppable>
    </div>
  );
}

export default List;