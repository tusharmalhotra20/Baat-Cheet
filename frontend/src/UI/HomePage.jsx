import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import LogIn from "../components/Authentication/LogIn";
import SignUp from "../components/Authentication/SignUp";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    // if user is logged-in push it to the chats page.
    if (user) history.push("/chats");
  }, [history]);
  //container are used to make our app responsive.
  return (
    <Container maxW="xl" centerContent>
      {/*
    1. Box's default behaviour is like a div element of HTML. 
    2. Box element is used in place of divs because writing CSS using Box 
    element becomes very easy. 
  */}
      <Box
        d={"flex"}
        justifyContent={"center"}
        p={3}
        bg={"white"}
        w={"100%"}
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        color={"#424242"}
      >
        <Text fontSize={"4xl"} fontFamily={"Work sans"}>
          Baat-Cheet
        </Text>
      </Box>

      <Box
        bg={"white"}
        w={"100%"}
        p={4}
        color={"#424242"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Tabs variant="soft-rounded" colorScheme="twitter" isFitted>
          <TabList>
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LogIn />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
