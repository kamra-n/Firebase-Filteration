import { Typography } from "antd";
import { Divider } from "antd";
import { Button, Form, Input, Select, List } from "antd";
import { Card, Space } from "antd";
import { db } from "./firebase.config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  limit,
  orderBy,
  startAfter,
} from "firebase/firestore";

import { useEffect, useState } from "react";
import "./App.css";
function App() {
  const [loading, setLoading] = useState(false);
  const [pagenumLeft, setPageNumLeft] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const { Title } = Typography;
  const [moviename, setMovieName] = useState("");
  const [movieYear, setmovieYear] = useState("");
  const [movieCategory, setmovieCategory] = useState("");
  const [categories, setAllCategories] = useState([]);
  const [getCat, setGetCat] = useState("");
  const [moviesList, setMoviesList] = useState([]);

  // get Category data from firebase
  console.log('moviesList',moviesList)
  console.log([pagenumLeft])

  useEffect(() => {
    const getCategoriesList = async () => {
      const moviesCollectionRef = collection(db, "Categories");
      try {
        const data = await getDocs(moviesCollectionRef);
        const Categories = data.docs.map((doc) => ({
          ...doc.data(),
        }));
        setAllCategories(Categories);
      } catch (e) {
        console.log(e);
      }
    };
    getCategoriesList();
  }, []);
  // add data to firebase
  const onSubmitHandler = async () => {
    console.log("submit ho rha hun");
    console.log(movieCategory);

    try {
      const movieObj = {
        moviename: moviename,
        movieyear: movieYear,
        movieCategory: movieCategory,
      };

      console.log(movieObj);

      const docRef = await addDoc(collection(db, "Movies"), movieObj);

      console.log("Document written with ID: ", docRef.id);
      setMovieName('');
      setmovieCategory('');
      setmovieYear('');

      alert("data Add successfully");
      // getMoviesList();
        getFilterCategory();

    } catch (e) {
      console.log(e);
    }
  };

  // get Movies Based on selected Category

  const getFilterCategory = async () => {
    try {
      const q = query(
        collection(db, "Movies"),
        where(`movieCategory`, "==", `${getCat}`),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const allMovies = [];
      querySnapshot.forEach((doc) => {
        console.log("doc", doc);
        allMovies.push(doc.data());
        setMoviesList(allMovies);
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastDoc(lastVisible);
      });
    } catch (e) {
      console.log(e);
    }
  };

  // get more movies when requested
  const fetchMore = async () => {
    // console.log('isCollectionEmpty',isCollectionEmpty) 
    try {
      const q = query(
        collection(db, "Movies"),
        where(`movieCategory`, "==", `${getCat}`),
        startAfter(lastDoc),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const allNewMovies = [];
      querySnapshot.forEach((doc) => {
        allNewMovies.push(doc.data());
      });

      const s = query(
        collection(db, "Movies"),
        where(`movieCategory`, "==", `${getCat}`)
      );
      const Movielenght = await getDocs(s);

      console.log('movie',Movielenght.size)
      if(moviesList.length === Movielenght.size){
      return  setPageNumLeft(true)
      }

      else{

        setMoviesList([...moviesList, ...allNewMovies]);
      }

    } catch (e) {
      console.log("e", e);
    }
  };

  // run when user request for new category
  useEffect(() => {
    getFilterCategory();
  }, [getCat]);



  // check data is left in firebase

  const isLeft = ()=>{

  }
  // console.log("filterList", filterList);
  // let uniquieCat = alldata &&  [...new Set(alldata)];
  // console.log('uniquieCat',uniquieCat)

  // const unique = [
  //   ...new Map(alldata?.map((item) => [item["movieCategory"], item])).values(),
  // ];
  return (
    <>
      <Title>Movies Data</Title>
      <Divider />

      <Space direction="vertical" size={16}>
        <Card
          style={{
            width: 600,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0px,auto",
          }}
        >
          <Form onFinish={onSubmitHandler} autoComplete="off">
            <Form.Item
              label="Movie Name"
              name="moviename"
              rules={[
                {
                  required: true,
                  message: "Please input your movie name!",
                },
              ]}
            >
              <Input onChange={(e) => setMovieName(e.target.value)} />
            </Form.Item>

            <Form.Item
              label="Movie year"
              name="Movie year"
              rules={[
                {
                  required: true,
                  message: "Please input your Movie Year!",
                },
              ]}
            >
              <Input
                onChange={(e) => {
                  setmovieYear(e.target.value);
                }}
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Select
                defaultValue="Select a Category"
                onChange={(value) => {
                  setmovieCategory(value);
                }}
              >
                {categories.map(({ category }, i) => {
                  return (
                    <Select.Option value={category} key={i}>
                      {category}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Add Movie
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>

      <Divider />

      <Card style={{ width: 1000 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "5rem",
            alignItems: "center",
            margin: "0px,auto",
          }}
        >
          {categories?.map(({ category }, id) => {
            return (
              <Button key={id} onClick={() => setGetCat(category)}>
                {category}
              </Button>
            );
          })}
        </div>
      </Card>

      <Divider />

      <Title level={2}>Movies List</Title>

      <Divider />

      <List
        bordered
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
        }}
        dataSource={moviesList}
        renderItem={(item, index) => (
          <>
            <div
              key={index}
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <List.Item>{item.moviename}</List.Item>
              <List.Item>{item.movieyear}</List.Item>
              <List.Item>{item.movieCategory}</List.Item>
            </div>
          </>
        )}
      />
      {moviesList.length === 0 && lastDoc === null ? (
        <></>
      ) : (
       pagenumLeft ? <Button>There is no Data left to load</Button> :  <Button
          onClick={() => {
            fetchMore();
          }}
        >
          LoadMore
        </Button>
      )}
    </>
  );
}

export default App;
