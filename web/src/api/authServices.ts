import API from "./axios";

const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // Or from your AuthContext
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
export const setup2FA = async (): Promise<{ qrcode: string }> => {
  const token = localStorage.getItem("token");
  const res = await API.post(
    "/auth/2fa/enabled",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const verify2FA = async (
  token: string,
  tempToken: string
): Promise<{ token: string }> => {
  const res = await API.post("/auth/2fa/verify", { token, tempToken });
  return res.data;
};
