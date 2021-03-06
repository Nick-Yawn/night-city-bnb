import React, { useState, useEffect, useContext } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ModalContext } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './ProfileButton.css' 
import { setSpotToEdit } from '../../store/spotToEdit';

function ProfileDropdown({ user }){
  const dispatch = useDispatch();
  const history = useHistory();
  const { setShowModal } = useContext(ModalContext);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/');
  };

  const redirectToTrips = e => {
    history.push('/trips') 
  }

  const redirectToWishlist = e => {
    history.push('/favorites') 

  }

  const openModal = e => {
    dispatch(setSpotToEdit(null));
    setShowModal(true)
  }

  const redirectToUserSpots = e => {
    history.push(`/my-spots`) 
  }

  const demoUserLogin = e => {
    dispatch(sessionActions.loginDemoUser());
  }

  return (
          <ul className="profile-dropdown">
          { user && (
            <>
              <li className='dropdown-user'> {user?.username} </li>
              {/*<li className='dropdown-clickable'
                onClick={redirectToTrips}> Trips </li>*/} 
              <li className='dropdown-clickable'
                onClick={redirectToWishlist}> Wishlist </li>
              <li className='dropdown-clickable'
                onClick={openModal}> Host Your Home </li>
              {/* only show My Spots if user has spots */}
              {user.Spots?.length > 0 && (
                <li className='dropdown-clickable'
                  onClick={redirectToUserSpots}> My Spots </li>
              )}
              <li className='dropdown-clickable'
                 onClick={logout}> Logout </li>
            </>        
          )}
          { !user && (
            <>
              <li className='dropdown-clickable' 
                onClick={openModal}> Login </li>
              <li className='dropdown-clickable'
                onClick={openModal}> Sign Up </li>
              <li className='dropdown-clickable'
                onClick={demoUserLogin}> Login with Demo User </li>
            </>
          )}
          </ul>
        )
}

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
   
  const openMenu = () => {
    if (!showMenu) setShowMenu(true);
  };
 
  useEffect(() => {
    if (showMenu){
      const closeMenu = () => {
        setShowMenu(false);
      };
      document.addEventListener('click', closeMenu);
      return () => document.removeEventListener("click", closeMenu);
    }
  }, [showMenu]);


  return (
    <>
      <div onClick={openMenu} className="profile-hamburger">
        <i className="fa-solid fa-bars"></i>
        <i className="fa-solid fa-user"></i>
      </div>
      {showMenu && (<ProfileDropdown user={user} />)}
    </>
  );
}

export default ProfileButton;
