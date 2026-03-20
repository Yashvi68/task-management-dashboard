const normalHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const documentHeader = {
  Accept: "application/json",
};

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return {
    "user-id": user?.userId || "507f1f77bcf86cd799439011",
    role: user?.role || "user",
  };
};

export const httpPut = async (url, payload, isFormData = false) => {
  try {
    const headers = isFormData
      ? { ...documentHeader, ...getAuthHeaders() }
      : { ...normalHeader, ...getAuthHeaders() };

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: isFormData ? payload : JSON.stringify(payload),
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