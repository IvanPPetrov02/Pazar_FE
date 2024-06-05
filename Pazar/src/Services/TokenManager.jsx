const TokenManager = {
    getAccessToken: () => localStorage.getItem("token"),
    getClaims: () => {
        const claims = localStorage.getItem("claims");
        return claims ? JSON.parse(claims) : undefined;
    },
    setAccessToken: (token) => {
        localStorage.setItem("token", token);
        // Simplified: not using jwt-decode for now
        localStorage.setItem("claims", JSON.stringify({ token }));
        return { token };
    },
    clear: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("claims");
    }
}

export default TokenManager;
