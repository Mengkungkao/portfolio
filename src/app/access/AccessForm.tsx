"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Column, PasswordInput, Text } from "@/once-ui/components";

export default function AccessForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(undefined);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.message || "Incorrect password");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirect") || "/";
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <Column fillWidth gap="12" horizontal="center">
        <PasswordInput
          id="site-password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          errorMessage={error}
        />

        <Button                  
          type="submit"
          fillWidth
          disabled={loading || !password.trim()}
          loading={loading}
          
        >
          {loading ? "Checking..." : "Login"}
        </Button>



        <Text align="center" variant="body-default-xs" onBackground="neutral-weak">
          Access is saved on this browser for 7 days.
        </Text>
      </Column>
    </form>
  );
}
