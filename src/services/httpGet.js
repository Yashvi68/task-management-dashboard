const normalHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return {
    "user-id": user?.userId || "507f1f77bcf86cd799439011",
    role: user?.role || "user",
  };
};

export const httpGet = async (url) => {
  try {
    const headers = { ...normalHeader, ...getAuthHeaders() };

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const dataRes = await response.json();

    console.log("==dataRes==", dataRes);

    return {
      success: response.ok,
      statusCode: response.status,
      data: dataRes,
    };
  } catch (error) {
    console.error("==Error==:", error);

    return {
      success: false,
      error: error.message || "Network Error",
    };
  }
};