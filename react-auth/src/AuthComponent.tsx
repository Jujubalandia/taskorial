import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Card,
  Table
} from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import Home from "./Home";
import {NavBar} from "./NavBar";

const cookies = new Cookies();
const token = cookies.get("TOKEN");

export default function AuthComponent() {
  const [message, setMessage] = useState("");
  const [page, setPage] = useState("Home");
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState<Array<any>>([]);

  useEffect(() => {
    const configuration = {
      method: "get",
      url: process.env.REACT_APP_API_URL + "auth-endpoint",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(configuration)
      .then((result) => {
        setMessage(result.data.message);
      })
      .catch((error) => {
        error = new Error();
      });

    getTasks();
  }, []);

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    window.location.href = "/";
  };

  const makeTask = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    let obj = JSON.parse(atob(token.split(".")[1]));
    let name = task;
    let completed = false;
    let userId = obj.userId;

    const configuration = {
      method: "post",
      url: process.env.REACT_APP_API_URL + "tasks",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name,
        completed,
        userId,
      },
    };

    setTask("");

    axios(configuration)
      .then((result) => {
        getTasks();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTasks = () => {
    const configuration = {
      method: "get",
      url: process.env.REACT_APP_API_URL + "tasks",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(configuration)
      .then((result) => {
        let res = result.data.result;
        setTaskList([...res].reverse());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const completeTasks = (taskName: String) => {
    let name = taskName
    const configuration = {
      method: "put",
      url: process.env.REACT_APP_API_URL + "tasks",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name,
      }
    };

    axios(configuration)
      .then((result) => {
        getTasks();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const deleteTasks = (taskName: String) => {
    let name = taskName
    const configuration = {
      method: "delete",
      url: process.env.REACT_APP_API_URL + "tasks",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name,
      }
    };

    axios(configuration)
      .then((result) => {
        getTasks();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <NavBar currPage={page} logoutFC={logout}/>

      {/* <h3 className="text-center">{message}</h3> */}

      <Container>
        <Home />

        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card>
              <Card.Body>
                <Card.Title className="text-center">My Tasks</Card.Title>

                <br />

                <Form onSubmit={makeTask}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      onChange={(e) => setTask(e.target.value)}
                      value={task}
                      placeholder="Enter task name"
                    />
                  </Form.Group>
                </Form>

                <p>Incomplete</p>
                <Table hover>
                  <tbody>
                    {taskList.map((t) => (
                      !t.completed && <tr key={t._id}>
                        <td onClick={() => completeTasks(t.name)}>{t.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <p>Completed</p>
                <Table hover>
                  <tbody>
                    {taskList.map((t) => (
                      t.completed && <tr key={t._id}>
                        <td onClick={() => completeTasks(t.name)}>{t.name}</td>
                        <td className="text-end" onClick={() => deleteTasks(t.name)}><Button variant="danger">X</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

              </Card.Body>
            </Card>

            <br />
            <br />
          </Col>

          {/* <Col xs={12} sm={12} md={6} lg={6}>
            <Card>
              <Card.Body>
                <Card.Title>Placeholder Title</Card.Title>
                <Card.Text>Placeholder Content</Card.Text>
              </Card.Body>
            </Card>
          </Col> */}
        </Row>
      </Container>
    </>
  );
}
