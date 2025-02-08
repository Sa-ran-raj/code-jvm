import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import UserLocationMap from "./components/map";
import Login from "./components/Login";
import { AuthProvider } from "./components/AuthProvider";
import Home from "./components/Home";
import Discussion from "./components/Discussion";
import WomenEmpowermentLoginSignup from "./components/WomenEmpowermentLoginSignup";
import VolunteeringRequest from "./components/VolunteeringRequest";
import VolunteerRequestForm from "./components/Volunteering";
import LinkVerify from "./components/LinkVerify";
import FillSchemeDetails from "./components/FillSchemeDetails";
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WomenEmpowermentLoginSignup/>} />
          <Route path="/home" element={<Home/>}/>
          <Route path="chatbot" element={<Chatbot/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/map" element={<UserLocationMap/>}/>
          <Route path="/home/discussion_forum" element={<Discussion/>}/>
          <Route path="/home/vol-req" element={<VolunteeringRequest/>}/>
          <Route path="/home/vol" element={<VolunteerRequestForm/>}/>
          <Route path="/home/link-verify" element={<LinkVerify/>} />
          <Route path="/scheme-details" element={<FillSchemeDetails/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
