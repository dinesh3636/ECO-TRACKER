import React from 'react'
import "./Profile.css"
import { useContext } from 'react';
import { UserContext } from "../../../App";

const Profile = () => {
  const { userAuth, userAuth: { profile_img, fullname, username }, setUserAuth } = useContext(UserContext)

  return (
    <div className="profile-container">
      <img src={profile_img} className="profile-image" alt="Profile" />
      <h2>{fullname}</h2>
      <p>@{username}</p>
    </div>
  )
}

export default Profile
