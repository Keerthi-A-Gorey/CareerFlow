let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

export const getAccessToken = () => {
  if (accessToken) return accessToken;

  const stored = localStorage.getItem("accessToken");
  if (stored) {
    accessToken = stored;
    return stored;
  }

  return null;
};
