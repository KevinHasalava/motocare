import React from 'react';
import Header from './Header';
import AdminHeader from './AdminHeader';
import CashierHeader from './CashierHeader';
import MechanicHeader from './MechanicHeader';

const HeaderWrapper = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Return appropriate header based on user role
  if (user && user.userType) {
    switch (user.userType) {
      case 'admin':
        return <AdminHeader {...props} />;
      case 'mechanic':
        return <MechanicHeader {...props} />;
      case 'cashier':
        return <CashierHeader {...props} />;
      default:
        // For customers or any other roles, use regular Header
        return <Header {...props} />;
    }
  }
  
  // For non-logged-in users, use regular Header
  return <Header {...props} />;
};

export default HeaderWrapper;