import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { List, ListItem, Image, Text } from "@chakra-ui/react";

function App() {
  const [tracks, setTracks] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.defaults.headers["Authorization"] =
      "Bearer BQBUBffolf3o_o59jGH8b_KvRr8aTNViiQrVN4c7oflY4eJ0-Yd9-frSWXYX-GNe7vqNaZfwLNm48feiFDLMilSHN3xO7DRDGNq9KzlMkAOMbD8HVepsVC9VCvPMWCYtGE-KahR7IfMtDGoyzOGZ3WKTwDnu7zpKrZrASUhR9BR2TU1k";
    axios
      .get("https://api.spotify.com/v1/playlists/60azolBNDQWxI9vMdvU6gX", {
        header: {
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        const tracks = response.data.tracks.items;
        const unfilteredUsers = tracks.map((each) => {
          return {
            id: each.added_by.id,
            url: each.added_by.href,
          };
        });
        setTracks(tracks);
        return unfilteredUsers;
      })
      .then((unfilteredUsers) => {
        const filteredUsers = unfilteredUsers.filter((value, index, self) => {
          return self.findIndex((each) => each.id === value.id) === index;
        });
        return filteredUsers;
      })
      .then(async (filteredUsers) => {
        const userPromises = [];
        const updatedUsers = [];
        filteredUsers.forEach( (each) => {
          const user = buildUser(each);
          userPromises.push(user);
        });
         const results = await Promise.all(userPromises);
         results.forEach(user => {
            let countMusics = 0;
            tracks.forEach((track) => {
              const isSameAuthor = track.added_by.id === user.data.id;
              if (isSameAuthor) {
                countMusics++;
              }
            });
            updatedUsers.push({
              ...user.data,
              countMusics,
            });
         });
        return updatedUsers;
      })
      .then((updatedUsers) => {
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const buildUser = async (user) => {
    axios.defaults.headers["Authorization"] =
      "Bearer BQBUBffolf3o_o59jGH8b_KvRr8aTNViiQrVN4c7oflY4eJ0-Yd9-frSWXYX-GNe7vqNaZfwLNm48feiFDLMilSHN3xO7DRDGNq9KzlMkAOMbD8HVepsVC9VCvPMWCYtGE-KahR7IfMtDGoyzOGZ3WKTwDnu7zpKrZrASUhR9BR2TU1k";
    return await axios.get(user?.url, {
      header: {
        "Content-Type": "application/json",
      },
    }).then(response => response).then(data => {
      return data;
    });
  };
  return (
    <div className="App">
      <main
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <section
          style={{
            width: "80%",
          }}
        >
          <List spacing={3}>
            {users.map((each) => (
              <ListItem display="flex">
                <span>
                  <Image
                    borderRadius="full"
                    boxSize="150px"
                    src={each.images[0].url}
                    alt={each.id}
                  />
                </span>
                <div style={{
                  display: "flex",
                  flexDirection:"column",
                  justifyContent: "flex-start",
                  fontSize: "2rem",
                  marginLeft: "1rem",
                }}>
                  <Text>Nome: {each.display_name}</Text>
                  <Text align="left"> Contagem: {each.countMusics}</Text>
                </div>
              </ListItem>
            ))}
          </List>
        </section>
      </main>
    </div>
  );
}

export default App;
