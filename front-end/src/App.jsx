import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import UserLocationMap from "./components/map";
import Login from "./components/Login";
import { AuthProvider } from "./components/AuthProvider";
import Home from "./components/Home";
import Discussion from "./components/Discussion";
import VolunteeringRequest from "./components/VolunteeringRequest";
import LinkVerify from "./components/LinkVerify";
import FillSchemeDetails from "./components/FillSchemeDetails";
import SearchVolunteer from "./components/searchVolunteer";
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Home/>}/>
          <Route path="chatbot" element={<Chatbot/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/map" element={<UserLocationMap/>}/>
          <Route path="/home/discussion_forum" element={<Discussion/>}/>
          <Route path="/home/vol-req" element={<VolunteeringRequest/>}/>
          <Route path="/home/link-verify" element={<LinkVerify/>} />
          <Route path="/scheme-details" element={<FillSchemeDetails/>}/>
          <Route path='/home/search-vol' element={<SearchVolunteer/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
