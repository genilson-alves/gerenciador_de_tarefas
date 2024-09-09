export const isAuthenticated = () => {
  // Retorna true caso o existe um token de usuário e false caso não exista
  return !!localStorage.getItem("token");
};
