import React from 'react';
import Header from './Header';
import CashierHeader from './CashierHeader';

const HeaderWrapper = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // If user is admin, mechanic, or cashier, use CashierHeader
  if (user && ['admin', 'mechanic', 'cashier'].includes(user.userType)) {
    return <CashierHeader {...props} />;
  }
  
  // Otherwise use regular Header for customers or non-logged-in users
  return <Header {...props} />;
};

export default HeaderWrapper;