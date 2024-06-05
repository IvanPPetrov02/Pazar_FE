const TokenManager = {
    getAccessToken: () => localStorage.getItem("token"),
    getUserInfo: () => {
        const userInfo = localStorage.getItem("userInfo");
        return userInfo ? JSON.parse(userInfo) : null;
    },
    setAccessToken: (token) => {
        localStorage.setItem("token", token);
    },
    setUserInfo: (userInfo) => {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    clear: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
    }
};

export default TokenManager;
