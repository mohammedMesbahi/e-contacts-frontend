    const apiUrl="http://localhost:9080/E-Contacts";
    const authUrl = `${apiUrl}/api/v1/auth`;
    const login = `${authUrl}/login`;
    const register = `${authUrl}/signup`;
    const logout = `${authUrl}/logout`;
    const isAuthenticated = `${apiUrl}/isAuthenticated`;
    const adminUrl = apiUrl + "/api/v1/admin";
    const usersResource = `${adminUrl}/users`;
    const verifyUser = `${adminUrl}/verify/user`;
    const deleteUser =  `${adminUrl}/user`;
    const unsuspendUser = `${adminUrl}/unsuspend/user`;
    const suspendUser = `${adminUrl}/suspend/user`;
    const disproveUser = `${adminUrl}/unverify/user`;
    const addContact = `${apiUrl}/api/v1/contact`;

export default {
    apiUrl,
    authUrl,
    login,
    register,
    logout,
    isAuthenticated,
    adminUrl,
    usersResource,
    verifyUser,
    deleteUser,
    unsuspendUser,
    suspendUser,
    disproveUser,
    addContact
};