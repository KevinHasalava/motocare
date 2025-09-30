import React from 'react';
import Header from './Header';
import AdminHeader from './AdminHeader';

const HeaderWrapper = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // If user is admin, mechanic, or cashier, use AdminHeader
  if (user && ['admin', 'mechanic', 'cashier'].includes(user.userType)) {
    return <AdminHeader {...props} />;
  }
  
  // Otherwise use regular Header for customers or non-logged-in users
  return <Header {...props} />;
};

export default HeaderWrapper;