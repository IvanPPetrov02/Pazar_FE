import React from 'react';

const AuthContext = React.createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {console.log('set');
      },
});

export default AuthContext;