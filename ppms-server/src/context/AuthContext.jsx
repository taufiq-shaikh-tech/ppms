const login = async ({ email, password, role }) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  setUser(data.user);
};